<?php

class FShoppingTemplateControl extends FStyledTemplateControl
{

	public function getCart()
	{
		return Prado::getApplication()->Modules['cart']->getCart();
	}
	
	public function getCartItems()
	{
		return Prado::getApplication()->Modules['cart']->getCartItems();
	}

	public function getIsCartEmpty()
	{
		return (count($this->getCart())==0);
	}

	public function getProduct()
	{
		return $this->getPage()->getProduct();
	}
	
	public function backClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;
		$this->broadcastEvent('OnBack',$sender,$param);
	}

	public function getIsCertificate()
	{
		return ($this->Request['certificate'])?1:0;
	}

        public function emptyCartClicked($sender, $param)
        {
                $this->Application->getModule('cart')->Cart->clear();
        }
	
}

class FCartEventParameter extends TEventParameter
{
	private $_item;
	
	public function getItem()
	{
		return $this->_item;
	}
	
	public function setItem($value)
	{
		$this->_item = $value;
	}
}
