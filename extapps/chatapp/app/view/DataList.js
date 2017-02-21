/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23126          Arunkumar.muddada    201310271256      According to the issue 
 *  23596          Dinesh.GK    		20131120630     Override Tooltip component is added into the common folder, 
 *  														code modification is done as per the required areas for tooltip.
 *  
 *  23044		   Venkatesh Teja	    201311211735     Added code to get focus on parent window when clicking on seek icon from the message window.
 *  23707		  Tapaswini Sabat		201311171420		Added Tooltip for the quiz and lock icons.
 *  23362 		  Dinesh.GK    			2013123450  	 If we click on make discussion icon in comments grid it showing tool bar for data list now.
 *  23980 		  Dinesh.GK    			20131231005  	 Modification is doen in subjecttmpl, remove the <b> tag for messages. 
 **/ 
Ext.define('CHAT.view.DataList', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.datalist',
	requires: ['CHAT.store.Messages','Ext.selection.CellModel','CHAT.view.SearchField','Ext.selection.CheckboxModel','CHAT.view.ImageButton','CHAT.view.Paging','SWPCommon.store.TaskStatuss'],
	/**
	 * @cfg {Boolean} autoScroll
	 * To display scroll bar when there are more records 
	 */
	autoHeight:true,
	/**
	 * @cfg {Boolean} hidePost
	 * To check whether to display the hidden messages or not.
	 * 
	 */
	hidePost:undefined,
	/**
	 * @cfg {Boolean} hideHeaders
	 * To hide the headers of the gridpanel.By default the grid panel
	 * shows headers , user can hide the headers by setting this to "true"
	 */
		
	hideHeaders: true,
	/**
	 * @cfg {Boolean} thisIsTask
	 * To indicate whether it is task or not
	 */
	thisIsTask:undefined,
	flex:1,
	cls:'rowcls',
	rowLines : false,
	layout : 'card',
//	layout:'fit',
	initComponent: function() {
		
		
		
		var me = this;
		/**
		 * @var {Array} headerButtons
		 * 
		 * The list of buttons to be used in the header of the grid.
		 */
		var headerButtons = [];
		
		var columnContents =[];
		// On mouse over by default what all classes are getting applied we are storing in a variable. 
		var defaulthover = 'x-over x-btn-over x-btn-default-toolbar-small-over over';
		
		this.id = me.getId()+'grid',
		
		this.selModel='SIMPLE';
		
		if( this.adminVersion && this.threadType == TABS.THREAD_TYPE_ONE ) {
			this.selType ='checkboxmodel';
			
		}

		/**
		 * To set the emptyText for Message,Task Grids
		 */
		if( this.threadType == TABS.THREAD_TYPE_ONE  ) {
			
			this.emptyText = '<font class="nomessages-cls"><i>'+ DATALIST.MSG_EMPTY_TEXT +'</i></font>';
			
		}else if( this.threadType == TABS.THREAD_TYPE_THREE ) {
			
			this.emptyText = '<font class="nomessages-cls"><i>'+ DATALIST.TASK_EMPTY_TEXT +'</i></font>';
		}
		/**
		 * @var {Ext.data.Store} this.store
		 * The store to be used by the grid
		 * 
		 */
		
		var pagingBar = Ext.create('CHAT.view.Paging',{
			store: this.store,
			displayInfo: true,
			cls:'datalist-toolbar-cls',
			height:27,
			displayMsg : 'Count {2}'
		});
		
		/**
		 * @var {Ext.XTemplate} this.mesgtmpl
		 * Template data to be used in template column of gridpanel 
		 * 
		 */
		this.mesgtmpl = undefined; 
		
		/**
		 * Before loading the data ensure that we are loading data of required type.
		 * for eg: if thread_type_id :1 then that dat is of type message else if 2 then of type announcements etc.
		 * 
		 * before store load, setting loading mask true for datalsit grid inorder to apply masking.
		 * 
		 * @param store : {Ext.data.Store}this store
		 * @param operations :{Ext.data.Operation} operation object that will be passed to the Proxy to load the Store 
		 * 
		 */
		this.store.on('beforeload',function( store, operations){
			
			operations.params ={
						
					'thread_type_id':this.threadType
			};
			
			var me= this;
			var gridview = Ext.getCmp(this.id);
			var messagewindow = Ext.ComponentQuery.query('messagewindow')[0];
			if ( messagewindow ){
//				messagewindow.setLoading();
			}
			
		},this);
		
		/**
		 * 
		 * 	Here checking the condition in case there are more than 25 threads then the system shall provide 
		 * 	pagination widget to see previous / next messages.
		 * 	
		 * 	While store is getting loaded, setting loading mask false for datalsit grid.
		 * 
		 */
		
		this.store.on('load',function(store,records, successful, operations){
			operations.params = {
					
		        'thread_type_id':this.threadType
			}
			var messagewindow = Ext.ComponentQuery.query('messagewindow')[0];
			if ( messagewindow ){
				messagewindow.setLoading(false);
			}
//			this.up('tabview').up('messagewindow').setLoading(false);
			
		},this);
		 me.taskActionStore = Ext.data.StoreManager.lookup('SWPCommon.store.TaskStatuss');
		 me.taskActionStore.clearFilter();
			/**
			 * 	Preparing messgae template while initializing the component, which is being used for template 
			 * 	column in datalist grid. Applying different style properties for the thread items. 
			 * 	
			 * 	TODO	If the thread is hidden, the style will be different.
			 * 
			 */
		  
		 this.subjecttmpl = new Ext.XTemplate( '<tpl if="thread_catogery_id ==&quot;'+TABS.THREAD_CATOGERY_ONE+'&quot;">',
					'<div class="subject private">{[Ext.String.htmlEncode(values.subject)]}&nbsp;&nbsp;&nbsp;{[this.getUnreadPostCount(values.unread_Post_Count)]}</div></tpl>', //20131231005
					'<tpl if="thread_catogery_id !=&quot;'+TABS.THREAD_CATOGERY_ONE+'&quot;"><div class="subject public">{[Ext.String.htmlEncode(values.subject)]}&nbsp;&nbsp;&nbsp;{[this.getUnreadPostCount(values.unread_Post_Count)]}</div></tpl>',
					//	dont delete the commente code as it may required in future.
					//'<div class="description"> <span>'+DATALIST.LAST_UPDAYE_BY+'{lastUpdateUser}&nbsp;-&nbsp;{postCount}&nbsp;<tpl if="postCount == 1">'+DATALIST.POST+'<tpl else>'+DATALIST.POSTS+'</tpl>&nbsp;&nbsp;-&nbsp;{views}&nbsp;'+DATALIST.NO_OF_VIEWS+'&nbsp;-&nbsp;'+DATALIST.LAST_UPDATE+'&nbsp;{[Ext.Date.format(new Date( values.last_update ), "'+DATE.DATE_FORMAT+'")]}&nbsp;</span></br>',
					'<div class="description"> <span> '+DATALIST.LAST_UPDATE+'&nbsp;{[this.getDateFormat(values.last_update)]}&nbsp; by {lastUpdateUser}'+'</span></br></div>'
//					'<div class="description"> <span> '+DATALIST.LAST_UPDATE+'&nbsp;{[Ext.Date.format(new Date( values.last_update ), "'+DATE.DATE_FORMAT+'")]}&nbsp; by {lastUpdateUser}'+'</span></br></div>'
					,{
					getLinkText : function (link){
						if ( link ){
							var linkText = link.split(',');
							return linkText[0]+'<p>'+linkText[1]+'</p>';
						}
					},
					getUnreadPostCount : function( values ){
						if( values ){
							return '('+values+')';
						}
					},
					getDateFormat : function ( values){
						
						var udpated  = values.split('-');
						var requiredFormat = udpated[0]+'/'+udpated[1]+'/'+udpated[2];
						var lastmodified = Ext.Date.format( new Date( requiredFormat ) ,DATE.DATE_FORMAT);
						return lastmodified;
					},
				compiled:true
			}
			);
			
			/**
			 * Prepared an template for showing reference.
			 * 
			 * */
			this.reftmpl = new Ext.XTemplate('<tpl if="link">',
					'<div class="reference-info-cls"><img src="'+Ext.BLANK_IMAGE_URL+'" class="ref-link"  data-qclass="seek-qtip" data-anchor="top" data-qtip="{[this.getLinkToolTip(values.link, values.chaptername)]}"  /> </div>',
					'</tpl>',

					{
					getLinkText : function (link, chaptername ){
						
						if ( chaptername ){
							var link = link + '<br>'+ chaptername;
						}
						return link;
					},
					getLinkToolTip : function ( link, chaptername ){
						if ( chaptername ){
							var link = link + ' - '+chaptername;
						} 
						return link;
					},
				compiled:true
			}
			);

			this.refTexttmpl = new Ext.XTemplate('<tpl if="link">',
					
					'<div class = "reference-text"> <span class="ref-text">{[this.getLinkText(values.link, values.chaptername)]}</span></div></tpl>'

					,{
					getLinkText : function (link, chaptername ){
						
						if ( chaptername ){
							var link = link + '<br>'+ chaptername;
						}
						return link;
					},
					getLinkToolTip : function ( link, chaptername ){
						if ( chaptername ){
							var link = link + ' - '+chaptername;
						} 
						return link;
					},
				compiled:true
			}
			);
			
		/**
		 * @var {Array} columnContents
		 * adminVersion
		 * The list of columns to be used to construct the grid.
		 */
			
		 columnContents = [
				               {
				                	dataIndex: 'hasattachments',
				                	width: this.thisIsTask ? 30 : 70,

				                	/**
				                	 * 	If the thread contains attachments, showing different image that represents 
				                	 * 	attachments icon.
				                	 * 
				                	 */
				                	
				                	renderer:function(  value, metaData, record ){
				                		 var returnVal ='';
				                		 
			                			 var cssRecord = me.taskActionStore.findRecord('ID',record.get('status'));
				                		 if( record.get('thread_type_id') == TABS.THREAD_TYPE_THREE ){
				                			 
				                			    if( cssRecord ){
				                			    //201311171420
				                			    	var cls = cssRecord.get('Cls');
				                			    	var tooltip = cssRecord.get('LessonTooltip');
				                			    	var statusId = cssRecord.get('ID');
				                			    	if ( statusId == "5" ){
				                			    		
				                			    		if( SWP.instructLogin ){
				                			    			tooltip = TASKSTATUS.LESSON_TOOLTIP_TASKSTATUS05;
				                			    		}else{
				                			    			tooltip = TASKSTATUS.OPEN_UPDATED_BY_YOU;
				                			    		}
				                			    	}
				                			    	returnVal = returnVal+"<img  src ="+Ext.BLANK_IMAGE_URL+" class=" +cssRecord.get('Cls')+ " data-qclass='seek-qtip' data-anchor='top' data-qtip= '"+tooltip+"' >";
				                			    }
					                	return returnVal;
					                	
					                	}
				                		 
				                		if(record.get('thread_type_id') == TABS.THREAD_TYPE_ONE ){
						                		if(!value ){
						                			
						                			returnVal = "<img  src ="+Ext.BLANK_IMAGE_URL+" class=' no-attachment '>";
		
						                		} else {
						                			
						                			returnVal = "<img  src ="+Ext.BLANK_IMAGE_URL+"  class=' attachment ' >";
						                		}
						                		
						                		//If the thread is of type message then only the open icon will display
						                		//201311171420
						                		if( record.get('status') == MESSAGESTATE.STATUS_OPEN ) {
						                			
						                			returnVal = returnVal+"<img  src ="+Ext.BLANK_IMAGE_URL+" class=" +cssRecord.get('Cls')+ " data-qclass='seek-qtip' data-anchor='top' data-qtip= '"+DATALIST.OPEN_PRIVATE_MESSAGE+"'>";
						                			
						                		} else {
						                			
						                			returnVal = returnVal+ "<img  src ="+Ext.BLANK_IMAGE_URL+" data-qclass='seek-qtip' data-anchor='top' data-qtip='"+ DATALIST.CLOSE_PRIVATE_MESSAGE+"' class=" +cssRecord.get('Cls')+ ">";
						                		}
				                	return returnVal;
				                	
				                	}
				                }	
				            }
			             ];

		 columnContents.push({
         	xtype: 'templatecolumn',
         	flex: 3,
         	atoHeight:true,
         	atoScroll:true,
         	tpl: this.subjecttmpl

		});
		
		columnContents.push({
	 	xtype: 'templatecolumn',
	 	width:30,
	 	atoHeight:true,
	 	atoScroll:true,
	 	tpl: this.reftmpl
	
	});
		columnContents.push({
	 	xtype: 'templatecolumn',
	 	width:100,
	 	height:20,
	 	atoHeight:true,
	 	atoScroll:true,
	 	tpl: this.refTexttmpl
	
	});
		
		columnContents.push(
                {
                	dataIndex: 'image',
                	renderer:function( value, metaData, record ){
            			 // Please dont delete this comment we may require this in future.
            			return "<span class='authorname'>by&nbsp;&nbsp;"+record.get('authorName')+"<br />"+record.get('creatorPostCount')+" posts </span>";


                	}
                });
		
		columnContents.push({
			
                	dataIndex: 'image',
                	height:50,
                	width:50,
                	renderer:function( value, metaData, record ) {
                		
	            		if( value == undefined || value == null ) {
	            			 
	            			return "<img  src ="+Ext.BLANK_IMAGE_URL+" class='avatar'/>" 
	
	            		}else {
	            			
	            			return  "<img  src ="+ value +" class=' avatar'>" ;
	            		}

                	}
                });
		
		this.columns = columnContents;
	
		this.dockedItems = [{
			
			xtype:'toolbar',
			style:{backgroundColor:'#e1e1e1 !important'},
			baseCls:'datalist-toolbar',
			cls:'datalist-top-toolbar',
			height: 30,
			items:headerButtons
		},
		/**
		 * Adding the pagingBar as docked item at bottom
		 */
		{
			dock:'bottom',
			items:pagingBar
			
			
		}];
		if(  this.adminVersion && this.title !== TABVIEW.TASKS_TITLE ){
			  
			headerButtons.push({
				xtype : 'button',
	        	iconCls : 'hidecontext',
	        	name : 'settings',
	        	//201311171420 201312041802
	        	tooltip :{
					text : DATALIST.CONTEXT_MENU,
					anchor : 'top'
				},
	        	width : 27,
		    	height : 26,
		    	listeners: {
	  		        el: {
	  		            click: function( event, t, eopts ) {
	  		            	
			    				 var me = Ext.ComponentQuery.query('datalist')[0];
			    				 var grid = me.items.items[0];
			    				 var open = 0;
			    				 var close = 0;
			    	  	    	 var selections = grid.getSelectionModel().getSelection();
			    	  	    	 
			    	  	    	 // Checking whether atleast one open/close thread is selected or not
			    	  	    	Ext.Array.each( selections ,function( selection ) {
			        				
			    	    			if( selection.get('status') == MESSAGESTATE.STATUS_OPEN || selection.get('status') == 1 ) {
			    	    					open = open+1;
			    	    				} else {
			    	    					close = close+1;
			    	    				}
			    	    			});
			    				
			    					me.menu = Ext.create('Ext.menu.Menu',{
			    						 items: [
			    								// these will render as dropdown menu items when the arrow is clicked:
			    								        {
			    								        	text: DATALIST.CLOSE_THREAD,
			    								        	disabled : open > 0 ? false : true,
			    								        	handler: function(){
			    								  	    		
			    								  	    		me.fireEvent( 'closemessage',me,grid,selections,grid.getStore() );
			    								        	}
			    								        },
			    								        {
			    								        	text: DATALIST.OPEN_THREAD,
			    								        	disabled :  close > 0 ? false : true,
			    								        	handler: function(){
			    								  	    		
			    								  	    		me.fireEvent( 'openmessage',me,grid,selections,grid.getStore() );
			    								        	}
			    								        }
			    								]
			    					});
			    					
			    					
			    				 me.menu.showAt(event.getX(), event.getY()+10);
		    			}
	  		            }
	  		        }
		    		});
		    		
			headerButtons.push({ 
		    	   xtype: 'tbspacer',
		    	   width: 70
		    	  
			});
		}
		/**
		 *  The users having role of Instructor should be able to create an Task so 
		 *  it is restricting the other user by hiding the new Topic button option in the toolbar for Tasks Tab
		 * 
		 */
		if( ( this.title == TABVIEW.MESSAGES_TITLE ) || (this.title == TABVIEW.TASKS_TITLE )) {
		headerButtons.push({
	    	   xtype: 'button',
	    	   iconCls:'add-item',
	    	   //201311171420 201312041802
	    	   tooltip : { 
					text : (this.threadType == TABS.THREAD_TYPE_ONE) ? DATALIST.NEW_MESSAGE : DATALIST.NEW_TASK,
					anchor :'top'
				},
	    	   width : 30,
	    	   height : 26,
	    	   id : me.getId()+'add-item',
	    	   hidden: ( (me.title == TABVIEW.TASKS_TITLE)  ? ( !this.adminVersion ) :  false  ),
	    	   handler: function(){
	    		   //When we click on the newtopic button we are disabling the new topic button to not allow multiple clicks.
	    		   //refs #22607
	    		   //We have given id for this newtopic button button id will be like : this(datalist) id + 'add-item'
	    		   this.setDisabled(true);
	    		   me.fireEvent('newtopic',me);
	    	   }
	       });
		}
		headerButtons.push({
			
	    	   xtype:'button',
	    	   width : 30,
	    	   height : 26,
	    	   iconCls:'reload-item',
	    	   tooltip : { 
					text : MESSAGEDETAILS.REFRESH_TOOLTIP,
					anchor :'top'
				},
	    	   handler:function() {
	    		   me.down('searchfield').onTrigger2Click();

	    	   }
	    });
		
		/**
		 * xtype:searchfield
		 * To filter the records based on the freetext entered by the user
		 */
		headerButtons.push({ 
	    	   xtype: 'tbspacer',
	    	   width:60
	    	  
				});
		headerButtons.push({
	    	xtype:'searchfield',
	    	store:this.store,
	    	minWidth: 200,
	    	paramName:'freetext',
	    	//emptyText:DATALIST.EMPTY_TEXT ,
	    	//columnWidth:1,
		flex:1

	       });

		/**
		 * 	If the loggedin user is instructor then only the showHidden flag is true. If showHidden is true 
		 * 	then only the hide and unhide options will be displayed
		 */
		
		
		this.callParent(arguments);
		
		/**
		 * 	Assigning rowCls property for thread based on conditions, weather thread is read or not,
		 * 	hidden and based on category aswell. 
		 * 
		 */
		
		this.getView().getRowClass = function(record, rowIndex, rowParams, store) {
			var returnval ='';
		
			if(record.data['unread_Post_Count'] == true || record.data['unread_Post_Count'] > 0){
				returnval = 'unread';

			}
			else {
				returnval = 'read';
			}

			if(record.data['hidden'] == true || record.data['hidden'] =='1'){
				
				returnval =returnval +' hide';
			}
			if(record.data['thread_catogery_id'] == TABS.THREAD_CATOGERY_ONE ) {
				
				returnval = returnval+ ' private';
			}
			else {
				
				returnval =returnval+ ' subject';
			}

			return returnval;
		};
	},
	setActiveItem:function(item, fromMakeDiscussion ) {
		
		if( !fromMakeDiscussion ){ //2013123450
			this.getDockedItems()[0].setVisible(false);
			this.getDockedItems()[2].setVisible(false);
		}
		this.getLayout().setActiveItem(item);
		
	},
	
	/**
	 * Relaying the events coming from message details window.
	 **/
	
	showMessageDetails : function(messagedetails) {
		
		this.relayEvents(messagedetails,['showmessagelist','previous','next','refreshposts','link','downloadtrainingfiles','updatereadpost','reply']);
	},
	
	/**
	 * Whenever the user is double clicking on the thread the control is coming to this method 
	 * where it is creating the MessageDetails component and setting the current item as an active item of the card
	 **/
	
	messagedetailsComp : function(record) {
		
			
			var card1 = Ext.create('CHAT.view.MessageDetails',
					{
				store: Ext.create('CHAT.store.Posts',{
					autoLoad:{params:{'thread_id':record.get('uid')}}
				}),
				autoScroll 		: true,
				threadSubject	: record.get('subject'), 
				thread			: record,
				inSamePage		: true,
				adminVersion 	: this.adminVersion,
				instructionstext: '',
				bodyStyle: {
				    background: '#d6d6d6'
				}
					} );
			
			this.showMessageDetails(card1);
			this.setActiveItem( card1);
			
	},
	/**
	 * @public
	 * Function will change the value of showMasking of the component.
	 * if hide true sets showmaking to false and viceersa
	 */
//	hideMasking : function( hide ){
//		
//		this.showMasking =!hide;
//	},
	
	listeners : {
		
		/**
		 * Fires when an grid item is double clicked. This method  fires an event with name
		 * showmessagethread to enable controller to handle the exact functionality.
		 * 
		 * @param thisItem
		 * @param record
		 * @param htmlItem
		 * @param index
		 * @param e
		 * @param eOpts
		 */

		itemdblclick:function( gridview,record,item,index ) {

			if(this.title == TABVIEW.TASKS_TITLE){
				this.fireEvent( 'showmessagethread',record,gridview.getStore() );
			}else
			/**
			 * Event that should be fired when an item is double clicked.
			 * @param record on which the user has double clicked
			 */
			
			{
			this.fireEvent('showmessagethread',record,gridview.getStore());
			}
		},
		
		itemclick: function( pnl,record,item,index,event,eopts ) {
			
			if( event.target.className =='ref-link' || event.target.className =='ref-text' ) {
					if( record ){
						
						var ref = record.get('reference');
						this.fireEvent( 'openreference',pnl,ref,item,index,event,eopts );
				} 
			}
		}
	}
});