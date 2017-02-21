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
 * @version	$Id: FJsonDirectProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */
class FJsonDirectProvider extends FJsonComponentProvider {
    const DIRECT_API_KEY='knt:remoting:api';
    private $_api = null;
    private $_namespace = 'Ext.app';
    private $_descriptor = 'REMOTING_API';

    public function getJsonContent() {
    	SWPLogManager::log("This method used to get content database to application's store through direct api",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
        if (!$this->getIsAuthorized()){
        	SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array('success' => false, 'message' => 'Not authorized!'),TLogger::INFO,$this,"getJsonContent","FreshSystem");
            return array('success' => false, 'message' => 'Not authorized!');
        }

        $user = $this->getUser();
        $request = $this->getRequest();
		SWPLogManager::log("Request object",$request,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");

        if ($request['direct'] == 'api') {
            $this->outputApi();
        }


        try {

            $connection = ContainerRecord::finder()->getDbConnection();
            $connection->setActive(true);
/*                    if ($this->context['setNames'])
                    {
                            $cmd = $connection->createCommand('SET NAMES '.$this->context['setNames']);
                            $cmd->execute();
                    } */
            $transaction=$connection->beginTransaction();

            $packet = $request['direct'];

            if (isset($packet['action']) )
                $packet = array($packet);

            foreach ($packet as $data) {

                $action = $data['action'];
                $method = $data['method'];
                $params = $data['data'];
                $api = $this->getApi();

                if (!($rpc = $api['paths'][$action]) || !($this->isValidMethod($action, $method))){
                	SWPLogManager::log("Invalid request!",array('success' => false, 'message' => 'Invalid request!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
                    return array('success' => false, 'message' => 'Invalid request!');
                }


                $c = Prado::createComponent($rpc, $this);

                $retval = call_user_func_array(array($c, $method), $params);


                $answer[] = array(
                    'type' => 'rpc',
                    'tid' =>    $data['tid'],
                    'action' => $action,
                    'method' => $method,
                    'result' => $retval
                );

            }
            $transaction->commit();

            $answer = (count($answer)==1) ? $answer[0] : $answer;

        } catch (Exception $e) {
	
            $answer = array(
                'type' => 'exception',
                'tid' => $data['tid'],
                'message' => $e->getMessage(),
                'where' => $e->getTraceAsString()
            );
        	SWPLogManager::log("This method throws an Exception",$answer,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
            $transaction->rollback();
        }
        SWPLogManager::log("getJsonContent returns Component answer",array('component' => $answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
        return array('component' => $answer);
    }

    protected function isValidMethod($classname, $methodname) {
    	
    	SWPLogManager::log("This method getting class name and method name as parameters",array('Class Name'=>$classname, 'Method Name'=>$methodname),TLogger::DEBUG,$this,"isValidMethod","FreshSystem");
        foreach ($this->_api['actions'][$classname] as $method) {
            if ($method['name'] == $methodname) {
            	SWPLogManager::log("This method returns the method name is valid(true) or not(false)",true,TLogger::INFO,$this,"isValidMethod","FreshSystem");
                return true;
            }
        }
        SWPLogManager::log("This method returns the method name is valid(true) or not(false)",false,TLogger::INFO,$this,"isValidMethod","FreshSystem");
        return false;
    }

    protected function outputApi() {
    	
    	SWPLogManager::log("This method gives response and clears that",null,TLogger::INFO,$this,"outputApi","FreshSystem");
        $retStr = 'Ext.ns(\'{NAMESPACE}\'); {NAMESPACE}.{DESCRIPTOR}={API};';

        $ns = ($this->_namespace) ? $this->_namespace : substr($this->_descriptor, 0, strrpos($this->_descriptor, '.'));

        $api = $this->getApi();
        unset($api['paths']);

        $retval = str_replace('{NAMESPACE}', $ns, $retStr);
        $retval = str_replace('{DESCRIPTOR}', $this->_descriptor, $retval);
        $retval = str_replace('{API}', json_encode($api), $retval);

        $response = $this->getResponse();
        SWPLogManager::log("Response object",$response,TLogger::DEBUG,$this,"outputApi","FreshSystem");
        $response->setContentType('text/javascript');
        $response->setCharset('UTF-8');
        $response->write($retval);
        $response->flush();
        die();
    }

    protected function getApi() {
		
    	SWPLogManager::log("This method getting the Api based on method and no of params parameters",null,TLogger::INFO,$this,"getApi","FreshSystem");
        if ($this->_api === null) {

            if ($cache = $this->getApplication()->getCache()) {
                $api = $cache->get(self::DIRECT_API_KEY);
            }

            if (!$api) {


                $config = $this->mergeLocalConfig();
                $actions = array();
                foreach ($config as $a => $d) {
                    $paths[$a] = ($d['path']) ? $d['path'] : 'FreshSystem.direct.' . $a;

                    $desc = array();
                    if (is_array($d['methods'])){
                        foreach ($d['methods'] as $m => $len) {
                            $desc[] = array(
                                'name' => $m,
                                'len' => $len
                            );
                        }
                    } else {
                        $desc = $this->parseClass($paths[$a]);
                    }

                    $actions[$a] = $desc;
                }


                $api = array(
                    'url' => $this->getRequest()->getBaseUrl(),
                    'type' => 'remoting',
                    'actions' => $actions,
                    'paths' => $paths
                );


                if ($cache) {
                    $cache->set(self::DIRECT_API_KEY, $api);
                }
            }
            $this->_api = $api;
        }
        SWPLogManager::log("This method returns api ",$this->_api,TLogger::INFO,$this,"getApi","FreshSystem");
        return $this->_api;
    }

    private function parseClass($classpath) {
    	
    	SWPLogManager::log("This method getting the class by parameter classpath",$classpath,TLogger::INFO,$this,"parseClass","FreshSystem");
        $c = Prado::createComponent($classpath);
        $classname = get_class($c);
        $class = new ReflectionClass($classname);
        $methods = $class->getMethods();

        $remoteMethods = array();
        foreach ($methods as $method) {
            if (strpos($method->getDocComment(), '@remotable') > 0) {
                $remoteMethods[] = array(
                    'name' => $method->name,
                    'len' => $method->getNumberOfParameters()
                );
            }
        }
		SWPLogManager::log("This method returns Remote Methods from the class",$remoteMethods,TLogger::INFO,$this,"parseClass","FreshSystem");
        return $remoteMethods;
    }

    protected function mergeLocalConfig() {

    	SWPLogManager::log("This method merges the local config(Local types)",null,TLogger::INFO,$this,"mergeLocalConfig","FreshSystem");
        $basePath = $this->getApplication()->getBasePath();
        $blen = strlen($basePath);
        $files = FU::rscandir($this->getPath() . '/');
        $types = array();
        foreach ($files as $file) {
            if (!is_file($file))
                continue;

            $localTypes = array();
            $pp = pathinfo($file );
            //var_dump($pp);
            if ($pp['extension'] == 'php') {

                $name = basename($file,'.php');
                $path = str_ireplace($basePath, 'Application.', $pp['dirname'] . '/' . $name);
                $path = str_replace(array('/', '..', '..'), '.', $path);
                
                $localTypes[$name]['path'] = $path;
            } elseif ($pp['extension'] == 'yml') {
                $localTypes = syck_load_normalized($file);
            } else {
                continue;
            }
            if (is_array($types) && is_array($localTypes)) {
                $types = array_merge($types, $localTypes);
            }
        }
        SWPLogManager::log("This method returns merged types",$types,TLogger::INFO,$this,"mergeLocalConfig","FreshSystem");
        return $types;
    }

    public function getAuthLevel() {
    	
		SWPLogManager::log("This method Gets Authentication level",null,TLogger::INFO,$this,"getAuthLevel","FreshSystem");
        if ($this->Request['direct']=='api')
                return null;
		SWPLogManager::log("This method returns Authentication level",parent::getAuthLevel(),TLogger::INFO,$this,"getAuthLevel","FreshSystem");
        return parent::getAuthLevel();

    }

}

?>