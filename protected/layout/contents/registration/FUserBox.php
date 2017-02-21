<?php
//Prado::using('FreshSystem.UI.Content.Registration.FUserLoginForm');
class FUserBox extends FStyledTemplateControl {
	
	private $_LoginPageId='login';
	private $_RegisterPageId='registrace';
	private $_AccountPageId='registrace';
	private $_AfterLogoutPageId='Home';
	private $_AfterLoginPageId='';

	public function OnPreRender($param)
	{
		parent::onPreRender($param);
		 if ($this->Application->User->IsGuest)
		 {

                        //$this->LogoutLink->Visible = false;
		 	$this->UserBoxPanel->Visible = true;
			$this->UserBoxPanel1->Visible = false;
		 }
		 else
		 {
                        ///$this->LogoutLink->Visible = true;
		 	$this->UserBoxPanel->Visible = false;
			$this->UserBoxPanel1->Visible = true;
		 }
		
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

                        if ($url=$this->Page->getContainer($this->AfterLoginPageId)->AbsoluteHref)
                            $this->earlyRedirect($url);
		}
		else
		{
                        if ($url=$this->Page->getContainer($this->LoginPageId)->AbsoluteHref)
                            $this->earlyRedirect($url);

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
//    	if ($this->AfterLogoutPageId)
//		{	
			if ($url=$this->Page->getContainer($this->AfterLogoutPageId)->AbsoluteHref)
                            $this->earlyRedirect($url);
//		}
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
		if (!$value)
			$this->_RegisterPageId = $value;
	}
	
	public function getLoginPageId()
	{
		return $this->_LoginPageId;
	}

	public function setLoginPageId($value)
	{
		if (!$value)
			$this->_LoginPageId = $value;
	}

	public function earlyRedirect($url){
        if ($this->Page->IsCallback){
            // Create a callback adapter which counstructor will set up TCallbackReponseAdapter in the HttpResponse class adapter property
            $callbackAdapter = new TActivePageAdapter(new TPage());
            // Redirect (now the adapter is not null)
            $this->Response->redirect($url);
            // Create a html writer
            $writer = $this->getResponse()->createHtmlWriter();
            // Render the response
            $callbackAdapter->renderCallbackResponse($writer);
            //Flush the output                                   
            $this->getApplication()->flushOutput();
            //exit application do not process the futher part                        
            exit;            
        } else {
            $this->Response->redirect($url);
        }    
    }

}
