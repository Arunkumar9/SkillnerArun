/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23039           Venkatesh Teja		201311061716	Handling openNewWinToDownload event which is fired from DownloadAttachment and DownloadAttachments file for downloading files in the new window.
 * 23362		   Arunkumar.muddada    201311151025    Modified : getData :
 * 															Here for the new message thread after showing newtopic window we are loading store.
 * 															As for the newtopic from comments gris we are not loading the store automatically  
 * 23362           Arunkumar.muddada	201311181025    Modified : getData :
 * 															 For comments grid modifications we are passing that variable  
 * 23362           Arunkumar.muddada	201311180916    Modified : getData :
 * 															 setting the global variables related to tabview to use this valible on tabchange event of tabView.
 * 23573           Tapaswini Sabat		201311191010	Earlier if one reply window was there then we are restricting to open another reply window.
 * 														Now we are chacking if in the current details window Reply window is not there then opening.
 * 
 * 23044   	       Venkatesh Teja		201311251620    Added code to get focus on parent window when clicking on seek icon from the message window.
 * 
 * 23362 		   Venkatesh Teja 		201311251756	Modified showMessagingWindow method for getting the record based on current selected thread.
 * 
 * 23779 		   Venkatesh Teja 		201311261710	Modifications done to solve the issue that task action container when opening "Request Files" option the newly created task detail is not in order.
 * 
 * 23806		   Venkatesh Teja		201311271840	Modifications done to avoid the infinite loop on clicking on "No".
 * 23362		   Tapaswini Sabat		201312021950	If the Instructor for a course is unassigned, then we are 
 * 														showing the correct alert message to the user.	
 * 23362 		  Dinesh.GK    			2013123450  	 If we click on make discussion icon in comments grid it showing tool bar for data list now.
 * 24006		   Arunkumar.muddada    201312041040     Modified :cancelReply :
 * 															if parent is not there then not required destroy
 * 26044           Arunkumar.muddada    201403030701    Modified : onRefreshPosts:
 * 															Added code to change the css class for the collapse-expand button and setting the tool tip
 * 27156		   Arunkumar.muddada	2014240317		Modified : showMessagingWindow:
 * 															For checking is there any messaging window newtopic or reply exists in the system if exists
 * 															Then give an alert to the user.
 * 														Added : prepareMessagingWindow :
 * 															This method will add new message window.
 * 27658		   Arunkumar.muddada	201405150547  Modified : createNewTopic
 * 														If the window opener is not there then it is standalone message window.
 * 														Since There is no player window , we are sending message to player window.
 * 														Just we will new topic
 * 27661       		Arunkumar.muddada   201405160848   Modified : openReference : Modified this method to support opening a player window if we are not able to find any player and after opening the player we need to play the referance data given.
 * 													   Added : dataPlayerFromMessage : This method is useful to send the message with "_videoplayerFromMessage" consumer key. So this message will be received by the player and it will send request to message window to get the required referance data.
 * 27661			Arunkumar.muddada   201405200614   Modified : openReference : Code for checking the window opener is failing to give any data then we are opening the new player window.
 * 27896            Arunkumar.muddada   201405281102    Modified : reply & newTopic : Code for checking if the role is instructor then one message and if the role is student then another message.
 * 27903            Arunkumar.muddada   201405291125    Modified : openReference : Removed code related to the setting the openers for the bouth the windows as it is closing the chile window when parent window is closed.
 * 27903            Arunkumar.muddada   201406230306    Modified : openReference : Code for checking player token for opinting to the new message window.
 * 														
 */
