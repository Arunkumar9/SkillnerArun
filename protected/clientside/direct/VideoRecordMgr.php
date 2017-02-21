<?php
/**
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23099		Arunkumar.muddada		201310280458    Modified :createCourseInstanceBlocks($data)
 *  														It is not considering the end time of the last chapter
 *  23099       Arunkumar.muddada       201311010112    Modified : getRecordChapters($params=array())
 *  														Code related to stop value of one chapter should be start value of another chapter (Not Markser)
 *  23192        Dinesh GK    			20131114210		When user recalculate quiz summary (i.e. he has failed the quiz and he is again recalculating without resetting the quiz as it can happen in scenario 7):
 *														We just need to recalculate quiz summary and consider that as an additional attempt
 * 	23133		PhaniKiran.Guttha       20131610		Send the start time of every chapter as marker in the getRecordChapters
 * 
 *  23171 		Dinesh GK				20131118750     Evaluation the numeric questions using numericQuestionEvaluation function in saveQuizAnswer.
 *  23171		Dinesh GK				201311221110	Preventing the range,special char  type of answers in numeric Question Evaluation.
 *  23333		Tapaswini Sabat  		201311221251	Now HeatMap logic is changed as per the requirement.  
 *  23689		Dinesh GK 				201311223		Search function in the main player menu searches through:
 *  													script of chapters uploaded in the definition of the lesson in CMS(transcript),names of chapters (not lessons) and quiz names.
 *  23171		Tapaswini Sabat  		201311251602	Now HeatMap logic is changed as per the requirement.
 *  23787		Dinesh GK				20131127330		Modifiction :getRecordChapters method instructionsExists variable is declared, If it is not declared it carry away with exist value.
 *  														
 *  27395       Arunkumar.muddada    	2014070937		MODIFIED :  getQuizSummary
 *  														This Method call will create business events table entry with the latest score updates related to quiz
 *  													ADDED :createQuizScoreBusinessEvent
 *  														This method is used to Create Business Events Entry for the Tasks
 *  														When ever user clicked on the summary tab then we are going to calculate the quiz score and
 *  														we will capture the Quiz Score calculation Event and register in to Business Events Table
 *  													MODIFIED :  saveQuizAnswer
 *  														If user selected this answer or the value is already selected then the
 *  														$a[1] will be 1 so we need to validate that value is matching the Quiz_Answers Good Value.
 *  														if the 1==1 then 1 other wise 0 (means if selected value answer or one of the answers then 1 other wise 0 )
 *  														if we haven't selected anythig then we need not to validate that will be always 0
 *  
 *  														we calling method  "calculateQuizAnswerAttemptFailureCount"
 *  														Calling this method will create a business events record if the user failed in attempting this quiz question
 *  													ADDED METHOD : calculateQuizAnswerAttemptFailureCount
 *  														This method is Used for the finding the Quiz Question is Attempted Correctly or wrong
 *  													ADDED METHOD : createQuizAnswerAttemptBusinessEvent
 *  														When ever system recognizes there is an failure quiz question attempt then this method will be invoked  
 * 27395        Arunkumar.muddada    	201405120412    Modified Code To Support When a Quiz Summary Button is 
 * 															clicked then only we will calculate Quiz Question related results.
 * 														"Regardless of whether a question is answered incorrectly, or not answered at all, consider both 
 * 														 scenarios as a new failure count to answer question."
 * 27669        Arunkumar.muddada       201405140925    Modified Method : createQuizScoreBusinessEvent
 * 															removed string casting as it is not required
 * 27270		Arunkumar.muddada       2014051700230   ADDED : courseDetailsInfoUpdateToAvalton
 * 															This method is useful to update the course content information to the avalton
 * 27648		Arunkumar.muddada		201405221253    Modified :createCourseInstanceBlocks($data)
 *  														It is not considering the end time of the last chapter
 * 27648        Arunkumar.muddada       201405221254    Modified : getRecordChapters($params=array())
 *  														Code related to stop value of one chapter should be start value of another chapter (Not Markser)\
 * 28044        Arunkumar.muddada       201406110909    Modified : getRecordChapters : Added buttonposition into hiddenchaptes array of the chapter
 * 
 * 28044        Arunkumar.muddada       201406160918    Modified : getRecordChapters : Now we have a possibility that we have hidden chapters at the end of the 
													     	Lesson so for each non hiddne chapters we need to check for is that is last chapters
													     	by validateing is there any post chaptes which are not hidden
 * 27665        Arunkumar.muddada         201406210404   Modified :  getQuizSummary
 															Removed the "Summary of quiz for" header and "Answered questions:" text is made as the header.
 *
 * 27666        Arunkumar.muddada         201312270330   Added : deleteQuizAnswer : Code to delete the Quiz answer results relate to the given answers list
 * 
 * 27666        Dinesh GK			      201407010546   Added : new method getLessonCompletedStatus : This method is used to find selected lesson completed status.
 * 
 * 28950		Dinesh.GK			 	  201407031055   Modified :getRecordChapters() lesson settings related code is modified
 *
 * 28961		Dinesh GK				  201407070707	 Modified: getQuiz() summary tab is changed.
 * 29071		Dinesh GK				  201407290710	 Modified: numericQuestionEvaluation method is changed as per the request,saveQuizAnswer for "Value for range" also handling.
 */
Prado::using('FreshSystem.3rdparty.curl');

Prado::using('Application.clientside.direct.CommentRecordMgr');
Prado::using('Application.clientside.direct.CollaborationToolMgr');
use Aws\S3\S3Client;
use Aws\Common\Enum\Size;
use Aws\Common\Exception\MultipartUploadException;
use Aws\S3\Model\MultipartUpload\UploadBuilder;
use Guzzle\Http\EntityBody;

class VideoRecordMgr extends TComponent {


    /**
     * @remotable
     *
     */

    public function testLesson($api,$params) {
		SWPLogManager::log("from testLesson",array("api"=>$api, "params"=>$params),TLogger::INFO,$this,"testLesson","SWP");
	    $c = new curl('http://api.swp.freshsystems.cz/1.0/login') ;
        $c->setopt(CURLOPT_FOLLOWLOCATION, true) ;
        $c->setopt(CURLOPT_POST, true) ;
        $c->setopt(CURLOPT_USERPWD, "jindra:nvk2011N");
        $c->setopt(CURLOPT_POSTFIELDS, array(
									'username'=>'avalton',
									'password'=>'vltn2011A'
									)
			    );

        $o = $c->exec();
        $res = json_decode($o,true);
	   $params['SSID'] = $res['SSID'];
	   //return $params;
	   $c = new curl('http://api.swp.freshsystems.cz/1.0/'.$api) ;
        $c->setopt(CURLOPT_FOLLOWLOCATION, true) ;
        $c->setopt(CURLOPT_POST, true) ;
        $c->setopt(CURLOPT_USERPWD, "jindra:nvk2011N");
        $c->setopt(CURLOPT_POSTFIELDS, $params );

        $o = $c->exec();

        if ($err = $c->hasError()) {
        	SWPLogManager::log("Some error occured",array("curlobject"=>$c, "params"=>$params),TLogger::ERROR,$this,"testLesson","SWP");
		 	return $params;
            //throw new THttpException($c->m_status['errno'], $params);
        }
		SWPLogManager::log("Curl creation succesful",array("curldata"=>json_decode($o,true)),TLogger::INFO,$this,"testLesson","SWP");
        return json_decode($o,true);
	
	
    }

    /**
     * @remotable
     *
     */
    public function getSmilling($v) {
       SWPLogManager::log("It will generate smil file",array("param"=>$v),TLogger::INFO,$this,"getSmilling","SWP");
	   ini_set('max_execution_time',0);
	   $recs = LessonRecord::finder()->findAll('type=0 AND images  like "%mp4%" ');
	   $res = array(); //return count($recs);
	   foreach($recs as $r) {
		  if (is_file($r->cool_url)) unlink($r->cool_url);
		  $res[$r->content_id] = $r->generateSmil(true);
	   }
	   SWPLogManager::log("smil file generation succesful",array("result"=>$res),TLogger::INFO,$this,"getSmilling","SWP");
	   return $res;
    }
    /**
     * @remotable
     *
     */

    public function avalton($api,$params,$ssid=null) {
		SWPLogManager::log("Enter to Avalton method",array("api"=>$api, "params"=>$params, "ssid"=>$ssid) ,TLogger::INFO,$this,"avalton","SWP");
	    return self::apiAvalton($api,$params,$ssid);

    }
    
    /**
     * @remotable
     *
     */

    public function logTransferAvalton($usage,$tt,$progress , $chapter,$videoId,$seekValue,$questionInd,$language) {

    	// log the last run details irrespective of the usage details
    	$this->logLastRun( $chapter,$videoId,$seekValue,$questionInd ,$language);
    	$user = Prado::getApplication()->getUser();
    	// usage will be passed as -1 if user is viewing the quize. so do not call the apiAvalton function
    	//Added new change to the above Comment.
    	//Now We need to send the progress even when quiz is opened.
    	if( $usage == -1 ){
    		$usage = 0;
	    	$rows = array(
			  	'last_played'=>time(),
			  	'used_transfer'=>$usage/1024,
			  	'product_id'=>$user->getProductID(),
			  	'action'=>'play',
			  	'progress'=>$progress
	    	);

    		$res1 = self::apiAvalton('products.php',array('rows' => json_encode($rows)),$res['SSID']);
			
    		$userRecord = UserRecord::finder()->find('Uid = ?', array($user->Uid));
    		$userRoles = $userRecord->getExtractedRoles();
    		
    		return array($res1);
    	}else{
    		$rows = array(
		  'user_id'=>$user->username,
		  'usage_date'=>time(),
		  'used_transfer'=>$usage/1024,
		  'transfer_type'=>$tt
    		);
    		$res = self::apiAvalton('transfer_usage.php',array('rows' => json_encode($rows)));

    		if ($tt=='creator') return array($res);


    		$rows = array(
		  'last_played'=>time(),
		  'used_transfer'=>$usage/1024,
		  'product_id'=>$user->getProductID(),
		  'action'=>'play',
		  'progress'=>$progress
    		);

    		$res1 = self::apiAvalton('products.php',array('rows' => json_encode($rows)),$res['SSID']);
			
    		$userRecord = UserRecord::finder()->find('Uid = ?', array($user->Uid));
    		$userRoles = $userRecord->getExtractedRoles();
    		return array($res,$res1);
    	}

    }
    
	/**
     * @remotable
     * 201311221251
     * This method is mainly taking care of find the block related record from the block value
     * and incrementing the block value, incremented by 1.
     * 
     */
    public function increaseBlockCount ($videoId,$blockValue ){
    	 
    	$user = Prado::getApplication()->getUser();
    	$userRecord = UserRecord::finder()->find('Uid = ?', array($user->Uid));
    	$userRoles = $userRecord->getExtractedRoles();

    	if(  $videoId && $user->getProductID() && $blockValue && in_array('3', $userRoles['all']) ) {

    		$productTimeBlocksRecords = ProductTimeBlocksRecord::finder()->findAll('product_id = ? and video_id=?',array($user->getProductID(),$videoId));
    		$productTimeBlocksRecord = $productTimeBlocksRecords[$blockValue-1];
    		
    		if($productTimeBlocksRecord) {
    			
    			$productTimeBlocksRecord->blockcount = $productTimeBlocksRecord->blockcount + 1;
    			$productTimeBlocksRecord->save();
    		}
    	}
    }
    public static function apiAvalton($api,$params,$ssid=null) {
	
    	SWPLogManager::log("Coming To Api avalton",array("api"=>$api, "params"=>$params, "ssid"=>$ssid) ,TLogger::INFO,$this,"apiAvalton","SWP");
	   //if ( Prado::getApplication->getParameters().itemAt('noAvalton') == 'true' ) {
	   if ( Prado::getApplication()->Parameters['noAvalton'] == 'true' ) {
	       /**
		   * In case you don't intend to make call to Avalton APIs then don't proceed with the call.
		   */
	   	 	$id = rand(50000, 500000);
	   		return array(
				"data"=>array("id"=>$id)
				);
//	       return array('success'=>true);
	   }
	
	   if (!$ssid) {
		  //$c = new curl('http://66.176.210.35/feaeasy/api/login.php') ;
		  $c = new curl('http://api.bss.skillner.com/login.php') ;
		  $c->setopt(CURLOPT_FOLLOWLOCATION, true) ;
		  $c->setopt(CURLOPT_POST, true) ;
		  //$c->setopt(CURLOPT_USERPWD, "jindra:nvk2011N");
		  $c->setopt(CURLOPT_POSTFIELDS, array(
									    'login'=>'freshsystems',
									    'pass'=>'frshms123'
									    )
				   );
    
		  $o = $c->exec();
		  $res = json_decode($o,true);
		  $ssid  = $res['SSID'];
		  SWPLogManager::log("AS session id was not there so created new session",array("ssid"=>$ssid) ,TLogger::DEBUG,$this,"apiAvalton","SWP");
	   }
	   $params['SSID'] =  $ssid;
//return $params;
//	   $c = new curl('http://66.176.210.35/feaeasy/api/'.$api) ;
	   $c = new curl('http://api.bss.skillner.com/'.$api) ;
        //$c->setopt(CURLOPT_FOLLOWLOCATION, true) ;
        $c->setopt(CURLOPT_POST, true) ;
        //$c->setopt(CURLOPT_USERPWD, "jindra:nvk2011N");
        $c->setopt(CURLOPT_POSTFIELDS, $params );

        $o = $c->exec();
	   $o = trim($o,'()');
	   //return $o;
        if ($err = $c->hasError()) {
        	
        	SWPLogManager::log("Some error occured",array("curlobject"=>$c, "params"=>$params),TLogger::ERROR,$this,"apiAvalton","SWP");
		 	return $params;
            //throw new THttpException($c->m_status['errno'], $params);
        }
		SWPLogManager::log("api avalton succesful",array("curldata"=>json_decode($o,true)),TLogger::INFO,$this,"apiAvalton","SWP");
        return json_decode($o,true);
		
    }

    /**
     * @remotable
     *
     */
    public function getPlayerUrl($content_id,$product_id=0,$user_id="",$instructor_id="",$student_id="") {
	   
    	SWPLogManager::log("It should return the video player url",array("content_id"=>$content_id, "product_id"=>$product_id, "user_id"=>$user_id,
		"instructor_id"=>$instructor_id, "student_id"=>$student_id),TLogger::INFO,$this,"getPlayerUrl","SWP");
    	if( $user_id == "" ){
    		$user_id = Prado::getApplication()->getUser()->Username;
    		$student_id =  Prado::getApplication()->getUser()->Username;
    	}
	   $aurl = new ActiveUrlRecord;
	   $url = $aurl->generateContentUrl(array(
		  'user_id'=>$user_id,
		  'content_id'=>$content_id,
		  'product_id'=>$product_id,
	   		'instructor_id'=>$instructor_id,
	   		'student_id'=>$student_id
	   ));
	   SWPLogManager::log("The folowing is returned by the method",array("url"=>$url),TLogger::INFO,$this,"getPlayerUrl","SWP");
	   return $url;
	   
    }

    /**
     * @remotable
     *
     */

    public function saveRecord($params) {
	SWPLogManager::log("It should save the record passed as parameter",array("params"=>$params),TLogger::INFO,$this,"saveRecord","SWP");
	$i = 0;
	$uid = $params['uid'];
	if ($uid) $params = array($params);
	foreach ($params as $p) {
	    $uid = $p['uid'];
	    unset($p['uid']);
	    $uids[] = $uid;
	    $i =+ VideoRecord::finder()->updateByPk($p,$uid);
	}
	
	$result = VideoRecord::finder()->findAllByPks($uids);
	SWPLogManager::log("Record saved/updated succesfully for the id",array("result"=>$result),TLogger::INFO,$this,"saveRecord","SWP");
	return $result;
	
    
    }

    /**
     * @remotable
     *
     */
    public function destroyRecord($params) {
	SWPLogManager::log("It should delete the record passed as parameter",array("params"=>$params),TLogger::INFO,$this,"destroyRecord","SWP");
	$uid = $params['uid'];
	if ($uid) $params = array($params);
	foreach($params as $p) $uids[] = $p['uid'];
	
    	$result = (VideoRecord::finder()->deleteByPk($uids)) ? $params : false;
    	
		SWPLogManager::log("Record deletion status",array("result"=>$result),TLogger::INFO,$this,"destroyRecord","SWP");
		return $result;
    
    }

    /**
     * @remotable
     *
     */
    public function newRecord($params) {

	unset($params['uid']);	
	SWPLogManager::log("It should create a new record into DB",array("params"=>$params),TLogger::INFO,$this,"newRecord","SWP");
	$cr = new VideoRecord($params);
	$cr->save();
	$params['uid'] = $cr->content_id;
	SWPLogManager::log("Record creation status",array("result"=>$cr),TLogger::INFO,$this,"newRecord","SWP");
	return $cr;
    }

    /**
     * @remotable
     *
     */
    public function getRecordChapters($params=array()) {
    		 SWPLogManager::log("It should retiurn all the chapter(lesson/quiz) of the course",array("params"=>$params),TLogger::INFO,$this,"getRecordChapters","SWP");
    		 $uid = $params['id'];
			 $user = Prado::getApplication()->getUser();
			 $pid = $user->getProductID();
			 $cid = $user->getContentID();
    		 $collabortionToolmgr = new  CollaborationToolMgr();
             $collabortionToolmgr->InitializeVideoPlayer(null);
			 //This part of the code for the course time bloks 
			 if($pid && $cid) {
			 	$data = array("product_id"=>$pid,"content_id"=>$cid);
			 	 $productTimeBlocksRecord = ProductTimeBlocksRecord::finder()->findAll('product_id = ?',$pid);
			 	 if(! count($productTimeBlocksRecord)) {
			 	 	$this->createCourseInstanceBlocks($data);
			 	 }
			 }
			 
   			$studentId = $user->getStudentID();
			$otherUserId = 0;
			if($user->Uid == $studentId ){
				$otherUserId = $user->getInstructorID() ? $user->getInstructorID() : null;
			} else {
				$otherUserId = $studentId;
			}
			 $course = CourseRecord::finder()->withCc('(1=1) ORDER BY ordering')->find('content_id = ?',array($user->getContentID()));
			 $taskStatusData = CollaborationToolMgr::getTaskStatus();
			 foreach($taskStatusData as $statusRecord){
			 	
			   if($statusRecord['FinalStatus'] == "True"){
			    
			     $statusCode = intval($statusRecord['ID']);
			     
			   }
			 }
			 $coursedefaultstatus = '-1';
			 $cc = $course->cc;
			 $all = array();
			 
			 //This array will hold the quiz id of the quizes which are having option 
			 //lock subsequent lesson option true
			 $subsequentArray = array();
			 
			 $counts = 0;
			 $settingsRec = UserSettingsRecord::finder()->find('`key`= "Chapter Based Playback" AND user_id= ? ',array($user->Uid));
			
				 foreach($cc as $c) {
				 	  $instructionsExists = false ; //20131127330
				      $last=null;
				      $taskId = null;
					  $v  = $c->content;
					  // retrive the captions of the video
					  $captions = VideoCaptionsRecord::finder()->findAll('video_id = ? ' , $v->content_id );
					  $statusCls = null;
					  $statusTooltip = null;
					  
					  //this array will hold only the lesson related information
                      $subsequentLessonIds = array();
                      
                      
                      //getting all the records which are having this content as locked item.
					  //That means lessons which are having this content as locked item.
				  	  $lessonSettingRecs = ProductLessonSettingRecord::finder()->findAll('course_id = ? AND content_id = ? AND setting_value =1',array( $user->getContentID(), $v->content_id ) );
				  		
				  	  /*
				  	   * Loop though all lesson settings records( subsequent lessons/quizzes ) 
				  	   * and those lessons/quizzes video_ids push into on array ($subsequentcontentIds)
				  	   */
				  	   foreach ( $lessonSettingRecs as $lessonSettingRec ){
				  	   	    $lessonVideo_id = $lessonSettingRec->lesson_id;
				  	   		//Here caliculating the lesson completed status based on lesson settings.
				  			$lessonCompletedStatus = $this->getLessonCompletedStatus( $lessonVideo_id, $pid );
				  			if(!$lessonCompletedStatus){
				  				array_push( $subsequentLessonIds, $lessonVideo_id );
				  			}
				  	   }
                      
					  
					  if ( $v->type == 1 ){
					  	 /*For quiz we need to seee is the quiz is opted for lock the subsequent content.
					  	  if it is opted for the option then checking is that quiz is passed if not passed.
					  	  then we are putting that quiz value into the array which is at course level.
					  	  and this array we are sending to the front end through 'quizRequiredToPass'
					  	 */
						  $quizSettingRec = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ?',$cid.'|'.$v->content_id);
						  $scoresRecord = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$v->content_id );
						  
						  if( $quizSettingRec->required_subsequent && !$scoresRecord->passed ){
						  		array_push( $subsequentArray, $v->content_id );
						  }
					  }
						
						$requiredsubsequentArray = array();
			  			if( count( $subsequentArray )){
						    	$requiredsubsequentArray = $subsequentArray;
						 		//Here we are taking the value into a temporary array and we are 
						 		//removing that value from the array as we are in the quiz now for that quiz 
						 		//we should not pass quizRequiredToPass value of this quiz.
						    	$findKey = array_search($v->content_id,$requiredsubsequentArray);
						    	if( gettype($findKey) == 'integer' ){
						    		unset($requiredsubsequentArray[$findKey]);
						    	}
						}
						/**
						 * Here merging the lesson and quiz settings into one array ($subsequentContents) //201407031055
						 */
						$subsequentContents = array();
						if(!empty($subsequentLessonIds)){
							for($i = 0 ; $i < count($subsequentLessonIds) ; $i++){								
								array_push($subsequentContents,$subsequentLessonIds[$i]);
							}
						}
						
				 		if(!empty($requiredsubsequentArray)){
							for($j = 0 ; $j < count($requiredsubsequentArray) ; $j++){								
								array_push($subsequentContents,$requiredsubsequentArray[$j]);
							}
						}
						//$subsequentContents = array_merge($lessonSubsequents,$requiredsubsequentArray);
						//var_dump($v->content_id);
						//var_dump($subsequentContents);
					  if ( $v->type==0 ) {
					  	   $lessonComplStatus = $this->getLessonCompletedStatus( $v->content_id, $pid );
					  	   $otherPartyUpdated = false;
						   $chapters = CuepointRecord::finder()->findAll('videos_id = ? ORDER BY start',$v->content_id);
						   $taskStatus = -1;
						   $unreadLCount = 0;
						   
						   $LReference = LastRunRecord::finder()->find( 'video_id = ?  AND question_id IS ? AND product_id = ? AND content_id = ? AND subject = ? ', array($v->content_id,null,$pid,$cid,'taskref') );
						   $LTraingFiles = TrainingFilesRecord::finder()->count('lesson_id = ? AND product_id =? ',array($v->content_id ,$user->ProductID) );
						   $trainingFilesExits = ($LTraingFiles > 0 ) ? true : false;
						   if( count( $LReference ) > 0 ){
						   	
						         $LThreadRecord = ThreadRecord::finder()->find('reference_id = ?',$LReference->uid);
						         $LThreadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $LThreadRecord->uid,$user->Uid) );
						         if($LThreadRecord->last_update_user_id == $otherUserId && $LThreadRecord->status != $statusCode){
						         	$otherPartyUpdated = true;
						         }
						         $taskStatus = $LThreadRecord->status;
						         $taskId = $LThreadRecord->uid;
						        
							     if( $LThreadUser->unread_Post_Count > 0 ){
							      
							      		$unreadLCount = 1; 
							     } else {
							     	
										$unreadLCount = 0; 
								 }
						    }
						    
