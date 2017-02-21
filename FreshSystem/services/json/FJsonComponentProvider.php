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
 * @version	$Id: FJsonComponentProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class FJsonComponentProvider extends FJsonResponse
{
    private $_path=null;
	private $_ymlcfg=null;
    protected $_finder;
    protected $config;
    protected $context;
    protected $metadata;

    

	public function getJsonContent()
	{
		SWPLogManager::log("getJsonContent method is to get the json content related to request id",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
		if (!$this->getIsAuthorized()){
			SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array('success'=>false, 'message'=>'Not authorized!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			return array('success'=>false, 'message'=>'Not authorized!');
		}

		$user = $this->User;
		SWPLogManager::log("user object",$user,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");
		$request = Prado::getApplication()->Request;

		if (!($id = $request['id'])){
			SWPLogManager::log("Bad request!",array('success'=>false, 'message'=>'Bad request!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			return array('success'=>false, 'message'=>'Bad request!');
		}
					
					
		$key = $id;

        $data = $this->getYamlData($key);
		
		//var_dump($data);die();
        $data['component']['success'] = true;
	    SWPLogManager::log("getJsonContent method returns json content array ",$data,TLogger::INFO,$this,"getJsonContent","FreshSystem");
		return $data;

	}

    /**
     * Reads hash array from yaml file defined by $key
     * @return Array
     * @param $key String    Key to define component
     * @param $cache Boolean[optional]    Use cache (default=true)
     */
    public function getYamlData($key,$cache=true)
    {
/*        $application = Prado::getApplication();
        $cacheKey = $key.$this->getUser()->Username;
		if($cache && $application->Cache) {
		    // retrieves data item from cache
		    $data=$application->Cache->get($cacheKey);
		}		
		
		if (!$data)
		{
			Prado::using('Root.lib.spyc.spyc');

			$yaml = @file_get_contents($this->Path.'/'.$key.'.yml');
			if (!$yaml)
                throw new FJsonException('Component '.$key. ' not exists!');

			$data = $this->readYaml($yaml);
            
            if ($data['description']['authLevels'])
            {
                $this->dataFilter(&$data); 
               // var_dump($data)   ;
            }
			if($cache && $application->Cache) {
			    // saves data item in cache
			    $application->Cache->set($cacheKey,$data);
			}		
			
		}
  return $data;      */
//        return FYaml::reader($key,$this->Path)->getData();
		  $data = $this->getYamlConfig()->read($key)->getContext()->data;
	  	  SWPLogManager::log("getYamlData method returns yml Data",$data,TLogger::INFO,$this,"getYamlData","FreshSystem");
          return $data;
    }
    
    public function filterBy(&$value,&$key,$method)
    {
		SWPLogManager::log("filterBy method getting parameters",array("value" => $value,"key" => $key,"method" => $method),TLogger::INFO,$this,"filterBy","FreshSystem");
        static $user;
        $user = (!$user)?$this->getUser():$user;
        if (is_array($value))
        {
             //echo $key."<br>";

            array_walk($value,array($this,$method),$method);
            $assoc = false;
            $changed = false;
            foreach($value as $k=>$v)
            {
                if (!is_numeric($k))
                    $assoc = true;
                if (is_array($v)) {
                        
                    if (isset($v['authLevel']) && 
                             ($v['authLevel']['min'] > $user->Level || 
                                 $user->Level > $v['authLevel']['max']) || 
                             isset($v['authRole']) && !$user->IsInRole($v['authRole'])
                    )
                    {
                   //     echo $k.' '.$v['authLevel']['min']."\n";
                       unset($value[$k]);
                       $changed = true;
                    }
                }
                
            }
            if (!$assoc && $changed)
                $value = array_values($value);
        }
/*        else
        {
//echo $user->Level;
            //echo $value;
            $value = str_replace(array('%UserLevel%','%UserUid%','%UserName%','%UserFullName%'),
                                 array($user->Level,$user->Uid,$user->Username,$user->Name),
                                 $value
            );
        }*/
    }
    
    public function dataFilter(&$data,$method='filterBy')
    {
		SWPLogManager::log("dataFilter filters the data",array("Data"=>$data,"filterBy method"=>$method),TLogger::INFO,$this,"dataFilter","FreshSystem");
        array_walk($data,array($this,$method),$method);
    }


	/**
	 * Reads yaml string and 
	 * @return 
	 * @param $yaml Object
	 */
	public function readYaml($yaml)
	{
		
		//$yaml = str_replace('%user%',$this->User,$yaml);
		$data = Spyc::YAMLLoad($yaml);
		SWPLogManager::log("readYaml returns the data",$data,TLogger::INFO,$this,"readYaml","FreshSystem");
		return $data;
	}

	/**
	 * @return string	path to YAML config files 
	 */
	public function getPath()
	{
		SWPLogManager::log("getPath returns the path",$this->_path,TLogger::INFO,$this,"getPath","FreshSystem");
		return $this->_path;
	}	


	/**
	 * @param string path to YAML in Prado dot format
	 */
	public function setPath($value)
	{
		SWPLogManager::log("setPath sets the path",$value,TLogger::INFO,$this,"setPath","FreshSystem");
		$this->_path=Prado::getPathOfNamespace($value);
	}

	/**
	 * @return appropriate YamlConfig module 
	 */
	public function getYamlConfig()
	{
        $cfg = ($this->_ymlcfg)?$this->_ymlcfg:'jsonCmpConfig';
		SWPLogManager::log("getYamlConfig returns the config",$this->getApplication()->Modules[$cfg],TLogger::INFO,$this,"getYamlConfig","FreshSystem");
        return $this->getApplication()->Modules[$cfg];
	}	


	/**
	 * @param string id of YamlConfig module
	 */
	public function setYamlConfig($value)
	{
		SWPLogManager::log("setYamlConfig method sets the config",$value,TLogger::INFO,$this,"setYamlConfig","FreshSystem");
		$this->_ymlcfg=$value;
	}

    public function setContext($data,$contextName)
    {
        SWPLogManager::log("setContext method getting two parameters",array("data" => $data,"contextName" => $contextName),TLogger::INFO,$this,"setContext","FreshSystem");
        $this->config = $data['serverSide'];
        $this->metadata = $data['metaData'];
        
        if ($contextName === null)
        {
            $context = $this->config;
            unset($context['context']);
        }
        else
        {
            $context = $this->config['context'][$contextName];
            foreach($this->config as $key=>$val) 
            {
                if ($key != 'context' && !isset($context[$key])) {
                    $context[$key] = $val;
                }
                unset($context['noBlankContext']);
            }
        }
        $this->context = $context;
        
    }
               
    public function evalError($message)
    {
    	SWPLogManager::log("evalError method evaluating the Error",$message,TLogger::INFO,$this,"evalError","FreshSystem");
        foreach($this->context['errors'] as $msg)
        {
            //var_dump($msg);
            
            if (preg_match($msg['regexp'],$message,$m))
            {
               array_shift($m);
			   SWPLogManager::log("evalError method returns message",array("MessageText"=>$msg['text'],"Message"=>$m),TLogger::INFO,$this,"evalError","FreshSystem");
               return vsprintf ($msg['text'],$m);
            }
            
        }
    }
    
	public function getFinder() {
		SWPLogManager::log("getFinder method gets the finder",null,TLogger::INFO,$this,"getFinder","FreshSystem");
		if ($this->_finder === null) {
			$this->_finder = call_user_func(array($this->context['recordClass'], 'finder'));
		}
		SWPLogManager::log("getFinder method returns finder",$this->_finder,TLogger::INFO,$this,"getFinder","FreshSystem");
		return $this->_finder;
	}

	public function setFinder(TActiveRecord $value) {
		SWPLogManager::log("setFinder method sets the finder",$value,TLogger::INFO,$this,"setFinder","FreshSystem");
		$this->_finder = $value;
	}
        
	protected function postSqlCondition($r)
    {
            //
            // post sql conditions e.g. access criteria
            //
            SWPLogManager::log("postSqlCondition method executes the condition",$r,TLogger::INFO,$this,"postSqlCondition","FreshSystem");
            $postSql = $this->context['postSqlCondition'];
            if (is_array($postSql)) {
                foreach($postSql as $method)
                    if (!$r->$method()) return false;
            }
            elseif ($postSql && !$r->$postSql())
                return false;

            SWPLogManager::log("postSqlCondition method returns true",true,TLogger::INFO,$this,"postSqlCondition","FreshSystem");
            return true;
    }
}


class FJsonException extends TException {}

class FJsonRecordProvider extends FJsonResponse
{
	const MAX_ORDERING = 65534;
	
	public function getJsonContent()
	{
		SWPLogManager::log("This method used to get the json content related to record class",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
		if (!$this->getIsAuthorized()){
			SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array('success'=>false, 'message'=>'Not authorized!'),TLogger::INFO,$this,"getJsonContent","FreshSystem");
			return array('success'=>false, 'message'=>'Not authorized!');
		}

		$json = Prado::createComponent('System.Web.Javascripts.TJSON');

		$request = Prado::getApplication()->Request;
		SWPLogManager::log("request object",$request,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");
		$action = $request['action'];
		$recordClass = $request['record'];
		
		if (!$action || !$recordClass){
			SWPLogManager::log("Not an action",array('success'=>false, 'message'=>'Bad request!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			return array('success'=>false, 'message'=>'Bad request!');
		}

		$finder = call_user_func(array($recordClass, 'finder'));
		//$rec = new $recordClass;
		$recordFields = $finder->RecordGateway->getRecordTableInfo($finder)->LowerCaseColumnNames;		

		$uid = $request['uid'];
		$tid = $request['template'];
		
		if ($uid == 'null')
			$uid = null;

		if ($action == 'store')
		{		
			if (!$uid)
			{
				if ($tid && $recordClass == 'ContainerRecord')
				{
					$record = $this->copyTemplate($tid);
				} else {
					$record = new $recordClass;
				}

				$record->created = time();
				$record->changed = time();
				if (property_exists($record,'ordering')) //property_exists($record,'ordering'))
					$record->ordering = constant($recordClass.'::MAX_ORDERING');
				if (isset($recordFields['t']))
					$record->t = str_replace('record','',strtolower($recordClass));
			} else {
				$record = $finder->findByPk($uid);
				$record->changed = time();
			}
		
			foreach($recordFields as $k => $v)
			{
				if (isset($request[$k]) && $k != 'uid')
				{
					if (!($tid && $recordClass == 'ContainerRecord') || $k!='type_id')
					{
						$record->$k = $record->ensurePropertyValue($k,$request[$k]);
					}
				}
			}

			if (isset($recordFields['parent_id'])) {
				if ($record->parent_id == 'undefined')
					$record->parent_id = null;
			}
			
			if (property_exists($record,'type_id'))
			{
				$typeData = FU::readValues($record->type->data);
				foreach($typeData as $k => $v)
				{
					if (isset($recordFields[$k]) && !isset($request[$k]) && $k != 'uid')
						$record->$k = $v;
				}
			}
			
			try {
				$record->save();
				if (isset($recordFields['ordering']))
					$record->reorderBranch($record->parent_id);
	
				$class_var = get_class_vars($recordClass);
				//Prado::Trace('OOOBje'.TVarDumper::dump($obj_var));
				if (isset($class_var['RELATIONS']['children']) && property_exists($record,'hidden'))				
					$record->childrenAttributes(array('hidden'=>$record->hidden));	
				SWPLogManager::log("getJsonContent method returns true",array('success'=> true),TLogger::ERROR,$this,"getJsonContent","FreshSystem");				
				return array('success'=> true); //,'errors'=>array('field'=>array('id'=>'name','msg'=>'Error')));
			}
			catch (Exception $e) {
				SWPLogManager::log("SQL Error!",array('success'=>false,'message'=>'SQL Error!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
				return array('success'=>false,'message'=>'SQL Error!');
			}
		}
		
		if ($action == 'load' && $uid)
		{
			$record = $finder->findByPk($uid);
			
			$values = array();
			
			foreach($recordFields as $k => $v)
			{
				$values[] = array('id'=>$k,'value'=>$record->$k);
			}	
			SWPLogManager::log("Success",array('success'=>true,'data'=>$values),TLogger::INFO,$this,"getJsonContent","FreshSystem");		
			return array('success'=>true,'data'=>$values);
			
		}
		SWPLogManager::log("Bad action requested!",array('success'=>false,'message'=>'Bad action requested!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
		return array('success'=>false,'message'=>'Bad action requested!');

	}
		
	public function copyTemplate($tid,$recordClass='ContainerRecord',$rec = null)
	{
		SWPLogManager::log("copyTemplate method Copies the Template",array("params" =>array($tid,$recordClass,$rec)),TLogger::INFO,$this,"copyTemplate","FreshSystem");
		if (!($rec instanceof TActiveRecord))
			$rec = new $recordClass;
			
		if ($tid instanceof TActiveRecord) {
			$c = $tid;
		} else {
			$finder = call_user_func(array($recordClass, 'finder'));
			$c = $finder->withContents()->findByPk($tid);
		}
		$rec->copyFrom($c);
		$rec->uid = null;
		foreach($c->contents as $child)
		{
			$data = get_object_vars($child);
			unset($data['parent_id']);
			unset($data['uid']);
			$co = new ContentRecord($data);
			//$co->uid = null;
			$rec->contents[] = $co;
			
		}
		foreach ($c->children as $child) {
			$rec->childrem[] = $this->copyTemplate($child);
		}
		SWPLogManager::log("copyTemplate method returns record",$rec,TLogger::INFO,$this,"copyTemplate","FreshSystem");
		return $rec;
	}

    public function evalError($message)
    {
    	SWPLogManager::log("evalError method evaluating the Error",$message,TLogger::INFO,$this,"evalError","FreshSystem");
        foreach($this->context['errors'] as $msg)
        {
            //var_dump($msg);
            
            if (preg_match($msg['regexp'],$message,$m))
            {
               array_shift($m);
               SWPLogManager::log("evalError method returns message",array ("Message text"=>$msg['text'],"Message"=>$m),TLogger::INFO,$this,"evalError","FreshSystem");
               return vsprintf ($msg['text'],$m);
            }
            
        }
    }

    
}
?>
