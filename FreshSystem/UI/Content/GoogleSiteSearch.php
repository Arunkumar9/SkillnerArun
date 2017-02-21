<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class GoogleSiteSearch extends FStyledTemplateControl
{

    private $_site;
    private $_label;

    public function OnPreRender($param)
    {
            $cs = $this->getPage()->getClientScript();
            $cs->registerHeadScriptFile('GoogleJSAPI',"http://www.google.com/jsapi");
    }

    // Site
    public function getSite(){
            return $this->_site;
    }

    public function setSite($value){
            $this->_site = $value;
    }

    // SearchLabel
    public function getSearchLabel(){
            return $this->_label;
    }

    public function setSearchLabel($value){
            $this->_label = $value;
    }

    public function getRestriction() {

        $sites = explode(',',$this->getSearchLabel());

        return ($this->getSearchLabel()) ? 'site:'.implode(' OR site:',$sites) : '';

    }

    public function getInitialSearch()
    {
        $request = $this->getRequest();
        $session = $this->getSession();
        
        return ($request->contains('gsearch')) ? $request['gsearch'] : $session['gsearch'];

    }


}