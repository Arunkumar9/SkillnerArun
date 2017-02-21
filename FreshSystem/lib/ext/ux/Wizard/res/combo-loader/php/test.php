<?php
 $value = $_POST['value'];
 $text = $_POST['text'];
 
 $config = array(
 	'europe' => array(
 		array('DE', 'Germany', 'x-flag-de'),
 		array('FR', 'France', 'x-flag-fr')
 	),
 	'america' => array(
 		array('US', 'United States', 'x-flag-us')
 	),
 	'africa' => array(
 		array('NG', 'Nigeria', 'x-flag-ng'),
 		array('ZA', 'South Africa', 'x-flag-za')
 	)
 );
 
 echo json_encode($config[ strtolower($text) ]);
?>