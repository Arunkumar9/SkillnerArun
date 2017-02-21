/**
 * Task/Issue      Author         UniqueID        Comment
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23126          Arunkumar.muddada    201310271256      According to the issue first point it should be an alert not a message in player area.
 *  23126          Arunkumar.muddada    201310270605      removed code that is not at all use full as we are giving alert not pasting that on the screen.
 *  23126          Arunkumar.muddada    201310270653      Added code to remove the now playing text when there are lessons to be viwed before attempting a quiz.
 *  23099          Arunkumar.muddada    201310280502      Modified : playButton :
 *                                                            As stop time we are not considering every time start time only we are considering
 *
 *  23160      Venkatesh Teja   201311010230    Added code for implementing functionality that when message window opens first time then only video should pause, In remaining senarios video keep on playing.\
 *  23099          Dinesh.GK        2013115550        According to the issue, if Player in Buffer mode controller is coming multiple times to onCuepoint event,
 *                              for prevent to show Replay& Play icons in player content,code modifications is done.
 *
 *  22859      Venkatesh Teja   201311131925      Changed msg.alert to msg.show because it's distrubing the view when we are zooming in or out.
 *
 *  22606      Tapaswini Sabat      201311141525      Maintaining the Aspect ratio of the image in the quiz question,here we are finding the actual image size and mapping with the
 *                              available width and height
 *  22689           Tapaswini Sabat   201311141653      Maintaining a variable if the quiz is loading because of reference click from the Messagewindow
 *
 *  23362       Arunkumar.muddada    201311151025   Modified : createNewCommentThread :
 *                              As for the newtopic from comments grid we are not loading the store automatically.
 *                              we are modifying this method to pass the values of isFromCommentsGrid.
 *  23133         PhaniKiran.Gutha      20131610        Chapter Highlight is late. Solution for this is to get the cuepoints for the all the chapters start times and refresh
 *                                                ChapterLIst icons accordingly for every cuepoints. Register cuepoints has been modified to add alll chapter start times
 *                                                cuepoint listerners
 *  23456         Tapaswini Sabat   201311161824      While creating the window for Datagrid, making the config flexCroll as false
 *
 *  22606     Tapaswini Sabat      201311161912       As first time we are not able to calculate the original
 *                               width and height of the image so registered onload event on image tag.
 *  23362          Arunkumar.muddada   201311181028       Modified : showMessagingWindow :
 *                              For comments grid modifications we are passing that variable
 *
 *  23562      Venkatesh Teja     201311181545     Added buttons to warning messages Because we changed Ext.alert to Ext.show so we need to mention buttons.
 *
 *  23596          Dinesh.GK        20131120630      Override Tooltip component is added into the common folder,
 *                              removed the tooltip class fron views
 *  23333      Tapaswini Sabat    201311221251  Now HeatMap logic is changed as per the requirement.
 *
 *  22606      Tapaswini Sabat    201311221502  After maintaing the aspect ratio of the imge on
 *                             quiz question, we are aligning the image properly in the viewport.
 *  23357          Arunkumar.muddada    201311220420    Added Method : isScrollAllow
 *                                Which will check the given element is in view state or not in the given container
 *                            Modified : seekToCommentedChapterOrQuiz:
 *                                Logic of findinf the required element from the container elements and sroller in to view logic
 *                                given element is in view state or not in the given container according to that it will scroll
 *
 *  23414      Venkatesh Teja   201311220510  Added one method for updating the tool tip for course task icon in chapter list based on icon class.
 *
 *  22844      Venkatesh Teja   201311221905  Changed code to solve issue that status icon is not changing on clicking on chapter list, if immediate chapter is quiz..
 *
 *  23690          Dinesh.GK        201311251225    Modification is done in handleLabelElementClick method regarding report window quiz like class name is not coming fine for IE.
 *
 *  23357          Arunkumar.muddada    201311250223    Modified Method : chapterSelected:
 *                              when we are coming from the Quiz report quiz selection respective quiz should be in selection mode.
 *
 *  23044        Venkatesh Teja   201311251620    Added code to close the Corse summary window when clicking on the play icon from the message window.
 *  
 *  23333	     Arunkumar.muddada 201311291217    Modified : registerCuePoints: 
 *  													If i clicked on the already played chapter it is coming to this seek as well 
 *  													as registerCuePoints of the classroom.js , so count is incrementting two times.
 *  												    so i am restricting that with a variable.
 *  23778		Tapaswini Sabat		201311291807	Removing he focus from the existing selected chapter if the currently
 *  												selected chapters lesson is collapsed.
 *  
 *  23768  		Venkatesh Teja		201311191850	Added code to get correct tool tip for quiz status icon.
 *  23841		Tapaswini Sabat		201311301357	In order to change the lesson icon, what ever the element we were geeting was not correct,
 *  												now we have modified that code
 *  23707		Tapaswini Sabat     201311301937	Changed the tooltip in the application
 *  23877		Dinesh GK			20131130900		Modification :showQuestionImage 
 *  23357		Dinesh GK			2013123750		Modification : chapterSelected 
														If the selected is lesson we make that into view.
 *  24025		Dinesh GK			201312050220	Modification : markUnviewedLessons
 *  													In markUnviewedLessons if the quiz status is "required-quiz-passed" only we allow to view the subsequent.  													
 *  25868,25941 Arunkumar.muddada   201402260809    Modified :showQuestionImage
 *  													code to get the quiz id from the global variable.
 *  25940		Dinesh GK			201403030720	Browser taking too much memory for run the script which switching between chapters fast without any interval.
 *  26145       Arunkumar.muddada   201403050819     questionSwitch: function(tabs, nt, ot, i, ani, opt) 
 *  													added code to pause the player and code to set the now playing text to quiz name
 *  												 loadQuiz: function(id, lesson, tabInd)
 *  												    added code to pause the player  
 *  26032       Arunkumar.muddada   201403121556    chapterSelected:
 *                                                      added code to mask the course content panel
 *  27661       Arunkumar.muddada   201405160848    Modified : 'viewready' of the 'chapterslist grid' : After view is ready we are getting this event so we can point to the player and play respective chapter.
 *													Added : checkPlayerFromMessageWin : This method is to check is this player is lanching from the message window or not
 * 													Modified : showMessagingWindow : Code which checks is this open window focus is related to the window opened from the BSS.if it is from BSS then it will check the name and focus to the window.
 *  27828 	    Arunkumar.muddada   201405210809	chapterSelected: Code uncommented , for the quiz selection we need to remove the player and need to create it.
 *  
 *  27661       Arunkumar.muddada   201405220645    Modified : checkPlayerFromMessageWin
 *  												First play the video with the referance data then go for the task manager and
 *  												Create a task manager which will run for every 5 sec to get the data.
 *  												
 *  												Modified : restoreSession
 *  												If message window Exists means player is already lanched then there is
 *  												no point in asking the restore window again.
 *  
 *  												Modified : initializeTrainingFiles
 *  												After view is ready and all the training files are loading at that time only we are calling
 *  												checkPlayerFromMessageWin for checking is it from message window.
 *  27896       Arunkumar.muddada   201405281102    Modified : newThreadFromCommentsGrid :-Code for checking if the role is instructor then one message and if the role is student then another message.
 *  27949       Arunkumar.muddada   201405280930	Modified : chapterSelected: 
 *  														While showing the images for the quiz question when user shifting the tabs we are setting the status text by getting the selected item.
 *  28044       Arunkumar.muddada   201406110909    Modified : onBeforeFinishPlay: passing the button position empty so it will take that as default 'Right bottom'
													Modified : registerCuePoints : 
													Added replayplaybuttonpoints array for holding the hidden chapter button position while registering.
													Code for pushing the button position of the hidden chapters.
													Code for while calling the playBackHiddenChapter of the player we are passing the button position.
 *  28044       Arunkumar.muddada    201406160918   Modified : registerCuePoints: Checking the hidden chapters for duplicate and registering only one hidden chapter from duplicates
 *  
 *  27665       Arunkumar.muddada    201406210404   Modified : loadQuiz
 *  												Added code to set the name of the quiz as the panel title
 *  27666       Arunkumar.muddada    201312270330   Modified : markQuizQuestionAnswered
 *                                                      Setting the quizAnsweredCount to decrease one value by checking all the values in the quiz panel and analyse the quiz to find out how many questions are Answered.
 * 													Modified : quizAnswerSingle
														Code to indicate a quiz answer is answered.
														According to this we are preparing and sending request to back-end to create or delete QuizAnswerResults entries.
 *  28950		Dinesh.GK			 201407031055   Modified : restoreSession() in this it is giving get method error so condition is changed.
 *  												Modified : nextLesson() in this method next record giving wrong because if the current lesson name and next lesson/quiz name same it is giving wrong result, 
 *																so condition is changed from lesson name to video_id.
 *  												Modified : chapterSelected() In this method if the lesson is locked then the alert message is changing and in this alert msg showing all the Preceding lessons lest is showing.
 *													Modified : seekToCommentedChapterOrQuiz() In this method, if locked chapter comments grid reference is clicked then player showing continuos loading,so for that code is modified accordingly.
 *  29093       Arunkumar.muddada    201407041118   Modified: calculateProgress
 *																To consider the quiz with status which is not required-quiz-failed
 *  28961		Dinesh GK			 201407070707	Modified: loadQuiz() summary tab is setting to active.
 *
 *
 */
