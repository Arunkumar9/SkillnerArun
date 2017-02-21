<?php
/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23362		   Arunkumar.muddada    201311151025    Modified :	getMessages()
 * 																Here we are getting messages related to a page wit the given perameters 
 * 																which are not satisfying if the messages are more than one page so modified code.
 * 
 * 23362		   Venkatesh Teja 		201311251756	Added MessageDetailsOfTheThread method for getting the record based on current selected thread.
 * 23362		   Tapaswini Sabat		201312021950	If the Instructor for a course is unassigned, then we are 
 * 														showing the correct alert message to the user.	
 * 27149		   Arunkumar.muddada    201404180205    Modified : updatePostRead
 * 																addded code which will set the message is readed or not.
 * 27149		   Arunkumar.muddada    201404180205    Added : reminderMailsPreparationToStudents
 * 															This method will prepare the data which is used to show in the student mail 
 * 														Added : getUnreadMessageCountOfUser
 * 															This method is useful to get Unread Message Count OfUser(student / instructor)
 * 														Added : getUnreadTaskCount
 * 															This method is useful to get Unread Task Count OfUser(student / instructor)
 * 														Added : getDaysCount
 * 															This method will give the differance in days between given date and current date
 * 														Added : prepareStudentRemainderMailRowFormat
 * 															This method is useful to create a rowbody for the each course related to this student
 * 														Added : prepareStudentReminderMailBody
 * 															This method is useful for the preparation of main mail body
 * 														Added : createUserThreadEmail
 * 															This method is responsible for preparing the Thread Email Record object
 * 27149		   Arunkumar.muddada    201404180205    Added : reminderMailsPreparationToInstructor
 * 															This method is used to findout all the ipen tasks and messages for Instructor.
 * 														Added : prepareInstructorReminderMailBody
 * 															This method is useful for the preparation of main mail body
 * 27152           Arunkumar.muddada    201404210527    Added : prepareEntityLink
 * 															This method is useful for the preparation of the Link for accessing the messaging window
 * 														Modified : prepareRemainderMailRowFormat 
 * 															Code to call the method prepareEntityLink for preparation the link.
 * 														Modified: 
 * 															reminderMailsPreparationToInstructor
 * 															reminderMailsPreparationToStudents
 * 															Code for passing courseinstanceid , userid to the prepareRemainderMailRowFormat method
 * 27156           Arunkumar.muddada    201404241123    Added : unreadMessageCountUpdateToBSS
 * 															This method is used to get the The notification contains the list of user id for who we have a change in unread stats during unread message update to BSS.For the active courses will be sent with unread message count.
 * 														Added : getUnreadMessageCountForUserCourseInstance
 * 															Unread Message Count For User CourseInstance combination
 * 														Added : getUnreadTaskCountForUserCourseInstance
 * 															Unread Task Count For User CourseInstance combination
 * 														Modified : updatePostRead
 * 															Added condition to check the unread_Post_Count is > 0 then put threadreadstatus to 1 otherwise 0
 * 														Modified : createThread
 * 															Added  to 1 means modified 
 * 														Modified : createPost
 * 															Added threadreadstatus to 1 means modified 
 * 														Modified : saveMessage
 * 															Added threadreadstatus to 1 means modified 
 * 27156           Arunkumar.muddada    201404241235    Code to support if the course instance do not have any update then we are not including that course
 * 27395           Arunkumar.muddada    2014070937		ADDED METHOD : createTaskDetailBusinessEvent :
 * 															This method is used to Create Business Events Entry for the Tasks
 * 															When a Task is created Or Updated If the Status of the task is changed then we are
 * 															registering this event in Business Events table.
 * 														MODIFIED : createPost
 * 															When a task is created or updatated we need to register that event in to Business Events
 * 															So calling the method "createTaskDetailBusinessEvent"
 * 28394           Arunkumar.muddada    201406180647   Modified : zipPackage: Code for the upload url , if the big file we have uploaded then the requestes are multiple and upload the data into amazon increases.
 * 														    So in the second request we will check is there any upload exists in the location if it exists then we are sending the url.
 */

Prado::using('FreshSystem.3rdparty.curl');

Prado::using('Application.clientside.direct.VideoRecordMgr');
Prado::using('Application.clientside.direct.CommentRecordMgr');
use Aws\S3\S3Client;
use Aws\S3\Command;
use Aws\Common\Enum\Size;
use Aws\Common\Exception\MultipartUploadException;
use Aws\S3\Model\MultipartUpload\UploadBuilder;
use Guzzle\Http\EntityBody;
use Aws\S3\Sync\DownloadSyncBuilder;

class CollaborationToolMgr extends TComponent {
    
	/**
	 * 
     * @remotable
     * 
     */
	
	public function captureMessageDetails( $params ) {

//		$time = microtime(true);

		$lastupdate = date('Y-m-d H:i:s', time()-6);//$time - 12;
		$unreadCount = 0;
		$retVals= array();
		$subSequentArray = array();
		$lessonCompleteStatus = array();
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		SWPLogManager::log("from polling",array("user"=>$user,"lastup"=>$lastupdate),TLogger::INFO,$this,"captureMessageDetails","SWP");
		$cri = new TActiveRecordCriteria;

		$cri->Condition ='(thread_message.content_id =:content_id AND thread_message.product_id =:product_id AND 
		thread_message.last_update > :lastupdate ) ORDER BY last_update DESC'; //'last_update > :lastupdate';
		$cri->Parameters[':lastupdate'] =$lastupdate;
		$cri->Parameters[':content_id'] =$user->ContentID;
		$cri->Parameters[':product_id'] =$user->ProductID;

		$userRec = UserRecord::finder()->withThread($cri )->find(' uid =? ' , array(  $user->Uid ));

		$threads =  $userRec->thread ;
		
		$studentId = $user->getStudentID();
		$otherUserId = 0;
		if($user->Uid == $studentId ){
			$otherUserId = $user->getInstructorID();
		} else {
			$otherUserId = $studentId;
		}

