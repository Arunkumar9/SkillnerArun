<?php
/* FJsonFileProvider.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 17.10.2006
 */

require 'amazon/aws-autoloader.php';
use Aws\S3\S3Client;
use Aws\Common\Enum\Size;
use Aws\Common\Exception\MultipartUploadException;
use Aws\S3\Model\MultipartUpload\UploadBuilder;
use Guzzle\Http\EntityBody;

class FJsonFileProvider extends FJsonResponse
{
	protected $request;
	
	public function getJsonContent()
	{
		SWPLogManager::log("This method used to get json content related to files",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
		if (!$this->getIsAuthorized()){
			SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array('component'=>array('success'=>false, 'error'=>'Not authorized!')),TLogger::ERROR,$this,"getJsonContent","FreshSystem");			
			return array('component'=>array('success'=>false, 'error'=>'Not authorized!'));
		}

		$this->request = Prado::getApplication()->Request;
//Prado::Trace(TVarDumper::dump($this->request->toArray()),'Json');
		$cmd = $this->request['cmd'];
		if ($cmd == 'path'){
			$dirpath = $this->getDir($this->request['path'],false);
			$oldpath = explode("images",$dirpath);
			$abc = substr($oldpath[1], 1);
			$requiredKey = 'images/'.$abc;
			$requiredKey = str_replace("\\","/",$requiredKey);
			SWPLogManager::log("Returns Component required key",array('component'=>$requiredKey),TLogger::INFO,$this,"getJsonContent","FreshSystem");
			return array('component'=>$requiredKey);
		}
	//	if (!$cmd)
		//	return array('component'=>array('success'=>false, 'error'=>'Bad request! '.__LINE__));
		
		if ($this->request['APC_UPLOAD_PROGRESS'])
			$cmd = 'upload';
		$method = 'cmd'.ucfirst($cmd);
		if (!is_callable(array($this,$method)) ) {
			SWPLogManager::log("Bad command!",array('success'=>false, 'error'=>"Bad command: $cmd!"),TLogger::ERROR,$this,"getJsonContent","FreshSystem");
			return array('success'=>false, 'error'=>"Bad command: $cmd!");
		}
		$result = $this->$method();
		SWPLogManager::log("Returns Component result",array('component'=>$result),TLogger::INFO,$this,"getJsonContent","FreshSystem");
		return array('component'=>$result);

	}


	public function getDir($path,$create=true)
	{
		SWPLogManager::log("getDir method gets the directory by path parameter",$path,TLogger::INFO,$this,"getDir","FreshSystem");
		$configClass = 'FilePanel'.$this->request['panel'];
                $configPath = FU::Ini($configClass.'.BaseDir');
//echo 'dir:'.$configPath;die();

		$baseDir = (strpos($configPath, '/')===false) ? Prado::getPathOfNamespace( $configPath.'.*' ) : $configPath;
                if ($ab = $this->request["appendBase"])
                    $baseDir .= "/".FU::urlify($ab);
		$dir = str_replace('root/',$baseDir.'/',$path);
		if ($dir == 'root') $dir = $baseDir;
		try {
                    if ($create && !is_dir($dir))
                        mkdir($dir);
		} catch (Exception $e) {
			SWPLogManager::log("'Bad config with dir",array('success'=>false, 'error'=>'Bad config with dir '.$path),TLogger::ERROR,$this,"getDir","FreshSystem");
			return array('success'=>false, 'error'=>'Bad config with dir '.$path);
		}
		SWPLogManager::log("Returns Directory",$dir,TLogger::INFO,$this,"getDir","FreshSystem");
		return $dir;
	}

        public function getFullPath($path)
        {
        	$res = $this->getDir($path,false);
        	SWPLogManager::log("Returns full path for the Directory",$res,TLogger::INFO,$this,"getFullPath","FreshSystem");
            return $res;
        }

	public function getUrl($path) 
	{
		SWPLogManager::log("getUrl method used to get the Url by path parameter",$path,TLogger::INFO,$this,"getUrl","FreshSystem");
		$configClass = 'FilePanel'.$this->request['panel'];
		$baseUrl = FU::Ini($configClass.'.BaseUrl');
                if ($ab = $this->request["appendBase"])
                    $baseUrl .= "/".FU::urlify($ab);
//		$baseDir = Prado::getPathOfNamespace( FU::Ini($configClass.'.BaseUrl').'.*' );
		$dir = str_replace('root/',$baseUrl.'/',$path);
		if ($dir == 'root') $dir = $baseUrl;
		SWPLogManager::log("Returns Base Url",$dir,TLogger::INFO,$this,"getDir","FreshSystem");
		return $dir;
	}

