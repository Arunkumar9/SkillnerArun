<?php
class FClientEndScript extends TClientScript 
{
	
	/**
	 * Renders the body content as javascript block.
	 * Overrides parent implementation, parent renderChildren method is called during
	 * {@link registerCustomScript}.
	 * @param THtmlWriter the renderer
	 */
	public function render($writer)
	{
		$this->renderCustomScriptFile($writer);
		$cs = $this->getPage()->getClientScript();
		if($this->getHasControls())
		{
			$w = new THtmlWriter(new TTextWriter);
			$this->renderChildren($w);
			$code = $w->writer->flush();
			$cs->registerEndScript(sprintf('%08X', crc32($code)),$code);
		}
	}

	/**
	 * Calls the client script manager to add each of the requested client
	 * script libraries.
	 * @param mixed event parameter
	 */
	public function onPreRender($param)
	{
		parent::onPreRender($param);
	}
	
}
