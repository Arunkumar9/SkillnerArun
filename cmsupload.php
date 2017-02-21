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
require 'amazon/aws-autoloader.php';
require 'config.php';
use Aws\S3\S3Client;

$save_path = $_SERVER['DOCUMENT_ROOT'].'/awesomeuploader/';
$valid_chars_regex = '.A-Z0-9_ !@#$%^&()+={}\[\]\',~`-';	// Characters allowed in the file name (in a Regular Expression format)
//$extension_whitelist = array('csv', 'gif', 'png','tif');	// Allowed file extensions
$MAX_FILENAME_LENGTH = 260;
//no validation around filesize
//$max_file_size_in_bytes = 2147483647; // 2GB in bytes
$upload_name = 'Filedata';
	
/*
This is an upload script for SWFUpload that attempts to properly handle uploaded files
in a secure way.

Notes:
	
	SWFUpload doesn't send a MIME-TYPE. In my opinion this is ok since MIME-TYPE is no better than
	 file extension and is probably worse because it can vary from OS to OS and browser to browser (for the same file).
	 The best thing to do is content sniff the file but this can be resource intensive, is difficult, and can still be fooled or inaccurate.
	 Accepting uploads can never be 100% secure.
	 
	You can't guarantee that SWFUpload is really the source of the upload.  A malicious user
	 will probably be uploading from a tool that sends invalid or false metadata about the file.
	 The script should properly handle this.
	 
	The script should not over-write existing files.
	
	The script should strip away invalid characters from the file name or reject the file.
	
	The script should not allow files to be saved that could then be executed on the webserver (such as .php files).
	 To keep things simple we will use an extension whitelist for allowed file extensions.  Which files should be allowed
	 depends on your server configuration. The extension white-list is _not_ tied your SWFUpload file_types setting
	
	For better security uploaded files should be stored outside the webserver's document root.  Downloaded files
	 should be accessed via a download script that proxies from the file system to the webserver.  This prevents
	 users from executing malicious uploaded files.  It also gives the developer control over the outgoing mime-type,
	 access restrictions, etc.  This, however, is outside the scope of this script.
	
	SWFUpload sends each file as a separate POST rather than several files in a single post. This is a better
	 method in my opinions since it better handles file size limits, e.g., if post_max_size is 100 MB and I post two 60 MB files then
	 the post would fail (2x60MB = 120MB). In SWFupload each 60 MB is posted as separate post and we stay within the limits. This
	 also simplifies the upload script since we only have to handle a single file.
	
	The script should properly handle situations where the post was too large or the posted file is larger than
	 our defined max.  These values are not tied to your SWFUpload file_size_limit setting.
	
*/

//
//	The path that was prepared from UI is initialized to $save_path. Sothat path can be generic.
//
$save_path = $_POST['PATH'];

$isfromamazon = $_POST['isfromamazon'];

$save_path = str_replace("\n", '', $save_path);

if( !file_exists( $save_path ) ){
	
	$bool = mkdir( $save_path , 0777 , true );
}
// Check post_max_size (http://us3.php.net/manual/en/features.file-upload.php#73762)
	$POST_MAX_SIZE = ini_get('post_max_size');
	$unit = strtoupper(substr($POST_MAX_SIZE, -1));
	$multiplier = ($unit == 'M' ? 1048576 : ($unit == 'K' ? 1024 : ($unit == 'G' ? 1073741824 : 1)));

	if ((int)$_SERVER['CONTENT_LENGTH'] > $multiplier*(int)$POST_MAX_SIZE && $POST_MAX_SIZE) {
		//header("HTTP/1.1 500 Internal Server Error"); // This will trigger an uploadError event in SWFUpload
		//echo "POST exceeded maximum allowed size.";
		HandleError('POST exceeded maximum allowed size.');
	}

