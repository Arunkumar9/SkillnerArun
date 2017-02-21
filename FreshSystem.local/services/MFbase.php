<?php
/* MFbase.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 13.9.2006
 */

if(class_exists('Prado',false))
{
	die('This is not to be used within Prado Framework. This is CLI based.');
}

class Prado extends FDb
{
	public static function getUser($field)
	{
		switch ($field) {
			case 'level': return FUI::getIniValue('values.personality_level');
			case 'uid': return FUI::getIniValue('values.personality_uid');
			case 'name': return FUI::getIniValue('values.personality_name');
		}
	}
	public static function autoload($className)
	{
		include_once($className.'.php');
		if(!class_exists($className,false) && !interface_exists($className,false))
			self::fatalError("Class file for '$className' cannot be found.");
	}

	public static function fatalError($msg)
	{
		echo '<h1>Fatal Error</h1>';
		echo '<p>'.$msg.'</p>';
		if(!function_exists('debug_backtrace'))
			return;
		echo '<h2>Debug Backtrace</h2>';
		echo '<pre>';
		$index=-1;
		foreach(debug_backtrace() as $t)
		{
			$index++;
			if($index==0)  // hide the backtrace of this function
				continue;
			echo '#'.$index.' ';
			if(isset($t['file']))
				echo basename($t['file']) . ':' . $t['line'];
			else
			   echo '<PHP inner-code>';
			echo ' -- ';
			if(isset($t['class']))
				echo $t['class'] . $t['type'];
			echo $t['function'] . '(';
			if(isset($t['args']) && sizeof($t['args']) > 0)
			{
				$count=0;
				foreach($t['args'] as $item)
				{
					if(is_string($item))
					{
						$str=htmlentities(str_replace("\r\n", "", $item), ENT_QUOTES);
						if (strlen($item) > 70)
							echo "'". substr($str, 0, 70) . "...'";
						else
							echo "'" . $str . "'";
					}
					else if (is_int($item) || is_float($item))
						echo $item;
					else if (is_object($item))
						echo get_class($item);
					else if (is_array($item))
						echo 'array(' . count($item) . ')';
					else if (is_bool($item))
						echo $item ? 'true' : 'false';
					else if (is_null($item))
						echo 'NULL';
					else if (is_resource($item))
						echo get_resource_type($item);
					$count++;
					if (count($t['args']) > $count)
						echo ', ';
				}
			}
			echo ")\n";
		}
		echo '</pre>';
		exit(1);
	}
	
}

class FUI
{
	const INI_CONFIG_STORE = 'mail-filter.ini';
	
	const MY_USER_LEVEL = 0;
	const MY_USER_UID = 0;
	const MY_USER_NAME = 'SYS';
	
	const IS_SPAM = 0;
	const IS_INTERNAL = 1;
	const IS_DUPLICATE = 2;
	
	const IS_OK = 10;

	const IS_MAIL_IN = 11;
	const IS_MAIL_OUT = 12;

	const HAVE_REFERENCES = 14;
	const HAVE_PROJECT = 15;
	const HAVE_PROJECT_REFERENCE = 16;
	const HAVE_PROJECT_PHRASE = 17;
	const HAVE_IN_REPLY_TO_REFERENCE = 18;
	
	const HAVE_PARTNER_TO = 30;
	const HAVE_PARTNER_FROM = 31;
	

	const DELEGATED_MANUAL = 0;
	const DELEGATED_AUTO = 1;
	
	const ERR_FILTER_MSG = 'Error in filterChain %s';
	const ERR_WORK_MSG = 'Error in workerChain %s';
	
	const PARTNER = 'mail_partner';
	const PROJECT = 'mail_project';
	const REFERENCES = 'mail_references';
	const IN_REPLY_TO_REFERENCE = 'mail_in_reply_to_reference';
	const PROJECT_REFERENCE = 'mail_project_reference';
	const PROJECT_PHRASE = 'mail_project_phrase';
	const DUPLICATE = 'mail_duplicate';
	const IN_OUT = 'mail_in_out';


	const DIARY_RECORD = 'Diary';
	const TASK_RECORD = 'Task';
	const PROJECT_RECORD = 'Project';
	const USER_RECORD = 'User';
	const PERSON_RECORD = 'Person';

	const P_REGEXP = "/([ZVKA]-|IZ|Mg|In)([0-9]{3,4})/";


	static function trace($text,$category,$level=LOG_NOTICE)
	{
		syslog($level,$category.': '.$text);
	}
	
	static function getIniValue($name)
	{
		static $config=null;
		
		return constant('MFconfig'.ucfirst(str_replace('.','::',$name)));
/*		
		if ($config===null)
			$config = FU::readINIfile(self::INI_CONFIG_STORE);
		
		if (strpos($name,'.')===false)
			return $config['root'][$name];
		else
		{
			list($section,$key) = explode('.',$name);
			return $config[$section][$key];
		}
		*/
	}
	

	static function arraySplit($f)
	{
		return explode('|',$f);
	} 

	static function in_array_recursive($needle, $haystack, $strict=true) 
	{
		foreach ($haystack as $value) {
			if ($needle == $value) return true;
			elseif (is_array($value)) 
				if (self::in_array_recursive($needle, $value, $strict)) 
					return true;
		}
		return false;
	}
	