Ext.define('CHAT.controller.TrainingTools', {
    extend: 'Ext.app.Controller',
    /*views: ['SWP.lib.AwesomeUploader','CHAT.view.Reply','CHAT.view.Post','CHAT.view.BadgeButton','CHAT.view.BadgeTab',
            'CHAT.view.DataList','CHAT.view.DownloadAttachment','CHAT.view.DownloadAttachments','CHAT.view.FbarButton',
            'CHAT.view.FbarButton','CHAT.view.GroupingBtn','CHAT.view.GroupingComboBox','CHAT.view.GroupingList',
            'CHAT.view.ImageButton','CHAT.view.MessageDetails','CHAT.view.MessageWindow','CHAT.view.NewTopic',
            'CHAT.view.NewTopicWindow','CHAT.view.Paging','CHAT.view.QuotedText','CHAT.view.SearchField','CHAT.view.TabView',
            'CHAT.view.PostHeader', 'SWP.view.workfiles.UploadPopup', 'SWP.view.workfiles.WorkFiles'],
    stores: ['CHAT.store.Posts','CHAT.store.TaskActions','CHAT.store.TaskStatuss','CHAT.store.Reference',
             'CHAT.store.Messages','CHAT.store.ThreadCatogery','CHAT.store.User'],
	models: ['SWP.model.File','CHAT.model.Post','CHAT.model.TaskAction','CHAT.model.TaskStatus','CHAT.model.Reference',
	         'CHAT.model.ThreadCatogery','CHAT.model.Message','CHAT.model.User'],*/
//    requires : ['CHAT.lib.AwesomeUploader'],
	views : ['SWPCommon.view.workfiles.UploadPopup'],
	refs: [{
	
	    ref: 'messageWindow',
	
	    selector: 'messagewindow'
	
	}],
   stores: [
       
      'Posts','Reference',
             'Messages','ThreadCatogery','SWPCommon.store.TaskActions','SWPCommon.store.TaskStatuss'
  
    ],
    init:function(){
	/*	this.listen({
	        controller: {
	            '#CHAT.controller.TrainingTools': {        // '*' means any controller
						sendreference : this.sendReference,
						newtopic : this.newTopic,
						badegetabtext : this.badegetabText,
						loadtabdata : this.loadTabData,
						setthreadrecord : this.setThreadRecord,
						showmessagethread : this.showMessageThread,
						showmessagingwindow : this.showMessagingWindow,
						newthreadfromcommentsgrid : this.newThreadFromCommentsGrid
	            }
	        }
	    });*/
    	this.control({
//    		'messagedetails':{
//    			reply:this.reply,
//    			cancelreply : this.cancelReply
//    		},
    		'post' :{
    			actionchange : this.actionChange
    		},
    	'reply': {
//    		   reply				:	this.reply,
	           attachfile          	:   this.showReplyAttachFiles,
	    	   saveupload           :   this.saveReplyAttachments ,
	    	   savereply            :   this.saveReply,
	    	   cancelreply          :   this.cancelReply,
	    	   canceluploadedfiles  :   this.cancelAttachments,
	    	   deletefilehandler 	: 	this.deleteFromFile,
	    	   validatereply		:   this.validateReply
         	
          },
          'messagewindow': {
        	reply					:	this.reply,
          	closewindow 			: 	this.closeWindow,
          	newtopic 				: 	this.newTopic,
          	openreference			: 	this.openReference,
          	minimisewindow 			: 	this.minimiseWindow,
          	closemessage        	: 	this.closeMessage,
          	openmessage	        	: 	this.openMessage,
          	showmessagethread   	:   this.showMessageThread,
          	showmessagelist     	:   this.showMessageList,
          	previous            	:   this.previous,
          	next					:   this.next,
          	refreshposts 			:   this.onRefreshPosts,
          	reply					:	this.reply,
          	link					:	this.openReference,
          	downloadtrainingfiles	: 	this.downloadTrainingFiles,
          	restorewindow			:	this.restoreWindow,
          	resizewindow			:	this.resizeWindow,
          	updatereadpost			:	this.updateReadPost
          	
          },
          
          'viewport':{

  	    	increasebadgecount: this.increaseBadgecount,
  	    	
    	    resize: this.onViewportResize,
    	    
    	    beforerender : this.onViewportBeforeremove

          },  
          
          'newtopic': {
          	
             savenewtopic			:	this.saveNewTopic,
             cancelnewTopic		:	this.cancelnewTopic,
             attachfile          	:   this.showReplyAttachFiles,
//	    	   saveupload           :   this.saveReplyAttachments ,
//	    	   canceluploadedfiles  :   this.cancelAttachments,
//	    	   deletefilehandler 	: 	this.deleteFromFile
       	
//             attachfile			:	this.showAttachmentPanel,
        	   saveupload 			: 	this.saveAttachments,
        	   canceluploadedfiles	:	this.cancelAttachments,
        	   deletefilehandler 	: 	this.deleteFromFile
        	 
            },
            'downloadattachment' :{													//201311061716
            	openNewWinToDownload   : this.openNewWinToDownload
            },
            'downloadattachments' :{
            	openNewWinToDownload   : this.openNewWinToDownload
            }
    	});
		
		// for editors do not run any tasks
        if( !SWP.editorsLogin ){
        	 
             var polltask = new  Ext.util.DelayedTask();
             polltask.delay(1000,function(){
             	 Ext.TaskManager.start({
                  	run: this.polling,
                      args: [10],
                      interval: 3000,
                      scope: this
                  });
             },this);
        }
    },
    polling : function() {
		this.getData();
	},
	getData : function () {
                	    
    	              VideoRecordMgr.receiveMessage("tcp://localhost:61613",SWP.PID+'_'+SWP.Rrolename+'_trainingtools',function(r,t){
                              if( t.status ){
                                      if( !Ext.isEmpty( r) ){
                                               var msg = Ext.decode( unescape(r), true);
				if( msg && msg.eventName){
				     if(msg.eventName == "showmessagingwindow") {
				    	 //201311180916
				    	 var tabView = Ext.ComponentQuery.query('tabview');
				    	 if(msg.rows[0].showTasks){
				    		 tabView[0].showTask = true;
				    	 }
				    	 
				    	 if(msg.rows[0].isFromCommentsGrid) {
					    	 tabView[0].fromComment = true;
				    	 }
				    	 this.showMessagingWindow(msg.rows[0].thread_id,msg.rows[0].isFromCommentsGrid,msg.rows[0].showTasks);
				    	 
				      } else if(msg.eventName == "badegetabtext") {
					this.badegetabText(msg.rows[0].thread_type_id,msg.rows[0].thread_catogery_id,msg.rows[0].uid );
				      } else if(msg.eventName == "loadtabdata") {
					this.loadTabData();
				      } else if(msg.eventName == "newthreadfromcommentsgrid") {

						var tabView = Ext.ComponentQuery.query('tabview')[0];
						tabView.setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_ONE);
						var datalist = Ext.ComponentQuery.query('tabview datalist')[0];
						datalist.setActiveItem(0,true); //2013123450
						
						var CTSELECTED = {};
						
						//This will get the player related referance data from the given message , we should call this method only 
	
						//when we use "CTSELECTED" in the message we prepare from the host.
						CTSELECTED = this.getPlayerRefaranceData(msg);
						
						//msgpnl:[{"threadType":'+threadType+',"thisIsTask":'+thisIsTask+',"title":"'+title+'"}],
	
						thisIsTask			= msg.msgpnl[0].thisIsTask;
						typeofthread        = msg.msgpnl[0].threadType;
						messagePanelTitle	= msg.msgpnl[0].title;
	
						//commentsRecord:[{"comment":"'+commentsGridRecordComment+'","uid":'+commentsGridRecordUid+'}]
						commentsGridRecordComment = msg.commentsRecord[0].comment;      
	
						commentsGridRecordUID     = msg.commentsRecord[0].uid;
						
						//thisIsTask, typeofthread, commentsGridRecordComment ,commentsGridRecordUID , messagePanelTitle, selectedRecord
	
						this.sendReference( thisIsTask, typeofthread, commentsGridRecordComment ,commentsGridRecordUID , messagePanelTitle, CTSELECTED );
						
						// Here for the new message thread after showing newtopic window we are loading store.
						//As for the newtopic from comments gris we are not loading the store automatically
						//201311151025   201311181025
			    		var tab = Ext.ComponentQuery.query('tabview datalist');
			    		var tabView = Ext.ComponentQuery.query('tabview');
			    		tabView.isFromCommentsGrid = true;
			    		
			    		var tabStore = tab[INDEXCHANGE.TAB_INDEX_VALUE_ONE].getStore();
			    		tabStore.reload();
		    		
				      } else if(msg.eventName == "getreferenceformessagewindownewtopic") {
					

					var CTSELECTED = {};
					CTSELECTED = this.getPlayerRefaranceData(msg);
					

					//msgpnl:[{"threadType":'+threadType+',"thisIsTask":'+thisIsTask+',"title":"'+title+'"}],
					thisIsTask			= msg.msgpnl[0].thisIsTask;
					typeofthread        = msg.msgpnl[0].threadType;

					messagePanelTitle	= msg.msgpnl[0].title;
					
					//thisIsTask, typeofthread, commentsGridRecordComment ,commentsGridRecordUID , messagePanelTitle, selectedRecord

					this.sendReference(thisIsTask, typeofthread, null ,null , messagePanelTitle, CTSELECTED );
				      }
				}
                                     }                                                    
                          }
             },this);
    },
	dataSend : function( data ) {
	    data = escape(data);
		VideoRecordMgr.sendMessage(data,"tcp://localhost:61613",SWP.PID+'_'+SWP.Rrolename+'_videoplayer');
	},
	
	//201311061716
	openNewWinToDownload : function(url){
		window.open(url,'DownloadAttachments', 'width='+1300,'height='+650);
	},
	
	getPlayerRefaranceData : function(msg) {
		var CTSELECTED = {};
		//CTSELECTED:[{"LESSON":"'+CTSELECTED.LESSON+'","LESSON_ID":'+ CTSELECTED.LESSON_ID +',
		//"CHAPTER_ID":'+CTSELECTED.CHAPTER_ID+',"CHAPTER_NAME":"'+CTSELECTED.CHAPTER_NAME+'",
		//"TIME_MINUTES":"'+CTSELECTED.TIME_MINUTES+'","QUESTION":"'+CTSELECTED.QUESTION+'",
		//"QUESTION_ID":"'+CTSELECTED.QUESTION_ID+'","LINK":"'+CTSELECTED.LINK+'","CHAPTERNAME":"'+CTSELECTED.CHAPTERNAME+'",
		//"SEEKTIME":"'+CTSELECTED.SEEKTIME+'"}]
		    if(msg.CTSELECTED[0].LESSON != 'undefined' ) {
				CTSELECTED.LESSON 			= msg.CTSELECTED[0].LESSON;
			}
			if(msg.CTSELECTED[0].LESSON_ID != 'undefined' ) {
				CTSELECTED.LESSON_ID  		= msg.CTSELECTED[0].LESSON_ID; 
			}	
			
			if(msg.CTSELECTED[0].CHAPTER_ID != 'undefined' ) {
				CTSELECTED.CHAPTER_ID 		= msg.CTSELECTED[0].CHAPTER_ID; 
			}	
			
			if(msg.CTSELECTED[0].CHAPTER_NAME != 'undefined' ) {
				CTSELECTED.CHAPTER_NAME		= msg.CTSELECTED[0].CHAPTER_NAME; 
			}	
			
			if(msg.CTSELECTED[0].TIME_MINUTES != 'undefined' ) {
				CTSELECTED.TIME_MINUTES		= msg.CTSELECTED[0].TIME_MINUTES;
			}	
			
			if(msg.CTSELECTED[0].QUESTION != 'undefined' ) {
				CTSELECTED.QUESTION			= msg.CTSELECTED[0].QUESTION; 
			}	
			
			if(msg.CTSELECTED[0].QUESTION_ID != 'undefined' ) {
				CTSELECTED.QUESTION_ID		= msg.CTSELECTED[0].QUESTION_ID;
			}	
			
			if(msg.CTSELECTED[0].LINK != 'undefined' ) {
				CTSELECTED.LINK				= msg.CTSELECTED[0].LINK;
			}	
			
			if(msg.CTSELECTED[0].CHAPTERNAME != 'undefined' ) {
				CTSELECTED.CHAPTERNAME		= msg.CTSELECTED[0].CHAPTERNAME;
			}	
			
			if(msg.CTSELECTED[0].SEEKTIME != 'undefined' ) {
				CTSELECTED.SEEKTIME			= msg.CTSELECTED[0].SEEKTIME; 
			}	
						
		return CTSELECTED;
	},
    /**
	 * 
	 *	By clicking on the reply button of a thread post, it will open a textarea for
	 *	reply
	 *
	 */    
	reply : function( post,msgpnl,btn,quotemsg ) {
		var me = this;
		if(! SWP.instructorAvaiableForCurrentDate ){
				//201405281102
				//Code for checking if the role is instructor then one message and if the role is student then another message.
				var confirmation = "";
		    	var text = "";
				if(SWP.Rroleid == 24){
		    	     text = INSTURCTOR.INSTRUCTOR_NOT_AVAILBLE;
		    	     confirmation = INSTURCTOR.INSTRUCTOR_NOT_AVAILBLE_CONFIRM;
		    	} else {
		    		 text = STUDENT.STUDENT_NOT_AVAILBLE;
		    	     confirmation = STUDENT.STUDENT_NOT_AVAILBLE_CONFIRM;
		    	}
				Ext.Msg.confirm( confirmation,text,function(btn,text) {
					if ( btn == 'yes' ) {
						me.replyToThread( post,msgpnl,btn,quotemsg );
				    }
				});
		} else {
			   me.replyToThread( post,msgpnl,btn,quotemsg );
		}
	},
	replyToThread : function ( post,msgpnl,btn,quotemsg ){
		var quotedText;
		var reply;
    	var msgDetails = Ext.ComponentQuery.query('messagedetails');
    	var taskActionStore =  Ext.data.StoreManager.lookup('SWPCommon.store.TaskActions');
    	actionRecord = taskActionStore.queryBy( function( item ) {
    		
			 return item.get('ID') == post.record.get( 'taskaction' );
			 
		 });
		
		reply = Ext.ComponentQuery.query( 'reply' );
		
		//201311191010 
		// Here if one reply window is already exist then we are checking whether the reply window exist in the 
		// activated tab details window, if not then we are opening a new reply window.
		
		if( reply.length == 1 ){
			var existingReply = reply[0].up('datalist').title;
			var currentReply = Ext.ComponentQuery.query(' tabview')[0].getActiveTab().title;
			if ( existingReply != currentReply ){
				var replyWindowOpen = true;
			}
		}
		
		if( reply.length == 0 || replyWindowOpen ) {
			var replyBody = ''
			var replySubject = REPLY.SUBJECT_REPLY + post.record.get('subject');
			
			
			quotedText = Ext.widget('reply',{
									reply:true,
									subjectValue:replySubject,
									bodyValue:replyBody,
									quoted_post_id:post.record.get('uid'),
									thread_id:post.record.get('thread_id'),
									adminVersion: post.adminVersion, 
									post : post
									});
			/*
			 * Here If the quiz has been completed successfully (i.e. student passed the quiz) 
			 * then the instructor shall not be able to mark a completed task related to that quiz as incomplete.
			 */
			var quizCompletion = post.record.get( 'quizCompleted' );
			if( quizCompletion ){
				quotedText.down('combobox[name=actioncombo]').setDisabled( true );
			}
			msgpnl.insert((post.positionIndex +2 ),{xtype:'container',items:quotedText});
			
			reply = Ext.ComponentQuery.query( 'reply' )[0];
			if (Ext.isIE){
				
				msg_details = Ext.ComponentQuery.query( 'messagedetails' );
				msg_details[msg_details.length-1].setBodyStyle('overflow-x','hidden');
			}
			var content = reply.getForm().findField('content');
			content.focus();
			reply.getDockedItems()[0].down('button').focus();
		}
		
	},
    
	/**
	 * 
	 * @public
	 * Shows upload pop up window on clicking attachments button in newtopic window and reply panel	
	 * 
	 */
	
	showReplyAttachFiles : function( reply ) {
		
	   	var PATH = 'tmp/'+reply.instanceId+'/';
	   	
	   	var view = Ext.create('SWPCommon.view.workfiles.UploadPopup',{
	   		uploadPath:PATH,
		            autoUpload:false,
		            optionalZip:true,
		            ref:reply,
		            isfromamazon : SWP.isFromAmazon
	   	});
	   	
	   	view.show();
	   	reply.doLayout();
	},
	
	/**
	 * @public
	 * 
	 * 	On save button click in upload popup window, this function gets called. Creates zip if zip
	 * 	Name specified else, creates individual files.
	 */
	
	saveReplyAttachments :function( uploadpnl,unique,pkgname,uploader,store,zipped ) {
		
		   var files = [];
		   
		   if( zipped ) {
			   
			   if( !Ext.isEmpty( pkgname ) && !Ext.isEmpty( unique )) {
				   CollaborationToolMgr.compressZip({'PATH':uploader.uploadPath+unique ,'zipname':pkgname,'destination':uploader.uploadPath,'deleteFile':true},function(res,temp){
					   if (res){
						   CollaborationToolMgr.zipPackage({'PATH':uploader.uploadPath+unique ,'zipname':pkgname,'destination':uploader.uploadPath},function(r,t){
							   if (r){
								   if(r == true){
							    	   //When this operation is not allowed the fileupload to s3 
							    	   //Then we are sending just true at that situation just need to
							    	   //Append the ziped content path
							    	   r = res;
							       }
								   store.filter([{
										filterFn: function(item) {
									  	return ( item.get("status") == 'Done' );
										}
									}]); 
								   
								    
								 //If the files are successfully uploaded then only add to the upload Panel
								   
								   var size = 0;
								   
								   for( var i=0; i<store.data.length; i++ ) {
									   
									   size += store.data.items[i].data.size;
								   }
								   
									   if( store.data.length > 0 ) {
										   
										   files[0]={
											   data:{
											   'name':pkgname+'.zip',
											   'PATH':uploader.uploadPath,
											   'size' : size,
											   'objecturl' : r
											   }
										   };
										}
									   var reply = Ext.ComponentQuery.query('reply')[0];
										reply.addAttachments( files ,uploader.uploadPath, unique ); 
										var uploadPathindex = Ext.Array.indexOf(reply.replyattachments, uploader.uploadPath);
									    if(uploadPathindex == -1){											    	
									    	reply.replyattachments.push(uploader.uploadPath);
									    }
										uploadpnl.setLoading(false);
										uploadpnl.close();
							   }else {
								    uploadpnl.setLoading(false);
									uploadpnl.close();
							   }
						   },this);
					   }
				   },this);
			   }else{
				   uploadpnl.setLoading(false);
				   uploadpnl.close();
			   }   
		   } else {
			   
			   // Backend request to copy the files from the awesomeuploder folder insteance and paste it in reply folder instance
			   // and delete the awesome uploader file instance.
			   
			   CollaborationToolMgr.RecursiveCopy( uploader.uploadPath+unique, uploader.uploadPath,function( r,t ) {
				
				   if( t.status ) {
					   
					   var changes = r.changes;
					   
					   store.filter([{
						   
							filterFn: function( item ) {
								
						   		Ext.each( changes,function( change,index ) {
						   			
						   			//If the file is renamed in the file structure, due to duplicacy then it will rename in store as well
						   			if( item.get('name') == change.old ) {
						   				
						   				if (SWP.isFromAmazon){
						   					
						   					item.set('objecturl',change.objectUrl );
						   					if( item.get('name') != change.newname ){
						   						item.set('name',change.newname );
						   					}
						   				} else {
						   					
						   					item.set('name',change.newname );
						   				}
						   			}
						   			
						   		},this);
								
						   		return ( item.get("status") == 'Done' );
							},
							scope:this
						}]);
					   files = store.data.items;
					   var reply = Ext.ComponentQuery.query('reply')[0];
					   reply.addAttachments( files ,uploader.uploadPath, unique ); 
					   var uploadPathindex = Ext.Array.indexOf(reply.replyattachments, uploader.uploadPath);
					    if(uploadPathindex == -1){											    	
					    	reply.replyattachments.push(uploader.uploadPath);
					    }
					   
					   uploadpnl.setLoading(false);
					   uploadpnl.close();
				   }
			   });
			   
			   files = store.data.items;
			   return;
			   
		   }
		   
//		var reply = Ext.ComponentQuery.query('reply')[0];
//		reply.addAttachments( files ,uploader.uploadPath, unique ); 
//		
//		reply.replyattachments.push(uploader.uploadPath);
//		
//		uploadpnl.setLoading(false);
//		uploadpnl.close();
	},
	
	/**
	 *	On send button in reply panel, this function gets executed.
	 *	Saves the reply entered by user.
	 * 
	 * 	@param	reply:	Reply component 
	 */
	
	saveReply : function( reply ) {

		
		var msgDetails = Ext.ComponentQuery.query('messagedetails');
		msgDetails = msgDetails[msgDetails.length - 1 ].isTaskDetails;
		var threadtype_id = 1;
		var taskAction = null;
		if( msgDetails ) {
			threadtype_id = 3;
			if( reply.replyAction == null ){
			
				taskAction = reply.post.record.get('taskaction');
				
			} else { 
			
			taskAction = reply.replyAction;
			
			}
			
		} else {
			
			taskAction = null;
		}
		   var form = reply.getForm();
		   var attachmentsPnl = Ext.getCmp(reply.getId()+'-attachedfiles');
		   var attachments = attachmentsPnl.data;
		   var content = form.findField('content').contentValue;
		   if( content ){
			   
			   content = content.replace(/\u200b/gi,"");
		   }
		   var subject = form.findField('subject').getValue();
   	   	   subject = subject.replace(/\u200b/gi,"");
   	   	   /*
   	   	    *Here we are identify the reopen of task.
   	   	    *if previous task status is closed (99) and 
   	   	    *now update task status( 2,3 ) less then the closed status.
   	   	    */
   	   	   var isReopenPost = false;
	   	   if( (taskAction != null) && (reply.post.record.get('taskaction') == '99') && (taskAction < '99') ){
 	   		   isReopenPost = true;
 	   	   }

	   	   var isPostClosing = false;
	   	   if( (taskAction != null) && (reply.post.record.get('taskaction') < '99') && (taskAction == '99') ){
	   		   isPostClosing = true;
	   	   }

	   	   var post = new CHAT.model.Post({
			   
				subject   	 	: subject,
				content   	 	: content,
				attachments  	: attachments,
				quoted_post_id	: form.findField('quoted_post_id').getValue(),
				thread_id		: form.findField('thread_id').getValue(),
				action 			: taskAction,
				threadtypeId    : threadtype_id,
				//201312021950
				old_instructorId: SWP.oldInstructorId
			}
	   	   );
	   	   var msgDetails = Ext.ComponentQuery.query( 'messagedetails' );
	   	   var loadMask = new Ext.LoadMask(msgDetails[0].container.dom.parentNode, {msg:"Loading..."});
	   	   var operation = Ext.data.Operation({
				action : 'create',
				params : post,
				scope : this,
				callback:function( record, operation, success ) {
					if(record.operations[0].response.result){
						var response = record.operations[0].response.result;
						var hasAttachment = false;
						if(!Ext.isEmpty(attachments)){
							hasAttachment = true;
						}
						
						if ( record.operations[0].success ){
						   CollaborationToolMgr.createThreadPostAttachment({'postuid':response['postuid'] ,'created':response['created'],'thread_uid':response['thread_uid'],'hasAttachment':hasAttachment,'attachments':attachments},function(){
							   loadMask.hide();
								var data = msgDetails[(msgDetails.length)-1].store.load( {params:{'thread_id': post.data.thread_id}} );
								msgDetails[(msgDetails.length)-1].setReplyAdded( true );
								msgDetails[(msgDetails.length)-1].store.on('load',function(s,r){
										if( ( r.length == s.data.length ) && ( r[0].get('threadtypeId') == TABS.THREAD_TYPE_THREE ) ){
											var threadRecord = Ext.ComponentQuery.query('tabview datalist')[1].store.findRecord('uid',post.data.thread_id);
						                    var string = '{success:true, eventName:"refreshstatusicons",rows:[{"status":"'+r[0].get('status')+'","fromNewtopic":'+ false +',"fromSavepost":'+true+',"recVideoId":'+threadRecord.get( 'reference' ).video_id+',"recQustionId":'+threadRecord.get( 'reference' ).question_id+',"threadId":'+post.data.thread_id+' ,"recStatus":'+threadRecord.get('status')+',"isReopenPost" :'+isReopenPost+',"isPostClosing" :'+isPostClosing+'}]}'; 
											this.dataSend(string);
											isReopenPost = false;
											isPostClosing = false;
										}
								},this);
						   },this);
						}
					}
				}
	   	    });
		   	
	   	    msgDetails[msgDetails.length - 1 ].getStore().insert( 0, post );
	   	    msgDetails[msgDetails.length - 1 ].getStore().sync(operation);
		   
			var parent = reply.up(  'container' );
			parent.remove( reply );
			
			loadMask.show();
	},
	   
	   /**
	    * 	@public
	    * 
	    * 	handle the cancel of reply
	    * 
	    * 	@param	reply	Reply component
	    * 	@param	button	Cancel button
	    * 	@param	msgdtlPan	Message detail panel
	    * 
	    */
	   cancelReply : function( reply,button,msgdtlPan,obj ) {  
		   
		   if( !msgdtlPan ) {
			   
			   this.checkEmptySpaces(reply);
		   }
		   
		   if( button ) {
			   
			   reply.selButton=button.iconCls;
		   }
		   
		   //If the Reply panel have some modification,then before cancelling the operation, It will ask for a Conform box.
		  
		   if( reply.getForm().isDirty() || 
				   ( reply.noOfAttachments > 0 && reply.replyattachments.length > 0 ) ) {

			   Ext.Msg.confirm({title:MESSAGE.CLASSROOM_CANCEL_TITLE,
				   msg:MESSAGE.CLASSROOM_CANCEL_MSG,
				   buttons: Ext.Msg.YESNO,
				   icon: Ext.Msg.QUESTION,
				   scope: this,
				   fn:function( btn ) {
					   
					   //
					   //If the user clicks on Yes then, the corresponding clicked action will happen, otherwise it will simply display the form
					   //
					   if ( btn === 'yes' ) {

						   if( msgdtlPan ){
							   
							   msgdtlPan.confirmMessage = true;
						   }

						   if( reply.selButton == 'previous' ) {

							   this.previous( button,msgdtlPan );

						   }else if( reply.selButton == 'next' ) {

							   this.next(button,msgdtlPan);

						   }else if( reply.selButton == 'refresh' ) {

							   this.onRefreshPosts(button,msgdtlPan);

						   }else if( reply.selButton == 'messagelist' ) {

							   this.showMessageList(button,msgdtlPan,obj);
						   }

						   //
						   // If any attachments are their for the Post
						   // then all the attachments will get deleted from the file structure,before canceling the reply. 
						   //
						   
						   if ( reply.replyattachments.length > 0 ){

							   CollaborationToolMgr.recursiveRemoveDir( reply.replyattachments );
							   
							   reply.noOfAttachments = 0;
						   }
						   
						   var parent = reply.up('container');
						   //201312041040
						   if(parent) {
							   parent.destroy();
						   }
					   }
				   }
			   });

		   }else {
			   
				   var parent = reply.up('container');
				   //201312041040
				   if(parent) { 
					   parent.destroy();
				   }
		   }
	},
	
	   /**
	    * 
	    *  This function is executed while cancel the attachments.
	    * 
	    */
	   
	   cancelAttachments:function( pnl,uniqueid ) {
		   
		   var awesomeUploader = pnl.down('awesomeuploader');
		   
		   if( awesomeUploader.winModified == true ) {
			   
			   Ext.Msg.confirm({
				   		 title:MESSAGE.CLASSROOM_CANCEL_TITLE,
					     msg:MESSAGE.CLASSROOM_CANCEL_MSG,
					     buttons: Ext.Msg.YESNO,
					     icon: Ext.Msg.QUESTION,
					     fn:function( btn ) {
					    	 
					    	 if ( btn === 'yes' ) {
					    		 
					    		 // If user tries to cancel the upload operation, then uploaded files also need to be deleted from the file structure.
					    		 CollaborationToolMgr.recursiveRemoveDir( [pnl.uploadPath+pnl.uniqueid] );
					    		 pnl.close();
					    	 }
					     }
				});
			   
		   }else {
			   
			   pnl.close();
		   }
	   },
	   
	   deleteFromFile : function( UploadGrid,UploadData, uniqueId,filename,instanceId,lessonname,QuestionName ){
			
			if( UploadData.get('status') == 'Done' || UploadData.get('status') == 'Error' ){
				var filepath = 'tmp/'+instanceId + '/' +uniqueId+'/'+filename;
				CollaborationToolMgr.removeFile( filepath );
			}
		},
	   
	   /**
		* 	It check the emply spaces in a form fields.
		*/
	   
		checkEmptySpaces:function( reply ) {
			
			   	var content = reply.getForm().findField('content');
			   	content = content.getValue(); 
			   	content = content.replace(/&nbsp;/gi,"");
			   	content = content.replace(/<br>/gi,"");
			   	content = Ext.String.trim(content);
		       
			   	if ( content == '' ) {
			   		
		        	reply.getForm().findField('content').setValue(""); 
		        }
			   	
		        var attachments=Ext.getCmp(reply.getId()+'-attachedfiles');
		        
	    		reply.noOfAttachments = attachments.items.length;
		},
		 actionChange : function( post,actionId ){
			   
			   var quotedText;
			   var reply;
			   //201311261710
			   var msgDetails = post.up('messagedetails');
			   var taskActionStore =  Ext.data.StoreManager.lookup('SWPCommon.store.TaskActions');
		    	actionRecord = taskActionStore.queryBy( function( item ) {
		    		
					 return item.get('ID') == post.record.get( 'taskaction' );
					 
				 });
		    	
			   reply = Ext.ComponentQuery.query( 'reply' );
			   if( reply.length == 1 ){
					var existingReply = reply[0].up('datalist').title;
					var currentReply = Ext.ComponentQuery.query(' tabview')[0].getActiveTab().title;
					if ( existingReply != currentReply ){
						var replyWindowOpen = true;
					}
				}
				
						if( reply.length == 0 || replyWindowOpen ) {

							var replySubject = post.msg;
							var replyBody = post.replybody;
							
							quotedText = Ext.widget('reply',{reply:true,subjectValue:replySubject,bodyValue:replyBody,quoted_post_id:post.record.get('uid'),thread_id:post.record.get('thread_id'),
								replyAction : actionId,
								adminVersion : post.adminVersion,
								post:post
								});
							var messageDetailsID = msgDetails.id+'posts';
							var messagePanel = Ext.getCmp(messageDetailsID);
							messagePanel.insert((post.positionIndex + 2 ),{xtype:'container',items:[quotedText]});
							replys = Ext.ComponentQuery.query( 'reply' );
							reply = replys[replys.length - 1 ];
							
							if (Ext.isIE){
					
								msgDetails = Ext.ComponentQuery.query( 'messagedetails' );
								msgDetails[msgDetails.length-1].setBodyStyle('overflow-x','hidden');
							}
								var content = reply.getForm().findField('content');
								content.focus();
								reply.getDockedItems()[0].down('button').focus();
						}
			   
		   },

	   newTopic : function( msgpnl, typeofthread, rec, iconClicked ) {
		//This method is called from the exttools=>view=>DataList.js=> headerButtons.push  handler 
		// In the messaging window we have message tab and task tab for these tabs we have new button 
		//when user clicks on this button this event will execute.	
		   var me = this;
		   //201311271840
		   var window = Ext.ComponentQuery.query('datalist')[0].container.dom.parentNode;
		   var loadMask = new Ext.LoadMask(window, {msg:"Please wait..."});
			
		   if(! SWP.instructorAvaiableForCurrentDate ){		
			   //201405281102
			    var confirmation = "";
		    	var text = "";
				if(SWP.Rroleid == 24){
		    	     text = INSTURCTOR.INSTRUCTOR_NOT_AVAILBLE;
		    	     confirmation = INSTURCTOR.INSTRUCTOR_NOT_AVAILBLE_CONFIRM;
		    	} else {
		    		 text = STUDENT.STUDENT_NOT_AVAILBLE;
		    	     confirmation = STUDENT.STUDENT_NOT_AVAILBLE_CONFIRM;
		    	}
				Ext.Msg.confirm( confirmation ,text,function(btn,text) {
					if ( btn == 'yes' ) {
						me.createNewTopic(msgpnl, typeofthread, rec, iconClicked);
				    }else{
				    	//201311271840
				    	loadMask.hide();
				    	
				    	var msgId = Ext.ComponentQuery.query('datalist')[0].id;
						var taskId = Ext.ComponentQuery.query('datalist')[1].id;
						Ext.getCmp(msgId+'add-item').setDisabled(false);
						Ext.getCmp(taskId+'add-item').setDisabled(false);
				    	
				    }
				});
		   } else {
			   me.createNewTopic(msgpnl, typeofthread, rec, iconClicked);
		   }
		    //Masking the window to restriuct user to change the tab (Message, task) when on the tab new topic button is clicked.
			//refs #22607
			loadMask.show();
		},
		createNewTopic : function( msgpnl, typeofthread, rec, iconClicked ){
			var threadType = 1;
			threadType = msgpnl.threadType;
			if(! threadType) {
				threadType = 1;
			}
			
			var thisIsTask = msgpnl.thisIsTask;
			var title      = msgpnl.title;
			//If the window opener is not there then it is standalone message window.
			//Since There is no player window , we are sending message to player window.
			//Just we will new topic
			//201405150547
			
			if (!SWP.playerWin || SWP.playerWin.closed) {
				var noPlayerWin = false;
				try{
	    	    	var parentWin = window.opener;
	    	    	if(parentWin && parentWin.name == "playerWindow"){
	    	    		var string = '{success:true, eventName:"getreferenceformessagewindownewtopic",iconClicked:'+iconClicked+',msgpnl:[{"threadType":'+threadType+',"thisIsTask":'+thisIsTask+',"title":"'+title+'"}]}';
	    				this.dataSend(string);
	    				SWP.playerWin = parentWin;
	        		} else {
	        			noPlayerWin = true;
	        		}
	    	    } catch (e) {
	    	    	noPlayerWin = true;
				}
	    	    
				if(noPlayerWin){				
					var CTSELECTED ={};
					CTSELECTED.LESSON_ID = null;
					CTSELECTED.CHAPTER_ID = null;
					CTSELECTED.QUESTION_ID = null;
					var string = '{success:true, eventName:"getreferenceformessagewindownewtopic",CTSELECTED:[{"LESSON":"' +
					(Ext.isEmpty(CTSELECTED.LESSON) ? '' : CTSELECTED.LESSON) + '","LESSON_ID":"' + (Ext.isEmpty(CTSELECTED.LESSON_ID) ? '' : CTSELECTED.LESSON_ID) +
					'","CHAPTER_ID":' + (Ext.isEmpty(CTSELECTED.CHAPTER_ID) ? 0 : CTSELECTED.CHAPTER_ID) + ',"CHAPTER_NAME":"' + (Ext.isEmpty(CTSELECTED.CHAPTER_NAME) ? '' : CTSELECTED.CHAPTER_NAME) +
					'","TIME_MINUTES":"' + (Ext.isEmpty(CTSELECTED.TIME_MINUTES) ? '' : CTSELECTED.TIME_MINUTES) + '","QUESTION":' +
					(Ext.isEmpty(CTSELECTED.QUESTION) ? -1 : CTSELECTED.QUESTION) + ',"QUESTION_ID":' + (Ext.isEmpty(CTSELECTED.QUESTION_ID) ? -1 : CTSELECTED.QUESTION_ID) +
					',"LINK":"' + (Ext.isEmpty(CTSELECTED.LINK) ? '' : CTSELECTED.LINK) + '","CHAPTERNAME":"' + (Ext.isEmpty(CTSELECTED.CHAPTERNAME) ? '' : CTSELECTED.CHAPTERNAME) +
					'","SEEKTIME":' + (Ext.isEmpty(CTSELECTED.SEEKTIME) ? -1 : CTSELECTED.SEEKTIME) + '}],msgpnl:[{"threadType":' + threadType + ',"thisIsTask":' + thisIsTask + ',"title":"' + title + '"}]}';
					
					var data = escape(string);
					
					VideoRecordMgr.sendMessage(data, "tcp://localhost:61613", SWP.PID + '_' + SWP.Rrolename + '_trainingtools');
				}
                
			} else {
				var string = '{success:true, eventName:"getreferenceformessagewindownewtopic",iconClicked:'+iconClicked+',msgpnl:[{"threadType":'+threadType+',"thisIsTask":'+thisIsTask+',"title":"'+title+'"}]}';
				this.dataSend(string);
			}
		},
		/**
		 * If a thread is associated with any reference (Lesson/Quiz) then clicking
		 * on the button that reference will be opened.
		 * 
		 */	
	   
	    openReference :  function( pnl,record,item,index,event,eopts ) {
	    	//201405160848
	    	//Modified this method to support opening a player window if we are not able to find any player 
	    	//and after opening the player we need to play the referance data given.
    		var url = me.location.search;
    	    var token = url.split('&')[1];
    	    var isnewPLayer = false;
    	    if (!SWP.playerWin || SWP.playerWin.closed ) {
    	    	var playerWindow = window.open('', 'playerWindow','resizable=1');
        	    if(playerWindow.location.search == ""){
        	    	playerWindow = window.open('/?page=admin.Player&' + token, "playerWindow",'resizable=1');
        			window.name = 'messageinstructorfromMsg';
        			//window.opener= playerWindow;
        			//playerWindow.opener = window;
        	    } else {
        	    	var playerURL = playerWindow.location.search;
        	    	if(playerURL){
        	    		var playerToken = playerURL.split('&')[1];
	    	    		if(playerToken == token){
	    	    			playerWindow.focus();
	    	    		} else {
	    	    			playerWindow = window.open('/?page=admin.Player&' + token, "playerWindow",'resizable=1');
	    	    		}
        	    	}else{
        	    		playerWindow.focus();
        	    	}
        	    }
        	    SWP.playerWin = playerWindow;
        	    playerWindow.focus();
    	    }else{
    	    	//201406230306
    	    	var playerURL = SWP.playerWin.location.search;
    	    	if(playerURL){
    	    		var playerToken = playerURL.split('&')[1];
    	    		if(playerToken == token){
    	    			SWP.playerWin.focus();
    	    		}else {
    	    			 SWP.playerWin = window.open('/?page=admin.Player&' + token, "playerWindow",'resizable=1');
    	    		}
    	    	}
    	    }
    	    
    		var string = '{success:true, eventName:"openreference",reference:[{"chapter_id": '+record.chapter_id+',"chaptername":"'+record.chaptername+'","content_id":"'+record.content_id+'", "language" : '+record.language+', "name" : "'+record.name+'", "position" : "'+record.position+'", "product_id" : "'+record.product_id+'", "question_id" : '+record.question_id+', "subject" : "'+record.subject+'", "timestamp" : "'+record.timestamp+'", "uid" : "'+record.uid+'", "user_id" : "'+record.user_id+'","subject":"'+record.subject+'","video_id" : "'+record.video_id+'" }]}';
    		this.dataSend(string);
    		
    		var playerFromMessa = '{success:true, eventName:"playerFromMessage",reference:[{"chapter_id": '+record.chapter_id+',"chaptername":"'+record.chaptername+'","content_id":"'+record.content_id+'", "language" : '+record.language+', "name" : "'+record.name+'", "position" : "'+record.position+'", "product_id" : "'+record.product_id+'", "question_id" : '+record.question_id+', "subject" : "'+record.subject+'", "timestamp" : "'+record.timestamp+'", "uid" : "'+record.uid+'", "user_id" : "'+record.user_id+'","subject":"'+record.subject+'","video_id" : "'+record.video_id+'" }]}';
    		this.dataPlayerFromMessage(playerFromMessa);
	    		
		},
		/**
		 * This method is useful to send the message with "_videoplayerFromMessage" consumer key.
		 * So this message will be received by the player and it will send request to message window 
		 * to get the required referance data. 
		 * 201405160848
		 */
		dataPlayerFromMessage : function( data ) {
		    data = escape(data);
			VideoRecordMgr.sendMessage(data,"tcp://localhost:61613",SWP.PID+'_'+SWP.Rrolename+'_videoplayerFromMessage');
		},
		
		updateWindow : function ( msgpnlTitle, commentsGridRecordUID, topicview ) {
			
			if( msgpnlTitle == TABVIEW.MESSAGES_TITLE || commentsGridRecordUID ) {
				
				topicview.setTitle( NEWTOPIC.MESSAGES_TITLE );
				
			}else {
				
				topicview.setTitle(NEWTOPIC.TASKS_TITLE)
			}
			
			topicview.show();
			//Hiding Mask of the window to enable user to change the tab (Message, task) when message window is opened.
			//refs #22607
			var window = Ext.ComponentQuery.query('datalist')[0].container.dom.parentNode;
			var loadMask = new Ext.LoadMask(window, {msg:"Please wait..."});
			loadMask.hide();
			
			tinymceeditor = topicview.down('tinymce_textarea');
			
			tinymceeditor.on ( 'editorinitialize', function() {
				
				var fieldsetHeight  = topicview.down('fieldset').getHeight();
				fieldsetHeight = fieldsetHeight + 10 +40 + 68; 
				tinymceeditor.fireEvent('resize',tinymceeditor,topicview.getWidth()-15,topicview.getHeight() - fieldsetHeight,undefined,undefined,undefined,false);
			
			},this);
		},
		
		/**
		 * 	Saves the new topic and gets fired when user clicks on send button from new topic window.
		 * 
		 */
	   saveNewTopic: function( newtopic ) {
		   var reference = {};
		   var form = newtopic.getForm();
		   var attachmentsPnl = Ext.getCmp(newtopic.getId()+'-attachedfiles');
		   var attachments = attachmentsPnl.data;
		   var combo = null;
		   //It checks whether remove reference checkbox is checked or not
		   
		   var removeReference = form.findField('referenceremove').checked;
	   
		   /**
		    * If the saving thread is of type task then the object should contain the lesson or
		    * the quiz question selected from the reference combo not the current state of the 
		    * video player.
		    * 
		    */
		   if( newtopic.thisIsTask ) {
			   /*
			    *selectedComboValue contain combo value selected from dropdown list
			    *comboValue contain modified combo value(like combo value is changed after selecting from list)
			    *
			    */ 
			    var combo = Ext.ComponentQuery.query('newtopic groupingcombobox')[0];
			    
				if( combo.valueModels && (combo.valueModels).length > 0 ) {
			   		combo = combo.valueModels[0];
		   
					   if( combo.get('id')== combo.get('groupId') ){
						   
						   reference['lesson'] = combo.get('name');
						   reference['chapter'] = 0;
						   reference['seek'] = 0;
						   reference['quiz'] = null;
						   reference['video_id'] = combo.get('id');
						   reference['ordering'] = combo.get('ordering');
						   
					   }else{
						   
						   reference['lesson'] = combo.get('groupName');
						   reference['chaptername'] = combo.get('name');
						   reference['chapter'] = null;
						   reference['seek'] = 0;
						   reference['quiz'] = combo.get('id');
						   reference['video_id'] = combo.get('groupId');
						   reference['ordering'] = combo.get('ordering');
					   }
				   
					 } else {
						 
				 	 /**
					  * If user is clicking on send without selecting a value from reference combo then the alert will be shown.
					  */
					 
						 Ext.Msg.confirm({title: MESSAGE.NEWTOPIC_VALIDATE_TITLE,
						     msg: MESSAGE.NEWTOPIC_VALIDATE_REFERENCE,
						     buttons: Ext.Msg.OK,
						     icon: Ext.Msg.WARNING
			        	 });
						 newtopic.setLoading(false);
						 return;
					 }
				   
		   		}else if( !removeReference ) {
				   
				   reference['chapter'] = form.findField('chapter').originalValue;
				   
				   if( form.findField('link').getValue() ) {

					   reference['lesson'] = form.findField('lesson').getValue();
					   reference['chaptername'] = form.findField('chaptername').getValue();
					   reference['chapter'] = form.findField('chapter').getValue();
				   }
				   
				   reference['quiz'] = form.findField('quiz').getValue();
				   reference['seek'] = form.findField('seek').getValue();
				   reference['video_id'] = form.findField('video_id').originalValue;
			   }
		   	   var subject = form.findField('subject').getValue();
		   	   subject = subject.replace(/\u200b/gi,"");
		   	   var content = form.findField('content').contentValue;
			   if( content ){
				   
				   content = content.replace(/\u200b/gi,"");
			   }
			   
			   var tppic = new CHAT.model.Message({
				   
				   subject : subject,
				   content:content,
				   link : form.findField('link').getValue(),
				   attachments : attachments,
				   thread_type_id :newtopic.threadType,
				   thread_catogery_id : form.findField('thread_catogery_id').getValue(),
				   to:form.findField('to').getValue(),
				   quoted_post_id:form.findField('quoted_post_id').getValue(),
				   attachmentpath:attachmentsPnl.uploadPath,
				   uid:form.findField('thread_id').getValue(),
				   reference_id : reference,
				   commentUid: newtopic.commentUid,
				   taskaction:newtopic.taskaction,
				   status : newtopic.status,
				   //201312021950
				   old_instructorId: SWP.oldInstructorId

			   });
			   var operation = Ext.data.Operation({
					action : 'create',
					params : tppic,
					scope : this,
					callback:function( record, operation, success ) {
						if(record.operations[0].response.result){
							newtopic.setLoading(true);
							newtopic.allowToRefresh = false;
							var response = record.operations[0].response.result;
							var hasAttachment = false;
							if(!Ext.isEmpty(attachments)){
								hasAttachment = true;
							}
							
							if ( record.operations[0].success ){
								   CollaborationToolMgr.createThreadPostAttachment({'postuid':response['postuid'] ,'created':response['created'],'thread_uid':response['thread_uid'],'hasAttachment':hasAttachment,'attachments':attachments});
								   if( newtopic.commentUid ) {
									var string = '{success:true, eventName:"reloadcommentsgrid"}';
									this.dataSend(string);
								   }
							} else {
								   Ext.MessageBox.show({
										title: MESSAGE.CLASSROOM_SAVE_FAIL,
										msg: MESSAGE.CLASSROOM_SAVE_FAILMSG,
										buttons: Ext.Msg.OK,
										modal:true,
										icon: Ext.MessageBox.ERROR
									});
								   newtopic.setLoading(false);
							}
						}
					}
			   });
			   var activeTabStore = Ext.ComponentQuery.query(' tabview')[0].getActiveTab().getStore();
				activeTabStore.insert(0,tppic);
				activeTabStore.sync( operation );
	    	   var newtopicWindow = newtopic.previousNode();
			   
			   if( newtopicWindow.componentCls== "x-window" ) {
				   
				   newtopicWindow.comingFromSave = true;
				   newtopicWindow.close();
				   
			   }else {
				   
				   var parent = newtopic.up('container');
				   parent.remove(newtopic);

			   }
			   Ext.ComponentQuery.query(' tabview')[0].getActiveTab().getStore().load();
			   Ext.ComponentQuery.query(' tabview')[0].getActiveTab().getStore().on('load',function(s,r) {
				   if(r){
					   if( ( r[0].get( 'uid') ) && ( r[0].get( 'thread_type_id' ) == TABS.THREAD_TYPE_THREE ) ) {
						   //status,fromNewtopic,fromSavepost,recVideoId,recQustionId,threadId
						   var status = tppic.get('status');
						   var recVideoId = combo.get( 'groupId' );
						   var recQustionId = combo.get( 'id' );
						   var string = '{success:true, eventName:"refreshstatusicons",rows:[{"status":"'+status+'","fromNewtopic":'+ true +',"fromSavepost":'+false+',"recVideoId":'+recVideoId+',"recQustionId":'+recQustionId+',"threadId":'+r[0].get( 'uid')+' ,"recStatus":'+false+'}]}'; 
						   this.dataSend(string);
						   //this.fireEvent('refreshstatusicons',tppic,true,false,combo,r[0].get( 'uid'));   		
					   }
				   }
			  },this,{single: true});
	   },
		   
		   /**
		    * On Cancel button click in new topic window, it will close the new topic window.
		    * 
		    */
		   
		   cancelnewTopic:function( newtopic,flag ) {
			   
			   newtopic.previousNode().close();
			  
		   },
		   
		   /**
		    * 	On clicking on attachments button in new topic window,
		    * 	this function gets fired and shows upload popup window, which allows user to upload files.
		    * 
		    */
		   
		   showAttachmentPanel : function( topic ) {
			   
			   	var PATH = 'tmp/'+topic.instanceId+'/';
			   	
			   	var view = Ext.widget('UploadPopup',{
			   				uploadPath:PATH,
				            autoUpload:false,
				            optionalZip:true,
				            ref:topic,
				            isfromamazon : SWP.isFromAmazon
			   	});
			   	
			   	view.show();
			   	topic.doLayout();
			},
			
			/**
			 *	On Send button in upload popup window, it saves the attachmentes in the file system. 
			 * 
			 */

			saveAttachments:function( uploadpnl,unique,pkgname,uploader,store,zipped ) {

				var files = [];
				   if( zipped ){
					   
					   if( !Ext.isEmpty( pkgname ) && !Ext.isEmpty( unique )) {
						   
						   CollaborationToolMgr.compressZip({'PATH':uploader.uploadPath+unique ,'zipname':pkgname,'destination':uploader.uploadPath,'deleteFile':true},function(res,temp){
							   if (res){
								   CollaborationToolMgr.zipPackage( {'PATH':uploader.uploadPath+unique ,'zipname':pkgname,'destination':uploader.uploadPath}, function(r,t) {
									   if( r ){
										       if(r == true){
										    	   //When this operation is not allowed the fileupload to s3 
										    	   //Then we are sending just true at that situation just need to
										    	   //Append the ziped content path
										    	   r = res;
										       }
											   store.filter([{
													filterFn: function(item) {
														
												  		return ( item.get("status") == 'Done' );
													}
												}]);
											   
											   //If the files are successfully uploaded then only add to the upload Panel
											    
											   if( store.data.length > 0 ) {
												   
												   var size = 0;
												   for( var i=0; i<store.data.length; i++ ) {
													   
													   size += store.data.items[i].data.size;
												   }
												   
												   files[0]={
														   
													   data:{
														   'name':pkgname+'.zip',
														   'PATH':uploader.uploadPath,
														   'size' : size,
														   'objecturl' : r
													   }
												   };
												   
											   }else {
											   
												   Ext.MessageBox.show({
													   
														title: MESSAGE.UPLOADERROR_TITLE,
														msg: MESSAGE.UPLOADERROR_ENTERPACKAGE,
														buttons: Ext.Msg.OK,
														modal:true,
														icon: Ext.MessageBox.ERROR
													});
												   
												   return;
											   }
									   
											   var newtopic = Ext.ComponentQuery.query(' newtopic')[0];
												/**
												 *  	Calling addAttachments function in newtopic, to add the attached files to
												 *  	attachments panel region.
												 * 
												 */
												
											   	newtopic.addAttachments( files ,uploader.uploadPath, unique ); 
											    var uploadPathindex = Ext.Array.indexOf(newtopic.attachmentfolders, uploader.uploadPath);
											    if(uploadPathindex == -1){											    	
											    	newtopic.attachmentfolders.push(uploader.uploadPath);
											    }
												uploadpnl.setLoading(false);
												uploadpnl.close();
												CollaborationToolMgr.rrmdir( uploader.uploadPath+unique );
								   }else{
										uploadpnl.setLoading(false);
										uploadpnl.close();
								   }
								   },this);
							   }
						   },this);   
					   }else {
						   
						   uploadpnl.setLoading(false);
						   uploadpnl.close();
					   }
				   }else {
					   
					   // Backend request to copy the files from the awesomeuploder folder insteance and paste it in reply folder instance
					   // and delete the awesome uploader file instance.
					   
					   var newtopic = Ext.ComponentQuery.query('newtopic')[0];
					   if( !Ext.isEmpty( unique ) ) {
						   
						   CollaborationToolMgr.RecursiveCopy( uploader.uploadPath+unique, uploader.uploadPath,function( r,t ) {
							   
							   if( t.status ) {
								   
								   var changes = r.changes;
								   
								   store.filter([{
									   
									   filterFn: function(item) {
										   Ext.each( changes,function( change,index ) {
											   
											   //If the file is renamed in the file structure, due to duplicacy then it will rename in store as well
											   if( item.get('name') == change.old ) {
												   
												   if (SWP.isFromAmazon){
									   					
									   					item.set('objecturl',change.objectUrl );
									   					if( item.get('name') != change.newname ){
									   						item.set('name',change.newname );
									   					}
									   				} else {
									   					
									   					item.set('name',change.newname );
									   				}
											   }
											   
										   },this);
										   
										   return ( item.get("status") == 'Done' );
									   },
									   
									   scope:this
								   }]);
								   
								   files = store.data.items;
								   
								   newtopic.addAttachments( files ,uploader.uploadPath, unique ); 
								   var uploadPathindex = Ext.Array.indexOf(newtopic.attachmentfolders, uploader.uploadPath);
								   if(uploadPathindex == -1){											    	
								    	newtopic.attachmentfolders.push(uploader.uploadPath);
								   }
								   
								   uploadpnl.setLoading(false);
								   uploadpnl.close();
							   }
						   },this);
						   
					   }else{
						   
						   uploadpnl.setLoading(false);
						   uploadpnl.close();
					   }
					   
					   files = store.data.items;
					   Ext.getCmp(newtopic.id+'-attachbutn').focus();
					   return;
				   }
		},
		
		   /**
			* 
		    * This function is executed while canceling the attachments.
		    * 
		    */
		   
		   cancelAttachments:function( pnl,uniqueid ){
			   
			   var awesomeUploader = pnl.down('awesomeuploader');
			   
			   if( awesomeUploader.winModified == true ){
				
				   Ext.Msg.confirm({
					   		 title:MESSAGE.CLASSROOM_CANCEL_TITLE,
						     msg:MESSAGE.CLASSROOM_CANCEL_MSG,
						     buttons: Ext.Msg.YESNO,
						     icon: Ext.Msg.QUESTION,
						     fn:function( btn){
					
						    	 if( btn === 'yes' ) {
						    		 
						    		 // If user tries to cancel the upload operation, then uploaded files also need to be deleted from the file structure.
						    		 CollaborationToolMgr.recursiveRemoveDir( [pnl.uploadPath+pnl.uniqueid] );
						    		 pnl.close();
						    	 }
						     }
					});
				   
			   }else {
				   
				   pnl.close();
			   }
		   },
		   
		   showMessageThread :function(record,store,isFromCommentsGrid, fromQuiz){

			   // setting record into a controller variable to compare this record in polling while loading the posts
	    		var badgebutton;
	    		var badgeTab;
	    		var badgeTabIndex;
	    		var messagingWindow;
	    		var tabView, activeTab;
	    		var isRead;
	    		
	    		this.threadRecord = record;
	    		this.fireEvent( 'setthreadrecord',record );
//	    		messagingWindow = Ext.ComponentQuery.query('datalist')[0];
	    		tabView = Ext.ComponentQuery.query(' tabview')[0];
	    		if(tabView.getActiveTab().title == TABVIEW.MESSAGES_TITLE ){
	    			activeTab = Ext.ComponentQuery.query('datalist')[0];
	    		}else{
	    			activeTab = Ext.ComponentQuery.query('datalist')[1];
	    		}
	    		
	    		badgeTab = Ext.ComponentQuery.query(' tabview badgetab ');
				if( badgeTab.length>0 ) {

						badgeTab[0].activeTabWidth = badgeTab[0].getWidth();
						badgeTab[1].activeTabWidth = badgeTab[1].getWidth();
				}
	    		
				activeTab.messagedetailsComp(record);
	    		
	    		isRead = record.get('unread_Post_Count');
	    		
	    		record.set( 'views', record.get('views')+1);
	    		store.sync();
		   },
		   
		   	/**
	    	 * 
			 * By clicking on the previous button then if any previous thread exist then
			 * that threads corresponding post will be getting displayed
			 * 
			 */ 		

			previous : function( btn,msgDtlPnl,threadId ) {
				
				var badgebutton;
				var badgeTab;
				var badgeTabIndex;
				var store;
				var tab;
				var record;
				var tabStore;
				
				//To stop the Task for post unread identifier. 
				msgDtlPnl.readPostTask.stop();
				
				var replyPanel= Ext.ComponentQuery.query('reply')[0];
				
				var me = Ext.ComponentQuery.query('pagingtoolbar')[0];
				var currentPage = me.store.currentPage;
				
				var tab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();
				var tabStore = tab.getStore();
				
				var currentRecord = tab.getSelectionModel().getSelection()[0];
				
				if( replyPanel ) {
					
					this.checkEmptySpaces(replyPanel);
				}
				
				if( ( !msgDtlPnl.confirmMessage &&
						replyPanel && 
						(replyPanel.getForm().isDirty() || replyPanel.noOfAttachments > 0) ) ||
						(replyPanel && currentRecord.index == 0 && currentPage == 1 )){
					
						this.cancelReply(replyPanel,btn,msgDtlPnl,threadId);
				}else {
					
						msgDtlPnl.confirmMessage = false;
						if( tab.getSelectionModel().selectPrevious( false,true ) ){
							
							record = tab.getSelectionModel().getLastSelected();
						
							// setting record into a controller variable to compare this record in polling while 
							//	loading the posts
							
							this.threadRecord = record;
							this.fireEvent( 'setthreadrecord',record );
							
							store = msgDtlPnl.getStore();
							msgDtlPnl.thread = record;
							
							store.load({params:{'thread_id':record.get('uid')}});
							
							msgDtlPnl.setThreadSubject(record.get('subject'));
							if ( record.get('thread_type_id') == TABS.THREAD_TYPE_THREE ){
								
								//this condetion prevent the Quizes instructions request, while click on previous. No need to show Quiz instructions in Quetion's task details window.
								if ( !record.data.reference['question_id'] ) {
									
								CollaborationToolMgr.getInstructions( { 'reference_id': record.get('reference_id'), 'video_id': null },function(r,t) {
									msgDtlPnl.setInstructions(r);
								});
							}
							}
							
							var isRead = record.get('unread_Post_Count');
							
							record.set( 'views', record.get('views')+1);
							
						tabStore.sync();
			    		
					} else {
						
						var messagesStore = Ext.ComponentQuery.query(' tabview')[0].getActiveTab().store;
						var messageDetails = Ext.ComponentQuery.query( 'messagedetails' )[0];
						
						var total = me.getPageData().pageCount;
						
						prev = me.store.currentPage - 1;
					    
						if (prev > 0){
						
							messagesStore.previousPage({
							
								callback:function(){
								
										if ( prev <= total ) {
											
											messageDetails.setLoading( true );
											var length = messagesStore.data.length-1;
											var selected = tab.getSelectionModel().select(messagesStore.data.items[length]);
											var record = tab.getSelectionModel().getLastSelected();
			
											// 	setting record into a controller variable to compare this record 
											//	in polling while loading the posts
											this.threadRecord = record;
											this.fireEvent( 'setthreadrecord',record );
											
											store = msgDtlPnl.getStore();
											
											store.load({params:{'thread_id':record.get('uid')}});
											
											msgDtlPnl.setThreadSubject(record.get('subject'));
											
											if ( record.get('thread_type_id') == TABS.THREAD_TYPE_THREE ){
												
												CollaborationToolMgr.getInstructions( { 'reference_id': record.get('reference_id'), 'video_id': null },function(r,t) {
													msgDtlPnl.setInstructions(r);
												});
											}
											
											var isRead = record.get('unread_Post_Count');
											
											tabStore.sync();

									}
								}
							
							},this);
						
						}
						
						}
						if( this.unReadThreads && record){
							
							var indexValue = Ext.Array.indexOf( this.unReadThreads,record.get('uid') );
							if( indexValue != -1 ){
								
								this.unReadThreads.splice(indexValue,1);
							}
						}
				}
	   },
	    	/** 
	    	* By clicking on the next button, if any thread available after this thread
	    	 * then that threads corresponding posts are getting displayed
	    	 */

	    	next : function(btn,msgDtlPnl,threadId){

	    		var badgebutton;
	    		var badgeTab;
	    		var badgeTabIndex;
	    		var tab;
	    		var selectedRecord;
	    		var tabStore;
	    		
	    		//To stop the Task for post unread identifier. 
	    		msgDtlPnl.readPostTask.stop();
	    		
	    		var replyPanel= Ext.ComponentQuery.query('reply')[0];
	    		var me = Ext.ComponentQuery.query('pagingtoolbar')[0];
	    		var total = me.getPageData().pageCount;
	    		var current = me.store.currentPage;
	    		var tab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();
	    		var tabStore = tab.getStore();
	    		
	    		var currentRecord = tab.getSelectionModel().getSelection()[0];
	    		var lastRecord = tab.store.last();
	    		
	    		if(replyPanel){
	    			
	    			this.checkEmptySpaces(replyPanel);
	    		}
	    		
	    		if( ( !msgDtlPnl.confirmMessage && replyPanel &&
	    				(replyPanel.getForm().isDirty()
	    						|| replyPanel.noOfAttachments > 0) ) ||
	    				(replyPanel && currentRecord.index == lastRecord.index && total == current ) ){

	    			this.cancelReply(replyPanel,btn,msgDtlPnl,threadId);

	    		}else{
	    			msgDtlPnl.confirmMessage = false;
	    			if( tab.getSelectionModel().selectNext(false,true) ){
	    				var record = tab.getSelectionModel().getLastSelected();

	    				// setting record into a controller variable to compare this record in polling while loading the posts 

	    				this.threadRecord = record;
	    				this.fireEvent( 'setthreadrecord',record );

	    				var store = msgDtlPnl.getStore();
	    				
	    				msgDtlPnl.thread = record;
	    				
	    				store.load({params:{'thread_id':record.get('uid')}});
	    				
	    				if ( record.get('thread_type_id') == TABS.THREAD_TYPE_THREE ){
	    					
	    					//this condetion prevent the Quizes instructions request, while click on next.No need to show Quiz instructions in Quetion's task details window.
							if ( !record.data.reference['question_id'] ) { 
								
							CollaborationToolMgr.getInstructions( { 'reference_id': record.get('reference_id'), 'video_id': null },function(r,t) {
								msgDtlPnl.setInstructions(r);
							});
							
							}
						}
	    				
	    				msgDtlPnl.setThreadSubject(record.get('subject'));
	    				var isRead = record.get('unread_Post_Count');
	    				
	    				record.set( 'views', record.get('views')+1);
	    				
	    				tabStore.sync();
	    			}
	    			else {
	    				
	    				var messagesTab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();
	    				var messagesStore = messagesTab.store;
	    				
//	    				messagesTab.hideMasking( true );
	    				
	    				var messageDetails = Ext.ComponentQuery.query( 'messagedetails' )[0];
	    				var next = me.store.currentPage +1;
	    				
	    				if ( next <= total ) {
	    					
	    					messagesStore.nextPage({
	    						
	    						callback: function() {
	    							
		    						if ( next <= total ) {
		    							
		    							messageDetails.setLoading( true );
		    							
		    							var selected = tab.getSelectionModel().select(messagesStore.data.items[0]);
		    							var record = tab.getSelectionModel().getLastSelected();
		    							
		    							// setting record into a controller variable to compare this record in polling while loading the posts 
		    							
		    							this.threadRecord = record;
		    							this.fireEvent( 'setthreadrecord',record );
		    							
		    							var store = msgDtlPnl.getStore();
		    								
	    								store.load({params:{'thread_id':record.get('uid')}});
		    							
		    							msgDtlPnl.setThreadSubject(record.get('subject'));
		    							
		    							if ( record.get('thread_type_id') == TABS.THREAD_TYPE_THREE ){
		    								
		    								CollaborationToolMgr.getInstructions( { 'reference_id': record.get('reference_id'), 'video_id': null },function(r,t) {
		    									msgDtlPnl.setInstructions(r);
		    								});
		    							}
		    							
		    							var isRead = record.get('unread_Post_Count');
		    							

		    							tabStore.sync();

		    						}
	    						}
	    					},this);

	    				}

	    			}
	    			
	    			if( this.unReadThreads && selectedRecord ) {

	    				var indexValue = Ext.Array.indexOf( this.unReadThreads,selectedRecord.get('uid') );
	    				
	    				if( indexValue != -1 ) {

	    					this.unReadThreads.splice( indexValue,1 );
	    				}
	    			}
	    		}
	},
	/*
	 * @public
	 * From the message details window if the user clicks on showMessagelist
	 * button then it will open the thread window with the corresponding
	 * thread getting selected.
	 */
	
	showMessageList : function( button,messagedetails,records ){
		
		var thread_id, threadtype_id;
		var messagingWindow;
		var tab;
		var selectedRecord;
		var selectedRowIndex;
		var replyPanel= Ext.ComponentQuery.query('reply')[0];
		
		//To stop the Task for post unread identifier. 
		messagedetails.readPostTask.stop();
		
		if(replyPanel){
			
			this.checkEmptySpaces(replyPanel);
		}
		
		if( !messagedetails.confirmMessage &&
				replyPanel && 
				(replyPanel.getForm().isDirty() ||
						replyPanel.noOfAttachments > 0) ){
			
			this.cancelReply(replyPanel,button,messagedetails,records);
			
		}else {
			
			messagedetails.confirmMessage = false;
			thread_id =  records[0].data['thread_id'];
			threadtype_id = records[0].data['threadtypeId'];
			var reply = Ext.ComponentQuery.query('reply');
			
//			messagingWindow = Ext.ComponentQuery.query('messagewindow')[0];
			
			tabView = Ext.ComponentQuery.query(' tabview')[0];
    		if(tabView.getActiveTab().title == TABVIEW.MESSAGES_TITLE ){
    			activeTab = Ext.ComponentQuery.query('datalist')[0];
    		}else{
    			activeTab = Ext.ComponentQuery.query('datalist')[1];
    		}
    		activeTab.setActiveItem(0);
    		activeTab.getDockedItems()[0].setVisible(true);
    		activeTab.getDockedItems()[2].setVisible(true);
			if( reply.length ) {
				
				reply[0].destroy();
			}
			var searchFields = Ext.ComponentQuery.query('datalist searchfield');
			var searchField = null;
			// AS we are getting two search fields in the browser, based on the active tab we 
			// are considering the required searchfield and its value.
			if ( threadtype_id == TABS.THREAD_TYPE_THREE ){
				
				Ext.ComponentQuery.query(' tabview')[0].setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_TWO);
				searchField = searchFields[searchFields.length - 1 ];
			}else {
				
				Ext.ComponentQuery.query(' tabview')[0].setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_ONE);
				searchField = searchFields[0];
			}
			tab = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();
			tabStore = tab.getStore();
			selectedRecord = tab.getSelectionModel().getSelection();
			storeRecords = tab.getStore().data.items;
			
			var r = tab.getSelectionModel().getSelection();
			var selectedrowindex =  tab.getStore().indexOf(r[0]);
			var loadpageCount = tabStore.currentPage;
			
			if( messagedetails.isModified() == true  ){

				loadpageCount = 1
			}
			// searchHappen- config check, whether search is happen or not even if search text is entered.
			if( !Ext.isEmpty( searchField.getValue()) ) {
				
				store = searchField.store,
				proxy = store.getProxy(),

				searchField.store.clearFilter();
				
				searchField.store.filter({
					id: searchField.paramName,
					property: searchField.paramName,
					value: searchField.searchText

				});
				
				searchField.store.loadPage(loadpageCount,{
					callback: function() {
						tab.getSelectionModel().select( tabStore.findExact('uid',selectedRecord[0].get('uid')));
					} ,
					scope: this
				},this);
				
				searchField.store.clearFilter();
				searchField.hasSearch = true;
				searchField.triggerCell.item(0).setDisplayed(true);
				searchField.updateLayout();

			}else {
				tabStore.loadPage( loadpageCount,{
					callback: function() {
						tab.getSelectionModel().select( tabStore.findExact('uid',selectedRecord[0].get('uid')));
					} ,
					scope: this
				},this);
			}
		}
	},
	
