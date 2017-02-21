<?php
class LockedPageContent extends TTemplateControl
{
	private $_password;
	private $_sendcookie;
	
	public function onLoad($writer)
	{
		$cookie=$this->Request->Cookies[$this->CookieKey];
		if (!$this->SendCookie && null !== $cookie)
		{
			$cookie->Value = null;
			$this->Response->Cookies[] = $cookie;
		}
		elseif($this->SendCookie && null !== $cookie)
		{

			if (md5($this->Password) == $cookie->getValue())
				$this->View->ActiveViewIndex = 1;
			else
				$this->View->ActiveViewIndex = 0;
		}
		else
		{
			$this->View->ActiveViewIndex = 0;
		}
	}

	protected function getCookieKey()
	{
		return md5(__CLASS__.$this->Page->Container->uid);
	}	
	public function getPassword()
	{
		return $this->_password;
	}
	
	public function setPassword($value)
	{
		$this->_password = $value;
	}

	public function getSendCookie()
	{
		return $this->_sendcookie;
	}
	
	public function setSendCookie($value)
	{
		$this->_sendcookie = TPropertyValue::ensureBoolean($value);
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

		if ($this->Password == $this->PasswordField->Text)  
		{
			$this->View->ActiveViewIndex = 1;
			if ($this->SendCookie)
			{
				$cookie = new THttpCookie;
				$cookie->Name = $this->CookieKey;
				$cookie->Value = md5($this->Password);
				$this->Response->Cookies[] = $cookie;
			}
		}
		else
		{
			$this->View->ActiveViewIndex = 2;
		}
		$this->broadcastEvent('OnAuthorize',$sender,$param);	
	}
}