	static function logNotice($obj,$message,$param='')
	{
		//echo get_class($obj).': '.str_replace('%s',$param,$message)."<br>";
		syslog(LOG_NOTICE,get_class($obj).': '.str_replace('%s',$param,$message));
	}

	static function logError($obj,$message,$param='')
	{
		//echo get_class($obj).': '.str_replace('%s',$param,$message)."<br>";
		syslog(LOG_ERR,get_class($obj).': '.str_replace('%s',$param,$message));
	}
	
}	

class FDb
{
	private static $manager=null;
	private static $session=null; 

	public static function findReferenceIds($list)
	{
		$ql = FU::arrayToQuotedList($list);
		return self::getSession()->query("FROM Diary(uid) WHERE Diary.reference in($ql)");
	}

	public static function findReferenceProject($list)
	{
		$ql = FU::arrayToQuotedList($list);
		$coll = self::getSession()->query("FROM Diary(project_id):Project WHERE Diary.reference in($ql) LIMIT 1");
		if (count($coll)>0)
			return $coll[0]->project_id;
		else
			return false;
	}

	public static function findPartnerByEmail($email)
	{
		$values = FDb::getTable('Value')->findBySql('value like ?',array($email));
		if (count($values)>0)
			return $values[0]->client_id;
		else
			return false;
	}
	
	public static function validateProjectId($project)
	{
		$values = FDb::getTable('Value')->findBySql('value like ?',array($email));
		if (FDb::getTable('Project')->find($project))
			return $project;
		else
			return false;
	}
	
	public static function findMessageIdExists($msgId)
	{
		$coll = FDb::getSession()->query("FROM Diary(uid) WHERE message_id like ?",array($msgId));
		if (count($coll)>0)
			return $coll[0]->uid;
		else
			return false;
	}
	
	public static function getData()
	{
		if (self::$manager === null)
			FDb::getSession();
		
		return self::$manager;
	}
	
	public static function getSession($table=null)
	{
		 if (self::$manager === null)
		 {
		 	self::$manager = Doctrine_Manager::getInstance();
		 	self::$manager->setAttribute(Doctrine::ATTR_CREATE_TABLES, false);
		 	$dbh     = Doctrine_Db::getConnection(FUI::getIniValue('values.connection'));
		 	self::$session = self::$manager->openConnection($dbh);
		 }
		 
		 if ($table === null)
		 	return self::$session;
		 else
		 	return self::$session->getTable($table);
	}
	
	public static function getTable($table)
	{
		return self::getSession($table);
	}
	
}



class MFbase
{
	/**
	 * Returns a property value or an event handler list by property or event name.
	 * Do not call this method. This is a PHP magic method that we override
	 * to allow using the following syntax to read a property:
	 * <code>
	 * $value=$component->PropertyName;
	 * </code>
	 * and to obtain the event handler list for an event,
	 * <code>
	 * $eventHandlerList=$component->EventName;
	 * </code>
	 * @param string the property name or the event name
	 * @return mixed the property value or the event handler list
	 * @throws TInvalidOperationException if the property/event is not defined.
	 */
	public function __get($name)
	{
		$getter='get'.$name;
		if(method_exists($this,$getter))
		{
			// getting a property
			return $this->$getter();
		}
		else
		{
//			throw new TInvalidOperationException('component_property_undefined',get_class($this),$name);
		}
	}

	/**
	 * Sets value of a component property.
	 * Do not call this method. This is a PHP magic method that we override
	 * to allow using the following syntax to set a property or attach an event handler.
	 * <code>
	 * $this->PropertyName=$value;
	 * $this->EventName=$handler;
	 * </code>
	 * @param string the property name or event name
	 * @param mixed the property value or event handler
	 * @throws TInvalidOperationException If the property is not defined or read-only.
	 */
	public function __set($name,$value)
	{
		$setter='set'.$name;
		if(method_exists($this,$setter))
		{
			$this->$setter($value);
		}
		else if(method_exists($this,'get'.$name))
		{
			//throw new TInvalidOperationException('component_property_readonly',get_class($this),$name);
		}
		else
		{
			//throw new TInvalidOperationException('component_property_undefined',get_class($this),$name);
		}
	}

	/**
	 * Determines whether a property is defined.
	 * A property is defined if there is a getter or setter method
	 * defined in the class. Note, property names are case-insensitive.
	 * @param string the property name
	 * @return boolean whether the property is defined
	 */
	public function hasProperty($name)
	{
		return method_exists($this,'get'.$name) || method_exists($this,'set'.$name);
	}

	/**
	 * Determines whether a property can be read.
	 * A property can be read if the class has a getter method
	 * for the property name. Note, property name is case-insensitive.
	 * @param string the property name
	 * @return boolean whether the property can be read
	 */
	public function canGetProperty($name)
	{
		return method_exists($this,'get'.$name);
	}

	/**
	 * Determines whether a property can be set.
	 * A property can be written if the class has a setter method
	 * for the property name. Note, property name is case-insensitive.
	 * @param string the property name
	 * @return boolean whether the property can be written
	 */
	public function canSetProperty($name)
	{
		return method_exists($this,'set'.$name);
	}

}


?>
