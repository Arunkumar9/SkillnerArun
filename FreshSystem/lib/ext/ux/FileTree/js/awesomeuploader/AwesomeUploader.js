
/*
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

AwesomeUploader = Ext.extend(Ext.Panel, {
	jsonUrl:'/test/router/fileMan/'
	,jsonUrlUpload:'upload'
	,swfUploadItems:[]
	,dndUploadItems:[]
	,layout:'fit'
	,autoUpload:false
	,swfTotalUploadItems:0
	,doLayout:function(){
		AwesomeUploader.superclass.doLayout.apply(this, arguments);
		this.fileGrid.getView().refresh();
	}
	,initComponent:function(){
		this.addEvents(
			'fileupload' 
				// fireEvent('fileupload', Obj thisUploader, Bool uploadSuccessful, Obj serverResponse);
				//server response object will at minimum have a property "error" describing the error.
			,'fileselectionerror'
				// fireEvent('fileselectionerror', String message)
				//fired by drag and drop and swfuploader if a file that is too large is selected.
				//Swfupload also fires this even if a 0-byte file is selected or the file type does not match the "flashSwfUploadFileTypes" mask
		);
		this.uiniqueid = new Date().getTime();
		var fields = ['id', 'name', 'size', 'status', 'progress', 'progressStatus'];
		this.fileRecord = Ext.data.Record.create(fields);

		this.initialConfig = this.initialConfig || {};
		this.autoUpload = this.initialConfig.autoUpload || false;
		this.initialConfig.awesomeUploaderRoot = this.initialConfig.awesomeUploaderRoot || '';
		var me = this;
		
		me.winModified = false;
		Ext.apply(this, this.initialConfig, {
			flashButtonSprite:this.initialConfig.awesomeUploaderRoot+'swfupload_browse_button_trans_56x22.PNG'
			,flashButtonWidth:'56'
			,flashButtonHeight:'22'
			,flashUploadFilePostName:'Filedata'
			,disableFlash:false
			,flashSwfUploadPath:this.initialConfig.awesomeUploaderRoot+'swfupload.swf'
			//,flashSwfUploadFileSizeLimit:'3 MB' //deprecated
			,flashSwfUploadFileTypes:'*.*'
			,flashSwfUploadFileTypesDescription:'All Files'
			,flashUploadUrl:this.path+'&path=root&panel='+this.panel+'&cmd='+this.cmd+'&dir='+this.dir
			,xhrUploadUrl:this.path+'&path=root&panel='+this.panel+'&cmd='+this.cmd+'&dir='+this.dir
			,xhrFileNameHeader:'X-File-Name'
			,xhrExtraPostDataPrefix:'extraPostData_'
			,xhrFilePostName:'Filedata'
			,xhrSendMultiPartFormData:false
			,maxFileSizeBytes: 262144000 // 3 * 1024 * 1024 = 3 MiB
			,standardUploadFilePostName:'Filedata'
			,standardUploadUrl:this.path+'&path=root&panel='+this.panel+'&cmd='+this.cmd+'&dir='+this.dir
			,iconStatusPending:this.initialConfig.awesomeUploaderRoot+'hourglass.png'
			,iconStatusSending:this.initialConfig.awesomeUploaderRoot+'loading.gif'
			,iconStatusAborted:this.initialConfig.awesomeUploaderRoot+'cross.png'
			,iconStatusError:this.initialConfig.awesomeUploaderRoot+'cross.png'
			,iconStatusDone:this.initialConfig.awesomeUploaderRoot+'tick.png'
			,supressPopups:false
			,extraPostData:{}
//			,width: 600
//			,height: 322
			,autoScroll: true
			,border:true
			,frame:true
			,fileId:0
			//swfupload and upload button container
			,items:[
				    {
				    	layout:'hbox',	
				    	cls:"awesometoppanel",
				    	items:[
			{height:22,width:58,items:[{id:'flashbutton',height:22,width:58}]},
			{
				id:'uploadbutn',
				xtype:'button',
				text:'Upload',
				width:60,
				hidden:this.autoUpload,
				handler:function(){
					me.winModified = true;
					if( Ext.isEmpty(me.fileGrid.store.data.items) ){
			
						me.fileAlert(' Select at least one file');
						return;
					}
					me.startUploadHandler();
				}
			}
			]
},
			{	
				xtype:'grid'
				,x:0
				,y:30
//				,width:this.initialConfig.gridWidth || 530
				,height:this.initialConfig.gridHeight || 285
				,enableHdMenu:false
				,viewConfig:{
					forceFit :true
				}
				,store:new Ext.data.ArrayStore({
					fields: fields
					,reader: new Ext.data.ArrayReader({idIndex: 0}, this.fileRecord)
				})
				,columns:[
					{header:'File Name',dataIndex:'name', width:150}
					,{header:'Size',dataIndex:'size', width:60, renderer:Ext.util.Format.fileSize}
					,{header:'&nbsp;',dataIndex:'status', width:30, scope:this, renderer:this.statusIconRenderer}
					,{header:'Status',dataIndex:'status', width:60}
					,{header:'Progress',dataIndex:'progress',width:200, scope:this, renderer:this.progressBarColumnRenderer}
					,{
					    xtype:'actioncolumn', 
					    width:50,
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
					afterrender:{
						scope:this
						,fn:function(){
							this.fileGrid = this.items.items[1];
							this.initDnDUploader();								
						}	
					}
				}
			}]
		});
		
		AwesomeUploader.superclass.initComponent.apply(this, arguments);
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
			'</div>',
			'<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-background" style="left:{value}%">',
				'<div style="left:-{value}%">{value} %</div>',
			'</div>'
    )
	,progressBarColumnRenderer:function(value, meta, record, rowIndex, colIndex, store ){
		
		if( (value > 0) && (value < 100) ){
			
			value = 0;
		}else if(value == 100 && (record.get('progressStatus') < 4) ){
			
			record.data.progressStatus = record.get('progressStatus')+1 ;
			value = 25 * record.get('progressStatus');
		}else if( value == 0 &&  record.get('progressStatus') == 3 ){
			
			value = 25 * record.get('progressStatus');
		}
	
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
			
				var fileRec = new this.fileRecord(
						Ext.apply(file,{
							id: ++this.fileId
							,name: file.name
							,size: file.size
							,status: 'Pending'
							,progress: '0'
							,complete: '0'
							,progressStatus : 0
						})
				);
				this.fileGrid.store.insert(0,fileRec);
				
				return fileRec;
		}else {
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
//					this.dndUploadItems[i].cancelUpload();
					this.swfUploader.cancelUpload();
					uploadedorprogressingfile=true;
					
				} else if( fileRec.get('status') == 'Done'  ){
					
					Ext.getCmp('uploadpopupwin').completedItems--;
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
					
//					this.swfUploadItems[i].cancelUpload();
					this.swfUploader.cancelUpload();
					uploadedorprogressingfile=true;
					
				} else if ( fileRec.get('status') == 'Done' ) {
					
					Ext.getCmp('uploadpopupwin').completedItems--;
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
			var options = {
					 url:this.path
					,method:'post'
					,scope:this
					,params: Ext.applyIf({
						cmd: "delete"
						,dir: this.dir
						,file: "root/"+fileRec.get('name')
						,panel: this.panel
						,from :'awesomeuploader'
					})
				};
				Ext.Ajax.request(options);
			
		}
	}
	,initStdUpload:function(param){
		if(this.uploader){
			this.uploader.fileInput = null; //remove reference to file field. necessary to prevent destroying file field during upload.
			Ext.destroy(this.uploader);
		}else{
			Ext.destroy(this.items.items[0]);
		}
		this.uploader = new Ext.ux.form.File({
			renderTo: 'flashbutton' 
			,buttonText:'Browse...'
			,x:0
			,y:0
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
			,file_types: this.flashSwfUploadFileTypes
			,file_types_description: this.flashSwfUploadFileTypesDescription
			,file_upload_limit: 100
			,file_queue_limit: 0
			,debug: false
			,post_params: this.extraPostData
			,button_image_url: this.flashButtonSprite
			,button_width: this.flashButtonWidth
			,button_height: this.flashButtonHeight
			,button_window_mode: 'opaque'
			,file_post_name: this.flashUploadFilePostName
//			,button_placeholder:this.items.items[0].body.dom
			,button_placeholder_id:'flashbutton'
			,file_queued_handler: this.swfUploadfileQueued.createDelegate(this)
			,file_dialog_complete_handler: this.swfUploadFileDialogComplete.createDelegate(this)
			,upload_start_handler: this.swfUploadUploadStart.createDelegate(this)
			,upload_error_handler: this.swfUploadUploadError.createDelegate(this)
			,upload_progress_handler: this.swfUploadUploadProgress.createDelegate(this)
			,upload_success_handler: this.swfUploadSuccess.createDelegate(this)
			,upload_complete_handler: this.swfUploadComplete.createDelegate(this)
			,file_queue_error_handler: this.swfUploadFileQueError.createDelegate(this)
			,minimum_flash_version: '9.0.28'
			,swfupload_load_failed_handler: this.initStdUpload.createDelegate(this)
		};
		this.swfUploader = new SWFUpload(settings);
	}
	,initDnDUploader:function(){
		this.dnduploadIndex = 0;
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

		var fileRec = this.addFile({
			name: file.name
			,size: file.size
		});

		var upload = new Ext.ux.XHRUpload({
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
						
						var result = Ext.util.JSON.decode(upload.xhr.responseText);//throws a SyntaxError.
					}catch(e){
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK
							,icon: Ext.MessageBox.ERROR
							,modal:true
							,title:'Upload Error!'
							,msg:' Unabled to upload the file <b> '+ fileRec.get('name') + '. <b> Please try again '
						});
						this.updateFile(fileRec, 'status', 'Error');
						this.updateFile(fileRec, 'progress', '0');
						this.fireEvent('fileupload', this, false, {error:'Invalid JSON returned'},fileRec,this.uiniqueid);
						return true;
					}
					if( result.success ){
						fileRec.set('progress', 100 );
						fileRec.set('status', 'Done');
						fileRec.commit();						
						this.fireEvent('fileupload', this, true, result,fileRec,this.uiniqueid);
					}else{
						this.fileAlert('<BR>'+file.name+'<BR><b>'+result.error+'</b><BR>');
						this.updateFile(fileRec, 'status', 'Error');
						this.fireEvent('fileupload', this, false, result, fileRec,this.uiniqueid);
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

		//
		// fire the event validate packagename which will be handled at uploadPopUp to 
		// not allow to have packages with duplicate name.
		//
	
		if( this.fireEvent('startupload',this ,( this.swfTotalUploadItems + this.dndTotalUploadItems  ) ) !== false ){
			this.startUploadingFiles();
		}
	}
	,startUploadingFiles : function(){
	
		this.swfUploader.startUpload();
		
		if( !Ext.isEmpty( this.dndUploadItems ) ){
			
			for(var k=0;k<this.dnduploadIndex;k++){
		
				if( this.dndUploadItems[ k ] != undefined){
					
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
			var result = Ext.util.JSON.decode(serverData);//throws a SyntaxError.
		}catch(e){
			Ext.MessageBox.show({
				buttons: Ext.MessageBox.OK
				,icon: Ext.MessageBox.ERROR
				,modal:true
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
			this.swfUploadItems[file.index].commit();
			this.fireEvent('fileupload', this, true, result,file,this.uiniqueid);
		}else{
			this.fileAlert('<BR>'+file.name+'<BR><b>'+result.error+'</b><BR>');
			this.updateFile(this.swfUploadItems[file.index], 'status', 'Error');
			this.fireEvent('fileupload', this, false, result,file,this.uiniqueid);
		}
	}
	,swfUploadfileQueued:function(file){
		
		if( this.swfTotalUploadItems <= 0 ){
			
			var swfGridLength = this.items.items[1].getStore().data.length;
			
			if( swfGridLength > 0 ){
				
				this.swfTotalUploadItems = swfGridLength;
			}else{
				
				this.swfTotalUploadItems = 0;
			}
		}
		var fileRec = this.addFile({
			name: file.name
			,size: file.size
		});
		if( fileRec ){
			
			this.swfUploadItems[file.index] = fileRec;
			this.swfTotalUploadItems++;
			return true;
		}else if( fileRec == undefined ){
			
			this.swfUploadItems[file.index] =undefined;
			this.fileAlert('<BR>'+file.name+'<BR><b> Already Exists </b><BR>');
			return;
		}else{
			return false;
		}
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

Ext.reg('awesomeuploader', AwesomeUploader);
