<?php
/**
 * BActiveGoogleMapMarker.php
 * 
 * @author Bradley Booms <Bradley.Booms@nsighttel.com>
 * @version Creation Date: Oct 7, 2008
 * @package BActiveGoogleMap
 */

prado::using('System.Exceptions.TInvalidDataValueException');

/**
 * IActiveGoogleMapMarker interface
 * 
 * extends TPanel class.
 * 
 * Properties
 * -
 * 
 * @author Bradley Booms <Bradley.Booms@nsighttel.com>
 * @version Modified Date: Jun 7, 2007
 * @package BActiveGoogleMap
 * @subpackage BActiveGoogleMapMarker
 */
interface IActiveGoogleMapMarker{
	public function getID();
	public function getClientID();
	
	public function getName();
	public function getPoint();
	/**
	 * @param  array, boundaries as returned from client side.
	 * 					(min latitude,
	 * 					max latitude,
	 * 					min longitude,
	 * 					max longitude)
	 */
	public function getIsInBounds($bounds);
	public function getLatitude();
	public function getLongitude();
	
}

/**
 * 
 * @package BActiveGoogleMap
 * @subpackage BActiveGoogleMapMarker
 */
class BMarkerDragEventParameter extends TEventParameter {
	var $markerID;
	var $point;
	var $clientSide;
	
	public function __construct($markerID,$clientSide,$lat,$lng){
		$this->markerID = $markerID;
		$this->point = array($lat,$lng);
		$this->clientSide = $clientSide;
	}
	
}
/**
 * 
 * @package BActiveGoogleMap
 * @subpackage BActiveGoogleMapMarker
 */
class BMapClickEventParameter extends TEventParameter {
	var $point;
	var $clientSide;
	
	public function __construct($clientSide,$lat,$lng){
		$this->point = array($lat,$lng);
		$this->clientSide = $clientSide;
	}
}

/**
 * BActiveGoogleMapMarker class
 * 
 * extends TPanel class.
 * 
 * Properties
 * -
 * 
 * @author Bradley Booms <Bradley.Booms@nsighttel.com>
 * @version Modified Date: Jun 7, 2007
 * @package BActiveGoogleMap
 * @subpackage BActiveGoogleMapMarker
 */
class BActiveGoogleMapMarker extends TActivePanel implements IActiveGoogleMapMarker{
	public function getName(){
		return $this->getViewState('Name', $this->getID());
	}
	
	public function setName($value){
		$this->setViewState('Name', $value, $this->getID());
	}
	
	public function getTitle(){
		return $this->getViewState('Title', $this->getName());
	}
	
	public function setTitle($value){
		$this->setViewState('Title', $value, '');
	}
	
	public function getPoint(){
		return $this->getViewState('Point', array(0,0));
	}
	
	public function setPoint($value){
		$value = TPropertyValue::ensureArray($value);
		if ( count($value) == 2 )
			$this->setViewState('Point', $value, array(0,0));
		else
			throw new TInvalidDataValueException('bactivegooglemapmarker_point_invalid',get_class($this));
	}
	
	public function getDraggable(){
		return $this->getViewState('Draggable',false);
	}
	
	public function setDraggable($value){
		$value = TPropertyValue::ensureBoolean($value);
		$this->setViewState('Draggable',$value);
		if($this->getActiveControl()->canUpdateClientSide() && $this->getHasLoadedPostData()){
			$this->getParent()->getClient()->setMarkerDragging($this, $value);
		}
		
	}
	
	/**
	 * @param  array, boundaries as returned from client side.
	 * 					(min latitude,
	 * 					max latitude,
	 * 					min longitude,
	 * 					max longitude)
	 */
	 public function getIsInBounds($bounds){
	 	$ret = false;
		if ( ($this->getLatitude() >= $bounds[0]) &&
			($this->getLatitude() <= $bounds[1]) && 
			($this->getLongitude() >= $bounds[2]) && 
			($this->getLongitude() <= $bounds[3]) ){
			$ret = true;
		}
		return $ret;
	}
	
	public function getLatitude(){
		$point = $this->getPoint();
		return $point[0];
	}
	
	public function getLongitude(){
		$point = $this->getPoint();
		return $point[1];
	}
	
	public function getOptions(){
		$options = array(
			'ID' => $this->getID(),
			'ClientID' => $this->getClientID(),
			'Name' => $this->getName(),
			'Point' => $this->getPoint(),
			'Title' => $this->getTitle(),
			'Draggable' => $this->getDraggable(),
		);
		if ($val = $this->getImageUrl()){
			$options['ImageUrl'] = $val;
		}
		if ($val = $this->getImageSize()){
			$options['ImageSize'] = $val;
		}
		if ($val = $this->getShadowUrl()){
			$options['ShadowUrl'] = $val;
		}
		if ($val = $this->getShadowSize()){
			$options['ShadowSize'] = $val;
		}
		if ($val = $this->getImageAnchor()){
			$options['ImageAnchor'] = $val;
		}
		if ($val = $this->getInfoWindowAnchor()){
			$options['InfoWindowAnchor'] = $val;
		}
		
		return $options;
	}
	
