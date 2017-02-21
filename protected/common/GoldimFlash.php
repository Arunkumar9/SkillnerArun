<?php
 
class GoldimFlash extends FFlashBlock
{

	public function getThemeFlash()
	{
		if ($this->Request->contains('stheme'))
			return 'flash'.$this->Request['stheme'].'_01';
		else
			return 'flashHome_01';
	}
	
}
