<?php

// Include TDbUserManager.php file which defines TDbUser
Prado::using('System.Security.TDbUserManager');

/**
 * FUser Class.
 * FUser represents the user data that needs to be kept in session.
 * Default implementation keeps username and role information.
 */
class FUser extends TDbUser
{
	private $_address;
    private $_billingaddress;
    private $_shippingaddress;
    private $_user_record;
	/**
	 * Creates a DmUser object based on the specified username.
	 * This method is required by TDbUser. It checks the database
	 * to see if the specified username is there. If so, a DmUser
	 * object is created and initialized.
	 * @param string the specified username
	 * @return DmUser the user object, null if username is invalid.
	 */
	public function createUser($username)
	{
		// use UserRecord Active Record to look for the specified username
		$userRecord= ($username instanceof UserRecord) ?  $username : UserRecord::finder()->findByUsername($username);
		if($userRecord instanceof UserAR) // if found
		{

            $user=new FUser($this->Manager);
			$user->Uid =$userRecord->Uid;
			$user->Name = trim($userRecord->Name);
			$user->MaxLevel = ($userRecord->canGetProperty('MaxLevel')) ? $userRecord->MaxLevel : $userRecord->Level;
			$user->Level = $user->MaxLevel;
			$user->Username=$username;  // set username
                        if ($userRecord->canGetProperty('MaxLevel'))
                            $user->Roles = $userRecord->ExtractedRoles;
                        else
                            $user->Roles=($userRecord->Role==1?'SuperAdmin':'Admin'); // set role
			$user->IsGuest=false;   // the user is not a guest
			
                        $this->_user_record = $userRecord;
			$ur =  UserAR::finder()->findByUsername($username);
        	$user->setCompanyID($ur->company_id);
			$user->setCompanyLevel($ur->company_level);
                        
                        return $user;
		}
		else
			return null;
	}

	/**
	 * Checks if the specified (username, password) is valid.
	 * This method is required by TDbUser.
	 * @param string username
	 * @param string password
	 * @return boolean whether the username and password are valid.
	 */
	public function validateUser($username,$password)
	{
		// use UserRecord Active Record to look for the (username, password) pair.
	   if (!$password) return false;
	   $ur =  UserAR::finder()->findBy_username_AND_password($username,$password);
        if ($ur === null)
            return false;
            
    	   $ur->LastDate = time();
        $ur->LastIP = Prado::getApplication()->Request->UserHostAddress;
        if ($ur->Password != $ur->Password1) {
            $ur->Password3 = $ur->Password2;
            $ur->Password2 = $ur->Password1;
            $ur->Password1 = $ur->Password;
            $ur->LastPasswordChange = time();
        }
        $ur->save();
        
        return true;
        
	}

        public function getUserRecord()
        {
            if ($this->_user_record === null)
                    $this->_user_record = UserRecord::finder()->findByPk($this->Uid);
            return $this->_user_record;
        }

        public function isInRole($roles,$policy='allow')
        {
            if (!isset($this->Roles['all']))
                   return parent::isInRole($roles);

            $roles = (is_array($roles)) ? $roles : explode(',',$roles);
	    
		    $res = true;
            foreach ($roles as $role)
            {
                if (is_numeric($role))
                {
				    $res = isset($this->Roles[$policy][$role]);
                }
                else
                {
                    $allroles = RoleRecord::getAllRoles();
                    //var_dump($allroles['names']); var_dump($role);
                    $id = $allroles['names'][$role]->uid;
                    $res = isset($this->Roles[$policy][$id]);
                }
				if ($policy=='allow' && $res) return true;
				elseif ($policy=='deny' && !$res) return false;
            }
            return $res;
        }

        public function getAddress()
	{
		if (null === $this->_address)
		{
			$this->_address = AddressRecord::finder()->find('UserId = ? AND Type = ?',$this->Uid,'');
			$this->_address = ($this->_address ) ? $this->_address  : new AddressRecord;
		}		
		return $this->_address;
	}

