<?php
/**
 * BMapPageAdapter.php
 * 
 * @author Bradley Booms <Bradley.Booms@nsighttel.com>
 * @version Creation Date: Oct 7, 2008
 */

prado::using('BMapCallbackClientScript');

/**
 * BMapPageAdapter class
 * 
 * @author Bradley Booms <Bradley.Booms@nsighttel.com>
 * @version Modified Date: Oct 7, 2008
 * @package BActiveGoogleMap
 * @subpackage CallbackClientScript
 */
class BMapPageAdapter extends TActivePageAdapter
{
	/**
	 * @var TCallbackClientScript callback client script handler
	 */
	private $_callbackClient;
	
	/**
	 * Gets the callback client script handler. It handlers the javascript functions
	 * to be executed during the callback response.
	 * @return TCallbackClientScript callback client handler.
	 */
	public function getCallbackClientHandler()
	{
		if(is_null($this->_callbackClient))
			$this->_callbackClient = new BMapCallbackClientScript;
		return $this->_callbackClient;
	}
}
?>