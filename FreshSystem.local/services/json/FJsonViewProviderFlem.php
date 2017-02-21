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
 * @version	$Id: FJsonViewProviderFlem.php 2348 2013-12-20 10:20:54Z arun $
 *
 */

/*
 * Provides json views - metadata & data
 *
 * request params:
 *
 * meta	    boolean
 * view	    string
 * start	num
 * limit	num
 * sort     string
 * dir      ASC|DESC
 * filter	string
 *
 *
 */
class FJsonViewProvider extends FJsonComponentProvider
{
    const DEFAULT_PAGING = 25;

    public function getJsonContent()
    {
        if (!$this->getIsAuthorized())
        return array ('success'=>false, 'nessage'=>'Not authorized!');

        $user = $this->User;
        $request = Prado::getApplication()->Request;

        if (!($view = $request['view']))
        return array ('success'=>false, 'nessage'=>'Bad request!');


        //Read View definition
        $data = $this->getYamlData($view);
        $this->setContext($data, $request['context']);
        $config = $data['serverSide'];

       //$context = $config['context'][$request['context']];
        //$this->context = $context;
        //$recordClass = ($context['recordClass'])?$context['recordClass']:$config['recordClass'];

        $recordClass = $this->context['recordClass'];
       $dataRoot = ($this->context['dataRoot'])?$this->context['dataRoot']:'filter';
//           die('here '.__LINE__.$recordClass);
        $this->finder = call_user_func( array ($recordClass, 'finder'));

        if (preg_match('/^([0-9_]+,*)+$/', $request[$dataRoot]))
            $filter = explode(',', $request[$dataRoot]);
        elseif ($request[$dataRoot])
            $filter = json_decode($request[$dataRoot], true);
        
        $connection = $this->finder->getDbConnection();
        $connection->setActive(true);
        $transaction=$connection->beginTransaction();
        try
        {
            if ($action = $this->context['action'])
            {
                $answer = $this->$action($filter);
            }
            else
            {
                $answer = $this->defaultAction($filter);
                //                else
                //    	            throw new FJsonException('No context defined!');
            }
            $transaction->commit();
        }
        catch(Exception $e)
        {
            $transaction->rollBack();
            $msg = $this->evalError($e->getMessage());
            //                 var_dump($config);
            $msg = ($msg)?$msg:'Internal error! '.$e->getMessage();
            throw new FJsonException($msg);
        }
        return array ('component'=>$answer);
    }

    public function emptyResultSql($filter)
    {
        $cmd = $this->finder->getDbConnection()->createCommand($this->context['emptyResultSql']);
        foreach ($filter as $f)
        {
            $cmd->bindParameter(':filter', $f, PDO::PARAM_INT);
            $cmd->execute();
        }
    }
    
    public function updateRecordsWithSql($data)
    {
        $finder = $this->finder;//call_user_func( array ($context['recordClass'], 'finder'));
        $request = Prado::getApplication()->Request;
        $config = $this->config;
        $context = $this->context;
        $filter = $request['filter'];

        $criteria = FU::getContextCriteria($context, $filter);
        foreach ($context['preUpdateSql'] as $sqlPart)
        {
            $sql = $sqlPart.' '.$criteria->Condition;
            $cmd = $finder->getDbConnection()->createCommand($sql);
            $cmd->bindValue($criteria->Parameters);
            $cmd->execute();        
        }

        $answer = $this->updateRecords($data);
        if (!$answer['success'])
            return $answer;
            
        foreach ($context['postUpdateSql'] as $sqlPart)
        {
            $sql = $sqlPart.' '.$criteria->Condition;
            $cmd = $finder->getDbConnection()->createCommand($sql);
            $cmd->bindValue($criteria->Parameters);
            $cmd->execute();        
        }
        
        if ($finder instanceof IArchivableRecord)
        {
            $records = $finder->findAll($criteria);
            foreach ($records as $record)
                $record->doArchive();
        }
        
        return array ('success'=>true, message=>$context['successMsg']);
    }

