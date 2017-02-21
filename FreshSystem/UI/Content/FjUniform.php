<?php
	
class FjUniform extends TTemplateControl {

    private $_IncludeTools;
    private $_UniformFields;


    public function getUniformFields() 	{
        return ($this->_UniformFields)? $this->_UniformFields : "input, select, textarea";
    }

    public function setUniformFields($value) 	{
        $this->_UniformFields = $value;
    }

    public function getIncludeTools() 	{
        return $this->_IncludeTools;
    }

    public function setIncludeTools($value) 	{
        $this->_IncludeTools = $value;
    }

    public function  onInit($param) {
        parent::onInit($param);
         $cs = $this->getPage()->getClientScript();
        if (!$this->getPage()->getIsCallback()) {
            if ($this->getIncludeTools())
                $cs->registerHeadScriptFile('JQueryTools',"http://cdn.jquerytools.org/1.2.3/full/jquery.tools.min.js");
            else
                $cs->registerHeadScriptFile('JQuery', "http://code.jquery.com/jquery-1.4.2.min.js");
            $cs->registerHeadScriptFile('jQUery.Uniform', "lib/jQuery.Uniform/jquery.uniform.min.js");
            $cs->registerStyleSheetFile('jQUery.Uniform', "lib/jQuery.Uniform/css/uniform.default.css");
        } 

    }

}
