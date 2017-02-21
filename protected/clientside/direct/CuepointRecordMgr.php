<?php
/** 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * 
 *  Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23689			Dinesh GK			20131127400     Modified :importTranscript 
 *  														chapter name is removing from script area.
 *  23839			Dinesh GK			20131129500		Modified :importTranscript 
 *  														Changed the  Upload Script Logic as per this issue specification
 *  23839			Dinesh GK			20131129930		Modified :importTranscript 
 *  														Error message for wrong script update is changed from default to user defined.
 *  23839			Dinesh GK			20131221220     Modified :importTranscript 
 *  														chapter name is removing from script area.
 *  28042			Dinesh GK			201407180131    Modified :importTitles 
 *  														import titles functionality is changed.
 *  27654			Dinesh GK			201407200405    Modified : isOldChaptersExist() is added for chacking of existing chapters for the lesson 
 */

class CuepointRecordMgr extends TComponent {

    /**
     * @remotable
     *
     */
    public function importTranscript($id,$text) {
		SWPLogManager::log("importTranscript method expecting Id and text as params. ",array('params'=>array('ID'=>$id,'Text'=>$text)),TLogger::INFO,$this,"importTranscript","SWP");
	 try {
		$sp = preg_split('/={2,}\[((CH))\]/is',$text,-1,PREG_SPLIT_DELIM_CAPTURE );
		$error =false;  
		if(!empty($sp[0])){ //If the start position have any not matched chapters we mark that as wrong script 
			$error =true;
		}
		array_shift($sp);
		$sp  = array_chunk($sp,3);
		$i=0;
		if(!$error) { //20131129500
			$error = count($sp) == 0 ? true : false;//If the chapter name is not exact matched then $sp is null,So we give the alert to user
			$cuepoints = CuepointRecord::finder()->findAll('videos_id = ? AND trim(name) like ?',$id,'CH');
			if ( count($cuepoints) == count($sp) ){
				for($i=0 ; $i < count($sp); $i++ ) {
					
					$cuepoints[$i]->transcript = $sp[$i][2];
					$cuepoints[$i]->save();
				}
			}else {
				$error = true;
			}
		}
//		if(!$error) {
//			$error = count($sp) == 0 ? true : false;//If the chapter name is not exact matched then $sp is null,So we give the alert to user
//			foreach($sp as $tr) {
//				$tr[2] = trim($tr[2]);
//	
//				if( count(explode('===[',$tr[2])) > 1 ){
//					$error = true;
//						break;
//				}
//				$tr[0]=trim($tr[0]);
//				if( substr($tr[2],0,1) == '['){
//				
//					$etr = explode(']',$tr[2]);
//					$etr[0] = trim($etr[0]);
//					$keyDescription = trim(substr($etr[0],1));
//					if( $keyDescription ) {
//					
//						if ($cue = CuepointRecord::finder()->find('videos_id = ? AND trim(name) like ? AND trim(description) like ?',$id,$tr[0],$keyDescription)) {
//							
//							$cue->transcript = substr($tr[2],strpos($tr[2],']')+1); //20131127400
//							if( substr($tr[0],0,1) == 'H') {
//								$cue->ishidden = 1;
//							}
//							
//							$cue->save();
//							
//							$i++;
//						}else {
//							SWPLogManager::log("Chapter '.$tr[0].' not found!",null,TLogger::ERROR,$this,"importTranscript","SWP");
//						   	throw new FJsonException('Chapter "'.$keyDescription.'" not found!');
//						}
//					
//					}else {
//						$error = true;
//						break;
//					}
//				}else{
//					$error = true;
//					break;
//				}
//			}
//		}
		if( $error ){
			SWPLogManager::log("Chapter '.$tr[0].' not found!",null,TLogger::ERROR,$this,"importTranscript","SWP");
			throw new FJsonException('The format of the uploaded content is not correct. Please check the format and try again.');
		}
		
		return $i; 
	 } catch (Exception $e) {
	 	
	     // Fatal error: Cannot access protected property FJsonException::$message
		  if (Prado::getApplication()->getUser()->MaxLevel>=300){
			   $message = $e->getMessage();
		  } else {
			   $message = Prado::localize("Error. Wrong format submitted.");
		  }
		  	SWPLogManager::log("Error. Wrong format submitted.",$message,TLogger::ERROR,$this,"importTranscript","SWP");
			return array('success'=>false,'error'=>$e->getMessage()); //20131129930
	 }
	}


