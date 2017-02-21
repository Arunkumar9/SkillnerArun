<?php

/**
 * 
 */

class UserSettingsAR extends FBaseActiveRecord
{
	const TABLE='settings';

	public $uid;
	public $user_id;
	public $key;
	public $value;
	public $product_id;
	public $content_id;
	public $name;
	public $group;
	public $enable;

	public static function finder($className=__CLASS__) {
		
		return parent::finder($className);
	}

}