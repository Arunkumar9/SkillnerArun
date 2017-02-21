<?php

class CartItem extends TComponent
{
	const CERTIFICATE = 1;
	private $_key;
	private $_product_id;
	private $_count;
	private $_price;
	private $_size;

	private $_Variants;

        /**
         *
         * @return AttributeRecord[]
         */
        public function getVariants() 	{
            return ($this->_Variants) ? $this->_Variants : array();
        }


        /**
         *
         * @param AttributeRecord[] $value
         */
        public function setVariants($value) 	{
            $this->_Variants = $value;
        }

	/**
	 * Getter for property size
	 * atypical size;
	 * @return type
	 */
	public function getSize() {
	    return $this->_size;
	}

	/**
	 * Setter for property size
	 * atypical size;
	 * @param $value type
	 */
	public function setSize($value) {
	    $this->_size = $value;
	}



	public static function sum($cart=null)	
	{
		if ($cart === null)
			$cart = Prado::getApplication()->Modules['cart']->getCart();
		$sum = 0;
		foreach($cart as $item)
			$sum += $item->getTotalPrice();

		return $sum;
	}

	public static function getSum($cart)	
	{
		return self::sum();
	}
	
	public function getCartCulture()
	{
		return Prado::getApplication()->Modules['cart']->getCart()->getCulture();
	}

	public function getDateInterval()
	{
		if ($this->getTerm())	
			return $this->getTerm()->DateInterval;
	}

	
	public function getShownPrice()
	{
		return $this->Price;//*Prado::getApplication()->Globalization->Currency->conversion;
	}

	public function getTotalPrice()
	{
		return $this->ShownPrice*$this->Count;
	}

	public function getTotalPriceCurrency()
	{
		return FU::Currencyfy($this->getTotalPrice(),null,$this->getCartCulture());
	}

	public function getProductName()
	{
		$variant = ProductRecord::finder()->findByPk($this->ProductId);
		if ($variant)
			return $variant->name;

		return '';
	}

        public function getProductUrl()
        {
            list($uid,$variants) = explode('|',$this->getKey());
            $product = ProductRecord::finder()->findByPk($this->ProductId);
            $params = array(
                'catid'   =>$product->CatID,
                'variants'=>$variants
            );
            if ($c = Prado::getApplication()->getModule('cms')->getContainer('product-detail'))
                    return $c->getAbsoluteHref(true,$params);
            else
                    return '#';
        }
	
	public function getProductId()
	{
		return $this->_product_id;
	}

	public function setProductId($value)
	{
		$this->_product_id = $value;
	}

	public function getCount()
	{
		return $this->_count;
	}

	public function setCount($value)
	{
		$this->_count = TPropertyValue::ensureInteger( $value );
	}

	public function getPrice()
	{
		return $this->_price;
	}
	
	public function getPriceCurrency()
	{
		return FU::Currencyfy($this->getShownPrice(),null,$this->getCartCulture());
	}

	public function setPrice($value)
	{
		$this->_price = $value;
	}
	
	public function getKey()
	{
		return $this->_key;
	}

	public function setKey($value)
	{
		$this->_key = $value;
	}	
	
}

class CartItemsCollection extends TMap
{
	private $_finalized;
	private $_payment;
	private $_address;
	private $_billing_address;
	private $_addonprice;
	private $_order_num;
	private $_advance;
	private $_culture;
	
	public function sum()
	{
		return CartItem::sum($this->toArray());
	}
	
	public function sumWithAddOn($currency=true)
	{
		if ($currency)
			return FU::Currencyfy(CartItem::sum($this->toArray())+$this->getAddOnPrice(), null, $this->getCulture() );
		else
			return CartItem::sum($this->toArray())+$this->getAddOnPrice();
	}

	public function addNew($key)
	{
		if (!$this->contains($key))
			$this->add($key,new CartItem);
		return $this->itemAt($key);
	}
	
	public function getFinalized()
	{
		return $this->_finalized;
	}

	public function setFinalized($value)
	{
		$this->_finalized = $value;
	}
	
	
	public function setAddress(AddressRecord $value)
	{
		$this->_address = $value;
	}

	public function getAddress()
	{
		if (null === $this->_address)
			$this->_address = new AddressRecord;

		return $this->_address;
	}
	public function setBillingAddress(AddressRecord $value)
	{
		$this->_billing_address = $value;
	}

	public function getBillingAddress()
	{
		if (null === $this->_billing_address)
			$this->_billing_address = new AddressRecord;

		return $this->_billing_address;
	}
	
	public function getPayment()
	{
		return $this->_payment;
	}

	public function setPayment($value)
	{
		$this->_payment = $value;
	}

	public function getAddOnPrice()
	{
		return $this->_addonprice;
	}

	public function setAddOnPrice($value)
	{
		$this->_addonprice = $value;
	}

	public function getIsPaymentAdvance()
	{
		return $this->_advance;// (stristr($this->getPayment(),'převodem')!==false);
	}

	public function setIsPaymentAdvance($value)
	{
		$this->_advance = TPropertyValue::ensureBoolean($value);
	}

	public function save()
	{
		Prado::getApplication()->Modules['cart']->saveCart();
	}
	
	public function getOrderNumber()
	{
		return $this->_order_num;
	}
	
	public function createOrder()
	{
		if (!$this->_order_num && $this->getFinalized())
		{
			$order = new OrderRecord();
			$order->DataAsObject = $this;
			$order->save();		
			$this->_order_num = $order->getOrderNumber();
		}
		return $this->_order_num;
	}
	
	public function resetOrderNumber()
	{
		$this->_order_num = null;	
	}
	
	public function reset()
	{
		$this->_order_num = null;
		$this->_finalized = false;
		$this->clear();
		$this->save();
	}
	
	public function getCulture()
	{
		if (!$this->_culture)
			$this->_culture = Prado::getApplication()->getGlobalization()->getCulture();
		return $this->_culture;
	} 
	
	public function setCulture($value,$force=false)
	{
		if ($force || !$this->_culture || $this->getCount()==0)
			$this->_culture = TPropertyValue::ensureString($value);
	}
	
}
/*

1. Plaba – dobírkou | Doprava – Česká pošta – [+50 Kč]
2. Plaba – dobírkou | Doprava – PPL – [+50 Kč]
3. Plaba – převodem | Doprava – Česká pošta– [+50 Kč]
4. Plaba – převodem | Doprava – PPL– [+50 Kč]
5. Plaba – hotově | Doprava – osobní převzetí– [zdarma]

*/
