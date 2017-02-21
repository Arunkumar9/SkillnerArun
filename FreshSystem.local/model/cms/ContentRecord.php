<?php

interface FTypedActiveRecord {

}
class FHrefEventParamenter extends TEventParameter {
    private $_link;

    public function getLink() {
        return $this->_link;
    }

    public function setLink($value) {
        $this->_link = $value;
    }
}

class FLazyActiveRecord extends FActiveLangRecord {

    const DEFAULT_CRITERIA = 'getDefaultCriteria';
    protected $property_type = array();

    public function ensurePropertyValue($property,$value) {
        $property = strtolower($property);

        if (array_key_exists($property,$this->property_type['integer'])) {
            if ($value === null || $value === '')
                return $this->property_type['integer'][$property];
            else
                return TPropertyValue::ensureInteger($value);
        }

        if (array_key_exists($property,$this->property_type['string'])) {
            if ($value === null)
                return $this->property_type['integer'][$property];
            else
                return TPropertyValue::ensureString($value);
        }

        if (array_key_exists($property,$this->property_type['boolean'])) {
            if ($value === null || $value === '')
                return $this->property_type['boolean'][$property];
            else
                return TPropertyValue::ensureBoolean($value);
        }

        return $value;
    }

    protected function getPrimaryKeysValues() {
        $keys = $this->getRecordGateway()->getRecordTableInfo($this)->getPrimaryKeys();
        if (count($keys)>1) {
            $pks = array();
            foreach($keys as $key) {
                $pks[$key] = $this->{$key};
                if ($pks[$key] === null)
                    return null;
            }
        } else {
            $pks = $this->{$keys[0]};
        }
        //Prado::Trace('')
        return $pks;
    }

    /*
    public function setLazyRelation($relation,$value)
    {
        $_relation = '_'.$relation;
//        Prado::Trace($_relation.' setting '.get_class($this).' '.$this->uid);
        $this->{$_relation} = $value;// instanceof TList ? $value : new TList($value);
    }

    */
    public static function getDefaultCriteria() {
        return new TActiveRecordCriteria;
    }

    /*
    public function getLazyRelation($relation)
    {
        
        $_relation = '_'.$relation;
        $pks = $this->getPrimaryKeysValues();
        if($this->{$_relation}===null && $pks !==null)
        {
			$recordClass  = $this->Relations[strtolower($relation)][1];	
			//if (strtolower($relation) == 'contents') die($recordClass);
			if (!$recordClass) $recordClass = 'self';
			$criteria = call_user_func(array($recordClass,self::DEFAULT_CRITERIA));
            $withMethod = 'with'.ucfirst($relation);
            $this->setLazyRelation($relation,$this->$withMethod($criteria)->findByPk($pks)->{$_relation});
        }
        return $this->{$_relation};
    }

    
    public function __isset($name)
    {
   	$name = strtolower($name);
	$ucname = ucfirst($name);
	return (property_exists($this,$name) || property_exists($this,$ucname) || parent::__isset($name));
    	
    }

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
    	$name = strtolower($name);
		$ucname = ucfirst($name);
		if (property_exists($this,$name))
		{
			$this->$name = $value;	
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
		$name = strtolower($name);
		if ($this->relations[$name])
			return true;
		else
			return parent::__isset($name);
    	
    }

    public function __get($name)
    {
		$name = strtolower($name);
		if ($this->relations[$name])
		{
			return $this->getLazyRelation($name);	
		}
		return parent::__get($name);
    }
    
    public function __set($name,$value)
    {
		$name = strtolower($name);
		if ($this->relations[$name])
		{
			return $this->setLazyRelation($name,$value);	
		}
		return parent::__set($name,$value);
    }

    public function __call($method,$args)
	{
		$method = strtolower($method);
		$relname = str_replace(array('set','get'),'',$method);
		if ($this->relations[$relname])
		{
			if ($method == 'get'.$relname)
			{
				return $this->getLazyRelation($relname,$args);
			} elseif ($method == 'set'.$relname) {
				return $this->setLazyRelation($relname,$args);
			}
		}
		return parent::__call($method,$args);
	}

	public function getRelations()
	{
		$context = new TActiveRecordRelationContext($this);
		return $context->getRecordRelationships();
	}

    */
    public function updateByPk($data,$keys) {
        $gateCmd = $this->getRecordGateway()->getCommand($this);
        $keys = func_num_args() > 1 ? array_slice(func_get_args(),1) : null;
//		list($where, $parameters) = $this->getPrimaryKeyCondition((array)$keys);
        // $criteria = $this->getCriteria($where,$parameters);
        return $gateCmd->updateByPk($data, (array)$keys);
//		return $gateCmd->updateByPk($data, new TActiveRecordCriteria($where, $parameters));
    }

}
class FTreeActiveRecord extends FLazyActiveRecord {

