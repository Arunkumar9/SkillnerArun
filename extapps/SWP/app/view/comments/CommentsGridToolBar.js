/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23707		  Tapaswini Sabat		201311171420		Added Tooltip for the quiz and lock icons.
 **/ 
Ext.define('SWP.view.comments.CommentsGridToolBar',{
             extend :'Ext.toolbar.Toolbar',
             alias: 'widget.commentsgridtoolbar',
             cls:'comments-grid-cls player-controls-toolbar',
             requires: ['Ext.toolbar.Toolbar','SWPCommon.view.BadgeButton'],
             height:38,
             initComponent : function () {
                          var me = this;
			var defaulthover = 'x-over x-btn-over x-btn-default-toolbar-small-over over';
//			var comboStore = Ext.create('Ext.data.Store', {
//			    fields: ['language_id'],
//			    autoLoad:true,
//			    proxy : {
//					type : 'direct',
//					api : {
//						read : VideoRecordMgr.getLanguages
//					},
//					reader : {
//						type : 'json'
//					},
//					writer : {
//						type : 'json'
//					}
//				},
//				listeners:{
//					load : function( store ) {
//						var combo = Ext.getCmp('lang-combo');
//
//						if( !combo.selectedRecord ) {
//							
//							combo.select( store.data.items[0] );
//							combo.selectedRecord = store.data.items[0];
//							
//						}else {
//							
//							var language = combo.selectedRecord.get('lang');
//							var index = combo.store.findBy( function( rec, id ) {
//								
//								return ( rec.get('language_id') == language );
//								
//							},this);
//	
//							if( index > 0 ) {
//								
//								var record = combo.store.getAt( index ) ;
//								combo.select( record );
//								combo.selectedRecord = record ;
//								
//							} else {
//								
//								combo.select( store.data.items[0] );
//								combo.selectedRecord = store.data.items[0];
//							}
//						}
//					}
//				}
//			});
			
                                       Ext.apply(this, {
				xtype: 'toolbar',
				dock: 'top',
				layout: 'column',
				items: [
				{
					text: GRID.NOW_PLAYING,
					xtype : 'label',
					cls : 'now-playing'
				},{
					text: '',
					cls: 'chapter-tb-text',
					width : '16%',
					xtype: 'label',
					id : 'chaptertbtext'
				},{
					xtype:'container',
					layout:'hbox',
					cls:'x-playercontrols',
					items:[
						{
							xtype : 'button',
							iconCls: 'previouslesson',
							tooltip: GRID.PREV_LESSON,
							width:32,
							height:30,
							handler: function() {
		    					             me.fireEvent('prevlesson', this);
			    				}
						},{
							xtype : 'button',
							width:32,
							height:30,
							iconCls: 'previouschapter',
		                 				tooltip: GRID.PREV_CHAPTER,
		                 				handler: function() {
		                 					me.fireEvent('prevchapter', this);
		                 				}
			    			},{
			    				xtype : 'button',
			    				cls:'fw-rw-mv',
			    				width:32,
								height:30,
			    				iconCls: 'rewindmovie',
			    				tooltip: GRID.REWIND_MOVIE,
			    				width:30,
			    				handler: function() {
			    					me.fireEvent('rewindmovie', this);
			    				}
			    			},{
			    				xtype : 'button',
			    				cls:'fw-rw-mv',
			    				width:32,
								height:30,
			    				iconCls: 'forwardmovie',
			    				tooltip: GRID.FORWARD_MOVIE,
			    				
			    				handler: function() {
			    					me.fireEvent('forwardmovie', this);
			    				}
			    			},{
			    				xtype : 'button',
			    				width:32,
								height:30,
			    				iconCls: 'nextchapter',
			    				tooltip: GRID.NEXT_CHAPTER,
			    				handler: function() {
			    					me.fireEvent('nextchapter', this);
			    				}
			    			},{
			    				xtype : 'button',
			    				width:32,
								height:30,
			    				iconCls: 'nextlesson',
							tooltip: GRID.NEXT_LESSON,
							handler: function() {
		    					             me.fireEvent('nextlesson', this);
		    				             }
						}
					]
				},{
				xtype : 'container',
				cls : 'settings-group',
				layout : 'hbox',
				items : [
							{
								xtype : 'button',
								border:false,
           						iconCls: 'icon-report',
		           				style:'float:right; ',
		           				height: 28,
								width: 25,
		           				tooltip : QUIZ.REPORT,
		        				handler: function() {
		        					me.fireEvent( 'quizreport');
		        				}
		        			},{
								xtype : 'button',
								height: 28,
								width: 25,
								iconCls:'training-files-cls',
								//201311171420
								tooltip : { 
									text : GRID.COURSE_TRAINING_FILES,
									anchor :'right',
									mouseOffset :[10,0]
								},
								cls : 'trainingfiles',
								name :'training_files',
								style:'border-style: none !important;',
								handler: function() {
									
									me.fireEvent('downloadtrainingfiles', me, this, null, null, null,null );
								}
							
							},
							{
								xtype : 'button',
								iconCls: 'videocaptionsettings ',
								style:'border-style: none !important;',
								height: 30,
								width: 30,
								cls : 'videocaptions',
//								tooltip: GRID.USER_SETTINGS_BUTTON,
								tooltip : { 
									text : GRID.USER_SETTINGS_BUTTON,
									anchor :'right',
									mouseOffset :[10,0]
								},
								handler: function( btn ){
									
									me.fireEvent( 'openvideocaptionsettings',me,btn );
								}
							}
//							{
//								xtype:'combobox',
//								store: comboStore,
////								style:'margin-left: 2px;',
//							    queryMode: 'local',
//							    displayField: 'language_id',
//							    valueField: 'language_id',
//							    autoSelect:true,
//							    forceSelection:true,
//							    editable:false,
//							    id:'lang-combo',
//							    listeners:{
//							    	
//							    	select:function( combo,recs,opts ) {
//							    		
//							    		me.fireEvent('captionselected',me,combo,recs);
//							    	}
//							    }
//							}								
							
				         ]
                       },{
                       	xtype:'container',
                       	layout:'hbox',
                       	cls:'message-comment-group',
                       	items:[
                       		{
								xtype:'badgebutton',
								iconCls: 'Messages',
								id:COMMENTSGRID_MSGBTN.MESSAGES_BTN_ITEM_ID,
								style:'float:right; ',
								tooltip: GRID.MESSAGE_WINDOW,
								width:30,
								height: 26,
								badgeText: ' ',
								disabled:false,
									listeners: {
										afterrender: function(){
											me.fireEvent('setinitialmessagecount',me);
										}
									},
								handler: function() {
									me.fireEvent('showmessagingwindow', me);
								}
							},{
								xtype : 'button',
								tooltip: GRID.PAUSE_COMMENT,
								iconCls:'pause-comment-cls',
								style:'float:right',
								width:30,
								height: 26,
								handler: function() {
								
									SWP.isCommentIconClicked = true; 
									me.fireEvent('commentandpause', me, this);
								}
							},{
								xtype : 'button',
								tooltip: GRID.COMMENT,
								iconCls:'comment-cls',
								width:30,
								height: 26,
								style:'float:right',
								handler: function() {
									SWP.isCommentIconClicked = true;
								    me.fireEvent('commentmeafterexpand', me, this);
								}
							}
                       	]
                       }] //End of Items
                                       }); //End of Apply
                   this.callParent(arguments);
             }  //End Of InitComponent
});