		foreach ( $threads as $thread ) {
			$subsequentLessonIds = array();
			$videoRecordMgr = new VideoRecordMgr();
			
			$threadUser = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? ' , array( $user->Uid,$thread->uid ));

			//Dont send the thread record to the browser if it is already read by the user.
				
			if( $threadUser->unread_Post_Count == 0 || $threadUser->unread_Post_Count == false ) {

				continue;
			}
			$thread->unread_Post_Count	 =	$threadUser->unread_Post_Count;
			$thread->link 			 = 	$thread->reference->name;
			$thread->reference 		 = 	$thread->reference;
			$thread ->views 			 = 	$threadUser->noofposts;
			$updateUser 			 = 	$thread->lastUpdateUser;
			$thread->lastUpdateUser  = 	($updateUser->Name ? $updateUser->Name : $updateUser->Username);
			$thread->status       =  $thread->status;
			$thread->questionStatus = null;
			
			if ( $thread->reference->question_id != null ) {
				$thread->questionStatus = $thread->status;
				$questions = QuizRecord::finder()->findAll('parent_id = ? ',$thread->reference->video_id);
				$defaultstatus = -1;
				$statusCode = 99;
				$oneUpdatefromOtherUser = false;
				foreach( $questions as $question ){
					$QReference = LastRunRecord::finder()->find('video_id = ?  AND question_id = ? AND product_id = ? AND content_id = ? AND subject ="taskref" ',$thread->reference->video_id,$question->uid,$thread->reference->product_id,$thread->reference->content_id);
					if( count ( $QReference ) > 0 ){
						$QThreadRecord = ThreadRecord::finder()->find('reference_id = ?',$QReference->uid);
					    $QThreadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $QThreadRecord->uid,$user->Uid) );
					    if ($QThreadUser->unread_Post_Count > 0){
					      	$unreadCount = $unreadCount+1;
					    }
					    if( !$oneUpdatefromOtherUser ){
							if( $QThreadRecord->last_update_user_id == $otherUserId && $QThreadRecord->status != $statusCode ){
						    	$thread->status = 4;
						    	$oneUpdatefromOtherUser = true;
						    }else{
						        if ( $defaultstatus == -1 ) {
						    		$defaultstatus = $statusCode;
						    	}
							    if( $QThreadRecord->status < $defaultstatus) {							    	
								    $defaultstatus = $QThreadRecord->status;
								}
							}
						}
					}
				}
				if( !$oneUpdatefromOtherUser ){
				
					if( $defaultstatus == '4' && $otherUserId == prado::getApplication()->getUser()->getStudentId()){
				    	
						$thread->status = 5;
				    } else {
				    
						$thread->status			 =  $defaultstatus;
				    }
				}
			} else {
			 	$cid = $user->getContentID();
			 	
				$video_id = $thread->reference->video_id;
				
				//When a task is closed or opened related to a lesson , then we need to first see that lesson have settings 
				//if it is having the settings then check is it task dependent .
				//If it is task dependent then we need to change the lock status according to that other wise no need to do any thing. 
				$lessonSettingsIsTaskDependent = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND setting_name = "SUB_SEQUENT_LOCK "',
									array( $user->ContentID, $video_id ) );
				if(count($lessonSettingsIsTaskDependent) > 0){	
					if($lessonSettingsIsTaskDependent->setting_value == 1)	{	
						$lessonSubsequentRecs = ProductLessonSettingRecord::finder()->findAll( 'course_id = ? AND lesson_id = ? AND setting_value = 1 AND setting_name != "SUB_SEQUENT_LOCK "',array( $user->ContentID, $video_id ) );
						if( count($lessonSubsequentRecs) > 0){
							if($thread->status == '99'){	
								//If the task is Closing then we will see the subsequent cotent which is opted for lock.
								//And the task related lesson is completed or not.
								//if that is complete then we will send back the list of subsequent content so we can remove this 
								//video_id from the subSequentArray of the particular content.
								$lessonProgess = $videoRecordMgr->getLessonCompletedStatus( $video_id , $pid );
								if($lessonProgess){
									foreach ( $lessonSubsequentRecs as $lessonSubsequentRec ){
				   						array_push($subsequentLessonIds, $lessonSubsequentRec->content_id ) ;
									}
								}
							} else {
								//If the task is reopening then we will just see the subsequent cotent which is opted for lock.
								foreach ( $lessonSubsequentRecs as $lessonSubsequentRec ){
									array_push($subsequentLessonIds, $lessonSubsequentRec->content_id ) ;
								}
							}
						}
					}
				}
			}
			
			$thread->uid			 =	$thread->uid;         
			$threadPosts 			 = 	ThreadPostRecord::finder()->find('uid = (SELECT max(uid) FROM thread_posts) AND thread_id = '.$thread->uid);
				
			$thread->postSubject 	 = 	$threadPosts->subject;
			$thread->unreadcount = $unreadCount;
			$retVals[]=$thread;
			$subSequentArray[$thread->reference->video_id] = $subsequentLessonIds;
			$lessonCompleteStatus[$thread->reference->video_id] = $videoRecordMgr->getLessonCompletedStatus( $thread->reference->video_id , $pid );
		}

		$taskStatusData = CollaborationToolMgr::getTaskStatus();
			 foreach($taskStatusData as $statusRecord){
			 	
			   if($statusRecord['FinalStatus'] == "True"){
			    
			     $statusCode = intval($statusRecord['ID']);
			     
			   }
			   
			  
			 }

		$fullyCompleted =  ThreadRecord::finder()->findAll('thread_type_id = ? AND product_id = ? AND content_id = ? And status!= ?',array(3,$user->ProductID,$user->ContentID,$statusCode));
		
		
		if ( count($fullyCompleted) > 0 ){
			$fullyCompleted = false;
		} else {
			$fullyCompleted = true;
		}
	
		$coursestatus = $this->getCourseStatus($statusCode, $otherUserId);
		
		SWPLogManager::log("captureMessageDetails returns",array("record"=>$retVals,"fullyCompleted"=>$fullyCompleted,
				"courseStatus" => $coursestatus,"lastup"=>$lastupdate),TLogger::INFO,$this,"captureMessageDetails","SWP");
		
		return array(
		"record"=>$retVals,
		"fullyCompleted"=>$fullyCompleted,
		"courseStatus" => $coursestatus,
		"subSequentContent"=>$subSequentArray,
		"lessonCompleteStatus"=>$lessonCompleteStatus
		);
	}
	
 	/**
     * @remotable
     * 	
     *  Gets called on badge button got rendered from front end.
     *  @return thread records for the particular user based on thread_id
     * 
     */
	public function getUnReadMessageCount( $params ){
		
		SWPLogManager::log("get Unread Messages/ Tasks",array("params"=>$params),TLogger::INFO,$this,"getUnReadMessageCount","SWP");
		$user = Prado::getApplication()->getUser();
		SWPLogManager::log("User object",array("user"=>$user),TLogger::DEBUG,$this,"getUnReadMessageCount","SWP");
		$userRecords = ThreadUserRecord::finder()->findAll(' user_id =? AND unread_Post_Count > 0' , $user->Uid );
		
		$returnValues = array();
		foreach ( $userRecords as $userRecord ){
			$threadRecords = ThreadRecord::finder()->findAll('uid=? AND content_id=? AND product_id=?',array($userRecord->thread_id, $user->ContentID , $user->ProductID ));
			
			foreach ($threadRecords as $threadRecord ){
				
				$userRecord->thread_catogery_id = $threadRecord->thread_catogery_id;
				$userRecord->thread_type_id = $threadRecord->thread_type_id;
				$returnValues[] = $userRecord;
			}
		}
		SWPLogManager::log("No. of Unread Messages and Tasks",array("unreadCount"=>$returnValues),TLogger::INFO,$this,"getUnReadMessageCount","SWP");
		return $returnValues;
	}
		
	/**
	 * @remotable
	 *
	 *	Retrives the Threads from the database based on the parameters thread_type_id and logged in userid
	 *	Gets called when ever messages store got loaded.
	 *
	 */
    
	public function getMessages( $params ) {
		SWPLogManager::log("get Messages/ Tasks",array("params"=>$params),TLogger::INFO,$this,"getMessages","SWP");
		$user = Prado::getApplication()->getUser();
		$contentid = $user->ContentID ;
		$productId = $user->getProductID();
		
		/**
		 * Here we are finding out the server time zone and maintaining in a global variable.
		 * */
		
		if ( !(Prado::getApplication()->getGlobalState("serverTimezone")) ){
			$dt = new DateTime();
			$timezone =  $dt->getTimeZone()->getName();
			Prado::getApplication()->setGlobalState("serverTimezone", $timezone);
		}
		$threadType = $params['thread_type_id'];
		$freeText = $params['filter'][0]['value'];
		$start =  $params['start'];
		$limitValue = $params['limit'];
		$page = $params['page'];
        
		$cri = new TActiveRecordCriteria;

		if( $freeText ) {

			// Condition-- checking whether freetext(text added in filterfield) is present in message subject or post content or refernce link
			//201311151025	
			$cri->Condition = 'thread_type_id =:threadType AND thread_message.content_id = :contentId AND thread_message.product_id = :product_id  AND ('.
					'(subject LIKE :freeText OR thread_message.uid IN ( SELECT tp.thread_id FROM thread_posts tp WHERE tp.subject LIKE '
					.':postSubText OR tp.content LIKE :postcontentText )) OR thread_message.reference_id IN(SELECT uid from last_run_info WHERE name LIKE '.
					':referenceText ) ) ORDER BY last_update DESC';

					$cri->Parameters[':threadType'] =$threadType;
					$cri->Parameters[':freeText'] ='%'.$freeText.'%';
					$cri->Parameters[':postSubText'] ='%'.$freeText.'%';
					$cri->Parameters[':postcontentText'] ='%'.$freeText.'%';
					$cri->Parameters[':referenceText'] = '%'.$freeText.'%';
					$cri->Parameters[':contentId'] =  $contentid;
					$cri->Parameters[':product_id'] = $productId;


		} else {

			$cri->Condition = 'thread_type_id = :thread_type_id AND thread_message.content_id = :contentId  AND thread_message.product_id =:product_id ORDER BY last_update DESC';
			$cri->Parameters[':contentId'] =  $contentid;
			$cri->Parameters[':product_id'] = $productId;
			$cri->Parameters[':thread_type_id'] =$threadType;
		}


		if( $threadType ) {

			$userRec = UserRecord::finder()->withThread($cri )->find(' uid =? ' , array(  $user->Uid ));
			$threads =  $userRec->thread ;
			
			// Maintaining the Login usrs local time zone in a global variable.
			Prado::getApplication()->setGlobalState("currentTimezone", $userRec->timezone);
			
			/*
			 * $totalCount is the total number of threads
			 *
			 */

			$totalCount = count( $threads );

			/*
			 * $start is the start value used in paging
			 *
			 **/
			//201311151025
			if($start >= $limitValue) {
				$limitValue = $start+$limitValue;
			} 
			
			//201311151025
			if( $start >=0 && $limitValue ) {
				
				$cri->Condition = $cri->Condition.'LIMIT '.$start.','.$limitValue;
			}

			$userRec = UserRecord::finder()->withThread($cri)->find(' uid =? ' , array(  $user->Uid ));
			$threads =  $userRec->thread ;
			
			$retVals= array();

			$trainingfiles = null;
			
			foreach ( $threads as $thread ) {
				
			$postsByUser = 0;
			$postsByThreadCreator = 0;
			$matchedthreads = ThreadRecord::finder()->findAll( 'content_id = ? AND product_id = ?' , array( $user->ContentID, $user->ProductID) );
			foreach( $matchedthreads as $threadMatch ) {

				$threadPosts = ThreadPostRecord::finder()->findAll( 'thread_id = ? ' , array( $threadMatch->uid) );
				
				foreach( $threadPosts as $post ) {
					// Please dont delete this code, in future we amy need to use the same code.
//					if( $post->author_id == $thread->last_update_user_id ) {
//						$postsByUser += 1;
//					}
				if( $post->author_id == $thread->created_user_id ) {
						$postsByThreadCreator += 1;
					}

				}
			}
					
				/**
				 * If a task has training files then only training files button in task detail window should be enabled
				 */
				
				if( ($thread->thread_type_id == 3 )  && ( $thread->reference_id ) ){
						
					$lastrunRecord = LastRunRecord::finder()->find(' uid = ?' , array(  $thread->reference_id  ) );
						
					if( empty( $lastrunRecord->question_id ) ) {

						$trainingfiles = TrainingFilesRecord::finder()->find('lesson_id = ? ',$lastrunRecord->video_id);

					}else{
						
						$trainingfiles = TrainingFilesRecord::finder()->find('question_id = ? ',$lastrunRecord->question_id);
						
					}
						
					if( count( $trainingfiles ) > 0 ){

						$trainingfiles = true;
						 
					}else {
						$trainingfiles = false;
					}
					 

				}

				// It will return the number of post for the thread having content size more then 50kb.
				
				$threadPosts = ThreadPostRecord::finder()->findAll( 'thread_id = ? AND LENGTH(content) > 51200 ' , array( $thread->uid ) );
				$thread->largeFile = count($threadPosts);			
				$thread->reference = $thread->reference;
				$thread->link = $thread->reference->name;
				$thread->chaptername = $thread->reference->chaptername;
				$creatorName = UserRecord::finder()->find('Uid = ?',$thread->created_user_id);
				$thread->authorName = ($creatorName->Name ? $creatorName->Name : $creatorName->Username);
				$thread->image  = $creatorName->photo;
				$threadUsers = ThreadUserRecord::finder()->findAll('thread_id = ? ' , array($thread->uid ));
				$thread->views = 0;

				foreach ( $threadUsers as $userThread ) {

					$thread->views = $thread->views + $userThread->noofposts;
				}

				$threadUser = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? ' , array( $user->Uid,$thread->uid ));

				$thread->postCount= $postsByUser;
				$thread->creatorPostCount= $postsByThreadCreator;
				$thread->unread_Post_Count =$threadUser->unread_Post_Count;
				$updateUser = $thread->lastUpdateUser;
				$thread->lastUpdateUser = ($updateUser->Name ? $updateUser->Name : $updateUser->Username);
//				$last_update = date('m/d/y H:i:s', strtotime($thread->last_update));
//				$thread->last_update = $last_update;
				
				// Here we are converting the server time to Local time and sending it to front end.
				$serverTimezone = Prado::getApplication()->getGlobalState("serverTimezone"); 
				$currentTimezone = Prado::getApplication()->getGlobalState("currentTimezone");
//				$thread->last_update = $this->convertFromOneTimeToAnother($thread->last_update, $serverTimezone, $currentTimezone );
				$thread->last_update = $this->convertDateTimeZone($thread->last_update, $currentTimezone );
				$thread->content_id = $thread->content_id;
				$thread->trainingfiles = $trainingfiles;
				
				$retVals[]=$thread;
			}
			
			SWPLogManager::log("return Messages/ Tasks",array("total"=>$totalCount,'data'=>$retVals),TLogger::INFO,$this,"getMessages","SWP");
			return array('total'=>$totalCount,'data'=>$retVals);
		}
		
	}
	
	/**
	 * It will convert the date and time from one time zone 
	 * to other time zone based on the values specified in the parameter.
	 * 
	 * */
	
	public function convertFromOneTimeToAnother($time,$currentTimezone,$timezoneRequired){
		
		SWPLogManager::log("Converting From One Time To Another",array("Time"=>$time,'Current Time zone'=>$currentTimezone, "Required time zone"=>$timezoneRequired),TLogger::INFO,$this,"convertFromOneTimeToAnother","SWP");
		$system_timezone = date_default_timezone_get();
	    $local_timezone = $currentTimezone;
	    date_default_timezone_set($local_timezone);
	    $local = date("Y-m-d h:i:s A");
	 
	    date_default_timezone_set("GMT");
	    $gmt = date("Y-m-d h:i:s A");
	 
	    $require_timezone = $timezoneRequired;
	    date_default_timezone_set($require_timezone);
	    $required = date("Y-m-d h:i:s A");
	 
	    date_default_timezone_set($system_timezone);
    
    
	    $diff1 = (strtotime($gmt) - strtotime($local));
	    $diff2 = (strtotime($required) - strtotime($gmt));
	
	    $date = new DateTime($time);
	    $date->modify("+$diff1 seconds");
	    $date->modify("+$diff2 seconds");
	    $timestamp = $date->format("m-d-Y H:i:s");
	    SWPLogManager::log("Returning Time stamp",$timestamp,TLogger::INFO,$this,"convertFromOneTimeToAnother","SWP");
	    return $timestamp;
	}
	
	
	/**
     *	
     *	@remotable
     *
     *  Create a public/private Thread(s) (Messgae) based on the model passed
     *  
     */
		
	public function createMessage( $params ) {
		SWPLogManager::log("Create Message",array("params"=>$params),TLogger::INFO,$this,"createMessage","SWP");
		$threadTypeId = $params['thread_type_id'];
		$threadCatogeryId = $params['thread_catogery_id'];
		$toList = $params['to'];
		$commentUid = $params['commentUid'];
		$record = $params['record'];
		$taskaction = $params['taskaction'];
		$status = $params['status'];
		//201312021950
		$old_instructorId = $params['old_instructorId'];
		$user = Prado::getApplication()->getUser();

		if( $threadTypeId != 1 &&  $threadCatogeryId != 1 ) {
			
			if($threadTypeId == 3){
				$toList = $this->getCourseInstanceStudent();
			}
			$result = $this->createThread( $params['subject'], $threadTypeId,$threadCatogeryId, $params['class_id'],$params['content_id'] ,
			$params['attachments'], $params['content'],$toList ,$params['reference_id'],$commentUid,$taskaction,$status, $user );
			
			SWPLogManager::log("Create Message",array("Result"=>$result),TLogger::INFO,$this,"createMessage","SWP");
			return $result;

		}else if( $threadTypeId == 1 &&  $threadCatogeryId == 1 ) {

			foreach ( $toList as $to ) {
				//201312021950
				$res = $this->createThread( $params['subject'], $threadTypeId,$threadCatogeryId, $params['class_id'],$params['content_id'] ,
				$params['attachments'], $params['content'],array($to) ,$params['reference_id'],$commentUid,$taskaction,$status, $user, $old_instructorId);
				 
				SWPLogManager::log("Create Message",array("Result"=>$res),TLogger::INFO,$this,"createMessage","SWP");
				return $res;
			}

		}else {
			//201312021950	
			$res = $this->createThread( $params['subject'], $threadTypeId,$threadCatogeryId, $params['class_id'],$params['content_id'] ,
			$params['attachments'], $params['content'],$toList,$params['reference_id'],$commentUid,$taskaction,$status, $user, $old_instructorId );
			
			SWPLogManager::log("Create Message",array("Result"=>$res),TLogger::INFO,$this,"createMessage","SWP");
			return $res;

		}

	}
	
	/**
     * 
     * 	create and invdividual thread with the passed values. and create threadUser records for the thread and user
     * 	201312021950
     */
	
    private function createThread( $subject,$thread_type_id,$thread_catogery_id,$class_id,$content_id,$attachments,$content,$toList,$reference_id,$commentUid,$taskaction,$status, $user,$old_instructorId ) {
    	
    	SWPLogManager::log("Create a thread",array("subject"=>$subject,"thread_type_id"=>$thread_type_id,"thread_catogery_id"=>$thread_catogery_id,"class_id"=>$class_id,
		"content_id"=>$content_id,"attachments"=>$attachments,"content"=>$content,"toList"=>$toList,"reference_id" =>$reference_id,"toList"=>$toList,"commentUid" =>$commentUid,
		"taskaction"=>$taskaction, "status"=>$status,"user"=>$user ),TLogger::INFO,$this,"createMessage","SWP");
    	
		$thread = new ThreadRecord();
    	
		if( $thread_type_id === 2 ) {
    		$thread_catogery_id = 3;
    	}else if( $thread_type_id === 3 ) {
    		$thread_catogery_id = 4;
    	}
    	
    	if( !empty($reference_id['lesson']) ) {

    		// storing the static text as 'taskref' if the thread is of type task
    		if($thread_catogery_id == 4){
    			$last_run_subject = 'taskref';
    		}else{
    			$last_run_subject = 'threadref';
    		}
    		
	    	$videoRecordMgr = new VideoRecordMgr();
	    	/*
	    	 * refs #7347
	    	 * Modified the $reference_id['vidoe_id'].
	    	 */
			$ref_id = $videoRecordMgr->logReference($reference_id['chapter'],$reference_id['video_id'], $reference_id['seek'], $reference_id['quiz'],null,$reference_id['lesson'],$last_run_subject, $reference_id['chaptername'], $reference_id['ordering'] );
	    	
			$thread->reference_id= $ref_id;
	    }
	    
    	
       	$contentid = $user->ContentID;
    	$created = date("Y-m-d H:i:s",time());
    	
    	$formatedSubject= $this->formatText( $subject );
    	$thread->taskaction = $taskaction;
    	$thread->subject = $formatedSubject;
    	$thread->created_user_id = $user->Uid;
    	$thread->last_update_user_id = $user->Uid;
    	$thread->views = 0;
    	$thread->posts= 0;
    	$thread->hidden= 0;
    	$thread->thread_type_id= $thread_type_id;
    	$thread->thread_catogery_id= $thread_catogery_id;
    	$thread->class_id= $class_id;
    	$thread->content_id = $contentid;
    	$thread->status = $status;
    	$thread->product_id = $user->getProductID();
    	
    	if( empty($attachments) ) {
    		$hasattachments = 0;
    	} else {
    		$hasattachments = 1;
    	}
    	
    	$thread->hasattachments=$hasattachments;
    	$thread->last_update = $created;
    	$thread_id = $thread->uid;
    	$thread->save() ;
    	
	    if( $thread->uid && $commentUid ){
	        $commentRecordMgr = new CommentRecordMgr();	
			$p['thread_id'] = $thread->uid;
	        UserLCommentRecord::finder()->updateByPk($p,$commentUid);
	    }
    	
  	 	if( $thread_type_id != 1 ) {
  	 		foreach ( $toList as $value ) {
  	 			$noofposts;
  	 			$readcomment;
  	 			if( $value == $user->Uid ) {
  	 				$noofposts = 1;
  	 				$readcomment = 0;
  	 			}else {
  	 				$noofposts = 0;
  	 				$readcomment = 1;
  	 			}
  	 			
  	 			// If it is a autoTask then we are making the task as read one.
  	 			if ($user->Uid == 0 ){
  	 				$readcomment = 0;
  	 			}
  	 			
  	 			$threadUser = new ThreadUserRecord();
  	 			$threadUser->user_id = $value;
  	 			$threadUser->thread_id = $thread->uid;
  	 			$threadUser->noofposts = $noofposts;
  	 			$threadUser->unread_Post_Count = $readcomment;
  	 			//201404241123
  	 			if($readcomment == 1){
  	 				$threadUser->threadreadstatus  = 1;
  	 			}
  	 			$threadUser->save();
  	 		}
	    }else if( $thread_type_id == 1 ) {
    	
    		foreach ( $toList as $value ) {
    			
    			$threadUser = new ThreadUserRecord();
    			$threadUser->thread_id = $thread->uid;
    			$threadUser->user_id = $value;
    			$threadUser->noofposts =0;
    			$threadUser->unread_Post_Count = 1;
    			//201404241123
    			$threadUser->threadreadstatus  = 1;
    			
    			$threadUser->save();
    		}
    		
    		$threadUser = new ThreadUserRecord();
	    	$threadUser->thread_id = $thread->uid;
	    	$threadUser->user_id = $user->Uid;
	    	$threadUser->noofposts =0;
	    	$threadUser->unread_Post_Count = 0;
	    	$threadUser->save();
    	}
    	 
    	if ( $thread->uid ) {
    	//201312021950
    		$postUid = $this->createPost( $subject, $content, $user->Uid, $created, $thread->uid, null, 0 , $created, $attachments, $user, null, null, $thread_type_id, $toList, $old_instructorId);
    	}
    	
    	$response = array();
    	$response['thread_uid'] = $thread->uid;
    	$response['tolist'] = $toList;
    	$response['useruid'] = $user->Uid;
    	$response['created'] = $created;
    	$response['postuid'] = $postUid;
    	$response['oldInstructor'] = $old_instructorId;
    	
    	SWPLogManager::log("Thread Created Succesfully",$thread->uid,TLogger::INFO,$this,"createThread","SWP");
    	return $response;// $thread->status;
    }
	
 	/**
     * 
     * create a post for the Thread with the passed values
     * 201312021950
     */
    
    public function createPost( $subject,$content,$authorId,$created,$threadId,$quotedPostId,$hidden,$updatedTime,$attachments,$user,$action,$updatepost,$thread_type_id, $toList,$old_instructorId ) {
    	
    	SWPLogManager::log("create a post",array("subject"=>$subject,"thread_type_id"=>$thread_type_id,
		"attachments"=>$attachments,"content"=>$content,"toList"=>$toList,"reference_id" =>$reference_id,"toList"=>$toList,"quotedPostId" =>$quotedPostId,
		"authorId"=>$authorId, "created"=>$created,"user"=>$user,"threadId"=>$threadId, "hidden"=>$hidden, "updatedTime"=>$updatedTime,
		"action"=>$action,"updatepost"=>$updatepost),TLogger::INFO,$this,"createPost","SWP");
    	
		$post = new ThreadPostRecord();
    	
    	$formatedSubject= $this->formatText( $subject );
    	
    	$post->subject = $formatedSubject;
    	
    	$formatedContent= $this->formatText( $content );
    	
    	$post->content = $formatedContent;
    	$post->author_id = $authorId;
    	$post->created = $created;
    	$post->thread_id = $threadId;
    	$post->updated = $updatedTime;
    	$post->hidden = $hidden;
    	$post->quoted_post_id = $quotedPostId;
    	
    	if( empty($attachments) ) {
    		$hasattachments = 0;
    	}else {
    		$hasattachments = 1;
    	}
    	 	
    	$post->hasattachments = $hasattachments;
    	
    	$saved =  $post->save() ;
    	
    	// When a post get created successfully then insert record
    	// to thread Email table and thread_post_users table. 
    	if ( $post->uid ) {
    			//201312021950
    			$this->createThreadEmail( $from,$to,$cc,$bcc,$post->subject,$post->content,null,null,$post->uid,$post->thread_id, $attachments, $user, $old_instructorId );
    			$this->createThreadPostUser( $authorId, $threadId, $post->uid, $thread_type_id, $toList );
    	}
    	
    	
    	$thread = $post->thread;
    	$thread->last_update_user_id = $authorId;
    	$thread->posts = $thread->posts +1;
    	$thread->last_update = $created;
    	
    	if( $hasattachments > 0 ){
    		
    		$thread->hasattachments =1;
    	}
    	
    	$thread->save();
    	
    	$taskStatus = $thread->status;
    	
    	if( $updatepost == true ){
    		
	    	$threadUsers = ThreadUserRecord::finder()->findAll(' thread_id ='.$post->thread_id);
	    	
		    foreach ($threadUsers as $threadUser){
		    	
				if( $thread->last_update_user_id != $threadUser->user_id ){
					
			    	$threadUser->unread_Post_Count = $threadUser->unread_Post_Count + 1;
			    	//201404241123
			    	$threadUser->threadreadstatus  = 1;
			    	$threadUser->save();
				}
		    }
    	 if (  $action ) {
    	 	   	 		 	    	 	
	    	$flag = false;
	    	
	    	/**
	    	 * refs #6036
	    	 * If student is adding the post in the current task for the first time then the status should not be changed.
	    	 * If not first time then it should be changed to 5.
	    	 * If the student is replying for the completed task then the status will remain same.
	    	 */
	    	
			$studentId = $user->getStudentID();
    	 	$threadpostRecord = ThreadPostRecord::finder()->findAll(' author_id = ? AND thread_id =? ' , array( $studentId, $threadId ) );
			$threadMessage = ThreadRecord::finder()->find(' uid ='.$post->thread_id);
			$studentUpdateStatus = null;
			$closeStatus = null;
			$taskStatuss = $this->getTaskStatus();
			for ( $i = 0 ; $i < count($taskStatuss); $i++ ) {
					
					
				if ( $taskStatuss[$i]['StudentUpdateStatus'] == "true" ) {

					$studentUpdateStatus = $taskStatuss[$i]['ID'];

				}
				if( $taskStatuss[$i]['FinalStatus'] == "true"  ){
					$closeStatus = $taskStatuss[$i]['ID'];
				}
			}

			// to make sure that when student is creating post then taskaction should be the thread task action
				if( $studentId == $user->Uid ){
					$action = $threadMessage->taskaction;
				}	
					
				$task_actions = $this-> getTaskActions();
				for ( $i = 0 ; $i < count($task_actions); $i++ ) {


					if ( $task_actions[$i]['ID'] == $action ) {
							
						$taskStatus = $task_actions[$i]['StatusCode'];

							
					}
				}
			if( $taskStatus == $closeStatus ){
				$taskStatus =  $closeStatus;
			}else if( $user->Uid == $studentId) {
				$taskStatus = $studentUpdateStatus;
			}
//    		if( $taskStatus == 4 && $threadMessage->created_user_id == 0){
//	        		if( count ( $threadpostRecord ) == 0 ){
//	        			
//			        	$threadMessage->status = 3;
//						        			
//	        		}else{
						        			
					    $threadMessage->status = $taskStatus;
//					}
//			}else{
//					$threadMessage->status = $taskStatus;
//			}
					$threadMessage->taskaction = $action;
					$threadMessage->save();
		    
		    }
		   
    	}
    	//2014070937
    	//When a task is created or updatated we need to register that event in to Business Events
    	if($thread_type_id == 3){
    		$userRecords = UserRecord::finder()->find( 'uid = ?', array($user->getStudentID()) );
			$this->createTaskDetailBusinessEvent($user->getProductID(),$user->ContentID,$userRecords->Username,$taskStatus,$threadId);
    	}
    	
		SWPLogManager::log("Post Created Succesfully",array("taskStatus"=>$taskStatus),TLogger::INFO,$this,"createPost","SWP");
    	return $post->uid;
    }
    
	/**
     *	
     *	@remotable
     *
     *  Create a public/private Thread(s) (Messgae) based on the model passed
     *  
     */
    
     public function createThreadPostAttachment($params){
     	$postUId 		 = $params['postuid'];
     	$created		 = $params['created'];
     	$thread_id		 = $params['thread_uid'];
     	$hasattachments	 = $params['hasAttachment'];
     	$attachments	 = $params['attachments'];
     	
    	if($postUId == null){
    		$post = ThreadPostRecord::finder()->find(' thread_id = ? AND created=?' , array( $thread_id , $created) );
    		if(count($post) > 0){
    			$postUId = $post->uid;
    		}
    	} else{
    		$post = ThreadPostRecord::finder()->find(' uid = ?' , array( $postUId) );
    	}
    	if( $postUId && $hasattachments > 0 ){
    		$alreadyZipped = false;
    		foreach ( $attachments as $atachment ) {
    			if ( Prado::getApplication()->Parameters['fileupload'] == "s3"){
	    			if( !$alreadyZipped ){
			    		$this->createDownloadAll($atachment['PATH']);
			    		$alreadyZipped = true;
	    			}
    			}
    			
    			if ( Prado::getApplication()->Parameters['fileupload'] == "s3"){
    				$this->createAttachments( $atachment['size'], $atachment['objecturl'], $post->uid );
    			} else {
    				$this->createAttachments( $atachment['name'], $atachment['PATH'], $post->uid );
    			}	
    		}
    	}
    	
    	return true;
     }
    
    public function createDownloadAll ($path){
		require 'config.php';
		SWPLogManager::log("Create Download All folder in s3",array("path"=>$path),TLogger::INFO,$this,"createDownloadAll","SWP");
    	if ( is_dir($path) ){
    		
    		try {
	    		 $zipPath = self::compress( $path, 'downloadAll', '/'.$path,false);
	    		
	    		$client = S3Client::factory(array(
			    'key'    => $key,
			    'secret' => $secret
				));
				
//				$zipPath = $_SERVER['DOCUMENT_ROOT'].'/'.$path.'downloadAll.zip';
				$actualPath = $path.'/downloadAll.zip';
			
				$uploader = UploadBuilder::newInstance()
			    ->setClient($client)
			    ->setBucket($bucket)
			    ->setKey($actualPath)
			    ->setSource($zipPath)
			    ->setOption('ACL','public-read')
			    ->build();
			    
			    $uploadresult = $uploader->upload();
			    $requiredPath = substr($path, 0, -1);
			    $this->rrmdir($_SERVER['DOCUMENT_ROOT'].'/'.$requiredPath );
		    	if ( file_exists($_SERVER['DOCUMENT_ROOT'].'/'.$path.'downloadAll.zip') ) {
		    		
		    		unlink( $_SERVER['DOCUMENT_ROOT'].'/'.$path.'downloadAll.zip' );
		    	}
    			
    		} catch (Exception $e) {
    			
    			$uploader->abort();
    			SWPLogManager::log("Exception Occoured",array("Message"=>$e->getMessage()),TLogger::ERROR,$this,"createDownloadAll","SWP");
    		}
    		
    
    	}
    	
}

    /**
     * 
     * When a post get created successfully, insert one record for the users 
     *  to the thread_post_users table inorder to maintain the read flag for the post.
     * 
     * */
    
    public function createThreadPostUser( $userId, $threadId, $postId,  $thread_type_id, $toList ){
    	
    	SWPLogManager::log("Create Entry in Thread_post_user",array("userId"=>$userId,"threadId"=>$threadId,
		"postId"=>$postId,"thread_type_id"=>$thread_type_id,"toList"=>$toList),TLogger::INFO,$this,"createThreadPostUser","SWP");
    	
    	if( $thread_type_id != 1 ) {
    		
  	 		foreach ( $toList as $value ) {
  	 			$unread_post;
  	 			
  	 			if( $value == $userId ) {
  	 				
  	 				$unread_post = 0;
  	 				
  	 			}else {
  	 				
  	 				$unread_post = 1;
  	 			}
  	 			
  	 			// If it is a autoTask then we are making the task as read one.
  	 			if ( $userId == 0 ){
  	 				$unread_post = 0;
  	 			}
  	 			
  	 			$threadPostUser = new ThreadPostUserRecord();
  	 			$threadPostUser->user_id = $value;
  	 			$threadPostUser->thread_id = $threadId;
				$threadPostUser->post_id = $postId ;
  	 			$threadPostUser->unread_post = $unread_post;
  	 			$threadPostUser->save();
  	 		}
  	 		
	    		
	    } else if( $thread_type_id == 1 ) {
	    	
    		foreach ( $toList as $value ) {
    			$threadPostUser = new ThreadPostUserRecord();
    			$threadPostUser->thread_id = $threadId;
    			$threadPostUser->user_id = $value;
    			$threadPostUser->post_id = $postId ;
    			$threadPostUser->unread_post =1;
    			$saved = $threadPostUser->save();
    		}
    		
    		$threadPostUser = new ThreadPostUserRecord();
	    	$threadPostUser->thread_id = $threadId;
	    	$threadPostUser->user_id = $userId;
	    	$threadPostUser->post_id = $postId ;
	    	$threadPostUser->unread_post = 0;
	    	$threadPostUser->save();
    	}
    	SWPLogManager::log("Thread_post_user entry Succesfull",$threadPostUser,TLogger::INFO,$this,"createThreadPostUser","SWP");
    }
	/**
	 * 
     * @remotable
     * 
     */
	
    public function captureEmailRecords() {
    	
//		require 'config.php';    	
		
		SWPLogManager::log("This came from Process",null,TLogger::INFO,$this,"captureEmailRecords","SWP");
		
    	$ini_array = parse_ini_file(BASEPATH.'/images/Email/Template.ini');
    	
    	$values = array();
    	
    	foreach( $ini_array as $k=>$v ) {
    		
    		$values[$k] = $v;
    	}
    	
    	$from = $values['from'];
    	$status = "Success";
    	
    	$threademail = new ThreadEmailRecord();
    	
    	$posts_emails = ThreadEmailRecord::finder()->findAll( ' status != ? AND retry_count > 0',array($status) );
	
    	foreach ( $posts_emails as $posts_email ) {
			$posts = $posts_email->post;
			if(isset($posts) && !empty($posts)){
	    		$content = $posts->content;
	    		
	    		if($content == "TASKACTIONS.REQUEST_FILES_BODY"){
					//				$content = $REQUEST_FILES_BODY;
					$content = REQUEST_FILES_BODY;
				} else if( $content == "TASKACTIONS.REQUEST_FILES_BODY" ) {
				
					//				$content = $INITIAL_COMPLETED_SUBMISSIONS;
					$content = INITIAL_COMPLETED_SUBMISSIONS;
				}
			}
    		$subject 		= $posts_email->subject;
    		if( $posts_email->post_id ){
    		
	    		$body 			= " <b> Subject </b> : <br> <p> " .$posts_email->subject . "</p> <br>" .
	    		 "<b> Message </b> : <br> <p>" .$content."</p> <br>";
	    		$body 			= $body . "<br>" . $posts_email->body;
    		} else {
    			$body = $posts_email->body;
    			
    		}
    		$from 			= $from;
    		$to 			= $posts_email->to;
    		$maileSent		= $this->sendMail($from,$to,$subject,$body);
    		
    		$posts_email->status = $maileSent;
    		$posts_email->retry_count = ($posts_email->retry_count) - 1;
    		
    		$posts_email->save();
    	}
    	SWPLogManager::log("Capture email record process completed",null,TLogger::INFO,$this,"captureEmailRecords","SWP");
    }
    
	 /**
	  * 
	 * this is the code to send mail to the corresponding user.
	 * 
	 */
    public function sendMail( $from,$to,$subject,$body ){
    
    	require_once(BASEPATH.'/phpmailer/class.phpmailer.php');

    	$mail             = new PHPMailer(); // defaults to using php "mail()"

    	//$mail->IsSendmail(); // telling the class to use SendMail transport
    	$mail->SetFrom($from, 'Skillner Admin');
    	$mail->AddAddress($to, "");
    	$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!";
    	$mail->MsgHTML($body);
    	$mail->Subject =$subject;
    	try {
    		if(!$mail->Send()) {
    			SWPLogManager::log("Error while sending mail",array("Message"=>$mail->ErrorInfo),TLogger::ERROR,$this,"sendMail","SWP");
    			return $mail->ErrorInfo;
    		}else{
    			SWPLogManager::log("Mail sent succesfully ",array("Message"=>"Success"),TLogger::INFO,$this,"sendMail","SWP");
    			return 'Success';
    		}
    	} catch ( Exception $ex ) {
    		SWPLogManager::log("Exception Happen while sending mail",array("Message"=>$ex->getMessage()),TLogger::ERROR,$this,"sendMail","SWP");
    		return $ex->getMessage();
    	}
    }
    
    
