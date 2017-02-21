<?php
/**
 * Auto generated by prado-cli.php on 2008-04-17 01:03:11.
 */
class CourseContentRecord extends CourseContentAR
{
	private $_name;
	private $_type;
	private $_creator;
	private $_passingScoreValue;
	private $_lessonViewBforeQuiz;
	
     public static $RELATIONS = array
        (
        'course' => array(self::BELONGS_TO, 'CourseRecord'),
        'content' => array(self::BELONGS_TO, 'VideoRecord')
     );

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}

	public function getName() {
		if (!$this->_name) {
			$this->_name = $this->content->name;
		}
		return $this->_name;
	}
	public function setName($value) {
		$this->_name = $value;
	}

	public function getType() {
		if ($this->_type===null) {
			$this->_type = $this->content->type;
		}
		return $this->_type;
	}
	public function setType($value) {
		$this->_type = $value;
	}

	public function save() {
		if (!$this->uid) {
			$this->uid = $this->product_id.'|'.$this->video_id;
		}
		parent::save();
		if( $this->type == 1 ){
			$this->createQuizSettings();
		}
	}

    public function setCreatorName($value) {}
    
    public function getCreatorName() {
        if (!$this->_creator) {
            $this->_creator = UserRecord::finder()->findByUsername($this->content->user_id);
            if (!$this->_creator) return "";
        }
        return $this->_creator->Name;
        
    }
    