restoreWindow : function( messageWindow,window ){
    	
    	window.doLayout();
    },
    resizeWindow: function( win ){
    	var screenX,screenY;
    	if( Ext.isEmpty( win )){
    		win = this.getMessageWindow();
    	}
    	win.doLayout();
    	if(Ext.isIE){
    		
    		screenX = window.screenLeft-7;
    		screenY = window.screenTop-51 ;
    	}else{
    		
    		screenX = window.screenX;
			screenY = window.screenY;
    	}
    	var string = '{success:true, eventName:"resizemessagewindow",rows:[{"xPosition": "'+ screenX +'","yPosition": "'+ screenY +'","width": "'+ win.getWidth() +'","height": "'+  win.getHeight() +'"}]}';
    	this.dataSend(string);
    },
    /**
     * This method used to update the unread post count of the thread.
     */
    updateReadPost : function( messagedetails, postuid, postid ){
    	
    	var post = Ext.getCmp(postid);
    	
    	if( ! Ext.isEmpty( post )){
    		var threadid = post.threadId;
    	}
    	
    	CollaborationToolMgr.updatePostRead( SWP.Ruid, postuid, threadid, function( postcount, t ){
    		if( t.status ){
    			
    			var postHeader = post.down('postheader');
    			var headerDom = postHeader.messageEl.dom;
    			headerDom.innerHTML = headerDom.innerHTML.replace(headerDom.innerHTML, ( Ext.isIE ? headerDom.innerText : headerDom.textContent ));
    			post.readflag = '0'; 
    			var store = Ext.ComponentQuery.query(' tabview')[0].getActiveTab().store;
    			var record = store.findRecord('uid',threadid);
    			if( postcount == 0 ) {
        			
    				record.set('unread_Post_Count',false );
        			badgeTab = Ext.ComponentQuery.query(' tabview badgetab ');
    				if( badgeTab.length>0 ) {

    					if( record.get('thread_type_id') != TABS.THREAD_TYPE_ONE ) {
    						
    						badgeTabIndex = 1;
    						
    					}else {
    						
    						badgeTabIndex = 0;
    					}
    					
    					if( badgeTab[badgeTabIndex].getBadgeText() >=1 ) {
    						
    						badgeTab[badgeTabIndex].setBadgeText(badgeTab[badgeTabIndex].getBadgeText()-1);
    						var indexValue = Ext.Array.indexOf( this.unReadThreads,record.get('uid') );

    		    			if( indexValue != -1 ){

    		    				this.unReadThreads.splice(indexValue,1);
    		    			}
    					}
    				}
    				//this.fireEvent('updatebadgecount',record.get('uid') );
    				var uid = record.get('uid');
    				var string = '{success:true, eventName:"updatebadgecount",rows:[{"uid": "'+ uid +'"}]}';
    	    		this.dataSend(string);

    				record.set('isFromUpdateReadPost',true);
		    		store.sync({
		    			scope : this,
		    			callback:function( rec, operation, success ){
		    			
		    			var responseData = rec.operations[0];

							if( responseData.success == true ) {
							
								if( record.get('thread_type_id') == TABS.THREAD_TYPE_THREE ){
									record.set( 'status', responseData.response.result );
									var lastPostRecord = null;
									if ( this.threadRecord.get('uid') != null){

                                                                                  		    		lastPostRecord = record

                                                                                  		    	}else {

                                                                                  		    		lastPostRecord = record.data.items[0];

                                                                                  		    	}
                                                                                  		    	var status  = lastPostRecord.get('status');
                                                                                  		var string = '{success:true, eventName:"refreshstatusicons",rows:[{"status":"'+status+'","fromNewtopic":'+ false +',"fromSavepost":'+true+',"recVideoId":'+record.get( 'reference' ).video_id+',"recQustionId":'+record.get( 'reference' ).question_id+',"threadId":'+record.get('uid')+' ,"recStatus":'+record.get('status')+'}]}'; 
					this.dataSend(string);
						
			    				}
			    			}
		    			}
		    		});
        		}
    		}
    		
    	},this);
    },
    
    /**
	 *  On Clicking training files button, downloading all creator files.
	 *  created this function identical to workfiles panel to call training files record function
	 *  and to create the product id folder in training files folder, which is used while 
	 *  zipping the creator files using the training files path.
	 * 
	 *  @param commentPnl - comments grid
	 *  @param btn		  - training files button.
	 */
	
	 downloadTrainingFiles: function( commentsPnl,btn,isFromMsgDetails,groupName,isFromChaptersList,questionTitle ){
    	this.numberofTrainingFiles = 1;
			if( this.numberofTrainingFiles > 0 ){
				
			var me = this;
			var body = Ext.getBody();
			me.form = body.createChild({
						tag:'form'
						,cls:'x-hidden'
						,id:'form'
						,method:'get'
						,action:'download.php'
						,target:'iframe'
						,cn:[{
								tag:'input'
								,type:'hidden'
								,name:'pid'
								,value: SWP.PID+"/"+SWP.CourseName
							},{
								tag:'input'
								,type:'hidden'
								,id:'lesson-name'
								,name:'lesson'
							},
							{
								tag:'input'
								,type:'hidden'
								,id:'question-name'
								,name:'question'
							},
							{
								tag:'input'
								,type:'hidden'
								,id:'to-amazon'
								,name:'isfromamazon'
								,value : SWP.isFromAmazon
							}]
			});
			var frame = body.createChild({
				
				tag:'iframe'
				,cls:'x-hidden'
				,id:'iframe'
				,name:'iframe'
					
			});
			/**
			 * refs #6603
			 * 
			 * isFromMsgDetails : true
			 * If user is clicking on Training files button of task details window then 
			 * else isFromMsgDetails: false
			 * 
			 */
			
			if( isFromMsgDetails == true ) {                       //From Message Details window's Training files downloading
				
				var taskRecord;
				var question;
				var leson;
				var chaptersStore = Ext.StoreManager.lookup('chapters');
				
				/**
				 * Checking whether that reference is related to quiz or lesson
				 */
				
				if( commentsPnl.thread.data.reference.question_id ){
					
						var record = commentsPnl.thread.get('subject').split(',');
						
						var quizQuestion = record[0];
						
						question = quizQuestion.replace(' ','');
						var questionArray = question.split('-');
						question = questionArray[questionArray.length - 1].replace(' ','');
						lesson = commentsPnl.thread.data.reference.ordering;
//						taskRecord = chaptersStore.findRecord('video_id','Q'+commentsPnl.thread.data.reference.video_id);
//						
//						lesson = taskRecord.get('ordering');
					
				} else {						
//						taskRecord = chaptersStore.findRecord('video_id','L'+commentsPnl.thread.data.reference.video_id);
//						lesson = taskRecord.get('ordering');
						lesson = commentsPnl.thread.data.reference.ordering;
						question = -1;

			   }
				
				me.form.dom[1].defaultValue = lesson;
				me.form.dom[2].defaultValue = question;
				me.form.dom[1].value = lesson;
				me.form.dom[2].value = question;
				
				me.form.dom.submit();
				
			}
	} else {
	
			Ext.Msg.alert( TRAININGFILES.ALERT_TITLE,TRAININGFILES.ALERT_MESSAGE );
	}

//    	this.fireEvent('downloadtrainingfiles',commentsPnl,btn,isFromMsgDetails,groupName,isFromChaptersList,questionTitle);
//    	return;
	},
	
	/**
	 * 
	 * On refreshing posts, reloading the posts store and comparing weather there are unread
	 * messages are there or not for that partcular thread. If yes, making them to read. 
	 * 
	 */

	onRefreshPosts: function( btn,messagedetails,threadRecord ) {
		
			messagedetails.setUpdated(false);
		   var replyPanel= Ext.ComponentQuery.query('reply')[0];
		   
		   if( replyPanel ) {
			   
			   this.checkEmptySpaces(replyPanel);
		   }
		   
		   if( !messagedetails.confirmMessage && replyPanel 
				   && (replyPanel.getForm().isDirty() || replyPanel.noOfAttachments > 0) ){
				
				this.cancelReply(replyPanel,btn,messagedetails,threadRecord);
				
		   }else {
			   
				messagedetails.confirmMessage = false;
				messagedetails.store.load({params:{'thread_id':this.threadRecord.get('uid')}});
				//201403030701
				var expandCollapseButton = messagedetails.query('button[name=expand-collapse]')[0];
				expandCollapseButton.setIconCls('expanding-collapsing');
				expandCollapseButton.setTooltip( { text : MESSAGEDETAILS.COLLAPSEALL_TOOLTIP,
								        		   anchor :'right',
												   mouseOffset :[10,0]} );
				var datalist = Ext.ComponentQuery.query(' tabview')[0].getActiveTab();
				var badgebutton = Ext.ComponentQuery.query(' badgebutton ')[0];
				var badgeTab = Ext.ComponentQuery.query(' tabview badgetab ');
		}

	},
	

	/**
	 * User should be able to close a private message by selecting from the context menu close option.
	 * 
	 */
	
	closeMessage : function( me, grid, items, store ) {
		
			Ext.Array.each( items,function( item ) {
				
			if( item.get('thread_catogery_id') == TABS.THREAD_CATOGERY_ONE && item.get('status') == MESSAGESTATE.STATUS_OPEN ) {
				
					item.set('status',MESSAGESTATE.STATUS_CLOSED);
					store.sync();
				}
			});
	},
	
	/**
	 * User should be able to Open a closed private message by selecting from the context menu Open option.
	 * 
	 */
	
	openMessage : function( me, grid, items, store ) {
		
		Ext.Array.each( items,function( item ) {
			
		if( item.get('thread_catogery_id') == TABS.THREAD_CATOGERY_ONE && item.get('status') == MESSAGESTATE.STATUS_CLOSED ) {
			
				item.set('status',MESSAGESTATE.STATUS_OPEN);
				store.sync();
			}
		});
},

