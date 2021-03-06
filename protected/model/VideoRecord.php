<?php

/**
 * Auto generated by prado-cli.php on 2008-07-11 12:26:36.
 * Task/Issue      Author    			    UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 27659		   Arunkumar.muddada		201406050850    Modified Method : save() 
															While saving the record we need to capture the content creator name
															
															Modifed Method : getCreatorName() 
															method name is changed to : getContentCreator()
															Added code for saving the creator name.
 *
 */
Prado::using('Application.clientside.direct.VideoRecordMgr');
class VideoRecord extends VideoRecordBase {
    const PRICES_WITH_VAT=1;
    const RELPROD = 'uid IN (SELECT uid FROM videos_has_videos dd1 WHERE dd1.videos_id = :relid
                                 UNION
                                 SELECT videos_id as uid FROM videos_has_videos dd2 WHERE dd2.uid = :uid) ';

    private $_groupedVariants;
    private $_defaultVariants;
    private $_currentVariants;
    private $_current_price;
    private $_finalize;
    private $_updateAvalton;
    private $_creator;
    public $videos_id;
    private $_myrelatedvideos;
    private $_force;
    public static $RELATIONS = array
        (
     //   'creator' => array(self::BELONGS_TO, 'UserRecord'),
        'categories' => array(self::MANY_TO_MANY, 'ContainerCategoryRecord', 'videos_containers'),
        'questions' => array(self::HAS_MANY, 'QuizRecord', 'parent_id'),
        //'relatedvideos' => array(self::MANY_TO_MANY, 'VideoRecord', 'videos_has_videos.videos_id'),
        //'ads' => array(self::HAS_MANY, 'AdZoneRecord','videos_id','ORDER BY start'),
    );

    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

    /* public function getCatID()
      {
      return sprintf('%03d',$this->uid).'-'.FU::urlify($this->name);
      } */

 public function getRelatedVideos() {
        if ($this->_myrelatedvideos === null) {
            $cri = new TActiveRecordCriteria;
            $cri->Condition = self::RELPROD;
            $cri->Parameters[':uid'] = $this->uid;
            $cri->Parameters[':relid'] = $this->uid;
            $this->_myrelatedvideos = VideoRecord::finder()->findAll($cri);
        }
        return $this->_myrelatedvideos;
    }

 public function setNameLang($value, $culture) {
        $culture = strtolower($culture);
        $var = ($culture == 'cs') ? 'name' : 'name_' . $culture;
        if (property_exists($this, $var))
            $this->$var = $value;
        else
            $this->{'name_otherLang' . $culture} = $value;
    }

    public function getNameLang($culture) {
        $culture = strtolower($culture);
        $var = ($culture == 'cs') ? 'name' : 'name_' . $culture;
        if (property_exists($this, $var))
            return $this->$var;
        else
            return $this->{'name_otherLang' . $culture};
    }

    public function getIconsRecords() {
        $icons = explode('|', $this->icons);
        $iconRec = IconRecord::finder()->findAllByPks($icons);
        return  $iconRec;
    }

    public function getFirstImage() {
        $fi = parent::getFirstImage();
        if (!$fi){
            return Prado::getApplication()->Parameters['defaultNoImage'];
        }
        else {
        	return $fi;        	
        }
    }
    
     
   /**
     * 
     *  this method returns the json decoded value of the files column value
     */
        public function getFilesList()
        {
        	if ($this->files)
        	{
        		$files = json_decode($this->files);
        		return $files;
        	}
        	return array();
        }
    
   /**
    * get the data in the files column of the table and return
    * 
    */
    public function getFilesNN() {
    	return (!$this->files || $this->files == 'null') ? '[]' : $this->files;
    }

    /**
     * set the value passed from the front end to the column files.
     * before setting the value to the column if the data field in the 
     * value is empty current date is populated.
     * 
     * @param unknown_type $value
     */
    public function setFilesNN($value) {
    	$this->files = $value;
    	$rawFiles = $this->getFilesList();
    	
    	foreach ( $rawFiles as $rawFile ){

    		if( empty( $rawFile->Date ) ){
    			
    			$rawFile->Date = date("Y-m-d H:i:s",time());
    		}
    	}
    	
        $this->files = json_encode( $rawFiles );
    } 
    
	
        
        
        
        

 public function saveCategories() {
        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM videos_containers WHERE video_id = :prodid");
        $cmd->bindValue(':prodid', $this->content_id);
        $cmd->execute();
        foreach ($this->categories as $category) {
            $cmd = $conn->createCommand("INSERT IGNORE videos_containers (video_id, container_id) VALUES (:prodid, :catid)");
            $cmd->bindValue(':prodid', $this->content_id);
            $cmd->bindValue(':catid', $category->uid);
            $cmd->execute();
        }
    }

    public function saveContents() {
        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM videos_containers WHERE video_id = :prodid");
        $cmd->bindValue(':prodid', $this->uid);
        $cmd->execute();
        foreach ($this->categories as $category) {
            $cmd = $conn->createCommand("INSERT IGNORE videos_containers (video_id, container_id) VALUES (:prodid, :catid)");
            $cmd->bindValue(':prodid', $this->uid);
            $cmd->bindValue(':catid', $category->uid);
            $cmd->execute();
        }
    }


    public function getCategoriesList() {
        $list = array();
        foreach ($this->categories as $category) {
            $list[] = (integer) $category->uid;
        }
        $this->saveThumbs();
        return $list;
    }

    public function setCategoriesList($value) {
        $this->categories = array();
        $this->categories = ContainerCategoryRecord::finder()->findAllByPks($value);
    }
