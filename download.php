<?php
/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23339	       Arunkumar.muddada    201311271405    Added Method :deleteNonEmptyDir
 *  														this method deletes the files and direcotories in a folder (Includig the folder).
 */
require_once('amazon/aws-autoloader.php');
use Aws\S3\S3Client;
require 'config.php';
      //header("Content-Type: application/force-download\n"); 
     // header("Content-Disposition: attachment; filename=".$_GET['fileName']); 
     // header('Content-Disposition: attachment; filename="'.$_GET['fileName'].'"'); 
     // readfile($_SERVER['DOCUMENT_ROOT'].'/awesomeuploader/'.'demo.html'); 
     
function recurse_zip($src,&$zip,$path_length , $creatorFiles,$name ) {
        $dir = opendir($src);
       
        while(false !== ( $file = readdir($dir)) ) {
            if (( $file != '.' ) && ( $file != '..' )) {
            	$isdirectory = is_dir($src . '/' . $file);
            	
                if ( $isdirectory == true ) {

                	//
                	// if creator files is false then zip the sub folders of the current directory else
                	// do not zip the sub folders
                	//
                	
                	if(  $creatorFiles == false ){
                    recurse_zip($src . '/' . $file,$zip,$path_length,false,false ); 
                	}
                }else {
                    $zip->addFile($src . '/' . $file,( $name ? ($name. '/' . $file) : substr( $src . '/' . $file,$path_length)));
                }
            }
        }
        closedir($dir);
}


//Call this function with argument = absolute path of file or directory name.
/**
 * 
 * this method compresses the src direcoty and if creatorFiles is true 
 * zipes only the files under the src directory leaving folders.
 * else zips all the directories
 * @param unknown_type $src
 * @param unknown_type $creatorFiles
 */
function compress($src , $creatorFiles,$fileType )
{
		//$baseUrl = FIniFilePanelTrainingFiles::BaseUrl();
        if(substr($src,-1)==='/'){
        	
        	$src=substr($src,0,-1);}
        	$arr_src=explode('/',$src);
        
        $filename = end($arr_src);
        $filename = str_ireplace("#", "-", $filename );
        $filename = str_ireplace(" ", "-", $filename );
        if( $fileType == 1 ){
        	
	        $fileType = substr($arr_src[count($arr_src)-2],5,10).'_'.$filename;
	        $filename = substr($arr_src[count($arr_src)-2],5,10).'_'.$filename;
	         $filename = str_ireplace("#", "-", $filename );
        	$filename = str_ireplace(" ", "-", $filename );
        	
        }
        unset($arr_src[count($arr_src)-1]);
        $path_length = strlen(implode('/',$arr_src).'/');
        $filename = (($filename=='')? ($_SERVER['DOCUMENT_ROOT'].'/images/trainingfiles/'. 'backup.zip') : ($_SERVER['DOCUMENT_ROOT'].'/images/trainingfiles/'.$filename.'.zip'));
        $zip = new ZipArchive;
        $res = $zip->open($filename, ZipArchive::CREATE);
        if( $res !== TRUE ){
                echo 'Error: Unable to create zip file';
                exit;}
        if(is_file($src)){$zip->addFile($src,substr($src,$path_length));}
        else {
                if(!is_dir($src)){
                     $zip->close();
                     @unlink($filename);
                     echo 'Error: File not found';
                     exit;}
        recurse_zip($src,$zip,$path_length , $creatorFiles ,$fileType);}
        $zip->close();
        return $filename;
}




//Call this function with argument = absolute path of file or directory name.
/**
 * //201311271405
 * this method deletes the files and direcotories in a folder (Includig the folder).
 * 
 * @param unknown_type $dir
 */
function deleteNonEmptyDir($dir) 
{
   if (is_dir($dir)) 
   {
        $objects = scandir($dir);

        foreach ($objects as $object) 
        {
            if ($object != "." && $object != "..") 
            {
                if (filetype($dir . "/" . $object) == "dir")
                {
                    deleteNonEmptyDir($dir . "/" . $object); 
                }
                else
                {
                    unlink($dir . "/" . $object);
                }
            }
        }

        reset($objects);
        rmdir($dir);
    }
}

//
// lesson exists
//

$lesson = $_GET['lesson'];
$question = $_GET['question'];
$isFromAmazon = $_GET['isfromamazon'];
                         
//
//if lesson or question name exists then onlycreator files should be donwloaded. 
//

	//$baseUrl = FIniFilePanelTrainingFiles::BaseUrl();
$onlyCreator = false;
if( $lesson == -1 ){
	 $file = '/images/trainingfiles/'. $_GET['pid']."/";
//	 $file = $_SERVER['DOCUMENT_ROOT'].'/images/trainingfiles/'. $_GET['pid']."/";
	 $fileType =0 ;	
}else{
	
	$file = '/images/trainingfiles/'. $_GET['pid']."/". $_GET['lesson'].'/';
	$onlyCreator = true;
	$fileType = 0 ;
}
 

if( $question != -1 ){
	$file .= $question;
	$onlyCreator = true;
	$fileType = 1 ;
}
if ($isFromAmazon){
	
	$client = S3Client::factory(array(
                              'key'    => $key,
                              'secret' => $secret
                          ));

	$folderName = explode('images',$file );
	$lastCharacter = substr($folderName[1],-1);
	if( $lastCharacter == '/'){
		$requiredPath = substr($folderName[1],1,-1);
	}else {
		$requiredPath = $folderName[1] ;
	}
 	if( substr($requiredPath, 0, 1) == '/'){
		
		$requiredPath =  substr($requiredPath, 1); 
	}
	$client->downloadBucket( (dirname(__FILE__).'/tmps/') ,$bucket,$requiredPath );
	$file = $_SERVER['DOCUMENT_ROOT'].'/tmps/'.$requiredPath;

} else {
	
	$file = $_SERVER['DOCUMENT_ROOT'].$file;
}

$destination = compress( $file , $onlyCreator,$fileType );
 header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename($destination));
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($destination));
    ob_clean();
    flush(); 
   

if( $isFromAmazon ){
	//201311271405
	deleteNonEmptyDir($file);
}

readfile ($destination);  

unlink($destination);

 ?>

