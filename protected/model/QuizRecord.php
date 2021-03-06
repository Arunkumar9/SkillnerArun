<?php

/**
 * Auto generated by prado-cli.php on 2009-12-13 01:51:36.
 */
class QuizRecord extends QuizAR {
    
//    const TABLE='quizes';

    private $_update_categories;
    private $_qc;
    public $to_date;
    public static $RELATIONS = array
        (
        'categories' => array(self::MANY_TO_MANY, 'ContainerCategoryRecord', 'quizes_containers'),
        'answers' => array(self::HAS_MANY, 'QuizAnswerRecord', 'quiz_id', 'ORDER BY ordering'),
//        'qc' => array(self::BELONGS_TO, 'QuizGroupRecord', 'parent_id'),
//        'results' => array(self::HAS_MANY, 'QuizResultRecord', 'quiz_id', 'ORDER BY created'),
    );

    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

    public function saveCategories() {
    	SWPLogManager::log("Save category",NULL,TLogger::INFO,$this,"saveCategories","SWP");
        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM quizes_containers WHERE quiz_id = :prodid");
        $cmd->bindValue(':prodid', $this->uid);
        $cmd->execute();
        foreach ($this->categories as $category) {
            $cmd = $conn->createCommand("INSERT IGNORE quizes_containers (quiz_id, container_id) VALUES (:prodid, :catid)");
            $cmd->bindValue(':prodid', $this->uid);
            $cmd->bindValue(':catid', $category->uid);
            $cmd->execute();
        }
    }
    
    public function getImagesNN() {
    	
    	$images = (!$this->images || $this->images == 'null') ? '[]' : $this->images;
    	SWPLogManager::log("returns images if any associated with quiz question ",array("result"=>$images),TLogger::INFO,$this,"getImagesNN","SWP");
        return $images;
    }

    public function setImagesNN($value) {
        $this->images = $value;
        SWPLogManager::log("save images if any associated with quiz question ",array("image"=>$value),TLogger::INFO,$this,"setImagesNN","SWP");
    }
     /**
     * Setter for property predefinedtask
     * @param $value string
     */
    public function setPredefinedTask( $value ) {
    	SWPLogManager::log("Set predefined task",array("Param"=>$value),TLogger::INFO,$this,"setPredefinedTask","SWP");
    	if ( $value == 'on' ){

    		$this->predefinedtask = true;

    	} else {

    		$this->predefinedtask = false;
    	}
    	SWPLogManager::log("save the predefined task value into DB ",array("status"=>$this->predefinedtask),TLogger::INFO,$this,"setPredefinedTask","SWP");
		return $this->predefinedtask;
    }
	public function getFirstImage()
	{
		SWPLogManager::log("Getting first image",NULL,TLogger::INFO,$this,"getFirstImage","SWP");
		if (($list = $this->ImagesList) && $list[0])
		{
			SWPLogManager::log("returns the first image uid if any exist from the list of images associated with the Quiz",
			array("firstimageuid"=>$list[0]->uid),TLogger::INFO,$this,"getFirstImage","SWP");
			return $list[0]->uid;
		}
		return false;
	}

	public function getSecondImage()
	{
		SWPLogManager::log("Getting second image",NULL,TLogger::INFO,$this,"getSecondImage","SWP");
		if (($list = $this->ImagesList) && $list[1])
		{
			SWPLogManager::log("returns the second image uid if any exist from the list of images associated with the Quiz",
			array("secondimageuid"=>$list[1]->uid),TLogger::INFO,$this,"getSecondImage","SWP");
			return $list[1]->uid;
		}
		return $this->getFirstImage();
	}

        public function getImagesList()
	{
		SWPLogManager::log("Getting image list",NULL,TLogger::INFO,$this,"getImagesList","SWP");
		if ($this->images)
		{
			$images = json_decode($this->images);
			SWPLogManager::log("returns all the images associated with the Quiz in an array format",
			array("images"=>$images),TLogger::INFO,$this,"getImagesList","SWP");
			return $images;
		}
		return array();
	}

