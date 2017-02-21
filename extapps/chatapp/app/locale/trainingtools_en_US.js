/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  22934          Arunkumar.muddada    201310270243    Modified var "COURSE_REPORT" => INSTRUCTOR_REPLIES , POSTS_BY_STUDENT 
 *  23362		   Arunkumar.muddada    201311150550    Modified var INSTURCTOR => INSTRUCTOR_NOT_AVAILBLE
 *  23414		   Venkatesh Teja		201311220510	Added variables for tool tip of course task icon from the chapter list.
 *  23745		   Venkatesh Teja		201311161045	Added one variable for adding tool tip for download all icon in message window.
 *  23707		   Tapaswini Sabat		201311171420		Added Tooltip for the quiz and lock icons.
 *  27896          Arunkumar.muddada    201405281102	Modified : INSTURCTOR for changing the message
 *  													Added : STUDENT for the student message for the un available instructor.
 *  29632		   Dinesh GK			201407291040	Modified locked quiz alert message and lock icon tooltip.
 */
/*
 * These variables declared for the messaging window  . 
 */
var SHOWMESSAGINGWINDOW = {
		
		TITLE 					: 'Messages, Tasks'
};

/*
 * These variables declared for the specification of button names in datalist . 
 */
var DATALIST = {
		
		SINGLE_READ 			: 'Mark As Read',
		ALL_READ 				: 'Mark All As Read',
		CREATE_NEW 				: 'New Message',
		HIDE_THREAD 			: 'Hide',
		UNHIDE_THREAD			: 'Unhide',
		CLOSE_THREAD 			: 'Close Private Message',
		OPEN_THREAD 			: 'Open Private Message',
		NEWWINDOW 				: 'New Message',
		REFRESH 				: 'Refresh',
		POST					: 'post',
		POSTS					: 'posts',
		NO_OF_VIEWS 			: 'views',
		LAST_UPDATE 			: 'Last updated on',
		LAST_UPDAYE_BY 			: 'By ',
		CREATE_TASK				: 'New Task',
		MSG_EMPTY_TEXT			: 'No messages',
		TASK_EMPTY_TEXT			: 'No tasks',
		CONTEXT_MENU			: 'Context menu',
		NEW_MESSAGE				: 'New message',
		NEW_TASK				: 'New Task',
		SEARCH					: 'Search',
		OPEN_PRIVATE_MESSAGE	: 'Open private Message',
		CLOSE_PRIVATE_MESSAGE 	: 'closed private message'
			
};

/*
 * These variables declared for the messaging window tab panels . 
 */
var TABVIEW = {
		
		MESSAGES_TITLE 			: 'Messages',
		ANNOUNCEMENTS_TITLE 	: 'Announcements',
		TASKS_TITLE				: 'Tasks'
};

/*
 * These variables declared for comments grid traing files button. 
 */
var TRAININGFILES = {
		
		ALERT_TITLE				: 'Alert!',
		ALERT_MESSAGE			: 'This Course has No Training Files for Download'
};

/*
 * 
 */
var SWPDocLocale = {
		
		CANCEL					: 'Cancel',
		SEND					: 'Send'
};

/*
 * These variables declared for the messaging window Messages tab. 
 */
var MESSAGE = {
		
		CLASSROOM_SAVE_FAIL 	: 'Alert',
		CLASSROOM_SAVE_FAILMSG 	: 'Message Not Sent',
		CLASSROOM_CANCEL_TITLE 	: 'Changes Made will be Lost',
		CLASSROOM_CANCEL_MSG 	: 'Do you want to continue?',
		MESSAGEDETAILS_WITHOUT_THREAD: 'Message Details cannot be initiated without thread',
		CANCEL_NEWTOPIC_TITLE	: 'Changes Made will be Lost',
		CANCEL_NEWTOPIC 		: 'Do you want to continue?',
	    NEWTOPIC_VALIDATE_TITLE : 'Alert',
		NEWTOPIC_VALIDATE_BODY 	: 'Email Body Cannot be Empty',
		NEWREPLY_VALIDATE_TITLE : 'Alert',
		NEWREPLY_VALIDATE_BODY 	: 'Email Body Cannot be Empty',
		NOTHING_DOWNLOAD		: 'This Course has no Training Files for Download',
		UPLOADERROR_TITLE		: 'Upload Error',
		UPLOADERROR_ENTERPACKAGE: 'Please enter package name',
		UPLOADERROR_REENTERPACKAGE:'A Package with this name already Exists, try new name!',
		GRID_DELETE_CONFIRM 	: 'Please confirm',
		GRID_DELETE_MSG 		: 'Do you really want to delete comment <br/>',
		MESSAGEDETAILS_SUBJECT 	: 'Thread title',
		ATTACHMENTS_TEXT		: 'Attachments',
		NEWTOPIC_VALIDATE_REFERENCE : 'Reference Entered is not Valid',
		NEWREPLY_VALIDATE_SUBJECT	: 'Subject Cannot be Empty',
		POST_UPDATED				: 'Thread is upadetd by another User, please refresh the thread first'
		
			
};

