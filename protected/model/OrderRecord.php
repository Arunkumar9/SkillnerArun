<?php
/**
 * Auto generated by prado-cli.php on 2008-10-20 11:24:56.
 */
class OrderRecord extends OrderAR
{

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
	
	public function getOrderNumber()
	{
		return strftime('%Y',$this->date_created).sprintf('%05d',$this->uid);
	}
	
	public function save()
	{
		if (!$this->uid)
			$this->date_created = time();
			
		//$order = $this->DataAsObject;
		//try {
	//		$this->price = $order->sumWithAddOn();
	//	}
	//	catch (Exception $e) {}
		parent::save();
	}
	
	
}

?>