/**
     * Getter for property CoolUrl
     * cool url for product
     * @return string
     */
    public function getCoolUrlName() {
        if ($this->cool_url) {
        	return $this->cool_url;
        }            
        elseif (Prado::getApplication()->Parameters['translatable']) {
        	return FU::urlify($this->nameLangAct);
        } else {
        	return FU::urlify($this->name);
        }  
    }

    /**
     * Setter for property CoolUrl
     * cool url for product
     * @param $value string
     */
    public function setCoolUrlName($value) {
        $this->cool_url = $value;
    }

    protected function checkFinalized() {
        if ($this->is_finished) return !$this->getForce();
        if ($this->_finalize) {
            if (!$this->content_id) {
                throw new FJsonException ('Please save the course first.');
            }
            $this->is_finished = 1;
            $this->lockFiles();
        }
        return false;
    }
    
    protected function lockFiles() {
        $baseDir = Prado::getPathOfNamespace( FU::Ini('FilePanelMovies.BaseDir') );
        $baseUrl =  FU::Ini('FilePanelMovies.BaseUrl') ;
        $dir = Prado::getPathOfNamespace('Root.images.sh.*');
        
        foreach($this->getImagesList() as $f) {
            /*$p = pathinfo($f->uid);
            if (stripos($f->uid,'/'.$this->user_id.'/'))
                $path = $this->user_id.'/'.$p['basename'];
            else
                $path = $p['basename'];*/
            $path = str_ireplace($baseUrl,$baseDir,$f->uid);
            if (is_file($path)) touch($path.'.lock');
        }
        
    }
    
    public function getFilesize(){
        if ($this->type == 1) return 0;
        $baseDir = Prado::getPathOfNamespace( FU::Ini('FilePanelMovies.BaseDir') );
        $baseUrl =  FU::Ini('FilePanelMovies.BaseUrl') ;
        $baseDirUrl = FU::Ini('FilePanelMovies.BaseDirUrl'); 
        $dir = Prado::getPathOfNamespace('Root.images.sh.*');
        $size = 0;
        foreach($this->getImagesList() as $f) {
            
			$path = str_ireplace($baseDirUrl,'',$f->uid);  
            $path = $dir.'/'.$path;  
            $path = str_replace('\\','/', $path);
            $size = max($size, round(filesize($path)/1024));
        }
        return $size;
        
    }
    
