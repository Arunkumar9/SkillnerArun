<?php
require 'amazon/aws-autoloader.php';
require 'config.php';


date_default_timezone_set('GMT');
//echo time();
ini_set('error_reporting',   E_PARSE | E_ERROR | E_CORE_ERROR | E_COMPILE_ERROR ); // & ^E_NOTICE & ^E_WARNING
ini_set('display_errors', TRUE);
ini_set('session.use_trans_sid',FALSE);

if (strpos($_SERVER['HTTP_HOST'],'api.') !== false) {
	ini_set('session.use_only_cookies',0);
	ini_set('session.use_cookies',0);
	if ($_POST['SSID']) 
		$_POST['PHPSESSID'] = $_POST['SSID'];
	elseif ($_GET['SSID']) 
		$_GET['PHPSESSID'] = $_GET['SSID'];
}
else {
	ini_set('session.use_only_cookies',1);
}
ini_set('allow_url_fopen', 1);
//ini_set('output_buffering',1);


ob_start();
//Base paths settings
$basePath=dirname(__FILE__);
$assetsPath=$basePath.'/assets';
$runtimePath=$basePath.'/protected/runtime';
$frameworkPath='prado/prado.php';
$pbPath='prado/PradoBase.php';

// The following directory checks may be removed if performance is required
if(!is_file($frameworkPath))
	die("Unable to find prado framework path $frameworkPath.");
if(!is_writable($assetsPath))
	die("Please make sure that the directory $assetsPath is writable by Web server process.");
if(!is_writable($runtimePath))
	die("Please make sure that the directory $runtimePath is writable by Web server process.");
	
	
 redirectPlyaerIndex('player.skillner.com','http://bss.skillner.com');
//load framework
require_once($frameworkPath); 

//define basic aliases
Prado::setPathOfAlias('Root',$basePath);
Prado::setPathOfAlias('FreshSystem',$basePath.'/FreshSystem');
Prado::setPathOfAlias('JS',$basePath.'/FreshSystem/lib');
$zend = $basePath.'/zf';//'/var/www/ZendFramework-1.0.2/library';
Prado::setPathOfAlias('ZF',$zend);

//run application
//if ((stristr($_SERVER['HTTP_HOST'],'admin.') || stristr($_SERVER['HTTP_HOST'],'api.') || $_GET["page"]=="admin.Open") && ($_GET["_cms"] != 1))
if ((stristr($_SERVER['HTTP_HOST'],'admin.') || stristr($_SERVER['HTTP_HOST'],'swp.') || stristr($_SERVER['HTTP_HOST'],'api.') || $_GET["page"]=="admin.Open") && ($_GET["_cms"] != 1))
{
    $application=new TApplication('protected/admin.xml');
}
else
{
    $application=new TApplication;
}
$application->run();

function redirectPlyaerIndex($playerurl,$bssurl){
	if(startsWith($_SERVER['HTTP_HOST'],$playerurl) 
		&& !startsWith($_SERVER['REQUEST_URI'] ,"/?page=admin.") 
//		&& !startsWith($_SERVER['REQUEST_URI'] ,"/?page=admin.Message") 
//		&& !startsWith($_SERVER['REQUEST_URI'] ,"/?token")
		&& empty($_SERVER['HTTP_REFERER'] )) {
		Redirect($bssurl, false);
	}
}

function startsWith($haystack, $needle)
{
    return $needle === "" || strpos($haystack, $needle) === 0;
}

function Redirect($url, $permanent = false)
{
    header('Location: ' . $url, true, $permanent ? 301 : 302);

    exit();
}
