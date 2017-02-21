<?php

class FStyledTemplateControl extends TTemplateControl
{
	private $_cssclass;
	/**
	 * @param string the css class of the control
	 */
	public function setCssClass($value)
	{
		$this->setViewState('CssClass',$value,null);
	}

	/**
	 * @return string the css class of the control
	 */
	public function getCssClass()
	{
		return $this->getViewState('CssClass',null);
	}

	public function setSessionState($key,$value,$defaultValue=null,$ID=null)
	{
		$this->Session->open();
		if (!$this->getID(true) && $ID === null)
			throw new TConfigurationException('Session state for named objects only');

		$k = (($ID === null)?$this->getID(true):$ID).'$'.$key;
		if($value===$defaultValue)
		{
			if (is_object($this->Session[$k]))
				$this->Session[$k]->Clear();
		}
		else
		{
			$this->Session[$k]=$value;
			//echo "set $k -> $value"."\n";
		}
	}

	public function getSessionState($key,$defaultValue=null,$ID=null)
	{
		if (!$this->getID(true) && $ID === null)
			throw new TConfigurationException('Session state for named objects only');

		$k = (($ID === null)?$this->getID(true):$ID).'$'.$key;
		return isset($this->Session[$k])?$this->Session[$k]:$defaultValue;
	}

}
