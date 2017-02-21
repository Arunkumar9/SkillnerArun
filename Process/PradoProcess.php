<?php
abstract class PradoProcess
{
	public $process_id;
	public $process_name;
	public function _construct($id, $name){
		$this->process_id = $id;
		$this->process_name = $name;
	
	}
	//@throws
	public function prepareIt() {
		return true;
	}
	public abstract function doIt();
	public function reScheduleProcess(){
	try{
		
	}
	catch (Exception $e){
		throw new MyException('Exception from reScheduleProcess');
	}
	}
	
	public  function updateFireTime($scripts_to_run){
		
			$id= $scripts_to_run['id'];
		  $time_interval= $scripts_to_run['time_interval'];
		  $fire_time= $scripts_to_run['fire_time'];
		  $time_last_fired= $scripts_to_run['time_last_fired'];
		  $run_only_once = $scripts_to_run['process_enable'];
		  $fire_time_new = time() + $time_interval;
			 $fire_time = time();
			 			PradoScheduler::pjs_mysql_query("UPDATE pjs_table
							 SET
							 fire_time='$fire_time_new',
							 time_last_fired='$fire_time'
							WHERE id='$id'");
	}
		
	public function writeLog($query){
	try{
		PradoScheduler::pjs_mysql_query($query);
	}
	catch (Exception $e){
		throw new MyException('Sorry no writeLog() defined in child class!');
	}	
	
	}
}
class myException extends Exception{
}