<?php

class FClientCssLoader extends TClientScriptLoader
{
	/**
	 * @return string tag name of the script element
	 */
	protected function getTagName()
	{
		return 'link';
	}

	/**
	 * Adds attribute name-value pairs to renderer.
	 * This overrides the parent implementation with additional button specific attributes.
	 * @param THtmlWriter the writer used for the rendering purpose
	 */
	protected function addAttributesToRender($writer)
	{
		parent::addAttributesToRender($writer);
		$writer->removeAttribute('type');
		$writer->removeAttribute('src');
		$writer->addAttribute('href',$this->getClientScriptUrl());
		$writer->addAttribute('rel','stylesheet');
		$writer->addAttribute('type','text/css');
	}
}	
