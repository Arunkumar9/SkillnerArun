/*
 * Task/Issue      Author    			UniqueID        Comment   
 * ---------------------------------------------------------------------------------------------------------------------------------------------------
 * 22844		   Venkatesh Teja		201311221905	Changed code to solve issue that status icon is not changing on clicking on chapter list, if immediate chapter is quiz..
 * 23707		   Tapaswini Sabat		201311171420	Added Tooltip for the quiz and lock icons.
 * 23768  		   Venkatesh Teja		201311191850	Added code to get correct tool tip for quiz status icon.
 * 23707		   Tapaswini Sabat		201311301513	Now the tooltip in details window is coming fine in chapters list.
 */
Ext.define('SWP.view.chapters.List', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.chapterslist',

    requires: ['SWP.view.DataGrid','Ext.toolbar.Toolbar','SWP.feature.GroupingBtn','SWPCommon.store.TaskStatuss'],

	title: CHAPTERlIST.TITLE,
	collapsible: true,
	collapsed: false,
	animCollapse: true,
	margins: '5 0 5 5',
	layout:'anchor',
	split: true,
	floatable:false,
	flexCroll:false,
	rendererFn: Ext.emptyFn,
	collapseFirst: false,
	style:"z-index:1;",
	frame : false,
	minWidth :250 ,
	cls : 'coursecontent-list',
	initComponent: function() {
		var chs = Ext.create('SWP.store.Chapters',{autoLoad:true});
		this.isItFromQuiz = false;	
		var me = this;
		
		this.eventFiredValue = false;
		this.tools = [{
			xtype:'button',
            iconCls:'fully-completed',
            id : me.getId()+'-courseTaskSummary',
            cls:'x-course-task-summary',            
            border:0,
            width:24,
            height:24,
            tooltip: '',
//            tooltipType : 'title',
             style:'float:left;',
             hidden : true,
              handler: function( event, toolEl, panel ) {
            	  
            	  me.fireEvent( 'showcoursetasksummarywin',me );
//            	  me.openWindow();
              }
         }];
		Ext.apply(this, {
			items: [{
				xtype: 'gridpanel',
				markDirty : false,
				collapsible: false,
				useArrows: true,
				store: chs,
				multiSelect: false,
				singleExpand: true,
				trackOver: true,
				scroll: false,
				scope:this,
				stripeRows: true,
				rowLines:true,
				flexCroll:false,
				cls:'chapterslist-grid-cls',
				viewConfig: {
					flexCroll:true,
					getRowClass: function(record, rowIndex, rowParams, store){
					
						if( record.get('uid').substr(0,1) == 'Q' ) {
							
							return "hidequiz-cls";
						}
						return record.get("seen") ? "row-seen" : "row-unseen";
					 },
					 style : {
							overflow: 'auto', overflowX: 'hidden'
							}
				 },
				anchor:'100% 100%',
				autoScroll:true,
				hideHeaders: true,
				features: [{
					id: 'lesson',
					ftype: 'groupingbtn',
					groupHeaderTpl: '{[values.name.substring(5)]}',
					hideGroupedHeader: true,
					enableGroupingMenu: false,
					headerBtns:[{
			        	isDisabled:function(){
			        		return true;
			        	},
			        	groupBadge: function( rows ){
			        		var count = rows.children[0].get('unreadCount');
			        		return count ;
			        	},
			        	isVisible:function( rows ){
			        			
				        		if( !Ext.isEmpty( rows.children[0].get('statusCls') ) ){
				        			return true;
				        		}else{
				        			return false;
				        		}
			        			
			        	},
			        	tooltip:function( rows ) {
			        		
			        		//201311191850
			        		var tooltip =rows.children[0].get('statusTooltip');
			        		
			        		if ( !Ext.isEmpty(tooltip) && tooltip.substr(0,10) == 'TASKSTATUS'){
			        			
			        			var statusCode = rows.children[0].get('statusCls').split('-')[1];
			        			
			        			if( rows.children[0].get('uid').substr(0,1) == 'Q'){
			        				
			        				if( statusCode == "4" && SWP.instructLogin){
			        					
			        					return TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS07;
			        					
			        	    		}else if( statusCode == "4" && !SWP.instructLogin){
			        	    			
			        	    			return TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS04;
			        	    			
			        	    		}else if( statusCode == "5" && SWP.instructLogin){
			        	    			
			        	    			return TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS_BY_STUDENT;
			        	    			
			        	    		}else if( statusCode == "5" && !SWP.instructLogin){
			        	    			
			        	    			return TASKSTATUS.QUIZ_TOOLTIP_TASKSTATUS_BY_YOU;
			        	    			
			        	    		}
			        				
			        				else{
			        					return eval( tooltip );
			        			}
			        			} else{
			        				//201311301513
		        					if( statusCode == "5" && !SWP.instructLogin){
		        						
		        						return TASKSTATUS.OPEN_UPDATED_BY_YOU;
		        					}else{
		        						
		        						return eval( tooltip );
		        					}
			        		}
			        		}else {
			        			return tooltip;
			        		}
			        		//Ext.isEmpty( tooltip) ? '' : eval( tooltip );
			        		
			        	},
			        	getClass : function( rows ) {
			        		
			        		var cls =rows.children[0].get('statusCls');
			        		return Ext.isEmpty(cls) ? ' ' : cls ;
			        		
			        	},
			        	getHeaderIconCls : function( rows, args, headerText, fromabc ){
			        		
			        		var record =rows.children[0];
			        		if( record.get('uid').substring(0,1) == 'Q' ){
			        			//201311171420
			        			var quizStatus  = record.get('quizStatus');
				        		
			        			if( quizStatus == CHAPTERlIST.REGULAR_QUIZ_COMPLETED ){
			        				
			        				return [ 'regular-quiz-completed', CHAPTERlIST.REGULAR_QUIZ_COMPLETED_TIP];
			        			}else if( quizStatus == CHAPTERlIST.REGULAR_QUIZ_INCOMPLETE ){
			        				
			        				return ['regular-quiz-incomplete',CHAPTERlIST.REGULAR_QUIZ_INCOMPLETE_TIP];
			        			}else if( quizStatus == CHAPTERlIST.REQUIRED_QUIZ_INCOMPLETE ){
			        				
			        				return ['required-quiz-incomplete',CHAPTERlIST.REQUIRED_QUIZ_INCOMPLETE_TIP];
			        			}else if( quizStatus == CHAPTERlIST.REQUIRED_QUIZ_PASSED ){
			        				
			        				return ['required-quiz-passed', CHAPTERlIST.REQUIRED_QUIZ_PASSED_TIP];
			        			}else if( quizStatus == CHAPTERlIST.REQUIRED_QUIZ_FAILED ){
			        				
			        				return ['required-quiz-failed', CHAPTERlIST.REQUIRED_QUIZ_FAILED_TIP];
			        			}
			        			
			        		} else {
			        			
			        			var chaptersCount = 0;
			        			var seenChaptersCount = 0;
			        	
			        			chs.each(function(rec){
			        				
			        				if( rec.get('video_id') == record.get('video_id')){
			        					chaptersCount++;
			        					if( rec.get('seen')){
			        						seenChaptersCount++
			        					}
			        				}
			        			});
			        			if( (chaptersCount == seenChaptersCount) && (record.get('lessonCompletedStatus') == true) ){
			        				
			        				 return ['lesson-close-expanded',''];
			        			}else{
			        				
			        				 return ['lesson-open-expanded',''];
			        			}
			        		}
			        		
			        	},
			        	getGroupExpandCollapseState:function( collapsed ,rows ){
                       	 
                            if( Ext.isEmpty( collapsed.record.children)){
                           	 var record = collapsed.record;
	                             if( record.get('uid').substring(0,1) == 'Q' ){
	                                     return 'swp-content-collapsed ';
	                             }else{
	                                     return 'swp-content-expand ';
	                             }
                            }
                        },
                       getGroupStatusCls:function( rows, args, headerText, fromabc ){
                           var record =rows.children[0];
                          
                           if( record.get('uid').substring(0,1) == 'Q' ){
                              
                               var quizStatus  = record.get('quizStatus');
                              
                               if( quizStatus == CHAPTERlIST.REGULAR_QUIZ_COMPLETED ){
                                  
                                   return 'swp-content-completed swp-quiz-content ';
                               }else if( quizStatus == CHAPTERlIST.REGULAR_QUIZ_INCOMPLETE ){
                                  
                                   return 'swp-content-incomplete swp-quiz-content ';
                               }else if( quizStatus == CHAPTERlIST.REQUIRED_QUIZ_INCOMPLETE ){
                                  
                                   return 'swp-content-incomplete swp-quiz-content ';
                               }else if( quizStatus == CHAPTERlIST.REQUIRED_QUIZ_PASSED ){
                                  
                                   return 'swp-content-completed swp-quiz-content ';
                               }else if( quizStatus == CHAPTERlIST.REQUIRED_QUIZ_FAILED ){
                                  
                                   return 'swp-content-completed swp-quiz-content ';
                               }
                              
                           } else {
                               var chaptersCount = 0;
                               var seenChaptersCount = 0;
                               chs.each(function(rec){
                                  
                                   if( rec.get('video_id') == record.get('video_id')){
                                       chaptersCount++;
                                       if( rec.get('seen')){
                                           seenChaptersCount++
                                       }
                                   }
                               });
                               if( (chaptersCount == seenChaptersCount) && (record.get('lessonCompletedStatus') == true)){
                                  
                                    return 'swp-content-completed';
                               }else{
                                  
                                    return 'swp-content-incomplete';
                               }
                           }
                       },
			        	getHeaderIconCls2 : function( rows, args, headerText, fromabc ){
			        		var record =rows.children[0];
		        			var requiredSubsequent  = record.get('quizRequiredToPass');
							//201311171420
		        			if( !Ext.isEmpty(requiredSubsequent) ){
		        				return ['required-subsequent-cls',CHAPTERlIST.REQUIRED_SUBSEQUENT_CLS_TIP] ;
		        			} else {
		        				return false;
		        			}
			        	},
			        	getHeaderText : function( rows ){

			        		
			        		var record =rows.children[0];
			        		
			        		if( record.get('uid').substring(0,1) == 'Q' ){
			        			
			        			var quizclosed = record.get('seen');
			        			
			        			if( quizclosed ){
				        			
			        				if(!Ext.isEmpty( record.get('quizRequiredToPass') )){
			        					return 'quizlocked seen-font';
			        				}else{
			        					
			        					return 'seen-font';
			        				}
			        			}else{
			        				
			        				if(!Ext.isEmpty( record.get('quizRequiredToPass') )){
			        					return 'quizlocked notseen-font';
			        				}else{
			        					
			        					return 'notseen-font';
			        				}
			        			}
			        			
			        		} else {
			        			var chaptersCount = 0;
			        			var seenChaptersCount = 0;
			        	
			        			chs.each(function(rec){
			        				
			        				if( rec.get('video_id') == record.get('video_id')){
			        					chaptersCount++;
			        					if( rec.get('seen')){
			        						seenChaptersCount++
			        					}
			        				}
			        			});
			        			if( (chaptersCount == seenChaptersCount) && (record.get('lessonCompletedStatus') == true)){
			        				if( !Ext.isEmpty( record.get('quizRequiredToPass') )){
			        					return 'quizlocked seen-font';
			        				}else{
			        					
			        					return 'seen-font';
			        				}
			        					//return 'seen-font';
			        			}else{
			        				if( !Ext.isEmpty( record.get('quizRequiredToPass') )){
			        					return 'quizlocked notseen-font';
			        				}else{
			        					
			        					return 'notseen-font';
			        				}
			        				// return 'notseen-font';
			        			}
			        		}
			        		
			        	
			        	},
			        	handler:function(view, groupName, rowElement, e){
			        		Ext.getBody().mask();
//			        		Ext.getBody().hide();
			        		var courseRecord = view.getStore();
			        		var selectedGroup = courseRecord.findRecord('ordering', groupName );
			        		var recordTrainingfiles =  selectedGroup.get('trainingfiles');
	        				var recordTaskstatus =  selectedGroup.get('taskStatus');
	        				var recordInstructions = selectedGroup.get('instructions');
	        				var isQorL = selectedGroup.get('video_id').substr(0,1);
	        				var VideoId = selectedGroup.get('video_id').split( isQorL );
	        				var recordVideoId =  VideoId[1];
	        				var taskRecordId = selectedGroup.get('taskId');
//			        		for(i = 0; i < courseRecord.items.length; i++ ){
//			        			
//			        			if( courseRecord.items[i].get('ordering') == rowElement ){
//			        			
//			        				var recordTrainingfiles =  courseRecord.items[i].get('trainingfiles');
//			        				var recordTaskstatus =  courseRecord.items[i].get('taskStatus');
//			        				var recordInstructions = courseRecord.items[i].get('instructions');
//			        				var isQorL = courseRecord.items[i].get('video_id').substr(0,1);
//			        				var VideoId = courseRecord.items[i].get('video_id').split( isQorL );
//			        				var recordVideoId =  VideoId[1];
//			        				var taskRecordId = courseRecord.items[i].get('taskId');
////			        				var taskRecordId = view.store.data.items[i].data['taskId'];
//
//			        			}
//			        		}
	        				
	        			/*Modified to handle lesson instruction icon handler - kan*/
			        	var instructionClicked = rowElement.getTarget().className.indexOf('instructions-cls');
			        	if( (!( recordTaskstatus > -1 ) &&  recordVideoId ) ||  instructionClicked > -1 ){
			        		
			        			
	        					CollaborationToolMgr.getInstructions( { 'reference_id': null, 'video_id': recordVideoId },function( r,t ) {
	        						
	        						if( t.status ) {
	        							
	        							var win =Ext.create('Ext.window.Window',{
						        			title:INSTUCTIONSWIN.TITILE,
						        			autoHeight : true,
						        			modal : true,
						        			width : 600,
						        			height : 350,
						        			scope:this,
						        			flexCroll:false,
						        			cls:'instructions-window',
						        			bodyCls : 'instructions-win',
		        							bodyStyle:{
							        				"overflow": "auto !important"
		        							},
											
												 dockedItems:[{
												              xtype:'toolbar',
												              dock:'top',
												              items:[
															{
																xtype:'label',
																html:'<p style="padding-left:20px !important"><b>Instructions</b> <br / ></p>'
																	
															},
															"->",
															{ xtype: 'tbspacer',width:'450' },
															{
																//xtype:'button',
																icon: 'images/trainingfileicon.png',
																tooltip: GRID.TRAINING_FILES,
																tooltipType : 'title',
																cls : 'instruction-win-training-icon',
																style:'float:right !important;',
																id:me.getId()+'trainingfiles',
																listeners : {
																 	render : function ( view ){
																	 	if ( isQorL != 'L' ){
																	 		
																		 view.setVisible(false);
																	 	}
																 	}
																},
																handler:function( btn ) {
																	me.fireEvent('downloadtrainingfiles',me,view,false,groupName,true,null );
																	
																}
															}
															]
												 }],items:[
																		{ 
																			//Instructions should display here
																			
																			xtype:'container',
																			flexCroll:false,
																			cls:'listinstructions',
																			id:me.getId()+'listinstructions',
																			html :'Instructions'
																			
																		}
																	 ]
									 
						        		},this).show();
						        		Ext.getCmp( me.getId()+'listinstructions' ).getEl().dom.innerHTML = r;
						        		if( recordTrainingfiles !== true ){
						        			
						        				Ext.getCmp( me.getId()+'trainingfiles' ).disable(true);
						        		}
						        		Ext.getBody().unmask();
	        						} else{
	        							Ext.getBody().unmask();
	        						}
	        					},this);
//	        					Ext.getBody().show();
			        	}else {
			        		
			      			var modelRecord;
			      			var record = {};
			      			record['thread_id']= taskRecordId;
			      			record['thread_type_id'] = 3;
			            	 
			            	  if(SWP.mw){
			            		  
			            		  SWP.mw.focus();
			            	  }
			            	  
			            	taskRecord = CollaborationToolMgr.getSingleMessage( record,function(r,t) {
			            			
				    				modelRecord = Ext.create('SWPCommon.model.Message',r);
	//			      				me.fireEvent('showmessagingwindow',me,taskRecordId,false,true);
				    				Ext.getBody().unmask(); 
				    				if( !me.eventFiredValue ){
				    					
//				    					me.eventFiredValue = true;
				    					me.fireEvent('showmessagingwindow',me,taskRecordId,false,true);
//				    					Ext.getBody().show();

				    				} else {
				    					var messagingWindow = Ext.ComponentQuery.query('messagewindow');
				    					if( messagingWindow.length > 0 ) {
				    			    		
				    			    		messagingWindow[0].show();
				    					}
//				    					Ext.getBody().show();
				    				}
			      			});
			        	}
			        	}
			        }],
			        listeners:{
								   	
//			        	 groupcollapse : function( view, node, group, eOpts  ){
////			     	    	view, groupHeader, groupName
//			     	    	var record = view.getStore().findRecord('ordering',groupName);
//			     	    	if( record.get( 'video_id' ).substr(0,1) == 'L' ){
//			     	    		var headeIcon = groupHeader.down('.x-grid-cell-inner').down('.group-header-icon');
//			     	    		var lessonOpen = headeIcon.dom.className.indexOf('lesson-open-expanded');
//			     	    		var lessonClose = headeIcon.dom.className.indexOf('lesson-close-expanded');
//			     	    		if( lessonOpen != -1 ){
//			     	    			headeIcon.addCls('lesson-open-collapsed');
//			     	    			
//			     	    		}else if( lessonClose != -1 ){
//			     	    			
//			     	    			headeIcon.addCls('lesson-close-collapsed');
//			     	    		}
//			     	    	}
//			     	    		
//			     	    	
//			     	    },
//			     	    groupexpand:function( view, node, group, eOpts ){
//			     	    	var record = view.getStore().findRecord('ordering',groupName);
//			     	    	if( record.get( 'video_id' ).substr(0,1) == 'L' ){
//			     	    		
//			     	    		var headeIcon = groupHeader.down('.x-grid-cell-inner').down('.group-header-icon');
//			     	    		var lessonOpen = headeIcon.dom.className.indexOf('lesson-open-expanded');
//			     	    		var lessonClose = headeIcon.dom.className.indexOf('lesson-close-expanded');
//			     	    		if( lessonOpen != -1 ){
//			     	    			headeIcon.removeCls('lesson-open-collapsed');
//			     	    			
//			     	    		}else if( lessonClose != -1 ){
//			     	    			
//			     	    			headeIcon.removeCls('lesson-close-collapsed');
//			     	    		}
//			     	    	}
//			     	    }
//			        	
			        }
				 }],
				columns: [
//				          {
//					header: 'Lesson',
////					flex: 1,
//					sortable: false,
//					dataIndex: 'ordering'
//					},
//					{
//						xtype:'actioncolumn', 
//					    width:25,
//					    align: 'right',
//					    items: [{
//					    	
////						iconCls:'now-seen'
//						}]
//					},
					{
						text: 'Button',
						width: 30,
						sortable: true,
						dataIndex: 'seen',
						markDirty : false,
						align: 'right',
						renderer: function(value,metadata,r,rowIndex, colIndex, store, view) {
						view.markDirty = false;
						
								if (!value) {
									metadata.tdCls  = 'not-yet-seen';
								}else{
									metadata.tdCls  = 'seen-chapter';
								}
								return '.';
							}
						},{
					header: 'Chapter',
					flex: 2,
					sortable: false,
					dataIndex: 'name',
					renderer: function(value,metadata,r, rowIndex, colIndex, store, view) {
							
								if (r.get('seen')) {
									metadata.tdCls = 'seen-font';
								} else {
									metadata.tdCls = 'notseen-font';
								}
								return value;
						}
					}
					,{
					text: 'Button',
					flex: 0.5,
					sortable: true,
					dataIndex: 'start',
					align: 'center',
					renderer: function(value,metadata,r) {
						
							if (me.rendererFn(r)) {
								metadata.tdCls  = 'film-start';
								me.fireEvent('startchapter', me, r);
							}
							else
								metadata.tdCls  = 'film';
							
							return ' ';
						}
					},{
					xtype: 'templatecolumn',
					header: 'Start',
					flex: 1,
					hidden: true,
					dataIndex: 'user',
					tpl: Ext.create('Ext.XTemplate', '{start}')
				}
				]
			}] ,

			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				layout:'fit',
				cls:'chapter-list-toolbar-cls',
				items: [{
					xtype: 'combo',
					fieldLabel: 'Search',
					store: chs,
					id: 'search-combo',
					displayField: 'description',
					typeAhead: false,
					hideTrigger:true,
					queryMode: 'local',
					anchor: '98%',
					labelStyle: 'width:40px; margin-left : 10px;',
					listConfig: {
					    loadingText: 'Searching...',
					    emptyText: 'No matching chapters found.',
					    height: 1,
					    maxHeight: 1,
					    disabled: true,
					    hidden: true,
					    // Custom rendering template for each item
					    getInnerTpl1: function() {
					    	return '';
					    }
					},
					
					doQuery: function(qs,fa) {
						qs = qs || '';
						this.lastQuery = qs;
						this.store.clearFilter(true);
						this.store.filter({ property: 'transcript', anyMatch: true, value: qs });
					}
				}]
			}]
		});

		this.callParent(arguments);
		
		chs.on('beforeload', function() {
			this.fireEvent('beforeload', this);
			return true;
		}, this);
		chs.on('load', function() {
			this.fireEvent('load', this.down('gridpanel'));
			return true;
		}, this,{single : true} );
		
		var grid = this.down('gridpanel');
		grid.on('selectionchange', function(selModel, selections, eOpts){
			this.fireEvent('chapterchanged', this, grid, selModel, selections, eOpts);
		}, this);
		grid.on('itemclick', function(view, rec, item, idx, e, eOpts){
			this.fireEvent('chapterselected', this, grid, view, rec, item, idx, e, eOpts);
			 if( !Ext.isEmpty( view.prevSelectedQuiz ) ){
	            	view.prevSelectedQuiz.addCls('swp-content-collapsed');
	            	if( view.prevSelectedQuiz.dom.className.indexOf('swp-content-expand') != -1 ){
	            		view.prevSelectedQuiz.removeCls('swp-content-expand');
	            	}
	            	view.prevSelectedQuiz = undefined ;
	            }
		}, this);
		
		
