<?php



class FClientScriptManager extends TClientScriptManager 
{

	/**
	 * @var array CSS files
	 */
	private $_lastStyleSheetFiles=array();
	
	/**
	 * @param THtmlWriter writer for the rendering purpose
	 */


	public function renderEndScripts($writer)
	{
		if (!$this->getApplication()->Parameters['EndScriptWrapper']) //$this->getApplication()->Parameters['DoNotRenderExtOnReady'] && 
		{
			parent::renderEndScripts($writer);
		}
		else
		{
			$wrapper = ($this->getApplication()->Parameters['EndScriptWrapper']) ? $this->getApplication()->Parameters['EndScriptWrapper'] : '(function() { ';
                        $endScripts = $this->_endScripts;
			array_unshift($endScripts,$wrapper);
			array_push($endScripts,' });');
			$writer->write(TJavaScript::renderScriptBlocks($endScripts));
		}
	}

	/**
	 * Registers a CSS file to be rendered in the page head
	 * @param string a unique key identifying the file
	 * @param string URL to the CSS file
	 * @param string media type of the CSS (such as 'print', 'screen', etc.). Defaults to empty, meaning the CSS applies to all media types.
	 */
	public function registerLastStyleSheetFile($key,$url,$media='')
	{
		if($media==='')
			$this->_lastStyleSheetFiles[$key]=$url;
		else
			$this->_lastStyleSheetFiles[$key]=array($url,$media);

		$params=func_get_args();
		$this->_page->registerCachingAction('Page.ClientScript','registerLastStyleSheetFile',$params);
	}
	
	/**
	 * @param THtmlWriter writer for the rendering purpose
	 */
	public function renderLastStyleSheetFiles($writer)
	{
		$str='';
		foreach($this->_lastStyleSheetFiles as $url)
		{
			if(is_array($url) ) {
                                if (strlen($url[1])>2)
                                    $str.="<link rel=\"stylesheet\" type=\"text/css\" media=\"{$url[1]}\" href=\"".THttpUtility::htmlEncode($url[0])."\" />\n";
			} else {
				$str.="<link rel=\"stylesheet\" type=\"text/css\" href=\"".THttpUtility::htmlEncode($url)."\" />\n";
                        }
		}
                $culture = $this->getApplication()->getGlobalization()->getCulture();
		foreach($this->_lastStyleSheetFiles as $url)
		{
			if(is_array($url) && strlen($url[1])==2 && strcasecmp($culture, $url[1]) === 0 )
                                    $str.="<link rel=\"stylesheet\" type=\"text/css\" hreflang=\"{$url[1]}\" href=\"".THttpUtility::htmlEncode($url[0])."\" />\n";
                        
                }
		$writer->write($str);
	}

}