	public function getBillingAddress()
	{
		if (null === $this->_billingaddress)
		{
			$this->_billingaddress = AddressRecord::finder()->find('UserId = ? AND Type like ?',$this->Uid,'Billing');
			$this->_billingaddress = ($this->_billingaddress ) ? $this->_billingaddress  : $this->getAddress();
		}		
		return $this->_billingaddress;
	}

	public function getShippingAddress()
	{
		if (null === $this->_shippingaddress)
		{
			$this->_shippingaddress = AddressRecord::finder()->find('UserId = ? AND Type like ?',$this->Uid,'Shipping');
			$this->_shippingaddress = ($this->_shippingaddress ) ? $this->_shippingaddress  : $this->getAddress();
		}		
		return $this->_shippingaddress;
	}

	public function getChildren()
	{
		return array();
/*
		if (null === $this->_shippingaddress)
		{
			$this->_shippingaddress = AddressRecord::finder()->find('UserId = ? AND type = ?',$this->Uid,'Shipping');
			$this->_shippingaddress = ($this->_billingaddress ) ? $this->_shippingaddress  : $this->getAddress();
		}		
		return $this->_shippingaddress;

*/	}

	/**
	 * @return boolean whether this user is an administrator.
	 */
	public function getIsAdmin()
	{
		return $this->isInRole('admin');
	}
	
	/**
	 * @return content_id
	 */
	public function getContentID()
	{
		return $this->getState('ContentID',0);
	}

	/**
	 * @param content_id
	 */
	public function setContentID($value)
	{
		$this->setState('ContentID',$value,0);
	}

	/**
	 * @return content_id
	 */
	public function getProductID()
	{
		return $this->getState('ProductID',0);
	}

	/**
	 * @param content_id
	 */
	public function setProductID($value)
	{
		$this->setState('ProductID',$value,0);
	}

	/**
	 * @return string uid, defaults to empty string.
	 */
	public function getUid()
	{
		return $this->getState('Uid','');
	}

	/**
	 * @param string uid
	 */
	public function setUid($value)
	{
		$this->setState('Uid',$value,'');
	}

	/**
	 * @return string FullName, defaults to empty string.
	 */
	public function getUsername()
	{
		return $this->getState('Username','');
	}

	/**
	 * @param string FullName
	 */
	public function setUsername($value)
	{
		$this->setState('Username',$value,'');
	}
	/**
	 * @return string FullName, defaults to empty string.
	 */
	public function getLevel()
	{
		return $this->getState('Level',0);
	}

	/**
	 * @param string FullName
	 */
	public function setLevel($value)
	{
		$this->setState('Level',$value,0);
	}
	
	
	
	/**
	 * @return string FullName, defaults to empty string.
	 */
	public function getAlreadyPlayed()
	{
		return $this->getState('AlreadyPlayed',0);
	}

	/**
	 * @param string FullName
	 */
	public function setAlreadyPlayed($value)
	{
		$this->setState('AlreadyPlayed',$value,0);
	}
	
	/**
	 * @return string FullName, defaults to empty string.
	 */
	public function getInstructorID()
	{
		return $this->getState('InstructorID', 0);
	}
	
	/**
	 * @param string FullName
	 */
	public function setInstructorID($value)
	{
		$this->setState('InstructorID',$value,0);
	}
	
	/**
	 * @return string FullName, defaults to empty string.
	 */
	public function getStudentID()
	{
		return $this->getState('StudentID',0);
	}
	
	/**
	 * @param string FullName
	 */
	public function setStudentID($value)
	{
		$this->setState('StudentID',$value,0);
	}
	
	/**
	 * @return string FullName, defaults to empty string.
	 */
	public function getMaxLevel()
	{
		return $this->getState('MaxLevel',0);
	}

