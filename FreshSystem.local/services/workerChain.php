<?php
/* wokerChain.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 13.9.2006
 */
 
 
 class workerChain extends MFbase
{
	const AVAIL_WORKERS = 'initial|inOut|project|partner|reference|task';
	protected $_msg;
	protected $workers;
	protected $_records;
	
	public function __construct($msg,$workers='')
	{
		$this->_msg = $msg;	
		if ($workers)
			$this->addWorker($workers);
	}
	
	public function addWorker($workers)
	{
	  if ($workers)
	  {	
		foreach(FUI::arraySplit($workers) as $worker)
		{
			if (!isset($this->workers[$worker]))
			{
				$worker = $worker.'Worker';
				$this->workers[$worker] = new $worker($this);	
			}
		}
	  }	
	}
	
	public function factory($class,$addNew = false)
	{
		
		if (!isset($this->_records[$class]))
		{
			FUI::logNotice($this,'creating first instance of %s',$class);
			$this->_records[$class] = array(new $class);
		}
		elseif ($addNew)
		{
			FUI::logNotice($this,'creating new instance of %s',$class);
			array_unshift($this->_records[$class],new $class);
		}
		FUI::logNotice($this,'retrieving instance of %s',$class);
		return $this->_records[$class][0];
	}
	
	public function getRecord($class)
	{
		return $this->factory($class); 
	}

	public function getRecordNew($class)
	{
		return $this->factory($class,true); 
	}

	public function doWork()
	{
		foreach($this->workers as $worker)
		{
			$res = $worker->work();
			FUI::logNotice($this,'invoked %s',get_class($worker));
			if ($res < FUI::IS_OK)
				return $res;
		}
		$this->saveRecords();
		return FUI::IS_OK; 
	}
	
	
	public function saveRecords()
	{
		foreach ($this->_records as $rec)
		{
			foreach ($rec as $record) 
			{
				FUI::logNotice($this,'saving %s',get_class($record));
				FUI::logNotice($this,'asigned project %s',get_class($record->project_id) );
				FUI::logNotice($this,'asigned project %s',$record->project_id );
			}
		}
		echo "saving all";
		FDb::getSession()->flush();
	}
	
	public function getMsg() { return $this->_msg; }
}


interface worker 
{
	public function work();
}

abstract class basicWorker extends MFbase implements worker
{
	public $name;
	protected $_owner;

	public function __construct($owner, $name=null)
	{
		$this->name = ($name)?$name:get_class($this);
		$this->_owner = $owner;
	}

	public function getOwner() { return $this->_owner; }
	public function getMsg() { return $this->_owner->getMsg(); }
	
	public function work() {}
	
	public function testFlag($flag)
	{
		return FUI::in_array_recursive($flag,$this->msg->flags);
	}

	public function __call($name,$a)
	{
		return call_user_func_array(array($this->owner,$name),$a);
	}
	
}


class projectWorker extends basicWorker
{
	public function work()
	{
		$diary = $this->getRecord(FUI::DIARY_RECORD);
		if ($this->testFlag(FUI::HAVE_PROJECT))
			$diary->project_id = $this->msg->headers[FUI::PROJECT];
		
		elseif ($this->testFlag(FUI::HAVE_PROJECT_REFERENCE))
			$diary->project_id = $this->msg->headers[FUI::PROJECT_REFERENCE];
	
		elseif ($this->testFlag(FUI::HAVE_PROJECT_PHRASE))
			$diary->project_id = $this->msg->headers[FUI::PROJECT_PHRASE];
	
		return FUI::IS_OK;
	}
}

class referenceWorker extends basicWorker
{
	public function work()
	{
		$diary = $this->getRecord(FUI::DIARY_RECORD);

		if ($this->testFlag(FUI::HAVE_REFERENCES))
			$diary->reference = $this->msg->headers[FUI::REFERENCES];
		
		if ($this->testFlag(FUI::HAVE_IN_REPLY_TO_REFERENCE))
		{
			$diary->in_reply_to_id = $this->msg->headers[FUI::IN_REPLY_TO_REFERENCE];
			if (strpos($diary->reference,$diary->in_reply_to_id) !== false)
				$diary->reference = trim($diary->in_reply_to_id.','.$diary->reference,',');
		}

		return FUI::IS_OK;
	}
}

