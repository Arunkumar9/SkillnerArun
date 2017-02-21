<?php
// default
$success = "{'success': false}";

// get the desktop
require_once("../../desktop.php");
if(class_exists('desktop'))
{
	$desktop = new desktop();
	
	// connect to data
	$desktop->connect_to_db();
	
	// get member id
	$member_id = $desktop->get_member_id();
	
	// get post data
	$task = $_POST["task"];
	$what = $_POST["what"];
	
	if($member_id != "")
	{
		// saving?
		if($task == "save")
		{
			$success = save($member_id);
		}
		// loading?
		else if($task == "load" && $what != "")
		{
			$success = load($what);
		}
	}
}

print $success;



// helper functions
function save($member_id)
{
	$success = "{'success': false}";	
	
	$sql = "select transparency from desktop_config where member_id = ".$member_id;
	
	// if user already has a saved preference, update it, else, insert new
	if(mysql_num_rows(mysql_query($sql)) > 0)
	{
		$sql =
			"update
			desktop_config
			set
			autorun = '".$_POST["autorun"]."',
			backgroundcolor = '".$_POST["backgroundcolor"]."',
			quickstart = '".$_POST["quickstart"]."',
			theme = '".$_POST["theme"]."',
			transparency = '".$_POST["transparency"]."',
			wallpaper = '".$_POST["wallpaper"]."',
			wallpaperposition = '".$_POST["wallpaperposition"]."'
			where
			member_id = ".$member_id;
	}
	else
	{
		$sql = "insert into desktop_config (
			member_id,
			autorun,
			backgroundcolor,
			quickstart,
			theme,
			transparency,
			wallpaper,
			wallpaperposition)
			values (
			".$member_id.",
			'".$_POST["autorun"]."',
			'".$_POST["backgroundcolor"]."',
			'".$_POST["quickstart"]."',
			'".$_POST["theme"]."',
			'".$_POST["transparency"]."',
			'".$_POST["wallpaper"]."',
			'".$_POST["wallpaperposition"]."')";
	}
	
	if(mysql_query($sql))
	{
		$success = "{'success': true}";
	}
	
	return $success;
}

function load($what)
{
	$success = "{'images': []}";
	
	if($result = mysql_query("select * from desktop_".$what))
	{
		/* If you don't have built in json services, use this.
		 * Create a new instance of Services_JSON */
		require_once("../../json.php");
		$json = new Services_JSON();
	
		$items = array();
		while($row = mysql_fetch_assoc($result))
		{
			$items[] = $row;
		}
		
		/* If you have built in json support
		$success = '{"images":'.json_encode($items).'}'; */
		 
		// If not
		$success = '{"images":'.$json->encode($items).'}';
	}
	
	return $success;
}

function Mod_addslashes($string)
{
	if(get_magic_quotes_gpc()==1)
	{
		return ($string);
	}
	else
	{
		return (addslashes($string ));
	}
}

/* function load_wallpapers()
{
	// If you don't have built in json services, use this.
	// Create a new instance of Services_JSON
	require_once("../../json.php");
	$json = new Services_JSON();
		
	$items = array();
	$dir_wallpapers = '../../../resources/wallpapers/thumbnails/';
	
	if(is_dir($dir_wallpapers))
	{
	    if ($dh = opendir($dir_wallpapers))
	    {
	        while (($file = readdir($dh)) !== false)
	        {
		    	if(is_file($dir_wallpapers . $file))
		    	{
	               $items[] = array(name=>$file, url=>"resources/wallpapers/thumbnails/".$file);
	            }
			}
	        closedir($dh);
	    }
	}
	
	// If you have built in json support
	//return '{"images":'.json_encode($items).'}';
	 
	// If not
	return '{"images":'.$json->encode($items).'}';
} */
?>