	public function getImagesRecords() {
		SWPLogManager::log("Getting image records",NULL,TLogger::INFO,$this,"getImagesRecords","SWP");
        $images = json_decode($this->images,true);
		$result = array();
		if (count($images))
		{
			foreach($images as $image)
				$result[] = new NewsImagesRecord($image);
		}
		SWPLogManager::log("Return image records",$result,TLogger::INFO,$this,"getImagesRecords","SWP");
		return $result;

        }
        
        
        
        
        
        
        /**
         * 
         * returns the value  of the files column in the model
         */
        public function getFilesNN() {
        	
        	$result = (!$this->files || $this->files == 'null') ? '[]' : $this->files;
        	SWPLogManager::log("returns all the trainingfiles associated with the Quiz ",
			array("trainingfiles"=>$result),TLogger::INFO,$this,"getFilesNN","SWP");
        	return $result;
        }

        /**
         * 
         * set the value sent by the front end to the files column with populating the 
         * current date to the newly assigned files
         * @param unknown_type $value
         */
        public function setFilesNN($value) {

        	$this->files = $value;
        	$rawFiles = $this->getFilesList();

        	foreach ( $rawFiles as $rawFile ){
        		if( empty( $rawFile->Date ) ){

        			$rawFile->Date = date("Y-m-d H:i:s",time());
        		}
        	}

        	$this->files = json_encode( $rawFiles );
        	SWPLogManager::log("saves all the trainingfiles associated with the Quiz in an array format",
        	array("trainingfiles"=>$this->files),TLogger::INFO,$this,"setFilesNN","SWP");
        }
    

        /**
         * 
         * returns the json decoded value of the value of file column
         */
        public function getFilesList(){
        	SWPLogManager::log("Get file list",NULL,TLogger::INFO,$this,"getFilesList","SWP");
        	if ($this->files){

        		$files = json_decode($this->files);
        		SWPLogManager::log("returns all the trainingfiles associated with the Quiz in an object format",
        		array("trainingfiles"=>$files),TLogger::INFO,$this,"getFilesList","SWP");
        		return $files;
        	}
        	return array();
        }

        
    public function getPoints($answer) {
        SWPLogManager::log("Get points of answer",array("data"=>$answer),TLogger::INFO,$this,"getPoints","SWP");
        
        if (is_array($answer)) {
            $answer[] = 0;
            $aa = implode(',',$answer);
        }
        elseif ($answer)
            $aa = $answer;
        else
            return 0;
        
        $conn = self::getActiveDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("SELECT SUM(IF(good=1,points,0)) - SUM(IF(good=0,points,0))  FROM quiz_answers WHERE uid IN ($aa) AND quiz_id = :uid" );
        $cmd->bindValue(':uid',$this->uid);
        $points = $cmd->queryScalar();
        SWPLogManager::log("Returns points",array("points"=>$points),TLogger::INFO,$this,"getPoints","SWP");
        return $points;
        
    }
    
	public function getCategoriesList()
	{
		SWPLogManager::log("Get category list",null,TLogger::INFO,$this,"getCategoriesList","SWP");
		/*$list = array();
		foreach($this->categories as $category)
		{
			$list[] = (integer) $category->uid;
		}
		return $list;*/
          return $this->getQC()->getCategoriesList();
	}

	public function setCategoriesList($value)
	{
		SWPLogManager::log("Set category list",array("data"=>$value),TLogger::INFO,$this,"setCategoriesList","SWP");
		$this->getQC()->setCategoriesList($value);
	}

    public function save()
    {
    	SWPLogManager::log("Save pre defined task value",null,TLogger::INFO,$this,"save","SWP");
    	$resultValue = $this->setPredefinedTask( $this->predefinedtask );
        
        if( $resultValue != true ){
        	
        	$this->predefinedtask = 0;
        }
        $this->getQC()->save();
        if($this->qtype == 'Task'){
        	$this->predefinedtask = 1;
        } else {
        	$this->predefinedtask = 0;
        }
        
        SWPLogManager::log("It will save the modifications for the quiz",array("record"=>$this->getQC()),TLogger::INFO,$this,"save","SWP");
        //$this->parent_id = $this->_qc->uid;
	   parent::save();
    }

