<?php


class EshopProductSideList extends ProductList
{
        public function getEshopDetailLink($product)
	{
                return $this->getPage()->getContainer('detailpage')->getAbsoluteHref(true,array('catid'=>$product->CatID));
	}
    
}