	public function getDownloadUrl($path) 
	{
		SWPLogManager::log("getDownloadUrl method used to get the DownloadUrl by path parameter",$path,TLogger::INFO,$this,"getDownloadUrl","FreshSystem");
		$configClass = 'FilePanel'.$this->request['panel'];
		$baseUrl = 'downloads/'.FU::Ini($configClass.'.BaseUrl');
                if ($ab = $this->request["appendBase"])
                    $baseUrl .= "/".FU::urlify($ab);
//		$baseDir = Prado::getPathOfNamespace( FU::Ini($configClass.'.BaseUrl').'.*' );
		$dir = str_replace('root/',$baseUrl.'/',$path);
		if ($dir == 'root') $dir = $baseUrl;
		SWPLogManager::log("Returns downloaded Url",$dir,TLogger::INFO,$this,"getDownloadUrl","FreshSystem");
		return $dir;
	}

	public function isReadOnly($path)
	{
		SWPLogManager::log("isReadOnly method expecting path as param",$path,TLogger::INFO,$this,"isReadOnly","FreshSystem");
		return false;
		$dir = $this->getFullPath($path);
		
		if (is_file($dir.'.lock')) {
			return true;
		}
		return false;
	}
	
	public function getQTip($path, $fromS3 )
	{
		SWPLogManager::log("getQTip method expecting path and froms3 as params",array('Path'=>$path, 'From s3'=>$fromS3),TLogger::INFO,$this,"getQTip","FreshSystem");
		if ($fromS3){
			$createdTime = explode("T",$path['LastModified']);
			$res = "Size: ".$path['Size']."<br>Date: ".$createdTime[0].' '.substr($createdTime[1], 0, -4);
			SWPLogManager::log("getQTip returns the path size and date if it is from s3",$res,TLogger::INFO,$this,"getQTip","FreshSystem");
			return $res;
		} else{
			$res = "Size: ".filesize($path)."<br>Date: ".strftime('%d.%m.%Y %H:%M',filemtime($path));
			SWPLogManager::log("getQTip returns the path size and date if it is not from s3",$res,TLogger::INFO,$this,"getQTip","FreshSystem");
			return $res;
		}
	}
	
	public function notShow($file)
	{
		SWPLogManager::log("Pattern for file",$file,TLogger::INFO,$this,"notShow","FreshSystem");
		$configClass = 'FilePanel'.$this->request['panel'];
		$pattern = FU::Ini($configClass.'.notShow');
		$res = preg_match("/$pattern/",$file);
		SWPLogManager::log("Returns Pattern for file",$res,TLogger::INFO,$this,"notShow","FreshSystem");
		return $res;
	}
	
	
/**

	Commands

*/

