<?php
class ThreadEmailRecord extends ThreadEmailAR
{

	public static $RELATIONS=array
	(
			'post' => array(self::BELONGS_TO,'ThreadPostRecord', 'post_id'),
			);
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}