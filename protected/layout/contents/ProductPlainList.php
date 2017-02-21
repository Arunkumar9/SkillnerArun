<?php
  
class ProductPlainList extends ProductList
{
	
	private $_max_products=0;
	
	public function getProducts($offset=null,$limit=null)
	{
		if ($this->_products == null)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->setCondition("({$this->Feature})");
			if ($this->getMaxProducts() > 0)
				$criteria->Limit=$this->getMaxProducts();
			$this->_products = ProductRecord::finder()->findAll($criteria);
		}

		return $this->_products ;
	}

	public function setMaxProducts($value)	
	{
		$this->_max_products = TPropertyValue::ensureInteger($value);
	}

	public function getMaxProducts()	
	{
		return $this->_max_products;
	}

	public function setFeature($value)
	{
		$this->setViewState('feature',TPropertyValue::ensureEnum($value,Features),Features::IsFeatured);
	}
	
	public function getFeature($value)
	{
		return $this->getViewState('feature',Features::IsFeatured);
	}
}

class Features extends TEnumerable
{
	const IsFeatured = 'is_featured';
	const IsRecommended = 'is_recommended';
	const IsNew = 'is_new';
	const IsOther = 'is_other_flag';
}
