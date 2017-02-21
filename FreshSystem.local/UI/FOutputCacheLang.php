<?php
  class FOutputCacheLang extends TOutputCache
  {
	/**
	 * Calculates the base cache key.
         * amended by culture info.
	 * @return string base cache key
	 */
	protected function getBaseCacheKey()
	{
  		$culture = ($this->getApplication()->Parameters['translatable']) ? '::'.$this->getApplication()->getGlobalization()->getCulture() : '';
        $host = $this->getRequest()->getUrl()->getHost();        
		return parent::getBaseCacheKey().'::'.$host.$culture;
	}
}