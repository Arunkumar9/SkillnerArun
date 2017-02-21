<?php

class FActivePanelReceiver extends TActivePanel implements IBroadcastEventReceiver
{
	private $_tagname='span';

	public function broadcastEventReceived($sender,$param)
	{
		if (!$this->Page->IsCallback)
			return;
		$on = $this->getListenOn();
		$eff = $this->getEffectOn();
		if ($on[0]=='/')
		{
			if (preg_match($on,$param->name))
				$this->render($param->parameter->NewWriter);
		}
		elseif (stristr($on,$param->name))
				$this->render($param->parameter->NewWriter);

		if ($this->Parent instanceof IEffectExecutor && stristr($eff,$param->name) )
		{
		    $this->Parent->executeEffects($sender,$param);
		}

	}
	
	public function getListenOn()
	{
		return $this->getViewState('ListenOn','');
	}
	
	public function setListenOn($value)
	{
		$this->setViewState('ListenOn',TPropertyValue::ensureString($value),'');
	}

	public function getEffectOn()
	{
		return $this->getViewState('EffectOn','');
	}

	public function setEffectOn($value)
	{
		$this->setViewState('EffectOn',TPropertyValue::ensureString($value),'');
	}

	public function setTagName($value)
	{
		$this->_tagname = (string) $value;
	}
	/** 
	 *
	 * @return string tag name of the panel
	 */
	public function getTagName()
	{
		return $this->_tagname;
	}

}

interface IEffectExecutor
{
    function executeEffects($sender,$param);

}