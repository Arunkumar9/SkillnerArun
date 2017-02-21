<?php

class FQuestionsForm extends FStyledTemplateControl {
	
		private $_pageafter;
		private $_usecaptcha;
		private $_email;
		private $_email_template;

		public function sendQuestionClicked($sender,$param)
		{
			if (!$this->Page->IsValid)
				return;
			
			$qa = new QARecord;
			$qa->question = $this->QuestionText->SafeText;
			$qa->contact = $this->QuestionContact->SafeText;
			$qa->input_date = time();
			$qa->lang = FU::Culture();
			$qa->save();
			
			$this->sendQuestionToEmail();
			
			if ($this->PageAfter && ($container = $this->Page->getContainer($this->PageAfter)))
			{
				$this->Response->Redirect($container->href);
			}
			else
			{
				$this->Response->Redirect($this->Page->Container->href);
			}
		}
		
		
		protected function sendQuestionToEmail()
		{
			if ($this->_email)
			{

				try
				{
					$mTpl = new FMailTemplate('Application.mails.'.$this->EmailTemplate,$this);
					$subject = $mTpl->getSubject();
					$text = $mTpl->flush();
			
					$client = array(		
						'subject'=>	$subject,
						'text' =>	$text,
						'from'=>	array($this->getApplication()->Parameters['emailAdmin'], $this->getApplication()->Parameters['siteTitle']),
						'to'=> 		array(array($this->_email, $this->getApplication()->Parameters['siteTitle']))
					);
			
					$this->getApplication()->Modules['mail']->send($client);
				} catch (Exception $e) {
					Prado::log('ERROR '.$e->getMessage());
				}
			}
		}


		public function getUseCaptcha()
		{
			return $this->_usecaptcha || !$this->User->IsGuest;
		}
		
		public function setUseCaptcha($value)
		{
			$this->_usecaptcha = TPropertyValue::ensureBoolean( $value );
		}

		public function getPageAfter()
		{
			return $this->_pageafter;
		}


		public function setPageAfter($value)
		{
			$this->_pageafter = $value;
		}

		public function setEmail($value)
		{
			$this->_email = $value;
		}

		public function getEmail()
		{
			return $this->_email;
		}

		public function setEmailTemplate($value)
		{
			$this->_email_template = $value;
		}

		public function getEmailTemplate()
		{
			if (!$this->_email_template)
				$this->_email_template = 'question';
			return $this->_email_template;
		}


}