/*
 * These variables declared for the Messages tab Newtopic button. 
 */
var NEWTOPIC = {
		
		BROADCAST_ALL 			: 'BroadCastAll',
		BROADCAST_NAME 			: 'name',
		CONTENT_EXCLUSION 		: 'Remove Reference',
		TO_LIST 				: 'To',
		VALUE_FIELD 			: 'Uid',
		SUBJECT 				: 'Subject',
		ATTACHMENTS 			: 'Attachments',
		MESSAGES_TITLE 			: 'New Message Thread',
		ANNOUNCEMENTS_TITLE		: 'Announcements',
		TASKS_TITLE				: 'New Task',
		REFERENCE_LIST 			: 'Reference',
		TASK_SUBJECT			: 'Task, '
			
};

/*
 * These variables declared for the message window button . 
 */
var CLASSROOM = {
		
		MINIMISE_MSGBUTTON_TEXT : 'MessageWindow'
};

/*
 * These variables declared for the Mesages grid.
 */
var GRID = {
		
		SEEK 					: 'Seek',
		LESSON 					: 'Lesson',
		ORDERING 				: 'Ordering',
		CHAPTER_OR_QUIZ			: 'Chapter / Quiz',
		SEEK_TIME				: 'Time',
		OPEN_DISCUSSION 		: 'Make a discussion thread',
		VIEW_DISCUSSION 		: 'View discussion thread',
	    DELETE_COMMENT 			: 'Delete',
	    NOW_PLAYING 			: 'Now playing: ',
	    PREV_LESSON 			: 'Previous Lesson',
	    PREV_CHAPTER			: 'Previous Chapter',
	    REWIND_MOVIE 			: 'Rewind Movie',
	    FORWARD_MOVIE 			: 'Forward Movie',
	    NEXT_CHAPTER 			: 'Next Chapter',
	    NEXT_LESSON 			: 'Next Lesson',
	    TRAINING_FILES 			: 'Training Files',
	    COURSE_TRAINING_FILES 	: 'Course training files',
	    MESSAGE_WINDOW 			: 'Message Window',
	    PAUSE_COMMENT 			: 'Pause & Note',
	    COMMENT 				: 'Note',
	    READY 					: 'Ready',
	    USER_SETTINGS_BUTTON 	: 'Settings',
	    COURSE_TASK_SUMMARY		: 'Course Task Summary',		//201311220510
		ONE_OR_MORE_TASKS_BY_STUDENT    : 'One or more tasks updated by student',
		ONE_OR_MORE_TASKS_BY_INSTRUCTOR : 'One or more tasks updated by instructor',
		ALL_TASKS_UPDATED_ATLEAST_ONCE  : 'All tasks updated by you',
	    SOME_TASK_OPENED 		: 'Open tasks in some lessons and/or quizzes',
	    ALL_TASK_COMPLETED 		: 'All tasks completed',
	    NO_COURSE 				: 'No course tasks',
	    NOTE					: 'Notes'
	    	
};

/*
 * These variables declared for the specification of Post. 
 */
var POST = {
		
	MENU_LARGE 					: 'Large Icon',
	MENU_MEDIUM					: 'Medium Icon',
	MENU_SMALL 					: 'Small Icon',
	MENU_HIDE 					: 'Hide',
	MENU_UNHIDE 				: 'Unhide',
	MENU_HELP 					: 'Help',
	QUOTED_TEXT_TITLE 			: 'Quoted Text'
};
/*
 * These variables declared for the specification of PostTool. 
 */
var POSTTOOL = {
		
	SUBJECT_TEXT 				: 'Subject'
	
};
/*
 * These variables declared for the specification of QuotedText. 
 */