    private $_typedata=null;
    private $_type=null;

    public $type_id;
    public $t;

    public function getUuid() {
        return $this->t.'-'.$this->uid;
    }

    public function getType() {
        $types = TypeRecord::getTypes();
        return $types[$this->type_id];
    }

    public function getTypeData($inherit = true) {

        //$inherit = $inherit || ($this->getType()->contains('inherit') && $this->getType()->inherit) || (!$this->getType()->contains('inherit') && Prado::getApplication()->Parameters['typesInherit']);
        $i = ($inherit) ? 1 : 0;
        if ($this instanceof FTypedActiveRecord) {
            if ($this->_typedata[$i] === null) {
                if ($inherit && ($parent = $this->parent)) {
                    $parentTypeData = $parent->getTypeData(true);
                    $localTypeData = array_merge($this->getLocalTypeData(),$this->getType()->data);
                    unset($parentTypeData['hidden']);
                    unset($parentTypeData['iconCls']);
                    unset($parentTypeData['notInMenu']);
                    $typeData = array_merge($parentTypeData,$localTypeData);
                } else {
                    $typeData = array_merge($this->getLocalTypeData(),$this->getType()->data);
                }
                $typeData['name'] = $this->getType()->name;
                $this->_typedata[$i] = $typeData;
              //  Prado::trace($this->name.' '.json_encode($typeData),'Json');
                //echo $this->uid;
                // var_dump($typeData);
            }
            return $this->_typedata[$i];

        } else {
            return array();
        }
    }

    public function setTypeData($key, $value) {
        if ($this instanceof FTypedActiveRecord && $key) {
            $this->type->data[$key] = $value;
        }
    }

    public function unsetTypeData($key) {
        if ($this instanceof FTypedActiveRecord && $key) {
            unset($this->type->data[$key]);
        }
    }

    public function getLocalTypeData() {
        return array();
    }

    public function setLocalTypeData($value) {

    }
    /**
     * Populates a new record with the query result.
     * This is a wrapper of {@link createRecord}.
     * @param array name value pair of record data
     * @return TActiveRecord object record, null if data is empty.
     */
    protected function populateObject($data)
    {
        $class = get_class($this);
        if (!($this instanceof ContainerContentRecord))
        {
            $types = TypeRecord::getTypes();
            $type_id = $data['type_id'];
            if ($type_id)
		$type = $types[$type_id];

            if ($type_id && $type && stristr($class,$type['t']))
               $class = ($type['RecordClass']) ?  $type['RecordClass'] : $class;
        }
        return self::createRecord($class, $data);
    }


    public function getIsAuthorized()
    {
        $user = Prado::getApplication()->getUser();
        $policy = $this->TypeData['policy'];
        $allow  = (boolean) ($policy != 'deny');
        $roles = $this->TypeData['roles'];
        $level = $this->TypeData['level'];

        if ($level <= $user->MaxLevel)
                return true;

        $inRole = (boolean) count(array_intersect($roles, $user->Roles));

        return ($allow) ? $inRole : !$inRole;


    }
}

class FOrderedTreeActiveRecord extends FTreeActiveRecord {

    const MAX_ORDERING = 65534;

    public function reorderBranch($parents) {

        if (!property_exists($this,'parent_id') || (!property_exists($this,'ordering') && !property_exists($this,'Ordering')))
            die('no ordering'); //return;

        if (!is_array($parents))
            $parents = array($parents);

        foreach	($parents as $parent) {
            $criteria = new TActiveRecordCriteria;
            if ($parent === null) {
                $criteria->Condition = 'parent_id IS NULL OR parent_id = 0';
            } else {
                $criteria->Condition = 'parent_id = :parent_id';
                $criteria->Parameters[':parent_id'] = $parent;
            }
            $criteria->OrdersBy['ordering'] = 'asc';
            $records = $this->findAll($criteria);

            $ordering = 1;
            foreach( $records as $record) {
                $record->ordering = $ordering*10;
                $ordering++;
                $record->save();
            }
        }
    }

