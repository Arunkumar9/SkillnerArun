<?php
/**
 * This Class is to handle the reporting database related functionality
 * @author Arunkumar
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 27669           Arunkumar.muddada    201405140925     Added Method : 
 * 														 processDimensionTableData  : Process for getting the data related to the dimension table and parse the data and inser into respective dimension tables in the reporting database.
 * 														 processFactTableData : Process for getting the data related to the fact table and parse the data and inser into respective fact tables in the reporting database
 * 														 pushDimensionContentToReportingDB : This method will push the content into respective dimenstion table , This method will get the information from the business events table according to given event and push that information to the respective dimension table
 * 27890           Arunkumar.muddada    201405281233     Added Method : 
 * 														 Modifed code to support postgres sql , here it is not supporting multiple update / create with single query so we are doing this with a concept callled rule from the postgres sql side.
 * 
 */
include(BASEPATH."/ReportingDBPostgresConnection.php");

class BSSReportingMgr extends TComponent {
	
	/**
	 * Method Which will be called from the MigrateEventsToReportingDB.php Prado Process 
	 * To Migrate all the Data in the Business Events To the Reporting Database.
	 */
	public function  uploadBusinessEventsToReportingDBProcess(){
		$reporDBConn = new ReportingDBPostgresConnection();
		$postgresSqlConnection = $reporDBConn->createConnection();
		
		//This method call will parse all the dimension table data and 
		//insert into respective reporting database tables
		$this->processDimensionTableData($postgresSqlConnection);
		
		
		//This method call will parse all the fact table data and 
		//insert into respective reporting database tables
		$this->processFactTableData($postgresSqlConnection);
		
		
		$reporDBConn->closeConnection($postgresSqlConnection);
	}
	
	/**
	 * Process for getting the data related to the dimension table and parse 
	 * the data and inser into respective dimension tables in the reporting database
	 * 201405140925
	 */
	public function processDimensionTableData($postgresSqlConnection){
		$tableType = 'D';
		$activeBusinessEvents = $this->getActiveBusinessEvents($tableType);
		foreach ($activeBusinessEvents as $eventRec){
			if($eventRec->event_name == BusinessEventsRecord::$COURSE_FINALIZE){
				$insertUpdateSql =  "INSERT INTO course (id,name) VALUES ";
				$this->pushDimensionContentToReportingDB($eventRec->event_name,$postgresSqlConnection,$insertUpdateSql);
			} else if($eventRec->event_name == BusinessEventsRecord::$QUIZ_FINALIZE){
				$insertUpdateSql =  "INSERT INTO quiz (id,name) VALUES ";
				$this->pushDimensionContentToReportingDB($eventRec->event_name,$postgresSqlConnection,$insertUpdateSql);
			} else if($eventRec->event_name == BusinessEventsRecord::$QUIZ_QUESTION_FINALIZE){
				$insertUpdateSql =  "INSERT INTO quiz_question (id,ordering) VALUES ";
				$this->pushDimensionContentToReportingDB($eventRec->event_name,$postgresSqlConnection,$insertUpdateSql);
			}
		}
	}
	
	/**
	 * Process for getting the data related to the fact table and parse 
	 * the data and inser into respective fact tables in the reporting database
	 * 201405140925
	 */
	public function processFactTableData($postgresSqlConnection){
		$tableType = 'F';
		$activeBusinessEvents = $this->getActiveBusinessEvents($tableType);
		
		foreach ($activeBusinessEvents as $eventRec){
			if($eventRec->event_name == BusinessEventsRecord::$TASK_CREATE_UPDATE){
				$this->pushTaskUpdateOrCreateRecords($eventRec->event_name,$postgresSqlConnection);
			} else if($eventRec->event_name == BusinessEventsRecord::$QUIZ_ANSWER_ATTEMPTED){
				$this->pushQuizAnswerFailureAttemptRecords($eventRec->event_name,$postgresSqlConnection);
			} else if($eventRec->event_name == BusinessEventsRecord::$QUIZ_SCORE){
				$this->pushQuizScoreRecords($eventRec->event_name,$postgresSqlConnection);
			} else if($eventRec->event_name == BusinessEventsRecord::$COURSE_PROGRESS){
				$this->pushCourseProgressRecords($eventRec->event_name,$postgresSqlConnection);
			}
		}
	}
	
	
	/**
	 * This Method will get the Active Business Events (Events Which are exists in the Business_events Table)
	 * Return an Array of ActiveEvents
	 */
	public function getActiveBusinessEvents($tableType){
		$sql = "SELECT DISTINCT event_name FROM business_events WHERE table_type='".$tableType."'";
		$eventRecords = TActiveRecord::finder('BusinessEventsRecord')->findAllBySql($sql);
		return $eventRecords;
	}
	
