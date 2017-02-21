<?php

class FUserLoginForm extends FStyledTemplateControl 
{
	private $_AfterLogoutPageId;
	private $_AfterLoginPageId;
	public function onInit($param)
	{
		FBasePage::onInit($param);
		$this->attachEventHandler('OnLogin',array($this,'OnLogin'));
		$this->attachEventHandler('OnLogout',array($this,'OnLogout'));
	}
	public function onLoad($param)
	{
		if (!$this->Application->User->IsGuest && $this->Application->User->Username != 'super')
			$this->View->ActiveViewIndex = 2;
	}

	public function OnLogin($sender,$param)
	{
		if ($this->Page->IsValid)
			$this->View->ActiveViewIndex = 1;
	}

	public function OnLogout($sender,$param)
	{
		if ($this->Page->IsValid)
			$this->View->ActiveViewIndex = 0;
	}
	/**
	 *
	 * Ověří uživatele
	 * This method responds to the TCustomValidator's OnServerValidate event.
	 * @param mixed event sender
	 * @param mixed event parameter
	 */
	public function validateUser($sender=null,$param=null)
	{
		$authManager=$this->Application->getModule('auth');
		if(!$authManager->login($this->Username->Text,$this->Password->Text)) {
			if ($param) $param->IsValid=false;  
			return false;
		} 
		return true;
	}

	/**
	 * OVěří přihlášení uživatele a buď přejde na stránku
	 * Tato metoda je handlerem události OnClick a OnCallback tlačítka Submit.
	 * @param mixed event sender
	 * @param mixed event parameter
	 */
	public function loginButtonClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

		if ($this->validateUser() && $this->Page->IsValid)  // all validations succeed
		{
			// obtain the URL of the privileged page that the user wanted to visit originally
			$url=$this->Application->getModule('auth')->ReturnUrl;
			//if(empty($url))  // the user accesses the login page directly
			//	$url=$this->Service->DefaultPageUrl;
			//if (!$this->Page->IsCallback)
				//$this->Response->redirect($url);

			//if ($this->Page->IsCallback)
			$this->broadcastEvent('OnLogin',$sender,$param);
		}
		 
	//	if ($this->Page->IsCallback) {
//			$this->errorWrongPassword->Visible=!$valid;
	//		$this->loginForm->render($param->NewWriter);
	//	}
		if ($this->AfterLoginPageId)
		{
			$url=$this->Page->getContainer($this->AfterLoginPageId)->getAbsoluteHref(true,array(),true);
			$this->Response->redirect($url);
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
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;
			
		$this->Application->getModule('auth')->logout();
		$this->broadcastEvent('OnLogout',$sender,$param);
		if ($this->Page->IsCallback)
			return;

		if ($this->AfterLogoutPageId)
		{
			$url=$this->Page->getContainer($this->AfterLogoutPageId)->getAbsoluteHref(true,array(),true);
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

	public function getAfterLoginPageId()
	{
		return $this->_AfterLoginPageId;
	}

	public function setAfterLoginPageId($value)
	{
		$this->_AfterLoginPageId = $value;
	}
}
