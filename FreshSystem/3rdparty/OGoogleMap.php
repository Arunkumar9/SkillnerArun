<?php
	/**
	Author: Jan Rosa from Iwo Polanski	outlying@gmail.com

	ver 0.0.2

	Licensed under: LGPLv3
	http://www.opensource.org/licenses/lgpl-3.0.html
	**/



	class OGoogleMap extends TWebControl{

		private $_apiKey = 'ABQIAAAAWlkOE-spgbQuq0xv91gTiBQO-FSZHd2C9A-mbXNqtDlDgrNOIhS1hWsPIhxRaIcstmpGMBN_IQ6z8Q';
		private $_lat    = 51.919438;
		private $_lng    = 19.145136;
		private $_zoom   = 5;
		public $Menus   = '';

		private $_markers = array();

		

		public function onPreRender($param){

			parent::onPreRender($param);

			

			$clientScript = $this->getPage()->getClientScript();

			

			$clientScript->registerPradoScript   ('prado');

			$clientScript->registerHeadScriptFile('TGoogleMap01','http://maps.google.com/maps?file=api&v=2&key='.$this->ApiKey);

			$clientScript->registerHeadScript    ('TGoogleMap02',$this->prepare());

			

			$this->Controls[] = '<div id="GoogleMapElement" style="width: '.$this->getWidth().'px; height: '.$this->getHeight().'px;"></div>';

		}

		

		static public function formatMessage($title,$content,$link){

			

			if(strlen($title)>44)

				$title = substr($title,0,45).' ...';

			

			$message = '<a href=\"'.$link.'\">'.$title.'</a><br>'.wordwrap($content,48,'<br>');

			

			return $message;

		}

		

		public function addMarker($address, $htmlMessage=null){

			

			$apiURL = "http://maps.google.com/maps/geo?&output=xml&key=".$this->ApiKey."&q=";



			if(!is_array($address)){

				$addressData = file_get_contents($apiURL.urlencode($address));

				$results = new SimpleXMLElement(utf8_encode($addressData));

				$coordinates = (string) $results->Response->Placemark->Point->coordinates;

				

				if(empty($coordinates))

					return FALSE;

				

				$coordinates = explode(',', $coordinates);

			}

			else{

				$coordinates[0] = $address[0];

				$coordinates[1] = $address[1];

			}

			

			$marker['lng'] 		= (float) $coordinates[0];

			$marker['lat'] 		= (float) $coordinates[1];

			$marker['address'] 	= $address;

			$marker['message']	= $htmlMessage;



			$this->_markers[] = $marker;



			return TRUE;

		}

		

		

		private function prepare(){

			$script = array();

			

			$script[] = 'function load(){'."\n";

			$script[] = '	if (arguments.callee.done)'."\n";

			$script[] = '		return;'."\n";

			$script[] = '	arguments.callee.done = true'."\n";

			$script[] = '	if (GBrowserIsCompatible()){'."\n";

			$script[] = '		var map = new GMap2(document.getElementById("GoogleMapElement"));'."\n";

			

			

			$controls = explode(',',$this->Menus);



			foreach($controls as $control){

				switch(trim($control)){

					case 'GSmallMapControl':

						$script[] = 'map.addControl(new GSmallMapControl());'."\n";

					break;

				}

			}



			$script[] = '		map.setCenter(new GLatLng('.$this->Lat.', '.$this->Lng.'), '.$this->Zoom.');'."\n";

			$script[] = '	}'."\n";

			

			

			/* Icon definition */

			

			$script[] = '	var icon = new GIcon();'."\n";

			$script[] = '	icon.image  = "http://labs.google.com/ridefinder/images/mm_20_red.png";'."\n";

			$script[] = '	icon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";'."\n";

			$script[] = '	icon.iconSize = new GSize(12, 20);'."\n";

			$script[] = '	icon.shadowSize = new GSize(22, 20);'."\n";

			$script[] = '	icon.iconAnchor = new GPoint(6, 20);'."\n";

			$script[] = '	icon.infoWindowAnchor = new GPoint(5, 1);'."\n";

			

			

			/* Add Markers */



			foreach($this->_markers as $marker){

				$g++;

				

				$script[] = "	var point".$g."  = new GLatLng(".$marker['lat'].",".$marker['lng'].");"."\n";

				$script[] = "	var marker".$g." = new GMarker(point".$g.");"."\n";

				$script[] = "	map.addOverlay(marker".$g.")"."\n";

				$script[] = "	GEvent.addListener(marker".$g.", \"click\", function() {"."\n";

				

				if($marker['message']!=null)

					$script[] = "	marker".$g.".openInfoWindowHtml(\"".$marker['message']."\");"."\n";

				else

					$script[] = "	marker".$g.".openInfoWindowHtml(\"".$marker['address']."\");"."\n";

					

				$script[] = "	});";

			}		

				

			

			$script[] = '}'."\n";

			$script[] = 'if (document.addEventListener) {'."\n";

			$script[] = '	document.addEventListener("DOMContentLoaded", load, false);'."\n";

			$script[] = '}'."\n";

			

			$script[] = '/*@cc_on @*//*@if (@_win32)	document.write("<script defer src=ie_onload.js><"+"/script>");/*@end @*/'."\n";

			

			$script[] = 'window.onload = load;'."\n";

			

			return implode('',$script);

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
			$this->_lng = (integer) $value;
		}

		// Lat
		public function getLat(){
			return $this->_lat;
		}

		public function setLat($value){
			$this->_lat = (integer) $value;
		}

		// Zoom
		public function getZoom(){
			return $this->_zoom;
		}

		public function setZoom($zoom){
			$this->_zoom = (integer) $zoom;
		}

	}

?>