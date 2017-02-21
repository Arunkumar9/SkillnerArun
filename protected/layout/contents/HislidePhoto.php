<?php
  
class HislidePhoto extends FStyledTemplateControl implements ITranslatableWidget
{

	private $_names;
	private $_filenames;
        private $_Thumbs;
        private $_HSObjectType;

    	private $_Group;


    public function getSlideShowGroup()
    {
       return ($this->_Group)?$this->_Group:__CLASS__.'_'.$this->getClientID();
    }


    public function getGroup() 	{

           return $this->_Group;
    }

    public function setGroup($value) 	{
        $this->_Group = $value;
    }

    public function onLoad($param)
    {
	    parent::onLoad($param);
            $this->Repeater->DataSource = $this->getPhotos();
            $this->Repeater->dataBind();
    }
	

    public function getPhotos()
    {
        $fna = $this->getFileNamesArray();
        $na = $this->getNamesArray();
        $tha = $this->getThumbsArray(); 
        $photos = array();
        foreach($fna as $k => $fn)
        {
            $fn = trim($fn);
            $photos[] = array('thumb' => trim($tha[$k]),'name' => trim($na[$k]),'filename'=>(stripos($fn,'http')===0 || stripos($fn,'.jpg')===false )?$fn:'images/'.$fn,
                'expand'=>(stripos($fn,'.jpg')!==false)?'expand':'htmlExpand');
        }
        return $photos;
    }
    
    public function getNames()
    {
            return $this->_names;
    }

    public function setNames($value)
    {
            $this->_names = $value;
    }

    public function getNamesArray()
    {
        return explode("\n", $this->getNames());
    }

    public function getFileNames()
    {
            return $this->_filenames;
    }

    public function setFileNames($value)
    {
            $this->_filenames = $value;
    }

    public function getFileNamesArray()
    {
        return explode("\n", $this->getFileNames());
    }

    public function getThumbs()
    {
            return $this->_Thumbs;
    }

    public function setThumbs($value)
    {
            $this->_Thumbs = $value;
    }

    public function getThumbsArray()
    {
        return explode("\n", $this->getThumbs());
    }

    public function getHSObjectType()
    {
            return $this->_HSObjectType;
    }

    public function setHSObjectType($value)
    {
            $this->_HSObjectType = $value;
    }
}
