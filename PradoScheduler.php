<?php
class PradoScheduler
{
	public function _construct() {
			
		include_once( 'Process/PradoInstance.php');
		include_once('Process/config.inc.php');
		include_once('Process/constants.inc.php');
	}

	static $stopScheduler = false;

	public static function pjs_mysql_query($q) {

	 return mysql_query($q);
	 if (mysql_error() AND DEBUG) echo "<hr>MySQL ERROR: ".mysql_error()."<hr>";

	}

	//Connect to the data base

	public function db_connect() {

	 @$db_link = mysql_connect(DBHOST, DBUSER, DBPASS);
	 if ($db_link) @mysql_select_db(DBNAME);

	 if (mysql_error() AND DEBUG) echo "<hr>MySQL ERROR: ".mysql_error()."<hr>";

	 if (mysql_error()) exit();

	 return $db_link;

	}

	//If things go wrong, or script timeout CLEAR script so will run next time
	public function Clear($id) {
	 db_connect();

	 $result= self::pjs_mysql_query("UPDATE pjs_table SET currently_running = '0' where id='$id' ");
	 db_close();
	}


	//relaese the database object after the db operation.
	public function db_close() {

		global $db_link;
		if ($db_link) $result = mysql_close($db_link);
	}
	/**
	 * Calls the scheduler process function, which will  initialize prado process.
	 *
	 * 	Gets called after initializing prado scheduler instance.
	 *
	 */

	public function run() {
			
		if( self::$stopScheduler ) {

			break;
		} else {

			$this->pradoSchedulerProcess();
		}
	}

	//Inorder to stop the scheduler, we have assign the true value to the variable stopScheduler

	public function stopScheduler(){

		self::$stopScheduler = true;
	}

	//This method will check how many scripts need to be run in the particular point of time.

	public function pradoSchedulerProcess() {

		if (DEBUG) error_reporting(E_ALL);

		else error_reporting(0);

		$this->db_connect();

		$time_and_window =  time();

		$query="select * from pjs_table WHERE fire_time <= $time_and_window AND process_enable = 1";

		$result = self::pjs_mysql_query($query);

		$scripts_to_run = array();

		if ( mysql_num_rows($result) ) {

			$i = 0;

			while ( $i < mysql_num_rows($result) ) {

				$id					=		mysql_result($result,$i, 'id');
				$scriptpath			=		mysql_result($result,$i, 'scriptpath');
				$time_interval		= 		mysql_result($result,$i, 'time_interval');
				$fire_time			=		mysql_result($result,$i, 'fire_time');
				$time_last_fired	=		mysql_result($result,$i, 'time_last_fired');
				$process_enable		=		mysql_result($result,$i, 'process_enable');
				$fire_time_new 		=		$fire_time + $time_interval;

				$scripts_to_run[$i]["script"]			=	"$scriptpath";
				$scripts_to_run[$i]["id"]				=	$id;
				$scripts_to_run[$i]["fire_time"]		=	$fire_time;
				$scripts_to_run[$i]["time_last_fired"]	=	$time_last_fired;
				$scripts_to_run[$i]["time_interval"]	=	$time_interval;
				$scripts_to_run[$i]["process_enable"]	=	$process_enable;

				$i++;
			}
		}

		// run the scheduled scripts

		$log_date="";
		$log_output="";

		for ( $i = 0; $i < count( $scripts_to_run ); $i++ ) {
				
			$this->fire_script( $scripts_to_run[$i] );
		}
		
		$this->db_close();
	}


	//This method will run the scripts based on the time.

	public function fire_script( $scripts_to_run ) {

		$script = $scripts_to_run['script'];
		$id = $scripts_to_run['id'];
		$start_time = microtime(true);

		$scriptRunning = new scriptStatus;
		$scriptRunning->script = $script;

		if ( $scriptRunning->Running( $id ) ) {

			include_once(LOCATION.'/'.$script);
			$scriptArr = explode( '.', $script );
			
			$inst = new $scriptArr[0]($id,$scriptArr[0]);

			try {

			 $inst->doIt();
			 $inst->updateFireTime($scripts_to_run);

			 $scriptRunning->execution_time=number_format( (microtime(true) - $start_time), 5 )." seconds";
			 $scriptRunning->output= "sucessfully execute";

			 $query = $scriptRunning->Stopped($id);

			 $inst->writeLog($query);

			}
			catch (Exception $e) {

				$inst->updateFireTime($scripts_to_run);

				$scriptRunning->execution_time=number_format( (microtime(true) - $start_time), 5 )." seconds";
				$scriptRunning->output=$e.getMessage();

				$query = $scriptRunning->Stopped($id);

				$inst->writeLog( $query );
			}
		}

	}
}
	
/**
 * 
 *	 Gets instantiated from fire_script function.
 *
 */
	
class scriptStatus {

	public $script;
	public $output;
	public $status;
	public $executionTime;
	
	/**
	 * Updates the script's currently_running value to 1.
	 *	
	 * @param $id Unique id for the script that is going to run.
	 * @return	resource if success, else fasle.
	 */

	public function Running($id) {

		$result=PradoScheduler::pjs_mysql_query("UPDATE pjs_table SET currently_running='1' where id='$id' ");
		
		return $result;
	}

	/**
	 * 
	 * Updates the script's currently_running value to 0 and returns a query to the caller of the function
	 *
	 * @param $id Unique id for the script that is going to run.
	 * @return	resource if success, else fasle.
	 * 
	 */
	
	public function Stopped( $id ) {

		$result=PradoScheduler::pjs_mysql_query("UPDATE pjs_table SET currently_running='0' where id='$id' ");
		$now = time();

		$this->script=$this->clean_input($this->script);

		$this->output=substr(htmlentities($this->output), 0, MAX_ERROR_LOG_LENGTH);// truncate output to defined length

		$query="INSERT INTO LOGS_TABLE (`id`, `date_added`,`script`, `output`, `execution_time`)
							VALUES (null,'$now', '$this->script','$this->output','$this->execution_time') ";

		return $query;

	}
	
	public function clean_input( $string ) {

		$patterns[0] = "/'/";
		$patterns[1] = "/\"/";

		$string = preg_replace($patterns,'',$string);
		$string = trim($string);
		$string = stripslashes($string);

		return preg_replace("/[<>]/", '_', $string);
	}
}
	
  	include_once( 'Process/PradoInstance.php');
	include_once('Process/config.inc.php');
	include_once('Process/constants.inc.php'); 
	include_once ('protected/clientside/direct/CollaborationToolMgr.php');
	include_once ('protected/clientside/direct/BSSReportingMgr.php');
	include_once('Process/PradoProcess.php'); 
    $daemon = new PradoScheduler();
	
    //while(1) {
    	
    	$daemon->run();
    //}
?>



