<?php
/**
 * @package    Fresh.Fotoatelier.Modules
 * @file       FImageModule.php
 * 
 * Classfile for image manipulation module class. FImageModule
 */

Prado::using('Application.common.Image.*');
Prado::using('Application.common.Image.Tools');

/**
 * @class    FImageModule
 * 
 * 
 */
class FImageModule extends TModule
{
    private $_cache_path;
    private $_repo_path;
    private $_mask_path;
    private $_mask_size_above=0;
    
	/**
	 * Initializes the module.
	 * This method is invoked by application.
	 * @param TXmlElement module configuration
	 */
	public function init($config)
	{

	}

	public function getThumbnailUrl($id,$width=0,$height=0)
	{
		$params = Prado::getApplication()->Parameters;
        if (!$width && !$height)
        {
            $width = $params['defaultThumbWidth'];
            $height = $params['defaultThumbHeight'];
        }            
        else
        {
            $width = ($width) ? $width : 1000;
            $height = ($height) ? $height : 1000;
        }
        
        if (!$id)
           throw  new TIOException('wrong_image_file'.$id);
		   
        return $this->localToUrl($this->getThumbnail($id,$width,$height));
	}
	
	public function localToUrl($file)
	{
		$root = Prado::getPathOfNamespace('Root.*');
		dir($root);
		return str_replace(array($root.DIRECTORY_SEPARATOR,'\\'),array('','/'),$file);
	}

    public function importFile($file)
    {
        $id = basename($file,'.jpg');

        $id = preg_replace('/^[^0-9]+/','',$id);

        $idi = preg_replace('/^(.+_)(S[1-5]|SC[1-5])([0-9]+)$/','$1$2_$3',$id);
        $id = ($idi)?$idi:$id;
        $sfile = $this->getFullFilename($id);
        
        $dir = dirname($sfile);

        $result = true;
        if (!is_dir($dir))
            $result = mkdir($dir,0777,true);
        if (!$result)
             throw new TIOException('cannot_create_directory '.$dir);
        
        $result = rename($file,$sfile);
        
        if (!$result)
             throw new TIOException('cannot_import_image');
        
        return $id;
    }
    
    public function getFilename($id)
    {
        $dir = trim($id);//trim(str_replace('_',DIRECTORY_SEPARATOR,substr($id,0,19)));
        return $dir.DIRECTORY_SEPARATOR.$id.'.jpg';   
    }    
    
    public function hasImage($id)
    {
        return file_exists($this->getFullFilename($id));
    }
    
    public function getThumbFilename($file,$size='thumb')
    {
        if (!preg_match('/\.jpg|\.png|\.gif$/is',$file))
            $file = $this->getFilename($file);
        return $this->CachePath.DIRECTORY_SEPARATOR.preg_replace('/\.(jpg|png|jpeg)$/is',".$size.jpg",$file);
    }
    
    public function getFullFilename($file)
    {
        if (!preg_match('/\.jpg|\.png|\.gif$/is',$file))
            $file = $this->getFilename($file);
        return $this->RepositoryPath.DIRECTORY_SEPARATOR.$file;
    }

    public function getAppParameters()
    {
        return Prado::getApplication()->getParameters();
    }
    public function getThumbnail($file,$width,$height)
    {
         $height =($height>0)?$height:$this->AppParameters['defaultThumbHeight'];
         $width = ($width>0)?$width:$this->AppParameters['defaultThumbWidth'];
         $tfile = $this->getThumbFilename($file,$width.'x'.$height);
         $sfile = $this->getFullFilename($file);
//die($sfile);
         if (!file_exists($sfile))
         {
             $sfile = $this->getFullFilename($this->AppParameters['defaultNoImage']);
             $tfile = $this->getThumbFilename($this->AppParameters['defaultNoImage'],$width.'x'.$height);
         }

         if (!file_exists($tfile) || filemtime($sfile)>filemtime($tfile))
         {
            $tdir = dirname($tfile);
            $result = true;
            if (!is_dir($tdir))
                $result = @mkdir($tdir,0777,true);

            if ($result)
                 $result = $this->thumbnailImage($sfile,$tfile,$width,$height);
            else
                throw  new TIOException('cannot create thumbnail directory '.$tdir);

            if (!$result)
                 return self::DEFAULT_IMAGE_JPG;
         }
         return $tfile;
    }
        
    public function thumbnailImage($sfile,$tfile,$width,$height)
    {
        $thumbnail = Image_Tools::factory('thumbnail', array(
            'image' => $sfile,
            'width' => (int) $width,
            'height' => (int) $height,
            'method' => 3
        ));
//var_dump($thumbnail->options);die();
        if (PEAR::isError($thumbnail)) {       
            throw new TIOException('cannot create thumbnail '.$thumbnail->toString());
        }

//die($this->MaskPath);
//        $thumbnail->render();
        $thumbnail->save($tfile,IMAGETYPE_JPEG);

        if ($this->MaskSizeAbove > 0 && $width > $this->MaskSizeAbove && $height > $this->MaskSizeAbove)
        {
            $masked = Image_Tools::factory('watermark',array(
                'image' => $tfile,
                'mark' => $this->MaskPath,
                'width'   => (int) min(($width*0.8),200),
                'height'  => (int) min(($width*0.8/2.3),200/2.3),
    
                'marginx'   => 10,
                'marginy'  => 10,
                'horipos' => 1,
                'vertpos' => 1,
    
                'blend'=>'screen'
            ));
    
            $masked->save($tfile,IMAGETYPE_JPEG);
        }
        return $tfile;        
        
    }
    
    

   /**
     * Automatically creates any necessary parent directories in the specified
     * $path.
     *
     * @param string $path  to autocreate
     */
    function autocreatePath($path,$root)
    {
        $dirs = explode('/', $path);
        if (is_array($dirs)) {
            $cur = $root.'/';
            foreach ($dirs as $dir) {
                if (!strlen($dir)) {
                    continue;
                }
                if (!is_dir($cur.$dir)) {
                    $result = mkdir($cur, $dir);
                    if (is_a($result, 'PEAR_Error')) {
                        return $result;
                    }
                }
                if ($cur != '/') {
                    $cur .= '/';
                }
                $cur .= $dir;
            }
        }

        return true;
    }

	/**
	 * @return string	path to cache 
	 */
	public function getCachePath()
	{
		return $this->_cache_path;
	}	


	/**
	 * @param string path to YAML in Prado dot format
	 */
	public function setCachePath($value)
	{
		$this->_cache_path=Prado::getPathOfNamespace($value);
	}
        
	/**
	 * @return string	path to cache 
	 */
	public function getRepositoryPath()
	{
		return $this->_repo_path;
	}	


	/**
	 * @param string path to YAML in Prado dot format
	 */
	public function setRepositoryPath($value)
	{
		$this->_repo_path=Prado::getPathOfNamespace($value);
	}
    
	/**
	 * @return string	path to Mask 
	 */
	public function getMaskPath()
	{
		return $this->_mask_path;
	}	

	/**
	 * @param string path to Mask
	 */
	public function setMaskPath($value)
	{
		$this->_mask_path=Prado::getPathOfNamespace($value,'.jpg');
	}
        
	/**
	 * @return mask image if size is above 
	 */
	public function getMaskSizeAbove()
	{
		return $this->_mask_size_above;
	}	

	/**
	 * @param mask image if size is above
	 */
	public function setMaskSizeAbove($value)
	{
		$this->_mask_size_above = (int) $value;
	}
}
  
?>
