<?php
//phpinfo();die();
		mysql_connect ("localhost", "root", "root") or die ('I cannot connect to mysql because: ' . mysql_error());
		mysql_select_db ("flem") or die ('I cannot select the database because: '.mysql_error());



		$start = cleanGet($_GET['start']);
		$limit = cleanGet($_GET['limit']);
		$sort = cleanGet($_GET['sort']);
		$dir = cleanGet($_GET['dir']);
		
		//if (!is_integer($start))
		//	$start = 0;
			
		//if (!is_integer($limit))
		//	$limit = 25;

		if ($sort && $dir) {
			$order = "ORDER BY $sort $dir";
		}
		$sql = "SELECT custno, CONCAT(last,' ',first) as name,phone FROM customers $order LIMIT $limit OFFSET $start";
		//die($sql);
		$result = mysql_query($sql);
		while ($row = mysql_fetch_assoc ($result))
		{
			$customers[] = $row;
		}
			
		$sql = "SELECT count(custno) as c FROM customers";
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);
		
		$json = array('totalCount'=>$row['c'],'customers'=>$customers);
		echo json_encode($json);
		
		






function cleanGet($value)
{
	return preg_replace('/[^0-9a-zA-Z]*/','',$value);
}


function randomize()
{
		echo "RAndom<br>";

		for ($i = 0; $i<100; $i++) 
		{
			$phone = rand(777,999).' '.rand(111,999).' '.rand(111,999);
		echo $phone.'<br/>';
			$sql = "UPDATE customers SET phone = '$phone' WHERE custno=$i";
		$result = mysql_query($sql);
		}

}

?>