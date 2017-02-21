<?php
/* FJsonService.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 17.10.2006
 */

Prado::using('System.Web.Services.TJsonService'); 
if (!function_exists('json_encode')) {
    function json_encode($array)
    {
        $json = Prado::createComponent('System.Web.Javascripts.TJSON');
        return $json->encode($array);
    }
}

class FJsonService extends TJsonService
{
    const   SEPARATOR='/* --- */';
	private $_modules=array();
	private $_templateManager;
	private $_context;
	private $_page;

	/**
	 * Initializes this module.
	 * This method is required by the IModule interface.
	 * @param TXmlElement configuration for this module, can be null
	 */
	public function init($xml)
	{
		parent::init($xml);
		$this->loadJsonModules($xml);
		$this->initModules();
	}
	
	/**
	 * @return TTemplateManager template manager
	 */
	public function getTemplateManager()
	{
		if(!$this->_templateManager)
		{
			$this->_templateManager=new TTemplateManager;
			$this->_templateManager->init(null);
		}
		return $this->_templateManager;
	}

	/**
	 * @param TTemplateManager template manager
	 */
	public function setTemplateManager(TTemplateManager $value)
	{
		$this->_templateManager=$value;
	}

	protected function loadJsonModules($xml)
	{
			// modules
			foreach($xml->getElementsByTagName('module') as $node)
			{
				$properties=$node->getAttributes();
				$type=$properties->remove('class');
				$id=$properties->itemAt('id');
				if($type===null)
					throw new TConfigurationException('jsonserviceconf_moduletype_required',$id);
				$node->setParent(null);
				if($id===null)
					$this->_modules[]=array($type,$properties->toArray(),$node);
				else
					$this->_modules[$id]=array($type,$properties->toArray(),$node);
			}
	}
	
	protected function initModules()
	{
		$application=$this->getApplication();

		// load modules specified in page directory config
		$modules=array();
		foreach($this->_modules as $id=>$moduleConfig)
		{
			Prado::trace("Loading module $id ({$moduleConfig[0]})",'System.Web.Services.FJsonService');
			$module=Prado::createComponent($moduleConfig[0]);
			if(is_string($id))
				$application->setModule($id,$module);
			foreach($moduleConfig[1] as $name=>$value)
				$module->setSubProperty($name,$value);
			$modules[]=array($module,$moduleConfig[2]);
		}
		foreach($modules as $module)
			$module[0]->init($module[1]);
		
		//$application->getAuthorizationRules()->mergeWith($pageConfig->getRules());
	}


	/**
	 * Renders content provided by TJsonResponse::getJsonContent() as
	 * javascript in JSON format.
	 */
	protected function createJsonResponse($service,$properties,$config)
	{
		// init service properties
		foreach($properties as $name=>$value)
			$service->setSubproperty($name,$value);
		$service->init($config);
		$this->setContext($service);
		//send content if not null
		
		if(extension_loaded('newrelic')) {
						newrelic_name_transaction (get_class($service));
						newrelic_add_custom_parameter ('context', $this->Request['context']);
						newrelic_add_custom_parameter ('action', $this->Request['action']);
		}
		try 
        {
            if (!$service->getIsAuthorized()) {
                
                $this->Response->StatusCode = 403;
                $content = array('component'=>array ('success'=>false, 'message'=>'Not authorized!', 'error'=>1));
/*
                //
                if(!headers_sent())
        			header("HTTP/1.0 403 Forbidden");
                //return;
                //throw new THttpException('Forbidden');

*/
            }
            else
                $content=$service->getJsonContent();
				
            if($content === null)
                throw new FJsonException('Service returned no content.');

			$jsonString = json_encode($content['component']);
			
			if (is_array($content['references']))
				foreach($content['references'] as $r => $v)
				{
					$value = json_encode($content['references'][$r]);
					$content['references'][$r] = $this->jsonDeQuote($value,$service->DeQUote);
				}
                                    
			$jsonString = $this->jsonDeQuote($jsonString,$service->getDeQuote());
			$jsonString = $this->jsonDeReference($jsonString,$content['references']);

			if (is_array($content['objects']))
            {
				foreach($content['objects'] as $r => $v)
				{
					$value = json_encode($content['objects'][$r]);
                    $value = $this->jsonDeQuote($value,$service->DeQUote);
					$content['objects'][$r] = $this->jsonDeReference($value,$content['references']);
				}
                
                $objects = implode(self::SEPARATOR,$content['objects']);
                $jsonString = $objects.self::SEPARATOR.$jsonString;
            }
/*
			if ($content['using'])
            {
                $using = (is_array($content['using']))?$content['using']:array($content['using']);
                $jsonUsing = json_encode($using);
                $jsonUsing = $this->jsonDeQuote($jsonUsing,$service->getDeQUote());
                $jsonString = $jsonUsing.self::SEPARATOR.$jsonString;
            }

*/            if ($content['description']['userfy'])
                $jsonString = $this->jsonUserfy($jsonString);
        }
        catch (FJsonException $e) {
             $message = $e->getMessage();
		   $this->Response->StatusCode = 200;
			 if(!headers_sent() && preg_match('/not authorized|access denied/is',$message)) {
        			header("HTTP/1.0 403 Forbidden");
					$this->Response->StatusCode = 403;
			 }
			 if(!headers_sent() && preg_match('/not_exist|not exist|Bad request/is',$message)) {
        			header("HTTP/1.0 404 Not found");
					$this->Response->StatusCode = 404;
			 }
			 if(!headers_sent() && preg_match('/Internal error/is',$message)) {
        			header("HTTP/1.0 500 Server error");
					$this->Response->StatusCode = 200;
			 }
			 if (strpos($_SERVER['HTTP_HOST'],'api.') !== false) {
				list($message,) = explode('<br>',$message);
			 }
             $jsonString = json_encode(array('success'=>false,'message'=>$message));
			 
        }
        
 		$response = $this->getResponse();
 		
		if (!$response->ContentType) {
	 		if ( $this->Request['jsoncallback'] ) {
				$response->setContentType('text/javascript');
			} else {
				$response->setContentType('application/x-json');
			}
		}
	 		
	 
 		$response->setCharset('UTF-8');
		$jsonString = trim($jsonString);
		if ($cb = $this->Request['jsoncallback'])
			 $jsonString = "$cb($jsonString)";
		$response->write($jsonString);
	}
    
