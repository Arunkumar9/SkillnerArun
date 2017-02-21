<?php
/*
 * Created on 20.5.2006
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 * 
 * This PageService loads FXMLTemplateManager that can load Control Templates from one larger XML.
 */
 class FPageService extends TPageService
{
	/**
	 * @var FXMLTemplateManager template manager
	 */
	private $_templateManager=null;

	/**
	 * @return FXMLTemplateManager template manager
	 */
	public function getTemplateManager()
	{
		if(!$this->_templateManager)
		{
			$this->_templateManager=new FXMLTemplateManager;
			$this->_templateManager->init(null);
		}
		return $this->_templateManager;
	}

	/**
	 * @param TTemplateManager template manager
	 */
	public function setTemplateManager(FXMLTemplateManager $value)
	{
		$this->_templateManager=$value;
	}
	
}
