<?php
class ThreadPostUserRecord extends ThreadPostUserAR
{

 
    public static $RELATIONS=array
    (
        'user' => array(self::BELONGS_TO,'UserRecord', 'user_id'),
    	'thread'=>array( self::BELONGS_TO,'ThreadRecord','thread_id'),
    	'post'=>array( self::BELONGS_TO,'ThreadPostRecord','post_id')
    );
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}