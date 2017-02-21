<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class CommentRecordMgr extends TComponent {


    /**
     * @remotable
     *
     */

	public function saveRecord($params) {
		SWPLogManager::log('It should be able to save the record into DB',array("params"=>$params),TLogger::INFO,$this,"saveRecord","SWP");
		$user = $this->getUser();
		$content_id = $user->getContentID();
		$product_id = $user->getProductID();
		$user_id=$user->getUId();
		$roles= $user->getRoles();
		$i = 0;

		if( isset($params['thread_id']) && $params['thread_id']  == 0){
			$params['thread_id'] = null;
		}

		if( isset($params['chapter_id']) && $params['chapter_id'] == 0) {

			$params['chapter_id'] = null;
		}

		if( isset($params['question_id']) && $params['question_id'] == 0) {

			$params['question_id'] = null;
		}


		$uid = $params['uid'];
		if ($uid) $params = array($params);

		foreach ($params as $p) {
			$uid = $p['uid'];
			unset($p['uid']);

			$p['product_id'] = $product_id;
			if ( $p['videos_id'] == 0){
				$p['videos_id']=null;
			}
			$uids[] = $uid;

			$p['comment'] = $this->formatCommentField( $p['comment'] );
			$i =+ UserLCommentRecord::finder()->updateByPk($p,$uid);
		}

		$result = UserLCommentRecord::finder()->findAllByPks($uids);
		SWPLogManager::log('After Succesful save in to DB the records are',array("result"=>$result),TLogger::INFO,$this,"saveRecord","SWP");
		return $result;
	}

    /**
     * 
     * Appends a special character to the entered comment,
     * if that comment starts with @ or ^.
     * 
     */
    private function formatCommentField( $value ){
    	SWPLogManager::log('It should format the date enetered in the comment field',array("value"=>$value),TLogger::INFO,$this,"formatCommentField","SWP");
    	if( substr( $value, 0 ,1 ) == '@' ){
	    	$value = "@".$value;
	    	$value= json_encode( $value );
	    }
	    else if( substr( $value, 0,1 ) == '^' ){
	    	$value = "^".$value;
	    	$value= json_encode( $value );
	    }
		SWPLogManager::log('After foramting the text became : ',array("value"=>$value),TLogger::INFO,$this,"formatCommentField","SWP");
	    return $value;
    }
    /**
     * @remotable
     *
     */
    public function destroyRecord($params) {
    	 
    	SWPLogManager::log('It should delete the comment passed as an argument',array("params"=>$params),TLogger::INFO,$this,"destroyRecord","SWP");
    	$uid = $params['uid'];
    	if ($uid) $params = array($params);
    	foreach($params as $p) $uids[] = $p['uid'];
    	$result = (UserLCommentRecord::finder()->deleteByPk($uids)) ? true : false;
    	 
    	SWPLogManager::log('deletion status : ',array("result"=>$result),TLogger::INFO,$this,"destroyRecord","SWP");
    	return $result;

    }

    /**
     * @remotable
     * This method creates new comment record for a video or a quiz.  
     */
	    public function newRecord($params) {
	
	    	SWPLogManager::log('It should be able to create a new recor',array("params"=>$params),TLogger::INFO,$this,"newRecord","SWP");
	    	$all = array();
	
	    	
	    	if( is_array( $params[0] ) ){
	
	    		foreach ( $params as $p ){
	
	    			$all[] = $this->createNewRecord( $p );
	    		}
	    	}else{
	
	    		$all[] = $this->createNewRecord( $params );
	    	}
	
	    	SWPLogManager::log('New record creation successful',array("result"=>$all),TLogger::INFO,$this,"newRecord","SWP");
	    	return $all;
	    }
	    
	    /**
	     * 
	     * This method creates and saves the comment individually
	     * @param comment object with the all values passed form the classroom.js
	     * 
	     */
	    
	    private function createNewRecord( $param ){

	    	SWPLogManager::log('Coming from createNewRecord method ',array("param"=>$param),TLogger::INFO,$this,"createNewRecord","SWP");
	    	if( isset($param['thread_id']) && $param['thread_id']  == 0){
	    		$param['thread_id'] = null;
	    	}
	    	if( isset($param['chapter_id']) && $param['chapter_id'] == 0) {
	    		 
	    		$param['chapter_id'] = null;
	    	}

	    	if( isset($param['question_id']) && $param['question_id'] == 0) {
	    		 
	    		$param['question_id'] = null;
	    	}
	    	$time = explode(".", $param['ts']);

	    	$param['ts'] = $time[0];
	    	$cr = new UserLCommentRecord( $param );
	    	$cr->product_id = $this->getUser()->getProductID();
	    	$cr->content_id = $this->getUser()->getContentID();

	    	$user_id = $this->getUser()->getUId();
	    	$roles = $this->getUser()->getRoles();

	    	if ( $cr->commented_on == "Q" && $cr->videos_id != "" ) {
	    		 
	    		//
	    		// For quiz, the front end is sending the uid of the video record. However, UserLCommentRecord's video_id
	    		// is pointing to content_id of the VideoRecord. Hence, we need to get the content_id for the given video_id.
	    		//

	    		$videoRecords = VideoRecord::finder()->findAllByPks($cr->videos_id);
	    		 
	    		foreach ( $videoRecords as $videoRecord ) {
	    			 
	    			$cr->videos_id = $videoRecord->content_id;
	    			break;
	    		}

	    		//   		$quizRecord = QuizRecord::finder()->find('name=?',$param['chapter']);
	    		//   		$cr->question_id = $quizRecord->uid;

	    	}else{

	    		$cr->videos_id = null;
	    	}

	    	$cr->comment =  $this->formatCommentField( $cr->comment );
	    	$cr->save();
	    	$p['uid'] = $cr->uid;

	    	SWPLogManager::log('Creating a new comment record succesful',array("record"=>$cr),TLogger::INFO,$this,"createNewRecord","SWP");
	    	return $cr;
	    }
	    

    /**
     * @remotable
     *
     */
	    public function getRecord($params) {
	    	 
	    	SWPLogManager::log('It should return a specified comment record based on parameter passed',array("params"=>$params),TLogger::INFO,$this,"getRecord","SWP");
	    	$uid = $params['uid'];
	    	unset($params['uid']);


	    	$pid = $this->getUser()->getProductID();
	    	$contentId = $this->getUser()->getContentID();

	    	if ($pid == 0) {
	    		// UserLCommentRecord::finder()->deleteAll('product_id = 0');
	    		// return array();
	    	}

	    	if ($uid) {
	    		$userLComRec = UserLCommentRecord::finder()->findByPk($uid);
	    		SWPLogManager::log('The comment record is',$userLComRec,TLogger::INFO,$this,"getRecord","SWP");	    
	    		return $userLComRec;
			} else {
				$userLComRec = UserLCommentRecord::finder()->findAll('product_id = ? AND content_id = ?',$pid,$contentId);
				SWPLogManager::log('The comment record is',$userLComRec,TLogger::INFO,$this,"getRecord","SWP");	    
				return $userLComRec;
			}	    	
	    }

    /**
     * @remotable
     *
     */
	    public function getAllRecords($params) {

	    	SWPLogManager::log('It should return all the comment records',array("params"=>$params),TLogger::INFO,$this,"getAllRecords","SWP");
	    	$pid = $this->getUser()->getProductID();
	    	$result = UserLCommentRecord::finder()->findAll('product_id = ?',$pid);
	    	SWPLogManager::log('The comment record is',array("result"=>$result),TLogger::INFO,$this,"getAllRecords","SWP");
	    	return $result;
	    }

	protected function getUser() {
	  return Prado::getApplication()->getUser();
    }

}