<?php
class EmailConfirmationPlugin extends TControl implements IWidget
{
	private $_mail_template;
	private $_template_text;
	
	public function onLoad($param)
	{
		parent::onLoad($param);
		$this->attachEventHandler('OnBeforeNewUserSave',array($this,'OnBeforeNewUserSave'));		
		//$this->broadcastEvent('OnRegistrationUpdateFailure',$sender,$param);
	}

	public function OnBeforeNewUserSave($sender,$param)
	{
	    $this->sendConfirmationEmail($param->Parameter,$this->MailTemplate);
	}
	
	public function getMailTemplate()
	{
		return $this->_mail_template;
	}
	
	public function setMailTemplate($value)
	{
		$this->_mail_template = $value;
	}

	public function getTemplateText()
	{
	    return $this->_template_text;
	}

	public function setTemplateText($value)
	{
		$filename = Prado::getPathOfNamespace($this->getMailTemplate(),'.tpl');
		$this->_template_text = '';
		if ($value && $filename)
		    file_put_contents($filename, $value);
		elseif($filename)
		    $this->_template_text = file_get_contents($filename);
	}

	public function wiLoadData($gw)
	{
		return false;		
	}

	public function wiSetData($content,$gw)
	{
		return false;	
	}

	public function wiInjectData($gw)
	{
		$gw->getData();		
	}

	public function wiGetMetaData($gw)
	{
		return array(
		'properties'=>array('mailtemplate','templatetext'),
		'fields' => array(
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('mail template name'),
			'name'=>$gw->getFieldName('mailtemplate'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('template text'),
			'name'=>$gw->getFieldName('templatetext'),
			'editor'=>array('xtype'=>'textarea','anchor'=>'90%','height'=>200)
			)
			)
		);
	}

	protected function sendConfirmationEmail($user,$template='confirm')
	{

		$arec = new ActivationRecord;
		$arec->code = $arec->getToken();
		$arec->save();
		$user->activation_id = $arec->uid;
		$user->account_type = null;
		
		$mTpl = new FMailTemplate('Application.mails.'.$template,$user);
		$subject = $mTpl->getSubject();
		$text = $mTpl->flush();

		$userEmail = array(
			'subject'=>	$subject,
			'text' =>	$text,
			'from'=>	array($this->getApplication()->Parameters['emailAdmin'], $this->getApplication()->Parameters['siteTitle']),
			'to'=> 		array(array($user->email,$user->fullname)),
		);

		$miEmail = array(
			'subject'=>	$subject,
			'text' =>	$text,
			'from'=>	array($user->email,$user->fullname),
			'to'=> 		array(array($this->getApplication()->Parameters['emailAdmin'], $this->getApplication()->Parameters['siteTitle'])),
		);

		$this->getApplication()->Modules['mail']->send($userEmail);
		sleep(5);
		$this->getApplication()->Modules['mail']->send($miEmail);

	}



}