/**
 * 
 * Before closing the window it should play the player again. And checking weather message button is existing
 * or not, and if yes, destroying the button and making the variable as undefined. And Hiding toolbar.
 * 
 */

closeWindow : function( me, window ) {
	
	if( this.messageButton ) {
		 
   		 this.messageButton.destroy();
   		 this.messageButton = undefined;
   		this.fireEvent('toolbarshow', false);
	 	}
	
	
	var replyPanel= Ext.ComponentQuery.query('reply')[0];
	if( replyPanel ) {
			   
	 this.checkEmptySpaces(replyPanel);
		
	if( !window.closeconfirmed && replyPanel.getForm().isDirty() ) {
		
			   Ext.Msg.confirm({
				   		 title:MESSAGE.CANCEL_NEWTOPIC_TITLE,
					     msg: MESSAGE.CANCEL_NEWTOPIC,
					     buttons: Ext.Msg.YESNO,
					     icon: Ext.Msg.QUESTION,
					     fn:function( btn){
					    	 	
					    	 	if (btn === 'yes'){
					    	 		window.closeconfirmed = true;
					    	 		window.close();
					    	 	}else{
					    	 		window.closeconfirmed = false;
					    	 	}
					     }
				});
			   return false;
		   }else{
			   
			   // If the player is paused then before closing the window it should resume the player.
			   if( player.isPlaying() == false && this.isPlayerPaused == true ) {
				   
					player.resume();
				}
		   }
	}
	
	this.fireEvent('playerstatus');
	return true;
		
},



