/*
 * 
 *  Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23447          Venkatesh Teja    201311131040    Removed the Word count from the Message window text editor. 
 *  23103			Dinesh GK 		 20131118456	 Removed the tinymce textarea bottom toolbar 
 * 	24004			Dinesh GK		 2013124530		 Reply window bottom toolbar items are hidding when zoom in/out happen.
 *  25938		   Venkatesh Teja	 201402162120	 TinyMCE editor getValue is not giving it's value. So changed code to get value.
 */


Ext.define('CHAT.view.Reply', {
		extend:'Ext.form.Panel',
		alias:'widget.reply',
		requires:['CHAT.view.BoxSelect'],
		hideToList:false,
		hideCatogeryList:false,
		subjectValue:'',
		bodyValue:'',
		link:'',
		bodyStyle: {
//		    background: 'white'
		},
		reply:false,
		adminVersion : false,
		replyAction : null,
		cls : 'message-task-reply',
		initComponent:function(){
			//
			//While creating a reply component, declaring a variable which is maintaining the directory structure for the attachments
			//
			this.replyattachments = [];
			
			var replyComponents = [], contextMenu = [];
			
			this.instanceId = new Date().getTime();
			var me = this;
			var flag = false;
						
			/**
			 * refs #6062
			 */
			
			if( me.adminVersion ) {
				
				this.adminVersion = me.adminVersion ;
				flag = true;
				
				if( this.post.record.get('threadtypeId') !== 3 ){
					flag = false;
				}
			}
			
			
			if( me.replyAction ) {
				
				this.replyAction = me.replyAction;
			}
			
			me.noOfAttachments = 0;
			
			
			if( this.adminVersion && (this.post.record.get('threadtypeId') == 3) ) {
				
				
				var actionStore = Ext.create('CHAT.store.TaskActions');

				actionStore.on('load',function(store,rec){
					
					var subjectField =  me.getForm().findField('subject');	
					
					for(var i = 0; i <= store.data.length ; i++) {
						
					if( rec[i].get('ID') == me.replyAction ) {

					var combo = Ext.getCmp(me.getId()+'action-combo');
					
					combo.select( rec[i] );
					combo.resetOriginalValue();
					me.replyAction = rec[i].get('ID');
					
					
					}
					}
					
				},this);
				actionStore.clearFilter();
				
				var action = this.post.record.data['taskaction'];
				actionStore.filter([{
						
					   filterFn: function(item) {
					   							   					   		
					   		return ( (item.get('ID')) != action );
						},
						
						scope:this
					}]);
				
				
			} else if( (this.post.record.get('threadtypeId') == 3) ) {
				
				me.replyAction = this.post.record.get('taskaction');
			}
			Ext.apply(this,{
//						bodyCls : 'newtopicbody',
						fieldDefaults: {
							labelWidth: 55,
							anchor: '100%'
						},
						dockedItems:[{
							xtype: 'toolbar',
							dock: 'bottom',
							cls : 'reply-bottom-tbar', //2013124530
							items:[
								     {
									xtype:'button',
									iconCls:'traininguploadsave',
									margin:'0 3 0 0 ',
									text:'Send',
									handler:function(btn,evt,eopts){
								    	 //
								    	 //If the Thread body is Blank then Thread should not create, instead It will give an alert message
								    	 //
										
								    	//var content = me.getForm().findField('content').contentValue;
								    	
										//201402162120
										var contentComp = me.getForm().findField('content');
								    	var content = contentComp.getEditor().getContent();
								    	contentComp.setValue(content);
								    	
								        if( content ){
								        	
								        	content = content.replace(/&nbsp;/gi," ");
								        	content = content.replace(/<p>/gi,"");
								        	content = content.replace(/<\/p>/gi,"");
								        	content = content.replace(/<br>/gi," ");
								        	content = Ext.String.trim(content);
								        }
								    	var subject = me.getForm().findField('subject').getValue();								        	 
								    	subject = subject.replace(/&nbsp;/gi,"");
								    	subject = subject.replace(/<br>/gi,"");
								    	subject = Ext.String.trim(subject);
								        	 
							        	 if( subject == '' ) {
							        		 
							        		 Ext.Msg.confirm({title: MESSAGE.NEWREPLY_VALIDATE_TITLE,
											     msg: MESSAGE.NEWREPLY_VALIDATE_SUBJECT,
											     buttons: Ext.Msg.OK,
											     icon: Ext.Msg.WARNING
								        	 });
							        		 
							        	 }
							        	 else if( !content || content == ''){
							    		
							        		 Ext.Msg.confirm({title: MESSAGE.NEWREPLY_VALIDATE_TITLE,
							        			 msg: MESSAGE.NEWREPLY_VALIDATE_BODY,
							        			 buttons: Ext.Msg.OK,
							        			 icon: Ext.Msg.WARNING
							        		 });
							        		 
								        }else if (content != '' ){
							        		var threadVideoId = me.post.record.get('threadVideoId');
							        		if( threadVideoId.substr(0,1) == 'Q'){
							        			me.fireEvent('validatereply',me);
							        		}else{
							        			me.fireEvent('savereply',me);
							        		}
								        }
								     }
								    },{
									xtype:'button',
									iconCls:'traininguploadcancel',
									margin:'0 3 0 0 ',
									text:'Cancel',
									handler:function(btn,evt,eopts){
										me.fireEvent('cancelreply',me,btn,evt,eopts);
									}
								}
								,{

									xtype:'hidden',
									name:'quoted_post_id',
									value:this.quoted_post_id
								
								},{

									xtype:'hidden',
									name:'thread_id',
									value:this.thread_id
								
								}
								]}],
							
							
							
							
							
//						layout : 'border',
//						style:{backgroundColor:'white'},
						items:[
						       {
//						    	   title : ' region',
//						    	   region : 'north',
						    	   cls: 'fieldset-cls',
						    	   xtype : 'fieldset',
						    	   border: 2,
						    	   style: {
						    		    borderColor: 'lightblue',
						    		    borderStyle: 'solid'
						    		},
						    		
						    		items : [{
										xtype:'textfield', 
										fieldLabel:'Subject',
										name:'subject',
										value:this.subjectValue,
										labelStyle:'width:60px;',
										width: '100%'
									},{

										
										xtype: 'combobox',
										store: actionStore,
										displayField: 'Name',
										name: 'actioncombo',
										id:me.getId()+'action-combo',
										editable:false,
										hidden:!flag,
										width:'50%',
										fieldLabel:REPLY.ACTION_COMBO_LABEL,
										emptyText : REPLY.COMBO_TEXT,
										listeners:{
							    			   select:function( view,opts ) {
							    				if ( flag == true ){ 
							    					
												var subjectField =  me.getForm().findField('subject');
												var bodyfield = me.getForm().findField( 'content');
												actionStore.each( function( rec ) {

													if ( view.value == rec.data.Name ) {

														subjectField.setValue( rec.data.ActionText );
														bodyfield.setValue( rec.data.Body);
														me.replyAction = rec.data.ID;

													}else if( me.replyAction == null){

														me.replyAction = me.post.taskAction;
													}
												},this ); 
												
							    				}
							    			   }
							    			   
							    			   
							    		   }
								
										
									}]
						       },{
				                     xtype: 'tinymce_textarea',
				                     noWysiwyg: false,
				                     name:'content',
				                     value : this.bodyValue,
				                     contentValue:this.bodyValue,
				                     height:250,
				                     width:'100%',
				                     tinyMCEConfig: {
											 // General options
											theme : "advanced",
											plugins : "autolink,lists,style,layer,advhr,advimage,advlink,emotions,inlinepopups,insertdatetime,media,contextmenu,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",          //201311131040
											
//											skin: "extjs",
											inlinepopups_skin: "extjs",
											
											// Original value is 23, hard coded.
											// with 23 the editor calculates the height wrong.
											// With these settings, you can do the fine tuning of the height
											// by the initialization.
											theme_advanced_row_height: 27,
											delta_height: 0,
												// Theme options
											theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,formatselect,fontselect,fontsizeselect,|,bullist,numlist,|,code,|,insertdate,inserttime,preview,|,forecolor,backcolor,|,sub,sup",
//											theme_advanced_buttons1 : "newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,formatselect,fontselect,fontsizeselect",
//											theme_advanced_buttons2 : "pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
//											theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
//											theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft",
											theme_advanced_toolbar_location : "top",
											theme_advanced_toolbar_align : "left",
											theme_advanced_statusbar_location : "none", //20131118456
											theme_advanced_path : false,
											theme_advanced_source_editor_height:300
//											theme_advanced_source_editor_width :
									}
						       },
					    	   {
									xtype:'container',
									id:me.getId()+'-attachedfiles',
									name:'attachments',
									items:[]
								},
					    	   {
									xtype:'button',
									style:{backgroundColor:'white',border:'1px solid #D0D0D0'},
									id:me.getId()+'-attachbutn',
									text:'Attachments',
									iconCls:'attach',
									cls: 'attachments-btn-cls',
									handler:function(btn,evt,eopts){
										
										me.fireEvent('attachfile',me,me,btn);
									}
								}
								]
			});
			this.callParent(arguments);
		},
		
		/**
		 * 
		 * 	When user clicks on send button after uploading files, this function shows the
		 * 	Attached files in the attachment panel. 
		 * 	It is getting called from classroom.js file saveattchments function
		 * 
		 */
		
		addAttachments:function( data , path, uploaderInstanceId ) {
			
			var me = this;
			
			this.attachmentsPnl = Ext.getCmp(me.getId()+'-attachedfiles');
			var attachBtn = Ext.getCmp(this.getId()+'-attachbutn');

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
					html:'<div><span> ' + name + '</span> <span> &nbsp;&nbsp;&nbsp;<b>('+ formatedSize+')</b>&nbsp;&nbsp;&nbsp; </span>  <a class="x-newtopic-file-cross icon-cross" alt="" parent_id='+ this.attachmentsPnl.getId()+'href = # >Remove </a></div>',
					border:false,
					name:data[j].data.name,
					path : data[j].data.PATH, 
					style: {
						paddingLeft : 15}
				});
				
//				this.attachmentsPnl.setHeight(50);
				this.attachmentsPnl.setVisible( true );
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
			
		}
		
		
	});