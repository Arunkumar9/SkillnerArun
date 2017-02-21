<?php
    class FExtTreeNav extends TTemplateControl
    {
        private $_data_url;        
        private $_root_name;        
        private $_root_id;
        private $_click_handler;
        
        
        public function onInit($param)
        {
         //   $this->treeCallback->OnCallback = $this->ClickHandler;
        }
        
        public function getDataUrl()
        {
            return $this->_data_url;
        }
        
        public function setDataUrl($value)
        {
            $this->_data_url = $value;
        }
        
        public function getRootName()
        {
            return $this->_root_name;
        }
        
        public function setRootName($value)
        {
            $this->_root_name = $value;
        }

        public function getRootId()
        {
            return $this->_root_id;
        }
        
        public function setRootId($value)
        {
            $this->_root_id = $value;
        }

        public function getClickHandler()
        {
            return $this->_click_handler;
        }
        
        public function setClickHandler($value)
        {
            $this->_click_handler = $value;
        }

        public function getOpenAt()
        {
            return $this->getViewState('openAt');
        }
        
        public function getOpenAtPath()
        {
            if ($id = $this->OpenAt)
            {
                $obj = new ObjectRecord(array('uid'=>$id));
                return '/'.$this->RootId.'/'.implode('/',$obj->getAncestorUids()).'/'.$id;
            }
            return null;
        }

        public function setOpenAt($value)
        {
            $this->setViewState('openAt',$value);
        }
        
    	public function setSessionState($key,$value,$defaultValue=null,$ID=null)
    	{
    		$this->Session->open();
    		if (!$this->getID(true) && $ID === null)
    			throw new TConfigurationException('Session state for named objects only');
    
    		$k = (($ID === null)?$this->getID(true):$ID).'$'.$key;
    		if($value===$defaultValue)
    		{
    			if (is_object($this->Session[$k]))
    				$this->Session[$k]->Clear();
    		}
    		else
    		{
    			$this->Session[$k]=$value;
    			//echo "set $k -> $value"."\n";
    		}
    	}
    
    
    	
    	public function getSessionState($key,$defaultValue=null,$ID=null)
    	{
    		if (!$this->getID(true) && $ID === null)
    			throw new TConfigurationException('Session state for named objects only');
    
    		$k = (($ID === null)?$this->getID(true):$ID).'$'.$key;
    		return isset($this->Session[$k])?$this->Session[$k]:$defaultValue;
    	}
        
    }
?>
