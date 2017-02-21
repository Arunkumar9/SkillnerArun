/**
 * @author Phani Kiran Gutha
 * 
 */
Ext.define('SWPCommon.view.workfiles.UploadPopup', {
	extend: 'Ext.window.Window',
	alias: 'widget.UploadPopup',
	requires: ['Ext.form.Panel','SWPCommon.lib.AwesomeUploader','SWPCommon.model.File'],
	title: ' Upload Files ',
    height: 400,
    width: 600,
//     maximizable:true,
     modal:true,
     bodyStyle:'overflow:hidden;',
     closable:false,
     queuedItems :0,
     completedItems:0,
     autoUpload:false,
     optionalZip:false,
     uploadPath:'.',
     layout:'fit',
     cls:'uploadpopup',
     uploadPath : true,
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


	    			flashUploadUrl:'upload.php'
	    			,frame:true
	    			,items:[{
	    				xtype:'awesomeuploader'
	    				,awesomeUploaderRoot:'/extapps/common/lib/'
	    					,autoUpload: me.autoUpload
	    					,optionalZip: me.optionalZip
	    					,uploadPath: me.uploadPath
	    					,isfromamazon :  me.isfromamazon
	    				,listeners:{
	    					scope:this
	    					,fileupload:function(uploader, success, result,file , uniqueid ){
	    					
	    						me.uniqueid = uniqueid;
	    						this.completedItems++;
	    						me.eventRef.fireEvent( 'fileupload', uploader, success, result,file , uniqueid );
	    					},
	    					allfileuploaded:function( uploader,val ){
	    						
	    						me.uniqueid = val;
	    					}
	    					/**
	    					 * validate the package name . if the packages with same name exists
	    					 * then show's alert message to user, asking to change the package name.
	    					 * Firing an event here to handle the functionality in classroom.js to make this functionality 
	    					 * reusable.
	    					 */
	    					,validatepackagename:function( uploader,pkgName , totalItems ){
	    						this.queuedItems =  totalItems;
	    						var filesGrid = Ext.ComponentQuery.query('workfiles filesgrid ')[0];
	    						var awesomeUploader = Ext.ComponentQuery.query('awesomeuploader')[0];
	    						return me.eventRef.fireEvent( 'validatepackagename', uploader,pkgName,totalItems ,filesGrid, awesomeUploader);
	    						
	    					},
	    					beforedeletefile : function( UploadGrid,UploadData, uniqueId,filename){
	    						return me.eventRef.fireEvent('beforedeletefile', UploadGrid,UploadData, uniqueId,filename  );
	    					},
	    					/**
	    					 *   Removes the selected uploaded file from database, if status is done,by calling
	    					 *   removeUploadFile function to videoRecordMgr.php file. else, removing the record from
	    					 *   store.Firing an event here to handle the functionality in classroom.js to make this 
	    					 *   functionality reusable.
	    					 *   @param fileGrid, selected row record, uniqueId of package, name of uploaded file, 
	    					 *   and lesson name respectively. 
	    					 */
	    					
	    					deletefile: function( UploadGrid,UploadData, uniqueId,filename,lessonname ){
	    						var awesome = me.down('awesomeuploader');
	    						return me.eventRef.fireEvent('deletefilehandler', UploadGrid,UploadData, uniqueId,filename,me.eventRef.instanceId );
	    					}
	    				}
	    			}]
	    		
				
    		 }],
    		 dockedItems:[{
    			 xtype:'toolbar',
                 ui:'plain',
    			 dock:'bottom',
    			 items:[{
    				 xtype:'button',
    				 text:'Save',
    				 id:'traininguploadsavebtn',
    				 iconCls:'traininguploadsave',
    				 handler: function(){
    					
    					 var awesome = me.down('awesomeuploader');
     					var balfiles = ( awesome.dndTotalUploadItems + awesome.swfTotalUploadItems ) - me.completedItems; 
     					var namefield = Ext.ComponentQuery.query('awesomeuploader textfield')[0];
     					 var awesome = me.down('awesomeuploader');
     					 if( awesome.checkPkgName == true ){
     						 if( Ext.isEmpty( namefield.getValue() )){
     							 Ext.MessageBox.show({
     									title: MESSAGE.UPLOADERROR_TITLE,
     									msg: MESSAGE.UPLOADERROR_ENTERPACKAGE,
     									buttons: Ext.Msg.OK,
     									modal:true,
     									icon: Ext.MessageBox.ERROR
     								});
     							 return;
     						 } 
     					 }
     					 if(  balfiles > 0 ){
     						 Ext.MessageBox.show({
     							 title: MESSAGE.UPLOADERROR_TITLE,
 									msg: ( balfiles ) +" Files are not yet uploaded, <br> " + " click on Yes to save only uploaded files , No to wait till upload completion. ",
 									buttons: Ext.MessageBox.YESNO,
 									modal:true,
 									fn: me.handleYesNo,   
 									scope:me,
 									icon: Ext.MessageBox.QUESTION
 								});
     						 return;
     					 }else{
     						 me.onButtonTap(me);
     					 }
     				 }
    			 },
    			 {
    				 xtype:'button',
    				 text:'Cancel',
    				 id:'traininguploadCancelbtn',
    				 iconCls:'traininguploadcancel',
    				 handler: function(){
    				 
    				 	me.eventRef.fireEvent('canceluploadedfiles', me,me.uniqueid ); 
    			 	}
    			 }]
    		 }]
    	 });
    	 this.callParent(arguments);
     },
    	 
     handleYesNo : function( btn ){
    	 
    	 if( btn==='yes' ){
    		 
    		this.savePackage();
    		 
    	 }else{
    		 return;
    	 }
    	 
     },
    savePackage: function(){
    	 var me = this;
    	var awesome = me.down('awesomeuploader');
    	var namefield = Ext.ComponentQuery.query('awesomeuploader textfield')[0];
		 this.saved = true;
		 this.setLoading(true);
		 var pkgName = awesome.checkPkgName ? namefield.getValue()+'.zip' : namefield.getValue();
		 if( !Ext.isEmpty( pkgName  ) ){
				CollaborationToolMgr.validatePackage( this.initialConfig.uploadPath ,pkgName,function(r,t){
					r = Ext.decode( r );
					if( !r.valid ){
						
						this.setLoading(false);
						
						 Ext.MessageBox.show({
							 title: MESSAGE.UPLOADERROR_TITLE,
								msg: MESSAGE.UPLOADERROR_REENTERPACKAGE,
								buttons: Ext.MessageBox.OK,
								modal:true,
								scope:me,
								icon: Ext.MessageBox.QUESTION
							});
						return false;
					}else{
						( this.eventRef ).fireEvent('saveupload',this,this.uniqueid,namefield.getValue(),awesome,awesome.fileGrid.getStore(),awesome.checkPkgName );
						awesome.swfUploader.destroy();
						awesome.swfUploadItems = [];
					}
			},this);
		 }else{
			 ( this.eventRef ).fireEvent('saveupload',this,this.uniqueid,namefield.getValue(),awesome,awesome.fileGrid.getStore(),awesome.checkPkgName );
				awesome.swfUploader.destroy();
				awesome.swfUploadItems = [];
		 }
		
    },
    onButtonTap: function(btn, event, options) {
    	
    	now = +new Date();
    	// Keep the user from multiple clicks
    
    	if (now < me.lastTapTimestamp + 300) {
    		
    	me.lastTapTimestamp = now;
    	return;
    	}
    	me.lastTapTimestamp = now;

    	this.savePackage();
    	}
});