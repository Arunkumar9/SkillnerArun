<?php
/*
 * need to return something like this:
 * 
 * {
 * 		'success': true,
 * 		'config': {
 * 			'autorun': [
 * 				'grid-win'
 * 			],
 * 			'desktopcontextmenu': [
 * 				'docs-win',
 * 				'preferences-win'
 * 			],
 * 			'quickstart': [
 * 				'grid-win',
 * 				'tab-win',
 * 				'acc-win',
 * 				'layout-win'
 * 			],
 * 			'startmenu': [
 * 				'docs-win',
 * 				'grid-win',
 * 				'tab-win',
 * 				'acc-win',
 * 				'layout-win',
 * 				'bogus-menu'
 * 			],
 * 			'styles': {
 * 				'backgroundcolor': 'f9f9f9',
 * 				'theme': {
 *					'id': 'Vista',
 *					'path': 'resources/themes/xtheme-vista/css/xtheme-vista.css'
 *				},
 * 				'transparency': false,
 * 				'wallpaper': {
 *					'id': 'qWikiOffice',
 *					'path': 'resources/wallpapers/qwikioffice.jpg'
 *				},
 * 				'wallpaperposition': 'center'
 * 			}
 * 		}
 * }
 */
 
// default
$json = "{'success': false}";

// get the desktop
require_once("../desktop.php");
if(class_exists('desktop'))
{
	$desktop = new desktop();
	
	// connect to data
	$desktop->connect_to_db();
	
	// get member id
	$member_id = $desktop->get_member_id();
	
	if($member_id != "")
	{
		$sql =
			"select
			*
			from
			desktop_config
			where
			member_id = 0
			or
			member_id = ".$member_id."
			order by
			member_id asc";
		
		if($result = mysql_query($sql))
		{
			// get defaults
			$row = mysql_fetch_assoc($result);
			
			$autorun = $row["autorun"] != "" ? $row["autorun"] : "[]";
			$backgroundcolor = $row["backgroundcolor"];
			$desktopcontextmenu = $row["desktopcontextmenu"] != "" ? $row["desktopcontextmenu"] : "[]";
			$quickstart = $row["quickstart"] != "" ? $row["quickstart"] : "[]";
			$startmenu = $row["startmenu"] != "" ? $row["startmenu"] : "[]";
			$theme = $row["theme"] != "" ? $row["theme"] : "";
			$transparency = $row["transparency"] != "" ? $row["transparency"] : false;
			$wallpaper = $row["wallpaper"];
			$wallpaperposition = $row["wallpaperposition"] != "" ? $row["wallpaperposition"] : 'center';
			
			// get member preferences, if any
			if(mysql_num_rows($result) > 1)
			{
				$row = mysql_fetch_assoc($result);
				
				$autorun = $row["autorun"] != "" ? $row["autorun"] : $autorun;
				$backgroundcolor = $row["backgroundcolor"] != "" ? $row["backgroundcolor"] : $backgroundcolor;
				$quickstart = $row["quickstart"] != "" ? $row["quickstart"] : $quickstart;
				$theme = $row["theme"] != "" ? $row["theme"] : $theme;
				$transparency = $row["transparency"] != "" ? $row["transparency"] : $transparency;
				$wallpaper = $row["wallpaper"] != "" ? $row["wallpaper"] : $wallpaper;
				$wallpaperposition = $row["wallpaperposition"] != "" ? $row["wallpaperposition"] : $wallpaperposition;
			}
			
			$json =
			"{
				'success': true,
				'config': {
					'autorun': ".$autorun.",
					'desktopcontextmenu': ".$desktopcontextmenu.",
					'quickstart': ".$quickstart.",
					'startmenu': ".$startmenu.",
					'styles': {
						'backgroundcolor': '".$backgroundcolor."',
						'theme': { 
							'id': '".$theme."',
							'path': '".Mod_addslashes(get_path('themes', $theme))."'
						},
						'transparency': ".$transparency.",
						'wallpaper': {
							'id': '".$wallpaper."',
							'path': '".Mod_addslashes(get_path('wallpapers', $wallpaper))."'
						},
						'wallpaperposition': '".$wallpaperposition."'
					}
				}
			}";
		}
	}
}

print $json;



// helper functions
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

function get_path($what, $id)
{
	$return = "";
	
	if($what != "")
	{
		if($result = mysql_query("select path from desktop_".$what." where id = '".$id."'"))
		{
			$row = mysql_fetch_assoc($result);
			
			if($row["path"] != "")
			{
				$return = $row["path"];
			}
		}
	}
	
	return $return;
}
?>