Ext.define('SWP.controller.Classroom', {

  extend: 'Ext.app.Controller',



  stores: [

    'Chapters',
    'Comments',
    'DataGrid',
    'Files',
    'LastRuns',
    'Movies',
    'VideoCaptionSettings',
    'Videos',
    'SWPCommon.store.TaskActions',
    'SWPCommon.store.TaskStatuss',
    'ReportsTree',
    'QuizScores',
    'HitMapBlockField'
  ],


  models: ['Video', 'Comment', 'Chapter', 'LastRun', 'File', 'VideoCaptionSetting', 'DataGrid', 'HitMapBlockField'],



  views: [

    'captions.VideoCaptionSettings',
    'chapters.List',
    'FbarButton',
    'comments.Grid',
    'comments.CommentsGridToolBar',
    'messaging.ShowMessagingWindow',
    'movie.View',
    'player.Flowplayer',
    'player.SWPPlayer',
    'quiz.LongRadioGroup',
    'quiz.Wizard',
    'DataGrid',
    'Viewport',
    'Button',
    // 'Tip', //20131120630
    'reports.QuizReport',
    'AxesOverride',
    'SeriesScore',
    'AxesScore',

    'reports.SummaryReportWindow',
    'reports.ReportsTree',
    'reports.CourseReportForm',
    'reports.ReportsPanelCard',
    'reports.HeatMapReport',
    'HeatMap'
  ],

  requires: ['SWPCommon.store.TaskActions', 'SWPCommon.store.TaskStatuss'],

  refs: [{

      ref: 'commentsGrid',

      selector: 'commentsgrid'

    }, {

      ref: 'player',

      selector: 'swpplayer'

    }, {

      ref: 'commentsGridToolBar',

      selector: 'commentsgridtoolbar'

    }, {

      ref: 'splash',

      selector: '#center-splash'

    }, {

      ref: 'contentPanel',

      selector: 'viewport  panel[region=center]'

    }, {

      ref: 'chapters',

      selector: 'chapterslist'

    }, {

      ref: 'statusBar',

      selector: '#base-statusbar'

    }, {

      ref: 'toolBar',

      selector: '#base-toolbar'

    }, {

      ref: 'searchCombo',

      selector: '#search-combo'

    }, {

      ref: 'quizView',

      selector: 'quiz'

    },



    {

      ref: 'moviesDataView',

      selector: 'moviesview dataview'
     
    },

    {

      ref: 'trainingFiles',

      selector: 'workfiles'

    },

    {
      ref: 'summaryReportWindow',
      selector: 'summaryreportwindow'
    }, {
      ref: 'quizscorereport',
      selector: 'quizscorereport'
    }, {
      ref: 'heatmapreport',
      selector: 'heatmapreport'
    }, {
      ref: 'ReportsPanelCard',
      selector: 'reportspanelcard'
    }, {
      ref: 'quizReportCard',
      selector: 'quizreportcard'
    }, {
      ref: 'heatmapCard',
      selector: 'heatmapcard'
    }
  ],



  init: function() {
    window.name = "playerWindow";
    SWP.isReplayAndNextStepButtonsVisible = true;

    SWP.isCommentIconClicked = false;

    SWP.playerSeekDelayedTask = new Ext.util.DelayedTask();

    SWP.playChapterDelayedTask = new Ext.util.DelayedTask();

    /**
     
     * The global variable, the10sSeekTime, will be used for deciding the timing of next
     
     * explicit seek call during click on forward / rewind movie buttons. Whenever explicit
     
     * seek call is being made, this variable will be set the current system time. This value
     
     * will be used by the helper method to evaluate when the next seek call shall be made.
     
     *
     
     */

    SWP.QuizImageMap = {};

    SWP.quizAnsweredCount = {};

    SWP.expectedChapter = 0;

    SWP.quizAnsweredQuestions = [];

    SWP.quizQuestionLoaded = {};


    this.listen({

        controller: {

            '#Reports': {        // '*' means any controller
          	  'playquiz':this.playQuiz,
          	  'heatmapitemclick':this.seekToDesiredBlockOfChapter

            }

        }

    });



    this.control({



      'chapterslist': {


        beforeload: function(cmp) {

          cmp.setRenderer(this.getPlayer().isChapterBeingPlayed);



        },

        startchapter: function(cmp, rec) {

          alert('Play: ' + r.get('name') + ' ' + r.get('description'));

        },

        load: this.initializeTrainingFiles,

        chapterchanged: this.chapterSelectionChanged,

        chapterselected: this.chapterClicked,

        downloadtrainingfiles: this.downloadTrainingFiles,

        showmessagingwindow: this.showMessagingWindow,

        showcoursetasksummarywin: this.showCourseTaskSummaryWin,

        // showreplaynextbuttons   : this.showReplayNextButtons,
        // collapse:this.panelCollapsed,
        // expand:this.panelExpanded

      },
      'chapterslist grid':{
        'viewready':function(grid){

               grid.getView().on('beforerefresh',function(){
                if(this.el.dom.fleXdata)
                 this.contentScrollPos = this.el.dom.fleXdata.scrollPosition[1][0];
              });
              grid.getView().on('refresh',function(){
                if(this.el.dom.fleXcroll)
                 this.el.dom.fleXcroll.scrollContent(0,this.contentScrollPos);
              });
        }
      },  
      'viewport': {

        resize: this.onViewResize

      },

      'datagrid': {

        courseTaskSummary: this.courseTaskSummary

      },

      'commentsgrid': {

        edit: this.afterEdit,

        showworkfilespanel: this.showWorkFilesPanel,

        seekthroughcomment: this.seekToCommentedChapterOrQuiz,

        newthreadfromcommentsgrid: this.newThreadFromCommentsGrid,

        showmessagingwindow: this.showMessagingWindow,

        commentme: this.addComment,

        // showreplaynextbuttons: this.showReplayNextButtons,

        nextchapter: this.nextChapter,
        // collapse:this.panelCollapsed,
        // expand:this.panelExpanded

      },
      'commentsgridtoolbar': {

        commentme: this.addComment,

        commentandpause: this.addCommentAndPause,

        nextlesson: this.nextLesson,

        prevlesson: this.prevLesson,

        nextchapter: this.nextChapter,

        prevchapter: this.prevChapter,

        forwardmovie: this.playFwd,

        rewindmovie: this.playRev,

        showmessagingwindow: this.showMessagingWindow,

        downloadtrainingfiles: this.downloadTrainingFiles,

        openmessagewindow: this.newTopic,

        openvideocaptionsettings: this.openVideoCaptionSettings,

        setinitialmessagecount: this.getInitialUnreadMessageCount,

        captionselected: this.swapCaptions,

        commentmeafterexpand: this.commentmeAfterExpand,

        quizreport: this.quizReport
      },

      'workfiles': {

        showfilesupload: this.showUploadPopUp,

        validatepackagename: this.validatepkgename,

        deletefilehandler: this.deletefilehandler,

        saveupload: this.saveUpload,

        canceluploadedfiles: this.canceluploadedfiles,

        fileupload: this.fileupload

      },

      'swpplayer': {

        loadCaptions: this.loadCaptions,

        playerfullscreenclicked: this.applyCaptionStyles,

        playerfullscreenexit: this.handleFlowplayerFullScreenExit,

        replaybutton: this.replayButton,

        playbutton: this.playButton,

        registercuepoint: this.registerCuePointsFromSeek,

        // showreplaynextbuttons: this.showReplayNextButtons,

        onbeforefinishplay: this.onBeforeFinishPlay,

        registercuepoints: this.registerCuePoints

      },

      'datagrid': {

        'courseTaskSummary': this.courseTaskSummary

      },

      'commentsgrid button[action=quiz]': {

        // click: this.showQuiz

      },

      'viewport quiz ': {

        quizresized: this.quizResized,
        // collapse:this.panelCollapsed,
        // expand:this.panelExpanded
        //              quizreport  :this.quizReport

      },

      'viewport container quiz tabpanel': {

        tabchange: this.questionSwitch

      },

      'viewport quiz  button[action=video]': {

        click: this.playQuestionVideo

      },

      'viewport quiz  radiogroup': {

        change: this.quizAnswerSingle

      },

      'viewport quiz  checkboxgroup': {

        change: this.quizAnswer

      },

      'viewport quiz  textfield': {

        blur: this.quizAnswerText

      },

      'viewport quiz button[action=figure]': {

        click: this.showFigures

      },
      'quiz': {

        'markunviewedlessons': this.markUnviewedLessons,

        'subSequentUnLocking' : this.subSequentUnLocking
        // showreplaynextbuttons : this.showReplayNextButtons

      },

      'videocaptionsettings': {



        savecaptoinsettings: this.saveCaptionSettings

      },

      'fbarbutton': {

        click: this.quizesWinFbarAction

      }

    });


    // for editors do not run any tasks

    if (!SWP.editorsLogin) {

      Ext.TaskManager.start({

        run: this.logTransfer,

        args: [10],

        interval: 10000,

        scope: this

      });

      var polltask = new Ext.util.DelayedTask();

      polltask.delay(1000, function() {

        Ext.TaskManager.start({

          run: this.polling,

          args: [10],

          interval: 5000,

          scope: this

        });

      }, this);

    }
  },
  /**
   * This method is to check is this player is lanching from the message window or not
   * 201405160848
   */
  checkPlayerFromMessageWin : function(){
	  //201405160848
	  try{
	    	var parentWin = window.opener;
	    	if(parentWin && parentWin.name == "messageinstructorfromMsg"){
	    		this.MesagewindowExist = true;
	  		} else {
	  			this.MesagewindowExist = false;
	  		}
	    } catch (e) {
	    	this.MesagewindowExist = false;
		}
	  
	  VideoRecordMgr.receiveMessage("tcp://localhost:61613", SWP.PID + '_' + SWP.Rrolename + '_videoplayerFromMessage', function(r, t) {
		  if (t.status) {
	        if (!Ext.isEmpty(r)) {
	
	          var msg = Ext.decode(unescape(r), true);
	
	          if (msg && msg.eventName) {
	            if (msg.eventName == "playerFromMessage") {
	            	//201405220645
	            	//First play the video with the referance data then go for the task manager
	            	VideoRecordMgr.receiveMessage("tcp://localhost:61613", SWP.PID + '_' + SWP.Rrolename + '_videoplayer', function(r, t) {
	            	      if (t.status) {
	            	        if (!Ext.isEmpty(r)) {
	            	          var msg = Ext.decode(unescape(r), true);

	            	          if (msg && msg.eventName) {
            	        	  	if (msg.eventName == "openreference"){
            	                  this.openReference(msg.reference[0]);
            	                }
	            	          }
	            	        }
	            	      }
	            	},this);
	            	
	            	//201405220645
	            	//Creatign the task manager which will run for every 5 sec to get the data
	            	SWP.mw = window.opener;
	            	 if (!this.messagePlayerWinComuIniti) {
	            		 Ext.TaskManager.start({
		        	            run: this.getData,
		        	            args: [10],
		        	            interval: 5000,
		        	            scope: this
		        	          },this);
	            		 this.messagePlayerWinComuIniti = true;
	            	 }
	            	 this.MesagewindowExist = true;
	            	 //201406190726
	            	 SWP.PlayerFromMsg = true;
	             }
	          }
	        }
	     }
	  },this);
  },
  
  /**
   * this function will be called by the reports controller when user clicked on the quiz name in the 
   * quiz reports window
   */
      playQuiz:function(targetCls){
  	 
  	 var chapterStore  = this.getChapters().down('grid').getStore();
  	 
  	 index = chapterStore.findBy(function(r,i){
           
           return ( (r.get('uid').substr(0,1) == 'Q') && targetCls.indexOf(r.get('lesson')) != -1 ) ? r :false ;
        },this);
  	 
  	 record = chapterStore.data.items[index];
  	 this.chapterSelected(null, null, record.get('uid'), record, null , null , null)
   },	

  /**
   
   * this method is called when the Quiz window is expand/collapse.
   
   *
   
   */

  quizResized: function(expanded) {

    if (this.getPlayer()) {
        
        this.getPlayer().hideSkipButton(expanded);

    }

  },
  /**

   * this method is called when the Quiz report icon from quiz panel
   * is getting clicked.

   */
  quizReport : function( quizrefresh ) {
    
    var me = this;
    
    var videoPlayer = this.getPlayer().getFlowPlayer();
    var isPlaying = videoPlayer.isPlaying();
    if( isPlaying ) {
      this.pauseVideoPlayer();
    }
    this.getApplication().getController('Reports').quizReport(quizrefresh);
    
  
      },
    /*
     * 201311191850
     * This method is for getting correct tool tip for quiz status
     * icons based on icon classes
     */
    getCorrectTooltip : function(currentStatusRecord, isFromRefreshStatus ){
    	
    	var tooltip = currentStatusRecord.get('QuizTooltip');
    	
    	var id = currentStatusRecord.get('ID');
    		
    	if(!isFromRefreshStatus){
    		
    		if( id == "4" && SWP.instructLogin){
    			
    			tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS07;
    			
    		}else if( id == "4" && !SWP.instructLogin){
    			
    			tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS04;
    			
    		}else if( id == "5" && SWP.instructLogin){
    			
    			tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS_BY_STUDENT;
    			
    		}else if( id == "5" && !SWP.instructLogin){
    			
    			tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS_BY_YOU;
    			
    		}
    	}else{
    		
    		if( id == "4" && SWP.instructLogin){
    			
    			if(tooltip == TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS04){
    				
    				tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS_BY_STUDENT;
    				
    			}else{
    				
    				tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS07;
    				
    			}
    			
    		}else if( id == "4" && !SWP.instructLogin){
    			
    			tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS04;
    			
    		}else if( id == "5" && SWP.instructLogin){
    			
    			tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS_BY_STUDENT;
    			
    		}else if( id == "5" && !SWP.instructLogin){
    			
    			tooltip = TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS_BY_YOU;
    			
    		}
    	}
    		
    	return tooltip;
    },
         


  getInitialUnreadMessageCount: function() {

    this.unReadThreads = [];

    if (SWP.unreadMsgCount.length > 0) {

      var badgebutton;

      for (var i = 0; i < SWP.unreadMsgCount.length; i++) {

        if (SWP.unreadMsgCount[i].unread_Post_Count > 0) {

          this.unReadThreads.push(SWP.unreadMsgCount[i].thread_id);

          badgebutton = Ext.ComponentQuery.query(' badgebutton ')[0];

          if (badgebutton.getBadgeText() == ' ' || badgebutton.getBadgeText() == undefined)

            badgebutton.setBadgeText(1);

          else

            badgebutton.setBadgeText(badgebutton.getBadgeText() + 1);

        }

      }

    }

    SWP.unreadMsgCount = [];

  },

  /**
   
   *
   
   *  Calling capturemessagedetails function in collaborationtoolMgr file for every 10 seconds,
   
   *  to get the thread details, if any new threads got created. If yes,
   
   *
   
   */

  polling : function () {
      CollaborationToolMgr.captureMessageDetails( null,function( r,t ) {
          if( t.status ) {
            var fullyCompleted = r.fullyCompleted;
            var courseStatus = r.courseStatus;
            var subSequentContent = r.subSequentContent;
            var lessonCompleteStatus = r.lessonCompleteStatus;
            var r = r.record;
            if( r.length > 0 ) {
              var badgeTabIndex;
              var badgebutton;
              var badgeTab;
              var list = Ext.ComponentQuery.query( 'chapterslist gridpanel' )[0];
              var listStore = list.getStore();
              var taskStatusStore =  Ext.data.StoreManager.lookup('SWPCommon.store.TaskStatuss');
              var selected = list.getSelectionModel().getSelection()[0];
              if( !this.unReadThreads ) {
                this.unReadThreads = [];
              }
              for ( var i=0; i<r.length; i++ ){
            	  //Task Type Threads
                  if( r[i].thread_type_id == TABS.THREAD_TYPE_THREE ){
                	   var currentStatusRecord = taskStatusStore.findRecord( 'ID',r[i].status );
                	  	
                       var recordIndex = listStore.findBy( function( rec, id ) {
                        	var videoIdLength = rec.get( 'video_id' ).length;
                        	return ( rec.get( 'video_id' ).substr(1, videoIdLength) == r[i].reference.video_id );
                       },this);

                       var modifiedRecord = listStore.getAt( recordIndex );

                       if( modifiedRecord.get( 'video_id' ).substr(0,1) === 'L' ){
                         for ( j = 0 ; j < listStore.data.length ; j++ ) {
	                         var record = listStore.data.items[j];
	                         if( record.data.video_id == modifiedRecord.get( 'video_id' ) ) {
	                           record.data.taskStatus = r[i].status; 
	                           record.data.taskId = r[i].uid;
	                           record.data.statusCls = currentStatusRecord.get('Cls')+'-'+r[i].status;
	                           record.data.statusTooltip =  currentStatusRecord.get('LessonTooltip');
	                           record.data.unreadCount = 1;
	                           if( !Ext.isEmpty(subSequentContent) ){
	                        	     var subSeqentContentArray = subSequentContent[record.get('video_id').substr(1)];
	                        	     if(subSeqentContentArray.length > 0){
	                        	    	 for ( k = 0 ; k < listStore.data.length ; k++ ) {
	                        	    		 var contentRecord = listStore.data.items[k];
	                        	    		 if(contentRecord){
	                        	    			 if( r[i].status != '99'){
	                        	    				 //When Task ReOpened Scenarios
	                        	    				 var lessonSubsequentIndex = subSeqentContentArray.indexOf(contentRecord.get('video_id').substr(1));
	                        	    				 if( lessonSubsequentIndex != -1 ){
	                        	    					 var subsequentArray = contentRecord.data.quizRequiredToPass;
	                        	    					 var indexValue =Ext.Array.indexOf(subsequentArray, modifiedRecord.get('video_id').substr(1));
	                        	    					 if(indexValue == -1){                			
	                        	    						 subsequentArray.push(modifiedRecord.get('video_id').substr(1));
	                        	    					 }
	                        	    				 }
	                        	    			 } else if( r[i].status == '99'){
	                        	    				 //When Task Complete Scenarios
	                        	    				 var lessonSubsequentIndex = subSeqentContentArray.indexOf(contentRecord.get('video_id').substr(1));
	                        	    				 if( lessonSubsequentIndex != -1 ){
	                        	    					 
	                        	    					 //Here caliculating the lesson completed status based on lesson settings.
	                        	    					 //When ever we are going to take off the lesson id from the respective videos we need to check for 
	                        	    					 //lesson completion status , then we are going to find that video in the sub sequent arry of this particular content
	                        	    					 //and we will remove that id from the array
	                        	    					 var subsequentArray = contentRecord.data.quizRequiredToPass;
	                        	    					 var indexValue = Ext.Array.indexOf(subsequentArray, modifiedRecord.get('video_id').substr(1));
	                        	    					 if(indexValue != -1){	      
	                        	    						 subsequentArray.splice(indexValue,1);
	                        	    					 }
	                        	    				 }
	                        	    			 }
	                        	    		 }
	                        	    	 } //loop throut the course content grid records
	                           		} //subSeqentContentArray  is not empty or not
	                            } // Sub sequent array we are getting from the backend is not empty or not
	                           
	                           //Checkin the current video id is 
	                           if( !Ext.isEmpty(lessonCompleteStatus) ){
	                        	  var lessonComStatus =  lessonCompleteStatus[record.get('video_id').substr(1)];
	                        	  if(!Ext.isEmpty(lessonComStatus)){	                        		  
	                        		  record.set('lessonCompletedStatus',lessonComStatus);
	                        	  }
	                           }
	                         } //check of modified record and record in the loop are same
                         }
                       }else if( modifiedRecord.get( 'video_id' ).substr(0,1) === 'Q' ){
                    	    listStore.getAt(recordIndex).data.taskStatus = r[i].status;
			                listStore.getAt(recordIndex).data.statusCls = currentStatusRecord.get('Cls')+'-'+r[i].status;
			                //201311191850
			                var tooltip = this.getCorrectTooltip(currentStatusRecord);
			                listStore.getAt(recordIndex).data.statusTooltip = tooltip ; //currentStatusRecord.get('QuizTooltip')
			                listStore.getAt(recordIndex).data.unreadCount = r[i].unreadcount ;
			                if ( selected && selected.get( 'uid' ).substr(0,1) === 'Q' ) {
			                	if( recordIndex != -1 ){
				                    var quizWin = Ext.ComponentQuery.query( 'quiz' )[0];
				                    var quizTabPanel = quizWin.down( 'badgetabpenl' );
				                    var questions = quizTabPanel.items;
				                    var statusRecord = currentStatusRecord;
				
				                    for( k = 0 ; k < quizTabPanel.items.length ; k++ ){
				                      if( ( questions.items[k].uid ) && ( questions.items[k].uid == r[i].reference.question_id ) ){
				                        questions.items[k].setIconCls( 'status0'+r[i].questionStatus+'-quiz' ) ;
				                        //201311171420
				                        var badgeTab = Ext.ComponentQuery.query('badgetab')[k];
				                        var statusCls = badgeTab.setToolTip(r[i].questionStatus,true );
				                        Ext.getElementById(badgeTab.id+'-btnIconEl').setAttribute('data-qtip',statusCls);
				                        if( r[i].unreadcount ){
				                          quizTabPanel.updateBadge(k,THREAD.UNREAD,false);
				                        }
		
				                        var dockedItem = questions.items[k].down('fbarbutton');
				                        if( dockedItem ) {
				                          questions.items[k].remove( dockedItem);
				                        }
				                        //201311301937
				                        var questionStatusRecord = taskStatusStore.findRecord( 'ID',r[i].questionStatus );
				                        var tooltipText = questionStatusRecord.get('LessonTooltip');
					                    if( r[i].questionStatus  == '5' && !SWP.instructLogin ){
					                        tooltipText =  TASKSTATUS.OPEN_UPDATED_BY_YOU;
					                    }
				                        questions.items[k].add( Ext.create( 'SWP.view.FbarButton', {
		                                    cls: 'fbarCls'+r[i].questionStatus,
		                                    overCls:'fbarOverCls'+r[i].questionStatus,
		                                    tooltip: tooltipText, 
		                                    taskId :r[i].uid
				                        }) );
				                      } // eND OF QUESTION lOOP
				                    } // End of the foor loop (Quiz Tab Panel Items looping)
			                	} // End of If (Chekcing record index)
			                } // End of if (Checking the selected record is Quiz Type Or not)
                       }// End of if (Checking the modifiedRecord record is Quiz Type Or not)

                      var selectedRecs  =list.getSelectionModel().getSelection();
                      //Refresh the view
                      list.getView().refresh();
                      
                      if ( selectedRecs.length > 0 ){
                        list.getSelectionModel().select( selectedRecs , false,true);
                        Ext.ComponentQuery.query( 'chapterslist')[0].refreshIcons( selectedRecs[0]);
                      }
                      
                      //code regerding to auto refresh the  courseTaskSummary button in List
                      var chapterList = Ext.ComponentQuery.query( 'chapterslist' )[0];
	                  if (  courseStatus ){
	                	  var setClass = 'course-status-0'+courseStatus;
	                  }else {
	                	  var setClass = 'fully-completed';
	                  }

                     // 201311220510
                      var courseTaskIcon = Ext.getCmp(chapterList.getId()+'-courseTaskSummary' );
                      courseTaskIcon.setIconCls(setClass);

                      this.updateCourseTaskIconTooltip(chapterList, courseTaskIcon, setClass);
                
                      Ext.getCmp( chapterList.getId()+'-courseTaskSummary' ).enable(true);
                
                      var dataGrid = Ext.ComponentQuery.query('datagrid')[0];
                      if( dataGrid ){
                    	  dataGrid.getStore().load();
                      }
                  }

                
                  //If the Last update user is not the login user then we need to go 
                  //and update the badge cout and other things
                  if ( r[i].last_update_user_id != SWP.Ruid ) {
                    var taskSummarry = Ext.ComponentQuery.query('datagrid');
                    if ( taskSummarry.length ){
                      taskSummarry[0].getStore().load();
                    }
                    
                    var reference = '';
                    if( r[i].link ) {
                      reference = r[i].link;
                    } 

                    if( r[i].posts > 1 ) {
                      wtc.msg( r[i].postSubject,reference, 1000);
                    } else {
                      wtc.msg( r[i].subject,reference, 1000);
                    }

                    badgebutton = Ext.ComponentQuery.query(' badgebutton ')[0];

                    /**
                     * 
                     *  If user is watching a thread, to which another user has sent a reply
                     *  for that thread, increasing badge count + 1, and if more than 1 comes, 
                     *  not incrementing the badge count. 
                     *  Achieving this by pushing the unread message's
                     *  thread_id into an array ( this.unReadThreads ) and comparing weather new message 
                     *  thread_id is matching to array or not. If yes, not increasing badge count and if no
                     *  increasing it by 1.
                     */

                    if( ( r[i].unread_Post_Count == true || r[i].unread_Post_Count > 0 ) ) {
                      if( ! Ext.Array.contains( this.unReadThreads, r[i].uid ) ) {
                        this.unReadThreads.push( r[i].uid );
                        if ( badgebutton.getBadgeText() == ' ' || badgebutton.getBadgeText() == undefined ) {
                          badgebutton.setBadgeText(1);
                        } else {
                          badgebutton.setBadgeText(badgebutton.getBadgeText()+1);
                        }
	                    //the below code will help for:
	                    //When the Two Instances (Student , instructor) message windows are open dinamically we have to change the message badge text 
	                    //when student or instructor gives reply or new message.
	                    var string = '{success:true, eventName:"badegetabtext",rows:[{"thread_type_id":'+r[i].thread_type_id+',"uid":"'+r[i].uid+'","thread_catogery_id":'+ r[i].thread_catogery_id +'}]}';
	                    this.dataSend(string);
                      }
                    }
                    var string = '{success:true, eventName:"loadtabdata"}';
                    this.dataSend(string);
                 }
              }
            }
          }
      },this);
    },
    findLockingContent: function(taskStatus , video_id){
    	
    },
    logTransfer: function( interval ) {

      try {

        var bw = 0, blockvalue,ch, progress, gview, row, i, chs, ref = (document.referrer

                    .match(/freshsystems/)) ? 'creator'

                    : 'player', ts = Math.round((new Date())

                    .getTime() / 1000);

            ch = this.findPlaying();

            if( ch ){

              var lesson = ch.get('video_id');

              var videoId = lesson.substr(1, lesson.length);

            }

            var questionindex=null;

            var ts =0;

            var usage =0;

            var chapter_id =null;
            
            var player = this.getPlayer();
            
            if ( this.getQuizView().hidden && (player.getFlowPlayer().getState() === 4 ||  player.playingVideo())) {
              
              /**
               * If the player is paused and the currently played lesson is having "quizRequiredToPass"
               * configuration true then we are getting the previously played lesson and sending the log transfer
               * request to backed.
               * refs #22794
               * */
              
              if( player.getFlowPlayer().getState() === 4 && ch.get('quizRequiredToPass') > 1 ){
                
                var chs = Ext.StoreManager.lookup('chapters');

                var i = chs.findBy( function( rec, id ){

                  return ( rec.get('video_id') == SWP.video && 

                      ts >= rec.get('start') && 

                      ts <= rec.get('stop') );

                },

                this );
                if( i > -1 ){
                  
                  ch = chs.data.items[i];
                  var lessonName = ch.get('video_id');
                  videoId = lessonName.substr(1, lessonName.length);
                }
              }
                bw = this.getPlayer().bwcheckPlugin().getBitrate();

                ts = this.getPlayer().getTime();

                usage = bw * interval / 8;

                chapter_id = ch.get('uid').split('_')[1];


            } else {

              if( ! this.getPlayer().getFlowPlayer().justFinished ) {

              }
              
              if( !this.getQuizView().hidden ){
                
                var activeTab = this.getQuizView().down('tabpanel').getActiveTab();
                if( activeTab ){
                  
                  questionindex =this.getQuizView().down('tabpanel').getActiveTab().uid;
                }

              }
                usage = -1;
            }


              language = SWPtmp.caption;



            //

            // If the role is instructor and he is playing the video then capture video details. 

            // Since this usage will be tracked into different account, there is no need to transfer

            // the usage detail to Avalton

            //

            if( SWP.instructLogin && !Ext.isEmpty( videoId ) ){
            	this.getChapters().refreshIcons(ch);
            	return;
            }

            if( !Ext.isEmpty( videoId ) ){
              //var progressValue = this.calculateProgress();
              // 201311221251
            	 VideoRecordMgr.getCourseProgress(true,function(r, t) {
            		 if(t.status){     
            			 VideoRecordMgr.logTransferAvalton( usage , ref, r , chapter_id, videoId,ts, questionindex,language);
            			 //For the editors login no need to register for the course progress
            			 if(!SWP.editorsLogin){            				 
            				 CollaborationToolMgr.registerBusinessEventForCourseProgress(r);
            			 }
            		 }
            	 },this);
            }

            if ( this.getPlayer().playingVideo() == true && !this.getPlayer().justplay ) {
		
               grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
               gview = grid.getView();
               if(!SWP.instructLogin){
                  if (!ch.get('seen')) {
                	  var trackSeenUid = ch.get('uid');
                	  VideoRecordMgr.trackSeen( trackSeenUid, true,false,false, function(r,t){
                		 ch.set('seen', true);
                         this.getChapters().refreshIcons(ch);
                         this.markLessonAsViewed(grid,ch);
                      },this);
                  } else {
                    // If the chapters are already seen, still we need to refresh the icons.
                    this.getChapters().refreshIcons(ch);
                    this.markLessonAsViewed(grid,ch);
                  }
               }
           }else {
              this.getPlayer().justplay = false;
           }
        } catch (e) {

             console.log( 'logTransfer' + e.message );

        }

        },
   markLessonAsViewed : function(grid,ch){
	   var row, i,gview, chs ,isViewed ,hd;
	    gview = grid.getView();
	    chs = grid.getStore();
       if (row = gview.getNode(ch)) {
    	   isViewed = true;
           //Checking all the chapters in the lesson is viwed.
           for (i = 0; i < chs.getCount(); i++) {
               if ((chs.getAt(i).get('video_id') == ch.get('video_id')) && 
            		   !chs.getAt(i).get('seen')) {
            	   isViewed = false;
                   break;
               }
           }

           	if (isViewed) {
	             //Here we will validate the lesson completion status 
	             //If we get the status as true the we can consider that lesson is complete.
	             //So we can unlock any content which is dependent on this lesson completion status.
	             if(ch.get('video_id').substring(0, 1) == 'L'){	            	 
	            	 VideoRecordMgr.getLessonCompletedStatus(ch.get('video_id').substring(1),SWP.PID,function(r,t){
	            		 if(t.status){
	            			 if(!Ext.isEmpty(r)){
	            				 if(r){
	            					 var videoID = ch.get('video_id').substring(1);
	            					 var list = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
		            			     var listStore = list.getStore();
	            					 for (var j = 0; j < listStore.data.length; j++) {
	            			                var rec = listStore.data.items[j];
	            			                if (parseInt(rec.get('video_id').substr(1)) == videoID) {
	            			                  rec.set('lessonCompletedStatus',true);
	            			                }
	            			         }
	            					 
	            					 var groupName = ch.get('ordering');
	            		             var groupHeader = Ext.get(Ext.ComponentQuery.query('chapterslist gridpanel')[0].getView().getFeature('lesson').getHeaderNode(groupName));
	            		             if( groupHeader ){
	            		            	 hd = groupHeader.down('.group-header-icon');
	            		             }
	            		             var groupTitle = groupHeader.down('.x-grid-group-title');
	            		             if( groupTitle ){
	            		            	 groupTitle.removeCls('notseen-font').addCls('seen-font');
	            		             }
	            		            // If the lesson chapters are seen then we are adding the
	            		            // lesson-close-expand class and removing the lesson-open-expanded
	            		             if(hd){
	            		            	 hd.removeCls('lesson-open-expanded');
	            		            	 hd.addCls('lesson-close-expanded');
	            		             }
	            					 
		            			     //Loop through all the content in the content grid and find out is this lesson ID exists in the 
		            			     //quizRequiredToPass array of the particular content.
		            			     //if you found once we will remove that content id from the array.
		            				 for (i = 0; i < chs.getCount(); i++) {
	            					 	chs.getAt(i).get('video_id');
	            					 	var subsequentArray = [];
	            					 	subsequentArray = listStore.data.items[i].get('quizRequiredToPass');
	            					 	if(!Ext.isEmpty(subsequentArray)){
	            					 		var indexValue = Ext.Array.indexOf(subsequentArray, videoID);
	            					 		if(indexValue != -1){	            					 			
	            					 			subsequentArray.splice(indexValue, 1);
	            					 		}
	            					 	}
		            			 	 }
		            				 list.getView().refresh();
		            		         this.FocusSelectedItem();
	            				 } else {
	            					 var videoID = ch.get('video_id').substring(1);
	            					 var list = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
		            			     var listStore = list.getStore();
	            					 for (var j = 0; j < listStore.data.length; j++) {
	            			                var rec = listStore.data.items[j];
	            			                if (parseInt(rec.get('video_id').substr(1)) == videoID) {
	            			                  rec.set('lessonCompletedStatus',false);
	            			                }
	            			         }
	            					 
	            					 list.getView().refresh();
		            		         this.FocusSelectedItem();
	            				 }
	            			 }
	            		 }
	            	 },this);
	             }
           } else {
	            if(hd){                                	
	            	hd.removeCls('row-seen');
	            }
           }
       }
   },
  /**
   
   * this method will be called when user selects one of the items in the captions combo
   
   * in the comments grid.
   
   *
   
   * hides and unhides the captions based on the selection value
   
   */

  swapCaptions: function(gridpnl, combo, recs) {



    var flowplayer = this.getPlayer().getFlowPlayer();



    if (flowplayer && flowplayer.isLoaded()) {



      if (SWPtmp.caption == VIDEOCAPTIONSETTINGS.NOCAPTIONS) {

        flowplayer.getPlugin('content').hide();

      } else {

        flowplayer.getPlugin('content').show();

        var chapterRec = this.getChapters().getSelectedChapter();

        if (chapterRec.get('uid').substr(0, 1) == 'Q') {

          var tab = this.getQuizView().down('tabpanel').getActiveTab();

          var Chapter = this.getChapterModel();

          chapterRec = new Chapter({
            captions: tab.captions
          });

        }

        this.loadCaptions(undefined, flowplayer, chapterRec);

      }

    }

  },

  /**
   
   * This method will be executed when video starts playing. and when caption-language selection changed
   
   * loads the captions
   
   *
   
   */

  loadCaptions: function(swppnl, flowplayer, chapterRec) {



    var captionsLang = SWPtmp.caption;

    var select = this.getChapters().getSelectedChapter()



    if (captionsLang == CAPTIONS.NO_CAPTIONS && select.get('uid').substr(0, 1) == 'Q') {



      this.getPlayer().getFlowPlayer().getPlugin('content').hide();

      return;

    } else {



      var flowPlayer = this.getPlayer().getFlowPlayer();

      var chapterCaps = chapterRec.get('captions');

      if (!Ext.isEmpty(chapterCaps)) {



        for (var l = 0; l < chapterCaps.length; l++) {



          if (captionsLang == chapterCaps[l]['language_id']) {



            /*
             
             *  Applying styles for captions based on the records coming from back end.
             
             *  Checking condition weather styles were already applied to captions or not.
             
             *  If no, then only calling to getVideocaptionSettings function.
             
             *
             
             */
            this.applyCaptionStyles(flowPlayer);
            flowPlayer.getPlugin('content').show();

            flowPlayer.getPlugin('captions').loadCaptions(0, chapterCaps[l]['captions']);

            break;

          } else {

            flowPlayer.getPlugin('content').hide();

          }

        }

      }

    }

  },



  /**
   
   * Getting caption settings data from back end and applying font size along with height to the captions plugin.
   
   * Calling update caption styles method to apply.
   
   *
   
   */



  applyCaptionStyles: function(flowPlayer, isFromFullScreen) {



    VideoRecordMgr.getVideoCaptionSettings(null, function(record, t) {



      if (t.status) {



        for (var i = 0; i < record.length; i++) {



          // Apply the fontsize to the plugin body fontsize.

          if (record[i].key == VIDEOCAPTIONSETTINGS.FONTSIZE) {



            if (isFromFullScreen) {



              flowPlayer.recordOnFullScreen = record[i];

            }



            // Apply the fontsize to the plugin body fontsize.

            this.updateCaptionStyles(flowPlayer, record[i]);

          }

        }

      }

    }, this);

  },



  /**
   
   * On fullscreen exit, resetting the values of height and font.
   
   *
   
   */



  handleFlowplayerFullScreenExit: function(flowPlayer) {



    // Apply the fontsize to the plugin body fontsize.

    if (flowPlayer.recordOnFullScreen) {



      this.updateCaptionStyles(flowPlayer, flowPlayer.recordOnFullScreen);



      flowPlayer.recordOnFullScreen = null;

    }

  },



  /**
   
   *  Saves the caption settings and applies them to the captions dynamically.
   
   *
   
   */



  saveCaptionSettings: function(captionWindow) {



    var gridPanel = captionWindow.down('gridpanel');

    var gridStore = gridPanel.getStore();

    gridPanel.setLoading(true);

    var options = {

      scope: this,

      callback: function(record, operation, success) {



        /*
         
         *  On Successful saving Caption style settings, applying those
         
         *  Styles to the captions based on the response.
         
         */



        if (record.operations[0].success) {

          gridPanel.setLoading(false);

          var flowPlayer = this.getPlayer().getFlowPlayer();

          var savedRecord = operation.operations.update[0];

          if (savedRecord.get('key') == VIDEOCAPTIONSETTINGS.THEME) {



            Ext.MessageBox.show({



              title: VIDEOCAPTIONSETTINGS.INFO,

              msg: VIDEOCAPTIONSETTINGS.THEME_SAVE,

              buttons: Ext.Msg.OK,

              modal: true

            });

          }
          if (savedRecord.get('group') == VIDEOCAPTIONSETTINGS.PLAYER_SETTINGS) {
            SWPtmp.chapter_play_back = savedRecord.get('value');
            //201406170430
            //When user changes the chapter based play back then without refreshing the player 
            //we are allowing to stop the player at markers.
            var ch = this.findPlaying();
            var swpplayerCmp = Ext.ComponentQuery.query('swpplayer')[0];
            var flowplayerCmp = swpplayerCmp.down('flowplayer');
            swpplayerCmp.currentPosition = ch.get('start');
			flowplayerCmp.registeredCuepoints = true;
			swpplayerCmp.fireEvent("registercuepoints",ch );
          }
          if (savedRecord.get('key') == VIDEOCAPTIONSETTINGS.VIDEOCAPTION) {

            SWPtmp.caption = savedRecord.get('value');
            this.swapCaptions();
          }



          if (flowPlayer.isLoaded()) {



            /**
             
             *   TODO  As of now, just checking each key field and based on that, every time
             
             *   applying css for content body. But, this must be simplified.
             
             *
             
             */

            if (savedRecord.get('key') == VIDEOCAPTIONSETTINGS.FONTSIZE) {



              this.updateCaptionStyles(flowPlayer, savedRecord);



            }


            //  if( savedRecord.get('key') == VIDEOCAPTIONSETTINGS.FONT_STYLE ) {



            //   flowPlayer.getPlugin('content').css({

            //    'body': {



            //     "fontFamily" : savedRecord.get('value')

            //    }

            //   });



            //  }else if( savedRecord.get('key') == VIDEOCAPTIONSETTINGS.ALIGN ) {



            //   flowPlayer.getPlugin('content').css({

            //    'body': {



            //     "textAlign" : savedRecord.get('value')

            //    }

            //   });



            //  }else if( savedRecord.get('key') == VIDEOCAPTIONSETTINGS.WIDTH ) {



            //   flowPlayer.getPlugin('content').css({



            //  width : savedRecord.get('value')+'%'

            // });



            //  }else if( savedRecord.get('key') == VIDEOCAPTIONSETTINGS.FONTSIZE ) {



            //  this.updateCaptionStyles(flowPlayer,savedRecord);



            //  }else {



            //   flowPlayer.getPlugin('content').css({



            //    'body': {



            //     "color" : savedRecord.get('value')

            //    }

            //   });

            //  }

          }



        } else {

          gridPanel.setLoading(false);

          Ext.MessageBox.show({



            title: MESSAGE.CLASSROOM_SAVE_FAIL,

            msg: MESSAGE.CLASSROOM_SAVE_FAILMSG,

            buttons: Ext.Msg.OK,

            modal: true,

            icon: Ext.MessageBox.ERROR

          });

        }

      }

    }

    /*
     
     * If no modification happen to the edited value then backend request should not go.
     
     * */

    if (gridStore.getModifiedRecords().length == 0) {



      gridPanel.setLoading(false);



    } else {



      gridStore.sync(options);

    }

  },



  /**
   
   * Applying caption styles when user modifies caption settings or
   
   * when video related captions comes for first time, while
   
   * selection of caption from captions combo.
   
   */



  updateCaptionStyles: function(flowPlayer, savedRecord) {



    var captionFontSize = null;



    if (savedRecord.get) {



      captionFontSize = savedRecord.get('value');



    } else {



      captionFontSize = savedRecord.value;

    }



    flowPlayer.getPlugin('content').css({

      'body': {



        "fontSize": captionFontSize + 'px'

      }

    });



  },

  /**
   
   * The method, saveUpload, will be called when user clicks on save button on the upload popup.
   
   * It zips all the files uploaded as part of the package into a single file and saves
   
   * the path of the zip file and its details into TrainingFiles record
   
   *
   
   * @param uploadPanel - the panel from which the save button has been clicked. After saving
   
   *                      the record in the data base the panel will be closed.
   
   * @param savebutton  - the button clicked to invoke this handler
   
   * @param uniqueId  - the unique file path
   
   * @param uploadName - The package name for the uploaded files
   
   *
   
   */

  saveUpload: function(uploadPanel, uniqueId, uploadName) {



    var newFile = new SWP.model.File({

        username: SWP.Ruser,

        user_id: SWP.Ruid,

        rolename: SWP.Rrolename,

        role_id: SWP.Rroleid,

        filename: uploadName,

        filesize: 0,

        uploaddate: new Date(),

        product_id: SWP.PID,

        lesson_id: SWP.selected.LESSON + "_" + SWP.selected.LESSON_ID,

        question_id: SWP.selected.QUESTION + "_" + SWP.selected.QUESTION_ID,

        filepath: uniqueId

      }

    );



    var grid = Ext.ComponentQuery.query(' workfiles filesgrid')[0];



    grid.setScrollTop(0);

    grid.getStore().insert(0, [newFile]);

    grid.getStore().sync();

    grid.getStore().load({
      params: {

        flessond_id: SWP.selected.LESSON_ID,

        fqeustion_id: SWP.selected.QUESTION_ID,

        fchapter_id: SWP.selected.CHAPTER_ID,

        flesson: SWP.selected.LESSON,

        fproduct_id: SWP.PID
      }

    });

    uploadPanel.close();

    var workfiles = Ext.ComponentQuery.query('workfiles ')[0];

    workfiles.show();



  },

  /**
   
   *  Called when a file gets uploaded. Enabling the save button, if the result is success.
   
   *  after completion of atleast one file upload.
   
   *
   
   */

  fileupload: function(uploader, success, result, file, uniqueid) {



    if (success) {



      var name = file.name;

      if (!name) {

        name = file.get('name');

      }

      console.debug('File Uploaded!', 'A file has been uploaded!' + result + name + uniqueid);



      var savebtn = Ext.getCmp('traininguploadsavebtn');

      savebtn.enable(false);

    }

  },



  /**
   
   * validate the package name . if the packages with same name exists
   
   * then show's alert message to user, asking to change the package name.
   
   */



  validatepkgename: function(uploader, pkgName, totalItems, filesGrid, awesomeUploader) {

    var index = filesGrid.getStore().findBy(function(rec) {



      if (rec.get('filename') == pkgName) {

        return true;



      }

    }, this);



    if (index > 0) {

      Ext.MessageBox.show({

        title: 'Upload Error',

        msg: ' Package with the same name already exists. Please change the package name .',

        buttons: Ext.Msg.OK,

        modal: false,

        icon: Ext.MessageBox.ERROR

      });

      return false;

    }



    return true;



  },

  /**
   
   *   Removes the selected uploaded file from database, if status is done,by calling
   
   *   removeUploadFile function to videoRecordMgr.php file. else, removing the record from
   
   *   store.
   
   *   @param fileGrid, selected row record, uniqueId of package, name of uploaded file,
   
   *   and lesson name respectively.
   
   */



  deletefilehandler: function(UploadGrid, UploadData, uniqueId, filename, lessonname, QuestionName) {

    if (UploadData.get('status') == 'Done' || UploadData.get('status') == 'Error') {



      VideoRecordMgr.removeUploadedFile(uniqueId, filename, SWP.selected.LESSON, SWP.selected.QUESTION, function(r, t) {

        if (t.status) {

          if (UploadGrid.getStore().getCount() == 0) {


            Ext.getCmp('traininguploadsavebtn').disable(false);

            Ext.getCmp('traininguploadCancelbtn').enable(false);

          }

        }

      });

    } else {



      if (UploadGrid.getStore().getCount() == 0) {

        Ext.getCmp('traininguploadsavebtn').disable(false);

        Ext.getCmp('traininguploadCancelbtn').enable(false);

      }

    }

  },

  deleteFromFile: function(UploadGrid, UploadData, uniqueId, filename, instanceId, lessonname, QuestionName) {



    if (UploadData.get('status') == 'Done' || UploadData.get('status') == 'Error') {

      var filepath = 'tmp/' + instanceId + '/' + uniqueId + '/' + filename;

      CollaborationToolMgr.removeFile(filepath);

    }

  },



  /**
   
   *
   
   * Calling removeUploadedFile function to remove the unsaved uploaded files, when user clicks on cancel button.
   
   *
   
   */

  canceluploadedfiles: function(uploadpnl, uniqueid) {



    Ext.MessageBox.confirm(('Confirm'), ('All the Uploaded Files Will be Lost, if any'), function(btn, text) {

      if (btn == 'yes') {



        VideoRecordMgr.removeUploadedFile(uniqueid, null, SWP.selected.LESSON, SWP.selected.QUESTION, function(r, t) {

          if (t.status) {

            uploadpnl.close();

            var workfiles = Ext.ComponentQuery.query('workfiles ')[0];

            workfiles.show();

          }

        });

      }

    }, this);

  },



  /**
   
   * retore session is the handler function for the LastRuns store. called while loading the data into the lastruns store.
   
   * if the record for the user and course combination exists then show popup to choose for restoring the last run.
   
   */

  restoreSession: function(me, recs) {

    SWP.LastRun = me.getAt(0);

    var confirmMsg = 'Do you want to resume the course where you left off the last time?';

    if (Ext.isIE9) {
      var zoomLevel = screen.deviceXDPI / screen.logicalXDPI;
      if (zoomLevel == 0.75) {
        confirmMsg = 'Do you want to resume the <br />course where you left off the last time?';
      }
    }
    
    if (SWP.LastRun && SWP.LastRun.get('video_id')) {
      Ext.Msg.hide();
      
      //201405220645
      //If message window Exists means player is already lanched then there is 
      //no point in asking the restore window again
      if(!this.MesagewindowExist){
    	  Ext.MessageBox.show({

    	        title: 'Restore?',

    	        msg: confirmMsg,

    	        buttons: Ext.MessageBox.YESNO,

    	        fn: this.showResult,

    	        cls: 'resumeAlertStyles',

    	        icon: Ext.MessageBox.QUESTION

    	  }, this);
      }
    }

    return true;

  },

  /**
   
   * this function is handler for he message box shown in the restoresession function.
   
   * if user selects the yes then with the existing the last run info details plays the chapter or quiz.
   
   *
   
   */

  showResult :function( btn  ){

      if ( btn==='yes' ){

        var chapter = Ext.ComponentQuery.query('chapterslist')[0];

        var chapterpanel = Ext.ComponentQuery.query('chapterslist gridpanel')[0];

        

        var chs = chapterpanel.getStore();

        var i = chs.findBy( function( rec, id ){

          return ( rec.get('video_id').substr(1) == SWP.LastRun.get('video_id') && 

              ( (SWP.LastRun.get('position') == 0 ) || (SWP.LastRun.get('position') >= rec.get('start') && 

                  SWP.LastRun.get('position') < rec.get('stop')) ) );

        },

        this );

        var questionIndex = 0;
        
        var selected = chs.getAt(i);

        if ( selected.get('video_id').substr(0,1) === 'Q' ){

          questionIndex = SWP.LastRun.get('question_id');

        }
        chapter.fireEvent( 'chapterselected', 

            chapter,

            chapterpanel,

            null,

            selected,

            null,

            null,

            null,

            null,

            questionIndex,

            SWP.LastRun.get('position') ,

            SWP.LastRun.get('language'));

      }

    },

  calculateProgress: function() {
    var chs = Ext.StoreManager.lookup('chapters'),

      recs = chs.getRange(),

      total = recs.length,

      seen = 0;
    /**
     * For getting the total course progress use this following back end request 
     */
//    VideoRecordMgr.getCourseProgress(true,function(r, t) {
//    	alert(r);
//    },this);
    //201407041118
    for (var i = 0; i < total; i++) {
    	if(!Ext.isEmpty(recs[i].get('quizStatus'))){
    		if(recs[i].get('quizStatus') != 'required-quiz-failed'){
    			if(recs[i].get('seen')){    				
    				seen++;
    			}
    		}
    	}else {
    		 if (recs[i].get('seen')) {
    		        seen++;
    		 }
    	}
    }
    return Math.round(100 * seen / total);
  },

  /**
   
   *   This method is used by checkboxgroup related controls of quiz component.
   
   *   The quiz module uses this control whenever there is a need to specify multiple
   
   *   answers (one or more) for a given question.
   
   *
   
   *   This handler is invoked whenever there is a change in answer of a given question.
   
   *   A successful call to this handler updates (or create - for the first time) all the
   
   *   possible answers for that question.
   
   *
   
   *   @param n contains either the single checked element or an array of checked elements
   
   *   @param rg is the checkbox group node
   
   */

  quizAnswer: function(rg, n) {
    if (rg.xtype === 'radiogroup') {
      return;
    }

    var res = [],a,answers = rg.items.items,nn = n['a' + rg.questionId];
    this.markQuizQuestionAnswered(rg.questionId);
    for (var i = 0; i < answers.length; i++) {
      a = 0;
      if (Ext.isArray(nn)) {
        for (var inputIndex = 0; inputIndex < nn.length; inputIndex++) {
          if (nn[inputIndex] === answers[i].inputValue) {
            a = 1;
            break;
          }
        }
      } else {
        a = (nn == answers[i].inputValue) ? 1 : 0;
      }
      res.push([answers[i].inputValue, a]);
    }

    var quizPanel = this.getQuizView().down('tabpanel');
    var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0],
	gridSelect = grid.getSelectionModel().getSelection( )[0];
    if( (gridSelect.get('quizStatus') == CHAPTERlIST.REGULAR_QUIZ_COMPLETED ) || (gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_PASSED) ||
			(gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_FAILED)  ){
		if(quizPanel.items.last().postevaluation == 4){
			var questionRes = [];
			if(!Ext.isEmpty(SWP.modifiedQuestion[SWP.QuizID])){	 
				questionRes = SWP.modifiedQuestion[SWP.QuizID];
			}
	    	questionRes[rg.questionId] = res;
	    	SWP.modifiedQuestion[SWP.QuizID]= questionRes;
		}
		//This method call will decide this question is modified or not according to that 
		VideoRecordMgr.getQuizAnswerModifiedStatus(rg.questionId, res, function(r, t) {
    	      if (t.status) {
	    	       var result = r;
	    	       var questionRespose = [];
	    	       if(!Ext.isEmpty(SWP.quizQuestionmodifyStatus[SWP.QuizID])){	 
	    	    	   questionRespose = SWP.quizQuestionmodifyStatus[SWP.QuizID];
   				   }
	    	       if(result.isModified){
	    	    	   questionRespose[rg.questionId] = 1;
	    	    	   SWP.quizQuestionmodifyStatus[SWP.QuizID] = questionRespose;
	    	       } else {
	    	    	   questionRespose[rg.questionId] = 0;
	    	    	   SWP.quizQuestionmodifyStatus[SWP.QuizID] = questionRespose;
	    	       }
	    	       var keys = [];
				   for (var key in SWP.quizQuestionmodifyStatus[SWP.QuizID]) {
					    keys.push(key);
				   }
				   for(var i=0; i < keys.length ; i++){
						var count = keys.length;
						var questionArray = SWP.quizQuestionmodifyStatus[SWP.QuizID]
						var res = questionArray[keys[i]];
						if(!Ext.isEmpty(res)){
							if(res == 1){
								SWP.quizModifiedQuiz[SWP.QuizID] = 1;
								break;
							}else{
								SWP.quizModifiedQuiz[SWP.QuizID] = 0;
							}
						}
				   }
    	      }
    	 }, this);
    } else{
    	VideoRecordMgr.saveQuizAnswer(rg.questionId, res, function(r, t) {
    	      if (t.status) {
    	        this.refreshQuizStatusIcon(t.result);
    	      }
    	}, this);
    }
  },

  /**
   
   * mark the questions of the quiz as answered once the quiz answers are saved.
   
   * this will be called from quizAnswerSingle,quizAnswer,quizAnswerText functions
   
   */

  markQuizQuestionAnswered: function(questionId , unmarkQuizAndAnswer) {
    var exists = false;
    for (var l = 0; l < SWP.quizAnsweredQuestions.length; l++) {
      if (SWP.quizAnsweredQuestions[l] == questionId) {
        exists = true;
        break;
      }
    }
    //SWP.quizModifiedQuiz[SWP.QuizID] = 1;
    if (!exists) {
      if (Ext.isEmpty(SWP.quizAnsweredCount[SWP.QuizID])) {
        SWP.quizAnsweredCount[SWP.QuizID] = 1;
      } else {
        SWP.quizAnsweredCount[SWP.QuizID] = SWP.quizAnsweredCount[SWP.QuizID] + 1;
      }
      SWP.quizAnsweredQuestions.push(questionId);
    } else { //201312270330
    	if(unmarkQuizAndAnswer) {
        	  if(!Ext.isEmpty(SWP.quizAnsweredQuestions)) {
        		  var qIndex = -1;
        		  SWP.quizAnsweredQuestions.forEach(function(element, index, array){
        			  if(element == questionId){
        				qIndex = index;  
        			  }
        		  });
        		  if(qIndex > -1){
        			  	SWP.quizAnsweredQuestions.splice(qIndex,1);
        		  		SWP.quizAnsweredCount[SWP.QuizID] = SWP.quizAnsweredCount[SWP.QuizID] - 1;
        		  }
        	  }
          }	
     }



  },

  /**
   
   * This method is used by radiogroup related controls of quiz component.
   
   * In case of RadioGroup - change fires two events and the first event shows two items as selected.
   
   * We need to ignore that event and process the next event to post the effective changes into
   
   * the database.
   
   *
   
   * @param RadioGroup object provides details about all the available options
   
   * @param checkedElement(s) - the list of checked element or just the single elelement checked by the user.
   
   *        In case of single checked element, the checkedRadio object looks like Object { a147="80"}, where a147 is
   
   *        question id 147 and 80 is the answer id corresponding to selected radio button.
   
   * @return - in case multiple radio buttons are in checked status, this function returns without doing anything.
   
   */

  quizAnswerSingle: function(rg, checkedRadio) {
    if (Ext.isArray(checkedRadio['a' + rg.questionId])) {
      return;
    }

    //201312270330
    var unmarkQuizAndAnswer = false;
    if(Ext.isEmpty(checkedRadio['a' + rg.questionId])) {
    	unmarkQuizAndAnswer = true;
    }
    
    this.markQuizQuestionAnswered(rg.questionId,unmarkQuizAndAnswer);

    var res = [],
      a, answers = rg.items.items;

    var checkedValue = -1;
    Ext.iterate(checkedRadio, function(key, value) {
      checkedValue = value;
    });

    for (var i = 0; i < answers.length; i++) {
      a = (checkedValue == answers[i].inputValue) ? 1 : 0;
      res.push([answers[i].inputValue, a]);
    }
    var quizPanel = this.getQuizView().down('tabpanel');
    var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0],
	gridSelect = grid.getSelectionModel().getSelection( )[0];
    if( (gridSelect.get('quizStatus') == CHAPTERlIST.REGULAR_QUIZ_COMPLETED ) || (gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_PASSED) ||
			(gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_FAILED)  ){
		if(quizPanel.items.last().postevaluation == 4){
			var questionRes = [];
			if(!Ext.isEmpty(SWP.modifiedQuestion[SWP.QuizID])){	 
				questionRes = SWP.modifiedQuestion[SWP.QuizID];
			}
	    	questionRes[rg.questionId] = res;
	    	SWP.modifiedQuestion[SWP.QuizID]= questionRes;
		}
		
		//This method call will decide this question is modified or not according to that 
		VideoRecordMgr.getQuizAnswerModifiedStatus(rg.questionId, res, function(r, t) {
    	      if (t.status) {
	    	       var result = r;
	    	       var questionRespose = [];
	    	       if(!Ext.isEmpty(SWP.quizQuestionmodifyStatus[SWP.QuizID])){	 
	    	    	   questionRespose = SWP.quizQuestionmodifyStatus[SWP.QuizID];
   				   }
	    	       if(result.isModified){
	    	    	   questionRespose[rg.questionId] = 1;
	    	    	   SWP.quizQuestionmodifyStatus[SWP.QuizID] = questionRespose;
	    	       } else {
	    	    	   questionRespose[rg.questionId] = 0;
	    	    	   SWP.quizQuestionmodifyStatus[SWP.QuizID] = questionRespose;
	    	       }
	    	       var keys = [];
				   for (var key in SWP.quizQuestionmodifyStatus[SWP.QuizID]) {
					    keys.push(key);
				   }
				   for(var i=0; i < keys.length ; i++){
						var count = keys.length;
						var questionArray = SWP.quizQuestionmodifyStatus[SWP.QuizID]
						var res = questionArray[keys[i]];
						if(!Ext.isEmpty(res)){
							if(res == 1){
								SWP.quizModifiedQuiz[SWP.QuizID] = 1;
								break;
							}else{
								SWP.quizModifiedQuiz[SWP.QuizID] = 0;
							}
						}
				   }
    	      }
    	 }, this);
    } else {
    	//201312270330
        if(unmarkQuizAndAnswer){
        	VideoRecordMgr.deleteQuizAnswer(rg.questionId, res, function(r, t) {
      	      if (t.status) {
      	       // this.refreshQuizStatusIcon(t.result);
      	      }
      	    }, this);
        } else {
    	    VideoRecordMgr.saveQuizAnswer(rg.questionId, res, function(r, t) {
    	      if (t.status) {
    	       // this.refreshQuizStatusIcon(t.result);
    	      }
    	    }, this);
        }
    }
    if(quizPanel.items.last().postevaluation == 4){
	    if(unmarkQuizAndAnswer){
	    	VideoRecordMgr.deleteQuizAnswer(rg.questionId, res, function(r, t) {
	  	      if (t.status) {
	  	       // this.refreshQuizStatusIcon(t.result);
	  	      }
	  	    }, this);
	    }
    }
  },

  quizAnswerText: function(rg) {
    this.markQuizQuestionAnswered(rg.questionId);
    var res = [
      [rg.answerId, rg.getValue()]
    ];
    var quizPanel = this.getQuizView().down('tabpanel');
    var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0],
	gridSelect = grid.getSelectionModel().getSelection( )[0];
    if( (gridSelect.get('quizStatus') == CHAPTERlIST.REGULAR_QUIZ_COMPLETED ) || (gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_PASSED) ||
			(gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_FAILED)  ){
		if(quizPanel.items.last().postevaluation == 4){
			var questionRes = [];
			if(!Ext.isEmpty(SWP.modifiedQuestion[SWP.QuizID])){	 
				questionRes = SWP.modifiedQuestion[SWP.QuizID];
			}
	    	questionRes[rg.questionId] = res;
	    	SWP.modifiedQuestion[SWP.QuizID]= questionRes;
		}
		//This method call will decide this question is modified or not according to that 
		VideoRecordMgr.getQuizAnswerModifiedStatus(rg.questionId, res, function(r, t) {
    	      if (t.status) {
	    	       var result = r;
	    	       var questionRespose = [];
	    	       if(!Ext.isEmpty(SWP.quizQuestionmodifyStatus[SWP.QuizID])){	 
	    	    	   questionRespose = SWP.quizQuestionmodifyStatus[SWP.QuizID];
   				   }
	    	       if(result.isModified){
	    	    	   questionRespose[rg.questionId] = 1;
	    	    	   SWP.quizQuestionmodifyStatus[SWP.QuizID] = questionRespose;
	    	       } else {
	    	    	   questionRespose[rg.questionId] = 0;
	    	    	   SWP.quizQuestionmodifyStatus[SWP.QuizID] = questionRespose;
	    	       }
	    	       var keys = [];
				   for (var key in SWP.quizQuestionmodifyStatus[SWP.QuizID]) {
					    keys.push(key);
				   }
				   for(var i=0; i < keys.length ; i++){
						var count = keys.length;
						var questionArray = SWP.quizQuestionmodifyStatus[SWP.QuizID]
						var res = questionArray[keys[i]];
						if(!Ext.isEmpty(res)){
							if(res == 1){
								SWP.quizModifiedQuiz[SWP.QuizID] = 1;
								break;
							}else{
								SWP.quizModifiedQuiz[SWP.QuizID] = 0;
							}
						}
				   }
    	      }
    	 }, this);
    } else {
	    VideoRecordMgr.saveQuizAnswer(rg.questionId, res, function(r, t) {
	      if (t.status) {
	        this.refreshQuizStatusIcon(t.result);
	      }
	    }, this);
    }
  },

  questionSwitch: function(tabs, nt, ot, i, ani, opt) {
	  //201403050819
	if(this.getPlayer().playingVideo())  {		
			this.getPlayer().stopPlayer();
	}
	var chapcomp = Ext.ComponentQuery.query('commentsgridtoolbar #chaptertbtext')[0];
	chapcomp.setText(tabs.quiz_lesson);
	
	
    var cp = this.getContentPanel(),

      qv = this.getQuizView(),

      tabPanel = qv.down('tabpanel');

    tab = tabPanel.getActiveTab(),

    img = cp.down('panel[id=quizImg]');
    if (tab)
      SWP.QuestionTitle = tab.title;

    var player = this.getPlayer();

    if (qv) {



      // If the selected tab is a summary tab then update the text with Sum and if 

      // it is a question tab then update the text with curratequestionindex/ total number

      // of questions.



      var label = qv.down('label');

      label.setVisible(true);



      if (SWP.QuestionTitle == "Summary") {

        label.setText('<span class = "sum">' + QUIZ.SUMMARY_TEXT + '</span>', false);



      } else {



        var totalTabs = tabPanel.items.length - 1;

        var currTab = tabPanel.items.indexOf(tab) + 1;

        totalTabs = totalTabs > 9 ? totalTabs : '0' + totalTabs;

        currTab = currTab > 9 ? currTab : '0' + currTab;

        currTabStyle = "<span class = 'notseen-font'>" + currTab + "</span>";

        totalTabsStyle = "<span class = 'seen-font'>/" + totalTabs + "</span>";

        label.setText(currTabStyle + totalTabsStyle, false);

      }

    }

    if (!Ext.isEmpty(player)) {


      // TODO : Check this

    }

    var selChapter = this.getChapters().getSelectedChapter();

    selChapter = selChapter.get('uid');

    if (SWP.quizQuestionLoaded[selChapter] == false) {

      var imageCmps = SWP.QuizImageMap[selChapter];

      for (var l = 0; l < imageCmps.length; l++) {

        imageCmps[l].getLoader().load();

      }

      SWP.quizQuestionLoaded[selChapter] = true;

    }

    //Story --28313083

    if (nt.imageUrl) {



      qv.down('button[action=figure]').enable();

      this.showQuestionImage(nt.uid);

    } else {



      qv.down('button[action=figure]').disable();

      cp.getLayout().setActiveItem(0);

    }



    var videoId = nt.videoId;

    videoId = videoId.substr(1);



    //

    // get the video url and the captions associated with the video . and assign both 

    // of them to the tab as videoURL and captions which can be used later.

    //

    if (!Ext.isEmpty(videoId) && videoId > 0) {



      VideoRecordMgr.getVideoURL(Number(videoId), function(r, t) {

        if (t.status) {

          nt.captions = r['captions'];

          nt.videoURL = r['url'];

        }

      });

    }



    if (tab.videoStart >= 0 && Ext.String.trim(tab.videoStart).length >= 1 && videoId != 0) {

      qv.down('button[action=video]').enable();

    } else {

      qv.down('button[action=video]').disable();

    }

  },

  /** 201311161912
   
   * This function will calculate the required width and height of the image
   
   * by maintaining the aspect ratio of the original image.
   
   * @param image component.
   
   */

  maintainAspectRatio: function(c) {

    if (Ext.isIE8) {

      var pan = Ext.getElementById('quizImg');
      var maxWidth = pan.clientWidth;
      var maxHeight = pan.clientHeight;
      var natural = this.getNatural(c.getEl().dom),
        srcWidth = natural.width,
        srcHeight = natural.height;

    } else {

      var maxWidth = c.up('panel').getWidth();
      var maxHeight = c.up('panel').getHeight();
      var srcWidth = c.getEl().dom.naturalWidth;
      var srcHeight = c.getEl().dom.naturalHeight;
    }

    if (srcWidth > 0 && srcHeight > 0) {

      var ratio = [maxWidth / srcWidth, maxHeight / srcHeight];
      ratio = Math.min(ratio[0], ratio[1]);
      var width = (srcWidth * ratio) + 'px !important';
      var height = (srcHeight * ratio) + 'px !important';
      //201311221502
      var margin_top = (maxHeight - srcHeight * ratio) / 2 + 'px !important';
      var margin_left = (maxWidth - srcWidth * ratio) / 2 + 'px !important';
      c.getEl().dom.setAttribute('style', 'width  : ' + width + '; height :' + height + ';margin-top :' + margin_top + ';margin-left :' + margin_left + ';');

    }
  },
  getNatural: function(DOMelement) {
    var img = new Image();
    img.src = DOMelement.src;
    return {
      width: img.width,
      height: img.height
    };
  },

  /**
   
   * This function shows the image related to the question .
   
   *
   
   * This function is called from questionSwitch and showFigures function when imageUrl of the question tab is not empty
   
   * @param id of the quiz question.
   
   */


  showQuestionImage: function(questionuid) {
	//201403050819
	if(this.getPlayer().playingVideo())  {		
			this.getPlayer().stopPlayer();
	}
	var quizObj = this.getChapters().down('grid').getStore().findRecord( 'uid', 'Q'+SWP.QuizID);
	var chapcomp = Ext.ComponentQuery.query('commentsgridtoolbar #chaptertbtext')[0];
	chapcomp.setText(quizObj.data.lesson);
	this.getChapters().isItFromQuiz = true;
	this.getChapters().refreshIcons(SWP.selectedItem);
	this.getChapters().isItFromQuiz = false;
	
	
    var selChapter = this.getChapters().getSelectedChapter();

  //201402260809
    var id = SWP.QuizID;

    var questionImgMap = SWP.QuizImageMap[id];
    if(questionImgMap){
    	var imgCmp = questionImgMap[questionuid];
    }

    var cp = this.getContentPanel();

    var img = cp.down('panel[id=quizImg]');



    if (!Ext.isEmpty(imgCmp)) {



      var exists = false;

      var images = Ext.ComponentQuery.query('panel image');



      for (var i = 0; i < images.length; i++) {



        images[i].hide();

        if (images[i].id == imgCmp.id) {


        //20131130900
        if( Ext.isEmpty(questionImgMap) ){ //This condition true when the selected chapter id is lesson ID(Which is question help video )
        	questionImgMap = SWP.QuizImageMap[SWP.QuizID];
        }
          exists = true;

        }

      }



      if (!exists)

        img.add(imgCmp);



      cp.getLayout().setActiveItem(img);

      var c = imgCmp;
      if (Ext.isIE8) {
        imgCmp.show();
        this.maintainAspectRatio(c);

      } else {

        var srcWidth = c.getEl().dom.naturalWidth;
        if (srcWidth) {

          imgCmp.show();
          this.maintainAspectRatio(c);
        }
      }
      // 201311161912

      var me = this;

      // Got the image tag element in order to call onload event.

      var x = document.getElementById(c.id);

      x.onload = function() {
        me.maintainAspectRatio(c);
        imgCmp.show();

      };

    }

  },

  showFigures: function() {

    var cp = this.getContentPanel(),

      nt = this.getQuizView().down('tabpanel').getActiveTab();



    this.getPlayer().hide();



    if (nt.imageUrl) {

      this.showQuestionImage(nt.uid);

      //Story --28313083

      qv = this.getQuizView();

      qv.down('button[action=figure]').disable();

      // Enabling the Question Help image based on the condition.
      var videoId = (nt.videoId).substr(1);
      if (nt.videoStart >= 0 && Ext.String.trim(nt.videoStart).length >= 1 && videoId != 0) {

        qv.down('button[action=video]').enable();

      }



    }



  },

  loadQuiz: function(id, lesson, tabInd) {
	//201403050819
	if(this.getPlayer().playingVideo())  {		
			this.getPlayer().stopPlayer();
	}
	
    SWP.isReplayAndNextStepButtonsVisible = true;

    var me = this;

    if (Ext.isEmpty(tabInd)) {
      tabInd = -1; // When tabInd is empty, assigning -1 to indicate that summary should be activated
    }

    me.getQuizView().expand(false);
    VideoRecordMgr.getQuiz(id, function(result, t) {
      if (t.status) {
        var badgeIndexes = [];
        var tabs = me.getQuizView().down('tabpanel');
        //201406210404
        if(lesson) {
        	var quiz = Ext.ComponentQuery.query( 'quiz[name=quizpanel]' )[0];
        	quiz.setTitle( "Evaluation : "+lesson);
        	quiz.originalTitle = lesson;
        }
        SWP.QuizID = id;
        SWP.quizAnsweredCount[SWP.QuizID] = '';
        SWP.quizAnsweredQuestions = [];
        SWP.quizModifiedQuiz = [];
        SWP.modifiedQuestion = [];
        SWP.quizQuestionmodifyStatus = [];
        var quizQuestionMap = {};
        var quizTraingFile = {};
        var r = result['items'];
        
        if (tabInd == "Summary") {
          tabInd = r.length - 1;
          //201311141653
          // Here we are maintaing a variable if the quiz
          // is loaded because of reference click from Messagewindow.
          SWP.fromSummaryReference = true;
        }
        
        /*
         * Here setting the Quiz images for a particular question 
         */
        if (Ext.isEmpty(SWP.QuizImageMap[id])) {

          for (var i = 0; i < r.length; i++) {
            /*
             * refs #7347
             * Checking with the uid of the question instead of index of question.
             */
            if (r[i].uid == tabInd) {
              tabInd = i;
            }
            if (r[i].imageUrl) {
              quizQuestionMap[r[i].uid] = Ext.create('Ext.Img', {
	                src: r[i].imageUrl,
	                hidden: true,
	                loader: {
	                  url: r[i].imageUrl,
	                  autoLoad: false
	                },
	                listeners: {
	                  'activate': {
	                    fn: function(c) {
	                      if (c.ownerCt.getHeight() < c.ownerCt.getWidth()) {
	                        c.setSize('auto', '80%');
	                      } else {
	                        c.setSize('80%', 'auto');
	                      }
	                      c.getEl().alignTo(c.ownerCt.getEl(), 'c-c');
	                    }
	                  },
	                  'resize': {
	                    fn: function(c) {
	                      // 201311141525
	                      // Here we are finding the actual image width and height with the available width and height.
	                      // Based on the ASpect ratio calculating the new width and height.
	                      var maxWidth = maxHeight = srcWidth = srcHeight = 0;
	                      if (Ext.isIE8) {
	
	                        var pan = Ext.getElementById('quizImg');
	                        maxWidth = pan.clientWidth;
	                        maxHeight = pan.clientHeight;
	                        var natural = me.getNatural(c.getEl().dom);
	                        srcWidth = natural.width;
	                        srcHeight = natural.height;
	
	                      } else {
	                        maxWidth = this.up('panel').getWidth();
	                        maxHeight = this.up('panel').getHeight();
	                        srcWidth = c.getEl().dom.naturalWidth;
	                        srcHeight = c.getEl().dom.naturalHeight;
	                      }
	
	                      if (srcWidth > 0 && srcHeight > 0) {
	
	                        var ratio = [maxWidth / srcWidth, maxHeight / srcHeight];
	                        ratio = Math.min(ratio[0], ratio[1]);
	                        var width = (srcWidth * ratio) + 'px !important';
	                        var height = (srcHeight * ratio) + 'px !important';
	
	                        //201311221502
	                        var margin_top = (maxHeight - srcHeight * ratio) / 2 + 'px !important';
	                        var margin_left = (maxWidth - srcWidth * ratio) / 2 + 'px !important';
	                        c.getEl().dom.setAttribute('style', 'width  : ' + width + '; height :' + height + ';margin-top :' + margin_top + ';margin-left :' + margin_left + ';');
	                      }
	                    }
	                  }
	                }
	          })
            }
          }
          SWP.QuizImageMap[id] = quizQuestionMap;
          SWP.quizQuestionLoaded[id] = false;
        } else {
          for (var i = 0; i < r.length; i++) {
            /*
             * refs #7347
             * Checking with the uid of the question instead of index of question.
             */

            if (r[i].uid == tabInd) {
              tabInd = i;
            }
          }
        }
        for (var i = 0; i < r.length; i++) {
          if (!Ext.isEmpty(r[i].badgeTextcount)) {
            badgeIndexes.push(i);
          }
        }
        if (!Ext.isEmpty(lesson)) {
          Ext.apply(tabs, {
            quiz_lesson: lesson
          });
        }
        tabs.removeAll(true);
        if (tabs.items.length > 0) {
          tabs.add(r);
        } else {
          // Calling the method to make the selected item in focus.
          this.FocusSelectedItem();
          tabs.add(r);
        }
        for (var l = 0; l < r.length; l++) {
          tabs.getTabBar().items.items[l].setBadgeText(r[l].badgeTextcount);
        }
        Ext.Msg.hide();
        
        if (Ext.isIE8 && result.enabledsummary) {

          var tabPanel = me.getQuizView().down('tabpanel');
          for (var i = 0; i <= r.length - 1; i++) {
            tabPanel.setActiveTab(i);
          }
        } else {
          var tabIndex;
          if ( (result.enabledsummary && tabInd < 0) || 
        		  ( result.enabledsummary && (r[tabInd].title == "Summary") ) ) { 
        	  /*
        	   *  verify enableSummary true or tabInd is -1 in
        	   *  both the cases summary tab should be enabled.
        	   *  201407070707
        	   */
              tabIndex = r.length - 1;
              var quizTab = me.getQuizView().down('tabpanel');
              quizTab.setActiveTab(tabIndex);
              quizTab.getActiveTab().getLayout().setActiveItem(1);
            } else {
              tabIndex = (!Ext.isEmpty(tabInd) && tabInd > 0) ? tabInd : 0;
              me.getQuizView().down('tabpanel').setActiveTab(tabIndex);
            }
        }
        me.questionSwitch(tabs, tabs.getActiveTab());
        Ext.getCmp('next-question').setDisabled(false);
        Ext.getCmp('prev-question').setDisabled(false);
      }
    }, this);
  },

  /**
   
   * The find playing returns the chapter / quiz record from the chapter list.
   
   *
   
   * For Quiz, we just need to return the selected quiz record. Even if we are playing video of the
   
   * quiz, this method will return the selected quiz record.
   
   *
   
   * For the lesson related video, we can identify current chapter using the cuepoint information.
   
   * @param d the initial position
   
   * @param t timestamp of the currently played video. This information will be compared against the cuepoints to
   
   *      identify correct chapters.
   
   * @return the selected or currently played chapter record from the chapter grid
   
   *
   
   */

  findPlaying: function(d, t, selected, donotSelectCurrentRecord) {


    var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
    if (!selected && !donotSelectCurrentRecord) {
      selected = grid.getSelectionModel().getSelection()[0];
    } else if (selected) {
      grid.getSelectionModel().select(selected, false, true);
    }


    var swpplayer = Ext.ComponentQuery.query('swpplayer')[0];
    if (selected && selected.get('uid').substr(0, 1) === 'Q') {

      return selected;



    } else if (this.getPlayer().playingVideo() || swpplayer.clickeventFired == false) {

      var ts = t || this.getPlayer().getTime() + 1;



      var chs = Ext.StoreManager.lookup('chapters');



      var i = chs.findBy(function(rec, id) {

          return (rec.get('video_id') == SWP.video &&

            ts >= rec.get('start') &&

            ts <= rec.get('stop'));

        },

        this);

      if (d) {

        i = i + d;

      }



      if (i < 0) {

        i = 0;

      }

      var ch = chs.getAt(i);

      this.getPlayer().resetSkippable(ch);

      return ch;

    } else {

      var ch = this.getChapters().getSelectedChapter();
      //201407041118
      if(ch){
    	  this.getPlayer().resetSkippable(ch);
    	  
    	  /**
    	   * Here handle the scenario like chapter duration <10 sec, then that chapter marked as read in the next play sec only. 
    	   */
    	  var lesson = ch.get('video_id');
    	  var videoId = lesson.substr(1, lesson.length);
    	  var chapterDuration =  ch.get('stop')-ch.get('start');
    	  if( chapterDuration <= 10 && !ch.get('seen') ){
    		  
    		  if( SWP.instructLogin && !Ext.isEmpty( videoId ) ){
    			  this.getChapters().refreshIcons(ch);
    			  return ch;
    		  }
    		  VideoRecordMgr.trackSeen( ch.get('uid'), true,false,false, function(r,t){
    			  ch.set('seen', true);
    			  this.getChapters().refreshIcons( ch );
    		  },this );
    		  
    	  }
    	  return ch;
      }

    }



  },

  /**
   
   * @private
   
   * This method will be used by forward and rewind buttons to seek new position.
   
   * Since user can click multiple times in quick interval, the method ensures that
   
   * the actual seek call is being invoked only when the previous seek call has already
   
   * returned the data. If user clicks multiple times with in time of 1sec, th time outs for previous clicks will
   
   * get cancelled and current click will be set for new time out. And hence, only last click information
   
   * can be sent to the function.
   
   *
   
   */

  perform10sSeek: function() {



    (SWP.playerSeekDelayedTask).delay(1000, function() {



      this.getPlayer().seekTo(this.getPlayer().getTime());

    }, this);

    this.getChapters().refreshIcons(this.findPlaying(0, this.getPlayer().getTime()));

  },

  /**
   
   * This method will move the video ahead by 10 second.
   
   *
   
   */

  playFwd: function() {



    // this.getPlayer().pause();

    this.getPlayer().items.items[0].fwd10s++;

    this.perform10sSeek();

  },

  /**
   
   * This method will move the video back by 10 second. Due to streaming, it may not be exact 10s.
   
   * But depending on the speed, it will be close to 10s.
   
   *
   
   */

  playRev: function() {

    this.getPlayer().items.items[0].fwd10s--;

    this.perform10sSeek();

  },

  /**
   
   * This method willplay the video associated with any quiz's Question.
   
   *
   
   */

  playQuestionVideo: function() {



    var now = 0;

    var vch = false;

    var tab = this.getQuizView().down('tabpanel').getActiveTab();

    var videoId = (tab.videoId).substr(1);

    if (tab.videoStart >= 0 && videoId != 0) {

      var flowPlayer = this.getPlayer();

      this.getContentPanel().getLayout().setActiveItem(flowPlayer);



      flowPlayer.removePlayer();

      var fp = flowPlayer.createFplayer();

      flowPlayer.add(fp);

      flowPlayer.doLayout();

      // Story --28313083

      qv = this.getQuizView();

      qv.down('button[action=video]').disable();

      if (tab.imageUrl) {

        qv.down('button[action=figure]').enable();

      }

      var state = this.getPlayer().getVideoState();

      var fplayer = this.getPlayer().getFlowPlayer();



      //

      //  If browser is IE, remove function is not calling for flowplayer. So when user clciks on 

      //  Question video, the player that is being played for lesson is getting used. And hence,

      //  making the player time to zero, in order to reduce conflict between earlier played lesson.

      //


      fplayer.seek(0);

      try {

        if (state < 3 || state > 4 || (fplayer.getClip().url != tab.videoURL)) {



          //

          // set justplay vlaue of the swpplayer object to true.

          // so that in the flowplayer seek handler will call load captions to load the srt files.

          //



          flowPlayer.justplay = true;
          var start = tab.videoStart;
          fplayer.play({
            url: tab.videoURL
          }).onBegin(function() {
            if (start !== null) {

              this.seek(start);
              start = null;
            }
          });
        } else {

          if (state > 2) {

            fplayer.startBuffering();

            fplayer.seek(tab.videoStart);

          }

        }

        if (state == 4) {

          fplayer.startBuffering();

        }



        fplayer.resume();

      } catch (e) {

        console.log(e.message);

      }

    }

  },



  /**
   
   * @private
   
   * This method will be used by previous/Next Chapter buttons to seek new position.
   
   * Since user can click multiple times in quick interval, the method ensures that
   
   * the actual seek call is being invoked only when the previous seek call has already
   
   * returned the data. If user clicks multiple times with in time of 1sec, th time outs for previous clicks will
   
   * get cancelled and current click will be set for new time out. And hence, only last click information
   
   * can be sent to the function.
   
   *
   
   */

  performPrevNextChapter: function(chapters, currentChapter) {



    (SWP.playChapterDelayedTask).delay(1000, function() {

      var rec;
      if (currentChapter) {

        rec = currentChapter;
      } else {
        rec = this.findPlaying();
      }

      var expectedChapter = rec.index + SWP.expectedChapter;

      if (expectedChapter < 0) {



        expectedChapter = 0;

      } else if (expectedChapter > chapters.last(false).index) {



        expectedChapter = chapters.last(false).index;

      }

      var next = chapters.getAt(expectedChapter);

      this.chapterSelected(null, null, null, next, null);

    }, this);



  },

  nextChapter: function() {

    var chapters = Ext.StoreManager.lookup('chapters');

    var rec = this.findPlaying();
    // this.getPlayer().getFlowPlayer().getPlugin('dock2').hide();
    if (rec.index === chapters.last(false).index) {

      return;

    }


    SWP.expectedChapter++;

    this.performPrevNextChapter(chapters,rec);

  },

  /**
   
   * This method assumes that the video is currently being played.
   
   * Depending on the current chapter being played, the previous chapter is
   
   * identified from the existing set of record and icon is refreshed to show
   
   * the chapter being played at this moment
   
   *
   
   */

  prevChapter: function() {

    var rec = this.findPlaying();

    var chapters = Ext.StoreManager.lookup('chapters');

    if (rec.index === 0) {

      return;

    }


    SWP.expectedChapter--;

    this.performPrevNextChapter(chapters, rec);

  },



  /**
   
   * This method moves flowplayer to play the first chapter of the next lesson.
   
   *
   
   */

  nextLesson: function() {

    var rec = this.findPlaying();

    var nextRec = rec;

    var chapters = Ext.StoreManager.lookup('chapters');

    var lastRec = chapters.last(false);



    if (rec.data.lesson === lastRec.data.lesson) {

      //

      // The user is already on the last lesson of the store. Nothing needs to be done.

      //

      return;

    }



    //

    // Indentify the chapter where lesson has changed and play that chapter 

    //

    for (var tempInd = rec.index + 1; tempInd <= lastRec.index; tempInd++) {



      if (chapters.getAt(tempInd).data.video_id  !== rec.data.video_id ) { //201407031055

        nextRec = chapters.getAt(tempInd);

        break;

      }

    }



    this.chapterSelected(null, null, null, nextRec, null);

  },

  /**
   
   * This method moves flowplayer to play the first chapter of the current lesson (in case the user is in the
   
   * middle of the lesson) or the first chapter of the previous lesson.
   
   *
   
   */

  prevLesson: function() {

    var rec = this.findPlaying();

    var prevRec = rec;

    var chapters = Ext.StoreManager.lookup('chapters');

    var firstRec = chapters.first(false);

    var prevRecordIdentified = false;



    if (rec.index === firstRec.index) {

      //

      // The user is already on the first record of the store. Nothing needs to happen!

      //

      return;

    } else if (rec.data.lesson === firstRec.data.lesson) {

      //

      // We are at some chapter of the first lesson. Hence we just need to play the first

      // chapter of this lesson

      //

      prevRec = firstRec;

      prevRecordIdentified = true;

    }



    if (prevRecordIdentified === false) {



      var wasInMiddleOfALesson = false;



      for (var tempInd = rec.index - 1;
        (tempInd >= 0) && (prevRecordIdentified === false); tempInd--) {



        if (chapters.getAt(tempInd).data.lesson !== rec.data.lesson) {

          if (wasInMiddleOfALesson === true) {

            //

            // The user was in the middle of a lesson and now we have just reached the

            // last chapter of the previous lesson. Hence, the last chapter would be 

            // the first chapter of the current lesson and this will be played.

            //

            prevRec = chapters.getAt(tempInd + 1);

            prevRecordIdentified = true;

            break;

          } else {

            //

            // User was on the first chapter of the current lesson. Now we have reached the last 

            // chapter of the previous lesson. Identify the first chapter of this lession.

            // In case this is the first chapter of the first lesson then anyways this is the 

            // chapter that shall be played.

            // 

            prevRec = chapters.getAt(tempInd);



            for (var prevLessonInd = prevRec.index; prevLessonInd >= 0; prevLessonInd--) {

              if (chapters.getAt(prevLessonInd).data.lesson !== prevRec.data.lesson) {

                // 

                // We are changing lesson again and hence the previous chapter was the

                // first chapter of the desired lesson.

                //

                prevRec = chapters.getAt(prevLessonInd + 1);

                break;

              }



              if (prevLessonInd === 0) {

                //

                // We were iterating chapters of first lesson and hence there will not be any 

                // change in lesson. The first record shall be played.

                //

                prevRec = chapters.getAt(0);

              }

            }



            prevRecordIdentified = true;

            break;

          }



        } else {

          //

          // User is in the middle of the same lesson. 

          //

          prevRec = chapters.getAt(tempInd);

          wasInMiddleOfALesson = true;

          continue;

        }

      }

    }



    if (prevRecordIdentified === true) {

      this.chapterSelected(null, null, null, prevRec, null);

    }

  },

  chapterSelectionChanged: function(chPnl, chGrid, s, selection) {

    var selected = selection[0],
      v = chGrid.getView();

    if (!selected) return;



  },

  chapterClicked: function(chPnl, chGrid, v, selected, item, idx, e, eOpts, questionInd, seekValue, language) {

	//201403050819
	SWP.selectedItem = selected;  
	
    if (selected.get('hiddenChapters').length > 0 && !selected.get('cuepointnotregistered')) {
      selected.set('cuepointnotregistered', true);
    }
    if (!language) {

      language = SWPtmp.caption; //Ext.getCmp('lang-combo').selectedRecord.get('lang');

    }

    this.chapterSelected(chPnl, chGrid, v, selected, seekValue, questionInd, language);

  },

  chapterSelected: function(chPnl, chGrid, v, selected, ts, questionInd, language) {

    var vch = false;

    var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
    //201405210809
    var swpPlayer = this.getPlayer();
    var flowPlayer = this.getPlayer().getFlowPlayer();



    if (Ext.isEmpty(selected)) {

      return;

    }


    SWP.LESSON = selected.get('ordering');

    var select = selected.get('uid').substr(0, 1);

    if (select == 'Q') {
    	//201405280930
    	//While showing the images for the quiz question when user shifting the tabs 
    	//we are setting the status text by getting the selected item.
    	SWP.selectedItem = selected;  
      // Calling the Refresh Icons method.
      //201311221905
      this.getChapters().isItFromQuiz = true;
      this.getChapters().refreshIcons(selected);
      this.getChapters().isItFromQuiz = false;

      SWP.quized = true;
      this.getContentPanel().getLayout().setActiveItem(0);
	  //201403050819 , 201405210809
      if(swpPlayer.playingVideo())  {		
    	  swpPlayer.stopPlayer();
	  }
      var unSeenedChapters = [];

      for (var i = 0; i < selected.get('lessonToPass').length; i++) {

        var records = grid.getStore().queryBy(function(r, id) {

          return (r.get('video_id').substr(1) == selected.get('lessonToPass')[i]) && (r.get('seen') == false);
        }, this);

        if (!Ext.isEmpty(records.items)) unSeenedChapters.push(records.items);
      }

      if (SWP.instructLogin || (Ext.isEmpty(unSeenedChapters) && Ext.isEmpty(selected.get('quizRequiredToPass')))) {

        this.loadQuiz(selected.get('uid').substr(1), selected.get('lesson'), questionInd);

        var msgWait = Ext.Msg.wait('Please wait ...', 'Loading quiz ...');
        msgWait.addCls('resumeAlertStyles');
        msgWait.addBodyCls('resumeAlertStyles');

      } else if (Ext.isEmpty(selected.get('quizRequiredToPass'))) {
        //201310270653   201311131925 201311181545
        var chapcomp = Ext.ComponentQuery.query('commentsgridtoolbar #chaptertbtext')[0];
        chapcomp.setText('');
        Ext.Msg.show({
          title: CHAPTERlIST.ALERT_TITLE,
          msg: CHAPTERlIST.ALERT_MESSAGE2,
          buttons: Ext.MessageBox.OK,
          icon: Ext.MessageBox.WARNING
        });
        return;
      } else {
        var chapcomp = Ext.ComponentQuery.query('commentsgridtoolbar #chaptertbtext')[0];
        chapcomp.setText('');
        Ext.Msg.show({
          title: CHAPTERlIST.ALERT_TITLE,
          msg: CHAPTERlIST.ALERT_MESSAGE,
          buttons: Ext.MessageBox.OK,
          icon: Ext.MessageBox.WARNING
        });
        return;
      }
    } else if (SWP.instructLogin || (selected.get('quizRequiredToPass').length == 0)) {
      grid.getSelectionModel().deselectAll();
      grid.getSelectionModel().lastSelected = undefined;
      this.getQuizView().collapse();

      this.getContentPanel().getLayout().setActiveItem(this.getPlayer());

		//201405210809
      if (flowPlayer.isLoaded()) {
        flowPlayer.getControls().setEnabled({
          all: true
        });
        flowPlayer.getPlugin('content').hide();

      }


      // Regarding IE11 memory issue this code is commented 
      //201405210809
      //Code uncommented , for the quiz selection we need to remove the player 
      //and need to create it.
      if (SWP.quized) {
        var justFinished = swpPlayer.justFinished;
        if (flowPlayer.isLoaded()) {
          flowPlayer.unload();
        }
        swpPlayer.removePlayer();

        fp = swpPlayer.createFplayer();

        swpPlayer.add(fp);

        fp.justFinished = justFinished;

        swpPlayer.doLayout();
      }



      // }

      
      swpPlayer.stopImmedietly = false;

      // Calling the Refresh Icons method.
      swpPlayer.seekedTo = true;
      this.getChapters().refreshIcons(selected);
      swpPlayer.seekedTo = false;
      swpPlayer.currentPosition = selected.get('start');

      swpPlayer.chapterSelected = selected.get('start');
      swpPlayer.playChapter(selected, ts);
      SWP.quized = false;
      swpPlayer.hideReplayNextPlayButton();

    } else {

      grid.getSelectionModel().deselectAll();
      grid.getSelectionModel().lastSelected = undefined;
      //201407031055
      var store = grid.getStore(),
      precedingUids = selected.get('quizRequiredToPass'),
      precedingLessons = [];
      
      for (var i= 0; i < precedingUids.length; i++ ){
    	  var record = store.getAt(store.findExact('video_id','L'+precedingUids[i]));
    	  if( record ){
    		  precedingLessons.push(record.get('lesson'));
    	  }
      }

      if (flowPlayer.isLoaded()) {
    	  
        //201310271256
        //As per the issue it should be an alert.
    	//201407031055
         Ext.Msg.alert(CHAPTERlIST.ALERT_TITLE, CHAPTERlIST.LESSONLOCK_MSG1+precedingLessons.toString()+CHAPTERlIST.LESSONLOCK_MSG2, function(btn) {}, this);
        //201310270605
        return;

      } else {

    	Ext.Msg.alert(CHAPTERlIST.ALERT_TITLE, CHAPTERlIST.LESSONLOCK_MSG1+precedingLessons.toString()+CHAPTERlIST.LESSONLOCK_MSG2, function(btn) {}, this);
        return;
      }
    }

    grid.getSelectionModel().select([selected], false, true);

	var requiredEl,isAllowScroll;
    if (select != 'Q') { //2013123750
    	
	      requiredEl = Ext.fly(grid.getView().getNode(selected));
	      isAllowScroll = this.isScrollAllow(grid, requiredEl);
	      if (isAllowScroll) {
	        grid.getView().el.scrollTo('top', 0, true);
	        requiredEl.scrollIntoView(grid.getView().el, false);
	      }
	      
    } else {
      //201311250223
      var chs = grid.getStore();

      var i = chs.findBy(function(rec, id) {

        return (rec.get('uid') == selected.get('uid'));

      }, this);

      var groupHeaderEls = Ext.select('.x-grid-group-hd').elements;
      var headeerText = '';
      var MatchText = '  ';
      for (var j = 0; j < groupHeaderEls.length; j++) {

        headeerText = groupHeaderEls[j].textContent;
        if (!headeerText) {
          headeerText = groupHeaderEls[j].innerText;
          MatchText = headeerText.substr(0, headeerText.length - 2);
        } else {
          MatchText = headeerText.substr(0, headeerText.length - 3);
        }

        if (MatchText == chs.getAt(i).get('lesson')) {
          var requiredHeaderEl = groupHeaderEls[j];
          var index = j;
          break;
        }
      }

      requiredEl = Ext.fly(requiredHeaderEl);

      isAllowScroll = this.isScrollAllow(grid, requiredEl);
      if (isAllowScroll) {
        grid.getView().el.scrollTo('top', 0, true);
        requiredEl.scrollIntoView(grid.getView().el, false);
      }
    }

    SWP.expectedChapter = 0;



    if (!this.training) {



      var trainingFilesButton = Ext.ComponentQuery.query('commentsgridtoolbar [name=training_files]')[0];

      trainingFilesButton.enable(false);

      this.training = true;

    }



  },

  afterEdit: function(ed, e) {

    var commentsGrid = this.getCommentsGrid();

    var store = commentsGrid.getStore();

    var newComment = store.getNewRecords();

    store.sync();

    var property = {};

    var sorters = [{
        property: 'ordering',
        direction: 'ASC'
      },

      {
        property: 'lesson',
        direction: 'ASC'
      },

      {
        property: 'ts',
        direction: 'ASC'
      }

    ];
    /**
     * Here when a new comment is getting created, before applying the default sorting criteria
     * if user has done some manua sorting we are maintaining that property
     * and applying that sorting criteria to the store.
     * */

    if (store.sorters.items.length == 1) {

      var property = {
        property: store.sorters.items[0].property,
        direction: store.sorters.items[0].direction
      };
      if (property) {

        var j = 0;
        for (var i = 0; i < sorters.length; i++) {
          if (sorters[i].property == store.sorters.items[0].property) {
            j = i;
            break;
          }
        }
        if (j) {

          sorters.splice(j, true);
        }
        Ext.Array.insert(sorters, 0, [property]);
      }
    }

    store.sort(sorters);


  },

  addCommentAndPause: function(commentPnl, btn) {



    //

    //If the player is playing then pause it and then add a comment otherwise simply add a comment

    //



    if (this.getPlayer().playingVideo()) {



      this.getPlayer().pause();

    }


    var grid = this.getCommentsGrid();
    if (grid.isHidden()) {
      //if the grid is hidden at this stage then we will expand and the expand event is maintained in the Grid.js
      grid.expand();
    } else {
      this.addComment(btn);
    }
  },



  /**
   
   *  On Clicking training files button, downloading all creator files.
   
   *  created this function identical to workfiles panel to call training files record function
   
   *  and to create the product id folder in training files folder, which is used while
   
   *  zipping the creator files using the training files path.
   
   *
   
   *  @param commentPnl - comments grid
   
   *  @param btn      - training files button.
   
   */



  downloadTrainingFiles: function(commentsPnl, btn, isFromMsgDetails, groupName, isFromChaptersList, questionTitle) {



    if (this.numberofTrainingFiles > 0) {



      var me = this;

      var body = Ext.getBody();

      me.form = body.createChild({

        tag: 'form'

        ,
        cls: 'x-hidden'

        ,
        id: 'form'

        ,
        method: 'get'

        ,
        action: 'download.php'

        ,
        target: 'iframe'

        ,
        cn: [{

            tag: 'input'

            ,
            type: 'hidden'

            ,
            name: 'pid'

            ,
            value: SWP.PID + "/" + SWP.CourseName

          }, {

            tag: 'input'

            ,
            type: 'hidden'

            ,
            id: 'lesson-name'

            ,
            name: 'lesson'

          },

          {

            tag: 'input'

            ,
            type: 'hidden'

            ,
            id: 'question-name'

            ,
            name: 'question'

          },

          {

            tag: 'input'

            ,
            type: 'hidden'

            ,
            id: 'to-amazon'

            ,
            name: 'isfromamazon'

            ,
            value: SWP.isFromAmazon

          }
        ]

      });

      var frame = body.createChild({



        tag: 'iframe'

        ,
        cls: 'x-hidden'

        ,
        id: 'iframe'

        ,
        name: 'iframe'



      });

      /**
       
       * refs #6603
       
       *
       
       * isFromMsgDetails : true
       
       * If user is clicking on Training files button of task details window then
       
       * else isFromMsgDetails: false
       
       *
       
       */



      if (isFromMsgDetails == true) { //From Message Details window's Training files downloading



        var taskRecord;

        var question;

        var leson;

        var chaptersStore = Ext.StoreManager.lookup('chapters');



        /**
         
         * Checking whether that reference is related to quiz or lesson
         
         */



        if (commentsPnl.thread.data.reference.question_id) {



          var record = commentsPnl.thread.get('subject').split(',');



          var quizQuestion = record[0];



          question = quizQuestion.replace(' ', '');



          question = question.split('-')[1].replace(' ', '');



          taskRecord = chaptersStore.findRecord('video_id', 'Q' + commentsPnl.thread.data.reference.video_id);



          lesson = taskRecord.get('ordering');



        } else {

          taskRecord = chaptersStore.findRecord('video_id', 'L' + commentsPnl.thread.data.reference.video_id);

          lesson = taskRecord.get('ordering');

          question = -1;



        }



        me.form.dom[1].defaultValue = lesson;

        me.form.dom[2].defaultValue = question;

        me.form.dom[1].value = lesson;

        me.form.dom[2].value = question;



        me.form.dom.submit();



      } else if (isFromChaptersList == true) { //From Chapters List Instruction icon's Training files button clicking.



        var chapters = btn.getStore().data;

        for (i = 0; i < chapters.items.length; i++) {

          if (chapters.items[i].get('ordering') == groupName &&

            chapters.items[i].get('uid').substr(0, 1) != 'Q') {

            var lessonName = groupName;

          }

        }

        me.form.dom[1].defaultValue = lessonName;

        me.form.dom[1].value = lessonName;

        me.form.dom.submit();



      } else if (questionTitle) { //From Quizes Window Question's tab Training files button clicking.



        me.form.dom[1].defaultValue = groupName;

        me.form.dom[1].value = groupName;

        me.form.dom[2].defaultValue = questionTitle;

        me.form.dom[2].value = questionTitle;

        me.form.dom.submit();



      } else {



        me.form.dom[1].defaultValue = '-1';

        me.form.dom[2].defaultValue = '-1';

        me.form.dom[1].value = "-1";

        me.form.dom[2].value = "-1";



        me.form.dom.submit();

      }

    } else {



      Ext.Msg.alert(TRAININGFILES.ALERT_TITLE, TRAININGFILES.ALERT_MESSAGE);

    }

  },



  /**
   
   *
   
   *  When comments list store got loaded, calling getTrainingFiles function in
   
   *  VideoRecordMgr file to get the count of records for the course.
   
   *
   
   */



  initializeTrainingFiles: function(listgrid) {
	
    SWP.lastruns = Ext.StoreManager.lookup('lastruns');

    if (!SWP.editorsLogin) {

      var tasksExists = false;

      var allTasksClosed = true;

      var defaultstatus = -1;

      var statusCode = 99;

      var finalStatusRecord = Ext.data.StoreManager.lookup('SWPCommon.store.TaskStatuss').findRecord('FinalStatus', true, null, null, null, true);

      var chaptersGrid = Ext.ComponentQuery.query('chapterslist ')[0];

      var chaptersStore = Ext.ComponentQuery.query('chapterslist gridpanel')[0].getStore();

      chaptersStore.each(function(record) {

        if (record.get('taskStatus') > -1 && !tasksExists) {

          tasksExists = true;



        }

        if (record.get('courseStatus') > -1) {

          if (defaultstatus == -1) {



            defaultstatus = statusCode;

          }

          if (record.get('courseStatus') < defaultstatus) {



            defaultstatus = record.get('courseStatus');

          }

        }

      }, this);



      var courseTaskSummaryWin = Ext.getCmp(chaptersGrid.getId() + '-courseTaskSummary');


      if (SWP.Rroleid != 2) {

        courseTaskSummaryWin.setVisible(true);

      }



      //var courseStatus = chaptersStore.first().get('courseStatus');

      if (tasksExists && defaultstatus > 0) {

        courseTaskSummaryWin.removeCls('fully-completed');

        //201311220510
        var setClass = 'course-status-0' + defaultstatus;

        courseTaskSummaryWin.setIconCls(setClass);

        this.updateCourseTaskIconTooltip(chaptersGrid, courseTaskSummaryWin, setClass);

      } else if (!tasksExists) {

        courseTaskSummaryWin.setDisabled(true);

      }
      
      //201405220645
	  	//After view is ready and all the training files are loading at that time only we are calling 
	  	//checkPlayerFromMessageWin for checking is it from message window
      this.checkPlayerFromMessageWin();
    }

    VideoRecordMgr.getTrainingFiles(null, function(r, t) {
      if (t.status) {
        this.numberofTrainingFiles = r.length;
      }
    }, this);

    Ext.Msg.hide();
    
    this.restoreSession(SWP.lastruns);

  },

  generateCourseReport: function(reportsWin) {

    if (reportsWin) {
      reportsWin.setLoading(true);
      reportsWin.down('form').getForm().load({
        params: {
          'param1': '123'
        },
        success: function() {
          reportsWin.setLoading(false);
        }
      });
    }

  },

  /**
   
   *
   
   *  On Messages button click in the player window, this function gets fired. it will pause the
   
   *  player if any lesson is being played and opens a new window having threads in that, if they are
   
   *  available for that particular user.
   
   *
   
   *  @param  grid    Comments Grid
   
   *
   
   */


  showMessagingWindow: function(grid, thread_id, isFromCommentsGrid, showTasks) {

    var videoPlayer = this.getPlayer().getFlowPlayer();
    var isPlaying = videoPlayer.isPlaying();

    if (!SWP.InstructorAvailable) {

      Ext.Msg.alert(MESSAGE_NO_INSTRUCTOR.ALERT_TITLE, MESSAGE_NO_INSTRUCTOR.MESSAGE_BTN);

      return;

    }

    var openedNew = true;
    if (!SWP.mw || SWP.mw.closed) {

      var url = me.location.search;
      var token = url.split('&')[1];
      var nextEventRequired = '';
      if (isFromCommentsGrid) {
        //201311181028
        nextEventRequired = '&isFromCommentsGrid=' + isFromCommentsGrid;
      } else if (showTasks) {
        nextEventRequired = '&showTasks=' + thread_id;
      }

      var winName = '';
      if (SWP.InstructorAvailable) {

        winName = WINDOWNAME.INSTRUCTOR;
      } else {
        winName = WINDOWNAME.STUDENT;
      }

      if (!Ext.isEmpty(SWP.messageWindowConfigs)) {

        winHeight = SWP.messageWindowConfigs.height;
        winWidth = SWP.messageWindowConfigs.width;
        xPosition = SWP.messageWindowConfigs.xPosition;
        yPosition = SWP.messageWindowConfigs.yPosition;
      } else {

        winHeight = (Ext.getBody().getViewSize().height) * (2 / 3);
        winWidth = (Ext.getBody().getViewSize().width * 2) / 3;
        xPosition = 0;
        yPosition = 0;
      }

      //201311010230
      if (isPlaying) {
        this.pauseVideoPlayer();
      }

      SWP.mw = window.open('/?page=admin.Message&' + token + '' + nextEventRequired, "messageinstructor",
        'width=' + winWidth +
        ',resizable=1,height=' + winHeight +
        ',left=' + xPosition +
        ',top=' + yPosition + '');
    //201406190726
      SWP.PlayerFromMsg = false;
      
      if (!this.MesagewindowExist) {

        var pollMessage = new Ext.util.DelayedTask();
        pollMessage.delay(1000, function() {

          Ext.TaskManager.start({

            run: this.getData,

            args: [10],

            interval: 5000,

            scope: this

          });

        }, this);
        this.messagePlayerWinComuIniti = true;
      }

      this.MesagewindowExist = true;

    } else {
      //201405160848
    	//Code which checks is this open window focus is related to the window opened from the BSS.
    	//if it is from BSS then it will check the name and focus to the window.
      openedNew = false;
      if(SWP.mw.name == 'messageinstructorfromMsg'){
    	  var messageWinds = window.open('', "messageinstructorfromMsg");
    	  SWP.mw = messageWinds;
    	  messageWinds.focus();
    	//201406190726
    	  SWP.PlayerFromMsg = true;
      }else{    	  
    	  SWP.mw.focus();
    	//201406190726
    	  SWP.PlayerFromMsg = false;
      }
    }

    if (SWP.mw && !Ext.isIE) {
      SWP.mw.onunload = function() {
    	//201406190726
    	SWP.PlayerFromMsg = false;
        SWP.messageWindowConfigs = {
          xPosition: SWP.mw.screenX,
          yPosition: SWP.mw.screenY,
          width: SWP.mw.innerWidth,
          height: SWP.mw.innerHeight
        };

      }
    } else if (SWP.mw && Ext.isIE) {
      SWP.mw.attachEvent('onunload', function() {
    	//201406190726
    	SWP.PlayerFromMsg = false;
        SWP.messageWindowConfigs = {
          xPosition: SWP.mw.screenLeft - 7,
          yPosition: SWP.mw.screenTop - 51,
          width: SWP.mw.document.body.clientWidth,
          height: SWP.mw.document.body.clientHeight
        };
      });
    }


    if (thread_id) {

      var string = '{success:true, eventName:"showmessagingwindow",rows:[{"thread_id":' + thread_id + ',"isFromCommentsGrid":' + isFromCommentsGrid + ',"showTasks":' + showTasks + '}]}';
      this.dataSend(string);
    }
    return openedNew;
  },

  newThreadFromCommentsGrid: function(gridMsgpnl, commentsGridRecord) {
    //SWP.InstructorAvailable  value is calculated in the VideoRecordMgr.getUserDetails function on the basis of the instructor availability date 
    //So we need not to check that condition again.
    if (!SWP.instructorAvaiableForCurrentDate) {
    	//201405281102
    	//Code for checking if the role is instructor then one message and if the role 
    	//is student then another message.
    	var confirmation = "";
    	var text = "";
    	if(SWP.Rroleid == 24){
    	     text = INSTURCTOR.INSTRUCTOR_NOT_AVAILBLE;
    	     confirmation = INSTURCTOR.INSTRUCTOR_NOT_AVAILBLE_CONFIRM;
    	} else if(SWP.Rroleid == 3){
    		 text = STUDENT.STUDENT_NOT_AVAILBLE;
    	     confirmation = STUDENT.STUDENT_NOT_AVAILBLE_CONFIRM;
    	}
    	Ext.Msg.confirm(confirmation, text, function(btn, text) {
        if (btn == 'yes') {
          this.createNewCommentThread(gridMsgpnl, commentsGridRecord);
        }
      }, this);
    } else {
      this.createNewCommentThread(gridMsgpnl, commentsGridRecord);
    }
  },
  createNewCommentThread: function(gridMsgpnl, commentsGridRecord) {

    var threadType = 1;

    var iconClicked = true;

    //getreference

    CTSELECTED = this.getReference(gridMsgpnl, threadType, commentsGridRecord, iconClicked);

    threadType = gridMsgpnl.threadType;

    if (!threadType) {

      threadType = 1;

    }

    var thisIsTask = gridMsgpnl.thisIsTask;

    var title = gridMsgpnl.title;

    var commentsGridRecordComment = commentsGridRecord.get('comment');

    var commentsGridRecordUid = commentsGridRecord.get('uid');


    //As for the newtopic from comments grid we are not loading the store automatically.
    //we are modifying this method to pass the values of isFromCommentsGrid.
    //201311151025
    var newmessages = this.showMessagingWindow(gridMsgpnl, 0, true, false);

    var string = '{success:true, eventName:"newthreadfromcommentsgrid",CTSELECTED:[{"LESSON":"' + CTSELECTED.LESSON + '","LESSON_ID":"' + CTSELECTED.LESSON_ID + '","CHAPTER_ID":' + CTSELECTED.CHAPTER_ID + ',"CHAPTER_NAME":"' + CTSELECTED.CHAPTER_NAME + '","TIME_MINUTES":"' + CTSELECTED.TIME_MINUTES + '","QUESTION":' + CTSELECTED.QUESTION + ',"QUESTION_ID":' + CTSELECTED.QUESTION_ID + ',"LINK":"' + CTSELECTED.LINK + '","CHAPTERNAME":"' + CTSELECTED.CHAPTERNAME + '","SEEKTIME":' + CTSELECTED.SEEKTIME + '}],msgpnl:[{"threadType":' + threadType + ',"thisIsTask":' + thisIsTask + ',"title":"' + title + '"}],commentsRecord:[{"comment":"' + commentsGridRecordComment + '","uid":' + commentsGridRecordUid + '}]}';

    if (newmessages) {

      this.dataSend(string);

    } else {
      this.dataSend(string);
    }
  },



  /**
   
   *
   
   * If the player is playing and we are trying to open the messaging window
   
   * then it will first pause the player.
   
   *
   
   */



  pauseVideoPlayer: function() {

    var player = this.getPlayer();



    if (player.getFlowPlayer().isPlaying() || player.getFlowPlayer().getState() < 3) {



      if (player.getFlowPlayer().getState() < 3) {



        this.isPlayerPaused = true;

        if (player.seekedTo) {



          player.pause();

          player.seekedTo = false;



        } else {



          player.stopImmedietly = true;

        }



      } else {



        this.isPlayerPaused = true;

        player.pause();

      }

    } else {



      this.isPlayerPaused = false;

    }

  },



  /**
   
   * Realigns the message button on resizing the viewport.
   
   *
   
   */

  onViewResize: function(viewport, width, height, oldwidth, oldheight, eOpts) {

    var badgeButton = this.getCommentsGrid().down('badgebutton');



    /**
     
     *  Checking conditions for adjusting messaging window button on resize of view port in order to not to
     
     *  get hidden.
     
     *
     
     */



    if (this.messageButton && badgeButton.el.dom.offsetLeft > MESSAGEBUTTON.DECREASE_OFFSET_LEFTWIDTH) {



      this.messageButton.showAt(badgeButton.el.dom.offsetLeft - MESSAGEBUTTON.DECREASE_OFFSET_LEFTWIDTH, this.getCommentsGrid().getPosition()[1] + (this.getCommentsGrid().body.dom.offsetTop - MESSAGEBUTTON.DECREASE_OFFSET_TOPWIDTH));

      this.messageButton.isMoving = false;



    } else if (this.messageButton && badgeButton.el.dom.offsetLeft == MESSAGEBUTTON.DECREASE_OFFSET_LEFTWIDTH) {



      this.messageButton.showAt(badgeButton.el.dom.offsetLeft - MESSAGEBUTTON.DECREASE_OFFSET_LEFTWIDTH_EQUALS, this.getCommentsGrid().getPosition()[1] + (this.getCommentsGrid().body.dom.offsetTop - MESSAGEBUTTON.DECREASE_OFFSET_TOPWIDTH));

      this.messageButton.isMoving = false;



    } else if (this.messageButton && badgeButton.el.dom.offsetLeft < MESSAGEBUTTON.DECREASE_OFFSET_LEFTWIDTH) {



      this.messageButton.showAt(badgeButton.el.dom.offsetLeft - MESSAGEBUTTON.DECREASE_OFFSET_LEFTWIDTH_LESS, this.getCommentsGrid().getPosition()[1] + (this.getCommentsGrid().body.dom.offsetTop - MESSAGEBUTTON.DECREASE_OFFSET_TOPWIDTH));

      this.messageButton.isMoving = false;

    }

    // On resizing the quiz panel and comments grid the view was getting disturbed. 
    // so updating the layout of the component and flexenv on resizing.

    if (fleXenv) {
      fleXenv.updateScrollBars();
    }

    var quiz = this.getQuizView();
    if (!quiz.collapsed) {
      quiz.down('form').updateLayout();
    }

  },

  newTopic: function(msgpnl, typeofthread, rec, iconClicked) {



    this.fireEvent('newtopic', msgpnl, typeofthread, rec, iconClicked);

  },



  /**
   
   * This method will take care of updating the window title and handling the code for editorinitialize
   
   * event for tinyMceEditor.
   
   * */

  updateWindow: function(msgpnl, rec, topicview) {



    if (msgpnl.title == TABVIEW.MESSAGES_TITLE || rec) {



      topicview.setTitle(NEWTOPIC.MESSAGES_TITLE);



    } else {



      topicview.setTitle(NEWTOPIC.TASKS_TITLE)

    }



    topicview.show();

    tinymceeditor = topicview.down('tinymce_textarea');



    tinymceeditor.on('editorinitialize', function() {

      var fieldsetHeight = topicview.down('fieldset').getHeight();
      fieldsetHeight = fieldsetHeight + 10 + 40 + 68;
      tinymceeditor.fireEvent('resize', tinymceeditor, topicview.getWidth() - 15, topicview.getHeight() - fieldsetHeight, undefined, undefined, undefined, false);
    }, this);
  },



  /**
   
   *
   
   *  Converts the passed time format to minutes: seconds, which gets called from new topic window.
   
   *
   
   */



  convertTime: function(timeToConvert) {

    var seekTime = timeToConvert.toString();
    var timeStamp = seekTime.split(".");
    var divisor_for_minutes = (parseInt(timeStamp[0])) % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    if (minutes < 10) {

      minutes = '0' + minutes;
    }

    if (seconds < 10) {

      seconds = '0' + seconds;
    }

    return (minutes + ':' + seconds);
  },

  /**
   * On Cancel button click in new topic window, it will close the new topic window.
   *
   */
  cancelnewTopic: function(newtopic, flag) {
    newtopic.previousNode().close();
  },



  /**
   * If a thread is associated with any reference (Lesson/Quiz) then clicking
   * on the button that reference will be opened.
   *
   */
 openReference :  function( ref ) {
          var ref;
          var lastRun;

          //201311251620
          if(Ext.ComponentQuery.query('datagrid')[0]){
            
            Ext.ComponentQuery.query('datagrid')[0].up('window').close();
          }
          
          lastRun = new SWP.model.LastRun(ref);

          //
          // As we need the same behaviour when user returns from the quiz and plays video.. made swp.quized=true 
          //

          SWP.quized = true;
          this.playLastRun(lastRun);
          //201311291807
          this.removePlayIcon();
    },



  /**
   
   * It plays last run based on the reference information passed to it.
   
   *
   
   */


 playLastRun:function( lastRun ){

      var chapter = Ext.ComponentQuery.query('chapterslist')[0];
      var chapterpanel = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
      var chapter_id ;
      var chs = chapterpanel.getStore(),lastRunType;
      
         
      /*
       * Here we are checking the if the question id is empty and either the subject of the
       * reference is taskref or chapter id is null in that case considering the record as 
       * a lesson.
       * refs #22689
       */
      var chrindex = chs.findBy( function( rec, id ){  return ( rec.get('video_id').substr(1) ==  lastRun.get('video_id')  );  },this );
      if( chrindex!= -1 ){
    	  lastRunType = chs.getAt(chrindex).get('video_id').substr(0,1);
      }
      if ( lastRunType == 'L' && ( !Ext.isEmpty( lastRun.get('chapter_id') ) || lastRun.get('subject') == "taskref" ) ){

        chapter_id = 'L'+lastRun.get('video_id')+ ( Ext.isEmpty( lastRun.get('chapter_id')) ? '' : '_'+lastRun.get('chapter_id') );

      }else if( lastRunType == 'Q' ){
        chapter_id = 'Q'+lastRun.get('video_id')+'_0';
      }

      if( !Ext.isEmpty( lastRun.get('chapter_id')) || !Ext.isEmpty( lastRun.get('question_id'))){
		    var i = chs.findBy( function( rec, id ){
		          	return ( rec.get('uid') == chapter_id && 
		        		  		( (lastRun.get('position') == 0 ) || (lastRun.get('position') >= rec.get('start') && 
		        		  					lastRun.get('position') < rec.get('stop')) ) );
		        	},this );
	        if(i == -1){
	        	var i = chs.findBy( function( rec, id ){
	                return ( rec.get('video_id').substr(1) == lastRun.get('video_id') );
	            },this );
	        }
      }else {

        var i = chs.findBy( function( rec, id ){
        			return ( rec.get('video_id') == chapter_id );
        		},this );
        // if record is not found with the video_id then check with the uid
        if(i == -1 ){
            i = chs.findBy( function( rec, id ){
                  return ( rec.get('uid') == chapter_id );
                },this );
        }
      }
      var questionIndex = 0;
      if ( chapter_id.substr(0,1) === 'Q' ){
        questionIndex = lastRun.get('question_id');
        // If the clicked reference is a Summry thread then we are maintaining 
        // a different value for the question index which is used later to switch
        // to that particular question index.
        
        if( Ext.isEmpty(lastRun.get('question_id')) && 
            Ext.isEmpty(lastRun.get('chapter_id')) && 
            lastRun.get('subject') == 'threadref'){
          
          questionIndex = 'Summary';
        }
        /*
         * refs #29453
         * Here in some scenarios for the summary reference question_id is giving null value for lastrun record,
         * so here we are handling that scenario
         */
        if( Ext.isEmpty(questionIndex) && lastRun.raw.chaptername == "Summary" ){
        	questionIndex = 'Summary';
        }
      }
       var gridView = chapterpanel.getView();
          if( !Ext.isEmpty( gridView.prevSelectedQuiz ) ){
            if( Ext.isEmpty(gridView.prevSelectedQuiz.dom) ){
              gridView.prevSelectedQuiz = Ext.fly(gridView.prevSelectedQuiz);
            }
            gridView.prevSelectedQuiz.addCls('swp-content-collapsed');
            if( gridView.prevSelectedQuiz.dom.className.indexOf('swp-content-expand') != -1 ){
              
              gridView.prevSelectedQuiz.removeCls('swp-content-expand');
            }
            gridView.prevSelectedQuiz = undefined ;
          }
          
          if ( chapter_id.substr(0,1) === 'Q' ){
            
            // Here we are finding the particular Quiz whiose reference was clicked
            // inorder to expand the quiz.
            
              var groupHeaderEls = Ext.select('.x-grid-group-hd').elements;
              var headeerText = '';
              var MatchText = ' ';
            for( var j=0; j <groupHeaderEls.length; j++ ){
              headeerText = groupHeaderEls[j].textContent;
           if(!headeerText ){
            headeerText = groupHeaderEls[j].innerText;
             MatchText = headeerText.substr(0, headeerText.length - 2 );
           } else {
            MatchText = headeerText.substr(0, headeerText.length - 3);
           }
           
            if ( MatchText == chs.getAt(i).get('lesson') ){
                var requiredHeaderEl = groupHeaderEls[j];
                var index = j;
                break;
              }
            }
            
            var requiredEl = Ext.fly(requiredHeaderEl);
            requiredEl.addCls('swp-content-expand');
            if( requiredEl.dom.className.indexOf('swp-content-collapsed') != -1 ){
              requiredEl.removeCls('swp-content-collapsed');
                  }
            gridView.prevSelectedQuiz = requiredHeaderEl;
          }

      //If the reference record is not exist, findBy() method return -1 other wise it return matched index.
      //Check the reference record is there or not.

      if( i !== -1 ) {
        chapter.fireEvent( 'chapterselected', 
				            chapter,
				            chapterpanel,
				            null,
				            chs.getAt(i),
				            null,
				            null,
				            null,
				            null,
				            questionIndex,
				            lastRun.get('position') != 0 ? lastRun.get('position') : '', // if position is zero then passing empty string so that 
				                                          // video will played from the start time of the chapter.
				            lastRun.get('language')
				            );
      }
    },
    /**
     * This method will take care of removing the focus from the
     * previously played chapter, if any exist in the chapters list.
     * 
     * */
    removePlayIcon : function(){
      
        var prevSeen = Ext.select('.now-seen');
        if(prevSeen){
          
          if( !Ext.isEmpty(Ext.fly(prevSeen.elements[0])) ){
            
            Ext.fly(prevSeen.elements[0]).removeCls('now-seen');
          }
        }
      var currentSelections = Ext.select('.currentlyselected');
      if( currentSelections ){
        
        for( var j=0;j < currentSelections.elements.length; j++ ) {
          
          var currentSelectedNode = Ext.fly(currentSelections.elements[j]);
          if( currentSelectedNode ) {
            
            
            currentSelectedNode.removeCls('currentlyselected');
          }
        }
      }
    },




  /**
   
   *   On clicking on attachments button in new topic window,
   
   *   this function gets fired and shows upload popup window, which allows user to upload files.
   
   *
   
   */

  showAttachmentPanel: function(topic) {



    var PATH = 'tmp/' + topic.instanceId + '/';



    var view = Ext.widget('UploadPopup', {

      uploadPath: PATH,

      autoUpload: false,

      optionalZip: true,

      ref: topic,

      isfromamazon: SWP.isFromAmazon

    });



    view.show();

    topic.doLayout();

  },



  /**
   
   *
   
   * This function is executed while canceling the attachments.
   
   *
   
   */



  cancelAttachments: function(pnl, uniqueid) {



    var awesomeUploader = pnl.down('awesomeuploader');



    if (awesomeUploader.winModified == true) {



      Ext.Msg.confirm({

        title: MESSAGE.CLASSROOM_CANCEL_TITLE,

        msg: MESSAGE.CLASSROOM_CANCEL_MSG,

        buttons: Ext.Msg.YESNO,

        icon: Ext.Msg.QUESTION,

        fn: function(btn) {



          if (btn === 'yes') {



            // If user tries to cancel the upload operation, then uploaded files also need to be deleted from the file structure.

            CollaborationToolMgr.recursiveRemoveDir([pnl.uploadPath + pnl.uniqueid]);

            pnl.close();

          }

        }

      });



    } else {



      pnl.close();

    }

  },



  /**
   
   * @method showWorkFilesPanel
   
   * A click on the Work Files button on the comments tool bar shows the Workfile Panel.
   
   * This panel is rendered using the logic mentioned in this method.
   
   *
   
   * @param commentPnl
   
   * @param btn
   
   *
   
   */

  showWorkFilesPanel: function(commentPnl, btn) {



    var chapterSelected = this.getChapters().getSelectedChapter();

    var chapterId = chapterSelected.get('uid');



    if (!Ext.isEmpty(chapterSelected)) {

      SWP.selected = {};

      SWP.selected.LESSON = chapterSelected.get('ordering');

      SWP.selected.LESSON_ID = chapterId.substr(1, chapterId.indexOf('_') - 1);

      SWP.selected.CHAPTER_ID = chapterId.substr(chapterId.indexOf('_') + 1);

      var LessonName = (SWP.selected.LESSON).substr(5);

      var view = Ext.ComponentQuery.query('workfiles')[0];

      var title = '';



      if (chapterSelected.get('uid')[0] == 'Q') {



        SWP.selected.QUESTION = this.getQuizView().down('tabpanel').getActiveTab().title;

        SWP.selected.QUESTION_ID = this.getQuizView().down('tabpanel').getActiveTab().uid;

        title = "Work Files For " + SWP.QuestionTitle + "( " + LessonName + " )";

      } else {



        SWP.selected.QUESTION = -1;

        SWP.selected.QUESTION_ID = -1;

        title = "Work Files For " + LessonName;

      }



      var paramsTogetCount = {

        flessond_id: SWP.selected.LESSON_ID,

        fqeustion_id: SWP.selected.QUESTION_ID,

        fchapter_id: SWP.selected.CHAPTER_ID,

        flesson: SWP.selected.LESSON,

        fproduct_id: SWP.PID
      };

      //

      // workfiles window doesnot exists then create workfiles window and load the filesGrid

      //



      if (!view) {



        view = Ext.widget('workfiles', {
          title: title
        });

        var filesGrid = Ext.ComponentQuery.query('workfiles filesgrid ')[0];

        filesGrid.getStore().load({
          params: paramsTogetCount
        });

      }



      //

      //  This function is to get the total count of uploaded files and the current

      //  opening workfiles window's uploaded files count.

      //  It is written to enable the download button, if any files were uploaded.

      //  The count of uploaded files in current grid is used to disable download button, 

      //  if all files were deleted in course.

      //

      VideoRecordMgr.getTrainingFilesCount(paramsTogetCount, function(r, t) {

        if (t.status) {



          filesGrid.totalTrainingfilesCount = r[0];

          filesGrid.uploadedfileNumber = r[1];

          var downloadAllButton = Ext.getCmp('downloadallfiles');

          if (r[0] > 0) {



            downloadAllButton.enable(true);

          }

        }

      });



      var uploadPopUp = Ext.ComponentQuery.query('UploadPopup')[0];



      //

      // work files window is hidden and uploadPopUp window is not available then only show the workfiles window.

      //



      if (view.isHidden() && !uploadPopUp) {



        view.show();

      }

    }



  },

  /**
   
   * @method showUploadPopUp
   
   * This method shows the upload popup window
   
   *
   
   */

  showUploadPopUp: function(grid) {



    var PATH = 'images/trainingfiles/' + SWP.PID + '/' + SWP.selected.LESSON + "/" + (SWP.selected.QUESTION != -1 ? SWP.selected.QUESTION + '/' : '/');

    var chapterSelected = this.getChapters().getSelectedChapter();

    var title = '';

    var LessonName = (SWP.selected.LESSON).substr(5);



    if (chapterSelected.get('uid')[0] == 'Q') {



      title = "Upload Files For " + SWP.QuestionTitle + "(" + LessonName + ")";

    } else {



      title = "Upload Files For " + LessonName;

    }

    var view = Ext.widget('UploadPopup', {

      uploadPath: PATH,

      autoUpload: false,

      optionalZip: true,

      ref: grid,

      title: title,

      isfromamazon: SWP.isFromAmazon

    });



    view.show();

    var workfiles = Ext.ComponentQuery.query('workfiles ')[0];

    workfiles.hide();

  },

  addComment: function(commentPnl, btn) {
    var grid = this.getCommentsGrid();

    var Comment = this.getCommentModel();

    var chapterSelected = this.getChapters().getSelectedChapter();

    if (Ext.isEmpty(chapterSelected)) {
      return;
    }

    //
    // Ordering value received from the selection model will be in
    // following format:
    // <Ordering>-<Lession Name>, where ordering is 4 digit number
    // padded with 0.
    //

    var ordering = Ext.util.Format.substr(chapterSelected.data.ordering, 0, 4);

    if (!this.getQuizView().isHidden()) {

      var chap = this.getQuizView().down('tabpanel').getActiveTab();

      commented_on = 'Q';

      var videos_id = this.getQuizView().down('tabpanel').getActiveTab().videoId;

      var question_id = this.getQuizView().down('tabpanel').getActiveTab().uid;



      videos_id = Ext.util.Format.substr(videos_id, 1, videos_id.length - 1);

      var nc = new Comment({
        ts: this.getQuizView().down('tabpanel').items.indexOf(chap),

        chapter: chap.initialConfig.title,

        videos_id: videos_id,

        commented_on: 'Q',

        reference_id: chapterSelected.data.uid,

        ordering: ordering,

        lesson: this.getQuizView().down('tabpanel').quiz_lesson,

        role_id: SWP.Rroleid,

        user_id: SWP.Ruid,

        question_id: question_id,

        chapter_id: null

      });

    } else {

      var time = Math.round(this.getPlayer().getTime()) + '';

      var nc = new Comment({
        ts: time,

        chapter: chapterSelected.getChapterName(),

        videos_id: chapterSelected.get('video_id').substr(1),

        lesson: chapterSelected.get('lesson'),

        commented_on: 'C',

        reference_id: chapterSelected.data.uid,

        ordering: ordering,

        role_id: SWP.Rroleid,

        user_id: SWP.Ruid,

        question_id: null,

        chapter_id: chapterSelected.data.uid.split('_')[1]

      });

    }

    // Before start editing on the text field,
    // we are removing all the selected records

    var selectedRecs = grid.getSelectionModel().getSelection();

    for (var i = 0; i < selectedRecs.length; i++) {
      grid.getSelectionModel().deselect(selectedRecs[i]);
    }

    grid.getStore().insert(0, [nc]);

    var header = grid.getView().getHeaderAtIndex(4);

    // Selecting the newly created record
    grid.getSelectionModel().select(nc);

    grid.getPlugin('editcomments').startEdit(nc, header);
    SWP.isCommentIconClicked = false;
  },

  commentmeAfterExpand: function() {
    var grid = this.getCommentsGrid();
    if (grid.isHidden()) {
      //if the grid is hidden at this stage then we will expand and the expand event is maintained in the Grid.js
      grid.expand();
    } else {
      this.addComment();
    }
  },



  storeLast: function() {

  },

  getLast: function() {

    return [Ext.util.Cookies.get('SWP.last.movie') || -1, Ext.util.Cookies.get('SWP.last.movie.start') || 0];

  },

  loadVideo: function(vid, noplay, last) {

    var s = window.location.search;

    if (!vid) {

      vid = parseInt(s.substring(5));

    }
            //201311291807
            this.removePlayIcon();

    var me = this;

    var Video = Ext.ModelManager.getModel('SWP.model.Video');

    Video.load(vid, {

      success: function(video) {



        var dc = Math.random() * 10000; //Ext.Date.format(new Date(),'U');

        last = last || 0;

        me.getContentPanel().getLayout().setActiveItem(0);

        Ext.MessageBox.hide();

        me.getStatusBar().setStatus({

          text: 'Ready!',

          iconCls: 'x-status-valid',

          clear: true // auto-clear after a set interval

        });

      },

      failure: function() {

        me.getStatusBar().setStatus({

          text: 'Oops!',

          iconCls: 'x-status-error',

          clear: true // auto-clear after a set interval

        });

      }

    });



  },

  /**
   
   * This method is used to open the quiz's question on which the comment was made or
   
   * play the lesson against which the user has commented.
   
   *
   
   * In case of quiz, the timestamp value is used to decide the tab number which needs to be activated.
   
   * Similarly, in case of lessons, the timestamp is used to seek the exact video position.
   
   *
   
   */

  seekToCommentedChapterOrQuiz: function(commentGrid, rowIndex, colIndex, record) {

    var lesson = record.get('lesson');

    var ts = record.get('ts');

    var ref_id = record.get('reference_id');

    var id = ref_id.substr(1, (ref_id.length - 1));
    var chapterpanel = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
    var gridView = chapterpanel.getView();

    if (!Ext.isEmpty(gridView.prevSelectedQuiz)) {
      if (Ext.isEmpty(gridView.prevSelectedQuiz.dom)) {
        gridView.prevSelectedQuiz = Ext.fly(gridView.prevSelectedQuiz);
      }
      gridView.prevSelectedQuiz.addCls('swp-content-collapsed');
      if (gridView.prevSelectedQuiz.dom.className.indexOf('swp-content-expand') != -1) {

        gridView.prevSelectedQuiz.removeCls('swp-content-expand');
      }
      gridView.prevSelectedQuiz = undefined;
    }
    //201311220420  
    var chs = chapterpanel.getStore();

    var i = chs.findBy(function(rec, id) {

      return (rec.get('uid') == record.get('reference_id'));

    }, this);

    var groupHeaderEls = Ext.select('.x-grid-group-hd').elements;
    var headeerText = '';
    var MatchText = '  ';
    for (var j = 0; j < groupHeaderEls.length; j++) {

      headeerText = groupHeaderEls[j].textContent;
      if (!headeerText) {
        headeerText = groupHeaderEls[j].innerText;
        MatchText = headeerText.substr(0, headeerText.length - 2);
      } else {
        MatchText = headeerText.substr(0, headeerText.length - 3);
      }

      if (MatchText == chs.getAt(i).get('lesson')) {
        var requiredHeaderEl = groupHeaderEls[j];
        var index = j;
        break;
      }
    }

    var requiredEl = Ext.fly(requiredHeaderEl);


    if (record.get('commented_on') === 'Q') {

      this.getContentPanel().getLayout().setActiveItem(0); //used to player deactivate 

      var loaded_lesson = ''; // this.getQuizView().down('tabpanel').quiz_lesson;

      SWP.quized = true;

      // Here we are finding out the selected quiz, and based on the selected quiz
      // we are scrolling down so that the selected item will be in focus.


      if (requiredEl) {
        requiredEl.addCls('swp-content-expand');
        if (requiredEl.dom.className.indexOf('swp-content-collapsed') != -1) {
          requiredEl.removeCls('swp-content-collapsed');
        }
      }

      //201311220420
      if (requiredHeaderEl) {
        var isAllowScroll = this.isScrollAllow(chapterpanel, requiredEl);
        if (isAllowScroll) {
          chapterpanel.getView().el.scrollTo('top', 0, true);
          requiredEl.scrollIntoView(chapterpanel.getView().el, false);
        }
      }
      gridView.prevSelectedQuiz = requiredHeaderEl;



      if (lesson === loaded_lesson) {

        chapterpanel.getSelectionModel().select([chs.getAt(i)], false, true);
        this.getQuizView().expand();

        this.getQuizView().setQuizItem(record.get('chapter'));
        this.getChapters().refreshIcons(record, true);

      } else {

        var chapter = Ext.ComponentQuery.query('chapterslist')[0];

        var chapterpanel = Ext.ComponentQuery.query('chapterslist gridpanel')[0];

        chapter.fireEvent('chapterselected',

          chapter,

          chapterpanel,

          null,

          chs.getAt(i),

          null,

          null,

          null,

          null,

          record.get('ts'),

          ''

        );

      }

    } else {

      this.getQuizView().collapse();

      var rec = this.getChapters().selectMatchingChapterByUid(record.get('reference_id'));
      //201407031055
      if( rec && rec.get('quizRequiredToPass').length == 0 ){ //This condition for preventing the player in active,if it is in active then it showing continuously loading.
    	  this.getContentPanel().getLayout().setActiveItem(this.getPlayer());
      }
      //201311220420
      var isAllowScroll = this.isScrollAllow(chapterpanel, requiredEl);

      if (isAllowScroll) {
        chapterpanel.getView().el.scrollTo('top', 0, true);
        requiredEl.scrollIntoView(chapterpanel.getView().el, false, true, true);
      }

      if (rec) {

        this.chapterSelected(null, null, null, rec, ts)

      }

    }
  },

  seekToDesiredBlockOfChapter: function( ev,el,blockID,record ) {
      
	  this.getQuizView().collapse();
   var me = this;

   VideoRecordMgr.getChapterAndLession( blockID ,function(rec,to){ 
     var chapterKey,seekTime ;
     chapterKey   = rec['chapterKey'];
     seekTime     = rec['seekTime'];
    var record = me.getChapters().selectMatchingChapterByUid(chapterKey);
    if ( record ) {
      me.chapterSelected(null, null, null, record, seekTime);
    }
  },me);
  },

  /**
   
   * User should be able to close a private message by selecting from the context menu close option.
   
   *
   
   */



  closeMessage: function(me, grid, items, store) {



    Ext.Array.each(items, function(item) {



      if (item.get('thread_catogery_id') == TABS.THREAD_CATOGERY_ONE && item.get('status') == MESSAGESTATE.STATUS_OPEN) {



        item.set('status', MESSAGESTATE.STATUS_CLOSED);

        store.sync();

      }

    });

  },



  /**
   
   * User should be able to Open a closed private message by selecting from the context menu Open option.
   
   *
   
   */



  openMessage: function(me, grid, items, store) {



    Ext.Array.each(items, function(item) {



      if (item.get('thread_catogery_id') == TABS.THREAD_CATOGERY_ONE && item.get('status') == MESSAGESTATE.STATUS_CLOSED) {



        item.set('status', MESSAGESTATE.STATUS_OPEN);

        store.sync();

      }

    });

  },

  /**
   
   * By double clicking on the thread it should open the corresponding
   
   * post's of the threads
   
   */



  showMessageThread: function(record, store, isFromCommentsGrid, fromQuiz) {

    // setting record into a controller variable to compare this record in polling while loading the posts

    this.fireEvent('showmessagethread', record, store, isFromCommentsGrid, fromQuiz);

    return;


  },



  /*
   
   * @public
   
   * From the message details window if the user clicks on showMessagelist
   
   * button then it will open the thread window with the corresponding
   
   * thread getting selected.
   
   */



  showMessageList: function(button, messagedetails, records) {



    var thread_id, threadtype_id;

    var messagingWindow;

    var tab;

    var selectedRecord;

    var selectedRowIndex;

    var replyPanel = Ext.ComponentQuery.query('reply')[0];



    //To stop the Task for post unread identifier. 

    messagedetails.readPostTask.stop();



    if (replyPanel) {



      this.checkEmptySpaces(replyPanel);

    }



    if (!messagedetails.confirmMessage &&

      replyPanel &&

      (replyPanel.getForm().isDirty() ||

        replyPanel.noOfAttachments > 0)) {



      this.cancelReply(replyPanel, button, messagedetails, records);



    } else {



      messagedetails.confirmMessage = false;

      thread_id = records[0].data['thread_id'];

      threadtype_id = records[0].data['threadtypeId'];

      var reply = Ext.ComponentQuery.query('reply');



      messagingWindow = Ext.ComponentQuery.query('messagewindow')[0];



      messagingWindow.setActiveItem(0);



      if (reply.length) {



        reply[0].destroy();

      }

      var searchFields = Ext.ComponentQuery.query('datalist searchfield');

      var searchField = null;

      // AS we are getting two search fields in the browser, based on the active tab we 

      // are considering the required searchfield and its value.

      if (threadtype_id == TABS.THREAD_TYPE_THREE) {



        Ext.ComponentQuery.query(' tabview')[0].setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_TWO);

        searchField = searchFields[1];

      } else {



        Ext.ComponentQuery.query(' tabview')[0].setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_ONE);

        searchField = searchFields[0];

      }

      tab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();

      tabStore = tab.getStore();

      selectedRecord = tab.getSelectionModel().getSelection();

      storeRecords = tab.getStore().data.items;



      var r = tab.getSelectionModel().getSelection();

      var selectedrowindex = tab.getStore().indexOf(r[0]);

      var loadpageCount = tabStore.currentPage;



      if (messagedetails.isModified() == true) {



        loadpageCount = 1

      }

      // searchHappen- config check, whether search is happen or not even if search text is entered.

      if (!Ext.isEmpty(searchField.searchText)) {



        store = searchField.store,

        proxy = store.getProxy(),



        searchField.store.clearFilter();



        searchField.store.filter({

          id: searchField.paramName,

          property: searchField.paramName,

          value: searchField.searchText



        });



        searchField.store.loadPage(loadpageCount, {

          callback: function() {



            tab.getSelectionModel().select(tabStore.findExact('uid', selectedRecord[0].get('uid')));

          },

          scope: this

        }, this);



        searchField.store.clearFilter();

        searchField.hasSearch = true;

        searchField.triggerCell.item(0).setDisplayed(true);

        searchField.updateLayout();



      } else {



        tabStore.loadPage(loadpageCount, {

          callback: function() {



            tab.getSelectionModel().select(tabStore.findExact('uid', selectedRecord[0].get('uid')));

          },

          scope: this

        }, this);

      }

    }

  },



  /**
   
   *   @public
   
   *
   
   *   handle the cancel of reply
   
   *
   
   *   @param  reply Reply component
   
   *   @param  button  Cancel button
   
   *   @param  msgdtlPan Message detail panel
   
   *
   
   */

  cancelReply: function(reply, button, msgdtlPan, obj) {



    if (!msgdtlPan) {



      this.checkEmptySpaces(reply);

    }



    if (button) {



      reply.selButton = button.iconCls;

    }



    //If the Reply panel have some modification,then before cancelling the operation, It will ask for a Conform box.



    if (reply.getForm().isDirty() ||

      (reply.noOfAttachments > 0 && reply.replyattachments.length > 0)) {



      Ext.Msg.confirm({
        title: MESSAGE.CLASSROOM_CANCEL_TITLE,

        msg: MESSAGE.CLASSROOM_CANCEL_MSG,

        buttons: Ext.Msg.YESNO,

        icon: Ext.Msg.QUESTION,

        scope: this,

        fn: function(btn) {



          //

          //If the user clicks on Yes then, the corresponding clicked action will happen, otherwise it will simply display the form

          //

          if (btn === 'yes') {



            if (msgdtlPan) {



              msgdtlPan.confirmMessage = true;

            }



            if (reply.selButton == 'previous') {



              this.previous(button, msgdtlPan);



            } else if (reply.selButton == 'next') {



              this.next(button, msgdtlPan);



            } else if (reply.selButton == 'refresh') {



              this.onRefreshPosts(button, msgdtlPan);



            } else if (reply.selButton == 'messagelist') {



              this.showMessageList(button, msgdtlPan, obj);

            }



            //

            // If any attachments are their for the Post

            // then all the attachments will get deleted from the file structure,before canceling the reply. 

            //



            if (reply.replyattachments.length > 0) {



              CollaborationToolMgr.recursiveRemoveDir(reply.replyattachments);



              reply.noOfAttachments = 0;

            }


          }

        }

      });



    } else {



      var parent = reply.up('container');

      parent.destroy();

    }

  },



  /**
   
   *
   
   * By clicking on the previous button then if any previous thread exist then
   
   * that threads corresponding post will be getting displayed
   
   *
   
   */



  previous: function(btn, msgDtlPnl, threadId) {



    var badgebutton;

    var badgeTab;

    var badgeTabIndex;

    var store;

    var tab;

    var record;

    var tabStore;



    //To stop the Task for post unread identifier. 

    msgDtlPnl.readPostTask.stop();



    var replyPanel = Ext.ComponentQuery.query('reply')[0];



    var me = Ext.ComponentQuery.query('pagingtoolbar')[0];

    var currentPage = me.store.currentPage;



    var tab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();

    var tabStore = tab.getStore();



    var currentRecord = tab.getSelectionModel().getSelection()[0];



    if (replyPanel) {



      this.checkEmptySpaces(replyPanel);

    }



    if ((!msgDtlPnl.confirmMessage &&

        replyPanel &&

        (replyPanel.getForm().isDirty() || replyPanel.noOfAttachments > 0)) ||

      (replyPanel && currentRecord.index == 0 && currentPage == 1)) {



      this.cancelReply(replyPanel, btn, msgDtlPnl, threadId);

    } else {



      msgDtlPnl.confirmMessage = false;

      if (tab.getSelectionModel().selectPrevious(false, true)) {



        record = tab.getSelectionModel().getLastSelected();



        // setting record into a controller variable to compare this record in polling while 

        //  loading the posts



        this.threadRecord = record;

        this.fireEvent('setthreadrecord', record);



        store = msgDtlPnl.getStore();

        msgDtlPnl.thread = record;



        store.load({
          params: {
            'thread_id': record.get('uid')
          }
        });



        msgDtlPnl.setThreadSubject(record.get('subject'));

        if (record.get('thread_type_id') == TABS.THREAD_TYPE_THREE) {



          //this condetion prevent the Quizes instructions request, while click on previous. No need to show Quiz instructions in Quetion's task details window.

          if (!record.data.reference['question_id']) {



            CollaborationToolMgr.getInstructions({
              'reference_id': record.get('reference_id'),
              'video_id': null
            }, function(r, t) {

              msgDtlPnl.setInstructions(r);

            });

          }

        }



        var isRead = record.get('unread_Post_Count');



        record.set('views', record.get('views') + 1);


        tabStore.sync();



      } else {



        var messagesStore = Ext.ComponentQuery.query(' tabview')[0].getActiveTab().store;

        var messageDetails = Ext.ComponentQuery.query('messagedetails')[0];


        var total = me.getPageData().pageCount;



        prev = me.store.currentPage - 1;



        if (prev > 0) {



          messagesStore.previousPage({



            callback: function() {



              if (prev <= total) {



                messageDetails.setLoading(true);

                var length = messagesStore.data.length - 1;

                var selected = tab.getSelectionModel().select(messagesStore.data.items[length]);

                var record = tab.getSelectionModel().getLastSelected();



                //  setting record into a controller variable to compare this record 

                //  in polling while loading the posts

                this.threadRecord = record;

                this.fireEvent('setthreadrecord', record);



                store = msgDtlPnl.getStore();



                store.load({
                  params: {
                    'thread_id': record.get('uid')
                  }
                });



                msgDtlPnl.setThreadSubject(record.get('subject'));



                if (record.get('thread_type_id') == TABS.THREAD_TYPE_THREE) {



                  CollaborationToolMgr.getInstructions({
                    'reference_id': record.get('reference_id'),
                    'video_id': null
                  }, function(r, t) {

                    msgDtlPnl.setInstructions(r);

                  });

                }



                var isRead = record.get('unread_Post_Count');


                tabStore.sync();

              }

            }



          }, this);



        }



      }

      if (this.unReadThreads && record) {



        var indexValue = Ext.Array.indexOf(this.unReadThreads, record.get('uid'));

        if (indexValue != -1) {



          this.unReadThreads.splice(indexValue, 1);

        }

      }

    }

  },

  /** 
   
   * By clicking on the next button, if any thread available after this thread
   
   * then that threads corresponding posts are getting displayed
   
   */



  next: function(btn, msgDtlPnl, threadId) {



    var badgebutton;

    var badgeTab;

    var badgeTabIndex;

    var tab;

    var selectedRecord;

    var tabStore;



    //To stop the Task for post unread identifier. 

    msgDtlPnl.readPostTask.stop();



    var replyPanel = Ext.ComponentQuery.query('reply')[0];

    var me = Ext.ComponentQuery.query('pagingtoolbar')[0];

    var total = me.getPageData().pageCount;

    var current = me.store.currentPage;

    var tab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();

    var tabStore = tab.getStore();



    var currentRecord = tab.getSelectionModel().getSelection()[0];

    var lastRecord = tab.store.last();



    if (replyPanel) {



      this.checkEmptySpaces(replyPanel);

    }



    if ((!msgDtlPnl.confirmMessage && replyPanel &&

        (replyPanel.getForm().isDirty()

          || replyPanel.noOfAttachments > 0)) ||

      (replyPanel && currentRecord.index == lastRecord.index && total == current)) {



      this.cancelReply(replyPanel, btn, msgDtlPnl, threadId);



    } else {

      msgDtlPnl.confirmMessage = false;

      if (tab.getSelectionModel().selectNext(false, true)) {

        var record = tab.getSelectionModel().getLastSelected();



        // setting record into a controller variable to compare this record in polling while loading the posts 



        this.threadRecord = record;

        this.fireEvent('setthreadrecord', record);

        var store = msgDtlPnl.getStore();



        msgDtlPnl.thread = record;



        store.load({
          params: {
            'thread_id': record.get('uid')
          }
        });



        if (record.get('thread_type_id') == TABS.THREAD_TYPE_THREE) {



          //this condetion prevent the Quizes instructions request, while click on next.No need to show Quiz instructions in Quetion's task details window.

          if (!record.data.reference['question_id']) {



            CollaborationToolMgr.getInstructions({
              'reference_id': record.get('reference_id'),
              'video_id': null
            }, function(r, t) {

              msgDtlPnl.setInstructions(r);

            });



          }

        }



        msgDtlPnl.setThreadSubject(record.get('subject'));

        var isRead = record.get('unread_Post_Count');



        record.set('views', record.get('views') + 1);

        tabStore.sync();

      } else {



        var messagesTab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();

        var messagesStore = messagesTab.store;

        var messageDetails = Ext.ComponentQuery.query('messagedetails')[0];

        var next = me.store.currentPage + 1;



        if (next <= total) {



          messagesStore.nextPage({



            callback: function() {



              if (next <= total) {



                messageDetails.setLoading(true);



                var selected = tab.getSelectionModel().select(messagesStore.data.items[0]);

                var record = tab.getSelectionModel().getLastSelected();



                // setting record into a controller variable to compare this record in polling while loading the posts 



                this.threadRecord = record;

                this.fireEvent('setthreadrecord', record);

                var store = msgDtlPnl.getStore();



                store.load({
                  params: {
                    'thread_id': record.get('uid')
                  }
                });



                msgDtlPnl.setThreadSubject(record.get('subject'));



                if (record.get('thread_type_id') == TABS.THREAD_TYPE_THREE) {



                  CollaborationToolMgr.getInstructions({
                    'reference_id': record.get('reference_id'),
                    'video_id': null
                  }, function(r, t) {

                    msgDtlPnl.setInstructions(r);

                  });

                }



                var isRead = record.get('unread_Post_Count');

                tabStore.sync();

              }

            }

          }, this);



        }



      }



      if (this.unReadThreads && selectedRecord) {



        var indexValue = Ext.Array.indexOf(this.unReadThreads, selectedRecord.get('uid'));



        if (indexValue != -1) {



          this.unReadThreads.splice(indexValue, 1);

        }

      }

    }

  },



  /**
   
   *
   
   * On refreshing posts, reloading the posts store and comparing weather there are unread
   
   * messages are there or not for that partcular thread. If yes, making them to read.
   
   *
   
   */



  onRefreshPosts: function(btn, messagedetails, threadRecord) {



    messagedetails.setUpdated(false);

    var replyPanel = Ext.ComponentQuery.query('reply')[0];



    if (replyPanel) {



      this.checkEmptySpaces(replyPanel);

    }



    if (!messagedetails.confirmMessage && replyPanel

      && (replyPanel.getForm().isDirty() || replyPanel.noOfAttachments > 0)) {



      this.cancelReply(replyPanel, btn, messagedetails, threadRecord);



    } else {



      messagedetails.confirmMessage = false;

      messagedetails.store.load({
        params: {
          'thread_id': this.threadRecord.get('uid')
        }
      });

      var datalist = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();

      var badgebutton = Ext.ComponentQuery.query(' badgebutton ')[0];

      var badgeTab = Ext.ComponentQuery.query(' tabview badgetab ');
    }



  },



  /**
   
   * If any link(reference of a chapter) is available for a post,
   
   * this function helps to open the reference
   
   *
   
   */



  link: function(playerObj) {



    var lastRun = new SWP.model.LastRun(playerObj);



    this.playLastRun(lastRun);



    var messagingWindow = Ext.ComponentQuery.query('messagewindow');



    if (messagingWindow.length > 0) {



      this.minimiseWindow(messagingWindow[0]);

    }

  },



  /**
   
   *   It check the emply spaces in a form fields.
   
   */



  checkEmptySpaces: function(reply) {



    var content = reply.getForm().findField('content').contentValue;

    if (content) {



      content = content.replace(/&nbsp;/gi, "");

      content = content.replace(/<br>/gi, "");

      content = Ext.String.trim(content);

    }



    if (content == '') {



      reply.getForm().findField('content').setValue("");

    }



    var attachments = Ext.getCmp(reply.getId() + '-attachedfiles');



    reply.noOfAttachments = attachments.items.length;

  },



  /**
   
   *  Allows user to override caption styles using user settings window. This function
   
   *  launches user settings window.
   
   *
   
   */



  openVideoCaptionSettings: function(commentsgrid, button) {



    Ext.create('SWP.view.captions.VideoCaptionSettings', {



    }).show();



  },

  /**
   
   *
   
   */

  quizesWinFbarAction: function(view, e, eOpt) {



    if (view.taskId) {



      var me = this;

      var taskId = view.taskId;



      me.showMessagingWindow(this, taskId, false, true);
    } else {



      var chaptersGrid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];

      var selectedRecord = chaptersGrid.getSelectionModel().getSelection()[0];

      var questionTab = this.getQuizView().down('tabpanel').getActiveTab();

      var defaultValuePath = selectedRecord.data.ordering;

      this.downloadTrainingFiles(null, null, false, defaultValuePath, false, questionTab.title);



    }



  },



  courseTaskSummary: function(pnl, record, item, index, event, eopts) {



    var ref;

    var lastRun;



    ref = record.data;

    lastRun = new SWP.model.LastRun(ref);

    SWP.quized = true;

    this.showMessagingWindow(this, record.data.task_id, false, true);

  },

 /*

   * For refresh the task status icons while create the task and update the task post 

   */

    refreshStatusIcons : function( status,fromNewtopic,fromSavepost,recVideoId,recQustionId,threadId,recStatus, isReopenPost,isPostClosing ) {
          /**

           * If this method is called from saveNewTopic it give the record value as tabview "0"th record,

           * and if this method is called from saveReplay if give the record value as last updated task 1st post record.

           */
          var chapterList = Ext.ComponentQuery.query( 'chapterslist gridpanel' )[0];
          var listStore = chapterList.getStore();
          var taskStatusStore =  Ext.data.StoreManager.lookup( 'SWPCommon.store.TaskStatuss' );
          var selected = chapterList.getSelectionModel().getSelection()[0];
          var recordVideoId =null; 
          var recordQustionId = null;
          var recordStatus = null;
        //var lastPostRecord = null;
          var taskID = null;

          recordVideoId =recVideoId;
          recordQustionId = recQustionId;
          if( fromSavepost ) {
	         recordStatus =recStatus;
          }else if( fromNewtopic ) {
	         recordStatus = '-1';
          }
        
          //finding the index in the chapter list by the passed video id (recVideoId)	
          var recordIndex = listStore.findBy( function( rec, id ) {
            var videoIdLength = rec.get( 'video_id' ).length;
            return ( rec.get( 'video_id' ).substr(1, videoIdLength) == recordVideoId );
          },this);

          var modifiedRecord = listStore.getAt(recordIndex);
          var videoId = modifiedRecord.get('video_id');
          CollaborationToolMgr.getQuizStatus( recordVideoId,recordQustionId,isReopenPost,isPostClosing,function(r,t) {
            if(t.status){
              for (j = 0 ; j < listStore.data.length ; j++){
                var record = listStore.data.items[j];
                if( fromSavepost && isReopenPost && 
                		(modifiedRecord.get('video_id').substr(0,1) != 'Q') && 
                			(r.lessonSubsequent.length > 0) ){
                	//When Task ReOpened Scenarios
                	var lessonSubsequentIndex = r.lessonSubsequent.indexOf(record.get('video_id').substr(1));
                	if( lessonSubsequentIndex != -1 ){
                		var subsequentArray = record.data.quizRequiredToPass;
                		var indexValue =Ext.Array.indexOf(subsequentArray, modifiedRecord.get('video_id').substr(1));
                		if(indexValue == -1){                			
                			subsequentArray.push(modifiedRecord.get('video_id').substr(1));
                		}
                	}
                } else if(fromSavepost &&  isPostClosing && (modifiedRecord.get('video_id').substr(0,1) != 'Q') 
                		               &&  (r.lessonSubsequent.length > 0)){
                	//When Task Complete Scenarios
                	var lessonSubsequentIndex = r.lessonSubsequent.indexOf(record.get('video_id').substr(1));
                	if( lessonSubsequentIndex != -1 ){
                		
                		//Here caliculating the lesson completed status based on lesson settings.
                		//When ever we are going to take off the lesson id from the respective videos we need to check for 
                		//lesson completion status , then we are going to find that video in the sub sequent arry of this particular content
                		//and we will remove that id from the array
		  				var subsequentArray = record.data.quizRequiredToPass;
                		var indexValue = Ext.Array.indexOf(subsequentArray, modifiedRecord.get('video_id').substr(1));
				 		if(indexValue != -1){	      
				 			subsequentArray.splice(indexValue,1);
				 		}
                	}
                }
                
                //We have a situation user has opted for the task completion required to view the lesson and
                //He has not selected the subsequent.
                //In this situtation above code is not going to work so written explicitly
                record.set('lessonCompletedStatus',r.isLessonCompleted);
                
                if( record.data.video_id == modifiedRecord.get('video_id') ) {
                	record.data.taskStatus = r.status;
                  	var currentStatusRecord = taskStatusStore.findRecord( 'ID',r.status );
                	//201311191850
                	var tooltip = '';
	                if( record.data.video_id.substr(0,1) == 'L'){
	                  if( r.status == '5' && !SWP.instructLogin){
	                    tooltip = TASKSTATUS.OPEN_UPDATED_BY_YOU;
	                  }else{
	                    tooltip = r.iconTooltip;
	                  }
	                } else{
	                  tooltip = this.getCorrectTooltip( currentStatusRecord, true );
	                }
                
                  record.data.taskId =r.taskId;
                  record.data.statusCls =r.statusCls;
                  record.data.statusTooltip = tooltip;//r.iconTooltip;
                  record.data.unreadCount = r.unreadCount;
                } 
              }

              var chapterList = Ext.ComponentQuery.query( 'chapterslist gridpanel' )[0];
              var selectedRecs  =chapterList.getSelectionModel().getSelection();
              chapterList.getView().refresh();

              if ( selectedRecs.length >0  ) {
                chapterList.getSelectionModel().select( selectedRecs , false,true);
                Ext.ComponentQuery.query( 'chapterslist')[0].refreshIcons( selectedRecs[0]);
              }

              if( modifiedRecord.get( 'video_id' ).substr(0,1) === 'Q' ) {
                if( recordIndex != -1 ){
                  var quizWin = Ext.ComponentQuery.query( 'quiz' )[0];
                  var quizTabPanel = quizWin.down( 'tabpanel' );
                  var questions =Ext.ComponentQuery.query('quiz badgetabpenl ')[0].items;
                  var statusRecord = taskStatusStore.findRecord( 'ID',r.status );
                  for( k = 0 ; k < quizTabPanel.items.length ; k++ ){
                    if( ( questions.items[k].uid ) && ( questions.items[k].uid == recordQustionId ) ) {
                      questions.items[k].setIconCls( 'status0'+status+'-quiz' ) ;
                      //201311171420
                      var badgeTab = Ext.ComponentQuery.query('badgetab')[k];
                      var statusCls = badgeTab.setToolTip(status,true );
                      Ext.getElementById(badgeTab.id+'-btnIconEl').setAttribute('data-qtip',statusCls);
                      quizTabPanel.updateBadge(k,'',false);
                      var dockedItem = questions.items[k].down('fbarbutton');
                      if( dockedItem ){
                          questions.items[k].remove(dockedItem );
                       }
                      //201311301937
                      var tooltipText = statusRecord.get('LessonTooltip');
                      if( status  == '5' && !SWP.instructLogin ){
                            tooltipText =  TASKSTATUS.OPEN_UPDATED_BY_YOU;
                      }
                      questions.items[k].add( Ext.create( 'SWP.view.FbarButton', {
	                      cls: 'fbarCls'+status,
	                      overCls:'fbarOverCls'+status,
	                      tooltip: tooltipText,
	                      taskId :r.taskId
                      }) );

                      // }
                    }
                  }
                }
              }

              var chapterList = Ext.ComponentQuery.query( 'chapterslist' )[0];

              if ( r.courseStatus ){
                var setClass = 'course-status-0'+r.courseStatus ;
              } else {
               var setClass = 'fully-completed';
              }

//              Ext.getCmp( chapterList.getId()+'-courseTaskSummary' ).setTooltip( toolTip );

//              Ext.getCmp( chapterList.getId()+'-courseTaskSummary' ).removeCls(removeClass);

              //201311220510
              var courseTaskIcon = Ext.getCmp(chapterList.getId()+'-courseTaskSummary' );
              
              courseTaskIcon.setIconCls(setClass);

              this.updateCourseTaskIconTooltip(chapterList, courseTaskIcon, setClass);
              
              Ext.getCmp( chapterList.getId()+'-courseTaskSummary' ).enable(true);
            
              var dataGrid = Ext.ComponentQuery.query('datagrid')[0];
	            if( dataGrid ){
	            	dataGrid.getStore().load();
	            }
            }
         },this);

    },

  /*
   * 201311220510
   * @ Params are chapterList component, course Task Icon and task Icon Class
   * this method writen for show the course task summary Icon tool tip based on icon class status
   *
   */

  updateCourseTaskIconTooltip: function(chapterList, courseTaskIcon, taskIconClass) {

    if (taskIconClass == "course-status-03") {

      courseTaskIcon.setTooltip(GRID.SOME_TASK_OPENED);

    } else if (taskIconClass == "course-status-04") {

      if (SWP.Rrolename == "student") {
        var toolTip = GRID.ONE_OR_MORE_TASKS_BY_INSTRUCTOR;
      } else {
        var toolTip = GRID.ONE_OR_MORE_TASKS_BY_STUDENT;
      }

      courseTaskIcon.setTooltip(toolTip);

    } else if (taskIconClass == "course-status-05") {

      courseTaskIcon.setTooltip(GRID.ALL_TASKS_UPDATED_ATLEAST_ONCE);

    } else {
      courseTaskIcon.setTooltip(GRID.ALL_TASK_COMPLETED);
    }

  },
  /**
   
   * this method writen for show the course task summary window from list
   
   */

  showCourseTaskSummaryWin: function(list) {



    var videoPlayer = this.getPlayer().getFlowPlayer();

    var isPlaying = videoPlayer.isPlaying();



    if (isPlaying) {



      this.pauseVideoPlayer();



    } else {



      this.isPlayerPaused = false;

    }



    var courseTaskSummaryWindow = Ext.create('Ext.window.Window', {

      title: GRID.COURSE_TASK_SUMMARY,

      autoHeight: true,

      modal: true,

      width: 600,

      height: 250,

      maximizable: true,

      constrain: true,

      layout: 'fit',

      cls: 'summary-window-cls',

      scope: this,

      // 201311161824
      // As customized scroll bar was coming in the course task summary window.

      flexCroll: false,

      listeners: {

        beforeclose: function(win, eopts) {



          if (this.scope.isPlayerPaused) {

          }

        }

      }



    }).showAt(400, 150, true);



    courseTaskSummaryWindow.add([{

      xtype: 'datagrid',

      // 201311161824
      // As customized scroll bar was coming in the course task summary window.

      flexCroll: false,
      border: 0,

      bodyStyle: {

        border: 0

      }

    }]);

  },


  /**
   
   * This method used to refresh the Chapters list Quiz group header icon.
   
   */

  refreshQuizStatusIcon: function(result) {

    var chapterslist = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
    var selected = chapterslist.getSelectionModel().getSelection()[0];
    if (chapterslist) {
      chapterslist.getView().fireEvent('changegroupicon', selected.get('ordering'), true, result);
    }
  },

  /// After moving the code to corresponding controller.
  playerStatus: function() {

    var chaptersGrid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
    var selectedChapter = chaptersGrid.getSelectionModel().getSelection()[0];

    if (selectedChapter && selectedChapter.get('uid').substr(0, 1) !== 'Q') {
      var player = this.getPlayer().getFlowPlayer();

      if (player.isPlaying() == false && this.isPlayerPaused == true) {
        player.resume();
      }
    }

    this.getPlayer().stopImmedietly = false;
    this.getPlayer().seekedTo = false;

    var chaptersGrid = Ext.ComponentQuery.query('chapterslist')[0];
    chaptersGrid.eventFiredValue = false;
  },

  showMessageButton: function(messageButton) {

    var badgeButton = this.getCommentsGrid().down('badgebutton');

    messageButton.showAt(badgeButton.el.dom.offsetLeft - MESSAGEBUTTON.DECREASE_OFFSET_LEFTWIDTH, this.getCommentsGrid().getPosition()[1] + this.getCommentsGrid().body.dom.offsetTop - MESSAGEBUTTON.INITIAL_DECREASE_OFFSET_TOPWIDTH);

    this.getToolBar().show();
  },



  toolbarShow: function(status) {

    if (status) {
      this.getToolBar().show();
    } else {
      this.getToolBar().hide();
    }
  },

  getReference: function(msgpnl, typeofthread, rec, iconClicked) {

    CTSELECTED = {}; //This is a json array which will hold all the details of the currently played chapter

    var video_id;

    var chapter;

    var chapterId;

    var lesson;

    var chapterSelected;

    /*
     
     * refs #7347
     
     *
     
     * chapter_id â€šÃ„Ã¬ Changed the chapter_id from 'L'+videoId+'_'+chapterid to id of the chapter.
     
     * video_id â€šÃ„Ã¬  Changed the video_id from 'L'+content_id to content_id.
     
     * question_id - Changed question_id from  index of the question to uid of the question.
     
     */

    chapterSelected = this.getChapters().getSelectedChapter();

    var chapterpanel = Ext.ComponentQuery.query('chapterslist gridpanel')[0];

    var chs = chapterpanel.getStore();

    if (!Ext.isEmpty(chapterSelected) && !iconClicked) {

      chapter = chapterSelected.get('uid').split('_');

      chapterId = chapter[(chapter.length) - 1];

      lesson = chapterSelected.get('video_id');

      video_id = lesson.substr(1, lesson.length);

      var chapterName = chapterSelected.get('name');

      CTSELECTED.LESSON = chapterSelected.get('lesson');

      CTSELECTED.LESSON_ID = video_id;

      CTSELECTED.CHAPTER_ID = chapterId;

      CTSELECTED.CHAPTER_NAME = chapterName;
      var player = this.getPlayer().getFlowPlayer();
      var playerTime = this.getPlayer().getTime();

      if (playerTime == 0) {

        playerTime = chapterSelected.get('start');

      }

      CTSELECTED.TIME_MINUTES = this.convertTime(playerTime);
      var LessonName = (CTSELECTED.LESSON).substr(5);
      if ((chapterSelected.get('uid')).substring(0, 1) == 'Q') {

        var chap = this.getQuizView().down('tabpanel').getActiveTab();

        /**
         
         * ques will return the active tab title in quiz
         
         *
         
         */

        var questionTitle = this.getQuizView().down('tabpanel').getActiveTab().title;

        CTSELECTED.QUESTION_ID = this.getQuizView().down('tabpanel').getActiveTab().uid;



        if (CTSELECTED.CHAPTER_ID == "0")

        {

          CTSELECTED.CHAPTER_ID = null;

        }



        if (questionTitle) {



          CTSELECTED.LINK = CTSELECTED.LESSON + " - " + questionTitle;

          CTSELECTED.CHAPTERNAME = questionTitle;

          CTSELECTED.LESSON = CTSELECTED.LESSON;

        } else {



          CTSELECTED.LESSON = CTSELECTED.LESSON;

          CTSELECTED.LINK = CTSELECTED.LESSON;

        }



      } else {



        if (this.getPlayer()) {



          CTSELECTED.SEEKTIME = this.getPlayer().getTime();



          var i = chs.findBy(function(rec, id) {



            return (rec.get('uid') == chapterSelected.get('uid') &&

              ((CTSELECTED.SEEKTIME == 0) || (CTSELECTED.SEEKTIME >= rec.get('start') &&

                CTSELECTED.SEEKTIME < rec.get('stop'))));

          }, this);

          /**
           
           *  If the seek time doesn't match the chapter that was selected, overriding the chapter record values
           
           *  based on the newly get record, which is based on the lesson.
           
           *
           
           */

          if (i == -1) {

            var i = chs.findBy(function(rec, id) {

              return (rec.get('video_id') == chapterSelected.get('video_id') && (CTSELECTED.SEEKTIME >= rec.get('start') &&

                CTSELECTED.SEEKTIME < rec.get('stop')));

            }, this);



            actualSelectedRecotd = chs.getAt(i);

            actualChapter = actualSelectedRecotd.get('uid').split('_');



            CTSELECTED.CHAPTER_ID = actualChapter[(actualChapter.length) - 1];

            CTSELECTED.CHAPTER_NAME = actualSelectedRecotd.get('name');

            CTSELECTED.LESSON = actualSelectedRecotd.get('lesson');



            lesson = actualSelectedRecotd.get('video_id');

            video_id = lesson.substr(1, lesson.length);



            CTSELECTED.LESSON_ID = video_id;

          }



        }



        CTSELECTED.QUESTION = -1;

        CTSELECTED.QUESTION_ID = -1;



        CTSELECTED.LINK = CTSELECTED.LESSON + " - " + CTSELECTED.CHAPTER_NAME + " - " + CTSELECTED.TIME_MINUTES;

        CTSELECTED.CHAPTERNAME = CTSELECTED.CHAPTER_NAME + " - " + CTSELECTED.TIME_MINUTES;

      }



      if (!CTSELECTED.SEEKTIME) {



        CTSELECTED.SEEKTIME = 0;

      }



    } else {



      CTSELECTED.LESSON_ID = null;

      CTSELECTED.CHAPTER_ID = null;

      CTSELECTED.QUESTION_ID = null;

    }

    if (rec) {



      //          var tabView = Ext.ComponentQuery.query('tabview')[0];

      //          tabView.setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_ONE);



      var subject = rec.get('comment');



      var selectedReference = rec.get('reference_id').split('_');

      var selectedLesson = selectedReference[0];



      CTSELECTED.LESSON_ID = selectedLesson.substr(1, selectedLesson.length);



      CTSELECTED.LESSON = rec.get('lesson');



      CTSELECTED.CHAPTER_ID = rec.get('chapter_id');



      var chaptername = rec.get('chapter');



      if (rec.get('commented_on') != 'Q') {



        var seekTime = rec.get('ts');



        CTSELECTED.TIME_MINUTES = this.convertTime(seekTime);

        CTSELECTED.SEEKTIME = rec.get('ts');



        var reference_id = rec.get('reference_id');



        var i = chs.findBy(function(rec, id) {



          return (rec.get('uid') == reference_id &&

            ((CTSELECTED.SEEKTIME == 0) || (CTSELECTED.SEEKTIME >= rec.get('start') &&

              CTSELECTED.SEEKTIME < rec.get('stop'))));

        }, this);



        /**
         
         *  If the seek time doesn't match the chapter that was selected, overriding the chapter record values
         
         *  based on the newly get record, which is based on the lesson.
         
         *
         
         */



        if (i == -1) {



          var i = chs.findBy(function(rec, id) {



            return (rec.get('video_id') == selectedLesson && (CTSELECTED.SEEKTIME >= rec.get('start') &&

              CTSELECTED.SEEKTIME < rec.get('stop')));

          }, this);



          actualSelectedRecotd = chs.getAt(i);

          actualChapter = actualSelectedRecotd.get('uid').split('_');



          CTSELECTED.CHAPTER_ID = actualChapter[(actualChapter.length) - 1];

          CTSELECTED.CHAPTER_NAME = actualSelectedRecotd.get('name');

          CTSELECTED.LESSON = actualSelectedRecotd.get('lesson');



          lesson = actualSelectedRecotd.get('video_id');

          video_id = lesson.substr(1, lesson.length);



          CTSELECTED.LESSON_ID = video_id;

          chaptername = CTSELECTED.CHAPTER_NAME;



        }



        CTSELECTED.QUESTION = -1;

        CTSELECTED.QUESTION_ID = -1;



      } else {



        CTSELECTED.QUESTION_ID = rec.get('question_id') ? rec.get('question_id') : -1;

        CTSELECTED.SEEKTIME = 0;

      }



      if (CTSELECTED.TIME_MINUTES) {



        CTSELECTED.LINK = CTSELECTED.LESSON + " - " + chaptername + " - " + CTSELECTED.TIME_MINUTES;

        CTSELECTED.CHAPTERNAME = chaptername + " - " + CTSELECTED.TIME_MINUTES;

      } else {



        CTSELECTED.LINK = CTSELECTED.LESSON + " - " + chaptername;

        CTSELECTED.CHAPTERNAME = chaptername;

      }

    }

    return CTSELECTED;

  },

  reloadCommentsGrid: function() {



    var cgrid = Ext.ComponentQuery.query('commentsgrid')[0];

    var cstore = cgrid.getStore();

    cstore.load();

  },



  updateBadgeCount: function(uid) {

    badgebutton = Ext.ComponentQuery.query(' badgebutton ')[0];
    if (badgebutton) {


      if (badgebutton.getBadgeText() >= 1) {



        badgebutton.setBadgeText(badgebutton.getBadgeText() - 1);

      }

      if (this.unReadThreads) {



        var indexValue = Ext.Array.indexOf(this.unReadThreads, uid);

        if (indexValue != -1) {



          this.unReadThreads.splice(indexValue, 1);

        }

      }
    }
  },

  increaseBadgeCount: function(thread_id) {



    if (!Ext.Array.contains(this.unReadThreads, thread_id)) {



      this.unReadThreads.push(thread_id);

      badgebutton = Ext.ComponentQuery.query(' badgebutton ')[0];

      if (badgebutton.getBadgeText() == ' ' || badgebutton.getBadgeText() == undefined) {



        badgebutton.setBadgeText(1);



      } else {



        badgebutton.setBadgeText(badgebutton.getBadgeText() + 1);

      }

    }

  },

  setThreadRecord: function(record) {



    this.threadRecord = record;

  },

  getData: function() {

    VideoRecordMgr.receiveMessage("tcp://localhost:61613", SWP.PID + '_' + SWP.Rrolename + '_videoplayer', function(r, t) {
      if (t.status) {
        if (!Ext.isEmpty(r)) {

          var msg = Ext.decode(unescape(r), true);

          if (msg && msg.eventName) {
            if (msg.eventName == "getreferenceformessagewindownewtopic") {

              CTSELECTED = this.getReference(null, false, false, msg.iconClicked);

              thisIsTask = msg.msgpnl[0].thisIsTask;

              typeofthread = msg.msgpnl[0].threadType;

              messagePanelTitle = msg.msgpnl[0].title;

              var string = '{success:true, eventName:"getreferenceformessagewindownewtopic",CTSELECTED:[{"LESSON":"' +
                (Ext.isEmpty(CTSELECTED.LESSON) ? '' : CTSELECTED.LESSON) + '","LESSON_ID":"' + (Ext.isEmpty(CTSELECTED.LESSON_ID) ? '' : CTSELECTED.LESSON_ID) +
                '","CHAPTER_ID":' + (Ext.isEmpty(CTSELECTED.CHAPTER_ID) ? 0 : CTSELECTED.CHAPTER_ID) + ',"CHAPTER_NAME":"' + (Ext.isEmpty(CTSELECTED.CHAPTER_NAME) ? '' : CTSELECTED.CHAPTER_NAME) +
                '","TIME_MINUTES":"' + (Ext.isEmpty(CTSELECTED.TIME_MINUTES) ? '' : CTSELECTED.TIME_MINUTES) + '","QUESTION":' +
                (Ext.isEmpty(CTSELECTED.QUESTION) ? -1 : CTSELECTED.QUESTION) + ',"QUESTION_ID":' + (Ext.isEmpty(CTSELECTED.QUESTION_ID) ? -1 : CTSELECTED.QUESTION_ID) +
                ',"LINK":"' + (Ext.isEmpty(CTSELECTED.LINK) ? '' : CTSELECTED.LINK) + '","CHAPTERNAME":"' + (Ext.isEmpty(CTSELECTED.CHAPTERNAME) ? '' : CTSELECTED.CHAPTERNAME) +
                '","SEEKTIME":' + (Ext.isEmpty(CTSELECTED.SEEKTIME) ? -1 : CTSELECTED.SEEKTIME) + '}],msgpnl:[{"threadType":' + typeofthread + ',"thisIsTask":' + thisIsTask + ',"title":"' + messagePanelTitle + '"}]}';

              this.dataSend(string);

            } else if (msg.eventName == "openreference") {
              this.openReference(msg.reference[0]);
            } else if (msg.eventName == "reloadcommentsgrid") {
              this.reloadCommentsGrid();
            } else if (msg.eventName == "refreshstatusicons") {

              var status = msg.rows[0].status;
              var fromNewtopic = msg.rows[0].fromNewtopic;
              var fromSavepost = msg.rows[0].fromSavepost;
              var recVideoId = msg.rows[0].recVideoId;
              var recQustionId = msg.rows[0].recQustionId;
              var threadId = msg.rows[0].threadId;
              var recStatus = msg.rows[0].recStatus;
              var isReopenPost = ((msg.rows[0].isReopenPost) ? msg.rows[0].isReopenPost : false );
              var isPostClosing = ((msg.rows[0].isPostClosing) ? msg.rows[0].isPostClosing : false );
              
              this.refreshStatusIcons(status, fromNewtopic, fromSavepost, recVideoId, recQustionId, threadId, recStatus, isReopenPost,isPostClosing);
            } else if (msg.eventName == "updatebadgecount") {

              this.updateBadgeCount(msg.rows[0].uid);
            } else if (msg.eventName == "resizemessagewindow") {

              SWP.messageWindowConfigs = {
                xPosition: msg.rows[0].xPosition,
                yPosition: msg.rows[0].yPosition,
                width: msg.rows[0].width,
                height: msg.rows[0].height
              };
            }
          }
        }

      }
    }, this); //receive message


  },

  dataSend: function(data) {

    data = escape(data);

    VideoRecordMgr.sendMessage(data, "tcp://localhost:61613", SWP.PID + '_' + SWP.Rrolename + '_trainingtools');
  },

  /**
   * This is method used to reset the Quiz.
   */
  markUnviewedLessons: function(quizid, fromResetQuiz,isSummaryClicked,subSequentUnLocking) {
    VideoRecordMgr.trackSeen(quizid, false, fromResetQuiz,isSummaryClicked, function(r, t) {
      if (t.status) {
        var list = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
        var listStore = list.getStore();
        var record = list.getSelectionModel().selected.items[0];
        var selectedRec = record.data;
        selectedRec.quizPassed = r.quizPassed;
        selectedRec.quizStatus = r.quizStatus;
        if (fromResetQuiz) {

          var noOfLessonsToBeUnviewed = r.markUnviewed.length;
          if (noOfLessonsToBeUnviewed) {

            for (var i = 0; i < noOfLessonsToBeUnviewed; i++) {
              var LessonId = parseInt(r.markUnviewed[i]);
              for (var j = 0; j < record.index; j++) {
                var rec = listStore.data.items[j];
                if (parseInt(rec.get('video_id').substr(1)) == LessonId) {
                  rec.set('seen', false);
                  rec.set('lessonCompletedStatus',r.subsequentLessonCompleteStatus[LessonId]);
                }
              }
              //Code for making the clocked content (lesson settings on reset the quiz)
        	  var contentList = r.subSeqcontnetLockOnUnView[LessonId];
          	  if(!Ext.isEmpty(contentList) && contentList.length > 0){
          		  for(var a = 0 ; a < contentList.length ; a++){
          			  for(var k = 0 ; k < listStore.totalCount ; k++){
              			  var lckRec = listStore.data.items[k];
              			  if (parseInt(lckRec.get('video_id').substr(1)) == contentList[a]) {
              				  var subsequentConArray = listStore.data.items[k].get('quizRequiredToPass');
              				  var indexValue = Ext.Array.indexOf(subsequentConArray, LessonId);
              	              if (indexValue == -1) {
              	            	  subsequentConArray.push(LessonId);
              	              }
                            }
              		  }
          		  }
          	  }
            }
          }
          
          if(isSummaryClicked){ 
          	var ch = Ext.ComponentQuery.query('chapterslist')[0].getSelectedChapter();
  	      	var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
  	  	  	var gview = grid.getView();
  	  	  	var row = gview.getNode(ch);
  	      	ch.set('seen', true);
  	      	if(row){
  	      		var hdTiltle = Ext.fly(row).parent('.x-group-hd-container').down('.x-grid-group-hd').down('.x-grid-group-title');
  	      		hdTiltle.removeCls('notseen-font').addCls('seen-font');
  	      	}
  	      }
          
          list.getView().refresh();
          this.FocusSelectedItem();
          return;
        } 
        if(subSequentUnLocking){
        	this.subSequentUnLocking(quizid, fromResetQuiz,isSummaryClicked);
        }
        /*
         * Code for making the quiz as seen one when user click on the summary tab of the quiz
         * */
    	var ch = Ext.ComponentQuery.query('chapterslist')[0].getSelectedChapter();
    	var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
		var gview = grid.getView();
		var row = gview.getNode(ch);
    	if(isSummaryClicked){   
    		ch.set('seen', true);
    		if(row){
    			var hdTiltle = Ext.fly(row).parent('.x-group-hd-container').down('.x-grid-group-hd').down('.x-grid-group-title');
    			hdTiltle.removeCls('notseen-font').addCls('seen-font');
    		}
    	}else{
    		if(fromResetQuiz){    			
    			ch.set('seen', false);
    			if(row){
    				var hdTiltle = Ext.fly(row).parent('.x-group-hd-container').down('.x-grid-group-hd').down('.x-grid-group-title');
    				hdTiltle.removeCls('seen-font').addCls('notseen-font');
    			}
    		}
    	}

        if (r.quizStatus == "required-quiz-failed" && r.quizRequiredToPass.length > 0) {

          var quizId = r.quizRequiredToPass[0];
        } else if (r.quizStatus != "required-quiz-failed") {
          var quizId = selectedRec.video_id.substr(1);
        }
        
        if (quizId) {

          var subsequentArray = [];
          var idExist = false;
          for (var i = (record.index + 1); i < listStore.totalCount; i++) {

            subsequentArray = listStore.data.items[i].get('quizRequiredToPass');
            if (r.quizStatus == "required-quiz-passed") { //201312050220
              var indexValue = Ext.Array.indexOf(subsequentArray, quizId);

              if (indexValue != -1) {



                listStore.data.items[i].get('quizRequiredToPass').splice(indexValue, 1);

              }
            } else if (r.quizStatus == "required-quiz-failed") {


              if (!Ext.Array.contains(subsequentArray, quizId)) {

                listStore.data.items[i].get('quizRequiredToPass').push(quizId);
              }


            }

          }
        }
        list.getView().refresh();
        this.FocusSelectedItem();
      }

    }, this);
  },

  /**
   * After the view getting refreshed, we are focusing the before selected item.
   *  Here we are finding out the selected quiz, and based on the selected quiz
   *   we are scrolling down so that the selected item will be in focus.
   **/

  FocusSelectedItem: function() {

    var groupHeader = Ext.select('.x-grid-group-hd').elements;
    var gridPanel = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
    var selectedItem = gridPanel.getSelectionModel().selected.items[0];
    if (selectedItem)
      var matchLesson = selectedItem.data.lesson;
    if (matchLesson) {

      var headeerText = '';
      var MatchText = ' ';
      for (var i = 0; i < groupHeader.length; i++) {

        headeerText = groupHeader[i].textContent;
        if (!headeerText) {
          headeerText = groupHeader[i].innerText;
          MatchText = headeerText.substr(0, headeerText.length - 2);
        } else {
          MatchText = headeerText.substr(0, headeerText.length - 3);
        }
        if (MatchText == matchLesson) {
          var requiredHeader = groupHeader[i];
          break;
        }

      }

    }

  },

  subSequentUnLocking: function(quiz_Id,isResetQuiz,IsFromChapterList){
	  var list = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
      var listStore = list.getStore();
      var record = list.getSelectionModel().selected.items[0];
      var selectedRec = record.data;
      var quizId = quiz_Id.split('_')[0];
      
      //$parentId, $conn, $fromchapterlist, $fromTrackSeen ,$isClickonSummary
      VideoRecordMgr.evaluateQuizTrackSeen( quizId, false ,IsFromChapterList ,isResetQuiz, false ,function(r,t){
    	  var quizStatus = r;
          if (quizId) {
            var subsequentArray = [];
            var idExist = false;
            for (var i = (record.index + 1); i < listStore.totalCount; i++) {
              subsequentArray = listStore.data.items[i].get('quizRequiredToPass');
              if (quizStatus == "required-quiz-passed") { //201312050220
                var indexValue = Ext.Array.indexOf(subsequentArray, quizId);
                if (indexValue != -1) {
                	subsequentArray.splice(indexValue, 1);
                }
              } else if (quizStatus == "required-quiz-failed") {
                if (!Ext.Array.contains(subsequentArray, quizId)) {
                	subsequentArray.push(quizId);
                }
              }
            }
          }
          list.getView().refresh();
          this.FocusSelectedItem();
      },this);
  },

  replayButton: function(playerTime) { 

    var ch = this.findPlaying();
    var swpPlayer = this.getPlayer();
    var fp = swpPlayer.getFlowPlayer();
    var playerTime = Math.round(playerTime);
    var nextMin = 0;
    var main = playerTime * 1000;
    var seekTime;
    var cuepoints = swpPlayer.playbackPoints; //20131610 use playbackPoints

      for (var l = 0; l < cuepoints.length; l++) {
        if (cuepoints[l] < main) {
          if (nextMin < cuepoints[l]) {
            nextMin = cuepoints[l];
          }
        }
      }
      seekTime = nextMin / 1000;
      try{    	  
    	  fp.getPlugin("dock1").hide();
    	  fp.getPlugin("dock2").hide();
    	  fp.getPlugin("dock3").hide();
      }catch (e) {
		// TODO: handle exception
	  }
    //swpPlayer.hideReplayNextPlayButton();
      if (ch.get("lastChapter")){    	  
    	   //fp.play();
      }
      console.log(seekTime);
      fp.seek(seekTime);
      this.getPlayer().replayed=true;
      //fp.resume();
  },
  registerCuePointsFromSeek: function(me, clip, selected) {
    if (selected.get('hiddenChapters').length > 0 && !selected.get('cuepointnotregistered')) {
      selected.set('cuepointnotregistered', true);
    }
  },
  registerCuePoints: function(ch) {

    var chapterStore = Ext.StoreManager.lookup('chapters');
    var fp = this.getPlayer().getFlowPlayer().getClip();
    var swpplayer = this.getPlayer();
    var flowPlayer = swpplayer.getFlowPlayer();
    var lastHiddenMarker, hiddenChapters;
    swpplayer.resumePoints = [];
    swpplayer.playbackPoints = [];
    swpplayer.replayplaybuttonpoints = [];
    fp.cuepoints = [];
    var fullDuration = Math.round(flowPlayer.getClip().fullDuration);
    var matchedRecords = chapterStore.queryBy(function(r, i) {

      return (ch.get('video_id').substr(1) == r.get('video_id').substr(1));
    }, ch);

    var chapter = matchedRecords.items;

    for (var k = 0; k < chapter.length; k++) {

      // 20131610 Add all the chapters start time to the cuepoints, i.e swpplyaer.resumePoints

      for (var i = 0; i < chapter[k].get('marker').length; i++) {

        var markerValue = Ext.Array.indexOf(swpplayer.resumePoints, chapter[k].get('marker')[i] * 1000);

        if (markerValue == -1) {

          swpplayer.resumePoints.push(chapter[k].get('marker')[i] * 1000);
          fp.cuepoints.push(chapter[k].get('marker')[i] * 1000);
        }

      }


      if ((SWPtmp.chapter_play_back == 'True' || SWPtmp.chapter_play_back == 1)) {
    	
		  if( k== 0 ){
	    	  //swpplayer.playbackPoints.push(chapter[k].get('marker')[k] * 1000);
	      }
		  /*if( chapter[k].get("lastChapter") ){
			  swpplayer.playbackPoints.push( fullDuration * 1000);
		  }*/
        if (!Ext.isEmpty(chapter[k].get('hiddenChapters'))) {

          hiddenChapters = chapter[k].get('hiddenChapters');
          for (var i = 0; i < hiddenChapters.length; i++) {
            var indexValue = Ext.Array.indexOf(swpplayer.resumePoints, hiddenChapters[i].start * 1000);

          //the playbackpoints which will verified in cuepoint handler
            //201406160918
            //Checking the hidden chapters for duplicate and registering only one hidden chapter from duplicates
            if(Ext.isEmpty(swpplayer.replayplaybuttonpoints[hiddenChapters[i].start * 1000])){            	  
          	  swpplayer.replayplaybuttonpoints[hiddenChapters[i].start * 1000] = hiddenChapters[i].buttonposition;
            }
            swpplayer.playbackPoints.push(hiddenChapters[i].start * 1000); // 20131610 Add hidden chapters to
            
            if (indexValue == -1) {
              swpplayer.resumePoints.push(hiddenChapters[i].start * 1000);
              fp.cuepoints.push(hiddenChapters[i].start * 1000);
            }
          }
        }

//	        if (chapter[k].get('chapterplaybackpause')) {
//
//	          for (var i = 0; i < chapter[k].get('marker').length; i++) {
//
//	            var markerValue = Ext.Array.indexOf(swpplayer.playbackPoints, chapter[k].get('marker')[i] * 1000);
//
//	            if (markerValue == -1) {
//
//	              swpplayer.playbackPoints.push(chapter[k].get('marker')[i] * 1000);
//
//	            }
//
//	          }
//
//	        }
      }
    };
    var me = this;
    if (swpplayer.resumePoints.length > 0) {

      if (!SWP.editorsLogin && !SWP.instructLogin) {

        //201311221251
        // Here we are maintaning an array, to pick up any values from each 10 second block and 
        // when control is coming to that particular time, we are firing the cuepoint event and sending
        // a backend request to increment that partcular block value by 1.

        swpplayer.heatmapPoints = [];
        var duration = Math.round(fp.duration);
        var i = 1;
        for (i; i < duration; i = i + 10) {
          var pushed = false;
          var j = i;
          while (!pushed) {
            var indexValue = Ext.Array.indexOf(swpplayer.resumePoints, j * 1000);
            if (indexValue == -1) {

              swpplayer.heatmapPoints.push(j * 1000);
              pushed = true
            } else {

              j++;
            }
          }
        }
        console.log(swpplayer.heatmapPoints);
        swpplayer.resumePoints = swpplayer.resumePoints.concat(swpplayer.heatmapPoints);

      }

      var cuepoints = [];
      //var fullDuration = Math.round(flowPlayer.getClip().fullDuration);
      var duration =0;
      while( fullDuration != duration){
        cuepoints.push( duration * 1000);
        duration = duration + 1;
      }
      
      fp.onCuepoint(cuepoints,
        function(clip, cuepoint) {
          if (cuepoint == 0) {
            return;
          }

          var swpplayer = me.getPlayer();
          console.log(swpplayer.chapterSelected , swpplayer.chapterResumed, cuepoint);
          // if chapterResumed time is less than the current cuepoint time then rest the 
          // chapterReusmed

          if( Math.round(swpplayer.chapterResumed )*1000 < cuepoint ){
              swpplayer.chapterResumed =0;
          }
           // if chapterSelected time is less than the current cuepoint time then
           // rest the chapterSelected

           if( Math.round(swpplayer.chapterSelected )*1000 < cuepoint ){
            swpplayer.chapterSelected =0;
          }


          // if cuepoint is available in heatmap array and block count is not increased for the same cuepoint
          // and video is palying then increase the block count.
           //201311221251
           blockValue = Math.ceil(( Math.round(cuepoint)/1000 )/10 ) ;
           
          var indexValueFromHeatmap = swpplayer.heatmapPoints ? Ext.Array.indexOf(swpplayer.heatmapPoints, cuepoint) : -1;
          console.log("increaseBlockCount ",swpplayer.blockCountIncreased, cuepoint,blockValue,indexValueFromHeatmap );
          if (indexValueFromHeatmap != -1 && 
            swpplayer.playingVideo() ) {

            //201311221251
            if (this.getState() == 3) {

              ch = me.findPlaying();

              if (ch) {

                var lesson = ch.get('video_id');

                var videoId = lesson.substr(1, lesson.length);

              }
             
              
              if( ( swpplayer.blockCountIncreased > 0 && Math.round(swpplayer.blockCountIncreased)*1000 != cuepoint )  ){
            	  swpplayer.blockCountIncreased = 0;
              }else{
            	  
            	  VideoRecordMgr.increaseBlockCount(videoId, blockValue , function(r, t) {
            		  if (t.status) {
//	                                                                alert(r);
            		  }
            	  });
              }
              
            }
          }

          // if chapterSelected and chapterResumed time exists then do not execute any logic

          if (swpplayer.chapterSelected || swpplayer.chapterResumed) {
            return;
          }

          var time = this.getTime();
          var playerTime = Math.round(cuepoint);
          var indexValue = -1;
          var buttonposition = '';
          	if( playerTime != 0 ){ //here handle the scenario, the start point of lesson will not show the play back point.
          		indexValue = Ext.Array.indexOf(swpplayer.playbackPoints, playerTime);
          		buttonposition = swpplayer.replayplaybuttonpoints[playerTime];
          	}
         
          // 20131610 vefiy the cuepoint exists in the playbackpoints. to show the repaly and next playbuttons
          if (buttonposition != '' && !Ext.isEmpty(buttonposition)) {

            var point = swpplayer.playbackPoints[indexValue];
            //201406110909
            swpplayer.playBackHiddenChapter(clip, cuepoint,buttonposition);

          } else {
            // 20131610 if not there in the playbackpoints just referesh the chapter list icons
            me.getChapters().refreshIcons(me.findPlaying(null, null, null, true));
          }
        }, this);
    }

  },


  /**
   * This method is handling the FlowPlayer Before Finesh event
   */
  onBeforeFinishPlay: function(fp, clip) {
	
	if ((SWPtmp.chapter_play_back == 'True' || SWPtmp.chapter_play_back == 1)) {
		
		var ch = this.findPlaying(),
			swpplayer = this.getPlayer(),
			flowPlayer = swpplayer.getFlowPlayer(),
			fullDuration = Math.round(flowPlayer.getClip().fullDuration),
			lastChapterMarkerCount = ch.get('hiddenChapters').length,
			hiddenChapters,endTimeofSelectedChapter;
		 	
			if( lastChapterMarkerCount > 0 ){
				
				 hiddenChapters = ch.get('hiddenChapters');
				 endTimeofSelectedChapter = hiddenChapters[hiddenChapters.length-1]['start'];
		         if(endTimeofSelectedChapter == fullDuration){
		        	 var buttonposition = hiddenChapters[0]['buttonposition'];
		        	 fp.up('swpplayer').playBackHiddenChapter(null,null,buttonposition);
	        		 var duration = Math.round(fp.getClip().fullDuration);			
	        		 fp.getPlayer().seek(duration);
		         }
		}
    }
  },
  /**
   * This is method handling the "Pley" functionality of play button in Player content.
   */
  playButton: function(swpplayr, flowplayer) {
    var currentPaly = this.findPlaying();

    var currentTime = Math.round(flowplayer.getTime());
    
    var fullDuration = Math.round(flowplayer.getClip().fullDuration);
    //201310280502
    if (currentPaly.get("lastChapter") && (currentTime == fullDuration)) {

      this.nextLesson();

    } else {

      swpplayr.chapterResumed = flowplayer.getTime();
      

      flowplayer.getPlugin("dock1").hide();
      swpplayr.hideReplayNextPlayButton();

      flowplayer.resume();
      // 20131610 refresh the chapters list icons on next play
      this.getChapters().refreshIcons(this.findPlaying(null, null, null, true));

    }
  },
  isScrollAllow: function(mainpanle, element) { //201311220420
    var panelRegion = mainpanle.getView().el.getRegion();
    var elementRegion = element.getRegion();
    var isAllowScroll = false;
    if (panelRegion && elementRegion) {
      if ((elementRegion.top <= panelRegion.top && elementRegion.bottom <= panelRegion.top) ||
        (elementRegion.top >= panelRegion.bottom && elementRegion.bottom >= panelRegion.bottom)) {
        isAllowScroll = true;
      }
    }
    return isAllowScroll;
  }
});