	public function cmdUpload4()
	{
		SWPLogManager::log("cmdUpload4 used to upload files",null,TLogger::INFO,$this,"cmdUpload4","FreshSystem");
		$path = $this->request['path'];
		//if (!$path)
		//	return array('success'=>false, 'error'=>'Bad request! '.__LINE__);
		
		$dir = $this->getDir($path).'/';
		$errors = array();
		Prado::Trace(TVarDumper::dump($this->request->UploadedFiles),'Json');
		foreach($this->request->UploadedFiles as $k => $file) {
			if ($file['name']) {
				if (!move_uploaded_file($file['tmp_name'],$dir.$file['name']))
					$errors[$k]='cannot upload '.$file['tmp_name']."->".$dir.$file['name'];

				Prado::Trace('copied upl '.$dir.$file['name']);
			}
		}
		
		$response = Prado::getApplication()->getResponse();
		$response->ContentType = 'text/html';
		if (count($errors)==0){
			$res = TVarDumper::dump($_FILES);
			SWPLogManager::log("Success fully uploaded files",array('success'=>true, 'message'=>'upload ok '.$res),TLogger::INFO,$this,"cmdUpload4","FreshSystem");			
			return array('success'=>true, 'message'=>'upload ok '.$res);
		}
		else {
			SWPLogManager::log("Upload error",array('success'=>false, 'error'=>$errors),TLogger::ERROR,$this,"cmdUpload4","FreshSystem");			
			return array('success'=>false, 'error'=>$errors);
		}

	}

	
	public function cmdUpload()
	{
		require 'config.php';
		SWPLogManager::log("cmdUpload used to upload files",null,TLogger::INFO,$this,"cmdUpload","FreshSystem");
		$path = $this->request['path'];
		$dir = $this->getDir($path).'/';
		$duplicatefile = false ; 
		$errors = array();
                $name = $_SERVER['HTTP_X_FILE_NAME'];            
                if( !$name){
					$valid_chars_regex = '.A-Z0-9_ !@#$%^&()+={}\[\]\',~`-';	// Characters allowed in the file name (in a Regular Expression format)
					$upload_name = 'Filedata';
					// Other variables	
					$file_name = '';
					$file_name = preg_replace('/[^'.$valid_chars_regex.']|\.+$/i', "", basename($_FILES[$upload_name]['name']));
					$name = $file_name;
					$file = $_FILES[$upload_name]["tmp_name"];
							
                }else{
                	$file = "php://input";
                }
                if ($name) {
                	
//                	$panel = $this->request['panel'];
//					$requiredKey = 'images'.'/'.$panel.'/'.$name ;

					$oldpath = explode("images",$dir);
					$abc = substr($oldpath[1], 1);
					$totalPath = str_replace("\\","/",$abc);
					$requiredKey = 'images/'.$totalPath.$name;
					$fr = fopen($file,'r');
					$size = 0;$bytes = 0;
					
					// AS of now we are not handling for Files tab where we are uploading the video
					if ( Prado::getApplication()->Parameters['fileupload'] == "s3" ) {
					$existfiles = $this->cmdGet();
					foreach ( $existfiles as $existfile ){
						
						if( $existfile['text'] == $name ){
							$duplicatefile = true ; 
						}
					}
//					var_dump($file);
					if( !$duplicatefile ){
						try {
							
								$client = S3Client::factory(array(
							    'key'    => $key,
							    'secret' => $secret
								));
								
								$uploader = UploadBuilder::newInstance()
							    ->setClient($client)
							    ->setSource(fopen($file,'r+'))
							    ->setBucket($bucket)
							    ->setKey($requiredKey)
							    ->setOption('Metadata', array('Foo' => 'Test'))
							    ->setOption('CacheControl', 'max-age=3600')
							    ->setOption('ACL','public-read')
							    ->build();
							    
							    $uploader->upload();
							    if( $this->request['panel'] != "movies"){
							    
								    fclose($fr);
								    SWPLogManager::log("Success fully uploaded files",array('success'=>true, 'message'=>'Files upload ok'),TLogger::INFO,$this,"cmdUpload","FreshSystem");
								    return array('success'=>true, 'message'=>'Files upload ok');
							    } 
							
						} catch (Exception $e) {
							$uploader->abort();
							fclose($fr);
							SWPLogManager::log("Can not upload files",array('success'=>false, 'error'=>$e->getMessage()),TLogger::ERROR,$this,"cmdUpload","FreshSystem");
							return array('success'=>false, 'error'=>$e->getMessage());	
						}
					}else{
						SWPLogManager::log("files is already exist.",array('success'=>false, 'error'=>' files is already exist.'),TLogger::INFO,$this,"cmdUpload","FreshSystem");
						return array('success'=>false, 'error'=>' files is already exist.');	
					}					
			}
			$fw = fopen($dir.$name,'w');
			while (!feof($fr)) $bytes += fwrite($fw,fread($fr,8192));
			//$bytes = stream_copy_to_stream($fr,$fw);
			fclose($fw);fclose($fr);
                        if (!$bytes)
                                $errors[$k]='cannot upload ->'.$dir.$name;
                        else
                            Prado::Trace('upload: '.$dir.$name);
		}

		$response = Prado::getApplication()->getResponse();
		$response->ContentType = 'text/html';
		if (count($errors)==0){
			SWPLogManager::log("Success fully uploaded files",array('success'=>true, 'message'=>'upload ok'),TLogger::INFO,$this,"cmdUpload","FreshSystem");			
			return array('success'=>true, 'message'=>'upload ok');
		}
		else{
			SWPLogManager::log("Upload error",array('success'=>false, 'error'=>$errors),TLogger::INFO,$this,"cmdUpload","FreshSystem");
			return array('success'=>false, 'error'=>$errors);
		}
	}