	/**
	 * This method is to get all the un processed records from the business events tabel 
	 * which are related to given event_name.
	 * 
	 * @param String $event_name
	 */
	public function getBusinessEventsByEventName($event_name){
		//All the Business Events Related to particular event_name
		$allUnprocessedBusinessEvents = BusinessEventsRecord::finder()->findAll('process_status is NULL AND event_name = ? Order by event_date ASC',array($event_name));
		if(count($allUnprocessedBusinessEvents) > 0){
			foreach ($allUnprocessedBusinessEvents as $unprocessedBusinessEvent){
				$unprocessedBusinessEvent->process_status = 1;
				$unprocessedBusinessEvent->save();
			}
		}
		return $allUnprocessedBusinessEvents;
	}
	
	/**
	 * Prepares the SQL for create/update task related data from CMS events Table to the Reporting Database 
	 * Tasks table
	 * @param unknown_type $event_name
	 * @param unknown_type $postgresSqlConnection
	 */
	public function pushTaskUpdateOrCreateRecords($event_name,$postgresSqlConnection){
		$unProcessedBusinessEvents = $this->getBusinessEventsByEventName($event_name);
		$insertUpdateSql =  "INSERT INTO tasks (course_instance_id,course_id,student_id,thread_id,task_status_id,datemodified) VALUES ";
		if(count($unProcessedBusinessEvents) > 0){
			$insertValueString = "";
			foreach ($unProcessedBusinessEvents as $unprocessedEvent){
				if(!empty($insertValueString)){
					$insertValueString .= ",";
				}
				$parsedData = $this->parseBusinessEvent($unprocessedEvent);
				if(!empty($parsedData)){
					$insertValueString .="( ";
					$insertValueString .= $parsedData;
					$insertValueString .=" )";
				} else{
					break;
				}
			}
			if(!empty($insertValueString)){
				$insertUpdateSql .=  $insertValueString ;
				$result = $this->pushDataIntoReportingTable($insertUpdateSql,$postgresSqlConnection);
				
				//if the result is true then the transaction is success then we can delete such records.
				if($result === true){
					$this->deleteProcessedEvents($unProcessedBusinessEvents);
				} else {
					$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
				}
			}else{
				$result = "Data supplied is not in correct format";
				$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
			}
		}
	}
	
	
	
	/**
 	 * Prepares the SQL for create/update Quiz Question Failure Attempts related data from CMS events Table to the Reporting Database 
	 * quiz_answers table
	 * @param unknown_type $event_name
	 * @param unknown_type $postgresSqlConnection
	 */
	public function pushQuizAnswerFailureAttemptRecords($event_name,$postgresSqlConnection){
		$unProcessedBusinessEvents = $this->getBusinessEventsByEventName($event_name);
		$insertUpdateSql =  "INSERT INTO quiz_answers (course_instance_id,course_id,student_id,quiz_id,question_id,isAnswered_correctly,incorrect_attempt_count,datemodified) VALUES ";
		if(count($unProcessedBusinessEvents) > 0){
			$insertValueString = "";
			foreach ($unProcessedBusinessEvents as $unprocessedEvent){
				if(!empty($insertValueString)){
					$insertValueString .= ",";
				}
				$parsedData = $this->parseBusinessEvent($unprocessedEvent);
				if(!empty($parsedData)){
					$insertValueString .="( ";
					$insertValueString .= $parsedData;
					$insertValueString .=" )";
				} else{
					break;
				}
			}
			
			if(!empty($insertValueString)){
				$insertUpdateSql .=  $insertValueString ;
				$result = $this->pushDataIntoReportingTable($insertUpdateSql,$postgresSqlConnection);
				
				//if the result is true then the transaction is success then we can delete such records.
				if($result === true){
					$this->deleteProcessedEvents($unProcessedBusinessEvents);
				} else {
					$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
				}
			}else{
				$result = "Data supplied is not in correct format";
				$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
			}
		}
	}
	
