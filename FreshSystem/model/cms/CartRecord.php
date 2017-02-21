<?php

class CartRecord extends CartAR
{
	private $_user;
	
	public function getUser()
	{
		if (null === $this->_user)
			$this->_user = UserRecord::finder()->findByPk($this->uid);
		return $this->_user;
	}
	
	
	public function save()
	{
		$this->changed = time();
		parent::save();
	}
	
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}
