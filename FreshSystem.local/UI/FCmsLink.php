<?php

/**
 * Description of FCmsLink
 *
 * @author rosa
 */
class FCmsLink extends THyperLink {

    public function getCmsLink()
    {
	return $this->getViewState('CmsLink');
    }

    public function setCmsLink($value)
    {
	$this->setViewState('CmsLink', $value);
    }

    public function onPreRender($param)
    {
        if ($cms = $this->CmsLink)
        {
            if (!$this->NavigateUrl && ($container = $this->Page->getContainer($cms)))
            {
                $this->NavigateUrl =$container->getAbsoluteHref(true,array(),true);
            }
            if (!$this->Text)
                $this->Text = ($this->getApplication()->Parameters['translatable']) ? $this->Page->getContainer($cms)->nameLangAct : $this->Page->getContainer($cms)->name;
        }
        parent::onPreRender($param);
    }


    //put your code here
}
