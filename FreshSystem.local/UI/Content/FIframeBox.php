<?php
	/**
	Author: Jan Rosa from Iwo Polanski	outlying@gmail.com

	ver 0.0.2

	Licensed under: LGPLv3
	http://www.opensource.org/licenses/lgpl-3.0.html
	**/



	class FIframeBox extends FStyledTemplateControl {

		private $_width   = '640px';
		private $_height   = '480px';
		private $_frameurl;
		private $_cssstyle;


		public function OnLoad($param)
		{
			$iframe = Prado::createComponent('TInlineFrame');
			$iframe->setWidth($this->_width);
			$iframe->setHeight($this->_height);
			$iframe->setStyle($this->_cssstyle);
			$iframe->setFrameUrl($this->_frameurl);
			$this->Controls[] = $iframe;
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


		// frameurl
		public function getFrameUrl(){
			return $this->_frameurl;
		}

		public function setFrameUrl($markertext){
			$this->_frameurl = $markertext;
		}
		// cssStyle
		public function getCssStyle(){
			if (!$this->_cssstyle)
				return 'margin:0px; padding:0px; margin-left:25px; border:0px;';
			
			return $this->_cssstyle;
		}

		public function setCssStyle($value){
			$this->_cssstyle = $value;
		}

	}

?>