	/**
	 * @param string FullName
	 */
	public function setMaxLevel($value)
	{
		$this->setState('MaxLevel',$value,0);
	}

	/**
	 * @return string Initials, defaults to empty string.
	 */
	public function getInitials()
	{
            $n = explode(' ',$this->Name);
            if (count($n)>1)
                return strtoupper(substr($n[0],0,1).substr($n[1],0,1));
            else
                return strtoupper(substr($this->Name,0,2));
	}

        public function createUserFromCookie($cookie)
        {
            if(($data=$cookie->Value)!=='')
            {
                $application=Prado::getApplication();
                if(($data=$application->SecurityManager->validateData($data))!==false)
                {
                    $data=unserialize($data);
                    if(is_array($data) && count($data)===3)
                    {
                        list($username,$address,$token)=$data;
                        //$sql='SELECT passcode FROM user WHERE LOWER(username)=:username';
                        //$command=$this->DbConnection->createCommand($sql);
                        //$command->bindValue(':username',strtolower($username));
                        $ur =  UserAR::finder()->findByUsername($username);
                        if($token===$command->queryScalar() && $token!==false && $address=$application->Request->UserHostAddress)
                            return $this->createUser($username);
                    }
                }
            }
            return null;
        }

        
        
        /**
		 * @return company_id
		 */
		public function getCompanyID()
		{
			return $this->getState('CompanyID',null);
		}
	
		/**
		 * @param company_id
		 */
		public function setCompanyID($value)
		{
			$this->setState('CompanyID',$value,null);
		}
        
		
 		/**
		 * @return company_level
		 */
		public function getCompanyLevel()
		{
			return $this->getState('CompanyLevel',null);
		}
	
		/**
		 * @param content_level
		 */
		public function setCompanyLevel($value)
		{
			$this->setState('CompanyLevel',$value,null);
		}
        
        

        public function createUserFromToken($token)
        {	
			 if ($aurl = ActiveUrlRecord::finder()->findByValidUrl($token, true ))	{
				$user = $this->createUser($aurl->user_id);
                if ( $aurl->activated > time() || $aurl->expire < time()) {
					
                	// If the log in user is an Instructor and the course is expierd,
                	// Then we are showing the token as a not Valid token, rather we are 
                	// updating the time and allowed the user to play the course. 
                	
                	if($aurl->instructor_id == $user->Uid ){
						$aurl->activated = time();
						$aurl->expire =  strtotime('+ 1 day');
						$aurl->save();
					} else {
					
						throw new TApplicationException('Not valid token '.$token);
	          			return null;
					}
						
				}
				
				$user->ContentID = $aurl->content_id;
				$user->ProductID = $aurl->product_id;
				$user->AlreadyPlayed = $aurl->alreadyPlayed;
				$user->InstructorID =$aurl->instructor_id;
				$user->StudentID = $aurl->student_id;
				return $user;
                }
			throw new TApplicationException('Not valid token'.$token);
	        return null;
			
        }

        public function saveUserToCookie($cookie)
        {
            $application=Prado::getApplication();
            $username=strtolower($this->Username);
            $address=$application->Request->UserHostAddress;
            $sql='SELECT passcode FROM user WHERE LOWER(username)=:username';
            $command=$this->DbConnection->createCommand($sql);
            $command->bindValue(':username',strtolower($username));
            $token=$command->queryScalar();
            $data=array($username,$address,$token);
            $data=serialize($data);
            $data=$application->SecurityManager->hashData($data);
            $cookie->setValue($data);
        }

        public function levelBellowString($level) {
            return ($this->MaxLevel < $level) ? 'true' : 'false';
        }

        public function notInRoleString($roles) {
            return (!$this->isInRole($roles)) ? 'true' : 'false';
        }

        public function  saveToString() {
            $this->setState('Version', Prado::getApplication()->Parameters['version']);
            return parent::saveToString();

        }
}

