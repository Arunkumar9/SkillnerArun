<?php
/**
 * TAuthManager class file
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Id: FTokenAuthManager.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Security
 */

/**
 * Using IUserManager interface
 */
Prado::using('System.Security.IUserManager');
Prado::using('System.Security.TAuthManager');

/**
 * FServiceAuthManager class
 *
 * TAuthManager performs user authentication and authorization for a Prado application.
 * TAuthManager works together with a {@link IUserManager} module that can be
 * specified via the {@link setUserManager UserManager} property.
 * If an authorization fails, TAuthManager will try to redirect the client
 * browser to a login page that is specified via the {@link setLoginPage LoginPage}.
 * To login or logout a user, call {@link login} or {@link logout}, respectively.
 *
 * To load TAuthManager, configure it in application configuration as follows,
 * <module id="auth" class="System.Security.TAuthManager" UserManager="users" LoginPage="login" />
 * <module id="users" class="System.Security.TUserManager" />
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @version $Id: FTokenAuthManager.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Security
 * @since 3.0
 */
class FTokenAuthManager extends TAuthManager
{
	/**
	 * Performs the real authentication work.
	 * An OnAuthenticate event will be raised if there is any handler attached to it.
	 * If the application already has a non-null user, it will return without further authentication.
	 * Otherwise, user information will be restored from session data.
	 * @param mixed parameter to be passed to OnAuthenticate event
	 * @throws TConfigurationException if session module does not exist.
	 */
	public function onAuthenticate($param)
	{
		$application=$this->getApplication();

		// restoring user info from session
		if(($session=$application->getSession())===null)
			throw new TConfigurationException('authmanager_session_required');
		$session->open();
		$sessionInfo=$session->itemAt($this->getUserKey());
		$user=$this->getUserManager()->getUser(null)->loadFromString($sessionInfo);

		// check for authentication expiration
		$isAuthExpired = $this->getAuthExpire()>0 && !$user->getIsGuest() && 
        ($expiretime=$session->itemAt('AuthExpireTime')) && $expiretime<time();

		$token=$this->Request['token'];
		if (!$token && ($ref = $this->getRequest()->getUrlReferrer())) {
			$ref = new TUri($ref);
			$q = $this->convertUrlQuery($ref->getQuery());
			$token = $q['token'];
		}
		// try authenticating through cookie if possible
		if($token || $this->getAllowAutoLogin() && ($user->getIsGuest() || $isAuthExpired))
		{
			$token = ($token) ? $token : $session->itemAt('AuthToken');
			if($token)
			{
				if(($user2=$this->getUserManager()->getUser(null)->createUserFromToken($token))!==null)
				{
					$user=$user2;
					$this->updateSessionUser($user);
					// user is restored from cookie, auth may not expire
                         $session->add('AuthToken',$token); 
					$isAuthExpired = false;
				} else {
                         $session->remove('AuthToken');
                    }
			}
		}

		$application->setUser($user);

		// handle authentication expiration or update expiration time
		if($isAuthExpired)
			$this->onAuthExpire($param);
		else
			$session->add('AuthExpireTime', time() + $this->getAuthExpire());

		// event handler gets a chance to do further auth work
		if($this->hasEventHandler('OnAuthenticate'))
			$this->raiseEvent('OnAuthenticate',$this,$application);
	}

     /**
	 * Performs user logout on authentication expiration.
	 * An 'OnAuthExpire' event will be raised if there is any handler attached to it.
	 * @param mixed parameter to be passed to OnAuthExpire event.
	 */
	public function onAuthExpire($param)
	{
		$this->logout();
		if($this->hasEventHandler('OnAuthExpire'))
			$this->raiseEvent('OnAuthExpire',$this,$param);
	}
	
	/** 
	* Returns the url query as associative array 
	* 
	* @param    string    query 
	* @return    array    params 
	*/ 
	function convertUrlQuery($query) { 
		$queryParts = explode('&', $query); 
		
		$params = array(); 
		foreach ($queryParts as $param) { 
		    $item = explode('=', $param); 
		    $params[$item[0]] = $item[1]; 
		} 
		
		return $params; 
	 } 
	     
}

