<?php
/**
 * TAuthManager class file
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Id: FCmsAuthManager.php 2348 2013-12-20 10:20:54Z arun $
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
 * @version $Id: FCmsAuthManager.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Security
 * @since 3.0
 */
class FCmsAuthManager extends TAuthManager
{

        private $_loginPath;
        /**
	 * Performs the real authorization work.
	 * Authorization rules obtained from the application will be used to check
	 * if a user is allowed. If authorization fails, the response status code
	 * will be set as 401 and the application terminates.
	 * @param mixed parameter to be passed to OnAuthorize event
	 */
	public function onAuthorize($param)
	{
		parent::onAuthorize($param);
                $application=$this->getApplication();
                $cms = $application->getModule('cms');


		if (($c = $cms->getContainer()) && $c->read_level > $this->getUser()->Level)
		{
			$application->getResponse()->setStatusCode(401);
			$application->completeRequest();
		}
	}

	/**
	 * Performs login redirect if authorization fails.
	 * This is the event handler attached to application's EndRequest event.
	 * Do not call this method directly.
	 * @param mixed sender of the event
	 * @param mixed event parameter
	 */
	public function leave($sender,$param)
	{
		$application=$this->getApplication();
		if($application->getResponse()->getStatusCode()===401)
		{
			$service=$application->getService();
			if($service instanceof TPageService)
			{
				$returnUrl=$application->getRequest()->getRequestUri();
				$this->setReturnUrl($returnUrl);
                                if ($this->getLoginPath() && ($loginCo = $application->getModule('cms')->getContainer($this->getLoginPath())))
                                        $url = $loginCo->getHref();

                                if (!$url)
                                    $url=$service->constructUrl($this->getLoginPage());
				$application->getResponse()->redirect($url);
			}
		}
	}
	/**
	 * @return string path of login page should login is required
	 */
	public function getLoginPath()
	{
		return $this->_loginPath;
	}

	/**
	 * Sets the login page that the client browser will be redirected to if login is needed.
	 * Login page should be specified in the format of page path.
	 * @param string path of login page should login is required
	 * @see TPageService
	 */
	public function setLoginPath($pagePath)
	{
		$this->_loginPath=$pagePath;
	}

	/**
	 * Performs authentication.
	 * This is the event handler attached to application's Authentication event.
	 * Do not call this method directly.
	 * @param mixed sender of the Authentication event
	 * @param mixed event parameter
	 */
	public function doAuthentication($sender,$param)
	{
                parent::doAuthentication($sender, $param);
                $service=$this->getService();
		if (($service instanceof TPageService) && $this->getLoginPath())
                {
                    $cms = $this->getApplication()->getModule('cms');
                    $loginCo = $cms->getContainer($this->getLoginPath());
                    $curCo = $cms->getContainer();
                    if ($curCo && $loginCo && $curCo->uid == $loginCo->uid)
			$this->_skipAuthorization=true;
                }
	}

}

?>