<?php

/**
 * Auto generated by prado-cli.php on 2008-07-11 12:26:36.
 */
class QuizGroupRecord extends VideoRecord {

    public $type=1;
    
    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }
    
    
    public function save() {
        $this->type = 1;
    	SWPLogManager::log("Save",$this->type,TLogger::INFO,$this,"save","SWP");
        parent::save();        
    }

    public static function getTagsGridContextSql() {
    	SWPLogManager::log("Getting tag grid context sql",null,TLogger::INFO,$this,"getTagsGridContextSql","SWP");
    	
    	$filter =  Prado::getApplication()->Request['filter'];
    	$filterText =  Prado::getApplication()->Request['searchtext'];
    	$qs = '';
    	
    	if( $filterText ){
			$qs = $qs."( ( uid like '$filterText' ) OR ( name like '$filterText' ) OR ( is_finished like '$filterText' ) ) AND ";    	
    	}
    	
    	if($filter){
    		
    		$arr = explode(",", $filter);
    		$qs = $qs.str_replace("\n"," "," (''='$filter' OR content_id IN(SELECT vcf.video_id FROM videos_containers vcf");
    		foreach($arr as $k => $v)
	    		if ($v)
	    		{
	    			$tcondition[] = " INNER JOIN videos_containers vc$k on vcf.video_id = vc$k.video_id and vc$k.container_id ='$v' ";
	    		}
    		if (count($tcondition)>0)
   				$tcondition = implode(' ', $tcondition );
   				$qs = $qs.$tcondition.' WHERE (CASE WHEN (SELECT count(video_id) FROM `videos_containers` vcl Where vcf.video_id = vcl.video_id group by video_id ) >= '.count($arr).' THEN 1=1 ELSE 1=2 END) ) ) AND ';
    	}
    	
   		$qs = $qs.self::getNoContextSql();
   		
        SWPLogManager::log("Getting tag grid context sql",$qs,TLogger::INFO,$this,"getTagsGridContextSql","SWP");
        return $qs;
    }

    public static function getContentTagsGridContextSql() {
    	SWPLogManager::log("Getting content grid context",NULL,TLogger::INFO,$this,"getContentTagsGridContextSql","SWP");
        $user = Prado::getApplication()->getUser()->username;
        $res = str_replace("\n"," ","(''='%filter%' OR content_id IN ( SELECT video_id FROM videos_containers vc WHERE vc.container_id in(0%filter%))) AND ").
               self::getCourseGridContextSql('content_id');
        SWPLogManager::log("Return content tag grid record",$res,TLogger::INFO,$this,"getContentTagsGridContextSql","SWP");
        return $res;
    }

    public static function getCourseGridContextSql($filterName=false) {
    	SWPLogManager::log("Getting course grid context",array("Filter name"=>$filterName),TLogger::INFO,$this,"getCourseGridContextSql","SWP");
        $user = Prado::getApplication()->getUser();
        
        // While showing the quizes in course content grid we are filtering based on the company id.
        
        $str = ($user->getCompanyID() != null ? (" AND (company_id =". $user->getCompanyID().")") : " AND 1=2");
        $res = str_replace("\n"," ","content_id IS NOT NULL AND type = 1 $str ");
        if ($filterName) {
            $sreq = Prado::getApplication()->getRequest();
            $res = str_replace('%filter%',$sreq[$filterName],$res);
        }
        SWPLogManager::log("Returns course grid context",$res,TLogger::INFO,$this,"getCourseGridContextSql","SWP");
        return $res;
/**
 * Earlier this was the additional condition we have used for filtering the data in content definition. 
 * */
        
//        AND
//                (
//                    user_id IN ( SELECT rec FROM (SELECT user_id as rec FROM products p WHERE p.content_id = '%filter%') t)
//                    OR
//                    (
//                        is_finished>0
//                    )
//                )
    }
     public static function getCoursequizesSearchContextSql() {
    	
    	$filterArr =  Prado::getApplication()->Request['filter'];
    	$tagsArr =  Prado::getApplication()->Request['tags'];
    	$qs = '';
    	if( $filterArr ){
	   	 	$filterArr =json_decode($filterArr,true);
	   	 		if(is_array($filterArr )){
			   	 	foreach($filterArr as $k => $v){
			    		if ($v)	{
			    			$w = str_replace('*','%',$v);
			    			$condition[] = "($k like '$w')";
			    		}
			   	 	}
		    		if (count($condition)>0){
   						$conditions = '('.implode(' OR ', $condition ).')';
		    		}
		    		$qs = $qs.$conditions.' AND ';
		    		
			   	 	if($tagsArr){
	    		
			    		$arr = explode(",", $tagsArr);
			    		$qs = $qs.str_replace("\n"," "," (''='$tagsArr' OR content_id IN(SELECT vcf.video_id FROM videos_containers vcf");
			    		
			    		foreach($arr as $k => $v){
				    		if ($v){
				    			$tcondition[] = " INNER JOIN videos_containers vc$k on vcf.video_id = vc$k.video_id and vc$k.container_id ='$v' ";
				    		}
			    		}
			    		if (count($tcondition)>0){
			   				$tcondition = implode(' ', $tcondition );
			    		}
			   			$qs = $qs.$tcondition.' WHERE (CASE WHEN (SELECT count(video_id) FROM `videos_containers` vcl Where vcf.video_id = vcl.video_id group by video_id ) >= '.count($arr).' THEN 1=1 ELSE 1=2 END) ) ) AND ';
			    	}
		   	 	}
	   	 	}
	   	 	$user = Prado::getApplication()->getUser();
	        $condition_string =  "is_enabled>0 AND type = 1 ".($user->getCompanyID() != null ? (' AND (company_id ='. $user->getCompanyID().')') : ' AND 1=2');
		   	$qs = $qs.$condition_string;
		  //$qs = $qs.self::getNoContextSql();
		  //echo $qs;
		  return $qs;
    	}
    
    public static function getNoContextSql() {
    	SWPLogManager::log("Getting no sql context",null,TLogger::INFO,$this,"getNoContextSql","SWP");
        $user = Prado::getApplication()->getUser();
        //if user have a company then we will show the details related to that company other wise no data.
        return "is_enabled>0 AND type = 1 ".($user->getCompanyID() != null ? (' AND (company_id ='. $user->getCompanyID().')') : ' AND 1=2');
    }
    
    public function getSecurityView()
    {
    	SWPLogManager::log("Getting Security view",null,TLogger::INFO,$this,"getSecurityView","SWP");
         $user = Prado::getApplication()->getUser();
         if ( $this->is_finished ) {
                $s = new stdClass();
                $s->name = "QuizGroupRecord.quiz-form-save-button.disable";
                $sec[] = $s;
                $s = new stdClass();
                $s->name = "QuizGroupRecord.quiz-form-finalize-button.disable";
                $sec[] = $s;
                $s = new stdClass();
                $s->name = "QuizGroupRecord.quiz-form-cancel-button.disable";
                $sec[] = $s;
                $s = new stdClass();
                $s->name = "QuizGroupRecord.new-quiz-question-button.disable";
                $sec[] = $s;
                SWPLogManager::log("Returns security view details", $sec , TLogger::INFO,$this,"getSecurityView","SWP");
                return $sec;
         }
         else {
                $s = new stdClass();
                $s->name = "QuizGroupRecord.quiz-form-save-button.enable";
                $sec[] = $s;
                $s = new stdClass();
                $s->name = "QuizGroupRecord.quiz-form-finalize-button.enable";
                $sec[] = $s;
                $s = new stdClass();
                $s->name = "QuizGroupRecord.quiz-form-cancel-button.enable";
                $sec[] = $s;
                $s = new stdClass();
                $s->name = "QuizGroupRecord.new-quiz-question-button.enable";
                $sec[] = $s;
                SWPLogManager::log("Returns security view details", $sec , TLogger::INFO,$this,"getSecurityView","SWP");
                return $sec;
         }
         return parent::getSecurityView();
    }
    
    public function getDirt() { return 0; }
    public function setDirt($v) { }
    
    protected function lockFiles() {
    	SWPLogManager::log("Lock files",null,TLogger::INFO,$this,"lockFiles","SWP");
        foreach($this->questions as $q) {
            $q->lockFiles();
        }
    }

	/**
	*	Duplicates selected quiz record by getting data based on content id of quiz, which is to be duplicated.
	*
	*/
	
     public function duplicateQuizRecord($data) {
    
     	SWPLogManager::log("Duplicte qiuz",array("data"=>$data),TLogger::INFO,$this,"duplicateQuizRecord","SWP");
		//$contentId = VideoRecord::getContentID();

		//
		//	Inserts quizes data into videos table.
		//
		
		$dataQuiz = $this->insertQuizData($data,$contentId);
		
		//
		//	Inserts quiz's questions information into quizes table.
		//
		
		$this->insertQuizQuestions( $data,$dataQuiz->content_id );
		
		//
		//	Inserts associated tags information for the quiz.
		//
		
		$this->insertVideoContainers( $data,$dataQuiz->content_id );
		SWPLogManager::log("Return content id",$dataQuiz->content_id,TLogger::INFO,$this,"duplicateQuizRecord","SWP");
		return array("fromDuplicate" => true, "contentId"=>$dataQuiz->content_id);
	}
	
	/**
	*
	*	Inserts quizes data into videos table based on content id of quiz, which needs to be duplicated.
	*
	*/
	
	public function insertQuizData( $data,$contentId ){
	
		SWPLogManager::log("Insert quiz data",array("data"=>$data, "Content id"=>$contentId),TLogger::INFO,$this,"insertQuizData","SWP");
		$quizRecord = QuizGroupRecord::find('content_id = ?', $data['content_id']);
		
		$newQuizRec = new QuizGroupRecord();
		
		$newQuizRec->parent_id 			= 		$quizRecord->parent_id;
		$newQuizRec->user_id 			= 		$quizRecord->user_id;
		$newQuizRec->name 				= 		$quizRecord->name." duplicate ";
		$newQuizRec->is_enabled 		= 		$quizRecord->is_enabled;
		$newQuizRec->short_description 	= 		$quizRecord->short_description;
		$newQuizRec->description 		= 		$quizRecord->description;
		$newQuizRec->keywords 			= 		$quizRecord->keywords;
		$newQuizRec->date_created 		= 		$quizRecord->date_created;
		$newQuizRec->date_updated 		= 		$quizRecord->date_updated;
		$newQuizRec->url 				= 		$quizRecord->url;
		$newQuizRec->is_featured 		= 		$quizRecord->is_featured;
		$newQuizRec->type 				= 		$quizRecord->type;
		$newQuizRec->hits 				= 		$quizRecord->hits;
		$newQuizRec->ordering 			= 		$quizRecord->ordering;
		$newQuizRec->images 			= 		$quizRecord->images;
		$newQuizRec->is_finished 		=		0;
		$newQuizRec->icons 				= 		$quizRecord->icons;
		$newQuizRec->cool_url 			= 		$quizRecord->cool_url;
		//$newQuizRec->content_id 		= 		$contentId;
		$newQuizRec->zones 				= 		$quizRecord->zones;
		$newQuizRec->files 				= 		$quizRecord->files;
		$newQuizRec->instructions 		= 		$quizRecord->instructions;
		$newQuizRec->predefinedtask 	= 		$quizRecord->predefinedtask;
		$newQuizRec->company_id 	= 		$quizRecord->company_id;
		$newQuizRec->setUpdateAvalton(true);	
		$newQuizRec->save();
		SWPLogManager::log("Returns quiz record",$newQuizRec,TLogger::INFO,$this,"duplicateQuizRecord","SWP");
		return $newQuizRec;
	}

	/**
	*	Inserts quiz's questions information into quizes table.
	*
	*/
	
	public function insertQuizQuestions( $data,$contentId ){
		
		SWPLogManager::log("Insert quiz questions",array("data"=>$data, "Content id"=>$contentId),TLogger::INFO,$this,"insertQuizQuestions","SWP");
		$questions = QuizRecord::finder()->findAll( 'parent_id = ?',$data['content_id'] );
		
		foreach( $questions as $question ) {
			
			$quizQuestionsRec = new QuizRecord();
			
			$quizQuestionsRec->is_enabled 			= 		$question->is_enabled;
			$quizQuestionsRec->name 				= 		$question->name;
			$quizQuestionsRec->short_description 	= 		$question->short_description;
			$quizQuestionsRec->description 			= 		$question->description;
			$quizQuestionsRec->seo_keywords 		= 		$question->seo_keywords;
			$quizQuestionsRec->date_created 		= 		$question->date_created;
			$quizQuestionsRec->date_updated 		= 		$question->date_updated;
			$quizQuestionsRec->url1 				= 		$question->url1;
			$quizQuestionsRec->url2 				= 		$question->url2;
			$quizQuestionsRec->qtype 				= 		$question->qtype;
			$quizQuestionsRec->hits 				= 		$question->hits;
			$quizQuestionsRec->ordering 			= 		$question->ordering;
			$quizQuestionsRec->images 				= 		$question->images;
			$quizQuestionsRec->author 				= 		$question->author;
			$quizQuestionsRec->from_date 			= 		$question->from_date;
			$quizQuestionsRec->to_date 				= 		$question->to_date;
			$quizQuestionsRec->category_id 			= 		$question->category_id;
			$quizQuestionsRec->parent_id 			= 		$contentId;
			$quizQuestionsRec->files 				= 		$question->files;
			$quizQuestionsRec->predefinedtask 		= 		$question->predefinedtask;
			
			$quizQuestionsRec->save();
			SWPLogManager::log("Creating quiz question object",$quizQuestionsRec,TLogger::DEBUG,$this,"insertQuizQuestions","SWP");
			$insertedQuestionId = $quizQuestionsRec->uid;
			
			$this->insertQuestionAnswers( $insertedQuestionId,$question->uid );
		}
	}
	
	public function insertQuestionAnswers( $insertedQuestionId,$questionUid ) {
		
		SWPLogManager::log("Insert quiz answers",array("Question id"=>$insertedQuestionId, "Question quiz id"=>$questionUid),TLogger::INFO,$this,"insertQuestionAnswers","SWP");
		$quizAnswerRecords = QuizAnswerRecord::finder()->findAll( 'quiz_id = ?',$questionUid );
		
		foreach( $quizAnswerRecords as $quizAnswerRecord ) {
			
			$quizAnswers = new QuizAnswerRecord();
			
			$quizAnswers->quiz_id 		= 		$insertedQuestionId;
			$quizAnswers->name 			= 		$quizAnswerRecord->name;
			$quizAnswers->good 			= 		$quizAnswerRecord->good;
			$quizAnswers->ordering 		= 		$quizAnswerRecord->ordering;
			$quizAnswers->points 		= 		$quizAnswerRecord->points;
			$quizAnswers->lang 			= 		$quizAnswerRecord->lang;
			$quizAnswers->is_enabled 	= 		$quizAnswerRecord->is_enabled;
			$quizAnswers->points 		= 		$quizAnswerRecord->points;
			$quizAnswers->lang 			= 		$quizAnswerRecord->lang;
			$quizAnswers->range_limit 	= 		$quizAnswerRecord->range_limit;
			$quizAnswers->numeric_type 	= 		$quizAnswerRecord->numeric_type;
			$quizAnswers->first_value 	= 		$quizAnswerRecord->first_value;
			$quizAnswers->second_value 	= 		$quizAnswerRecord->second_value;
			
			$quizAnswers->save();
		}
	}
	
	/**
	*
	*	Inserts associated tags information for the quiz into table video_containers
	*
	*/
	public function insertVideoContainers( $data,$contentId ){
		SWPLogManager::log("Insert video container",array("data"=>$data, "Content id"=>$contentId),TLogger::INFO,$this,"insertVideoContainers","SWP");
		$conn = $this->getDbConnection();
		$conn->setActive(true);
		
		$cmd = $conn->createCommand("SELECT `container_id`
			  FROM `videos_containers`
			 WHERE `video_id` = ".$data['content_id']."");

		$dataReader=$cmd->query();          
		$rows=$dataReader->readAll();


		for( $i=0;$i<count($rows);$i++ ){
			
			$cmd = $conn->createCommand("SET FOREIGN_KEY_CHECKS = 0;");

			$cmd->execute();

			$cmd = $conn->createCommand("INSERT INTO `videos_containers` (`video_id`,`container_id`) VALUES ('".$contentId."','".$rows[$i]['container_id']."')");

			$cmd->execute();	
		}
	}
}