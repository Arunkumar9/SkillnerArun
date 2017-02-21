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
 * @version	$Id: FJsonMailProvider.php 2348 2013-12-20 10:20:54Z arun $
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
class FJsonMailProvider extends FJsonViewProvider
{
    const DEFAULT_PAGING=25;
	protected $_record;

	public function getJsonContent()
	{
		if (!$this->getIsAuthorized())
            throw new FJsonException('Not authorized!');

		$user = $this->User;
		$request = Prado::getApplication()->Request;
        $id = $request['id'];
		$meta = $request['meta'];
		if (!($view = $request['view']) || !$id) // || !( || !($action = $request['action'])
            throw new FJsonException('Bad request (1)!');

        //Read View definition
		
        $data = $this->getYamlData($view);
        $this->setContext($data,$request['context']);

        $recordClass = $this->context['recordClass'];
        $this->finder = FBaseActiveRecord::finder($recordClass);

        $dataRoot = ($this->context['dataRoot'])?$this->context['dataRoot']:'filter';
		
		$filter = '';
        if (preg_match('/^[0-9_A-Z,]+$/',$request[$dataRoot]))
            $filter = explode(',',$request[$dataRoot]);
		elseif ($request[$dataRoot])
			$filter = json_decode($request[$dataRoot],true);
		
/*		if ($this->finder instanceof TActiveRecord)
		{
	        $connection = $this->finder->getDbConnection();
	        $connection->setActive(true);
			if ($this->context['setNames'])
			{
				$cmd = $connection->createCommand('SET NAMES '.$this->context['setNames']);
				$cmd->execute();
			}
	        $transaction=$connection->beginTransaction();
		}*/
		try 
        {
            if ($action = $this->context['action']) 
            {
                    $answer = $this->$action($filter);
            }
            else
            {
           	    $answer = $this->defaultAction($filter);
            }
			//if ($this->finder instanceof TActiveRecord)
				//$transaction->commit();
        }
        catch (Exception $e)
        {
			 //if ($this->finder instanceof TActiveRecord)
 			 	//$transaction->rollback();
			 $msg = $this->evalError($e->getMessage());
             $msg = ($msg)?$msg:'Internal error! '.$e->getMessage();
             throw new FJsonException($msg);
        }

        return array('component'=>$answer);
	}
    
	
	public function defaultAction($filter)
	{
		
		try {
			
			$adrRecordClass = $this->context['addresses']['recordClass'];
			$af = FBaseActiveRecord::finder($adrRecordClass);
			$criteria = $this->getContextCriteria($this->context['addresses'],$filter);
			$cc = $af->count($criteria);
			
			if (!$cc)
				throw  new FJsonException('No contacts supplied!');

			$this->finder->updateByPk(array('sending'=>$cc),$this->Request['id']);
			//$newsletter = $this->getRecord($this->Request['id']);
			//$newsletter->send = $cc;
			//$newsletter->save();
			//$this->setRecordData($this->Request['id'],array('send'=>$cc));
			//var_dump($newsletter);
			if ($this->context['successMsg'])
	            $answer = array('success'=>true,message=>$this->context['successMsg']);        
	        else
	            $answer = array('success'=>true,message=>$cc.' of '.$newsletter->name.' '.Prado::localize("submitted ok."));

		} catch (Exception $e) {
			Prado::log('ERROR '.$e->getMessage());
			$msg = $this->evalError($e->getMessage());
            $msg = ($msg)?$msg:'Internal error! '.$e->getMessage();
            throw new FJsonException($msg);
		}
		return $answer;
			        
	}

	protected function singleMail($filter)
	{
		try {
	
			$email = $this->Request['email'];
			if (!$email)
				throw  new FJsonException('No email supplied!');
				
			$template = $this->context['template'];
			$newsletter = $this->getRecord($this->Request['id']);
			
			self::sendPreparedMail($template, $newsletter, $email);
			
			if ($this->context['successMsg'])
	            $answer = array('success'=>true,'message'=>$this->context['successMsg']);
	        else
	            $answer = array('success'=>true,'message'=>Prado::localize("Email to ").' '.str_replace('@','(at)',$email).' '.Prado::localize("sent ok."));
		} catch (Exception $e) {
			Prado::log('ERROR '.$e->getMessage());
			$msg = $this->evalError($e->getMessage());
            $msg = ($msg)?$msg:'Internal error! '.$e->getMessage();
            throw new FJsonException($msg);
		}
		return $answer;
	}
	
