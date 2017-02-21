
/*
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  24006          Arunkumar.muddada    201312041040    getting the objectURL and setting it and comiting
Awesome Uploader
AwesomeUploader JavaScript Class

Copyright (c) 2010, Andrew Rymarczyk
All rights reserved.

Redistribution and use in source and minified, compiled or otherwise obfuscated 
form, with or without modification, are permitted provided that the following 
conditions are met:

	* Redistributions of source code must retain the above copyright notice, 
		this list of conditions and the following disclaimer.
	* Redistributions in minified, compiled or otherwise obfuscated form must 
		reproduce the above copyright notice, this list of conditions and the 
		following disclaimer in the documentation and/or other materials 
		provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
if(SWFUpload !== undefined){
	SWFUpload.UPLOAD_ERROR_DESC = {
		'-200': 'HTTP ERROR'
		,'-210': 'MISSING UPLOAD URL'
		,'-220': 'IO ERROR'
		,'-230': 'SECURITY ERROR'
		,'-240': 'UPLOAD LIMIT EXCEEDED'
		,'-250': 'UPLOAD FAILED'
		,'-260': 'SPECIFIED FILE ID NOT FOUND'
		,'-270': 'FILE VALIDATION FAILED'
		,'-280': 'FILE CANCELLED'
		,'-290': 'UPLOAD STOPPED'
	};
	SWFUpload.QUEUE_ERROR_DESC = {
		'-100': 'QUEUE LIMIT EXCEEDED'
		,'-110': 'FILE EXCEEDS SIZE LIMIT'
		,'-120': 'ZERO BYTE FILE'
		,'-130': 'INVALID FILETYPE'
	};
}
*/
Ext.define('SWPCommon.lib.AwesomeModel',{
	extend:'Ext.data.Model',
	fields:['id', 'name', 'size', 'status', 'progress','objecturl']
});