	public function getUpdateCategories()
	{
		SWPLogManager::log("Get update category",null,TLogger::INFO,$this,"getUpdateCategories","SWP");
		return $this->_update_categories;
	}

 	public function setUpdateCategories($value)
	{
		SWPLogManager::log("Set update category",array("data"=>$value),TLogger::INFO,$this,"setUpdateCategories","SWP");
		$this->_update_categories = TPropertyValue::ensureBoolean($value);
	}

    public function getfrom_dateFormated() {
    	SWPLogManager::log("Get from date format",null,TLogger::INFO,$this,"getfrom_dateFormated","SWP");
    	return CuepointRecord::formatTime($this->from_date);        
    }
    public function getto_dateFormated() {
    	SWPLogManager::log("Get to date format",null,TLogger::INFO,$this,"getto_dateFormated","SWP");
    	return CuepointRecord::formatTime($this->to_date);        
    }

    public function setfrom_dateFormated($v) {
    	SWPLogManager::log("Set from date format",null,TLogger::INFO,$this,"setfrom_dateFormated","SWP");  
    	$this->from_date = CuepointRecord::deformatTime($v);        
    }
    public function setto_dateFormated($v) {  
    	SWPLogManager::log("Set to date format",null,TLogger::INFO,$this,"setto_dateFormated","SWP");
    	$this->to_date = CuepointRecord::deformatTime($v);        
    }
 
    public function setFinalized($value) {
        $this->qc->setFinalized($value);
         SWPLogManager::log("It will convert a non finalized quiz to finalized one",array(),TLogger::INFO,$this,"setFinalized","SWP");
    }
    
    public function getFinalized() {
    	
    	$status = $this->qc->getFinalized();
    	SWPLogManager::log("It should return the status of the Quiz(finalized/non finalized)",array("status"=> $status ),TLogger::INFO,$this,"getFinalized","SWP");
        return $status;
    }

    public function setqc_name($value) {
        $this->qc->name = $value;
        SWPLogManager::log("It should set the name of the quiz",array("quiz_name"=> $value ),TLogger::INFO,$this,"setqc_name","SWP");
    }
    
    public function getqc_name() {
    	
    	SWPLogManager::log("It should return the name of the Quiz",array("quiz_name"=> $this->qc->name ),TLogger::INFO,$this,"getqc_name","SWP");
        return $this->qc->name;
    }

    public function setqc_uid($value) {
        $this->parent_id;
        SWPLogManager::log("It should set the content_id of the Quiz",array("quiz_id"=> $this->parent_id ),TLogger::INFO,$this,"setqc_uid","SWP");
    }
    
    public function getqc_uid() {
    	SWPLogManager::log("It should return the content_id of the Quiz",array("quiz_id"=> $this->parent_id ),TLogger::INFO,$this,"getqc_uid","SWP");
        return $this->parent_id;
    }

    public function setUpdateAvalton($value) {
    	SWPLogManager::log("Set update avalton",array("data"=>$value),TLogger::INFO,$this,"setUpdateAvalton","SWP");
        $this->getQC()->setUpdateAvalton($value);
    }
    
    public function getUpdateAvalton() {
    	SWPLogManager::log("Get update avalton",null,TLogger::INFO,$this,"getUpdateAvalton","SWP");
        return $this->getQC()->getUpdateAvalton();
    }

    public function setqc_description($value) {
    	
    	SWPLogManager::log("It should set the description of the Quiz",array("quiz_description"=>$value ),TLogger::INFO,$this,"setqc_description","SWP");
        $this->qc->description = $value;
    }
    
    public function getqc_description() {
    	
    	SWPLogManager::log("It should return the description of the Quiz",array("quiz_description"=>$this->qc->description ),TLogger::INFO,$this,"setqc_description","SWP");
        return $this->qc->description;
    }
    