						    if( $taskStatus != -1 ){
						    	
						    	$instructionsExists = false;
						    	$trainingFilesExits = false;
						    	$currentStatusRec = null;
							    foreach( $taskStatusData as $statusRecord ) {
				 	
				  					 if($statusRecord['ID'] == $taskStatus){
				    					 $currentStatusRec = $statusRecord;
			   						}
								 }
						    	$statusTooltip = $currentStatusRec['lessontooltip'];
						    	$statusCls = $currentStatusRec['Cls'] ."-".$taskStatus;
						    	
						    } if(( $v->instructions  && $v->instructions != '<br>' ) || $LTraingFiles > 0 ) {
						    	$instructionsExists = true;
						    	
 						    	if($LTraingFiles > 0){
						    		$trainingFilesExits = true;
 						    	}
						    }
						    
						   for($j=0; $j < count( $chapters ) ;$j++) {
						   		$ch = $chapters[$j];
								if( $ch->ishidden ==1  || $ch->ishidden ){
									continue;
								}
						   		$td = TrackingDataRecord::finder()->find('product_id = ? AND subject="1" AND content_id = ?',array($user->getProductID(),$ch->uid));
							    if ($last !== null) {
							     $res['children'][$last]['stop'] = $ch->start;
							    }
							    $last = $ch;
							    $child = array();
							    $marker = array();
							    
							    // 20131610 send the start time as markers in chapters start time
							    $marker[] = $chapters[$j]->start ;
						   		$hiddenChaptersList = array();
						   		$l =$j+1;
						   		$foundHiddenChapaters = false;
						   		while( $chapters[$l]->ishidden == 1 || $chapters[$l]->ishidden ){
						   			$hiddenChapterList = array();
						   			$hiddenChapter = $chapters[$l];
						   			$hiddenChapterList['chapterId'] = $hiddenChapter->uid;
						   			$hiddenChapterList['start'] = $hiddenChapter->start;
						   			//201406110909
						   			$hiddenChapterList['buttonposition'] = $hiddenChapter->buttonposition;
						   			//201311010112 , 201405221254
						   			//Taking Hidden chapter Stop time also into consideration to find the next chpater start time when
						   			//we place that value in to current chpater stop
						   			//$hiddenChapterList['end'] = $hiddenChapter->stop;
						   			if(!empty($chapters[$l+1])) {
						   				$hiddenChapterList['end'] = $chapters[$l+1]->start;
						   			} 
						   			
						   			$hiddenChaptersList[] = $hiddenChapterList;
						   			$l =$l +1;
						   			$foundHiddenChapaters= true;
						   		}
						   		if( $foundHiddenChapaters && !empty($chapters[$j+1]) ){
						   			$child['hiddenChapters'] = $hiddenChaptersList;
						   			$child['cuepointnotregistered'] = true;
						   			//201311010112 , 201405221254
						   			//If Hidden chpter do not have end time then it will give max value if 
						   			//it has value means it should be next chapter start value
						   			$stopVal = $hiddenChaptersList[count($hiddenChaptersList) - 1]['end'];
						   			$child['stop'] = $stopVal ? $stopVal : 100000000000; 
						   		}else if( !empty($chapters[$j+1]) ){
						   			$child['stop'] = $chapters[$j+1]->start;
						   		}
					   		 
							    $child['url'] = $v->getFirstVideo();
							    $child['lesson'] = $v->name;
							    $child['name'] = $ch->description;
							    $child['transcript'] = $ch->description.' '.$ch->transcript; //201311223
							    $child['seen'] = ($td) ? $td->subject : false;
							    $child['start'] = $ch->start;
//							    $child['stop'] = $ch->stop;
							    $child['ordering'] = sprintf('%1$04d',$c->ordering).'-'.$v->name;
							    $child['iconCls'] = 'film';
							    $child['uid'] = 'L'.$v->content_id.'_'.$ch->uid;
							    $child['video_id'] = 'L'.$v->content_id;
							    $child['skippable'] = $ch->skippable;
							    $child['captions'] =$captions;
							    $child['instructions'] = $instructionsExists;
							    $child['trainingfiles'] = $trainingFilesExits;
							    $child['taskStatus'] = intval($taskStatus);
							    $child['otherPartyUpdated'] = $otherPartyUpdated;
							    $child['taskId'] = $taskId ;
							    $child['unreadCount'] = $unreadLCount;
							    $child['reference_id'] = $LReference->uid;
							    $child['statusCls'] = $statusCls;
							    $child['statusTooltip'] = $statusTooltip;
							    $child['quizRequiredToPass'] = (array)$subsequentContents; //201407031055
							    $child['chapterplaybackpause'] = $v->chapterplaybackpause;
						     	$child['marker'] = $marker;
						     	$child['lessonCompletedStatus'] = $lessonComplStatus;
							   		
						     	//201406160918
						     	//Now we have a possibility that we have hidden chapters at the end of the 
						     	//Lesson so for each non hiddne chapters we need to check for is that is last chapters
						     	//by validateing is there any post chaptes which are not hidden 
					   			if(!empty($chapters[$j+1])){
									for($hid=$j+1 ; $hid<count( $chapters ) ; $hid++){
										if(! (($chapters[$hid]->ishidden == 1 || $chapters[$hid]->ishidden))) {
								   			$child['lastChapter'] = false;
								   			break;
								   		} else{
								   			$child['lastChapter'] = true;
								   		}
									}
								} else {
									$child['lastChapter'] = true;
								}
							    $all[] = $child;
						   }
						   if (empty($chapters)) {
						    
							    $child = array();
							    $child['url'] = "http://web28.streamhoster.com/jnovak/".$v->user_id.'/V'.$v->content_id.'.smil.xml';
							    $child['lesson'] = $v->name;
							    $child['name'] = 'no chapters';
							    $child['transcript'] = '';
							    $child['start'] = 0;
							    $child['seen'] = true;
							    $child['stop'] = 100000000000;
							    $child['ordering'] = sprintf('%1$04d',$c->ordering).'-'.$v->name;
							    $child['iconCls'] = 'film';
							    $child['uid'] = 'L'.$v->content_id.'_0';
							    $child['video_id'] = 'L'.$v->content_id;
							    $child['captions'] =$captions;
							    $child['instructions'] = $instructionsExists;
							    $child['trainingfiles'] = $trainingFilesExits;
							    $child['taskStatus'] = intval($taskStatus);
							    $child['otherPartyUpdated'] = $otherPartyUpdated;
							    $child['taskId'] = $taskId ;
							    $child['unreadCount'] = $unreadLCount;
							    $child['reference_id'] = $LReference->uid;
							    $child['statusCls'] = $statusCls;
							    $child['statusTooltip'] = $statusTooltip;
							    $child['quizRequiredToPass'] = (array)$subsequentContents; //201407031055
							    $child['lessonCompletedStatus'] = $lessonComplStatus;
							    $all[] = $child;
						    
						   }
						   if ($last) $all[count($all)-1]['stop'] = 10000000000000;
						   
					  }
					  elseif ($v->type==1) {
					  	
						   $child = array();
						   $quizGroupStatus = $defaultstatus = '-1';
						   $unreadQCount = 0;
						   $questions = QuizRecord::finder()->findAll('parent_id = ? ',$v->content_id);
						   $updtedFromOtherUser = false;
						   foreach( $questions as $question ){
						    
						    	$QReference = LastRunRecord::finder()->find('video_id = ?  AND question_id = ? AND product_id = ? AND content_id = ? AND subject ="taskref" ',$v->content_id,$question->uid,$pid,$cid);
						    	if( count ( $QReference ) > 0 ){
							        $QThreadRecord = ThreadRecord::finder()->find('reference_id = ?',$QReference->uid);
							        $QThreadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $QThreadRecord->uid,$user->Uid) );
							        if( $QThreadUser->unread_Post_Count > 0 ){
							         	$unreadQCount = $unreadQCount+1;
							        }
							        if(!$updtedFromOtherUser ){
							    		if( $QThreadRecord->last_update_user_id == $otherUserId && $QThreadRecord->status != $statusCode){
									    		$defaultstatus = $quizGroupStatus = 4;
									    		$updtedFromOtherUser = true;
									    }
									    if(!$updtedFromOtherUser ){
									    
									    	if ( $defaultstatus == -1 ) {
									    		$defaultstatus = $statusCode;
									    	}
										    if( $QThreadRecord->status < $defaultstatus) {
										         $defaultstatus = $QThreadRecord->status;
										         $taskId = $QThreadRecord->uid;
									        }
									    }
							        }
						    	}
						   }
					 		if( $defaultstatus != -1 ) {
								if( !$updtedFromOtherUser && $defaultstatus == '4' && $otherUserId == prado::getApplication()->getUser()->getStudentId()){
					    			$quizGroupStatus = 5;
					    		} elseif( !$updtedFromOtherUser ) {
					    			$quizGroupStatus = $defaultstatus;
					    		}
						    	$instructionsExists = false;
						    	$trainingFilesExits = false;
						    	$currentStatusRec = 0;
							    foreach($taskStatusData as $statusRecord){
				 	
				  					 if($statusRecord['ID'] == $defaultstatus){
				    					 $currentStatusRec = $statusRecord;
				   					 }
				   					 if($statusRecord['ID'] == $quizGroupStatus){
				   							$statusCls = $statusRecord['Cls'] ."-".$quizGroupStatus;
				   						}
									 }
						    	$statusTooltip = $currentStatusRec['quiztooltip'];
						    	
						    }else if( ( $v->instructions  && $v->instructions != '<br>' ) ) {
						    	$instructionsExists = true;
						    	$trainingFilesExits = false;
						    	$unreadQCount = 0;
						    	
						    }
						    
						    if(count($questions) > 0 ){
						    
							   $td = TrackingDataRecord::finder()->find('product_id = ? AND subject="1" AND content_id = ?', array($user->getProductID(), $v->content_id ) );
						    } else {
						    	// If the quiz does not contains any question then we are marking the
						    	// Quiz as closed one.
						    	$td = true;
						    }
						   
					  	   $lessonsToPass = array();
						   $markUnviewed = array();
					  	   $productLessonSubsequents = ProductLessonSettingRecord::finder()->findAll('course_id = ? AND content_id = ? AND setting_value = 1 ',
			                                              array($cid ,$v->content_id ));
						   if(count($productLessonSubsequents) > 0){
								foreach( $productLessonSubsequents as $productLessonSubsequent ) {
									//array_push($lessonsToPass , $productLessonSubsequent->lesson_id);
									//Commented as we don't require this to stop the quiz to load.
									//As we have lesson settings window there we are configuring the locked content.
								}
						   }
						   
						   
						   $quizSettingAssociationRec = ProductQuizLessonAssociationRecord::finder()->findAll('quiz_settings_id = ? ',$quizSettingRec->uid);
						  
						   foreach ( $quizSettingAssociationRec as $associationRecord ){
						    	if( $associationRecord->markunviewed ){
						    		array_push($markUnviewed, $associationRecord->lesson_id);
						    	}
						   }
						   
						   $quizStatus = $this->evaluateQuizTrackSeen( $v->content_id, true, true );
							
						   $child['url'] = $v->getFirstVideo();
						   $child['lesson'] = $v->name;
						   $child['seen'] = ($td) ? $td->subject : false;
						   $child['name'] = 'open quiz';
						   $child['ordering'] = sprintf('%1$04d',$c->ordering).'-'.$v->name;
						   $child['start'] = 0;
						   $child['transcript'] = $v->name; //201311223
						   $child['iconCls'] = 'quiz';
						   $child['extension'] = 'txt2';
						   $child['uid'] = 'Q'.$v->content_id.'_'.$v->uid;
						   $child['quiz_id'] = 'Q'.$v->content_id;
						   $child['video_id'] = 'Q'.$v->content_id;
						   $child['captions'] =$captions;
						   $child['instructions'] = $v->instructions ? true : false;
						   $child['taskStatus'] = intval($quizGroupStatus);
						   $child['otherPartyUpdated'] = $updtedFromOtherUser;
						   $child['taskId'] = $taskId ;
						   $child['unreadCount'] = $unreadQCount ;
						   $child['reference_id'] = $QReference->uid;
						   $child['statusCls'] = $statusCls;
						   $child['statusTooltip'] = $statusTooltip;
						   $child['lessonToPass'] = $lessonsToPass;
						   $child['quizRequiredToPass'] = (array)$subsequentContents; //201407031055
						   $child['markUnviewed'] = $markUnviewed;
						   $child['quizPassed'] = count($scoresRecord) ? true : false ;
						   $child['quizStatus'] = $quizStatus ;
						   $child['lessonCompletedStatus'] = false;
						   $all[] = $child; 
					  }
				  
				    }
				    $coursedefaultstatus = -1;
				    $otheruser = false;	
				    foreach( $all as $rec ){
				    		if($rec['otherPartyUpdated']){
				    			$coursedefaultstatus = 4;
				    			$otheruser = true;
				    			break;
				    		}
				    	 
				    		if ( $coursedefaultstatus == -1 ) {
							    		
					    		$coursedefaultstatus = $statusCode;
					    	}
						    if( ($rec['taskStatus'] != -1 && $rec['taskStatus'] != 0) && $rec['taskStatus'] < $coursedefaultstatus) {
						    	$coursedefaultstatus = $rec['taskStatus'];
					        }
				    }
				    if( $coursedefaultstatus == '4' && !$otheruser && $otherUserId == prado::getApplication()->getUser()->getStudentId() ){
				    
				    	$coursedefaultstatus = '5';
				    }
				    foreach( $all as $rec ){
				    	
				    	$rec['courseStatus'] = intval($coursedefaultstatus);
				    	$recodrs[] = $rec;
				    }	 
			   SWPLogManager::log("returns all the chapter(lesson/quiz) of the course",array("recodrs"=>$recodrs),TLogger::INFO,$this,"getRecordChapters","SWP");        
			   return $recodrs;
    	}
	
    /**
     * @remotable 
     * 
     * This method will copy the training files and created records into 
     * training fies table for the product when there is no record
     * for the product in the training files table. 
     * 
     * if the records exists for the product. then query's the table with the passed parameters
     * parameters are
     *  -flesson_id
     *  -fproduct_id
     *  -fquestion_id
     *  
     *  These paramters will be passed from the Classroom.js showworkfliespanel functions
     */
    	
    public function getTrainingFiles( $params=array() ){
    	
		require 'config.php';
		SWPLogManager::log("Copy all the trainingfiles of the course ",array("params"=>$params),TLogger::INFO,$this,"getTrainingFiles","SWP");
    	$user = Prado::getApplication()->getUser();
    	$all = TrainingFilesRecord::finder()->findAll( 'product_id = ?' ,$user->getProductID() );
    	$baseUrl = FIniFilePanelTrainingFiles::BaseUrl();
    	
    	if( empty( $all ) ) {
    		//
    		// When the course is being played for the first time this loop will be executed as 
    		// there will be no records for the product in the training files table.
    		//
    		

    		$course = CourseRecord::finder()->withCc('(1=1) ORDER BY ordering')->find('content_id = ?',array($user->getContentID()));

    		$cc = $course->cc;

    		foreach($cc as $c) {
    			 
    			$v  = $c->content;
    			$index = 0;
    			 
    			if ( $v->type == 0) {

    				//
    				// For lesson there may be zero or more training files attached. 
    				// Decode the files column value and create records for them the training files table.
    				//
    				$tmpfiles = $v->files;
    				$tmpfiles = json_decode( $tmpfiles );

    				foreach ( $tmpfiles as $tmpfile ){

    					$newTrainingFiles = new TrainingFilesRecord;
    					$newTrainingFiles->user_id  	= $tmpfile->user;
    					$newTrainingFiles->username 	= 'Creator';
    					$newTrainingFiles->role_id  	= $params['role_id'];
    					$newTrainingFiles->rolename 	= 'Creator';
    					$newTrainingFiles->filename 	= $tmpfile->text;
    					$newTrainingFiles->filesize 	= filesize( $tmpfile->uid );
    					$newTrainingFiles->uploaddate	=  $tmpfile->Date ;
    					$newTrainingFiles->product_id	= $user->getProductID();
    					$newTrainingFiles->lesson_id	= $v->content_id;
    					//
    					// The file path would be like root/trainingfiles/productid/courseordering-lessonname/
    					//
    					if ( Prado::getApplication()->Parameters['fileupload'] == "s3"){
						
						$requiredPath = "trainingfiles/";
						$filepath = $requiredPath .
    								$user->getProductID() .
    								"/" . 
    								$course->name .
    								"/" .
    								sprintf('%1$04d',$c->ordering).
    								'-' .
    								$v->name.'/'.$tmpfile->text ;
    								
    					$client = S3Client::factory(array(
						    'key'    => $key,
						    'secret' => $secret
						));
    					try {
	
							$result = $client->copyObject(array(
							    'Bucket'     => $bucket,
							    'Key'        => $filepath,
								'CopySource' => urlencode($bucket.'/'.$tmpfile->uid),
						        'MetadataDirective' => 'COPY',
								'ACL'        => 'public-read'
							));
							
							$newTrainingFiles->filepath = $amazonurl.urlencode($filepath);
							
						} catch (Exception $e){
							SWPLogManager::log("Some exception occurs while copying trainingfiles in s3",array("message"=>$e->getMessage()),TLogger::ERROR,$this,"getTrainingFiles","SWP");
						}
						
    					} else {
    					
    					$filepath = $baseUrl .
    								$user->getProductID() .
    								"/" . 
    								$course->name .
    								"/" .
    								sprintf('%1$04d',$c->ordering).
    								'-' .
    								$v->name ;
    						
    					if( !file_exists( $filepath ) ){

    						$bool = mkdir( $filepath , 0777 , true );
    					}
    						
    					$filepath = $filepath . "/" .$tmpfile->text;
    						
    					if( copy( $_SERVER['DOCUMENT_ROOT'] . "/".$tmpfile->uid,  $filepath) ){

							$newTrainingFiles->filepath = $filepath;
//    						$newTrainingFiles->save();
    					}
    					
    					}
    				$newTrainingFiles->save();
						
    				}
    			}
    			elseif ($v->type==1) {
    					
    				$pid = $user->getProductID();
    				$cid = $user->getContentID();
    				$qs = QuizRecord::finder()->findAll('parent_id = ?',$v->content_id);

    				//
    				// Unlike lessons, in quizzes the files will be associated at question level.
    				// So iterate for the questions and copy the physical file and create
    				// corresponding record in the trainning files table
    				//
    				foreach ($qs as $q ){

    					$tmpfiles = $q->files;
    					$tmpfiles = json_decode($tmpfiles );

    					foreach ( $tmpfiles as $tmpfile ){

    						$newTrainingFiles = new TrainingFilesRecord;
    						$newTrainingFiles->user_id  	= $tmpfile->user;
    						$newTrainingFiles->username 	= 'Creator';
    						$newTrainingFiles->role_id  	= 0;
    						$newTrainingFiles->rolename 	= 'Creator';
    						$newTrainingFiles->filename 	= $tmpfile->text;
    						$newTrainingFiles->filesize 	=  filesize( $tmpfile->uid );
    						$newTrainingFiles->uploaddate	=  $tmpfile->Date ;
    						$newTrainingFiles->product_id	= $user->getProductID();
    						$newTrainingFiles->lesson_id	= $v->content_id;
    						$newTrainingFiles->question_id  = $q->uid;

    						//
    						// For quiz related filed the file path will be like below
    						// <document root>/trainingFiles/product_id/courseordering-lessonname/quizname/
    						//
							
    						if ( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
    							
    						$client = S3Client::factory(array(
						    'key'    => $key,
						    'secret' => $secret
						));
						
						$requiredPath = "trainingfiles/";
						$filepath = $requiredPath .
    								$user->getProductID() .
    						            "/" . 
	    								$course->name .
	    								"/" .  
    						            sprintf('%1$04d',$c->ordering) .
    						            '-' .
    						            $v->name .
    						            "/" . 
    						            $q->name.'/'.$tmpfile->text;
    								
    								
    								
					try {
						
						$result = $client->copyObject(array(
						    'Bucket'     => $bucket,
						    'Key'        => $filepath,
							'CopySource' => urlencode($bucket.'/'.$tmpfile->uid),
					        'MetadataDirective' => 'COPY'
						));
						$newTrainingFiles->filepath = $amazonurl.urlencode($filepath);
					} catch (Exception $e){
						
						SWPLogManager::log("Some exception occurs while copying trainingfiles in s3",array("message"=>$e->getMessage()),TLogger::ERROR,$this,"getTrainingFiles","SWP");
					}
					
    			} else {
    				
    			$filepath =$baseUrl .
    						            $user->getProductID() .
    						            "/" . 
	    								$course->name .
	    								"/" .  
    						            sprintf('%1$04d',$c->ordering) .
    						            '-' .
    						            $v->name .
    						            "/" . 
    						            $q->name;
    							
    						if( !file_exists( $filepath ) ){

    							$bool = mkdir( $filepath , 0777 , true );
    						}

    						$filepath = $filepath ."/" .$tmpfile->text;

    						if( copy( $_SERVER['DOCUMENT_ROOT'] . "/".$tmpfile->uid, $filepath ) ){

    							$newTrainingFiles->filepath = $filepath;
//    							$newTrainingFiles->save();
    						}
    						
    			}
					$newTrainingFiles->save();    					
					SWPLogManager::log("Trainingfiles object",array("files"=>$newTrainingFiles),TLogger::INFO,$this,"getTrainingFiles","SWP");

    						
    					}
    				}
    			}
    		}
			$all = TrainingFilesRecord::finder()->findAll( 'product_id = ?' ,$user->getProductID() );
			
    	} else if( !empty( $params ) ){
		
    	 $lesson_id = $params['flessond_id'];
    	 $product_id = $params['fproduct_id'];
    	 $question_id = $params['fqeustion_id'];
    	 
    	 unset( $params['lesson_id']);
    	 
    	 $criteria = " product_id = ? AND lesson_id =? ";
    	 $parameters = array($product_id , $lesson_id ) ;

    	 if( $question_id !== -1  ){
    	 	
    	 	$criteria = $criteria . " AND question_id = ? ";
    	 	array_push( $parameters, $question_id );
    	 }
    	  
    	 $criteria = $criteria ." ORDER BY uploaddate ";
    	 $all = TrainingFilesRecord::finder()->findAll( $criteria ,$parameters );

    	}
    	SWPLogManager::log("Returb from Trainingfiles method",array("record"=>$all),TLogger::INFO,$this,"getTrainingFiles","SWP");
    	return $all;
    }

    /**
     *  @remotable
     *  
     *  This method will query the training files table with the parameters passed.
     *  If uid is passed then directly fetches record for the particular uid else calls getTrainingfiles
     *
     * @param  uid - whenever there is a need for a unique file then this value must be supplied.
     * @param 
     */
    public function getTrainingFilesRecord( $params ){
    	SWPLogManager::log("From getTrainingFilesRecord method",array("params"=>$params),TLogger::INFO,$this,"getTrainingFilesRecord","SWP");
   		$uid = $params['uid'];
   		
    	if ( $uid ) {
    		$res = TrainingFilesRecord::finder()->find( ' uid = ? ' , $uid );
    		SWPLogManager::log("Returns from getTrainingFilesRecord method",array("result"=>$res),TLogger::INFO,$this,"getTrainingFilesRecord","SWP");
    		return $res;
    		
    	} else {
    		
    		$res = $this->getTrainingFiles( $params );
    		if( empty( $res ) ){
    			$res = $this->getTrainingFiles( $params );
    		}
    		SWPLogManager::log("Returns from getTrainingFilesRecord method",array("result"=>$res),TLogger::INFO,$this,"getTrainingFilesRecord","SWP");
    		return $res;
    	}
    	
    }
    
    /**     * @remotable
     * 
     * This function gets the total count of files that were uploaded. And the files that were in
     * work files grid, which is getting loaded.
     * calling when work files window is getting rendered.
     * @param passing flessond_id, fproduct_id, fqeustion_id,flesson, fchapter_id from WorkFiles.js
     * Returning the total count in the file system based on product id.
     * 
     */
    
    public function getTrainingFilesCount( $params ){
    	SWPLogManager::log("It should return the number of trainingfiles associated with the course",array("params"=>$params),TLogger::INFO,$this,"getTrainingFilesCount","SWP");
    	$user = Prado::getApplication()->getUser();
    	$productid = $user->getProductID();
    	$returnCount = TrainingFilesRecord::finder()->count(' product_id = ? ' , array($productid));

    	$lesson_id = $params['flessond_id'];
    	$product_id = $params['fproduct_id'];
    	$question_id = $params['fqeustion_id'];

    	$criteria = " product_id = ? AND lesson_id =? ";
    	$parameters = array($product_id , $lesson_id ) ;

    	if( $question_id  ){
    		 
    		$criteria = $criteria . " AND question_id = ? ";
    		array_push( $parameters, $question_id );
    	}
    	 
    	$criteria = $criteria ." ORDER BY uploaddate ";
    	$specificCount = TrainingFilesRecord::finder()->count( $criteria ,$parameters );
    	SWPLogManager::log("Returns the number of trainingfiles associated with the course",array( $returnCount,$specificCount ),TLogger::INFO,$this,"getTrainingFilesCount","SWP");
    	return array( $returnCount,$specificCount );
    }
    
    /**

     * This method calculates the size of the folder and returns the total size
     * 
     * @param $path - path of the folder for which size should be calculated
     */
    private function getFolderSize($path) {
		SWPLogManager::log("It should return the size of the folder in the specifid path in bytes",array("path"=> $path ),TLogger::INFO,$this,"getFolderSize","SWP");
    	$totalSize = 0;
    	$files = scandir($path);


    	foreach($files as $t) {
    		
    		if ( is_dir( rtrim($path, '/' ) . '/' . $t ) ) {

    			if ( $t <> "." && $t <> ".." ) {

    				$size = $this->getFolderSize( rtrim($path, '/' ) . '/' . $t );

    				$totalSize += $size;
    			}
    		} else {

    			$size = filesize( rtrim( $path, '/' ) . '/' . $t );

    			$totalSize += $size;
    		}
    	}
		SWPLogManager::log("The size of the folder is : ",array("size"=> $totalSize ),TLogger::INFO,$this,"getFolderSize","SWP");
    	return $totalSize;
    }
    
 	/**
     * @remotable
     * 
     * This method will be called from the filesgrid when adding new record to the trainingfiles table. 
     * Apart from this renames the awesomeuploader unique folder name with the upload pkg name.
     *
     */
    public function newTrainingFilesRecord( $params ){

    	// the unique id of the awesomeuploader will be passed as the filepath value from the front end.
    	$uniqueId = $params['filepath'];
		$baseUrl = FIniFilePanelTrainingFiles::BaseUrl();
    	unset($params['uid']);
    	unset($params['filepath']);
    	
    	$lesson = $params['lesson_id'];
    	$question = $params['question_id'];
    	
    	
    	//
    	// lesson_id and question_id of the parameters will contain the id + "_" + name (lessonname/questionname)
    	//
    	 $lesson_id = substr( $lesson, strrpos( $lesson, "_") +1 , strlen( $lesson )  );
    	 $lesson = substr( $lesson, 0 , strrpos( $lesson, "_") );
    	 $question_id = substr( $question, strrpos( $question, "_") +1 , strlen( $question )  );
    	 $question = substr( $question, 0 , strrpos( $question, "_") );
    	
    	//
    	// Reset the appropriate lesson_id/question_id exploded from the passed values
    	//
    	$params['lesson_id'] = $lesson_id;
    	$params['question_id'] = $question_id;
    	
    	$user = Prado::getApplication()->getUser();
    	// create Traininfiles record from the params
    	$newTrainingFiles = new TrainingFilesRecord( $params );
    	
    	$destination = $baseUrl.$user->getProductID() ."/".$lesson."/";
    	$source =$baseUrl.$user->getProductID() ."/".$lesson."/";

    	//
    	// question_id will be passed as -1 from the front end if the selected lesson is not a quiz so the 
    	// source = root/trainingFiles/product_id/lesson/uniqueid
    	// destination = root/trainingFiles/product_id/lesson/filename(upload pkg name)
    	//
    	if( $question == -1 ) {
    		
    		$source = $source . $uniqueId;
    		$destination = $destination . $params['filename']."/";
    		
    	} else {
    		
    		//
    		// when question id is passed then 
    		// source = root/trainingFiles/product_id/lesson/questionname/uniqueid
    		// destination = root/trainingFiles/product_id/lesson/questionname/filename(upload pkg name)
    		//
    		$source = $source . $question ."/".$uniqueId;
    		$destination = $destination . $question . "/" . $params['filename'] . "/";
    	}

    	//
    	// rename the uinique folder with the upload package name
    	//
    	
    	rename( $source, $destination );
    	
    	if ( file_exists( $destination ) ){
    			
    		$totals =  $this->getFolderSize( $destination );
    		
    		//
    		// Set the filepath,filesize,lesson_id/question_id and save the training files record
    		//
    			
    		$newTrainingFiles->filepath = $destination;
    		$newTrainingFiles->filesize = $totals;
    		$newTrainingFiles->lesson_id = $lesson_id;
    		$newTrainingFiles->question_id = $question_id;

    		$newTrainingFiles->save();
    		$res = $newTrainingFiles;
    	}

    	// reset the value of the parameters lesson_id,filepath,filesize,uid,question_id with the vlaues saved into the db.
    	$params['lesson_id']	=$newTrainingFiles->lesson_id;
    	$params['filepath'] 	=$newTrainingFiles->filepath;
    	$params['filesize'] 	= $newTrainingFiles->filesize;
    	$params['uid'] 			= $newTrainingFiles->uid;
    	$params['question_id']	=$newTrainingFiles->question_id;

    	return $newTrainingFiles;
    }
    
    
 	/**
     *  @remotable
     */
    public function saveTrainingFilesRecord( $params ){
    	 
    	foreach ($params as $p) {
    		
    		$uid = $p['uid'];
    		unset($p['uid']);
    		$uids[] = $uid;
    		TrainingFilesRecord::finder()->updateByPk($p,$uid);
    	}
    	
    	return TrainingFilesRecord::finder()->findAllByPks($uids);
    	 
    }
    
 	/**
     *  @remotable
     *  
     *  This method will delete the record with the uid in the trainingfiles table.
     *  and the files in the folder path specified in the record.
     */
    public function destroyTrainingFilesRecord( $params ){
    	
    	$uid = $params['uid'];
    	if ($uid) $params = array($params);
    	 
    	foreach($params as $p) $uids[] = $p['uid'];

    	$all = TrainingFilesRecord::finder()->findAllByPks( $uids );
    	
    	foreach ( $all as $single ){

    		$retValue = true;
    		$filepath = $single->filepath;
    		
    		//
    		// Setting up the path upto directory with ProductId.
    		//
    		
    		$user = Prado::getApplication()->getUser();
    		$productid = $user->getProductID();
    		$rootpath = substr($filepath, 0,strpos($filepath, $productid.'/'));
    		$rootpath = $rootpath.$productid.'/';
    		
    		if( is_dir( $filepath ) ){

    			$sourcefiles = scandir( $filepath );
    				
    			foreach ( $sourcefiles as $sfile){

    				unlink( $filepath . $sfile );
    			}

    			if( rmdir( $filepath ) ){

    				//
    				// Ideally deleteAllByPks should delete all the records with the primary key
    				// as it was not working individual records are deleted after removing the directory
    				//
    					
    				if( ! $single->delete() ){

    					$retValue = false;
    				}

    			}else{

    				$retValue = false;
    			}

    		}else{

    			if( unlink( $filepath . $sfile ) ){

    				if( ! $single->delete() ){

    					$retValue = false;
    				}
    			}else{

    				$retValue = false;
    			}
    		}
	    	if ( is_dir( $rootpath ) ) {
	    	
	    		self::removeRootDirectory( $rootpath );
	    	}
	   		
    	}
    	
    	return $retValue ? $params : false;

    }
    /**
     * 
     *	This function will delete the parent directory if that parent directory is empty.
     *	It will be called when user deletes the Uploaded package.
     *	@param $rootpath- path upto directory ProductId. It will be: root/trainingFiles/product_id/
     * 	
     */
    
    	public static function removeRootDirectory( $rootpath ){
    		
    		$scanrootdirectory = scandir( $rootpath );
			     foreach ( $scanrootdirectory as $destroypath ) {
			     	
			       if ( $destroypath != "." && $destroypath != "..") {
			       	
			         $returnvalue = rmdir( $rootpath."/".$destroypath );
			       }
			       
			       if( $returnvalue == false ){
			       	
			       		$folderafterRoot = $rootpath."/".$destroypath;
			       		
			       		if( is_dir( $folderafterRoot ) ){
			       			
			       		$scanfoldercontent = scandir( $folderafterRoot );
				       		foreach ( $scanfoldercontent as $deleteemptydir ) {
				       			if( $deleteemptydir != "." && $deleteemptydir != ".." ){
				       				
				       				rmdir( $folderafterRoot."/".$deleteemptydir );
				       			}	
				       		}
			       		}
			       		rmdir( $folderafterRoot );
			       }
			       
			     }
     		rmdir( $rootpath );
    	}
    
	/**
     *  @remotable
     *  
     *  This method will delete the successfully uploaded file.It is calling from function deletefilehandler in uploadPopup.js
     *  And also deletes the created package with unique id,
     *  which will be happen if user clicks on cancel button without saving. Checking condition for 
     *  uniqueid existence, on cancel, it will not delete the files of creator, if unique is null.
     *  @param uniqueid of the uploaded package, name of file uploaded and lesson name respectively.
     *  
     */
    	
	public function removeUploadedFile( $uniqueId,$filename,$lessonname,$quizQuestion ){
		
    	$user = Prado::getApplication()-> getUser();
    	$baseUrl = FIniFilePanelTrainingFiles::BaseUrl();
    	if( $quizQuestion != -1 ){
    		
    		$filepath = $baseUrl.
    						            $user->getProductID() .
    						            "/" .  
    						            $lessonname .
    						            "/" .
    						            $quizQuestion .
    						            '/' .
    						            $uniqueId .
    						            "/" ;
    	}else{
    		
	    	$filepath =$baseUrl.
	    						            $user->getProductID() .
	    						            "/" .  
	    						            $lessonname .
	    						            '/' .
	    						            $uniqueId .
	    						            "/" ;
    	}
    	
	   if( $filename != null ){
    		
    			$filepath = $filepath . $filename;
    			$returnValue = unlink( $filepath );
    	}else if( is_dir($filepath) && $uniqueId ){
    		
    		$scannedPath = scandir($filepath);
    		foreach ( $scannedPath as $removefiles ){
    			
	    		unlink( $filepath . $removefiles );
    		}
    		if( rmdir($filepath) ){
    			
    		$user = Prado::getApplication()->getUser();
    		$productid = $user->getProductID();
    		$rootpath = substr($filepath, 0,strpos($filepath, $productid.'/'));
    		$rootpath = $rootpath.$productid.'/';
    		
    		$returnValue = self::removeRootDirectory( $rootpath );
    		}
    	}
    	
    	return $returnValue; 
    }
    
     /**
     * @remotable
     *
     *This function will get the first video url of the video as well as the captions 
     *assocaited with the video. and return to the ui
  	*/
