<?php

    class Open extends FBaseAdminPage
    {
        
        
        public function onPreInit($param) {


            if ($ver = $this->getApplication()->Parameters['version']) {
                list($theme,) = explode(' ', $ver);
                $theme = 'Admin'.ucfirst(strtolower($theme));
                $theme = ($theme == 'AdminLive') ? 'Admin' : $theme;
                $this->StylesheetTheme = $theme;


            }
            else
                $this->StylesheetTheme = 'Admin';
            parent::onPreInit($param);
            
            if(extension_loaded('newrelic')) {
						newrelic_name_transaction ('admin.Open');
			}
        }
    }

 ?>
