<?php

/*
 * <table>
<tbody><tr>
<td>
[[SLOUPCE]]
<b>Přehled last moment termínů pro PC kurzy:</b><br>[[LMPC]]
[[]]
<b>Přehled first moment termínů pro PC kurzy:</b><br>[[FMPC]]
[[/SLOUPCE]]
<br><br>
<table>
<tbody><tr>
<td><b>Přehled last moment termínů pro pro manažerské kurzy:</b><br>[[LM]]</td>

<td><b>Přehled first moment termínů pro manažerské kurzy:</b><br>[[FM]]</td>
</tr>
</tbody></table>
 */
class FPradoTextPanel extends TCompositeControl
{
	private $_text;
	
	public function getText()
	{

		$text = $this->Page->CustomData->text;
		$text = str_replace(array("[[FM]]","[[LM]]"), array('<com:MomentList FirstMoment="true" CategoryRoot="150" BaseUrl="http://manazerske-kurzy.altustc.cz"/>',
															'<com:MomentList FirstMoment="false" CategoryRoot="150" BaseUrl="http://manazerske-kurzy.altustc.cz"/>'), $text);
		$text = str_replace(array("[[FMPC]]","[[LMPC]]"), array('<com:MomentList FirstMoment="true" CategoryRoot="151" BaseUrl="http://www.pcskoleni.cz"/>',
																'<com:MomentList FirstMoment="false" CategoryRoot="151" BaseUrl="http://www.pcskoleni.cz" />'), $text);
		return $text;
		
	}
	
	public function setText($value)
	{
		$this->_text = $value;
	}


	public function getTextTemplate()
	{
//		return $this->getViewState('TextTemplate');
		return $this->_text;
	}
	
	public function setTextTemplate($value)
	{
		
		$this->_text = $value;
//		$this->setViewState(
  //    		'TextTemplate',
    //  		TPropertyValue::ensureObject($value)
		//);

	}
	
/*	public function onPreRender($param)
	{
		parent::onPreRender($param);
		$this->TextTemplate->instantiateIn($this->Panel);
	}
*/
	public function createChildControls()
	{
		//$this->Page = new FBasePage;
		//$this->TextTemplate->instantiateIn($this);
		$template = new TTemplate($this->getText(), dirname(__FILE__));
		$template->instantiateIn($this);
		//echo TVarDumper::dump($this->Controls);
	}
	public function render($writer)
	{
		$this->ensureChildControls();
		parent::render($writer);
	}
/*	public function render($writer)
	{
		$page = new TPage();
		$page->setPage($page);
		$tpl = new TTemplate($this->getText(), Prado::getPathOfNamespace('Application.mails.*'));
		$page->setTemplate($tpl);
		//$page->setPagePath($this->contentid);
		$page->run($writer);	
	}*/

}

?>