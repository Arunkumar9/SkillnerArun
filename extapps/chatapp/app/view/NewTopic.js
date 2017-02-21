/**
 * @author Phani Kiran
 * 
 * 
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23447          Venkatesh Teja    201311131040    Removed the Word count from the Message window text editor. 
 *  23103			Dinesh GK 		 20131118456	 Removed the tinymce textarea bottom toolbar 
 *  23362		   Tapaswini Sabat		201312021950	If the Instructor for a course is unassigned, then we are 
 *  														showing the correct alert message to the user.	
 *  25938		   Venkatesh Teja	 201402162120	 TinyMCE editor getValue is not giving it's value. So changed code to get value.
 */

Ext.define('CHAT.view.NewTopic', {
	extend:'Ext.form.Panel',
	alias:'widget.newtopic',
	requires:['CHAT.store.User','CHAT.view.BoxSelect','CHAT.view.GroupingComboBox','CHAT.view.TinyMCETextArea'],
	hideBroadCastCheckBox:false,
	hideToList:false,
	hideCatogeryList:false,
	link:'',
	reply:false,
	newTask : false,	
	/**
	 * @cfg reference {Object} which contains reference details.
	 */
	reference:{},
	bodyCls : 'newtopic-body-cls',
	cls : ' newtopic-window',
	initComponent:function(){
		
	this.instanceId = new Date().getTime();
	this.tostore = Ext.data.StoreManager.lookup('CHAT.store.User',{});
	
	if( Ext.isEmpty( this.tostore ) ) {
		//201312021950
		this.tostore = Ext.create('CHAT.store.User',{autoLoad: false});
		this.tostore.load({
			params:{
				'old_instructorId': SWP.oldInstructorId
			}
		});
	}
	//
	//	While creating a newTopic component, declaring a global variable which is 
	//	maintaining the directory structure for the attachments
	//
	
	this.attachmentfolders = [];
	var me = this;
	
	if( !this.subjectValue ) {
		
		this.subjectValue = '';
	}
	
	if( me.thisIsTask ) {
		this.newTask = me.thisIsTask ;
		
	}

			var broadstore = Ext.create( 'CHAT.store.ThreadCatogery',{autoLoad:{params:{'thread_type_id':this.threadType}}} );

			broadstore.on('load',function(store){

				var combo = Ext.getCmp(me.getId()+'-catogeryCombo');
				combo.select( store.data.items[0] );
				combo.resetOriginalValue();
				
			},this);
			
	
			
			/**
			 * reference combo should be dispalyed in-place of to list in case of task.
			 */
			if( this.newTask ) {
			
			// Here we are getting the reference store data and assigning to the store config of reference combo.
			var chs = Ext.data.StoreManager.lookup('reference');
		}
		
		Ext.apply(this,{
			
//					bodyCls : 'newtopicbody',
					fieldDefaults: {
						
						labelWidth: 55,
						anchor: '100%'
					},
					dockedItems:[{
						xtype: 'toolbar',
						dock: 'top',
						hidden  : true,
						layout:'hbox',
						items: [
						        {
						        	xtype: 'tbfill'
						        },{
						        	xtype:'combobox',
						        	readOnly : true,
						        	store: broadstore,
						        	hidden: true,
						        	queryMode: 'local',
						        	width:150,	
						        	id:me.getId()+'-catogeryCombo',
						        	flex:1,
						        	name:'thread_catogery_id',
						        	valueField:'uid',
						        	displayField:NEWTOPIC.BROADCAST_NAME,
						        	cls: 'category-combo-cls'
						        }]
					},{

						xtype:'toolbar',
						layout:'column',
						ui:'plain',
						style:'position:absolute !important;',
						dock : 'bottom',
						items:[{
								xtype:'button',
								iconCls:'traininguploadsave',
								margin:'0 3 0 0 ',
								text: SWPDocLocale.SEND,
								handler:function( btn,evt,eopts ) {
									//When we send the message or task then we need to enable the new topic
									//button to enable user to click on the new topic button again
									//refs #22607
									var msgId = Ext.ComponentQuery.query('datalist')[0].id;
									var taskId = Ext.ComponentQuery.query('datalist')[1].id;
									Ext.getCmp(msgId+'add-item').setDisabled(false);
									Ext.getCmp(taskId+'add-item').setDisabled(false);
									
									var groupoingCombo = me.down('groupingcombobox');
									groupoingCombo.fireEvent('blur', groupoingCombo);
							    	 //
							    	 //If the Thread body is Blank then Thread should not create, instead It will give an alert message
							    	 //
									
							    	//var content = me.getForm().findField('content').contentValue;
									
									//201402162120
									var contentComp = me.getForm().findField('content');
							    	var content = contentComp.getEditor().getContent();
							    	contentComp.setValue(content);
									
							    	if ( content ) {
//							    	content = content.getValue();							    	
							    	content = content.replace(/&nbsp;/gi,"");
							    	content = content.replace(/<p>/gi,"");
							    	content = content.replace(/<\/p>/gi,"");
							    	content = content.replace(/<br>/gi,"");
							    	content = Ext.String.trim(content);
							    	
							    	}
							    	
							         if ( content && content != '' ) {
							        	 
							        	 me.fireEvent('savenewtopic',me);
							         }else {
							        	 
							        	 Ext.Msg.confirm({title: MESSAGE.NEWTOPIC_VALIDATE_TITLE,
										     msg: MESSAGE.NEWTOPIC_VALIDATE_BODY,
										     buttons: Ext.Msg.OK,
										     icon: Ext.Msg.WARNING
							        	 });
						        	 }
								}
							     
							},{
								
								xtype:'button',
								iconCls:'traininguploadcancel',
								margin:'0 3 0 0 ',
								padding:'3 3 3 3',
								text: SWPDocLocale.CANCEL,
								handler:function(btn,evt,eopts){
									//When we send the message or task then we need to enable the new topic
									//button to enable user to click on the new topic button again
									//refs #22607
									var msgId = Ext.ComponentQuery.query('datalist')[0].id;
									var taskId = Ext.ComponentQuery.query('datalist')[1].id;
									Ext.getCmp(msgId+'add-item').setDisabled(false);
									Ext.getCmp(taskId+'add-item').setDisabled(false);
									
									me.fireEvent( 'cancelnewTopic',me );
								}
							},{
								xtype:'container',
								flex:1
							},{
								xtype:'textfield',
								animate:false,
								id:me.getId()+'-ref',
								name:'link',
								readOnly:true,
								margin:'0 3 0 0 ',
								style: 'float: right;',
								value:CTSELECTED.LINK
							},{
								xtype:'checkbox',
								boxLabelAlign :'after',
								margin:'0 3 0 0 ',
								style: 'float: right;',
								boxLabel:NEWTOPIC.CONTENT_EXCLUSION,
								id:me.getId()+'-removeref',
								name:'referenceremove',
								listeners:{
									
									render: function( cBox ) {
										
						    			   if( !me.reference.LINK ) {
						    				   
						    				   cBox.setValue(true);
						    				   cBox.setDisabled(true);
						    			   }
						    		   },
									change:function( field,value ) {
										
										var referenceField = Ext.getCmp( me.getId()+'-ref');
										
										if( value == true ) {
											
											referenceField.setVisible(false);
											
										}else {
											
											referenceField.setVisible( true );
										}
									}
								}
							},{

								xtype:'hidden',
								name:'quoted_post_id',
								value:this.quoted_post_id
						
							},{

								xtype:'hidden',
								name:'thread_id',
								value:this.thread_id
						
							},{

								xtype:'hidden',
								name:'lesson',
								value: CTSELECTED.LESSON
						
							},{

								xtype:'hidden',
								name:'chaptername',
								value: CTSELECTED.CHAPTERNAME
						
							},{
	
								xtype:'hidden',
								name:'chapter',
								value: CTSELECTED.CHAPTER_ID
						
							},{

								xtype:'hidden',
								name:'quiz',
								value:CTSELECTED.QUESTION_ID
						
							},{

								xtype:'hidden',
								name:'seek',
								value:CTSELECTED.SEEKTIME
						
							},
							{
								xtype:'hidden',
								name:'video_id',
								value:CTSELECTED.LESSON_ID
							}]
					
				}],
					items:[{
						xtype:'container',
						items:[{
							
						    xtype:'fieldset',
						    autoScroll : false,
						    layout: 'form',
						    items:[{
						    	xtype:'boxselect',
						    	store:this.tostore,
						    	autoScroll : false,
						    	queryMode: 'local',
						    	id:me.getId()+'to-combo',
						    	readOnly:true, 
						    	fieldLabel:NEWTOPIC.TO_LIST ,
						    	valueField:NEWTOPIC.VALUE_FIELD,
						    	
						    	//to list should be hidden for task
						    	
						    	hidden:this.newTask,
						    	name:'to',
						    	style:{
							    	width:'auto !important'
						    	},
						    	labelStyle:'margin-right: 5px;width: 50px;',
						    	displayField:'Username',
						    	flex:1
						    	
					    	   },{
					    		   xtype: 'groupingcombobox',
					    		   store:chs,
					    		   queryMode : 'local',
					    		   displayField:'name',
					    		   groupField: ['groupName'],
					    		   id:me.getId()+'reference-combo',
					    		   fieldLabel:NEWTOPIC.REFERENCE_LIST,
					    		   hidden:!this.newTask,
					    		   editable:false,
					    		   forceSelection:true,
					    		   flex:1,
					    		   listConfig: {
					    			   loadingText: 'Searching...',
					                   emptyText: 'No matching posts found.',
					                   
					                   listeners : {
					                	  afterrender :function(s,t) {
					    		   				var newtopic = Ext.ComponentQuery.query('newtopic')[0];
					    		   				newtopic.setLoading(true);
					                	   },
					                	   viewready : function(s,t) {
					                		   var newtopic = Ext.ComponentQuery.query('newtopic')[0];
					    		   				newtopic.setLoading(false);
					                	   }
					                   }
					    		   },
					    		   listeners:{
					    			   select:function( v,opts ){
					    				   
					    		   			if ( opts[0].get('id') == opts[0].get('groupId') ){
					    		   				
					    		   				me.getForm().findField('subject').setValue(v.value);
					    		   			}else{
					    		   				me.getForm().findField('subject').setValue( opts[0].get('groupName')+' - '+v.value);
					    		   			}
					    				   me.getForm().findField('subject').resetOriginalValue();
					    			   }
					    		   }
					    	   },{
								
								xtype:'textfield', 
								fieldLabel:NEWTOPIC.SUBJECT,
								name:'subject',
								style:{
							    	width:'auto !important'
						    	},
								//subject field should be read only for task
								
								readOnly : this.newTask,
								labelStyle:'margin-right: 5px;width: 50px;',
								value:this.subjectValue
							}]
						}]
					},{
	                     xtype: 'tinymce_textarea',
	                     noWysiwyg: false,
	                     name:'content',
	                     anchor:'100%',
	                     cls:'tinymce-textarea-cls',
//	                     height :300,
	                     value : "",
	                     tinyMCEConfig: {
								 // General options
								theme : "advanced",
								plugins : "autolink,lists,style,layer,advhr,advimage,advlink,emotions,inlinepopups,insertdatetime,media,contextmenu,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",      //201311131040
								
//								skin: "extjs",
								inlinepopups_skin: "extjs",
								
								// Original value is 23, hard coded.
								// with 23 the editor calculates the height wrong.
								// With these settings, you can do the fine tuning of the height
								// by the initialization.
								theme_advanced_row_height: 27,
								delta_height: 0,
								
									// Theme options
								theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,formatselect,fontselect,fontsizeselect,|,bullist,numlist,|,code,|,insertdate,inserttime,preview,|,forecolor,backcolor,|,sub,sup",
//								theme_advanced_buttons2 : "search,replace,|,bullist,numlist,|,undo,redo,|,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
//								theme_advanced_buttons3 : "sub,sup,|,charmap,emotions,|,ltr,rtl,|,fullscreen",
//								theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft",
								theme_advanced_toolbar_location : "top",
								theme_advanced_toolbar_align : "left",
								theme_advanced_statusbar_location : "none", //20131118456
								theme_advanced_path : false,
								theme_advanced_source_editor_height:300
						}
						
					},{
						xtype : 'container',
						width:'90%',
						items : [
						{
							xtype:'container',
							id:me.getId()+'-attachedfiles',
							name:'attachments',
							
							items:[]
						},
						{
							xtype:'button',
							cls: 'attachments-btn-cls',
							id:me.getId()+'-attachbutn',
							text:NEWTOPIC.ATTACHMENTS,
							iconCls:'attach',
							handler:function( btn,evt,eopts ) {

								me.fireEvent('attachfile',me,me,btn);
							}
						}]
					}],
					listeners : {
						afterrender : function(){
							if ( this.thisIsTask ){
								
								/**
								 * If any lesson or quiz is selected and is not associated with any task
								 * we are by default selecting that lesson/Quiz of the combo.
								 * */
								
								var combo = Ext.getCmp( me.getId()+'reference-combo' );
								
								if ( CTSELECTED.LESSON_ID ){
									var lessonObj = chs.findRecord('groupId',CTSELECTED.LESSON_ID);
									
									if ( lessonObj && CTSELECTED.QUESTION_ID == -1 ) {
										
										combo.select( lessonObj );
										combo.fireEvent('select', combo, [lessonObj]);
										
									} else {
										var quizObj = chs.findRecord('id',CTSELECTED.QUESTION_ID);
										if (  quizObj ) { 
											combo.select( quizObj );
											combo.fireEvent('select', combo, [quizObj]);
										}
									}
								combo.resetOriginalValue();
								
							}
						}
					}
				}
			
					
		});
		
		this.callParent( arguments );
	},
	
	/**
	 * 
	 * 	When user clicks on send button after uploading files, this function shows the
	 * 	Attached files in the attachment panel. 
	 * 	It is getting called from classroom.js file saveattchments function 
	 * 
	 */
	
	addAttachments:function( data , path,uploaderInstanceId ) {
		
		var me = this;
		
		this.attachmentsPnl = Ext.getCmp( me.getId()+'-attachedfiles' );
		var attachBtn = Ext.getCmp( this.getId()+'-attachbutn' );
		
		if( !this.attachmentsPnl.data ) {
			
			this.attachmentsPnl.data=[];
		}
		
		this.attachmentsPnl.uploadPath = path;
		
		for( var j=0;j<data.length;j++ ) {
			
			var name = data[j].data.name;
			var size = data[j].data.size;
			
			var formatedSize = Ext.util.Format.fileSize( size );
			
			if( name.length > 50 ) {
				
				var att_name = (name).split(".");
	    		att_name[0] = att_name[0].substr(0,35)+"...";
	    		name = att_name[0]+"."+att_name[1];
			}
			
			if( !data[j].data.PATH ) {
				
				data[j].data.PATH = path;
			}
			
			this.attachmentsPnl.add({
			
				xtype:'container',
				html:'<div><span> ' + name + '</span> <span> &nbsp;&nbsp;&nbsp;<b>('+ formatedSize +')</b>&nbsp;&nbsp;&nbsp; </span>  <a class="x-newtopic-file-cross icon-cross" alt="" parent_id='+ this.attachmentsPnl.getId()+'href = # >Remove </a></div>',
				border:false,
				name:data[j].data.name,
				path : data[j].data.PATH, 
				style: {paddingLeft : 15}
			});
			
//			this.attachmentsPnl.setHeight(100);
			this.attachmentsPnl.setVisible(true);
			this.attachmentsPnl.updateLayout();
			this.attachmentsPnl.data.push( data[j].data );
		}
		
		Ext.select('a.x-newtopic-file-cross').on('click',function( e, html){
			
			var prospectAttachment = Ext.getCmp( e.target.parentElement.parentElement.id.split("-innerCt")[0] );
			this.attachmentsPnl.remove(prospectAttachment);
			var name = prospectAttachment.initialConfig.name;
			extension = name.substring(name.length-1); 
			if (extension == '/'){
				filePath = prospectAttachment.initialConfig.path + prospectAttachment.initialConfig.name;
			}
			else
			{
				filePath = prospectAttachment.initialConfig.path +'/'+ prospectAttachment.initialConfig.name;
			}
			//
			// When user is removing some attchmentrs from the Attachment panel, 
			// we are deleting the corresponding file from the file structure as well as from attachment panel data items.
			//
			CollaborationToolMgr.removeFile( filePath );
			for(var i=0; i< this.attachmentsPnl.data.length; i++){
				if(this.attachmentsPnl.data[i].name== prospectAttachment.initialConfig.name)
				{
					this.attachmentsPnl.data.splice(i,1);
				}
			}
			
		},this);
	},
	afterRender:function(){
		this.callParent( arguments );
		 /**
		  * To list should be hidden and tostore should not be loaded for task.
		  */
			if( !this.newTask ) {
				
				var combo = Ext.getCmp(this.getId()+'to-combo' );
				if(this.tostore.getAt(0)) {
				             combo.select( this.tostore.getAt(0));
				             combo.originalValue = this.tostore.getAt(0).get('Uid');
				}else{
				             this.tostore.on('load',function(store,records){
				             	if( records[0]){
				                          combo.select( records[0]);
             				             combo.originalValue = records[0].get('Uid');
             				         }
				             },this);
				}
			}			
	}
	
	
});