class partnerWorker extends basicWorker
{
	public function work()
	{
		
		$isMailIn = $this->testFlag(FUI::IS_MAIL_IN);
		$isMailOut = $this->testFlag(FUI::IS_MAIL_OUT);
		
		if ($this->testFlag(FUI::HAVE_PARTNER_FROM))
		{
			$from = $this->msg->headers['From'][0][FUI::PARTNER];
			//$person = Prado::getData()->getCurrentConnection()->getTable(FUI::PERSON_RECORD)->find($from);
			$users = Prado::getData()->getCurrentConnection()->getTable(FUI::USER_RECORD)->findBySql('person_id = ?',array($from));
			if ($isMailIn) {
				$this->getRecord(FUI::DIARY_RECORD)->partner_id = $from;
			} elseif ($isMailOut) {
				//$this->getRecord(FUI::DIARY_RECORD)->employee_id = $from;
			}
		}

		if ($this->testFlag(FUI::HAVE_PARTNER_TO))
		{
			$to = $this->msg->headers['To'][0][FUI::PARTNER];
			//$person = Prado::getData()->getCurrentConnection()->getTable(FUI::PERSON_RECORD)->find($to);
			$users = Prado::getData()->getCurrentConnection()->getTable(FUI::USER_RECORD)->findBySql('person_id = ?',array($to));
			if ($isMailIn) {
				//$user = Prado::getData()->getTable(FUI::USER_RECORD)->findBySql('person_id');
			} elseif ($isMailOut)
				$this->getRecord(FUI::DIARY_RECORD)->partner_id = $to;
		}

		if (is_object($users) && count($users)>0 ) { //count($user)>0 
			FUI::logNotice($this,'person '.$to.', '.$users[0]->uid);
			$created_by = $users[0]->username;
			$this->getRecord(FUI::DIARY_RECORD)->created_by = $created_by;
		}

		return FUI::IS_OK;
	}
}

class inOutWorker extends basicWorker
{
	public function work()
	{
		$isMailIn = $this->testFlag(FUI::IS_MAIL_IN);
		$isMailOut = $this->testFlag(FUI::IS_MAIL_OUT);
		
		if ($isMailIn)
			$this->getRecord(FUI::DIARY_RECORD)->type = FUI::getIniValue('values.mail_in');
		elseif ($isMailOut)
			$this->getRecord(FUI::DIARY_RECORD)->type = FUI::getIniValue('values.mail_out');
		else
			$this->getRecord(FUI::DIARY_RECORD)->type = FUI::getIniValue('values.mail_unknown');
		
		return FUI::IS_OK;
	}
}

class initialWorker extends basicWorker
{
	public function work()
	{
		$diary = $this->getRecord(FUI::DIARY_RECORD);
		$diary->name = $this->msg->headers['Subject'];
		$diary->message_id = $this->msg->headers['Message-ID'][0];
		
		$diary->orig_to = FU::CollectionToList($this->msg->headers['To'],'address');
		$diary->orig_from = $this->msg->headers['From'][0]['address'];
		$diary->orig_date = $this->msg->headers['Date'];
		$diary->orig_in_reply_to = $this->msg->headers['In-Reply-To'][0];
		$diary->orig_cc = FU::CollectionToList($this->msg->headers['Cc'],'address');
		$diary->orig_bcc = FU::CollectionToList($this->msg->headers['Bcc'],'address');
		
		$diary->date = date('Y-m-d H:i:s',strtotime($this->msg->headers['Date']));

		$i=0; 
		$attachments = $this->msg->attachments;
		if (is_array($attachments))	foreach ($attachments as $k=>$v)
		{
			$diary->Attachment[$i]->name = $v;
			$diary->Attachment[$i]->attach_dir = $this->msg->attachDir;
			$i++;
		}
		
		$i=0; 
		$inlines = $this->msg->inlines;
		if (is_array($inlines))	foreach ($inlines as $k=>$v)
		{
			$diary->Inline[$i]->name = $v;
			$diary->Inline[$i]->cid = $k;
			$diary->Inline[$i]->attach_dir = $this->msg->attachDir;
			$i++;
		}
		
		$i=0; 
		$texts = $this->msg->texts;
		if (is_array($texts))	foreach ($texts as $k=>$v)
		{
			$diary->Mtext[$i]->name = 'part'.$i;
			$diary->Mtext[$i]->content = $v[0];
			$diary->Mtext[$i]->cid = $v[1];
			
			$i++;
		}

		$diary->Orig_headers->name = 'headers';
		$diary->Orig_headers->content = serialize($this->msg->headers);
		$diary->Orig_headers->cid = 'headers/array';

		$diary->delegated = FUI::DELEGATED_MANUAL;
		
		return FUI::IS_OK;
	}

}
class taskWorker extends basicWorker
{
	public function work()
	{
		if ($this->testFlag(FUI::HAVE_PROJECT) || $this->testFlag(FUI::HAVE_PROJECT_REFERENCE))
		{
			$task = $this->getRecordNew(FUI::TASK_RECORD);
			$diary = $this->getRecord(FUI::DIARY_RECORD);

			//assign task
			$task->name = $diary->name;
			$task->project_id = $diary->project_id;
			$task->partner_id = $diary->partner_id;
			$task->created = date('Y-m-d H:i:s');
			$task->created_by = FUI::getIniValue('values.personality_name');
			$task->deadline = date('Y-m-d 00:00:00',strtotime('+1 day'));


//			$diary->loadReference('Project');
			$project =	FDb::getTable(FUI::PROJECT_RECORD)->find($diary->project_id);

			if ($project && $responsible = $project->responsible)
				$task->responsible = $responsible;
			else
				$task->responsible = FUI::getIniValue('defaults.responsible');
			
			
				
			$diary->delegated = FUI::DELEGATED_AUTO; 
			
			//$task->project_id = $diary->project_id;
			$diary->Task->add($task);

FUI::logNotice($this,$project->uid.' asigned project %s',$this->getRecord(FUI::DIARY_RECORD)->project_id );
			
		}
		
		return FUI::IS_OK;
	}
}

?>
