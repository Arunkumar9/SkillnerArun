<?php
Prado::using('System.Web.TUrlMapping');



class FCmsUrlMapping extends TUrlMapping
{
        protected $_constructpaths;
        protected $_excluded_services="image,feed,download";
        /**
	 * Parses the request URL and returns an array of input parameters.
	 * This method overrides the parent implementation.
	 * The input parameters do not include GET and POST variables.
	 * This method uses the request URL path to find the first matching pattern. If found
	 * the matched pattern parameters are used to return as the input parameters.
	 * @return array list of input parameters
	 */
	public function parseUrl()
	{

                $this->expandDomainPathInfo();
                $params = parent::parseUrl();
		$code = $params['code'];
                $cms = $this->Application->Modules['cms'];
/*
                if ($this->getResolvePaths() && $params['path'])
                {
                    if ($c = $cms->getContainerByPath($params['path']))
                    {
                        $params['code'] = $c->uid;
                        $params['page'] == 'NormalPage';
                    }
                        
                }
                if ((!isset($params['page']) || $params['page'] == 'NormalPage') && !$code)
                {
                    $c = $cms->getContainer($this->getRequest()->getBaseUrl());
                    $code = $c->uid;
                    $params['code'] = $code;
                    $params['page'] == 'NormalPage';
                }
  */Prado::trace('URL MAPPING '.$code.' '.$params['page'],'Json');
                if ($params['page']  && $code)
		{
			
			$c = $cms->getContainer($code);
                        if (!$c)
                        {
                            $codeshort = str_ireplace($this->getRequest()->getUrl()->getHost().'/','',$code);
                            Prado::trace('CODESHORT '.$codeshort,'Json');
                            $c = $cms->getContainer($codeshort);
                        }
                        if ($c) {
                            $params['page'] = $c->TypeData['pagePath'];
                            $tdParams = $c->TypeData['pageParams'];
                            if (is_array($tdParams)) foreach($tdParams as $k=>$v)
                            {
                                    if (!$this->Request->contains($k) && !isset($params[$k]))
                                            $params[$k]=$v;
                            }

                        }
		$params['code'] = $code;
		}
		return $params;
	}

	/**
	 * Constructs a URL that can be recognized by PRADO.
	 *
	 * This method provides the actual implementation used by {@link THttpRequest::constructUrl}.
	 * Override this method if you want to provide your own way of URL formatting.
	 * If you do so, you may also need to override {@link parseUrl} so that the URL can be properly parsed.
	 *
	 * The URL is constructed as the following format:
	 * /entryscript.php?serviceID=serviceParameter&get1=value1&...
	 * If {@link THttpRequest::setUrlFormat THttpRequest.UrlFormat} is 'Path',
	 * the following format is used instead:
	 * /entryscript.php/serviceID/serviceParameter/get1,value1/get2,value2...
	 * @param string service ID
	 * @param string service parameter
	 * @param array GET parameters, null if not provided
	 * @param boolean whether to encode the ampersand in URL
	 * @param boolean whether to encode the GET parameters (their names and values)
	 * @return string URL
	 * @see parseUrl
	 * @since 3.1.1
	 */
	public function constructUrl($serviceID,$serviceParam,$getItems,$encodeAmpersand,$encodeGetItems)
	{
		if($this->EnableCustomUrl)
		{
			if(!(is_array($getItems) || ($getItems instanceof Traversable)))
	 			$getItems=array();

			if ($uid = $getItems['uid'])
			{
				$cms = $this->Application->Modules['cms'];
				$c = $cms->getContainer($uid);
				if ($c->code)
				{
					unset($getItems['uid']);
					$getItems['code']=$c->code;
				}
				else {
					$getItems['code']=sprintf('%03d',$getItems['uid']);
					unset($getItems['uid']);
				}
			}
                        if ($this->getConstructPaths() && ($uid || $getItems['code']))
                        {
                            $uc = ($uid)?$uid:$getItems['code'];
                            $path = ContainerRecord::getPath($uc);
                            $getItems['code'] = ($path) ? $path : $getItems['code'];
                        }        
                        $culture = $this->getApplication()->getGlobalization()->getCulture();
			if ($this->Application->Parameters['translatable'] && !$getItems['lang']
                            && $this->getApplication()->getGlobalization()->getDefaultCulture() != $culture)
				$getItems['lang']= $culture;

			$tdParams = $c->TypeData['pageParams'];
			if (is_array($tdParams)) foreach($tdParams as $k=>$v)
			{
				if ($getItems[$k]==$v)
					unset($getItems[$k]);
			}	
		}
		return parent::constructUrl($serviceID,$serviceParam,$getItems,true,false);
	}

        public function getConstructPaths()
        {
            return $this->_constructpaths;
        }

        public function setConstructPaths($value)
        {
            $this->_constructpaths = TPropertyValue::ensureBoolean($value);
        }

        public function setExcludedServices($value) {
            $this->_excluded_services = $value;
        }

        public function getExcludedServices() {
            return explode(',',$this->_excluded_services);
        }

        protected function isExcludedService() {
            foreach($this->getExcludedServices() as $es) {
                try { if (isset($_GET[$es])) return true;
		} catch (Exception $e) {
			
		}
            }
            return false;
        }

        public function expandDomainPathInfo()
        {
            $request=$this->getRequest();
            $baseDomain = $this->getApplication()->Parameters['baseDomain'];
            if (!$baseDomain || $this->isExcludedService() || !$request['page'] && strpos($request->getUrl()->getHost(),'admin')!==false ) return;
            Prado::trace('EXPAND '.$request->getUrl()->getHost().' - '.$baseDomain.' '.$request->RequestResolved,'Json');
            if ($request->getUrl()->getHost() != $baseDomain &&
                0 !== stripos($request->getPathInfo(),$request->getUrl()->getHost()))
            {
                $request->setPathInfo($request->getUrl()->getHost().'/'.trim($request->getPathInfo(),'/'));
            }


        }

}


class FCultureMapping extends TUrlMappingPattern {
 
    // Store UrlMappings UrlPrefix
    private $_prefix;
 
    public function init($config)
    {
        $this->_prefix=$this->getManager()->getUrlPrefix();
    }
 
    /**
     * constructUrl
     *
     * Inject culture info into UrlPrefix of TUrlMapping
     *
     */
    public function constructUrl($getItems,$encodeAmpersand,$encodeGetItems)
    {
		$culture= ($getItems['lang']) ? $getItems['lang'] : $this->getManager()->getApplication()->getGlobalization()->getCulture();
		unset($getItems['lang']);
        $this->getManager()->setUrlPrefix($this->_prefix.'/'.$culture);
        return parent::constructUrl($getItems,$encodeAmpersand,$encodeGetItems);
    }
}

