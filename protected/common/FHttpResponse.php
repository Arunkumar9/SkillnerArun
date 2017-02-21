<?php

class FHttpResponse extends THttpResponse
{
	const AT_SYMBOL = ' [AT] ';
        const DOT_SYMBOL = ' [DOT] ';
        const SPAN_COVER = '<span class="schovka" >null</span>';

        private $_prefix = 'contacts';

        public function init($xml)
	{
		parent::init($xml);
		$this->Application->OnSaveState[] = array($this, 'saveState');
//		$this->Application->OnPreFlushOutput[] = array($this, 'preFlushOutput');
	}

	public function preFlushOutput()
	{
              $response = $this->getApplication()->getResponse();
              $text = $response->getContent();
              $text = self::ObfuscateEmails($text);
              $response->clear();
              $response->write($text);
	}

        public function saveState()
        {
            $page = $this->getApplication()->getService()->getRequestedPage();
            $cs = $page->getClientScript();
            $cs->registerHeadScriptFile("Fresh:js:".__CLASS__,$this->publishAsset("email.filter.js"));
            $cs->registerStyleSheet("Fresh:css:".__CLASS__,".schovka { display: none }");
            $cs->registerEndScript("Fresh:email.filter","Fresh.email.filter();");
        }

	public function write($text)
	{
              $text = self::ObfuscateEmails($text);
              parent::write($text);
	}

        public function getPrefix()
        {
            return $this->_prefix;
        }

        public function setPrefix($value)
        {
            $this->_prefix = $value;
        }

        public static  function ObfuscateEmails($text)
        {
              $text = preg_replace("/\"mailto:([a-z0-9._%-]+)\@([a-z0-9._%-]+)\.([a-z]{2,4})\"/i", $this->_prefix.'/$3/$2/$1', $text);
              $text = preg_replace("/([a-z0-9._%-]+)\@([a-z0-9._%-]+)\.([a-z]{2,4})/i", "$1@" . self::SPAN_COVER .  "$2"  . "$3", $text);
              return $text;

        }
	
	
}

