<?php
/*
 * Created on 12.7.2006
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
 
 class FContainerListMenu extends FListMenu implements INamingContainer
 {
 	const DEFAULT_RECORD_CLASS = 'ContainerRecord';
 	private $_maxlevel;
 	private $_codename;
	private $_seoname;
	private $_finder;
	protected $_recordclass;
	private $_trace_template;
	private $_always_href;
	private $_baseUrl;

 	public function getRootId() {

            if ($this->_rootid === null)
            {
                $this->_rootid = Prado::getApplication()->getModule('cms')->getLocalRoot()->uid;
            }
       /*     elseif (stripos($this->_rootid, 'local:')===0)
            {
                $local = str_ireplace('local:','',$this->_rootid);
                $cms = Prado::getApplication()->getModule('cms');
                $root = $cms->getLocalRoot()->uid;
                $this->_rootid = $root->uid.'/'.$local;
            } */
            return $this->_rootid;//$this->getViewState('RootId',null);
 	}

 	public function setRootId ($value) {
		$this->_rootid = $value; //$this->setViewState('RootId',TPropertyValue::ensureInteger($value),null);
	}


        public function getBaseUrl()
	{
		return $this->_baseUrl;
	}
 	
	public function setBaseUrl($value)
	{
		$this->_baseUrl = rtrim($value,'/');
	}

