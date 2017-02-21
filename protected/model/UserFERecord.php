<?php
/**
 * 
 * @project Fresh!
 * 
 * @package web.database

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: UserFERecord.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */
Prado::using('FreshSystem.services.json.FJsonMailProvider');
class UserFERecord extends UserRecord
{
	const TABLE='fe_users';

        public $Role=50;
        public $Level=50;

        public $Address;
        public $Phone;
        public $PhoneOther;
        public $DateOfBirth;


        public function getGeneratedPassword($l=8,$s=4)
        {
            $this->Password = FU::generatePassword($l,$s);
            parent::save();
            return $this->Password;
        }

        public function _save()
        {
            if (!$this->Uid)
                FJsonMailProvider::sendPreparedMail('credentials', $this, $this->Email);
            else
                parent::save();
        }



        public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
 
}

?>
