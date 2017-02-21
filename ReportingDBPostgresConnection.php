<?php
/**
 * Class for connecting to the reporting database and close the connection
 * @author Arunkumar
 *
 */
class ReportingDBPostgresConnection {
	
	private $postgresSqlConnection =	null;

 	public function createConnection()	{
		include_once('ReportingConfig.php');

		global $postgresSqlConnection;
 			
 		
 		if ( !$postgresSqlConnection  )	{
 			//REPORTING_DBHOST,REPORTING_DBUSER,REPORTING_DBPASS,REPORTING_DBNAME
 			$conn_string = "host=".REPORTING_DBHOST." port=".REPORTING_DBPORT." dbname=".REPORTING_DBNAME." user=".REPORTING_DBUSER." password=".REPORTING_DBPASS;
 			$postgresSqlConnection = pg_connect($conn_string);
 			if (pg_last_error($postgresSqlConnection))  {
		 	 	echo "Failed to connect to PostgresSQL: ==>" . pg_last_error($postgresSqlConnection);
		  	}
 		}
 			return $postgresSqlConnection;
 	}


 	public function closeConnection($postgresSqlConnection)	{

 		try {
 			if ( $postgresSqlConnection  )	{
 				pg_close($postgresSqlConnection);
 			}
 		}
 		catch( Exception $e  )	{
 			echo ' Unable to close the database connection : ',  $e->getMessage(), "\n";
 		}

 	}
 	
}

?>