    public function childrenAttributes($attr,$deep=0) {
        try {
            $count = count($this->children);
            //Prado::Trace('hidden0 '.$count);
            foreach($this->children as $c) {
                foreach($attr as $a=>$v) {
                    $pa = $a.'_parent';
                    $c->$pa = $v;
                    //Prado::Trace('hidden '.$c->name.' / '.$c->$pa);
                }
                $c->childrenAttributes($attr,$deep+1);
            }
            //if ($deep==0)
            $this->save();
        } catch (Exception $e) {

        }
    }

    public function setWriteLevel($value)
    {
        $user = Prado::getApplication()->getUser();
        $this->write_level = ($user->getMaxLevel()>$value) ? $value : $user->getMaxLevel();
    }

    public function setReadLevel($value)
    {
        $user = Prado::getApplication()->getUser();
        $this->read_level = ($user->getMaxLevel()>$value) ? $value : $user->getMaxLevel();
    }

    public function getWriteLevel()
    {
        $td = $this->getTypeData(false);
        return (int) max($this->write_level,$td['minLevel']);
    }
    public function getReadLevel()
    {
        $td = $this->getTypeData(false);
        return (int) max($this->read_level,$td['minLevel']);
    }

    public function getIsReadAllowed()
    {
        return $this->IsAllowed('read');
    }

    public function getIsWriteAllowed()
    {
        return $this->IsAllowed('write');
    }

    public function getIsDeleteAllowed()
    {
        return $this->IsAllowed('delete');
    }

    public function getIsNewAllowed()
    {
        return $this->IsAllowed('new');
    }

    public function IsAllowed($what)
    {
        $user = Prado::getApplication()->getUser();
        if ($user->getMaxLevel()>=200) return true;

        $td = $this->getTypeData();
        if ($what == 'read') {
            if ($user->getMaxLevel()<$this->getReadLevel())
                    return false;
        }
        else {
            if ($user->getMaxLevel()<$this->getWriteLevel())
                    return false;
        }

        $policy = $td['acl.'.$what.'.policy'];
        $allow = $td['acl.'.$what.'.allow'];
        $deny = $td['acl.'.$what.'.deny'];

        if (!$allow && !$deny && $policy!='deny' && Prado::getApplication()->Parameters['ACL']!='deny') return true;// &&

        $allow = explode(',', $allow);
        $deny = explode(',', $deny);

        if ($policy == 'deny')
            return !($user->isInRole($deny) || $user->isInRole($allow));

        elseif ($policy == 'allow')
            return ($user->isInRole($allow) && !$user->isInRole($deny));
        else
            return false;
    }
}

class ContentRecord extends FOrderedTreeActiveRecord implements FTypedActiveRecord {

    const TABLE='cms_contents'; //table name
    protected $property_type = array(
            'integer' => array('type_id'=>17,'hidden'=>0,'read_level'=>0,'write_level'=>0),
    );

    public $uid;
    public $code;
    public $name;
    public $data;
    public $type_id='text';
    public $parent_id;

    public $orderable;
    public $created;
    public $changed;
    public $ordering;
    public $t='content';
    public $read_level;
    public $write_level;
    public $hidden;


    protected $_container;
    ///protected $_type;

    public static $RELATIONS=array
            (
            'container' => array(self::BELONGS_TO, 'ContainerRecord'),
//        'type' => array(self::BELONGS_TO, 'TypeRecord'),
    );

    public static function getDefaultCriteria() {
        $criteria = new TActiveRecordCriteria;
        $criteria->OrdersBy['ordering'] = 'asc';
        return $criteria;
    }

    /**
     * @return TActiveRecord active record finder instance
     */
    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

    public function getCid() {
        return $this->container->cid;
    }

    public function getHref($inherit = true,$par=array()) {
        return $this->Container->getHref($inherit,$par);
    }

    public function getPagePath($inherit = true) {
        return $this->Container->getPagePath($inherit);
    }

    public function getParent() {
        return $this->container;
    }

    public function getParentId() {
        return $this->parent_id;
    }

    public function setParentId($value) {
        $this->parent_id = $value;
    }

