<?php

Prado::using('Application.layout.contents.registration.FUserLoginForm');
class FUserForgetPassword extends FUserLoginForm
{

        public function onInit($param)
        {
            parent::onInit($param);
            $this->attachEventHandler('OnViewChanged',array($this,'OnViewChanged'));
        }

        public function OnViewChanged($sender,$param)
	{
	}
	/**
	 * @param mixed event sender
	 * @param mixed event parameter
	 */
	public function forgotButtonClicked($sender,$param)
	{
		if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
			return;

                $finder = UserFERecord::finder();

                $user = $finder->findByUsername($this->Username->SafeText);
                $user = ($user) ? $user : $finder->findByEmail($this->Username->SafeText);
                if (!$user)
                {
                    $this->View->ActiveViewIndex = 3;
                    $this->broadcastEvent('OnViewChanged',$sender,$param);
                    return;
                }
                try {

                    $mTpl = new FMailTemplate('Application.mails.forget',$user);
                    $subject = $mTpl->getSubject();
                    $text = $mTpl->flush();

                    $cust = array(
                            'subject'=>	$subject,
                            'text' =>	$text,
                            'from'=>	array($this->getApplication()->Parameters['emailAdmin'], $this->getApplication()->Parameters['siteTitle']),
                            'to'=> 		array(array($user->Email,$user->Name)),
                    );

                    $this->getApplication()->Modules['mail']->send($cust);
                    $this->View->ActiveViewIndex = 1;

		} catch (Exception $e) {
                    $this->View->ActiveViewIndex = 4;
                    Prado::log('ERROR '.$e->getMessage());
		}

                $this->broadcastEvent('OnViewChanged',$sender,$param);


	}

}
