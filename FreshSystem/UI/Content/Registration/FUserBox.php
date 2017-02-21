<?php

class FUserBox extends FStyledTemplateControl {
	
	private $_LoginPageId;
	private $_RegisterPageId;
	private $_AccountPageId;
	private $_AfterLogoutPageId;
	
	public function OnPreRender($param)
	{
	 
		 $this->LoginLink->NavigateUrl =$this->Page->getContainer($this->LoginPageId)->Href;
		 $this->RegisterLink->NavigateUrl = $this->Page->getContainer($this->RegisterPageId)->Href;
		 $this->AccountLink->NavigateUrl = $this->Page->getContainer($this->AccountPageId)->Href;
		 if ($this->Application->User->IsGuest || $this->Application->User->Username == 'super')
		 {
		 	$this->LogoutLink->Visible = false;
		 	$this->LoginLink->Visible = true;
			$this->RegisterLink->Visible = true;
			$this->AccountLink->Visible = false;
			$this->LoginName->Visible = false;
		 }
		 else
		 {
		 	$this->LogoutLink->Visible = true;
		 	$this->LoginLink->Visible = false;
			$this->RegisterLink->Visible= false;
			$this->AccountLink->Visible = true;
			$this->LoginName->Visible = true;
		 }
		
	}

	/**
	 * Logs out user
	 * 
	 * @param mixed event sender (odesílací objekt)
	 * @param mixed event parameter
	 */
	public function logoutButtonClicked($sender,$param)
	{
		$this->Application->getModule('auth')->logout();
    	if ($this->AfterLogoutPageId)
		{	
			$url=$this->Page->getContainer($this->AfterLogoutPageId)->Href;
			$this->Response->redirect($url);
		}
	}
	
	public function getAfterLogoutPageId()
	{
		return $this->_AfterLogoutPageId;
	}

	public function setAfterLogoutPageId($value)
	{
		$this->_AfterLogoutPageId = $value;
	}

	public function getAccountPageId()
	{
		return $this->_AccountPageId;
	}

	public function setAccountPageId($value)
	{
		$this->_AccountPageId = $value;
	}
	
	public function getRegisterPageId()
	{
		return $this->_RegisterPageId;
	}

	public function setRegisterPageId($value)
	{
		$this->_RegisterPageId = $value;
	}
	
	public function getLoginPageId()
	{
		return $this->_LoginPageId;
	}

	public function setLoginPageId($value)
	{
		$this->_LoginPageId = $value;
	}


}