public function retrieve_remote_file_size($url){
	    $ch = curl_init($url);
	
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	    curl_setopt($ch, CURLOPT_HEADER, TRUE);
	    curl_setopt($ch, CURLOPT_NOBODY, TRUE);
	
	    $data = curl_exec($ch);
	    $size = curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
	
	    curl_close($ch);
	    return $size;
    }

    public function save() {
        if ($this->checkFinalized()) {
        	return;
        }
        
        $resultValue = $this->setPredefinedTask( $this->predefinedtask );
        
        if( $resultValue != true ){
        	$this->predefinedtask = 0;
        }
        
     $resultValue = $this->setChapterPlayBackPause( $this->chapterplaybackpause );
        if( $resultValue != true ){
        	
        	$this->chapterplaybackpause = 0;
        }
        
        $this->clearThumbs();
        $this->user_id  = (!$this->user_id) ? Prado::getApplication()->getUser()->username : $this->user_id;
        //201406050850
        //While saving the record we need to capture the content creator name
        $this->_creator =  UserRecord::finder()->findByUsername($this->user_id);
        $this->creatorname = $this->_creator->Name;
        $this->content_id = ($this->content_id) ? $this->content_id : null;
        /*if ($this->content_id == null)
            $this->saveToAvalton();*/

        $this->saveToAvalton();
        
        $user = Prado::getApplication()->getUser();
        if(empty($this->company_id)){
	        $this->company_id = $user->getCompanyID();
        }

        if( $this->predefinedtask == 0 ){
        	if($this->type == 0){
        		$lessonSettingRecords = ProductLessonSettingRecord::finder()->findAll('lesson_id = ? AND setting_name = "SUB_SEQUENT_LOCK"',
											array($this->content_id));
				if(count($lessonSettingRecords) > 0){							
					for($i = 0 ; $i < count($lessonSettingRecords) ; $i++){
						$lessonSettingRec = $lessonSettingRecords[$i];
						$lessonSettingRec->setting_value = 0;
						$lessonSettingRec->save();
					}
				}
        	}
        }
        
        parent::save();
        $this->generateSmil();
        //if ($this->getUpdateCategories())
        //$this->saveZones();
        $this->saveRelation('relatedvideos');
    }

    public function setFinalized($value) {
        $this->_finalize =  $value;
    }

    public function getFinalized() {
        return $this->is_finished;
    }
/**
     * TEMPORARY
     */
    protected function getUsername() {
        $user = Prado::getApplication()->getUser();
        return  ($user->username == 'super')  ? '15' : $user->username;
    }

    public function getContentCreator() {
        if (!$this->_creator) {
            $this->_creator = UserRecord::finder()->findByUsername($this->user_id);
            if (!$this->_creator) {
            	return ""; 
            }
        }
        //201406050850
        //Code for saving the creator name in the video record
        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("UPDATE videos SET creatorname = '".$this->_creator->Name."' WHERE content_id = :prodid");
        $cmd->bindValue(':prodid', $this->content_id);
        $cmd->execute();
        
        return $this->_creator->Name;
        
    }

    protected function saveToAvalton($force=false,$delete=false) {
        if ($force || $this->getUpdateAvalton()) {

            $rows = array(
                            'contenttype' => str_replace(array('grouprecord','record'),'',strtolower(get_class($this))),
                            'action' => ($this->is_finished) ? 'finalize' : 'edit',
                            'data'=>array( 'id'=> (int) $this->content_id,
                                           'name'=>$this->name,
                                           'desc'=>$this->description,
                                           'filesize'=>(int) $this->getFilesize(),
                                  
                                        )
                            
            );
            
            if ($delete && $this->content_id) {
                $rows['action'] = 'delete';
                $rows['data']['creator_id'] = $this->getUsername();
                $res = VideoRecordMgr::apiAvalton('content_creator.php',array('rows' => json_encode($rows)));
            }
            elseif (!$this->content_id) {
                $rows['action'] = 'add';
                $rows['data']['creator_id'] = $this->getUsername();
                //unset($rows['data']['id']);
                $res = VideoRecordMgr::apiAvalton('content_creator.php',array('rows' => json_encode($rows)));
               // echo "[".json_encode($rows).",".json_encode($res)."]";die();
                $this->content_id = $res['data']['id'];
                if (!$this->content_id) {
                	throw new FJsonException ('Cannot get content_id '."[".json_encode($rows).",".json_encode($res)."]");
                }
                $this->updateByPk(array('content_id'=>$this->content_id),$this->uid);
            }
            else {
                $res = VideoRecordMgr::apiAvalton('content_creator.php',array('rows' => json_encode($rows)));
            }

            if (stripos($res['status'],'error')!==false) {//&& Prado::getApplication()->getMode() == TApplication::STATE_DEBUG)
                throw new FJsonException('api Avalton error: '."[".json_encode($rows).",".json_encode($res)."]");
            }
        }
    }
    