    public function setIsFolder($value) {
        $this->t = 'content';
    }
    public function getIsFolder() {
        return ($this->t == 'container');
    }

    public function getTypeData($inherit = false) {
        return parent::getTypeData(false);
    }

    public function save() {
        parent::save();
    //    if ($cache = Prado::getApplication()->getCache())
      //          $cache->flush();
    }

}


class ContainerRecord extends FOrderedTreeActiveRecord implements FTypedActiveRecord {

    const TABLE='cms_containers'; //table name
    protected $_langRecs;
    
    protected $property_type = array(
            'integer' => array('type_id'=>17,'hidden'=>0,'hidden_parent'=>0),
    );

    public $uid;
    public $code;
    public $name;
    public $description;

    public $type_id='NormalPage';
    public $parent_id;

    public $orderable;
    public $created;
    public $changed;
    public $ordering;
    public $t='container';
    public $read_level;
    public $write_level;
    public $hidden;
    public $hidden_parent;
	public $company_id;
	public $user_id;
    
    //relations
    protected $_parent=null;
    protected $_children=null;
    protected $_contents=null;
    //protected $_type=null;
    protected $_lang_records = array();


    public static $RELATIONS=array
            (
            'parent' => array(self::BELONGS_TO, 'ContainerRecord'),
            'children' => array(self::HAS_MANY, 'ContainerRecord','parent_id','ORDER BY ordering'), //,'containers.parent_id'
            'contents' => array(self::HAS_MANY, 'ContentRecord','parent_id','ORDER BY ordering'), //,'contents.container_id'
            //       'type' => array(self::BELONGS_TO, 'TypeRecord'),
    );

    public static function getDefaultCriteria() {
        $criteria = new TActiveRecordCriteria;
        $criteria->OrdersBy['ordering'] = 'asc';
        return $criteria;
    }


    public function getAncestor($ids) {
        $ids = (is_array($ids))?$ids:explode(',', $ids);
        $parent = $this->parent;
        while ($parent) {
            if (array_search($parent->uid,$ids) !== false) return true;
            $parent = $parent->parent;
        }
        return false;
    }


    /**
     *
     * @return TActiveRecord active record finder instance
     */
    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

    public function getCid() {
        return $this->uid;
    }

    public function getHref($inherit = true,$par=array(),$force=false) {
        if ($this->cid) {
            $typeData = $this->getTypeData($inherit);
            /*                        if ($typeData['name']='link')
                        {
                            $link = $typeData['link'];
                            if (!$link)
                                return '#';
                            elseif (stripos($link,'http')===0)
                                return $link;
                            else
                                return Prado::getApplication()->getModule('cms')->getContainer($link)->getHref(true,$par);
                        }

            */
            if (!$force && ($typeData['hidden'] || $typeData['notInMenu'] || $typeData['name']=='column' )) // || $typeData['name']=='MenuRoot')
                return null;

            $params  = (is_array($typeData['pageParams']))?$typeData['pageParams']:array();
            $params = array_merge($params,$par);
            $params['uid']=$this->cid;

            $link = Prado::getApplication()->getRequest()->constructUrl('page',$typeData['pagePath'],$params);
        }
        else
            $link = null;

        //$param = new FHrefEventParamenter;
        //$param->setLink($link);
        //$this->raiseEvent('OnContainerHref',$this,$param);

        return $link;
    }

