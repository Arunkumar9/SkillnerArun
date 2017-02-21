<?php
/* 
 * files and directories abstracted in ActiveRecord
 */

class FileRecord extends TApplicationComponent  {

    const PANEL = 'Resources';
    const ICON_PATH = 'FreshSystem/lib/desktop/resources/images/LinspireClear/16x16/mimetypes/';

    protected static $_instance;
    protected $BaseDir;
    protected $BaseUrl;
    protected $notShow;
    protected $pattern;
    protected $showDir;


    public $uid;
    public $name;
    public $size;
    public $type;
    public $permissions;
    public $ctime;
    public $mtime;
    public $owner;
    public $group;
    public $relative_path;
    public $full_path;
    public $web_path;
    public $extension;


    public function __construct($data=array())
    {
        $configClass = 'FilePanel'.$this->getConstant('PANEL');
	$this->BaseDir = Prado::getPathOfNamespace( FU::Ini($configClass.'.BaseDir').'.*' );
	$this->BaseUrl = FU::Ini($configClass.'.BaseUrl');
        $this->notShow = FU::Ini($configClass.'.notShow');
        $this->pattern = FU::Ini($configClass.'.pattern');
        $this->showDir = FU::Ini($configClass.'.showDir');

    }

    public function findAll($cond='')
    {
        $dir = ($cond instanceof TActiveRecordCriteria) ? preg_replace('|^\( +\(([^)]*)\) +\)$|','\1',trim($cond->getCondition())) : $cond;
        return $this->getFiles($dir);
    }

    public function findByPk($path)
    {
        return $this->getFiles($path);
    }

    public function count($cond='')
    {
        $files = $this->findAll($cond);
        return is_array($files) ? count($files) : 0;
    }

    public function getFiles($dir)
    {
            
            $dir = str_replace('root/',$this->BaseDir.'/',$dir);
		if ($dir == 'root' || !$dir) $dir = $this->BaseDir;
//            $directory = (is_dir($dir)) ? $dir : dirname($dir);
            $directory = $dir;
            //$dir = opendir($directory);
            $i = 0;

            $files = FU::safeGlob($directory.'/'.$this->pattern,GLOB_BRACE);
            if ($this->showDir)
                $files = array_unique(array_merge($files,FU::safeGlob($directory.'/*',GLOB_ONLYDIR)));

            $results = array();
            foreach ($files as $fullpath)
            {
            // Get a list of all the files in the directory
            //while ($temp = readdir($dir)) {
                    if (stristr($fullpath, '_fm_')) continue; // If this is a temp file, skip it.
                    //if ($imagesOnly && !preg_match('/\.(jpeg|jpg|gif|png)$/im', $temp)) continue; // If it isnt an image, skip it
                    if (preg_match('/'.$this->notShow.'/', $fullpath)) continue; // If it isnt an image, skip it
                    if (!$this->showDir && is_dir($fullpath)) continue; // If its a directory skip it

		    $class = get_class($this);
                    $fr = new $class;
                    $fr->uid = $fullpath;
                    $fr->loadRecord();
                    /*
                    $fr->name = $temp;
                    $fr->size = filesize($directory . '/' . $temp);
                    $fr->type = filetype($directory . '/' . $temp);
                    $fr->permissions = FU::formatPermissions(fileperms($directory . '/' . $temp));
                    $fr->ctime = filectime($directory . '/' . $temp);
                    $fr->mtime = filemtime($directory . '/' . $temp);
                    $fr->owner = fileowner($directory . '/' . $temp);
                    $fr->group = filegroup($directory . '/' . $temp);
                    $fr->relative_path = str_replace(self::$BaseDir, '', $directory) . '/' . $temp;
                    $fr->full_path = $directory . '/' . $temp;
                    $fr->web_path = self::$BaseUrl . str_replace(self::$BaseDir, '', $directory) . '/' . $temp;
                    $fr->uid = $fr->full_path; */
                    $results[$i] = $fr;
                    $i++;
            }
//var_dump($results);
            return $results;

    }

    protected function loadRecord()
    {
                    $pathinfo = pathinfo($this->uid);
                    $temp = $pathinfo['basename'];
                    $directory = $pathinfo['dirname'];
                    $this->name = $temp;
                    $this->size = filesize($directory . '/' . $temp);
                    $this->type = filetype($directory . '/' . $temp);
                    $this->permissions = FU::formatPermissions(fileperms($directory . '/' . $temp));
                    $this->ctime = filectime($directory . '/' . $temp);
                    $this->mtime = filemtime($directory . '/' . $temp);
                    $this->owner = fileowner($directory . '/' . $temp);
                    $this->group = filegroup($directory . '/' . $temp);
                    $this->relative_path = ltrim(str_replace($this->BaseDir, '', $directory) . '/' . $temp,'/');
                    $this->full_path = $this->uid;
                    $this->web_path = $this->BaseUrl . '/'.$this->relative_path;//str_replace($this->BaseDir, '', $directory) . '/' . $temp;
                    $this->extension= $this->convertExtension($pathinfo['extension']);
    }
    
    public static function finder($className=__CLASS__)
    {
		static $instance;

		if (!$instance)
			$instance = new $className;
        return $instance;
    }

    public function getFormatedSize() {
        
        static $bytes;

 		if (!$bytes)
			$bytes = Prado::localize('bytes');
        
        if ($this->size < 1000)
                return number_format ($this->size).'&nbsp;'.$bytes;
        
        if ($this->size < 1000000)
                return number_format ($this->size/1000,1).'&nbsp;KB';
        
        if ($this->size < 1000000*1000)
                return number_format ($this->size/1000000,1).'&nbsp;MB';

        return number_format ($this->size/1000000000,1).'&nbsp;GB';
        
    }
    
    public function getIconCls() {
        return 'icon-'.$this->extension;
    }

    public function getIconUrl($size=null) {
	
        $path = ($size) ? str_replace('16x16',$size,self::ICON_PATH) : self::ICON_PATH;
        return $this->getRequest()->getBaseUrl().'/'.$path.$this->extension.'.png';
    }

    public function convertExtension($ext)
    {
        $ext = strtolower($ext);
        $icon = self::ICON_PATH.$ext.'.png';
        if (is_file($icon))
            return $ext;

        $ext1 = str_replace(
               array('flv','jpg','png','gif'),
               array('video','image','image','image'), $ext);

        if ($ext == $ext1 || !$ext)
            return 'document2';
        else
            return $ext1;
    }
    
    protected function getConstant($name)
    {
        return constant(get_class($this).'::'.$name);
    }
}