//    public function sendMail( $from,$to,$subject,$body ) {
//
//    	require_once 'Zend/Mail/Transport/Sendmail.php';
//    	require_once 'Zend/Mail/Transport/Smtp.php';
//
//    	SWPLogManager::log("One Email Should go now",array("from"=>$from,"to"=>$to,"subject"=>$subject,"body"=>$body),TLogger::INFO,$this,"sendMail","SWP");
//    	
//    	$host = "mail.walkingtree.in";
//    	$transport = new Zend_Mail_Transport_Smtp( $host );
//    	//$transport = new Zend_Mail_Transport_Sendmail($host);
//    		
//    	$mail = new Zend_Mail();
//    		
//    	$mail->setFrom($from, 'Sender');
//    	$mail->addTo($to, 'Receiver');
//    	$mail->setSubject($subject);
//    	$mail->setBodyHtml($body,'utf-8');
//    		
//    	try {
//
//    		$mail->send($transport);
//    		SWPLogManager::log("Mail sent succesfully ",array("Message"=>"Success"),TLogger::INFO,$this,"sendMail","SWP");
//    		return 'Success';
//
//    	} catch ( Exception $ex ) {
//			SWPLogManager::log("Exception Happen while sending mail",array("Message"=>$ex->getMessage()),TLogger::ERROR,$this,"sendMail","SWP");
//    		return $ex->getMessage();
//    	}
//    }
    
	/**
     * 
     * creates threadEmail for the post
	 * 201312021950
     */
    
    public function createThreadEmail( $from,$to,$cc,$bcc,$subject,$body,$status,$retry_count,$post_id, $thread_id, $attachments, $user, $old_instructorId ) {
    	SWPLogManager::log("Thrtead_email table record should create",array("from"=>$from,"to"=>$to,
				"cc"=>$cc,"bcc"=>$bcc,"subject"=>$subject,"body" =>$body,"status"=>$status,"retry_count" =>$retry_count,
				"post_id"=>$post_id, "thread_id"=>$thread_id,"attachments"=>$attachments,
				"user"=>$user),TLogger::INFO,$this,"createThreadEmail","SWP");
				//201312021950
    	if ( $old_instructorId ){
    		return ;
    	}
    	
    	//make attachments count null while it have ''(space)
    	if( $attachments == '' ){
    		
    		$attachments = null;
    	}
    	
    	$threadUsers = ThreadUserRecord::finder()->findAll( ' thread_id ='.$thread_id );
    	 
    	foreach ( $threadUsers as $threadUser ) {
    		
    		if( $user->Uid == $threadUser->user_id ) {
    			
    			continue;
    		}
			if( $user->Uid == 0 ){
				$userSettings = UserSettingsRecord::finder()->findAll('user_id = ? AND `key` = ? AND `value` = ?  AND content_id = ? ',array($threadUser->user_id, 'Email Notification', 'NO', $user->ContentID ) );
    			if( count( $userSettings ) > 0  ){
    				continue;
    			}
    		} 
	    	$emailrec = new ThreadEmailRecord();
	    	$body ="";
    		$userRec = $threadUser->user;
    		
    		$emailrec->to = $userRec->Email;
    		$thread = ThreadRecord ::finder()->find('uid = ?',$thread_id);
    	
	    	if ( $thread->reference ) {
	    		
	    		$subject = $subject.' -  '.$thread->reference->name;
	    	}
	    	
	    	$emailrec->subject = $subject;
	    	
	    	if( count($attachments) > 0 ) {
	    		
	    		$body = $body . '<table><tr><td><b> Attachments   : </td></tr>';
	    	}
	
	    	foreach ( $attachments as $atachment ) {
	    		
	    		$attName = $atachment['name'];
	    		$body = $body . "<tr><td>$attName</td></tr>";
	    	}
	    	
	    	if( count($attachments) > 0 ) {
	    		
	    		$body = $body . '</table>';
	    	}
	    	
	    	$emailrec->body = $body;
	    	$emailrec->post_id = $post_id;
	    	$emailrec->status = 'Pending';
	    	$emailrec->save();
	    	SWPLogManager::log("thread_Email record creation successful",array("emailrec"=>$emailrec),TLogger::INFO,$this,"createThreadEmail","SWP");
    	}
    	 
    	
    }
    
	/**
	 * @remotable
	 * 
	 *	On Closing message, If multiple threads are being closed, then, looping the params by checking
	 * 	as array or not and if yes, looping and saving else, just saving the record details.
	 * 
	 */

    public function saveMessage( $params ) {

    	SWPLogManager::log("Message should save succesfully",array("params"=>$params),TLogger::INFO,$this,"saveMessage","SWP");
    	
		$user = Prado::getApplication()->getUser();
    	if( is_array($params) && count($params)> 1  && $params[0]  ) {

    		foreach ( $params as $param ) {

    			$uid = $param['uid'];
    			$thread = ThreadRecord::finder()->findByPk( $uid );

    			//   	$thread->views = $thread->views+1;
    			$thread->hidden =$param['hidden'];
    			$thread->hidden_from =$param['hidden_from'];
    			
    			if( $param['isFromUpdateReadPost'] != true ) {
    				
    				$thread->status = $param['status'];
    			}else {
    				
    				$isFromUpdateReadPost = true;
    			}

    			$thread->save();

    			$commentRec =  UserLCommentRecord::finder()->findAll( $thread_id );

    			foreach( $commentRec as $rec ) {

    				if( $uid == $rec->thread_id ) {

    					$rec->thread_hidden = $param['hidden'];
    					$rec->save();
    				}
    			}


    			$threadUser = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? ' , array( $user->Uid,$thread->uid ));

    			//$threadUser->unread_Post_Count = $param['unread_Post_Count'];
    			$threadUser->noofposts = $threadUser->noofposts+1;
    			//201404241123
    			$threadUser->threadreadstatus  = 1;
    		}
			
    	}else {

    		$uid = $params['uid'];
    		$thread = ThreadRecord::finder()->findByPk( $uid );
    		 
    		//  	$thread->views = $thread->views+1;
    		$thread->hidden =$params['hidden'];
    		$thread->hidden_from =$params['hidden_from'];
    		
    		if( $params['isFromUpdateReadPost'] != true ) {
    			
	    		$thread->status = $params['status'];
	    		
    		}else {
    				
    				$isFromUpdateReadPost = true;
    			}
    		
    		 
    		$thread->save();
    		 
    		$commentRec =  UserLCommentRecord::finder()->findAll( $thread_id );
    		 
    		foreach( $commentRec as $rec ) {
    				
    			if( $uid == $rec->thread_id ) {
    					
    				$rec->thread_hidden = $params['hidden'];
    				$rec->save();
    			}
    		}

    		$threadUser = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? ' , array( $user->Uid,$thread->uid ));
    		 
    		//$threadUser->unread_Post_Count = $params['unread_Post_Count'];
    		$threadUser->noofposts = $threadUser->noofposts+1;
			//201404241123
    		$threadUser->threadreadstatus  = 1;
    		//$threadPostUsers = ThreadPostUserRecord::finder()->findAll(' user_id =? AND thread_id = ? ' , array( $user->Uid,$thread->uid ));
    		/*foreach ($threadPostUsers as $threadPostUser ){
    			$threadPostUser->unread_post = 0;
    			$threadPostUser->save();
    		}*/
    		
    	}
    	 $threadUser->save();
    	 
    	 if( $isFromUpdateReadPost == true ) {
			
    	 	SWPLogManager::log("Message/Task saved succesfully",array("threadstatus"=>$thread->status),TLogger::INFO,$this,"saveMessage","SWP");
    	 	return $thread->status;
    	 }
    	
	}
	
	/**
     * @remotable
     * 
     * Retrives all the availble catogeries filetring with the parameter thread_type_id
     */
	
    public function getCatogeries( $params ) {
    	
    	SWPLogManager::log("It should return category of the thread",array("params"=>$params),TLogger::INFO,$this,"getCatogeries","SWP");
    	
    	$threadType = $params['thread_type_id'];
    	
    	if(! $threadType ){
    		
    		return ;
    	}
    	
    	$threadType = ThreadTypeRecord::finder()->findByPk( $threadType );
    	
    	SWPLogManager::log("Thread Category is ",array("category"=>$threadType->catogeries),TLogger::INFO,$this,"getCatogeries","SWP");
    	
    	return $threadType->catogeries;
    }
    
	/**
     * 
     * @remotable
     * For Version One - hardcode the student -115 and instructor--116 ids.
     * 
     */
    public function getUsers( $params ){

    	SWPLogManager::log("It is getting params as parameter to get users",array("Params"=>$params),TLogger::INFO,$this,"getUsers","SWP");
    	
    	//TODO should filter the user based on the classid
    	
    	/**$user = Prado::getApplication()->getUser();
    	
    	if( $user->Uid != 115 ) {
    		
    		$uid = 115;
    		
    	} else {
    		
    		$uid = 116;
    	} **/
    	
    	$user = Prado::getApplication()->getUser();
    	$instructor_id = $user->getInstructorID();
		$student_id = $user->getStudentID();
		//201312021950
		if($instructor_id){
			$userRecords = UserRecord::finder()->findAll( 'Uid = ?', $user->Uid == $instructor_id ? $student_id : $instructor_id );
		} else {
			$userRecords = UserRecord::finder()->findAll( 'Uid = ?', $user->Uid == $instructor_id ? $student_id : $params['old_instructorId'] );
		}
		SWPLogManager::log("It should return the list of users",array("user"=>$user,"instructorId"=>$instructor_id,"studentId"=>$student_id),TLogger::DEBUG,$this,"getUsers","SWP");
		

		foreach ( $userRecords as $userRecord ) {

			/*
			 * Appending '*' to the user having instructor role.
			 *
			 */

		if( $userRecord->Uid == $instructor_id ) {

				$userRecord->Username = ( $userRecord->Name) ? ($userRecord->Name."*") :($userRecord->Username."*");
				$userRecord->Name =( $userRecord->Name) ? ($userRecord->Name."*") :($userRecord->Username."*");
			}else{
				$userRecord->Username = ( $userRecord->Name) ? ($userRecord->Name) :($userRecord->Username);
				$userRecord->Name =( $userRecord->Name) ? ($userRecord->Name) :($userRecord->Username);
			}
			

			$arrayOfUserRecords[] = $userRecord;

		}
    	SWPLogManager::log("Returns the list of users",array("users"=>$arrayOfUserRecords),TLogger::INFO,$this,"getUsers","SWP");
		return $arrayOfUserRecords;
    }
    
	/**
     * 
     * 	Appends a special character to the entered text,
     * 	if that text starts with @ or ^.
     * 
     */
    
    private function formatText( $value ){
    	
    	SWPLogManager::log("It should format the entered text",array("enteredText"=>$value),TLogger::INFO,$this,"formatText","SWP");
    	
    	if( substr( $value, 0 ,1 ) == '@' ){
    		
	    	$value = "@".$value;
	    	$value= json_encode( $value );
	    	
	    } else if( substr( $value, 0,1 ) == '^' ) {
	    	
	    	$value = "^".$value;
	    	$value= json_encode( $value );
	    }
	    SWPLogManager::log("returns the formatted text",array("formattedText"=>$value),TLogger::INFO,$this,"formatText","SWP");
	    return $value;
    }
    
	/**
	 * 
     * retrives the Users beloging to the logged in user class
     * 
     * @param $params
     * 
     */
    private function getClassUserList( $params ) {
    	
    	$user = Prado::getApplication()->getUser();
    	
    	/**
    	 * Here class users list got hard coded.
    	 */
    	
    	SWPLogManager::log("Returns Class Users List",array("userlist"=>array( $user->Uid,114 )),TLogger::INFO,$this,"getClassUserList","SWP");
    	return array( $user->Uid,114 );
    }
    /**
     * 
     * @remotable
     * getZipedPackageURL is the method which is useful for the upload of the big files
     * 
     */
    
    public function getZipedPackageURL( $params ) {
    	require 'config.php';
    	if($params['PATH']){
    		$client = S3Client::factory(array(
					    'key'    => $key,//'AKIAJRSZXMGJRT7Q4S4A',
					    'secret' => $secret,//'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',
			));
			$path = explode("/",$params['PATH']);
			$exactPath = $path[0].'/'.$path[1];
			$actualPath = $exactPath.'/'.$params['zipname'].'.zip';
    		if($actualPath && !empty($actualPath)){
					return $client->getObjectUrl($bucket, $actualPath);
			}
    	}else{
    		return false;
    	}
    }
    
	/**
     * 
     * @remotable
     * zips the package
     * 
     */
    
    public function zipPackage( $params ) {
    	
    	require 'config.php';
    	
    	if($params['PATH']){
	    	$client = S3Client::factory(array(
					    'key'    => $key,//'AKIAJRSZXMGJRT7Q4S4A',
					    'secret' => $secret,//'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',
			));
			
			$path = explode("/",$params['PATH']);
			$exactPath = $path[0].'/'.$path[1];
			$actualPath = $exactPath.'/'.$params['zipname'].'.zip';
	    	if ( is_dir($params['PATH']) ){
	    		if ( Prado::getApplication()->Parameters['fileupload'] == "s3"){
	    		
						try{
							// Ceating a bucket
							//$bucket = $client->createBucket(array('Bucket' => 'samplebucket'));
							$zipPath = $_SERVER['DOCUMENT_ROOT'].'/'.$exactPath.'/'.$params['zipname'].'.zip';
							$deletedPath =  $_SERVER['DOCUMENT_ROOT'].'/'.$params['PATH'];
							$directoryPath = $_SERVER['DOCUMENT_ROOT'].'/'.$exactPath;
							
							$uploader = UploadBuilder::newInstance()
						    ->setClient($client)
						    ->setBucket($bucket)
						    ->setKey($actualPath)
						    ->setSource($zipPath)
						    ->setOption('CacheControl', 'max-age=3600')
						    ->setOption('ACL','public-read')
						    ->build();
						    
						    $uploadresult = $uploader->upload();
						    if(empty($uploadresult)){
						    	$uploadresult['Location'] = $client->getObjectUrl($bucket, $actualPath);
						    }
							
							$iterator = $client->getIterator('ListObjects', array(
							    'Bucket' => $bucket,
							     'Prefix' => $params['PATH']
							));
					
							foreach ($iterator as $object) {
								 $result = $client->deleteObject(array(
											'Bucket'     => $bucket,
										    'Key'        => $object['Key']
											));
							}
							return $uploadresult['Location'];
						} catch (Exception $e) {
							$uploader->abort();
							SWPLogManager::log("Exception occours while compressing",array("Message"=>$e->getMessage()),TLogger::ERROR,$this,"zipPackage","SWP");
						}
			    } else {
			    	SWPLogManager::log("compressed in local environment",array("isCompressed"=>$compressed),TLogger::INFO,$this,"zipPackage","SWP");
			    	return true;
			    }
	    	}else{
	    		
	    		//201406180647
	    		//Code for the upload url , if the big file we have uploaded then the requestes are multiple and upload the data into amazon increases.
	    		// So in the second request we will check is there any upload exists in the location if it exists then we are sending the url.
				SWPLogManager::log("The path passed as an argument is not a directory",array("path"=>$params['PATH']),TLogger::INFO,$this,"zipPackage","SWP");
				if($actualPath && !empty($actualPath)){
					return $client->getObjectUrl($bucket, $actualPath);
				}
	    		return false;
	    	} //if the given path is not a directory then we will return the file path at the amazon
    	} else { //if path existed end
    		return false;
    	} 
    }
    
	/**
     * compresses the src directory to zip file
     * 
     */
    
    public static function compress( $src, $zipname , $baseUrl, $removeDir ) {
    	
    	SWPLogManager::log("Compress a folder in local environment",array("src"=>$src,"zipname"=>$zipname,"baseUrl"=>$baseUrl, "removeDir"=>$removeDir),TLogger::INFO,$this,"compress","SWP");
    	 
    	if( substr($src,-1)==='/' ) {

    		$src=substr($src,0,-1);
    	}
    	 
    	$arr_src=explode('/',$src);
    	 
    	if( !$zipname ){

    		$filename = end($arr_src);
    		$filename = str_ireplace("#", "-", $filename );
    		$filename = str_ireplace(" ", "-", $filename );

    		unset($arr_src[count($arr_src)-1]);

    		$filename = (($filename=='')? ($_SERVER['DOCUMENT_ROOT'].$baseUrl. 'backup.zip') : ($_SERVER['DOCUMENT_ROOT'].$baseUrl.$filename.'.zip'));

    	}else {

    		$filename = $_SERVER['DOCUMENT_ROOT'].$baseUrl .$zipname .'.zip';
    	}
    	 
    	$path_length = strlen(implode('/',$arr_src).'/');
    	 
    	$zip = new ZipArchive;
    	$res = $zip->open($filename, ZipArchive::CREATE);
    	 
    	if( $res !== TRUE ) {

    		//echo 'Error: Unable to create zip file';
    		SWPLogManager::log("Unable to create zip file",array("Message"=>"Unable to create zip file"),TLogger::ERROR,$this,"compress","SWP");
    		exit;
    	}
    	if(is_file($src)){

    		$zip->addFile($src,substr($src,$path_length));
    		
    	} else {
    		 
    		if( !is_dir($src) ) {

    			$zip->close();
    			@unlink($filename);
    			//echo 'Error: File not found';
    			SWPLogManager::log("File not found",array("Message"=>"File not found"),TLogger::DEBUG,$this,"compress","SWP");
    			exit;
    		}
    		self::recurse_zip($src,$zip,$path_length  );
    	}
    	
    	$zip->close();
    	/**
    	 * This condetion executed when this compress() method is called from zipPackage() method only. 
    	 */
		if( $removeDir ){
			
        	$dir = $src;
	        if ( is_dir($dir) ) {
	        	
			     $objects = scandir($dir);
			     
			     foreach ( $objects as $object ) {
			     	
			       if ($object != "." && $object != "..") {
			       	
			         if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
			         
			       }
			     }
			     reset($objects);
			     rmdir($dir);
			   }
        }
        
    	SWPLogManager::log("Compress succesful",array("filename"=>$filename),TLogger::INFO,$this,"compress","SWP");
    	return $filename;
    }
    
    /**
     * 
     * @remotable
     * 
     * Enter description here ...
     * @param unknown_type $src
     * @param unknown_type $zipname
     * @param unknown_type $baseUrl
     * @param unknown_type $removeDir
     */
	public static function compressZip( $params ) {

		$src = $params['PATH'];
		$zipname = $params['zipname'];  
		$baseUrl = '/'.$params['destination'];
		$removeDir = $params['deleteFile']; 
		
    	if( substr($src,-1)==='/' ) {

    		$src=substr($src,0,-1);
    	}
    	 
    	$arr_src=explode('/',$src);
    	 
    	if( !$zipname ){

    		$filename = end($arr_src);
    		$filename = str_ireplace("#", "-", $filename );
    		$filename = str_ireplace(" ", "-", $filename );

    		unset($arr_src[count($arr_src)-1]);

    		$filename = (($filename=='')? ($_SERVER['DOCUMENT_ROOT'].$baseUrl. 'backup.zip') : ($_SERVER['DOCUMENT_ROOT'].$baseUrl.$filename.'.zip'));

    	}else {

    		$filename = $_SERVER['DOCUMENT_ROOT'].$baseUrl .$zipname .'.zip';
    	}
    	 
    	$path_length = strlen(implode('/',$arr_src).'/');
    	 
    	$zip = new ZipArchive;
    	$res = $zip->open($filename, ZipArchive::CREATE);
    	 
    	if( $res !== TRUE ) {

    		//echo 'Error: Unable to create zip file';
    		SWPLogManager::log("Unable to create zip file",array("Message"=>"Unable to create zip file"),TLogger::ERROR,$this,"compress","SWP");
    		exit;
    	}
    	if(is_file($src)){

    		$zip->addFile($src,substr($src,$path_length));
    		
    	} else {
    		 
    		if( !is_dir($src) ) {

    			$zip->close();
    			@unlink($filename);
    			//echo 'Error: File not found';
    			SWPLogManager::log("File not found",array("Message"=>"File not found"),TLogger::DEBUG,$this,"compress","SWP");
    			exit;
    		}
    		self::recurse_zip($src,$zip,$path_length  );
    	}
    	
    	$zip->close();
    	/**
    	 * This condetion executed when this compress() method is called from zipPackage() method only. 
    	 */
		if( $removeDir ){
			
        	$dir = $src;
	        if ( is_dir($dir) ) {
	        	
			     $objects = scandir($dir);
			     
			     foreach ( $objects as $object ) {
			     	
			       if ($object != "." && $object != "..") {
			       	
			         if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
			         
			       }
			     }
			     reset($objects);
			     rmdir($dir);
			   }
        }
        
    	SWPLogManager::log("Compress succesful",array("filename"=>$filename),TLogger::INFO,$this,"compress","SWP");
    	return $filename;
    }
    
	/**
     * recursively adds the files to the zip file
     * 
     */
    	
    public static function recurse_zip( $src,&$zip,$path_length ) {
    	
    	SWPLogManager::log("It should zip the file recursively",array("src"=>$src,"zipname"=>$zip,"path_length"=>$path_length),TLogger::INFO,$this,"recurse_zip","SWP");
    	 
    	$dir = opendir($src);
    	
    	while( false !== ( $file = readdir($dir)) ) {

    		if ( ( $file != '.' ) && ( $file != '..' ) ) {
    			 
    			$isdirectory = is_dir($src . '/' . $file);
    			 
    			if ( $isdirectory == true ) {

    				self::recurse_zip($src . '/' . $file,$zip,$path_length,false );
    				
    			}else {

    				$zip->addFile($src . '/' . $file,substr($src . '/' . $file,$path_length));
    			}
    		}
    	}
    	 
    	closedir($dir);
    	
    	SWPLogManager::log("recursive Zip succesful",null,TLogger::INFO,$this,"recurse_zip","SWP");
    }
	/**
	 * @remotable
	 * 
     * It will delete the directory which is passed as a parameter.
     * 
     **/
    
    public function rrmdir( $directories ){
    	
    	SWPLogManager::log("delete a directory recursively",array("directory"=>$directories),TLogger::INFO,$this,"rrmdir","SWP");

    	$objects = scandir($directories);
    	
    	foreach ( $objects as $dir ) {
    		
	    	 if ( is_dir( $directories ."/".$dir )  ) {
	    	 	
	    	 	if(  ( $dir != "." && $dir != ".." ) ){
	    	 		
	    	 		$returnvalue = rmdir( $directories."/".$dir );
	
	    	 	}else {
	    	 		
	    	 		$returnvalue =true;
	    	 	}
	    	 	
	    	 }else {
    	 	
	    	 	unlink( $directories ."/".$dir );
	    	 	$returnvalue = true;
	    	 }
	    	 
    		if( $returnvalue == false ){
    			
    			$this->rrmdir( $directories ."/".$dir );
    		}
    	}
    	
    	rmdir( $directories );
    	
    	SWPLogManager::log("Deletion Succesful",array("directory"=>$directories),TLogger::INFO,$this,"rrmdir","SWP");
    	
    	return true;

    }
    
    /**
     * @remotable
     * 
     * It will copy the files from the source folder and paste in the destination folder
     * If the name is already exist in the destination, it will rename the file's 
     * and will return the renamed files.
     *  
     */
    
    public function RecursiveCopy( $source, $dest ) {
    	
    	require 'config.php';
    	
    	SWPLogManager::log("Recursively Copy from a path",array("source"=>$source, "dest"=>$dest),TLogger::INFO,$this,"RecursiveCopy","SWP");
    	
    	if( Prado::getApplication()->Parameters['fileupload'] == "s3" ){

    		$client = S3Client::factory(array(
						    'key'    => $key,
						    'secret' => $secret
    		));
    		$iterator = $client->getIterator('ListObjects', array(
		    'Bucket' => $bucket,
		     'Prefix' => $source
    		));

    		foreach ($iterator as $object) {
    			$file = explode("/",$object['Key']);

    			$info = pathinfo($object['Key']);
    			$res = $info['basename'];
    				
    			$i = 0;
    			$flag = true;
    			$tmp = $res;

    			while( $flag ){
    					
    				if ( $client->doesObjectExist($bucket, $dest.$tmp) ) {

    					$arr = explode('.',$res);
    					$i = $i+1;
    					$tmp = $arr[0]."($i).".$arr[1];

    				}else {

    					$flag = false;
    				}
    			}
    			//				if( $tmp != $res ){
    			//    				$changes[] = array('newname'=>$tmp ,'old'=> $res);
    			//    			}
    				
    	 	$result = $client->copyObject(array(
							    'Bucket'     => $bucket,
							    'Key'        => $dest.$tmp,
								'CopySource' => urlencode($bucket.'/'.$source.'/'.$res),
						        'MetadataDirective' => 'COPY',
								'ACL'        => 'public-read'
								));
								$result = $client->deleteObject(array(
				'Bucket'     => $bucket,
			    'Key'        => $source.'/'.$res
								));
								$newUrl = $amazonurl.urlencode($dest.$tmp);
								$changess3[] = array('newname'=>$tmp ,'old'=> $res, 'objectUrl'=>$newUrl );
    		}
    		 
    		//    	 	 return array('status'=>true,'changes'=> $changess3);
    	}

    	//    	 else {
    	$path = $_SERVER['DOCUMENT_ROOT'];
    	$source = $path.'/'.$source;
    	$dest = $path.'/'.$dest;
    	$changes = array();
    	$index = 0;

    	foreach( scandir($source) as $res ){
    		 
    		if( $res == '.' || $res == '..' )
    		continue;

    		if( is_dir($source . '/' . $res) ) {

    			$this->RecursiveCopy($source . '/' . $res, $dest);

    		}
    		else {

    			$i = 1;
    			$flag = true;
    			$tmp = $res;

    			while( $flag ){
    					
    				if ( file_exists($dest . '/' . $tmp) ) {

    					$arr = explode('.',$res);
    					$i = $i+1;
    					$tmp = $arr[0]."($i).".$arr[1];

    				}else {

    					$flag = false;
    				}
    			}

    			if( $tmp != $res ){
    				$changes[] = array('newname'=>$tmp ,'old'=> $res);
    			}

    			if( $i == 1 ) {

    				copy($source . '/' . $res, $dest . '/' .$res);

    			}else {

    				copy($source . '/' . $res, $dest . '/' .$tmp);
    			}
    		}
    	}
    	if( ! empty( $source ) ){
    		 
    		$this->rrmdir($source);
    	}
    	if( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
    		 
    		SWPLogManager::log("copy successful",array("files"=>$changess3),TLogger::INFO,$this,"RecursiveCopy","SWP");
    		return array('status'=>true,'changes'=> $changess3);
    	}else {
    		 
    		SWPLogManager::log("copy successful",array('status'=>true,'changes'=>$changes),TLogger::INFO,$this,"RecursiveCopy","SWP");
    		return array('status'=>true,'changes'=>$changes);
    	}
    	//    	 }
    }
	
	/**
     * 	@remotable
     * 
     * 	It will delete the files, which is passed as an argument.
     *  After deletion of file, if the folder is empty then it will delete the folder as well.
     *  
     **/  
    
	public function removeFile( $file ) {
		
		require 'config.php';
		
		SWPLogManager::log("Delete the required file",array("file"=>$file),TLogger::INFO,$this,"removeFile","SWP");
		
		// Here irrespective of file upload to local path or s3 we are removing the file from
		// local path.
		
		 if( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
		 	
		 	$client = S3Client::factory(array(
		    'key'    => $key,
		    'secret' => $secret
			));

			 $result = $client->deleteObject(array(
				'Bucket'     => $bucket,
			    'Key'        => $file,
			));
		
		 } 
		 
		 	unlink ($file);
			$arr = explode('/',$file);
			rmdir( $arr[0]."/".$arr[1]."/".$arr[2] );
			rmdir( $arr[0]."/".$arr[1]); 
		
			SWPLogManager::log("REmoved from S3",null,TLogger::INFO,$this,"captureMessageDetails","SWP");
		
	}
    
 	/**
     * @remotable
     * 
     **/ 
    
	public function validatePackage( $path, $pkgName ) {
		
		require 'config.php';
		
		SWPLogManager::log("Check for the existence of package name",array("path"=>$path, "pkgName"=>$pkgName),TLogger::INFO,$this,"validatePackage","SWP");
		
		if ( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
			
					$client = S3Client::factory(array(
						    'key'    => $key,
						    'secret' => $secret
							));
			$result = $client->doesObjectExist($bucket, $path.$pkgName);
			SWPLogManager::log("Package name exist ",array("result"=>!$result),TLogger::INFO,$this,"validatePackage","SWP");
			return json_encode(array('success'=>true,'valid'=>(!$result) ));
			
		} else {
			
			SWPLogManager::log("Package name exist ",array("result"=>$fileExist),TLogger::INFO,$this,"validatePackage","SWP");
			return json_encode(array('success'=>true,'valid'=>( !file_exists( $_SERVER[DOCUMENT_ROOT].DIRECTORY_SEPARATOR.$path.$pkgName) )));
		}
		 
// 		$pkgName = 	$pkgName.'.zip';
// 		$arr 	 = 	explode('/',$path);
// 		$path	 = 	$arr[0].'/'.$arr[1];
// 		$objects = 	scandir($path);
// 		var_dump( $path );
// 		foreach ( $objects as $object ) {
 
// 			if ( $pkgName == $object ) {

// 				return false;
// 			}
// 		}
		
// 		return true;
// var_dump( $_SERVER[DOCUMENT_ROOT].$path.$pkgName);
// var_dump(  !file_exists( $_SERVER[DOCUMENT_ROOT].DIRECTORY_SEPARATOR.$path.$pkgName)  );
		
	}


	/**
     * @remotable
     * 
     * It will separate all the directories what all passed in the argument.
     * 
     **/
      
    public function recursiveRemoveDir( $directories ) {
    	
    	require 'config.php';
    	
    	SWPLogManager::log("It will recursively Remove the directory",array("directories"=>$directories),TLogger::INFO,$this,"recursiveRemoveDir","SWP");
    	
    	// Here we are deleting the files from the local path in both the case.
    	if ( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
    		$client = S3Client::factory(array(
		    'key'    => $key,
		    'secret' => $secret
			));
			
    	$iterator = $client->getIterator('ListObjects', array(
			    'Bucket' => $bucket,
			     'Prefix' => substr( $directories[0], 0,-1 )
			));
			
	
			foreach ($iterator as $object) {
				 $result = $client->deleteObject(array(
							'Bucket'     => $bucket,
						    'Key'        => $object['Key']
							));
			}
			
    	}
    	
	    	foreach ( $directories as $dir ) {
	    		
	    		$this->rrmdir( $dir );
	    	}
	    	SWPLogManager::log("Removed Directory from local path",array("Message"=>true),TLogger::INFO,$this,"recursiveRemoveDir","SWP");
    }
    
	/**
     * 
     * creates attachments for the post
     * 
     * 
     */
    
    public function createAttachments( $filesize,$filePath,$post_id ) {
    	
    	SWPLogManager::log("For All the attachments of Message and Task it will create an entry for thread_attachment table",
		array("filesize"=>$filesize, "filePath"=>$filePath, "post_id"=>$post_id),TLogger::INFO,$this,"createAttachments","SWP");
    	if ( Prado::getApplication()->Parameters['fileupload'] != "s3" ){
	    	$filesize = filesize($_SERVER['DOCUMENT_ROOT'] .'/'. $filePath );
	    	$pkgName = $filesize;
	    	if( substr($filePath,-1) == '/' ) {
	    		$filePath = $filePath.$pkgName;
	    	} else {
	    		$filePath = $filePath.'/'.$pkgName;
	    	}
        }
     	$threadAttach = ThreadAttachmentRecord::finder()->find('post_id = ? AND filePath=?',array($post_id ,$filePath ));
     	if(count($threadAttach) > 0){
	    	return true;
     	} else {
     		$attachment = new ThreadAttachmentRecord();
	    	$attachment->post_id = $post_id;
	    	$attachment->size = $filesize;
	    	$attachment->filePath = $filePath;
	    	return $attachment->save();
     	}
      	SWPLogManager::log("Record Created succesfully",array("result"=>$result),TLogger::INFO,$this,"createAttachments","SWP");
    }
    
	/**
	 * @remotable
	 *
	 *Retrives the posts from Thread_posts table filtering with the parameter thread_id
	 *along with the attachments
	 */
    
    public function getPosts( $params ){
    	
    	SWPLogManager::log("Retrieve All the posts for the perticular thread",array("params"=>$params),TLogger::INFO,$this,"getPosts","SWP");
    	
    	$thread_id = $params['thread_id'];
    	$user = Prado::getApplication()->getUser();
    	$posts = ThreadPostRecord::finder()->findAll(' thread_id = ? ORDER BY created ASC ' , array( $thread_id ) );
    	$threadRec = ThreadRecord::finder()->find(' uid = ?' , array( $thread_id ) );
		$status = $threadRec->status;
		$taskaction = $threadRec->taskaction;
		$threadtypeId = $threadRec->thread_type_id ;
    	$retVals = array();
    	$serverTimezone = Prado::getApplication()->getGlobalState("serverTimezone"); 
    	$userRec = UserRecord::finder()->find(' uid =? ' , array(  $user->Uid ));
		$currentTimezone = $userRec->timezone;//Prado::getApplication()->getGlobalState("currentTimezone");
        $videorecord = VideoRecord::finder()->find('content_id = ?',array( $threadRec->reference->video_id ));
        $quizProgess = false;
		if( $videorecord->type == 0 ){
			$threadVideoId = 'L'.$videorecord->content_id;
		}elseif ( $videorecord->type == 1 ){
			$threadVideoId = 'Q'.$videorecord->content_id;
			$videoRecordMgr = new VideoRecordMgr();
			$quizProgessStatus = $videoRecordMgr->getQuizProgress( $videorecord->content_id );
			if( $quizProgessStatus ){
				$quizProgess = true;
			}
		}
		
    	foreach ( $posts as $post ) {
    		
    		$attachments = $post->attachments;
    		$noOfAttachments =0;
    		$attachmentsSize=0;
    		
    		foreach ( $attachments as $value ) {
    			
    			$noOfAttachments++;
    			$attachmentsSize = $attachmentsSize + $value->size;
//    			$attachmentsSize = $attachmentsSize + filesize($_SERVER['DOCUMENT_ROOT'] .'/'. $value->filePath );
    		}
    		
    		$post->attachmentSummary = array( $noOfAttachments ,$attachmentsSize );
    		
    		$creatorName = UserRecord::finder()->find('Uid = ?',$post->author_id);
    		$post->authorName = ($creatorName->Name ? $creatorName->Name : $creatorName->Username);
    		$post->authorimage =$creatorName->photo;
    		$post->parent;
    		
    		// Here we are converting the server time to Local time and sending it to front end.
//			$post->updated = $this->convertFromOneTimeToAnother($post->updated, $serverTimezone, $currentTimezone );
			$post->updated = $this->convertDateTimeZone($post->updated, $currentTimezone );
			$post->threadtypeId = $threadtypeId; 
    		$post->status = $status;
    		$post->taskaction = $taskaction;
    		$postuser = ThreadPostUserRecord::finder()->findAll(' user_id =? AND thread_id = ? AND post_id = ?' , array( $user->Uid,$post->thread_id,$post->uid ));
    		$post->readflag = $postuser[0]->unread_post;
    		$post->loginuserid = $user->Uid;
    		$post->threadVideoId = $threadVideoId ;
    		$post->quizCompleted = $quizProgess;
    	}
    	
    	
    	SWPLogManager::log("All the posts retrieved",array("posts"=>$posts),TLogger::INFO,$this,"getPosts","SWP");
    	return $posts;
    }
	
	 /**
     * @remotable
     */
    public function createNewPost( $params ) {
    	
    	SWPLogManager::log("It will create a new post for the thread",array("params"=>$params),TLogger::INFO,$this,"createNewPost","SWP");
    	
    	try{
    		$user = Prado::getApplication()->getUser();
    		$created = date("Y-m-d H:i:s",time());
    		$toLists = $this->getUsers();
    		$list = array();
    		//201312021950
    		$old_instructorId = $params['old_instructorId'];
    		foreach ($toLists as $toList) {
    			$list[] = $toList->Uid;
    		}
    		//201312021950
    		$postUid = $this->createPost( $params['subject'] , $params['content'], $user->Uid, $created,$params['thread_id'],$params['quoted_post_id'],false,$created,$params['attachments'],$user, $params['action'],true, $params['threadtypeId'], $list, $old_instructorId);
    		
    	}catch( Exception $e ) {
    		SWPLogManager::log("Exception Happen while createing a Post",array("Message"=>$e->getMessage()),TLogger::ERROR,$this,"createNewPost","SWP");
    		throw $e;
    	}
    	$response = array();
    	$response['tolist'] = $list;
    	$response['useruid'] = $user->Uid;
    	$response['created'] = $created;
    	$response['postuid'] = $postUid;
    	$response['oldInstructor'] = $old_instructorId;
    	return $response;
    }
    
 	/**
     * @remotable
     *  Save or update the Thread( post) 
     */
    public function savePost( $params ) {
    	
    	SWPLogManager::log("It should save a post",array("params"=>$params),TLogger::INFO,$this,"savePost","SWP");
    	
    	$post = ThreadPostRecord::finder()->find('uid=?',$params['uid'] );
    	$post->hidden =$params['hidden'];
    	$post->hidden_from =$params['hidden_from'];
    	
    	$result = $post->save();
		SWPLogManager::log("Post created succesfully",array("result"=>$result),TLogger::INFO,$this,"savePost","SWP");
    }
    
