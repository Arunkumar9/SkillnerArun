<?php
/**
 * User: Arunkumar
 * Date: 24.04.2014
 * Time: 13:55
 */

class BSSAPIGenerateRequestData{
		     public function _construct(){
				
			 }

			 public function generateHash($data,$date) {
			 	 include_once(BASEPATH.'/Process/Hmac.php');
	             $privateKey = 'fc20739c4c1ab77c642bbe6cac5c024ce2f8688583163e9f38a9709ebe1b6ad2';
                 $hmac = new Hmac($privateKey);
                 $hash = $hmac->getHash($data, $date);
                 return $hash;
             }
             
             public function generateSendData($data,$hash,$date){
             	 $publicKey = 'system_cms';
                 $dataToSend = array(
	                    'time' => $date,
	                    'api_key' => $publicKey,
	                    'content' => $data,
	                    'hash' => $hash
                 );
                 return $dataToSend ;
             }
}

?>
