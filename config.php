<?php

$bucket = 'swptrainingtools';
$key = 'AKIAJRSZXMGJRT7Q4S4A';
$secret = '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';
$amazonurl = 'https://'.$bucket.'.s3.amazonaws.com/';
$awesomeuploader = 'awesomeuploader';

define('REQUEST_FILES_BODY','To submit training files or to send any message about this task to your instructor, reply to this post');
define('INITIAL_COMPLETED_SUBMISSIONS','To submit completed training files , or to send any message about this task to your instructor, reply this post ');
define('HEADERROW','background-color: #6A6A6A;
font-size:15px; color:#EDEDED; border-width: 0px 1px 0px 1px; border-style: solid; border-color: #afaaaa;');
define('EVENROW','background-color: #EDEDED ;
color: #5D5D61; font-size:10px; border-width: 0px 1px 0px 1px; border-style: solid; border-color: #afaaaa;');
define('reminder_evenrow','<tr style = "'.EVENROW.'"  >');
define('NORMALROW','background-color: #EDEDED ;
color: #5D5D61; font-size:10px; border-width: 0px 1px 0px 1px; border-style: solid; border-color: #afaaaa;');
define('ODDROW','background-color: #D6D6D6 ;
color: #5D5D61; font-size:10px; border-width: 0px 1px 0px 1px; border-style: solid; border-color: #afaaaa;');
define('COURSEGROUPHEADER','background-color: #EFD11E;
font-size:15px; color:#373637; border-width: 0px 1px 0px 1px; border-style: solid; border-color: #afaaaa;');
define('LASTROW','border-width: 0px 1px 1px 1px !important; ');

define('TABLECELL','font-size: 1.2em; text-align:center;border: 1px solid black;');
define('REDTABLECELL','font-size: 1.2em; text-align:center;border: 1px solid black;color:#FF0000;');
define('ORANGETABLECELL','font-size: 1.2em; text-align:center;border: 1px solid black;color:#FFA500;');
define('COURSEGROUPBODY','padding:10px;text-align:left;border: 1px solid black;color:#373637;');
define('reminder_mail_header','<!DOCTYPE html>
<html>
<head>

</head>

<body>' );
define('reminder_private_message_header','<tr style = "'.HEADERROW.'" >
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Student name</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Unread private messages</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Unread task messages</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Instructor availabilty</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Course expiration</th>
</tr>');

define('reminder_instructor_course_group','<tr style = "'.COURSEGROUPHEADER.'">');
define('reminder_instructor_course_group_body','<td colspan= "5" style = "'.COURSEGROUPBODY.'">');
define('reminder_instructor_course_group_end','</td></tr>');

define('reminder_task_message_header','<tr style = "'.HEADERROW.'" >
<th  style = " padding:10px;text-align:left;" >Task Name</th>
<th   style = " padding:10px;text-align:left;" >Last update date by student</th>
</tr>');


define('reminder_row_end','</tr>');
define('reminder_cell_end','</td>');
define('reminder_mail_end','</body></html>');
define('reminder_oddrow','<tr style = "'.ODDROW.'" >');
define('reminder_evenlastrow','<tr style =" '.EVENROW.''. LASTROW.'" >');
define('reminder_oddlastrow','<tr style = "'.ODDROW .''.LASTROW.'" >');
define('reminder_table_cell','<td style = "'.TABLECELL.' ">');
define('reminder_table_redcell','<td style = "'.REDTABLECELL.' ">');
define('reminder_table_orangecell','<td style = "'.ORANGETABLECELL.' ">');


define('reminder_normalrow','<tr style = "'.NORMALROW.' ">');

define('student_reminder_header','<tr style = "'.HEADERROW.'">
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Course name</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Unread private messages</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Unread tasks messages</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Instructor availabilty</th>
<th   style = " padding:10px;text-align:center;border: 1px solid black;" >Course expiration</th>
</tr>');
?>

