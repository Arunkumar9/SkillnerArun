<?php


class FExtDirectUrlManager extends TUrlManager {

    /**
     * Parses the request URL and returns an array of input parameters.
     * This method overrides the parent implementation.
     * The input parameters do not include GET and POST variables.
     *
     * Parses HTTP_RAW_POST_DATA in case of Ext.Direct call
     * @return array list of input parameters
     */
    public function parseUrl() {

        $getItems = parent::parseUrl();
           
       $raw = file_get_contents('php://input');
                    //var_dump($raw);die();
        if ($data = json_decode($raw, true)) {
            $getItems['direct'] = $data;
            $getItems['json'] = 'direct';
         //    var_dump($raw);die();
        } else if (isset($_POST['extAction'])) { // form post
            $getItems['json'] = 'direct';
            $getItems['direct']['isForm'] = true;
            $getItems['direct']['isUpload'] = ($_POST['extUpload'] == 'true');
            $getItems['direct']['action'] = $_POST['extAction'];
            $getItems['direct']['method'] = $_POST['extMethod'];
            $getItems['direct']['tid'] = isset($_POST['extTID']) ? $_POST['extTID'] : null; // not set for upload

            unset($_POST['extUpload']);
            unset($_POST['extAction']);
            unset($_POST['extMethod']);
            unset($_POST['extTID']);
        }

        return $getItems;
    }

}

