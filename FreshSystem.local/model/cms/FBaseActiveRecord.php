<?php
/**
 * Base class of all active records
 */
class FICaseActiveRecord extends TActiveRecord {

    public function __get($name)
    {
    	$loname = strtolower($name);
		$ucname = ucfirst($name);
		if (property_exists($this,$loname))
		{
			return $this->$loname;	
		}
		elseif (property_exists($this,$ucname))
		{
			return $this->$ucname;	
		}
		else {
			return parent::__get($name);
		}
    }

    
    public function __set($name,$value)
    {
    	$loname = strtolower($name);
		$ucname = ucfirst($name);
		if (property_exists($this,$loname))
		{
			$this->$loname = $value;	
		}
		elseif (property_exists($this,$ucname))
		{
			$this->$ucname = $value;	
		}
		else {
			parent::__set($name,$value);
		}
    }
   
   public function __isset($name)
   {
	   	$loname = strtolower($name);
		$ucname = ucfirst($name);
		return (property_exists($this,$loname) || property_exists($this,$ucname) || parent::__isset($name));
   }

}
class FBaseActiveRecord extends FICaseActiveRecord
{
    const OWNER_FIELD = 'Uid';
    const DEFAULT_READ_LEVEL = 100;
    const DEFAULT_WRITE_LEVEL = 100;
    
    protected static $dateFormatter = null;
	protected static $recordCache=array();




    public function save() {

        parent::save();
        if ($this instanceof ILoggable) 
            FLogRecord::log($this);

    }
    
    public function __get($name)
    {
  
//if (stristr($name,'thumb') && !stristr($name,'first'))
 //die($name);
        if (preg_match('/^(.+)As(ThumbUrl(.*?)|Thumb(.*?)|DateF|DateTimeF|DateTime|Date|Object|Int|Float|String|Boolean|Filtered|List|Part[0-9]{0,2})$/',$name,$m))
        {
			$var = $m[1];
            if ($m[2]=='ThumbUrl'.$m[3]) {
                list($w,$h) = explode('x',$m[3]);
				return Prado::getApplication()->Modules['image']->getThumbnailUrl($this->$var,$w,$h);
			}
            elseif ($m[2]=='Thumb'.$m[4]) {
	            list($w,$h) = explode('x',$m[4]);
                $params = array('id'=>$this->$var);
                if ($w) {
                    $params['w'] = $w;
				}
                if ($h) {
                    $params['h'] = $h;
                }
//die(TVarDumper::dump(Prado::getApplication()->getRequest()->constructUrl('image','thumb',$params)));
                return (string) Prado::getApplication()->Modules['image']->getThumbnailUrl($this->$var,$w,$h);
		//return (string) Prado::getApplication()->getRequest()->constructUrl('image','thumb',$params);
            }
            elseif ($m[2]=='Date') { // && $this->$var != 0
                return ($this->$var) ? strftime('%Y-%m-%d',$this->$var) : null;
            }
            elseif ($m[2]=='DateTime') {
                return ($this->$var) ? strftime('%Y-%m-%d %H:%M:%S',$this->$var) : null;
            }
            elseif ($m[2]=='DateTimeF' && $this->$var > 0)
                return $this->dateFormat($this->$var,array('p','t'));
            elseif ($m[2]=='DateF' && $this->$var > 0)
                return $this->dateFormat($this->$var,'p');
           elseif ($m[2]=='Object')
		   {
               if ($this->$var === null)
			       return new stdClass;
				   
			   $obj = unserialize($this->$var);
			   return $obj;
		    }
           elseif ($m[2]=='List')
		   {
               $rel = strtolower($var);
            //   if ($this->hasProperty($rel))
              //         return explode('|',$this->$rel);
               return $this->getRelationList($rel);
		    }
            elseif ($m[2]=='Int')
                return (integer) $this->$var;
            elseif ($m[2]=='Float')
                return (float) $this->$var;
            elseif ($m[2]=='String')
                return (string) $this->$var;
            elseif ($m[2]=='Boolean')
                return (boolean) $this->$var;
            elseif (preg_match('/^Part([0-9]{0,2})$/',$m[2],$mm))
                return $this->makePart($var,$mm[1]);
            elseif ($m[2]=='Filtered')
                return preg_replace('|<style>(.*?)</style>|is', '\\1',$this->$var);
		}
        else
           return parent::__get($name);

    }

