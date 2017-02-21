<?php

class ShoppingCart extends FShoppingTemplateControl
{
	public function onPreRender($param)
	{
		
		if (!$this->getIsCartEmpty())
		{
			$sum = $this->getCart()->sum();
			$culture = $this->getCart()->getCulture();
			$this->CartGrid->Columns[2]->FooterText = FU::Currencyfy($sum,null,$culture);//<br/><span class="vcDPH">'.($sum*1.19)."</span>";
			$this->CartGrid->DataSource = $this->getCart();
			$this->CartGrid->databind();
		}
		parent::onPreRender($param);
	}
	
	public function numberChanged($sender,$param)
	{
		$key = $param->getCallbackParameter();
		if (isset($this->Cart[$key]));
		 $this->Cart[$key]->setCount($sender->Text);
		 $this->broadcastEvent('OnCartChanged',$this,$param);
	}
	public function termDeleteButtonClicked($sender,$param)
	{
		if ($param->CommandName == 'termDelete')
		{
			if (!$this->getIsCartEmpty())
			{
				$key = $sender->DataKeys[$param->Item->DataSourceIndex];
				$this->getCart()->remove($key);
				$cp = new TCallbackEventParameter($this->getResponse(),null);
				$this->broadcastEvent('OnCartChanged',$this,$cp);
			}
		}
	}
	
	public function chooseClassClicked($sender,$param)
	{
			//if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			//	return;
			//die($this->Page->getContainer(3)->Href);
			
			//$this->getResponse()->redirect($this->Page->getContainer(3)->Href);//Service->constructUrl($this->Service->DefaultPage));
			//die();
//			$this->Page->gotoDefaultPage();
	}

	public function sendOrderClicked($sender,$param)
	{
			if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
				return;
			$this->broadcastEvent('OnSubmitCart',$this,$param);
	}
}
