<?php

// Include TDbUserManager.php file which defines TDbUser
Prado::using('System.Security.TDbUserManager');
Prado::using('FreshSystem.security.FUser');
/**
 * FUser Class.
 * FUser represents the user data that needs to be kept in session.
 * Default implementation keeps username and role information.
 */
class FFEUser extends FUser
{
	private $_address;
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
		$userRecord=UserFERecord::finder()->findByUsername($username);
		if($userRecord instanceof UserFERecord) // if found
		{
			$user=new FFEUser($this->Manager);
			$user->Uid =$userRecord->Uid;
			$user->Name = trim($userRecord->Name);
			$user->Level = $userRecord->Level;
			$user->Username=$username;  // set username
			$user->Roles=($userRecord->Role==1?'SuperAdmin':'Admin'); // set role
			$user->IsGuest=false;   // the user is not a guest
			
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
		$ur =  UserFERecord::finder()->findBy_username_AND_password($username,$password);
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
	
	public function getAddress()
	{
		if (null === $this->_address)
		{
			$this->_address = AddressRecord::finder()->findByUserId($this->Uid);
			$this->_address = ($this->_address ) ? $this->_address  : new AddressRecord;
		}		
		return $this->_address;
	}

	/**
	 * @return boolean whether this user is an administrator.
	 */
	public function getIsAdmin()
	{
		return $this->isInRole('admin');
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

}

?>