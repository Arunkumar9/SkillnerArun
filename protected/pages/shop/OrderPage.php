<?php
Prado::using('Application.pages.shop.*');
Prado::using('Application.layout.contents.shop.*');
class OrderPage extends EshopProductDetail
{
	
	public function onInit($param)
	{
		FBasePage::onInit($param);
		$this->attachEventHandler('OnBack',array($this,'OnBack'));
		$this->attachEventHandler('OnInsertToCart',array($this,'OnInsertToCart'));
		$this->attachEventHandler('OnSubmitCart',array($this,'OnSubmitCart'));
		$this->attachEventHandler('OnPersonalData',array($this,'OnPersonalData'));
		$this->attachEventHandler('OnFinalizeOrder',array($this,'OnFinalizeOrder'));
		
//		if (!isset($this->Request['catid']))
	//		$this->View->ActiveViewIndex = 1;

	//	if (!$this->getUser()->IsGuest && $this->View->ActiveViewIndex == 2)
	//		$this->View->ActiveViewIndex = 3;		

	//	if ($this->IsCallback)
	//		$this->CallbackClient->callClientFunction('deleteValidatorManager',$this->Form->ClientID);
	}
	
	
	public function OnInsertToCart($sender,$param)
	{
		if ($this->Page->IsValid)
			$this->View->ActiveViewIndex = 0;
	}
	
	public function OnSubmitCart($sender,$param)
	{
		//if (!$this->getUser()->IsGuest)
			//$this->View->ActiveViewIndex = 3;
		//else
		$this->View->ActiveViewIndex = 1;
	}
	
	public function OnPersonalData($sender,$param)
	{
		if ($this->Page->IsValid)
			$this->View->ActiveViewIndex = 2;
	}

	public function OnFinalizeOrder($sender,$param)
	{
		$this->View->ActiveViewIndex = 3;
	}
	
	public function OnBack($sender,$param)
	{
		if ($av = $this->View->ActiveViewIndex)
			$this->View->ActiveViewIndex = $av-1;
		else
		{
			$this->Application->Modules['cart']->saveCart();
			$this->Response->redirect($this->Page->getContainer('Home')->Href);
		}
	}

           /*    public function onPreRender($param)
                {
                    $cs = $this->getClientScript();

                   if (!$this->getIsCallback()) {
                    //$cs->registerHeadScriptFile('JQueryTools',"http://cdn.jquerytools.org/1.2.3/full/jquery.tools.min.js");
                    $cs->registerHeadScriptFile('JQuery',"http://code.jquery.com/jquery-1.4.2.min.js");
                    $cs->registerHeadScriptFile('jQUery.Uniform',"/lib/jQuery.Uniform/jquery.uniform.min.js");
                    $cs->registerStyleSheetFile('jQUery.Uniform',"/lib/jQuery.Uniform/css/uniform.default.css");
                   }
                   else {
                    $id = $this->ActiveReceiver->ClientID;
               ///     $this->getCallbackClient()->callClientFunction('Prado.UniForm',"#$id select, #$id input:text, #$id input:radio, #$id textarea");
                   }
                   parent::onPreRender($param);
                }
*/
}