	public function cmdNewdir()
	{
		require 'config.php';
		SWPLogManager::log("cmdNewdir used to create new Directory",null,TLogger::INFO,$this,"cmdNewdir","FreshSystem");
		$path = $this->request['dir'];
		if (!$path){
			SWPLogManager::log("Bad request!",array('success'=>false, 'error'=>'Bad request! '.__LINE__),TLogger::ERROR,$this,"cmdNewdir","FreshSystem");
			return array('success'=>false, 'error'=>'Bad request! '.__LINE__);
		}
		
		$dir = $this->getDir($path);
		
		try {
			
			// AS of now we are not handling for Files tab where we are uploading the video
			$oldpath = explode("images",$dir);
			$abc = substr($oldpath[1], 1);
			if( Prado::getApplication()->Parameters['fileupload'] == "s3" && $abc != "movies" ){
			
					$requiredKey = 'images/'.$abc;
						$client = S3Client::factory(array(
							    'key'    => $key,
							    'secret' => $secret
						));
							
						$result = $client->putObject(array(
					    'Bucket'     => $bucket,
					    'Key'        => $requiredKey.'/',
					    'Body'       => '',
						'ACL'        => 'public-read'
				));
				
			} else {
			
				mkdir($dir);
			}
		} catch (Exception $e) {
			SWPLogManager::log("Cannot create dir",array('success'=>false, 'error'=>'Cannot create dir '.$path),TLogger::ERROR,$this,"cmdNewdir","FreshSystem");
			return array('success'=>false, 'error'=>'Cannot create dir '.$path);
		}
		SWPLogManager::log("created",array('success'=>true, 'message'=>'Dir '.$path.' created!'),TLogger::INFO,$this,"cmdNewdir","FreshSystem");
		return array('success'=>true, 'message'=>'Dir '.$path.' created!');
		
	}

	public function cmdDelete()
	{
		SWPLogManager::log("cmdDelete used to delete the file",null,TLogger::INFO,$this,"cmdDelete","FreshSystem");
		require 'config.php';
		$path = $this->request['file'];
	
		if (!$path){
			SWPLogManager::log("Bad request!",array('success'=>false, 'error'=>'Bad request! '.__LINE__),TLogger::INFO,$this,"cmdDelete","FreshSystem");
			return array('success'=>false, 'error'=>'Bad request! '.__LINE__);
		}
		
		$dir = $this->getFullPath($path);
		if (is_file($dir.'.lock')) {
			$r = false;
		}
		else
		{
			$oldpath = explode("images",$dir);
			$count = strpos( $dir, "images");
			$actualPath = substr($dir, $count);
			$abc = substr($oldpath[1], 1);
			
			// AS of now we are not handling for Files tab where we are uploading the video 
//			$actualPath = $name;
			 $name = explode("/", $path);
			 $fileName = $name[1];
			 
			 if( $this->request['from'] == null || $this->request['from'] != 'awesomeuploader' ){
			 	
				 $fileUsed = $this->CheckForVideoFileExistence( $fileName, $this->request['panel'] );
				 if ( $fileUsed ){
				 	SWPLogManager::log("The file is being used by a lesson / quiz. Before deleting this file, please make sure that this file is not in use",array('success'=>false, 'error'=>'The file is being used by a lesson / quiz. Before deleting this file, please make sure that this file is not in use. '),TLogger::ERROR,$this,"cmdDelete","FreshSystem");
					return array('success'=>false, 'error'=>'The file is being used by a lesson / quiz. Before deleting this file, please make sure that this file is not in use. ');
				} 
			 	
			 }
		
			if ( Prado::getApplication()->Parameters['fileupload'] == "s3" &&  $this->request['panel'] != "movies" ){
			
				if( strpos ( $actualPath,'.') === false && !empty($this->request['from']) && $this->request['from'] == 'awesomeuploader' ){
					
					$actualPath = $actualPath.$fileName ;
				}
				$requiredKey = $actualPath ;
	
				$isFile = explode('.',$requiredKey);
				if( !$isFile[1] ){
					$requiredKey = $requiredKey.'/';
				}
				$client = S3Client::factory(array(
				    'key'    => $key,
				    'secret' => $secret
				));
				
				$requiredKey = str_replace("\\","/", $requiredKey );
				if( !empty($this->request['from']) && $this->request['from'] == 'awesomeuploader' ){
					
					try {
						$result = $client->deleteObject(array(
						'Bucket'     => $bucket,
					    'Key'        => $requiredKey,
						));
						SWPLogManager::log("deleted",array('success'=>true, 'message'=>$path.' deleted!'),TLogger::INFO,$this,"cmdDelete","FreshSystem");
						return array('success'=>true, 'message'=>$path.' deleted!');
					
					} catch (Exception $e) {
						SWPLogManager::log("Cannot delete ",array('success'=>false, 'error'=>'Cannot delete '.$path),TLogger::ERROR,$this,"cmdDelete","FreshSystem");
						return array('success'=>false, 'error'=>'Cannot delete '.$path);
					}
					
				}else{
					
					try {
					$dir = rtrim($requiredKey, "/");
            		$dir = ltrim($requiredKey, "/");

    				//get list of directories
       				$response = $client->getIterator('ListObjects', array(
		    			'Bucket' => $bucket,
		     			'Prefix' => $dir
					));
	   				 //delete each 
			        foreach ($response as $v) {
			            $result = $client->deleteObject(array(
							'Bucket'     => $bucket,
						    'Key'        => $v['Key']
						));
			        }//foreach
			        SWPLogManager::log($dir.' folder deleted!',array('success'=>true, 'message'=>$dir.' folder deleted!'),TLogger::INFO,$this,"cmdDelete","FreshSystem");
					return array('success'=>true, 'message'=>$dir.' folder deleted!');
					
					} catch (Exception $e) {
						SWPLogManager::log('Cannot delete folder '.$dir,array('success'=>false, 'error'=>'Cannot delete folder '.$dir),TLogger::ERROR,$this,"cmdDelete","FreshSystem");
						return array('success'=>false, 'error'=>'Cannot delete folder '.$dir);
					}
				}
			}
			if (is_dir($dir) ) 
				$r = rmdir($dir);
			elseif (is_file($dir) )
				$r = unlink($dir);
			else
				$r = false;		
		}	
		if (!$r){
			SWPLogManager::log("Cannot delete ",array('success'=>false, 'error'=>'Cannot delete '.$path),TLogger::ERROR,$this,"cmdDelete","FreshSystem");
			return array('success'=>false, 'error'=>'Cannot delete '.$path);
		}
		else{
			SWPLogManager::log("deleted",array('success'=>true, 'message'=>$path.' deleted!'),TLogger::INFO,$this,"cmdDelete","FreshSystem");
			return array('success'=>true, 'message'=>$path.' deleted!');
		}
		
	}

