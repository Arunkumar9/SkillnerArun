<?php
/*
Copyright (c) 2010, Andrew Rymarczyk
All rights reserved.

Redistribution and use in source and minified, compiled or otherwise obfuscated 
form, with or without modification, are permitted provided that the following 
conditions are met:

    * Redistributions of source code must retain the above copyright notice, 
		this list of conditions and the following disclaimer.
    * Redistributions in minified, compiled or otherwise obfuscated form must 
		reproduce the above copyright notice, this list of conditions and the 
		following disclaimer in the documentation and/or other materials 
		provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  22798		   Arunkumar.muddada    201311251739    Added code for :
 *  														1. Checking is the request from amozons3 or not
 *  														2. if yes with first point , then is it from movies tab.
 *  														3. if yes with second point , then for movies we should not check for 
 *  														   duplicate as we are not deleting the movies related files from the amazon
 *  														   and in addition if that is from movies then only we are going to save in server\
 *  28255         Arunkumar.muddada     201406120566     Added code to remove the tailing new line chaters for the savepath
 */
require 'amazon/aws-autoloader.php';
require 'config.php';
use Aws\S3\S3Client;
use Aws\Common\Enum\Size;
use Aws\Common\Exception\MultipartUploadException;
use Aws\S3\Model\MultipartUpload\UploadBuilder;
use Guzzle\Http\EntityBody;

	$valid_chars_regex = '.A-Z0-9_ !@#$%^&()+={}\[\]\',~`-';	// Characters allowed in the file name (in a Regular Expression format)
	$MAX_FILENAME_LENGTH = 500;

	if(!isset($_SERVER['HTTP_X_FILE_NAME']) ){
		HandleError('Missing file name!');
	}
	
	$file_name = $_SERVER['HTTP_X_FILE_NAME'];
	if (strlen($file_name) == 0 || strlen($file_name) > $MAX_FILENAME_LENGTH) {
		HandleError('Invalid file name');
	}
	
	//
	//	The path that was prepared from UI is initialized to $save_path. Sothat path can be generic.
	//
	
	$save_path = $_SERVER['HTTP_EXTRAPOSTDATA_PATH'];
	//201406120566
	$save_path = str_replace("\n", '', $save_path);
	
	if( !file_exists( $save_path ) ){
		$bool = mkdir( $save_path , 0777 , true );
	}
	
	
	if(file_exists($save_path . $file_name) ){
		HandleError('A file with this name already exists');
	}
	
	$file = "php://input";
	
	//201311251739
	$isfromamazon = $_SERVER['HTTP_EXTRAPOSTDATA_ISFROMAMAZON'];
	
	if (  $isfromamazon == 'true' ) {						
		$client = S3Client::factory(array(
	    'key'    => $key,
	    'secret' => $secret
		));
		$panel = $_SERVER['HTTP_EXTRAPOSTDATA_PANEL'];
		if($panel){
			if( $panel != "movies" ){
				$duplicatefile = false ;
				try {
					$duplicatefile = $client->getObject(array(
				
							'Bucket'     => $bucket,
						    'Key'        => $save_path.$file_name
					));
				}catch (Exception $e) {
					
				}
				
				if( empty( $duplicatefile ) ){		
					try {
						$uploader = UploadBuilder::newInstance()
					    ->setClient($client)
					    ->setSource(fopen($file,'r+'))
					    ->setBucket($bucket)
					    ->setKey($save_path.$file_name)
					    ->setOption('Metadata', array('Foo' => 'Test'))
					    ->setOption('CacheControl', 'max-age=3600')
					    ->setOption('ACL','public-read')
					    ->build();
					    
					    $uploader->upload();
					
					} catch (Exception $e) {
						die('{"success":false,"error":'.$e->getmessage().'}');
					}
					
					die('{"success":true }');
				}else {
					die('{"success":false,"error":'.$file_name.' file is duplicate }');
				}
			}else if($panel== "movies" ){
				try {
						$uploader = UploadBuilder::newInstance()
					    ->setClient($client)
					    ->setSource(fopen($file,'r+'))
					    ->setBucket($bucket)
					    ->setKey($save_path.$file_name)
					    ->setOption('Metadata', array('Foo' => 'Test'))
					    ->setOption('CacheControl', 'max-age=3600')
					    ->setOption('ACL','public-read')
					    ->build();
					    
					    $uploader->upload();
					
					} catch (Exception $e) {
						die('{"success":false,"error":'.$e->getmessage().'}');
					}
					
						
					$file = file_get_contents('php://input');
				    file_put_contents( $save_path.$file_name , $file);
					
					die('{"success":true }');
			}
		}
	
	}
	
	function HandleError($message){
		die('{"success":false,"error":'.json_encode($message).'}');
	}

?>