<?php
/**
 * CREATE  TABLE `c1_video`.`message_queue` (
  *`message_id` INT NOT NULL ,
  *`consumer_key` VARCHAR(200) NULL ,
  *`message` LONGTEXT NULL ,
  *`subscribed` TINYINT NULL DEFAULT 0 ,
  *`createddate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  *PRIMARY KEY (`message_id`) ,
  *INDEX `message_key` (`consumer_key` ASC) );
*  ALTER TABLE `c1_video`.`message_queue` CHANGE COLUMN `message_id` `message_id` INT(11) NOT NULL AUTO_INCREMENT  ;
*
 *
 * @author PhaniKiran.Gutha
 *
 */
class MessageQueueAR extends FBaseActiveRecord
{
	const TABLE='message_queue';

	public $consumer_key;
	public $message;
	public $subscribed;
	public $createddate;
	public $message_id;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}