Ext.define('SWPCommon.lib.AwesomeStore',{
	extend :'Ext.data.Store',
	model:'SWPCommon.lib.AwesomeModel', 
	autoLoad:false
});

 Ext.define('SWPCommon.lib.AwesomeUploader', { 
	 extend:'Ext.Panel',
	 requires:['Ext.XTemplate','Ext.ux.form.FileUploadField','SWPCommon.lib.XHRUpload'],
	 alias:'widget.awesomeuploader'
	,bodyCls:'upload-popup-css'
	,swfUploadItems:[]
 	,dndUploadItems:[]
 	,autoUpload:false
 	,dndTotalUploadItems:0
 	,swfTotalUploadItems:0
    ,extraPostData:{}
 	,layout:'fit'
	,doLayout:function(){
		SWPCommon.lib.AwesomeUploader.superclass.doLayout.apply(this, arguments);
	}
	,initComponent:function(){
		
		this.addEvents(
			'fileupload' 
				//
				// fireEvent('fileupload', Obj thisUploader, Bool uploadSuccessful, Obj serverResponse);
				//server response object will at minimum have a property "error" describing the error.
				//
			,'fileselectionerror'
				//
				// fireEvent('fileselectionerror', String message)
				//fired by drag and drop and swfuploader if a file that is too large is selected.
				//Swfupload also fires this even if a 0-byte file is selected or the file type 
				//does not match the "flashSwfUploadFileTypes" mask
			    //
		);
	
		this.uiniqueid = new Date().getTime();
		
		if( this.initialConfig.uploadPath != undefined ){
			
			this.extraPostData = {
				PATH :	this.initialConfig.uploadPath+this.uiniqueid+'/',
				isfromamazon: this.initialConfig.isfromamazon
			};
		}
		this.deleteFileIndex = 0;
		this.arrayDelete = [];
		this.fileRecord =  new SWPCommon.lib.AwesomeModel({});
		var filesSotre = Ext.create('SWPCommon.lib.AwesomeStore');
		this.initialConfig = this.initialConfig || {};
		this.initialConfig.awesomeUploaderRoot = this.initialConfig.awesomeUploaderRoot || '';
		this.autoUpload = this.initialConfig.autoUpload || false;
		this.packageFieldName = this.initialConfig.optionalZip ? 'ZIP Name' : 'Package Name ';
		this.optionalZip = this.initialConfig.optionalZip == undefined ? false : this.initialConfig.optionalZip ;
		this.checkPkgName = false;
		this.fileGrid = Ext.widget('grid',{
				x:0
				,y:0
				,height: 275
				,autoScroll: true
				,forceFit: true
//				,bodyCls : 'filegrid-cls'
				,viewConfig:{
				 //
				 // Setting overflow auto to restrict the irregular behavior of scroll bar because of autoScroll.
				 //
				 style :' width:100%; height:100%;' 
				}
				,enableHdMenu:false
				,store:filesSotre
				,columns:[
					{header:'File Name',dataIndex:'name', width:150}
					,{header:'Size',dataIndex:'size', width:60, renderer:Ext.util.Format.fileSize}
					,{header:'&nbsp;',dataIndex:'status', width:30, scope:this, renderer:this.statusIconRenderer}
					,{header:'Status',dataIndex:'status', width:60}
					,{header:'Progress',dataIndex:'progress',scope:this, renderer:this.progressBarColumnRenderer,width:150},
					{
				    xtype:'actioncolumn', 
				    width:30,
				    align: 'left',
				    items: [{
					    icon: '/lib/desktop/resources/images/fam/delete.png',
					    tooltip: 'Delete',
						scope: this,
						handler: function( grid, rowIndex, colIndex ){
				    	var fileRec = grid.getStore().getAt(rowIndex);
				    
				    		this.removeFile( fileRec );
				    	}
						}]
					}]
				,listeners:{
					render:{
						scope:this
						,fn:function(){
							this.initFlashUploader();
							this.initDnDUploader();								
						}	
					}
				}
			});
		var me = this;
		
		me.winModified = false;
		Ext.apply(this, this.initialConfig, {
			flashButtonSprite:'images/swfupload_browse_button_trans_56x22.PNG'
			,flashButtonWidth:'56'
			,flashButtonHeight:'22'
			,flashUploadFilePostName:'Filedata'
			,disableFlash:false
			,flashSwfUploadPath:this.initialConfig.awesomeUploaderRoot+'swfupload.swf'
			,flashSwfUploadFileSizeLimit:'500 MB' //deprecated
			,flashSwfUploadFileTypes:'*.*'
			,flashSwfUploadFileTypesDescription:'All Files'
			,flashUploadUrl:'upload.php'
			,xhrUploadUrl:'xhrupload.php' 
			,xhrFileNameHeader:'X-File-Name'
			,xhrExtraPostDataPrefix:'extraPostData_'
			,xhrFilePostName:'Filedata'
			,xhrSendMultiPartFormData:false
			,maxFileSizeBytes: 524288000 // 3 * 1024 * 1024 = 3 MiB
			,standardUploadFilePostName:'Filedata'
			,standardUploadUrl:'upload.php'
			,iconStatusPending:'images/hourglass.png'
			,iconStatusSending:'images/loading.gif'
			,iconStatusAborted:'images/cross.png'
			,iconStatusError:'images/cross.png'
			,iconStatusDone:'images/tick.png'
			,supressPopups:false
			,extraPostData:this.extraPostData
			,border:true
			,frame:true
			,fileId:0
			,anchor:'100% 100%'
			,dockedItems:[
			        {
			        	id:'awe-text-field',
			        	padding:'1 1 1 1',
			        	height:30,
			        	hidden : true,
			        	items:[{
			        		fieldLabel: this.packageFieldName,
			        		xtype: 'textfield',
			        		emptyText:this.packageFieldName	,
			        		allowBlank:false,
			        		listeners:{
			        			change:function(newValue,oldValue){
			        				me.winModified = true;
			        			}
			        		}

			        	}]
			        },
			{
				
				//swfupload and upload button container
				height:30,
				layout:'hbox',
				style: 'position:relative;',
				items:[{id:'flashbutton',height:30,width:60},{
				id:'uploadbutn',
				iconCls: 'uploadfile-icon',
				xtype:'button',
				text:'Start Upload',
				hidden:this.autoUpload,
				handler:function(){
					me.winModified = true;
					if( Ext.isEmpty(me.fileGrid.store.data.items) ){
						
						me.fileAlert(' Select at least one file');
						return;
					}
					
					me.startUploadHandler();
				}
				},{
					xtype:'checkbox',
					boxLabelAlign :'after',
					boxLabel:' ZIP Files'
						,padding:'0 0 0 30 '
						,hidden: !this.optionalZip
							,handler:function(bc,val,oval,ev){
								me.winModified = true;
								if( val == false ){
									me.checkPkgName = false;
									Ext.getCmp('awe-text-field').setVisible( false );
									me.doComponentLayout();
								}else {
									me.checkPkgName = true;
									Ext.getCmp('awe-text-field').setVisible( true );
									me.doComponentLayout();
								}
							}
				}]
			}
			],
			items:[ me.fileGrid]
		});
				
		this.callParent(arguments);
	}
	,fileAlert:function(text){
		if(this.supressPopups){
			return true;
		}
		if(this.fileAlertMsg === undefined || !this.fileAlertMsg.isVisible()){
			this.fileAlertMsgText = 'Error uploading:<BR>'+text;
			this.fileAlertMsg = Ext.MessageBox.show({
				title:'Upload Error',
				msg: this.fileAlertMsgText,
				buttons: Ext.Msg.OK,
				modal:true,
				icon: Ext.MessageBox.ERROR
			});
		}else{
			this.fileAlertMsgText += text;
			this.fileAlertMsg.updateText(this.fileAlertMsgText);
		}

	}
	,statusIconRenderer:function(value){
		switch(value){
			default:
				return value;
			case 'Pending':
				return '<img src="'+this.iconStatusPending+'" width=16 height=16>';
			case 'Sending':
				return '<img src="'+this.iconStatusSending+'" width=16 height=16>';
			case 'Aborted':
				return '<img src="'+this.iconStatusAborted+'" width=16 height=16>';
			case 'Error':
				return '<img src="'+this.iconStatusError+'" width=16 height=16>';
			case 'Done':
				return '<img src="'+this.iconStatusDone+'" width=16 height=16>';
		}
	}
	,progressBarColumnTemplate: new Ext.XTemplate(
			'<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-foreground">',
				'<div>{value} %</div>',
			'</div>'
//			,'<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-background" style="left:{value}%">',
//				'<div style="left:-{value}%">{value} %</div>',
//			'</div>'
				 
			
    )
	,progressBarColumnRenderer:function(value, meta, record, rowIndex, colIndex, store){
        meta.css += ' x-grid3-td-progress-cell';
		return this.progressBarColumnTemplate.apply({
			value: value
		});
	}
	,addFile:function(file){
	
		var exists = this.fileGrid.store.findBy(function(rec){
			if(rec.get('name') == file.name && rec.get('status') !='Error' ){
				return true;
			}
		});
		
		if( exists < 0 ){
		var fileRec = new SWPCommon.lib.AwesomeModel({
				id: ++this.fileId
				,name: file.name
				,size: file.size
				,status: 'Pending'
				,progress: '0'
				,complete: '0'
		});
		this.fileGrid.store.insert(0,fileRec);
		
		return fileRec;
		} else{
			return undefined;
		}
	}
	,updateFile:function(fileRec, key, value){
		try{
			
			if( key == 'status' && value == 'Error'){
				fileRec.set(key, value);
				fileRec.set('progress', 0 );
			}else{
				
				fileRec.set(key, value);
			}
			fileRec.commit();
		}
		catch ( e ){
		}
	}
	
	/**
	 * Removes the record from dnduploaditems/swfuploaditems array.
	 * and fires the event 'deletefilehandler',which can be handled in uploadpopup.js file. 
	 */
	
	,removeFile: function( fileRec ){
		
		var deleted = false;
		var uploadedorprogressingfile = false;
		var deletedFiles = [];
		this.fileName = fileRec.get('name');
		
			var swfup =false;
			for( i=0; i< this.dndUploadItems.length; i++ ){
				
				if( this.dndUploadItems[i] && this.dndUploadItems[i].record.data.id == fileRec.get('id') ){

					if( fileRec.get('status') == 'Sending'  ){
						this.dndUploadItems[i].cancelUpload();
						
					} else if( fileRec.get('status') == 'Done'  ){
						
						Ext.ComponentQuery.query('UploadPopup')[0].completedItems--;
						uploadedorprogressingfile=true;

					}

					this.dndUploadItems.splice(i,1);
					this.dndUploadItems[i] = undefined;
					this.dndTotalUploadItems--;
				}
			}
		
		for( i=0; i< this.swfUploadItems.length; i++ ){
			
			if(  this.swfUploadItems[i] && this.swfUploadItems[i].data.id == fileRec.get('id') ){
				if( fileRec.get('status') == 'Sending'  ){
					this.dndUploadItems[i].cancelUpload();
				} else if ( fileRec.get('status') == 'Done' ) {
					
					Ext.ComponentQuery.query('UploadPopup')[0].completedItems--;
					uploadedorprogressingfile=true;
				}
				this.swfUploadItems[i] = undefined;
				this.swfTotalUploadItems--;
			}
		}
		
		var beforeDelete = this.fireEvent('beforedeletefile',this.fileGrid, fileRec , this.uiniqueid, this.fileName );
		if( beforeDelete !== false ){
			
			this.fileGrid.getStore().remove( fileRec );
		}
		if( uploadedorprogressingfile ){
			
			this.fireEvent('deletefile',this.fileGrid, fileRec , this.uiniqueid, this.fileName );
		}
	}
	,initStdUpload:function(param){
		if(this.uploader){
			this.uploader.fileInput = null; //remove reference to file field. necessary to prevent destroying file field during upload.
//			Ext.destroy(this.uploader);
		}else{
			Ext.destroy(this.items.items[0]);
		}
		this.uploader = new Ext.form.field.File({
			renderTo:'flashbutton'
			,buttonText:'Browse...'
			,x:0
			,y:0
			,style:'position:relative;'
			,buttonOnly:true
			,name:this.standardUploadFilePostName
			,listeners:{
				scope:this
				,change:this.stdUploadFileSelected
			}
		});
		
	}
	,initFlashUploader:function(){
	
		if(this.disableFlash){
			this.initStdUpload();
			return true;
		}
	
		var settings = {
			flash_url: this.flashSwfUploadPath
			,upload_url: this.flashUploadUrl
			,file_size_limit: this.maxFileSizeBytes + 'B'
			,file_types: this.flashSwfUploadFileTypes
			,file_types_description: this.flashSwfUploadFileTypesDescription
			,file_upload_limit: 500
			,file_queue_limit: 0
			,debug: true
			,post_params: this.extraPostData
			,button_image_url: this.flashButtonSprite
			,button_width: this.flashButtonWidth
			,button_height: this.flashButtonHeight
			,button_window_mode: 'opaque'
			,file_post_name: this.flashUploadFilePostName
			,button_placeholder_id:'flashbutton'
			,file_dialog_complete_handler: Ext.Function.bind(this.swfUploadFileDialogComplete, this)
			,file_queued_handler: Ext.Function.bind(this.swfUploadfileQueued, this)
			,upload_start_handler: Ext.Function.bind(this.swfUploadUploadStart, this)
			,upload_error_handler: Ext.Function.bind(this.swfUploadUploadError, this)
			,upload_progress_handler: Ext.Function.bind(this.swfUploadUploadProgress, this)
			,upload_success_handler: Ext.Function.bind(this.swfUploadSuccess, this)
			,upload_complete_handler: Ext.Function.bind(this.swfUploadComplete, this)
			,file_queue_error_handler: Ext.Function.bind(this.swfUploadFileQueError, this)
			,minimum_flash_version: '9.0.28'
			,swfupload_load_failed_handler: Ext.Function.bind(this.initStdUpload, this)
		};
		this.swfUploader = new SWFUpload(settings);
	}
	,initDnDUploader:function(){
		
		this.dnduploadIndex =0;
		//==================
		// Attach drag and drop listeners to document body
		// this prevents incorrect drops, reloading the page with the dropped item
		// This may or may not be helpful
		if(!document.body.BodyDragSinker){
			document.body.BodyDragSinker = true;
			
			var body = Ext.fly(document.body);
			body.on({
				dragenter:function(event){
					return true;
				}
				,dragleave:function(event){
					return true;
				}
				,dragover:function(event){
					event.stopEvent();
					return true;
				}
				,drop:function(event){
					event.stopEvent();
					return true;
				}
			});
		}
		// end body events
		//==================
		
		this.el.on({
			dragenter:function(event){
				event.browserEvent.dataTransfer.dropEffect = 'move';
				return true;
			}
			,dragover:function(event){
				event.browserEvent.dataTransfer.dropEffect = 'move';
				event.stopEvent();
				return true;
			}
			,drop:{
				scope:this
				,fn:function(event){
					event.stopEvent();
					var files = event.browserEvent.dataTransfer.files;

					if(files === undefined){
						return true;
					}
					var len = files.length;
					while(--len >= 0){
						this.processDnDFileUpload(files[len]);
					}
				}
			}
		});
		
	}
	,processDnDFileUpload:function(file){

//		if( !this.autoUpload || (this.autoUpload && !Ext.isEmpty( this.down('textfield').getValue()) ) ){
			var fileRec = this.addFile({
				name: file.name
				,size: file.size
			});
//		}else{
//			this.fileAlert('Please enter the package name');
//			return false;
//		}
		
		if( fileRec == undefined ){
			
			this.fileAlert('<BR>'+file.name+'<BR><b> Already Exists </b><BR>');
			return;
		}else if( fileRec == false ){
			return false;
		}
		
		if(file.size > this.maxFileSizeBytes){
			this.updateFile(fileRec, 'status', 'Error');
			this.fileAlert('<BR>'+file.name+'<BR><b>File size exceeds allowed limit.</b><BR>');
			this.fireEvent('fileselectionerror', 'File size exceeds allowed limit.');
			return true;
		}
	
		var upload = new SWPCommon.lib.XHRUpload({
			url:this.xhrUploadUrl
			,filePostName:this.xhrFilePostName
			,fileNameHeader:this.xhrFileNameHeader
			,extraPostData:this.extraPostData
			,sendMultiPartFormData:this.xhrSendMultiPartFormData
			,file:file
			,record:fileRec
			,listeners:{
				scope:this
				,uploadloadstart:function(event){
					this.updateFile(fileRec, 'status', 'Sending');
				}
				,uploadprogress:function(event){
					this.updateFile(fileRec, 'progress', Math.round((event.loaded / event.total)*100));
				}
				// XHR Events
				,loadstart:function(event){
					this.updateFile(fileRec, 'status', 'Sending');
				}
				,progress:function(event){
					fileRec.set('progress', Math.round((event.loaded / event.total)*100) );
					fileRec.commit();
				}
				,abort:function(event){
					this.updateFile(fileRec, 'status', 'Aborted');
					this.fireEvent('fileupload', this, false, {error:'XHR upload aborted'});
				}
				,error:function(event){
					this.updateFile(fileRec, 'status', 'Error');
					this.fireEvent('fileupload', this, false, {error:'XHR upload error'});
				}
				,load:function(event){
					
					try{
						var result = Ext.JSON.decode(upload.xhr.responseText);//throws a SyntaxError.
					}catch(e){
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK
							,icon: Ext.MessageBox.ERROR
							,modal:true
							,title:'Upload Error!'
							,msg:' Unabled to upload the file <b> '+ fileRec.get('name') + ". <b> Please try again "
						});
						console.log( " Error : " + upload.xhr.responseText );
						this.updateFile(fileRec, 'status', 'Error');
						this.updateFile(fileRec, 'progress', '0');
						this.fireEvent('fileupload', this, false, {error:'Invalid JSON returned'},fileRec,this.uiniqueid);
						return true;
					}
					if( result.success ){
						fileRec.set('progress', 100 );
						fileRec.set('status', 'Done');
						//201312041040
						fileRec.set('objecturl', result.objectUrl);
						fileRec.commit();						
						this.fireEvent('fileupload', this, true, result,fileRec,this.uiniqueid);
					}else{
						this.fileAlert('<BR>'+file.name+'<BR><b>'+result.error+'</b><BR>');
						this.updateFile(fileRec, 'status', 'Error');
						this.fireEvent('fileupload', this, false, result,fileRec,this.uiniqueid);
					}
				}
			}
		});
		
		if( this.autoUpload ){
			upload.send();
		}else{
			this.dndUploadItems[this.dnduploadIndex] = upload;
			this.dndTotalUploadItems++;
			this.dnduploadIndex++;
			
			/**
			 * If more than 1 file is being uploaded, enabling Zip check box.
			 * 
			 */
			
			if( this.dndTotalUploadItems > 1 && !this.checkPkgName ) {
				
				this.down('checkbox').setValue(true);
			}
		}
	}
	,swfUploadUploadProgress:function(file, bytesComplete, bytesTotal){
		this.updateFile(this.swfUploadItems[file.index], 'progress', Math.round((bytesComplete / bytesTotal)*100));	
	}
	,swfUploadFileDialogComplete:function(){
		if( this.autoUpload ){
			
			
			this.swfUploader.startUpload();
		}
	}
	,startUploadHandler : function(){
		var txtf = this.down('textfield');

		//
		// fire the event validate packagename which will be handled at uploadPopUp to 
		// not allow to have packages with duplicate name.
		//
		
		if( this.fireEvent('startupload',this , txtf.getValue() , ( this.swfTotalUploadItems + this.dndTotalUploadItems  ) ) !== false ){
			this.startUploadingFiles();
		}
	}
	/**
	 * This method will be called by the uploadpop component after
	 * validating the packagename. this method will startuploading files
	 * and clears the dndUploadItems after upload complete
	 */
	,startUploadingFiles : function(){
		
		this.swfUploader.startUpload();
		if( !Ext.isEmpty( this.dndUploadItems ) ){
			
			for(var k=0;k<this.dnduploadIndex;k++){
				if( this.dndUploadItems[ k ] != undefined ){
					
					this.dndUploadItems[ k ].send();
				}
			}
		}
		this.dndUploadItems=[];
		this.dnduploadIndex =0;
		this.fireEvent('allfileuploaded',this , this.uiniqueid );
	}
	,swfUploadUploadStart:function(file){
		
		if( this.swfUploadItems[ file.index ] == undefined ){
			this.swfUploader.cancelUpload();
			return ;
		}
		this.swfUploader.setPostParams(this.extraPostData); //sync post data with flash
		this.updateFile(this.swfUploadItems[file.index], 'status', 'Sending');
	}
	,swfUploadComplete:function(file){ //called if the file is errored out or on success
		this.swfUploader.startUpload(); //as per the swfupload docs, start the next upload!
	}
	,swfUploadUploadError:function(file, errorCode, message){
		
		if( errorCode != '-280' ){
			this.fileAlert('<BR>'+file.name+'<BR><b>'+message+'</b><BR>');//SWFUpload.UPLOAD_ERROR_DESC[errorCode.toString()]

			this.updateFile(this.swfUploadItems[file.index], 'status', 'Error');

			this.fireEvent('fileupload', this, false, {error:message});
		}else{
			this.swfUploader.startUpload();
		}
	}
	,swfUploadSuccess:function(file, serverData){ //called when the file is done
		try{
			var result = Ext.JSON.decode(serverData);//throws a SyntaxError.
		}catch(e){
			console.log(serverData);
			Ext.MessageBox.show({
				buttons: Ext.MessageBox.OK
				,icon: Ext.MessageBox.ERROR
				,modal:false
				,title:'Upload Error!'
				,msg:'Unable to upload the file <b>'+ file.name + " <b> . Please try again "
			});
			this.updateFile(this.swfUploadItems[file.index], 'status', 'Error');
			this.updateFile(this.swfUploadItems[file.index], 'progress', '0');
			
			this.fireEvent('fileupload', this, false, {error:'Invalid JSON returned'},file,this.uiniqueid);
			return true;
		}
		if( result.success ){
			
				this.swfUploadItems[file.index].set('progress',100);
				this.swfUploadItems[file.index].set('status', 'Done');
				this.swfUploadItems[file.index].set('objecturl', result.objectUrl);
				this.swfUploadItems[file.index].commit();
			this.fireEvent('fileupload', this, true, result,file,this.uiniqueid);
		}else{
			this.fileAlert('<BR>'+file.name+'<BR><b>'+result.error+'</b><BR>');
			this.updateFile(this.swfUploadItems[file.index], 'status', 'Error');
			this.fireEvent('fileupload', this, false, result,file,this.uiniqueid);
		}
	}
	,swfUploadfileQueued:function(file){
	
//		if( !this.autoUpload || (this.autoUpload && !Ext.isEmpty( this.down('textfield').getValue()) ) ){
		if( this.swfTotalUploadItems <= 0 ){
			
			var swfGridLength = this.down("gridview").getStore().data.length;
			
			if( swfGridLength > 0 ){
				
				this.swfTotalUploadItems = swfGridLength;
			}else{
				
				this.swfTotalUploadItems = 0;
			}
		}
			var fileRec =  this.addFile({
				name: file.name
				,size: file.size
			});
			
			if( fileRec ){
			this.swfUploadItems[file.index] =fileRec;
			this.swfTotalUploadItems++;
			
			/**
			 * If more than 1 file is being uploaded, enabling Zip check box.
			 * 
			 */
			
			if( this.swfTotalUploadItems > 1 && !this.checkPkgName ) {
				
				this.down('checkbox').setValue(true);
			}
			return true;
			}else if( fileRec == undefined ){
				
				this.swfUploadItems[file.index] =undefined;
				this.fileAlert('<BR>'+file.name+'<BR><b> Already Exists </b><BR>');
				return;
			}else{
				return false;
			}
//		}else{
//			this.swfUploadItems[file.index] =undefined;
//			this.fileAlert('Please enter the package name');
//			
//			return false;
//		}
		
	}
	,swfUploadFileQueError:function(file, error, message){
		this.swfUploadItems[file.index] = this.addFile({
			name: file.name
			,size: file.size
		});
		this.updateFile(this.swfUploadItems[file.index], 'status', 'Error');
		this.fileAlert('<BR>'+file.name+'<BR><b>'+message+'</b><BR>');
		this.fireEvent('fileselectionerror', message);
	}
	,stdUploadSuccess:function(form, action){
		form.el.fileRec.set('progress',100);
		form.el.fileRec.set('status', 'Done');
		form.el.fileRec.commit();
		this.fireEvent('fileupload', this, true, action.result);
	}
	,stdUploadFail:function(form, action){
		this.updateFile(form.el.fileRec, 'status', 'Error');
		this.fireEvent('fileupload', this, false, action.result);
		this.fileAlert('<BR>'+form.el.fileRec.get('name')+'<BR><b>'+action.result.error+'</b><BR>');
	}
	,stdUploadFileSelected:function(fileBrowser, fileName){
		
		var lastSlash = fileName.lastIndexOf('/'); //check for *nix full file path
		if( lastSlash < 0 ){
			lastSlash = fileName.lastIndexOf('\\'); //check for win full file path
		}
		if(lastSlash > 0){
			fileName = fileName.substr(lastSlash+1);
		}
		var file = {
			name:fileName
			,size:'0'
		};
		
		if(Ext.isDefined(fileBrowser.fileInputEl.dom.files) ){
			file.size = fileBrowser.fileInputEl.dom.files[0].size;
		};
		
		var fileRec = this.addFile({
			name: file.name
			,size: file.size
		});
		
		if( file.size > this.maxFileSizeBytes){
			this.updateFile(fileRec, 'status', 'Error');
			this.fileAlert('<BR>'+file.name+'<BR><b>File size exceeds allowed limit.</b><BR>');
			this.fireEvent('fileselectionerror', 'File size exceeds allowed limit.');
			return true;
		}
		
		var formEl = document.createElement('form'),
			extraPost;
		for( attr in this.extraPostData){
			extraPost = document.createElement('input'),
			extraPost.type = 'hidden';
			extraPost.name = attr;
			extraPost.value = this.extraPostData[attr];
			formEl.appendChild(extraPost);
		}
		formEl = this.el.appendChild(formEl);
		formEl.fileRec = fileRec;
		fileBrowser.fileInputEl.addCls('au-hidden');
		formEl.appendChild(fileBrowser.fileInputEl);
		formEl.addCls('au-hidden');
		var formSubmit = new Ext.form.BasicForm(formEl,{
			method:'POST'
			,fileUpload:true
		});
		
		this.initStdUpload(); //re-init uploader for multiple simultaneous uploads
	}

});

