<?php

class FFlashBlock extends FStyledTemplateControl
{
	
	private $_SwfFile;
	
	public function onInit($param)
	{
		parent::onInit($param);
		$cs = $this->Page->ClientScript;
		$file = $this->publishFilePath(dirname(__FILE__).DIRECTORY_SEPARATOR.'AC_RunActiveContent.js');
		$cs->registerScriptFile("AC_RunActiveContent",$file);
	}
	
	public function getSwfFile()
	{
		return $this->_SwfFile;
	}

	public function setSwfFile($value)
	{
		$this->_SwfFile = $value;
	}

}
