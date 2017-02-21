<?php
/* mftest.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 14.9.2006
 */
//die('here');var_dump($_REQUEST);
//setlocale (LC_ALL, "Czech");

setlocale (LC_ALL, "en_US");
setlocale (LC_NUMERIC, "en_US");

ini_set('error_reporting', E_ERROR | E_WARNING | E_CORE_ERROR | E_COMPILE_ERROR); // & ^E_NOTICE & ^E_WARNING
ini_set('display_errors', TRUE);
define('DDIR',"../3rdParty/Doctrine");
require_once(DDIR.'/Doctrine-compiled.php');
require_once('../FU.php');
require_once('./MFbase.php');
require_once('./filterChain.php');
require_once('./workerChain.php');
require_once('./mailFilter.php');
require_once('./MFconfig.php');
require_once("../SystemDoctrineRecords.php");
set_include_path(get_include_path().PATH_SEPARATOR.'../../Tquery/protected/runtime/application.xml/doctrine'); 
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
			$dclass = DDIR.DIRECTORY_SEPARATOR.str_replace("_",DIRECTORY_SEPARATOR,$className).".php";

        	//if( file_exists($dclass))
            @include_once($dclass);			
            //echo "...loading $dclass<br/>";
			if(!class_exists($className,false) && !interface_exists($className,false))
				return false;
				//Prado::fatalError("Class file for '$className' cannot be found.");		
			//if(!Doctrine::autoload($className))
		}
		return true;
	}
}
//$d = new Diary;

$dir = '../../Tquery/protected/runtime/application.xml/doctrine';
$files = scandir($dir);
foreach($files as $file)
{
	if (strpos($file,'.php'))
	{
	//	echo "dir loading $file<br/>";
		require_once($dir.'/'.$file);
	}
}
$text = $_REQUEST['mail'];
if (strlen($text)>10)
	file_put_contents('sample.eml',$text);

	//$fp = fopen('sample.eml','r');
	$mf = new mailFilter('sample.eml');
	echo $mf->start();
	echo "<pre>";
	var_dump($mf->msg->flags);
	var_dump($mf->msg->attachments);
	var_dump($mf->msg->headers);
	echo "</pre>";
//}

?>

<html>
<head>
<meta http-equiv="Content-Language" content="en" />
<meta name="GENERATOR" content="PHPEclipse 1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>title</title>
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#FF9966" vlink="#FF9966" alink="#FFCC99">

  <form method="post">
  Mail<br/>
  <textarea name="mail" rows="10" cols="50" wrap="off"></textarea>
  <input type="submit" name="submit" value="GO!"/>
  
  
  </form>
  
</body>
</html>
