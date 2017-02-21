<?php
/**
 *
 * @project Fresh!
 *
 * @package Fresh.web.services.json

 * @fileOverview
 *
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: FJsonTreeProvider.php 2348 2013-12-20 10:20:54Z arun $
 *
 */

/*
 * Provides json views - metadata & data
 * 
 * request params:
 * 
 * meta	    boolean   provide some metaConfig back
 * view	    string    view definition
 * id       string    node id
 * depth	num    depth of children

 * 
 * 
*/
class FJsonTreeProvider extends FJsonComponentProvider {
    const DEFAULT_PAGING=25;
    protected $_data;

    public function getJsonContent() {
    	SWPLogManager::log("This method is used to get json content related to tree",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
        if (false && !$this->getIsAuthorized()){
        	SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array('success'=>false, 'message'=>'Not authorized!'),TLogger::INFO,$this,"getJsonContent","FreshSystem");
            return array('success'=>false, 'message'=>'Not authorized!');
        }

        $user = $this->User;
        $request = Prado::getApplication()->Request;

        $id = $request['node'];


        if (!($view = $request['view'])){
        	SWPLogManager::log("Bad request!",null,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
            throw new FJsonException('Bad request!');
        }

        $cache = $this->getApplication()->getCache();
        $key = 'service:'.$request['view'].':'.$request['context'].':'.$id.':'.$user->uid;
        if ($cache && ($answer = $cache->get($key))){
        		SWPLogManager::log("getJsonContent return value.",array('component'=>$answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
                return array('component'=>$answer);
        }


            //Read View definition
        $key = $view;
        $data = $this->getYamlData($key);
        $this->setContext($data,$request['context']);
//        $this->config = $data['serverSide'];

        $recordClass = $this->context['recordClass'];
        $depth = $request['depth'];
        $start = $request['start'];

        $connection = TActiveRecord::finder('UserRecord')->getDbConnection();
        $connection->setActive(true);
        if (!$id || $id == 'root')
            $connection->createCommand('SET FOREIGN_KEY_CHECKS=0')->execute();
        $transaction=$connection->beginTransaction();
        try {
            if ($action = $this->context['action']) {
                $answer = $this->$action();
            }
            else {
                if ($this->config['readAll'] && (!$id || $id == 'root'))
                    $answer = $this->getChildrenAtOnce();
                else
                    $answer = $this->getChildren($id,$this->config['depth']);

            }
            if ($this->getRequireRebuild())
                $this->startRebuildTree();    
            //if ($this->context['flushCache'] && ($cache = $this->getApplication()->getCache()))
              //  $cache->flush();
            $transaction->commit();
        }
        catch (Exception $e) {
            $transaction->rollBack();
            $msg = $this->evalError($e->getMessage());
            $msg = ($msg)?$msg:'Internal error! '.$e->getErrorMessage();
            SWPLogManager::log("Internal error!",$msg,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
            throw new FJsonException($msg);
        }
        if (!$id || $id == 'root')
            $connection->createCommand('SET FOREIGN_KEY_CHECKS=1')->execute();

        if ($this->context['CacheFlush'] && ($cache = $this->getApplication()->getCache()))
                $d = $cache->flush();

        if ($cache && $this->context['CacheAnswer']) {
           // $answer['debug']['cached'] = strftime('%c');
            $cache->set($key,$answer);

        }

        SWPLogManager::log("getJsonContent return value.",array('component'=>$answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
        return array('component'=>$answer);
    }


    public function getData() {
    	SWPLogManager::log("getData method gets the data",null,TLogger::INFO,$this,"getData","FreshSystem");
        if ($this->_data === null) {
            $request = Prado::getApplication()->Request;
            SWPLogManager::log("Request object",$request,TLogger::DEBUG,$this,"getData","FreshSystem");
            $dataRoot = $this->context['dataRoot'];
            $data = new TMap(json_decode($request[$dataRoot],true));
            if (is_array($cm = $this->context['columnMapping'])) {
                foreach($cm as $k => $v) {
                    if ($data[$k]) {
                        $data[$v] = $data[$k];
                        unset($data[$k]);
                    }
                }
            }
//                        Prado::Trace('Data mapped','Json');
//			Prado::Trace($data,'Json');
            $this->_data = $data;
//var_dump($this->_data); die();
        }
        //echo '<br>give data...';
//		die();
		SWPLogManager::log("getData return data.",$this->_data,TLogger::INFO,$this,"getData","FreshSystem");
        return $this->_data;
    }

    public function getFinder() {
    	SWPLogManager::log("getFinder gets finder",null,TLogger::INFO,$this,"getFinder","FreshSystem");
        // echo $this->context['recordClass'];
        //var_dump($this->context);
        if (!$this->_finder) {
            $this->_finder = call_user_func(array($this->RecordClass, 'finder'));
        }
        SWPLogManager::log("getFinder return finder.",$this->_finder,TLogger::INFO,$this,"getFinder","FreshSystem");
        return $this->_finder;
    }

    public function getRecordClass() {

    	SWPLogManager::log("getRecordClass gets the record class from the context",null,TLogger::INFO,$this,"getRecordClass","FreshSystem");
        $rc = $this->context['recordClass'];
        if (!is_array($rc)){
        	SWPLogManager::log("getRecordClass return record class if not array",$rc,TLogger::INFO,$this,"getRecordClass","FreshSystem");
            return $rc;
        }

        $isFolder = $this->context['folderSign'];
        $key = $this->Data[$isFolder];

        if (!isset($rc[$key]))
            if ($this->Data[$isFolder]){
            	SWPLogManager::log("getRecordClass returns record class folder.",$rc['folder'],TLogger::INFO,$this,"getRecordClass","FreshSystem");
                return $rc['folder'];
            }
            else{
            	SWPLogManager::log("getRecordClass returns record class leaf.",$rc['leaf'],TLogger::INFO,$this,"getRecordClass","FreshSystem");
                return $rc['leaf'];
            }
        else{
        	SWPLogManager::log("getRecordClass returns record class key.",$rc[$key],TLogger::INFO,$this,"getRecordClass","FreshSystem");
            return $rc[$key];
        }
    }

    public function dualDataHelper() {
    	SWPLogManager::log("dualDataHelper method helps the data",null,TLogger::INFO,$this,"dualDataHelper","FreshSystem");
        $data = $this->getData();
        foreach($data as $k=>$p) {
            if (preg_match('/^(content|container)-([0-9]+)$/im',$p,$m)) {
                if ($k=='Uid' || $k=='uid') {
                    $this->Data['t'] = $m[1];
                }
                $this->Data[$k] = $m[2];
                //	echo "\$this->Data[$k] = $m[2];";
            }
//			elseif ($k=='Uid') {
//				$this->Data['t'] = 'container';
//			}
        }
    }

    public function updateNodeDual() {
    	
    	SWPLogManager::log("updateNodeDual method updates the node",null,TLogger::INFO,$this,"updateNodeDual","FreshSystem");
//$data = $this->getData();
//var_dump($data);
//die();
        /*
		$runReorder = false;
		foreach($data as $k=>$p) {
			if (preg_match('/^(content|container)-([0-9]+)$/im',$p,$m)) {
				if ($k=='Uid') {
					$this->Data['t'] = $m[1];
				}
				$this->Data[$k] = $m[2];
			//	echo "\$this->Data[$k] = $m[2];";
			}
			elseif ($k=='Uid') {
				$this->Data['t'] = 'container';
			}
			if ('ordering'===strtolower($k))
			{
				$runReorder = true;				
			}
		}
        */
        $this->dualDataHelper();
        $runReorder = isset($this->Data['ordering']) || isset($this->Data['Ordering']);

//var_dump($this->Data->toArray());die();
        $upd = $this->updateNode();

        if ($runReorder && $upd['id'] && $this->finder instanceof FOrderedTreeActiveRecord) {
            $uid = ($upd['uid'])?$upd['uid']:$upd['id'];
            Prado::trace('Running reorder ','Json');
            $ro = $this->finder->findByPk($uid);
            $parent = $this->context['parent'];
            $parent = ($parent)?$parent:'parent_id';
            $this->finder->reorderBranch($ro->$parent);
        }
        SWPLogManager::log("updateNodeDual method returns updated node.",$upd,TLogger::INFO,$this,"updateNodeDual","FreshSystem");
        return $upd;


    }

    public function updateNode() {
    	SWPLogManager::log("updateNode method updates the node",null,TLogger::INFO,$this,"updateNode","FreshSystem");
        $data = $this->Data->toArray();
        $uid = $data['Uid'];
        if ($uid) {
            unset($data['Uid']);
            try {
                $this->finder->updateByPk($data,$uid);
            } catch (Exception $e) {
                $rec = $this->finder->findByPk($uid);
                foreach($data as $k=>$v) {
                    $rec->$k = $v;
                }
                $rec->save();
            }
            if (isset($data[$this->config['parent']]))
                $this->setRequireRebuild(true);
            SWPLogManager::log("success",array('message'=>$this->context['successMsg'],'success'=>true,'id'=>$uid),TLogger::INFO,$this,"updateNode","FreshSystem");
            return array('message'=>$this->context['successMsg'],'success'=>true,'id'=>$uid);
        }
        else {
            $class = $this->RecordClass;
            $n = new $class($data);
            $n->save();
            $this->setRequireRebuild(true);
            $returnId = ($this->context['returnId'])?$this->context['returnId']:'Uid';
            SWPLogManager::log("success",array('message'=>$this->context['successMsg'],'success'=>true,'id'=>$n->$returnId,'uid'=>$n->uid),TLogger::INFO,$this,"updateNode","FreshSystem");
            return array('message'=>$this->context['successMsg'],'success'=>true,'id'=>$n->$returnId,'uid'=>$n->uid);
        }
    }

    public function removeNodeDual() {
    	SWPLogManager::log("removeNodeDual removes the node",null,TLogger::INFO,$this,"removeNodeDual","FreshSystem");
        $this->dualDataHelper();
        $removedNode = $this->removeNode();
        SWPLogManager::log("removeNodeDual returns removed node.",$removedNode,TLogger::INFO,$this,"removeNodeDual","FreshSystem");
        return $removedNode;
    }

    public function removeNode() {
    	SWPLogManager::log("removeNode method removes node",null,TLogger::INFO,$this,"removeNode","FreshSystem");
        $data = $this->Data;
        $uid = $data['Uid'];
        if ($uid) {
            $count = $this->finder->DeleteByPk($uid);
            if ($count>0) {
                $this->setRequireRebuild(true);
                SWPLogManager::log("success",array('message'=>$this->context['successMsg'],'success'=>true),TLogger::INFO,$this,"removeNode","FreshSystem");
                return array('message'=>$this->context['successMsg'],'success'=>true);
            }
            else{
            	SWPLogManager::log("Cannot remove!",null,TLogger::ERROR,$this,"removeNode","FreshSystem");
                throw new FJsonException('Cannot remove!');
            }
        }
        else {
        	SWPLogManager::log("Wrong request!",null,TLogger::ERROR,$this,"removeNode","FreshSystem");
            throw new FJsonException('Wrong request!');
        }
    }

    protected function getChildrenAtOnce($records=null) {
    	
    	SWPLogManager::log("getChildrenAtOnce method expecting records as param",$records,TLogger::INFO,$this,"getChildrenAtOnce","FreshSystem");
        if ($records === null) {
            $c = $this->getCriteria();
            if (method_exists($this->finder,'findAllChildNodes'))
                $records = $this->finder->findAllChildNodes($c);
            elseif (method_exists($this->finder,'secureFindAll'))
                $records = $this->finder->secureFindAll($c);
            else
                $records = $this->finder->findAll($c);
        }
        $isFolder = $this->config['folderSign'];
        $leaf = $this->config['leaf'];
        $folder = $this->config['folder'];
        $child = $this->config['child'];
        $parent = $this->config['parent'];

        $nodes = array();
        foreach($records as $r) {
            if (!$this->postSqlCondition($r)) continue;
            $node = array();
            if ($r->$isFolder) {
                foreach($folder as $k => $prop) {
                    $node[$k] = $this->getValue($prop,$r);
                }
            }
            else {
                foreach($leaf as $k => $prop) {
                    $node[$k] = $this->getValue($prop,$r);
                }
            }
            $node['parent'] = 0+$r->$parent;
            $node['child'] = 0+ $r->$child;
            if (!($node['leaf'] = (boolean) !$r->$isFolder))
                $node['children'] = array();
            $nodes[$node['child']] = $node;
        }

        $children = array();
        foreach($nodes as $k => $node) {
            if ($node['parent']) {
                $nodes[$node['parent']]['children'][$k]=$nodes[$k];
            }
            else {
                $children[$k]=&$nodes[$k];
            }
        }
//var_dump($children);
//var_dump($nodes);
		$dehashed = $this->deHashChildren($children);
		SWPLogManager::log("getChildrenAtOnce method returns children",$dehashed,TLogger::INFO,$this,"getChildrenAtOnce","FreshSystem");
        return  $dehashed; //array_values($nodes);

    }

    function getValue($prop,$r) {
    	
    	SWPLogManager::log("getValue method expecting properties and record as params",array('Props'=>$prop,'record'=>$r),TLogger::INFO,$this,"getValue","FreshSystem");
    	
        if ($prop === false || $prop === true)
            $val = $prop;
        elseif (is_array($prop)) {
            foreach($prop as $k=>$p) {
                $val[$k] = $this->getValue($p,$r);
            }
        }
        elseif ($prop[0]=='@' || $prop[0]=='^') {
            $val = substr($prop,1);
            if ($val == "false")
                $val = false;
            elseif ($val == "true")
                $val = true;
        }
        else {
            $val = $r->getSubProperty($prop);
        }

        SWPLogManager::log("getValue method returns value",$val,TLogger::INFO,$this,"getValue","FreshSystem");
        return $val;
    }

    function deHashChildren($array) {
    	
    	SWPLogManager::log("deHashChildren method expecting array as param",$array,TLogger::INFO,$this,"deHashChildren","FreshSystem");
        $flat = array();

        foreach ($array as $value) {

            if (is_array($value['children'])) $value['children'] = $this->deHashChildren($value['children']);

            $flat[] = $value;
        }
        SWPLogManager::log("getChildren method returns flat",$flat,TLogger::INFO,$this,"deHashChildren","FreshSystem");
        return $flat;
    }

    protected function getChildren($id,$depth) {

    	SWPLogManager::log("getChildren method expecting id and depth values as params",array("ID :"=>$id,"Depth :"=>$depth),TLogger::INFO,$this,"getChildren","FreshSystem");
        $depth--;
        $c = $this->getCriteria($id);
        if (method_exists($this->finder,'findAllChildNodes'))
            $records = $this->finder->findAllChildNodes($c);
        elseif (method_exists($this->finder,'secureFindAll'))
            $records = $this->finder->secureFindAll($c);
        else
            $records = $this->finder->findAll($c);
//Prado::trace(TVarDumper::dump($records),'Json');

        $isFolder = $this->config['folderSign'];
        $nodeType = $this->config['nodeTypeSign'];
        //$leaf = $this->config['leaf'];
        //$folder = $this->config['folder'];
        $child = $this->config['child'];

        $children = array();
        foreach($records as $r) {
            // echo $r->NodeType;
            $node = array();
            // die(TVarDumper::dump($this->config));
            $properties = $this->config[$r->$nodeType];
            if (!$properties) continue;


            if (!$this->postSqlCondition($r)) continue;
            
            foreach($properties as $k => $prop)
                $node[$k] = $this->getValue($prop,$r);
                           

            if ($r->$isFolder && $depth>0 && $ch = $this->getChildren($r->$child,$depth)) {
                $node['children'] = $ch;
                $node['expanded'] = false;
            }
            $node['leaf']=!$r->$isFolder;
            $children[] = $node;

        }
        SWPLogManager::log("getChildren method returns the children",$children,TLogger::INFO,$this,"getChildren","FreshSystem");
        return $children;
    }



    protected function getCriteria($id) {
    	
    	SWPLogManager::log("getCriteria method expecting id as param",$id,TLogger::INFO,$this,"getCriteria","FreshSystem");
        $criteria = new TActiveRecordCriteria;

        $UserLevel = $this->User->Level;

        $parentField = $this->config['parent'];
        if ((!$id || $id == 'root') && !$this->config['readAll']) {
//            $criteria->Condition = "($parentField is NULL OR $parentField = 0) AND (ReadLevel is NULL OR ReadLevel <= $UserLevel)";
            if ($this->config['criteria'] && $this->config['criteria']['rootCondition'])
            {
                $criteria->Condition = '('.$this->config['criteria']['rootCondition'].')';
            }
            else
                $criteria->Condition = "($parentField is NULL OR $parentField = 0)";
        }
        elseif (!$this->config['readAll']) {
//            $criteria->Condition = "$parentField = :$parentField AND (ReadLevel is NULL OR ReadLevel <= $UserLevel)";
            $criteria->Condition = "($parentField = :$parentField)";
            if ($this->config['criteria'] && $this->config['criteria']['childCondition'])
            {
                $criteria->Condition .= ' AND ('.$this->config['criteria']['childCondition'].')';
            }

            $criteria->Parameters[":$parentField"] = $id;
        }
        else {
//            $criteria->Condition = "(ReadLevel is NULL OR ReadLevel <= $UserLevel)";
        }
//        echo $criteria->Condition.'<br>';

        if (false && $this->config['readAll']) {
            $criteria->OrdersBy[$parentField] = 'DESC';
        }
        if ($this->config['criteria']) {
            if ($this->config['criteria']['ordersBy'])
                foreach($this->config['criteria']['ordersBy'] as $sort => $dir)
                    $criteria->OrdersBy[$sort] = $dir;
        }
        SWPLogManager::log("getCriteria method returns Criteria",$criteria,TLogger::INFO,$this,"getCriteria","FreshSystem");
        return $criteria;

    }

    protected function postSqlCondition($rec)
    {
    	SWPLogManager::log("postSqlCondition method expecting the rec as param",$rec,TLogger::INFO,$this,"postSqlCondition","FreshSystem");
        if ($cond = $this->config['postSqlCondition']){
        	SWPLogManager::log("postSqlCondition method returns condition",$rec->$cond,TLogger::INFO,$this,"postSqlCondition","FreshSystem");
            return $rec->$cond;
        }

        SWPLogManager::log("postSqlCondition method returns true",true,TLogger::INFO,$this,"postSqlCondition","FreshSystem");
        return true;
    }
    
    protected function startRebuildTree() {
    	
    	SWPLogManager::log("startRebuildTree method executes the sql query",null,TLogger::INFO,$this,"startRebuildTree","FreshSystem");
        set_time_limit (0);
        $delSql = $this->config['nestedSet']['delete'];
        $conn = $this->finder->getDbConnection();
        $conn->setActive(true);
        $conn->createCommand($delSql)->execute();

        $this->rebuildTree(0,1);
    }
    
    protected function rebuildTree($parent_id,$left) {
        
		SWPLogManager::log("rebuildTree method expecting parentId and left values as params ",array('Parent Id'=>$parent_id,'Left'=>$left),TLogger::INFO,$this,"rebuildTree","FreshSystem");
        $parentField = $this->config['parent'];
        $readSql = $this->config['nestedSet']['read'];
        $writeSql = $this->config['nestedSet']['write'];
        // the right value of this node is the left value + 1
        $right = $left+1;   

        // get all children of this node
        $conn = $this->finder->getDbConnection();
        $conn->setActive(true);
        
        $cmd = $conn->createCommand($readSql);
        $cmd->bindValue(':parent_id',$parent_id);
        $dataReader = $cmd->query();

        while(($row=$dataReader->read())!==false) {
            // recursive execution of this function for each
            // child of this node
            // $right is the current right value, which is
            // incremented by the rebuild_tree function
            $right = $this->rebuildTree($row['uid'], $right);
        }   

        // we've got the left value, and now that we've processed
        // the children of this node we also know the right value
        $cmd = $conn->createCommand($writeSql);
        $cmd->bindValue(':parent_id',$parent_id);
        $cmd->bindValue(':lft',$left);
        $cmd->bindValue(':rgt',$right);
        $cmd->execute();

        // return the right value of this node + 1
        SWPLogManager::log("rebuildTree method returns right",$right+1,TLogger::INFO,$this,"rebuildTree","FreshSystem");
        return $right+1;
        
    }
    
    public function getRequireRebuild() {
    	SWPLogManager::log("getRequireRebuild method returns equired rebuild ",($this->config['nestedSet'] && $this->config['nestedSet']['rebuild']),TLogger::INFO,$this,"getRequireRebuild","FreshSystem");
        return ($this->config['nestedSet'] && $this->config['nestedSet']['rebuild']);
    }

    public function setRequireRebuild($value=true) {
    	SWPLogManager::log("setRequireRebuild method expecting value as param ",$value,TLogger::INFO,$this,"setRequireRebuild","FreshSystem");
        if ($this->config['nestedSet'])
            $this->config['nestedSet']['rebuild'] = $value;
    }
}
