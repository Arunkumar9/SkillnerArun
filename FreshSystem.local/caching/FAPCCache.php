<?php
/**
 * FAPCCache class file
 *
 * @author Jan Rosa <jan.rosa@freshconcept.cz>
 * @link http://www.freshconcept.com/
 * @package FreshSystem.Caching
 */

/**
 * FAPCCache class
 *
 * FAPCCache implements selective cache flush.
 *
 * @author Jan Rosa <jan.rosa@freshconcept.cz>
 * @link http://www.freshconcept.com/
 */
class FAPCCache extends TAPCCache
{
        private $_refKey;

        public function setRefKey($value)
        {
            $this->_refKey = $value;
        }

        public function getRefKey()
        {
            $id = ($this->_refKey) ? $this->_refKey : $this->getApplication()->getID();
            return 'PRADO::REF::'.$this->_refKey;
        }

        protected function addRef($key,$class=1)
        {
            $refs = $this->getValue($this->getRefKey());
            $refs = (is_array($refs)) ? $refs : array();
            $refs[$key]=$class;
            $this->setValue($this->getRefKey(),$refs,0);
        }

        protected function deleteRef($key)
        {
            $refs = $this->getValue($this->getRefKey());
            $refs = (is_array($refs)) ? $refs : array();
            if (isset($refs[$key]))
                unset($refs[$key]);
            $this->setValue($this->getRefKey(),$refs,0);
        }

	/**
	 * Stores a value identified by a key in cache.
	 * This is the implementation of the method declared in the parent class.
	 *
	 * @param string the key identifying the value to be cached
	 * @param string the value to be cached
	 * @param integer the number of seconds in which the cached value will expire. 0 means never expire.
	 * @return boolean true if the value is successfully stored into cache, false otherwise
	 */
	protected function setValue($key,$value,$expire,$class=1)
	{
                $this->addRef($key,$class);
                return apc_store($key,$value,$expire);
	}

        /**
	 * Deletes a value with the specified key from cache
	 * This is the implementation of the method declared in the parent class.
	 * @param string the key of the value to be deleted
	 * @return boolean if no error happens during deletion
	 */
	protected function deleteValue($key)
	{
             $this->deleteRef($key);
             return apc_delete($key);
	}

	/**
	 * Stores a value identified by a key into cache if the cache does not contain this key.
	 * This is the implementation of the method declared in the parent class.
	 *
	 * @param string the key identifying the value to be cached
	 * @param string the value to be cached
	 * @param integer the number of seconds in which the cached value will expire. 0 means never expire.
	 * @return boolean true if the value is successfully stored into cache, false otherwise
	 */
	protected function addValue($key,$value,$expire,$class=1)
	{
		if(function_exists('apc_add')) {
                        $this->addRef($key,$class);
			return apc_add($key,$value,$expire);
		} else {
			throw new TNotSupportedException('apccache_add_unsupported');
		}
	}

        /**
	 * Deletes all referenced values from cache. Possibly filtered by $class
	 * @param string the class to be flushed
	 * Be careful of performing this operation if the cache is shared by multiple applications.
	 */
	public function flush($class=null)
	{
            if ($refs = $this->getValue($this->getRefKey()))
            {
                foreach($refs as $key => $val)
                {
                    if ($class === null || $val === $class)
                    {
                        apc_delete($key);
                    }
                }
            }
            else {
                return apc_clear_cache('user');
            }
	}
}

