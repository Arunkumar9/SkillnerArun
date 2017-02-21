<?php
/**
 * CREATE TABLE `thread_attachments` (
 * `uid` int(11) NOT NULL AUTO_INCREMENT,
 *`pkgName` varchar(100) NOT NULL,
 * `filePath` mediumtext NOT NULL,
 * `post_id` int(11) NOT NULL,
 * PRIMARY KEY (`uid`),
 * KEY `fk_post_attachment` (`post_id`),
 * CONSTRAINT `fk_post_attachment` FOREIGN KEY (`post_id`) REFERENCES `thread_posts` (`uid`) ON DELETE CASCADE ON UPDATE NO ACTION
 *) ENGINE=InnoDB DEFAULT CHARSET=latin1
 * Enter description here ...
 * @author PhaniKiran.Gutha
 *
 */
class ThreadAttachmentAR extends FBaseActiveRecord{

	const TABLE='thread_attachments';

	public $uid;
	public $filePath;
	public $post_id;
	public $size;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}