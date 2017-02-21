<?php
/* FJsonResponse.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 17.10.2006
 */

Prado::using('System.Web.Services.TJsonService');
class FJsonResponse extends TJsonResponse
{
	private $_de_quote=null;
	private $_auth_level=null;

	public function getJsonContent()
	{
		return array(Prado::getApplication()->Request['top'],Prado::getApplication()->Request['left']);
	}
	
	public function getUser()
	{
		return Prado::getApplication()->getUser();
	}
	
	public function getIsAuthorized()
	{

		if ($this->AuthLevel === null)
			return true;
			
		Prado::getApplication()->Session->Open();
		$session = Prado::getApplication()->Session;
		if (!$this->User->IsGuest && $this->User->Level > $this->AuthLevel)
			return true;
		else
			return false;
	}
	
	public function getIni($value)
	{
		return FU::Ini(get_class($this).'.'.$value);
	}

	/**
	 * @return array	keys which values will be "de quoted" 
	 */
	public function getDeQuote()
	{
		return $this->_de_quote;
	}


	/**
	 * @param string keys which values will be "de quoted" 
	 */
	public function setDeQuote($value)
	{
		$this->_de_quote=explode(',',$value);
	}
	
	/**
	 * @return int	level to get authorized for this service 
	 */
	public function getAuthLevel()
	{
		return $this->_auth_level;
	}


	/**
	 * @param int level to get authorized for this service 
	 */
	public function setAuthLevel($value)
	{
		$this->_auth_level=$value;
	}
	
	public function setServiceContext($value=null)
	{
		if ($value === null)
			$value = $this;
		Prado::getApplication()->getService()->setContext($value);
	}
	
	
}
?>