public function getVideoURL($videoUId){
		SWPLogManager::log("It should return the url of the video :",array("videoUId"=> $videoUId ),TLogger::INFO,$this,"getVideoURL","SWP");
    	$videos = VideoRecord::finder()->find('uid = ? ',$videoUId);
    	
    	$videoURL =$videos->getFirstVideo();
    	$captions = VideoCaptionsRecord::finder()->findAll(' video_id = ? ' , $videos->content_id );
    	SWPLogManager::log("Returns the url of the video and the related captions data :",array('url'=>$videoURL,
   				'captions'=> $captions),TLogger::INFO,$this,"getVideoURL","SWP");
   	return array('url'=>$videoURL,
   				'captions'=> $captions);
   	
    }
    
    /**
     * @remotable
     *@val passing null
  	 */
	public static function getUserDetails( $val ){
	   
		$user = Prado::getApplication()-> getUser();
		SWPLogManager::log("While initializing the video player it should return the users details ",array("user"=> $user ),TLogger::INFO,$this,"getUserDetails","SWP");
		$actualRoles = $user->getRoles();
		$instructor_avaliability_date = null;
		$courseRecord = ProductRecord::finder()->find( 'content_id = ?',$user->getContentId() );
		$instructorAvaiableForCurrentDate =false;
		//This will check the instructor availability from the 
		if( $user->getInstructorID()  != null ) {
				$record = CourseDetailsRecord::finder()->find('product_id = ? AND course_id = ? ',array($user->getProductID(),$user->getContentId()) );
				if(count($record) > 0 ){
					//201312021950
					if ( $record->instructor_id && $record->instructor_id == $user->getInstructorID() )  {
						$instructorAvaiable =  true;
						$instructor_avaliability_date = $record->availablilitydate;
						if( ! empty( $instructor_avaliability_date ) && isset( $instructor_avaliability_date ) ) {
							$instructorAvaiableForCurrentDate = date("Y-m-d H:i:s", time() ) <   $instructor_avaliability_date ;
						}else if( empty( $instructor_avaliability_date ) ){
							$instructorAvaiableForCurrentDate	 = true;
						}
					} elseif ( $record->instructor_id == 0 && $record->old_instructor_id ){
						$instructorAvaiable =  true;
						$oldInstructorAvailable = true;
						$oldInstructorId = $record->old_instructor_id;
					}
				}

		}
		//If instructor not available then we are placing false 
//		if(! isset( $instructorAvaiableForCurrentDate ) ) {
//			$instructorAvaiableForCurrentDate	 = false;
//		}
		
		// If no settings configuration is there for that particular user, it will first create the entry
		// in settings table then it will return the record.
		
		$aur = new ActiveUrlRecord();
		$aur->createUsetSettings( $user->Uid);
		$records = UserSettingsRecord::finder()->findAll('name=? AND enable = 1 AND user_id = ? ',array( 'theme settings', $user->Uid) );
		
		$captionRecord = UserSettingsRecord::finder()->find('`key`=? AND enable = 1 AND user_id = ? ',array( 'Video Caption', $user->Uid) );
		$playbackSettingsRecords = UserSettingsRecord::finder()->find('`key`=? AND enable = 1 AND user_id = ? ',array( 'Chapter Based Playback', $user->Uid) );
		$role = array(
		'uid' => $user->Uid,
		'username' => ($user->Name ? $user->Name : $user->Username),
		'name' => $rolename,
		'PID'=>$user->getProductID(),
		'courseName'=>$courseRecord->name,
		'ARoles'=>$actualRoles['actualRole'][0][0],
		'instructorAvailable'=>  $instructorAvaiable,
		'theme'=>$records[0]->value,
		'caption' => $captionRecord->value,
		'isFromAmazon' => Prado::getApplication()->Parameters['fileupload'] == "s3" ? true : false,
		'chapter_play_back' =>$playbackSettingsRecords->value,
		'instructorAvaiableForCurrentDate' => $instructorAvaiableForCurrentDate,
		'instructor_avaliability_date' =>$instructor_avaliability_date,
		//201312021950
		'oldInstructorAvailable'=>$oldInstructorAvailable,
		'oldInstructorId'=>$oldInstructorId
		);
		SWPLogManager::log("User Details : ",array("userdetails"=> $role ),TLogger::INFO,$this,"getUserDetails","SWP");
		return $role;
    }
    
    /**
     * @remotable
     *
     */
    public function getRecordChaptersTree($params=array()) {
	SWPLogManager::log("It should return all chapter records ",array("params"=> $params ),TLogger::INFO,$this,"getRecordChaptersTree","SWP");
	$uid = $params['id'];
	//unset($params['uid']);
	//return $params;
	$videos = VideoRecord::finder()->findAll();
	foreach($videos as $v) {

         $res = array();
	    $res['uid'] =  'L'.$v->content_id;
	    $res['id'] = $v->content_id;
	    $res['name'] = $v->name;
	    $res['textthis-'] = $v->name;
	    $res['description'] = $v->description;
	    $res['url'] = $v->getFirstVideo();
	    $res['iconCls'] = 'video';
	    $res['leaf'] = false;
	    $res['children'] = array();

	    
	    $last=null;
	    $chapters = CuepointRecord::finder()->findAll('videos_id = ?',$v->content_id);
	    foreach($chapters as $k=>$ch) {
			if ($last !== null) {
				$res['children'][$last]['stop'] = $ch->start;
			}
			$last = $k;
			$child = array();
	   	     $child['leaf'] = true;
			$child['url'] = $v->getFirstVideo();
			$child['name'] = $ch->name.' '.$ch->description;
			$child['text'] = $ch->name.' '.$ch->description;
			$child['transcript'] = $ch->description.' '.$ch->transcript;
			$child['start'] = $ch->start;
			$child['stop'] = $ch->stop;
			$child['iconCls'] = 'film';
			$child['uid'] = 'L'.$v->content_id.'_'.$ch->uid;
	   	     $res['children'][$k] = $child;
	    }
	    if ($last) $res['children'][$last]['stop'] = 10000000000000;
	    
	    $all[] = $res;

    	}
	    $all[] = array(
				'uid' => 'Q1',
				'type' => 'quiz',
				'name' =>'Quiz',
				'video' =>1,
				'iconCls'=>'quiz',
				'leaf'=>true,
				'extension' => 'txt2'
			);					
	
	   SWPLogManager::log("Returns all chapter records ",array("record"=> $all ),TLogger::INFO,$this,"getRecordChaptersTree","SWP");
	   return $all;
    }

    /**
     * @remotable
     *
     */
    public function getRecord($params=array()) {
	SWPLogManager::log("Returns all chapters associated with a video(nothing but a lesson) ",array("params"=> $params ),TLogger::INFO,$this,"getRecord","SWP");
	$uid = $params['id'];
	//unset($params['uid']);
	//return $params;
	if ($uid) {
	    $v = VideoRecord::finder()->findByContent_id($uid);
	    $res['uid'] = $v->content_id;
	    $res['id'] = $v->content_id;
	    $res['name'] = $v->name;
	    $res['description'] = $v->description;
	    $res['url'] = $v->getFirstVideo();
	    $chapters = CuepointRecord::finder()->findAll('videos_id = ?',$uid);
	    $res['comments'] = UserLCommentRecord::finder()->findAll('videos_id = ?',$uid);
	    
	    $last=null;
	    foreach($chapters as $k=>$ch) {
			if ($last !== null) {
				$chapters[$last]->stop = $ch->start;
			}
			$last = $k;
			
			$chapters[$k]->transcript = $chapters[$k]->description.' '.$chapters[$k]->transcript;
	    }
	    $chapters[$last]->stop = 10000000000000;
	    $res['chapters'] = $chapters;
	    SWPLogManager::log("Returns all chapters of a lesson ",array("record"=> $res ),TLogger::INFO,$this,"getRecord","SWP");
	    return array($res);
	} else {
	    $v = VideoRecord::finder()->findAll();
	}
    }

    /**
     * @remotable
     *
     */
    public function getAllRecords($params) {

	    return VideoRecord::finder()->findAll();
	    
	
    }

    /**
     * @remotable
     *
     */
    public function trackSeen( $id, $type, $fromResetQuiz,$isSummaryClicked) {
		SWPLogManager::log("In order to track students behaviour we entering record to tracks table",array("id"=>$id, "type"=>$type, "From Reset Quiz"=>$fromResetQuiz),TLogger::INFO,$this,"trackSeen","SWP");
    	$user = Prado::getApplication()->getUser();
    	$pid = $user->getProductID();
    	$cid = $user->getContentID();
    	list($vid,$uid) = explode('_',$id);
    	if( $type ){
    		$v = true;
    		 
    		if (!$pid || !$uid) return $user->ContentID;
    		// if ( !$uid ) return $user->ContentID;
    		 
    		$td = TrackingDataRecord::finder()->find('product_id = ? AND content_id = ?',array($pid,$uid));
    		 
    		if (!$td) {
    			$td = new TrackingDataRecord;
    			$td->product_id = $pid;
    			$td->user_id = $user->Username;
    			$td->content_id  = $uid;
    		}
    		$td->subject = true;
    		$td->value = $v;
    		$td->save();
    		SWPLogManager::log("Tracking Lesson data",array("tracksobject"=> $td ),TLogger::INFO,$this,"trackSeen","SWP");
    		return true;
    	}else{
			//When it is quiz it will come to the eles
    		$quizId = explode("_", $id);
    		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find( 'coursecontent_id = ?' , $cid.'|'.$quizId[0] );
    		$QuizLessonAssociations = ProductQuizLessonAssociationRecord::finder()->findAll( 'quiz_settings_id = ? AND markunviewed = 1 ',$quizSettingsRecord->uid );
    		 
    		if( $fromResetQuiz ){
    			foreach ( $QuizLessonAssociations as $QuizLessonAssociation ){

    				$chapters = CuepointRecord::finder()->findAll('videos_id = ?',$QuizLessonAssociation->lesson_id);

    				foreach ( $chapters as $chapter ){

    					$trackRecord = TrackingDataRecord::finder()->find('product_id = ? AND content_id = ?',$pid,$chapter->uid );
    					if(count($trackRecord)) {
    						$trackRecord->subject = false ;
    						$trackRecord->save();
    					}
    				}
    			}
    		}

    		if($isSummaryClicked){
    			if (!$pid) return $user->ContentID;
    			$td = TrackingDataRecord::finder()->find('product_id = ? AND content_id = ?',array($pid,$quizId[0]));
	    		if (!$td) {
	    			$td = new TrackingDataRecord;
	    			$td->product_id = $pid;
	    			$td->user_id = $user->Username;
	    			$td->content_id  = $quizId[0];
	    		}
	    		$td->subject = true;
	    		$td->value = true;
	    		$td->save();
    		}else{
    			if (!$pid) return $user->ContentID;
    			$td = TrackingDataRecord::finder()->find('product_id = ? AND content_id = ?',array($pid,$quizId[0]));
	    		if (!$td) {
	    			$td = new TrackingDataRecord;
	    			$td->product_id = $pid;
	    			$td->user_id = $user->Username;
	    			$td->content_id  = $quizId[0];
	    		}
	    		$td->subject = false;
	    		$td->value = true;
	    		$td->save();
    		}
    		
    		$scoresRecord = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$quizId[0] );

    		$subsequentArray = array();
    		if( $quizSettingsRecord->required_subsequent && !$scoresRecord->passed ){

    			array_push( $subsequentArray, $quizId[0] );
    		}
    		$requiredsubsequentArray = array();
    		$lessonsToPass = array();
    		$markUnviewed = array();
    		$subsequentLessonIds = array();
    		$subsequentLessonCompleteStatus = array();
    		
    		$productLessonSubsequents = ProductLessonSettingRecord::finder()->findAll('course_id = ? AND content_id = ? AND setting_value = 1 ',
			                                              array($cid ,$quizId[0] ));
		    if(count($productLessonSubsequents) > 0){
				foreach( $productLessonSubsequents as $productLessonSubsequent ) {
					//array_push($lessonsToPass , $productLessonSubsequent->lesson_id);
					//Commented as we don't require this to stop the quiz to load.
					//As we have lesson settings window there we are configuring the locked content.
				}
		    }
    		$quizSettingAssociationRec = ProductQuizLessonAssociationRecord::finder()->findAll('quiz_settings_id = ? ',$quizSettingsRecord->uid);
    		foreach ( $quizSettingAssociationRec as $associationRecord ){
    			if( $associationRecord->markunviewed ){
    				array_push($markUnviewed, $associationRecord->lesson_id);
    			}
    		}
    		if(count($markUnviewed) > 0){
	    		if($fromResetQuiz){
	    			for($i = 0 ; $i< count($markUnviewed) ; $i++){
			    		$lessonSubsequentRecs = ProductLessonSettingRecord::finder()->findAll( 'course_id = ? AND lesson_id = ? AND setting_value = 1 AND setting_name != "SUB_SEQUENT_LOCK "',array( $user->ContentID, $markUnviewed[$i] ) );
						if( count($lessonSubsequentRecs) > 0){
							$subSeqConteArr = array();
							foreach ( $lessonSubsequentRecs as $lessonSubsequentRec ){
								array_push($subSeqConteArr,  $lessonSubsequentRec->content_id) ;
							}
							$subsequentLessonIds[$markUnviewed[$i]] = $subSeqConteArr;
						}
						$subsequentLessonCompleteStatus[$markUnviewed[$i]] = $this->getLessonCompletedStatus($markUnviewed[$i],$pid);
	    			}
	    		}
    		}
    		$quizStatus = $this->evaluateQuizTrackSeen( $quizId[0], true, true, true,$isSummaryClicked);
    		SWPLogManager::log("Tracks quiz related data",array(
			"lessonToPass"=>$lessonsToPass,
			"quizRequiredToPass"=>$subsequentArray,
			"markUnviewed" => $markUnviewed,
			"quizPassed"=> count($scoresRecord) ? true : false,
			"quizStatus"=> $quizStatus
	    	),TLogger::INFO,$this,"trackSeen","SWP");
    		
    		return array(
			"lessonToPass"=>$lessonsToPass,
			"quizRequiredToPass"=>$subsequentArray,
			"markUnviewed" => $markUnviewed,
			"quizPassed"=> count($scoresRecord) ? true : false,
			"quizStatus"=> $quizStatus,
    		"subSeqcontnetLockOnUnView" => $subsequentLessonIds,
    		"subsequentLessonCompleteStatus"=> $subsequentLessonCompleteStatus
    		);
    	}
    }

    /**
     * @remotable
     *
     */
    public function getMovieRecord($params=array()) {
		SWPLogManager::log("get all the video record",array("params"=> $params ),TLogger::INFO,$this,"getMovieRecord","SWP");
		$uid = $params['id'];
		//unset($params['uid']);
		//return $params;
		if ($uid) {
			$v = VideoRecord::finder()->findByPk($uid);
			$res['uid'] = $v->content_id;
			$res['id'] = $v->content_id;
			$res['name'] = $v->name;
			$res['description'] = $v->description;
			$res['url'] = $v->getFirstVideo();
			SWPLogManager::log("Returns all movie record for the passed uid :",array("record"=> $res ),TLogger::INFO,$this,"getMovieRecord","SWP");
			return array($res);
		} else {
			$videos = VideoRecord::finder()->findAll('is_enabled = 1');
			$m = array(); $i=1;
			foreach($videos as $v) {

				$m[] = array(
					'uid' => 'L'.$v->content_id,
					'qv_uid' => 'L'.$v->uid,
					'type' => 'video',
					'name' =>$v->name,
					'name' =>$v->name,
					'url' => $v->getFirstVideo(),
					'extension' => 'video','web_path'=>''
				);
				
				
			//	$quiz = $v->quizes;
			//	foreach($v->quizes() as $q) {
				$i++;
			}

			$v = VideoRecord::finder()->findByPk(1);
			$m[] = array(
				'uid' => 'Q'.$i,
				'type' => 'quiz',
				'name' =>'Quiz',
				'video' =>$v->url,
				'extension' => 'txt2'
			);					


		}
		SWPLogManager::log("Returns all the movie record",array("record"=> $m ),TLogger::INFO,$this,"getMovieRecord","SWP");
		return $m;
    }

	/**
     * @remotable
     * This method is used to get the quiz summary for the given content being used by the 
     * logged-in user. The system supports multiple answers for the same question and in such case
     * an answer will be considered correct iff all the answers are correct.
     *
     * @param String id this parameter allows system to identify the quiz records associated with the content.
     * @return the HTML document consisting of summary of quiz answers
     */
	public function getQuizSummary($id, $fromQuizWizard ) { //20131114210
		SWPLogManager::log("Returns the summary of the particular quiz passed ",array("quizid"=> $id ),TLogger::INFO,$this,"getQuizSummary","SWP");		
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$cid = $user->getContentID();
		
		// Checking whether the login user is an instructor
		$instructorId = $user->getInstructorID();
		if( $user->Uid == $instructorId ){
				$instructorLogIn = true;
		}else{
			$instructorLogIn = false;
		}
		//201406210404
        //$answeredDetails = '<div style = "padding-left: 20px;"><h3 style="margin:0 !important;font-family: sans-serif;font-size: x-large;">Answered questions:</h3><br/> </div>';
		$answeredDetails .= '<table class="quiz-summary" border="0" style = "height : 15px;width:97%; table-layout:fixed;"> ';
		$index=0;
		$count=0;
		$goodAnswersCount = 0;
		$questionsCount = 0;
		$answeredQuestionsCount = 0 ;
		
		$quizSettings = $this->getQuizSettings( $id );
		$yourScore = $quizSettings['resultScore'].'%';
		$requiredScore = $quizSettings['requiredScore'].'%';
		$yourScorecls = $quizSettings['quizResult'].'-score-cls'; 
		$quizResult = $quizSettings['quizResult'];
		
		if( $quizSettings['randomizeQuestions'] ){
			$questions = QuizRecord::finder()->findAll('parent_id = ? ORDER BY ordering ',$id);
		 	 foreach ( $questions as $question ){
		 	 	 $quizSequence = ProductQuizSequenceRecord::finder()->find('product_id = ? AND quiz_id = ? AND user_id = ? AND question_id = ?', $pid,$id,$user->Uid,$question->uid );
		 	 	 $question->name = $quizSequence->ordering ; 
		 	 	 $orderedQuestions[($quizSequence->ordering-1)] = $question;
		 	 }
		 	 $qq = $orderedQuestions;
		}else{
			$qq = QuizRecord::finder()->findAll('parent_id=? ORDER BY ordering ',$id);
		}
		for( $l=0 ; $l < count($qq); $l++ ){	
			$q = $qq[$l];
			$count++;
			unset($atext);
			unset($goodAnswers);
			$questionsCount++ ;
			
 			if ( $q->qtype === 'numeric question' ) {
 			
 				//
 				// For numeric questions - all the options are expected to be correct answers
 				//
 				
 				$goodAnswers = QuizAnswerRecord::finder()->findAll(' quiz_id = ?', $q->uid );
 				
 				//
 				// For numeric type question value can also be zero . and fetch the quiz answer results in the order of the quiz answer shown in the question tab. 
 				// i.e based on the answer ordering filed.
 				//
 				
 				$sql = " SELECT qr.* FROM quiz_answer_results qr JOIN quiz_answers qa ON ( qa.uid = qr.answer_id) "
						." WHERE qa.quiz_id = :quizid AND  qr.value  like '%'  AND qr.course_id = :course_id AND qr.product_id = :prodid ORDER BY qa.ordering ";
 				
 			} else {
 			 	
 			 	//
 				//  questions of type other than numeric, fetch the quiz answer results in the order of the quiz answer shown in the question tab. 
 				// i.e based on the answer ordering filed. and value of the quiz_answer_results is not zero i.e fetch the correct answers
 				//
 			 	
 			 	$sql = " SELECT qr.* FROM quiz_answer_results qr JOIN quiz_answers qa ON ( qa.uid = qr.answer_id) "
						." WHERE qa.quiz_id = :quizid AND  qr.value  like '%' AND qr.value !=0  AND qr.course_id = :course_id AND qr.product_id = :prodid ORDER BY qa.ordering ";
 				$goodAnswers = QuizAnswerRecord::finder()->findAll(' quiz_id = ? AND good = 1 ', $q->uid );
 			}
			
 			if( $q->qtype != 'Task')	{
				$conn = $q->getDbConnection();
				$conn->setActive(true);
				$cmd = $conn->createCommand( $sql );
				$cmd->bindValue(':quizid', $q->uid );
				$cmd->bindValue(':course_id', $cid );
				$cmd->bindValue(':prodid', $pid );
				$treader = $cmd->query();
				
				$aa = array();
				
				foreach ( $treader->readAll() as $qas ){

					array_push( $aa , new QuizAnswerResultRecord( $qas ) );
				}
				if( count($aa) ){
					$answeredQuestionsCount++;
				}
				
				$isCorrect = 0;
				foreach($aa as $a) { 
					if ( $a->good == 0  ) {
						//
						// One or more answer result is wrong and hence answer to this question is 
						// not correct. 
						//
						$isCorrect = 0;
						break;
					} else {
	
						if ( $a->good == 1 ) {
							$isCorrect = 1;
						} else {
							$isCorrect = 0;
							break;
						}
					}
				}
				
				//
				// It is possible that a question may have 2 correct answers (e.g in case of multiple answers type question) and the 
				// user might have selected only one valid answer. In such case we need to count such answer as incorrect.
				//
				if ( $isCorrect == 1 && ( count($aa) < count($goodAnswers) ) ) {
					$isCorrect = 0;
				}
 			} else {
 				$lastRunInfoRecords = LastRunRecord::finder()->find('product_id=? AND content_id=? AND question_id = ? AND subject = "taskref"',
 																	 array($pid,$cid,$q->uid));
				if(count($lastRunInfoRecords) > 0){
					$taskThread = ThreadRecord::finder()->find('product_id = ? AND content_id = ? AND reference_id = ? AND thread_type_id = 3',
												array($pid,$cid,$lastRunInfoRecords->uid));
					if(count($taskThread) > 0){
						if($taskThread->status == '99'){
							$isCorrect = 1;
						}else{
							$isCorrect = 0;
						}
					} else{
						//If we are not able to find the thread means thread is not created
						$isCorrect = 0;
					}
				} else {
					//if last run record it self not there then it is not attempted and not answered (Thread is completed).
					$isCorrect = 0;
				}
 			}
 			
 			$good = ($isCorrect == 1) ? '<td style="width:20px;"><div class="icon-size result-ok" ></div></td>':'<td style="width:20px;" ><div class="icon-size result-error"></div></td>';
 			
			if( $isCorrect == 1 ){
				$goodAnswersCount++;
			}
			if( $q->qtype != 'Task')	{
				foreach($aa as $a ) {
					
					$atextOpt = '';
	
					if ( $q->qtype === 'numeric question') {
						$atextOpt = '<div class="summary-answer-results">'.$a->value.'</div>';
					} else {
						$studentAnswer = QuizAnswerRecord::finder()->findByPk( $a->answer_id );
						// $atextOpt ='<div class="summary-answer-results">'. (strlen($studentAnswer->name) > 40) ? substr($studentAnswer->name, 0, 40) . '...' : $studentAnswer->name.'</div>';
						$atextOpt = '<div class="summary-answer-results">'.$studentAnswer->name.'</div>';
					}
	
					if ( strlen($atext) > 0 ) {
						//
						// In case multiple answers exist, separate each answer by comma
						//
					//	$atext .= '<br />- ';
					}
					
					$atext .= $atextOpt;
				}
			} else {
				$atext = '';
			}
			if( $count % 2 == 0 ){
				$trCls = 'even-row-cls';
			}else{
				$trCls = 'odd-row-cls';
			}
			$clickableCls = ($quizSettings['postEvalution'] == 3 || $quizSettings['postEvalution'] == 4) ? "clickable" : '' ;
			if($instructorLogIn){
				//If the login user is an instructor then making the links as not clickable
				$clickableCls = '';
			}
			$answeredDetails .= "<tr class=".$trCls."> <td class='".$clickableCls."' style = 'padding-left: 7px;width: 50%;'; index ='".$index."'; >{$q->name}</td> $good <td style=\"width: 53%; \"> $atext </td> </tr>";
			$index++;
			//201405120412
			if($fromQuizWizard){
				if($isCorrect){
					$this->calculateQuizAnswerAttemptFailureCount(true ,$q->uid );
				} else {
					$this->calculateQuizAnswerAttemptFailureCount(false ,$q->uid );
				}
			}
		}
		
	$answeredDetails .= '</table> ';
		
		$res = ( $answeredQuestionsCount/$questionsCount )*100;
  		$answeredPercentage = round($res, 0);
  		$quizId = explode("_", $id);
  		$quizScoresRecords = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$quizId[0]);
  		
  		
  		
  		
  		if( count($quizScoresRecords) ){
  			if( $quizSettings['postEvalution'] == 4 && $fromQuizWizard == true ){  //20131114210
  				
  				$quizScoresRecords->resetquiz = 1 ;
  				$quizScoresRecords->save();
	  			$quizScores = new ProductQuizScoresRecord();
		  		$quizScores->product_id = $pid ;
				$quizScores->quiz_id = $id ;
				$quizScores->user_id = $user->Uid ;
				$quizScores->score = $quizSettings['resultScore'] ; 
				$quizScores->passed = $quizResult == 'passed' ? 1 : 0 ;
				$quizScores->resetquiz = 0 ;
				$quizScores->completiondatetime = date("Y-m-d H:i:s",time());
				$quizScores->answeredpercentage = $answeredPercentage ; 
				
				$quizScores->save();
				
  			}else{
  				
	  			$quizScoresRecords->score = $quizSettings['resultScore'] ; 
				$quizScoresRecords->passed = $quizResult == 'passed' ? 1 : 0 ;
				$quizScoresRecords->resetquiz = 0 ;
				$quizScoresRecords->completiondatetime = date("Y-m-d H:i:s",time());
				$quizScoresRecords->answeredpercentage = $answeredPercentage ; 
				
				$quizScoresRecords->save();
  				
  			}
  		
  		}else{
  		
	  		$productQuizScores = new ProductQuizScoresRecord();
	  		$productQuizScores->product_id = $pid ;
			$productQuizScores->quiz_id = $id ;
			$productQuizScores->user_id = $user->Uid ;
			$productQuizScores->score = $quizSettings['resultScore'] ; 
			$productQuizScores->passed = $quizResult == 'passed' ? 1 : 0 ;
			$productQuizScores->resetquiz = 0 ;
			$productQuizScores->completiondatetime = date("Y-m-d H:i:s",time());
			$productQuizScores->answeredpercentage = $answeredPercentage ; 
			
			$productQuizScores->save();
  		}
		//2014070937 ,201405120412
  		//This Method call will create business events table entry with the latest score updates related to quiz
  		if(!$instructorLogIn){
  			$this->createQuizScoreBusinessEvent($pid,$cid,$user->getStudentID(),$quizId[0],date("Y-m-d H:i:s",time()),$quizSettings['resultScore'],$quizSettings['requiredScore']);
  		}
		$scoreForm ="<br/><div style='height:75px;'>
							<div class='your-score' >Your score: <span class='".$yourScorecls."' style='padding: 2px 4px;'>".$yourScore."</span> </div>
							<div class='required-score' >Required score: <span class='required-score-cls' style='padding: 2px 4px;' >".$requiredScore."</span> </div>
							<div class='quiz-result'>You ".$quizResult."</div>";
						 //</div>";
		/**
		 * Here finding all the mark unviewed lesson names for this quiz.
		 * 
		 */
		$markUnviewed = array();
		$quizSettingRec = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ?',$cid.'|'.$quizId[0] );
	    $quizSettingAssociationRec = ProductQuizLessonAssociationRecord::finder()->findAll('quiz_settings_id = ? ',$quizSettingRec->uid);
	  
	    foreach ( $quizSettingAssociationRec as $associationRecord ){
	   	
	    	if( $associationRecord->markunviewed ){
	    		$videos = VideoRecord::finder()->find('content_id = ? ',$associationRecord->lesson_id);
	    		array_push($markUnviewed, $videos->name);
	    	}
	    }	
	    $markUnviewStr = "<ul>";
	    foreach ( $markUnviewed as $markUnview ){
	    	$markUnviewStr = $markUnviewStr."<li>".$markUnview."</li>";
	    }
	    $markUnviewStr = $markUnviewStr."</ul>";
	    $markUnviewMsg ="<br><br><div id='reset-msg ' class='reset-msg-cls  quiz-msg'><h1>You failed this evaluation.</h1><p>The following course contents must be viewed or completed again before you can make a new attempt to take this evaluation:</p>".$markUnviewStr."</div>";
						
	    /**
	     * Here If student failed the quiz and “Lessons to mark unviewed on failure” option was active
	     * then we are showing the mark unview message in summary tab.
	     */	
		$scoreForm .=($quizResult == 'passed') ? 
					"</div>" : 
					((sizeof($markUnviewed) > 0 ) ? $markUnviewMsg."<div id='quiz-reset'><p>To reset this evaluation, click the “Reset” </p></div></div>" : "<div id='quiz-reset'></div></div>");
		if( $quizSettings['requiredPass'] == 0 ){
			$html = $answeredDetails ." <br> <div class='your-score' >Your score: <span class='".$yourScorecls."' style='padding: 2px 4px;'>".$yourScore."</span> </div>";
		}else if( $quizSettings['postEvalution'] == 1 ){
			$html = $scoreForm;
			
		}else if( $quizSettings['postEvalution'] > 1 ||  $quizSettings['requiredPass'] == 0 ){
			$html = $answeredDetails.$scoreForm;
			
		}
		SWPLogManager::log("The summary of the particular quiz is ",array("summary"=> $html),TLogger::INFO,$this,"getQuizSummary","SWP");
		return $html;
	}
	
	/**
	 * 2014070937
	 * This method is used to Create Business Events Entry for the Quiz Scores CAlculations 
	 * When ever user clicked on the summary tab then we are going to calculate the quiz score and 
	 * we will capture the Quiz Score calculation Event and register in to Business Events Table 
	 * @param unknown_type $course_instance_id
	 * @param unknown_type $course_id
	 * @param unknown_type $student_id
	 * @param unknown_type $task_status_id
	 * @param unknown_type $thread_id
	 * 201405140925
	 */
	public function createQuizScoreBusinessEvent($course_instance_id , $course_id , $student_id , $quiz_id,$evaluation_date,$quiz_score,$passing_score){
		$quizScoreDetails =  array();
		$quizScoreDetails['product_id']	 	= $course_instance_id;
		$quizScoreDetails['course_id']	 	= $course_id;
		$quizScoreDetails['student_id']	 	= $student_id;
		$quizScoreDetails['quiz_id']	 	= $quiz_id;
		$quizScoreDetails['evaluation_date']= (string)$evaluation_date;
		$quizScoreDetails['quiz_score']	 	= $quiz_score;
		$quizScoreDetails['passing_score']	= $passing_score;
		$quizScore = json_encode($quizScoreDetails);
		if($quizScore){
			$businessEvent = new BusinessEventsRecord();
			$businessEvent->createEventsRecord(BusinessEventsRecord::$QUIZ_SCORE , $quizScore);
		}
	}
	
	/**
	 * This method is Used for the finding the Quiz Question is Attempted Correctly or wrong
	 * @param unknown_type $questionID
	 * @param unknown_type $isFromDirectQuestion
	 * 2014070937 , 201405120412
	 */
	public function calculateQuizAnswerAttemptFailureCount($isQuestionPassed , $questionID){
		
		$user = Prado::getApplication()->getUser();
	    $pid = $user->getProductID();
	    $cid = $user->getContentID();
		$failureAttem  =	0;
		
		$question = QuizRecord::finder()->findByPk($questionID);
		
		$failureAttempts = QuizQuesFailureAttemptRecord::finder()->find('course_id = ? AND course_instance_id = ? AND question_id=?', array($cid, $pid,$questionID));
		if(count($failureAttempts) <= 0){
			$failureAttempts = new QuizQuesFailureAttemptRecord();
			$failureAttempts->course_instance_id	= $pid;
			$failureAttempts->course_id				= $cid;
			$failureAttempts->quiz_id				= $question->parent_id;
			$failureAttempts->question_id			= $questionID;
			$failureAttempts->failureattempts		= 0;
		} 
		
		$failureAttem = $failureAttempts->failureattempts;
		if(! $isQuestionPassed){
			$failureAttem = $failureAttem +1;
			$isQuestionPassed = "0";
		} else {
			$failureAttem = $failureAttem +0;
			$isQuestionPassed = "1";
		}
		
		$failureAttempts->failureattempts		= $failureAttem;
		$failureAttempts->save();
		
		$this->createQuizAnswerAttemptBusinessEvent($pid,$cid,$user->getStudentID(), $question->parent_id, $questionID,$isQuestionPassed,$failureAttem);

		return true;
	}
	
	/**
	 * This method is used to Create Business Events Entry for the Failure Attempts of the Quiz Question 
	 * When ever system recognizes there is an failure quiz question attempt then this method will be invoked
	 * 
	 * @param unknown_type $course_instance_id
	 * @param unknown_type $course_id
	 * @param unknown_type $student_id
	 * @param unknown_type $task_status_id
	 * @param unknown_type $thread_id
	 * 2014070937 , 201405120412
	 */
	public function createQuizAnswerAttemptBusinessEvent($course_instance_id , $course_id , $student_id , $quiz_id,$question_id,$isAnswered_correctly,$incorrect_attempt_count){
		$quizAnsAttemptDetails =  array();
		$quizAnsAttemptDetails['product_id']	 = $course_instance_id;
		$quizAnsAttemptDetails['course_id']	 	 = $course_id;
		$quizAnsAttemptDetails['student_id']	 = $student_id;
		$quizAnsAttemptDetails['quiz_id']	 	 = $quiz_id;
		$quizAnsAttemptDetails['question_id']	 = $question_id;
		$quizAnsAttemptDetails['isAnswered_correctly']	 = $isAnswered_correctly;
		$quizAnsAttemptDetails['incorrect_attempt_count']	 = $incorrect_attempt_count;
		$quizAnsAttempt = json_encode($quizAnsAttemptDetails);
		if($quizAnsAttempt){
			$businessEvent = new BusinessEventsRecord();
			$businessEvent->createEventsRecord(BusinessEventsRecord::$QUIZ_ANSWER_ATTEMPTED , $quizAnsAttempt);
		}
	}
	
	/**
	 * @remotable
	 *
	 */
	public function saveQuizAnswer($q,$answers) {
		SWPLogManager::log("It should sve the answer for a particular quiz passed from front end",array("questionid"=>$q,"answer"=>$answers),TLogger::INFO,$this,"saveQuizAnswer","SWP");
	    $user = Prado::getApplication()->getUser();
	    $pid = $user->getProductID();
	    $cid = $user->getContentID();
	    
	    $question = QuizRecord::finder()->findByPk($q);
	    
	    $isFailureAttempt = false;
	    
	    foreach($answers as $a) {
			
			$rec = null;
			$rec = QuizAnswerResultRecord::finder()->find( 'answer_id = ? AND course_id = ? AND product_id = ? ', array($a[0], $cid, $pid ));
			//201405120412
			if (!$rec) {
				$rec = new QuizAnswerResultRecord(array(
					'question_id'=>$q,
					'answer_id' => $a[0],
					'course_id'=>$cid,
					'product_id'=>$pid
					//user, course 
				));
			}
			
			$answer = QuizAnswerRecord::finder()->findByPk($rec->answer_id);
			$rec->value = $a[1];
			if ($question->qtype == 'numeric question') {
				//20131118750
				//201407290710
				if( $answer->numeric_type == 'Single Value' ){
					$questionResult = $this->numericQuestionEvaluation( $rec->value, $answer->first_value, null );
					$rec->good = (int)$questionResult;
				}else if( $answer->numeric_type == 'Value From Range' ){
					if( $answer->range_limit == 1 ){
						$questionResult = $this->numericQuestionEvaluation( $rec->value, $answer->first_value+1, $answer->second_value-1 );
						$rec->good = (int)$questionResult;
					}else{
						$questionResult = $this->numericQuestionEvaluation( $rec->value, $answer->first_value, $answer->second_value );
						$rec->good = (int)$questionResult;
					}
				}
			} else {
				//2014070937
				//If user selected this answer or the value is already selected then the 
				//$a[1] will be 1 so we need to validate that value is matching the Quiz_Answers Good Value.
				//if the 1==1 then 1 other wise 0 (means if selected value answer or one of the answers then 1 other wise 0 )
				//if we haven't selected anythig then we need not to validate that will be always 0
				if($a[1] == 1){
					$rec->good = ( $rec->value == $answer->good ) ? 1 : 0; 
				} else {
					$rec->good = ( $rec->value == 1 ) ? 1 : 0;
				}
			}
			$rec->save();
	    }
	    
	    SWPLogManager::log("Returns quiz status to front end(whether all quiz questions answered or not)",
		array("quizstatus"=>$quizstatus),TLogger::INFO,$this,"saveQuizAnswer","SWP");
	}
	
	/**
	 * @remotable
	 *
	 */
	public function getQuizAnswerModifiedStatus($q,$answers) {
	    $user = Prado::getApplication()->getUser();
	    $pid = $user->getProductID();
	    $cid = $user->getContentID();
	    
	    $question = QuizRecord::finder()->findByPk($q);
	    $isFailureAttempt = false;
	    $result = array();
	    foreach($answers as $a) {
			$rec = null;
			$rec = QuizAnswerResultRecord::finder()->find( 'answer_id = ? AND course_id = ? AND product_id = ? ', array($a[0], $cid, $pid ));
			if($rec){
				if($rec->value == $a[1]){
					$result = array('isModified'=>false);
				}else{
					$result = array('isModified'=>true);
					break;
				}
			} else {
				$result = array('isModified'=>true);
				break;
			}
	    }
	    return $result;
	}
	
	/**
	 * @remotable
	 *
     * Code to delete the Quiz answer results relate to the given answers list
	 */
	public function deleteQuizAnswer($q,$answers) {
		//201312270330
		SWPLogManager::log('Delete all the answers related to this quiz question ',array("quizid"=>$q),TLogger::INFO,$this,"deleteQuizAnswer","SWP");
		$user = Prado::getApplication()->getUser();
	    $pid = $user->getProductID();
	    $cid = $user->getContentID();
	    $question = QuizRecord::finder()->findByPk($q);
		foreach($answers as $a) {
			QuizAnswerResultRecord::finder()->deleteAll( 'course_id = ? AND product_id = ? AND answer_id = ? ', array($cid, $pid,$a[0] ));
		}
		//$quizstatus = $this->evaluateQuizTrackSeen($question->parent_id, $question->getDbConnection() );
		SWPLogManager::log('It will delete all the corresponding records of the quizquestion ',array("QuizRecrod"=>$q),TLogger::INFO,$this,"deleteQuizAnswer","SWP");
		//return $quizstatus;
	}
	
	
	/**
	 * 
	 * @remotable
	 * 
	 * This method checks if the user has answered all the questions or not. If yes then the quiz
	 * is considered as seen.
	 *
	 * @param parentId is the common ID for all the questions of a given quiz
	 * @param conn - the active database connection
	 */
	public function evaluateQuizTrackSeen( $parentId, $conn, $fromchapterlist, $fromTrackSeen ,$isClickonSummary ) {
		SWPLogManager::log("Returns the status of the quiz",array("parentId"=>$parentId, "Conn"=>$conn, "From chapter list"=>$fromchapterlist, "From Track Seen"=>$fromTrackSeen),TLogger::INFO,$this,"evaluateQuizTrackSeen","SWP");
		$user = Prado::getApplication()->getUser();
		$cid = $user->getContentID();
		$pid = $user->getProductID();
        $questionCount = 0;
        $resultAnswerCount = 0;
       
        $questions = QuizRecord::finder()->findAll('parent_id = ? ',$parentId );
		foreach( $questions as $question ){
			
	   		$questionCount++ ;
   			$rec = QuizAnswerResultRecord::finder()->find( 'question_id = ? AND course_id = ? AND product_id = ? ', array($question->uid, $cid, $pid ));
   			if( $rec ){
   				$resultAnswerCount++;
	   		}
	   	}

		$quizSettings = $this->getQuizSettings( $parentId );
	   	$result = '';
		if( $quizSettings['requiredPass'] == 0 ){
	   		$result = 'regular-quiz-incomplete';//'quizOpen';
	        if ( $isClickonSummary ) {
	        	$result = 'regular-quiz-completed';//'quizClosed';
	        }else{
	        	$user = Prado::getApplication()->getUser();
	   			$pid = $user->getProductID();
		   		$scoresRecord = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$parentId );
	   			if(  count( $scoresRecord ) ){
	   				if( $scoresRecord->passed ){
	        			$result = 'regular-quiz-completed';//'quizClosed';
		        	}else{
		        		$result = 'regular-quiz-incomplete';//'quizOpen';
		        	}
	   			}
	        } 
	        return $result;
	   	}else{
	   		if( $fromchapterlist ){
	   			 
	   			$user = Prado::getApplication()->getUser();
	   			$pid = $user->getProductID();
		   		$scoresRecord = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$parentId );
	   			if(  count( $scoresRecord ) ){
	   				if( $scoresRecord->passed ){
	   					$result = 'required-quiz-passed';
	   				}else{
	   					$result = 'required-quiz-failed';
	   				}
	   			}else{
	   				$result = 'required-quiz-incomplete';
	   			}
	   		} else{

	   			if ( !$isClickonSummary ) {
	   				 
	   				$result =  'required-quiz-incomplete';
	   				 
	   			}else{
	   				if( $quizSettings['quizResult'] == 'passed' ){

	   					$result =  'required-quiz-passed';

	   				}else{

	   					$result =  'required-quiz-failed';
	   				}
	   			}
	   		}
	   		SWPLogManager::log("The result of the quiz",array("Result"=>$result),TLogger::INFO,$this,"evaluateQuizTrackSeen","SWP");
	   		return $result;
	   	}
        
	}
		
	/**
     * @remotable
     * 
     */
	public function getQuiz($id) {
			SWPLogManager::log("It should return the questions of the Quiz",array("quizid"=>$id),TLogger::INFO,$this,"getQuiz","SWP");
			$user = Prado::getApplication()->getUser();

			$pid = $user->getProductID();
			$cid = $user->getContentID();
			//CourseRecord::finder()->withCc('(1=1) ORDER BY ordering')->find('content_id = ?',array($user->getContentID()));
			// Checking whether the login user is an instructor
			$instructorId = $user->getInstructorID();
			if( $user->Uid == $instructorId ){
				$instructorLogIn = true;
			}else{
				$instructorLogIn = false;
			}
			$orderedQuestions = array();
			$qs = array();
			$res = array();
			$quizId = explode("_", $id);
   			$quizSettings = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$cid.'|'.$quizId[0] );
   			$quizScoresRecords = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$quizId[0]);	
			 
	 		if( count( $quizScoresRecords ) ){
	 			$enabledSummary = true;
	 			
	 		}else{
	 			$enabledSummary = false;
	 		}
	 		if( !$enabledSummary ){
	 			$disabledTabs = false;
	 		}else if( $enabledSummary && ( $quizSettings->post_evaluation == 3 || $quizSettings->post_evaluation == 4 ) ){
	 			$disabledTabs = false;
	 		}else if( $instructorLogIn ){
	 			$disabledTabs = false;
	 		} else {
	 			$disabledTabs = true;
	 		}
			if( $quizSettings->randomize_questions  ){
				
				 $questions = QuizRecord::finder()->findAll('parent_id = ? ORDER BY ordering ',$id);
				// var_dump($questions);
			 	 $quizSequenceRecords = ProductQuizSequenceRecord::finder()->findAll('product_id = ? AND quiz_id = ? AND user_id = ? ', $pid,$quizId[0],$user->Uid );
				 if( !count($quizSequenceRecords) ){
				 	 $this->generateProductQuestionSequence($quizId[0]); 
				 }
			 	 foreach ( $questions as $question ){
			 	 	 $quizSequence = ProductQuizSequenceRecord::finder()->find('product_id = ? AND quiz_id = ? AND user_id = ? AND question_id = ?', $pid,$quizId[0],$user->Uid,$question->uid );
			 	 	 $question->name = $quizSequence->ordering ; 
			 	 	 $orderedQuestions[($quizSequence->ordering-1)] = $question;
			 	 }
			 	 $qs = $orderedQuestions;
			 }else{
			 	
				$qs = QuizRecord::finder()->findAll('parent_id = ? ORDER BY ordering ',$id);
			 }
	
			for( $l=0 ; $l < count($qs); $l++ ){	
				$q = $qs[$l];
				
				$answers = $q->answers;
				$ra = array();
				$good = 0;
				if($q->qtype == 'Task')	{
					$ra = array();
				} else if ($q->qtype != 'numeric question'){
					foreach($answers as $a) {
							
						$ua = QuizAnswerResultRecord::finder()->find('answer_id = ? AND course_id = ? AND product_id = ? ',$a->uid, $cid, $pid );
							
						if ($ua && $ua->value > 0 )
						$ch = true;
						else
						$ch = false;
							
						$ra[] = array( 'boxLabel'=>nl2br($a->name), 'name'=>'a'.$q->uid, 'inputValue'=>$a->uid, 'checked'=>$ch );
							
						if ($a->good) $good++;
					}
				} else {
				 	$i=0;
				 	foreach($answers as $a) {
				 		$i++;
				 		$ua = QuizAnswerResultRecord::finder()->find('answer_id = ? AND course_id = ? AND product_id = ? ',$a->uid, $cid, $pid );
				 		$ra[] = array( 'fieldLabel'=>'Answer '.$i,
					                   'name'=>'a'.$q->uid, 
					                   'questionId'=>$q->uid, 
					                   'answerId'=>$a->uid,
					                   'value'=> $ua->value );
				 	}
			    }
			   
			 $unreadCount = null;
			 $taskStatusRecord = '-1';
			 $traingFiles = TrainingFilesRecord::finder()->find('question_id = ? AND product_id = ? ', $q->uid,$pid);
			 $taskStatus = CollaborationToolMgr::getTaskStatus();
			 $reference = LastRunRecord::finder()->find('video_id = ?  AND question_id = ? AND product_id = ? AND content_id = ? AND subject ="taskref" ',$id,$q->uid,$pid,$cid);
			 if( count( $reference ) > 0 ){
			 	
			 $threadRecord = ThreadRecord::finder()->find('reference_id = ?',$reference->uid);
			 $threadUser = ThreadUserRecord :: finder()->find('thread_id = ? AND user_id = ? ',array( $threadRecord->uid,$user->Uid) );
						        
			 if( $threadUser->unread_Post_Count > 0 ){
							      
				$unreadCount = 1;
			 } 
			 for ( $i = 0 ; $i < count($taskStatus); $i++ ) {

			 	if ( $taskStatus[$i]['ID'] == $threadRecord->status ) {
			 			
			 		$taskStatusRecord = $taskStatus[$i];
			 	}
			 }
			 }
	/*	if( $quizSettings->randomize_questions  ){
				
			 	 $quizSequenceRecords = ProductQuizSequenceRecord::finder()->findAll('product_id = ? AND quiz_id = ? AND user_id = ? ', $pid,$quizId[0],$user->Uid );
				 if( !count($quizSequenceRecords) ){
				 	 $this->generateProductQuestionSequence($quizId[0]); 
				 }
			 	 $quizSequence = ProductQuizSequenceRecord::finder()->find('product_id = ? AND quiz_id = ? AND user_id = ? AND question_id = ?', $pid,$quizId[0],$user->Uid,$q->uid );
			 	 $tabTitle = $quizSequence->ordering;
				 
			 }else{
			 	$tabTitle = $q->name; 
			 }*/
			 
			if( count( $reference ) > 0 ){ 	//Checking for quiz's question have thread or not. 
			
				 $taskStatusCode = $taskStatusRecord['ID'];
				 $taskStatusText = $taskStatusRecord['statustext'];
				 $taskStatusCls = $taskStatusRecord['Cls'];
				 $questionTooltip = $taskStatusRecord['lessontooltip'];
				 
				 $fbar =array('xtype'=>'fbarbutton',
				 								'cls'=>'fbarCls'.$taskStatusCode,
				 								'overCls'=>"fbarOverCls".$taskStatusCode,
											    'taskId'=>$threadRecord->uid,
				 								'tooltip'=> $questionTooltip,
				 								'statusId'=>$taskStatusCode
				 								
				   								
				 							  );
				 // array('xtype'=>'toolbar',
				 // 				'cls'=>'taskStatus',
				 // 				'items'=>array('xtype'=>'fbarbutton',
				 // 								'cls'=>'fbarCls'.$taskStatusCode,
				 // 								'overCls'=>"fbarOverCls".$taskStatusCode,
					// 						    'taskId'=>$threadRecord->uid,
				 // 								'tooltip'=> $questionTooltip
				 								
				   								
				 // 							  )
				 // 			   );
			 } elseif ( count( $traingFiles ) > 0 ){			 //Checking for quiz's question have training files and don't have any thread.
			 	
			 	 $taskStatusCode = '-1';
				 $taskStatusText = '-1';
			 	 $taskStatusCls = '';
			 	 $fbar =array('xtype'=>'fbarbutton',
				 							   'cls'=>'training-files-cls',
//				 							   'overCls'=>'fbarAttachOverCls',
			 	 							   'tooltip'=>'Training files'
				 							  );
// 			 	 array('xtype'=>'toolbar',
// 				 				'items'=>array('xtype'=>'fbarbutton',
// 				 							   'cls'=>'training-files-cls',
// //				 							   'overCls'=>'fbarAttachOverCls',
// 			 	 							   'tooltip'=>'Training files'
// 				 							  )
// 				 			   );
			 } else {

				 $taskStatusCode = '-1';
				 $taskStatusText = '-1';
				 $taskStatusCls = '';
				  $fbar = array('xtype'=>'button',
				 								'cls'=>'hidde-fbar-cls'
				 							  );

				   // array('xtype'=>'toolbar',
				 		// 		'items'=>array('xtype'=>'button',
				 		// 						'cls'=>'hidde-fbar-cls'
				 		// 					  )
				 		// 	   );
			 
			 }
			 if($taskStatusCls){
			 	$taskStatusCls = $taskStatusCls.'-quiz';
			 }
			 $description = empty($q->short_description) ? $q->description : $q->short_description.'<br>'.$q->description ;
			 $rq = array(
				'title' => $q->name,
				'layout'=>'anchor',
				'anchor'=>'100% 100%',
			    'overflow'=> 'auto',
			    'bodyStyle'=>'height:100%;overflow-y:auto;',
			 	'postevaluation'=>$quizSettings->post_evaluation,
				'imageUrl'=>$q->firstImage,
				'videoStart'=>$q->from_date,
				'videoId'=>'L'.$q->category_id,
				'uid'=>$q->uid,
				'taskStatusId'=>$taskStatusCode,
			 	'taskId'=>$threadRecord->uid,
				'taskstatus'=>$taskStatusText,
				'iconCls'=>$taskStatusCls,
			 	'disabled'=> $disabledTabs,
			 	'cls'=>'test-tab',
				// 'fbar'=>$fbar,
			 	'badgeTextcount'=>$unreadCount,
				'items' => array(
			 array(
						'value'=>$description,
						'xtype'=>'displayfield',
						'anchor'=> '100%',
			 			'disabled'=>$instructorLogIn
			 //'region' => 'center'
			 ),
			 ($q->qtype == 'numeric question') ?
			 array(
							  'xtype'=> 'fieldset',
							  'anchor'=> '100% ',
							  'overflow'=> 'auto',
							  'frame'=>false,
			 				  'disabled'=> ( $instructorLogIn || ( $quizSettings->post_evaluation == 3 && count( $quizScoresRecords )) )? true : false,
							  'defaults'=>array('xtype'=>'textfield','allowBlank'=>false),
					
			 //'region' => 'south',
			 //'autoHeight'=>true,
							  'items'=>$ra
			 )
			 :array(
							  'xtype'=> ($good>1) ? 'checkboxgroup' : 'radiogroup',
							  'columns'=> 1,
							  'vertcal'=> true,
							  'anchor'=> '100% ',
							  'overflow'=> 'auto',
			 				  'disabled'=> ($instructorLogIn || ($quizSettings->post_evaluation == 3 && count( $quizScoresRecords )))? true : false,
							  'questionId'=>$q->uid,
			 				  'cls'=>'quiz-question',
			 			
			 //'region' => 'south',
			 //'autoHeight'=>true,
							  'items'=>$ra
			 ),
			 $fbar
				)
				);
					
				$res[] = $rq;
					
			}

			$res[] = array(
				'title' => 'Summary',
				'videoId'=>'L',
				'layout'=>'card',
				'postevaluation'=>$quizSettings->post_evaluation //201407070707
			);
			SWPLogManager::log("Returns the questions of the Quiz",array("enabledsummary"=>$enabledSummary,items=>$res),TLogger::INFO,$this,"getQuiz","SWP");
			return array("enabledsummary"=>$enabledSummary,items=>$res);
		}
	
	/**
	 * @remotable
	 * get the languages records from the cms_languages table.
	 * and appean one more record with lang:noc and name : No captoins
	 */
		
	public function getLanguages( $params ){
		SWPLogManager::log("It should return all the languages associated with the lesson( for caption)",array("params"=>$params),TLogger::INFO,$this,"getLanguages","SWP");
//		$defLang = new VideoCaptionsRecord();
//		$defLang->language_id ='No Captions';
		$user = Prado::getApplication()->getUser();
		$all = array();
		$videoId = $params['video_id'];
		
		if( $videoId == null ){
			
			$defLang = new LanguageRecord();
			$defLang->name ='No Captions';
			$captions = LanguageRecord::finder()->findAll();
			foreach ( $captions as $caption ){
				$all[]=$caption;
			}
			/*
			$course = CourseRecord::finder()->withCc('(1=1) ORDER BY ordering')->find('content_id = ?',array($user->getContentID()));

			$cc = $course->cc; //VideoRecord::finder()->findAll();
			//return TVarDumper::dump($videos);
			foreach($cc as $c) {

				$v  = $c->content;
				$captions = VideoCaptionsRecord::finder()->findAll('video_id = ? ' , $v->content_id );
				if ($v->type==0) {

					foreach ( $captions as $caption ){
						$all[]=$caption; 
					}
				}
			}*/

		}else{
			
			$defLang = new VideoCaptionsRecord();
			$defLang->language_id ='No Captions';
			$captions = VideoCaptionsRecord::finder()->findAll('video_id = ? ' , $videoId );
				
			foreach ( $captions as $caption ){
//				$lang_record = LanguageRecord::finder()->find(' name = ? ' , $caption->language_id );
				$all[]=$caption; 
			}
		}
		array_unshift( $all , $defLang );
		SWPLogManager::log("The captions associated with the lesson",array("allcaption"=>$all),TLogger::INFO,$this,"getLanguages","SWP");
		return $all;
	}

	/**
     * @remotable
     *
     */
    public function deleteCourseContentRecord($params) {
	   SWPLogManager::log("It should delte lesson/quiz from course content grid",array("params"=>$params),TLogger::INFO,$this,"deleteCourseContentRecord","SWP");
	   list($content_id,$course_id) = $params;
    	$courseRecord = CourseContentRecord::finder()->find( 'product_id = ? AND video_id =? ', $course_id,$content_id );
	   
		if( $courseRecord->type == 0 ){
			
			$courseQuizes = CourseContentRecord::finder()->findAll( 'product_id = ? AND type = 1 ', $course_id );
			foreach ( $courseQuizes as $courseQuiz ){
				
				$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find( 'coursecontent_id = ?' , $course_id.'|'.$courseQuiz->video_id  );
				ProductQuizLessonAssociationRecord::finder()->deleteAll( 'quiz_settings_id = ? AND lesson_id = ? ', $quizSettingsRecord->uid, $content_id );
			}
		}else{
			
			$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find( 'coursecontent_id = ?' , $course_id.'|'.$content_id  );
			ProductQuizLessonAssociationRecord::finder()->deleteAll( 'quiz_settings_id = ? ', $quizSettingsRecord->uid );
		    ProductQuizSettingsRecord::finder()->deleteAll( 'coursecontent_id = ?' , $course_id.'|'.$content_id  );
		
		}
		//Either lesson or quiz when it is deleted from the course content related lesson settings we are deleteing 
		//And Which content is having this as a content we need to delete that record from the settings of that lesson
	   $this->deleteLessonSetings($course_id , $content_id);
	   
	   $course = CourseRecord::finder()->find('content_id = ?',$course_id);

	   $conn = $course->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM products_videos WHERE product_id = :prodid AND video_id = :cid");
        $cmd->bindValue(':cid', $content_id);
        $cmd->bindValue(':prodid', $course_id);
        $cmd->execute();
	   
	   $course->saveToAvalton(true);
	   SWPLogManager::log("course content grid deleted succesfully",array("result"=>true),TLogger::INFO,$this,"deleteCourseContentRecord","SWP");
	   return true;
	
    }
    
    public function deleteLessonSetings($course_id , $content_id){
    		$courseContentRecord = CourseContentRecord::finder()->find( 'product_id = ? AND video_id =? ', $course_id,$content_id );
    		if(count($courseContentRecord) > 0){
    			//Delete the lesson settings of this lesson($content_id).
    			ProductLessonSettingRecord::finder()->deleteAll('course_id = ? AND lesson_id = ? ',array($course_id,$content_id ));
    			
    			//delete the settings of the content which is having this lesson as the one of the locked content
    			$lessonSettings = ProductLessonSettingRecord::finder()->deleteAll('course_id = ? AND content_id =? AND setting_value = 1',array($course_id,$content_id ));
    		}
    }
    /**
     * @remotable
     */
    public function deleteVideoCaptionRecord( $params ){
    	SWPLogManager::log("It should delet the video caption from the lesson",array("params"=>$params),TLogger::INFO,$this,"deleteVideoCaptionRecord","SWP");
    	$caption = VideoCaptionsRecord::finder()->find('uid = ? ',  $params  );
    	if(count($caption)){
	    	$caption->delete();
	    	SWPLogManager::log("caption deleted succesfully",null,TLogger::INFO,$this,"deleteVideoCaptionRecord","SWP");
	    	return true;
    	}
    	SWPLogManager::log("No captions found for that id",null,TLogger::INFO,$this,"deleteVideoCaptionRecord","SWP");
       return false;
    }
    /**
     * @remotable
     * This method is used to finalize and save the course to avalton.
     * @param integer content_id - this unique ID is used to retrieve the course that the user 
              is trying to finalize.
     * 
     */
    public function finalizeCourseContent( $params ) {
    	SWPLogManager::log("It should be able to conver a course to final course",array("params"=>$params),TLogger::INFO,$this,"finalizeCourseContent","SWP");
		$content_id = $params;
		$course = CourseRecord::finder()->find('content_id = ?',$content_id);
		
		if ( $course != null ) {
		    $course->setFinalized(true);
			$course->save();
			$this->saveCourseRecordToAvalton($content_id);
			
			//This method will prepare data which is required for the course dimension table.
			$this->prepareCourseDimensionEntryData($content_id,$course->name);
			
			SWPLogManager::log("Course finalized succesfully",array("result"=>true),TLogger::INFO,$this,"finalizeCourseContent","SWP");
			return true;
		} else {
			SWPLogManager::log('Unable to finalize the course content!',array("result"=>false),TLogger::INFO,$this,"finalizeCourseContent","SWP");
		    return 'Unable to finalize the course content!';
		}
    }

    /**
     * @remotable
     *
     */
    public function saveCourseRecordToAvalton($id) {

	   SWPLogManager::log('It should save the record in Avalton',array("id"=>$id),TLogger::INFO,$this,"saveCourseRecordToAvalton","SWP");
    	if (!$id) {
    		SWPLogManager::log('can not save the record in Avalton as id is not there ',array(),TLogger::INFO,$this,"saveCourseRecordToAvalton","SWP");
    		return false;
    	}
    	$course = CourseRecord::finder()->find('content_id = ?',$id);
    	$course->saveToAvalton(true);
    	SWPLogManager::log('saved to avalton succesfully',array("id"=>$id),TLogger::INFO,$this,"saveCourseRecordToAvalton","SWP");
    	return true;
	
    }
    
   /**
    * This function helps to log the last run deatails into the table last_run_info table
    * with the details like chapter id , vedioid,username,contentid,seeekposition of video and question idex if user is viewing the quiz.
    */
    private function logLastRun($chapterId , $videoId,$seekposition,$question,$language,$blockValue){
    	SWPLogManager::log('It should able to save the last run info details',array("chapterId"=>$chapterId, "videoId"=>$videoId, "seekposition"=>$seekposition,
		"question"=>$question, "language"=>$language, "blockValue"=>$blockValue),TLogger::INFO,$this,"logLastRun","SWP");
        $user = Prado::getApplication()->getUser();
        $contentid = $user->ContentID ;
        
        // We are checking if any record exist for the combination of user_id, product_id and content_id, 
        // if yes we are updating the same record with the new value otherwise creating a new record for the last_run_info table.
        
        $lr = LastRunRecord::finder()->find('user_id = ?  AND content_id = ? AND subject = "lastrun" AND product_id = ? order by uid DESC',array(   $user->Uid , $contentid ,$user->getProductID()));
        if(!$lr){
            $lr = new LastRunRecord;
        }
        
        $lr->chapter_id = $chapterId;
        $lr->content_id =$contentid ;
        $lr->user_id =$user->Uid;  
        $lr->product_id=$user->getProductID();
        $lr->video_id =$videoId;
        $lr->position=$seekposition;
        $lr->question_id=$question;
        $lr->subject = "lastrun";
        $lr->language=$language;
		
		if( $blockValue ) {
		
			$lr->blockvalue = $blockValue;
		}
		
        $lr->save();
        SWPLogManager::log('Last run info details saved succesfully',array("record"=>$lr),TLogger::INFO,$this,"logLastRun","SWP");
        return true;
    }
    
    
 	/**
    * @remotable
    * 
    * This function will capture the details of the user having role of instructor.
    * This is called from logTransfer function in classroom.js file.
    * 
    * 
    */
    public function captureVideoDetails( $chapterId ,$videoId,$seekposition,$question,$language,$name,$subject, $chapterName, $ordering,$blockValue ){
        SWPLogManager::log('It should able to save the last run info details',array("chapterId"=>$chapterId, "videoId"=>$videoId, "seekposition"=>$seekposition,
"question"=>$question, "language"=>$language,"name"=>$name,"subject"=>$subject, "chapterName"=>$chapterName,"ordering"=>$ordering, "blockValue"=>$blockValue),TLogger::INFO,$this,"captureVideoDetails","SWP");
    	$user = Prado::getApplication()->getUser();
        $contentid = $user->ContentID ;
        if( empty( $subject )){
        	$subject = "instructorusage";
        }
        if($question == -1){
        	$question = null;
        }
        
       if($chapterId == 0){
        	$chapterId = null;
        }
        $seekTime = explode(".", $seekposition);
        $lr = new LastRunRecord;
        $lr->chapter_id = $chapterId;
        $lr->content_id = $contentid ;
        $lr->user_id =$user->Uid;  
        $lr->video_id =$videoId;
        $lr->position=$seekTime[0];
        $lr->question_id=$question;
        $lr->timestamp = date("Y-m-d H:i:s",time());
        $lr->subject =$subject;
        $lr->product_id= $user->getProductID();
        $lr->language=$language;
        $lr->name = $name;
        $lr->chaptername = $chapterName;
		
		if( $blockValue ){
			
			$lr->blockvalue = $blockValue;
		}
		
        if ( $ordering ){
        
	        $lr->ordering = $ordering;
        }
		$lr->save();
		SWPLogManager::log('Last run info details saved succesfully from capture video details',array("record"=>$lr),TLogger::INFO,$this,"logLastRun","SWP");
        return $lr->uid;
    }
    
    
    
    
     /**
     * @remotable
     *
     *This function is called directly from the ui. after loading the view port.with the logged in user and content id finds the last run info records
     *and returns the record.
     */
    public function getLastRun($params=array()) {
        SWPLogManager::log('It should return the last run infor records',array("params"=>$params),TLogger::INFO,$this,"getLastRun","SWP");
		$user = Prado::getApplication()->getUser();
		
		$lr = LastRunRecord::finder()->find('user_id = ?  AND content_id = ? AND subject="lastrun" AND product_id = ? order by uid DESC ',array( $user->Uid , $user->getContentID() , $user->getProductID() ));
		
		$res['uid']=$lr->uid;
		$res['user_id']=$lr->user_id;
		$res['chapter_id']=$lr->chapter_id;
		$res['position']=$lr->position;
		$res['video_id']=$lr->video_id;
		$res['question_id']=$lr->question_id;
		$res['content_id']=$lr->content_id;
		$res['product_id']=$lr->product_id;
		$res['language']=$lr->language;
		SWPLogManager::log('Returns the last run record from Last run',array("result"=>$res),TLogger::INFO,$this,"getLastRun","SWP");
		return array($res);
    }
    
    public function logReference( $chapter,$videoId,$seekValue,$questionInd ,$language,$name,$subject, $chapterName, $ordering ) {
  		
    	return $this->captureVideoDetails( $chapter,$videoId,$seekValue,$questionInd ,$language,$name,$subject, $chapterName, $ordering );
  }  

  /**
   *  @remotable
   * 
   * 
   */
  
  public function getVideoCaptionSettings( $params ) {
  		SWPLogManager::log('It should returns the settings related record',array("params"=>$params),TLogger::INFO,$this,"getVideoCaptionSettings","SWP");
		$user = Prado::getApplication()->getUser();
		$records = UserSettingsRecord::finder()->findAll('enable = 1 AND user_id = ? AND ( content_id IS NULL OR content_id = ? ) ',array(  $user->Uid ,$user->getContentID() ) );
		
		// If no settings configuration is there for that particular user, it will first create the entry
		// in settings table then it will return the record.
	
		if ( !count($records) ){
			$aur = new ActiveUrlRecord();
			$aur->createUsetSettings( $user->Uid);
			$records = UserSettingsRecord::finder()->findAll('enable = 1 AND user_id = ? AND ( content_id IS NULL OR content_id = ? )',array(  $user->Uid ,$user->getContentID() ) );
		} 
		SWPLogManager::log('Returns the settings related record',array("result"=>$records),TLogger::INFO,$this,"getVideoCaptionSettings","SWP");
	  	return $records;
  }
  
  /**
   *  @remotable
   * 
   * 
   */
  
  public function saveVideoCaptionSettings( $params ) {
		SWPLogManager::log('It should be able to save the changed settings',array("params"=>$params),TLogger::INFO,$this,"saveVideoCaptionSettings","SWP");
  		$user = Prado::getApplication()->getUser();
  		 if( !empty($params['content_id']) ) {
  			$records = UserSettingsRecord::finder()->findAll('`key`=? and user_id= ? AND content_id = ? ',array($params['key'], $user->Uid,$params['content_id']));
  		} else {
  			$records = UserSettingsRecord::finder()->findAll('`key`=? and user_id= ?',array($params['key'], $user->Uid));
  		}
  	
  		if (count($records) > 0 ){
  			foreach($records as $record) {
  				//var_dump( $record );
  				$record->name 		=	$params['name'];
  				$record->key		=	$params['key'];
  				$record->value		=	$params['value'];
  				$record->user_id   = 	$user->Uid; 
  				
  				$record->save();
  			}
  			SWPLogManager::log('Settings saved succesfully',array("result"=>true),TLogger::INFO,$this,"saveVideoCaptionSettings","SWP");
  		} 
  }
 
   
  /**
   *  @remotable
   * 
   * 
   */
 public  function receiveMessage($stompUrl="tcp://localhost:61613",$consumerKey){
		SWPLogManager::log('It should be able to get the message from the other window(inter window communication) ',array("stompUrl"=>$stompUrl, "consumerKey"=>$consumerKey),TLogger::INFO,$this,"receiveMessage","SWP");
		
		/*$con = new Stomp($stompUrl);
		$con->connect();
		$con->setReadTimeout(1);
		$con->subscribe($consumerKey,array('activemq.prefetchSize' => 1 ));

	// Infinite loop
            try {
            	 $con->begin("readunreadMessages");
                 /*
	            do {
		              $msg = $con->readFrame();

		             if ( $msg != null) {
			
			             echo "Received message with body '$msg->body'\n";

			             process($msg->body);

                                                    $con->commit("readunreadMessages");
		             } else {
			             echo "No Messages to import\n";
		             }
	             }  while ( $msg != null) ;
                                       
	              $msg = $con->readFrame();
	                 if ( $msg != null) {
	              $con->ack($msg);
	              
	              }
             }catch(Exception $exp){
                 echo 'Caught exception: ',  $exp->getMessage(), "\n";         
           }

	$con->disconnect();
        	return $msg != null ? $msg->body : null;*/
        	// return null;
        	$record = MessageQueueRecord::finder()->find('`consumer_key`=? and subscribed= false ORDER BY createddate ASC LIMIT 1',$consumerKey);
        	
        	$message = '';
        	if ( count($record) > 0 ){
        	
					$record->subscribed = 1;
					$record->save();

					$message =  $record->message;
			
			}else{
				return null;
			} 
			SWPLogManager::log('It should be able to get the message from the other window(inter window communication) ',array("message"=>$message),TLogger::INFO,$this,"receiveMessage","SWP");
			return $message;
   } //receiveMessage

 
	

   /**
    * @remotable
    */

  public function sendMessage($msg,$stomp_url="tcp://localhost:61613",$send_msg_key) {
			SWPLogManager::log('It should be able to save the message in db(inter window communication) ',array("message"=>$msg, "stompUrl"=>$stompUrl, "send_msg_key"=>$send_msg_key),TLogger::INFO,$this,"sendMessage","SWP");
	     /* $stompProducer = new Stomp($stomp_url);
   
	      $stompProducer->connect();
	      $success = $stompProducer->send($send_msg_key, $msg);
	      //echo "Sent message with body 'test'\n";
	      $stompProducer->disconnect();
	      */

	       $messageQueue = new MessageQueueRecord();
	      $messageQueue->consumer_key = $send_msg_key;
	      $messageQueue->message = $msg;
	      $messageQueue->subscribed = false;
	      $success = $messageQueue->save();
		  SWPLogManager::log('It should be able to save the message in db(inter window communication) ',array("success"=>$success),TLogger::INFO,$this,"sendMessage","SWP");
	return $success;

   } 
   
   /**
    * @remotable
    */
	public function createSettingsToSettingsLessQuizes( $settingsLessQuizes ) {
		
		foreach($settingsLessQuizes as $settingsLessQuiz ) { 
			
			$courseContentRec = new CourseContentRecord();
			 
			$courseContentRec->createQuizSettings( $settingsLessQuiz );
		}
		
	}
	
	/**
    * @remotable
    */
  public function getQuizSettings( $quizId ) {
		SWPLogManager::log('It should return the settings for all the quizes of a particular lesson',array("quizId"=>$quizId),TLogger::INFO,$this,"getQuizSettings","SWP");
      	$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$cid = $user->getContentID();
		$questions = QuizRecord::finder()->findAll('parent_id=? ORDER BY ordering ',$quizId);
		$goodAnswersCount = 0;
		$questionsCount = 0;
   		foreach($questions as $question) {
			$questionsCount++ ;
			unset($goodAnswers);
 			if ( $question->qtype === 'numeric question' ) {
 				//
 				// For numeric questions - all the options are expected to be correct answers
 				//
 				$goodAnswers = QuizAnswerRecord::finder()->findAll(' quiz_id = ?', $question->uid );
 				// For numeric type question value can also be zero . and fetch the quiz answer results in the order of the quiz answer shown in the question tab. 
 				// i.e based on the answer ordering filed.
 				$sql = " SELECT qr.* FROM quiz_answer_results qr JOIN quiz_answers qa ON ( qa.uid = qr.answer_id) "
						." WHERE qa.quiz_id = :quizid AND  qr.value  like '%'  AND qr.course_id = :course_id AND qr.product_id = :prodid ORDER BY qa.ordering ";
 			} else {
 			 	//
 				//  questions of type other than numeric, fetch the quiz answer results in the order of the quiz answer shown in the question tab. 
 				// i.e based on the answer ordering filed. and value of the quiz_answer_results is not zero i.e fetch the correct answers
 				//
 			 	$sql = " SELECT qr.* FROM quiz_answer_results qr JOIN quiz_answers qa ON ( qa.uid = qr.answer_id) "
						." WHERE qa.quiz_id = :quizid AND  qr.value  like '%' AND qr.value !=0  AND qr.course_id = :course_id AND qr.product_id = :prodid ORDER BY qa.ordering ";
 				$goodAnswers = QuizAnswerRecord::finder()->findAll(' quiz_id = ? AND good = 1 ', $question->uid );
 			}
 			
 			if( $question->qtype != 'Task'){
   				$conn = $question->getDbConnection();
				$conn->setActive(true);
				$cmd = $conn->createCommand( $sql );
				$cmd->bindValue(':quizid', $question->uid );
				$cmd->bindValue(':course_id', $cid );
				$cmd->bindValue(':prodid', $pid );
				$treader = $cmd->query();
				
				$aa = array();
				
				foreach ( $treader->readAll() as $qas ){

					array_push( $aa , new QuizAnswerResultRecord( $qas ) );
				}

				$isCorrect = 0;
			
				foreach($aa as $a) { 
					
					if ( $a->good == 0  ) {
						//
						// One or more answer result is wrong and hence answer to this question is 
						// not correct. 
						//
						$isCorrect = 0;
						break;
					} else {
	
						if ( $a->good == 1 ) {
							$isCorrect = 1;
						} else {
							$isCorrect = 0;
							break;
						}
					}
				}
				
				//
				// It is possible that a question may have 2 correct answers (e.g in case of multiple answers type question) and the 
				// user might have selected only one valid answer. In such case we need to count such answer as incorrect.
				//
				if ( $isCorrect == 1 && ( count($aa) < count($goodAnswers) ) ) {
					$isCorrect = 0;
				}
 			} else {
 				$lastRunInfoRecords = LastRunRecord::finder()->find('product_id=? AND content_id=? AND question_id = ? AND subject = "taskref"',
 																	 array($pid,$cid,$question->uid));
				if(count($lastRunInfoRecords) > 0){
					$taskThread = ThreadRecord::finder()->find('product_id = ? AND content_id = ? AND reference_id = ? AND thread_type_id = 3',
												array($pid,$cid,$lastRunInfoRecords->uid));
					if(count($taskThread) > 0){
						if($taskThread->status == '99'){
							$isCorrect = 1;
						}else{
							$isCorrect = 0;
						}
					} else{
						//If we are not able to find the thread means thread is not created
						$isCorrect = 0;
					}
				} else {
					//if last run record it self not there then it is not attempted and not answered (Thread is completed).
					$isCorrect = 0;
				}
 			}
			if( $isCorrect == 1 ){
					$goodAnswersCount++;
			} 
   		}
   		
   		$quizId = explode("_", $quizId);
   		$quizSettings = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$cid.'|'.$quizId[0] );
   		$requiredScore = $quizSettings->passing_score;
  		$res = ( $goodAnswersCount/$questionsCount )*100;
  		$resultScore = round($res, 0);
		if( $resultScore  >= $requiredScore ){
			$quizResult = 'passed';
		}else{
			$quizResult = 'failed';
		}
		  $quizSettings = array(
				'resultScore' =>$resultScore,
				'requiredScore'=>$requiredScore,
				'quizResult'=>$quizResult,
		  		'requiredPass'=>$quizSettings->requiredpass,
		  		'requiredSubsequent'=>$quizSettings->required_subsequent,
		  		'postEvalution'=>$quizSettings->post_evaluation,
		  		'randomizeQuestions'=>$quizSettings->randomize_questions
			);
			SWPLogManager::log('The settings for the particular course is : ',array("quizSettings"=>$quizSettings),TLogger::INFO,$this,"getQuizSettings","SWP");
		return $quizSettings;
  }
	
   /**
    * @remotable
    */
	public function resetQuiz( $quizid ) {
		SWPLogManager::log('When the user fails a quiz, she/he can attempt the quiz again by resetting the quiz ',array("quizid"=>$quizid),TLogger::INFO,$this,"resetQuiz","SWP");
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$cid = $user->getContentID();
		$quizId = explode("_", $quizid);
		$quizScoresRecords = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$quizId[0]);
			
		if( count($quizScoresRecords) ){
		
			$quizScoresRecords->resetquiz = 1 ;
			$quizScoresRecords->save();
		}
		
		$this->generateProductQuestionSequence($quizId[0]);
		
		$questions = QuizRecord::finder()->findAll('parent_id = ? ',$quizId[0]);
		foreach ( $questions as $question ){
		
			QuizAnswerResultRecord::finder()->deleteAll( 'course_id = ? AND product_id = ? AND question_id = ? ', array($cid, $pid,$question->uid ));
		}
		SWPLogManager::log('It will delete all the corresponding records of the quiz ',array("quizScoresRecords"=>$quizScoresRecords),TLogger::INFO,$this,"resetQuiz","SWP");
		return $quizScoresRecords ; 
	}
   
    /**
    * @remotable
    */
	public function generateProductQuestionSequence( $quizid ) {
		SWPLogManager::log('After reseting the quiz, the question sequence should change',array("quizid"=>$quizid),TLogger::INFO,$this,"generateProductQuestionSequence","SWP");
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		
		ProductQuizSequenceRecord::finder()->deleteAll('product_id = ? AND quiz_id = ? AND user_id = ? ', $pid,$quizid,$user->Uid );
		
   		$questions = QuizRecord::finder()->findAll('parent_id = ? ',$quizid );
   		$min = 1;
   		$max = count($questions);
   		$k = 0;
		for ($i=0; $i<$max; $i++) {
		   $num[$i] = rand($min,$max);
		   for ($j=0; $j<$i; $j++) {             
		      while ($num[$j] == $num[$i]){               
		         $num[$i] = rand($min,$max);               
		         $j = 0;             
		      }           
		   }    
		}
   		foreach ($questions as $question ){
   			
	   		$productQuizSequence = new ProductQuizSequenceRecord();
	   		$productQuizSequence->product_id = $pid ;
	   		$productQuizSequence->quiz_id = $quizid ;
	   		$productQuizSequence->question_id = $question->uid ;
	   		$productQuizSequence->ordering = $num[$k];
	   		$productQuizSequence->user_id = $user->Uid ;
	   		$k++;
	   		$productQuizSequence->save();
   		}
		SWPLogManager::log('Product quiz sequence changed, and saved in db',null,TLogger::INFO,$this,"generateProductQuestionSequence","SWP");
	} 
	
	/**
    * @remotable
    */
	public function getChapterAndLession( $blockNumber ) {
		SWPLogManager::log('Based on the block number passed it should return the corresponding lesson and chapter of the course',
		array("blockNumber"=>$blockNumber),TLogger::INFO,$this,"getChapterAndLession","SWP");
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$finalChaperKey = "L";
		$startTime = 0 ;
		if($pid) {
			$productTimeBlockRec = ProductTimeBlocksRecord::finder()->find('product_id=? and blockno=?', $pid , $blockNumber);
			if($productTimeBlockRec){
				//in the frent end code hidden chapter is not available in the chapter store and we need that in that store
				//to point to that chapter.
				//As hidden chapter is also in the same video of a chapter exists , we are querying for the chapter which exists 
				//before this hidden chapter and we are pointing to that chapter. 
				
				$chapterID = $productTimeBlockRec->chapter_id;
				$lessionID = $productTimeBlockRec->video_id;
				
				$chapterRec = CuepointRecord::finder()->find('videos_id=? and uid=?', $lessionID , $chapterID);
				if($chapterRec) {
					if($chapterRec->ishidden){
						$actualChapterRec = CuepointRecord::finder()->find('videos_id=? and ishidden = ? and uid < ?', array($lessionID ,0, $chapterID));
						if($actualChapterRec) {
							$chapterID = $actualChapterRec->uid;
						}
					}
				}
				
				$startTime = $productTimeBlockRec->starttime;
				if($chapterID && $lessionID) {
					$finalChaperKey = $finalChaperKey.$lessionID."_".$chapterID;
				}
			}
		}
		SWPLogManager::log('The block number corresponds to the following lesson and chapter',
		array("chapterKey"=>$finalChaperKey,"seekTime"=>$startTime),TLogger::INFO,$this,"getChapterAndLession","SWP");
		return array("chapterKey"=>$finalChaperKey,"seekTime"=>$startTime);
	}
	
	
   /**
    * @remotable 
    * 
    **/
	public function createCourseInstanceBlocks($data) {
	  SWPLogManager::log('It should create the corresponding block number of a particlar chapter passed as an argument',
		array("data"=>$data),TLogger::INFO,$this,"createCourseInstanceBlocks","SWP");
 	  $course = CourseRecord::finder()->withCc('(1=1) ORDER BY ordering')->find('content_id = ?',array($data['content_id']));
 	
 	  $cc = $course->cc; 
 	  $totalTmpTime =0;
 	  $tmpblock = 1;
 	  
 	   foreach($cc as $c) {
 	      $v  = $c->content;
 	    	
 	      if ( $v->type==0 ) {
 	         $chapterTmpstartsec =0;
 	      	 $chapters = CuepointRecord::finder()->findAll('videos_id = ?',$v->content_id);
 	      	 
 	      	  for($j=0; $j < count( $chapters ) ;$j++) {
					$ch = $chapters[$j];
	 	      	  	$chapterStartSec =$chapterTmpstartsec;
	 	      	  	if( !empty($chapters[$j+1])){
	 	      	  		$chapterEndSec = $chapters[$j+1]->start;
	 	      	  	} else {
	 	      	  		//201310280458 , 201405221253
	 	      	  		$chapterEndSec = $ch->stop;
	 	      	  	}
	 	      	  	$chapterTmpEndsec = $chapterTmpstartsec + 10;
 	      	  	
	 	      	  	for( ;$chapterStartSec < $chapterEndSec ;){
	 	      	  		
	 	      	  		$chapterId = $ch->uid;

	 	      	  		if( ($ch->ishidden == '1') || ($ch->ishidden) ){
	 	      	  			
	 	      	  			for($l = $j -1 ; $l>=0 ; $l--){
	 	      	  				if($chapters[$l]->ishidden == 0 || !$chapters[$l]->ishidden) {
	 	      	  					$chapterId = $chapters[$l]->uid;
	 	      	  					break; 
	 	      	  				}
	 	      	  			}
	 	      	  		}
	 	      	  		
	 	      	  		
	 	      	  		$productTimeBlock = new ProductTimeBlocksRecord;
			 			$productTimeBlock->product_id = $data['product_id']; 
			 			$productTimeBlock->video_id = $v->content_id; 
			 			$productTimeBlock->chapter_id = $chapterId;
			 			$productTimeBlock->starttime = $chapterTmpstartsec;
			 			$productTimeBlock->endtime = $chapterTmpEndsec;
			 			$productTimeBlock->blockno = $tmpblock;
			 			$productTimeBlock->blockcount = 0;
			 			$productTimeBlock->save();
	 					
			 			$chapterTmpstartsec = $chapterTmpstartsec +10;
			 			$chapterTmpEndsec   = $chapterTmpEndsec +10;
	 	      	  	//var_dump( "Product_id ==" + $data['product_id'] ."--  video_id == ".$v->content_id. "-- chapterId == ".$ch->uid.
	 	      	  	//"-- starttime " .$chapterStartSec ."-- endtime == ". ($chapterStartSec +10) ."-- blockno".$tmpblock );
	 	      	  		$chapterStartSec = 	$chapterStartSec +10;
	 	      	  		$tmpblock = $tmpblock+1;
	 	      	  	}
	 	      	  	
	 	      	  	$chapterTmpstartsec = $chapterStartSec;
 	      	  }
 	      }
 	   }
 	   SWPLogManager::log('Course instance block creation succesful',array("result"=>"success"),TLogger::INFO,$this,"createCourseInstanceBlocks","SWP");
	   return "success";
	}
	
	
	public function convertTimetoSecs( $tmptime){
		SWPLogManager::log('It should be able to convert the corresponding time passed as an argument to its corresponding second value',
		array("tmptime"=>$tmptime),TLogger::INFO,$this,"convertTimetoSecs","SWP");
			$secs = 0;
		$str_time = $tmptime ;//"23:12:95";

		$str_time = preg_replace("/^([\d]{1,2})\:([\d]{2})$/", "00:$1:$2", $str_time);
		
		sscanf($str_time, "%d:%d:%d", $hours, $minutes, $seconds);
		
		$time_seconds = $hours * 3600 + $minutes * 60 + $seconds;
			// Return in secs
			SWPLogManager::log('The corresponding second value of the time passed as an argument is',
		array("time_seconds"=>$time_seconds),TLogger::INFO,$this,"convertTimetoSecs","SWP");
		return $time_seconds;
	}
	
   /**
    * @remotable 
    * @param $answer is the exact answer of the Question.
    * @param $answerResult is the student written answer for Question.
    *  This function return the numeric question evaluation result .
	*	
	*  20131118750
    **/
	//201407290710
	public function numericQuestionEvaluation( $answerResult, $answer1, $answer2 ){
	
		$result = false;
		preg_match('/^(\-)?[0-9]*(\.[0-9]*)?$/', $answerResult, $matchStr ); 
		
		if(count($matchStr) == 0 )
			return $result;
			
		if( $answer2  ){
			
			if( $answer1 <= $answerResult && $answer2 >= $answerResult ){
				$result = true;
			}
				
		}else {
			if( $answerResult == $answer1)
			$result = true;
		}
		return $result ;
	}
	/**
	 * When a course is finalized we are registering an event into business events table
	 * @param unknown_type $content_id
	 * 201405140925
	 */
	public function prepareCourseDimensionEntryData($content_id , $name){
		if($content_id){
			$courseDetails =  array();
			$courseDetails['course_id']	 	= intval($content_id);
			$courseDetails['name']	 	= $name;
			$courseInfo = json_encode($courseDetails);
			if($courseInfo){
				$businessEvent = new BusinessEventsRecord();
				$businessEvent->createEventsRecord(BusinessEventsRecord::$COURSE_FINALIZE, $courseInfo,'D');
			}
		} 
	}
	
   /**
    * @remotable 
    * 
    * This will be called from the onSaveButton method of the actions.js.
    * On finalizing a quiz we are going to create a business event for the quiz
    **/
	public function createBusinessEventForFinalizedQuiz($quizID){
		$quiz = QuizGroupRecord::finder()->find('content_id = ?',array($quizID));
		if(count($quiz) > 0 ){
			if($quiz->type == 1){
				$isQuizOK = $this->prepareQuizDimensionEntryData($quizID , $quiz->name);
				if($isQuizOK){
					$this->createBusinessEventForFinalizedQuizQuestions($quizID);
				}
			}
			return true;
		}else {
			return false;
		}
	}
	
	/**
	 * This method is useful to create business event entries for the quiz Questions
	 * @param unknown_type $quizID
	 * 201405140925
	 */
	public function createBusinessEventForFinalizedQuizQuestions($quizID){
		$allQuestions = QuizRecord::finder()->findAll('parent_id = ? ',array($quizID));
		if(count($allQuestions) > 0){
			foreach ($allQuestions as $question){
				$quizQuestionDetails =  array();
				$quizQuestionDetails['question_id']	 	= intval($question->uid);
				$quizQuestionDetails['ordering']	 	= $question->ordering ? (($question->ordering)/10)+1 : 1;
				$quizQuestionInfo = json_encode($quizQuestionDetails);
				if($quizQuestionInfo){
					$businessEvent = new BusinessEventsRecord();
					$businessEvent->createEventsRecord(BusinessEventsRecord::$QUIZ_QUESTION_FINALIZE, $quizQuestionInfo,'D');
				}
			}
		}
	}
	
	/**
	 * When a course is finalized we are registering an event into business events table
	 * @param unknown_type $content_id
	 * 201405140925
	 */
	public function prepareQuizDimensionEntryData($content_id , $name){
		if($content_id){
			$quizDetails =  array();
			$quizDetails['quiz_id']	 	= intval($content_id);
			$quizDetails['name']	 	= $name;
			$quizInfo = json_encode($quizDetails);
			if($quizInfo){
				$businessEvent = new BusinessEventsRecord();
				$businessEvent->createEventsRecord(BusinessEventsRecord::$QUIZ_FINALIZE, $quizInfo,'D');
			}
			return true;
		}
		return false; 
	}
	
	/**
	 * @remotable 
	 * 
	 * This method is useful to update the course content information to the avalton
	 * @param unknown_type $content_id
	 * 2014051700230
	 */
	public function courseDetailsInfoUpdateToAvalton($content_id){
		try {
			$courseRec = CourseRecord::finder()->find('content_id = ?',array($content_id));
			if(count($courseRec) > 0 ){
				$courseRec->saveToAvalton(true);
			}
			return true;
		}catch (Exception $ex){
			$except = $ex->getMessage();
			return $except;
		}
	}
	/**
	 * @remotable 
	 * 
	 * This method is useful to find the selected lesson completed status.
	 * @param int $lessonId
	 * @param int $productId
	 * 
	 */
	//201407010546
	public function getLessonCompletedStatus(  $lessonId, $productId ){
		
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$cid = $user->getContentID();
		$chaptersTrack=0;
		
		$lessonChapters = CuepointRecord::finder()->findAll('videos_id = ? AND ishidden = 0 ',$lessonId );
		foreach ( $lessonChapters as $chapter ){
			$trackRec = TrackingDataRecord::finder()->find('product_id = ? AND subject="1" AND content_id = ?',array( $productId ,$chapter->uid ) );
			if( count($trackRec) ){
				$chaptersTrack = $chaptersTrack+1;
			}
		}
		/**
		 * Here the lesson's chapters count and viewed chapter count should equal then theat full lesson become viewed lesson
		 */
		if( count( $lessonChapters ) == $chaptersTrack ){  
			
			$lessonSetting = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND setting_name="SUB_SEQUENT_LOCK" ',array( $cid ,$lessonId ) );
			$setting = $lessonSetting->setting_value ;
			
			if( $setting == '0' ){ 							//Here it will specify the "Unless this lesson is viewed" option for subsequent lock.
				
				return true;
			}else if( $setting == '1' ){					//Here it will specify "Unless this lesson is viewed and the task in this lesson is completed" option for subsequent lock.
				
				$reference = LastRunRecord::finder()->find( 'video_id = ?  AND product_id = ? AND content_id = ? AND subject = ? ', array($lessonId,$pid,$cid,'taskref') );
				if( count( $reference ) > 0 )
			 		$taskThread = ThreadRecord::finder()->find('reference_id = ?',$reference->uid);
				
				if( count($taskThread) ){
					
					$taskStatus = $taskThread->status;
					if( $taskStatus == 99 ){ 				//Here task status '99' specify the task complete status.
						return true;
					}else { 								//Here if task status not complete return 'false'.
						return false;
					}
				}else{										//Here if selected lesson not have any task then it will return 'true'
					return true;				
				}
			}
		}else{
			return false;
		}
	}
	
	/**
	 * @remotable 
	 * Here calculating the total course progress for required Course
	 * 
	 */
	public function getCourseProgress( $params=array() ){
		
		/**
		 * #29093
		 * The proportional contribution to the overall course progress 
		 * is equal to: (1/(number of lessons + number of quizzes))%. 
		 */
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$cid = $user->getContentID();
		$course = CourseRecord::finder()->withCc('(1=1) ORDER BY ordering')->find('content_id = ?',array($cid));
		$cc = $course->cc; 
		$courseProgress = 0;
		
		foreach($cc as $c) {
			$v = $c->content;
			$lessonProgress = 0;
			$quizProgress = 0;
			if( $v->type == 0 ){
				$lessonProgress = $this->getLessonProgress( $v->content_id, $pid );	
			}elseif (  $v->type == 1 ){
				$quizProgress = $this->getQuizProgress( $v->content_id );
			}
			$courseProgress = $courseProgress + ( $lessonProgress + $quizProgress );
		}
		$progress = ($courseProgress/count($cc))*100;
	
		return $progress;
	}
	/**
	 * @remotable 
	 * It will calculate the lesson progress for required lesson
	 * @param int $lessonId lesson content id
	 * @param int $productId course product id
	 * 
	 */
	public function getLessonProgress(  $lessonId, $productId ){
		/**
		 * #29093
		 * Lesson completion is considered at 100% if all of its chapters are viewed and additionally its task is completed. 
		 * Task completion corresponds to 50% of the lesson completion and all chapters are viewed corresponds to 50%.
		 */
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$cid = $user->getContentID();
		$chaptersTrack = 0; $viewedProgress=0; $taskProgress = 0;
		
		$reference = LastRunRecord::finder()->find( 'video_id = ?  AND product_id = ? AND content_id = ? AND subject = ? ', array($lessonId,$pid,$cid,'taskref') );
		if( count( $reference ) > 0 )
			 $taskThread = ThreadRecord::finder()->find('reference_id = ?',$reference->uid);
			 
		$lessonChapters = CuepointRecord::finder()->findAll('videos_id = ? AND ishidden = 0 ',$lessonId );
		foreach ( $lessonChapters as $chapter ){
			$trackRec = TrackingDataRecord::finder()->find('product_id = ? AND subject="1" AND content_id = ?',array( $productId ,$chapter->uid ) );
			if( count($trackRec) ){
				$chaptersTrack = $chaptersTrack+1;
			}
		}
		
		/**
		 * Here the lesson's chapters count and viewed chapter count is equal then that lesson become all chapter viewed lesson.
		 */
		if( count( $lessonChapters ) == $chaptersTrack ){  
			if( count($taskThread) ){ //Here if there is no task for the lesson then lesson progress is 100%
				$viewedProgress = 0.5;
			}else{
				$viewedProgress = 1;
			}
		}
		/**
		 * Here checking for task existence for the lesson, if task is exist checking for task status.
		 */
		if( count($taskThread) > 0){
			$taskStatus = $taskThread->status;
			if( $taskStatus == 99 ){ 				//Here task status '99' specify the task complete status.
				$taskProgress = 0.5;
			}
		}
		return ( $viewedProgress+$taskProgress );
	}
	/**
	 * @remotable 
	 * Here calculating the quiz progress for required quiz
	 * @param int $quizId
	 * 
	 */
	public function getQuizProgress( $quizId ) {
		
		/**
		 * Here caliculating progress for quiz  
		 * #29093
		 * Progress calculation of the course based on the quiz attempt,
		 * On attempting a quiz and evaluating it ( clicking summary), 
		 * the quiz should be counted as completed (100%) for reporting progress.
		 * The only exception to this will be for a quiz with passing score required. 
		 * If the quiz has a required passing score, and the user fails that quiz, 
		 * then the progress for that quiz will be incomplete ( 0%).
		 */
		$user = Prado::getApplication()->getUser();
		$cid = $user->getContentID();
		$pid = $user->getProductID();
		$quizProgress = 0;
		
		$quizScoresRec = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$quizId);	
		
		if( count($quizScoresRec) > 0 ){ //On quiz summary clicked then the product_quiz_scores table have one entry with score.
			$quizSettings = $this->getQuizSettings( $quizId );
			
			if( $quizSettings['requiredPass'] == 1 ){ //Settings is exist for the Quiz
				$scoresRecord = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? AND resetquiz = 0 ',$pid,$quizId );
				if(  count( $scoresRecord ) > 0 ){
	   				if( $scoresRecord->passed ){
	   					$quizProgress = 1;
	   				}
	   			}
			}else{
				/**
				 * Settings not exist for the Quiz and 
				 * if quiz is attempted (Click on Summary) we are storing a record in track table.
				 * If tracks table have record with subject "1" means it is attempted quiz  
				 */ 
				$quizProgress = 1;
			}
			
		}else{
			return $quizProgress;
		}
		return $quizProgress;
	}
	
	/**
	 * @remotable 
	 * 
	 * @param unknown_type $course_id
	 * @param unknown_type $contentArray
	 */
	public function processLessonSettings($course_id,$contentArray){
		// This array containes all the sub sequent lesson,quiz content_id 
		//and the content_id of the lesson which invokes this method (as the first value of the array)
		$firstLesson = $contentArray[0];
		$lesson_id = $firstLesson['content_id'];
		
		//Getting the all the setting records related to this lesson and course combination.
		$lessonSettingRecs =ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? ',
												array( $course_id, $lesson_id ));
		$response = array();
		if(count($lessonSettingRecs) > 0){
			$response = $this->getUpdatedLessonSettings($course_id,$lesson_id,$contentArray);
		}else{
			//first we will create the lesson lock indicator 
			$this->createLessonSettingsRecord($course_id,$lesson_id,null,'SUB_SEQUENT_LOCK',0,0,1);
			$tempRes = array();
			$tempRes['SUB_SEQUENT_LOCK'] = 0;
			$response[0] = $tempRes;
			//For each sub content one entry will be created.
			for($i=1 ; $i< count($contentArray);$i++){
				$tempContentArray = array();
				$subContent = $contentArray[$i];
				$content_id = $subContent['content_id'];
				$type       = $subContent['type'];
				$name       = $subContent['name'];
				$value		= 0;
				$tempContentArray[$content_id] = 0;
				$response[$i] = $tempContentArray;
				$this->createLessonSettingsRecord($course_id,$lesson_id,$content_id,$name,$value,$i,$type);
			}
		}
		return $response;
	}
	
	/**
	 * 
	 * @remotable 
	 * 
	 * Method for update the setting of the course
	 * 
	 * @param unknown_type $courseContentArray
	 * @param unknown_type $course_id
	 */
	public function updateModifiedLessonSettings($courseContentArray , $course_id){
		if(! empty($courseContentArray)){
			$subsequentActualContent = array();
			for($j = 0 ; $j < count($courseContentArray) ; $j++ ){
					$subSeqActContent = $courseContentArray[$j];
   					$subsequentActualContent[$subSeqActContent['content_id']] = array("name"=>$subSeqActContent['name'],"type"=>$subSeqActContent['type']);
   			}
   				
			for($i = 0 ; $i < count($courseContentArray) ; $i++){				
				$contentArray = $courseContentArray[$i];
				$content_id = $contentArray['content_id'];
				
				//In this loop we will take all the subsequent content videoid
				unset($subsequentContentArr);
				$subsequentContentArr = array();
				for($k = $i+1 ; $k < count($courseContentArray) ; $k++ ){
					$subSeqContent = $courseContentArray[$k];
   					array_push($subsequentContentArr, $subSeqContent['content_id']);
   				}
   				
   				//getting all the lesson setting so we can loop through the subseqent array if not found
   				//this setting record in the subsequent then delete that.
				$lessonSettingRecs =ProductLessonSettingRecord::finder()->findAll('course_id = ? AND lesson_id = ? AND setting_name !="SUB_SEQUENT_LOCK" ORDER BY order',
												array( $course_id, $content_id ));
   				if(count($lessonSettingRecs) > 0) {
   					//Code to serach all the setting in the subsequent array if any setting lesson is not found in the 
   					//Subsequent array is means that setting is not required so removing the setting
   					foreach($lessonSettingRecs as $lessonSettingRec){
	   					$index = array_search($lessonSettingRec->content_id,$subsequentContentArr);
	   					if($index === false ){
	   						$lessonSettingRec->delete();
	   					}
   					}
   					//Loop through all the content and then find out the setting is ther  
   					for($a = 0 ; $a < count($subsequentContentArr) ; $a++){
   						$desiredContent = $subsequentContentArr[$a];
   						$desiredContentArray = $subsequentActualContent[$desiredContent];
   						$lesson_id = $content_id ; 
   						$productLessonSettingRec = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND content_id= ?',
											array( $course_id, $lesson_id ,$desiredContent));
						if(count($productLessonSettingRec) > 0){
							$productLessonSettingRec->order = $a+1;
							$productLessonSettingRec->save();
						}else{
							$this->createLessonSettingsRecord($course_id,$lesson_id,$desiredContent,$desiredContentArray['name'],0,$a+1,$desiredContentArray['type']);
						}
   					}
   				}
			}
		}
	}
	
	/**
	 * Creates Lesson settings record with the given parameters
	 * @param unknown_type $course_id
	 * @param unknown_type $lesson_id
	 * @param unknown_type $content_id
	 * @param unknown_type $name
	 * @param unknown_type $value
	 * @param unknown_type $order
	 * @param unknown_type $type
	 */
	public function createLessonSettingsRecord($course_id,$lesson_id,$content_id,$name,$value,$order,$type){
		$productLessonSettingRec = new ProductLessonSettingRecord();
		$productLessonSettingRec->course_id = $course_id;
		$productLessonSettingRec->lesson_id = $lesson_id;
		if($content_id != null){
			$productLessonSettingRec->content_id = $content_id;
		}
		$productLessonSettingRec->setting_name = $name;
		$productLessonSettingRec->setting_value = $value;
		$productLessonSettingRec->order = $order;
		$productLessonSettingRec->type = $type;
		$productLessonSettingRec->save();
	}
	
	/**
	 * This methos is to get the existing settings if the settings not found for the particualr content 
	 * This will create that setting with the default value.
	 * @param unknown_type $course_id
	 * @param unknown_type $lesson_id
	 * @param unknown_type $contentArray
	 */
	public function getUpdatedLessonSettings($course_id,$lesson_id,$contentArray){
		$response = array();
		$tempRes = array();
		$lessonSettingLockRec = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND setting_name = "SUB_SEQUENT_LOCK"',
											array( $course_id, $lesson_id));
		if(count($lessonSettingLockRec) > 0){
			$tempRes['SUB_SEQUENT_LOCK'] = $lessonSettingLockRec->setting_value;
			$response[0] = $tempRes;
		}
		for($i =1 ; $i < count($contentArray) ; $i++){
			$tempContentArray = array();
			$subContent = $contentArray[$i];
			$content_id = $subContent['content_id'];
			$type       = $subContent['type'];
			$name       = $subContent['name'];
			$value		= 0;
			$lessonSettingRec = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND content_id= ?',
											array( $course_id, $lesson_id ,$content_id));
			if(count($lessonSettingRec) > 0){
				$val = $lessonSettingRec->setting_value;
				$tempContentArray[$content_id] = $val;
				$lessonSettingRec->order = $i;
				$lessonSettingRec->save();
			}else{
				$this->createLessonSettingsRecord($course_id,$lesson_id,$content_id,$name,$value,$i,$type);
				$tempContentArray[$content_id] = 0;
			}
			$response[$i] = $tempContentArray;
		}
		
		return $response;
	}
	
	/**
	 * 
	 * @remotable 
	 *
	 * When user clicked on the settings icon of the lesson a request will come to this methos 
	 * So this method will prepare the required content by getting the values 
	 * And prepare an array and send back as a response.
	 * @param unknown_type $course_id
	 * @param unknown_type $contentArray
	 */
	public function getLessonSettings($course_id,$contentArray){
		$response = array();
		$tempRes = array();
		$firstLesson = $contentArray[0];
		$lesson_id = $firstLesson['content_id'];
		
		$isEnable = $this->getLessonTaskStatus($lesson_id);
		$lessonSettingLockRec = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND setting_name = "SUB_SEQUENT_LOCK"',
											array( $course_id, $lesson_id));
		if(count($lessonSettingLockRec) > 0){
			$tempRes['SUB_SEQUENT_LOCK'] = $lessonSettingLockRec->setting_value;
			$tempRes['isEnabled'] =$isEnable;
			$response[0] = $tempRes;
			if($isEnable != '1'){
				$lessonSettingLockRec->setting_value = 0;
				$lessonSettingLockRec->save();
			}
		} else {
			$tempRes['SUB_SEQUENT_LOCK'] = 0;
			$tempRes['isEnabled'] =$isEnable;
			$response[0] = $tempRes;
		}
		for($i =1 ; $i < count($contentArray) ; $i++){
			$tempContentArray = array();
			$subContent = $contentArray[$i];
			$content_id = $subContent['content_id'];
			$type       = $subContent['type'];
			$name       = $subContent['name'];
			$value		= 0;
			$lessonSettingRec = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND content_id= ?',
											array( $course_id, $lesson_id ,$content_id));
			if(count($lessonSettingRec) > 0){
				$val = $lessonSettingRec->setting_value;
				$tempContentArray[$content_id] = $val;
			}else{
				$tempContentArray[$content_id] = 0;
			}
			$response[$i] = $tempContentArray;
		}
		
		return $response;
	}
	
	/**
	 * Used to get the predefinedtask status of the lesson 
	 * @param unknown_type $lesson_id
	 */
	public function getLessonTaskStatus($lesson_id){
			$lessonRec = VideoRecord::finder()->find('content_id = ?',array($lesson_id));
			if(count($lessonRec) > 0){
				return $lessonRec->predefinedtask;
			} else {
				return 0;
			}
	}
	
	/**
	 * 
	 * @remotable 
	 * 
	 * When user click on the save button of the settings window a request will come to this method.
	 * This method will parse the content and save the datails to the database.
	 */
	public function saveLessonSettings($course_id,$lesson_id ,$latestLessonsNames){
		$lessonLockArry  = $latestLessonsNames[0];
		$lockValue = $lessonLockArry['SUB_SEQUENT_LOCK'];
		$this->updateOrSaveContentValues($course_id , $lesson_id, null , 0 ,$lockValue);
		
		for($i = 1 ; $i < count($latestLessonsNames) ; $i++ ){
			$content = array();
			$content = $latestLessonsNames[$i];
			$content_id = $content['content_id'];
			$value 		= $content['value'];
			$this->updateOrSaveContentValues($course_id , $lesson_id, $content_id , $i ,$value);
		}
		return true;
	}
	
	/**
	 * This method is used to find of the records according to 
	 * the content and set the values according to the give value.
	 * Enter description here ...
	 * @param unknown_type $course_id
	 * @param unknown_type $lesson_id
	 * @param unknown_type $content_id
	 * @param unknown_type $order
	 * @param unknown_type $value
	 */
	public function updateOrSaveContentValues($course_id,$lesson_id,$content_id , $order,$value){
		$lessonSettingRec = null;
		if($order == 0){
			$lessonSettingRec = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND setting_name = "SUB_SEQUENT_LOCK"',
											array( $course_id, $lesson_id));
		}else{
			$lessonSettingRec = ProductLessonSettingRecord::finder()->find('course_id = ? AND lesson_id = ? AND content_id= ?',
											array( $course_id, $lesson_id ,$content_id));
		}
		if($lessonSettingRec != null){
			if(count($lessonSettingRec) > 0){
				$lessonSettingRec->setting_value = ($value==true) ? 1 : 0;
				$lessonSettingRec->order = $order;
				$lessonSettingRec->save();
			}
		}
		return true;
	}
}
