<?php
class EmailActivateUser extends FStyledTemplateControl
{
	private $_emailadmin;
	private $_AutoLogin;

	/**
	 * Getter for property AutoLogin
	 * Email to send email about successfull activation, do not send if empty
	 * @return string
	 */
	public function getAutoLogin() {
	    return $this->_AutoLogin;
	}

	/**
	 * Setter for property AutoLogin
	 * Email to send email about successfull activation, do not send if empty
	 * @param $value string
	 */
	public function setAutoLogin($value) {
	    $this->_AutoLogin = $value;
	}


	public function getEmailAdmin()
	{
		return $this->_emailad;
	}

	public function setEmailAdmin($value)
	{
		$this->_emailadmin = $value;
	}


	public function onLoad($param)
	{
	    parent::onLoad($param);
	    if (!$this->Page->IsPostBack && $this->Request->contains('token'))
	    {
		$token = $this->Request['token'];
		$param = new TBroadcastEventParameter;
		if ($this->validateToken($token))
		{
			$this->View->ActiveViewIndex = 1;
			$this->broadcastEvent('OnActivateSuccess',$this,$param);
		}
		else
		{
			$this->View->ActiveViewIndex = 2;
			$this->broadcastEvent('OnActivateFailure',$this,$param);
		}
	    }
	    else
	    {
		$this->View->ActiveViewIndex = 0;
	    }
	}

	/**
	 * Handler of OnClick a OnCallback SendPassword.
	 * @param mixed event sender
	 * @param mixed event parameter
	 */
	public function sendPasswordClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

		$token = $this->ActivationToken->SafeText;

		if ($this->validateToken($token))
		{
			$this->View->ActiveViewIndex = 1;
			$this->broadcastEvent('OnActivateSuccess',$sender,$param);
		}
		else
		{
			$this->View->ActiveViewIndex = 2;
			$this->broadcastEvent('OnActivateFailure',$sender,$param);
		}
	}

	protected function validateToken($token)
	{
	    $arec = ActivationRecord::finder()->finByCode($token);
	    if ($arec === null)
		return false;

            FEUserRecord::finder()->updateByPk(array('account_type'=>1),$arec->user_id);
	    return true;
	}
}

