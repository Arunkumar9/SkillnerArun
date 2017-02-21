<?php
class ThreadPostUserAR extends FBaseActiveRecord{
	const TABLE='thread_post_users';
	public $thread_id;
	public $user_id;
	public $post_id;
	public $unread_post;
	public $uid;
//	public $thread_type_id;
//	public $thread_catogery_id;
	
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	}