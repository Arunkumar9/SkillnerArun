<?php


class FExtButton extends TButton implements IPostBackEventHandler, IButtonControl, IDataRenderer {
	


 	public function onPreRender($param)
 	{
 		parent::onPreRender($param);
  		$cs = $this->Page->ClientScript;
		$class = get_class($this);
  		$cs->registerScriptFile("Fresh.".$class,$this->publishAsset($class.".js"));
		$code = $this->getExtCode();
		$cs->registerEndScript(sprintf('%08X', crc32($code)),$code);
		
 	}


	/**
	 * @return string tag name of the button
	 */
	protected function getTagName()
	{
		return 'div';
	}

	/**
	 * Adds attribute name-value pairs to renderer.
	 * This overrides the parent implementation with additional button specific attributes.
	 * @param THtmlWriter the writer used for the rendering purpose
	 */
	protected function addAttributesToRender($writer)
	{
		parent::addAttributesToRender($writer);
		$writer->removeAttribute('value');
		$writer->removeAttribute('type');
		$writer->removeAttribute('name');
		
	}

	protected function getExtCode() {

		$opt = array('text'=>$this->Text,
			'iconCls'=>$this->IconCls, 'buttonID'=>$this->ClientID
		);
		if ($this->inContainer) $opt['containerID'] = $this->getAncestor($this->inContainer)->ClientID;
		$JsOptionString=TJavascript::encode($opt);
		$code="Fresh.FExtButton.init.call(Fresh.FExtButton,{$JsOptionString});";
		return $code;
	}

	public function getAncestor($type) {
		
		$parent = $this->parent;
		$type = strtolower($type);
		while ($parent AND !($parent instanceof $type)) {
			$parent = $parent->parent;
			Prado::trace('FExtControl '.$parent->ID);
		}
		if ($parent === null)
			throw new TConfigurationException('no such ancestor '.$type);
			
		return $parent;
		
	}

	public function setInContainer($value)
	{
		$this->setViewState('InContainer',TPropertyValue::ensureString($value),null);
	}
 	
	public function getInContainer()
	{
		return $this->getViewState('InContainer',null);
	}

	/**
	 * @param string name of field from record
	 */
	public function getIconCls()
	{
		return $this->getViewState('IconCls','');
	}

	/**
	 * @param string name of field from record
	 */
	public function setIconCls($value)
	{
		$this->setViewState('IconCls',$value,'');
	}

}



?>