public function getDisplayCompanions() {
        return false;
    }

    public function getCompanionId() {
        return 'my-companion';
    }

    public function getCompanionWidth() {
        return 240;
    }

    public function getCompanionHeight() {
        return 240;
    }

    public function getAdZones() {
        return $this->ads;
    }

    public function getEncodedPath(){
        
        $file = str_ireplace('http://fast.freshsystems.cz/tvexpo/videa/', '', $this->getFirstImage());
        return preg_replace('/\..+$/','',$file);
    }

    public function getFirstVideo($provider='rtmp',$bitrate='800_640x360') {
        return "http://web28.streamhoster.com/jnovak/".$this->user_id.'/V'.$this->content_id.'.smil.xml';
//        $vid = basename($this->getFirstImage(),'.mpg');
        //return "http://web28.streamhoster.com/jnovak/{$this->cool_url}";
        //return $this->getFirstImage();
/*
        $file = str_ireplace('http://fast.freshsystems.cz/tvexpo/videa/', '', $this->getFirstImage());
        
        $dirname = preg_replace('/\..+$/','',$file);
        $basename = basename(preg_replace('/\.[^.]+$/','',$file))."_2438_{$bitrate}";

        if ($provider == 'rtmp')
            $baseUrl = 'mp4:tvexpo/encoded/' . $dirname . "/" . $basename; //forarch2010_abb-vypinace-001-cz.mpg_2438_800_640x360
        else
            $baseUrl = 'http://fast.freshsystems.cz/tvexpo/encoded/'. $basename;  //forarch2010_abb-vypinace-001-cz.mpg_2438_800_640x360.mp4';// . $dirname . "/" . $basename.$bitrate.'.mp4';

//$baseUrl = 'mp4:vod/freshconcept.freshconceptsro/test/forarch2010_abb-vypinace-001-cz.mpg_2438_800_640x360';//
//$baseUrl = 'http://pseudo01.hddn.com/vod/freshconcept.freshconceptsro/test/forarch2010_abb-vypinace-001-cz.mpg_2438_800_640x360.mp4'; //
        return $baseUrl;
        //return 'mpg:tvexpo/videa/'.$basename; */
    }


    public function getThumbs() {

        $dir = 'ftp://freshconcept_tvexpo:tvxp2010@fast.freshsystems.cz/encoded/'.$this->getEncodedPath();
        $ddir = 'http://fast.freshsystems.cz/tvexpo/encoded/'.$this->getEncodedPath();

        $files = scandir($dir);

        $ret = array();
        foreach ($files as $file) {

            if (stripos($file, '.jpg') > 0) {
                $ret[] = array('text' => $file, 'uid' => $ddir.'/'.$file);
            }

        }
        rsort($ret);
      //  echo TVarDumper::dump($files);
        return $ret;

    }

    public function saveThumbs() {

        $images = $this->getImagesRecords();
        foreach ($images as $img) {
            if (stripos($img->uid,'jpg')>0)
                    return;
        }

        $thumbs = array();//$this->getThumbs();
        if (count($images)) {
            //array_unshift($thumbs,$images[0]);
            $this->imagesNN = json_encode($images);
            parent::save();
        }

    }

    public function clearThumbs() {
 
        $images = $this->getImagesList();
        foreach ($images as $img) {
            if (stripos($img->uid,'jpg')===false)
                    $ret[] = $img;
        }
        $this->imagesNN = json_encode($ret);
    }

    public function getImagesNN() {
    	
    	$images =  (!$this->images || $this->images == 'null') ? '[]' : $this->images;
        return $images;
    	
    }

    public function setImagesNN($value) {
        $this->images = $value;
    }
    
     /**
     * Setter for property predefinedtask
     * @param $value string
     */
    public function setPredefinedTask( $value ) {
    	
    	if ( $value == 'on' ){

    		$this->predefinedtask = true;

    	} else {

    		$this->predefinedtask = false;
    	}
		return $this->predefinedtask;
    }
    