var QUOTEDTEXT ={
		
	BUTTON_TEXT        			: 'Show Quoted Text',
	BUTTON_TEXT_HIDE  			: 'Hide Quoted Text'
};
/*
 * These variables declared for the specification of DownloadAttachments. 
 */
var DOWNLOADATTACHMENTS = {
		
	ERROR_MSG 					: 'Attachments array should be passed',
	DOWNLOAD_TEXT 				: 'Download All',
	DOWNLOAD_TOOLTIP			: 'Download all files'
};
/*
 * These variables declared for the specification of task status text.
 */
var TASKSTATUS = {
		
	OPENED								: 'Opened',
	CLOSED								: 'Closed',
	OPEN_TASK   						: 'Open task',
	OPEN_UPDATED_BY_STUDENT 			: 'Open task.Updated By Student',
	OPEN_UPDATED_BY_INSTRUCTOR			: 'Open task.Updated By Instructor',
	OPEN_UPDATED_BY_YOU					: 'Open task.Updated by you',
	TASK_COMPLETED						: 'Task completed',
	LESSON_TOOLTIP_TASKSTATUS03			: 'Open task',
	LESSON_TOOLTIP_TASKSTATUS04			: 'Open task. Updated by instructor',
	LESSON_TOOLTIP_TASKSTATUS05			: 'Open task. Updated by student',
	LESSON_TOOLTIP_TASKSTATUS06			: 'Task completed',
	QUIZ_TOOLTIP_TASKSTATUS03   		: 'Open tasks in some questions',
	QUIZ_TOOLTIP_TASKSTATUS04			: 'Open tasks in some questions.Some tasks updated by instructor',
	QUIZ_TOOLTIP_TASKSTATUS07			: 'Open tasks in some questions.Some tasks updated by student',
	QUIZ_TOOLTIP_TASKSTATUS05			: 'Open tasks in some questions.All tasks updated by student',
	QUIZ_TOOLTIP_TASKSTATUS_BY_STUDENT	: 'Open tasks in some questions.All tasks updated by instructor',
	QUIZ_TOOLTIP_TASKSTATUS_BY_YOU		: 'Open tasks in some questions.All tasks updated by you',
	QUIZ_TOOLTIP_TASKSTATUS06			: 'All quiz tasks completed',
	INSTRUCTIONS						: 'Instructions',
	ONE									: '1',
	THREE								: '3',
	FOUR								: '4',
	FIVE								: '5',
	QUIZ_TAB_TOOLTIP_TASKSTATUS03		: 'Question with open task',
	QUIZ_TAB_TOOLTIP_TASKSTATUS04		: 'Question with open task updated by instructor',
	QUIZ_TAB_TOOLTIP_TASKSTATUS05		: 'Question with open task updated by student',
	QUIZ_TAB_TOOLTIP_TASKSTATUS99		: 'Question with completed task',
	QUIZ_TAB_TOOLTIP_TASKSTATUS_YOU		: 'Question with open task updated by you'
		
}
/*
 * These variables declared for the specification of task actions text.
 */

var TASKACTIONS = {
	
	UNREQUEST_FILES				: 'Un-request Files',
	REQUEST_FILES				: 'Request Files',
	CLOSE_TASK					: 'Close Task',
	NO_ACTION_REQUIRED          : 'No Action Required',
	COMPLETED_SUBMISSIONS		: 'Submission of the completed training files required',
	REQUEST_FILES_BODY			: 'To submit training files or to send any message about this task to your instructor, reply to this post',
	UNREQUEST_FILES_BODY		: 'Reply for the un-request files post',
	CLOSED_TASK_BODY			: 'Reply for the closed task post',
	INITIAL_COMPLETED_SUBMISSIONS: 'To submit completed training files , or to send any message about this task to your instructor, reply this post '
}	

/*
 * These variables are declared for the specification of reply component text
 * 
 */

var REPLY	= {
		
		SUBJECT_REPLY			: 	'Re: ',
		COMBO_TEXT				:	'Select Action',
		ACTION_COMBO_LABEL		:' Action'
};

var CAPTIONS = {
	
		NO_CAPTIONS				: 	'No Captions'
};

