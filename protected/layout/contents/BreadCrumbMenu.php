<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of newEshopProductSideList
 *
 * @author rosa
 */
class BreadCrumbMenu extends FStyledTemplateControl {

    private $_Desc;
    private $_Separator;

    public function  onLoad($param) {
        parent::onLoad($param);
        $this->Menu->Separator = ($this->getSeparator()) ? $this->getSeparator() : ' | ';
    }
    public function getSeparator() 	{
        return $this->_Separator;
    }

    public function setSeparator($value) 	{
        $this->_Separator = $value;
    }

    public function getDesc() 	{
        return $this->_Desc;
    }

    public function setDesc($value) 	{
        $this->_Desc = $value;
    }


    public function getDefaultCssClass()
    {
        return ($this->getCssClass()) ? $this->getCssClass() : 'bredcrumbNavigationContainer';
    }
}

