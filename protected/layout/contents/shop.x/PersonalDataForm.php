<?php

class PersonalDataForm extends FShoppingTemplateControl
{
	private $_postages;
	public function onLoad($param)
	{
		parent::onLoad($param);
		if (true || !$this->Page->IsPostback)
		{
			$this->PaymentRadio->DataSource = $this->getPostages();
			$this->PaymentRadio->databind();
		}
	}
	
	public function sendPersonalDataClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;
			
		$this->Cart->Address = $this->User->Address;
		
		$adr = $this->Cart->Address;
		$adr->CustomerName = 	$this->CustomerName->getSafeText();
		$adr->Street  = 		$this->Street->getSafeText();
		$adr->StreetNumber = 	$this->StreetNumber->getSafeText();
		$adr->Zip = 			$this->Zip->getSafeText();
		$adr->City = 			$this->City->getSafeText();
		$adr->Email = 			$this->Email->getSafeText();
		$adr->Phone = 			$this->Phone->getSafeText();

		$this->Cart->Payment = $this->PaymentRadio->SelectedItem->Text;
		$this->Cart->IsPaymentAdvance = $this->getPostage($this->PaymentRadio->SelectedValue)->advance;
		$this->Cart->AddOnPrice = (integer) $this->getPostage($this->PaymentRadio->SelectedValue)->LimitPrice;
		 
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
