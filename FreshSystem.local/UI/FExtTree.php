<?php
/* FExtTree.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 8.10.2006
 */
 class FExtTree extends FExtControl {
 	
 	public function onPreRender($param)
 	{
  		$cs = $this->Page->ClientScript;
		$cs->registerScriptFile("Fresh.FRecordDialog",$this->publishAsset("FRecordDialog.js"));
 		parent::onPreRender($param);
		
 	}
	
	
 }
/*
 class FExtTree extends TTemplateControl
 {
 	
 	public function onInit($param)
 	{
 		parent::onInit($param);
  		$this->ensureChildControls();
  		$cs = $this->Page->ClientScript;
  		$cs->registerScriptFile('FExtTree.js',$this->publishAsset("FExtTree.js"));
  		$cs->registerScriptFile('FRecordDialog.js',$this->publishAsset("FRecordDialog.js"));
  		//$cs->registerStyleSheetFile("Fresh:".__CLASS__,$this->publishAsset("FExtAdminLayout.css"));
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
		$this->setViewState('RootName',TPropertyValue::ensureString($value),'Navigation');
	}
 	
	public function getRootName()
	{
		return $this->getViewState('RootName','Navigation');
	}

	public function getDataScript($value)
	{
		return 'index.php';
	}
 	
	public function setBaseParams($value)
	{
		$this->setViewState('BaseParams',TPropertyValue::ensureString($value),"{json:'treenodes'}");
	}
 	
	public function getBaseParams()
	{
		return $this->getViewState('BaseParams','{json:treenodes}');
	}
	
	public function setStoreParams($value)
	{
		$this->setViewState('StoreParams',TPropertyValue::ensureString($value),'storeContainer');
	}
 	
	public function getStoreParams()
	{
		return $this->getViewState('StoreParams','storeContainer');
	}
 }

*/
?>