	public function cmdRename()
	{
		SWPLogManager::log("cmdRename used to rename the file",null,TLogger::INFO,$this,"cmdRename","FreshSystem");
		require 'config.php';
		$oldname = $this->request['oldname'];
		$newname = $this->request['newname'];
		if (!$oldname || !$newname)
			return array('success'=>false, 'error'=>'Bad request! '.__LINE__);
		$getOldDir = $this->getFullPath($oldname);
		$getNewDir = $this->getFullPath($newname);
		$oDir = str_replace("\\","/", $getOldDir );
		$nDir = str_replace("\\","/", $getNewDir );
		$oldpath = explode("images",$oDir);
		$newpath = explode("images",$nDir);
		//$abc1 = substr($oldpath[1], 1);
		//$def1 = substr($newpath[1], 1);
		$count = strpos( $dir, "images");
			$abc = substr($oDir, strpos( $oDir, "images"));
			$def = substr($nDir, strpos( $nDir, "images"));
		// AS of now we are not handling for Files tab where we are uploading the video 
		if( $this->request['panel'] == "movies" ) { 
			$oldFileName = $abc;
			 $name = explode("/", $oldFileName);
			 $fileName = $name[3];
			 $fileUsed = $this->CheckForVideoFileExistence( $fileName, $this->request['panel'] );
			if ( $fileUsed ){
				SWPLogManager::log("The file is being used by a lesson / quiz. Before renaming this file, please make sure that this file is not in use",array('success'=>false, 'error'=>'The file is being used by a lesson / quiz. Before renaming this file, please make sure that this file is not in use. '),TLogger::ERROR,$this,"cmdRename","FreshSystem");
				return array('success'=>false, 'error'=>'The file is being used by a lesson / quiz. Before renaming this file, please make sure that this file is not in use. ');
			} 
		}
		if( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
		
		try{
			
			$oldFileName = $abc;
			$newFileName = $def;
			$client = S3Client::factory(array(
		    'key'    => $key,
		    'secret' => $secret
			));
			
			$isFile = explode('.',$abc);
			if ($isFile[1]){
				
				$result = $client->copyObject(array(
			    'Bucket'     => $bucket,
			    'Key'        => $newFileName,
				'CopySource' => urlencode($bucket.'/'.$oldFileName),
		        'MetadataDirective' => 'COPY',
				'ACL'        => 'public-read'
				));
				
			} else {
				
				$result = $client->putObject(array(
			    'Bucket'     => $bucket,
			    'Key'        => $newFileName.'/',
			    'Body'       => '',
				'ACL'        => 'public-read'
				 ));
				 $oldFileName = $oldFileName.'/';
			}
			
			
			$client->deleteObject(array(
					'Bucket'     => $bucket,
				    'Key'        => $oldFileName,
				));
			if( $this->request['panel'] != "movies" ) {
				SWPLogManager::log("File Renamed",array('success'=>true, 'message'=>'Renamed!'),TLogger::INFO,$this,"cmdRename","FreshSystem");
				return array('success'=>true, 'message'=>'Renamed!');
			}	
			} catch (Exception $e){
				SWPLogManager::log("Cannot rename $oldname to $newname",array('success'=>false, 'error'=>"Cannot rename $oldname to $newname",'debug'=>$oDir.'->'.$nDir),TLogger::ERROR,$this,"cmdRename","FreshSystem");
				return array('success'=>false, 'error'=>"Cannot rename $oldname to $newname",'debug'=>$oDir.'->'.$nDir);
			}
		}
		//$cmd = 'mv "'.$oDir.'" "'.$nDir.'"';
                //exec($cmd, $output, $r);
		if (is_file($oDir.'.lock')) {
			$r = false;
		}
		else {
			$r = rename($oDir,$nDir);
		}
		if (!$r){
			SWPLogManager::log("Cannot rename $oldname to $newname",array('success'=>false, 'error'=>"Cannot rename $oldname to $newname",'debug'=>$oDir.'->'.$nDir),TLogger::ERROR,$this,"cmdRename","FreshSystem");
			return array('success'=>false, 'error'=>"Cannot rename $oldname to $newname",'debug'=>$oDir.'->'.$nDir);
		}
		else{
			SWPLogManager::log("Renamed",array('success'=>true, 'message'=>'Renamed!'),TLogger::INFO,$this,"cmdRename","FreshSystem");
			return array('success'=>true, 'message'=>'Renamed!');
		}
		
	}
	
