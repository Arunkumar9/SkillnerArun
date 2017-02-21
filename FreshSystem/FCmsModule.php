<?php
/**
 * FCmsModule class file
 * 
 * @author Jan ROSA (jan.rosa@freshconcept.fr)
 * @copyright Copyright &copy; 2007, Jan Rosa
 * @license http://www.pradosoft.com/license
 *
*/


class FCmsModule extends TModule 
{
	
	private $_code=null;
	private $_originalCode=null;
	private $_ancestors=array();
	
	private $_containerRecord=array();
	private $_homePageCode=null;
	private $_url=null;
	private $_controlrequest=false;
	
	/**
	 * Initializes the module.
	 * This method is invoked by application.
	 * @param TXmlElement module configuration
	 */
	public function init($config)
	{
            if ($this->_controlrequest)
                $this->Application->OnBeginRequest[] = array($this, 'BeginRequest');
	}

        public function getControlRequest()
        {
            return $this->_controlrequest;
        }

        public function setControlRequest($value)
        {
            $this->_controlrequest = TPropertyValue::ensureBoolean($value);
        }

        public function getOriginalCode()
	{
		if ($this->_originalCode === null)
			$this->_originalCode = $this->Request['uid'];
		return $this->_originalCode;
	}
	
	public function getCode()
	{
		$request = $this->Request;	
		if ($request->contains('code') || $request->contains('uid'))
		{	
			$code = ($request->contains('code'))?$request['code']:$request['uid'];
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['ordering'] = 'asc';
	//		Prado::trace("GETCODE ".$code);
//			if (preg_match('/^[0-9]/',$code))
				$container = $this->getContainer($code);//ContainerRecord::finder()->findByPk($code,$code);
	//		else				
		//		$container = ContainerRecord::finder()->findByName($code);			

			$this->_containerRecord[$container->uid] = $container;
//die(TVarDumper::dump($container->Type->Data).$container->uid);
			if (strcasecmp($container->type_id,'ContentColumn')===0)
			{
				$this->_code = $container->parent_id;
			} elseif (strcasecmp($container->type_id,'DownLink')===0 && count($container->children)>0) {
				$container = $container->children[0];
				$this->_code = $container->uid;//code;
				$this->_containerRecord[$this->_code] = $container;
			} elseif ($link = $container->Type->Data['Link']) {
				if (strcasecmp($link,'DownLink')===0 && count($container->children)>0)
					$container = $container->children[0];
				else
					$container = ContainerRecord::finder()->findByPk($container->Type->Data->Link);
				$this->_code = $container->uid;//code;
				$this->_containerRecord[$this->_code] = $container;
			} else {
				$this->_code = $container->uid;//code;
				$this->_containerRecord[$this->_code] = $container;
			}

		} elseif ($this->_code === null) {
			//$type = FU::Ini('Setup.HomePageType');
		//	$this->handle404();
			$container = $this->getHomePageContainer();//ContainerRecord::finder()->findByType_id($type);
			if ($container===null)
				return null;
			$this->_code = $container->uid;
			$this->_containerRecord[$this->_code] = $container;
		}
		
		return $this->_code;
/*
		$request = $this->Request;	
		if ($request->contains('code') || $request->contains('uid'))
		{	
			$code = ($request->contains('code'))?$request['code']:$request['uid'];
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['ordering'] = 'asc';
			if (preg_match('/^[0-9]/',$code))
				$container = ContainerRecord::finder()->findByPk($code,$code);
			else				
				$container = ContainerRecord::finder()->findByName($code);			

			if ($container->Type->name == 'ContentColumn')
			{
				$this->_code = $container->parent_id;
			} else {
				$this->_code = $container->uid;//code;
				$this->_containerRecord[$this->_code] = $container;
			}

		} elseif ($this->_code === null) {
			$type = FU::Ini('Setup.HomePageType');
				
			$container = ContainerRecord::finder()->findByType_id($type);			
			if ($container===null)
				return null;
			$this->_code = $container->uid;
			$this->_containerRecord[$this->_code] = $container;
		}
		return $this->_code;

*/	}

	public function getUrl($uid=null,$par=array())
	{
			if ($uid instanceof ContainerRecord)
				$container = $uid;
			else
				$container = $this->getContainer($uid);

			return $container->getHref(false,$par);				
/*
	   		$typeData = $container->getTypeData();
			$params  = (is_array($typeData['pageParams']))?$typeData['pageParams']:array();
			$params = array_merge($params,$par);
			$params['uid']=$container->uid;
			return $this->Service->constructUrl($typeData['pagePath'],$params);

*/	}

