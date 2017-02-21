<?php
/**
 CREATE TABLE `thread_emails` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `from` varchar(100) NOT NULL DEFAULT 'udaya.lakshmi@walkingtree.in',
  `to` varchar(100) NOT NULL DEFAULT 'tapaswini.sabat@walkingtree.in',
  `cc` varchar(100) DEFAULT NULL,
  `bcc` varchar(100) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `body` varchar(500) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'New',
  `retry_count` int(2) NOT NULL DEFAULT '10',
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`uid`),
  KEY `fk_post_email` (`post_id`),
  CONSTRAINT `fk_post_email` FOREIGN KEY (`post_id`) REFERENCES `thread_posts` (`uid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 * Enter description here ...
 * @author Tapaswini.Sabat
 *
 */
class ThreadEmailAR extends FBaseActiveRecord{

	const TABLE='thread_emails';

	public $uid;
	public $from;
	public $to;
	public $cc;
	public $bcc;
	public $subject;
	public $body;
	public $status;
	public $retry_count;
	public $post_id;
	public $logs;
	
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}