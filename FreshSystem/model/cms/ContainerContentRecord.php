<?php
class ContainerContentRecord extends ContainerRecord implements FTypedActiveRecord {

    const TABLE='cms_containers'; //table name

    const FINDALL_SQL =
    "(SELECT
   		* 
	FROM 
		cms_containers 
	WHERE 
		%condition% 
	ORDER BY
		ordering 
	)
	UNION (SELECT  
		uid, 
		code, 
	    `data` as description, 
	    parent_id,
	    type_id,
	    orderable,
	    created,
	    changed,
		ordering,
	    name, 
	    t,
	    read_level,
	    write_level,
		hidden,
		null as hidden_parent
	FROM 
		cms_contents 
	WHERE
		%condition%
	ORDER BY
		ordering 
	) ORDER BY t,ordering";

    /**
     * @return TActiveRecord active record finder instance
     */
    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

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


    public function findAllChildNodes($criteria) {
        $condition = $criteria->Condition;
        $sql = str_replace('%condition%',$condition,self::FINDALL_SQL);
//var_dump($criteria->Parameters);
//die($sql);
        foreach($criteria->getParameters() as $k => $p) {
            if (preg_match('/^(content|container)-([0-9]+)$/',$p,$m))
                $params[$k] = (int) $m[2];
            elseif (is_numeric($p))
                $params[$k] = $p;
            else
                $params[$k] = '"'.$p.'"';
        }
        $sql = str_replace(array_keys($params),array_values($params),$sql);
        return $this->findAllBySql($sql);
    }

}