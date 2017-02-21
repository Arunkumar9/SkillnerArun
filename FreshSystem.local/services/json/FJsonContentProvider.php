<?php
/* FJsonStoreContainer.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 17.10.2006
 */

class FJsonContentProvider extends FJsonComponentProvider
{
	const MAX_ORDERING = 65534;
	const EXT_WIDGET = 'ExtWidget';
	
	protected $request;
	protected $record;
	protected $_resultData = array();
	protected $_metaData = array();
	
	
	public function getJsonContent()
	{
	
		SWPLogManager::log("This method used to get json content",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
		if (!$this->getIsAuthorized()){
		    SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array("Auth  Result "=>'Not authorized!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
	        throw new FJsonException('Not authorized!');
		}

		$this->request = Prado::getApplication()->Request;
		$request = $this->request;
		SWPLogManager::log("request object",$request,TLogger::DEBUG,$this,"getJsonContent","FreshSystem"); 

		$action = $request['action'];
		$view = $request['view'];

		if (!$action || !$view){
			SWPLogManager::log("Bad request",array("Action" => $action, "View" => $view," So We Are getting "=>'Bad request (1)!'),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			throw new FJsonException('Bad request (1)!');
		}

        $data = $this->getYamlData($view);
        $this->setContext($data,$request['context']);

		$recordClass = $this->context['recordClass'];
		$field = $this->context['editField'];


		$finder = call_user_func(array($recordClass, 'finder'));
		//$rec = new $recordClass;
		$recordFields = $finder->RecordGateway->getRecordTableInfo($finder)->LowerCaseColumnNames;		

		$uid = $request['id'];
		$parentId = $request['parent'];
		$parentId = ($parentId)?$parentId:$uid;
		
		if (preg_match('/^(content|container)-([0-9]+)$/im',$parentId,$m)) {
			$parentId = $m[2];
		}

		$container = ContainerRecord::finder()->with_children('type_id like "language%"')->findByPk($parentId);
		
		$translation =  $container->TypeData['translation'];
		$lang = ucfirst($container->TypeData['lang']);
		$lang = ($lang) ? $lang : ucfirst($this->getApplication()->Parameters['defaultLanguage']);
                $lang = ($lang) ? $lang : 'Cs';

		if (!$translation && !isset($container->children[0]))
			$lang = null; 
		
		$data = $request['data'];
		if ($uid == 'null')
			$uid = null;

		if ($action == 'store' && $parentId)
		{		
			$request = Prado::getApplication()->Request;
			SWPLogManager::log("Request object",$request,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");
			if ($translation)
				$records = $finder->findAll('parent_id = ?',$container->parent_id);
			else
				$records = $finder->findAll('parent_id = ?',$parentId);

			foreach($records as $record)
			{
			 	$this->record = $record;
				if (!$record->getIsWriteAllowed()) continue;
                                $gw = new FWidgetGateway($record,null,$lang);
				$rc = $gw->getFieldNameVar();
				//Prado::trace(TVarDumper::dump($this->Request['content']),'Json');
				if ($request->contains($rc))
				{
					$content = $request[$rc][$record->uid];
                                        Prado::trace(TVarDumper::dump($record->TypeData),'Json');
                                        if ($content || !$record->TypeData['doNotAllowEmpty'] || $content === '')
                                        {
                                            $record->changed = time();
                                            $gw->setData($content);
                                            $record->save();
                                        }
				}
			}
                        if ($cache = $this->getApplication()->getCache())
                                $d = $cache->flush();
			$answer = array('success'=>true,'message'=>'Content saved OK.','debug'=>$d); //'debug'=>TVarDumper::dump($texts)
			SWPLogManager::log("Returns component answer",array('component'=>$answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
			return array('component'=>$answer); 
		}
		elseif ($action == 'load' && $parentId)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['ordering']='ASC';
			$criteria->Condition = 'parent_id = :pid';
			$criteria->Parameters[':pid']= ($translation) ? $container->parent_id : $parentId;
			$records = $finder->findAll($criteria);
			SWPLogManager::log("Records object",$records,TLogger::DEBUG,$this,"getJsonContent","FreshSystem");
                        $titles = array('Content');
			foreach($records as $record)
			{
			 	if (!$record->getIsReadAllowed()) continue;
                                $this->record = $record;
				$gw = new FWidgetGateway($record,null,$lang);
				$this->_resultData = array_merge($this->_resultData,$gw->getData());
                                $fields = $gw->getFields();
                                if ($fields[0]['forTab'])
                                    $titles[] = $fields[0]['forTab'];
				$this->_metaData = array_merge($this->_metaData,$fields);
			}

                        array_unique($titles, SORT_STRING);
                        
			$formConfig = array(
			     "title"=>$container->name . (($lang) ? " ($lang)" : '')
				,"labelAlign"=>"left"
			        ,"columnCount"=>count($titles)
                                ,'titles'=>$titles
				,'autoScroll'=>true
				,'autoWidth'=>false
				,'anchor'=> '90%'
			        ,"labelWidth"=>100
                                ,'deferredRender'=>false
			        //,"hideLabel"=>true
			        ,"defaults"=>array(
			                 'xtype'=>'textfield',
					 'allowBlank'=>true
			    )
			);
			
			$this->_resultData[] = array('id'=>'parent','value'=>$parentId);
			/*$this->_metaData[] = array(
                                'fieldLabel'=>'end',
                                'name'=>'dummy',
                                'editor'=>array(
                                     'xtype'=> 'fieldset',
                                     'anchor'=> '90%',
                                    'items'=>array(
                                'fieldLabel'=>'---',
                                'name'=>'aaa',
                                'items'=>array('xtype'=>'textfield','width'=>400,'name'=>'parent')
                        ),
                                    'stateEvents'=>array('collapsed'),
                                    //"labelWidth"=>$labelWidth,
                                    'collapsed'=>false,
                                   //'stateId'=>'$this->getRecord()->name',
                                    'stateful'=>true,
                                    'hideMode'=>'offsets',
                                    'collapsible'=>true,
                                    'title'=>'last')); */
                        $this->_metaData[] = array('name'=>'parent',
									  'editor'=>array('xtype'=>'hidden'));

			$answer = array('success'=>true,'metaData'=> array('fields'=>$this->_metaData,"formConfig"=>$formConfig),'data'=>$this->_resultData);
			
		}
		else {
			$answer = array('success'=>false,'message'=>'Bad action requested!');
		}
		SWPLogManager::log("getJsonContent method returns an answer",array('component'=>$answer),TLogger::INFO,$this,"getJsonContent","FreshSystem");
		return array('component'=>$answer);

	}
	
	public function dualDataHelper()
	{
		SWPLogManager::log("dualDataHelper method preparing data ",null,TLogger::INFO,$this,"dualDataHelper","FreshSystem");
		$data = $this->getData();
		SWPLogManager::log("data object",$data,TLogger::DEBUG,$this,"dualDataHelper","FreshSystem");
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
		}
	}	
	
	public function getDualUid($Uuid)
	{
		SWPLogManager::log("getDualUid method getting one parameter ",$Uuid,TLogger::INFO,$this,"getDualUid","FreshSystem");
		if (preg_match('/^(content|container)-([0-9]+)$/im',$p,$m)) {
			SWPLogManager::log("getDualUid method returns array ",array("m[1]" => $m[1],"m[2]" => $m[2]),TLogger::INFO,$this,"getDualUid","FreshSystem");
			return array($m[1],$m[2]);
		}
		else
		{
			SWPLogManager::log("getDualUid throwing an Exception Bad Uid ",array("Bad UID :"=>'Bad Uuid '.__LINE__),TLogger::ERROR,$this,"getDualUid","FreshSystem");
			throw new FJsonException('Bad Uuid '.__LINE__);
		}
	}
	
}
