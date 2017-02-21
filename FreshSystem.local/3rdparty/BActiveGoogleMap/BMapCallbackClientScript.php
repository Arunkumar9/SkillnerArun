<?php
/**
 * BMapCallbackClientScript.php
 * 
 * @author Bradley Booms <Bradley.Booms@nsighttel.com>
 * @version Creation Date: Oct 7, 2008
 * @package BActiveGoogleMap
 */

prado::using('BActiveGoogleMapMarker');

/**
 * BMapCallbackClientScript.php class
 * 
 * 
 * 
 * Properties
 * -
 * 
 * @author Bradley Booms <Bradley.Booms@nsighttel.com>
 * @version Modified Date: Oct 7, 2008
 * @package BActiveGoogleMap
 * @subpackage CallbackClientScript
 */
class BMapCallbackClientScript extends TCallbackClientScript{
	/**
	 * Open the info window of the current marker with new content 
	 * contained in writer.
	 * @param TControl control element or HTML element id.
	 * @param string HTML fragement or the control to be rendered
	 */
	public function openInfoWindow($element, $content){
		if ($element instanceof IActiveGoogleMapMarker){
			$element = $element->getParent();
		}
		$this->replace($element, $content, 'B.ActiveGoogleMaps.openInfoWindow');
	}
	
	public function closeInfoWindow($element){
		if ($element instanceof IActiveGoogleMapMarker){
			$element = $element->getParent();
		}
		$this->callClientFunction('B.ActiveGoogleMaps.closeInfoWindow', array($element));
	}
	
	public function setMarkerID($element,$value){
		$this->callClientFunction('B.ActiveGoogleMaps.setMarkerID', array($element, $value));
	}
	
	public function addMarker($element,$value){
		$this->callClientFunction('B.ActiveGoogleMaps.addMarker', array($element, $value));
	}
	
	public function setZoomLevel($element, $value){
		$this->callClientFunction('B.ActiveGoogleMaps.setZoom', array($element, $value));
	}
	
	public function setBounds($element, $value){
		$this->callClientFunction('B.ActiveGoogleMaps.setBounds', array($element, $value));
	}
	
	public function setScrollWheelZoom($element, $value){
		$this->callClientFunction('B.ActiveGoogleMaps.setScrollWheelZoom', array($element, $value));
	}
	
	public function setMapControls($element, $value){
		$this->callClientFunction('B.ActiveGoogleMaps.setControls', array($element, $value));
	}
	
	public function setMapTypes($element, $value){
		$this->callClientFunction('B.ActiveGoogleMaps.setMapTypes', array($element, $value));
	}
	
	public function setMapType($element, $value){
		$this->callClientFunction('B.ActiveGoogleMaps.setMapType', array($element, $value));
	}
	
	public function setCenter($element, $value){
		$this->callClientFunction('B.ActiveGoogleMaps.setCenter', array($element, $value));
	}
	
	public function setMarkerVisible($element, $value) {
		$map = $element->getParent();
		$this->callClientFunction('B.ActiveGoogleMaps.setMarkerVisible',array($map,$element->getID(),$value));
	}
	public function setMarkerDragging($element, $value) {
		$map = $element->getParent();
		$this->callClientFunction('B.ActiveGoogleMaps.setMarkerDragging',array($map,$element->getID(),$value));
	}
}
?>