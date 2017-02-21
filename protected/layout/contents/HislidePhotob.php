<?php
  
class HislidePhoto extends FStyledTemplateControl implements ITranslatableWidget
{

	private $_names;
	private $_filenames;
        private $_Thumbs;
        private $_HSObjectType;



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
            $photos[] = array('thumb' => $tha[$k],'name' => $na[$k],'filename'=>$fn);
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
        return explode(',', $this->getNames());
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
        return explode(',', $this->getFileNames());
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
        return explode(',', $this->getThumbs());
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
