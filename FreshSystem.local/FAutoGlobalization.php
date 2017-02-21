<?php

class FAutoGlobalization extends TGlobalizationAutoDetect
{
	private $_currency = array();
	private $_numformat;
	
	public function init($xml)
	{
		parent::init($xml);
		$this->Application->OnBeginRequest[] = array($this, 'beginRequest');
		$this->Application->OnLoadState[] = array($this, 'loadState');
	}

	public function loadState($sender, $param)
	{
        if (Prado::getApplication()->getGlobalState('translation_updated'))
        {
          $cache = $this->TranslationConfiguration['cache'];
          
		  $files = scandir($cache);
          foreach($files as $file)
			  unlink($cache.'/'.$file);

          Prado::Trace('Unlinking cache '.$cache,'Json');
	      Prado::getApplication()->setGlobalState('translation_updated',false);
        }
	}
	public function beginRequest($sender, $param)
	{
		if(null == ($culture=$this->Request['lang']))
		{
                    if ($this->getDefaultCulture()) {
                      $culture = $this->getDefaultCulture();
                    } else {
			if(null !== ($cookie=$this->Request->Cookies['lang']))
				$culture = $cookie->getValue();
		}
		}
		$culture = substr($culture,0,2);
		if(is_string($culture))
		{
			$info = new CultureInfo();
			if($info->validCulture($culture))
			{
				$this->setCulture($culture);
                                if (!$this->getDefaultCulture())
				$this->Response->Cookies[] = new THttpCookie('lang',$culture);
			}
		}
		elseif (strlen($this->getCulture())>2)
		{
			$this->setCulture(substr($this->getCulture(),0,2));
		}
                Prado::trace('Culture: '.$this->getCulture().' lang='.$this->Request['lang'],'Json');
		
	}

        public function getLongCulture() {
		if (strlen($this->getCulture())>2)
                     return $this->getCulture();

                if ($this->getCulture()=='cs')
                        return 'cs_CZ.'.$this->getCharset();
                elseif ($this->getCulture()=='en')
                        return 'en_US.'.$this->getCharset();


                return $this->getCulture().'_'.strtoupper($this->getCulture()).'.'.$this->getCharset();

        }
	
	public function getCurrency($culture=null)
	{
		$culture = ($culture===null) ? $this->getCulture() : $culture;
		
		if ($this->_currency[$culture]===null)
		{
			$this->_currency[$culture] = CurrencyRecord::finder()->findByCulture($culture);
			if (!$this->_currency[$culture] && $culture != 'cs')
				return $this->getCurrency('cs');
		}
		return $this->_currency[$culture];
		
	}
	
	public function getCurrencyFormat($price,$priceWrap=null,$culture=null)
	{
		$culture = ($culture===null) ? $this->getCulture() : $culture;
		$cur = $this->getCurrency($culture);
		$curname = $cur->currency_local;
		$pricenum = $price; 
		$ninfo = NumberFormatInfo::getInstance($this->Culture);
		$ninfo->DecimalDigits = $cur->precision;
		$nf = new NumberFormat($ninfo);
		$price = $nf->format($pricenum,'d','');  //number_format($price,$cur->precision);
		if ($priceWrap)
			$price = sprintf('<span class="%s" >%s</span>',$priceWrap,$price);
		
		if (false && strcasecmp('sk',$culture)===0)
		{
			$eur = $this->getCurrency('de')->conversion;
			$sk = $cur->conversion;
			$eurprice = number_format($pricenum / 30.126, 2, ',', '&nbsp;');
			return sprintf('<span class="%s" >%s</span>',$priceWrap,$eurprice).'&nbsp;€';//$price.'&nbsp;'.$curname.'&nbsp;/&nbsp;'.$eurprice.'&nbsp;€';
		}
		//if (!(strcasecmp('sk',$culture)!==0 && strcasecmp('cs',$culture)!==0)
			//return '&nbsp';
			
		if ($cur->leftside)
			return $curname.'&nbsp;'.$price;
		else
			return $price.'&nbsp;'.$curname;
	}
	
}

