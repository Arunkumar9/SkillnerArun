<?php
class FCachedHead extends FHead
{

	private $_IE8compat=true;
        private $_duration=3600;
        private $_key;

	/**
	 * @return integer number of seconds that the data can remain in cache. Defaults to 60 seconds.
	 * Note, if cache dependency changes or cache space is limited,
	 * the data may be purged out of cache earlier.
	 */
	public function getDuration()
	{
		return $this->_duration;
	}

	/**
	 * @param integer number of seconds that the data can remain in cache. If 0, it means data is not cached.
	 * @throws TInvalidDataValueException if the value is smaller than 0.
	 */
	public function setDuration($value)
	{
		if(($value=TPropertyValue::ensureInteger($value))<0)
			throw new TInvalidDataValueException('outputcache_duration_invalid',get_class($this));
		$this->_duration=$value;
	}
    /**
     * Getter for property IE8compat
     * render compatibility tag for IE8
     * @return boolean
     */
    public function getIE8compat() {

	//$browser = $this->getRequest()->getBrowser();
	//$isIE8 = ($browser['majorver']>7 && $browser['browser']=='MSIE');

	return ($this->_IE8compat);// && $isIE8);
    }

    /**
     * Setter for property IE8compat
     * render compatibility tag for IE8
     * @param $value boolean
     */
    public function setIE8compat($value) {
	$this->_IE8compat = TPropertyValue::ensureBoolean($value);
    }

    public function getIE8compatTag()
    {
	return ($this->getIE8compat())?'<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />':'';
    }

	public function onInit($param)
	{
	    parent::onInit($param);
            //$this->determineCachability();
            if ($this->getPage()->hasProperty('PageCache') && ($pc = $this->getPage()->PageCache)) {
                    $this->setDuration($pc->getDuration());
                    //$pc->OnCheckDependency[] = array($this,'checkPageCache');
            }
	    if ($this->getIE8compat())
		$this->Response->appendHeader("X-UA-Compatible: IE=EmulateIE7");
	}

        public function checkPageCache($sender,$param) {
            $param->setIsValid($this->_contentCached);
        }

        public function getKey() {

                $rq = $this->getRequest();
                //$key = $rq->itemAt("uid")."|";
                $key .= $rq->itemAt("catid")."|";
                $key .= $rq->itemAt("newsid")."|";
                $key .= $rq->itemAt("category")."|";
                $key .= $rq->itemAt("code")."|";
                if ($c = $this->getApplication()->getModule('cms')->getContainer())
                    $key .= $c->uid."|";
                $key .= ($this->getApplication()->Parameters['translatable']) ? $this->getApplication()->getGlobalization()->getCulture() : '';
                //if ($pc = $this->getPage()->PageCache) {}
                return $key;

        }

        //public function
	/**
	 * Renders the head control.
	 * @param THtmlWriter the writer for rendering purpose.
	 */
	public function render($writer)
	{
                $key = $this->getKey();

                $cache = $this->getApplication()->getCache();
                if ($cache)
                {
                   $content = $cache->get($key);
                   if( $content != null)
			$writer->write($content[0]);
                    else
                    {
			$textWriter=new TTextWriter;

			parent::render(new THtmlWriter($textWriter));
			$content=$textWriter->flush();
                        $data = $data=array($content);
			$cache->set($key,$data,$this->getDuration());
			$writer->write($content);
                    }
                }
		else
                    parent::render($writer);

	}
	public function TO_BE_render($writer)
	{
		if($this->_dataCached && $this->_pageCached)
			$writer->write($this->_contents);
		else if($this->_cacheAvailable)
		{
			$textWriter=new TTextWriter;

			parent::render(new THtmlWriter($textWriter));
			$content=$textWriter->flush();
			$data=array($content,time());
			$this->_cache->set($this->getCacheKey(),$data,$this->getDuration());
			$writer->write($content);
		}
		else
			parent::render($writer);
	}

        private function determineCacheability()
	{
		if(!$this->_cacheChecked)
		{
			$this->_cacheChecked=true;
			if($this->_duration>0 )
			{

                                $this->_cache=$this->getApplication()->getCache();
				if($this->_cache!==null)
				{
					$this->_cacheAvailable=true;
					$data=$this->_cache->get($this->getCacheKey());
					if(is_array($data))
						$this->_dataCached=true;
					else
						$this->_dataCached=false;
					if($this->_dataCached)
						list($this->_contents,$this->_cacheTime)=$data;
				}
			}
		}
	}
}	
