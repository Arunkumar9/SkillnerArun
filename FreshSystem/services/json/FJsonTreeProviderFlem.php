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
 * @version	$Id: FJsonTreeProviderFlem.php 2348 2013-12-20 10:20:54Z arun $
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
class FJsonTreeProvider extends FJsonComponentProvider
{
    const DEFAULT_PAGING=25;

	public function getJsonContent()
	{
		if (!$this->getIsAuthorized())
			return array('success'=>false, 'nessage'=>'Not authorized!');

		$user = $this->User;
		$request = Prado::getApplication()->Request;

        $id = (is_numeric($request['node']))?$request['node']:null;
        
		if (!($view = $request['view']))
			throw new FJsonException('Bad request!');

        //Read View definition
		$key = $view;
        $data = $this->getYamlData($key);
        $this->setContext($data,$request['context']);
//        $this->config = $data['serverSide'];

        $recordClass = $this->context['recordClass'];
        $depth = $request['depth'];
		$start = $request['start'];


        $this->finder = call_user_func(array($recordClass, 'finder'));
//var_dump($this->config);
//die();
        if ($action = $this->context['action']) 
        {
             $answer = $this->$action();
        }
        else
        {
            if ($this->config['readAll'] && !$id)
                $answer = $this->getChildrenAtOnce();
            else        
                $answer = $this->getChildren($id,$this->config['depth']);

        }
        return array('component'=>$answer);
	}


    public function updateNode()
    {
        $request = Prado::getApplication()->Request;
        
        $dataRoot = $this->context['dataRoot'];
        $data = json_decode($request[$dataRoot],true);
        $uid = $data['Uid'];
        
        if ($uid)
        {
            unset($data['Uid']);
            $this->finder->updateByPk($data,$uid);
            return array('message'=>$this->context['successMsg'],'success'=>true);
        }
        else
        {
            $class = $this->context['recordClass'];
            $n = new $class($data);
            $n->save();
            return array('message'=>$this->context['successMsg'],'success'=>true,'id'=>$n->Uid);
        }
    }

    public function removeNode()
    {
        $request = Prado::getApplication()->Request;
        
        $dataRoot = $this->context['dataRoot'];
        $data = json_decode($request[$dataRoot],true);
        $uid = $data['Uid'];
        
        if ($uid)
        {
            $count = $this->finder->DeleteByPk($uid);
            if ($count>0)
                return array('message'=>$this->context['successMsg'],'success'=>true);
            else
                throw new FJsonMessage('Cannot remove!');
        }
        else
        {
            throw new FJsonMessage('Wrong request!');
        }
    }

    protected function getChildrenAtOnce($records=null)
    {
        if ($records === null)
            $records = $this->finder->findAll($this->getCriteria());
        
         $isFolder = $this->config['folderSign'];
         $leaf = $this->config['leaf'];
         $folder = $this->config['folder'];
         $child = $this->config['child'];
         $parent = $this->config['parent'];
         
         $nodes = array();
         foreach($records as $r)   
         {
             $node = array();
             if ($r->$isFolder)
             {
                foreach($folder as $k => $prop)
                {
                    $node[$k] = $this->getValue($prop,$r);
                }
             }
             else
             {
                foreach($leaf as $k => $prop)
                {
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
        foreach($nodes as $k => $node)
        {
            if ($node['parent'])
            {
                $nodes[$node['parent']]['children'][$k]=$nodes[$k];
            }
            else {
                $children[$k]=&$nodes[$k];
            }
        }
//var_dump($children);
//var_dump($nodes);
        return $this->deHashChildren($children); //array_values($nodes);                 
        
    }

    function getValue($prop,$r)
    {
        if ($prop[0]=='@')
        {
            $val = substr($prop,1);
            if ($val == "false")
                $val = false;
            elseif ($val == "true")
                $val = true;
        }
        else
        {
            $val = $r->$prop;
        }
        
        return $val;
    }

    function deHashChildren($array) {
       $flat = array();
    
       foreach ($array as $value) {

             if (is_array($value['children'])) $value['children'] = $this->deHashChildren($value['children']);

             $flat[] = $value;
       }
       return $flat;
    }

    protected function getChildren($id,$depth)
    {

         $depth--;
         $c = $this->getCriteria($id);
   //     var_dump($c->getCondition());
         $records = $this->finder->secureFindAll($c);

         $isFolder = $this->config['folderSign'];
         $nodeType = $this->config['nodeTypeSign'];
         //$leaf = $this->config['leaf'];
         //$folder = $this->config['folder'];
         $child = $this->config['child'];

         $children = array();
         foreach($records as $r)   
         {
             $node = array();
             $properties = $this->config[$r->$nodeType];
             if (!$properties) continue;
             foreach($properties as $k => $prop)
             {
                    if (is_string($prop))
                        $node[$k] = ($prop[0]=='@')?substr($prop,1):$r->$prop;
                    else
                        $node[$k] = $prop;
             }
                    
             if ($r->$isFolder && $depth>0 && $ch = $this->getChildren($r->$child,$depth))
             {
                    $node['children'] = $ch;
                    $node['expanded'] = true;
             }
             $node['leaf']=!$r->$isFolder;
             $children[] = $node;
             
         }
         return $children;
    }

    protected function getCriteria($id)
    {
        $criteria = new TActiveRecordCriteria;
        
        $UserLevel = $this->User->Level;
        
        $parentField = $this->config['parent'];
        if (!$id && !$this->config['readAll'])
        {
//            $criteria->Condition = "($parentField is NULL OR $parentField = 0) AND (ReadLevel is NULL OR ReadLevel <= $UserLevel)";
            $criteria->Condition = "($parentField is NULL OR $parentField = 0)";
        }
        elseif (!$this->config['readAll'])
        {
//            $criteria->Condition = "$parentField = :$parentField AND (ReadLevel is NULL OR ReadLevel <= $UserLevel)";
            $criteria->Condition = "$parentField = :$parentField";
            $criteria->Parameters[":$parentField"] = $id;
        }
        else
        {
//            $criteria->Condition = "(ReadLevel is NULL OR ReadLevel <= $UserLevel)";
        }
//        echo $criteria->Condition.'<br>';

        if (false && $this->config['readAll'])
        {
           $criteria->OrdersBy[$parentField] = 'DESC';
        }
        if ($config['criteria'])        
        {
            if ($this->config['criteria']['ordersBy'])
                foreach($this->config['criteria']['ordersBy'] as $sort => $dir)
                    $criteria->OrdersBy[$sort] = $dir;
        }
               
        return $criteria;
        
    }

}