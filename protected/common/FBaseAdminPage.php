<?php

    Prado::using('Application.services.json.*');
    class FBaseAdminPage extends TPage
    {
        protected $_component_list;
        
        public function onInit($param)
        {
            parent::onInit($param);
            
            if (false && $this->getRegisteredObject('Shortcuts') && ($list = $this->getComponentList()))
            {
               $this->Shortcuts->datasource = $list;
               $this->databind();
            }
            
        }
        
        
        public function getComponentList()
        {
            if (!is_array($this->_component_list))
            {
                $clist = new FJsonComponentListProvider();
                $clist->Path = Prado::getApplication()->Parameters['Components'];
                $l = $clist->getJsonContent();
                $l = $l['component'];
			    if ($l['success'] && is_array($l['result']))
                    $this->_component_list = $l['result'];
                
            }
            return $this->_component_list;
        }
		
        public function getComponentListJson()
		{
			$cmpList = $this->getComponentList();
			
			if (is_array($cmpList)) {
				return json_encode($cmpList);
			}
			else
				return '{}';
		}
	
        
        
    }

 ?>
