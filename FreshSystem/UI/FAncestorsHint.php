<?php



class FAncestorsHint extends TControl implements IWidget
{
	private $_manager;
	private $_name;
	private $_parent_id;

        public function onInit($param)
        {
            parent::onInit($param);
            $this->attachEventHandler('OnAncestorsHint',array($this,'OnAncestorsHint'));
        }

        public function OnAncestorsHint($sender,$param)
        {
            if (!$this->_parent_id)
                $this->setParentId($param->Parameter['parentid']);
            if (!$this->getName())
                $this->setName($param->Parameter['name']);
        }

	public function getName()
	{
		return $this->getViewState('name',''); //$this->_name;//
	}
	
	public function setName ($value)
	{
		$this->setViewState('name', TPropertyValue::ensureString($value)); //$this->_name = $value; ///
	}

	public function getParentId()
	{
                $parent = $this->Request['parent'];
                $parent = ($parent) ? $parent : $this->Session['parent'];
                Prado::trace(__CLASS__.' PARENT '.$parent,'Json');
		return ($this->_parent_id) ? $this->_parent_id : $parent; //$this->getViewState('parentid',$parent);
	}
	
	public function setParentId ($value)
	{
            $this->_parent_id = $value;  //$this->setViewState('parentid', $value);
	}

	public function getAncestors()
	{
		$ancestors = $this->getManager()->getAncestors(null,$this->getParentId());
		//$c = $this->getPage()->getContainer();
                $c = ($c) ? $c : new ContainerRecord;
                if (!$this->Name )
			$this->Name = $c->name;
		$c->name = $this->Name;
		array_unshift($ancestors,$c);
//		echo TVarDumper::dump($ancestors[3]->href);die();
		return $ancestors;
	}
	

    public function wiLoadData($gw) {
        return false;
    }

    public function wiSetData($content,$gw) {
        return false;
    }

    public function wiInjectData($gw) {
        $gw->getData();
    }
	/**
	 * Get the FCmsModule module
	 * @return FCmsModule
	 * @throw TConfigurationException if module is not registered
	 */
	public function getManager () {
		if ($this->_manager===null)
		{
			foreach ($this->getApplication()->getModules() as $module)
			{
				if ($module instanceof FCmsModule) $this->_manager=$module;
			}
			if ($this->_manager===null) 
			throw new TConfigurationException("cms_manager_module_not_found");
		}
		return $this->_manager;
	}
	

        public function wiGetMetaData($gw) {
            return array(
                    'properties'=>array('parentid','name'),
                    'collapsed'=> false,
                    'column'=> 2,
                    'forTab'=> 'System',
                    'fields' => array(
                            array(
                                    'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Parent'),
                                    'name'=>$gw->getFieldName('textfield'),
                                    'editor'=>array('xtype'=>'numberfield','width'=>200)
                            ),
                            array(
                                    'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Name'),
                                    'name'=>$gw->getFieldName('name'),
                                    'editor'=>array('xtype'=>'textfield','width'=>200)
                            )
                    )
            );
        }
}
