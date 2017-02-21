<?php

class FShowContentEdit extends TPanel
{
	protected $_content=null;
	

	public function onInit($param)
	{
		parent::onInit($param);
		$finder = ContainerRecord::finder();
		$content = $finder->findByPk($this->DtbUid);
		//$typeData = FU::readValues($content->type->data);
		$component = $content->type->name;
		if (class_exists($component,false)) 
			$c = Prado::createComponent($component);
		else
			$c = Prado::createComponent('FBaseComponentEdit');
			
		$c->ID = 'EditComponent';
		$c->DtbUid = $this->DtbUid;
		$c->Text = $content->data;
		$this->getControls()->add($c);
		$this->registerObject($c->ID,$c);
		$this->_content = $content;
		$this->onDataBinding = array($this,'DataBinding');
	}

	//public function
	public function DataBinding($sender,$param)
	{
		//parent::onLoad($param);
		$this->EditComponent->DtbUid = $this->DtbUid;
		$this->EditComponent->DtbUid = $this->_content->data;
	}

	public function getDtbUid()
	{
		return $this->getViewState('DtbUid','');
	}
		
	public function setDtbUid($value)
	{
		$this->setViewState('DtbUid',$value,'');
	}

}



?>