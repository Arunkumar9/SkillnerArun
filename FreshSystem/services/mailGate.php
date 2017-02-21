<?php
/* mailGate.php
#!/usr/bin/php -f 
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 14.9.2006
 */

setlocale (LC_ALL, "en_US");
setlocale (LC_NUMERIC, "en_US");

ini_set('error_reporting', E_ERROR | E_WARNING | E_CORE_ERROR | E_COMPILE_ERROR); // & ^E_NOTICE & ^E_WARNING
ini_set('display_errors', TRUE);


syslog(LOG_NOTICE,"mailGate: Started ...");
//$full = "";
//$fpin = fopen("php://stdin","r"); 
//if (!$fpin) {
//	syslog(LOG_ERR,"mailwork G2: Cannot open STDIN");
//	return;
//}
//
//while(!feof($fpin)) { 
////	//DEBUG//fwrite($fp,"read stdin\r\n");
//    $full .= fgets($fpin,1024); 
//} 


define('DDIR',dirname(__FILE__).'/');
define('DCDIR',DDIR.'../3rdParty/Doctrine');
require_once(DDIR.'../3rdParty/Doctrine/Doctrine.php');
//Doctrine::loadAll();
require_once(DDIR.'../FU.php');
require_once(DDIR.'./MFbase.php');
require_once(DDIR.'./filterChain.php');
require_once(DDIR.'./workerChain.php');
require_once(DDIR.'./mailFilter.php');
require_once(DDIR.'./MFconfig.php');
set_include_path(get_include_path().PATH_SEPARATOR.DCDIR."/Doctrine".PATH_SEPARATOR.DDIR.'../../demo/protected/runtime/doctrine'); 
//spl_autoload_register(array('Doctrine', 'autoload'));
//spl_autoload_register(array('Prado', 'autoload'));



if(!function_exists('__autoload'))
{
	function __autoload($className)
	{
		//echo $className.'<br>';
		try {
			//echo "loading $className<br/>";
			@include_once($className.'.php');
		} catch (Exception $e) {
						
		}
		if(!class_exists($className,false) && !interface_exists($className,false))
		{
			//Doctrine::autoload($className);
			$dclass = DCDIR.DIRECTORY_SEPARATOR.str_replace("_",DIRECTORY_SEPARATOR,$className).".php";

        	//if( file_exists($dclass))
             @include_once($dclass);			
            syslog(LOG_NOTICE,"mailGate: loading $dclass<br/>");
			if(!class_exists($className,false) && !interface_exists($className,false)) {
				syslog(LOG_NOTICE,"mailGate: ... no class $className");
				return false;
				//die('no class '.$className);
			}
				//Prado::fatalError("Class file for '$className' cannot be found.");		
			//if(!Doctrine::autoload($className))
		}
		return true;
	}
}
//$d = new Diary;
require_once(DDIR."../dataaccess/SystemDoctrineRecords.php");

$dir = DDIR.'../../demo/protected/runtime/doctrine';
$files = scandir($dir);
foreach($files as $file)
{
	if (strpos($file,'.php'))
	{
	//	echo "dir loading $file<br/>";
		syslog(LOG_NOTICE,"mailGate: ... loading $file");
		require_once($dir.'/'.$file);
	}
}

$mf = new mailFilter();
syslog(LOG_NOTICE,"mailGate: ... inited");
$mf->start();
	//echo "<pre>";
	//var_dump($mf->msg->flags);
	//var_dump($mf->msg->attachments);
	//var_dump($mf->msg->headers);
	//echo "</pre>";
//}
syslog(LOG_NOTICE,"mailGate: ... Finished");

?>