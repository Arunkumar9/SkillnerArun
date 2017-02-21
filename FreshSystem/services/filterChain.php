<?php
/* filterChain.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 13.9.2006
 */
 
 
class filterChain extends MFbase
{
	const AVAIL_FILTERS = 'spam|duplicate|inOut|partner|project|referenceProject|setReferences|inReplyTo';
	protected $_msg;
	protected $filters;
	
	public function __construct($msg,$filters='')
	{
		$this->_msg = $msg;	
		if ($filters)
			$this->addFilter($filters);
	}
	
	public function addFilter($filters)
	{
	  if ($filters)
	  {	
		foreach(FUI::arraySplit($filters) as $filter)
		{
			if (!isset($this->filters[$filter]))
			{
				$filter = $filter.'Filter';
				$this->filters[$filter] = new $filter($this);	
			}
		}
	  }	
	}
	
	public function doFilter()
	{
		foreach($this->filters as $filter)
		{
			$res = $filter->filter();
			if ($res < FUI::IS_OK)
				return $res;
		}
		return FUI::IS_OK; 
	}
	
	public function getMsg() {	return $this->_msg;	}
}

interface filter 
{
	public function filter();
}

abstract class basicFilter extends MFbase implements filter
{
	public $fields;
	public $values;
	public $name;
	public $owner;
	
	public function __construct($owner, $name=null)
	{
		$this->name = ($name)?$name:get_class($this);
		$this->owner = $owner;
		
	}
	
	public function getMsg() { return $this->owner->msg; }
	
	public function filter() {}
	
}

class spamFilter extends basicFilter
{
	public function filter()
	{
		$spamThemes = FUI::getIniValue('filters.spam_themes');
		$projectRegexp = FUI::getIniValue('filters.project_regexp');
		$internalBounce = FUI::getIniValue('filters.internal_bounce');

		if ( preg_match($spamThemes,$this->msg->subject.$this->msg->alladdr))
		{
		   if (preg_match($internalBounce,$his->msg->from[0]['address']))
		   { 
				$this->msg->flags[$this->name] = FUI::IS_INTERNAL;
		   		return FUI::IS_INTERNAL;
		   }
		   elseif (!preg_match($projectRegexp,$this->msg->subject))
		   {
				$this->msg->flags[$this->name] = FUI::IS_SPAM;
		   		return FUI::IS_SPAM;
		   }
		}
		return FUI::IS_OK;  
	}
}


class projectFilter extends basicFilter
{
	public function filter()
	{
		$projectRegexp = FUI::getIniValue('filters.project_regexp');

		if (preg_match($projectRegexp,$this->msg->subject,$m))
		{
			if ($this->msg->headers[FUI::PROJECT] = FDb::validateProjectId($m[1].$m[2]))
				$this->msg->flags[$this->name] = FUI::HAVE_PROJECT;
			
			FUI::logNotice($this,'found project %s',$m[1].$m[2].' '.$this->msg->headers[FUI::PROJECT] );
		}
		return FUI::IS_OK;
		
	}
}

class referenceProjectFilter extends basicFilter
{
	public function filter()
	{
		$list = array_merge($this->msg->headers['In-Reply-To'],
						    array_reverse($this->msg->headers['References'])
  						    );
		if ($list && $project = FDb::findReferenceProject($list))
		{
			$this->msg->flags[$this->name] = FUI::HAVE_PROJECT_REFERENCE;
			$this->msg->headers[FUI::PROJECT_REFERENCE] = $project;
			return FUI::HAVE_PROJECT_REFERENCE;			
		}
		return FUI::IS_OK;
		
	}
}

class setReferencesFilter extends basicFilter
{
	public function filter()
	{
 		$list = array_reverse($this->msg->headers['References']);
		if (count($list)>0)
		{
			$coll = FDb::findReferenceIds($list);
			if (count($coll)>0)
			{
				$references = FU::CollectionToList($coll,'uid');
				$this->msg->flags[$this->name] = FUI::HAVE_REFERENCES;
				$this->msg->headers[FUI::REFERENCES] = $references;
				return FUI::HAVE_REFERENCES;			
			}
		}
		return FUI::IS_OK;
		
	}
}

class inReplyToFilter extends basicFilter
{
	public function filter()
	{
 		$list = $this->msg->headers['In-Reply-To'];
		if (count($list)>0)
		{
			$coll = FDb::findReferenceIds($list);
			if (count($coll)>0)
			{
				$reference = FU::CollectionToList($coll,'uid');
				$this->msg->flags[$this->name] = FUI::HAVE_IN_REPLY_TO_REFERENCE;
				$this->msg->headers[FUI::IN_REPLY_TO_REFERENCE] = $reference;
				return FUI::HAVE_IN_REPLY_TO_REFERENCE;			
			}
		}
		return FUI::IS_OK;
		
	}
}

class inOutFilter extends basicFilter
{
	public function filter()
	{
		$mysite = FUI::getIniValue('filters.my_site');
		$in = FUI::getIniValue('values.mail_in');
		$out = FUI::getIniValue('values.mail_out');
		$cc = FUI::getIniValue('filters.cc_flag');
		
		FUI::logNotice($this,$mysite." / ".$this->msg->from[0]['address']);
		FUI::logNotice($this,$cc." / ".'|'.$this->msg->cc[0]['address'].'|');
		
	    if (preg_match($mysite,$this->msg->from[0]['address']) && 
	    		(!$cc OR preg_match($cc,$this->msg->cc[0]['address'])
	    		 )
	       )
		{
		//&& 
	    	//
			FUI::logNotice($this,'OZ');
			$this->msg->flags[$this->name] = FUI::IS_MAIL_OUT;
			$this->msg->headers[FUI::IN_OUT] = $out;
			return FUI::IS_MAIL_OUT;			
		} 
		else
		{
			FUI::logNotice($this,'PZ');
			$this->msg->flags[$this->name] = FUI::IS_MAIL_IN;
			$this->msg->headers[FUI::IN_OUT] = $in;
			return FUI::IS_MAIL_IN;
		}			
		
	}
}

class duplicateFilter extends basicFilter
{
	public function filter()
	{

		$msgId = $this->msg->headers['Message-ID'][0];		
		
	    if ($id = FDb::findMessageIdExists($msgId))
		{
			$this->msg->flags[$this->name] = FUI::IS_DUPLICATE;
			$this->msg->headers[FUI::DUPLICATE] = $id;
			return FUI::IS_DUPLICATE;			
		} 
		else
		{
			return FUI::IS_OK;
		}			
		
	}
}


class partnerFilter extends basicFilter
{
	public function filter()
	{
		foreach ($this->msg->headers['To'] as $k => $v)
		{
			if ($this->msg->headers['To'][$k][FUI::PARTNER] = FDb::findPartnerByEmail($v['address']))
				$this->msg->flags[$this->name][] = FUI::HAVE_PARTNER_TO;
		}
		$from = $this->msg->headers['From'][0];
		if ($this->msg->headers['From'][0][FUI::PARTNER] = FDb::findPartnerByEmail($from['address']))
			$this->msg->flags[$this->name][] = FUI::HAVE_PARTNER_FROM;

		return FUI::IS_OK;
	}
}
 
 
?>