	public function getContainer($uid=null)
	{

                $criteria = new TActiveRecordCriteria;
		$criteria->OrdersBy['ordering'] = 'asc';

		if (!$uid || $uid === null || $uid == '')
			$code = $this->getCode();
		else
			$code = $uid;

                $variants = explode('|',$code);

                //Prado::trace('PATH VARIANTS '.json_encode($variants),'Json');
                foreach ($variants as $path)
                {
            //    Prado::trace('PATH  '.$path,'Json');

                    if ($rec = $this->getContainerOne($path))
                    {
                            return $rec;
                    }
                }
                return null;
        }

        public function getContainerOne($code=null)
	{
                if ($code === null OR $code == '') return null;
                if (!isset($this->_containerRecord[$code])) {
			if (strpos($code,'/')===false && strpos($code, 'local:')!==0)
                        {
                           //echo $code;
                            if (preg_match('/^([0-9]+)/',$code,$m))
                            {
                                $first = 'uid'; $second = 'code';
                                $c1 = $m[1];
                                $c2 = $code;
                             //   die('uid '.$c1);
                            }
                            else {
                                $first = 'code'; $second = 'uid';
                                $c1 = $code;
                                $c2 = $code;
                            }

                            if (!($rec = ContainerRecord::finder()->find($first.' = ?',$c1)))
                                    $rec = ContainerRecord::finder()->find($second.' = ?',$c2);
                                                    
                        }
			if (!$rec)
                        {
                            $rec = $this->getContainerByPath($code);
                        }
//				$this->_containerRecord[$code] = ContainerRecord::finder()->findByPk($code);//->withContents($criteria)
//			else
//echo basename($this->getApplication()->getBasePath());
				
			if ($rec) {
				$this->_containerRecord[$code] = $rec;
				$this->_containerRecord[$rec->uid] = $rec;
			}
		}			
		return (isset($this->_containerRecord[$code])) ? $this->_containerRecord[$code] : null; 
	}
	
	public function getContainerByPath($path,$domain='')
	{
		if (!isset($this->_containerRecord[$path])) {
                        $path = trim($path);
                        if (strpos($path, 'local:')===0)
                        {
                            $local = $this->getLocalRoot()->name;
                            $subpath = substr($path, 6);
                            $path = rtrim($local.'/'.$subpath,'/');
                        }
                        elseif (strpos($path, 'this:')===0)
                        {
                            $path = rtrim('@uid='.$this->getContainer()->uid.'/'.substr($path, 5),'/');

                        }
                        
                        if ($path && strpos($path, '@')===false) // && strpos($path, 'local:')!==0)
                        {
                            $rec = ContainerRecord::finder()->findByPath($path);
                        }
                        if (!$rec)
                        {
                            $path = trim(str_replace(array('//','  '),array('/',' '),$path));
                            if (!$path || $path == '/' )
                                    $path = '@type_id=HomePage';
                            
                            $p = explode('/',$path);
                            $p = array_reverse($p);

                            $select = 'SELECT c0.* FROM ';
                            $from = array();
                            $where = array();
                            $params = array();
                            $table = ContainerRecord::TABLE;
                            foreach($p as $k => $name)
                            {
                                    if ($name)
                                    {
                                            $from[]  = "$table as c$k";
                                            if ($name[0]=='@' || $name[0]=='$')
                                            {
                                                    list($attr,$value) = explode('=',substr($name,1));
                                                    $where[] = "c$k.$attr like :name$k";
                                                    if ($value == '$basePath')
                                                            $value = basename($this->getApplication()->getBasePath());
                                                    $params[":name$k"] = $value;
                                            }
                                            else
                                            {
                                                    $where[] = "c$k.name like :name$k";
                                                    if ($name == '$basePath')
                                                            $name = basename($this->getApplication()->getBasePath());
                                                    $params[":name$k"] = $name;
                                            }
                                            if ($k>0)
                                            {
                                                    $l = $k-1;
                                                    $where[] = "c$l.parent_id = c$k.uid";
                                            }
                                    }
                                    elseif ($k>0)
                                    {
                                            $l = $k-1;
                                            $where[] = "c$l.parent_id = 0";
                                            break;
                                    }
                            }

                            $select .= implode(',',$from).' WHERE '.implode(' AND ',$where);
                            //echo $path."\n";
                            //echo $select."\n";//.' / '.var_dump($params);
                            $rec = ContainerRecord::finder()->findBySql($select,$params);//->withContents($criteria)
                        }
                        if ($rec)
                        {
                            $this->_containerRecord[$path] = $rec;
                            $this->_containerRecord[$rec->uid] = $rec;
                        }
                        //else return ContainerRecord::finder()->findByPk(3);
			//echo TVarDumper::dump($rec);  
		}
		return (isset($this->_containerRecord[$path])) ? $this->_containerRecord[$path] : null; 
		//return $this->_containerRecord[$path];
		
	}


