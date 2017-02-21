<?php
  
class ProductList extends FStyledTemplateControl
{
    private $_catid;
	protected $_products;
	private $_category_name;
	private $_show_category_name;
	private $_category_var;
	private $_page_size;
        private $_ShowSortingPanel=true;

    public function onLoad($param)
    {
	    parent::onLoad($param);
            $this->populateData();
    }

        public function populateData()
	{
		if 	($this->Repeater->AllowPaging = ($this->getPageSize()>0))
			$this->Repeater->PageSize = $this->getPageSize();
		if (true || !$this->Page->IsPostback)
		{
	        $this->Repeater->DataSource = $this->getProducts();
			$this->Repeater->dataBind();
		}
        }

        public function _populateData($index=0)
	{
			$ds = new TPagedDataSource;
			$ds->AllowPaging = true;
			//$ds->AllowCustomPaging = true;
			$ds->PageSize = $this->Repeater->PageSize;
			$pr = ProductViewRecord::finder()->findAll('category_id = ?',$this->Category);
			$ds->DataSource = $pr;
			$ds->VirtualItemCount = count($pr);
	        $this->Repeater->DataSource=$ds;
			$ds->CurrentPageIndex = $index;
			$this->Repeater->CurrentPageIndex = $index;
	        $this->Repeater->dataBind();
	}
	
	public function getProducts($offset=null,$limit=null)
	{
		//die('AA'.$this->getCategory());
                if ($this->_products == null)
			$this->_products = ProductRecord::finder()->findAll('uid IN (SELECT product_id FROM products_containers WHERE container_id = ?)',$this->Category);

		return $this->_products ;
	}

	public function getCategoryName()
	{
		if (null === $this->_category_name)
		{
			if ($cat = ContainerCategoryRecord::finder()->findByPk($this->getCategory()))
				$this->_category_name = $cat->name;
		}
		return $this->_category_name;
	}

	public function getShowCategoryName()
	{
		return $this->_show_category_name;// && $this->getCategoryName();// && $this->getProducts();
	}
	
	public function setShowCategoryName($value)
	{
		$this->_show_category_name = TPropertyValue::ensureBoolean($value);
	}
	
	public function getShowSortingPanel()
	{
		return $this->_ShowSortingPanel;
	}

	public function setShowSortingPanel($value)
	{
		$this->_ShowSortingPanel = TPropertyValue::ensureBoolean($value);
	}

	
	public function getCategoryVar()
	{
		return $this->_category_var;
	}
	
	public function setCategoryVar($value)
	{
		$this->_category_var = (string) $value;
	}
	
	
	public function getPageSize()
	{
		return $this->_page_size;
	}
	
	public function setPageSize($value)
	{
                $this->_page_size = TPropertyValue::ensureInteger($value);
	}
	

	public function getCategory()
	{
		// return $this->getApplication()->getModule('cms')->getContainer()->uid;
                if (($catvar = $this->getCategoryVar()) && $this->Request[$this->getCategoryVar()])
			return $this->Request[$catvar];
                elseif ($this->_catid)
			return $this->_catid;
                else
                        return $this->getApplication()->getModule('cms')->getContainer()->uid;
	}
	
	public function setCategory($value)
	{
		$catid = (int) $value;
		$this->_catid = $catid;
	}

    public function getDetailLink($prodid)
	{
		$typeData = TypeRecord::getTypes();
		$pagePath = $typeData['ShopDetailPage']->data['pagePath'];
		return $this->Service->constructUrl($pagePath,array('catid'=>$prodid,'stheme'=>$this->Request['stheme'],'parent'=>$this->getPage()->getContainer()->uid));
	}


        public function getEshopDetailLink($product)
	{
		//$pagePath = $product->typeData['pagePath'];
		//return $this->Service->constructUrl($pagePath,array('catid'=>$product->CatID,'parent'=>$this->getPage()->getContainer()->uid));
                $this->Session['parent'] = $this->getPage()->getContainer()->uid;
                Prado::trace(__CLASS__.' PARENT '.$this->Session['parent'],'Json');
                return $this->getPage()->getContainer('detailpage')->getAbsoluteHref(true,array('catid'=>$product->CatID));
	}
	
	public function detailClicked($sender,$param)
	{
		$this->Response->Redirect($this->getEshopDetailLink($param->CommandParameter));
	}
	
	
    /**
     * Event handler to the OnPageIndexChanged event of pagers.
     */
    public function pageChanged($sender,$param)
    {
		//$this->populateData($param->NewPageIndex);
       $this->Repeater->DataSource = $this->getProducts();
	   $this->Repeater->CurrentPageIndex=$param->NewPageIndex;
	   $this->Repeater->dataBind();
    }
}
