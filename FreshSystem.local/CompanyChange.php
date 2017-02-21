<?php

class CompanyChange {
	
	public function _construct() {
			
		include_once('Process/PradoInstance.php');
		include_once('Process/config.inc.php');
		include_once('Process/constants.inc.php');
	}
	//Connect to the data base
	public function db_connect() {

	 @$db_link = mysql_connect(DBHOST, DBUSER, DBPASS);
	 if ($db_link) @mysql_select_db(DBNAME);

	 if (mysql_error() AND DEBUG) echo "<hr>MySQL ERROR: ".mysql_error()."<hr>";

	 if (mysql_error()) exit();

	 return $db_link;

	}
	
	//relaese the database object after the db operation.
	public function db_close() {

		global $db_link;
		if ($db_link) $result = mysql_close($db_link);
	}
	
	
	
    public   function  updateSwpWithCompanyLevel($user_id , $company_id=1){
    	
    	$this->db_connect();
         	UPDATE  videos set company_id =( select company_id from be_users where Username = ?) WHERE user_id = ? ;

			UPDATE products  set company_id =(select company_id from  be_users where Username = ?) WHERE user_id = ?;


			UPDATE cms_containers  set company_id =(select company_id from be_users where Username=?) WHERE user_id = (select Uid from be_users where Username=?);
		$this->db_close();
    }
}
?>