    public function getSecurityView()
    {
    	SWPLogManager::log("Get security view",null,TLogger::INFO,$this,"getSecurityView","SWP");   
    	$user = Prado::getApplication()->getUser();
    	$sec = $this->getQC()->getSecurityView();
    	if ( $this->getQC()->is_finished ) {
    		$s = new stdClass();
    		$s->name = "QuizRecord.question-form-save-button.disable";
    		$sec[] = $s;
    		$s = new stdClass();
    		$s->name = "QuizRecord.question-form-cancel-button.disable";
    		$sec[] = $s;
    		$s = new stdClass();
    		$s->name = "QuizRecord.answers-grid-toolbar.hide";
    		$sec[] = $s;
    		SWPLogManager::log("Status of the Quiz (not yet finalized)",array("result"=>$sec),TLogger::INFO,$this,"getSecurityView","SWP");
    		return $sec;
    	}
    	else {
    		$s = new stdClass();
    		$s->name = "QuizRecord.question-form-save-button.enable";
    		$sec[] = $s;
    		$s = new stdClass();
    		$s->name = "QuizRecord.question-form-cancel-button.enable";
    		$sec[] = $s;
    		$s = new stdClass();
    		$s->name = "QuizRecord.answers-grid-toolbar.show";
    		$sec[] = $s;
    		SWPLogManager::log("Status of the Quiz (not yet finalized)",array("result"=>$sec),TLogger::INFO,$this,"getSecurityView","SWP");
    		return $sec;
    	}
    	return parent::getSecurityView();
    	 
    }

   public function getQC() {
      if (!$this->_qc) {
            $this->_qc = QuizGroupRecord::finder()->find('content_id = ?',$this->parent_id);
            $this->_qc = ($this->_qc) ? $this->_qc : new QuizGroupRecord;
        }
        SWPLogManager::log("It should return the quiz record",array("quiz_record"=>$this->_qc),TLogger::INFO,$this,"getQC","SWP");
        return $this->_qc;
    }

/*    public function lockFiles() {
        
        $baseDir = Prado::getPathOfNamespace( FU::Ini('FilePanelImages.BaseDir') );
        $baseUrl =  FU::Ini('FilePanelImages.BaseUrl') ;
        $dir = Prado::getPathOfNamespace('Root.images.Components.*');
        
        foreach($this->getImagesList() as $f) {
            $p = pathinfo($f->uid);
            if (stripos($f->uid,'/'.$this->QC->user_id.'/'))
                $path = $this->QC->user_id.'/'.$p['basename'];
            else
                $path = $p['basename'];
            if (is_file($dir.'/'.$path)) touch($dir.'/'.$path.'.lock');
        }
        
    } */
    protected function lockFiles() {
        
    	SWPLogManager::log("It should be able to lock a file",array("quiz_record"=>$this->_qc),TLogger::INFO,$this,"lockFiles","SWP");
        $baseDir = Prado::getPathOfNamespace( FU::Ini('FilePanelMovies.BaseDir') );
        $baseUrl =  FU::Ini('FilePanelMovies.BaseUrl') ;
        $dir = Prado::getPathOfNamespace('Root.images.sh.*');
        
        foreach($this->getImagesList() as $f) {
            /*$p = pathinfo($f->uid);
            if (stripos($f->uid,'/'.$this->user_id.'/'))
                $path = $this->user_id.'/'.$p['basename'];
            else
                $path = $p['basename'];*/
            $path = str_ireplace($baseUrl,$baseDir,$f->uid);
            if (is_file($path)){
            	SWPLogManager::log("Locked the file",array("file_path"=>$path),TLogger::INFO,$this,"lockFiles","SWP");
            	touch($path.'.lock');
            } 
        }
        
    }

    public function getDirt() { return 0; }
    public function setDirt($v) { }
    
	/**
	*	Duplicates selected question record by getting data based on uid id of question, which is to be duplicated.
	*/
	
