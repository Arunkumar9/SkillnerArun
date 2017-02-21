<?php

class LoginForm extends FStyledTemplateControl
{
	

	/**
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
	public function loginClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

		if ($this->validateUser() && $this->Page->IsValid)  // all validations succeed
		{
			// obtain the URL of the privileged page that the user wanted to visit originally
			//$url=$this->Application->getModule('auth')->ReturnUrl;
			//if(empty($url))  // the user accesses the login page directly
			//	$url=$this->Service->DefaultPageUrl;
			//if (!$this->Page->IsCallback)
			//	$this->Response->redirect($url);
			//else
			//{
			//	$this->broadcastEvent('OnLogin',$sender,$param);
			//}
			
			$this->broadcastEvent('OnPersonalData',$sender,$param);
		}
		 
		if ($this->Page->IsCallback) {
			//$this->errorWrongPassword->Visible=!$valid;
		//	$this->loginForm->render($param->NewWriter);
		}
	}
	

}