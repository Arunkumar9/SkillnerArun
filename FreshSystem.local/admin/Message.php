<?php
Prado::using('Application.clientside.direct.*');
    class Message extends FBaseAdminPage
    {
        
    	protected $_user_details;
    	protected $_chapters_list;
    	protected $_unread_msgcount;
    	
        public function onPreInit($param) {


     /**       if ($ver = $this->getApplication()->Parameters['version']) {
                list($theme,) = explode(' ', $ver);
                $theme = 'Admin'.ucfirst(strtolower($theme));
                $theme = ($theme == 'AdminLive') ? 'Admin' : $theme;
                $this->StylesheetTheme = $theme;


            }
            else
                $this->StylesheetTheme = 'Admin'; **/
            parent::onPreInit($param);
            
            if(extension_loaded('newrelic')) {
						newrelic_name_transaction ('admin.Message');
			}
        }
        
        public function onInit($param)
        {
        	parent::onInit($param);
        
        	if (false  && ($list = $this->getUserDetails()) ) //&& ($chapters = $this->getChaptersList())
        	{
        		$this->Shortcuts->datasource = $list;
        		//$this->chapter->datasource = $chapters;
        		$this->databind();
        	}
        
        }
        
        public function getUserDetails()
        {
        	if (!is_array($this->_user_details))
        	{
        		$this->_user_details = VideoRecordMgr::getUserDetails(null);
        		
        
        	}
        	return $this->_user_details;
        }
        
        
        public function getChaptersList(){
        	if (!is_array($this->_chapters_list))
        	{
        		$videomgr = new VideoRecordMgr();
        		$this->_chapters_list = $videomgr->getRecordChapters(null);
        	
        	
        	}
        	return $this->_chapters_list;
        }
        
        public function getUnreadMsgCount(){
        	if (!is_array($this->_unread_msgcount))
        	{
        		$colltoolmgr = new CollaborationToolMgr();
        		$this->_unread_msgcount = $colltoolmgr->getUnReadMessageCount(null);
        		 
        		 
        	}
        	return $this->_unread_msgcount;
        }
        
        public function getChaptersListJson()
        {
        	$cmpList = $this->getChaptersList();
        
        	if (is_array($cmpList)) {
        		return json_encode($cmpList);
        	}
        	else
        		return '{}';
        }
        public function getUserDetailsJson()
        {
        	$cmpList = $this->getUserDetails();
        		
        	if (is_array($cmpList)) {
        		return json_encode($cmpList);
        	}
        	else
        		return '{}';
        }
    }

    /**
     * .page removed code 
     *  chaptersData = '<%=   json_encode($this->getChaptersList() )%>';
				 chaptersData = eval("(" + chaptersData + ')');
     */
 ?>