<?php

include_once '/Users/rosa/Work/prado-3.1.6/tests/test_tools/functional_tests.php';

$test_cases = dirname(__FILE__)."/functional";

$tester=new PradoFunctionalTester($test_cases);
$tester->run(new SimpleReporter());

?>