	public static function sendPreparedMail($template,$record,$email,$name='')
	{
			$name = ($name) ? $name : $email;
			$app = Prado::getApplication();
			$mTpl = new FMailTemplate('Application.mails.'.$template,$record);
			$subject = $mTpl->getSubject();
			$text = $mTpl->flush();
			$culture = strtolower($app->Globalization->Culture);
			$attachments = array();
			try {
			    $att = json_decode($record->images);
			    if (is_array($att))
			    {
				foreach($att as $at)
				{
				    $aname = ($at->text) ? $at->text : basename($at->uid);
				    $filename = Prado::getPathOfNamespace('Root.*').'/'.$at->uid;
				    //echo $filename;
				    $file = file_get_contents($filename);
				    $attachments[$aname] = $file;
				}
			    }
			} catch (Exception $e) {}
			$cust = array(		
				'subject'=>	$subject,
				'text' =>	$text,
				'from'=>	array($app->Parameters['emailAdmin'], $app->Parameters['siteTitle']),
				'to'=> 		array(array($email,$name)),
			);
			if (count($attachments)>0)
			    $cust['attach'] = $attachments;
				//var_dump($cust);
			$app->Modules['mail']->send($cust);
	}
    protected function getProperties()
    {
          $properties = $this->config['properties'];
          $addProperties = $this->config['add-properties'];
          $remProperties = $this->config['remove-properties'];
          if (!is_array($properties))  
          {
              $properties = $this->finder->RecordGateway->getRecordTableInfo($this->finder)->ColumnNames;
          }
		  
          foreach($properties as $k=>$p) 
              $properties[$k] = trim($p,'`');

          if (is_array($remProperties))
              $properties = array_diff($properties,$remProperties);
          
          if (is_array($addProperties))
              $properties = array_merge($properties,$addProperties);
              
          return $properties;        
    }

    protected function getRecord($id)
    {
		if ($this->_record === null)
		{
          if (!$id || $this->context['sendBlank'] || $id=='new')
          {
              $class = $this->context['recordClass'];
              $rc = new $class;
              if ($this->context['columns'])
                  foreach($this->context['columns'] as $k=>$v)
                  {
                      if ($v['default'])
                          $rc->$k = FU::evalExpression($v['default'],$this);
                          
                  }
              return $rc;
          }
          if ($findBy = $this->config['findBy'])
          {
              $findBy = 'findBy'.$findBy;
              $record = $this->finder->$findBy($id);
          }
          else
          {
              $record = $this->finder->findByPk($id);
          }
          
          if ($this->context['columns'])
              foreach($this->context['columns'] as $k=>$v)
              {
                  if ($v['type'])
                      $record->$k = FU::typeCast($record->$k,$v['type']);
              }
		  $this->_record = $record;
		}
        if ($this->_record)
           return $this->_record;        
        else
          throw new FJsonException('Wrong record requested! ('.$id.') ');
    }

    public function getRecordData($id)
    {
          
          $values = array();
          $record = $this->getRecord($id);
          if (method_exists($record,'toArray')) {
              return $record->toArray($this->getProperties());
          }
          else
          {
              foreach($this->getProperties() as $p)
              {
                  $values[$p] = $record->$p;
              }
              
              return $values;
          }
    }
    
	public function setRecord($value)
	{
		$this->_record = $value;
	}
    protected function setRecordData($id,$data)
    {
          $diffData = array();
          $request = Prado::getApplication()->Request;
		  $dataRoot = $this->context['dataRoot'];
		  if ($this->context['inDataFormat'] == 'wizard')
		  {
			$data = json_decode($request[$dataRoot],true);
			$request = array();
			foreach($data as $card )
				$request = array_merge($request,$card);
		  }
		  elseif ($this->context['inDataFormat'] == 'json')
		  {
			$data = json_decode($request[$dataRoot]);
			$request = $data;
		  }
		  Prado::trace('request '.TVarDumper::dump($request),'Json');
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
          else
          {
              foreach($properties as $p)
              {
                  if (isset($request[$p]))
                  {
                      $record->$p = $request[$p];
                      if (!$record->secureUpdate($p,$request[$p]) || $record->$p != $request[$p])
                          $diffData[$p]=$record->$p;
    //                  echo $p.' => ';
                   }
                      
              }
          }
          $record->save();
          
 /*         $diffData = array();
          if ($toArrayExists)
          {
               var_dump($origData);
              $diffData = array_udiff_assoc($record->toArray($properties),$origData,create_function('$a,$b','return !($a==$b);'));
          }
*/         
          $idField = $this->config['findBy'];
          $answer = array('success'=>true,'message'=>$this->context['successMsg'],$idField => $record->$idField);
          if (count($diffData)>0)
              $answer['result'] =  $diffData;

          return $answer;
    }

	public function uploadFiles($id)
	{

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
		if (count($errors)==0)
			return array('success'=>true, 'message'=>'upload ok');
		else 
			return array('success'=>false, 'errors'=>$errors);
	}


}