	public function CheckForVideoFileExistence( $fileName, $panel ){
		
		SWPLogManager::log("CheckForVideoFileExistence getting two parameters",array('File Name'=>$fileName, 'Panel'=>$panel),TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
		$fileUsed =  false;
		if( $panel == "movies"){
		
			$videoRecords = VideoRecord::finder()->findAll();
			foreach( $videoRecords as $videoRecord){
				if( $fileUsed ){
					SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
					return $fileUsed;
				}
				if( $videoRecord->images  != 'null' ){
					$videoRecordImages = json_decode( $videoRecord->images );
					foreach ($videoRecordImages as $videoRecordImage){
						if( $videoRecordImage->text == $fileName ){
							$fileUsed = true;
							SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
							return $fileUsed;
						}
					}
				} 
			}
		}else if( $panel == "workingfiles"){
			
			$videoRecords = VideoRecord::finder()->findAll('files is not null');
			foreach( $videoRecords as $videoRecord){
				if( $fileUsed ){
					SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
					return $fileUsed;
				}
					$videoRecordImages = json_decode( $videoRecord->files );
					foreach ($videoRecordImages as $videoRecordImage){
						if( $videoRecordImage->text == $fileName ){
							$fileUsed = true;
							SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
							return $fileUsed;
						}
					}
			}
			$quizRecords = QuizRecord::finder()->findAll('files is not null');
			foreach( $quizRecords as $quizRecord ){
				if( $fileUsed ){
					SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
					return $fileUsed;
				}
				$quizRecordFiles = json_decode( $quizRecord->files );
				foreach ($quizRecordFiles as $quizRecordFile){
					if( $quizRecordFile->text == $fileName ){
						$fileUsed = true;
						SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
						return $fileUsed;
					}
				}
			}
			
		}else if ( $panel == "captionfiles"){
			
			$captions = VideoCaptionsRecord::finder()->findAll('name = ? ' , $fileName );
			if( count($captions)){
				$fileUsed = true;
				SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
				return $fileUsed;
			}
			
		}else if ( $panel == "images"){
			
			$quizRecords = QuizRecord::finder()->findAll('images is not null');
			foreach( $quizRecords as $quizRecord ){
				if( $fileUsed ){
					SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
					return $fileUsed;
				}
				$quizRecordFiles = json_decode( $quizRecord->images );
				foreach ($quizRecordFiles as $quizRecordFile){
					if( $quizRecordFile->text == $fileName ){
						$fileUsed = true;
						SWPLogManager::log("CheckForVideoFileExistence returns used file",$fileUsed,TLogger::INFO,$this,"CheckForVideoFileExistence","FreshSystem");
						return $fileUsed;
					}
				}
			}
			
		}
		
	}

	public function cmdGet()
	{
		// AS of now we are not handling for Files tab where we are uploading the video
		
		if( Prado::getApplication()->Parameters['fileupload'] == "s3" && $this->request['panel'] != "movies" ){
			$s3Path = $this->getPathFroms3();
			SWPLogManager::log("cmdGet method gets the Path from getPathFroms3 method",$s3Path,TLogger::INFO,$this,"cmdGet","FreshSystem");
			return $s3Path;
		}
		$path = $this->request['path'];
		if (!$path){
			SWPLogManager::log("Bad request!",array('success'=>false, 'error'=>'Bad request! '.__LINE__),TLogger::ERROR,$this,"cmdGet","FreshSystem");
			return array('success'=>false, 'error'=>'Bad request! '.__LINE__);
		}
		
		$pattern = FU::Ini('FilePanel'.$this->request['panel'].'.pattern');
                $onlyDir = FU::Ini('FilePanel'.$this->request['panel'].'.onlyDir') || $this->request['onlyDir'];
		
		$dir = $this->getDir($path);
		Prado::Trace('JsonfileProvider::cmdGet '.$dir);
		
		if (strpos($dir,'://')===false) {
                    $files = glob($dir.'/'.$pattern,GLOB_BRACE);
                    $files = array_unique(array_merge($files,FU::safeGlob($dir.'/*',GLOB_ONLYDIR)));
                    $remote = false;
                    //Prado::Trace('JsonfileProvider::cmdGet '.TVarDumper::dump($files),'Json');
                } else {
                    $files = scandir($dir);
                    $remote = true;
                }

                $result = array();
		foreach ($files as $fullPath)
		{
			
			$file = basename($fullPath);
			if ($file == '.' || $file == '..' || $this->notShow($file) || !$file) { continue;	}
                        if ($remote) {
                            $isdir = is_dir($dir.'/'.$fullPath);
                            if (!$isdir && !preg_match('/'.$pattern.'/',$fullPath))
                                    continue;
                            $fullPath =  $dir.$fullPath;

                        } else {
                            $isdir = is_dir($fullPath);
                        }

                        //$fullPath = $dir.'/'.$file;
			$info = pathinfo($fullPath);
			
			$item = array();
			$item['text'] = $file;
			$item['disabled'] = $this->isReadOnly($fullPath);
			
			if ($isdir) {
				$item['iconCls'] = 'folder';
				$item['leaf'] = false;
			} elseif (!$onlyDir) {
				$item['iconCls'] = 	'file-'.strtolower($info['extension']);
				$item['qtip'] = $this->getQTip($fullPath);
				$item['allowDrag']=true;
				$item['leaf'] = true;
				$item['record']=array('text'=>$file,'uid'=>$this->getUrl($path).'/'.$file);
			} else {
                            continue;
                        }

			$result[] = $item;
			
		}
		SWPLogManager::log("cmdGet returns result",$result,TLogger::INFO,$this,"cmdGet","FreshSystem");
		return $result;
		
	}
   public function getPathFroms3(){
		require 'config.php';
   		SWPLogManager::log("getPathFroms3 method requires the config.php to get file Path from S3 Server",null,TLogger::INFO,$this,"getPathFroms3","FreshSystem");
		$path = $this->request['path'];
		SWPLogManager::log("path object",$path,TLogger::DEBUG,$this,"getPathFroms3","FreshSystem");
		$dir = $this->getDir($path);
		$oldpath = explode("images",$dir);
		$abc = substr($oldpath[1], 1);
		$actualPath = 'images/'.$abc;
		$actualPath = str_replace("\\","/",$actualPath);
		$client = S3Client::factory(array(
		    'key'    => $key,
		    'secret' => $secret
		));

		$iterator = $client->getIterator('ListObjects', array(
		    'Bucket' => $bucket,
		     'Prefix' => $actualPath.'/'
		));
		$result = Array();

		foreach ($iterator as $object) {
			
			$file = explode("/",$object['Key']);
			$info = pathinfo($object['Key']);
			if( $this->request['path'] == 'root'){ // This condetion true for lesson/course management load
				
				if( count( $file ) > 4 && !empty($file[4]) ){ // getIterator give the all chiled,grandChilds objects of the root,It give only Files repository chaild elements 
					$fileName = null ; 
				}else{
					$fileName = $file[3];
				}
				
			}else { // This condetion true for folder on Files repository tree. 
				
				$pathFolders = explode("/",$this->request['path']);
				$folders = count( $pathFolders )-1 ;
				
				if( count( $file ) > (4+$folders) && !empty($file[4+$folders])){  
					$fileName = null ;
				}else{
					$fileName = $file[3+$folders];
				}
			
			}
			if ( ($object['Key'] != $actualPath.'/') && !empty($fileName) ){ 
				
				$item = array();
				$item['text'] = $fileName;
				$item['disabled'] = $this->isReadOnly($object['Key']);
				$extension = strtolower($info['extension']);
				
				if (empty($extension)) {
	
					$item['iconCls'] = 'folder';
					$item['leaf'] = false;
	
				} else {
	
					$item['iconCls'] = 	'file-'.$extension;
					$item['qtip'] = $this->getQTip($object, true );
					$item['allowDrag']=true;
					$item['leaf'] = true;
					if ($this->request['panel'] == "images"){
						$encodedKey = $amazonurl.urlencode($object['Key']);
						$item['record']=array('text'=>$file[3],'uid'=>$encodedKey,'imagePath'=>$encodedKey);
					}else if( $this->request['panel'] == "captionfiles" ){
						$path = $amazonurl.urlencode($object['Key']);
						$item['record']=array('text'=>$fileName,'uid'=>$object['Key'],'imagePath'=>$path);
					}else{
						$path = $amazonurl.urlencode($object['Key']);
						$item['record']=array('text'=>$file[3],'uid'=>$object['Key'],'imagePath'=>$path);
					}
				} 
	
				$result[] = $item;
			}
		}
		SWPLogManager::log("getPathFroms3 returns result!",$result,TLogger::INFO,$this,"getPathFroms3","FreshSystem");
		return $result;
		
	}
	
	public function cmdFileRead()
	{
		$path = $this->request['path'];
		$name = $this->request['name'];
		if (!$path || !$name) {
			SWPLogManager::log("Bad request!",array('success'=>false, 'error'=>'Bad request! '.__LINE__),TLogger::ERROR,$this,"cmdFileRead","FreshSystem");
			return array('success'=>false, 'error'=>'Bad request! '.__LINE__);
		}
		
		$dir = $this->getFullPath($path);
		
		
		$content = file_get_contents( $dir );
		if( get_magic_quotes_runtime()) {
			$content = stripslashes( $content );
		}
				
		$file = $content; //str_replace(Array("\r", "\n", '<', '>'), Array('\r', '\n', '&lt;', '&gt;') , $content);
		SWPLogManager::log("success",array('success'=>true,'data'=>array(array('id'=>$name,'value'=>$file))),TLogger::INFO,$this,"cmdFileRead","FreshSystem");
		return array('success'=>true,'data'=>array(array('id'=>$name,'value'=>$file)));

	}

	public function cmdFileSave()
	{
		SWPLogManager::log("cmdFileSave method used to save the files",null,TLogger::INFO,$this,"cmdFileSave","FreshSystem");
		$path = $this->request['path'];
		$content = $this->request['content'];
		if (!$path || !isset($this->request['content'])) {
			SWPLogManager::log("Bad request!",array('success'=>false, 'error'=>'Bad request! '.__LINE__),TLogger::ERROR,$this,"cmdFileSave","FreshSystem");
			return array('success'=>false, 'error'=>'Bad request! '.__LINE__);
		}
		
		$dir = $this->getFullPath($path);
		
		file_put_contents($dir,$content);
		SWPLogManager::log("File saved!",array('success'=>true,'message'=>'File saved!'),TLogger::INFO,$this,"cmdFileSave","FreshSystem");
		return array('success'=>true,'message'=>'File saved!');

	}

	public function cmdDeleteAll()
	{
		$uploadfiles = json_decode($this->request['uploadfiles']);
		SWPLogManager::log("cmdDeleteAll deletes the uploaded file",$uploadfiles,TLogger::INFO,$this,"cmdDeleteAll","FreshSystem");
		$file = $this->request['file'];
		foreach ( $uploadfiles as $filename ){
			$this->request['file'] = $file.$filename ;
			$this->cmdDelete();
		}
	
	}
	
}