    public function getAbsoluteHref($inherit = true,$par=array(),$force=false) {
        $request = Prado::getApplication()->getRequest();
        $td = $this->getTypeData($inherit);

        if ($td && ($domain = $td['domain'])) {
            list($bareDomain,$domainPath)= explode("/", $domain, 2);
            $bareDomain = $bareDomain."/";
            $baseUrl = $request->Url->Scheme.'://'.$bareDomain;
        }
        else
            $baseUrl = $request->Url->Scheme.'://'.Prado::getApplication()->Parameters['baseDomain'].'/'; //$request->getBaseUrl();

        //$param = new FHrefEventParamenter;
        //$param->setLink($baseUrl);
        //$this->raiseEvent('OnContainerBaseUrl',$this,$param);
        $href0 = $this->getHref($inherit,$par,$force);
        
        if ($bareDomain)
            $href0 = rtrim(str_ireplace($bareDomain, "", $href0.'/'),'/');
        $href = $baseUrl.trim($href0,'/');
        if (!$domain || stripos($href, $baseUrl)===0)     //preg_match('|//.+\..+\..+/?|', $href))
            return $href;
        
        Prado::trace('UPDATING CONTAINER PATH '.$this->name.' '.$href0.' '.json_encode($this->getTypeData(false)),'Json');
//if ($this->uid == 117) die(TVarDumper::dump($par));
        $this->updateContainerPath(false);
        
        $href = $this->getHref($inherit,$par,$force);
        if ($bareDomain)
            $href = rtrim(str_ireplace($bareDomain, "", $href.'/'),'/');
        $href = $baseUrl.trim($href,'/');

        if (!$domain || stripos($href, $baseUrl.$domain)===0)     //preg_match('|//.+\..+\..+/?|', $href))
            return $href;

        return null;
    }
    public function getPagePath($inherit = true) {
        $typeData = $this->getTypeData($inherit);
        return (isset($typeData['pagePath'])) ? $typeData['pagePath'] : FU::Ini('Setup.DefaultPagePath');
    }

    public function getIconCls() {
        if($iconCls = $this->typedata['iconCls'])
            return $iconCls;
        else
            return ($this->IsFolder)?'folder':'file';
    }

    public function getLocalTypeData($fe=true) {
        //if (!$this->description) return array();

        if ($fe && ($langRec = $this->getLanguageRecord()))
            $d = $langRec->description;
        else
            $d = $this->description;
        return FU::readValues($d);   //Spyc::YAMLLoad(trim($this->description));
        //return (is_array($data)) ? $data : array();
    }

    public function setLocalTypeData($value,$fe=true) {
        if ($fe && ($langRec = $this->getLanguageRecord())) {
            $langRec->description = FU::writeValues($value);//Spyc::YAMLDump($value);
            $langRec->save();
        }
        else
            $this->description = FU::writeValues($value);//Spyc::YAMLDump($value);
    }

    public function onContainerHref() {
        $this->raiseEvent('OnContainerHref',$this,null);
    }

    public function onContainerBaseUrl() {
        $this->raiseEvent('OnContainerBaseUrl',$this,null);
    }
    /*
	public function settype_id($value) 
	{
		$this->_type_id = TPropertyValue::ensureInteger($value,0);
	}

	public function gettype_id() 
	{
		return $this->_type_id;
	}

	public function sethidden($value) 
	{
		$this->_hidden = TPropertyValue::ensureInteger($value,0);
	}

	public function gethidden() 
	{
		return $this->_hidden;
	}

    */
    public function setTid($value) {
        if (0 == count($this->children)+count($this->contents)) {
            $this->copyTemplate($value);
        }
    }

    public function copyTemplate($tid,$recordClass='ContainerRecord') {
//		if (!($rec instanceof TActiveRecord))
        //		$rec = new $recordClass;

        if ($tid instanceof TActiveRecord) {
            $c = $tid;
        } elseif (is_numeric($tid)) {

            $finder = call_user_func(array($recordClass, 'finder'));
            $c = $finder->withContents()->findByPk($tid);
        }
        //	$uid = $this->uid;
        $data = get_object_vars($c);
        unset($data['parent_id']);
        unset($data['uid']);
        unset($data['_recordState']);
        $this->copyFrom($data);
//		$this->uid = $uid;
        if (!$uid)
            $this->save();
        foreach($c->contents as $child) {
            $data = get_object_vars($child);
            unset($data['parent_id']);
            unset($data['uid']);
            unset($data['_recordState']);
            $co = new ContentRecord($data);
            $co->parent_id = $this->uid;
            $co->save();

        }
        foreach ($c->children as $child) {
            $rec = new ContainerRecord;
            $rec->copyTemplate($child);
            $rec->parent_id = $this->uid;
            $rec->save();
        }

    }

    public function setIsFolder($value) {
        $this->t = 'container';
    }
    public function getIsFolder() {
        return ($this->t == 'container');
    }

