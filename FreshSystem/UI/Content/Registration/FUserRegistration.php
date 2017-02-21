<?php
Prado::using('FreshSystem.UI.Validators.*');
class FUserRegistration extends FStyledTemplateControl {
	
	private $_pageafter;
	private $_usecaptcha;
	private $_email;
	private $_email_template;
	private $_other_info;
	private $_chf_enable;

	public function onInit($param)
	{
		FBasePage::onInit($param);
		if ($this->_other_info)
		{
			$chf = $this->_other_info.'Form';
			$this->$chf->Visible = true;
		}
		$this->attachEventHandler('OnRegistrationSubmitSuccess',array($this,'OnRegistrationSubmitSuccess'));
		$this->attachEventHandler('OnRegistrationSubmitFailure',array($this,'OnRegistrationSubmitFailure'));
	}
	
	
	public function OnRegistrationSubmitSuccess($sender,$param)
	{
		if ($this->Page->IsValid)
			$this->View->ActiveViewIndex = 1;
	}

	public function OnRegistrationSubmitFailure($sender,$param)
	{
		if ($this->Page->IsValid)
			$this->View->ActiveViewIndex = 2;
	}

	public function shippingAddressDifferentClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;
		$this->ShippingAddressForm->Visible = $sender->Checked;
		if ($this->Page->IsCallback)
			$this->broadcastEvent('OnShippingAddressVisible',$sender,$param);
	}
	
	public function billingAddressDifferentClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;
		$this->BillingAddressForm->Visible = $sender->Checked;
		if ($this->Page->IsCallback)
			$this->broadcastEvent('OnBillingAddressVisible',$sender,$param);
	}

	public function sendRegistrationDataClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

		if ($this->Page->IsValid)
		{
	        $connection = TActiveRecord::getActiveDbConnection();
			$transaction=$connection->beginTransaction();
		
			try {
				$user = $this->createUser();
				$this->createAddress($user,'');
				if ($this->BillingAddressDifferent->Checked)
					$this->createAddress($user,'Billing');
				if ($this->ShippingAddressDifferent->Checked)
					$this->createAddress($user,'Shipping');
				$this->createOtherInfo($user);
				$transaction->commit();
				$this->broadcastEvent('OnRegistrationSubmitSuccess',$sender,$param);
			}
			catch (Exception $e)
			{
				$transaction->rollback();
				//var_dump($e);
				die($e->getMessage());
				$this->broadcastEvent('OnRegistrationSubmitFailure',$sender,$param);
			}
		}		
	}	

	public function getAddressProperties()	
	{
          if (!$this->_address_properties)
		  {
			  $finder = AdressRecord::finder();
			  $properties = $finder->getRecordGateway()->getRecordTableInfo($finder)->getColumnNames();
	          foreach($properties as $k=>$p) 
	              $properties[$k] = trim($p,'`');
			  $this->_address_properties = $properties;
		  }
		  return $this->_address_properties;
	}

	public function getRecordProperties($class)	
	{
		  $finder = TActiveRecord::finder($class);
		  $properties = $finder->getRecordGateway()->getRecordTableInfo($finder)->getColumnNames();
          foreach($properties as $k=>$p) 
              $properties[$k] = trim($p,'`');
		  return $properties;
	}

	public function checkEmail($sender,$param)
	{
		// valid if the username is not found in the database
		if ($this->Email->SafeText == '')
		{
			$param->IsValid = true;
			return;
		}
		$user = UserRecord::finder()->find('Email like ? ',$this->Email->SafeText);
		$param->IsValid=($user===null);// || $this->getUserRecord() && ($user->uid = $this->UserRecord->uid));
		//svar_dump($user);
	}

	public function checkUsername($sender,$param)
	{
		// valid if the username is not found in the database
		$user = UserRecord::finder()->find('Username like ?',$this->Username->SafeText);
		$param->IsValid=($user===null);// || $this->getUserRecord() && ($user->uid = $this->UserRecord->uid));
		//svar_dump($user);
	}


	public function createUser()
	{
			$user = new UserRecord;
			$user->Email = $this->Email->SafeText;
			$user->Username = $this->Username->SafeText;
			$user->Password = $this->Password->SafeText;
			$user->Name = $this->CustomerName->SafeText;
			$user->Role = 0;
			$user->Created = time();
			$user->Updated = time();
			$user->Level = 10;
			$user->save();
			return $user;
	}
	
	public function createOtherInfo($user)
	{
		if ($this->_other_info)
		{
			$class = $this->_other_info.'Record';
			TActiveRecord::finder($class)->deleteAll('UserId = ?',$user->Uid);
			for($i=1; $i<4; ++$i)
			{
				$oi = new $class;
				$oi->fromComponent($this,$this->_other_info.$i);
				$oi->UserId = $user->Uid;
				$oi->save();
			}
		}
	}

	public function createAddress($user,$type='')
	{
//		$properties = $this->getAddressProperites();
		$address = new AddressRecord;
		$address->fromComponent($this,$type);
		$address->UserId = $user->Uid;
		$address->Type = strtolower($type);
		$address->Changed = time();
		$address->save();
		return $address;
	}
	
	public function readProperties($record,$type,$properties)
	{
		foreach($properties as $prop)
		{
			$typeProp = $type.$prop;
			if ($obj = $this->findControl($typeProp))
			{
				if ($obj->hasProperty('SafeText'))
					$record->$prop = $obj->SafeText;
				elseif ($obj->hasProperty('SelectedValue'))
					$record->$prop = $obj->SelectedValue;
				elseif ($obj->hasProperty('Checked'))
					$record->$prop = $obj->Checked;
			}
		}
		return $record;
	}
	
	
	public function getUseCaptcha()
	{
		return $this->_usecaptcha || !$this->User->IsGuest;
	}
	
	public function setUseCaptcha($value)
	{
		$this->_usecaptcha = TPropertyValue::ensureBoolean( $value );
	}

	public function getPageAfter()
	{
		return $this->_pageafter;
	}


	public function setPageAfter($value)
	{
		$this->_pageafter = $value;
	}

	public function setEmail($value)
	{
		$this->_email = $value;
	}

	public function getEmail()
	{
		return $this->_email;
	}

	public function setOtherInfo($value)
	{
		$this->_other_info = $value;
	}

	public function getOtherInfo()
	{
		return $this->_other_info;
	}

	public function setChilderFormEnable($value)
	{
		$this->_chf_enable = TPropertyValue::ensureBoolean($value);
	}

	public function getChilderFormEnable()
	{
		return $this->_chf_enable;
	}

public function setEmailTemplate($value)
	{
		$this->_email_template = $value;
	}

	public function getEmailTemplate()
	{
		if (!$this->_email_template)
			$this->_email_template = 'question';
		return $this->_email_template;
	}
	
	public function getToken($pagePath,$token,$date)
	{
		
		$sm = Prado::getApplication()->getSecurityManager();
		$time = strtotime($date);
		$hToken = $sm->hashData($token.'|'.$time);
		return $this->Service->constructUrl($pagePath,array('token'=>$hToken));
		
	}
	
	public function getValidToken()
	{
		if ($this->Request->contains('token'))
		{
			$sm = Prado::getApplication()->getSecurityManager();
			$token = $this->Request['token'];

			list($token,$time) = explode('|',$sm->validateData($token));
			if ($time > time())
				return $token;
		}
		return false;
	}
	

}
