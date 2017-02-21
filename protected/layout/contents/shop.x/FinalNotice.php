<?php

class FinalNotice extends FShoppingTemplateControl
{

	public function onPreRender($param)
	{
		if (!$this->IsCartEmpty && $this->Cart->Finalized)
			$this->generateOrder();

		parent::onPreRender($param);
	}
	
	protected function generateOrder($template='notice1')
	{

		$connection = TActiveRecord::getActiveDbConnection();
		if (!$connection->CurrentTransaction)
	        $transaction=$connection->beginTransaction();
			
		try {
	
			$this->Cart->createOrder();		

			$clientEmail = array($app->Parameters['emailAdmin'], $app->Parameters['siteTitle']);
			$clientEmailCC = null;
		    
			if ($app->Parameters['emailAdmin'.$culture])
			{
				$clientEmailCC = $clientEmail;
				$clientEMail = array($app->Parameters['emailAdmin'.$culture], $app->Parameters['siteTitle'].' '.$culture);
			}

			$mTpl = new FMailTemplate('Application.mails.'.$template,$this->Page);
			$subject = $mTpl->getSubject();
			$text = $mTpl->flush();
			$app = $this->gtApplication();
			$culture = strtolower($app->Globalization->Culture);
			$cust = array(		
				'subject'=>	$subject,
				'text' =>	$text,
				'from'=>	array($this->getApplication()->Parameters['emailAdmin'], $this->getApplication()->Parameters['siteTitle']),
				'to'=> 		array(array($this->Cart->Address->Email,$this->Cart->Address->CustomerName)),
			);
				
			$client = array(		
				'subject'=>	$subject,
				'text' =>	$text,
				'from'=>	array($this->Cart->Address->Email,$this->Cart->Address->CustomerName),
				'to'=> 		array($clientEmail),
			);
			if ($clientEmailCC)
				$client['cc']=array($clientEmailCC);
		
			$this->getApplication()->Modules['mail']->send($cust);
			sleep(5);
			$this->getApplication()->Modules['mail']->send($client);
			$this->Cart->reset();
			$transaction->commit();
			$cp = new TCallbackEventParameter($this->getResponse(),null);
			$this->broadcastEvent('OnCartChanged',$this,$cp);

		} catch (Exception $e) {
			$this->EmailSuccess->Visible = false;
			$this->EmailError->Visible = true;
			$transaction->rollback();
			$this->Cart->Finalized = false;
			$this->Cart->resetOrderNumber();
			Prado::log('ERROR '.$e->getMessage());
		}

		
	}
	
	
}
