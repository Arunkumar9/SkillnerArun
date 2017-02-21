<?php
/* FExtTree.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 8.10.2006
 */
 
 class FExtContentPanel extends TTemplateControl
 {
 	
 	public function onInit($param)
 	{
 		parent::onInit($param);
  		$this->ensureChildControls();
		//list($cc,) = $this->findControlsByID('CallbackControl1');
		//$this->getRegisteredObject('CallbackControl1')->setSubProperty('ActiveControl.CallbackParameter',"{obj: '".$this->ObjectToActivate."'}");
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
 	
	public function getDataScript($value)
	{
		return 'index.php';
	}
 	
	
	
 }

?>
