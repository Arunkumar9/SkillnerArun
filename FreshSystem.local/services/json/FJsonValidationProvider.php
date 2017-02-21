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
 * @version	$Id: FJsonValidationProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class FJsonValidationProvider extends FJsonComponentProvider
{
	private $_path=null;
    private $_expire = null;
    protected $finder;
    protected $config;
    protected $context;
    protected $metadata;

	public function getJsonContent()
	{
		if (!$this->getIsAuthorized())
			return array('success'=>false, 'message'=>'Not authorized!');

		$user = $this->User;
		$request = Prado::getApplication()->Request;

        $username = $request['username'];
        $password = $request['password'];
        $action = ($request['action']=='logout')?$request['action']:'login';
        
   		//if ((!$username || !$password) && $action == 'login')
		//	return array('success'=>false, 'message'=>'Bad request!');
					
					
        $answer = $this->$action($username,$password);
        
        return array('component'=>$answer);

	}

    protected function login($username,$password)
    {
        


        $auth = Prado::getApplication()->getModule('auth');

        if (!$this->User->IsGuest && $this->User->Username == $username) 
        {

            return array('success'=>true, 
                'message'=>'Already logged!','result'=>unserialize($this->User->saveToString()));            
        }
        elseif ($auth->login($username,$password,$this->Expire))
        {

             return array('success'=>true, 
                'message'=>'Successfull login!','result'=>unserialize($this->User->saveToString()));
            
        }
        else
        {
            return array('success'=>false, 
                'message'=>'Unsuccessfull login!','errors'=>array('username'=>'Bad password or username','password'=>'Bad password or username'));
            
        }
    }
    
    protected function logout($username,$password)
    {
        
        $auth = Prado::getApplication()->getModule('auth');
        
        $auth->logout();
            
        return array('success'=>true, 
                'message'=>'Successfull logout!');
    }

    public function getExpire()
    {
        return $this->_expire;
    }
	
    public function setExpire($value)
    {
        $this->_expire = $value;
    }
}
?>