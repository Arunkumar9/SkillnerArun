<?php
/**
 * FXCache class file
 *
 * @author Jan Rosa <jan.rosa@freshconcept.cz>
 * @link http://www.freshconcept.com/
 * @package FreshSystem.Caching
 */

/**
 * FXCache class
 *
 * FXCache implements selective cache flush.
 *
 * @author Jan Rosa <jan.rosa@freshconcept.cz>
 * @link http://www.freshconcept.com/
 */
Prado::using('System.Caching.TXCache');
class FXCache extends TXCache
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
            xcache_set($this->getRefKey(),$refs,0);
        }

        protected function deleteRef($key)
        {
            $refs = $this->getValue($this->getRefKey());
            $refs = (is_array($refs)) ? $refs : array();
          //  if (isset($refs[$key]))
                unset($refs[$key]);
            xcache_set($this->getRefKey(),$refs,0);
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
	protected function setValue($key,$value,$expire)
	{
                $this->addRef($key,1);
		return xcache_set($key,$value,$expire);
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
	protected function addValue($key,$value,$expire)
	{
            if (!xcache_isset($key))
            {
                $this->addRef($key,1);
                return $this->setValue($key,$value,$expire);
            }
            return  false;
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
		return xcache_unset($key);
	}

	/**
	 * Deletes all values from cache.
	 * Be careful of performing this operation if the cache is shared by multiple applications.
	 */
	public function flush($force=false,$class=null)
	{
//echo "aaa";
            if (!$force && $refs = $this->getValue($this->getRefKey()))
            {
                $i=0;
                foreach($refs as $key => $val)
                {
                    //Prado::trace(__CLASS__.' flushing '.$key,'Json');
                    if ($class === null || $val === $class)
                    {
                        $this->deleteValue($key);
                        $i++;
                    }
                }
                //xcache_unset($this->getRefKey());
                return $i;
            }
            else {
               // return xcache_clear_cache();
            }
	}
}

?>