    /**
     * Replaces set of user identifying tokens in final json string;
     * @return 
     * @param $value Object
     */
    protected function jsonUserfy($value)
    {
       $user = Prado::getApplication()->getUser();
       $return = str_ireplace(array('%UserLevel%','%UserUid%','%UserName%','%UserFullName%'),
                                 array($user->Level,$user->Uid,$user->Username,$user->Name),
                                 $value);
        
    }
 	/**
     * 
     * Accepts a JSON-encoded string, and removes quotes around values of
     * keys specified in the $keys array.
     * 
     * Sometimes, such as when constructing behaviors on the fly for "onSuccess"
     * handlers to an Ajax request, the value needs to **not** have quotes around
     * it. This method will remove those quotes and perform stripslashes on any
     * escaped quotes within the quoted value.
     * 
     * @param string $encoded JSON-encoded string
     * 
     * @param array $keys Array of keys whose values should be de-quoted
     * 
     * @return string $encoded Cleaned string
     * 
     */
    protected function jsonDeQuote($encoded, $keys, $references=null)
    {
        if (is_array($keys))
		{
			foreach ($keys as $key) {
	            $pattern = "/(\"".$key."\"\:)(\".*(?:[^\\\]\"))/U";
	            $encoded = preg_replace_callback(
	                $pattern,
	                array($this, '_stripvalueslashes'),
	                $encoded
	            );
				
	        }
		}

        $pattern = '/("[\@\^].*(?:[^\\\]"))/U';
        $encoded = preg_replace_callback(
            $pattern,
            array($this, '_stripvalueslashes1'),
            $encoded
        );

       
        return $encoded;
    }
	
	protected function jsonDeReference($encoded,$references=array())
	{
		if (is_array($references))
			foreach ($references as $key => $value)
			{
			//echo $key.' '.'<br>';
				$encoded = str_replace("%".$key."%",$value,$encoded);
			}
		
		return $encoded;
	}
    
    /**
     * 
     * Method for use with preg_replace_callback in the _deQuote() method.
     * 
     * Returns \["keymatch":\]\[value\] where value has had its leading and
     * trailing double-quotes removed, and stripslashes() run on the rest of
     * the value.
     * 
     * @param array $matches Regexp matches
     * 
     * @return string replacement string
     * 
     */
    protected function _stripvalueslashes($matches)
    {
        return $matches[1].stripslashes(substr($matches[2], 1, -1));
    }	
    protected function _stripvalueslashes1($matches)
    {
        return stripslashes(substr($matches[1], 2, -1));
    }	
	
	public function setContext($value)
	{
		if ($value instanceof TJsonResponse)
			$this->_context = $value;
	}
	
	public function getContext()
	{
		return $this->_context;
	}
	
	public function getRequestedPage()
	{
		if ($this->_page === null)
			$this->_page = new FBasePage;
		return $this->_page;
	}
	
	public function constructUrl($path,$params=array(),$encodeAmp=true,$encodeGetItems=true)
	{
		return $this->Request->constructUrl('page',$path,$params,$encodeAmp,$encodeGetItems);
	}
	
}
 
?>
