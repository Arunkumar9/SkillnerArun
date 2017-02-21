<?php
  
class CategoryList extends TTemplateControl
{
    private $_catid;
	private $_categories;
	private $_detail;
	
    public function onLoad($param)
    {
        parent::onLoad($param);
        $this->Repeater->DataSource=$this->getCategories();
        $this->Repeater->dataBind();
    }
	
	public function getCategories()
	{
		if ($this->_categories == null)
			$this->_categories = CategoryRecord::finder()->findAll('parent_id = ?',$this->Category);
		return $this->_categories ;
	}

	public function getDetail()
	{
		return $this->_detail;
	}
	
	public function setDetail($value)
	{
		$did = (int) $value;
		if (!$did)
			$did = $this->getPage()->getContainer();
		else
			$did = ContainerRecord::finder()->findByPk($did);
		$this->_detail = $did;
	}

	public function getCategory()
	{
		return $this->_catid;
	}

	public function setCategory($value)
	{
		$catid = (int) $value;
		if (!$catid)
			$catid = CategoryRecord::finder()->findByName($value);
		$this->_catid = $catid;
	}

    public function getProductListLink($cat)
	{

		$cms = $this->getApplication()->Modules['cms'];
		//$typeData = TypeRecord::getTypes();
		//$pagePath = $typeData['ShopProductListPage']->data['pagePath'];
		//$params = array_merge($this->getRequest()->toArray(),array('id'=>$cat));
		return $cms->getUrl($this->Detail,array('category'=>$cat,'stheme'=>$this->Request['stheme']));
	}

}