    /**
     * @remotable
     *
     */
    public function importTitles($id,$text) {
    	
    	SWPLogManager::log("importTitles method expecting Id and text as params.",array('params'=>array('ID'=>$id,'Text'=>$text)),TLogger::INFO,$this,"importTitles","SWP");
	 try {
	 	//201407180131
		$i=0;
	    CuepointRecord::finder()->deleteAll('videos_id = ?',$id);
	 	foreach($text as $rec) {
	 		
			$cuepoint = new CuepointRecord();
			$cuepoint->name = 'CH';
			$cuepoint->videos_id = $id;
			$cuepoint->description = $rec['description'];
			$start = $rec['start'];
			
	 	 	$secs = explode(':',$start);
            $i=0;$s=0;
            while (count($secs)>0) {
                $s += array_pop($secs)*pow(60,$i);
                $i++;
            }
			$cuepoint->start =  $s;
			
			if($rec['skippable']) {
				$cuepoint->skippable = $rec['skippable'];
			}else {
				$cuepoint->skippable = 'N';
			}
			$cuepoint->save();
			$i++;
		}
		return $i;
	/*	$time = time();
		$records = explode("\n",trim($text));
	
		if (!$records[0] || !$id){
			SWPLogManager::log("Error! Invalid import data.",null,TLogger::ERROR,$this,"importTitles","SWP");
			throw new TException('Error! Invalid import data.');
		}
	     
		$headers = explode("\t",  str_ireplace(array('text','start','do'),
									    array('name','startFormated',), $records[0]));		
	

		array_shift($records);

		/*$akeys = array();
		foreach ($attributes as $att) {
			$akeys[strtolower($att->nameLangCs)] = $att;
		}*/
		  
	  /*   $i=0;
		foreach($records as $k => $rec) {
	
			$row = array_combine($headers,explode("\t",trim($rec)));
			if ( isset($records[$k+1])) {
				$rown = array_combine($headers,explode("\t",trim($records[$k+1])));
			}				
			$row['videos_id']=$id;
			$row['is_enabled']=1;
			if ( isset($records[$k+1])) { //!$row['stopFormated'] &&
				$row['stopFormated'] = $rown['startFormated'];
			}
			$rec = new CuepointRecord($row);
			$rec->save();
			$i++;
		}
		
		SWPLogManager::log("importTitles method returns records count.",$i,TLogger::INFO,$this,"importTitles","SWP");
		return $i;*/

	 } catch (Exception $e) {
		  if (Prado::getApplication()->getUser()->MaxLevel>=300)
			$message = $e->getMessage();
		  else
			   $message = Prado::localize("Error. Wrong format submitted.");
		  SWPLogManager::log("Error. Wrong format submitted.",$message,TLogger::ERROR,$this,"importTitles","SWP");
		  throw new FJsonException($message);
	 }
    }
    //201407200405
   /**
     * @remotable
     */
    public function isOldChaptersExist( $id, $checkType ){
    	
    	$cuepoints = 0;
    	if( $checkType == 'chapters'){
	    	$cuepoints = CuepointRecord::finder()->findAll('videos_id = ? AND trim(name) like ?',$id,'CH');
    	}else if( $cuepoints == 'scripts' ){
    		$cuepoints = CuepointRecord::finder()->findAll('videos_id = ? AND ((transcript != NULL) OR (transcript != "") )',$id);
    	}
    	if( count( $cuepoints ) > 0 ){
    		return true;
    	}else {
    		return false;
    	}
    	
    } 

}