     public function makePart($field,$l=6) {

        $l =  (!$l) ? 6 : $l;
        $lines = preg_split('/<\/p/',$this->$field);

        $first = explode(' ',trim(strip_tags(preg_replace('/<p.*?>|&nbsp;/','',$lines[0]))));
        $trail = (count($first)>$l)?'...':'';
        return implode(' ',array_slice($first,0,$l)).$trail;
     }

    public function __set($name,$value)
    {
        if (preg_match('/^(.+)As(Thumb(.*?)|DateTime|Date|Object|Int|Float|String|Boolean|List)$/',$name,$m))
        {
            $var = $m[1];
            if ($m[2]=='Thumb'.$m[3]) {
            	
            }
			elseif ($m[2]=='Date' || $m[2]=='DateTime') {
                $dt = false;
                
                if(abs(intval($value)) > 10000)
	    		    $dt = intval($value);
                else
                    $dt = strtotime($value);
//                elseif (($dt = date_parse($value,'%Y-%m-%d %H:%i:%s')))
//                    $dt = mktime($dt[''])
//                elseif (($dt = date_parse($value,'%Y-%m-%d')))
//echo "$var $dt";
//                die();
                $this->$var = $dt;
            } elseif ($m[2] == 'Object') {
                $this->$var = serialize($value);
            } elseif ($m[2] == 'List') {
                $rel = strtolower($var);
                //if ($this->hasProperty($rel))
                  ///     $this->$rel = implode('|',$value);
                $this->setRelationList($rel,$value);
            } else
                $this->$var = $value;
        }
        else
            parent::__set($name,$value);
    }
    public function dateFormat($time=null,$pattern='P')
    {
        $app = Prado::getApplication()->getGlobalization();
        if (!self::$dateFormatter)
            self::$dateFormatter = new DateFormat($app->getCulture()); 

        return self::$dateFormatter->format(intval($time),$pattern);
    }
    
    public function getOwner()
    {
        if ($name = $this->getOwnerField())
        {
            $field = 'get'.$name;
            return $this->$field();
        }
        return null;
    }
    
    public function getOwnerField()
    {
        return $this->getConstant('OWNER_FIELD');
    }

    public function getConstant($name)    
    {
        return constant(get_class($this).'::'.$name);
    }
    
    public function getReadLevel()
    {
        if (property_exists(get_class($this),'ReadLevel'))
        {
            return $this->ReadLevel;
        }
        else 
        {
            return $this->getConstant('DEFAULT_READ_LEVEL');
        }
    }

    public function getWriteLevel()
    {
        if (property_exists(get_class($this),'WriteLevel'))
        {
            return $this->WriteLevel;
        }
        else 
        {
            return $this->getConstant('DEFAULT_WRITE_LEVEL');
        }
    }

    public function saveRelation($rel)
    {
        $RELATIONS = $this->getRecordRelations();  //getStaticVar('RELATIONS');
      //  var_dump($RELATIONS);
        if (!$RELATIONS || !$RELATIONS[$rel]) return;
        $table = constant($RELATIONS[$rel][1][1].'::TABLE');
        $mytable = $this->getConstant('TABLE');
        list($reltable,$field) = explode('.',$RELATIONS[$rel][1][2]);
        if (!$reltable) return;
        if ($field)
        {
          $myfield = 'uid';
        }
        else {
          $myfield = $mytable.'_id';
          $field = $table.'_id';
        }




        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM ${reltable} WHERE ${myfield} = :uid");
        $cmd->bindValue(':uid', $this->uid);
        $cmd->execute();

        foreach ($this->$rel as $relation)
        {
	        $cmd = $conn->createCommand("INSERT  ${reltable} (${field}, ${myfield}) VALUES (:relid, :uid)");
	        $cmd->bindValue(':uid', $this->uid);
	        $cmd->bindValue(':relid', $relation->uid);
	        $cmd->execute();
		}
    }