/**
 * 
 * Hiding the messaging window and creating a button and placing that below the messages button. 
 * And on clicking on button, again showing the messaging window.
 * Allowing Drag and drop functionality for the button. 
 * 
 */

minimiseWindow : function( messageWindow,window ) {
	
	this.fireEvent('playerstatus');
	messageWindow.hide();
	
	messageWindow.on( 'hide',function() {
		
		this.messageButton.toggle(false);
		this.messageButton.addCls('x-btn-css');
		this.messageButton.removeCls('x-btn-css-toggle');
		this.fireEvent('toolbarshow', true);
		
	},this);
	
	if( this.messageButton ) {
		
			this.messageButton.show();
			
	}else {
		
		this.messageButton = Ext.create('Ext.Button',{
			
    			text : CLASSROOM.MINIMISE_MSGBUTTON_TEXT,
    			cls: 'x-btn-css',
    			renderTo: Ext.getBody(),
    			enableToggle: true,
    			style: 'overflow: visible',
    			draggable: true,
    			constrain: true,
    			scope: this,
    			listeners: {
    				
    				click: function( btn,e,obj ) {
    					
    					if( !this.isMoving ) {
    						this.fireEvent('pausevideoplayer');
//    						this.scope.pauseVideoPlayer();
    						
    						var messagingWindow = Ext.ComponentQuery.query('messagewindow');
    						
    						if( messagingWindow.length >0 ) {
    							messagingWindow[0].show();
    							btn.removeCls('x-btn-css');
    							btn.addCls('x-btn-css-toggle');
    						}
    					}
    					
    					this.isMoving = false;
    				},
    				move: function( btn ) {
    					
    					if( this.cameToRender == true ) {
    						
    						this.isMoving = false;
    						this.cameToRender = false;
    						
    					}else {
    						
    						this.isMoving = true;
    					}
    				},
    				render: function() {
    					
    					this.cameToRender = true;
    					this.isMoving = false;
    				}
    			}
		});
		
		this.fireEvent('showmessagebutton', this.messageButton );

	}
},
restoreWindow : function( messageWindow,window ){
	
	window.doLayout();
},
//resizeWindow: function( messageWindow,window ){
//	de
//	window.doLayout();
//},

