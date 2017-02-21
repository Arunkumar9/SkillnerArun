<?php

Prado::using('FreshSystem.FShoppingTemplateControl');
class FShoppingCartModule extends TModule
{
	const DEFAULT_CART_CLASS =  'CartItemsCollection';
	private $_cart;
	private $_cart_record;
	private $_cart_class;
	
	public function init($config)
	{
//		$this->getApplication()->attachEventHadler('onAuthorizationComplete',)
		$this->getApplication()->attachEventHandler('OnSaveState',array($this,'saveCart'));
		
	}

	public function getCartClass()
	{
		return ($this->_cart_class) ? $this->_cart_class : self::DEFAULT_CART_CLASS;
	}

	public function setCartClass($value)
	{
		$this->_cart_class = TPropertyValue::ensureString($value);
	}

	public function getCart($force=false)
	{
		if ($force || $this->_cart === null)
		{
			if ($this->getUser()->IsGuest)
				$this->_cart = $this->getCartFromSession();
			elseif ($this->_cart)
				$this->_cart->mergeWith($this->getCartFromDb());
			else
				$this->_cart = $this->getCartFromDb();
		}
		return $this->_cart;
	} 
	

public function getCartItems()
	{
		return array_values($this->getCart()->toArray());
	}
	protected function getCartKey()
	{
		return 'Prado::Cart::'.$this->getApplication()->ID;
	}
	
	protected function getCartFromSession()
	{
		$session = $this->getSession();
		$key = $this->getCartKey();
		if ($cart = $session[$key])
			return unserialize($cart);

		$cc = $this->getCartClass();		
		$cart = new $cc;
		$session[$key] = serialize($cart);
		return $cart;		
	}
	
	protected function getCartFromDb()
	{
		$cr = CartRecord::finder()->findByPk($this->getUser()->Uid);
		if (!$cr)
		{
			$cr = new CartRecord;
			$cr->uid = $this->getUser()->Uid;
			$cart = $this->getCartFromSession();
			$cr->DataAsObject = $cart;
		}
		else
		{
			$cart = $cr->DataAsObject;
		}
		$this->_cart_record = $cr;
		return $cart;
	}
	
	public function sumCart()
	{
		return CartItem::sum($this->getCart());
	}
	
	public function emptyCart()
	{
		$cc = $this->getCartClass();		
		$this->_cart = new $cc;
	}
	public function saveCart()
	{
		//Prado::trace(TVarDumper::dump($this->Cart),'Json');
		if ($this->_cart_record instanceof TActiveRecord && !$this->getUser()->getIsGuest())
		{
			if ($this->getCart()->count()>0)
			{
				$this->_cart_record->DataAsObject = $this->_cart;
				$this->_cart_record->save();
			}
			elseif ($this->_cart_record->uid)
			{
				//$this->_cart_record->delete();
				CartRecord::finder()->deleteByPk($this->_cart_record->uid);
			}
			//$this->getSession()->remove($this->CartKey);
		}
	//	else
	//	{
			$this->Session[$this->CartKey] = serialize($this->_cart);
	//	}
/*
		if (count($this->getCart())>0)
		{
		}
		else
		{
			$this->getSession()->remove($this->CartKey);
			//if ($this->_cart_record && !$this->getUser()->getIsGuest())
			//	$this->_cart_record->delete();
		}
		Prado::trace(TVarDumper::dump($this->Cart),'Json');

*/	}
	
	
}