    public function defaultAction($filter)
    {
        //var_dump($filter);
        //var_export($this->context);
        //die();
        $request = Prado::getApplication()->Request;
        $config = $this->config;
        $context = $this->context;
        if (!$this->context['noBlankContext'])
        {
            $start = $request['start'];
            $limit = ($request['limit'])?$request['limit']:$config['pageSize'];
            $sort = ($request['sort'])?$request['sort']:$config['sortInfo']['field'];
            $dir = ($request['dir'])?$request['dir']:$config['sortInfo']['dir'];


            $finder = $this->finder; //call_user_func( array ($context['recordClass'], 'finder'));

            $criteria = FU::getContextCriteria($context, $filter);
            $count = $finder->count($criteria);

            if ($count === 0 && $this->context['emptyResultSql'])
            {
                $this->emptyResultSql($filter);
            }
            Prado::Trace(TVarDumper::dump($filter), 'View');
            if ($sort)
            {
                $criteria->OrdersBy->clear();
                $dir = ($dir)?$dir:'ASC';
                if ($config['sortInfo']['substitute'] && $config['sortInfo']['substitute'][$sort])
                    foreach ($config['sortInfo']['substitute'][$sort] as $s=>$d)
                    {
                        if (is_numeric($s))
                        {
                            $s = $d;
                            $d = 1;
                        }
                        if ($dir == 'ASC')
                            $rdir = ($d)?'ASC':'DESC';
                        else
                        $rdir = ($d)?'DESC':'ASC';
                    $criteria->OrdersBy[$s] = $rdir;
            }
            else
            $criteria->OrdersBy[$sort] = $dir;
    }
    if ($limit)
    {
        $criteria->Limit = $limit;
        $criteria->Offset = $start;
    }
    
    $records = $finder->findAll($criteria);
    
    $totalCount = $count;
    $rows = array ();
    foreach ($records as $record)
    {
        $row = array ();
    $id = $this->metadata['id'];
    $row[$id] = $record->$id;
    foreach ($this->metadata['fields'] as $field)
    {
        $row[$field['name']] = $record->{
            $field['name']
        }
    ;
    }
    $rows[] = $row;
    }
    
    
    $answer = array (
    'success'=>true,
    'totalCount'=>$totalCount,
    'rows'=>$rows
    );
    }
    if ($request['meta'] == 'true')
        $answer['metaData'] = $this->metadata;
    
    return $answer;
}



public function getContextCriteria($context, $filter)
{
    $criteria = new TActiveRecordCriteria;
//        if (!$context || !$filter)
///          return $criteria;

$conditions = array ();
$parameters = array ();
if ($context['filterData'])
{
    foreach ($filter as $k=>$v)
    if ($v)
    {
        $w = str_replace('*', '%', $v);
    $condition[] = "($k like '$w')";
}

if (count($condition) > 0)
$conditions[] = '('.implode(' AND ', $condition).')';
}

if ($context['condition'])
{
    foreach ($filter as $f)
    $conditions[] = '('.str_replace('%filter%', $f, $context['condition']).')';

if (!$filter && !stristr($context['condition'], '%filter%'))
$conditions[] = $context['condition'];
}

if ($context['filterRecordClass'] && $filter)
{
    $ff = call_user_func( array ($context['filterRecordClass'], 'finder'))->findAllByPks($filter);
$i = 1;

foreach ($ff as $r)
{
    list ($cond, $params) = $r->getFilterCondition($i);
if ($cond)
{
    $conditions[] = $cond;
$parameters = array_merge($parameters, $params);
}
$i++;
}
}

if (count($conditions) > 0)
{
    $conditions = ' ( '.implode(' OR ', $conditions).' ) ';
$criteria->Condition = $conditions;
}
if (count($parameters) > 0)
{
    $criteria->Parameters = $parameters;
}

//        var_dump($criteria);
return $criteria;
}

public function updateRecords($data)
{
    $recordClass = $this->context['recordClass'];
    $idName = ($this->metadata['id'])?$this->metadata['id']:'Uid';
    $finder = $this->finder; //call_user_func( array ($recordClass, 'finder'));
    
    $updates = array ();
    $added = array ();
    foreach ($data as $key=>$value)
    {
        if ($value[$idName] === '')
            $added[] = $value;
        elseif ( isset ($value[$idName]))
            $updates[$value[$idName]] = $value;
        else
            $updates[$key] = $value;
    }
    
    if (count($updates))
    {
        $ups = $finder->findAllByPks(array_keys($updates));
        foreach ($ups as $up)
        {
            foreach ($updates[$up->$idName] as $p=>$v)
                $up->secureUpdate($p,$v);
            $up->save();
        }
    }
    
    foreach ($added as $item)
    {
        $rec = new $recordClass();
        foreach ($item as $k=>$v)
            $rec->secureUpdate($k,$v,true);
    
        $rec->save();
    }
    
    if ($this->context['successMsg'])
        return array ('success'=>true, message=>$this->context['successMsg']);
    else
        return array ('success'=>true, message=>"Saved ok.");
}

public function deleteRecords($data)
{
    $recordClass = $this->context['recordClass'];
$idName = $this->metadata['id'];
$finder = call_user_func( array ($recordClass, 'finder'));

if (count($data))
{
    $finder->deleteAllByPks(array_keys($data));
}

if ($this->context['successMsg'])
    return array ('success'=>true, message=>$this->context['successMsg']);
else
return array ('success'=>true, message=>"Saved ok.");
}

}
