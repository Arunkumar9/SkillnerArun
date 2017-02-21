<?php
Prado::using('Application.pages.EshopPage');
class EshopProductDetail extends EshopPage
{
    
	private $_product;
	
	public function getProduct()
	{
		if ($this->_product == null)
		{
			$prodid = $this->Request['id'];
			$this->_product = ProductRecord::finder()->findByPk($prodid);
		}
		return $this->_product ;
	}

   /*
 public function getEshopDetailLink($prodid)
	{
		$typeData = TypeRecord::getTypes();
		$pagePath = $typeData['ShopDetailPage']->data['pagePath'];
		return $this->Service->constructUrl($pagePath,array('id'=>$prodid));
	}
*/
}
