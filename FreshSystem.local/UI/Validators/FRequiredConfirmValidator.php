<?php



class FRequiredConfirmValidator extends TRequiredFieldValidator
{

	/**
	 * This method overrides the parent's implementation.
	 * The validation succeeds if the input component changes its data
	 * from the {@link getInitialValue InitialValue} or the input control is not given.
	 *
	 * Validation will also succeed if input is of TListControl type and the
	 * number of selected values different from the initial value is greater
	 * than zero.
	 *
	 * @return boolean whether the validation succeeds
	 */
	protected function evaluateIsValid()
	{
		if ($this->getConfirmation())
			return parent::evaluateIsValid();
		else
			return true;
	}
	
	
	/**
	 * @return id of control that confirm validation
	 * upon postback, the validation fails.
	 */
	public function getControlToConfirm()
	{
		return $this->getViewState('ControlToConfirm','');
	}

	/**
	 * @param string id of control that confirm validation
	 */
	public function setControlToConfirm($value)
	{
		$this->setViewState('ControlToConfirm',TPropertyValue::ensureString($value),'');
	}
	
	/**
	 * @return boolean true if enable validation or false to not validate (be always validated)
	 */
	protected function getConfirmation()
	{
		list($id,$property) = explode('.',$this->getControlToConfirm(),2);
		$property = ($property) ? $property : 'Checked';
		if($id!=='' && ($control=$this->findControl($id))!==null)
			return $control->getSubProperty($property);
		else
			return true;
	}
	
}