// Other variables	
	$file_name = '';
	$file_extension = '';
	$uploadErrors = array(
        0=>'There is no error, the file uploaded with success',
        1=>'The uploaded file exceeds the upload_max_filesize directive in php.ini',
        2=>'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
        3=>'The uploaded file was only partially uploaded',
        4=>'No file was uploaded',
        6=>'Missing a temporary folder'
	);

// Validate the upload
	if (!isset($_FILES[$upload_name])) {
		HandleError('No upload found in \$_FILES for ' . $upload_name);
	} else if (isset($_FILES[$upload_name]["error"]) && $_FILES[$upload_name]["error"] != 0) {
		HandleError($uploadErrors[$_FILES[$upload_name]["error"]]);
	} else if (!isset($_FILES[$upload_name]["tmp_name"]) || !@is_uploaded_file($_FILES[$upload_name]["tmp_name"])) {
		HandleError('Upload failed is_uploaded_file test.');
	} else if (!isset($_FILES[$upload_name]['name'])) {
		HandleError('File has no name.');
	}

// Validate the file size (Warning: the largest files supported by this code is 2GB)
//	$file_size = @filesize($_FILES[$upload_name]["tmp_name"]);
//	if (!$file_size || $file_size > $max_file_size_in_bytes) {
//		HandleError('File exceeds the maximum allowed size');
//	}
	
//	if ($file_size <= 0) {
	//	HandleError('File size outside allowed lower bound');
	//}

// Validate file name (for our purposes we'll just remove invalid characters)
	$file_name = preg_replace('/[^'.$valid_chars_regex.']|\.+$/i', "", basename($_FILES[$upload_name]['name']));
	if (strlen($file_name) == 0 || strlen($file_name) > $MAX_FILENAME_LENGTH) {
		HandleError('Invalid file name');
	}
	
// Validate that we won't over-write an existing file
	if ( file_exists($save_path.$file_name) ) {
		
		HandleError('A file with this name already exists, this file is duplicate.');
	}
	
 	if (  $isfromamazon == 'true' ){
	 	
	 	$client = S3Client::factory(array(
	    'key'    => $key, 
	    'secret' => $secret,
		));
		if( $_POST['panel'] != "movies" ){
			
			try {
				$duplicatefile = $client->getObject(array(
				
						'Bucket'     => $bucket,
					    'Key'        => $save_path.$file_name
					));
			}catch (Exception $e) {}
			
			if( empty( $duplicatefile ) ){
				
				$result = $client->putObject(array(
				    'Bucket'     => $bucket,
				    'Key'        => $save_path.$file_name,
				    'Body'       => fopen($_FILES[$upload_name]["tmp_name"],'r+'),
					'ACL'        => 'public-read'
				));
				
				die('{"success":true, "objectUrl" : "'.$result["ObjectURL"].'"}' );
					
			}else{
			
				die('{"success":false, "error" :'.$file_name.' file is duplicate. }');
			}
			
		}else if( $_POST['panel'] == "movies" ){
		    //As when cancel request without complete upload it is trying to delete but file is not available 
		    //as after amzon upload only we are moving this file to server location.
		    //Rather than that we are first moving the file to server , then we are uplaoding to amzon
		    //Issue no : 28255
			//$uploadFilePath = $_SERVER['DOCUMENT_ROOT'].'/'.$save_path.$file_name;

            if ( !@copy($_FILES[$upload_name]["tmp_name"], $save_path.$file_name) ) {
                      HandleError("File could not be saved");
            }else {
                    $result = $client->putObject(array(
                            'Bucket'     => $bucket,
                            'Key'        => $save_path.$file_name,
                            'Body'       => fopen($_FILES[$upload_name]["tmp_name"],'r+'),
                            'ACL'        => 'public-read'
                            ));
            }
			
			die('{"success":true, "objectUrl" : "'.$result["ObjectURL"].'"}' );
			
		}
	}

/* Handles the error output. This error message will be sent to the uploadSuccess event handler.  The event handler
will have to check for any error messages and react as needed. */
function HandleError($message) {
	echo $message;
	die('{success:false,error:'.json_encode($message).'}');
}
?>
