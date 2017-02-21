<?php

class FEmailObfuscator extends TControl
{
	const AT_SYMBOL = ' [AT] ';
        const DOT_SYMBOL = ' [DOT] ';
        const SPAN_COVER = '<span class="schovka" >null</span>';

        public function OnInit($param)
	{
		parent::OnInit($param);
		$this->Application->OnPreFlushOutput[] = array($this, 'preFlushOutput');
	}

	public function preFlushOutput()
	{
             $response = $this->getApplication()->getResponse();
              $text = $response->getContents();
              $text = self::ObfuscateEmails($text);
              $response->clear();
              $response->write($text);
	}

        public function OnPreRender($param)
        {
            //die(__CLASS__);
            parent::onPreRender($param);
            $page = $this->getPage();
            $cs = $page->getClientScript();
            $cs->registerPradoScript('prado');
            $cs->registerHeadScriptFile("Fresh:js:".__CLASS__,$this->publishAsset("email.filter.js"));
            $cs->registerStyleSheet("Fresh:css:".__CLASS__,".schovka { display: none }");
            $cs->registerEndScript("Fresh:email.filter","Fresh.email.geo_filter();");
        }


        /**
         *
         * @param <type> $text
         * @return <type>
         */
        public static  function ObfuscateEmails($text)
        {
            Prado::trace(__CLASS__." obfuscating ", "json");
              //$baseDomain = Prado::getApplication()->Parameters['baseDomain'];
              $text = preg_replace("/\"mailto:([a-z0-9._%-]+)\@([a-z0-9._%-]+)\.([a-z]{2,4})\"/i", '"'.'/contacts/$3/$2/$1" rel="nofollow"', $text);
              $text = preg_replace("/([a-z0-9._%-]+)\@([a-z0-9._%-]+)\.([a-z]{2,4})/i", "$1@" . self::SPAN_COVER .  '$2.$3', $text);
              return $text;

        }
	
	
}

