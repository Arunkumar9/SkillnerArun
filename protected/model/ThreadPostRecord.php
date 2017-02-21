<?php
class ThreadPostRecord extends ThreadPostAR
{
	public $attachmentSummary;
	public static $RELATIONS=array
    (
        'author' => array(self::BELONGS_TO,'UserRecord', 'author_id'),
    	'parent' => array(self::BELONGS_TO, 'ThreadPostRecord', 'quoted_post_id'),
    	'thread' => array(self::BELONGS_TO, 'ThreadRecord', 'thread_id'),
    	'attachments' => array(self::HAS_MANY, 'ThreadAttachmentRecord', 'post_id'),
    	'postUsers'=>array(self::HAS_MANY,'ThreadPostUserRecord','post_id')
    );

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}