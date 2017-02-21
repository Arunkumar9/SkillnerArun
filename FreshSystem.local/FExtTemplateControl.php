<?php


class FExtTemplateControl extends TTemplateControl {
   	
	protected $_JsOptions = null;


 	public function onPreRender($param)
 	{
 		parent::onPreRender($param);
  		$cs = $this->Page->ClientScript;
		$class = get_class($this);
		if (is_file(dirname($this->getFileName()).'/'.$class.".css"))
	  		$cs->registerStyleSheetFile("Fresh.".$class,$this->publishAsset($class.".css"));
		if (is_file(dirname($this->getFileName()).'/'.$class.".js")) {
	  		$cs->registerScriptFile("Fresh.".$class,$this->publishAsset($class.".js"));
			$code = $this->getExtCode();
			$cs->registerEndScript(sprintf('%08X', crc32($code)),$code);
		}
		
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

	protected function getFileName() {
		$class=new ReflectionClass($this);
		return $class->getFileName();
	}
	
	protected function getExtCode() {

		$this->setJsOption('panelID',$this->getContainer()->getClientID());
		$JsOptionString=TJavascript::encode($this->getJsOptions()->toArray());
//		$JsOptionString=json_encode($this->getJsOptions()->toArray());
		$jsclass = $this->ClientClassName;
		$code="{$jsclass}.init.call({$jsclass},{$JsOptionString});";
		return $code;
	}

	
	/**
	 * Gets the name of the javascript class responsible for performing postback for this control.
	 * This method overrides the parent implementation.
	 * @return string the javascript class name
	 */
	protected function getClientClassName()
	{
		return 'Fresh.'.get_class($this);
	}

	/**
	 * Sets a named JsOptions with a value. JsOptions are used to store and retrive
	 * named values for the base active controls.
	 * @param string JsOption name.
	 * @param mixed new value.
	 * @param mixed default value.
	 * @return mixed JsOptions value.
	 */
	protected function setJsOption($name,$value,$default=null)
	{
		$value = is_null($value) ? $default : $value;
		if(!is_null($value))
			$this->getJsOptions()->add($name,$value);
	}

	/**
	 * Gets an JsOption named value. JsOptions are used to store and retrive
	 * named values for the base active controls.
	 * @param string JsOption name.
	 * @param mixed default value.
	 * @return mixed JsOptions value.
	 */
	protected function getJsOption($name,$default=null)
	{
		$item = $this->_JsOptions->itemAt($name);
		return is_null($item) ? $default : $item;
	}

	/**
	 * @return TMap active control JsOptions
	 */
	protected function getJsOptions()
	{
		if ($this->_JsOptions === null) {
			$this->_JsOptions = new TAttributeCollection;
			$this->_JsOptions->setCaseSensitive(true);
		}
		return $this->_JsOptions;
	}

	
	
}


?>
