<?php
/**
 * Wrapper for Prado modules.
 * 
 * Used for wrapping a 3rd party class as a Prado module.
 * 
 * 
 * @author zekefast
 * @link http://www.pradosoft.com/forum/index.php/topic,7671.0.html
 * @package App_Code.Util
 */
abstract class ModuleWrapper extends TModule{
	protected $container;

	abstract protected function createContainer();
	
	public function __construct()
	{
		$this->container = $this->createContainer();
	}
	
	public function init($config)
	{
		foreach ($config->getAttributes() as $attribute => $value) {
			$this->$attribute = $value;
		}
	}
	
	private static function callUserFunction($object, $method, $params)
	{
		return is_array($params) 
			? call_user_func_array(array($object, $method), $params)
			: call_user_func(array($object, $method), $params);
	}
	
	public function __call($method, $param)
	{
		try {
			if (method_exists($this, $method)) {
				// call wrapper method
				return self::callUserFunction($this, $method, $param);
			} else if (method_exists($this->container, $method)) {
				// call wrapped object method
				return self::callUserFunction($this->container, $method, $param);
			} else {
				throw new TInvalidOperationException('component_operation_undefined', get_class($this->container), $method);
			}
		} catch (Exception $e) {
			throw $e;
		}
	}
	
	public function __set($property, $value)
	{
		try {
			if ($this->canSetProperty($property)) {
				// set property of wrapper
				parent::__set($property, $value);
			} else if (parent::hasProperty($property)) {
				// set property of TModule Class
				parent::setSubProperty($property, $value);
			} else if (property_exists($this->container, $property)) {
				// set public property of wrapped class
				$this->container->$property = $value;
			} else {
				throw new TInvalidOperationException('component_property_undefined', get_class($this->container), $property);
			}
		} catch (Exception $e) {
			throw $e;
		}
	}
	
	public function __get($property)
	{
		try {
			if ($this->canGetProperty($property)) {
				parent::__get($property, $value);
			} else if (parent::hasProperty($property)) {
				// get property of TModule class
				return parent::getSubProperty($property);
			} else if (property_exists($this->container, $property)) {
				// get public property of wrapped class
				return $this->container->$property;
			} else {
				throw new TInvalidOperationException('component_property_undefined', get_class($this->container), $property);
			}
		} catch (Exception $e) {
			throw $e;
		}
	}
}
?>