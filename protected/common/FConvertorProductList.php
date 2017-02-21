<?php
class FConvertorProductList extends FConvertorBase 
{
	static public function factory($parent)
	{
		$control = Prado::createComponent('Application.pages.shop.ProductList');
		$control->setCategory($parent->getText());
		return $control;
	}
}
?>