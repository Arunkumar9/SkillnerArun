<?php
  
class GalleriesList extends FStyledTemplateControl
{
        private   $_catid;
	protected $_galleries;
	protected $_DetailPage;
	protected $_DetailIdVar;
	private   $_page_size;

    public function onLoad($param)
    {
           parent::onLoad($param);
		if 	($this->Repeater->AllowPaging = ($this->getPageSize()>0))
			$this->Repeater->PageSize = $this->getPageSize();
		if (true || !$this->Page->IsPostback)
		{
	        $this->Repeater->DataSource = $this->getGalleries();
			$this->Repeater->dataBind();
		}
	   //echo 'here'; die();
    }
	
	public function populateData($index=0)
	{
                $ds = new TPagedDataSource;
                $ds->AllowPaging = true;
                //$ds->AllowCustomPaging = true;
                $ds->PageSize = $this->Repeater->PageSize;
                $crit = new TActiveRecordCriteria();
                $crit->OrdersBy['ordering'] = 'DESC';
                $crit->OrdersBy['from_date'] = 'DESC';
                $crit->Condition = 'is_enabled = 1';
                $pr = GalleryRecord::finder()->findAll($crit);
                $ds->DataSource = $pr;
                $ds->VirtualItemCount = count($pr);
                $this->Repeater->DataSource=$ds;
                $ds->CurrentPageIndex = $index;
                $this->Repeater->CurrentPageIndex = $index;
	        $this->Repeater->dataBind();
	}
	
	public function getGalleries($offset=null,$limit=null)
	{
		if ($this->_galleries == null)
                {
                    $crit = new TActiveRecordCriteria();
                    $crit->OrdersBy['ordering'] = 'DESC';
                    $crit->OrdersBy['from_date'] = 'DESC';
                    $crit->OrdersBy['name'] = 'ASC';
                    $crit->Condition = 'is_enabled = 1';
                    if ($this->getCategory())
                    {
                            $crit->Condition .= " AND category_id = :category";
                            $crit->Parameters[":category"] = $this->getCategory();
                    }
                    $this->_galleries = GalleryRecord::finder()->findAll($crit);
                }
		return $this->_galleries ;
	}

	
	public function getPageSize()
	{
		return $this->_page_size;
	}
	
	public function setPageSize($value)
	{
		$this->_page_size = TPropertyValue::ensureInteger($value);
	}
	
	public function getDetailIdVar()
	{
		return $this->_DetailIdVar;
	}

	public function setDetailIdVar($value)
	{
		$this->_DetailIdVar = $value;
	}

	public function getDetailPage()
	{
		return $this->_DetailPage;
	}

	public function setDetailPage($value)
	{
		$this->_DetailPage = $value;
	}


	public function getCategory()
	{
			return $this->_catid;
	}
	
	public function setCategory($value)
	{
		$catid = (int) $value;
		$this->_catid = $catid;
	}

        public function getDetailLink($gallery)
	{
		$dvar = $this->getDetailIdVar();
                if ($dc = $this->getPage()->getContainer($this->getDetailPage()))
                {
                    $dc->typedata['notInMenu']=false;
                    $link = $dc->getAbsoluteHref(true,array($dvar=>$gallery->CatID,'parent'=>$this->getPage()->getContainer()->uid));
                    $dc->typedata['notInMenu']=true;
                }
                else
                    $link = '#';
                Prado::trace(__CLASS__.' '.$this->getDetailPage().' '.$link, 'Json');
                return $link;
	}

	

        /**
         * Event handler to the OnPageIndexChanged event of pagers.
         */
        public function pageChanged($sender,$param)
        {
                    //$this->populateData($param->NewPageIndex);
           $this->Repeater->DataSource = $this->getGalleries();
               $this->Repeater->CurrentPageIndex=$param->NewPageIndex;
               $this->Repeater->dataBind();
        }
}
