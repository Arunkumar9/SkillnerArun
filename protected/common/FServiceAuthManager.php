<?php
/**
 * TAuthManager class file
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Id: FServiceAuthManager.php 2348 2013-12-20 10:20:54Z arun $
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
 * @version $Id: FServiceAuthManager.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Security
 * @since 3.0
 */
class FServiceAuthManager extends TAuthManager
{

}

?>