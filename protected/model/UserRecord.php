<?php
/**
 * 
 * @project Fresh!
 * 
 * @package web.database

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: UserRecord.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class UserRecord extends UserAR
{
    protected $_UpdateRoles;
    protected $_rl;
    protected $_zones;

    
     protected static $Column_Security = array(
        'Role' => 200,
        'Level' => 200,
        'ParentId' => 200,
    );
     public static $RELATIONS=array
            (
            'roles'=>array(self::MANY_TO_MANY, 'RoleRecord', 'user_has_roles'),
            'thread'=>array(self::MANY_TO_MANY, 'ThreadRecord', 'thread_users')
            );
     
    /**
     * Saves data into the table. Relation updates are costly, so save only if update requested
     */
    public function save() {
        parent::save();
	   $this->saveZones();
        if ($this->getUpdateRoles())
            $this->saveRelation('roles');
	   		  
    }

    /**
     * getter for $_UpdateRoles
     * @return bool
     */
    public function getUpdateRoles() {
        return $this->_UpdateRoles;
    }

    /**
     * setter for $_UpdateRoles
     * @param bool
     */
    public function setUpdateRoles($value) {
        $this->_UpdateRoles = TPropertyValue::ensureBoolean($value);
    }

    public function getPasswordCheck()
    {
        return "";
    }

    public function setPasswordCheck($value)
    {
        return;
    }

    public function getNameUid()
    {
        return $this->Name.' ('.$this->Uid.')';
    }
    
    public function getIsFolder()
    {
        return !$this->Role;
    }
    
    public function getParentId()
    {
        return $this->Role;
    }

    public function setParentId($value)
    {
        $this->Role = $value;
        $this->Level = abs($value-3)*100;
    }

    public function getPasswordUpdate()
    {
        return '';
    }
    public function setPasswordUpdate($value)
    {
        if ($value)
            $this->Password = $value;
    }

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
   
   protected function getSecurityCriteria()
   {
       return new TActiveRecordCriteria('1=1');
         $user = Prado::getApplication()->getUser();
         $criteria = new TActiveRecordCriteria();
         $criteria->Condition = '( Uid = :UserUid OR :UserLevel >= 200 OR Role is NULL )';   
         $criteria->Parameters = array(
             ':UserLevel' => $user->MaxLevel,
             ':UserUid' => $user->Uid
         );
         return $criteria;
   }
   


    public function getExtractedRoles()
    {
    	$actualRoles = array();
    	
        if ($this->_rl === null)
        {
            foreach ($this->roles as $role)
            {
                $this->_rl['all'][$role->uid]=$role->uid;
                $this->_rl[$role->policy][$role->uid]=$role->uid;
				
               $valueRole = $this->findBySql(" SELECT name, uid from roles where 
               												name = 'instructor' ");
				
               $actualrole = array(
                'uid'=>$role->uid,
                'name'=>$role->name,
               	'instructorId'=>$valueRole->Uid,
               	'instructorName'=>$valueRole->Name
               );        
                      
               $actualRoles[] = $actualrole;
                
			    if ($role->policy == 'allow')
                    $this->_rl['maxlevel']= max($this->_rl['maxlevel'],$role->level);

                $ar = RoleRecord::getAncestorRoles($role->uid);
                foreach ($ar as $arole)
                {
                    if ($arole->policy == 'allow')
                        $this->_rl['maxlevel'] = max($this->_rl['maxlevel'],$arole->level);
                    $this->_rl['all'][$arole->uid]=$arole->uid;
                    $this->_rl[$arole->policy][$arole->uid]=$arole->uid;
                    
                }
            }
        }
         
        $this->_rl['actualRole'][] = $actualRoles;
        return $this->_rl;
    }  
    
    public function isInRole($roles,$policy='allow')
    {
    	
        $roles = (is_array($roles)) ? $roles : array($roles);
        
        foreach ($roles as $role)
        {
            if (is_numeric($role))
            {
            	var_dump( (boolean) $this->ExtractedRoles[$policy][$role] );
                return (boolean) $this->ExtractedRoles[$policy][$role];
            }
            else
            {
                $roles = RoleRecord::getAllRoles();
                $id = $roles['names'][$role];
                return  (boolean) $this->ExtractedRoles[$policy][$id];
            }
        }
        
        return false;
    }

    public function getMaxLevel()
    {
        return $this->ExtractedRoles['maxlevel'];
    }

    public function validateUnique($field,$value)
    {
        //echo $field;¨

        if ($this->uid != $value && ($res = $this->find($field.' = ?',$value)))
                return 1;
        else
                return 0;

    }
   public static function getStaticColumnSecurity()
   {
       return self::$Column_Security;
   }
   

   public function getIsAdmin() {
       return ($this->getMaxLevel() >= 300);
   }


   public function findAllWithRoles($roles) {

       $roles = (is_array($roles)) ? implode(',',$roles) : $roles;
       $user = Prado::getApplication()->getUser();
       $branch_id = $user->getUserRecord()->branch_id;
       $maxlevel = $user->getUserRecord()->MaxLevel;

       return $this->findAllBySql(" SELECT u.*
                                FROM be_users u
                                WHERE EXISTS (
                                    SELECT ur.be_users_id
                                    FROM roles r, user_has_roles ur
                                    WHERE r.uid = ur.roles_id
                                    AND u.uid = ur.be_users_id
                                    AND FIND_IN_SET(r.name,:roles)>0
                                ) AND (
                                    u.branch_id = :branch OR :maxlevel >= 300
                                )",
                               array(':roles'=> $roles,':branch'=>$branch_id,':maxlevel'=>$maxlevel)
                );

   }

    public function setZoneIDs($value) {
        if (!is_array($value))
            $this->_zones  = explode(',',$value);
        else
            $this->_zones = $value;
            //throw new JsonExeption('ZoneIDs has to be array');
    }
    
    public function getZoneIDs() {
	   if (!$this->_zones) {
		  $conn = $this->getDbConnection();
		  $conn->setActive(true);
		  $cmd = $conn->createCommand("SELECT zone_id FROM be_users_zones WHERE be_user_id = :uid");
		  $cmd->bindValue(':uid', $this->Username);
		  $this->_zones = $cmd->queryColumn();
	   }
        return $this->_zones;
    }
    
    public function saveZones() {
        
	   		//throw new FJsonException($this->_zones);

	   if ($this->_zones === null) return;
        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM be_users_zones WHERE be_user_id = :prodid");
        $cmd->bindValue(':prodid', $this->Username);
        $cmd->execute();
        foreach ($this->_zones as $zone) {
            if (is_numeric($zone)) {
                $cmd = $conn->createCommand("INSERT IGNORE be_users_zones (be_user_id, zone_id) VALUES (:uid, :zoneid)");
                $cmd->bindValue(':uid', $this->Username);
                $cmd->bindValue(':zoneid', $zone);
                $cmd->execute();
            }
        }
    }
    
   
}
