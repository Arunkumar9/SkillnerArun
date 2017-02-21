<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of FActivePager
 *
 * @author rosa
 */
class FActivePager  extends TActivePager implements IBroadcastEventReceiver
{
	private $_tagname='div';

        public function getTagName()
        {
            return $this->_tagname;
        }
        
	public function setTagName($value)
	{
		$this->_tagname = (string) $value;
	}

        public function broadcastEventReceived($sender,$param)
	{
		if (!$this->Page->IsCallback)
			return;
		$on = $this->getListenOn();
		if ($on[0]=='/')
		{
			if (preg_match($on,$param->name))
				$this->render($param->parameter->NewWriter);
		}
		elseif (stristr($on,$param->name))
				$this->render($param->parameter->NewWriter);

	}
	
	public function getListenOn()
	{
		return $this->getViewState('ListenOn','');
	}
	
	public function setListenOn($value)
	{
		$this->setViewState('ListenOn',TPropertyValue::ensureString($value),'');
	}

	/**
	 * Creates a pager button.
	 * Depending on the button type, a TLinkButton or a TButton may be created.
	 * If it is enabled (clickable), its command name and parameter will also be set.
	 * Derived classes may override this method to create additional types of buttons, such as TImageButton.
	 * @param string button type, either LinkButton or PushButton
	 * @param boolean whether the button should be enabled
	 * @param string caption of the button.
	 * @param string CommandName corresponding to the OnCommand event of the button.
	 * @param string CommandParameter corresponding to the OnCommand event of the button
	 * @return mixed the button instance
	 */
	protected function createPagerButton($buttonType,$enabled,$text,$commandName,$commandParameter)
	{
            $button = parent::createPagerButton($buttonType,$enabled,$text,$commandName,$commandParameter);
            $button->setCssClass('cls'.$commandName);
            return $button;
        }
}