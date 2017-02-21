<?php
  
class GalleryDetail extends ProductList
{
    protected $_gallery;
    protected $_category_name;

    public function onLoad($param)
    {
	    parent::onLoad($param);
          //  $cs = $this->Page->ClientScript;
          //  $cs->registerStylesheetFile("Fresh:GadgetsList",$this->publishAsset("gadgetslist.css"));
	    if 	($this->Repeater->AllowPaging = ($this->getPageSize()>0))
			$this->Repeater->PageSize = $this->getPageSize();
            $this->Repeater->DataSource = $this->getGallery()->getImagesRecords();
            $this->Repeater->dataBind();
    }

    public function onPreRender($param)
    {
        $bp = new TBroadcastEventParameter();
        $bp->Parameter = array(
            'name' =>$this->Gallery->name,//LangAct,
            'parentid'=>$this->getParentId()
        );
        $this->broadcastEvent('OnAncestorsHint', $this, $bp);
        parent::onPreRender($param);
    }

    public function getParentId()
    {
        return $this->Request['parent'];
    }

	public function getGallery()
	{
		if ($this->_gallery == null)
                {
                    $cri = new TActiveRecordCriteria();
                    $cri->setCondition('uid = :uid');
                    $cri->OrdersBy['ordering'] = 'ASC';
                  //  if ($this->getPageSize()>0)
                     //   $cri->setLimit($this->getPageSize());
                    $uid=preg_replace('/^([0-9])+.*/','\\1', $this->getCategory());
                    $cri->Parameters[':uid']=$uid;
                    $this->_gallery = GalleryRecord::finder()->find($cri);
                    Prado::trace(__CLASS__.' '.$this->getCategory().$uid.' '.$link, 'Json');
                }

		return $this->_gallery ;
	}


        public function getCategoryName()
	{
		if (null === $this->_category_name)
		{
			if ($cat = SimpleCategoryRecord::finder()->findByPk($this->getCategory()))
				$this->_category_name = $cat->name;
		}
		return $this->_category_name;
	}

    /**
     * Event handler to the OnPageIndexChanged event of pagers.
     */
    public function pageChanged($sender,$param)
    {
		//$this->populateData($param->NewPageIndex);
       $this->Repeater->DataSource = $this->getGadgets();
	   $this->Repeater->CurrentPageIndex=$param->NewPageIndex;
	   $this->Repeater->dataBind();
    }

}
