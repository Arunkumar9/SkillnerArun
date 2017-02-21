/**
 * @author Phani Kiran
 */

Ext.define('CHAT.view.NewTopicWindow', {
	extend:'Ext.window.Window',
	alias:'widget.newtopicwindow',
	layout:'fit',
	modal:true,
	topic : undefined,
	maximizable:true,
	constrain: true,
	scope: this,
	initComponent:function() {
	
		var height = (Ext.getBody().getHeight() * 80 )/100;
		var htmlheight = (height*65)/100;
	this.items = [ Ext.create('CHAT.view.NewTopic',Ext.apply(this.topic,{editorHeight:htmlheight}))];
	
	this.height = height;
	this.width = ((Ext.getBody().getWidth() * 85) /100);
	this.callParent(arguments);
	
	},
	listeners: {
   
			beforeClose: function( window ) {
				
				if ( this.comingFromSave == true ) {
					
					return true;
				}
				
				var newtopic = window.items.items[0];
				
				   //
				   //	If only empty spaces are their then it should not ask for conform box.
				   //
				
				var content = newtopic.getForm().findField('content').contentValue;
				
				if( content ){
					
					content = content.replace(/&nbsp;/gi,"");
					content = content.replace(/<br>/gi,"");
					content = $.trim(content);
				}
			 	
			      if ( content == '' ) {
			    	  
			     	 newtopic.getForm().findField('content').setValue(""); 
			      }
			      
			    var attachments = Ext.getCmp(newtopic.getId()+'-attachedfiles');
			    var noOfAttachments=attachments.items.length;
			    
			    // 	If there is any Modification, in the NewTopic, 
			    //	then before cancelling the window it will show a conform box.
			    
			    if( ( !window.closeconfirmed && newtopic.getForm().isDirty() ) || ( noOfAttachments > 0 && newtopic.attachmentfolders.length > 0 ) ) {
			    	
					   Ext.Msg.confirm({
						   		 title:MESSAGE.CANCEL_NEWTOPIC_TITLE,
							     msg: MESSAGE.CANCEL_NEWTOPIC,
							     buttons: Ext.Msg.YESNO,
							     icon: Ext.Msg.QUESTION,
							     fn:function( btn ) {
							    	 
							    	 	//
									   //If the user clicks on Yes then, it will bring the user back to the Message list, otherwise
									   // Continue with sending the message
									   //
							    	 	if ( btn === 'yes' ) {
							    	 		
							    	 		 //
								    		 // If any attachments are their for the Thread
								    		 // then all the attachments will get deleted from the file structure,before closing the NewTopic window. 
								    		 //	 		
							    	 		
							    	 		if( newtopic.attachmentfolders.length > 0 ) {
							    	 			
											    CollaborationToolMgr.recursiveRemoveDir( newtopic.attachmentfolders );
											    newtopic.attachmentfolders = [];
									    	}
										    
							    	 		window.closeconfirmed = true;
										    window.close();
										    
							    	 	}else {
							    	 		
							    	 		window.closeconfirmed = false;
							    	 	}
							    }
					});
					   return false;
					   
				  }else {
					  
					   return true; 
				   }
		},
		resize: function( window,width,height,eopts ) {
			
			var fieldsetHeight  = window.down('fieldset').getHeight();
			fieldsetHeight = fieldsetHeight + 10 +35 + 68; 
			window.down('tinymce_textarea').setHeight( height - fieldsetHeight );
			
		},close :function(panel, eOpts) {
			//When we send the message or task then we need to enable the new topic
			//button to enable user to click on the new topic button again
			//refs #22607
			var msgId = Ext.ComponentQuery.query('datalist')[0].id;
			var taskId = Ext.ComponentQuery.query('datalist')[1].id;
			Ext.getCmp(msgId+'add-item').setDisabled(false);
			Ext.getCmp(taskId+'add-item').setDisabled(false);
		}
	}
});