    public function setNameLang($value,$culture) {
        $lang = ucfirst($container->TypeData['lang']);

        $defLang = Prado::getApplication()->Parameters['defaultLanguage'];
        $lang = ($lang) ? $lang : $defLang;
        $culture = ucfirst($culture);
        if ($culture == $lang) {
            $this->name = $value;
            return;
        }

        //$langType = 'Language'.$culture;
        //$langRec = ContainerRecord::finder()->find('parent_id = ? AND type_id like ?',$this->uid,$langType);
        if ($langRec = $this->getLanguageRecord($culture)) {
            $langRec->name = $value;
            $this->_lang_records[$langRec->uid] = $langRec;
        }
        else {
            $langRec = new ContainerRecord;
            $langRec->parent_id = $this->uid;
            $langRec->name = $value;
            $langRec->type_id = $langType;
            $langRec->save();
        }

    }

    public function getLanguageRecord($culture=null)
    {
        if ($culture === null)
            $culture = Prado::getApplication()->getGlobalization()->getCulture();
        
        $culture = ucfirst($culture);
        if ($this->_langRecs[$culture]===null)
        {
            $this->_langRecs[$culture] = ContainerRecord::finder()->find('parent_id = ? AND type_id like ?',$this->uid,'Language'.$culture);
            $this->_langRecs[$culture] = ($this->_langRecs[$culture]) ? $this->_langRecs[$culture] : false;
        }

        return ($this->_langRecs[$culture])?$this->_langRecs[$culture]:$this;
    }

    public function getNameLang($culture) {
        $lang = ucfirst($container->TypeData['lang']);
        $defLang = Prado::getApplication()->Parameters['defaultLanguage'];
        $lang = ($lang) ? $lang : $defLang;
        $culture = ucfirst($culture);
        if ($culture == $lang)
            return $this->name;

        //$langType = 'Language'.$culture;
        //$langRec = ContainerRecord::finder()->find('parent_id = ? AND type_id like ?',$this->uid,$langType);

        if ($langRec = $this->getLanguageRecord($culture))
            return $langRec->name;
        else
            return $this->name;

    }

    public function getCoolUrl() {
        return ($this->code) ? $this->code :  sprintf('%03d-%s', $this->uid,FU::urlify($this->nameLangAct));
    }


    public function updateContainerPath($replace = true) {
        if (preg_match('/^Language[a-zA-Z]{2}$/', $this->type_id)) return;
        if ($this->type_id == 'MenuRoot' || $this->getCoolUrl() == $this->TypeData['domain'] && $this->type_id != 'HomePage' ) { //$this->type_id == 'HomePage' ||
            $path = $this->getCoolUrl();
        }
        else {
            $path = $this->TypeData['domain'].'/'.$this->getCoolUrl(); //$container->TypeData['domain']
        }
        $oldkey = ($replace) ? self::getPath($this->uid) : false;
        $conn = $this->getDbConnection();
        $conn->setActive(true);
	Prado::trace('upd path: '.$oldkey,'Json');
        try {
        if ($oldkey) {
            $cmd = $conn->createCommand("UPDATE cms_mappings SET mapkey = REPLACE(mapkey,:oldkey,:newkey) WHERE mapkey like :oldkeystart AND class = 'ContainerRecord' ");
            $cmd->bindValue(':oldkeystart', $oldkey.'%');
            $cmd->bindValue(':oldkey', $oldkey);
            $cmd->bindValue(':newkey', $path);
            $i = $cmd->execute();
        }
	if (!$oldkey || !$i) {
            $cmd = $conn->createCommand("REPLACE cms_mappings SET mapkey = :key, object_id = :uid, class = 'ContainerRecord' ");
            $cmd->bindValue(':uid', $this->uid);
            $cmd->bindValue(':key', $path);
            $cmd->execute();
        }
        }
        catch (Exception $e) {}
        return $path;
    }

    public function findByPath($path) {
        return $this->findBySql('SELECT c.* FROM cms_containers c, cms_mappings m WHERE c.uid=m.object_id AND m.mapkey like ? AND m.class = "ContainerRecord"',$path);
    }

    public static function getPath($uid) {
        if (!is_numeric($uid)) {
            $cms = Prado::getApplication()->Modules['cms'];
            $c = $cms->getContainer($uid);
            $uid = $c->uid;
        }
        $conn = self::getActiveDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("SELECT mapkey FROM cms_mappings WHERE object_id = :uid AND class = 'ContainerRecord'");
        $cmd->bindValue(':uid', $uid);
        return $cmd->queryScalar();
    }
    public function save() {
    	
    	$user = Prado::getApplication()->getUser();
        $companyFlag = $user->getCompanyLevel();
        if($companyFlag == 1) {
        	$this->company_id = $user->getCompanyID();
        }
        
        if(empty($this->user_id)){
        	$this->user_id =$user->getUid(); 
        }
        
        parent::save();
        Prado::trace('saving','json');
        $this->updateContainerPath();
   //     if ($cache = Prado::getApplication()->getCache())
     //          $d = $cache->flush();
    }

