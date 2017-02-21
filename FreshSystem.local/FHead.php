<?php
class FHead extends THead
{

	private $_IE8compat=true;

    /**
     * Getter for property IE8compat
     * render compatibility tag for IE8
     * @return boolean
     */
    public function getIE8compat() {

	//$browser = $this->getRequest()->getBrowser();
	//$isIE8 = ($browser['majorver']>7 && $browser['browser']=='MSIE');

	return ($this->_IE8compat);// && $isIE8);
    }

    /**
     * Setter for property IE8compat
     * render compatibility tag for IE8
     * @param $value boolean
     */
    public function setIE8compat($value) {
	$this->_IE8compat = TPropertyValue::ensureBoolean($value);
    }

    public function getIE8compatTag()
    {
	return ($this->getIE8compat())?'<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />':'';
    }

	public function onInit($param)
	{
	    parent::onInit($param);
	    if ($this->getIE8compat())
		$this->Response->appendHeader("X-UA-Compatible: IE=EmulateIE7");
	}
	/**
	 * Renders the head control.
	 * @param THtmlWriter the writer for rendering purpose.
	 */
	public function render($writer)
	{
		$page=$this->getPage();
		$title=$this->getTitle();
		$writer->write("<head>\n<title>".THttpUtility::htmlEncode($title)."</title>\n");//.$this->getIE8compatTag()."\n");
		if(($baseUrl=$this->getBaseUrl())!=='')
			$writer->write('<base href="'.$baseUrl."\" />\n");
		if(($icon=$this->getShortcutIcon())!=='')
			$writer->write('<link rel="shortcut icon" href="'.$icon."\" />\n");

		if(($metaTags=$this->getMetaTags())!==null)
		{
			foreach($metaTags as $metaTag)
			{
				$metaTag->render($writer);
				$writer->writeLine();
			}
		}
		$cs=$page->getClientScript();
		$cs->renderStyleSheetFiles($writer);
		$cs->renderStyleSheets($writer);
		if($page->getClientSupportsJavaScript())
		{
			$cs->renderHeadScriptFiles($writer);
			$cs->renderHeadScripts($writer);
		}
		TControl::render($writer);
		
		$cs->renderLastStyleSheetFiles($writer);
		$writer->write("</head>\n");
	}


}	
?>