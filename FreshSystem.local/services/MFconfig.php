<?php
/* configMailFilter.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 14.9.2006
 */

 class MFconfigValues
 {
 	const mail_in = 'PZ';
 	const mail_out = 'OZ';
 	const mail_unknown = 'XX';
 	const connection = "mysql://root:myfreshdd@localhost/fresh";
 	const attach_dir = '/var/www/html/demo/attach/';

 	const personality_name = 'SYS';
 	const personality_level = 0;
 	const personality_uid = 0;
 	
 	const mail_dir = '';
 }

 class MFconfigFilters
 {
 	const project_regexp = "/([ZVKA]-|IZ|Mg|In)([0-9]{3,6})/";
 	const internal_bounce = "/^FW:";
 	const spam_themes = '/kokot/';
 	const my_site = '/freshsystems\.cz/';
 	const cc_flag = '/php\@fresh/';
 } 
 
 class MFconfigDefaults
 {
 	const responsible = 'XX';
 }
?>
