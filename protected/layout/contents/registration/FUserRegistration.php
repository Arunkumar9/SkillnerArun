<?php

Prado::using('FreshSystem.UI.Validators.*');

class FUserRegistration extends FStyledTemplateControl {

    private $_pageafter;
    private $_usecaptcha;
    private $_email;
    private $_email_template;
    private $_other_info;
    private $_chf_enable;

    public function onInit($param) {
        parent::onInit($param);
        if ($this->_other_info) {
            $chf = $this->_other_info . 'Form';
            $this->$chf->Visible = true;
        }
        if (!$this->User->IsGuest && !$this->Page->IsCallback) {
            $user = $this->fillUser();
            $this->fillAddress($user);
            $this->fillAddress($user, 'Billing');
            $this->fillAddress($user, 'Shipping');
            $this->ChangePassword->Visible = true;
            $this->UsernameAndPassword->Visible = false;
        }
        $this->attachEventHandler('OnRegistrationSubmitSuccess', array($this, 'OnRegistrationSubmitSuccess'));
        $this->attachEventHandler('OnRegistrationSubmitFailure', array($this, 'OnRegistrationSubmitFailure'));
        $this->attachEventHandler('OnRegistrationUpdateSuccess', array($this, 'OnRegistrationUpdateSuccess'));
        $this->attachEventHandler('OnRegistrationUpdateFailure', array($this, 'OnRegistrationUpdateFailure'));
    }

    public function OnRegistrationSubmitSuccess($sender, $param) {
        if ($this->Page->IsValid)
            $this->View->ActiveViewIndex = 1;
    }

    public function OnRegistrationSubmitFailure($sender, $param) {
        if ($this->Page->IsValid)
            $this->View->ActiveViewIndex = 2;
    }

    public function OnRegistrationUpdateSuccess($sender, $param) {
        if ($this->Page->IsValid)
            $this->View->ActiveViewIndex = 3;
    }

    public function OnRegistrationUpdateFailure($sender, $param) {
        if ($this->Page->IsValid)
            $this->View->ActiveViewIndex = 4;
    }