sendReference : function ( thisIsTask, typeofthread, commentsGridRecordComment ,commentsGridRecordUID , messagePanelTitle, selectedRecord ){
	
	CTSELECTED = selectedRecord;
	if ( commentsGridRecordUID ){
		var subject = commentsGridRecordComment;
		var topicConfig = { threadType:typeofthread, subjectValue:subject, commentUid : commentsGridRecordUID, reference:CTSELECTED, taskaction:00,status:1 };
	} else {
		
		var topicConfig = { threadType:typeofthread,reference:CTSELECTED,taskaction:00,status:MESSAGESTATE.STATUS_OPEN};
	}
	
	if( thisIsTask == true ) {
		
		var taskaction;
		var taskActionStore;
		var taskAction_intialAction;
		var topicConfig;
		var taskStatusStore;
		var taskStatus_InitialStatus;
		var initialAction;
		var initialStatus;
		
		
		taskActionStore =  Ext.data.StoreManager.lookup('SWPCommon.store.TaskActions');
		taskActionStore.clearFilter();
		taskAction_intialAction = taskActionStore.queryBy(function(item){
			 
			 return item.get('InitialAction') == 'TRUE' || item.get('InitialAction') == 'True' || item.get('InitialAction') == 'true';
			 
		 });
		initialAction = taskAction_intialAction.items[0].data['ID'];
		
		initialStatus = taskAction_intialAction.items[0].get('StatusCode'); 

		typeofthread = TABS.THREAD_TYPE_THREE; 
		
		topicConfig = { threadType:typeofthread,thisIsTask:thisIsTask, taskaction:initialAction, status:initialStatus};
		 
		/**
		 * Before opening the New Task window we are checking whether all the lesson and Quiz
		 * are associated with Task, if yse then we are showing an alert message otherwise 
		 * we are showing the newTask window.
		 * */
		
		var chs = Ext.create('CHAT.store.Reference');
		chs.load();
		
		chs.on('load',function( store, recs ){ 
			
			if (store.data.length > 0 ){
				
				var topicview = Ext.widget( 'newtopicwindow',{
					topic : topicConfig
				} );
				
	    		this.updateWindow(messagePanelTitle,commentsGridRecordUID, topicview );
			} else {
				
				Ext.Msg.alert('Info', TASK.ALL_TASK_CREATED	);
			}
		}, this);
	}
	else {
		
		var topicview = Ext.widget( 'newtopicwindow',{topic : topicConfig} );
		this.updateWindow(messagePanelTitle,commentsGridRecordUID, topicview );
	}
},
badegetabText : function ( thread_type,thread_catogery, uid ){

	badgeTab = Ext.ComponentQuery.query(' tabview  badgetab ');
	if( badgeTab.length > 0 ) {
		if ( !this.unReadThreads ){
			
			this.unReadThreads = [];
		}
		if( ! Ext.Array.contains( this.unReadThreads, uid ) ) {

			this.unReadThreads.push( uid );
			
			if( thread_type != TABS.THREAD_TYPE_ONE && thread_catogery != TABS.THREAD_CATOGERY_ONE ) {
				
				badgeTabIndex = 1;
				
			}else {
				
				badgeTabIndex = 0;
			}
			
			if( badgeTab[badgeTabIndex].getBadgeText() == ' ' || badgeTab[badgeTabIndex].getBadgeText() == undefined ) {
				
				badgeTab[badgeTabIndex].setBadgeText(1);
				
			}else {
				
				badgeTab[badgeTabIndex].setBadgeText(badgeTab[badgeTabIndex].getBadgeText()+1);
			}
		}
	}
},