        public function getRelationList($rel)
	{
		$RELATIONS = $this->getRecordRelations();  //$RELATIONS = $this->getStaticVar('RELATIONS');
                if (!$RELATIONS || !$RELATIONS[$rel])
                    return explode('|',$this->$rel);

                $list = array();
		foreach($this->$rel as $r)
		{
			$list[] = (integer) $r->uid;
		}
		return $list;
	}

        public function setRelationList($rel,$value)
	{
		$RELATIONS = $this->getRecordRelations(); //$RELATIONS = $this->getStaticVar('RELATIONS');
                if (!$RELATIONS || !$RELATIONS[$rel])
                {
                    $this->$rel = implode('|',$value);
                }
                else
                {
                    $class = $RELATIONS[$rel][1][1];
                    $this->$rel = array();
                  //  if (count($values)>0)
                    $this->$rel = TActiveRecord::finder($class)->findAllByPks($value);
                }
	}

    public function getPrimaryKeyCondition($key)
    {
        $key = (!is_array($key))?array($key):$key;
        $keyUid = ':Uid'.time();
        $key = array_combine(array($keyUid),$key);
        if ($this->hasProperty('Uid'))
            return array("( Uid = $keyUid )",$key);
        else
            return array("( uid = $keyUid )",$key); 
    }
    
    public function secureFindAll($criteria,$params)
    {
        $c = $this->getCriteria($criteria,$params);
        return parent::findAll($c);
    }
    public function updateByPk($data,$keys)
    {
        $gateCmd = $this->getRecordGateway()->getCommand($this);
        $keys = func_num_args() > 1 ? array_slice(func_get_args(),1) : null;
		list($where, $parameters) = $this->getPrimaryKeyCondition((array)$keys);
        $criteria = $this->getCriteria($where,$parameters);
		return $gateCmd->update($data, $criteria);
    }
    
    
	/**
	 * @param array multiple primary key values or composite value arrays
	 * @return integer number of rows affected.
	 */
	public function deleteByPk($keys)
	{
        $gateCmd = $this->getRecordGateway()->getCommand($this);
//		$where = $gateCmd->getCompositeKeyCondition((array)$keys);
		list($where, $parameters) = $this->getPrimaryKeyCondition((array)$keys);
        $criteria = $this->getCriteria($where,$parameters);
		$where = $criteria->getCondition();
		$parameters = $criteria->getParameters()->toArray();
		$command = $gateCmd->getBuilder()->createDeleteCommand($where,$parameters);
		$gateCmd->onCreateCommand($command, $crit);
		$command->prepare();
		return $gateCmd->onExecuteCommand($command,$command->execute());
	}
    
    public function getProperties()
    {
          $properties = $this->getRecordGateway()->getRecordTableInfo($this)->ColumnNames;
          foreach($properties as $k=>$p) 
              $properties[$k] = trim($p,'`');

          return $properties;        
    }

	public function fromComponent($control,$prefix='')
	{
		foreach($this->getProperties() as $prop)
		{
			$typeProp = $prefix.$prop;
			try {
				if ($obj = $control->$typeProp)
				{
					if ($obj instanceof TDatePicker)
						$this->secureUpdate($prop,$obj->getData());
					elseif ($obj->hasProperty('SafeText'))
						$this->secureUpdate($prop,$obj->SafeText);
					elseif ($obj instanceof IDataRenderer)
						$this->secureUpdate($prop,$obj->getData());
					elseif ($obj->hasProperty('SelectedValue'))
						$this->secureUpdate($prop,$obj->SelectedValue);
					elseif ($obj->hasProperty('Checked'))
						$this->secureUpdate($prop,$obj->Checked);
				}
			}
			catch (Exception $e) { echo $e->ErrorMessage; }
		}
	}