/**
     * @remotable
     * zips the package
     */
    public function downloadAll( $params ) {
    	
    	SWPLogManager::log("It should download a folder to a particular foledr",array("params"=>$params),TLogger::INFO,$this,"downloadAll","SWP");
    	
    	$threadAttachemnts = ThreadAttachmentRecord::finder()->find( 'post_id = ?',$params );
    	$retVal = array();
    	$filePath = $threadAttachemnts->filePath;
    	
    	if ( Prado::getApplication()->Parameters['fileupload'] == "s3") {
    		
    		$arr = explode('tmp',$filePath);
	    	$foldername = explode('/',urldecode($arr[1]));
	    	$returnPath = $arr[0].urlencode('tmp/'.$foldername[1].'/downloadAll.zip');
	    	SWPLogManager::log("Downloaded succesfully from s3",array("downloaded path"=>$returnPath),TLogger::INFO,$this,"downloadAll","SWP");
	    	return $returnPath;
	    	
    	} else {
    		
    		if ( file_exists($_SERVER['DOCUMENT_ROOT'].'/tmp/downloadAll.zip') ) {
    		
    			unlink( $_SERVER['DOCUMENT_ROOT'].'/tmp/downloadAll.zip' );
	    	}
	    	
	    	$arr = explode('/',$filePath);
	    	$source = $arr[0].'/'.$arr[1];
	    	
	    	self::compress( $source, 'downloadAll', '/tmp/',false );
	    	
	    	SWPLogManager::log("downloaded successfully from local ",array("path"=>'/tmp/downloadAll.zip'),TLogger::INFO,$this,"downloadAll","SWP");
	    	return '/tmp/downloadAll.zip';
    	
    	}
    	
    	 
    	
    	
    	 
    }
    
    /**
     * @remotable
     *  To get the thread_id related messge 
     */
    public function getSingleMessage( $params ) {
    	
    	SWPLogManager::log("Get a particular thread based on thread_id ",array("params"=>$params),TLogger::INFO,$this,"getSingleMessage","SWP");
    	
    	$user = Prado::getApplication()->getUser();
    	 
    	$threadType = $params['thread_type_id'];
    	 
    	$thread_id = $params['thread_id'];
    	
    	$thread = ThreadRecord::finder()->findByPk( $thread_id );
   		
    	$thread->reference = $thread->reference;
   		$thread->link = $thread->reference->name;
   		
   		$threadUser = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? ' , array( $user->Uid,$thread->uid ));
   		
   		$threadposts = ThreadPostRecord::finder()->findAll(' author_id =? AND thread_id = ?',array( $user->Uid,$thread->uid ));
   		
   		$thread->postCount= count( $threadposts );
   		
   		$thread->unread_Post_Count= $threadUser->unread_Post_Count;
   		$thread->views = $threadUser->noofposts;
    	$threadUser->noofposts = $threadUser->noofposts+1;
    	$updateUser = $thread->lastUpdateUser;
    	$thread->lastUpdateUser = ($updateUser->Name ? $updateUser->Name : $updateUser->Username);
    	$threadUser->save();

    	SWPLogManager::log("Return uid of the thread",array("thread_uid"=>$thread->uid),TLogger::INFO,$this,"getSingleMessage","SWP");
    	return $thread->uid;
    	 
    }
    
    
    /**
	 * @remotable
	 *	Retrives the Threads from the database based on the parameters thread_type_id and logged in userid
	 *	Gets called when ever messages store got loaded.
	 *
	 */
    
	public function getTaskReference( $params ) {
		
		SWPLogManager::log("Get all the lesson ad quiz for the course(task reference)",array("params"=>$params),TLogger::INFO,$this,"getTaskReference","SWP");
		
		$uid = $params['id'];
		$user = Prado::getApplication()->getUser();
		
		/**
		 * Getting the Lessons of that particular course.
		 */
		
		$course = CourseRecord::finder()->withCc('(1=1) and type = 0 ORDER BY ordering')->find('content_id = ?',array($user->getContentID()));
		
		/**
		 * From last_run_info table reading all the records having the subject as taskref and content id as the course_content_id
		 **/
		
		$lastRuns = LastRunRecord::finder()->findAll('subject = ? and content_id = ? and product_id = ? ',array('taskref',$user->getContentID(), $user->ProductID));
		
		$cc = $course->cc; 
		$all = array();
		
		foreach ( $cc as $c ) {
			
			$v  = $c->content;
			$flag = false;
			
			 /**
			 * Looping through all the lastrun records and if already a lastrun record is their for the particular lesson, make the flag as true
			 **/
			
			foreach ( $lastRuns as $lastRun ) {
				
				if( $lastRun->video_id == $v->content_id ) {
					
						$flag = true;
				}
			}
			
			
			if ( !$flag ) {
				
				$child = array();
				$child ['groupId'] = $v->content_id ;
				$child ['groupName'] = 'Lesson' ;
				$child ['id'] = $v->content_id;
				$child ['name'] =  $v->name;
				$child['ordering'] = sprintf('%1$04d',$c->ordering).'-'.$v->name;
				$all[] = $child;
			}
	    }
		//	Getting the quizes of that particular course.
		  
	    $course = CourseRecord::finder()->withCc('(1=1) AND type =1 ORDER BY ordering')->find('content_id = ?',array($user->getContentID()));
	    $cc = $course->cc;
		
	    foreach ( $cc as $c ) {
	    	
				$v  = $c->content;   
	
				/**
				 * Get all the questions of the quiz based on the quiz_id.
				 **/			
				$questions = QuizRecord :: finder()->findAll( 'parent_id = ? ',$v->content_id);
				
				/**
				 * Get all the last_run_info records based on the subject, content_id and video_id.
				 *
				 **/
				$lastRunsQuizes = LastRunRecord::finder()->findAll( 'subject = ? and content_id = ? and video_id = ? and product_id = ? ',array( 'taskref',$user->getContentID(),$v->content_id,$user->ProductID ) );
				
				foreach ( $questions as $question ){
					
						$flagVal = false;
						
						foreach ( $lastRunsQuizes as $lastRunsQuize ) {
								
							if ( $lastRunsQuize->question_id == $question->uid ) {
									
								$flagVal = true;
							}
						}
						
						if ( !$flagVal ) {
							
							$child = array();
							$child ['groupId'] = $v->content_id ;
							$child ['groupName'] = $v->name ;
							$child ['id'] = $question->uid;
							$child ['name'] = $question->name;
							$child['ordering'] = sprintf('%1$04d',$c->ordering).'-'.$v->name;
							$all[] = $child; 
						}
				}
	    }
	    
	    SWPLogManager::log("Returns all the task references",array("records"=>$all),TLogger::INFO,$this,"getTaskReference","SWP");
		return $all;
	}
    
	/**
     * This method writen for read the TaskStatus data from TaskStatus.json file.
     */
    public static function getTaskStatus(){
				
			$string = file_get_contents( $_SERVER['DOCUMENT_ROOT'].'/extapps/chatapp/app/config/TaskStatus.json' );
			$jsonIterators = new RecursiveIteratorIterator(new RecursiveArrayIterator(json_decode($string, TRUE)),
															RecursiveIteratorIterator::SELF_FIRST);
			foreach ( $jsonIterators as $jsonIterator ) {

				if( is_array( $jsonIterator ) )

				$task_status [] = $jsonIterator;
			}
			
			SWPLogManager::log("The current Task status is ",array("taskstatus"=>$task_status),TLogger::INFO,$this,"getTaskStatus","SWP");
			return $task_status;
		}
		
	/**
     * This method writen for read the TaskActions data from TaskAction.json file.
     */
    public static function getTaskActions(){
			
		$string = file_get_contents( $_SERVER['DOCUMENT_ROOT'].'/extapps/chatapp/app/config/TaskAction.json' );
		
		$jsonIterators = new RecursiveIteratorIterator( new RecursiveArrayIterator(json_decode($string, TRUE) ),
    													RecursiveIteratorIterator::SELF_FIRST );
    	foreach ( $jsonIterators as $jsonIterator ) {
    		
    		if( is_array( $jsonIterator ) )
    		
			$task_actions [] = $jsonIterator;
		}
		
		SWPLogManager::log("The task Action is ",array("taskaction"=>$task_actions),TLogger::INFO,$this,"getTaskActions","SWP");
		return $task_actions;
	}
	
     /**
	 * @remotable
	 *	Retrives the Threads from the database based on the parameters thread_type_id and logged in userid
	 *	Gets called when ever messages store got loaded.
	 *
	 */
    

	public function createAutoTasks( $user ) { 
		
		SWPLogManager::log("It should create System generated task for User",array("user"=>$user),TLogger::INFO,$this,"createAutoTasks","SWP");
		
		 $task_actions;
		 $task_status;
			
		$task_actions = $this->getTaskActions();
		
		$task_status = $this->getTaskStatus();
		
		for ( $i = 0 ; $i < count($task_status); $i++ ) {
			
			if ( $task_status[$i]['InitialStatus'] == 'True' ) {
				
				$taskStatus = $task_status[$i];
			}
		}
		
		for ( $i = 0 ; $i < count($task_actions); $i++ ) {
			
			if ( $task_actions[$i]['InitialAction'] == 'True' ) {
				
				$taskAction = $task_actions[$i];
			}
		}
		
		$this->createPreDefinedTask($taskAction, $taskStatus, $user );
	}
	
	public function createPreDefinedTask( $taskAction, $taskStatus, $user ) {
		
		SWPLogManager::log("It should create System generated task for User",array("taskAction"=>$taskAction, "taskStatus"=>$taskStatus, "user"=>$user),TLogger::INFO,$this,"createPreDefinedTask","SWP");
		
		$contentId = $user->ContentID; 
		$productId = $user->ProductID ;
		$course = CourseRecord::finder()->withCc( '(1=1) ORDER BY ordering')->find( 'content_id = ? ',array( $contentId ) );
		$cc = $course->cc; 
		foreach ( $cc as $c ) {
		
			$v  = $c->content;
			if ( $v->type == 0 && $v->predefinedtask ) {
				
				$lastRuns = LastRunRecord::finder()->findAll( 'subject = ? and content_id = ? and video_id = ? and product_id = ? ',array('taskref',$contentId,$v->content_id,$productId));
				
				if ( count($lastRuns) > 0 ) {
					
					$msg = 'Task already exist';
					SWPLogManager::log($msg,array("Message"=>$msg),TLogger::DEBUG,$this,"createPreDefinedTask","SWP");
					//PradoBase::log( $msg,$level=TLogger::ERROR,$category='Uncategorized' );
					
				} else {
				$subject = $v->name;
				$thread_type_id = 3;
				$thread_catogery_id = 4;
				$class_id = 0;
				$content_id = $contentId ;
				$content = $taskAction['initialactiontext'];
				$toList = $this->getCourseInstanceStudent( true );
				   
				$reference_id = array();
				$reference_id['lesson'] = $v->name;
				$reference_id['video_id'] = $v->content_id;
				$reference_id['chapter'] = 0;
    			$reference_id['seek'] = 0;
    			$reference_id['quiz'] = null; 
    			$reference_id['ordering'] = sprintf('%1$04d',$c->ordering).'-'.$v->name;
    			$user->Uid = 0;
				$this->createThread( $subject,$thread_type_id,$thread_catogery_id,0,$content_id,null,$content,$toList,$reference_id,null,$taskAction['ID'],$taskStatus['ID'], $user );
				SWPLogManager::log('Predefined task created succesfully for lesson',array("result"=>$result),TLogger::INFO,$this,"createPreDefinedTask","SWP");
				}
			} else if( $v->type == 1 ) {
				$questions = QuizRecord :: finder()->findAll( 'parent_id = ? AND predefinedtask = ?',array( $v->content_id,1 ) );
				foreach ( $questions as $question ) {
					
					$lastRuns = LastRunRecord::finder()->findAll( 'subject = ? and content_id = ? and video_id = ? and question_id = ? AND product_id = ? ',array( 'taskref',$contentId,$v->content_id,$question->uid, $productId ) );
				if ( count($lastRuns) > 0 ){
					$msg = 'Task already exist';
					SWPLogManager::log($msg,array("Message"=>$msg),TLogger::ERROR,$this,"captureMessageDetails","SWP");
					
				} else {
					
					$subject = $v->name.' - '.$question->name;
					$thread_type_id = 3;
					$thread_catogery_id = 4;
					$class_id = 0;
					$content_id = $contentId ;
					$content = $taskAction['initialactiontext'];
					$toList = $this->getCourseInstanceStudent( true );
					$reference_id = array();
					$reference_id['lesson'] = $v->name;
					$reference_id['chaptername'] = $question->name;
					$reference_id['video_id'] = $v->content_id;
					$reference_id['chapter'] = null;
	    			$reference_id['seek'] = 0;
	    			$reference_id['quiz'] = $question->uid; 
	    			$reference_id['ordering'] = sprintf('%1$04d',$c->ordering).'-'.$v->name;
	    			$user->Uid = 0;
	    			$this->createThread( $subject,$thread_type_id,$thread_catogery_id,0,$content_id,null,$content,$toList,$reference_id,null,$taskAction['ID'],$taskStatus['ID'],$user );
	    			SWPLogManager::log('Predefined task created succesfully for quiz question',array("result"=>$result),TLogger::INFO,$this,"createPreDefinedTask","SWP");
				}
				}
			}
		
		}
		
	}
	 
