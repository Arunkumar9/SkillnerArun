<?php
class ThreadTypeRecord extends ThreadTypeAR
{

 
    public static $RELATIONS=array
    (
        'catogeries' => array(self::HAS_MANY, 'ThreadCatogeryRecord'),
    );
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}