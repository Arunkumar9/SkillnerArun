<?php
class desktop
{	
	function desktop()
	{
	
	}
	
	/* PRIVATE
	 *
	 * Intended for internal use
	 */
	function get_key()
	{
		return $_COOKIE["key"];
	} // end get_key()
	
	
	
	/* PUBLIC
	 *
	 * No return value
	 */
	function connect_to_db()
	{
		mysql_connect ("localhost", "root", "root") or die ('I cannot connect to mysql because: ' . mysql_error());
		mysql_select_db ("flem") or die ('I cannot select the database because: '.mysql_error());
	} // end connect_to_db()
	
	
	
	/* PUBLIC
	 *
	 * Requires get_key() method
	 * Requires connect_to_db() method
	 *
	 * Returns boolean True/False
	 */
	function is_logged_in()
	{
		$logged_in = false;
		
		// get the random login key
		$key = $this->get_key();
		
		// connect to db
		$this->connect_to_db();
		
		// query the db for the login id
		$sql = "select member_id from desktop_login where login_key = '".$key."'";
		
		// if a record is found, they are logged in
		if(mysql_num_rows($result = mysql_query($sql)) > 0) { $logged_in = true; }
		
		return $logged_in;
	} // end is_loggid_in()
	
	
	
	/* PUBLIC
	 *
	 * Requires the connect_to_db() method
	 * Requires the get_key() method
	 *
	 * Returns id of member currently logged in
	 */
	function get_member_id()
	{
		// get the random login key
		$key = $this->get_key();
		
		// connect to db
		$this->connect_to_db();
		
		// query the db for the login id
		if(mysql_num_rows($result = mysql_query("select member_id from desktop_login where login_key = '".$key."'")) > 0)
		{
			$row = mysql_fetch_assoc($result);
			$member_id = $row['member_id'];
		}
		else
		{
			$member_id = "";
		}
		
		return $member_id;
	} // end get_member_id()
	
	
	
	/* PUBLIC
	 *
	 * Requires the connect_to_db() method
	 * Requires the get_key() method
	 *
	 * Returns id of member currently logged in
	 */
	function get_member_name()
	{
		// get the random login key
		$key = $this->get_key();
		
		// connect to db
		$this->connect_to_db();
		
		// get member id
		$member_id = $this->get_member_id();
		
		// query the db for the member name
		if(mysql_num_rows($result = mysql_query("select member_first_name, member_last_name from desktop_members where member_id = '".$member_id."'")) > 0)
		{
			$row = mysql_fetch_assoc($result);
			$member_name = $row['member_first_name']." ".$row['member_last_name'];
		}
		else
		{
			$member_name = "";
		}
		
		return $member_name;
	} // end get_member_name()
	
	
	/* PUBLIC
	 *
	 * Requires the connect_to_db() method
	 * Requires the get_member_id() method
	 *
	 * Returns a string
	 */
	function get_member_type($member_id)
	{
		// connect to db
		$this->connect_to_db();
		
		// get the member id
		if(!isset($member_id)) { $member_id = $this->get_member_id(); }
		
		// query the db for the member type id
		if(mysql_num_rows($result = mysql_query("select t2.type_text from desktop_members t1, desktop_member_types t2 where t1.member_id = ".$member_id." and t1.member_type = t2.type_id")) > 0)
		{
			$row = mysql_fetch_assoc($result);
			$member_type = $row['type_text'];
		}
		else
		{
			$member_type = "";
		}
		
		return $member_type;
	} // end get_member_type()
	
	
	/* PUBLIC
	 *
	 * Requires the get_member_type() method
	 *
	 * Usage: if(is_member_type('administrator') { // do something }
	 *
	 * Returns boolean True/False
	 */
	function is_member_type($type_check)
	{
		// get member type
		$member_type = $this->get_member_type();
		
		// case-insensitive string comparison
		if(strcasecmp($member_type, $type_check) == 0)
		{
			return true;
		}
		else
		{
			return false;
		}		
	} // end is_member_type()
	
	
	