var VIDEOCAPTIONSETTINGS = {
		
				TITLE					: 	'User Settings',
				KEY						: 	'key',
				VALUE					:	'value',
				EDIT					:	'edit',
				FONT_STYLE				:	'Font Family',
				ALIGN					:	'Text Align',
				WIDTH					:	'Width',
				FONTSIZE				:	'Font Size',
				VIDEOCAPTION  			:   'Video Caption',
				NOCAPTIONS  				:   'No Captions',
				THEME					:	'Player Skin',
				DARK 					:	'Dark',
				LIGHT 					:	'Light',
				THEME_SAVE 				:   'The new skin will be applied <br> when you start a new player session.',
				INFO 					:   'Info',
				EMAIL_NOTIFICATION 		: 'Email Notification',
				OPEN_TASK          		: 'Open Message/Task Reminders',
				OPEN_TASK_STUDENT  		: 'Open Message/Task Reminders For Student',
				COURSE_USER_SETTINGS	: 'Course User Settings',
				YES 					: 'YES',
				NO 						: 'NO',
				PLAYER_SETTINGS			: 'Player Settings',
				TRUE					: 'True',
				FALSE					: 'False'

};

/*
 * For Instruction Window configurations
 * 
 */

var INSTUCTIONSWIN = {
		
		TITILE					: 'Tasks and Information',
		NO_INSTUCTIONS			: 'No instructions'
		
}

var MESSAGE_NO_INSTRUCTOR ={
		
		MESSAGE_BTN 			:	"This course is not an instructor led course",
		VIEW_MAKE_DISCUSSION 	:	"This course is not an instructor led course",
		ALERT_TITLE 			:	'Cannot open Messaging Window'
};

var MESSAGEDETAILS = {
		
		SUBJECT							:	'Subject :',
		VIEWS_IN_REFERENCE				:	' views  in Reference :',
		AUTHORS_WITH					:	' authors with ',
		AUTHOR_WITH						:	' author with ',
		INSTRUCTIONS_TEXT				: 	'Instructions : ',
		POSTS_BY						:	' posts By ',
		POST_BY							:	' post By ',
		VIEWS_IN_REFERENCE				:	' views in Reference : ',
		VIEW_IN_REFERENCE				:	' view in Reference : ',
		TRAINING_FILES					: 	' Training Files',
		VIEWS							:	' views',
		VIEW							:	' view',
		MESSAGELIST_TOOLTIP				:	' Back to message list ',
		REFRESH_TOOLTIP					:	'Reload',
		PREVIOUS_MESSAGE_TOOLTIP		:	'Previous message thread',
		NEXT_MESSAGE_TOOLTIP			:	'Next message thread',
		COLLAPSEALL_TOOLTIP				:	'Collapse All',
		EXPANDALL_TOOLTIP				:	'Expand All',
		EXPANDALL_TOOLTIP				:	'Expand All',
		REPLY_TOOLTIP					:	'Reply',
		COLLAPSE_TOOLTIP				:	'Collapse Post',
		TASK_ACTION 					:	'Task Action',
		EXPAND_TOOLTIP					:	'Expand Post',
		TASKLIST_TOOLTIP				:	' Back to task list ',
		PREVIOUS_TASK_TOOLTIP			:	'Previous task',
		NEXT_TASK_TOOLTIP				:	'Next task'
}

var MESSAGESTATE = {
		
		STATUS_OPEN				:	1,
		STATUS_CLOSED			:	2
}

var THREAD = {
		READ					: 0,
		UNREAD					: 1
}

var POST = {
		
		LARGE                   : 'The thread contains one or more large posts. Please wait!'
}

var TASK = {
		
		ALL_TASK_CREATED 		: 'All lessons and quiz questions already have a task thread defined. To send a new request to a student, edit the existing lesson or quiz question task thread.'
}

var DOWNLOAD = {
		
		PLEASE 					: 'Please',
		TEXT 					: 'see the attached files',
		DOWNLOAD_ALL			: 'Download all files'
									
									
};

var QUIZ = {
		PREVIOUS_QUESTION : 'Previous Question',
		NEXT_QUESTION : 'Next Question',
		SUMMARY : 'Summary',
		QUESTION_HELP : 'Question Help',
		QUESTION_FIGURE : 'Question Figure',
		CLOSE : 'Close',
		SUMMARY_TEXT : 'Sum',
		REPORT : 'Report',
		RESET_QUIZ : 'Reset quiz'
};

