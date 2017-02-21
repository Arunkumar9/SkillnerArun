<?php
include_once('constants.inc.php');
ini_set('error_reporting',   E_PARSE | E_ERROR | E_CORE_ERROR | E_COMPILE_ERROR ); // & ^E_NOTICE & ^E_WARNING
ini_set('display_errors', TRUE);
ini_set('session.use_trans_sid',FALSE);
//echo " started-----------------------------------------------------------";
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
ob_start();

$basePath= BASEPATH;
$assetsPath=$basePath.'/assets';
$runtimePath=$basePath.'/protected/runtime';
$frameworkPath=$basePath.'/prado/prado.php';
$pbPath=$basePath.'/prado/PradoBase.php';
require_once($frameworkPath);
Prado::setPathOfAlias('Root',$basePath);
Prado::setPathOfAlias('FreshSystem',$basePath.'/FreshSystem');
Prado::setPathOfAlias('JS',$basePath.'/FreshSystem/lib');
$zend = $basePath.'/zf/library';
Prado::setPathOfAlias('ZF',$zend);
$cfg = $basePath.'/protected/admin.xml';
$app = new TApplication($cfg);
$app->run();
return true;
		
			
?>