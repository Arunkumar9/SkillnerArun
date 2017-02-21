<?php
class FContentMeta extends TTemplateControl implements ITranslatableWidget 
{
	private $_description;
	private $_title;
	private $_keywords;
	private $_gw;
	
	
	public function getGw()
	{
		return $this->_gw;
	}
	
	public function setGw($value)
	{
		$this->_gw = $value;
	}

	public function getDescription()
	{
		return $this->_description;
	}
	
	public function setDescription($value)
	{
		$this->_description = $value;
	}
	
	public function getKeywords()
	{
		return $this->_keywords;
	}
	
	public function setKeywords($value)
	{
		$this->_keywords = $value;
	}
	
	public function getTitle()
	{
		if (!$this->_title && ($h = $this->getHeading()))
		{
			$lang = ucfirst($this->gw->getLang());
			$dl = ($lang) ? 'DataLang'.$lang : 'Data';
			//$hgw = new FWidgetGateway($h);
			$this->_title = $h->$dl;//$hgw->Data['value'];
		}
		return $this->_title;
	}
	
	public function setTitle($value)
	{
		$this->_title = $value;
	}
	
	public function onLoad($writer)
	{
		if ($this->Page->Head)
		{
			$this->createMetaTag('keywords', $this->Keywords);
			$this->createMetaTag('description', $this->Description);
			$this->Page->Head->Title = $this->Title.' | '.$this->Application->Parameters['siteTitle'];
		}
	}

	protected function createMetaTag($name,$content)
	{
		$meta = Prado::createComponent('TMetaTag');
		$meta->Content = $content;
		$meta->Name = $name;
		//$meta->Language = $this->Application->Globalization->Culture;
		$this->Page->Head->MetaTags->add($meta);
	}
	
	protected function getHeading()
	{
		$gw = $this->gw;
		$parent_id = $gw->getRecord()->parent_id;
		$crit = new TActiveRecordCriteria;
		$crit->Condition = 'parent_id = :parent AND type_id like "heading%"';
		$crit->Parameters[':parent'] = $parent_id;
		$crit->OrdersBy['ordering']='ASC';
		return ContentRecord::finder()->find($crit);
	}

}