    public function updateByPk($data, $keys) {
        parent::updateByPk($data, $keys);
        Prado::trace('saving','json');
	$recs = $this->findAllByPks($keys);
	foreach($recs as $r)
	    $r->updateContainerPath(true);
    }

}

class TypeRecord {

    private static $_instance;
    protected static $_TYPES = null;

    public function findAll() {
        return self::getTypes();
    }

    public function count() {
        return count(self::getTypes());
    }

    public static function getTypes() {
        if (self::$_TYPES === null) {
            $application = Prado::getApplication();
            $cacheKey = __CLASS__ . '::' . $application->Parameters['siteTitle'];
            if( $application->getCache() )
                self::$_TYPES = $application->getCache()->get($cacheKey);

            if (!self::$_TYPES) {
                $file = dirname(__FILE__).'/types2.yml';
                $path = $application->Parameters['localTypesPath'];
                $path = ($path) ? $path : 'Application.common.localTypes';
                $localFile = Prado::getPathOfNamespace($path,'.yml');
                $types = syck_load_normalized($file);
                $localTypes = syck_load_normalized($localFile);
                if (is_array($types) && is_array($localTypes)) {
                    $types = array_merge($types,$localTypes);
                    //$types = $types+$localTypes;
                }

                $contentsPath = $application->Parameters['contentsPath'];
                $contentsPath = ($contentsPath) ? $contentsPath : 'Application.layout.contents.*';
                $localTypes = self::mergeLocalTypes($contentsPath);
                if (is_array($types) && is_array($localTypes))
                    $types = array_merge($types,$localTypes);

                //Prado::trace(TVarDumper::dump($types),'Json');
                if (is_array($types)) {
                    foreach($types as $i=>$type) {
                        $type['uid'] = $i;
                        $type['Uuid'] = $type['t'].'-'.$i;
                        if (is_array($type))
                            self::$_TYPES[$type['uid']] = new TAttributeCollection($type);
                    }
                    if ($application->getCache())
                        $application->getCache()->set($cacheKey,self::$_TYPES);
                }
            }
            //Prado::trace(TVarDumper::dump(self::$_TYPES),'Json');
        }
        return self::$_TYPES;
    }

    public static function mergeLocalTypes($path) {

        $path = Prado::getPathOfNamespace($path);
        $files = FU::rscandir($path.'/');
        $types = array();
        foreach($files as $file) {
            if (!is_file($file) || !preg_match('/\.yml$/is',$file))
                continue;

//echo $file.'<br/>';
            $localTypes = syck_load_normalized($file);
            if (is_array($types) && is_array($localTypes)) {
                $types = array_merge($types,$localTypes);
            }
        }
        return $types;
    }


    public static function finder($className=__CLASS__) {
        static $instance;

        if (!$instance)
            $instance = new $className;
        return $instance;
    }


}
/*
class TypeRecord extends FLazyActiveRecord {
	
    const TABLE='types'; //table name 
 	protected $property_type = array(
		'integer'=>array('read_level'=>0,'write_level'=>0)
	);
 
    public $uid; 
    public $name; 
    public $t;
    public $description; 
    public $data; 

    public $created;
    public $changed;
    public $read_level;
    public $write_level;
	
	public function getDataObject()
	{
		return FU::readValues($this->data);
	}
	
	public function getUuid()
	{
		return $this->t.'-'.$this->uid;
	}	
  
    public static function finder($className=__CLASS__)
    {
        return parent::finder($className);
    }

}


class UserAR extends FLazyActiveRecord {
	
    const TABLE='users'; //table name 
 	protected $property_type = array(
		'integer'=>array('level'=>0)
	);

    public $uid; 
    public $username;
    public $name; 
    public $email;
    
    public $password; 
    public $level; 
    public $role=0;
    public $created;
    public $changed;
	
  
     public static function finder($className=__CLASS__)
    {
        return parent::finder($className);
    }

}

class UserRecord extends UserAR
{
   public function getIsFolder() {
   	return false;
   }
   public function getNameUid() {
   	return $this->name.' ('.$this->uid.')';
   }
   public static function finder($className=__CLASS__)
    {
        return parent::finder($className);
    }
	
}
*/

