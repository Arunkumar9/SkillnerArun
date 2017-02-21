<?php

class MenuInBox extends FStyledTemplateControl implements ITranslatableWidget
{
    private $_MenuCls;
    private $_ContainerUid;

    public function getContainerUid() 	{
        return $this->_ContainerUid;
    }

    public function setContainerUid($value) 	{
        $this->_ContainerUid = $value;
    }

    public function getMenuCls() 	{
        return $this->_MenuCls;
    }

    public function setMenuCls($value) 	{
        $this->_MenuCls = $value;
    }
}