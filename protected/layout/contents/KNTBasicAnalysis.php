<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class KNTBasicAnalysis extends FStyledTemplateControl {

    private $_clientVar;
    private $_Client;

    public function onLoad($param) {

        parent::onLoad($param);
        if (!stristr($this->Request->UrlReferrer,$this->Request->Url->Host))
            throw new THttpException(403, "Forbidden");
        
    }
    
    
    public function getClient() {

        if ($this->_Client === null) {
            $request = $this->getRequest();

            if ($request->contains($this->getClientVar())) {

                $clientID = $request[$this->getClientVar()];
                $ts = $request['ts'];
                $this->_Client = ClientRecord::finder()->findByPk($clientID);
                if (!$this->_Client || !$ts || $this->_Client->UpdateStamp != $ts ) {
                   throw new THttpException(404, "Client not found");
                }

            }
        }
        return $this->_Client;
    }

    public function getClientVar() {
        return ($this->_clientVar) ? $this->_clientVar : 'client';
    }

    public function setClientVar($value) {
        $this->_clientVar = $value;
    }

    public function getAdviserInfo() {
        $adviser = UserRecord::finder()->findByPk($this->Client->be_user_id);
        return $adviser;
    }

}