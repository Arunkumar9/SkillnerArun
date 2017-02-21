<?php
  
class CategoryProductDetail extends FBasePage
{
    
/*
	private $_products;
	
    public function onLoad($param)
    {
        parent::onLoad($param);
	//	$catid = $this->Request['catid'];
 //       $finder = ProductViewRecord::finder();
//		$repeater = $this->findControlsByID('Repeater');
        $this->Repeater->DataSource=$this->getProducts();
        $this->Repeater->dataBind();
    }
	
	public function getProducts()
	{
		if ($this->_products == null)
		{
			$catid = $this->Request['catid'];
			$this->_products = ProductViewRecord::finder()->findAll('category_id = ?',$catid);
		}
		return $this->_products ;
	}

    public function getDetailLink($prodid)
	{
//		$product = ProductViewRecord::finder()->findByPk($prodid);
		$typeData = TypeRecord::getTypes();
		$pagePath = $typeData['ShopDetailPage']->data['pagePath'];
		return $this->Service->constructUrl($pagePath,array('id'=>$prodid));
	}

*/}