public function createQuizSettings( $uid  ) {
		
		$courseId = $uid ? $uid['courseId'] : $this->uid ; 
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find( 'coursecontent_id = ?' , $courseId );
		
		if( count( $quizSettingsRecord ) == 0 ){
			
			$quizSettings = new ProductQuizSettingsRecord();
			$quizSettings->coursecontent_id = $courseId ;
			$quizSettings->requiredpass =  0 ;
			$quizSettings->passing_score = 0 ;
			$quizSettings->required_subsequent = 0 ;
			$quizSettings->post_evaluation = 4 ;
			$quizSettings->randomize_questions = 0 ;
			$quizSettings->save();
		}
		
		$this->updateQuizLessonAssociation( $uid );
		
	}
    
	public function updateQuizLessonAssociation( $uid ) {
		
		$courseId = $uid ? $uid['courseId'] : $this->uid ; 
		$productId = $uid ? $uid['productId'] : $this->product_id ;
		$ordering = $uid ? $uid['ordering'] : $this->ordering ;
		$courseLessonsIds = array();
		$associationLessonsIds = array();
		
		$courseLessons = CourseContentRecord::finder()->findAll( 'product_id = ? AND ordering < ? AND type = 0 ', $productId,$ordering  );
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find( 'coursecontent_id = ?' , $courseId );
		$QuizLessonAssociations = ProductQuizLessonAssociationRecord::finder()->findAll( 'quiz_settings_id = ? ',$quizSettingsRecord->uid );
		
		if( count($QuizLessonAssociations) > 0 ){
			
			
			if( count($courseLessons) < count( $QuizLessonAssociations ) ){
			
				foreach( $courseLessons as $lesson ){
					array_push($courseLessonsIds,$lesson->video_id);
				} 
				foreach ( $QuizLessonAssociations as $QuizLessonAssociation ){
					
					$findKey = in_array( $QuizLessonAssociation->lesson_id,$courseLessonsIds );
					if( $findKey == false ){
							
							ProductQuizLessonAssociationRecord::finder()->deleteAll( 'lesson_id = ? ',$QuizLessonAssociation->lesson_id );
					}
				}
			}else if( count($courseLessons) > count( $QuizLessonAssociations ) ){
				
				foreach( $QuizLessonAssociations as $lesson ){
					array_push($associationLessonsIds,$lesson->lesson_id);
				} 
				foreach ( $courseLessons as $courseLesson ){
					
					$findKey = in_array( $courseLesson->video_id,$associationLessonsIds );
					if( $findKey == false ){
							
							$quizLessonAssociation = new ProductQuizLessonAssociationRecord();
							$quizLessonAssociation->quiz_settings_id = $quizSettingsRecord->uid;
							$quizLessonAssociation->lesson_id = $courseLesson->video_id ;
							$quizLessonAssociation->required_complete = 0 ;
							$quizLessonAssociation->markunviewed = 0 ;
							$quizLessonAssociation->save();
					}
				}
			
			}
			
		}else{
			foreach ( $courseLessons as $courseLesson ){
				
				$quizLessonAssociation = new ProductQuizLessonAssociationRecord();
				$quizLessonAssociation->quiz_settings_id = $quizSettingsRecord->uid;
				$quizLessonAssociation->lesson_id = $courseLesson->video_id ;
				$quizLessonAssociation->required_complete = 0 ;
				$quizLessonAssociation->markunviewed = 0 ;
				$quizLessonAssociation->save();
			}
		
		}
		
		
	}
    
	public function setRequiredComplete($value) {}
	
	public function getRequiredComplete() {
        
		if( $this->type == 1 ){
			$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find("coursecontent_id = ? ", $this->uid );
			$QuizLessonAssociations = ProductQuizLessonAssociationRecord::finder()->findAll( 'quiz_settings_id = ? AND required_complete = "1" ',$quizSettingsRecord->uid );
			//var_dump($QuizLessonAssociations);
			if( count($QuizLessonAssociations) == 0 ) return ""; 
			foreach( $QuizLessonAssociations as $QuizLessonAssociation ) {
				if( !$this->requiredComplete ) {
					
					$this->requiredComplete = array();
					array_push( $this->requiredComplete, $QuizLessonAssociation->lesson_id);
					
				}else {
					
					array_push( $this->requiredComplete, $QuizLessonAssociation->lesson_id);
				}
			}
			return $this->requiredComplete;
		}
    }
    
	public function setUnviewedLessons($value) {}
		
	public function getUnviewedLessons() {
	        
			if( $this->type == 1 ) {
				
				$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
				$QuizLessonAssociations = ProductQuizLessonAssociationRecord::finder()->findAll( 'quiz_settings_id = ? AND markunviewed = 1 ',$quizSettingsRecord->uid );
				
				foreach( $QuizLessonAssociations as $QuizLessonAssociation ) {
					if( !$this->unviewedLessons ) {
						
						$this->unviewedLessons = array();
						array_push( $this->unviewedLessons, $QuizLessonAssociation->lesson_id);
						
					}else {
						
						array_push( $this->unviewedLessons, $QuizLessonAssociation->lesson_id);
					}
				}
				return $this->unviewedLessons;
			}
			
	    }
	public function setPassingScore($value){}
	
	public function getPassingScore(){
		
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
		
		if( !$quizSettingsRecord ) return "";
		
		$passingScoreValue = $quizSettingsRecord->passing_score;
		
		$this->_passingScoreValue = $passingScoreValue;
		
		return $this->_passingScoreValue;
	}
	
	public function setPostEvaluationOption($value){}
	
	public function getPostEvaluationOption(){
		
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
		
		if( !$quizSettingsRecord ) return "";
		
		$postEvaluationOption = $quizSettingsRecord->post_evaluation;
		
		return $postEvaluationOption;
	}
	
	public function setRequiredSubsequent($value){}
	
	public function getRequiredSubsequent(){
		
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
		
		if( !$quizSettingsRecord ) return "";
		
		$requiredSubsequent = $quizSettingsRecord->required_subsequent;
		
		return $requiredSubsequent;
	}
	
	public function setPassedRequired($value){}
	
	public function getPassedRequired(){
		
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
		
		if( !$quizSettingsRecord ) return "";
		
		$passedRequired = $quizSettingsRecord->requiredpass;
		
		return $passedRequired ;
	}
	
	public function setRandomizeQuestions($value){}
	
	public function getRandomizeQuestions(){
		
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
		
		if( !$quizSettingsRecord ) return "";
		
		$randomizeQuestions = $quizSettingsRecord->randomize_questions;
		
		return $randomizeQuestions ;
	}
	public function getSettingsExist(){
		
		
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
				
		$settingsExist = $quizSettingsRecord ? true : false ;

		return $settingsExist ;
	}
	public function setRequiredCompleteCourse($value){}
	
	public function getRequiredCompleteCourse(){
		
		$quizSettingsRecord = ProductQuizSettingsRecord::finder()->find('coursecontent_id = ? ',$this->uid );
		
		if( !$quizSettingsRecord ) return "";
		
		$requiredCompleteCourse = $quizSettingsRecord->required_complete_course;
		
		return $requiredCompleteCourse ;
	}
	public function setLessonViewBforeQuiz($value) {}
	
	public function getLessonViewBforeQuiz() {
		if( $this->type == 1 ){
			$this->_lessonViewBforeQuiz  = array();
			$productLessonSubsequents = ProductLessonSettingRecord::finder()->findAll('course_id = ? AND content_id = ? AND setting_value = 1 ',
			                                              array($this->product_id ,$this->video_id ));
			if(count($productLessonSubsequents) > 0){
				foreach( $productLessonSubsequents as $productLessonSubsequent ) {
					array_push( $this->_lessonViewBforeQuiz , $productLessonSubsequent->lesson_id);
				}
			}
			return $this->_lessonViewBforeQuiz ;
		}
    }
}