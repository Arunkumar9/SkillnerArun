<?php
/* FExtAdminLogin.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on Jun 1, 2007
 */
class FExtAdminLogin extends TTemplateControl
 {
 	public function login($sender,$param)
	{
		$manager=Prado::getApplication()->getModule('auth');
		if(!$manager->login($this->Username->Text,$this->Password->Text))
			$param->IsValid=false;
	}
 	
 	
 	
 }
?>