	public function toComponent($control,$prefix='')
	{
		foreach($this->getProperties() as $prop)
		{
			$typeProp = $prefix.$prop;
			try {
				if ($obj = $control->$typeProp)
				{
					if ($obj instanceof IDataRenderer)
						$obj->Data = $this->$prop;
					elseif ($obj->hasProperty('Text'))
						$obj->Text = $this->$prop;
					elseif ($obj->hasProperty('SelectedValue'))
						$obj->SelectedValue = $this->$prop;
					elseif ($obj->hasProperty('Checked'))
						$obj->Checked = $this->$prop;
				}
			}
			catch (Exception $e) {}
		}
	}
    public function fromArray($ary,$prop=null)
    {
        $diffData = array();
        $properties = (is_array($prop))?$prop:$this->getProperties();
        foreach($properties as $p)
        {
              if (is_array($p))
                  $p = $p['name'];

              if (isset($ary[$p]))
              {
                  if (!$this->secureUpdate($p,$ary[$p]) || $this->$p != $ary[$p])
                      $diffData[$p] = $this->$p;
              }
        }
        return $diffData;
    }
    
    public function toArray($prop=null)
    {
          $properties = (is_array($prop))?$prop:$this->getProperties();
          foreach($properties as $p)
          {
              if (is_array($p))
                  $values[$p['name']] = $this->{$p['name']};
              else
                  $values[$p] = $this->$p;
          }
          
          return $values;
    }
    
    protected function getSecurityCriteria()
    {
         return new TActiveRecordCriteria('(1=1)');   
    }

    public function secureUpdate($p,$value)
    {
        $cs = $this->getColumnSecurity();
        if (isset($cs[$p]))
        {
            $user = Prado::getApplication()->getUser();
            if (is_string($cs[$p]))        
                $result = $user->IsInRole($cs[$p]);
            else
                $result = ($user->Level >= $cs[$p]);
                
            if ($result)
                $this->$p = $value;
            else
                return false;
        }
        else
            $this->$p = $value;
            
        return true;
    }

	/**
	 * Create a new TSqlCriteria object from a string $criteria. The $args
	 * are additional parameters and are used in place of the $parameters
	 * if $parameters is not an array and $args is an arrary.
	 * 
	 * Adds $this->SecurityCriteria from current object;
	 * 
	 * @param string|TSqlCriteria sql criteria
	 * @param mixed parameters passed by the user.
	 * @param array additional parameters obtained from function_get_args().
	 * @return TSqlCriteria criteria object.
	 */
	protected function getCriteria($criteria, $parameters, $args=array())
	{
		if(is_string($criteria))
		{
			$useArgs = !is_array($parameters) && is_array($args);
			$cri = new TActiveRecordCriteria($criteria,$useArgs ? $args : $parameters);
		}
		else if($criteria instanceof TSqlCriteria)
			$cri = $criteria;
		else
			$cri = new TActiveRecordCriteria();

        $sec = $this->getSecurityCriteria();
        if ($cond = trim($cri->getCondition()))
        {
            if (!$cri->IsNamedParameters)
            {
                $params = array();
                foreach ($cri->Parameters as $k=>$v)
                {
                    $key = ':par'.$k;
                    $cond = preg_replace('/\?/',$key,$cond,1);
                    $params[$key] = $v;
                }
                $cri->Parameters = $params;
            }
            $cri->Condition = $sec->Condition.' AND ( '.$cond.' )';
        }
        else
            $cri->Condition = $sec->Condition;
            
        $cri->Parameters->mergeWith($sec->Parameters);
        $cri->OrdersBy->mergeWith($sec->OrdersBy);
        
        return $cri;
	}

