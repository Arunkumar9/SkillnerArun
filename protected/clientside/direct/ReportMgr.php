<?php
/**
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 *
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  22934          Arunkumar.muddada    201310270243     Added Method :  getPostsSubmittedByUser( $productId,$userId ) 
 *  												     Number of posts by instructor  is calculating as 
 *  													 "total number of posts (in general message as well as tasks) by the instructor in that course instance"
 *  22934          Arunkumar.muddada    201310270613     We need to loop through the thread posts as we need only their count
 *  28018		   Arunkumar.muddada    201406121211     Modified : getInstructorAvailabilityDate , getCourseExpirationDate
 *  														Format is modified to match the system level format month date year
 */

 class ReportMgr extends TComponent {


    /**
     * @remotable
     *
     */

 	public function getCourseRelatedInfo($params){
		SWPLogManager::log("Data related to Course Summary Report input parameters",$params,TLogger::INFO,$this,"getCourseRelatedInfo","SWP");
 		$user = Prado::getApplication()->getUser();
 		
 		$userId = $user->Username;
 		$contentId = $user->ContentID;
 		$productId = $user->ProductID;
 		$userUid = $user->Uid;
 		
 		$userRec = UserRecord::finder()->find(' uid =? ' , array(  $user->Uid ));
 		$userTimeZone = $userRec->timezone;
 		$userRoles =   $userRec->getExtractedRoles() ;

 		if(   in_array('24',$userRoles['all'])   ){
 			
 			$instructorID 				= 		$user->InstructorID;
 			$studentId					=		$user->StudentID;
 			$commentsSubmittedByStudent =		$this->getCommentsUpdatedByUser( $productId, $contentId, $studentId );
 			//201310270243
 			//Number of posts by instructor  is calculating as "total number of posts (in general message as well as tasks) 
 			//by the instructor in that course instance"
 			$commentsRepliedByInstructor=		$this->getPostsSubmittedByUser( $productId,$instructorID );
 			$lastActiveDate				=		$this->getLastActiveDate( $contentId,$productId );
 		}

 		$quizesCount 				= 		$this->getQuizCount( $contentId );
 		// return array("success"=>true,"data"=>array("quizesCount"=>$quizesCount ,
 		// 	"courseActivatedDate"=>"3 days 16 hours 46 min ago ",
 		// 	"instructorAvailDate"=>"2013-10-30 21:07:30",
 		// 	"courseExpirationDate"=>"","courseSize"=>"0 MB",
 		// 	"courseDuration"=>"",
 		// 	"commentsSubmittedByStudent"=>null,
 		// 	"commentsRepliedByInstructor"=>null,
 		// 	"lastActiveDate"=>null));
 		$courseActivatedDate 		= 		$this->getCourseActivatedDate( $userId,$contentId,$productId );
 		$instructorAvailDate		=		$this->getInstructorAvailabilityDate( $contentId,$productId,$userTimeZone );
 		$courseExpirationDate		=		$this->getCourseExpirationDate( $contentId,$productId, $userTimeZone );
 		$courseSize					=		$this->getCourseSize( $contentId,$productId );
 		$courseDuration				=		$this->getCourseDuration( $contentId,$productId );
 		
 		SWPLogManager::log("Data related to Course Summary Report",array("success"=>true,"data"=>array('quizesCount'=>$quizesCount,'courseActivatedDate'=>$courseActivatedDate,
									'instructorAvailDate'=>$instructorAvailDate,
									'courseExpirationDate'=>$courseExpirationDate,
									'courseSize'=>$courseSize,
									'courseDuration'=>$courseDuration,
									'commentsSubmittedByStudent'=>$commentsSubmittedByStudent,
									'commentsRepliedByInstructor'=>$commentsRepliedByInstructor,
									'lastActiveDate'=>$lastActiveDate)),TLogger::INFO,$this,"getCourseRelatedInfo","SWP");

 		return array("success"=>true,
					"data"=>array(	
									'quizesCount'=>$quizesCount,
									'courseActivatedDate'=>$courseActivatedDate,
									'instructorAvailDate'=>$instructorAvailDate,
									'courseExpirationDate'=>$courseExpirationDate,
									'courseSize'=>$courseSize,
									'courseDuration'=>$courseDuration,
									'commentsSubmittedByStudent'=>$commentsSubmittedByStudent,
									'commentsRepliedByInstructor'=>$commentsRepliedByInstructor,
									'lastActiveDate'=>$lastActiveDate)
 		);
 	}
	
	/**
	*@remotable
	*
	*/
	
	public function getQuizCount( $productId ){
		SWPLogManager::log("Data related to Number of Quizzes in the Course",array('ProductID'=>$productId),TLogger::INFO,$this,"getQuizCount","SWP");
		$quizesAvailableInCourse = CourseContentRecord::finder()->count('product_id=? AND type=?', $productId,1);
		SWPLogManager::log("Data related to Course Summary Report input parameters",array('Quiz Count in Course'=>count( $quizesAvailableInCourse) ),TLogger::INFO,$this,"getQuizCount","SWP");
		return $quizesAvailableInCourse;
	}
	
	/**
	*@remotable
	*
	*/
	
	public function getCourseActivatedDate( $userId,$contentId,$productId ){
	
		SWPLogManager::log("This Method Will Provide the start data of the course for the first time",
		                 array('ProductID'=>$productId,'Course'=>$contentId,'User'=>$userId),TLogger::INFO,
		                 $this,"getCourseActivatedDate","SWP");
		$diff = '';
		$activeRecord = CourseDetailsRecord::finder()->find('product_id=? AND course_id=?',$productId,$contentId );
		
		$ts = $activeRecord->coursestartdate;
		
		$date = strtotime($ts);
                          if( ! $activeRecord->coursestartdate ){
                          return;
                          }
		
		$currentDay = time();

		$currentDate = new DateTime("@$currentDay");

		$date 	= new DateTime("@$date");


		
		$interval = date_diff( $date,$currentDate );
		$intervalArray = (array)$interval;
		
		if( $intervalArray['days'] ) {
		
			$diff = $intervalArray['days'] . ' days ';
		}
		if( $intervalArray['h'] ) {
			
			$diff = $diff . $intervalArray['h'] . ' hours ';
		}
		
		if( $intervalArray['i'] ) {
			
			$diff = $diff . $intervalArray['i'] . ' min';
		}
		if($diff != '') {
			$diff = $diff.' ago ';
		}
		SWPLogManager::log("Course Start Date:",array('coursestartdate'=>$diff),TLogger::INFO,$this,"getCourseActivatedDate","SWP");
		return $diff;
	}
	
	/**
	*@remotable
	*
	*/
	
	public function getInstructorAvailabilityDate( $courseId,$productId, $userTimezone ){
	
		SWPLogManager::log("This will give Instructor Availability Date according to :",array('Course'=>$courseId,'Product'=>$productId ,'Time Zone'=>$userTimezone ),
		TLogger::INFO,$this,"getInstructorAvailabilityDate","SWP");
		$returnValue = 'No Instructor';
		
		$instructorAvailabilityDateRec = CourseDetailsRecord::finder()->find('product_id=? AND course_id=? AND instructor_id IS NOT NULL', $productId,$courseId);
		if( $instructorAvailabilityDateRec ) {
			
			if(empty($instructorAvailabilityDateRec->availablilitydate)){
				
				$returnValue = 'Not Applicable';
					
			}else{
				
				$returnValue = $this->convertDateTimeZone( $instructorAvailabilityDateRec->availablilitydate, $userTimezone );
				//201406121211
				//Format is modified to match the system level format month date year
				$returnValue = date("m-d-Y h:i:s", strtotime($returnValue));
			}
		}else{
					
					$returnValue = 'No Instructor';
				
		}
		SWPLogManager::log(" Instructor Availability Date :",array('Instructor Availability Date'=>$returnValue),TLogger::INFO,$this,"getInstructorAvailabilityDate","SWP");
		return $returnValue; 
	}
	
	/**
	*@remotable
	*
	*/
	
	public function getCourseExpirationDate( $courseId,$productId, $userTimezone ){
	
		SWPLogManager::log(" Instructor Availability Date :",array("courseId"=>$courseId, "productId"=>$productId, "userTimezone"=>$userTimezone),
		TLogger::INFO,$this,"getCourseExpirationDate","SWP");
		$returnValue = '';
		
		$courseExpirationDateRec = CourseDetailsRecord::finder()->find('product_id=? AND course_id=?', $productId,$courseId);
		
		if( $courseExpirationDateRec  && $courseExpirationDateRec->expirationdate ) {
			
			$returnValue = $this->convertDateTimeZone( $courseExpirationDateRec->expirationdate,$userTimezone );
			//201406121211
			//Format is modified to match the system level format month date year
			$returnValue = date("m-d-Y h:i:s", strtotime($returnValue));
		}
		SWPLogManager::log("Course Expiration Date is :",array("expirydate"=>$returnValue),TLogger::INFO,$this,"getCourseExpirationDate","SWP");
		return $returnValue;
	}
	
	/**
	*@remotable
	*
	*/
	
	public function getCourseSize( $courseId,$productId ){
		SWPLogManager::log("It should return the course size : ",array("courseId"=>$courseId, "productId"=>$productId),TLogger::INFO,$this,"getCourseSize","SWP");
		$returnValue = '';
		
		$courseSizeRec = CourseDetailsRecord::finder()->find('product_id=? AND course_id=?', $productId,$courseId);
		
		if( $courseSizeRec ) {
			
			$returnValue = $courseSizeRec->coursesize . ' MB';
		}
		SWPLogManager::log("The Course size is : ",array("course_size"=>$returnValue),TLogger::INFO,$this,"getCourseSize","SWP");
		return $returnValue;
	}
	
	/**
	*@remotable
	*
	*/
	
	public function getCourseDuration( $courseId,$productId ){
	
		SWPLogManager::log("It should return the course duration : ",array("courseId"=>$courseId, "productId"=>$productId),TLogger::INFO,$this,"getCourseDuration","SWP");
		$returnValue = '';
		
		$courseDurationRec = CourseDetailsRecord::finder()->find('product_id=? AND course_id=?', $productId,$courseId);
		
		if( $courseDurationRec && $courseDurationRec->courseduration ) {
			
			$returnValue = $courseDurationRec->courseduration;
			$time = ($returnValue >= 3600) ? date('G', $returnValue).' hr ' : '';
			$time .= intval(date('i',$returnValue)).' min '.date('s', $returnValue). ' sec';
			
			$returnValue = $time;
		}
		SWPLogManager::log("The course duration is: ",array("course_duration"=>$returnValue),TLogger::INFO,$this,"getCourseDuration","SWP");
		return $returnValue;
	}
	
	/**
	*@remotable
	*
	*/
	public function getCommentsUpdatedByUser( $productId, $contentId, $userId ){
	
		SWPLogManager::log("It should return the number of comments updated by that particular user: ",array("userId"=>$userId, "productId"=>$productId, "contentID"=> $contentId),
		TLogger::INFO,$this,"getCommentsUpdatedByUser","SWP");
		
		$commentsRecords = UserLCommentRecord::finder()->findAll('product_id = ? AND content_id = ? AND user_id = ?',$productId ,$contentId, $userId );
		
		SWPLogManager::log("The number of posts of that particular user is: ",array("commentsCount"=> count( $commentsRecords ) ),TLogger::INFO,$this,"getCommentsUpdatedByUser","SWP");
		return count( $commentsRecords );
	}
	
	/**
	*@remotable
	*
	*/
	public function getLastActiveDate( $contentId,$productId ){

		SWPLogManager::log("It should return when the user has last activated: ",array("contentId"=>$contentId,"productId"=>$productId),
		TLogger::INFO,$this,"getLastActiveDate","SWP");
		$returnValue = '';
		$diff = '';
		$courseDetailRec = CourseDetailsRecord::finder()->find('product_id=? AND course_id=?', $productId,$contentId);

		if( $courseDetailRec ) {
			$actualReturnValue = $courseDetailRec->lastlogintime;
			if( !$courseDetailRec->lastlogintime ){
				return;
			}
			$returnValue = strtotime($actualReturnValue);
				
			$currentDay = time();
			$currentDate = new DateTime("@$currentDay");
			$returnValue = new DateTime("@$returnValue");
				
			$interval = date_diff( $returnValue,$currentDate );
			$intervalArray = (array)$interval;
			if( $intervalArray['days'] ) {
					
				$diff = $intervalArray['days'] . ' days';
			}
			if( $intervalArray['h'] ) {

				$diff = $diff . $intervalArray['h'] . ' hours ';
			}
				
			if( $intervalArray['i'] ) {

				$diff = $diff . $intervalArray['i'] . ' min';
			}
			if($diff  != '') {
				$diff =  $diff . ' ago ';
			}
			$diff = $diff .'on '.date( 'M-j,Y',strtotime($actualReturnValue));
			$returnValue = $diff;
		}
		SWPLogManager::log("The user has last activated on : ",array("last_active_date"=>$returnValue),TLogger::INFO,$this,"getLastActiveDate","SWP");
		return $returnValue;
	}
	
	/**
	*@remotable
	*
	*/
	
	public function convertDateTimeZone( $dateTime,$targetTimeZone ){
		SWPLogManager::log("It should convert the corresponding gmt time passed as an argument to the corresponding time of te supplied timezone ",
		array("dateTime"=>$dateTime,"targetTimeZone"=>$targetTimeZone),TLogger::INFO,$this,"convertDateTimeZone","SWP");
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
		SWPLogManager::log("converted time in the particular time zone is : ",array("convertedNewtime"=>$convertedNewDate),
		TLogger::INFO,$this,"convertDateTimeZone","SWP");
		return $convertedNewDate;
	}
	
 	/**
	 * @remotable
	 *
	 *Retrives the BLOCKS of the course from the last_run_info 
	 */
    
    public function getCourseBlocks($isForHitMap){
    	SWPLogManager::log("It should return the number of blocks for the given product id",array("isForHitMap"=>$isForHitMap),TLogger::INFO,$this,"getCourseBlocks","SWP");
    	$returnValue = 0;
    	$user = Prado::getApplication()->getUser();
		$userId = $user->Username;
		$productId = $user->ProductID;
		$returnValue = ProductTimeBlocksRecord::finder()->count('product_id=?', $productId);
		// if( count($productTimeBlocksRecord) ) {
		// 	$returnValue = count($productTimeBlocksRecord); 
		// }
		SWPLogManager::log("The number of blocks for the product id is : ",array("no_of_blocks"=>$returnValue),TLogger::INFO,$this,"getCourseBlocks","SWP");
    	return $returnValue;
    }
    
 	/**
	 * @remotable
	 *
	 *Retrives the BLOCKS of the course from the last_run_info 
	 */
    
    public function getCourseBlockValues($isForHitMap){
    	
    	SWPLogManager::log("It should return the blocks and the hit count for the blocks: ",array("isForHitMap"=>$isForHitMap),TLogger::INFO,$this,"getCourseBlockValues","SWP");
  		$user = Prado::getApplication()->getUser();
		$userId = $user->Username;
		$productId = $user->ProductID;
		$blockValueArray[0]=array(0);
		
    	 $blockAndHitCountSql = "SELECT * FROM `product_time_blocks` WHERE product_id= ".$productId." ORDER BY blockno";
		 $blockAndHitCounts = TActiveRecord::finder('ProductTimeBlocksRecord')->findAllBySql($blockAndHitCountSql);
$totalBlockVlaue =0;	
		 if(count($blockAndHitCounts) > 0 ){
		 	$currentBlockValue = 0;
		 	$numberOfBlocks = 0 ; 
		 	
		 	foreach($blockAndHitCounts as  $blockAndHitCount) {
		 		$blockcount = $blockAndHitCount->blockcount;
		 		$blockValueArray[$blockAndHitCount->blockno] = array($blockcount);
		 		$numberOfBlocks = $numberOfBlocks +1 ;
		 		$totalBlockVlaue =$totalBlockVlaue + $blockcount;
		 	}
		 }
		 
		 // $blockValueArrayFinal = array();
		 
		 // for($k = 1 ; $k < sizeof($blockValueArray) ; $k++) {
		 // 	$blockValueArrayFinal['block'.$k] = $blockValueArray[$k];
		 // 	$totalBlockVlaue = $totalBlockVlaue + $blockValueArray[$k];
		 // }
		 // if( $totalBlockVlaue ==0 ){
		 // 	$totalBlockVlaue =1;
		 // }
		 // $blockValueArrayFinal['totalHitCount'] =$totalBlockVlaue;
		 // $blockValueArray[0]=arra($totalBlockVlaue);
		 // var_dump(json_encode($blockValueArray));
		 array_shift($blockValueArray);
		 SWPLogManager::log("The block values are : ",array("block_values"=>$blockValueArray),TLogger::INFO,$this,"getCourseBlockValues","SWP");
    	 return $blockValueArray;
    }
    
    /**
	 * @remotable
	 *
	 * Retrives the BLOCKS count of the course from the last_run_info 
	 */
    public function getCourseHitValue($isForHitMap){
    	SWPLogManager::log("It should return the number of total hits for the course ",array("isForHitMap"=>$isForHitMap),TLogger::INFO,$this,"getCourseHitValue","SWP");
		$returnValue = 0;
    	$user = Prado::getApplication()->getUser();
		$userId = $user->Username;
		$productId = $user->ProductID;
		$productTimeBlocksRecords = ProductTimeBlocksRecord::finder()->findAll('product_id=?  ', array($productId));
		if( count($productTimeBlocksRecords) ) {
			foreach($productTimeBlocksRecords as $productTimeBlocksRec){
				$returnValue = $returnValue + ($productTimeBlocksRec->blockcount);
			}
		}
		SWPLogManager::log("returns the number of hits for the course : ",array("value"=>$returnValue),TLogger::INFO,$this,"getCourseHitValue","SWP");
    	return $returnValue;
    }
    
 /**
	 * @remotable
	 *
	 */
public function getQuizReport($uid) {
		SWPLogManager::log("It should return the quiz report for the course: ",array("uid"=>$uid),TLogger::INFO,$this,"getQuizReport","SWP");
		$user = Prado::getApplication()->getUser();
		$pid = $user->getProductID();
		$contentId = $user->getContentId();
		$user = $studentDetails = UserRecord::finder()->find('Uid =  '.$user->Uid);
		$userTimezone = $user->timezone;
		$quizReportScore = array();
		$quizReportScores = array();
		
		$firstAtmpt = array();
		$lastAttempt = array();
		$answeredPercent = array();
		$quizIds = array();
    	$quizNames = array();
    	
    	for( $i = 1 ; $i <= 12; $i++ ){
    		${'attempt'.$i} = array();
    		${'attemptDate'.$i} = array();
    	}
    	$quizesId = '';
    	$quizesRecs = CourseContentRecord::finder()->findAll("product_id = ? and type = 1 ORDER BY ordering", array($contentId ));

    	foreach ($quizesRecs as $quizRec){
			$quiz = ProductQuizScoresRecord::finder()->find('product_id = ? AND quiz_id = ? ',array($pid, $quizRec->video_id));
			
			if (count( $quiz ) > 0 ){
				
				$qid = $quiz->quiz_id;
				$quizesId.= $qid.',';
				$allQuizRecs = ProductQuizScoresRecord::finder()->findAll('product_id = ? AND quiz_id = ? ORDER BY completiondatetime DESC',array($pid,$qid));
				$quizTitles = VideoRecord::finder()->find('content_id = ?', $qid);
				if( count($allQuizRecs) > 11 ){
					
					$firstAttempt = $allQuizRecs[0];
					array_push( ${'attempt12'} , $firstAttempt->score );
					array_push( ${'attemptDate12'}  , $this->convertDateTimeZone( $firstAttempt->completiondatetime, $userTimezone ) );
					$lastAttempt = $allQuizRecs[count($allQuizRecs) - 1 ];
					array_push( ${'attempt1'} , $lastAttempt->score );
					array_push( ${'attemptDate1'}  , $this->convertDateTimeZone( $lastAttempt->completiondatetime, $userTimezone ) );
					array_push( $answeredPercent , $firstAttempt->answeredpercentage );
					$highestFiveScores = ProductQuizScoresRecord::finder()->findAll('product_id = ? AND quiz_id = ? ORDER BY score DESC LIMIT 5' ,array($pid,$qid));
					$lowestFiveScores = ProductQuizScoresRecord::finder()->findAll( 'product_id = ? AND quiz_id = ? ORDER BY score ASC LIMIT 5' ,array($pid,$qid));
					
					for($k = 0; $k < count($lowestFiveScores); $k++){
						array_push(${'attempt'.($k+2)},$lowestFiveScores[$k]->score);
						array_push(${'attemptDate'.($k+2)}, $this->convertDateTimeZone( $lowestFiveScores[$k]->completiondatetime, $userTimezone ));
					}
				
					for($k = 0; $k < count($highestFiveScores); $k++){
						array_push(${'attempt'.(11-$k)},$highestFiveScores[$k]->score);
						array_push(${'attemptDate'.(11-$k)},$this->convertDateTimeZone( $highestFiveScores[$k]->completiondatetime, $userTimezone ));
					}
						
				} else {
					$noOfAttempts = count( $allQuizRecs );
					if($noOfAttempts == 1 ){
						$lastAttempt = $allQuizRecs[0];
						array_push( ${'attempt12'} , $lastAttempt->score );
						array_push( ${'attemptDate12'}  , $this->convertDateTimeZone( $lastAttempt->completiondatetime, $userTimezone )  );
						array_push( $answeredPercent , $lastAttempt->answeredpercentage );
						for($i = 1; $i< 12 ; $i++ ){
						
							array_push(${'attempt'.($i)},0);
							array_push(${'attemptDate'.($i)},null);
						}
					} else {
						
						$checks = (12-$noOfAttempts)+1;
						$l = 0;
						for( $k = 12 ; $k>=$checks ; $k-- ){
							if($k == 12 ){
								array_push( $answeredPercent , $allQuizRecs[$l]->answeredpercentage );
							}
							array_push(${'attempt'.($k)},$allQuizRecs[$l]->score);
							array_push(${'attemptDate'.($k)},$this->convertDateTimeZone( $allQuizRecs[$l]->completiondatetime, $userTimezone ) );
							$l++;
						}
						for($i = 1; $i< $checks ; $i++ ){
						
							array_push(${'attempt'.($i)},0);
							array_push(${'attemptDate'.($i)},null);
						}
					}
					
					
				}	
					array_push( $quizNames , $quizTitles->name );
					if(count( $allQuizRecs )){
						array_push( $quizIds , $allQuizRecs[0]->quiz_id );
					} 
			} else {
				
				$quizTitles = VideoRecord::finder()->find('content_id = ?', $quizRec->video_id);
				array_push( $quizNames , $quizTitles->name );
				array_push( $answeredPercent , null );
				array_push( $quizIds , $quizRec->video_id );
				for($k = 12; $k >= 1; $k--){
						array_push(${'attempt'.($k)},0);
						array_push(${'attemptDate'.($k)},null);
					}
				
			}
		}
		
		$quizReport = array($quizNames);
		for( $i = 1 ; $i <= 12; $i++ ){
			array_push( $quizReport , ${'attempt'.$i} );
    	}
    	array_push( $quizReport ,$answeredPercent);
		for( $i = 1 ; $i <= 12; $i++ ){
			array_push( $quizReport , ${'attemptDate'.$i} );
    	}
    	array_push( $quizReport , $quizIds );
		for($p = 0; $p < count($quizReport[0]);$p++){
			for($q = 0; $q < count($quizReport);$q++){
				$report = $quizReport[$q][$p];
				array_push($quizReportScore,$report);
			}
			array_push($quizReportScores,$quizReportScore);
			$quizReportScore = array();
		}
		SWPLogManager::log("Quiz report for the course is : ",array("report"=>$quizReportScores),TLogger::INFO,$this,"getQuizReport","SWP");
		return $quizReportScores;
	}
	
	
	/**
	 * @remotable
	 *
	 */
	public function getPostsSubmittedByUser( $productId,$userId ){
		//201310270243
		SWPLogManager::log("It should return the number of posts of that particular user: ",array("userId"=>$userId, "productId"=>$productId),TLogger::WARNING,$this,"getPostsSubmittedByUser","SWP");
		$postsCount = 0;
		$threadRecords = ThreadRecord::finder()->findAll('product_id=?',$productId );
		SWPLogManager::log("Thread Records: ",array("Thread Records"=>$threadRecords),TLogger::WARNING,$this,"getPostsSubmittedByUser","SWP");
		foreach( $threadRecords as $threadRecord ){
			$threadId = $threadRecord->uid;
			$threadPosts = ThreadPostRecord::finder()->findAll('thread_id=? AND author_id=?',$threadId,$userId);
			SWPLogManager::log("Thread Posts: ",array("Thread Posts"=>$threadPosts),TLogger::WARNING,$this,"getPostsSubmittedByUser","SWP");
			//201310270613
			$postsCount = $postsCount+count($threadPosts);
		}
		
		SWPLogManager::log("The number of posts of that particular user is: ",array("postsCount"=>$postsCount),TLogger::INFO,$this,"getPostsSubmittedByUser","SWP");
		return $postsCount;
	}
    
    
}
