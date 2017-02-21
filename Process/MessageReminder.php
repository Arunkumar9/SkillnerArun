<?php

class MessageReminder extends PradoProcess {

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

		$coll1 = new CollaborationToolMgr();
		$coll1->reminderMailsPreparationToInstructor();
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
		   $fire_time_new = strtotime('tomorrow 7am EST');		  
			 $fire_time = time();
			 			PradoScheduler::pjs_mysql_query("UPDATE pjs_table
							 SET
							 fire_time='$fire_time_new',
							 time_last_fired='$fire_time'
							WHERE id='$id'");
	}


}