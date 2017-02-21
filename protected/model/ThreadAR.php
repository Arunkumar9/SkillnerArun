<?php
/**
 *   `uid` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(500) NOT NULL,
  `created_user_id` int(11) unsigned NOT NULL,
  `views` int(11) NOT NULL,
  `last_update` datetime NOT NULL,
  `reference_id` int(11) NOT NULL,
  `posts` int(11) unsigned NOT NULL DEFAULT '0',
  `private` tinyint(1) NOT NULL,
  `last_update_user_id` int(11) unsigned NOT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `thread_type_id` int(11) NOT NULL,
  `thread_catogery_id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `content_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `broadcast` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
 * Enter description here ...
 * @author PhaniKiran.Gutha
 *
 */
class ThreadAR extends FBaseActiveRecord
{
	const TABLE='thread_message';

	public $uid;
	public $subject;
	public $created_user_id;
	public $views;
	public $last_update;
	public $reference_id;
	public $posts;
	public $last_update_user_id;
	public $hidden;
	public $thread_type_id;
	public $thread_catogery_id;
	public $class_id;
	public $content_id;
	public $broadcast;
	public $image;
	public $hasattachments;
	public $hidden_from;
	public $iconClicked;
	public $status;
	public $authorName;
	public $product_id;
	public $taskaction;
	public $trainingfiles;
	public $unreadcount;
	public $questionStatus;
	public $largeFile;
	public $chaptername;
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	}