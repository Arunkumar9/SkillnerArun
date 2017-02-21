<?php
// ---------------------------------------------------------
 $app_name = "phpJobScheduler";
 $phpJobScheduler_version = "3.7";
// ---------------------------------------------------------
  define('TIME_WINDOW',60);//denomination is in seconds, so 3600 = 60 minute time frame window

  define('ERROR_LOG', true);// prints successful runs and errors to log table

  define('LOCATION', dirname(__FILE__));// used to open local files
//  define('BASEPATH','C:/xampp/htdocs/newtrunk');
  $str = getcwd();//
  str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT']);
  //var_dump($str); 
   define('BASEPATH',$str);
  define('PJS_TABLE','PJS_TABLE');// pjs table name
  define('LOGS_TABLE','LOGS_TABLE');// logs table name

  define('MAX_ERROR_LOG_LENGTH',1200);// maximum string length of output to record in error log table

?>
