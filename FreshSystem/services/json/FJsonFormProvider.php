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
 * @version	$Id: FJsonFormProvider.php 2348 2013-12-20 10:20:54Z arun $
 *
 */

/*
 * Provides json views - metadata & data
 * 
 * request params:
 * 
 * view	    string
 * id	    string|num
 * action   load | store

 * 
 * 
*/
class FJsonFormProvider extends FJsonComponentProvider {
    const DEFAULT_PAGING=25;
    protected $_record;

    public function getJsonContent() {
    	SWPLogManager::log("This method is used to get json content related to forms based on request id and meta",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
        if (!$this->getIsAuthorized()){
        	SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array("Not Auth User :"=>'Not authorized!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
            throw new FJsonException('Not authorized!');
        }

        $user = $this->User;
        $request = Prado::getApplication()->Request;
        SWPLogManager::log("Request object",$request,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");
        $id = $request['id'];
        $meta = $request['meta'];
        if (!($view = $request['view']) || !($action = $request['action'])) {
        	SWPLogManager::log("Bad request (1)!",null,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
            throw new FJsonException('Bad request (1)!');
        }

        //Read View definition

        $data = $this->getYamlData($view);
//        $this->config = $data['serverSide'];
        $this->setContext($data,$request['context']);

//        $this->context = (!$request['context'])?$this->config:$this->config[$request['context']];

        $recordClass = $this->context['recordClass'];
        $this->finder = TActiveRecord::finder($recordClass);
        if ($this->finder instanceof TActiveRecord)
	{
	        $connection = $this->finder->getDbConnection();
	        $connection->setActive(true);
			if ($this->context['setNames'])
			{
				$cmd = $connection->createCommand('SET NAMES '.$this->context['setNames']);
				$cmd->execute();
			}
	        $transaction=$connection->beginTransaction();
	}
        try
            {
            $dataRoot = $this->config['dataRoot'];

            if ($action == 'load') {
                $answer = array('success'=>true,$dataRoot=>$this->getRecordData($id));
                if ($meta && $this->context['metaData'])
                    $answer['metaData'] = $this->context['metaData'];
                if ($this->context['secured'])
                    $answer['security'] = $this->getRecordSecurity($id);
            }
            elseif ($action == 'store') {
                $data = $request[$dataRoot];
                $answer = $this->setRecordData($id,$data);
                if (!($this->context['NoCacheFlush']) &&  ($cache = $this->getApplication()->getCache()))
                        $d = $cache->flush();
            }
            elseif ($action == 'validateField') {
                $field = $request['field'];
                $value = $request['value'];
                $answer = $this->validateField($id,$field,$value);
            }
            elseif ($action == 'upload') {
                $answer = $this->uploadFiles($id);
            }
            elseif ($action == 'upload5') {
                $answer = $this->uploadFile5($id);
            }else if ( $action = 'findpagenumber' ){
            	
            	$pageNumber = $this->getPageNumber($request['uid'], 50, true );
            	$answer = array('success'=>true, 'pageNumber' => $pageNumber );
            }
            else{
            	SWPLogManager::log("Bad request !",null,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
                throw new FJsonException('Bad request!');
            }
            $transaction->commit();

        }
        catch (Exception $e)
        {
                         if ($this->finder instanceof TActiveRecord)
                                 $transaction->rollBack();
                         $msg = $this->evalError($e->getMessage());
//                 var_dump($config);
             $msg = ($msg)?$msg:'Internal error! '.$e->getMessage();
             SWPLogManager::log('Internal error!',$msg,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
             throw new FJsonException($msg);
        }
        SWPLogManager::log("Returns Component answer",array('component'=>$answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
        return array('component'=>$answer);
    }

    protected function getProperties() {
    	
    	SWPLogManager::log("getProperties gets the properties",null,TLogger::INFO,$this,"getProperties","FreshSystem");
        $properties = $this->config['properties'];
        $addProperties = $this->config['add-properties'];
        $remProperties = $this->config['remove-properties'];
        if (!is_array($properties)) {
            $properties = (method_exists($this->getRecord(),'getProperties')) ? $this->getRecord()->getProperties() : $this->finder->RecordGateway->getRecordTableInfo($this->finder)->ColumnNames;
        }

        foreach($properties as $k=>$p)
            $properties[$k] = trim($p,'`');

        if (is_array($remProperties))
            $properties = array_diff($properties,$remProperties);

        if (is_array($addProperties))
            $properties = array_merge($properties,$addProperties);
		$res = array_unique($properties);
        SWPLogManager::log("Returns unique properties",$res,TLogger::INFO,$this,"getProperties","FreshSystem");
        return $res;
    }

    protected function getRecord($id) {
    	
    	SWPLogManager::log("getRecord gets the record data based on this parameter",$id,TLogger::INFO,$this,"getRecord","FreshSystem");
        if ($this->_record === null) {
            if ($id === null|| $this->context['sendBlank'] || $id=='new') {
                $class = $this->context['recordClass'];
                $rc = new $class;
                if ($this->context['columns'])
                    foreach($this->context['columns'] as $k=>$v) {
                        if ($v['default'])
                            $rc->$k = FU::evalExpression($v['default'],$this);

                    }
                if ($this->context['newRecordReal'])
                {
                    $rc->save();
                    $this->_record = $rc;
                }
                return $rc;
            }
            if ($findBy = $this->config['findBy']) {
                $findBy = 'findBy'.$findBy;
                $record = $this->finder->$findBy($id);
            }
            else {
                $record = $this->finder->findByPk($id);
            }

            if ($this->context['columns'])
                foreach($this->context['columns'] as $k=>$v) {
                    if ($v['type'])
                        $record->$k = FU::typeCast($record->$k,$v['type']);
                }
            $this->_record = $record;
        }
        if ($this->_record){
        	SWPLogManager::log("Returns record",$this->_record,TLogger::INFO,$this,"getRecord","FreshSystem");
            return $this->_record;
        }
        else{
        	SWPLogManager::log("Wrong record requested!",$id,TLogger::ERROR,$this,"getRecord","FreshSystem");
            throw new FJsonException('Wrong record requested! ('.$id.') ');
        }
    }

    protected function getRecordData($id) {

    	SWPLogManager::log("getRecordData gets the record data based on this parameter",$id,TLogger::INFO,$this,"getRecordData","FreshSystem");
        $values = array();
        $record = $this->getRecord($id);
        SWPLogManager::log("Record object",$record,TLogger::DEBUG,$this,"getRecordData","FreshSystem");
        if (method_exists($record,'toArray')) {
        	$res = $record->toArray($this->getProperties());
        	SWPLogManager::log("Returns record properties",$res,TLogger::INFO,$this,"getRecordData","FreshSystem");
            return $res;
        }
        else {
            foreach($this->getProperties() as $p) {
                $values[$p] = $record->$p;
            }

            SWPLogManager::log("Returns the values",$values,TLogger::INFO,$this,"getRecordData","FreshSystem");
            return $values;
        }
    }

    protected function getRecordSecurity($id)
    {
        //$pro = $this->getProperties();
        SWPLogManager::log("getRecordSecurity getting parameter",$id,TLogger::INFO,$this,"getRecordSecurity","FreshSystem");
        $rec = $this->getRecord($id);
        SWPLogManager::log("Record object",$rec,TLogger::DEBUG,$this,"getRecordSecurity","FreshSystem");
        $class = get_class($rec);
        $res = $rec->getSecurityView();

        $answer = array();
        foreach ($res as $r)
        {
            list($cls,$name,$action) = explode('.',$r->name);
            $action = ($action) ? $action : 'disable';
            $a = array(
                'id' => $name,
                $action => true
                ); //str_ireplace($class.'.', '', $r->name),

            $answer[] = $a;
        }
        SWPLogManager::log("getRecordSecurity returns the answer",$answer,TLogger::INFO,$this,"getRecordSecurity","FreshSystem");
        return $answer;
    }

    public function setRecord($value) {
    	SWPLogManager::log("setRecord sets the record",$value,TLogger::INFO,$this,"setRecord","FreshSystem");
        $this->_record = $value;
    }
    protected function setRecordData($id,$data) {
    	
    	SWPLogManager::log("setRecordData getting two parameters",array('Id'=>$id, 'Data'=>$data),TLogger::INFO,$this,"setRecordData","FreshSystem");
        $diffData = array();
        $request = Prado::getApplication()->Request;
        SWPLogManager::log("Record object",$request,TLogger::DEBUG,$this,"setRecordData","FreshSystem");
        $dataRoot = $this->context['dataRoot'];
        if ($this->context['inDataFormat'] == 'wizard') {
            $data = json_decode($request[$dataRoot],true);
            $request = array();
            foreach($data as $card )
                $request = array_merge($request,$card);
        }
        elseif ($this->context['inDataFormat'] == 'json') {
            $data = json_decode($request[$dataRoot]);
            $request = $data;
        }
        //  Prado::trace('request '.TVarDumper::dump($request),'Json');
        $properties = $this->getProperties();
        $record = $this->getRecord($id);
        $this->setRecord($record);
        /*         if ($toArrayExists = method_exists($record,'fromArray'))
              $origData = array_intersect_key($request->toArray(),array_flip($properties));
        */
        if (method_exists($record,'fromArray')) {
            //$origData = $record->toArray();
            $diffData = $record->fromArray($request,$properties);
        }
        else {
            foreach($properties as $p) {
                if (isset($request[$p])) {
                    $record->$p = $request[$p];
                    if (!$record->secureUpdate($p,$request[$p]) || $record->$p != $request[$p])
                        $diffData[$p]=$record->$p;
                    //                  echo $p.' => ';
                }

            }
        }
        $record->save();
		$pageCount = $this->getPageNumber( $record->uid, 50 );
        if ($this->config['returnAllDiff']) {
            foreach($properties as $p) {
                if (isset($request[$p]) && !isset($diffData[$p]) && $record->$p != $request[$p]) {
                        $diffData[$p]=$record->$p;
                }

            }
		  
	   }
        
	   /*         $diffData = array();
          if ($toArrayExists)
          {
               var_dump($origData);
              $diffData = array_udiff_assoc($record->toArray($properties),$origData,create_function('$a,$b','return !($a==$b);'));
          }
        */
        $idField = $this->config['findBy'];
        $answer = array('success'=>true,'message'=>$this->context['successMsg'],$idField => $record->$idField, 'pageNumber' => $pageCount );
	   if (count($diffData)>0)
            $answer['result'] =  $diffData;
		
        SWPLogManager::log("setRecordData returns answer",$answer,TLogger::INFO,$this,"setRecordData","FreshSystem");
        return $answer;
    }
    	
    public function getPageNumber ($uid, $pageSize, $fromAvalton ){
    
    	SWPLogManager::log("getPageNumber getting three parameters",array('Uid'=>$uid, 'Page Size'=>$pageSize, 'From Avalton'=>$fromAvalton),TLogger::INFO,$this,"getPageNumber","FreshSystem");
		$recordClass = $this->context['recordClass'];
    	$finder = call_user_func(array($recordClass, 'finder'));
    	if ( $fromAvalton ){
    		
	    	$recs = $finder->findAll('content_id =  ?', array($uid) );
	    	$uid = $recs[0]->uid;
    	}
    	$criteria = $this->getContextCriteria($this->context, $filter);
    	$sort = $this->config['sortInfo']['field'];
    	if ($sort) {
                if ($config['sortInfo']['substitute'] && $config['sortInfo']['substitute'][$sort])
                    foreach ($config['sortInfo']['substitute'][$sort] as $s)
                        $criteria->OrdersBy[$s] = $dir;
                else
                    $criteria->OrdersBy[$sort] = $dir;
            }
    	$records = $finder->findAll($criteria);
    	$count = 1;
    	foreach ($records as $rec ){
    		if($rec->uid == $uid ){
    			break;
    		}
    		$count++;
    	}
    	$pageCount = ceil( $count/$pageSize );
    	SWPLogManager::log("Returns page count",$pageCount,TLogger::INFO,$this,"getPageNumber","FreshSystem");
    	return $pageCount;
    }
    
 	public function getContextCriteria($context,$filter)
    {
    	SWPLogManager::log("getContextCriteria getting two parameters",array('Context'=>$context,'Filter'=>$filter),TLogger::INFO,$this,"getContextCriteria","FreshSystem");
        $criteria = new TActiveRecordCriteria;
        if (!is_array($filter ))
			$filter = array($filter);
            
        $conditions = array(); $parameters = array();
		if ($context['filterData'])
		{
            foreach($filter as $k => $v)
                 if ($v) 
                 {
				    $w = str_replace('*','%',$v);
                 	$condition[] = "($k like '$w')";
                 }
                 
                 if ($context['filterData'] == 'OR' || $context['filterData'] == 'AND' )
                     $fdOp = ' '.$context['filterData'].' ';
                 else
                     $fdOp = ' AND ';

            if (count($condition)>0)
                    $conditions[] = '('.implode($fdOp,$condition).')';
		}
        if ($this->config['condition'])
        {
		  //additional params replacement
		  if ($context['substitueParams']) {
		     $sreq = Prado::getApplication()->getRequest();
			$sparams = (is_array($context['substitueParams'])) ? $context['substitueParams'] : implode(',',$context['substitueParams']);
			foreach ($sparams as $sp) {
			    $context['condition'] = '('.str_replace('%'.$sp.'%',$sreq[$sp],$context['condition']).')';
			}
		  }
		  		  //standard %filter% replacement
		  foreach($filter as $f) {
                $f = (isset($context['replaceRoot'])) ? str_replace('root',$context['replaceRoot'],$f) : $f;
               // echo $f;
                $conditions[] = '('.str_replace('%filter%',$f,$context['condition']).')';
            }
            if (!$filter && !stristr($context['condition'],'%filter%'))         
               $conditions[] = $context['condition'];
        }
	    
	   

        if ($context['filterRecordClass'] && $filter)
        {
            $ff = call_user_func(array($context['filterRecordClass'], 'finder'))->findAllByPks($filter);
            $i=1;
            
            foreach($ff as $r)
            {
                list($cond,$params) = $r->getFilterCondition($i);
                if ($cond)
                {
                    $conditions[] = $cond;
                    $parameters = array_merge($parameters,$params);
                }
                $i++;
            }
        }

        if (count($conditions)>0)
        {
             if ($context['conditionsOp'] == 'OR' || $context['conditionsOp'] == 'AND' )
                 $cOp = ' '.$context['conditionsOp'].' ';
             else
                 $cOp = ' OR ';
            $conditions = ' ( '.implode($cOp,$conditions).' ) ';
            $criteria->Condition = $conditions;
        }    
        if (count($parameters)>0)
        {
            $criteria->Parameters = $parameters;
        }
        SWPLogManager::log("getContextCriteria returns context Criteria",$criteria,TLogger::INFO,$this,"getContextCriteria","FreshSystem");
        return $criteria;
    }
    
    public function uploadFiles($id) {

    	SWPLogManager::log("uploadFiles used to upload file by Id parameter",$id,TLogger::INFO,$this,"uploadFiles","FreshSystem");
        $record = $this->getRecord($id);
        $dir = $record->getFileDir();
        $fileRecordClass = $record->getFileRecordClass();
        $request = Prado::getApplication()->getRequest();
        foreach($request->UploadedFiles as $k => $file) {
            if ($file['name']) {
                if (!move_uploaded_file($file['tmp_name'],$dir.'/'.$file['name']))
                    $errors[$k]='cannot upload';
                //else
                $f = new $fileRecordClass;
                $f->Name = $file['name'];
                $record->files[] = $f; //new $fileRecordClass(array('Name'=>$file['name']));
                Prado::Trace('copied upl '.$dir.'/'.$file['name']);
                //Prado::Trace('saving file '.TVarDumper::dump($record->files),'Json');
            }
        }
        $record->save();

        $response = Prado::getApplication()->getResponse();
        $response->ContentType = 'text/html';
        if (count($errors)==0){
        	SWPLogManager::log("Upload ok",array('success'=>true, 'message'=>'upload ok'),TLogger::INFO,$this,"uploadFiles","FreshSystem");
            return array('success'=>true, 'message'=>'upload ok');
        }
        else{
        	SWPLogManager::log("Upload error",array('success'=>false, 'errors'=>$errors),TLogger::ERROR,$this,"uploadFiles","FreshSystem");
            return array('success'=>false, 'errors'=>$errors);
        }
    }

    public function uploadFile5($id)
    {
    SWPLogManager::log("uploadFile5 used to upload file by Id parameter",$id,TLogger::INFO,$this,"uploadFile5","FreshSystem");
	$record = $this->getRecord($id);
	
	$record->CustNo = $id;
	$baseDir = $record->getFileDir().'/';
	$request = Prado::getApplication()->getRequest();
	$field = $this->context['fileField'];
	$field = ($field) ? $field : $record->getFileFieldName();
	$errors = array();
	$origName = $id.'_'.$_SERVER['HTTP_X_FILE_NAME'];
	
	$base = md5($origName);
	$dir = substr($base,0,2).'/'.substr($base,2,2).'/';
	$file = file_get_contents("php://input");
	$att = new AttachRecord;
	if ($base) {
		$att->data = $file;
		$att->name = $_SERVER['HTTP_X_FILE_NAME'];
		$att->type = $_SERVER['HTTP_X_FILE_TYPE'];
		$att->size = $_SERVER['HTTP_X_FILE_SIZE'];
		$att->created = time();
		$att->domain = get_class($record).'::'.$field;
		$att->record_id = $id;
		$att->save();
		
		Prado::Trace('upload: '.$dir.$name);
		$record->$field = $att->uid;
		$custno = $record->CustNo;
		$record->save();
		$custno1 = $record->CustNo;
	    
	}

	$response = Prado::getApplication()->getResponse();
	$response->ContentType = 'text/html';
	if (count($errors)==0){
		SWPLogManager::log("upload will be ok when there is no errors",array('success'=>true, 'message'=>'upload ok','debug'=>array($record->$field,$field,$custno,$custno1)),TLogger::INFO,$this,"uploadFile5","FreshSystem");
		return array('success'=>true, 'message'=>'upload ok','debug'=>array($record->$field,$field,$custno,$custno1));
	}
	else{
		SWPLogManager::log("Upload error",array('success'=>false, 'errors'=>$errors),TLogger::ERROR,$this,"uploadFile5","FreshSystem");
		return array('success'=>false, 'errors'=>$errors);
	}
    }

    public function validateField($id,$field,$value) {

    	SWPLogManager::log("validateField getting three parameters",array('Id'=>$id,'Field'=>$field,'Value'=>$value),TLogger::INFO,$this,"validateField","FreshSystem");
        $method = $this->context['validationMethod'];
        $record = $this->getRecord($id);
        try {
            $result = $record->$method($field,$value);
            $reason = $this->context['messages'][$result];
            SWPLogManager::log("Success",array('success'=>true,'valid'=>$result, 'reason'=>$reason),TLogger::INFO,$this,"validateField","FreshSystem");
            return array('success'=>true,'valid'=>($result==0), 'reason'=>$reason);
        }
        catch (Exception $e) {
			SWPLogManager::log("Unable to validate field",array('success'=>false, 'errors'=>$e->getMessage()),TLogger::ERROR,$this,"validateField","FreshSystem");
            return array('success'=>false, 'errors'=>$e->getMessage());
        }
    }


}
