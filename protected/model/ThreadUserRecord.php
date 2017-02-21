<?php
class ThreadUserRecord extends ThreadUserAR
{

 
    public static $RELATIONS=array
    (
        'user' => array(self::BELONGS_TO,'UserRecord', 'user_id'),
    	'thread'=>array( self::BELONGS_TO,'ThreadRecord','uid')
    );
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}