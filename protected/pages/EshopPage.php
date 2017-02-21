<?php

class EshopPage extends FBasePage
{
/*	public function onPreInit($param)
	{
		$this->StylesheetTheme = 'Eshop';
	}
*/
	public function findVariant($size,$cover)
	{
        return $this->Product->findVariant($size,$cover);
	}
	public function insertToCartClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;
		$cart = $this->Application->Modules['cart']->getCart();
		$cart->Culture = $this->Application->Globalization->Culture;
		$variant = $this->findVariant($this->SizesList->SelectedValue,$this->CoversList->SelectedValue);
		if (!$variant)
			return;
		$key = $variant->uid;
		$item = $cart->addNew($key);
		$item->Key = $key;
		$item->ProductId = $key;
		$item->Count = $item->Count + TPropertyValue::ensureInteger($this->CountToInsert->SafeText);
		$item->Price = $variant->PriceWithVAT;//?$variant->price:$this->Product->price;
		
		$cart->save();
        if ($sender->CustomData)
            $sender->Text = $sender->CustomData;
//		$this->Page->gotoPage('shop.OrderPage',array('stheme'=>$this->Request['stheme'],'parent'=>$this->getPage()->getContainer()->uid));
		$this->broadcastEvent('OnCartChanged',$sender,$param);
	}

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

}
