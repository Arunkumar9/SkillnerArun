<?php
  /**
     * 
     * Accepts a JSON-encoded string, and removes quotes around values of
     * keys specified in the $keys array.
     * 
     * Sometimes, such as when constructing behaviors on the fly for "onSuccess"
     * handlers to an Ajax request, the value needs to **not** have quotes around
     * it. This method will remove those quotes and perform stripslashes on any
     * escaped quotes within the quoted value.
     * 
     * @param string $encoded JSON-encoded string
     * 
     * @param array $keys Array of keys whose values should be de-quoted
     * 
     * @return string $encoded Cleaned string
     * 
     */
    protected function _deQuote($encoded, $keys)
    {
        foreach ($keys as $key) {
            $pattern = "/(\"".$key."\"\:)(\".*(?:[^\\\]\"))/U";
            $encoded = preg_replace_callback(
                $pattern,
                array($this, '_stripvalueslashes'),
                $encoded
            );
        }
        
        return $encoded;
    }
    
    /**
     * 
     * Method for use with preg_replace_callback in the _deQuote() method.
     * 
     * Returns \["keymatch":\]\[value\] where value has had its leading and
     * trailing double-quotes removed, and stripslashes() run on the rest of
     * the value.
     * 
     * @param array $matches Regexp matches
     * 
     * @return string replacement string
     * 
     */
    protected function _stripvalueslashes($matches)
    {
        return $matches[1].stripslashes(substr($matches[2], 1, -1));
    }
  ?>