public function getFinder()
	{
		if (!$this->_finder) {
			$this->_finder = TActiveRecord::finder($this->RecordClass);
		}
		return $this->_finder;
	}

	public function getOpenContainerId()
	{
		
	}
 	public function getRecordClass() {
 		return ($this->_recordclass)?$this->_recordclass:self::DEFAULT_RECORD_CLASS;
 	}
 	
 	public function setRecordClass ($value) {
		$this->_recordclass = $value;
	}

 	public function getCodeName() {
 		return ($this->_codename)?$this->_codename:'uid';
 	}

 	public function setCodeName ($value) {
		$this->_codename = $value;
	}

 	public function getSeoName() {
 		return ($this->_seoname)?$this->_seoname:'code';
 	}

 	public function setSeoName ($value) {
		$this->_seoname = $value;
	}

 	public function getMaxLevel() {
 		return $this->_maxlevel;
 	}
 	
 	public function setMaxLevel ($value) {
		$this->_maxlevel = $value;
	}
	
 	public function getTraceTemplate() {
 		return $this->_trace_template;
 	}
 	
 	public function setTraceTemplate ($value) {
		$this->_trace_template = TPropertyValue::ensureBoolean($value);
	}
 	
 	public function getAlwaysHref() {
 		return $this->_always_href;
 	}
 	
 	public function setAlwaysHref ($value) {
		$this->_always_href = $value;
	}


	public function createChildControls () {
		
//Prado::Trace(__CLASS__.' createChildControls START '.$this->RootId);
		$this->databind();
  		parent::createChildControls ();
		$this->createChildControlsInternalDb ($this,$this->RootId);
		return;
	  
		if ($cache = Prado::getApplication()->getCache()) {
			$key = get_class($this).':'.$this->getRootID();
			$red = new Redis;
			$red->pconnect('127.0.0.1');
			//$red->setOption(Redis::OPT_SERIALIZER, Redis::SERIALIZER_NONE);
			$red->select(8);
			if ($controls = unserialize($red->get($key))) {
			 //var_dump($controls);die();
			   foreach($controls as $c)
				 $this->addParsedObject($c);
			   //$this->getControls()->copyFrom($controls);
			   return;
			}			
		}

    	$this->createChildControlsInternalDb ($this,$this->RootId);
//Prado::Trace(__CLASS__.' createChildControls FIN');
	    if ($cache) {
			$red->set($key,serialize($this->getControls()->toArray));
		//	var_dump($this->getControls());
			//				  echo $key;die();

		}

	}
	
	protected function createChildControlsInternalDb ($parent,$container=null,$level=0) {
		
		$params = ($this->Request['noedit'])?array('noedit'=>1):array();
		$level++;
		if ($level>$this->MaxLevel) return;
		//$finder = ContainerRecord::finder();
		$criteria = new TActiveRecordCriteria;
		$containers = array();
                if (!is_object($container))
                {
                    $container_id = $container;
                    if (!$container_id)
                    {
                            $criteria->Condition = '(parent_id is NULL or parent_id = 0) AND uid>1';
                            $criteria->OrdersBy['ordering'] = 'asc';
                            $containers = $this->finder->findAll($criteria); //withChildren()->
                    }
                    elseif ($container_id>1 || ($this->finder instanceof ContainerRecord))
                    {
                            //Prado::trace('Root ID '.$container_id.' '.get_Class($this->finder),'Json');
                            //$criteria->Condition = 'parent_id = :parent_id AND uid>1';
                            //$criteria->Parameters[':parent_id'] = $container_id;
                            //$criteria->OrdersBy['ordering'] = 'asc';
                            if ($this->finder instanceof ContainerRecord)
                            {
                                    $p = $this->getApplication()->Modules['cms']->getContainer($container_id);
                                    //echo $container_id.' '.$p->uid;
                            }
                            else
                                    $p = $this->finder->findByPk($container_id);
                            if ($p)
                                    $containers = $p->children;
                            else
                                    return;
                            //$containers = $this->finder->findAll($criteria); //withChildren()->
                    }
                }
                else
                {
                    $containers = $container->children;
                }
                if (!$containers) return;
                
		foreach ($containers as $k => $v )
		{
			
			if ($v->TypeData['notInMenu'] || (property_exists($v,'is_enabled') && !$v->is_enabled))
				continue;
				
			$c = $this->itemFactory();
                        $c->ContainerID = $v->uid;
			if (Prado::getApplication()->Parameters['translatable'])
				$c->Text = ($v instanceof FActiveLangRecord) ? $v->nameLangAct : Prado::localize($v->name);
			else
				$c->Text = $v->name;
			
			if ($c instanceof IDataRenderer) $c->setData($v);
				
			$typeData = $v->getTypeData();
			
			$c->PagePath = (isset($typeData['pagePath']))?$typeData['pagePath']:'ContentShow';
//			if ($v->type->data)
//				$c->PagePath = $v->type->data;
//			else
//				$c->PagePath = 'ContentShow';
			if ($this->GenerateAll && $this->EnableJS && $this->hasChildrenInMenu($v)) //isset($v->children[0]))
			{
				$c->NavigateUrl = 'javascript:';
				//$c->Attributes->OnClick = 'return false;';
			}
			else 
			{
	   			$params  = (is_array($typeData['pageParams']))?$typeData['pageParams']:array();
				//$params[$this->CodeName]=($v->{$this->SeoName}) ? FU::urlify($v->{$this->SeoName}) : $v->{$this->CodeName};
				$params[$this->CodeName]=$v->{$this->CodeName};
				if ($this->TraceTemplate)
					$params['master']=$this->Page->MasterClass;
                                if ($v instanceof ContainerRecord)
                                {
                                    $href = $v->getAbsoluteHref(true,$params);
                                    $c->NavigateUrl = (strpos($href, 'http')===0) ? $href : $this->BaseUrl.$href;
                                 //   Prado::trace(__CLASS__.' '.$v->uid.' '.$href,'Json');
                                }
                                else
                                    $c->NavigateUrl = $this->BaseUrl.$this->Page->Service->constructUrl($c->PagePath,$params);

			}
			$parent->addParsedObject($c);
                        $c->Distance = ($this->MaxDistance) ? $this->getIsInAncestors($v,$level,$this->MaxDistance) : 0;
			if ($this->GenerateAll || $this->CurrentUrl === $c->NavigateUrl || $c->Distance !== false)//|| $this->wasOpen === $c->Text)
			{
				$children = $v->children;
				if ($this->CurrentUrl === $c->NavigateUrl && $level<2)
					$this->wasOpen = $c->Text;
				if ($this->GenerateAll)
					$this->wasOpen = false;
//Prado::trace(TVarDumper::dump($this->Session),'Json');
				if ($level < $this->MaxLevel && count($children)>0)
				{
//Prado::trace(count($children).$level,'Json');
					$cc = Prado::createComponent('FListMenu');
                                        $cc->Distance = $c->Distance;
					//$c->ActiveCssClass=$this->ActiveCssClass.$level;
					//$c->InactiveCssClass=$this->InactiveCssClass.$level;
					$parent->addParsedObject($cc);
					$this->createChildControlsInternalDb ($cc,$v,$level);
				}
			}
		
		}
	}

        protected function getIsInAncestors($c,$level,$distance=2)
        {
            static $ancids;
            
            if ($ancids === null)
            {
                $hints = $this->getPage()->findControlsByType('FAncestorsHint');
                if (count($hints)>0) {
                    //$hints[0]->ParentId = $this->Request['parent'];
                    $ancestors = $hints[0]->getAncestors();
                    Prado::trace('Hint '.count($ancestors),'Json');
                }
                else {
                    $ancestors = $this->getApplication()->getModule('cms')->getAncestors();
                }
                foreach($ancestors as $anc)
                    $ancids[] = $anc->uid;

                //array_shift($ancids);
                array_reverse($ancids);
                //array_shift($ancids);
            //    Prado::trace(implode(':', $ancids),'Json');
            }

            
            if (in_array($c->uid,$ancids))
                    return 0;

            //if ($level<$distance)
              //      return $level+1;
            
            $parent = $c->parent;
            $llevel = 0;
            while ($parent && $llevel < $distance)
            {
                $llevel++;
                if ( in_array($parent->uid,$ancids))
                        return $llevel;
                $parent = $parent->parent;
            }

            return false;
        }
	protected function hasChildrenInMenu($container)
	{
		foreach($container->children as $child)
		{
			if (!$child->TypeData['notInMenu'] && get_class($child) != $this->_always_href)
				return true;
		}
		return false;
	}
	
	protected function itemFactory() {
		return Prado::createComponent('FListMenuItem');
	}
 	
 }