loadTabData : function (){
	
	if( Ext.ComponentQuery.query('messagewindow').length > 0 ) {
		
		
		var detailsWindow = Ext.ComponentQuery.query(' messagewindow')[0].getLayout().getActiveItem();
		var activeTab = detailsWindow.activeTab;
		if ( activeTab ) {
			
		Ext.ComponentQuery.query(' tabview')[0].getActiveTab().getStore().load();
		}
		
	}
},
setThreadRecord : function ( record ){
	
	this.threadRecord = record;
},

increaseBadgecount : function ( uid, thread_type_id ){
	
		if ( !this.unReadThreads ){
			
			this.unReadThreads =[];
		}
		if( ! Ext.Array.contains( this.unReadThreads, uid ) ) {

			this.unReadThreads.push( uid );
			badgeTab = Ext.ComponentQuery.query(' tabview badgetab ');
			
			if( badgeTab.length>0 ){
				
				if( thread_type_id != TABS.THREAD_TYPE_ONE ) {
					
					badgeTabIndex = 1;
					
				}else {
					
					badgeTabIndex = 0;
				}
				
				if( badgeTab[badgeTabIndex].getBadgeText() == ' ' ) {
					
					badgeTab[badgeTabIndex].setBadgeText(1);
					
				}else {
					
					badgeTab[badgeTabIndex].setBadgeText( badgeTab[badgeTabIndex].getBadgeText()+1 );
				}
			}
		}
    	var string = '{success:true, eventName:"increasebadgecount",rows:[{"uid": "'+ uid +'"}]}';
    	this.dataSend(string);

},

