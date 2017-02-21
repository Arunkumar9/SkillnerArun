<?php
/* 
 * files and directories abstracted in ActiveRecord
 */

class RFileRecord extends FileRecord  {

    const PANEL = 'Downloads';
    protected $recusive=true;

    public function __construct($data=array())
    {
        $configClass = 'FilePanel'.$this->getConstant('PANEL');
	$this->BaseDir = $data['BaseDir'];
	$this->BaseUrl = ($data['BaseUrl']) ? $data['BaseUrl'] : $this->getRequest()->getBaseUrl();
        $this->notShow = ($data['notShow']) ? $data['notShow'] : FU::Ini($configClass.'.notShow');
        $this->pattern = ($data['pattern']) ? $data['pattern'] : FU::Ini($configClass.'.pattern');
        $this->showDir = ($data['showDir']) ? $data['showDir'] : FU::Ini($configClass.'.showDir');
    }

    public function getFiles($dir='')
    {
            //die('here');
            $dir = str_replace('root/',$this->BaseDir.'/',$dir);
		if ($dir == 'root' || !$dir) $dir = $this->BaseDir;

            $directory = $dir;
            $i = 0;

            $files = FU::rglob($directory,$this->pattern,GLOB_BRACE);

            if ($this->showDir)
                $files = array_unique(array_merge($files,rglob($directory,'*',GLOB_ONLYDIR)));

            $results = array();
            foreach ($files as $fullpath)
            {
                    if (stristr($fullpath, '_fm_')) continue; // If this is a temp file, skip it.
                    //if ($imagesOnly && !preg_match('/\.(jpeg|jpg|gif|png)$/im', $temp)) continue; // If it isnt an image, skip it
                    if (preg_match('/'.$this->notShow.'/', $fullpath)) continue; // If it isnt an image, skip it
                    if (!$this->showDir && is_dir($fullpath)) continue; // If its a directory skip it

                    $fr = clone($this);
                    $fr->uid = $fullpath;
                    $fr->loadRecord();
                    $results[$i] = $fr;
                    $i++;
            }
            return $results;

    }

    
    public static function finder($className=__CLASS__)
    {
		static $instance;

		if (!$instance)
			$instance = new $className;
        return $instance;
    }


}

