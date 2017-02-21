<?php


ini_set('error_reporting',   E_PARSE | E_ERROR | E_CORE_ERROR | E_COMPILE_ERROR ); // & ^E_NOTICE & ^E_WARNING
ini_set('display_errors', TRUE);

include_once '/var/www/web7/web/prado-3.1.6/tests/test_tools/unit_tests.php';


$app_directory = "../protected";
$test_cases = dirname(__FILE__)."/unit";
Prado::setPathOfAlias('Root','../');
Prado::setPathOfAlias('FreshSystem','../FreshSystem');
Prado::setPathOfAlias('JS','../lib');
Prado::setPathOfAlias('ZF','../zf');

$tester = new PradoUnitTester($test_cases, $app_directory);
$tester->run(new HtmlReporter());

?>