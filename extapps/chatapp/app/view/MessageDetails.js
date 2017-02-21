/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23126          Arunkumar.muddada    201310271256      According to the issue 
 *  23596          Dinesh.GK    		20131120630     Override Tooltip component is added into the common folder, 
 *  														code modification is done as per the required areas for tooltip.
 *  23707		   Tapaswini Sabat		201311301513	Now the tooltip in details window is coming fine.
 **/ 

Ext.define('CHAT.view.MessageDetails', {
	extend: 'Ext.Panel',
    alias: 'widget.messagedetails',
    requires: ['CHAT.store.Posts','CHAT.view.Post'],
    border:0,
    titlecolor :'#333333',
	titleBgColor:'#E0EAF3',
	adminVersion : false,
	autoScroll:true,
	instructionstext:'',
	ClientViewPostsEles:[],

	cls:'messagedetails-cls',
    initComponent : function() {
	this.postsCollapsed = 0;
	this.updated = false; 
    	var me=this;
    	
    	/**
    	 * Here we are changing the tooltip based on the thread details of a message or task
    	 * For this we are comparing the active tab and assigning the values.
    	 * */
    	var tabView =  Ext.ComponentQuery.query('tabview')[0];
    	var tabTitle = tabView.getActiveTab().title;
    	var backToolTip = MESSAGEDETAILS.MESSAGELIST_TOOLTIP ;
    	var previousToolTip = '';
    	var nextTooltip = '';
    	if ( tabTitle == TABVIEW.MESSAGES_TITLE){
    		backToolTip = MESSAGEDETAILS.MESSAGELIST_TOOLTIP ;
    		previousToolTip = MESSAGEDETAILS.PREVIOUS_MESSAGE_TOOLTIP ;
    		nextTooltip = MESSAGEDETAILS.NEXT_MESSAGE_TOOLTIP ;
    	} else if ( tabTitle == TABVIEW.TASKS_TITLE ) {
    		
    		backToolTip = MESSAGEDETAILS.TASKLIST_TOOLTIP ;
    		previousToolTip = MESSAGEDETAILS.PREVIOUS_TASK_TOOLTIP ;
    		nextTooltip = MESSAGEDETAILS.NEXT_TASK_TOOLTIP ;
    	}
    	
    	this.dockedItems =
    		[{
    		xtype : 'toolbar',
			layout:'hbox',
			ui : 'plain',
			cls:'message-details-toolbar',
			border :0,
			dock:'top',
			style:{backgroundColor:'#e1e1e1 !important'},
			items: [
					{
						   xtype:'tbspacer',
						   width: 5
					},
			        {	
			        	xtype:'button',
			        	iconCls : 'messagelist',
			        	width: 30,
			        	height: 27,
			        	tooltip : { 
							text : backToolTip,
							anchor :'top'
			        	},
			        	handler : function(){
			        	me.fireEvent('showmessagelist',this,me,me.recs);  
			        }
			        },
			        {
				    	   xtype:'tbspacer',
				    	   width:60
				    },
			        { 
			        	xtype:'button',
			        	iconCls : 'previous',
			        	tooltip : { 
								text : previousToolTip,
								anchor :'top'
						},
			        	width: 30,
			        	height: 27,
			        	handler : function(){
			        	me.fireEvent('previous',this,me,me.threadId);
			        }
			        },{
				    	   xtype:'tbspacer',
				    	   width:3
				    },
			        { 
			        	xtype:'button',
			        	iconCls : 'next',
			        	tooltip : { 
							text : nextTooltip,
							anchor :'top'
			        	},
			        	width: 30,
			        	height: 27,
			        	handler : function(){
			        		
			        		me.fireEvent('next',this,me,me.threadId);
			        	}
			        },
			        { 
			        	xtype:'button',
			        	iconCls : 'refresh',
			        	tooltip : { 
							text : MESSAGEDETAILS.REFRESH_TOOLTIP,
							anchor :'top'
			        	},
			        	width: 30,
			        	height: 27,
			        	handler : function(){
			        		me.fireEvent('refreshposts',this,me,me.thread);
			        		me.down('searchfield').onTrigger2Click();
			        	}
			        },
			        {
			        	xtype:'searchfield',
				    	store: this.store, 
				    	minWidth: 180,
				    	flex:1,
//				    	height: 27,
				    	paramName: 'livesearch',
				    	// As in some browser the coolapse/Expand All button is coming below the 
				    	// serach magnifier option so instead of making the columnWidth 1 
				    	// we are making it as 0.98 
				    	columnWidth : 0.98
				    	
			        },			        
			        {
			        	xtype:'button',
			        	iconCls : 'expanding-collapsing',
			        	height: 25,
			        	name : 'expand-collapse',
			        	tooltip : { 
							text : MESSAGEDETAILS.COLLAPSEALL_TOOLTIP,
							anchor :'right',
							mouseOffset :[10,0]
			        	},
			        	handler : function( view ){
			        	
			        	// If the button is expand-all then we are expanding all the posts and 
			        	// if it is collapse-all then we are collapsing all the posts.
			        	
			        	var panelsArray = me.query('post');
			        	if ( view.iconCls == 'x-img-btn-expand-collapse' ){
			        		
			        		for( var i = 0; i<panelsArray.length; i++ ){

			        			panelsArray[i].expand(); 
			        		}
			        		me.postsCollapsed = 0;
			        		view.setIconCls('expanding-collapsing');
			        		view.setTooltip( { text : MESSAGEDETAILS.COLLAPSEALL_TOOLTIP,
							        			anchor :'right',
												mouseOffset :[10,0]} );
			        		
			        		
			        	} else {
			        		
			        		for( var i = 0; i<panelsArray.length; i++ ){
			        			panelsArray[i].collapse(); 
			        		}
			        		me.postsCollapsed = panelsArray.length;
			        		view.setIconCls('x-img-btn-expand-collapse');
			        		view.setTooltip( { text :  MESSAGEDETAILS.EXPANDALL_TOOLTIP,
			        							anchor :'right',
			        							mouseOffset :[10,0]}  );
			        	}
			        	
			          	}
			        }]
		
		}];
    	
    	this.items  = [{
			xtype:'container',
			id:me.getId()+'posts'
		}];
    	
    	
    	/**
		 * refs #6062
		 */
		 
		if( me.adminVersion ) {
			
			this.adminVersion = me.adminVersion ;
		}
		
	var subject = MESSAGE.MESSAGEDETAILS_SUBJECT;
	
	if( this.subject ) {
		
		subject = this.subject;
	}
	

	this.style={backgroundColor:'#e1e1e1 !important',height:'100%',overflow:'hidden !important'};
	
	if( Ext.isEmpty( this.thread) ) {
		
		 Ext.Error.raise({
             msg: MESSAGE.MESSAGEDETAILS_WITHOUT_THREAD
           
         });
		
		 return ;
	}
	
	this.store.on( 'beforeload',function(store,records){
		var messagewindow = Ext.ComponentQuery.query('messagewindow')[0];
		if ( messagewindow ){
			
			// If the thread contains atleast one or more large post 
			// then we are showing some different text while loading the message.
			
			if (this.thread.get('largeFile')){
				
				messagewindow.setLoading({
						msg : POST.LARGE
					}, true);
				
			} else {
				
				 messagewindow.setLoading();
			}
		}
	},this );
	
	this.store.on('load',function(st,recs){
		
		var messagewindow = Ext.ComponentQuery.query('messagewindow')[0];
		if ( messagewindow ){
			messagewindow.setLoading(false);
		}
		me.recs = recs;
		if(recs.length == 0 ){
			return;
		}
		if ( recs[0].data.threadtypeId == 3){
				this.isTaskDetails = true;
		}
		
		Ext.getCmp( me.getId()+'posts').removeAll();
		
		var threadRecord = me.thread.get('reference');

		var postConfig,expandPost;
		
		/**
		 * @cfg:firstPost  is true for the  first post of the thread. 
		 * for firstPost only 'unhide' menu item will be available and for others hide and unhide menun items will be available
		 */
		var firstPost = false,j=0,authorCount=[];
		if( this.adminVersion && (recs[0].get('threadtypeId') == 3) ) {
			var action = recs[0].get('taskaction');
			var actionStore =  Ext.data.StoreManager.lookup('SWPCommon.store.TaskActions');
			actionStore.clearFilter();

			var transitions = actionStore.findRecord('ID',action,null,null,true).get('Transitions').split(",");
			filterText = new RegExp('^'+transitions.join('(000)*$|^')+'(000)*$');
			actionStore.filter('ID',filterText);
			var menuItems = [];
			actionStore.each(function(item,index){

				menuItems.push({ 
					text: item.get('Name'),
					actionText:item.get('ActionText'),
					body:item.get('Body'),
					actionId:item.get('ID')
				});
			},this);

			
			actionStore.clearFilter();
		}
		for ( var i=0; i<recs.length; i++ ) {
			
			var newAuthor = true;
			if( recs[i].data.hidden == 1 ) {
				
				continue;
			}

			for( var k=0; k<=authorCount.length; k++ ) {
				
				if( authorCount[k] == recs[i].data.author_id ) {
					
					newAuthor = false;
					break;
				}
			}
			
			if ( newAuthor ) {
				
				authorCount[j] = recs[i].data.author_id;
				j++;
			}
			
			if( recs[i]==this.store.first() ) {
				
				firstPost = true;
				
			}else {
				
				firstPost = false;
			}
			
			postConfig = {
					
					link 			 : 	(this.thread.get('reference_id')),
					toolTip			 : 	( !Ext.isEmpty(threadRecord) == true ? threadRecord.chaptername ? threadRecord.name+' - '+threadRecord.chaptername: threadRecord.name : ''),
					splitMenuItems	 :	menuItems,
					actionStore		 :  actionStore,
					hideQuotedText 	 : 	( i> 0 && recs[i].get('parent')['uid'] == recs[i-1].get('uid') ),
					titlecolor 		 : 	this.titlecolor,
					titleBgColor	 :	this.titleBgColor,
					positionIndex	 :	i,
					record			 :	recs[i],
					adminVersion	 :  this.adminVersion,
					taskAction		 :	this.thread.get( 'taskaction' ),
					taskStatus		 :	this.thread.get( 'status' ),
					postId			 :	recs[i].get('uid'),
					userId			 :	recs[i].get('author_id'),
					readflag		 :	recs[i].get('readflag'),
					threadId		 : 	recs[i].get('thread_id'),
					loginUserId		 :  recs[i].get('loginuserid')
					
					
			};
			
			var post =  Ext.create('CHAT.view.Post',postConfig) ;
			
			post.on( 'replyall',function( post,btn,quotemsg ) {
							this.fireEvent('reply',post,Ext.getCmp(me.getId()+'posts'),btn,quotemsg);
			},this);
			
			post.on( 'link',function( post,btn ) {
				
				this.fireEvent('link',threadRecord,post,btn);
			},this);
			
			Ext.getCmp(me.getId()+'posts').add( post );
						
		}
		
		var headerContent = this.threadSubject;
		var messageDetailsComp = Ext.ComponentQuery.query('messagedetails');
		
		//
		//We have to show the post header in the messagedetails window which contains the subject, Number of post by No. of authors
		// and No. of views with the Reference of the thread if any exist.
		//
		
		if( this.thread.get('reference') ) {
			
			var myitems = []; //Array of items that should be displayed in task details header.
			var uid;
			var taskStatusStore;
			var taskaActionStore;
			var statusRecord;
			var actionRecord;
			var statustext; 
			var chapterRecord;
			var chapterpanel;
			var chs;
			var instructions = [];
			var title;
			var reference = this.thread.get('reference').name;
			if (this.thread.get('reference').chaptername){
				reference = reference + ' - '+this.thread.get('reference').chaptername;
			}
			headerContent = '<span class= "postdescription"> <font class="subject-cls">'+MESSAGEDETAILS.SUBJECT+' '+
							Ext.String.htmlEncode(this.threadSubject)+
							'</font><br/>'+
							'<span style="float:left;padding-left:10px;">'+recs.length+
							( recs.length > 1 ? MESSAGEDETAILS.POSTS_BY : MESSAGEDETAILS.POST_BY) +j+ 
							( j > 1 ? MESSAGEDETAILS.AUTHORS_WITH :MESSAGEDETAILS.AUTHOR_WITH)+
							(this.thread.get('views'))+
							( this.thread.get('views') > 1 ? MESSAGEDETAILS.VIEWS_IN_REFERENCE : MESSAGEDETAILS.VIEW_IN_REFERENCE)+'</span> <font class="header-post-reference"> &nbsp; '+reference+' &nbsp; '+
							' </font><div id="'+me.getId()+'post-desc-ref" style="float:left;"></div></span>';	
			 
			 myitems.push({
	            	xtype : 'container',
	            	cls : 'main-header-content',
	            	html :headerContent
             });
			 /**
			  * If thread type is 3 then instructions panel should be added.
			  */
			 if(this.thread.get( 'thread_type_id' ) == TABS.THREAD_TYPE_THREE ) {
				 
					 /**
					  * refs #6022
					  * If any instructions associated with that particular lesson/quiz then that instructions should be displayed in instructions panel.
					  * If no instructions associated then it should display "No Instructions".
					  * 
					  */
				 
				 
				 /*
				 	 chapterpanel = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
				 	 chs = chapterpanel.getStore();
				 	 
				 	
				 	if( this.thread.data.reference['question_id'] ){
				 		//Here handle to show undefined instruction text.
				 		 this.instructionstext = '';
//				 	chapterRecord = chs.findRecord( 'video_id', 'Q'+this.thread.data.reference['video_id'] );
				 	
				 	}else{
				 		
				 		chapterRecord = chs.findRecord( 'video_id', 'L'+this.thread.data.reference['video_id'] );
				 		title = chapterRecord.get('lesson');
					 	
						 if( chapterRecord.get( 'instructions' ) ) {
							 
							 this.instructionstext = chapterRecord.get( 'instructions' );
						 }else{
							 
							 this.instructionstext = INSTUCTIONSWIN.NO_INSTUCTIONS;
						 }
				 		
				 	} */
				 taskStatusStore =  Ext.data.StoreManager.lookup('SWPCommon.store.TaskStatuss');
				 taskaActionStore =  Ext.data.StoreManager.lookup('SWPCommon.store.TaskActions');
				 taskStatusStore.clearFilter();
				 taskaActionStore.clearFilter();
				 statusRecord = taskStatusStore.findRecord( 'ID', post.record.get( 'status' ) );
				 actionRecord = taskaActionStore.findRecord( 'ID', post.record.get( 'taskaction' ) );
				 
				 //On mouse over to the icon it should display the status text.
				// 201311301513
				 if( statusRecord ){
					 
     			    	var cls = statusRecord.get('Cls');
     			    	var tooltip = statusRecord.get('LessonTooltip');
     			    	var statusId = statusRecord.get('ID');
     			    	if ( statusId == "5" ){
     			    		
     			    		if( SWP.instructLogin ){
     			    			tooltip = TASKSTATUS.LESSON_TOOLTIP_TASKSTATUS05;
     			    		}else{
     			    			tooltip = TASKSTATUS.OPEN_UPDATED_BY_YOU;
     			    		}
     			    	}
     			    }
				
				 statustext = '<span ><img  src ='+Ext.BLANK_IMAGE_URL+' style="float:left;" data-qclass="seek-qtip" data-anchor="top" data-qtip= "'+ tooltip +'" class='+statusRecord.get("Cls")+
				  ' />&nbsp;'+ actionRecord.get('ActionText')+'</span>';			 
//				 +'<br /><p style="color:red;">'+statusRecord.get('StatusText')+'</p>'
				 myitems.push({
					 
						xtype : 'container',
						autoHeight : true,
						border:0,
						layout:'auto',
						cls:'statustext',
						floating:false,
						html:statustext,
						items:[
								{
								
								   	xtype:'button',
								   	iconCls : 'trainingfileicon',
									style : ' float:right; display : inline ;',
									tooltip : { 
										text : GRID.TRAINING_FILES,
										anchor :'right',
										mouseOffset :[10,0]
						        	},
									height: 28,
									width: 23,
									cls : 'instruction-win-training-icon',
									listeners:{
										/**
										 * refs #8458
										 * Training files button should be disabled if no training files are there
										 */
										boxready: function( view ) {
											
													if (me.thread.get('trainingfiles')) {
														
														view.enable();
														
													} else {
														
														view.disable();
													}
										},
//										el: {
											
											click: function(btn) {
										
										/**
										 * refs #6603
										 * 
										 * Clicking on this button will enable user to download the original work files
										 *  associated with this task's question / lesson
										 */
										
											me.fireEvent('downloadtrainingfiles',me,btn,true,null,null,null );
											}
//									}
								}
												
								
								}
						       ]
					 });
			 
			 
			 }
			 
			 //Here we showing the instructions to lesson's tasks only not for Question's task.
			 if ( !me.thread.data.reference['question_id'] && this.thread.get( 'thread_type_id' ) == TABS.THREAD_TYPE_THREE  ) {
				 myitems.push({
						//Instructions should display here
//						xtype:'panel',
//						cls:'instructions',
//						bodyCls: 'instruction-panel-body-cls',
//						frame:true,
//						border:0,
//						items:[{
								xtype:'container',
								id : me.getId()+'-instruction-text',
								cls:'message-details-instructions',
//								style:{
//									'padding-left':'10px',
//									'padding-bottom':'30px'
//								},
								html: '', //this.instructionstext,
								listeners:{
									'afterrender':function( view ){
										CollaborationToolMgr.getInstructions( { 'reference_id': me.thread.get('reference_id'), 'video_id': null },function(r,t) {
											
											this.update( r );
										},view);
									}
								}
//						}]
					
				 });
//				 myitems.push({
//						xtype:'container',
//						id : me.getId()+'-instruction-text',
//						style:'padding-left:10px; padding-bottom:30px;',
//						html:this.instructionstext,
//						listeners:{
//							'afterrender':function( view ){
//								CollaborationToolMgr.getInstructions( { 'reference_id': me.thread.get('reference_id'), 'video_id': null },function(r,t) {
//									
//									this.update( r );
//								},view);
//							}
//						}
//				 });
			 }
			 var def = {
				 xtype : 'container',
				 id : me.getId()+'-header-container',
//				 style:{padding:'5px'},
				 cls:'header-container-cls',
				 region:'north',
			     items:myitems
			 };
			 Ext.getCmp(me.getId()+'posts').insert(0, new Ext.Container(  def ) );
			
			var seek = Ext.create('CHAT.view.ImageButton',{
		    	iconCls : 'link',
		    	renderTo: me.getId()+'post-desc-ref',
//		    	tooltipType : 'title',
				// 201312041802
		    	toolTip: (threadRecord.chaptername ? threadRecord.name+' - '+ threadRecord.chaptername : threadRecord.name),
		    	handler : function(){
				
				me.fireEvent('link', this, threadRecord);
				}
            });
	
			Ext.getCmp(this.getId()+'-header-container').doLayout();
		} else {	
			
			 headerContent = '<p class= "postdescription" ><font class="subject-cls">Subject : <b>'+Ext.String.htmlEncode(this.threadSubject)+ 
			 '</b></font><br/>'+recs.length+ 
			 ( recs.length > 1 ? MESSAGEDETAILS.POSTS_BY : MESSAGEDETAILS.POST_BY) +j+( j > 1 ? MESSAGEDETAILS.AUTHORS_WITH :MESSAGEDETAILS.AUTHOR_WITH)+
			 (this.thread.get('views'))+( this.thread.get('views') > 1 ? MESSAGEDETAILS.VIEWS : MESSAGEDETAILS.VIEW)+'</p>';
			  Ext.getCmp(me.getId()+'posts').insert(0,new Ext.Container({ cls : 'main-header-content', region:'north',style : {border: '1px solid #D3E2EE'},html : headerContent}));
		}
		//Here start the Task runner after posts are render.
		if( this.readPostTask.stopped ){
			
			this.startTask();
		}
		//Here get the Client view area post elements and update the array of the view post elements.
		var viewEles = this.getClientViewPostEles();
		this.updateClientViewPostEles( viewEles );
		
//		var msgWinActiveTab = this.ownerCt.down('tabpanel').getActiveTab();
		var msgWinActiveTab =Ext.ComponentQuery.query(' tabview')[0].getActiveTab();
		var activeTabSearch = msgWinActiveTab.down('searchfield');
		var searchValue = activeTabSearch.getValue();
		var msgDetailsSearch = this.down('searchfield');
		if ( ! Ext.isEmpty( searchValue ) && Ext.isEmpty( msgDetailsSearch.getValue() ) ||  !Ext.isEmpty(me.thread.listSearchValue) ){
			
			me.thread.listSearchValue = searchValue;//This config maintain the data list "search text" for the particula opened thread. 
			msgDetailsSearch.setValue( searchValue );
			msgDetailsSearch.onLiveSearch();
		}
		
	},this);
	var chaptersGrid = Ext.ComponentQuery.query('chapterslist')[0];
//	if (chaptersGrid.eventFiredValue){
//		chaptersGrid.eventFiredValue = false;
//	}
	this.callParent(arguments);
},

listeners: {
	afterRender : function (){
		
//	if (!this.tip) {
//		
//		this.tip = Ext.create('Ext.tip.ToolTip', {
//		    target: this.down('button[name=expand-collapse]').el,
////		    tooltipType :'title',
//		    html: MESSAGEDETAILS.COLLAPSEALL_TOOLTIP
//		});
//	}
 
	this.startTask();
	
},
afterlayout:function(){
//	fleXenv.fleXcrollMain(this.body.dom);
	var p = this;
	if( !Ext.isEmpty( p.body.down('div[class=contentwrapper]'))){
		p.body.on('scroll', function(el){
			console.log('body scrolled');
			var viewPostEles = this.getClientViewPostEles();
			this.updateClientViewPostEles( viewPostEles );
			
		}, p);
}
},
	resize:function() {
		
		if( !Ext.isEmpty( Ext.getCmp(this.getId()+'posts') ) ) {
			
			Ext.getCmp(this.getId()+'posts').doLayout();
		}
		
	},
	render: function(p){
		
		p.body.on('scroll', function(el){
			
			var viewPostEles = this.getClientViewPostEles();
			this.updateClientViewPostEles( viewPostEles );
			
		}, p);
		}
},

/**
 * It returns the store related to this post
 */
getStore : function() {
	
	return this.store;
},
/**
 * To set the subject as thread subject
 * @param subject 
 */
setThreadSubject:function( subject ){
	
	this.threadSubject = subject;
},
/**
 * To set the Instructions as thread Instructions
 * @param subject 
 */
setInstructions : function (value ){
	Ext.getCmp(this.getId()+'-instruction-text').update(value);
},

/**
 * Fires after the component rendering is finished.
 */
afterRender:function() {
	
	var me = this;
	this.callParent(arguments);
	me.mon(me.body,{'scroll':function(dom,event,target){
		
	}});
	
},

setReplyAdded:function(added){
	
	this.modified = added;
	
},

isModified : function(){
	
	return this.modified;
},

setUpdated : function( value ){
	
	 this.updated = value;
},
	/**
	 * This method used to find the client view area post elements array in message details window. 
	 */
	getClientViewPostEles : function( from ){
		
		var posts = Ext.getCmp(this.id+'posts').items;
		var index = 0;
		var clientViewEles=[];
		
		posts.each( function(post, idx) {
	
			if( idx > 0 ){
				
				var postRegion = post.el.getRegion();
				var detailWinRegion = this.el.getRegion();
				
				if( ( detailWinRegion.top > postRegion.top && detailWinRegion.bottom < postRegion.bottom ) ||
						( detailWinRegion.top < postRegion.top && detailWinRegion.bottom > postRegion.bottom )||
						( detailWinRegion.top > postRegion.top && postRegion.bottom > detailWinRegion.top && detailWinRegion.bottom > postRegion.bottom )||
						( detailWinRegion.top < postRegion.top && postRegion.top < detailWinRegion.bottom && detailWinRegion.bottom < postRegion.bottom )
							
					){
					if( post.readflag == 1 ){
							
							clientViewEles.push( {'posteleid':post.getId(),'timestamp':new Date().getTime() / 1000,'postuid':post.postId });	
					}
				}
			}
		},this);
	
		return clientViewEles;
	},
	
	/**
	 * This method used to update the client view area post elements array in message details window. 
	 */
	updateClientViewPostEles : function( view ){
	
		var matched =[];
		var nonmatched = [];
		for( var i=0; i < view.length ;i++ ){
			
			if( this.ClientViewPostsEles.length == 0 ){
				
				this.ClientViewPostsEles = view;
				return ;
				
			}else{
				
				var record =  Ext.Array.filter( this.ClientViewPostsEles, function( element, index, array ){
							
							return element.posteleid == view[i].posteleid;
					},this );
				if( ! Ext.isEmpty( record )){
					
						matched.push( record[0] );
				}else {
						nonmatched.push( view[i] );
				}
			}
		}
		
		this.ClientViewPostsEles = matched;
		
		for( var j = 0 ; j < nonmatched.length ;j++ ){
			
			this.ClientViewPostsEles.push( nonmatched[j] );
		}
		
	},
	
	/**
	 * This method used to start the TaskRunner and identify the client view area posts.
	 */
	startTask : function() {
		
		 var runner = new Ext.util.TaskRunner();
		 this.readPostTask = runner.newTask({
			
			run:function( ){
				
				var viewPostEles = this.getClientViewPostEles();
				
				for(var i=0 ; i < viewPostEles.length ; i++ ){
					
					var record = Ext.Array.filter( this.ClientViewPostsEles, function( element, index, array ){
						
									return element.posteleid == viewPostEles[i].posteleid;
								},this );
					if( !Ext.isEmpty( record )){
						
						if(  (viewPostEles[i].timestamp - record[0].timestamp) >= 5  ){
							
							this.fireEvent('updateReadPost', this, record[0].postuid, record[0].posteleid ); 
						}
					}
				}
			},
			interval: 5000,
			scope:this
		 });
		 
		 this.readPostTask.start();
	}

});
			