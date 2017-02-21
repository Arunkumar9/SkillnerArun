<?php

interface FActiveTypedRecord {}

class FActiveLangRecord extends FBaseActiveRecord
{
        
    public function __get($name)
    {
	
		if (preg_match('/^(.+)Lang([a-zA-Z]{2}|Act)$/',$name,$m))
        {
	//echo $name.'! '.$this->$var;
            $var = $m[1];
            $culture = ucfirst(($m[2] == 'Act')?FU::Culture():$m[2]);
			if ($this->canGetProperty($var.'Lang'))
			{
				$getter = 'get'.$var.'Lang';
				return $this->$getter($culture);
			}
			
			$langs = self::unserialize($this->$var);
            if (!is_array($langs))
            {
                $langs = array($culture=>$this->$var);
            }
            $value = $langs[$culture];
            
            if ( !$value || ($this instanceof FActiveTypedRecord && (!property_exists($this,'i18n') || !$this->i18n) ) )
			{
             	if ((!($pref = ucfirst(Prado::getApplication()->Parameters['defaultLanguage']))
                        ||  ( ($value != $langs[$pref])
                     //   ||    ( $pref == $culture )
                                ) )
                   && is_array($langs) )
			    	$value = array_shift($langs);
			}
            return $value;
            
		} 
        else
           return parent::__get($name);

    }

    public function __set($name,$value)
    {
        if (preg_match('/^(.+)Lang([a-zA-Z]{2}|Act)$/',$name,$m))
        {
            $var = $m[1];
            $culture = ($m[2] == 'Act')?FU::Culture():$m[2];
			if ($this->canSetProperty($var.'Lang'))
			{
				$setter = 'set'.$var.'Lang';
				$this->$setter($value,$culture);
			}
			else
			{
	            $langs = self::unserialize($this->$var);
                    if (!is_array($langs) && !($langs instanceof ArrayAccess))
                        $langs = array();

                    $langs[$culture] = $value;

                    $this->$var = self::serialize($langs);
            }
            if ($this instanceof IActiveLangSearchable)
				$this->storeSearchableValues($var,$value,$culture);
		} 
        else
            parent::__set($name,$value);
    }

    public function storeSearchableValues($var,$value,$culture) {

        $finder = ValueIndexRecord::finder();
        $domain = get_class($this).'::'.$var;
        if (!($aval = $finder->findBy('source = ? AND lang = ? AND domain = ?',$this->uid,$culture,$domain)))
            $aval = new ValueIndexRecord(array('source'=>$this->uid,'lang'=>$culture,'domain'=>$domain));

        $aval->value = strip_tags(html_entity_decode($value,ENT_QUOTES,'UTF-8'));
        $aval->save();   

    }

    public function updateSearchableValues($langs='cs',$fields=null) {

         $class = get_class($this);
         $fields = (!is_array($fields)) ? $this->getSearchableFields() : $fields;
         $langs = (!is_array($langs)) ? explode(',',$langs) : $langs;
         $cn = self::getActiveDbConnection();
         $cn->Active = true;
         $insert = $cn->createCommand('INSERT INTO value_index (source,domain,lang,value) VALUES (:source,:dmn,:lang,:value) ON DUPLICATE KEY UPDATE value=:uvalue;');

         $insert->bindParameter(":source",$this->uid,PDO::PARAM_INT);
         foreach($langs as $lang) {
              $insert->bindParameter(":lang",$lang,PDO::PARAM_STR);
              foreach($fields as $field) {
                  $f = $field.'Lang'.$lang;
                  if ($value = strip_tags(html_entity_decode($this->$f,ENT_QUOTES,'UTF-8'))) {
                      $dmn = $class.'::'.$field;
                      $insert->bindParameter(":dmn",$dmn,PDO::PARAM_STR);
                      $insert->bindParameter(":value",$value,PDO::PARAM_STR);
                      $insert->bindParameter(":uvalue",$value,PDO::PARAM_STR);
                      $i += $insert->execute();
                  }
              }

         }
    }


    public function getSearchableFields() {
        return array();
    }
     public function updateValueIndex($langs='cs',$fields=null,$where=null) {
         
         $class = get_class($this);
         $langs = (!is_array($langs)) ? explode(',',$langs) : $langs;
         $cn = self::getActiveDbConnection();
         $cn->Active = true;
         $insert = $cn->createCommand('INSERT INTO value_index (source,domain,lang,value) VALUES (:source,:dmn,:lang,:value) ON DUPLICATE KEY UPDATE value=:uvalue;');
        
         $table = $this->getRecordTableInfo()->getTableFullName();
         $where = ($where) ? 'WHERE '.$where : '';

         $fields = (!is_array($fields)) ? $this->getSearchableFields() : $fields;

         $columns = $this->getRecordTableInfo()->getLowerCaseColumnNames();
         $command = $cn->createCommand("SELECT * FROM $table ".$where);
         $dataReader = $command->query();

         while(($row=$dataReader->read())!==false) {
             
             $obj = new $class($row);
             
             $insert->bindParameter(":source",$obj->uid,PDO::PARAM_INT);
             foreach($langs as $lang) {
                  $insert->bindParameter(":lang",$lang,PDO::PARAM_STR);
                  foreach($fields as $field) {
                      $f = $field.'Lang'.$lang;
                      if ($value = strip_tags(html_entity_decode($obj->$f,ENT_QUOTES,'UTF-8'))) {
                          $dmn = $class.'::'.$field;
                          $insert->bindParameter(":dmn",$dmn,PDO::PARAM_STR);
                          $insert->bindParameter(":value",$value,PDO::PARAM_STR);
                          $insert->bindParameter(":uvalue",$value,PDO::PARAM_STR);
                          $i += $insert->execute();
                      }
                  }

             }
         }
         return $i;
     }
}

