<?php



class FClientScriptManager extends TClientScriptManager 
{

	/**
	 * @param THtmlWriter writer for the rendering purpose
	 
	public function renderEndScripts($writer)
	{
		
		$endScripts = $this->_endScripts;
		array_unshift($endScripts,'Ext.onReady(function() { ');
		array_push($endScripts,' });');
		$writer->write(TJavaScript::renderScriptBlocks($endScripts));
	}

*/
}