	/* PUBLIC
	 *
	 * Requires connect_to_db() method
	 *
	 * Returns JSON data 
	 */
	function login($module, $user, $pass)
	{
		$json = "";
		
		if(!isset($_POST['module'])||strlen($_POST['module'])<1)
		{
			die("Error: Server 1");
		}
		elseif(!isset($user)||!strlen($user))
		{
			$json = "{errors:[{id:'user', msg:'Required Field'}]}";
		}
		elseif(!isset($pass)||!strlen($pass))
		{
			$json = "{errors:[{id:'pass', msg:'Required Field'}]}";
		}
		else
		{
			// connect to db
			$this->connect_to_db();
				
			// check username
			$sql = "select member_id from desktop_members where member_email = '".$user."'";
			if(mysql_num_rows(mysql_query($sql)) < 1)
			{
				$json = "{errors:[{id:'user', msg:'User not found'}]}";
			}
			else
			{
				// check password
				$sql = "select member_id, member_type, member_first_name, member_last_name, member_email from desktop_members where member_email = '".$user."' and member_password = '".$pass."'";
				if(mysql_num_rows($result = mysql_query($sql)) < 1)
				{
					$json = "{errors:[{id:'pass', msg:'Incorrect Password'}]}";
				}
				else
				{
					// grab needed data
					$row = mysql_fetch_assoc($result);
					$member_id = $row['member_id'];
					$member_type = $row['member_type'];
					$member_name = $row['member_first_name']." ".$row['member_last_name'];
					
					// delete existing login record, but not for demo login
					if($member_type != 3){
						$sql = "delete from desktop_login where member_id = ".$member_id;
						if(!mysql_query($sql)) { $json = "{errors:[{id:'user', msg:'Login Failed'}]}"; }
					}
					
					// get our random login key
					$rand_key = $this->get_rand_key();
					
					// save temporary login key to our db
					$sql = "insert into desktop_login
							(member_id,
							login_key,
							login_ip,
							login_date)
							values
							(".$member_id.",
							'".$rand_key."',
							'".$_SERVER['REMOTE_ADDR']."',
							'".date("Y-m-d H:i:s")."')";
					
					if(!mysql_query($sql)) { $json = "{errors:[{id:'user', msg:'Login Failed'}]}"; }
					
					$json = "{success:true, key:'".$rand_key."', name:'".$member_name."', type:'".$this->get_member_type($member_id)."'}\n";
				}
			}
		}
		return $json;
	} // end login()
	
	
	
	/*
	 * PUBLIC
	 *
	 * Requires get_member_id() method
	 *
	 * Redirects to login.html on success
	 */
	function logout()
	{
		// get member id
		$member_id = $this->get_member_id();
			
		// delete login from database
		$sql = "delete from desktop_login where member_id = ".$member_id;
		mysql_query($sql) or die ("Logout failed...");
		
		// clear the cookie
		setcookie("key", "");
		setcookie("memberName", "");
		
		// redirect to login page
		header( 'Location: login.html' );
	} // end logout()
	
	
	
	/*
	 * PRIVATE
	 *
	 * Requires get_rand_id method
	 *
	 * Returns a random key
	 */
	function get_rand_key()
	{
		$rand_key = $this->get_rand_id(10);
		return md5($rand_key);
	} // end get_rand_key()
	
	
	
	/*
	 * PRIVATE
	 *
	 * Requires get_rand_value method
	 *
	 * Returns a random id
	 */
	function get_rand_id($length)
	{
		if($length>0) 
		{ 
			$rand_id="";
			for($i=1; $i<=$length; $i++)
			{
				mt_srand((double)microtime() * 1000000);
				$num = mt_rand(1,36);
				$rand_id .= $this->get_rand_value($num);
			}
		}
		
		return $rand_id;
	} // end get_rand_id()
	
	
	
	/*
	 * PRIVATE
	 *
	 * Returns a random value
	 */
	function get_rand_value($num)
	{
		// accepts 1 - 36
		switch($num)
		{
			case "1":
			 $rand_value = "a";
			break;
			case "2":
			 $rand_value = "b";
			break;
			case "3":
			 $rand_value = "c";
			break;
			case "4":
			 $rand_value = "d";
			break;
			case "5":
			 $rand_value = "e";
			break;
			case "6":
			 $rand_value = "f";
			break;
			case "7":
			 $rand_value = "g";
			break;
			case "8":
			 $rand_value = "h";
			break;
			case "9":
			 $rand_value = "i";
			break;
			case "10":
			 $rand_value = "j";
			break;
			case "11":
			 $rand_value = "k";
			break;
			case "12":
			 $rand_value = "l";
			break;
			case "13":
			 $rand_value = "m";
			break;
			case "14":
			 $rand_value = "n";
			break;
			case "15":
			 $rand_value = "o";
			break;
			case "16":
			 $rand_value = "p";
			break;
			case "17":
			 $rand_value = "q";
			break;
			case "18":
			 $rand_value = "r";
			break;
			case "19":
			 $rand_value = "s";
			break;
			case "20":
			 $rand_value = "t";
			break;
			case "21":
			 $rand_value = "u";
			break;
			case "22":
			 $rand_value = "v";
			break;
			case "23":
			 $rand_value = "w";
			break;
			case "24":
			 $rand_value = "x";
			break;
			case "25":
			 $rand_value = "y";
			break;
			case "26":
			 $rand_value = "z";
			break;
			case "27":
			 $rand_value = "0";
			break;
			case "28":
			 $rand_value = "1";
			break;
			case "29":
			 $rand_value = "2";
			break;
			case "30":
			 $rand_value = "3";
			break;
			case "31":
			 $rand_value = "4";
			break;
			case "32":
			 $rand_value = "5";
			break;
			case "33":
			 $rand_value = "6";
			break;
			case "34":
			 $rand_value = "7";
			break;
			case "35":
			 $rand_value = "8";
			break;
			case "36":
			 $rand_value = "9";
			break;
		}
		return $rand_value;
	}
} // end get_rand_value()
?>