    public function shippingAddressDifferentClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;
        $this->ShippingAddressForm->Visible = $sender->Checked;
        if ($this->Page->IsCallback)
            $this->broadcastEvent('OnShippingAddressVisible', $sender, $param);
    }

    public function billingAddressDifferentClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;
        $this->BillingAddressForm->Visible = $sender->Checked;
        if ($this->Page->IsCallback)
            $this->broadcastEvent('OnBillingAddressVisible', $sender, $param);
    }

    public function sendRegistrationDataClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;

        if ($this->Page->IsValid) {
            $connection = TActiveRecord::getActiveDbConnection();
            $transaction = $connection->beginTransaction();

            try {
                $user = $this->createUser();
                $this->createAddress($user, '');
                $this->createAddress($user, 'Billing');
                $this->createAddress($user, 'Shipping');
                $this->createOtherInfo($user);
                $transaction->commit();
                $this->broadcastEvent('OnRegistrationSubmitSuccess', $sender, $param);
            } catch (Exception $e) {
                $transaction->rollback();
                //var_dump($e);
                $param->Parameter['errorMessage'] = $e->getErrorMessage();
                $this->broadcastEvent('OnRegistrationSubmitFailure', $sender, $param);
            }
        }
    }

    public function sendUpdateDataClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;

        if ($this->Page->IsValid) {
            $connection = TActiveRecord::getActiveDbConnection();
            $transaction = $connection->beginTransaction();

            try {
                $user = $this->getUserRecord();
                $this->updateUser($user);
                $this->createAddress($user, '');
                $this->createAddress($user, 'Billing');
                $this->createAddress($user, 'Shipping');
                $this->createOtherInfo($user);
                $transaction->commit();
                $this->broadcastEvent('OnRegistrationUpdateSuccess', $sender, $param);
            } catch (Exception $e) {
                $transaction->rollback();
                //var_dump($e);
                $param->Parameter['errorMessage'] = $e->getErrorMessage();
                $this->broadcastEvent('OnRegistrationUpdateFailure', $sender, $param);
            }
        }
    }

    public function getAddressProperties() {
        if (!$this->_address_properties) {
            $finder = AdressRecord::finder();
            $properties = $finder->getRecordGateway()->getRecordTableInfo($finder)->getColumnNames();
            foreach ($properties as $k => $p)
                $properties[$k] = trim($p, '`');
            $this->_address_properties = $properties;
        }
        return $this->_address_properties;
    }

    public function getRecordProperties($class) {
        $finder = TActiveRecord::finder($class);
        $properties = $finder->getRecordGateway()->getRecordTableInfo($finder)->getColumnNames();
        foreach ($properties as $k => $p)
            $properties[$k] = trim($p, '`');
        return $properties;
    }

    public function checkEmail($sender, $param) {
        // valid if the username is not found in the database
        if ($this->Email->SafeText == '') {
            $param->IsValid = true;
            return;
        }
        if ($this->User->IsGuest || $this->Email->SafeText != $this->getUserRecord()->Email) {
            $user = UserFERecord::finder()->find('Email like ? ', $this->Email->SafeText);
            // || $this->getUserRecord() && ($user->uid = $this->UserFERecord->uid));
        } else {
            $user = null;
        }
        $param->IsValid = ($user === null);
        //svar_dump($user);
    }

    public function checkUsername($sender, $param) {
        // valid if the username is not found in the database
        $user = UserFERecord::finder()->find('Username like ?', $this->Username->SafeText);
        $param->IsValid = ($user === null); // || $this->getUserRecord() && ($user->uid = $this->UserFERecord->uid));
        //svar_dump($user);
    }

    public function createUser() {
        $user = new UserFERecord;
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

    public function updateUser($user) {
        $user->Email = $this->Email->SafeText;
        if ($this->NewPassword->SafeText)
            $user->Password = $this->NewPassword->SafeText;
        $user->Name = $this->CustomerName->SafeText;
        $user->Updated = time();
        $user->save();
        return $user;
    }

    public function fillUser() {
        $user = $this->getUser();
        try {
            $this->Username->Text = $user->Username;
        } catch (Exception $e) {
            
        }
        $this->CustomerName->Text = $user->Name;
        return UserFERecord::finder()->findByUsername($user->Username);
    }

    public function createOtherInfo($user) {
        if ($this->_other_info) {
            $class = $this->_other_info . 'Record';
            TActiveRecord::finder($class)->deleteAll('UserId = ?', $user->Uid);
            for ($i = 1; $i < 4; ++$i) {
                $oi = new $class;
                $oi->fromComponent($this, $this->_other_info . $i);
                $oi->UserId = $user->Uid;
                $oi->save();
            }
        }
    }

    public function fillOtherInfo($user) {
        if ($this->_other_info) {
            $class = $this->_other_info . 'Record';
            $ois = TActiveRecord::finder($class)->findAll('UserId = ?', $user->Uid);
            for ($i = 1; $i < 4; ++$i) {
                if ($oi = $ois[$i - 1])
                    $oi->toComponent($this, $this->_other_info . $i);
            }
        }
    }

    public function createAddress($user, $type='') {
//		$properties = $this->getAddressProperites();
        $address = $this->User->{$type . 'Address'};
        if ($type && !$this->{$type . 'AddressDifferent'}->Checked) {
            AddressRecord::finder()->deleteAll('UserId = ? AND Type like ?', $user->Uid, strtolower($type));
            return;
        }

        if (!$address || $address === $this->User->Address)
            $address = new AddressRecord;
        $address->fromComponent($this, $type);
        $address->UserId = $user->Uid;
        $address->Type = strtolower($type);
        $address->Changed = time();
        $address->save();
//echo TVarDumper::dump($address);
        return $address;
    }

    public function fillAddress($user, $type='') {
        $address = $this->User->{$type . 'Address'};
        if ($address) {
            if (!$type)
                $address->toComponent($this, $type);
            elseif ($address !== $this->User->Address) {
                $address->toComponent($this, $type);
                $this->{$type . 'AddressDifferent'}->Checked = true;
                $this->{$type . 'AddressForm'}->Visible = true;
            }
        }
    }

    public function readProperties($record, $type, $properties) {
        foreach ($properties as $prop) {
            $typeProp = $type . $prop;
            if ($obj = $this->findControl($typeProp)) {
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

    public function getUseCaptcha() {
        return $this->_usecaptcha || !$this->User->IsGuest;
    }

    public function setUseCaptcha($value) {
        $this->_usecaptcha = TPropertyValue::ensureBoolean($value);
    }

    public function getPageAfter() {
        return $this->_pageafter;
    }

    public function setPageAfter($value) {
        $this->_pageafter = $value;
    }

    public function setEmail($value) {
        $this->_email = $value;
    }

    public function getEmail() {
        return $this->_email;
    }

    public function setOtherInfo($value) {
        $this->_other_info = $value;
    }

    public function getOtherInfo() {
        return $this->_other_info;
    }

    public function setChilderFormEnable($value) {
        $this->_chf_enable = TPropertyValue::ensureBoolean($value);
    }

    public function getChilderFormEnable() {
        return $this->_chf_enable;
    }

    public function setEmailTemplate($value) {
        $this->_email_template = $value;
    }

    public function getEmailTemplate() {
        if (!$this->_email_template)
            $this->_email_template = 'question';
        return $this->_email_template;
    }

    public function getToken($pagePath, $token, $date) {

        $sm = Prado::getApplication()->getSecurityManager();
        $time = strtotime($date);
        $hToken = $sm->hashData($token . '|' . $time);
        return $this->Service->constructUrl($pagePath, array('token' => $hToken));
    }

    public function getValidToken() {
        if ($this->Request->contains('token')) {
            $sm = Prado::getApplication()->getSecurityManager();
            $token = $this->Request['token'];

            list($token, $time) = explode('|', $sm->validateData($token));
            if ($time > time())
                return $token;
        }
        return false;
    }

    protected function getUserRecord() {
        return UserFERecord::finder()->findByPk($this->User->Uid);
    }

}
