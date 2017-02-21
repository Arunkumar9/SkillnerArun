<?php
/* FBaseEditPage.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on May 29, 2007
 */
 
 class FBaseEditPage extends FBasePage
 {
 	public function onInit($param)
 	{
 		parent::onInit($param);
 		$level = Prado::getApplication()->getUser()->level;
 		$noEditPagePath = preg_replace('/Edit$/','',$this->PagePath);
 		if (false && !($level>10))
 			$this->gotoPage($noEditPagePath);
 	}
 	
/*
 	public function saveForm($sender,$event)
 	{
 		$this->saveButton->Text = $this->ContainerName->Text;
 	}

*/ }
?>
