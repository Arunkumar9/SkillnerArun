<?php

class OrderForm extends FShoppingTemplateControl
{
	public function onLoad($param)
	{
		parent::onLoad($param);
		if (!$this->Page->IsPostBack)
		{
			$terms = $this->getProduct()->terms;
			//var_dump($this->Product);die();
			if (is_array($terms))
			{
				$this->TermCombo->Datasource = $terms;
				$this->TermCombo->databind();
				
				if ($selTerm = $this->Request['term'])
					$this->TermCombo->setSelectedValue($selTerm);
			}
		}
	}
	
	public function getTerm()
	{
		return TermRecord::finder()->findByPk($this->TermCombo->SelectedValue);
	}
	public function insertToCartClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

		$key = $this->getProduct()->uid.':'.$this->TermCombo->SelectedValue;
		$item = $this->getCart()->addNew($key);
		$item->Key = $key;
		$item->ClassId = $this->getProduct()->uid;
		$item->TermId = $this->TermCombo->SelectedValue;
		$item->Count =+ (int) $this->NumberOfPersonsBox->SafeText;
		$item->Price = $this->getTerm()->ShownPrice;
		$item->CertificateName = ($this->IsCertificate) ? $this->CertificateNameBox->SafeText : '';
		$item->ProductType = $this->IsCertificate;
		//$item->Payment = $this->PaymentCombo->SelectedValue;
		
//		$this->Cart[$key] = $item;
		
//		$param = new FCartEventParameter;
//		$param->setItem($item);
		
		$this->broadcastEvent('OnInsertToCart',$sender,$param);
	}
	
	public function termComboChanged($sender,$param)
	{
		$this->TotalPriceBox->render($param->getNewWriter());
	}
	
	public function getTotalPrice()
	{
		$term = $this->getTerm();
		if ($term)
		{
			$price = $term->getShownPrice()*$this->NumberOfPersonsBox->getSafeText(); 
			return $price.' Kč';
		}
		else
			return "Nezvolen termín";
	}
	
	
	
}
