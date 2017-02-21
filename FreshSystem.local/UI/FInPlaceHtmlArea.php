<?php
/* FInPlaceHtmlArea.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on May 29, 2007
 */

class FInPlaceHtmlArea extends TInPlaceTextBox
{
	
	public function onInit($param)
	{
		parent::onInit($param);
		$cs = $this->Page->ClientScript;
		$url=$this->Application->AssetManager->publishFilePath(dirname(__FILE__).'/FInPlaceHtmlArea.js');
		$cs->registerScriptFile("FInPlaceHtmlArea",$url);
		
	}

	protected function getClientClassName()
	{
		return 'Prado.WebUI.FInPlaceHtmlArea';
	}

	public function getDtbUid()
	{
		return $this->getViewState('DtbUid','');
	}
	
	public function setDtbUid($value)
	{
		return $this->setViewState('DtbUid',$value,'');
	}
	
	
}
?>