	/**
	 * Renders and replaces the panel's content on the client-side.
	 * When render() is called before the OnPreRender event, such as when render()
	 * is called during a callback event handler, the rendering
	 * is defered until OnPreRender event is raised.
	 * @param THtmlWriter html writer
	 */
	public function openInfoWindow($writer){
		$this->render($writer);
		if($this->getActiveControl()->canUpdateClientSide()){
			$this->getPage()->getCallbackClient()->openInfoWindow($this, $writer);
		}
	}

	/**
	 * Renders marker only on callback process
	 */	
	public function render ($writer) {
		if (($this->getPage()->getIsCallBack()) || ($this->getPage()->getIsPostBack())){
			parent::render($writer);
		}
	}
	
	/**
	 * @return boolean whether the icon is visible.
	 */
	public function getVisible(){
		return $this->getViewState('BVisible',true);
	}
	
	/**
	 * @param boolean whether the icon is visible.
	 */
	public function setVisible($value){
		$value = TPropertyValue::ensureBoolean($value);
		$this->setViewState('BVisible', $value);
		if($this->getActiveControl()->canUpdateClientSide() && $this->getHasLoadedPostData()){
			$this->getParent()->getClient()->setMarkerVisible($this, $value);
		}
	}
	
	/**
	 * This function publishes the specified asset file, and set the ImageUrl property.
	 * @param string file system location of icon image file asset.
	 * Note: relative to the location of this classes file.
	 */
	public function setImageAsset($value){
		$value = TPropertyValue::ensureString($value);
		$url = $this->publishAsset($value, __CLASS__);
		$this->setViewState('ImageUrl', $url, null);
	}
	
	/**
	 * @return string foreground image URL of the icon.
	 */
	public function getImageUrl(){
		return $this->getViewState('ImageUrl', null);
	}
	
	/**
	 * @param string foreground image URL of the icon.
	 */
	public function setImageUrl($value){
		$value = TPropertyValue::ensureString($value);
		$this->setViewState('ImageUrl', $value, null);
	}
	
	/**
	 * @return array(width, height) pixel size of the foreground image of the icon.
	 */
	public function getImageSize(){
		return $this->getViewState('ImageSize', null);
	}
	
	/**
	 * @param array(width, height) pixel size of the foreground image of the icon.
	 */
	public function setImageSize($value){
		$value = TPropertyValue::ensureArray($value);
		$this->setViewState('ImageSize', $value, null);
	}
	
	/**
	 * This function publishes the specified asset file, and set the ShadowUrl property.
	 * @param string file system location of shadow image file asset.
	 * Note: relative to the location of this classes file
	 */
	public function setShadowAsset($value){
		$value = TPropertyValue::ensureString($value);
		$url = $this->publishAsset($value, __CLASS__);
		$this->setViewState('ShadowUrl', $url, null);
	}
	
	/**
	 * @return string shadow image URL of the icon.
	 */
	public function getShadowUrl(){
		return $this->getViewState('ShadowUrl', null);
	}
	
	/**
	 * @param string shadow image URL of the icon.
	 */
	public function setShadowUrl($value){
		$value = TPropertyValue::ensureString($value);
		$this->setViewState('ShadowUrl', $value, null);
	}
	
	/**
	 * @return array(width, height) pixel size of the shadow image.
	 */
	public function getShadowSize(){
		$value = TPropertyValue::ensureArray($value);
		return $this->getViewState('ShadowSize', null);
	}
	
	/**
	 * @param array(width, height) pixel size of the shadow image.
	 */
	public function setShadowSize($value){
		$value = TPropertyValue::ensureArray($value);
		$this->setViewState('ShadowSize', $value, null);
	}
	
	/**
	 * @return array(x, y) pixel coordinate relative to the top left
	 *  corner of the icon image at which this icon is anchored to the map.
	 */
	public function getImageAnchor(){
		return $this->getViewState('ImageAnchor', null);
	}
	
	/**
	 * @param array(x, y) pixel coordinate relative to the top left
	 *  corner of the icon image at which this icon is anchored to the map.
	 */
	public function setImageAnchor($value){
		$value = TPropertyValue::ensureArray($value);
		$this->setViewState('ImageAnchor', $value, null);
	}
	
	/**
	 * @return array(x, y) pixel coordinate relative to the top left corner
	 * of the icon image at which the info window is anchored to this icon.
	 */
	public function getInfoWindowAnchor(){
		return $this->getViewState('InfoWindowAnchor', null);
	}
	
	/**
	 * @param array(x, y) pixel coordinate relative to the top left corner
	 * of the icon image at which the info window is anchored to this icon.
	 */
	public function setInfoWindowAnchor($value){
		$value = TPropertyValue::ensureArray($value);
		$this->setViewState('InfoWindowAnchor', $value, null);
	}
}
?>