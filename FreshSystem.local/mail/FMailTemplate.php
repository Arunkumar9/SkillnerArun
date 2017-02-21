<?php

/*
	protected function sendNoticeEmail()
	{

		$mTpl = new MailTemplate('Application.mails.notice',$this->Page);
		$opt = array(		
			'subject'=>	$mTpl->getSubject(),
			'text' =>	$mTpl->flush(),
			'from'=>	array('admin@vizitky.dm.cz', 'Vizitky DM.cz'),
			'to'=> 		$this->getEmailToSendNotice(),
			'cc'=>		null,
			'attach'=> 	$this->createPdfAndName(),
		);
		
		try {
			$this->Mail->send($opt);
			$this->emailInfo->Text = '<br/><br/>Email s vizitkou byl odeslĂˇn na '.$opt['to'].'.';
		} catch (Exception $e) {
			$this->emailInfo->Text = '<br/><br/>Email se nepodaĹ™ilo odeslat. Kontaktujte prosĂ­m sprĂˇvce aplikace admin@dm.cz';
		}
		//mail('jan.rosa@centrum.cz','test','test');
		
	}
 */
class FMailTemplate extends TCompositeControl
{

  private $_tpl = null;
  private $_context = null;
  private $_tw=null;
  private $_earlyrender=true;
  
  public function render($writer) {
	$page = $this->Page;
	//$page->setRequest($this->Context->Request);
	$this->ensureChildControls();
	//$this->processPage($writer);
	$param = true;
	$this->onInit($param);
	$this->initRecursive($param);
	$this->onLoad($param);
	$this->loadRecursive($param);
	$this->onPreRender($param);
	$this->preRenderRecursive($param);
	parent::render($writer);
	//$page->run($writer);

  }
  
 
  public function createChildControls()
	{
		if($this->getTpl()) {
			$template = $this->getService()->getTemplateManager()->getTemplateByFileName($this->getTpl());
			foreach($template->getDirective() as $name => $value) {
				if(is_string($value)) {
					$this->setSubProperty($name, $value);
				} else {
					throw new TConfigurationException('templatecontrol_directive_invalid', get_class($this), $name);
				}
			}
			$template->instantiateIn($this);
		}
  }
  public function getTpl() 
  {
  	return $this->_tpl;
  }
  public function setTpl($v) 
  {
 	//$this->_tpl = @file_get_contents(Prado::getPathOfNamespace($v,'.tpl'));
  	$this->_tpl = Prado::getPathOfNamespace($v,'.tpl');
	if (!is_file($this->_tpl))
	{
		throw new TConfigurationException('mail template does not exists '.$this->_tpl);
	}
	
  }
  
  public function getContext()
  {
  	return $this->_context;
  }
  
  public function setContext($value)
  {
  	$this->_context = $value;
  }
 
 
  public function __construct($tpl,$context,$renderNow=true)
  {
		parent::__construct();
		$this->setContext($context);
		$page = new FBasePage();
		$this->setPage($page);
		$page->setCustomData($this->Context);
		//$page->setTemplate($tpl);
		//$page->getApplication()->setUser($this->Context->User);
		if ($this->Context->hasProperty('PagePath'))
			$page->setPagePath($this->Context->PagePath);
		$this->Tpl = $tpl;
		$this->_earlyrender = $renderNow;
		if ($renderNow) {
	            $w = Prado::createComponent('System.Web.UI.THtmlWriter',$this->textWriter);
		    $this->render($w);
		}
  }

  public function getTextWriter()
  {
  	if ($this->_tw === null)
	{
		$this->_tw = new TTextWriter;
	}
	return $this->_tw;
  }

  public function flush()
  {
	if (!$this->_earlyrender) {
	    $w = Prado::createComponent('System.Web.UI.THtmlWriter',$this->textWriter);
	    $this->render($w);
	}
  	return $this->_tw->flush();
  }
  
  public function getSubject()
  {
  	return trim($this->Page->Title);
  }

	protected function processPage($writer)
	{
		Prado::trace("Page process in ".__CLASS__,'System.Util');
		$this->page->onPreInit(null);
		$this->page->initRecursive();
		$this->page->onInitComplete(null);
		$this->page->onPreLoad(null);
		$this->page->loadRecursive();
		$this->page->onLoadComplete(null);
		$this->page->preRenderRecursive();
		$this->page->onPreRenderComplete(null);
		$this->page->render($writer);
		$this->page->unloadRecursive();
	}



}
