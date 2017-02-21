<?php
/**
 * 
 * This Class is a process which will be responsible to send the 
 * Business Events Data To the Reporting Database According to the Event Name
 * @author Arunkumar
 *
 */
class MigrateEventsToReportingDB  extends PradoProcess {

	public function _construct( $id, $script ){

		parent::__construct();
	}
	
	/**
	 *	Overriding the abstract function. Instantiating BSSReportingMgr and calling uploadBusinessEventsToReportingDBProcess function to
	 *	send data to reporting database.
	 *
	 * @see PradoProcess::doIt()
	 */
	 public function doIt() {
	 	$bssReportingMgr = new BSSReportingMgr();
	 	$bssReportingMgr->uploadBusinessEventsToReportingDBProcess();
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