	public function getColumnSecurity()
	{
		if (method_exists(get_class($this),'getStaticColumnSecurity'))
			return call_user_func(array(get_class($this),'getStaticColumnSecurity'));
        else    
            return array();
	}
	public function findByPk($keys)
	{
		$k = func_get_args();
		$k = get_class($this).'|'.implode('|',$k);
				
		if (isset(self::$recordCache[$k]))
			return self::$recordCache[$k];

		$record = parent::findByPk($keys);
		self::$recordCache[$k] = $record;
		return $record;
	}
	
	public static function serialize($value)
	{
		$s = serialize($value);
		return self::textEncode($s);
	}
	
	public static function unserialize($value)
	{
		$decode = self::textDecode($value);
		return unserialize($decode);
	}

	public static function textDecode($value)
	{
		if ('%base64'===substr($value,0,7) || '@base64'===substr($value,0,7))
			$decode = base64_decode(substr($value,7));
		else
			$decode = $value;
			
		return $decode;
	}	
	
	public static function textEncode($value)
	{
		return '%base64'.base64_encode($value);
	}

	protected static function sqlMap()
	{
	    static $smconfig;
	    if ($smconfig)
		return $smconfig->getClient();

	    $modules = Prado::getApplication()->getModules();
	    foreach($modules as $module)
	    {
		if ($module instanceof TSqlMapConfig)
		{
		    $smconfig = $module;
		    return $smconfig->getClient();
		}
	    }
	    throw new TConfigurationException('no sqlmap configured');
	}

        public function getSecurityView()
        {
             $user = Prado::getApplication()->getUser();
             $recroles = implode(",",$this->getRecordRoles());
             $rallow = implode(',',$user->Roles['allow']);
         //    $rdeny = implode(',',$user->Roles['deny']);

             $cri =  new TActiveRecordCriteria();
             $cri->Condition = "class = 'resource' AND name like :name ".
                               "AND ( NOT EXISTS (SELECT roles_id FROM roles_has_definitions dr WHERE dr.roles_id IN ($rallow) AND dr.definitions_id = definitions.uid) ".
                               "AND (EXISTS (SELECT roles_id FROM roles_has_definitions dr WHERE dr.definitions_id = definitions.uid) ".
                               "OR EXISTS (SELECT * FROM definitions_has_definitions dd WHERE dd.uid = definitions.uid ))";
             if ($recroles)
                $cri->Condition .= "AND NOT EXISTS (SELECT * FROM definitions_has_definitions dd WHERE dd.uid = definitions.uid AND dd.definitions_id IN ($recroles)) ";

             $cri->Condition .= ")";
//echo $cri->Condition;
             $cri->Parameters[":name"] = get_class($this).'.%';

             if ($user->getIsAdmin())
                 return array();

             $res = DefinitionRecord::finder()->findAll($cri);
            //$res = DefinitionRecord::finder()->findAll("'resource' AND name like ? ",get_class($this).'.%');
            //$res = DefinitionRecord::finder()->securityFindAll("'resource' AND name like ? ",get_class($this).'.%');

            return $res;
        }

// VALIDATION METHODS


    public function validateAll($field,$value)
    {
        return 1;
    }
    public function validateUnique($field,$value)
    {
        //echo $field;¨

        if ($this->uid != $value && ($res = $this->find($field.' = ?',$value)))
                return 1;
        else
                return 0;

    }

    public function getIgnoreChangeFor()
    {
        return array();
    }

    public function renderValueFor($field)
    {
        return $this->$field;
    }

    public function getUsedKey()
    {
        return 'Uid';
    }

}

   interface ILoggable
   {
       function getIgnoreChangeFor();
       function renderValueFor($field);
   }
