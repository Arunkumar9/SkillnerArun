<?php
class BErrorPanel extends TCustomValidator {
	public function onInit($param)
	{
		parent::onInit($param);
		//protected function createErrorPanel() {
			$errorPanel = Prado::createComponent('TPanel');
			$errorPanel->cssClass = 'formErrorPopup';
			$errorPanel->Style->CustomStyle = 'display: none';
			$this->Controls->add($errorPanel);
			$this->ClientSide->OnValidationError = "$('".$errorPanel->ClientID."').show();";
		//}
	}
}
	?>
