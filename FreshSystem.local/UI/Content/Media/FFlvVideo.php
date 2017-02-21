<?php
	/**
	Author: Jan Rosa from Iwo Polanski	outlying@gmail.com

	ver 0.0.2

	Licensed under: LGPLv3
	http://www.opensource.org/licenses/lgpl-3.0.html
	**/



	class FFlvVideo extends FStyledTemplateControl implements ITranslatableWidget {

		private $_width   = 320;
		private $_height   = 240;

		private $_filepath;
		private $_Imagepath;
		private $_Colors='0x000000,0xFFFFFF,0x035701,0x3d9e03';
		private $_MediaPlayerUrl;
		private $_Allowfullscreen=false;

		/**
		 * Getter for property Allowfullscreen
		 * allow fullscreen
		 * @return boolean
		 */
		public function getAllowfullscreen() {
		    return $this->_Allowfullscreen;
		}

		/**
		 * Setter for property Allowfullscreen
		 * allow fullscreen
		 * @param $value boolean
		 */
		public function setAllowfullscreen($value) {
		    $this->_Allowfullscreen = TPropertyValue::ensureBoolean($value);
		}



		public function getColor($index)
		{
		    $ary = explode(',',$this->getColors());
		    if (isset($ary[$index]))
			return $ary[$index];
		    else
			return '';
		}

		/**
		 * Getter for property MediaPlayerUrl
		 * url of flash mediaplayer
		 * @return url
		 */
		public function getMediaPlayerUrl() {
		    if (!$this->_MediaPlayerUrl)
			$this->_MediaPlayerUrl = $this->publishAsset('mediaplayer.swf');
		    return $this->_MediaPlayerUrl;
		}

		/**
		 * Getter for property Colors
		 * comma delimited list of colors used by player
		 * @return string
		 */
		public function setMediaPlayerUrl($value) {
		    $this->_MediaPlayerUrl = $value;

                }
		/**
		 * Getter for property Colors
		 * comma delimited list of colors used by player
		 * @return string
		 */
		public function getColors() {
		    return $this->_Colors;
		}

		/**
		 * Setter for property Colors
		 * comma delimited list of colors used by player
		 * @param $value string
		 */
		public function setColors($value) {
		    $this->_Colors = $value;
		}


		/**
		 * Getter for property Imagepath
		 * path to image if no flash
		 * @return string
		 */
		public function getImagepath() {
		    return $this->_Imagepath;
		}

		/**
		 * Setter for property Imagepath
		 * path to image if no flash
		 * @param $value string
		 */
		public function setImagepath($value) {
		    $this->_Imagepath = $value;
		}


		/**
		 * Getter for property filepath
		 * path to video flv file
		 * @return string
		 */
		public function getFilepath() {
		    return $this->_filepath;
		}

		/**
		 * Setter for property filepath
		 * path to video flv file
		 * @param $value string
		 */
		public function setFilepath($value) {
		    $this->_filepath = $value;
		}



		public function OnPreRender($param)
		{
			$swfurl = $this->publishAsset('swfobject.js');
			$cs = $this->getPage()->getClientScript();
			$cs->registerHeadScriptFile('swfobject',$swfurl);
			parent::OnPreRender($param);
		}
		/* Setters & Getters */

		


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


	}

?>