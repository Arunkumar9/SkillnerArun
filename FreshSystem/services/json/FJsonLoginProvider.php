 <?php
/**
 * 
 * @project Fresh!
 * 
 * @package Fresh.web.services.json

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: FJsonLoginProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class FJsonLoginProvider extends FJsonComponentProvider
{
	private $_path=null;
    private $_expire = null;
	private $_auth = null;
    protected $finder;
    protected $config;
    protected $context;
    protected $metadata;

	public function getJsonContent()
	{
		if (!$this->getIsAuthorized()){
			
			SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array('success'=>false, 'nessage'=>'Not authorized!'),TLogger::INFO,$this,"getJsonContent","FreshSystem");
			return array('success'=>false, 'message'=>'Not authorized!');
		}

		$user = $this->User;
		$request = Prado::getApplication()->Request;
		SWPLogManager::log("Request object.",$request,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");
        $username = $request['username'];
        $password = $request['password'];
        $plain = $request['plain'];
        $action = ($request['action']=='logout')?$request['action']:'login';
		$rid = $request['rid'];
        $this->_auth = ($request['auth'])?$request['auth']:'auth';
   		//if ((!$username || !$password) && $action == 'login')
		//	return array('success'=>false, 'message'=>'Bad request!');
					
					
        $answer = $this->$action($username,$password,$rid,$plain);
        
        SWPLogManager::log("getJsonContent return value.",array('component'=>$answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
        return array('component'=>$answer);

	}

    protected function login($username,$password,$rid=false,$plain=false)
    {
        SWPLogManager::log("login method getting username,password,rid and plain as parameters.",array('username'=>$username,'password'=>$password,'rid'=>$rid,'plain'=>$plain),TLogger::INFO,$this,"login","FreshSystem");
        $auth = $this->getAuth();
	   if ($plain) {
		   $password = sha1($password);
	   }

        if (!$this->User->IsGuest && $this->User->Username == $username) 
        {

			$res = array('success'=>true, 
                'message'=>Prado::localize('Already logged!'));            
			if ($rid) {
				$res[$rid] = $this->getSession()->SessionID;
			}
			else {
				$res['result'] = unserialize($this->User->saveToString());
			}
			SWPLogManager::log("if login user not Guest and username must be login username,then login method return value is ",$res,TLogger::INFO,$this,"login","FreshSystem");
			return $res;

        }
        elseif ($auth->login($username,$password,$this->Expire))
        {

			$res = array('success'=>true, 
			   'message'=>Prado::localize('Successfull login!'));
			if ($rid) {				
				$res[$rid] = $this->getSession()->SessionID;
			}
			else {
				$res['result'] = unserialize($this->User->saveToString());
			}
			SWPLogManager::log("if login user Session not expired,then login method return value is ",$res,TLogger::INFO,$this,"login","FreshSystem");
			return $res;
            
        }
        else
        {
        	SWPLogManager::log("if logedin user not login successfull,then login method return value is ",array('success'=>false,'message'=>Prado::localize('Unsuccessfull login!'),'errors'=>array('username'=>Prado::localize('Bad password or username'),'password'=>Prado::localize('Bad password or username'))),TLogger::INFO,$this,"login","FreshSystem");
            return array('success'=>false,'message'=>Prado::localize('Unsuccessfull login!'),'errors'=>array('username'=>Prado::localize('Bad password or username'),'password'=>Prado::localize('Bad password or username')));
            
        }
    }
    
    protected function logout($username,$password)
    {
        SWPLogManager::log("logout method expecting username,password as params ",array('params'=>$username.'  '.$password),TLogger::INFO,$this,"logout","FreshSystem");
        $auth = $this->getAuth();
        
        $auth->logout();
        $msg = Prado::localize('Successfull logout!');
        SWPLogManager::log("logout method return value is ",array('success'=>true,'message'=>$msg),TLogger::INFO,$this,"logout","FreshSystem");   
        return array('success'=>true,'message'=>$msg);
    }

    public function getExpire()
    {
    	SWPLogManager::log("getExpire method return expire status ",$this->_expire,TLogger::INFO,$this,"getExpire","FreshSystem");
        return $this->_expire;
    }
	
    public function setExpire($value)
    {
    	SWPLogManager::log("setExpire method expecting expire value as param and setting that value to expire object ",$value,TLogger::INFO,$this,"setExpire","FreshSystem");
        $this->_expire = $value;
    }
	
	public function getAuth()
	{
		$res = Prado::getApplication()->getModule($this->_auth);
		SWPLogManager::log("getAuth method return author module ",$res,TLogger::INFO,$this,"getAuth","FreshSystem");
		return $res;
	}
}
?>