	/**
 	 * Prepares the SQL for create/update Quiz Scores related data from CMS events Table to the Reporting Database 
	 * quiz_score table
	 * Enter description here ...
	 * @param unknown_type $event_name
	 * @param unknown_type $postgresSqlConnection
	 */
	public function pushQuizScoreRecords($event_name,$postgresSqlConnection){
		$unProcessedBusinessEvents = $this->getBusinessEventsByEventName($event_name);
		$insertUpdateSql =  "INSERT INTO quiz_score (course_instance_id,course_id,student_id,quiz_id,evaluation_date,quiz_score,passing_score,datemodified) VALUES ";
		if(count($unProcessedBusinessEvents) > 0){
			$insertValueString = "";
			foreach ($unProcessedBusinessEvents as $unprocessedEvent){
				if(!empty($insertValueString)){
					$insertValueString .= ",";
				}
				$parsedData = $this->parseBusinessEvent($unprocessedEvent);
				if(!empty($parsedData)){
					$insertValueString .="( ";
					$insertValueString .= $parsedData;
					$insertValueString .=" )";
				} else{
					break;
				}
			}
			if(!empty($insertValueString)){
				$insertUpdateSql .=  $insertValueString ;
				$result = $this->pushDataIntoReportingTable($insertUpdateSql,$postgresSqlConnection);
				
				//if the result is true then the transaction is success then we can delete such records.
				if($result === true){
					$this->deleteProcessedEvents($unProcessedBusinessEvents);
				} else {
					$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
				}
			} else {
				$result = "Data supplied is not in correct format";
				$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
			}
		}
	}
	
	/**
	 * This method is used to push the course progress to the respective table in the reporting database
	 * @param unknown_type $event_name
	 * @param unknown_type $postgresSqlConnection
	 */
	public function pushCourseProgressRecords($event_name,$postgresSqlConnection){
		$unProcessedBusinessEvents = $this->getBusinessEventsByEventName($event_name);
		$insertUpdateSql =  "INSERT INTO course_progress (course_instance_id,course_id,progress,datemodified) VALUES ";
		if(count($unProcessedBusinessEvents) > 0){
			$insertValueString = "";
			foreach ($unProcessedBusinessEvents as $unprocessedEvent){
				if(!empty($insertValueString)){
					$insertValueString .= ",";
				}
				$parsedData = $this->parseBusinessEvent($unprocessedEvent);
				if(!empty($parsedData)){
					$insertValueString .="( ";
					$insertValueString .= $parsedData;
					$insertValueString .=" )";
				} else{
					break;
				}
			}
			if(!empty($insertValueString)){
				$insertUpdateSql .=  $insertValueString ;
				$result = $this->pushDataIntoReportingTable($insertUpdateSql,$postgresSqlConnection);
				
				//if the result is true then the transaction is success then we can delete such records.
				if($result === true){
					$this->deleteProcessedEvents($unProcessedBusinessEvents);
				} else {
					$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
				}
			} else {
				$result = "Data supplied is not in correct format";
				$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
			}
		}
	}
	
	/**
	 * This method will push the content into respective dimenstion table
	 * This method will get the information from the business events table according to 
	 * given event and push that information to the respective dimension table
	 * 
	 * @param unknown_type $event_name
	 * @param unknown_type $postgresSqlConnection
	 * @param String $insertUpdateSql Basic Insert statement for the dimension table
	 * 201405140925
	 */
	public function pushDimensionContentToReportingDB($event_name,$postgresSqlConnection ,$insertUpdateSql){
		$unProcessedBusinessEvents = $this->getBusinessEventsByEventName($event_name);
		if(count($unProcessedBusinessEvents) > 0){
			$insertValueString = "";
			foreach ($unProcessedBusinessEvents as $unprocessedEvent){
				if(!empty($insertValueString)){
					$insertValueString .= ",";
				}
				
				$parsedData = $this->parseDimensionBusinessEvent($unprocessedEvent,false);
				if(!empty($parsedData)){
					$insertValueString .="( ";
					$insertValueString .= $parsedData;
					$insertValueString .=" )";
				} else{
					break;
				}
			}
			
			if(!empty($insertValueString)){
				$insertUpdateSql .=  $insertValueString ;
				$result = $this->pushDataIntoReportingTable($insertUpdateSql,$postgresSqlConnection);
				
				//if the result is true then the transaction is success then we can delete such records.
				if($result === true){
					$this->deleteProcessedEvents($unProcessedBusinessEvents);
				} else {
					$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
				}
			} else {
				$result = "Data supplied is not in correct format";
				$this->updateEventsWithResult($result,$unProcessedBusinessEvents);
			}
		}
	}
	
	
	/**
	 Method for pushing the data into reporting database
	 * @param unknown_type $insertUpdateSql
	 */
	public function pushDataIntoReportingTable($insertUpdateSql,$postgresSqlConnection){
		$result = "";
		// Prepare a query for execution
		$result = pg_prepare($postgresSqlConnection, "my_query", $insertUpdateSql);
		try {
			// Execute the prepared query.  Note that it is not necessary to escape
			// the string "Joe's Widgets" in any way
			$result = pg_execute($postgresSqlConnection, "my_query", array());
			
			if(json_encode($result) == 'false' ){
				return pg_last_error($postgresSqlConnection);
			}
		}catch (Exception $e){
			return pg_last_error($postgresSqlConnection);
		}
		return true;
	}
	