class ContainerLinkRecord extends ContainerRecord
{
    private $_lcontainer;

    public function getLinkedContainer()
    {
        if (!$this->_lcontainer)
        {
            $cms = Prado::getApplication()->getModule('cms');
            if ($link = $this->LocalTypeData['redirectTo'])
                $this->_lcontainer = $cms->getContainer($link);
        }
        Prado::trace('LINKED CONTAINER '.$this->_lcontainer->name,'Json');
        return $this->_lcontainer;

    }

    public function getHref($inherit = true,$par=array())
    {
        if ($c = $this->getLinkedContainer())
        {
            Prado::trace('LINKED HREF '.$c->getHref($inherit,$par),'Json');
            return $c->getHref($inherit,$par);
        } else
            return parent::getHref($inherit,$par);
    }

    public function getAbsoluteHref($inherit = true,$par=array())
    {
        if (preg_match('/^(https?|ftp):/', $this->LocalTypeData['redirectTo']))
                return $this->LocalTypeData['redirectTo'];
        
        if ($c = $this->getLinkedContainer())
        {
            Prado::trace('LINKED ABSHREF '.json_encode($c->getTypeData()),'Json');
            return $c->getAbsoluteHref($inherit,$par);
        } else
            return parent::getAbsoluteHref($inherit,$par);
    }
}

class ContainerHomeRecord extends ContainerRecord
{
    private $_lcontainer;


    public function getHref($inherit = true,$par=array())
    {
        return '/';
    }
    public function getAbsoluteHref($inherit = true,$par=array(),$force=false) {
        $request = Prado::getApplication()->getRequest();
        $td = $this->getTypeData($inherit);

        if ($td && ($domain = $td['domain'])) {
            list($bareDomain,$domainPath)= explode("/", $domain, 2);
            $bareDomain = $bareDomain;
            $baseUrl = $request->Url->Scheme.'://'.$bareDomain;
        }
        else
            $baseUrl = $request->Url->Scheme.'://'.Prado::getApplication()->Parameters['baseDomain']; //$request->g
//die($baseUrl);
        return $baseUrl;
    }

}
class ContainerCategoryRecord extends ContainerRecord
{
    public $type_id = 'CategoryPage';
    public function getUuid() {
        return $this->t.'-'.$this->uid;
    }

    public function getData() {
        return $this->description;
    }

    public function getQtip() {
        $qt = 'id: '.$this->uid.'<br/>poř: '.$this->ordering.'<br/>typ: '.$this->type->description;

        $qt .= (Prado::getApplication()->getUser()->Level>200)?'<br/>TD: '.FU::writeValues($this->getTypeData()) : '';
        return $qt;
    }

    public function getNodeType() {
        $type = $this->type->name;
        if($type == 'RecycleBin')
            return $type;
        else
            return ($this->IsFolder)?'folder':'leaf';
    }
    public function getContainer() {
        return $this->parent;
    }

    public function getIsFolder() {
        return ($this->t == 'container');
    }

    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

    public static function getCategoriesOf($uid,$table,$field) {
	
	$conn = self::finder()->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("SELECT container_id FROM $table WHERE $field = :uid");
	$cmd->bindValue(':uid',$uid);
	return $cmd->queryColumn();
    }
    
    
    public function save()
    {
        if ($this->parent_id == 'root' )
                $this->type_id = 'CategoriesRoot';
        parent::save();
    }
	
	/**
     * Return the SQL where clause that will filter the tags by using the below criteria
     */
	public static function getNoContextSql() {
        $user = Prado::getApplication()->getUser();
        //Here If the User Have Company ID Then we will show the tags related to that company and the user created for him self.
        //if user does not have the compnay id then we will show the tags related to him only.
        return "type_id like 'CategoryPage' AND parent_id = 20 ".($user->getCompanyID() != null ? (' AND (company_id ='. $user->getCompanyID().' OR user_id ='.$user->getUid().')') : (' AND user_id = '.$user->getUid() ));
    }
}