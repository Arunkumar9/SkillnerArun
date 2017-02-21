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
	private $_baseurl;

	public function getBaseUrl()
	{
		return $this->BaseUrl;
	}
 	
	public function setBaseUrl($value)
	{
		$this->BaseUrl = rtrim($value,'/');
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
		$this->_always_href = TPropertyValue::ensureBoolean($value);
	}


	public function createChildControls () {
		
Prado::Trace(__CLASS__.' createChildControls START '.$this->RootId);
		$this->databind();
  		parent::createChildControls ();
    	$this->createChildControlsInternalDb ($this,$this->RootId);
Prado::Trace(__CLASS__.' createChildControls FIN');

	}
	
	protected function createChildControlsInternalDb ($parent,$container_id=null,$level=0) {
		
		$params = ($this->Request['noedit'])?array('noedit'=>1):array();
		$level++;
		if ($level>$this->MaxLevel) return;
		//$finder = ContainerRecord::finder();
		$criteria = new TActiveRecordCriteria;
		$containers = array();
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
		
		foreach ($containers as $k => $v )
		{
			
			if ($v->TypeData['notInMenu'] || (property_exists($v,'is_enabled') && !$v->is_enabled))
				continue;
				
			$c = $this->itemFactory();
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
			if (!$this->AlwaysHref && $this->GenerateAll && $this->EnableJS && $this->hasChildrenInMenu($v)) //isset($v->children[0]))
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
				$c->NavigateUrl = $this->BaseUrl.$this->Page->Service->constructUrl($c->PagePath,$params);
			}
			$parent->addParsedObject($c);
		
			if ($this->GenerateAll || $this->CurrentUrl === $c->NavigateUrl || $this->wasOpen === $c->Text)
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
					$c = Prado::createComponent('FListMenu');
					//$c->ActiveCssClass=$this->ActiveCssClass.$level;
					//$c->InactiveCssClass=$this->InactiveCssClass.$level;
					$parent->addParsedObject($c);
					$this->createChildControlsInternalDb ($c,$v->uid,$level);
				}
			}
		
		}
	}
	
	protected function hasChildrenInMenu($container)
	{
		foreach($container->children as $child)
		{
			if (!$child->TypeData['notInMenu'])
				return true;
		}
		return false;
	}
	
	protected function itemFactory() {
		return Prado::createComponent('FListMenuItem');
	}
 	
 }
?>