	/**
	 * Parse the fact table data
	 * @param unknown_type $unprocessedEvent
	 */
	public function parseBusinessEvent($unprocessedEvent){
		$parsedData = "";
		if($unprocessedEvent){
			$data = $unprocessedEvent->data;
			if($data){
				$dataArrayObj = json_decode($data,true);
				if(!empty($dataArrayObj)){
					foreach ($dataArrayObj as $value){
						if(!empty($parsedData)){
							$parsedData .=",";
						} 
						if($value === true){
							$value = 1;
						} elseif ($value === false){
							$value = 0;
						}
						$isDate = $this->verifyDateOrNot($value);
						if($isDate){
							$parsedData .="'";
						}
						$parsedData .= $value;
						if($isDate){
							$parsedData .="'";
						}
					}
					
					$parsedData .= ",'";
					$parsedData .=  date("Y-m-d H:i:s",time());
					$parsedData .=  "'";
				}
			}
		}
		return $parsedData;
	}
	
	
	/**
	 * Parse the dimension table data 
	 * @param unknown_type $unprocessedEvent.
	 * 201405140925
	 */
	public function parseDimensionBusinessEvent($unprocessedEvent,$isTailingDateRequired){
		$parsedData = "";
		if($unprocessedEvent){
			$data = $unprocessedEvent->data;
			if($data){
				$dataArrayObj = json_decode($data,true);
				if(!empty($dataArrayObj)){
					foreach ($dataArrayObj as $value){
						if(!empty($parsedData)){
							$parsedData .=",";
						} 
						$dataType =	gettype($value);
						if($dataType == 'string'){	
							$parsedData .= "'";
						}
							$parsedData .= $value;
						
						if($dataType == 'string'){	
							$parsedData .= "'";
						}
					}
				}
			}
		}
		return $parsedData;
	}
	
	/**
	 * Verify given value is Date or not.
	 * Here we are giving one date format , if developer requires more date formats please add the formats to
	 * $formats variable.
	 * @param date $input
	 */
	public function verifyDateOrNot($input){
		$formats = array("Y-m-d H:i:s"); 
		foreach($formats as $format){
			$date = DateTime::createFromFormat($format, $input);
			if ($date == false || !(date_format($date,$format) == $input) ) {
	      	  return false;
			}else{
			  return true;
		    }
		}
	}
	
	/**
	 * This method is used to deleted processed events from the business events table
	 * @param unknown_type $event_name
	 */
	public function deleteProcessedEvents($businessEvents){
		//BusinessEventsRecord::finder()->deleteAll('process_status is NULL AND event_name = ?',array($event_name));
		if($businessEvents){
			foreach ($businessEvents as $businessEvent){
				$businessEvent->delete();
			}
		}
	}
	
	/**
	 * Update the Unprocessed business events record with the status result.
	 * If the transaction failes then it is error message.
	 * if transaction success then it will be true
	 * @param unknown_type $result
	 * @param unknown_type $unProcessedBusinessEvents
	 */
	public function updateEventsWithResult($result,$unProcessedBusinessEvents){
		foreach ($unProcessedBusinessEvents as $unprocessedEvent){
			$unprocessedEvent->process_status = $result;
			$unprocessedEvent->save();
		}
	}
}
?>