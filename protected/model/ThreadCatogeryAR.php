<?php
/**
 * CREATE TABLE `thread_catogery` (
 *`uid` int(11) NOT NULL AUTO_INCREMENT,
 * `name` varchar(50) NOT NULL,
 *`thread_type_id` int(11) NOT NULL,
 *PRIMARY KEY (`uid`),
 *KEY `fk_thread_catogery_1` (`thread_type_id`),
 *CONSTRAINT `fk_thread_catogery_1` FOREIGN KEY (`thread_type_id`) REFERENCES `thread_type` (`uid`) ON DELETE CASCADE ON UPDATE NO ACTION
 *) ENGINE=InnoDB DEFAULT CHARSET=latin1
 *
 * @author PhaniKiran.Gutha
 *
 */
class ThreadCatogeryAR extends FBaseActiveRecord
{
	const TABLE='thread_catogery';

	public $uid;
	public $name;
	public $thread_type_id;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}