var CHAPTERlIST = {
		
		QUIZ_CLOSED : 'quizClosed',
		TITLE : 'Course Content',
		ALERT_TITLE : 'Alert!',
		ALERT_MESSAGE : 'Completion of preceding content required to play this content.', 				//201407291040
		REGULAR_QUIZ_COMPLETED : 'regular-quiz-completed',
		REGULAR_QUIZ_INCOMPLETE : 'regular-quiz-incomplete',
		REQUIRED_QUIZ_INCOMPLETE : 'required-quiz-incomplete',
		REQUIRED_QUIZ_PASSED : 'required-quiz-passed',
		REQUIRED_QUIZ_FAILED : 'required-quiz-failed',
		PASSED : 'passed',
		ALERT_MESSAGE2 : 'Lessons completion required to attend this Quiz.',
		COURSE_TASK_SUMMARY: 'Course task summary',
		REGULAR_QUIZ_COMPLETED_TIP : 'Attempted quiz. No passing score required',
		REGULAR_QUIZ_INCOMPLETE_TIP : 'Unattempted quiz. No passing score required.',
		REQUIRED_QUIZ_PASSED_TIP : 'Passed quiz',
		REQUIRED_QUIZ_FAILED_TIP : 'Failed quiz',
		REQUIRED_QUIZ_INCOMPLETE_TIP : 'Unattempted quiz.Passing score required.',
		REQUIRED_SUBSEQUENT_CLS_TIP : 'Completion of preceding content required', 						//201407291040
		LESSONLOCK_MSG1 : 'Preceding lesson(s) ',
		LESSONLOCK_MSG2 : ' completion required to play this content.',
		ERROR : 'error:'
		
};

var WINDOWNAME = {
		INSTRUCTOR : 'messageinstructor',
		STUDENT : 'messagestudent'
};

var WIZARD = {
		QUIZ_RESET_ALERT:'The quiz answers will be reset. You may be required to view some of the preceding content again.',
		QUIZ_EVALUATION_ALERT :'<div class="evaluate-msg quiz-msg"><h1>Important!</h1><p>Failing this quiz will require that you view the following parts of the course again!</p>',
		QUIZRESET_ALERT_TITLE : 'Alert!',
		QUIZRESET_ALERT : 'Quiz reset. Click any item in the main menu to continue.'
};

/*
 * 201311150550
 */
var INSTURCTOR = {
		INSTRUCTOR_NOT_AVAILBLE : "Your availability for this class has ended. You can however continue communicating with the students.",
		INSTRUCTOR_NOT_AVAILBLE_CONFIRM 	: 'Please confirm'
};
//201405281102
var STUDENT = {
		STUDENT_NOT_AVAILBLE : "Instructor for this course was unassigned, or is no longer available (the instructor's time allocated for this course was used up). You may not receive any response to your message.",
		STUDENT_NOT_AVAILBLE_CONFIRM 	: 'Please confirm'
};

var QUIZREPORT = {
		
		FIRSTPANEL :  'Reports / Charts',
		REPORTNAME 	: 'Quiz Summary Report',
		COMPLETION  : '% Completion',
		QUIZZES   : 'Quizzes',
		SCORE	  : 'Score : ',
		DATE  	  : 'Date : ' ,
		DATE_FORMAT : 'm/d/Y',
		LASTATTEMPT : 'Quiz completion : '
};

var REPORTS_TREE = {
	
		TITLE		:		'Reports / Charts'
};

/*
 * 201310270243
 * Course report variables
 */
var COURSE_REPORT = {
		
		TITLE 					: 		'Course Summary Report',
		COURSE_DURATION			:		'Total Estimated Duration',
		COURSE_STARTED_DATE		:		'When Started the course',
		COURSE_EXP_DATE			:		'Expiration Date',        
		COURSE_SIZE				:		'Total Course Size',      
		INSTRUCTOR_AVAIL_DATE	:		'Instructor availability',
		LASTACTIVE_DATE			:		'Last Time Active',
		INSTRUCTOR_REPLIES		:		'Number of posts by instructor',
		POSTS_BY_STUDENT		:		'Number of notes by student',
		QUIZES_COUNT			:		'Number of quizzes'

};

var PARENT_WINDOW_CLOSE_MSG ='The Messages & Tasks application is still open. If you continue and close the player, Messages & Tasks application will close as well.';

var SWPPLAYER = {
		
		REPLAY : "Previous step",
		NEXT : "Next step",
		SKIP:"Skip chapter"
};
