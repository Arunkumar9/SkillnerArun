<?php
class ThreadUserAR extends FBaseActiveRecord{
	const TABLE='thread_users';
	public $thread_id;
	public $user_id;
	public $noofposts;
	public $unread_Post_Count;
	public $uid;
	public $thread_type_id;
	public $thread_catogery_id;
	public $threadreadstatus;
	
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	}