<?php
/**
 * FirePHP wrapped in a Prado module.
 * 
 * @see http://www.firephp.org/
 * 
 * @author Bart Lewis <bartlewis@gmail.com>
 * @package App_Code.Util
 */
class AppFirePhp extends ModuleWrapper{
	/**
	 * @var object FirePHP
	 */
	private $_firePhp = null;

	/**
	 * @var boolean $_enabled
	 */
	private $_enabled = true;
	
	/**
	 * @return FirePHP object
	 */
	protected function createContainer(){
		if ($this->_firePhp==null)
			$this->_firePhp = FirePHP::getInstance(true);
		
		return $this->_firePhp;
	}
	
	/**
	 * Gateway for FirePHP->fb.
	 * 
	 * This allows us to check if the AppFirePhp Module is enabled before exeuting the call.
	 *
	 * @see http://www.firephp.org/Wiki/Reference/Fb
	 * 
	 * @param mixed $arg1
	 * @param string $arg2
	 * @param string $arg3
	 */
	public function fb($arg1, $arg2=null, $arg3=null){
		if ($this->getEnabled()){		
			$funcNumArgs = func_num_args();
			$funcArgs = func_get_args();
			
			if ($funcNumArgs==1){
				$this->_firePhp->fb($funcArgs[0]);
			}
			else if ($funcNumArgs==2){
				$this->_firePhp->fb($funcArgs[0], $funcArgs[1]);
			}
			else if ($funcNumArgs==3){
				$this->_firePhp->fb($funcArgs[0], $funcArgs[1], $funcArgs[2]);
			}
		}
	}

	/**
	 * @param boolean $value
	 */
	public function setEnabled($value){
		$this->_enabled = TPropertyValue::ensureBoolean($value);
	}
	
	/**
	 * @return boolean
	 */
	public function getEnabled(){
		return $this->_enabled;
	}
}
?>