//		$user = Prado::getApplication()->getUser();
//					$questions = QuizRecord::finder()->findAll('parent_id = ? ',$videoId);
//					$defaultstatus = -1;
//					$statusCode = 99;
//					foreach( $questions as $question ){
//						
//							$QReference = LastRunRecord::finder()->find('video_id = ?  AND question_id = ? AND product_id = ? AND content_id = ? AND subject ="taskref" ',$videoId,$question->uid,$user->product_id,$user->content_id);
//							if( count ( $QReference ) > 0 ){
//								
//							        $QThreadRecord = ThreadRecord::finder()->find('reference_id = ?',$QReference->uid);
//							        $QThreadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $QThreadRecord->uid,$user->Uid) );
//							    	if ( $defaultstatus == -1 ) {
//								    		
//							    		$defaultstatus = $statusCode;
//							    	}
//								    if( $QThreadRecord->status < $defaultstatus) {
//								    	
//								         $defaultstatus = $QThreadRecord->status;
//							        }
//							    }
//					}
//				return $defaultstatus;
//	}
	/**
	 *
     * As of now this function will return one userid who has role student and logged in userid in an array
     * 
     */
    private function getCourseInstanceStudent( $autotask =false ){
    	
    	SWPLogManager::log($msg,array("Auto task"=>$autotask),TLogger::INFO,$this,"getCourseInstanceStudent","SWP");
    	
    	$user = Prado::getApplication()->getUser();
		if( $autotask == true ){
			$retVals = array($user->getStudentID(),$user->getInstructorID())	;			 
			return $retVals;
		}

		$retVals = array($user->getStudentID(),$user->Uid);
		
		SWPLogManager::log($msg,array("Values"=>$retVals),TLogger::INFO,$this,"getCourseInstanceStudent","SWP");
    	return $retVals;
    }
    /**
     * @remotable
     * Enter description here ...
     * @param $param
     */
    public function getInstructions($param){
    	
    	SWPLogManager::log("Get the instruction from DB",array("param"=>$param),TLogger::INFO,$this,"getInstructions","SWP");
    	
	    if( $param['reference_id'] != null ){
	    		
	    	$lastrunrecord = LastRunRecord::finder()->find('uid = ? ',array($param['reference_id']));
    		$videorecord = VideoRecord::finder()->find('content_id = ?',array($lastrunrecord->video_id));
	    		
	    }else {
	    		
    		$videorecord = VideoRecord::finder()->find('content_id = ?',array($param['video_id']));
	    }
	    	if( $videorecord && $videorecord->instructions && $videorecord->instructions != '<br>') {
	    		
    		$strippedInsturction = strip_tags($videorecord->instructions);
    		
    		SWPLogManager::log("Pass the instruction",array("Instruction"=>$videorecord->instructions),TLogger::INFO,$this,"getInstructions","SWP");
    		return $videorecord->instructions;
	    }else{
	    	
	    	SWPLogManager::log("Pass the instruction",array("Instruction"=>'No Instructions'),TLogger::INFO,$this,"getInstructions","SWP");
    		return 'No Instructions';
	    }
    	
    	
    }
    
    /**
	 * @remotable
	 *	Retrives the instruction from the database based on the reference_id.
	 *
	 * refs #6022
	 */
    
    public function getQuizStatus($videoId,$recordQustionId,$isReopenPost,$isPostClosing){
    	
    	SWPLogManager::log("find the current Quiz status",array("videoId"=>$videoId,"recordQustionId"=>$recordQustionId),TLogger::INFO,$this,"getQuizStatus","SWP");
    	
    	$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$cid = $user->getContentID();
    	$studentId = $user->getStudentID();
		$otherUserId = 0;
		
		if($user->Uid == $studentId ){
			$otherUserId = $user->getInstructorID();
		} else {
			$otherUserId = $studentId;
		}
		
    	$taskStatusData = CollaborationToolMgr::getTaskStatus();
		$questions = QuizRecord::finder()->findAll('parent_id = ? ',$videoId);
		$defaultstatus = -1;
		$threadID=null;
		$iconTooltip = null;
		$unreadCount = 0;
		$lessonSubsequent = array();
		
		$videoRecordMgr = new VideoRecordMgr();
		$isLessonCompleted = $videoRecordMgr->getLessonCompletedStatus( $videoId , $pid );
		
	    $taskStatusData = CollaborationToolMgr::getTaskStatus();
	    
		foreach($taskStatusData as $statusRecord){
			   if($statusRecord['FinalStatus'] == "True"){
				     $statusCode = intval($statusRecord['ID']);
			   }
		}
		
		if( count( $questions ) > 0 ){
			
			$updtedFromOtherUser = false;
			foreach( $questions as $question ){
						
				$QReference = LastRunRecord::finder()->find('video_id = ?  AND question_id = ? AND product_id = ? AND content_id = ? AND subject ="taskref" ',$videoId,$question->uid,$user->ProductID,$user->ContentID);
				if( count ( $QReference ) > 0 ){

					$QThreadRecord = ThreadRecord::finder()->find('reference_id = ? ',$QReference->uid);
					$QThreadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $QThreadRecord->uid,$user->Uid) );
					if ($QThreadUser->unread_Post_Count > 0){
						 	$unreadCount = $unreadCount+1;
				 	}
					if( !$updtedFromOtherUser ){
						if( $QThreadRecord->last_update_user_id == $otherUserId && $QThreadRecord->status != $statusCode ){
							
				    		$defaultstatus = $quizStatus = 4;
					    	$updtedFromOtherUser = true;
					    }else{
							if ( $defaultstatus == -1 ) {
								$defaultstatus = $statusCode;
							}
							if( $QThreadRecord->status < $defaultstatus) {
								$defaultstatus = $QThreadRecord->status;
							}
					    }
					}
				}
							
				if( $question->uid == $recordQustionId ){
					$threadID = $QThreadRecord->uid;
				}
			}
			
			if( $defaultstatus != -1 && !$updtedFromOtherUser){
			
				if($defaultstatus == '4' && $otherUserId == prado::getApplication()->getUser()->getStudentId()){
	    			$quizStatus = 5;
	    		} else {
	    			$quizStatus = $defaultstatus;
	    		}
			}
			
			foreach( $taskStatusData as $statusRecord ) {
				
					if($statusRecord['ID'] == $defaultstatus){
						$iconTooltip = $statusRecord['quiztooltip'];								 
					}
			}
					
		}else{
			
			$LReference = LastRunRecord::finder()->find('video_id = ? AND product_id = ? AND content_id = ? AND subject ="taskref" ',$videoId,$user->ProductID,$user->ContentID);
			if( count ( $LReference ) > 0 ){
				$LThreadRecord = ThreadRecord::finder()->find('reference_id = ?',$LReference->uid);
	    		if ( $defaultstatus == -1 ) {
		    		$defaultstatus = $statusCode;
		    	}
			    if( $LThreadRecord->status < $defaultstatus) {
								    	
			         $defaultstatus = $LThreadRecord->status;
			         $threadID = $LThreadRecord->uid;
		        }
				foreach( $taskStatusData as $statusRecord ) {
						
					if($statusRecord['ID'] == $defaultstatus){
						$iconTooltip = $statusRecord['lessontooltip'];								 
					}
				}
			}
			
			$quizStatus = $defaultstatus;
			
			//When a task is closed or opened related to a lesson , then we need to first see that lesson have settings 
			//if it is having the settings then check is it task dependent .
			//If it is task dependent then we need to change the lock status according to that other wise no need to do any thing. 
			$lessonSettingsIsTaskDependent = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND setting_name = "SUB_SEQUENT_LOCK "',
								array( $user->ContentID, $videoId ) );
			if(count($lessonSettingsIsTaskDependent) > 0){	
				if($lessonSettingsIsTaskDependent->setting_value == 1)	{	
					if($isPostClosing){	
						//If the task is Closing then we will see the subsequent cotent which is opted for lock.
						//And the task related lesson is completed or not.
						//if that is complete then we will send back the list of subsequent content so we can remove this 
						//video_id from the subSequentArray of the particular content.
						$lessonSubsequentRecs = ProductLessonSettingRecord::finder()->findAll( 'course_id = ? AND lesson_id = ? AND setting_value = 1 AND setting_name != "SUB_SEQUENT_LOCK "',array( $user->ContentID, $videoId ) );
						if( count($lessonSubsequentRecs) > 0){
							if($isLessonCompleted){
								foreach ( $lessonSubsequentRecs as $lessonSubsequentRec ){
			   						array_push($lessonSubsequent, $lessonSubsequentRec->content_id ) ;
								}
							}
						}
					}elseif($isReopenPost){
						//If the task is reopening then we will just see the subsequent cotent which is opted for lock.
						$lessonSubsequentRecs = ProductLessonSettingRecord::finder()->findAll( 'course_id = ? AND lesson_id = ? AND setting_value = 1 AND setting_name != "SUB_SEQUENT_LOCK "',array( $user->ContentID, $videoId ) );
						if( count($lessonSubsequentRecs) > 0){
							foreach ( $lessonSubsequentRecs as $lessonSubsequentRec ){
								array_push($lessonSubsequent, $lessonSubsequentRec->content_id ) ;
							}
						}
					}
				}
			}
		}
		$statusCls = null;
		if( $quizStatus != -1 ){
			foreach( $taskStatusData as $statusRecord ) {
		
				if($statusRecord['ID'] == $quizStatus){
		
					$statusCls = $statusRecord['Cls']."-".$quizStatus;
					 
				}
			}
		}
		$fullyCompleted =  ThreadRecord::finder()->findAll('thread_type_id = ? AND product_id = ? AND content_id = ? And status!= ?',array(3,$user->ProductID,$user->ContentID,$statusCode));
		$coursestatus = $this->getCourseStatus( $statusCode, $otherUserId, true );
		if ( count($fullyCompleted) > 0 ){
			$fullyCompleted = false;
		} else {
			$fullyCompleted = true;
		} 
		
		SWPLogManager::log("Current Quiz Status",array(
				"status"=>$defaultstatus,"taskId"=>$threadID,"statusCls"=>$statusCls,
				"iconTooltip"=>$iconTooltip,"unreadCount"=>$unreadCount,
				"fullyCompleted"=>$fullyCompleted,"courseStatus"=>$coursestatus
		),TLogger::INFO,$this,"getQuizStatus","SWP");
		
		return array(
				"status"=>$defaultstatus,
				"taskId"=>$threadID,
				"statusCls"=>$statusCls,
				"iconTooltip"=>$iconTooltip,
				"unreadCount"=>$unreadCount,
				"fullyCompleted"=>$fullyCompleted,
				"courseStatus"=>$coursestatus,
				"isLessonCompleted"=>$isLessonCompleted,
				"lessonSubsequent"=>$lessonSubsequent //Here this array gives the subsequent setting items for the Lesson
		
//				"QuizStatus"=> $quizStatus
		);
    	
    	
        }
        
  	/**
     * @remotable
     * If the application users already played value is 0 then it will create the predefined Tasks for the user and will get the training files
     * 	After successfully execution it will update the 'alreadyPlayed' column as 1.
     * 
     */
    
   public function InitializeVideoPlayer( $params ){
   		
   		SWPLogManager::log("This is before intializing video player",array("Params"=>$params),TLogger::INFO,$this,"InitializeVideoPlayer","SWP");
   	
		$user = Prado::getApplication()->getUser();
		
		$userRoles =   $user->getUserRecord()->getExtractedRoles() ;
		// 			 var_dump( $userRoles['all']);
		if( in_array('2', $userRoles['all'])  ){
			return true;
		}
		//
		//	If the already played value is 0 then only execute.
		//
		   $aurl = ActiveUrlRecord ::finder()->find(' user_id = ? AND  product_id IN ( '.$user->ProductID.',null,0) AND content_id= ?',array($user->Username, $user->ContentID));
		if ( $aurl && !$user->AlreadyPlayed ) {	
			
		   $videoRecordMgr = new VideoRecordMgr();
		   $videoRecordMgr->getTrainingFiles();
		   
		   //
		   // if the video of the product instance is played for the first time by the student then. task creation is not possbile directly
		   // as student is not allowd to create task.. 
		   // change the uid of the video player user to the instructor uid and reassing the original uid after creating auto tasks.
		   //
		   $uidorig = $user->Uid;
		   if ( $user->getStudentID() == $user->Uid ) {
		   	 
		   	$user->Uid = $user->getInstructorID();
		   }
		   $this->createAutoTasks( $user );
		   $user->Uid = $uidorig;
		   
		   /*
		    * 	As of now there are two possibilty for product id so we are checkin product id as either null or 0
		    * 	and getting the record and then updating the column.
		    * 
		    * */
		   	
		   $aurl->alreadyPlayed = 1;
		   $aurl->save();
		   SWPLogManager::log("This is the first time login for the user",null,TLogger::INFO,$this,"InitializeVideoPlayer","SWP");
		   	 
		}
		
		return true;
   }

 	/**
    * @remotable
    * 
    */
   
   public function createTaskSummary( $param ) {

   	SWPLogManager::log("It should return all the records for course Task summary window",array("user"=>$user),TLogger::DEBUG,$this,"createTaskSummary","SWP");
   	
   	$user = Prado::getApplication()->getUser();
   	$course = CourseRecord::finder()->withCc( '(1=1) ORDER BY ordering')->find( 'content_id = ?',array( $user->getContentID() ) );
   	$cc = $course->cc;
   	$retVals = array();
   	$taskAction = $this->getTaskActions();
   	
   	foreach ( $cc as $c ) {

   		$v  = $c->content;
   		if ( $v->type == 0 ) {

   			$lastRuns = LastRunRecord::finder()->find( 'subject = ? and content_id = ? and video_id = ? and product_id = ? ',array('taskref',$user->getContentID(),$v->content_id, $user->ProductID));

   			if ( count($lastRuns) > 0 ) {

   				$thread = ThreadRecord::finder()->find('reference_id = ? ',$lastRuns->uid);
   				$threadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $thread->uid,$user->Uid) );
   				$all['name'] = $v->name;
   				$all['video_id'] = $lastRuns->video_id;
   				$all['content_id'] = $lastRuns->content_id;
   				$all['question_id'] = null;
   				$all['task_id'] = $thread->uid;
   				$all['status'] = $thread->status;
   				$all['read'] = $threadUser->unread_Post_Count;
   				$all['taskAction'] = $thread->taskaction;
   				$retVals[]=$all;
   			}
   				
   		} else if( $v->type == 1 ) {

   			$questions = QuizRecord :: finder()->findAll( 'parent_id = ?',array( $v->content_id ) );
   			foreach ( $questions as $question ) {

   				$lastRuns = LastRunRecord::finder()->find( 'subject = ? and content_id = ? and video_id = ? and question_id = ? and product_id = ? ',array( 'taskref',$user->getContentID(),$v->content_id,$question->uid,$user->ProductID ) );

   				if ( count($lastRuns) > 0 ) {

   					$thread = ThreadRecord::finder()->find('reference_id = ? ',$lastRuns->uid);
   					$threadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $thread->uid,$user->Uid) );
   					$all['name'] = $v->name.'-'.$question->name;
   					$all['video_id'] = $lastRuns->video_id;
   					$all['content_id'] = $lastRuns->content_id;
   					$all['question_id'] = $lastRuns->question_id;
   					$all['task_id'] = $thread->uid;
   					$all['status'] = $thread->status;
   					$all['read'] = $threadUser->unread_Post_Count;
   					$all['taskAction'] = $thread->taskaction;
   					$retVals[]=$all;

   				}
   			}
   		}

   	}
   	
   	SWPLogManager::log("Return these records",array("records"=>$retVals),TLogger::INFO,$this,"createTaskSummary","SWP");
   	return $retVals;

   }
   /**
	 * @remotable
	 *	Retrives the Threads from the database based on the parameters thread_type_id and logged in userid
	 *	Gets called when ever messages store got loaded.
	 *
	 */
	public function getUnReadMessageCount1( $params ){
		return ;
	}
	
	
	/**
	 * @remotable
	 * Retrive the page count of the page in which the record exists
	 * 
	 */
	public function getPageCount( $threadType,$recordId,$pageSize ){
		
		SWPLogManager::log("From get page count",array("threadType"=>$threadType,"recordId"=>$recordId,"pageSize"=>$pageSize ),TLogger::INFO,$this,"getPageCount","SWP");
		
		$user = Prado::getApplication()->getUser();
		$contentid = $user->ContentID ;
		$productId = $user->getProductID();
		//$threadType = $params['thread_type_id'];
		//$recordId = $params['record_id'];
		//$pageSize = $params['pageSize'];
		
		$q = new ThreadRecord();
		$conn = $q->getDbConnection();
		$conn->setActive(true);
		$foundRecord = false;
		$pageCount =1;
		$start = 0;
		$limit =$pageSize;
		while( !$foundRecord ){
			$sql = "select  * from (
 		( select  thread_message.uid from thread_message where thread_type_id =:thread_type_id AND thread_message.content_id =:content_id   
		AND thread_message.product_id =:product_id  
		ORDER BY last_update DESC ";
			$sql = $sql ." LIMIT ".$start .",".$limit .") as t ) where t.uid IN (".$recordId.");";
			$cmd = $conn->createCommand( $sql );
			$cmd->bindValue(':thread_type_id', $threadType );
			$cmd->bindValue(':content_id', $contentid );
			$cmd->bindValue(':product_id', $productId );
			$result = $cmd->queryColumn();
			
			 if( count( $result ) == 1) {
				$foundRecord = true;
				break;
			 } 
			$start = $limit;
			$limit = $start + $pageSize;
			$pageCount++;
		}
		SWPLogManager::log("Total number of pages",array("pageCount"=>$pageCount),TLogger::INFO,$this,"getPageCount","SWP");
		return $pageCount;
	}
	/**
	 * @remotable
	 * Update the unread post in the thread_post_users,thread_users.
	 */
	public function updatePostRead( $userId, $postId, $threadId ){
		
			SWPLogManager::log("User unread post count should update",array("user"=>$userId,
			"postId"=>$postId, "threadId"=>$threadId),TLogger::INFO,$this,"updatePostRead","SWP");
			
			$threadPostUsers = ThreadPostUserRecord::finder()->findAll(' user_id =? AND post_id = ? ' ,$userId, $postId  );
    		$threadPostUsers[0]->unread_post = 0;
    		$threadPostUsers[0]->save();
    		$threadUser = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? ' , $userId, $threadId );
    		if( $threadUser->unread_Post_Count > 0 ){
				//201404241123
    			$threadUnreadPostCount = $threadUser->unread_Post_Count - 1;
	    		$threadUser->unread_Post_Count = $threadUnreadPostCount;
	    		//201404180205
	    		//irespective of the Thread count , the status is changed 
	    		$threadUser->threadreadstatus  = 1;
	    		
	    		$threadUser->save();
    		}
    		SWPLogManager::log("sent unread post count",array("unreadPostCount"=>$threadUser->unread_Post_Count),TLogger::INFO,$this,"updatePostRead","SWP");
    		return $threadUser->unread_Post_Count;
    		
	}
	/**
	 * @remotable
	 * This method used to identify the Cource status based on the Task's status.
	 */
	public function getCourseStatus( $statusCode, $otherUserId, $fromQuizStatus  ){
		
			SWPLogManager::log("What is the current Course Status",array("statusCode"=>$statusCode,
				"otherUserId"=>$otherUserId, "fromQuizStatus"=>$fromQuizStatus),TLogger::INFO,$this,"getCourseStatus","SWP");
			
			$user = Prado::getApplication()->getUser();
			$contentid = $user->ContentID ;
			$productId = $user->getProductID();
			$coursedefaultstatus = -1;
			$threadRecords =  ThreadRecord::finder()->findAll('thread_type_id = ? AND product_id = ? AND content_id = ?',array(3,$user->ProductID,$user->ContentID));
			foreach( $threadRecords as $thread ){
			if( $thread->last_update_user_id == $otherUserId && $thread->status != $statusCode ){
		    	$coursedefaultstatus = 4;
		    	 return $coursedefaultstatus;
		    }
		    
			if ( $coursedefaultstatus == -1 ) {
				    		
		    		$coursedefaultstatus = $statusCode;
		    	}
			    if( $thread->status < $coursedefaultstatus) {
		         
			         $coursedefaultstatus = $thread->status;
		        }
	   			
		    }	
		if($coursedefaultstatus == '4' && $otherUserId == prado::getApplication()->getUser()->getStudentId()){
				return 5;
		 }
		 	SWPLogManager::log("Current Course Status",array("currentcoursestatus"=>$coursedefaultstatus),TLogger::INFO,$this,"getCourseStatus","SWP");
		    return $coursedefaultstatus;
	
	}
	
	

	
	/**
	 * @remotable
	 * 
	 * This method is used to findout all the ipen tasks and messages for Instructor.
	 */
	public function  reminderMailsPreparationToInstructor(){
		require_once(BASEPATH.'/config.php');
		// Getting all the Distinct instructors list.
		$currentTime = date('Y-m-d H:i:s ', time());
		$sql = 'SELECT DISTINCT instructor_id FROM course_details where availablilitydate >= "'.$currentTime.'"';
		$users = TActiveRecord::finder('CourseDetailsRecord')->findAllBySql($sql);
		foreach ($users as $user) {
			if(!empty($user->instructor_id)){
					
				$courseRecords = 'SELECT DISTINCT course_id FROM course_details where instructor_id ='.$user->instructor_id.' AND availablilitydate >= "'.$currentTime.'"';
				$noOfCourses = TActiveRecord::finder('CourseDetailsRecord')->findAllBySql($courseRecords);
				$instructorDetails = UserRecord::finder()->find('Uid =  '.$user->instructor_id);
				// Getting all the courses associated with a particular instructor.
				$instructorMailBody = '';
				foreach ($noOfCourses as $course) {
					
					// For that course and instructor combination checking whether the 
					// Open Message/Task Reminders setting is Yes, if yes then only reminder should go.
					$courseRecord = ProductRecord::finder()->find('content_id = ? ', array($course->course_id));
					$courseName = $courseRecord->name; 
						
					$records = UserSettingsRecord::finder()->findAll('user_id = ? AND `key` = ? AND `value` = ?  AND content_id = ? ',array($user->instructor_id, 'Open Message/Task Reminders', 'NO', $course->course_id ) );
					if(count($records) <= 0 ){
						$sql = 'SELECT DISTINCT course_id, student_id FROM course_details where instructor_id ='.$user->instructor_id.' AND course_id = '.$course->course_id;
						$allStudents = TActiveRecord::finder('CourseDetailsRecord')->findAllBySql($sql);
						$i = 0;
						$rowsList = array(); 
						foreach ($allStudents as $indStudent) {
							$sql = 'SELECT DISTINCT product_id,course_id,expirationdate,availablilitydate FROM course_details where instructor_id ='.$user->instructor_id.' AND course_id = '.$course->course_id.' AND student_id = '.$indStudent->student_id.' AND availablilitydate >= "'.$currentTime.'"';
							$allStudentsproducts = TActiveRecord::finder('CourseDetailsRecord')->findAllBySql($sql);
							
							foreach ($allStudentsproducts as $insStuProduct ){
								$studentRecord = UserRecord::finder()->find('Uid =  '.$indStudent->student_id);
								
								$unreadMessageCount  		= $this->getUnreadMessageCountOfUser($insStuProduct->course_id, $instructorDetails , $insStuProduct->product_id );
								$unreadTaskCount     		= $this->getUnreadTaskCount($insStuProduct->course_id, $instructorDetails , $insStuProduct->product_id );
								$instructorAvailDays 		= $this->getDaysCount($insStuProduct->availablilitydate, $instructorDetails->timezone);
								$courseExpirationdateDays 	= $this->getDaysCount($insStuProduct->expirationdate ,$instructorDetails->timezone);
								$studentName = !empty($studentRecord->Name) ? $studentRecord->Name : $studentRecord->Username;
								//201404210527
								$rowBody = $this->prepareRemainderMailRowFormat($studentName,$unreadMessageCount,$unreadTaskCount,$instructorAvailDays,$courseExpirationdateDays,$insStuProduct->product_id,$instructorDetails->username);
					
								$rowsList[$i]=$rowBody;
								$i++;
							}
						}
					}
					
					$mailBody   = $this->prepareInstructorReminderMailBody($rowsList,$courseName);
					$mailBody  .= '<br><br>';
					$instructorMailBody .=  $mailBody;
				}
			    $this->createUserThreadEmail($instructorMailBody,$instructorDetails->timezone , $instructorDetails->Email);
			}
		}
	}
	
	/**
	 * @remotable
	 * 
	 * This method will prepare the data which is used to show in the student mail
	 * 201404180205 
	 */
	public function reminderMailsPreparationToStudents(){
		require_once(BASEPATH.'/config.php');
		$currentTime = date('Y-m-d H:i:s ', time());
		
    	// Get all the distinct students available.
		$sql = 'SELECT DISTINCT student_id FROM course_details where availablilitydate >= "'.$currentTime.'"';
		$users = TActiveRecord::finder('CourseDetailsRecord')->findAllBySql($sql);
		foreach ($users as $user) {
			// Get all the courses for the student.
			$courseRecords = 'SELECT DISTINCT instructor_id,product_id,course_id,availablilitydate,expirationdate  FROM course_details where student_id ='.$user->student_id.' AND availablilitydate >= "'.$currentTime.'"';
			$noOfCourses = TActiveRecord::finder('CourseDetailsRecord')->findAllBySql($courseRecords);
			
			$studentDetails = UserRecord::finder()->find('Uid =  '.$user->student_id);
			$i = 0;
			$rowsList = array(); 
			foreach ($noOfCourses as $course) {
				// For a particular course and user combination, find the settings value
				// If it is yes then only we are sending the reminder mails to student.
				$records = UserSettingsRecord::finder()->findAll('user_id = ? AND `key` = ? AND `value` = ?  AND content_id = ? ',array($course->instructor_id, 'Open Message/Task Reminders For Student', 'NO', $course->course_id ) );
				if(count($records) <= 0 ){
					$courseRecord = ProductRecord::finder()->find('content_id = ?',array($course->course_id));
					$courseName = $courseRecord->name;
					//Method will get unread message count : Unread private messages count in that course 
					//instance. We are not considering unread posts count over here.
					$unreadMessageCount  		= $this->getUnreadMessageCountOfUser($course->course_id, $studentDetails , $course->product_id );
					$unreadTaskCount     		= $this->getUnreadTaskCount($course->course_id, $studentDetails , $course->product_id );
					$instructorAvailDays 		= $this->getDaysCount($course->availablilitydate, $studentDetails->timezone);
					$courseExpirationdateDays 	= $this->getDaysCount($course->expirationdate ,$studentDetails->timezone);			
					//201404210527
					$rowBody = $this->prepareRemainderMailRowFormat($courseName,$unreadMessageCount,$unreadTaskCount,$instructorAvailDays,$courseExpirationdateDays,$course->product_id,$studentDetails->username);
					
					$rowsList[$i]=$rowBody;
					$i++;
				}
			}
			$mailBody  = $this->prepareStudentReminderMailBody($rowsList);
			$this->createUserThreadEmail($mailBody,$studentDetails->timezone , $studentDetails->Email);
		}	
	}
	
	/**
	 * This method is useful to get Unread Message Count OfUser(student / instructor)
	 * @param int $course_id
	 * @param UserRecord $userDetails
	 * @param int $product_id
	 * 201404180205
	 */
	public function getUnreadMessageCountOfUser($course_id, $userDetails , $product_id ){
		$threads = ThreadRecord::finder()->findAll('thread_type_id = 1 AND `status` !=2 AND product_id = ? AND content_id = ?' , array( $product_id, $course_id )); 
		$unreadMessageCount = 0;
		foreach ($threads as $thread){
			$userRecords = ThreadUserRecord::finder()->findAll(' user_id =? AND thread_id = ? AND unread_Post_Count > 0 ' , array( $userDetails->Uid , $thread->Uid ) );
			if(count($userRecords) > 0){
				$unreadMessageCount++;
			}
		}
		return $unreadMessageCount;
	}
	
	/**
	 * This method is useful to get Unread Task Count OfUser(student / instructor)
	 * @param int $course_id
	 * @param UserRecord $userDetails
	 * @param int $product_id
	 * 201404180205
	 */
	public function getUnreadTaskCount($course_id, $userDetails , $product_id ){
		$threads = ThreadRecord::finder()->findAll('thread_type_id = 3 AND `status` !=99 AND product_id = ? AND content_id = ?' , array( $product_id, $course_id )); 
		$unreadTaskCount = 0;
		foreach ($threads as $thread){
			
			$userRecords = ThreadUserRecord::finder()->findAll(' user_id =? AND thread_id = ? AND unread_Post_Count > 0' , array( $userDetails->Uid , $thread->Uid ) );
			if(count($userRecords) > 0){
				$unreadTaskCount++;
			}
		}
		return $unreadTaskCount;
	}
	
	/**
	 * This method will give the differance in days between given date and current date
	 * @param date $desireddate
	 * @param String $studentTimeZone
	 * 201404180205
	 */
	public function getDaysCount($desireddate , $studentTimeZone){
		$currentTime = new DateTime();
		
		$desDateTime =  new DateTime($desireddate);
		
		$interval = $desDateTime->diff($currentTime);
		$result = 0;
		if ($interval->days) {
			 $result = $interval->days; 
		}
		return $result;
	}
	
	/**
	 * This method is useful to create a rowbody for the each course related to this student
	 * @param String $entiryName  It could be course or student user name
	 * @param int $unreadMessageCount
	 * @param int $unreadTaskCount
	 * @param int $instructorAvailDays
	 * @param int $courseExpirationdateDays
	 * 201404180205
	 */
	public function prepareRemainderMailRowFormat($entiryName,$unreadMessageCount,$unreadTaskCount,$instructorAvailDays,$courseExpirationdateDays,$courseInstanceID,$userName){
		//201404210527
		$entityLink = $this->prepareEntityLink($entiryName,$courseInstanceID,$userName);
		$rowBody = '';
		$rowBody .= reminder_normalrow; 
		$rowBody .= reminder_table_cell.$entityLink.reminder_cell_end.
					 reminder_table_cell.$unreadMessageCount.reminder_cell_end.
					 reminder_table_cell.$unreadTaskCount.reminder_cell_end;
		if($instructorAvailDays < 5) {	
			if($instructorAvailDays < 2){	 
				$rowBody .=  reminder_table_redcell.$instructorAvailDays." days".reminder_cell_end;
			} else {
				$rowBody .=  reminder_table_orangecell.$instructorAvailDays." days".reminder_cell_end;
			}
		} else {
			$rowBody .=  reminder_table_cell.$instructorAvailDays." days".reminder_cell_end;
		}
		
		$rowBody .=  reminder_table_cell.$courseExpirationdateDays." days".reminder_cell_end;
						
		$rowBody .= reminder_row_end;
		return $rowBody;
	}
	
	/**
	 * This method is useful for the preparation of the Link for accessing the messaging window
	 * @param unknown_type $entiryName
	 * 201404210527
	 */
	public function prepareEntityLink($entiryName,$courseInstanceID,$userName){
		$ini_array = parse_ini_file(BASEPATH.'/images/Email/Template.ini');
    	
    	$values = array();
    	foreach( $ini_array as $k=>$v ) {
    		$values[$k] = $v;
    	}
    	
    	$cmsurl = $values['cmsurl'];
    	$url = $cmsurl.'?u='.$userName.'&p='.$courseInstanceID;
    	$entityLink = '<a href="'.$url.'"  target="_blank">'.$entiryName.'</a>';
    	
    	return $entityLink;
	}
	
	/**
	 * This method is useful for the preparation of main mail body
	 * @param Array of rowBody $rowsList
	 * 201404180205
	 */
	public function prepareStudentReminderMailBody($rowsList){
		$mailBody = reminder_mail_header;	
		$mailBody  .= ' <table style = " font-family: Arial, Helvetica, sans-serif;width: 100%;border-collapse: collapse;" >'.
			student_reminder_header;
		foreach($rowsList as $rows){
			$mailBody  = $mailBody.$rows;	
		}
		$mailBody  = $mailBody.'</table>';
		$mailBody  .= reminder_mail_end;
		return $mailBody;
	}
	
	/**
	 * This method is useful for the preparation of main mail body
	 * @param Array of rowBody $rowsList
	 * 201404181205
	 */
	public function prepareInstructorReminderMailBody($rowsList,$courseName){
		$mailBody = reminder_mail_header;
		$mailBody .= ' <table style = " font-family: Arial, Helvetica, sans-serif;width: 100%;border-collapse: collapse;" >';
		$mailBody .= reminder_instructor_course_group.reminder_instructor_course_group_body.$courseName.reminder_instructor_course_group_end;
		$mailBody .= reminder_private_message_header;
		foreach($rowsList as $rows){
			$mailBody  = $mailBody.$rows;	
		}
		$mailBody  = $mailBody.'</table>';
		$mailBody  .= reminder_mail_end;
		return $mailBody;
	}
	
	/**
	 * This method is responsible for preparing the Thread Email Record object
	 * @param String $mailBody
	 * @param String $studentTimeZone
	 * @param String $studentEmail
	 * 201404180205
	 */
	public function createUserThreadEmail($mailBody,$studentTimeZone , $studentEmail ){
		// Read the ini file and get the from address and mail subject template.
		$ini_array = parse_ini_file(BASEPATH.'/images/Email/Template.ini');
    	
    	$values = array();
    	foreach( $ini_array as $k=>$v ) {
    		$values[$k] = $v;
    	}
    	
    	$from = $values['from'];
    	$subjectofMail = $values['studentremindersubject'];
    	
		if(!empty($mailBody)){
			$emailrec = new ThreadEmailRecord();
    		$emailrec->to = $studentEmail;
    		$emailrec->from = $from;
	    	$emailrec->body = $mailBody;
	    	$emailrec->subject = $subjectofMail;
	    	$emailrec->status = 'Pending';
	    	$emailrec->save();
			
		} else {
			
			SWPLogManager::log("Empty Body",array("user"=>" "),TLogger::ERROR,$this,"prepareStudentReminderMailBody","REMINDER");
			return false;
		}
	}
	
	/**
	 * This method is used to get the The notification contains the list of user id for 
	 * who we have a change in unread stats during unread message update to BSS.
	 * For the active courses will be sent with unread message count.
	 * 201404241123
	 */
	public function  unreadMessageCountUpdateToBSS(){
		$mainData = array();
		$sql = 'SELECT DISTINCT user_id FROM thread_users where threadreadstatus = 1 ';
		$threadUsers = TActiveRecord::finder('ThreadUserRecord')->findAllBySql($sql);
		if(count($threadUsers)>0){
			$a = 0;
			foreach($threadUsers as $threaduser){
				$userLevelData = array();
				$user_id = $threaduser->user_id;
				$userRecord = UserRecord::finder()->find('Uid =  '.$user_id);

				$currentTime = date('Y-m-d H:i:s ', time());
				$courseDetailsRecords = CourseDetailsRecord::finder()->findAll('( instructor_id=? OR student_id=?) AND expirationdate >= "'.$currentTime.'"',array($user_id,$user_id));
				$valuesArray = array();
				$i = 0;
				foreach($courseDetailsRecords as $courseDetailsRecord){
					$unreadMessageCount = 0;
					$unreadTaskCount	= 0;
					$product_id = $courseDetailsRecord->product_id;
					$course_id  = $courseDetailsRecord->course_id;
					
					$considerThis = false;
					$allThreads = ThreadRecord::finder()->findAll(' product_id = ? AND content_id = ?' , array( $product_id, $course_id ));
					foreach ($allThreads as $threadRec){
						$thredUserRecords = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? AND threadreadstatus = 1' , array( $user_id , $threadRec->uid ) );
						if(count($thredUserRecords) > 0){
							$considerThis = true;
							$thredUserRecords->threadreadstatus = 0;
							$thredUserRecords->save();
						}
					}
					$messageCount = $this->getUnreadMessageCountForUserCourseInstance($product_id,$course_id,$user_id,$considerThis);
					$taskCount    = $this->getUnreadTaskCountForUserCourseInstance($product_id,$course_id,$user_id,$considerThis);
					//201404241235
					if($messageCount['consider'] == true){
						$unreadMessageCount = $messageCount['count'];
					}
					
					if($taskCount['consider'] == true){
						$unreadTaskCount = $taskCount['count'];
					}
					
					if(($messageCount['consider'] == true) || ($taskCount['consider']==true)){
						$count = $unreadMessageCount + $unreadTaskCount;
						$valuesArray[$product_id] = $count;
						$i++;
					}
				}
				
				if(!empty($valuesArray)){
					$userLevelData['user_id'] = $userRecord->username;
					$userLevelData['msg'] = $valuesArray;
					$mainData[$a]= $userLevelData;
					$a++;
				}
			}
		}
		return $mainData;
	}
	
	/**
	 * Unread Message Count For User CourseInstance combination
	 * @param unknown_type $product_id
	 * @param unknown_type $course_id
	 * @param unknown_type $user_id
	 * 201404241123
	 */
	public function getUnreadMessageCountForUserCourseInstance($product_id,$course_id,$user_id,$considerThis){
		$threads = ThreadRecord::finder()->findAll('thread_type_id = 1 AND product_id = ? AND content_id = ?' , array( $product_id, $course_id )); 
		$unreadMessCount = $this->calculateUnreadCountFromThreads($user_id,$threads,$considerThis);
		return $unreadMessCount;
	}
	
	/**
	 * Unread Task Count For User CourseInstance combination
	 * @param unknown_type $product_id
	 * @param unknown_type $course_id
	 * @param unknown_type $user_id
	 * 201404241123
	 */
	public function getUnreadTaskCountForUserCourseInstance($product_id,$course_id,$user_id,$considerThis){
		$threads = ThreadRecord::finder()->findAll('thread_type_id = 3 AND product_id = ? AND content_id = ?' , array( $product_id, $course_id )); 
		$unreadMessCount = $this->calculateUnreadCountFromThreads($user_id,$threads,$considerThis);
		return $unreadMessCount;
	}
	
	/**
	 * Code That helpful for calculating the unread message count from the Messages and tasks
	 * @param unknown_type $threads
	 */
	public function calculateUnreadCountFromThreads($user_id,$threads,$considerThis){
		$unreadMessageCount = 0;
		if(count($threads) > 0) {
			if($considerThis){
				foreach ($threads as $thread){
					$userRecords = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? AND unread_Post_Count > 0' , array( $user_id , $thread->uid ) );
					if(count($userRecords) > 0){
						$unreadMessageCount++;
					} 
				}
			}
		}
		//201404241235
		//Reason for adding this is We are coming to this method for all the course instances realted to this user.
		//This particular course instance may have modified records or not so $considerThis will tell use is this course 
		//instance related record is modified or not.
		$unreadMessCount= array();
		$unreadMessCount['consider'] = $considerThis;
		$unreadMessCount['count'] = $unreadMessageCount;
		
		return $unreadMessCount;
	}
	
	/**
	*@remotable
	*
	*/
	
	public function convertDateTimeZone( $dateTime,$targetTimeZone ){
		
		SWPLogManager::log("Came to ConvertTimezone",array("dateTime"=>$dateTime,"targetTimeZone"=>$targetTimeZone),TLogger::INFO,$this,"convertDateTimeZone","SWP");
		
		if( empty($targetTimeZone) ){
			
			return $dateTime;
		}
		$gmtTimezone = new DateTimeZone('GMT');
		
		$dateTime = new DateTime($dateTime,$gmtTimezone);
		$dateTimeArray = (array)$dateTime;
		
		$requiredTimeZone = new DateTimeZone( $targetTimeZone );
		
		$offsetForGMTDateTime = $requiredTimeZone->getOffset($dateTime);
		$offsetVal = strtotime($dateTimeArray['date']) + $offsetForGMTDateTime;
		
		$convertedNewDate = date('Y-m-d H:i:s', $offsetVal);
		
		SWPLogManager::log("Corresponding time",array("time"=>$convertedNewDate),TLogger::INFO,$this,"convertDateTimeZone","SWP");
		
		return $convertedNewDate;
	}
	

	
	/**
	 * @remotable
	 * 
	 * This method is used to prepare new logic for thread details on the open Task for the student.
	 * 201311251756
	 */
	public function MessageDetailsOfTheThread( $thread_id ) {
		
		$user = Prado::getApplication()->getUser();
	
//	foreach ( $threads as $thread ) {
			$thread = 	ThreadRecord::finder()->find('uid = ? ', array($thread_id));
			$postsByUser = 0;
			$postsByThreadCreator = 0;
			$matchedthreads = ThreadRecord::finder()->findAll( 'content_id = ? AND product_id = ?' , array( $user->ContentID, $user->ProductID) );
			foreach( $matchedthreads as $threadMatch ) {

				$threadPosts = ThreadPostRecord::finder()->findAll( 'thread_id = ? ' , array( $threadMatch->uid) );
				
				foreach( $threadPosts as $post ) {
					// Please dont delete this code, in future we amy need to use the same code.
//					if( $post->author_id == $thread->last_update_user_id ) {
//						$postsByUser += 1;
//					}
				if( $post->author_id == $thread->created_user_id ) {
						$postsByThreadCreator += 1;
					}

				}
			}
					
				/**
				 * If a task has training files then only training files button in task detail window should be enabled
				 */
				
				if( ($thread->thread_type_id == 3 )  && ( $thread->reference_id ) ){
						
					$lastrunRecord = LastRunRecord::finder()->find(' uid = ?' , array(  $thread->reference_id  ) );
						
					if( empty( $lastrunRecord->question_id ) ) {

						$trainingfiles = TrainingFilesRecord::finder()->find('lesson_id = ? ',$lastrunRecord->video_id);

					}else{
						
						$trainingfiles = TrainingFilesRecord::finder()->find('question_id = ? ',$lastrunRecord->question_id);
						
					}
						
					if( count( $trainingfiles ) > 0 ){

						$trainingfiles = true;
						 
					}else {
						$trainingfiles = false;
					}
					 

				}

				// It will return the number of post for the thread having content size more then 50kb.
				
				$threadPosts = ThreadPostRecord::finder()->findAll( 'thread_id = ? AND LENGTH(content) > 51200 ' , array( $thread->uid ) );
				$thread->largeFile = count($threadPosts);			
				$thread->reference = $thread->reference;
				$thread->link = $thread->reference->name;
				$thread->chaptername = $thread->reference->chaptername;
				$creatorName = UserRecord::finder()->find('Uid = ?',$thread->created_user_id);
				$thread->authorName = ($creatorName->Name ? $creatorName->Name : $creatorName->Username);
				$thread->image  = $creatorName->photo;
				$threadUsers = ThreadUserRecord::finder()->findAll('thread_id = ? ' , array($thread->uid ));
				$thread->views = 0;

				foreach ( $threadUsers as $userThread ) {

					$thread->views = $thread->views + $userThread->noofposts;
				}

				$threadUser = ThreadUserRecord::finder()->find(' user_id =? AND thread_id = ? ' , array( $user->Uid,$thread->uid ));

				$thread->postCount= $postsByUser;
				$thread->creatorPostCount= $postsByThreadCreator;
				$thread->unread_Post_Count =$threadUser->unread_Post_Count;
				$updateUser = $thread->lastUpdateUser;
				$thread->lastUpdateUser = ($updateUser->Name ? $updateUser->Name : $updateUser->Username);
//				$last_update = date('m/d/y H:i:s', strtotime($thread->last_update));
//				$thread->last_update = $last_update;
				
				// Here we are converting the server time to Local time and sending it to front end.
				$serverTimezone = Prado::getApplication()->getGlobalState("serverTimezone"); 
				$currentTimezone = Prado::getApplication()->getGlobalState("currentTimezone");
//				$thread->last_update = $this->convertFromOneTimeToAnother($thread->last_update, $serverTimezone, $currentTimezone );
				$thread->last_update = $this->convertDateTimeZone($thread->last_update, $currentTimezone );
				$thread->content_id = $thread->content_id;
				$thread->trainingfiles = $trainingfiles;
				
				$retVals[]=$thread;
				return $thread;
//			}
	}
	
	
	/**
	 * 2014070937
	 * This method is used to Create Business Events Entry for the Tasks 
	 * When a Task is created Or Updated If the Status of the task is changed then we are 
	 * registering this event in Business Events table.
	 * @param unknown_type $course_instance_id
	 * @param unknown_type $course_id
	 * @param unknown_type $student_id
	 * @param unknown_type $task_status_id
	 * @param unknown_type $thread_id
	 */
	public function createTaskDetailBusinessEvent($course_instance_id , $course_id , $student_id , $task_status_id,$thread_id){
		$taskDetails =  array();
		$taskDetails['product_id']	 	= $course_instance_id;
		$taskDetails['course_id']	 	= $course_id;
		$taskDetails['student_id']	 	= $student_id;
		$taskDetails['thread_id']	 	= $thread_id;
		$taskDetails['task_status_id']	= $task_status_id;
		$taskStatus = json_encode($taskDetails);
		if($taskStatus){
			$businessEvent = new BusinessEventsRecord();
			$businessEvent->createEventsRecord(BusinessEventsRecord::$TASK_CREATE_UPDATE, $taskStatus);
		}
	}

	/**
	 * 
	 * @remotable 
	 * 
	 * Code for registering the business event for with the course progress.
	 * @param unknown_type $progress
	 */
	public function registerBusinessEventForCourseProgress($progress){
		$user = Prado::getApplication()->getUser();
		$courseProgressArray = array();
		$courseProgressArray['product_id'] = $user->getProductID();
		$courseProgressArray['course_id'] = $user->ContentID;
		$courseProgressArray['progress'] = (string)$progress;
		$courseProgressDetails = json_encode($courseProgressArray);
		if($courseProgressDetails){
			$businessEvent = new BusinessEventsRecord();
			$businessEvent->createEventsRecord(BusinessEventsRecord::$COURSE_PROGRESS, $courseProgressDetails);
		}
	}
}