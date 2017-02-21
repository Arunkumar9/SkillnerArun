<?php
/* 
 * LanguageSwitch template file
 */

class LanguageSwitch extends TWebControl
{
    private $_langs;
    private $_captions;
    private $_current;

    public function getCurrentLang()
    {
        return $this->_current;
    }

    public function setCurrentLang($value)
    {
        $this->_curent = $value;
    }

    public function getLangs()
    {
        return $this->_langs;
    }

    public function setLangs($value)
    {
        $this->_langs = $value;
    }

    public function getCaptions()
    {
        return $this->_captions;
    }

    public function setCaptions($value)
    {
        $this->_captions = $value;
    }

    public function getLanguages()
    {
        $langs = explode(',', $this->_langs);
        $captions = explode(',', $this->_captions);
        if (count($captions) != count($langs))
            throw new TConfigurationException("Languages and captions mismatch");

        return array_combine($langs, $captions);
    }



    public function renderContents($writer)
    {
        parent::renderContents($writer);
        foreach ($this->getLanguages() as $key => $value) {

            $url = $this->getPage()->giveRequestedPageUrlWithLinks(array('lang'=>$key));
            $caption = $value;
            $culture = $this->getApplication()->getGlobalization()->getCulture();
            if ($key == $culture && $this->_current == 'dimmed')
                    $dimmed = " dimmed";
            else
                    $dimmed = "";
            $class = $this->getCssClass()." ".$key.$dimmed;
            if ($key != $culture || $this->_current != 'hidden')
                $writer->write("<a class=\"{$class}\" href=\"{$url}\"><span>{$caption}</span></a>\n");
        }
    }

}