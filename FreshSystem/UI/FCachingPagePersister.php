<?php

Prado::using("System.Web.UI.TCachePageStatePersister");
class FCachingPagePersister extends TCachePageStatePersister {
    
    
	/**
	 * Saves state in cache.
	 * @param mixed state to be stored
	 */
	public function save($state)
	{
		$data=serialize($state);
        $timestamp=(string)microtime(true);
		$key=$this->calculateKey($timestamp);
		$this->getCache()->add($key,$data,$this->_timeout);
		$this->getCache()->add($this->calculateKey("start"),$data,$this->_timeout);
		$this->_page->setClientState(TPageStateFormatter::serialize($this->_page,$timestamp));
	}

	/**
	 * Loads page state from cache.
	 * @return mixed the restored state
	 * @throws THttpException if page state is corrupted
	 */
	public function load()
	{
		if(($timestamp=TPageStateFormatter::unserialize($this->_page,$this->_page->getRequestClientState()))!==null)
		{
			$key=$this->calculateKey($timestamp);
			if(($data=$this->getCache()->get($key))!==false)
				return unserialize($data);
		} else {
			$key=$this->calculateKey("start");
			if(($data=$this->getCache()->get($key))!==false)
				return unserialize($data);
        }
        return array();
		throw new THttpException(400,'cachepagestatepersister_pagestate_corrupted');
	}
    
    
}