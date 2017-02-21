<?php

class FExtForm extends TForm 
{
    /**
	 * Renders the form.
	 * @param THtmlWriter writer
	 */
	public function render($writer)
	{
		$page=$this->getPage();
		$page->beginFormRender($writer);
		$textWriter=new TTextWriter;
		$this->renderChildren(new THtmlWriter($textWriter));
		$content=$textWriter->flush();
		$page->endFormRender($writer);

//		$this->addAttributesToRender($writer);
//		$writer->renderBeginTag('form');

		$cs=$page->getClientScript();
		if($page->getClientSupportsJavaScript())
		{
//			$cs->renderHiddenFields($writer);
			$cs->renderScriptFiles($writer);
			$cs->renderBeginScripts($writer);

			$writer->write($content);

			$cs->renderEndScripts($writer);
		}
		else
		{
//			$cs->renderHiddenFields($writer);
			$writer->write($content);
		}

//		$writer->renderEndTag();
	}
}    
?>
