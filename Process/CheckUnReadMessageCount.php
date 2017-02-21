<?php
/**
 * 
 * This Class is a process which will be responsible to send the API request to the BSS with the modified
 * User Couse Instance Message Unread Count
 * @author Arunkumar
 *
 */
class CheckUnReadMessageCount  extends PradoProcess {

	public function _construct( $id, $script ){

		parent::__construct();
	}
	
	/**
	 *	Overriding the abstract function. Instantiating CollaborationToolMgr and calling captureEmailRecords function to
	 *	send emails.
	 *
	 * @see PradoProcess::doIt()
	 */
	 public function doIt() {
		include_once (BASEPATH.'/Process/BSSAPIGenerateRequestData.php');
		$ini_array = parse_ini_file(BASEPATH.'/images/Email/Template.ini');
		$values = array();
    	foreach( $ini_array as $k=>$v ) {
    		$values[$k] = $v;
    	}
    	
    	$url = $values['unreadmessageCoutURL'];
		$date = time();
		$coll = new CollaborationToolMgr();
		$data = $coll->unreadMessageCountUpdateToBSS();
		$requestObj = new BSSAPIGenerateRequestData();
		$hash = $requestObj->generateHash($data,$date);
		$dataToSend = $requestObj->generateSendData($data,$hash,$date);

		if(!empty($data)) {
			$curl = curl_init();
			curl_setopt($curl, CURLOPT_URL, $url);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HEADER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
			curl_setopt($curl, CURLOPT_POST, true);
			curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($dataToSend));
			 
			$result = curl_exec($curl);
			//$info = curl_getinfo($curl);
			curl_close($curl);
		}
	 }

	 public function writeLog( $query ) {

		PradoScheduler::pjs_mysql_query($query);
	 }
	 public  function updateFireTime($scripts_to_run){
		
		  $id= $scripts_to_run['id'];
		  $time_interval= $scripts_to_run['time_interval'];
		  $fire_time= $scripts_to_run['fire_time'];
		  $time_last_fired= $scripts_to_run['time_last_fired'];
		  $run_only_once = $scripts_to_run['process_enable'];
		   $fire_time_new = strtotime('10 seconds');		  
			 $fire_time = time();
			 			PradoScheduler::pjs_mysql_query("UPDATE pjs_table
							 SET
							 fire_time='$fire_time_new',
							 time_last_fired='$fire_time'
							WHERE id='$id'");
	}
	
	
}
?>