//		chs.load();
	},
	listeners:{
		
		expand:function(p, eOpts){
			
			this.fireEvent('showreplaynextbuttons',this );
		},
		collapse : function( p, eOpts ){
			
			this.fireEvent('showreplaynextbuttons',this );
			
		}
	},
	
	onRender: function() {
		this.callParent(arguments);
	},
	refreshIcons: function(selected, fromQuiz ) {
		
		var swpplayer = Ext.ComponentQuery.query('swpplayer')[0];
		var node = this.down('dataview').getNode(selected);
		if ( node  && ( fromQuiz || ( selected && selected.get('video_id').substr(0,1) != 'Q')  )){
					
			var prevPlayingNode = Ext.select('.film-start');
			var  firstCell = Ext.fly(node).select('.x-grid-cell-first');
			var  rowBody = Ext.fly(node).select('.x-grid-td');
			var prevSelected = Ext.fly(node).select('currentlyselected');
			
			if ( !Ext.isEmpty(prevPlayingNode) && prevPlayingNode.elements.length > 0 ) {
				if ( prevPlayingNode.elements[0] !== node ) {
					//
					// If we are within the same chapter then we don't need to replace CSS
					//
					Ext.fly(prevPlayingNode.elements[0]).removeCls('film-start').addCls('film');
					var prevSeen = Ext.select('.now-seen');
					if( !Ext.isEmpty(Ext.fly(prevSeen.elements[0])) ){
						
						Ext.fly(prevSeen.elements[0]).removeCls('now-seen');
					}
					var currentSelections = Ext.select('.currentlyselected');
					
					for( var j=0;j < currentSelections.elements.length; j++ ) {
						
						var currentSelectedNode = Ext.fly(currentSelections.elements[j]);
						if( currentSelectedNode ) {
							
							
							currentSelectedNode.removeCls('currentlyselected');
						}
					}
				}
			}
			if( selected.get('video_id').substr(0,1) != 'Q' ){
				
				for( var i=0;i<rowBody.elements.length; i++ ) {
					
					var nodeValue = Ext.get(rowBody.elements[i]);
					if( nodeValue ) {
						
						nodeValue.addCls('currentlyselected');
					}
				}
				if( !Ext.isEmpty(Ext.fly(node).select('.film').elements) ){
					
					firstCell.addCls('now-seen');
					Ext.fly(node).select('.film').addCls('film-start').removeCls('film');
				}
				
                this.down('grid').getSelectionModel().select([selected],false,true);
			}	
		} else if( node || this.isItFromQuiz) {		//201311221905
		
			var prevPlayingNode = Ext.select('.film-start');
			if( prevPlayingNode && prevPlayingNode.elements[0])
				Ext.fly(prevPlayingNode.elements[0]).removeCls('film-start').addCls('film');
			var prevSeen = Ext.select('.now-seen');
			if( prevSeen && prevSeen.elements[0] )
				Ext.fly(prevSeen.elements[0]).removeCls('now-seen');
			var currentSelections = Ext.select('.currentlyselected');
			
			for( var j=0;j < currentSelections.elements.length; j++ ) {
				
				var currentSelectedNode = Ext.fly(currentSelections.elements[j]);
				if( currentSelectedNode ) {
					
					
					currentSelectedNode.removeCls('currentlyselected');
				}
			}
		}
		//If the chapter/Quiz name is more then 30 characters then we are showing the chapter name 
		// with ...
		
		var chapterName = '';
		if (fromQuiz || selected.get('uid').substr(0,1) == "Q"){
			
			chapterName= selected.get('lesson');
		} else {
			
			chapterName = selected.getChapterName();
		}
		
		var chapName = chapterName;
		
		if( chapterName.length > 30 ){
			
		 chapName = chapterName.substr(0,26)+" ...";
		} 
		var chapcomp = Ext.ComponentQuery.query('commentsgridtoolbar #chaptertbtext')[0];
		chapcomp.setText(chapName);
					
		//
		// If the chapter name is big then we need to show the full chapter name on mouse over. 
		// Hence, refresh the tool tip whenever there is a change in chapter name,
		//
		
		if( chapcomp.tooltip ){
			
			chapcomp.tooltip.destroy();
		}
		
		chapcomp.tooltip = Ext.create('Ext.tip.ToolTip', {
				target: chapcomp.getId(),
				style:'white-space:nowrap;',
				html: chapterName//selected.getChapterName()
		});
		
		
	},
	setRenderer: function(fn) {
		this.rendererFn = fn;
	},
	selectMatchingChapterByUid: function(uid) {
		var chapters = Ext.StoreManager.lookup('chapters');
		var recIndex = chapters.find('uid', uid );
		
		if ( recIndex >= 0 ) {
			rec = chapters.getAt( recIndex );
			if ( Ext.isEmpty( rec ) ) {
				this.refreshIcons( rec );
				return rec;
    		}
			var select = rec.get('uid').substr(0,1);
			
			if ((select == 'Q') || (rec.get('quizRequiredToPass').length == 0)) {
				this.refreshIcons( rec );
			} 
			
			return rec;
		} else {
			return null;
		}
	},
	getSelectedChapter: function() {
		return this.down('gridpanel').getSelectionModel().getLastSelected();
	},
	openWindow : function(){
		Ext.create('Ext.window.Window', {
			title: GRID.COURSE_TASK_SUMMARY,
			autoHeight : true,
			modal : true,
			width: 600,
			height: 250,
			maximizable : true,
			constrain : true,
			layout : 'fit',
			viewConfig:{			  
				  forceFit: true,
				  style:{
					  overflow: 'auto', overflowX: 'hidden'
				  },
				  flexCroll:false
			},
			items:[{
				xtype : 'datagrid'
				
			}]
		},this).show();
	}

	
	
});

//TODO: why is this needed??
function readOut(values) {
}