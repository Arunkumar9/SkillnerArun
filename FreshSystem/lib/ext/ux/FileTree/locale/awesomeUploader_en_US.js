/**
 * @author Arunkumar
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *	27645		   Arunkumar.muddada    201405190301    Awesome uploader window help description
 *  28038 , 28043  Arunkumar.muddada    201406091202    Lesson management Chapters and Scripts Tab , Markers tab help descripts.CUEPOINTS,MARKERS
 */

var AWESOME_HELP_DESCRIPTION = {
		
		MOVIES 					: '<p> <b> Instructions for video files :<br>'+
								  'Video files must be in the *.mp4 format encoded in various kbps rates. The suggested naming convention<br>'+
								  'for the video files is as follows:[NAME]_[VIDEORESOLUTION]_[AUDIO]kbps_[VIDEORATE]kbps.mp4.<br>'+
								  '(Example:2013Simulation_1280x720_48kbps_2000kbps.mp4).<br>'+
								  '"_[VIDEORATE]kbps.mp4" is mandatory and must be at the end of the file name.<br>'+
								  '</b></p>',
		CAPTION 				: '<p> <b> Instructions for caption files :<br>'+
								  'Captions files must be in the SubRip format(*.srt).'+
								  '</b></p>',
        CUEPOINTS               : '<p>Lesson can be divided into thematic chapters. Each lesson must have at least one chapter.'+
								  'Chapter names are shown in the main player menu and students will be able to click on them to launch playback at their locations.'+
								  'You can copy and paste your list of chapters from CSV or XLS files.<br>'+
								  '<br>The chapters data must be in the following format, with each chapter in a separate row:'+
								  '<img src="../images/chapter - format.png" alt="Smiley face" height="80">'+
								  '<br><p>ChapterName: Chapter name will be shown in the main menu of the player and is required.<br>'+
								  'StartTime: Start time of a chapter. It must be in the following format: hh:mm:ss.<br>'+
								  'SkipChapterFlag: By specifying a Y value for this parameter, player will show a skip button in the right top corner of the player. '+
								  'Students will then be able to skip this chapter by clicking on this button.'+
								  'By default chapters are not skippable, and the skip button is not shown.<br>'+
								  '<br>Example:<br>'+
								  '<img src="../images/chapter - example.png" alt="Smiley face" height="80">'+
								  '<br><br>You can download and edit a sample file'+
								  '<a href="../resources/chapters - sample.xlsx" target="_blank" style="color:-webkit-link;"> here</a>.',
	    MARKERS					: '<p>Markers are times where playback will automatically pause.'+ 
  	    						  'Two action buttons are then shown to user: "Previous step" which replays the last step, and "Next step" which resumes playback of the next step.'+ 
  	    						  'Here step is a portion of video between two markers. '+
  	    						  'Note that if you want playback to pause at the beginning or end of the video, '+
  	    						  'you need to use markers at time 00:00:00, and the end-time of the video file, respectively.'+
  	    						  '<br>You can copy and paste your list of step markers from *.CSV or *.XLS files. The data must be in the following format:<br>'+
  	    						  '<img src="../images/markers format.png" alt="Smiley face" height="80">'+
  	    						  '<br><br>PauseTime: Time at which the playback will pause. It must be in the following format: hh:mm:ss.'+
  	    						  '<br>ButtonPosition: “Previous step” and “Next Step” buttons can be positioned to the center of the video container, or at the right bottom corner.<br>'+
  								  '<br>Example:<br>'+
  								  '<img src="../images/markers example.png" alt="Smiley face" height="80">'+
  								  '<br><br>You can download and edit a sample file'+
  								  '<a href="../resources/markers - sample.xlsx" target="_blank" style="color:-webkit-link;"> here</a>.',
  		IMPORT_SCRIPT			:'<p><b>Instructions for importing chapters:</b>'+
  		                		 '<br>Copy and paste your script in the import field. <br>'+
  		                		 'Formatting character ===[CH] indicating the beginning of a new chapter should be each on a separate line,<br>'+ 
  		                		 'and they must follow the imported chapter definitions (otherwise the script import will fail).<br>'+
  		                		 '<br><b>Example:</b><br>'+
  		                		 '===[CH]<br>'+
  		                		 'Introduction<br>'+
  		                		 'In this lesson, you will learn the basic control of the software during all three major stages;<br>'+
  		                		 'Pre-processing, Meshing, and Post-processing<br>'+
  		                		 '===[CH]<br>'+
  		                		 'In the following lesson we will assess performance of the 7 inch linesman pliers. <br>'+
  		                		 'Their design needs to meet requirements on ergonomics and aesthetics,<br>'+ 
  		                		 'and of course it needs to pass the necessary strength criteria.<br></p>'
  		       
};