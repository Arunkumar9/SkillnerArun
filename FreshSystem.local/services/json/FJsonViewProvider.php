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
 * @version	$Id: FJsonViewProvider.php 2348 2013-12-20 10:20:54Z arun $
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
    const DEFAULT_PAGING=25;
	protected $finder;

	public function getJsonContent()
	{
		SWPLogManager::log("This method is used to get json content related to views",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
		$user = $this->User;
		$request = Prado::getApplication()->Request;
		SWPLogManager::log("Request object",$request,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");
		//"test",$request,TLogger::ERROR,null
		if (!($view = $request['view'])){
			SWPLogManager::log("Bad request! ",null,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			throw new FJsonException('Bad request!');
		}
		//return array('success'=>false, 'message'=>'Bad request!');

		//Read View definition
		$data = $this->getYamlData($view);
		SWPLogManager::log("Providing View Related Data",array("view"=>$request['view'],"context"=>$request['context']),TLogger::ERROR,$this,"getJsonContent","FreshSystem");


		$this->setContext($data,$request['context']);
		$config = $data['serverSide'];

		if ($config['authLevel'] != null)
		$this->AuthLevel = $config['authLevel'];

		if (!$this->getIsAuthorized()){
			SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",null,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			throw new FJsonException('Not authorized!');
		}
		//                return array('success'=>false, 'message'=>'Not authorized!');


		//$context = $config['context'][$request['context']];
		//$this->context = $context;
		//$recordClass = ($context['recordClass'])?$context['recordClass']:$config['recordClass'];

		$dataRoot = ($this->context['dataRoot'])?$this->context['dataRoot']:'filter';

		//        if (preg_match('|^[0-9_A-Z,/\.]+$|',$request[$dataRoot]))
		if ($request[$dataRoot])
		{
			$filter = json_decode($request[$dataRoot],true);
			if (!$filter) {
				$filter = explode(',',$request[$dataRoot]);
			}
		}

		$this->finder = call_user_func(array($this->context['recordClass'], 'finder'));

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
			if ($this->finder instanceof TActiveRecord)
			$transaction->commit();
		}
		catch (Exception $e)
		{
			if ($this->finder instanceof TActiveRecord)
			$transaction->rollBack();
			$msg = $this->evalError($e->getMessage());
			//                 var_dump($config);
			$msg = ($msg)?$msg:'Internal error! '.$e->getMessage().'<br>'.$e->getTraceAsString();
			SWPLogManager::log("Internal error! ",$msg,TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			throw new FJsonException($msg);
		}

		if ($this->context['CacheFlush'] && ($cache = $this->getApplication()->getCache()))
		$d = $cache->flush();

		// If the call is coming becoz of dupliacting the record, then we are finding the pageNumber
		// for the duplicated record, which will be helpful to load that particular page related data.

		if($answer['result']['fromDuplicate'] === true && $answer['result']['contentId'] ){

			$content_id = $answer['result']['contentId'];
			$fromQuestion = $answer['result']['fromQuestion'];
			$config = $this->config;
			$pageSize = (int) $config['pageSize'];
			if($fromQuestion){
				$pageNumber = $this->getPageNumber ( $content_id, $pageSize, true, $fromQuestion );
			}else{
				$pageNumber = $this->getPageNumber ( $content_id, $pageSize, true, false );
			}
			$answer['pageNumber'] = $pageNumber;
		}

		SWPLogManager::log("Returns Component answer",array('component'=>$answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
		return array('component'=>$answer);
	}
	public function log( $msg="",$dataobject,$loglevel){

		$user = Prado::getApplication()->getUser();
		if(!empty( $user ) ){
			$msg = $user->Username." ==> ".$msg;
		}

		Prado::log($msg,$loglevel,'avalton');
	}
	
    public function emptyResultSql($filter)
    {
    	SWPLogManager::log("emptyResultSql method passing one parameter",$filter,TLogger::INFO,$this,"emptyResultSql","FreshSystem");
    	$cmd = $this->finder->getDbConnection()->createCommand($this->context['emptyResultSql']);
    	if (! is_array($filter))
    	$filter = array($filter);
    	foreach($filter as $f)
    	{
    		$cmd->bindParameter(':filter',$f,PDO::PARAM_INT);
    		$cmd->execute();
    	}
    }
    
    public function defaultAction($filter)
    {
    	//var_dump($filter);
    	//var_export($this->context);
    	//die();
    	SWPLogManager::log("defaultAction method passing one parameter",$filter,TLogger::INFO,$this,"defaultAction","FreshSystem");
    	$request = Prado::getApplication()->Request;
    	$config = $this->config;
    	$context = $this->context;
    	$pageSize = (int) $config['pageSize'];
    	if (!$this->context['noBlankContext']) {
    		$start = $request['start'];
    		if( $request['view'] && $request['view'] == 'my-lesson-view' ){
    			$limit = 0;
    		}else {
	    		$limit = ($request['limit']) ? $request['limit'] : $pageSize;
    		}
    		$groupby = ($request['groupby']) ? $request['groupby'] : $config['groupBy'];
    		$sort = ($request['sort']) ? $request['sort'] : $config['sortInfo']['field'];
    		$dir = ($request['dir']) ? $request['dir'] : $config['sortInfo']['dir'];



    		$finder = call_user_func(array($context['recordClass'], 'finder'));
    		$this->finder = $finder;

    		$criteria = $this->getContextCriteria($context, $filter);
    		// if ($this->context['useSecurity'])
    		//       $criteria = $finder->getCriteria($criteria);

    		$count = $finder->count($criteria);

    		if ($count === 0 && $this->context['emptyResultSql']) {
    			$this->emptyResultSql($filter);
    		}

    		if ($sort) {
    			if ($config['sortInfo']['substitute'] && $config['sortInfo']['substitute'][$sort])
    			foreach ($config['sortInfo']['substitute'][$sort] as $s)
    			$criteria->OrdersBy[$s] = $dir;
    			else
    			$criteria->OrdersBy[$sort] = $dir;
    		}

    		/*
    		 if ($groupby)
    		 {
    		 if (!trim($criteria->Condition))
    		 $criteria->Condition = '(1=1)';
    		 $criteria->Condition = '(1=1) GROUP BY '.$groupby;
    		 }

    		 */ if ($limit) {
    		$criteria->Limit = $limit;
    		$criteria->Offset = $start;
    		 }


    		 // var_dump($config);
    		 // echo('<br>'.$request['limit'].'-'.$criteria->__toString());
    		 $records = $finder->findAll($criteria);

    		 $totalCount = $count;
    		 $rows = $this->getRecordData($records);
    		 $answer = array(
                'success' => true,
                'totalCount' => $count,
                'rows' => $rows
    		 );
    	}
    	else {
    		SWPLogManager::log("Bad request (no context)!",null,TLogger::ERROR,$this,"defaultAction","FreshSystem");
    		throw new FJsonException('Bad request (no context)!');
    	}
    	if ($request['meta']=='true')
    	$answer['metaData'] = $this->metadata;
    	 
    	SWPLogManager::log("defaultAction method returns total count and rows",$answer,TLogger::INFO,$this,"defaultAction","FreshSystem");
    	return $answer;
    }
	/**
	 * This method is expecting the uid/contentid of the record, and based on the id and page size
	 * it is calculating the pageNumber for that particular record.
	 * When we are passing content id of the record then we should pass the 
	 * */
    
    public function getPageNumber ($uid, $pageSize, $passedContentId, $fromQuestion ){

    	SWPLogManager::log("getPageNumber getting three parameters",array('Uid'=>$uid, 'Page Size'=>$pageSize, 'From Avalton'=>$passedContentId),TLogger::INFO,$this,"getPageNumber","FreshSystem");
    	$recordClass = $this->context['recordClass'];
    	$finder = call_user_func(array($recordClass, 'finder'));
    	
    	if ( $passedContentId && $fromQuestion ){
    		$recs = $finder->findAll('uid =  ?', array($uid) );
    		$uid = $recs[0]->uid;
    	}else if( $passedContentId ){

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
     
	 public function yamlAction($filter)
	 {
	 	
	 }
	 
	 public function getRecordData($records)
	 {
	 	SWPLogManager::log("getRecordData method passing one parameter to get record data",$records,TLogger::INFO,$this,"getRecordData","FreshSystem");
	 	$rows = array();
	 	foreach($records as $record)
	 	{
	 		$row = array();
	 		$id = $this->metadata['id'];
	 		$row[$id] = $record->$id;
	 		foreach($this->metadata['fields']  as $field)
	 		{
					try {
						$row[$field['name']] = $record->{$field['name']};
					} catch (Exception $e) {
						$row[$field['name']] = TDataFieldAccessor::getDataFieldValue($record,$field['name']);
						SWPLogManager::log("Throws Exception",$row[$field['name']],TLogger::ERROR,$this,"getRecordData","FreshSystem");
					}
	 		}
	 		$rows[] = $row;
	 	}

	 	SWPLogManager::log("getRecordData method returns rows",$rows,TLogger::INFO,$this,"getRecordData","FreshSystem");
			return $rows;
	 }
    
    public function getContextCriteria($context,$filter)
    {
    	SWPLogManager::log("getContextCriteria method passing two parameters to get Contex criteria",array('Contex'=>$context,'Filter'=>$filter),TLogger::INFO,$this,"getContextCriteria","FreshSystem");
    	$criteria = new TActiveRecordCriteria;
    	//        if (!$context || !$filter)
    	///          return $criteria;
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

    	if ($context['condition'])
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
    	SWPLogManager::log("getContextCriteria method returns context criteria",$criteria,TLogger::INFO,$this,"getContextCriteria","FreshSystem");
    	return $criteria;
    }
    
    public function updateRecords($data)
    {
    	SWPLogManager::log("updateRecords method passing one parameter to update records",$data,TLogger::INFO,$this,"updateRecords","FreshSystem");
    	$recordClass = $this->context['recordClass'];
    	$idName = ($this->metadata['id'])?$this->metadata['id']:'Uid';
    	$finder = call_user_func(array($recordClass, 'finder'));

    	$updates = array(); $added = array();$dataResult=array();
    	foreach($data as $key => $value) {
    		if ($value[$idName]==='' || $value[$idName]===null)
    		$added[]=$value;
    		elseif (isset($value[$idName]))
    		$updates[$value[$idName]]=$value;
    		else
    		$updates[$key]=$value;
    	}
    	//var_dump($data);
    	//var_dump($added);
    	if (count($updates))
    	{
    		$ups = $finder->findAllByPks(array_keys($updates));
    		foreach($ups as $up)
    		{
    			foreach($updates[$up->$idName] as $p => $v)
    			$up->$p = $v;
    			$up->save();
    		}
    	}

    	foreach($added as $kitem => $item)
    	{
    		$rec = false;
    		if ($chex = $this->context['checkExistence']) {
    			$rec = $finder->{findBy.$chex}($item[$chex]);
    		}
    		if (!$rec) {
    			$rec = new $recordClass();
    		}

    		if ($mr = $this->context['mapRequest'])
    		foreach($mr as $par=>$p)
    		$item[$p]=($item[$p])?$item[$p]:$this->Request[$par];

    		foreach($item as $k=>$v)
    		$rec->$k = $v;

    		$rec->save();
    		$dr = array();
    		$dr[$idName] = $rec->$idName;
    		$dr['id'] = $kitem;
    		$dataResult[] = $dr;
    	}

    	/*  $result = array('success'=>true);
    	 if (count($dataResult)>0)
    	 $result['result'] = array($this->metadata['root']=>$dataResult);

    	 $result['message'] = ($this->context['successMsg'])?$this->context['successMsg']:"Saved ok.";

    	 return $result;   	   */
    	if ($this->context['debug']){
    		SWPLogManager::log("Success...!",array('success'=>true,message=>'ok','debug'=>array('data'=>$data,'added'=>$added,'updated'=>$updated)),TLogger::INFO,$this,"updateRecords","FreshSystem");
    		return array('success'=>true,message=>'ok','debug'=>array('data'=>$data,'added'=>$added,'updated'=>$updated));
    	}
    	elseif ($this->context['successMsg']){
    		SWPLogManager::log("Success...!",array('success'=>true,message=>$this->context['successMsg']),TLogger::INFO,$this,"updateRecords","FreshSystem");
    		return array('success'=>true,message=>$this->context['successMsg']);
    	}
    	else{
    		SWPLogManager::log("Saved ok.",array('success'=>true,message=>"Saved ok."),TLogger::INFO,$this,"updateRecords","FreshSystem");
    		return array('success'=>true,message=>"Saved ok.");
    	}
    }

	public function updateRecordsFB($data)
	{
		SWPLogManager::log("updateRecordsFB method passing one parameter to update records",$data,TLogger::INFO,$this,"updateRecordsFB","FreshSystem");
		$recordClass = $this->context['recordClass'];
		$idName = ($this->metadata['id'])?$this->metadata['id']:'Uid';
		$finder = call_user_func(array($recordClass, 'finder'));

		$updates = array(); $added = array();
		foreach($data as $key => $value) {
			if ($value[$idName]===''  || $value[$idName]===null)
			$added[$key]=$value;
			elseif (isset($value[$idName]))
			$updates[$value[$idName]]=$value;
			else
			$updates[$key]=$value;
		}

		$dataResult =array();
		if (count($updates))
		{
			$ups = $finder->findAllByPks(array_keys($updates));
			foreach($ups as $up)
			{
				//                foreach($updates[$up->$idName] as $p => $v)
				//                  $up->$p = $v;
				$diff = $up->fromArray($updates[$up->uid],$this->metadata['fields']);
				$up->save();
				//                $dr = $up->toArray($this->metadata['fields'])
				//              $dr[$idName] = $up->$idName;
				//            $dataResult[] = $dr;

			}
		}

		foreach($added as $kitem => $item)
		{
			$rec = false;
			if ($chex = $this->context['checkExistence']) {
			 $rec = $finder->{findBy.$chex}($item[$chex]);
			}
			if (!$rec) {
			 $rec = new $recordClass();
			}

			if ($mr = $this->context['mapRequest'])
			foreach($mr as $par=>$p)
			$item[$p]=($item[$p])?$item[$p]:$this->Request[$par];
			//            foreach($item as $k=>$v)
			//              $rec->$k = $v;
			$rec->fromArray($item,$this->metadata['fields']);
			$rec->save();

			$dr = $rec->toArray($this->metadata['fields']);
			$dr[$idName] = $rec->$idName;
			$dr['id'] = $kitem;
			$dataResult[] = $dr;

		}

		$result = array('success'=>true);
		if (count($dataResult)>0)
		$result['result'] = array($this->metadata['root']=>$dataResult);

		$result['message'] = ($this->context['successMsg'])?$this->context['successMsg']:"Saved ok.";

		SWPLogManager::log("Updated records success fully",$result,TLogger::INFO,$this,"updateRecordsFB","FreshSystem");
		return $result;
	}

    public function deleteRecords($data)
    {
    	SWPLogManager::log("deleteRecords method passing one parameter to delete records",$data,TLogger::INFO,$this,"deleteRecords","FreshSystem");
    	$recordClass = $this->context['recordClass'];
    	$idName = $this->metadata['id'];
    	$finder = FBaseActiveRecord::finder($recordClass);

    	if (count($data))
    	{
    		$finder->deleteAllByPks(array_keys($data));
    	}

    	if ($this->context['successMsg']){
    		SWPLogManager::log("Success...!",array('success'=>true,message=>$this->context['successMsg']),TLogger::INFO,$this,"deleteRecords","FreshSystem");
    		return array('success'=>true,message=>$this->context['successMsg']);
    	}
    	else{
    		$msg = Prado::localize("Deleted ok.");
    		SWPLogManager::log("Deleted ok",array('success'=>true,message=>$msg),TLogger::INFO,$this,"deleteRecords","FreshSystem");
    		return array('success'=>true,message=>$msg);
    	}
    }

    public function callMethod($data)
    {
    	SWPLogManager::log("callMethod passing one parameter to call method",$data,TLogger::INFO,$this,"callMethod","FreshSystem");
    	$recordClass = $this->context['recordClass'];
    	$method = $this->context['method'];
    	$idName = $this->metadata['id'];
    	$finder = FBaseActiveRecord::finder($recordClass);

    	if ($method)
    	$res = $finder->$method($data);
    	else{
    		SWPLogManager::log("No method to call!",null,TLogger::ERROR,$this,"callMethod","FreshSystem");
    		throw new FJsonException('No method to call!');
    	}

    	if ($this->context['successMsg']){
    		SWPLogManager::log("Success...!",array('success'=>true,message=>$this->context['successMsg'],'result'=>$res),TLogger::INFO,$this,"callMethod","FreshSystem");
    		return array('success'=>true,message=>$this->context['successMsg'],'result'=>$res);
    	}
    	else{
    		$msg = Prado::localize("Deleted ok.");
    		SWPLogManager::log("Deleted ok.",array('success'=>true,message=>$msg,'result'=>$res),TLogger::INFO,$this,"callMethod","FreshSystem");
    		return array('success'=>true,message=>$msg,'result'=>$res);
    	}
    }
    
	public function updateQuizSettings( $data )
	{
		SWPLogManager::log("updateQuizSettings refers the ProductQuizSettingsRecord, ProductQuizLessonAssociationRecord tables to update Quiz settings",$data,TLogger::INFO,$this,"updateQuizSettings","FreshSystem");
		 
		$ProductQuizSettingsRecord = FBaseActiveRecord::finder('ProductQuizSettingsRecord');
		$ProductQuizLessonAssociationRecord = FBaseActiveRecord::finder('ProductQuizLessonAssociationRecord');

		$productUid =  $data['productId'].'|'.$data['quizId'];
		$quizSettingsRecord = $ProductQuizSettingsRecord->find('coursecontent_id = ? ',$productUid );

		$quizSettingsRecord->requiredpass = $data['passingScoreRequire'] ? 1 : 0 ;
		$quizSettingsRecord->passing_score = $data['passingScore'] ? $data['passingScore'] : 0 ;
		$quizSettingsRecord->required_subsequent = $data['requiredSubsequent'] ? 1 : 0 ;
		$quizSettingsRecord->post_evaluation = $data['postEvaluation'] ? $data['postEvaluation'] : 4 ;
		$quizSettingsRecord->randomize_questions = $data['randomizeQuestions'] ? 1 : 0 ;
		$quizSettingsRecord->required_complete_course = $data['requiredCompleteCourse'] ? 1 : 0 ;
		$quizSettingsRecord->save();

		for ($i = 0; $i < count( $data['videoIds'] ); $i++) {

			$quizLessonsAssociationRecords = $ProductQuizLessonAssociationRecord->find( 'quiz_settings_id = ? AND lesson_id = ? ', $quizSettingsRecord->uid, $data['videoIds'][$i] );
			if( count( $quizLessonsAssociationRecords )){
				$quizLessonsAssociationRecords->required_complete = in_array($data['videoIds'][$i],$data['selectedVideoIds']) ? 1 : 0 ;
				 
				$quizLessonsAssociationRecords->markunviewed = in_array($data['videoIds'][$i],$data['lessonsUnviewed']) ? 1 : 0 ;
				 
				$quizLessonsAssociationRecords->save();
			}else {
				$quizLessonAssociation = new ProductQuizLessonAssociationRecord();
				$quizLessonAssociation->quiz_settings_id = $quizSettingsRecord->uid;
				$quizLessonAssociation->lesson_id = $data['videoIds'][$i] ;
				$quizLessonAssociation->required_complete = in_array($data['videoIds'][$i],$data['selectedVideoIds']) ? 1 : 0 ;
				$quizLessonAssociation->markunviewed = in_array($data['videoIds'][$i],$data['lessonsUnviewed']) ? 1 : 0 ;
				$quizLessonAssociation->save();

			}
		}
		
		//that means no lesson is selected this quiz as the locked content untill it is played completly.
		if(empty($data['videoIds'])){
			for ($i = 0; $i < count( $data['lessonsUnviewed'] ); $i++) {
				$quizLessonsAssociationRecords = $ProductQuizLessonAssociationRecord->find( 'quiz_settings_id = ? AND lesson_id = ? ', $quizSettingsRecord->uid, $data['lessonsUnviewed'][$i] );
				if( count( $quizLessonsAssociationRecords )){
					$quizLessonsAssociationRecords->required_complete = 0 ;
					$quizLessonsAssociationRecords->markunviewed = 1;
					$quizLessonsAssociationRecords->save();
				}else {
					$quizLessonAssociation = new ProductQuizLessonAssociationRecord();
					$quizLessonAssociation->quiz_settings_id = $quizSettingsRecord->uid;
					$quizLessonAssociation->lesson_id = $data['lessonsUnviewed'][$i] ;
					$quizLessonAssociation->required_complete =  0 ;
					$quizLessonAssociation->markunviewed = 1  ;
					$quizLessonAssociation->save();
	
				}
			}
			
			//we need to get all the lesson associated record of this settings .
			//if the record lesson id not matching in the lessonsUnviewed array then such records markunviewed will be zero
			$quizLessonsAssociationRecords = $ProductQuizLessonAssociationRecord->findAll( 'quiz_settings_id = ?', $quizSettingsRecord->uid );
			if(count($quizLessonsAssociationRecords) > 0){
				if(empty($data['lessonsUnviewed'])){
					for($k1=0 ; $k1 < count($quizLessonsAssociationRecords) ; $k1++){
						$quizLessonsAssociationRec = $quizLessonsAssociationRecords[$k1];
						$quizLessonsAssociationRec->markunviewed = 0;
						$quizLessonsAssociationRec->save();
					}
				}else{
					for($k=0 ; $k < count($quizLessonsAssociationRecords) ; $k++){
						$quizLessonsAssociationRec = $quizLessonsAssociationRecords[$k];
						$desiredLessID = $quizLessonsAssociationRec->lesson_id;
						$quizLessonsAssociationRec->markunviewed = in_array($desiredLessID,$data['lessonsUnviewed']) ? 1 : 0 ;
						$quizLessonsAssociationRec->save();
					}
				}
			}
		}
	}
		
}
