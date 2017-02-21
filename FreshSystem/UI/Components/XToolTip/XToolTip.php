<?php


class XToolTip extends TControl  
{
	private static $LOADED  = false;
	private static $_ASSETS = false;
	
	
	public function GetOrientation()
	{
		return $this->getViewState('Orientation','top.middle');
	}
 
	public function SetOrientation($value)
	{
		$this->setViewState('Orientation',$value);
	}
	
	public function GetText()
	{
		return $this->getViewState('Text', '');
	}

	public function SetText($value)
	{
		return $this->setViewState('Text', $value, '');
	}
	
	public function getTarget()
	{
		return $this->getViewState('Target');
	}

	public function setTarget($value)
	{
		return $this->setViewState('Target', $value);
	}
			
	public function render( $writer )
	{
		parent::render($writer);
		$sm = $this->page->clientScript;
		$text = TJavaScript::encode($this->text); 
		$sm->registerEndScript($this->target, "new XToolTip('" . $this->target. "'," . $text . ",'" . $this->orientation .  "');");
	}
	
	public function createChildControls() 
	{
		if(self::$_ASSETS == false)
		{	
			self::$_ASSETS == true;
			$this->publishAsset('assets\1.gif');
			$this->publishAsset('assets\2.gif');
			$this->publishAsset('assets\3.gif');
			$this->publishAsset('assets\4.gif');
			$this->publishAsset('assets\5.gif');
			$this->publishAsset('assets\6.gif');
			$this->publishAsset('assets\7.gif');			
			$this->publishAsset('assets\8.gif');						
			$xmessage = $this->publishAsset('assets\XMessage.z.js');
			$xtooltip = $this->publishAsset('assets\XToolTip.z.js');						
			
			
			$sm = $this->page->clientScript;
			$sm->registerPradoScript('prado');
			$sm->registerScriptFile('XMessagejs',$xmessage);
			$sm->registerScriptFile('XToolTipjs',$xtooltip);
					
			$url = dirname($xmessage);
			$sm->registerEndScript("XToolTip","XMessage.SetImagePath('" . $url . "/');");
		}
	}
}
?>