     public function duplicateQuestionRecord($data) {
     	
     	SWPLogManager::log("Duplicte question",array("data"=>$data),TLogger::INFO,$this,"duplicateQuestionRecord","SWP");
     	
    	$question = QuizRecord::finder()->find('uid = ? ', array($data['uid']));
		//	Inserts quiz's questions information into quizes table.
		$questionId = $this->insertDuplicateQuizQuestion( $question );
		
		SWPLogManager::log("Return content id",$questionId,TLogger::INFO,$this,"duplicateQuestionRecord","SWP");
		return array("fromDuplicate" => true, "contentId"=>$questionId, "fromQuestion" => true);
	}
	
	/**
	*	Inserts quiz's questions information into quizes table.
	*/
	public function insertDuplicateQuizQuestion( $question ){
		
		SWPLogManager::log("Getting Question Data",array("Question data"=>$question),TLogger::INFO,$this,"insertDuplicateQuizQuestion","SWP");
		$questions = QuizRecord::finder()->findAll('question_parent_id = ? ', array($question->uid));
		$allQuizQuestions = QuizRecord::finder()->findAll('parent_id = ? ', array($question->parent_id));
		
		$duplicateQuestionsCount = count($questions)+1;
		$quizQuestionsRec = new QuizRecord();
			
			$quizQuestionsRec->is_enabled 			= 		$question->is_enabled;
			$quizQuestionsRec->name 				= 		$question->name." (".$duplicateQuestionsCount.")";
			$quizQuestionsRec->short_description 	= 		$question->short_description;
			$quizQuestionsRec->description 			= 		$question->description;
			$quizQuestionsRec->seo_keywords 		= 		$question->seo_keywords;
			$quizQuestionsRec->date_created 		= 		$question->date_created;
			$quizQuestionsRec->date_updated 		= 		$question->date_updated;
			$quizQuestionsRec->url1 				= 		$question->url1;
			$quizQuestionsRec->url2 				= 		$question->url2;
			$quizQuestionsRec->qtype 				= 		$question->qtype;
			$quizQuestionsRec->hits 				= 		$question->hits;
			$quizQuestionsRec->ordering 			= 		(count($allQuizQuestions)*10)+10;
			$quizQuestionsRec->images 				= 		$question->images;
			$quizQuestionsRec->author 				= 		$question->author;
			$quizQuestionsRec->from_date 			= 		$question->from_date;
			$quizQuestionsRec->to_date 				= 		$question->to_date;
			$quizQuestionsRec->category_id 			= 		$question->category_id;
			$quizQuestionsRec->parent_id 			= 		$question->parent_id;
			$quizQuestionsRec->files 				= 		$question->files;
			$quizQuestionsRec->predefinedtask 		= 		$question->predefinedtask;
			$quizQuestionsRec->question_parent_id 	= 		$question->uid;
			
			$quizQuestionsRec->save();
			
			$insertedQuestionId = $quizQuestionsRec->uid;
			$this->insertQuestionAnswers( $insertedQuestionId,$question->uid );
			SWPLogManager::log("Return Question Id",$quizQuestionsRec->uid,TLogger::INFO,$this,"insertDuplicateQuizQuestion","SWP");
			return $quizQuestionsRec->uid;
	}
	
	/**
	*	Inserts quiz questions answers information into quiz_answers's table.
	*/
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
	 * Here we filtering the questions grid using search text.
	 */
 	public static function getQuestionsSearchContextSql() {
 		
	   	$qs = '';
        $request =  Prado::getApplication()->Request;
        $parentId = $request['parent_id'];
        $filterArr = $request['filter'];

	   	if( $parentId && $filterArr ){
	   		
	   	 	$filterArr =json_decode($filterArr,true);
	   	 	if(is_array($filterArr )){
		   	 		if (!is_array($filterArr )){
		   	 			$filterArr = array($filterArr);
		   	 		}
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
						
	   	 	}
	   	 	$qs = $qs."parent_id =".$parentId;
	   	}
 		return $qs;
    }
    
}