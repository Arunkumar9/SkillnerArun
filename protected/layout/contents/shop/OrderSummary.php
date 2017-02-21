<?php

class OrderSummary extends FShoppingTemplateControl
{

	public function finalizeOrderClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

		$this->getCart()->setFinalized(true);
		$this->broadcastEvent('OnFinalizeOrder',$sender,$param);
	}

	
}
