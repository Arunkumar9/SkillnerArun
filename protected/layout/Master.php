<?php
	
class Master extends TTemplateControl {

    public function  onInit($param) {
        parent::onInit($param);
         $cs = $this->getPage()->getClientScript();
        if (!$this->getPage()->getIsCallback()) {
            $cs->registerHeadScriptFile('JQueryTools',"http://cdn.jquerytools.org/1.2.3/full/jquery.tools.min.js");
            //$cs->registerHeadScriptFile('JQuery', "http://code.jquery.com/jquery-1.4.2.min.js");
            $cs->registerHeadScriptFile('jQUery.Uniform', "/resources/jQuery.Uniform/jquery.uniform.min.js");
            $cs->registerStyleSheetFile('jQUery.Uniform', "/resources/jQuery.Uniform/css/uniform.default.css");
        } 

    }

    public function SearchButtonClicked($sender,$param)
    {
        $search = $this->SearchText->SafeText;
        
        $c = $this->getPage()->getContainer('@code=search');

        $this->getResponse()->redirect($c->getAbsoluteHref(true,array('gsearch'=>$search),true));
    }

}
