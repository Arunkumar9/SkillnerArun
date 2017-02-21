<?php

class CartSummary extends ShoppingCart
{
	public function onPreRender($param)
	{
		/*Prado::Trace('cart summary','Json');
		if (!$this->getIsCartEmpty())
		{
			
			$sum = $this->getCart()->sum();
			$culture = $this->getCart()->getCulture();
			$this->CartSummaryGrid->Columns[2]->FooterText = FU::Currencyfy($sum, null, $culture);//<br/><span class="vcDPH">'.($sum*1.19)."</span>";
			$this->CartSummaryGrid->DataSource = $this->getCart();
			$this->CartSummaryGrid->databind();
		}*/
		parent::onPreRender();
	}
	
}
