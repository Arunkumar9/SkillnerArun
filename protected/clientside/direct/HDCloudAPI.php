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

class HDCloudAPI extends TComponent {

    /**
     * @remotable
     *
     */
    public function encode($id) {


        $video = VideoRecord::finder()->findByPk($id);

        if (!$video) return false;

        $file = str_ireplace('http://fast.freshsystems.cz/tvexpo/videa/', '', $video->getFirstImage());
//        $dirname = dirname($file);
        $dirname = preg_replace('/\..+$/','',$file);
        $basename = basename($dirname);

  //      $basename = preg_replace('/\..+$/','',basename($file));
        $baseUrl = "ftp://freshconcept_tvexpo:tvxp2010@fast.freshsystems.cz/encoded/" . $dirname . "/" ;

        if (!is_dir($baseUrl) && !mkdir($baseUrl,0777,true))
                return false;


        $user = 'FCNEJJESVLMITZQ';
        $pass = 'tsixlzzunxxj0mwwyd5gd2wqgkssz99z5jjywph9z';

        $params = array(
            "job[source_urls][]" => "http://freshconcept_tvexpo:tvxp2010@fast.freshsystems.cz/webdav/tvexpo/videa/$file",
            "job[destination_id]"=> 573,
            "job[name]" => "video-".$video,
            "job[priority]" => 5,
            "job[callback_url]" => 'http://fast.freshsystems.cz/tvexpo/encoded/payload.php',
            "encoding_profile_ids[]"=>2438,
            //"encoding_profile_ids[1]"=>2437,
        );

        $apiUrl = 'http://hdcloud.com/api/v1/jobs.json';

        $ret = $this->post($apiUrl, $params, $user, $pass);

        file_put_contents("ftp://freshconcept_tvexpo:tvxp2010@fast.freshsystems.cz/encoded/" . $basename.'.store', $dirname);

        return $ret;
    }


    public function post($url,$params, $user, $pass) {

        $c = new curl($url) ;
        $c->setopt(CURLOPT_FOLLOWLOCATION, true) ;
        $c->setopt(CURLOPT_POST, true) ;
        $c->setopt(CURLOPT_USERPWD, "$user:$pass");
        $c->setopt(CURLOPT_POSTFIELDS, $params );

        $o = $c->exec();

        if ($err = $c->hasError())
            throw new THttpException($c->m_status['errno'], $err);

        return json_decode($o,true);
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