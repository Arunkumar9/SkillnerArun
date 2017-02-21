<?php

class FEmailForm extends FStyledTemplateControl {

    private $_pageafter;
    private $_usecaptcha;
    private $_email;
    private $_email_template;
    private $_email_template_text;
    private $_FormDefinition;

    private $_control_defs=array();

    public function onInit($param)
    {
	parent::onInit($param);
	$template = new TTemplate($this->getFormDefinition(), dirname(__FILE__));
	$template->instantiateIn($this->EmailFormPanel);

    }

    public function onPreRender($param)
    {
        if ($this->getUniform())
        {
            $cs = $this->getPage()->getClientScript();
            $cs->registerHeadScriptFile('jQUery.Uniform',"http://www.google.com/jsapi");
            $cs->registerStyleSheetFile('jQUery.Uniform',"FreshSystem/3rdparty");
        }
    }
/*
    protected function createFormFields()
    {

	$panel = $this->EmailFormPanel;
	$form = $this->getFormDefinition();
	$elements = explode("\n",$form);
	foreach($elements as $el)
	{
	    $def = explode(",",trim($el));
	    $key = FU::urlify(trim($def[0]));
	    $this->_control_defs[$key]=array(
		    'label'=>trim($def[0]),
		    'field'=>trim($def[1]),
		    'css'=>trim($def[2]),
		    'validator'=>trim($def[3]),
		    'vtext'=>trim($def[4]),
		);
	}

	$vgroup = __CLASS__.$this->Page->Container->uid;
	$table = new TTable;
	$table->cssClass = __CLASS__;
	foreach($this->_control_defs as $id => $definition)
	{
	    $row = new TTableRow;
	    $cell1 = new TTableCell;
	    $cell1->Text = $definition['label'];
	    $cell2 = new TTableCell;
	    $fClass = ($definition['field'])?$definition['field']:'TTextBox';
	    $field = new $fClass;
	    $field->cssClass = $definition['css'];
	    $field->ID = $id;
	    $field->ValidationGroup = $vgroup;
	    $cell2->Controls->add($field);
	    if ($definition['validator'])
	    {
		$validator = new $vClass;
		$validator->ControlToValidate = $id;
		$validator->MessageText = $definition['vtext'];
		$validator->Text = '*';
		$validator->ValidationGroup = $vgroup;
	    }

	}

    }
  */
    public function sendFormClicked($sender,$param) {
	if (!$this->Page->IsValid)
	    return;

	$this->sendFormToEmail();

	if ($this->PageAfter && ($container = $this->Page->getContainer($this->PageAfter))) {
	    $this->Response->Redirect($container->href);
	}
	else {
	    $this->Response->Redirect($this->Page->Container->href);
	}
    }


    protected function sendFormToEmail() {
	if ($this->_email) {

//	    try {
		$mTpl = new FMailTemplate('Application.mails.'.$this->EmailTemplate,$this,false);
		//echo TVarDumper::dump($mTpl->Controls); die();
		$mTpl->ensureChildControls();
		$ep = $this->EmailFormPanel;
		foreach($ep->Controls as $k => $ctl)
		{
		   //echo get_class($ctl);
		   if ($ctl instanceof TTextBox)
		    {
			$text = $ctl->SafeText;
			$liter = new TLiteral;
			$liter->Text = $text;
			$ep->Controls->removeAt($k);
			$ep->Controls->insertAt($k,$liter);
		    }
		    if ($ctl instanceof TBaseValidator)
			$ep->Controls->removeAt($k);
		}
		//echo TVarDumper::dump($ep);die();
		$mTpl->MessagePanel->Controls->add($ep);
		$text = $mTpl->flush();
		$subject = $mTpl->getSubject();

		$client = array(
		    'subject'=>	$subject,
		    'text' =>	$text,
		    'from'=>	array($this->getApplication()->Parameters['emailAdmin'], $this->getApplication()->Parameters['siteTitle']),
		    'to'=> 		array(array($this->_email, $this->getApplication()->Parameters['siteTitle']))
		);

		$this->getApplication()->Modules['mail']->send($client);
//	    } catch (Exception $e) {
//		Prado::log('ERROR '.$e->getMessage());
//	    }
	}
    }


    public function getUseCaptcha() {
	return $this->_usecaptcha || !$this->User->IsGuest;
    }

    public function setUseCaptcha($value) {
	$this->_usecaptcha = TPropertyValue::ensureBoolean( $value );
    }

    public function getPageAfter() {
	return $this->_pageafter;
    }

    public function setPageAfter($value) {
	$this->_pageafter = $value;
    }

    public function setEmail($value) {
	$this->_email = $value;
    }

    public function getEmail() {
	return $this->_email;
    }

    public function setEmailTemplate($value) {
	$this->_email_template = $value;
    }

    public function getEmailTemplate() {
	if (!$this->_email_template)
	    $this->_email_template = 'emailform';
	return $this->_email_template;
    }

    public function getEMailTemplateText() {
	return $this->_email_template_text;
    }

    public function setEmailTemplateText($value) {
	$filename = Prado::getPathOfNamespace('Application.mails.'.$this->getEmailTemplate(),'.tpl');
	$this->_email_template_text = '';
	if ($value && $filename)
	    file_put_contents($filename, $value);
	elseif($filename)
	    $this->_email_template_text = file_get_contents($filename);
    }

    /**
     * Getter for property FormDefinition
     * definition of presentend form
     * @return string
     */
    public function getFormDefinition() {
	return $this->_FormDefinition;
    }

    /**
     * Setter for property FormDefinition
     * definition of presentend form
     * @param $value string
     */
    public function setFormDefinition($value) {
	$this->_FormDefinition = $value;
    }
}
