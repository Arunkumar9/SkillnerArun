<?php


    if (true || !function_exists('syck_load'))
    {
		Prado::using('FreshSystem.3rdparty.spyc.spyc');
        function syck_load_normalized($string)
        {
            return Spyc::YAMLLoad(str_replace("\t",'    ',$string));
        }
    }
	else
	{
        function syck_load_normalized($string)
		{
            return syck_load(str_replace("\t",'    ',$string));
		}		
	}
    
    class FYamlConfig extends TModule
    {

        /**
         * These to be overiden when extending class for another usecase;
         */
        protected $exceptionClass = 'FJsonException';
        protected $exceptionMessages = array(
            'wrong_name' => 'component_not_exists',
        );
        
        
        protected $Name;
        protected $_cache;
        protected $_path;
        protected $_context;

        /*
         * @return  Object singleton instance of this class
         * @param $key String    Key to define component
         * @param $cache Boolean[optional]    Use cache (default=true)
        public static function reader($name,$path,$cache=true)
        {
            //static $instance=null;
            
            if ($instance === null) {
                $instance = new FYaml();
            }
            $instance->Name = $name;
            $instance->Cache = $cache;
            $instance->Path = $path;
            return $instance;
        }
         */
        
        public function init($config) {
            
            parent::init($config);            
            
        }
        
    	/**
    	 * @return bool	cache yaml 
    	 */
    	public function getCache()
    	{
    		return $this->_cache;
    	}	

    	/**
    	 * @param bool	cache yaml
    	 */
    	public function setCache($value)
    	{
    		$this->_cache = TPropertyValue::ensureBoolean($value);
    	}	

    	/**
    	 * @return string	path to YAML config files 
    	 */
    	public function getPath()
    	{
    		return $this->_path;
    	}	
    
        public function getSelf()
        {
            return $this;
        }
        
    
    	/**
    	 * @param string path to YAML in Prado dot format
    	 */
    	public function setPath($value)
    	{
    		$this->_path=Prado::getPathOfNamespace($value);
    	}

        protected function getCacheKey()
        {
            return $this->getUser()->Username.':'.$this->Name.':'.$this->getApplication()->getGlobalization()->getCulture();
        }
        
        protected function throwException($msg)
        {
            $exc = $this->exceptionClass;
//            die($msg.$this->Name);
            throw new $exc($this->exceptionMessages[$msg],$this->Name,$this->User->Username);
        }

        protected function readYaml($string)
        {
            // return Spyc::YAMLLoad($string);
            return syck_load_normalized($string);
        }
        
        protected function OnPreYamlLoad($param)
        {
            $this->raiseEvent('OnPreYamlLoad',$this,$param);
  		}

        protected function OnPreCache($param)
        {
            $this->raiseEvent('OnPreCache',$this,$param);
        }

        protected function OnPostCache($param)
        {
            $this->raiseEvent('OnPostCache',$this,$param);
        }
        
        protected function OnYamlLoad($param)
        {
         //   var_dump($param->data);
           // die();
            $this->raiseEvent('OnYamlLoad',$this,$param);
        }
        
        
        /**
         * Parses the yml format file for <%include path.to.include %>
         * and includes the files
         * 
         * TODO: parse ids in included file, algorithm to achieve this
         * parse other tags in inlcuded file first? Probably not
         * @return 
         * @param $sender Object
         * @param $param Object
         */
        public function parseIncludes($sender,$param)
        {
    
            $lines = explode("\n",$param->yaml);
            $newLines = array();
            foreach ($lines as $line) {
                
                if (strpos(trim($line),'#')===0)
                    continue;

                $line = rtrim($line);
                $pos = strpos($line,'<%include');
                if ($pos !== false && preg_match('/^(.*?)<%include(.*?)%>/',$line,$m)) 
                {
                    $path = Prado::getPathOfNamespace($m[2],'.yml');
                    if (!$path)
                        $path = $this->Path.DIRECTORY_SEPARATOR.str_replace('.',DIRECTORY_SEPARATOR,$m[2]).'.yml';
                        
                    $indent = str_repeat(' ',$pos);
                    $ilines = @file($path);
                    $first = true;
                    foreach ($ilines as $iline)
                    {
                        if (strpos(trim($iline),'#')===0)
                            continue;
                        
                        if ($first) {
                            $newLines[]= $m[1].rtrim($iline);
                            $first = false;
                        } else {
                            $newLines[]= $indent.rtrim($iline);
                        }
                    }
                } else {
                    $newLines[] = $line;
                }
            }
            return implode("\n",$newLines);
        }



        public function parseNameParamsAndExpressionTags($sender,$param)
        {
            foreach($param->nameParams as $k=>$v)
                $param->yaml = str_replace('%param'.$k.'%',$v,$param->yaml);

            $param->yaml = FU::parseExpressionTags($param->yaml);
			///Prado::Trace(Prado::getApplication()->Globalization->Culture,'YamlConfig');
        }

        public function parseExpressionTags($sender,$param)
        {
            $param->yaml = FU::parseExpressionTags($param->yaml);
        }

        public function authModify($sender,$param)
        {
            if ($param->data['description']['authLevels'])
                $this->filterByAuth($param->data);
          //      array_walk(&$data,array($this,$method),$method);    array_walk is buggy    
        }

        public function attachStores($sender,$param)
        {
            $this->findStores($param->data['component'],$param->data['objects']);
        }

        public function authModifyattachStores($sender,$param)
        {
            if ($param->data['description']['authLevels'])
                $this->filterByAuth($param->data);
            if ($param->data['description']['findStores'])
                $this->findStores($param->data['component'],$param->data['objects']);
        }

        protected function filterByAuth(&$data)
        {
            static $user;
            
            $user = (!$user)?$this->getUser():$user;
            foreach ($data as $key =>$value) {
                if (is_array($value))
                {
//                    array_walk(&$value,array($this,$method),$method);
                    $this->filterByAuth($value);
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
                               unset($data[$key][$k]);
                               $changed = true;
                            }
                        }
                        
                    }
                    if (!$assoc && $changed)
                        $data[$key] = array_values($value);
                }
            }
        }


        protected function findStores(&$data,&$objects)
        {
            foreach ($data as $key =>$value) {
                if (is_array($value))
                {
                    $this->findStores($data[$key],$objects);
                }
                elseif ($key === 'store') {
                    //$parts = explode('-', $value);
                    //$kstore = strtolower(unshift($parts));
                    //foreach($parts as $part)
                    //    $kname .= ucfirst($part);
                    $local = (strpos($value, 'global-')===false) ? 'local' : 'global';
                    $value = str_replace('global-', '', $value);
                    $data[$key]=$value;
                    $view = str_replace('-store', '-view', $value);
                    $kstore = ucwords(str_replace('-', ' ', $value));
                    $kstore = str_replace(' ', '', $kstore);
                    foreach($objects as $obj)
                    {
                        if (strcasecmp($obj['name'],$kstore)==0)
                                return;
                    }

                    array_unshift($objects,array(
                      'name' =>  $kstore,
                      'evalTo'=> $local,
                      'definition' => "new Fresh.data.ViewProvider({ id: '$value'})"
                    ));
                }
            }
        }

        /**
         * Reads hash array from yaml file defined by $name
         * @param  String    name of yaml file without .yml
         * @return Array
         */
        public function read($name,$asString=false)
        {
            $application = $this->getApplication();
            $this->Name = $name;
            $cacheKey = $this->getCacheKey();

            if (!$asString && !preg_match('/^[0-9a-z\-]+$/',$name))
                $this->throwException('wrong_name',$param);

            $param = new TEventYamlParameter($this->Name,$this->Path);
            $this->OnPreCache($param); 
    		if($this->getCache() && $application->getCache() ) 
    		    $param->data = $application->getCache()->get($cacheKey);
    		
    		if (!$param->data)
    		{
				if ($asString)
				{
					$param->yaml = $name;
	    			if (!$param->yaml)
	                    $this->throwException('wrong_yaml',$param);
				}
				else
				{
	                Prado::Trace('Trying... '.$name.'.yml','YamlConfig');
	                $param->yaml = @file_get_contents($this->Path.'/'.$name.'.yml');
	                while (!$param->yaml && ($s = strpos($name,'-'))) {
	                     array_push($param->nameParams,substr($name,0,$s));
	                     $name = substr($name,$s+1);
	                     Prado::Trace('Trying... '.$name.'.yml','YamlConfig');
	                     $param->yaml = @file_get_contents($this->Path.'/'.$name.'.yml');
	                }
	    			if (!$param->yaml)
	                    $this->throwException('wrong_name',$param);
				}

                $this->OnPreYamlLoad($param); 

    			$param->data = $this->readYaml($param->yaml);
                
                $this->OnYamlLoad($param); 

    			if($this->Cache && $application->Cache) 
    			    $application->Cache->set($cacheKey,$param->data);
    			
    		}

            $this->OnPostCache($param); 
            
            $this->Context->data = $param->data;
            $this->Context->nameParams = $param->nameParams;
            return $this;
        }
         
        
        /**
         * Get context Attribute collection
         * @return TAttributeCollection
         */
        public function getContext()
        {
            if ($this->_context === null)
                $this->_context = new TAttributeCollection;
            
            return $this->_context;
        }
        
        public function buildContext($contextName,$asCollection=false)
        {
            $obj = $this->getContext();
            if (isset($obj->context))
                return $this;
               // var_dump($obj->data);die();
            if ($asCollection)
                $obj->data = $this->arrayToCollection($obj->data);
            $obj->config = $obj->data['serverSide'];
            $obj->metadata = $obj->data['metaData'];
            
            if ($contextName === null)
            {
                $context = $obj->config;
                unset($context['context']);
            }
            else
            {
                $context = $obj->config['context'][$contextName];
                foreach($obj->config as $key=>$val) 
                {
                    if ($key != 'context' && !isset($context[$key])) {
                        $context[$key] = $val;
                    }
                    unset($context['noBlankContext']);
                }
            }
            $obj->context = $context;
            return $this;   
        }
        
        public function arrayToCollection($data)
        {
            $res = new TAttributeCollection($data);
            foreach($res as $k=>$val) {
                if (is_array($val))
                    $res[$k] = $this->arrayToCollection($res[$k]);
            }
            return $res;
        }
        
}

class TEventYamlParameter extends TEventParameter
{
    public $data;
    public $yaml;
    public $name;
	public $asString;
    public $path;
    public $nameParams=array();
    
    public function __construct($name,$path,$asString=false)
    {
        $this->name = $name;
        $this->path = $path;
		$this->asString = $asString;
    }
}
