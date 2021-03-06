<?php
/**
 * Auto generated by prado-cli.php on 2008-10-20 11:24:56.
 * @author Arunkumar.muddada
 * 
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  27668		   Arunkumar.muddada	201405140827    Modified : createEventsRecord
 *  													Introduced this column to differentiate the fact tables and dimension tables
 *  													Introduced constants for the business events Course finalized , Quiz Finalized , Quiz Question Finalized
 */
class BusinessEventsRecord extends BusinessEventsAR
{
	 public static $TASK_CREATE_UPDATE  = "Task Created or updated";
	 public static $QUIZ_ANSWER_ATTEMPTED = "Quiz Answer Attempted";
	 public static $QUIZ_SCORE = "Quiz Score";
	 public static $COURSE_FINALIZE = "Course finalized";
	 public static $QUIZ_FINALIZE = "Quiz finalized";
	 public static $QUIZ_QUESTION_FINALIZE = "Quiz Question finalized";
	 public static $COURSE_PROGRESS = "Course Progress";
	 
     public static function finder($className=__CLASS__) {
		return parent::finder($className);
	 }
	 
	 /**
	  * This method is used to create Business Events Record With the given Parameters
	  * @param unknown_type $event_name
	  * @param unknown_type $data
	  */
	 public function createEventsRecord($event_name , $data , $type='F'){
 		$businessEventRecord = BusinessEventsRecord::finder()->find("data= '".$data."'");
 		$event_date  = date("Y-m-d H:i:s",time());
 		if(count($businessEventRecord) <=  0){
			$this->event_name = $event_name;
			$this->event_date = $event_date;
			//201405140827
			$this->table_type = 	$type;
	    	$this->data = $data;
			$this->save();
	 	} else {
	 		$businessEventRecord->event_date = $event_date;
	 		$businessEventRecord->save();
	 	}
	 }
}
