<?php

class PersonalDataForm extends FShoppingTemplateControl
{
	private $_postages;
	public function onLoad($param)
	{
		parent::onLoad($param);
		if (!$this->Page->IsPostback)
		{
			$this->PaymentRadio->DataSource = $this->getPostages();
			$this->PaymentRadio->databind();
		}

		if (!$this->User->IsGuest && $this->User->Level < 50 )//&& !$this->Page->IsPostback)
		{
				$this->Cart->Address = $this->User->ShippingAddress;//)?$this->User->ShippingAddress:$this->User->Address;
//echo TVarDumper::dump($this->User->ShippingAddress);
				$this->Cart->BillingAddress = $this->User->BillingAddress;//)?$this->User->BillingAddress:$this->User->Address;
		}
	}
	
	public function sendPersonalDataClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

                //$this->Cart->Address = $this->User->Address;
		
		$adr = $this->Cart->Address;
		$adr->CustomerName = 	$this->CustomerName->getSafeText();
		$adr->CompanyName  = 		$this->CompanyName->getSafeText();
		$adr->IC  = 		$this->IC->getSafeText();
		$adr->DIC  = 		$this->DIC->getSafeText();

		$adr->Street  = 		$this->Street->getSafeText();
		$adr->StreetNumber = 	$this->StreetNumber->getSafeText();
		$adr->Zip = 			$this->Zip->getSafeText();
		$adr->City = 			$this->City->getSafeText();
		$adr->Email = 			$this->Email->getSafeText();
		$adr->Phone = 			$this->Phone->getSafeText();
		$adr->Comment =			$this->Comment->getSafeText();
		
		try
		{
			$adr = $this->Cart->BillingAddress;
			$adr->CustomerName = 		$this->BillingCustomerName->getSafeText();
			$adr->CompanyName  = 		$this->BillingCompanyName->getSafeText();
			$adr->IC  = 			$this->BillingIC->getSafeText();
			$adr->DIC  = 			$this->BillingDIC->getSafeText();
			$adr->Street  = 		$this->BillingStreet->getSafeText();
			$adr->StreetNumber = 		$this->BillingStreetNumber->getSafeText();
			$adr->Zip = 			$this->BillingZip->getSafeText();
			$adr->City = 			$this->BillingCity->getSafeText();
			$adr->Email = 			$this->BillingEmail->getSafeText();
			$adr->Phone = 			$this->BillingPhone->getSafeText();
		}
		catch (Exception $e)
		{
			$this->Cart->BillingAddress = null;
		}

		$this->Cart->Payment = $this->PaymentRadio->SelectedItem->Text;
		$this->Cart->IsPaymentAdvance = $this->getPostage($this->PaymentRadio->SelectedValue)->advance;
		$this->Cart->AddOnPrice = floatval($this->getPostage($this->PaymentRadio->SelectedValue)->LimitPrice);
		 Prado::trace(__CLASS__.' click ','Json');
		$this->broadcastEvent('OnPersonalData',$sender,$param);
	}
	
	public function getPostages()
	{
		if (!$this->_postages)
		{
			$finder = PostageRecord::finder();
			$postages = $finder->findAllByLang(FU::Culture());
			$this->_postages = (count($postages)>0) ? $postages : $finder->findAllByLang('cs');
		}
		return $this->_postages;
	}
	
	public function getPostage($uid)
	{
		foreach($this->getPostages() as $postage)
		{
			if ($postage->uid == $uid)
				return $postage;
		}
		return null;
	}
}
