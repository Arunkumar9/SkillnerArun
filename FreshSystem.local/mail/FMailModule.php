<?php
/**
 * FModuleMail class file
 * 
 * @author Jan ROSA (jan.rosa@freshconcept.fr)
 * @copyright Copyright &copy; 2007, Jan Rosa
 * @license http://www.pradosoft.com/license
 *
*/
Prado::using('ZF.*');
Prado::using('ZF.Zend.Mail');
Prado::using('FreshSystem.mail.FMailTemplate');
class FMailModule extends TModule 
{
	
	/**
	 * Initializes the module.
	 * This method is invoked by application.
	 * @param TXmlElement module configuration
	 */
	public function init($config)
	{

	}
	
	
	public function getHtmlMailBody($tpl,$context,$title)
	{
		$textWriter=new TTextWriter;
		$ctrl = new FMailTemplate;
		$ctrl->setContext($context);
		$ctrl->Tpl = $tpl;//'Application.mails.notice';
		$ctrl->render(new THtmlWriter($textWriter));

		$subject = ($ctrl->Page->Title)?$ctrl->Page->Title:$title;
		return $textWriter->flush();
		
	}

	public function send($opt)
	{

		extract($opt);
		
		if (!$from)
			throw new TConfigurationException();

		$mail = new Zend_Mail('utf-8');
		$mail->setBodyHtml($text);

		$from = (is_array($from))?$from:array($from,'');
		$mail->setFrom($from[0], $from[1]);

		$to = (is_array($to))?$to:array($to);
		foreach($to as $t)
			$mail->addTo(trim($t[0]),trim($t[1]));

		if ($cc) {
			//$cc = (is_array($cc))?$cc:array($cc);
			foreach($cc as $c)
				$mail->addCc(trim($c[0]),$c[1]);
		}

		if ($bcc) {
			//$bcc = (is_array($bcc))?$bcc:array($bcc);
			foreach($bcc as $c)
				$mail->addBcc(trim($c[0]),$c[1]);
		}
		$mail->setSubject($subject);

		$attach = (is_array($attach))?$attach:array($attach);
		foreach($attach as $fn => $data)
		{
			$at = $mail->createAttachment($data);
			$at->filename = $fn;
		}
		
		$mail->send(); 		

	}
	
	
}
