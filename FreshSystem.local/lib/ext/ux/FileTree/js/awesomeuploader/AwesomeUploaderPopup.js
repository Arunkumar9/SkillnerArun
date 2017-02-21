AwesomeUploaderPopup = Ext.extend(Ext.Window, {
	
	title: ' Add one or more files ',
	width: 600,
	height: 400,
	constrain:true,
	id:'uploadpopupwin',
	completedItems:0,
	closable :false,
	modal :true,
	initComponent: function() {
    	 var me = this;
    	 me.uniqueid='';
    	 me.saved=false;
    	 //
    	 //	Adding a reference configuration object eventRef,which is used to handle the events in classroo.js file.
    	 //
    	 me.eventRef = me.initialConfig.ref;
    	 if( !( me.eventRef ) ){
    		 
    		 me.eventRef = this;
    	 }
       	 Ext.apply(this,{
    		 items: [{
    			 
	    			flashUploadUrl:this.path+'&path=root&panel='+this.panel+'&cmd='+this.cmd+'&dir='+this.dir
	    			,frame:true
					,items:[{
							xtype:'awesomeuploader'
							,layout:'fit'
							,awesomeUploaderRoot:'/FreshSystem.local/lib/ext/ux/FileTree/js/awesomeuploader/'
				    		,path:this.path
							,panel:this.panel
							,cmd:this.cmd
							,dir:this.dir
							,id:'awesome-uploader'
							,listeners:{
								scope:this
								,fileupload:function(uploader, success, result,file , uniqueid ){
									
									me.uniqueid = uniqueid;
		    						this.completedItems++;
		    						me.eventRef.fireEvent( 'fileupload', uploader, success, result,file , uniqueid );
		    						
								},
								allfileuploaded:function( uploader,val ){
									
									me.uniqueid = val;
								},
								beforedeletefile : function( UploadGrid,UploadData, uniqueId,filename){
									
									return me.eventRef.fireEvent('beforedeletefile', UploadGrid,UploadData, uniqueId,filename  );
								},
								deletefile: function( UploadGrid,UploadData, uniqueId,filename,lessonname ){
									
									return me.eventRef.fireEvent('deletefilehandler', UploadGrid,UploadData, uniqueId,filename,me.eventRef.instanceId );
								}
							}
					}]
    		 }],
    		 buttonAlign: 'left',
    		 fbar: [{
		    			 xtype:'button',
						 text:'Save',
						 id:'traininguploadsavebtn',
						 handler: function(){
							 
							 	var uploader, store, index, errorFiles=0, data, pendingRecord ;
							 	uploader  = Ext.getCmp('awesome-uploader');
							 	store = uploader.fileGrid.getStore();
							 	data = store.data.items ; 
							 	var index = store.findBy( function( record, id ){
	    							
    								return record.get('status') != "Done" ;
    						    },this );
							 	pendingRecord = store.findBy( function( record, id ){
	    							
    								return record.get('status') == "Pending" ;
    						    },this );
							 	for( i= 0 ; i< data.length ; i++ )  {
    								
    								if( data[i].get('status') == "Error" )
    									errorFiles++;
    							}
									   						
	    						if( store.data.length == 0 || errorFiles == store.data.length ){
	    							Ext.MessageBox.show({
	    								title:'Alert!',
	    								msg: 'You are not save any upload files.',
	    								buttons: Ext.Msg.OK,
	    								modal:true,
	    								icon: Ext.MessageBox.ERROR,
	    								fn:function(){
	    									
	    									Ext.getCmp('uploadpopupwin').close();
	    								}
	    							});
	    							
	    						}else if( pendingRecord != -1 ){
	    							
	    							Ext.MessageBox.show({
	    								title:'Alert!',
	    								msg: 'Upload is in progress, please try once all the files are loaded!',
	    								buttons: Ext.Msg.OK,
	    								modal:true,
	    								icon: Ext.MessageBox.ERROR
	    								
	    							});
	    						}else{
	    							
	    							Ext.getCmp('uploadpopupwin').close();
	    							me.fileTreePanel.reload();
	    							
	    						}
						 }
  		    	},{
	  		    		 xtype:'button',
	    				 text:'Cancel',
	    				 scope:this,
	    				 handler: function( btn ){
	    			
			    				var fileNames = [], uploader, gridStore, data, i, errorFiles=0 ;
			    				uploader  = Ext.getCmp('awesome-uploader');
			    				gridStore = uploader.fileGrid.getStore();
			    				data = gridStore.data.items;
			    				
			    				for( i= 0 ; i< data.length ; i++ )  {
    								
    								if( data[i].get('status') == "Error" )
    									errorFiles++
    							}
			    				
			    				if( data.length != 0 && errorFiles != data.length ){
			    					Ext.MessageBox.confirm('Confirm', 'All the Uploaded Files Will be Lost.', function(btn){
			    						
			    						if(btn == 'yes'){
			    							
			    							for(var i = 0 ; i< data.length ; i++)  {
			    								if( data[i].get('status') == "Done" || data[i].get('status')== "Sending")
			    									fileNames.push( data[i].get('name') );
			    							}
			    							
			    							var options = {
			    									url:this.path
			    									,method:'post'
			    									,scope:this
			    									,params: Ext.applyIf({
			    											cmd: "deleteAll"
			    											,dir: this.dir
			    											,file: "root/"
			    											,panel: this.panel
			    											,uploadfiles:Ext.encode(fileNames)
			    										})
			    							};
			    							
			    							Ext.Ajax.request(options);
			    							Ext.getCmp('uploadpopupwin').close();
			    						}
			    					},this);
			    					
			    				}else{
			    					Ext.getCmp('uploadpopupwin').close();
			    				}	
	    			 	}
  		     }],
			listeners:{
				show:{
					scope:this
					,fn:function(){
						
						Ext.getCmp('awesome-uploader').initFlashUploader();
														
					}	
				}
			}
    	 });
    	 AwesomeUploaderPopup.superclass.initComponent.apply(this, arguments);
	}
});

Ext.reg('awesomeuploaderpopup', AwesomeUploaderPopup);