/**
     * Setter for property predefinedtask
     * @param $value string
     */
    public function setChapterPlayBackPause( $value ) {
    	
    	if ( $value == 'on' ){

    		$this->chapterplaybackpause = true;

    	} else {

    		$this->chapterplaybackpause = false;
    	}
		return $this->chapterplaybackpause;
    }
    
    
    public function getUpdateAvalton() {
        return $this->_updateAvalton;
    }

    public function setUpdateAvalton($value) {
        $this->_updateAvalton = $value;
    }
    
    public function setZoneIDs($value) {
        if (is_array($value))
            $this->zones  = implode(',',$value);
        else
            $this->zones = $value;
            //throw new JsonExeption('ZoneIDs has to be array');
    }
    
    public function getZoneIDs() {
        return explode(',',$this->zones);
    }
    
    public function saveZones() {
        
        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM videos_zones WHERE video_id = :prodid");
        $cmd->bindValue(':prodid', $this->uid);
        $cmd->execute();
        foreach ($this->ZoneIDs as $zone) {
            if (is_numeric($zone)) {
                $cmd = $conn->createCommand("INSERT IGNORE videos_zones (video_id, zone_id) VALUES (:prodid, :zoneid)");
                $cmd->bindValue(':prodid', $this->uid);
                $cmd->bindValue(':zoneid', $zone);
                $cmd->execute();
            }
        }
    }
    
    public function deleteNotFinished($data) {
        
        foreach($data as $key) {
            
            $rec = $this->find('content_id = ?', $key['content_id']);            
            if (!$rec)
                throw new FJsonException('Error no. 1');
            if ($rec->is_finished && !$key['force'])
                throw new FJsonException('Error no. 2');
            /* #29023 
             * Here finding the delete lesson is used in a quiz's question 
             * or for that matter in other course content used this lesson.
             * If any map is exist for this delete lesson we are not allowing user to delete the content.
             */
        	if( $rec->type == 0 ){
            	 $courseContent = CourseContentRecord::finder()->findAll('video_id = ?',$key['content_id']);
            	 $quizVideos = 	QuizRecord::finder()->findAll('category_id = ?',$rec->uid);
            	  if ( count($quizVideos) > 0 || count($courseContent) > 0  )
         			throw new FJsonException('Cannot delete content as some dependency is there');
            }
            $rec->saveToAvalton(true,true);
            try{
            
            	 $rec->delete();
            }  catch (Exception $e ){
            	throw new FJsonException('Cannot delete Lesson as some dependency is there');
            }          
        }
    }

  public function duplicateLessonRecord( $data ) {

        //
        // This method generate unique content id
        //
        
        //$this->saveToAvalton(true);
        
        //
        // Inserting the duplicate data in to videos table based on the content id  
        //
        
        $newlesson = $this->insertLessonRecord( $data );

        //
        // Inserting the duplicate data in to cuepoints table based on the content id ( For chapters and videos )
        //
        
        $this->insertChaptersIntoCuepoints( $data ,$newlesson);
        
        //
        //  inserts captions associated with lesson into video_captions table.
        //
        
        $this->insertCaptionsAssociatedWithLesson( $data ,$newlesson);
        
        //
        //  Inserts associated tags information for the lesson into table video_containers
        //
        
        $this->insertVideoContainers( $data , $newlesson  );
        
        $this->generateSmil();
        $this->saveRelation('relatedvideos');
        return array("fromDuplicate" => true, "contentId"=>$newlesson->content_id);
    }

    /**
    *
    *   Inserts lesson record into videos table by getting data based on content id that is to be duplicated.
    *
    */
    
    public function insertLessonRecord( $data ) {
        
        // Getting the record by using content_id
        
        $lessonRecord = VideoRecord::find('content_id = ?', $data['content_id']);  

        if( $lessonRecord ) {
            $this->images  = $lessonRecord->images;
            $this->user_id =  $lessonRecord->user_id;
                
            $newLessonRec = new LessonRecord();
            
            $newLessonRec->name                 =       $lessonRecord->name." duplicate";
            $newLessonRec->parent_id            =       $lessonRecord->parent_id;
            $newLessonRec->user_id              =       $lessonRecord->user_id;
            $newLessonRec->is_enabled           =       $lessonRecord->is_enabled;
            $newLessonRec->short_description    =       $lessonRecord->short_description;
            $newLessonRec->description          =       $lessonRecord->description;
            $newLessonRec->keywords             =       $lessonRecord->keywords;
            $newLessonRec->date_created         =       $lessonRecord->date_created;
            $newLessonRec->date_updated         =       $lessonRecord->date_updated;
            $newLessonRec->is_featured          =       $lessonRecord->is_featured;
            $newLessonRec->type                 =       $lessonRecord->type;
            $newLessonRec->hits                 =       $lessonRecord->hits;
            $newLessonRec->ordering             =       $lessonRecord->ordering;
            $newLessonRec->images               =       $lessonRecord->images;
            $newLessonRec->is_finished          =       0;
            $newLessonRec->icons                =       $lessonRecord->icons;
            $newLessonRec->cool_url             =       $lessonRecord->cool_url;
            //$newLessonRec->content_id             =       $this->content_id;
            $newLessonRec->zones                =       $lessonRecord->zones;
            $newLessonRec->files                =       $lessonRecord->files;
            $newLessonRec->instructions         =       $lessonRecord->instructions;
            $newLessonRec->predefinedtask       =  1;//     $lessonRecord->predefinedtask;
            $newLessonRec->company_id       =       $lessonRecord->company_id;
             $newLessonRec->chapterplaybackpause = 1;//$lessonRecord->chapterplaybackpause;
        	$newLessonRec->setUpdateAvalton(true); 
        	$newLessonRec->save(); 
            $this->predefinedtask = $lessonRecord->predefinedtask;
             $this->chapterplaybackpause = $lessonRecord->predefinedtask;
            return $newLessonRec;
            
        }else {
            
            return false;
        }
    }
    
    /**
    *   Inserting the duplicate data in to cuepoints table based on the content id ( For chapters and videos )
    *
    */
    
    public function insertChaptersIntoCuepoints( $data ,$newlesson ) {
        
        $chapters = CuepointRecord::finder()->findAll('videos_id = ?',$data['content_id']);
        
        foreach( $chapters as $chapter ) {
            
            $newChapterRec = new CuepointRecord();
            
            $newChapterRec->videos_id = $newlesson->content_id;
            $newChapterRec->name = $chapter->name;
            $newChapterRec->description = $chapter->description;
            $newChapterRec->start = $chapter->start;
            $newChapterRec->stop = $chapter->stop;
            $newChapterRec->is_enabled = $chapter->is_enabled;
            $newChapterRec->transcript = $chapter->transcript;
            $newChapterRec->skippable = $chapter->skippable;
            $newChapterRec->save();
        }
    }
    
    /**
    *   inserts captions associated with lesson into video_captions table.
    *   
    */
    
    public function insertCaptionsAssociatedWithLesson( $data ,$newlesson){
        
        $availableCaptions = VideoCaptionsRecord::finder()->findAll( 'video_id = ?',$data['content_id'] );
        
        foreach( $availableCaptions as $availableCaption ) {
            
            $videoCaptions = new VideoCaptionsRecord();
            
            $videoCaptions->video_id        =       $newlesson->content_id;
            $videoCaptions->captions        =       $availableCaption->captions;
            $videoCaptions->language_id     =       $availableCaption->language_id;
            $videoCaptions->name            =       $availableCaption->name;
            $videoCaptions->description     =       $availableCaption->description;
            $videoCaptions->save();
        }
    }
	/**
	*
	*	Inserts associated tags information for the lesson into table video_containers
	*
	*/
	
	public function insertVideoContainers( $data , $newlesson){
		
		$conn = $this->getDbConnection();
		$conn->setActive(true);
		
		// Get the contained id from videos_containers table

		 $cmd = $conn->createCommand("SELECT `container_id`
				  FROM `videos_containers`
				 WHERE `video_id` = ".$data['content_id']."");

		$dataReader=$cmd->query();          // execute a query SQL
		$rows=$dataReader->readAll();

		// Inserting the duplicate data in to videos_containers table ( For tags )

		for( $i=0;$i<count($rows);$i++ ){
			
			$cmd = $conn->createCommand("SET FOREIGN_KEY_CHECKS = 0;");

			$cmd->execute();

			$cmd = $conn->createCommand("INSERT INTO `videos_containers` (`video_id`,`container_id`) VALUES ('".$newlesson->content_id."','".$rows[$i]['container_id']."')");

			$cmd->execute();	
		}
	}
    /**
     * Populates a new record with the query result.
     * This is a wrapper of {@link createRecord}.
     * @param array name value pair of record data
     * @return TActiveRecord object record, null if data is empty.
     */
    protected function xxxpopulateObject($data)
    {
        $class = get_class($this);
        if ($class == 'VideoRecord') {        
            if ($this->type == 0)
                $class =  'LessonRecord';
            elseif ($this->type == 1)
                $class =  'QuizGroupRecord';
        }           
        return self::createRecord($class, $data);
    }
    
    public function generateSmil($verbose=false) {
        if ($this->type == 1) return;
        
        $files = $this->getImagesList();
        
        $xml =
'<smil>
  <head>
    <meta base="rtmp://fss28.streamhoster.com/jnovak" />
  </head>
  <body>
    <switch>
        %s
    </switch>
  </body>
</smil>';
        $vids =  '<video src="%s" system-bitrate="%s" width="%s" />'."\n";
        $v = '';
        $baseDir = Prado::getPathOfNamespace('Root.images.sh.*'); //Prado::getPathOfNamespace( FU::Ini('FilePanelMovies.BaseDir') );
        $baseUrl =  'http://web28.streamhoster.com/jnovak/';//FU::Ini('FilePanelMovies.BaseUrl') ;
        $dir = Prado::getPathOfNamespace('Root.images.sh.*');
        $paths = array();
        foreach($files as $f) {
            $p = pathinfo($f->uid);
            $br = (int) preg_replace('/^.*([0-9]{2-4})kpbs.+$/','\1',$p['basename']);
            if (preg_match('/([0-9]{3,})kbps/',$p['basename'],$m))
                $br = $m[1];
            else
                $br = 500;

            if (preg_match('/([0-9]{3,})x[0-9]{3,}/',$p['basename'],$m))
                $res = $m[1];
            else
                $res = 1024;

            $path = ltrim(str_ireplace($baseUrl,'',$f->uid),'/');
             $path = ltrim(str_ireplace('images/sh','',$path),'/');

            /*if (stripos($f->uid,'/'.$this->user_id.'/'))
                $path = str_ireplace($dir,'',$p['dirname'].'/').$p['basename'];
            else
                $path = $p['basename'];*/
            $v .= sprintf($vids,$p['extension'].':'.$path,$br,$res);
            if ($verbose) {
                $paths[] = $p['extension'].':'.$path;
            }
        }
        if (!is_dir($dir)) mkdir($dir);
        $xml = sprintf($xml,$v);
		
		if( ! is_dir($dir.DIRECTORY_SEPARATOR.$this->user_id) ) {
				
			mkdir( $dir.DIRECTORY_SEPARATOR.$this->user_id );
		}
		
        $returnValue = file_put_contents($dir.DIRECTORY_SEPARATOR.$this->user_id.DIRECTORY_SEPARATOR.'V'.$this->content_id.'.smil.xml',$xml);

		$this->cool_url = $dir.DIRECTORY_SEPARATOR.$this->user_id.DIRECTORY_SEPARATOR.'V'.$this->content_id.'.smil.xml';
		
        if ($verbose){
            return $paths;
        }
    }
    
    protected function getForce() {
        return $this->_force;
    }
    protected function setForce($value) { $this->_force = (bool) $value; }
    
    public function updatePrices($data) {
        
        extract($data);
        $zones = (is_array($zoneids)) ? $zoneids : implode(',',$zoneids);
        $conn = $this->getDbConnection();
        $conn->setActive(true);
        $cmd = $conn->createCommand("DELETE FROM videos_zones WHERE video_id = :prodid");
        $cmd->bindValue(':prodid', $content_id);
        $cmd->execute();
        foreach ($zones as $zone) {
            if (is_numeric($zone)) {
                $cmd = $conn->createCommand("INSERT IGNORE videos_zones (video_id, zone_id) VALUES (:prodid, :zoneid)");
                $cmd->bindValue(':prodid', $content_id);
                $cmd->bindValue(':zoneid', $zone);
                $cmd->execute();
            }
        }
        
        
    }
	
	/**
	*
	*	Returns newly generated content id after calling saveToAvalton method
	*
	*/
	
    public function getContentID(){
    
		$this->saveToAvalton(true);
		return $this->content_id;
    }
    /**
     * Here getting the Login user's username
     */
	public function getLoginUser() {
		
		$user = Prado::getApplication()->getUser();
		return $user->username; 
    }
}