	public function getOriginalContainer()
	{
		$criteria = new TActiveRecordCriteria;
		$criteria->OrdersBy['ordering'] = 'asc';

		$code = $this->getOriginalCode();
		if (!isset($this->_containerRecord[$code])) {
			$this->_containerRecord[$code] = ContainerRecord::finder()->withContents($criteria)->findByPk($code);
		}			
		return $this->_containerRecord[$code];
	}
	
	public function getAncestors($container = null,$code = null)
	{
		if ($code === null) 
			$code = $this->getCode();
		if ($this->_ancestors[$code] === null)
		{
			if ($container === null) 
				$container = $this->getContainer($code);
				
			$containers = array();
			$c = $container;
                        $baseDomain = Prado::getApplication()->Parameters['baseDomain'];
			while($c != null)
			{
				
				if ($c->type_id == FU::Ini('Setup.MenuRootType') || $c->type_id == 'MenuRoot')
				{
					if ($baseDomain)
                                            $containers[] = $c;
                                        else
                                            $containers[] = $this->getHomePageContainer();
					$c = null;
				}
				elseif ($c->typeData['notInMenu'])
				{
					$c = $c->parent;
				} else {
					$containers[] = $c;
					$c = $c->parent;
				}
			}
                       // echo "ANCESTORS ".$code;
                       // var_dump($containers);
			$this->_ancestors[$code] = $containers;
		}
		

		return $this->_ancestors[$code];
	}

        public function getLocalRoot($container = null,$code = null)
        {
            $an = $this->getAncestors($container = null,$code = null);
          //  echo "Local: ".$an[count($an)-1]->uid;
            if ($c = count($an))
                return $an[$c-1];
            else
                return null;
        }
	
	public function getHomePageContainer()
	{
		if ($this->_homePageCode === null || !isset($this->_containerRecord[$this->_homePageCode]))
		{
			$type = FU::Ini('Setup.HomePageType');
                        if ($type===null)
				return null;
			$container = ContainerRecord::finder()->findByType_id($type);			
			if ($container===null)
				return null;
			$this->_homePageCode = $container->uid;
			//die('dd '.$this->_homePageCode.' home');
			$this->_containerRecord[$this->_homePageCode] = $container;
		}
		return $this->_containerRecord[$this->_homePageCode];
		
	}


        public function handle404()
        {
            if ($this->getApplication()->Parameters['handle404']=='redirect')
                $this->redirect404();


            $domain = $this->getRequest()->getUrl()->getHost();
            $url = $this->getApplication()->Parameters['handle404'];
            $url = ($url) ? $url : '@code='.$domain.'/@code=error404|@code=error404default';
            $c = $this->getContainer($url);

            if (!$c )
               throw new THttpException(404,'pageservice_page_unknown',$this->Request['code']);

            $this->_containerRecord[$this->Request['code']] = $c;

            $this->getResponse()->setStatusCode(404);
            return $c;
        }

        public function redirect404()
        {
                $host = $this->getRequest()->getUrl()->getScheme().'://'.$this->getRequest()->getUrl()->getHost();
                $this->Response->redirect($host);
                die();
        }

        public function BeginRequest($sender,$param)
        {
            if ($this->getRequest()->getServiceID()!= 'page' || $this->Request['image'])
                    return;

           // Prado::trace("GETCODE :".  TVarDumper::dump( $this->getCode()),'Json');
            $c = $this->getContainer();
            //$c = ($c) ? $c : $this->getHomePageContainer();
            Prado::trace("CURRENT ".$this->Request['code'].' uid:'.$c->uid.' name: '.$c->name,'Json');

            if (!$c )
            {
                $c = $this->handle404();
                Prado::trace("HANDLE ".$this->Request['code'].' uid:'.$c->uid.' name: '.$c->name,'Json');
            }

            Prado::trace("DATA ".json_encode($c->LocalTypeData),'Json');
            Prado::trace("DATA ".json_encode($c->TypeData),'Json');
            

            if ($c->TypeData['servicePage'] || $c->TypeData['hidden'] || $c->hidden)
            {
               throw new THttpException(404,'pageservice_page_unknown',$this->Request['code']);
            }

            $request = $this->getRequest();
            $curHost = $request->getUrl()->getHost();
            $baseDomain = Prado::getApplication()->Parameters['baseDomain'];

            $href = $c->getAbsoluteHref();
            $td = $c->getTypeData();
            $domain = ($td['domain']) ? $td['domain'] : $baseDomain;

            if (!stristr($domain,$curHost))
            {
                $url = $request->Url->Uri;
                if ($domain != $baseDomain)
                {
                    $url = str_ireplace($curHost, $domain, $url);
                    $url = str_ireplace($domain.'/'.$domain, $domain, $url);
                }
                //Prado::trace("REDIRECT ".$url,'Json'); return;
                //$this->getResponse()->redirect($href);
                //die("REDIRECT ".$url);
            }

        }
}