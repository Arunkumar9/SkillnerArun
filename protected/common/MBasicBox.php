<?php
/**
 * @package
 * @file	MBasicBox class file
 * 
 */


/**
 * @class MBasicBox
 */
class MBasicBox extends TPanel
{
	private $_footerLink='#';
	private $_footerText;
	private $_headerText;
	private $_headerClass='h';
	private $_footerClass='f';
	private $_bodyClass='b';


	/**
	 * @return string the static text of the TLiteral
	 */
	public function getText()
	{
		return $this->getViewState('Text','');
	}

	/**
	 * Sets the static text of the TLiteral
	 * @param string the text to be set
	 */
	public function setText($value)
	{
		$this->setViewState('Text',$value,'');
	}
	
	/**
	 * @return String Text of header
	 */
	public function getHeaderText()
	{
		return $this->_headerText;
	}

	/**
	 */
	public function setHeaderText($value)
	{
		$this->_headerText=$value;
	}

	/**
	 * @return String Text of footer
	 */
	public function getFooterText()
	{
		return $this->_footerText;
	}

	/**
	 */
	public function setFooterText($value)
	{
		$this->_footerText=$value;
	}

	/**
	 * @return String link to footer
	 */
	public function getFooterLink()
	{
		return $this->_footerLink;
	}

	/**
	 */
	public function setFooterLink($value)
	{
		$this->_footerLink=$value;
	}

	/**
	 * @return String Class of header
	 */
	public function getHeaderClass()
	{
		return $this->_headerClass;
	}

	/**
	 */
	public function setheaderClass($value)
	{
		$this->_headerClass=$value;
	}

	/**
	 * @return String Class of body
	 */
	public function getBodyClass()
	{
		return $this->_bodyClass;
	}

	/**
	 */
	public function setBodyClass($value)
	{
		$this->_bodyClass=$value;
	}

	/**
	 * @return String Class of footer
	 */
	public function getFooterClass()
	{
		return $this->_footerClass;
	}

	/**
	 */
	public function setFooterClass($value)
	{
		$this->_footerClass=$value;
	}

	public function getGroupingText()
	{
		return '';
	}
	
	public function getCssClass()
	{
		return trim('box '.parent::getCssClass());
	}
	
	/**
	 * Renders the openning tag for the control (including attributes)
	 * @param THtmlWriter the writer used for the rendering purpose
	 */
	public function renderBeginTag($writer)
	{
		$writer->addAttribute('class',$this->cssClass);
		parent::renderBeginTag($writer);
		if ($header = $this->getHeaderText())
		{
			$writer->addAttribute('class',$this->headerClass);
			$writer->renderBeginTag('div');
			$writer->renderBeginTag('h1');
			$writer->renderBeginTag('span');
			$writer->write($header);
			$writer->renderEndTag();
			$writer->renderEndTag();
			$writer->renderEndTag();
		}
		$writer->addAttribute('class',$this->bodyClass);
		$writer->renderBeginTag('div');
//die($this->Text);
		
	}

	/**
	 * Renders the closing tag for the control
	 * @param THtmlWriter the writer used for the rendering purpose
	 */
	public function renderEndTag($writer)
	{
		$writer->renderEndTag();
		if ($footer = $this->getFooterText())
		{
			$writer->addAttribute('class',$this->footerClass);
			$writer->renderBeginTag('div');
			if ($link = $this->FooterLink) {
				$writer->addAttribute('href',$this->footerLink);
				$writer->renderBeginTag('a');
			}
			$writer->write($footer);
			if ($link)
				$writer->renderEndTag();
			$writer->renderEndTag();
		}
		parent::renderEndTag($writer);
	}

	/**
	 * @return boolean whether the rendered text should be HTML-encoded. Defaults to false.
	 */
	public function getEncode()
	{
		return $this->getViewState('Encode',false);
	}

	/**
	 * @param boolean  whether the rendered text should be HTML-encoded.
	 */
	public function setEncode($value)
	{
		$this->setViewState('Encode',TPropertyValue::ensureBoolean($value),false);
	}

	/**
	 * Renders the literal control.
	 * @param THtmlWriter the writer used for the rendering purpose
	 */
	public function render($writer)
	{
		if(($text=$this->getText())!=='')
		{
			$this->renderBeginTag($writer);
			if($this->getEncode())
				$writer->write(THttpUtility::htmlEncode($text));
			else
				$writer->write($text);

			$this->renderEndTag($writer);
		}
		else
			parent::render($writer);
	}
	
}
