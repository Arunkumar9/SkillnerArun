<?php
/**
 * CREATE TABLE `thread_type` (
 * `uid` int(11) NOT NULL AUTO_INCREMENT,
 * `name` varchar(50) NOT NULL,
 * PRIMARY KEY (`uid`)
 *) ENGINE=InnoDB DEFAULT CHARSET=latin1

 *
 * @author PhaniKiran.Gutha
 *
 */
class ThreadTypeAR extends FBaseActiveRecord
{
	const TABLE='thread_type';

	public $uid;
	public $name;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}