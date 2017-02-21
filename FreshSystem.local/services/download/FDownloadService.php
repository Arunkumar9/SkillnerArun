<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of FDownloadService
 *
 * @author rosa
 */
class FDownloadService extends TPageService {
    
    private $_auth_level=null;

    /**
     * Initializes the service.
     * This method is required by IService interface and is invoked by application.
     * @param TXmlElement service configuration
     */
    public function init($config)
    {
            
    }
    
    public function run() {
        
        Prado::trace("Running download service",'FreshSystem.services.download.FDownloadService');
        
        if (!$this->getIsAuthorized())
                    throw new FJsonException('Not authorized!');
                    
        $basename = $this->determineRequestedPagePath();
        
        $dir = dirname($this->Request->ApplicationFilePath);
        $file = $dir . '/' . $basename;
        if ($basename && is_file($file))
                $this->getResponse()->writeFile($file);
        else
            throw new THttpException(404,'resource_not_found');
        
        die();
    }

    public function getIsAuthorized()
    {

            if ($this->AuthLevel === null)
                    return true;
                    
            Prado::getApplication()->Session->Open();
            $session = Prado::getApplication()->Session;
            if (!$this->User->IsGuest && $this->User->Level > $this->AuthLevel)
                    return true;
            else
                    return false;
    }

    /**
     * @return int	level to get authorized for this service 
     */
    public function getAuthLevel()
    {
            return $this->_auth_level;
    }


    /**
     * @param int level to get authorized for this service 
     */
    public function setAuthLevel($value)
    {
            $this->_auth_level=$value;
    }

}

