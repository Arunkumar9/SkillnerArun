<?php		
// get the desktop
require_once("../desktop.php");
if(class_exists('desktop'))
{
	$desktop = new desktop();
	print $desktop->login($_POST['module'], $_POST['user'], $_POST['pass']);
}
?>
