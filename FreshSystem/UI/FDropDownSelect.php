<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
*/

class FDropDownSelect extends FStyledTemplateControl {

    const DEFAULT_RECORD_CLASS = 'ContainerRecord';
    protected $_rootid=0;
    protected $_recordclass;

    public function OnPreRender($param) {
        parent::onPreRender($param);
        if ($this->getRecordClass() == self::DEFAULT_RECORD_CLASS)
            $menus = $this->getPage()->getContainer($this->getRootId())->children;
        else
        {
            $cr = new TActiveRecordCriteria();
            $cr->Condition = 'parent_id = :parent';
            $cr->Parameters[':parent'] = $this->getRootId();
            $cr->OrdersBy['ordering']='ASC';
            $menus = TActiveRecord::finder($this->getRecordClass())->findAll($cr);
        }
        foreach($menus as $k=>$v) {
            if ($v->TypeData['notInMenu'] || (property_exists($v,'is_enabled') && !$v->is_enabled) || (property_exists($v,'read_level') && $v->read_level >= 100))
                continue;

            if (Prado::getApplication()->Parameters['translatable'])
                $sm[$v->uid] = ($v instanceof FActiveLangRecord) ? $v->nameLangAct : Prado::localize($v->name);
            else
                $sm[$v->uid] = $v->name;

            $m[] = $v;
        }
        $this->Repeater->datasource = $m;
        $this->Repeater->databind();

        $this->SelectMenu->datasource = $sm;
        $this->SelectMenu->databind();

    }

    public function getRootId() {
        return $this->_rootid;//$this->getViewState('RootId',null);
    }

    public function setRootId ($value) {
        $this->_rootid = $value; //$this->setViewState('RootId',TPropertyValue::ensureInteger($value),null);
    }
    public function getRecordClass() {
        return ($this->_recordclass)?$this->_recordclass:self::DEFAULT_RECORD_CLASS;
    }

    public function setRecordClass ($value) {
        $this->_recordclass = $value;
    }

}