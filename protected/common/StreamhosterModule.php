<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BasicEcho
 *
 * @author rosa
 */
Prado::using('FreshSystem.3rdparty.curl');

class StreamhosterModule extends TModule {

    private $_password;
    private $_servicename;

    public function init($config) {

    }


    public function getPassword() {
        return $this->_password;
    }

    public function setPassword($value) {
        $this->_password = $value;
    }

    public function getServicename() {
        return $this->_servicename;
    }

    public function setServicename($value) {
        $this->_servicename = $value;
    }

    /**
     * @remotable
     *
     */
    public function getToken($expiration=60,$mask=null) {

        $params = array(
            'servicename'=>$this->getServicename(),
            'password'=>$this->getPassword(),
            'seconds'=>$expiration
        );
        if ($mask)
            $params['allowed_ip_mask']=$mask;

        $apiUrl = 'https://token2.streamhoster.com/gettoken.aspx';

        $ret = $this->post($apiUrl, $params);
        return $ret;
    }


    public function post($url,$params, $user=null, $pass=null) {

        $c = new curl($url) ;
        $c->setopt(CURLOPT_FOLLOWLOCATION, true) ;
        $c->setopt(CURLOPT_POST, true) ;
        if ($user)
            $c->setopt(CURLOPT_USERPWD, "$user:$pass");
        $c->setopt(CURLOPT_POSTFIELDS, $params );

        $o = $c->exec();

        if ($err = $c->hasError())
            throw new THttpException($c->m_status['errno'], $err);

        return $o;
    }
}



/*
 * <img style="width: 160px;" title="bike_brno2010_agogs-elektrokolo-001-cz.mpg.mpg" src="http://fast.freshsystems.cz/tvexpo/videa/TV-Expo/bike_brno_2010/bike_brno2010_agogs-elektrokolo-001-cz.mpg.mpg">
 */

/*
 *
 * function sendRequest($xml)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://manage.encoding.com/");
    curl_setopt($ch, CURLOPT_USERPWD, $this->auth_name.':'.$this->auth_pass);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "xml=" . urlencode($xml));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    return curl_exec($ch);
}   
 */