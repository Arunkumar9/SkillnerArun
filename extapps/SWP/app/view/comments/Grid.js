/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23362          Tapaswini Sabat    201311181200      When tye message window is already exist and we are clicking on the 
 *  													View Discussion Thread icon of comments grid, then the window
 *  													was not getting focused.
 */
Ext.define('SWP.view.comments.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.commentsgrid',
    title: GRID.NOTE,
	requires: ['Ext.selection.CellModel','Ext.grid.plugin.CellEditing',  'SWP.view.statusbar.StatusBar','Ext.layout.container.Column'],
	hideCollapseTool:true,
	collapsible: true,    
 	split: true,
 	header :false,
// 	splitterResize : false,
 	flexCroll: false,
	minHeight:120,
 	floatable : false,
 	cls:'comments-grid-cls comments-grid',
	rowLines:false,
		initComponent: function() {
			
			var me = this;
			var defaulthover = 'x-over x-btn-over x-btn-default-toolbar-small-over over';
			
			Ext.apply(this, {
				
				store: Ext.create( 'SWP.store.Comments' ,{autoLoad:true}),
	
				selType: 'cellmodel',
				sortableColumns: true,
				plugins: [
				       Ext.create('Ext.grid.plugin.CellEditing', {
					   clicksToEdit: 1,
					   pluginId: 'editcomments'
					   })
				],
				columns: [
					{
					    xtype:'actioncolumn', 
					    width:40,
					    align: 'center',
					    header:GRID.NOTE ,
//					    items: [{
						iconCls:'seek-icon-cls',//Do't change this css class name,it is used in coding.  
//						tooltip: 'Seek',
						handler: function(grid, rowIndex, colIndex) {
								
								me.getSelectionModel().select(rowIndex,false);
								me.fireEvent('seekthroughcomment', me, rowIndex, colIndex, grid.getStore().getAt(rowIndex));
								
							},
						renderer: function(value, metaData, record, rowIdx, colIdx, store) {
					        metaData.tdAttr = 'data-qtip="'+GRID.SEEK+'" data-anchor="top" ';

					        return value;
					    }
//						}]
					},{
//						text: 'Lesson',
						dataIndex: 'lesson',
						sortable: true,
						flex: 1
					},{
//						text: 'Ordering',
						dataIndex: 'ordering',
						sortable: true,
						hidden : true,
						width: 60
					},{
//						text: 'Chapter / Quiz',
						dataIndex: 'chapter',
						sortable: true,
						width: 200
					},{
//						text: 'Time',
						dataIndex: 'ts',
						sortable: true,
						width: 80,
						renderer: this.formatTime
					},
					{
//						text: 'Comment',
						dataIndex: 'comment',
						sortable: true,
						flex: 4,
						editor:{
							type : 'textfield',
							listeners : {
								scope : this,
								blur : function(  ){
						debugger;
									var selectedRecord = this.getSelectionModel().getSelection();
									this.getSelectionModel().deselect(selectedRecord);
								}
							}
						},
						editRenderer:this.formatComment
					},
					{
					    xtype:'actioncolumn', 
					    width:90,
					    itemId:'commentsaction',
					    align: 'center',
						    items: [
						            {
						            	iconCls:'makediscussion',
						            	scope:this,
						            	width:30,
						            	disable:false,
						            	getClass: function( v, meta, rec ) {
						            		
						            		var clsclass = '',tooltip = GRID.OPEN_DISCUSSION;
						            		var tooltipType = 'title';
						            		
						            		if ( rec.get('thread_id') == 0 ) {
		
						            			clsclass = 'x-grid-center-icon-make-discussion';
						            			
						            		}else {
						            			
						            			tooltip=GRID.VIEW_DISCUSSION;
						            			clsclass = 'x-grid-center-icon-view-discussion';
						            			
						            		}
		
						            		return clsclass;
						            	},
						            	/**
										 * function to return the tooltip of the
										 * action. according to the curent
										 * record
										 */
						            	tooltip:function( v, meta, rec ) {
						            	
						            		if ( rec.get('thread_id') != 0 ) {
						            		
						            			return GRID.VIEW_DISCUSSION;
						            		}
						            		return GRID.OPEN_DISCUSSION;
						            	},
					            		isDisabled:function( v, meta, rec ) {
						            		
						            	
						            		return false;
						            	},

						            	handler:function( grid, rowIndex, colIndex ) {
                                         
						            		var rec = grid.getStore().getAt(rowIndex);
						            		
						            		if( rec.get('thread_id') == 0 ) {

						            			if( !SWP.InstructorAvailable ){
						            	    		
						            	    		Ext.Msg.alert( MESSAGE_NO_INSTRUCTOR.ALERT_TITLE,MESSAGE_NO_INSTRUCTOR.VIEW_MAKE_DISCUSSION );
						            	    		return;
						            	    	}
						            	    	
												//When ever user clicks on the new button in the comments grid of the player window this will open the message window 
												//and new thread for the discussion
						            			me.fireEvent('newthreadfromcommentsgrid', me, rec);

						            		}else {

						            			var threadRecord
						            			var modelRecord;
						            			var record = {};
						            			record['thread_id']=rec.get('thread_id');
						            			record['thread_type_id'] = 1;
						            			//201311181200
						            			//If message window is already exist then 
						            			// we are bringing the window in focus.
						            			if(SWP.mw){
						            				
						            				SWP.mw.focus()
						            			}
						            			threadRecord = CollaborationToolMgr.getSingleMessage(record,function(r,t){

						            				modelRecord = r;
						            				me.fireEvent('showmessagingwindow', me,modelRecord,true,false);
						            			});

						            		}
						            	}
						            },
						            {
						            	iconCls:'deletebutton',
						            	tooltip:GRID.DELETE_COMMENT,
						            	scope: this,
						            	
						            	/**
										 * function to mark the items as
										 * disabled. if this function returns
										 * true action column will be disabled
										 * else enabled
										 */
						            	
						            	isDisabled:function( v, meta, rec ) {
						            		
						            		if ( typeof rec == "object" && rec.get('thread_id') != 0 ) {
						            			
						            			return true;
						            		}
						            		return false;
						            	},
						            	
						            	handler: function( grid, rowIndex, colIndex ) {
						            		
						            		var rec, text, commentStr, comment;
						            		rec = grid.getStore().getAt(rowIndex);
						            		
						            		if( rec.get('thread_id') == 0 ) {
						            			
						            			commentStr = rec.get('comment');
						            			if( commentStr.length > 20 ){
						            				 comment = commentStr.substr(0,20)+"...";
						            			}else{
						            				comment = commentStr;
						            			}
						            			text = this.formatTime(rec.get('ts'))+' '+rec.get('chapter')+ ': '+comment;
						            			Ext.Msg.confirm( MESSAGE.GRID_DELETE_CONFIRM,MESSAGE.GRID_DELETE_MSG+text+'?',function(btn,text) {
						            				
							            				if ( btn == 'yes' ) {
							            					
							            							grid.getStore().remove(rec);
							            							grid.getStore().sync();
						            				}
						            			});
		
						            		}
						              }               
						            }],
						            
					           /**
								 * overriding the default renderer of the action
								 * column. to call the methods for the tool tip
								 * and disabled. if config object has functions
								 * assigned for these values.
								 */
						            
					            defaultRenderer: function( v, meta ) {
					            	
					                var me = this,
					                    prefix = Ext.baseCSSPrefix,
					                    scope = me.origScope || me,
					                    items = me.items,
					                    len = items.length,
					                    i = 0,
					                    item;
					                    
					                // Allow a configured renderer to create
									// initial value (And set the other values
									// in the "metadata" argument!)
					                v = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';
	
					                meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
					                
					                for (; i < len; i++ ) {
					                	
					                    item = items[i];
					                    
					                    // Only process the item action setup
										// once.
					                    
					                    if ( !item.hasActionConfiguration ) {
					                        
					                        // Apply our documented default to
											// all items
					                    	
					                        item.stopSelection = me.stopSelection;
					                        item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
					                        item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
					                        item.hasActionConfiguration = true;
					                    }
					                    v += '<img alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
					                        '" class="' + prefix + 'action-col-icon ' + prefix + 'action-col-' + String(i) + ' ' +
					                        ( ( Ext.isFunction(item.isDisabled) ?  ( item.isDisabled.apply(item.scope||scope,arguments) ): item.disable ) ? prefix + 'item-disabled' : ' ') +
					                        ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : (item.iconCls || me.iconCls || '')) + '"' +
					                        ((item.tooltip) ? ' data-anchor="right" data-qtip="' + ( Ext.isFunction(item.tooltip) ? item.tooltip.apply(item.scope||scope,arguments) :item.tooltip) + '"' : '') + ' />';
					                }
					                return v;    
					            }
					}] 
			});
			
			this.callParent(arguments);
		},
		listeners:{
			select:function( gridview, record, index, eOpts ){
				
				//Here add the select row seek column icon cls is changing.
				var selectEle = Ext.select('.seek-icon-cls');
				var ele = selectEle.elements[index];
				if( eOpts == 0 ){
				ele.className = ele.className+'  seek-icon-cls-onrow-select';
				}
				
			},
			deselect:function(gridview , record, index, eOpts ){
				
				//Here remove the deselected row seek column icon cls is changing.
				var selectEle = Ext.select('.seek-icon-cls');
				var ele = selectEle.elements[index];
				if( ele ) {
				
					var position = ele.className.search("seek-icon-cls-onrow-select");
					if( position > 0 &&  eOpts == 0 ){
						
						ele.className = ele.className.replace(/seek-icon-cls-onrow-select/,'');
					}
				}
			},
			expand:function(p, eOpts){
				 if(SWP.isCommentIconClicked){
					 this.fireEvent('commentme');
				 }
				 SWP.isCommentIconClicked = false;
				 this.fireEvent('showreplaynextbuttons',this );
			},
			collapse : function( p, eOpts ){
				
				this.fireEvent('showreplaynextbuttons',this );
			}
	},
	/**
	 * Title renderer
	 * @private
	 */
	formatTitle: function(value, p, record) {
		return Ext.String.format('<div class="topic"><b>{0}</b><span class="author">{1}</span></div>', value, record.get('author') || "Unknown");
	},

	/**
	 * Date renderer
	 * The time stamp value for quizzes are pseudo values and we should not show these values in comments grid.
	 * 
	 * @private
	 */
	formatTime: function(ts, obj, record) {
		if ( !Ext.isEmpty(record) && 
			 !Ext.isEmpty(record.get('commented_on') ) && 
			 record.get('commented_on') === 'Q' ) {
			
			return '';
		} else {
			var hr = Math.floor(ts/3600);
	        var min = Math.floor(ts/60)-60*hr;
	        var sec = Math.floor(ts)-3600*hr - 60*min;
	        return ((hr<10)?'0':'')+hr + ((min<=9)?':0':':') + min + ((sec<=9)?':0':':') + sec ;
		}
		
	},
	/**
	 * Date renderer
	 * @private
	 */
	formatDate: function(date) {
		if (!date) {
			return '';
		}

		var now = new Date(),
			d = Ext.Date.clearTime(now, true),
			notime = Ext.Date.clearTime(date, true).getTime();

		if (notime === d.getTime()) {
			return 'Today ' + Ext.Date.format(date, 'g:i a');
		}

		d = Ext.Date.add(d, 'd', -6);
		if (d.getTime() <= notime) {
			return Ext.Date.format(date, 'D g:i a');
		}
		return Ext.Date.format(date, 'Y/m/d g:i a');
	},
	/**
	 * @private
	 * Comment renderer. Encodes the html entities.
	 * and displays instructors comments with bold and italic.
	 * @param value - the comment entered into the comments field
	 * @param metaData - A collection of metadata, used to modify renderer( attr,tdCls etc.)
	 * @param record - a record contains total data in store related to the specific comment
	 * 
	 */
	formatComment: function( value, metaData, record ){
		
		value = Ext.String.htmlEncode( value );
		var rolevalue = record.get( 'role_id' );
		
		if( rolevalue === parseInt( SWP.instructId ) ){
			
    		value = "<b><i>" + value + "</b></i>";
    	
		}

		return value;
	}
});

