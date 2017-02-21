<?php
	/**
	Author: Jan Rosa from Iwo Polanski	outlying@gmail.com

	ver 0.0.2

	Licensed under: LGPLv3
	http://www.opensource.org/licenses/lgpl-3.0.html
	**/



	class FSeznamMap extends FStyledTemplateControl implements ITranslatableWidget
{

		private $_apiKey;
		private $_lat;
		private $_lng;
		private $_zoom;
		private $_width;
		private $_height;
		private $_markertext;
		private $_mouse;
		private $_cssstyle;// = "width:640px;height:480px;border:0px;";
		public $Menus   = '';

		private $_markers = array();

		

		public function OnPreRender($param)
		{
			$cs = $this->getPage()->getClientScript();
			$cs->registerHeadScriptFile(__CLASS__.$this->ApiKey,"http://api.mapy.cz/main?key=".$this->ApiKey."&ver=3&encoding=utf-8");
		}
		/* Setters & Getters */

		

		// ApiKey

		

		public function setApiKey($key){

			$this->_apiKey = $key;

		}

		

		public function getApiKey(){

			return $this->_apiKey;

		}

		
		// Lng
		public function getLng(){
			return $this->_lng;
		}

		public function setLng($value){
			$this->_lng = $value;
		}

		// Lat
		public function getLat(){
			return $this->_lat;
		}

		public function setLat($value){
			$this->_lat =  $value;
		}

		// Zoom
		public function getZoom(){
			return $this->_zoom;
		}

		public function setZoom($zoom){
			$this->_zoom = (integer) $zoom;
		}

		// Width
		public function getWidth(){
			return $this->_width;
		}

		public function setWidth($width){
			$this->_width = $width;
		}

		// height
		public function getHeight(){
			return $this->_height;
		}

		public function setHeight($height){
			$this->_height = $height;
		}

		// mouse
		public function getMouse(){
			return $this->_mouse;
		}

		public function setMouse($mouse){
			$this->_mouse = (integer) $mouse;
		}

		// markertext
		public function getMarkerText(){
			return $this->_markertext;
		}

		public function setMarkerText($markertext){
			$this->_markertext = $markertext;
		}
		// cssStyle
		public function getCssStyle(){
			return $this->_cssstyle;
		}

		public function setCssStyle($value){
			$this->_cssstyle = $value;
		}

	}

?>