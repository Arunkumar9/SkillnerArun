<?php
class ThreadRecord extends ThreadAR
{

	public $unread_Post_Count=false;
	 public static $RELATIONS=array
	 (
        'createdUser' => array(self::BELONGS_TO,'UserRecord', 'created_user_id'),
    	'lastUpdateUser'=>array( self::BELONGS_TO,'UserRecord','last_update_user_id'),
    'threadType'=>array( self::BELONGS_TO,'ThreadTypeRecord','thread_type_id'),
    'threadCatogery'=>array( self::BELONGS_TO,'ThreadCatogeryRecord','thread_catogery_id'),
    'student'=>array( self::BELONGS_TO,'UserRecord','student_id'),
	 'posts'=>array(self::HAS_MANY,'ThreadPostRecord','thread_id'),
	 'reference'=>array(self::BELONGS_TO,'LastRunRecord','reference_id'),
	 'threadUsers'=>array(self::HAS_MANY,'ThreadUserRecord','thread_id'),
	 );

	 public $link='';
	 public $postSubject = '';
	 public $record ='';
	 public $hidden_from='';
	 public $postCount='';
	 public $creatorPostCount = '';
	 public  $start_date;
	 public function getimage(){
	 	return '';
	 }
 public function setimage(){
	 	return '';
	 }
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}