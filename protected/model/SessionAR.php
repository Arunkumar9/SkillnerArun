<?php
/**
 * Auto generated by prado-cli.php on 2010-02-15 03:42:07.
 * generateAll Application.model.schema . soap F AR
 * generate table Application.model.schema.CLASS
 */
class SessionAR extends FBaseActiveRecord
{
	const TABLE='knt_sessions';


        public $uid;
        public $name;
        public $date_created;
        public $questions;
        public $be_user_id;
        public $client_id;
        public $payed_date;


        public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}