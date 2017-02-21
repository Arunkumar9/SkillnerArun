<?php
class ThreadCatogeryRecord extends ThreadCatogeryAR
{

		public $threadType;
	 public static $RELATIONS=array
    (
        'threadType' => array(self::BELONGS_TO, 'ThreadTypeRecord'),
    );
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}