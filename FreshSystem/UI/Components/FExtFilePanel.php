<?php
/* FExtFilePanel.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 8.10.2006
 */
 
 class FExtFilePanel extends FExtControl {
 	
	protected function getExtCode() {

		if ($this->inContainer)
			$this->setJsOption('containerID',$this->getAncestor($this->inContainer)->getClientID());
		return parent::getExtCode();
		
	}	
	
 }
 	
/*
 	public function onInit($param)
 	{
 		parent::onInit($param);
  		$this->ensureChildControls();
  		$cs = $this->Page->ClientScript;
  		$cs->registerScriptFile('FExtFilePanel.js',$this->publishAsset("FExtFilePanel.js"));
 	}
 	
 	
 	
  	
	public function addParsedObject($object)
	{
		$this->ensureChildControls(); 
		if($this->ChildControlsCreated)
			$this->Container->Controls[]=$object;
		else
			parent::addParsedObject($object);
	}
	 	
 	public function getContainer() {
		$this->ensureChildControls();
		return $this->getRegisteredObject('Container');
 	}
 	
	public function setRootName($value)
	{
		$this->setViewState('RootName',TPropertyValue::ensureString($value),'Files');
	}
 	
	public function getRootName()
	{
		return $this->getViewState('RootName','Files');
	}

	public function getDataScript($value)
	{
		return $this->getViewState('DataScript','index.php?json=fileProvider');
	}
 	
	public function setDataScript($value)
	{
		$this->setViewState('DataScript',TPropertyValue::ensureString($value),'index.php?json=fileProvider');
	}

 }
*/

?>
