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
Prado::using('FreshSystem.3rdparty.zencoder.Zencoder');

class ZencoderAPI extends TComponent {

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

        $req = array(
            "api_key" => "b1eddbc7ce4e7181e33649523928c7f1",
            "input" => "ftp://freshconcept_tvexpo:tvxp2010@fast.freshsystems.cz/videa/$file",
         //   "region" => "europe",
            //"test"=>true,
            "output" => array(
                    array(
                    "base_url" => $baseUrl,
                    "filename" => $basename . ".mp4",
                    "label" => "web",
                    //"notifications"=>array("http=>//tvexpo-admin.freshsystems.cz/notifications/__FILE__"),
                    "quality"=> 4,
                    "buffer_size"=>50000,
                    "thumbnails" => array(
                        "start_at_first_frame" => 0,
                        "interval" => 25,
                        'format'=>'jpg',
                        "size" => "160x120",
                        "base_url" => $baseUrl,
                        "prefix" => "t"
                    )),
                    array(
                    "base_url" => $baseUrl,
                    "filename" => $basename . "_500.mp4",
                    "width" => 640,
                    "height" => 360,
                    "label" => "web500",
                    "quality"=> 3,
                  //  "buffer_size"=>50000,
                   // "bitrate_cap"=>500
                    //"notifications"=>array("http=>//tvexpo-admin.freshsystems.cz/notifications/__FILE__"),
                )
            )
        );

        return new ZencoderJob($req);

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
    curl_setopt($ch, CURLOPT_POSTFIELDS, "xml=" . urlencode($xml));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    return curl_exec($ch);
}   
 */