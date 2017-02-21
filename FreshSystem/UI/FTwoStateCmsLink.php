<?php

/**
 * Description of FTwoStateCmsLink
 *
 * @author rosa
 */
class FTwoStateCmsLink extends FCmsLink {

    public function getCmsLinkGuest()
    {
	return $this->getViewState('CmsLinkGuest');
    }

    public function setCmsLinkGuest($value)
    {
	$this->setViewState('CmsLinkGuest', $value);
    }

    public function getCmsLinkLogged()
    {
	return $this->getViewState('CmsLinkLogged');
    }

    public function setCmsLinkLogged($value)
    {
	$this->setViewState('CmsLinkLogged', $value);
    }

public function getTextGuest()
    {
	return $this->getViewState('TextGuest');
    }

    public function setTextGuest($value)
    {
	$this->setViewState('TextGuest', $value);
    }

    public function getTextLogged()
    {
	return $this->getViewState('TextLogged');
    }

    public function setTextLogged($value)
    {
	$this->setViewState('TextLogged', $value);
    }

public function onPreRender($param)
    {

	if (!$this->User->IsGuest)
	{
	    $this->CmsLink = $this->CmsLinkLogged;
	    $this->Text = $this->TextLogged;
	}
	else
	{
	    $this->CmsLink = $this->CmsLinkGuest;
	    $this->Text = $this->TextGuest;
	}
	parent::onPreRender($param);
    }


}
