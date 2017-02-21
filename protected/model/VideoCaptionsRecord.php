<?php
use Aws\S3\S3Client;
use Aws\Common\Enum\Size;
use Aws\Common\Exception\MultipartUploadException;
use Aws\S3\Model\MultipartUpload\UploadBuilder;
use Guzzle\Http\EntityBody;
class VideoCaptionsRecord extends VideoCaptionsAR
{


	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
	/**
	 * before saving the video Captions.
	 * create the captionFiles directory on the server if doesnot exists.
	 * and save the caption file under the content_id directory of the captions file.
	 * @see FBaseActiveRecord::save()
	 */
	public function save() {

		require 'config.php';
		SWPLogManager::log("Save record for video caption",null,TLogger::INFO,$this,"save","SWP");
		$baseUrl = FIniFileVideoCaptionFiles::BaseUrl();
		$captions = $this->captions;
		SWPLogManager::log("It should be able to save the captions of a corresponding lesson in to DB",array("captions"=>$captions),
		TLogger::DEBUG,$this,"save","SWP");
		if( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
				
			$destination = $baseUrl.$this->video_id;
			$destinationpath = $destination."/".$this->name;
			$client = S3Client::factory(array(
			    'key'    => $key,
			    'secret' => $secret
			));
				
			// Here we are checking for the existence of the file in server if not exist then only
			// copying the file to server.
				
			$this->captions = str_replace( 'https://s3.amazonaws.com/'.$bucket.'/','',$this->captions );
				
			if ( !( $client->doesObjectExist($bucket, $destinationpath)) ){
				$result = $client->copyObject(array(
				    'Bucket'     => $bucket,
				    'Key'        => $destinationpath,
					'CopySource' => urlencode($bucket.'/'. $this->captions),
			        'MetadataDirective' => 'COPY',
					'ACL'        => 'public-read'
					));
			}
			$this->captions = 'https://s3.amazonaws.com/'.$bucket.'/'.$destinationpath;
			SWPLogManager::log("The following record will save succesfully",array("captions_record"=>$this->captions),TLogger::DEBUG,$this,"save","SWP");
		} else {
			$baseUrl = FIniFileVideoCaptionFiles::BaseUrl();
			$captions = $this->captions;
			$destination = $baseUrl.$this->video_id;
			$destinationpath = $_SERVER[DOCUMENT_ROOT]."/".$destination;
			if( !file_exists( $destinationpath ) ) {
				mkdir( $destinationpath , 0777 ,true );
			}
			$destination = $destination ."/".$this->name;
			$destinationpath = $destinationpath ."/".$this->name;
			copy( $captions,$destinationpath );
			$this->captions =$destination;
			SWPLogManager::log("The following record will save succesfully",array("captions_record"=>$this->captions),TLogger::DEBUG,$this,"save","SWP");

		}


		parent::save();

	}
    
    /**
     * before deleting the captions records.
     * delete the caption file created in the captions folder for the current record.
     * if the same file is not linked with the another language
     * @see TActiveRecord::delete()
     */
    public function delete(){

    	SWPLogManager::log("It should be able to delete the video caption if is not associated with any other lesson",null,TLogger::INFO,$this,"delete","SWP");
    	require 'config.php';
    	$count = $this->count('captions =? ' , $this->captions  );

    	if( $count <= 1){

    		// If the caption file is not related to any other language of the same lesson
    		// then we are deleting the file from server.

    		if( Prado::getApplication()->Parameters['fileupload'] == "s3" ){
    			try {

    				$client = S3Client::factory(array(
				    'key'    => $key,
				    'secret' => $secret
    				));

    				$captionPath = explode($bucket, $this->captions );
    				$deletePath = substr($captionPath[1], 1);

    				$result = $client->deleteObject(array(
					'Bucket'     => $bucket,
				    'Key'        => $deletePath
    				));

    				SWPLogManager::log("The caption deleted succesfully",array("result"=>$result),TLogger::DEBUG,$this,"delete","SWP");
    			} catch (Exception $e) {

    				SWPLogManager::log("Some Exception happens while deleting the record",array("Exception"=>$e),TLogger::ERROR,$this,"delete","SWP");
    			}

    		} else {

    			unlink( $_SERVER[DOCUMENT_ROOT]."/".$this->captions );
    			VideoRecordMgr::removeRootDirectory(FIniFileVideoCaptionFiles::BaseUrl());
    			$path = $_SERVER[DOCUMENT_ROOT]."/".$this->captions;
    			SWPLogManager::log("caption files deleted from the local folder",array("path"=>$path),TLogger::DEBUG,$this,"delete","SWP");
    		}
    	}

    	parent::delete();


    }
    
}