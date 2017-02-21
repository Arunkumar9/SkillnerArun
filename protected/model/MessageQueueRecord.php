<?php
class MessageQueueRecord extends MessageQueueAR
{

 
    
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
}