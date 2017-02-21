<?php
/**
 * CREATE TABLE `thread_posts` (
 * `uid` int(11) NOT NULL AUTO_INCREMENT,
 * `subject` varchar(500) NOT NULL,
 * `content` longtext NOT NULL,
 * `author_id` int(11) unsigned NOT NULL,
 * `created` datetime NOT NULL,
 * `thread_id` int(11) NOT NULL,
 * `updated` datetime NOT NULL,
 * `hidden` tinyint(1) NOT NULL DEFAULT '0',
 * `updated_by` int(11) DEFAULT NULL,
 * `quoted_post_id` int(11) DEFAULT NULL,
 * PRIMARY KEY (`uid`),
 * KEY `fk_thread_posts_1` (`author_id`),
 * KEY `fk_thread_posts_thread` (`thread_id`),
 * CONSTRAINT `fk_thread_posts_author` FOREIGN KEY (`author_id`) REFERENCES `be_users` (`Uid`) ON DELETE CASCADE ON UPDATE NO ACTION,
 * CONSTRAINT `fk_thread_posts_thread` FOREIGN KEY (`thread_id`) REFERENCES `thread_message` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
 *) ENGINE=InnoDB DEFAULT CHARSET=latin1
 * Enter description here ...
 * @author PhaniKiran.Gutha
 *
 */
class ThreadPostAR extends FBaseActiveRecord{

	const TABLE='thread_posts';

	public $uid;
	public $subject;
	public $content;
	public $author_id;
	public $created;
	public $thread_id;
	public $updated;
	public $hidden;
	public $udpated_by;
	public $quoted_post_id;
	public $hasattachments;
	public $hidden_from;
	public $unread_Post_Count;
	public $authorName;
	public $authorimage;
	public $attachmentSummary;
	public $threadtypeId;
	public $status;
	public $taskaction;
	public $readflag;
	public $loginuserid;
	public $threadVideoId;
	public $quizCompleted;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	}