showMessagingWindow:function( thread_id, isFromCommentsGrid, showTasks  ) {
	
	var messagingWindow = Ext.ComponentQuery.query('messagewindow');
	if( messagingWindow.length > 0 ) {
		//2014240317
		var replyWins = Ext.ComponentQuery.query( 'reply' ),
  	 	newtopicWins  = Ext.ComponentQuery.query(' newtopicwindow '),
  	 	replyExist = false,
  	 	replyCmp;
		
		if( replyWins.length > 0 ){
			replyWins.forEach( function(cmp){
				var replyTabTitle = cmp.up('datalist').title;
				replyExist = true;
				replyCmp = cmp;
			});
		}

		if( newtopicWins.length > 0 || replyWins.length > 0 ){
			
				if( !Ext.Msg.isVisible() ){ //Here check for the Message Alert exist,If not exist only we are showing the alert.
					
					Ext.Msg.confirm({
						title:'Alert',
						msg:'You were responding to an existing post. Your changes will be lost. Do you want to continue?',
						buttons: Ext.Msg.YESNO,
						icon: Ext.Msg.QUESTION,
						scope: this,
						fn:function( btn ) {
						if( btn == 'yes' ){
							
							if( !Ext.isEmpty(newtopicWins) ){
								newtopicWins[0].destroy( );
								var msgId = Ext.ComponentQuery.query('datalist')[0].id;
								var taskId = Ext.ComponentQuery.query('datalist')[1].id;
								Ext.getCmp(msgId+'add-item').setDisabled(false);
								Ext.getCmp(taskId+'add-item').setDisabled(false);
							}
							if( !Ext.isEmpty(replyCmp) ){
								replyCmp.close( );
							}
							this.prepareMessagingWindow( thread_id, isFromCommentsGrid, showTasks );
						}else{
							return ;
						}
					}
					});
				}else{
					return ;
				}
		}else{
			 this.prepareMessagingWindow( thread_id, isFromCommentsGrid, showTasks );
		}
	}else {
		
		CollaborationToolMgr.getUnReadMessageCount( null,function(r,t) {
			if( t.status ) {
				if( r.length > 0 ) {
					
					var badgeTab;
					var badgeTabIndex;
					
					for( var i=0; i< r.length; i++ ) {
						
						if( r[i].unread_Post_Count > 0 ) {
							this.fireEvent('increasebadgecount', r[i].thread_id );
									
    							badgeTab = Ext.ComponentQuery.query(' tabview badgetab ');
    							
    							if( badgeTab.length>0 ){
    								
    								if( r[i].thread_type_id != TABS.THREAD_TYPE_ONE ) {
    									
    									badgeTabIndex = 1;
    									
    								}else {
    									
    									badgeTabIndex = 0;
    								}
    								
    								if( badgeTab[badgeTabIndex].getBadgeText() == ' ' ) {
    									
    									badgeTab[badgeTabIndex].setBadgeText(1);
    									
    								}else {
    									
    									badgeTab[badgeTabIndex].setBadgeText( badgeTab[badgeTabIndex].getBadgeText()+1 );
    								}
    							}
						}
					}
				}
			}
			
			
		}, this);
		

		/**
    	 *  Checking whether this event is firing from comments grid or general message window
 		 */
		
		 if( typeof(isFromCommentsGrid) == 'boolean' ) {
			 
	    		var tab = Ext.ComponentQuery.query('tabview datalist');
	    		var tabView = Ext.ComponentQuery.query('tabview')[0];
	    		var threadTypeId ;
	    		if( showTasks == true ) {
	    			threadTypeId = TABS.THREAD_TYPE_THREE;
	    			tabView.setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_TWO);
	    			var tabStore = tab[INDEXCHANGE.TAB_INDEX_VALUE_TWO].getStore();
	    			
	    		}else {
	    			threadTypeId = TABS.THREAD_TYPE_ONE;
	    			tabView.setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_ONE);
	    			var tabStore = tab[INDEXCHANGE.TAB_INDEX_VALUE_ONE].getStore();
	    		}

	    		var storeRecords = tabStore.data.items;
	    		var thread_id =  thread_id;
	    		
	    		var threadRecord = null;
	    		//201311251756
	    		CollaborationToolMgr.MessageDetailsOfTheThread(thread_id, function(r,t ){
	    			if(t.status){
	    				
	    				threadRecord = Ext.create('CHAT.model.Message',r);
	    				if( showTasks == true ) {
							
							tab[INDEXCHANGE.TAB_INDEX_VALUE_TWO].getSelectionModel().select(threadRecord);
							
						}else{
							tab[INDEXCHANGE.TAB_INDEX_VALUE_ONE].getSelectionModel().select(threadRecord);
						}
	    				
	    				this.showMessageThread(threadRecord, tabStore, isFromCommentsGrid, showTasks);
	    				Ext.getBody().unmask();
	    			}
	    		}, this);
	    		CollaborationToolMgr.getPageCount(threadTypeId,thread_id,tabStore.pageSize,function(r,t){
		    		if( t.status ){

			    	tabStore.loadPage(r);
			    	
		    		tabStore.on( 'load',function( store,record ) {
				    var threadRecord = null;

		    			if( record.length>0 ) {
		    				
							for( var i=0;i<record.length;i++ ) {
								
								if( record[i].get('uid') == thread_id ) {
									
									threadRecord = record[i];
									
									if( showTasks == true ) {
										
										tab[INDEXCHANGE.TAB_INDEX_VALUE_TWO].getSelectionModel().select(threadRecord);
										
									}else {
										
										tab[INDEXCHANGE.TAB_INDEX_VALUE_ONE].getSelectionModel().select(threadRecord);
									}
									
								}else {
									
									 tab[INDEXCHANGE.TAB_INDEX_VALUE_ONE].getSelectionModel().select();
								}
							}
						}
						
					},this,{single: true});
		    		}
		    		},this);
	    		
	    	}
		 
		 this.windowClosed = false;
		 
	}

	
},
	prepareMessagingWindow : function( thread_id, isFromCommentsGrid, showTasks ){
		//2014240317
		 Ext.ComponentQuery.query(' messagewindow')[0].getLayout().setActiveItem(0);
		 /**
		 *  Checking whether this event is firing from comments grid or general message window
		 */
		 if( typeof(isFromCommentsGrid) == 'boolean' ) {
			 
	    		var tab = Ext.ComponentQuery.query('tabview datalist');
	    		var tabView = Ext.ComponentQuery.query('tabview')[0];
	    		var tabPagingToolbar = Ext.ComponentQuery.query('pagingtoolbar')[0];
	    		var total = tabPagingToolbar.getPageData().pageCount;
	    		var threadTypeId ;
	    		if( showTasks == true ) {
	    			threadTypeId = TABS.THREAD_TYPE_THREE;
	    			var tabStore = tab[INDEXCHANGE.TAB_INDEX_VALUE_TWO].getStore();
	    			tabView.setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_TWO);
	    		}else {
	    			threadTypeId = TABS.THREAD_TYPE_ONE;
	    			var tabStore = tab[INDEXCHANGE.TAB_INDEX_VALUE_ONE].getStore();
	    			tabView.setActiveTab(INDEXCHANGE.TAB_INDEX_VALUE_ONE);
	    		}
	    		var storeRecords = tabStore.data.items;
	    		var thread_id =  thread_id;
	    		var threadRecord = null;
	    		//201311251756
	    		CollaborationToolMgr.MessageDetailsOfTheThread(thread_id, function(r,t ){
	    			if(t.status){
	    				
	    				threadRecord = Ext.create('CHAT.model.Message',r);
	    				this.showMessageThread(threadRecord, tabStore, isFromCommentsGrid, showTasks);
	    				Ext.getBody().unmask();
	    			}
	    		}, this);
	    		CollaborationToolMgr.getPageCount(threadTypeId,thread_id,tabStore.pageSize,function(r,t){
	    	    	
	    			if( t.status ){
	
		    			tabStore.loadPage(r);
			    		tabStore.on( 'load',function( store,record ) {
						var threadRecord = null;
			    			if( record.length>0 ) {
			    				
								for( var i=0;i<record.length;i++ ) {
									
									if( record[i].get('uid') == thread_id ) {
										
										threadRecord = record[i];
										if( showTasks == true ) {
											
											tab[INDEXCHANGE.TAB_INDEX_VALUE_TWO].getSelectionModel().select(threadRecord);
											
										}else{
											tab[INDEXCHANGE.TAB_INDEX_VALUE_ONE].getSelectionModel().select(threadRecord);
										}
									}
								}
							}
						},this,{single: true});
	    			}
	    		},this);
	    	}
	},
	onViewportResize : function( view, width, height, oldWidth, oldHeight, eOpts ){
		
		this.resizeWindow( view );

	},
	onViewportBeforeremove : function( view, component, eOpts ){
	
		var me = this;
		window.onbeforeunload = function(){
			me.resizeWindow();
		};
	},
	validateReply : function( reply ) {
		
		var postRec = reply.post.record,reopenPost=false;

		if( (postRec.get('taskaction') == '99') && ( (reply.replyAction != null) && (reply.replyAction< '99') ) ){
	   		   reopenPost = true;
		}
		
		var actioncombo = reply.down('combobox[name=actioncombo]');
		if( reopenPost &&( actioncombo && !actioncombo.isDisabled()) ){
			VideoRecordMgr.getQuizProgress( postRec.get('threadVideoId').substr(1),function( r, t ){
				if( r ){
					Ext.Msg.alert( "Alert!", "This task question's quiz is completed,So it will not make incomplete" );
				}else{
					this.saveReply( reply );
				}
			},this );
		}else{
			this.saveReply( reply );
		}
	}

});
