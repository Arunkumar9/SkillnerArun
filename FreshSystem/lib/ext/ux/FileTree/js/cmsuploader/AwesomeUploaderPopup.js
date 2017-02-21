/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23721          Tapaswini Sabat    201311261200      In the awesomeuploader when the files are uploading, and user clicks on Save
 *  													It should show an alert box.
 *  27645		   Arunkumar.muddada  201405190301      Code Which is useful for the creaton of the tool bar for the newly added Help Description panel
 *  													If the showHelpDescription is true and helpPosition is top only we are adding the Description panel in tbar, other wise not.
 *  													Code for taking the Vbox layout in the two items are there
 *  													1. save and cancel button.
 *  													2. Help Panel.
 *  27646		   Arunkumar.muddada  201405200301     
 *  28249          Arunkumar.muddada  201406060543      Modified : Fileselect option
 *  													We are using this validation for images not for the TraingFiles(workingfiles)  
 *  27646		   Dinesh GK		  201406240450		Modified : Alert message for the invalide format file upload.Make the upload window stateful false.
 *																	Now for Videos tab it showing "*mp4" and for captions tab showing "*srt" format files only.
 *  29024		   Dinesh GK		  201407190430		modified : fileselected event In this evant for questions images tab allow to show only images files not for all file formats.
 */
AwesomeUploaderPopup = Ext.extend(Ext.Window, {
	title: ' Add one or more files ',
	width: 600,
	height: 400,
	buttonAlign: 'left',
	modal : true,
	stateful :false, //201406240450
	isFileValide : true, //201405200301
	initComponent: function() {
		var me = this;
		Ext.QuickTips.init();
		
		this.statusIconRenderer = function(value){
			switch(value){
				default:
					return value;
				case 'Pending':
					return '<img src="FreshSystem.local/lib/ext/ux/FileTree/js/cmsuploader/hourglass.png" width=16 height=16>';
				case 'Sending':
					return '<img src="FreshSystem.local/lib/ext/ux/FileTree/js/cmsuploader/loading.gif" width=16 height=16>';
				case 'Error':
					return '<img src="FreshSystem.local/lib/ext/ux/FileTree/js/cmsuploader/cross.png" width=16 height=16>';
				case 'Cancelled':
				case 'Aborted':
					return '<img src="FreshSystem.local/lib/ext/ux/FileTree/js/cmsuploader/cancel.png" width=16 height=16>';
				case 'Uploaded':
					return '<img src="FreshSystem.local/lib/ext/ux/FileTree/js/cmsuploader/tick.png" width=16 height=16>';
			}
		},
	    
		this.progressBarColumnRenderer = function(value, meta, record, rowIndex, colIndex, store){
			
	        meta.css += ' x-grid3-td-progress-cell';
	        var progressBarColumnTemplate = new Ext.XTemplate(
												'<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-foreground">',
													'<div>{value} %</div>',
												'</div>',
												'<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-background" style="left:{value}%">',
													'<div style="left:-{value}%">{value} %</div>',
												'</div>'
	    									);
			return progressBarColumnTemplate.apply({
				value: value
			});
			
		},
		
		this.deleteActionColumn = function(value, meta, record, rowIndex, colIndex, store){
			
			var deleteCls ,deleteColumn;
			if( record.get('status') == "Sending" ){
				deleteCls  = "delete-disabled";
				
			}else{
				deleteCls  = "delete-enabled";
			}
	        deleteColumn = new Ext.XTemplate('<img src="/lib/desktop/resources/images/fam/delete.png" alt="Delete" title="Delete" class = {cls} ></img>');
			return deleteColumn.apply({
				cls: deleteCls
			});
			
		},
		this.updateFileUploadRecord = function(id, column, value){
	
			var rec = this.awesomeUploaderGrid.store.getById(id);
			if(rec){
				rec.set(column, value);
				rec.commit();
			}
		};
		this.items = [{
				xtype:'awesomeuploader'
				,ref:'awesomeUploader'
				,extraPostData:{
					PATH :	(this.initialConfig.uploadPath).replace('\n',''),
					isfromamazon: this.initialConfig.isfromamazon,
					panel : this.initialConfig.panel
				}
				,height:35
				,allowDragAndDropAnywhere:true
				,autoStartUpload:false
				,awesomeUploaderRoot:'/FreshSystem.local/lib/ext/ux/FileTree/js/cmsuploader/'
				,uploadFileTypes : this.initialConfig.uploadFileTypes //201406240450
				,invalideUploadFiles : []
			//	,maxFileSizeBytes: 20000 * 1024 * 1024 // 15 MiB
				,listeners:{
					scope:this
					,fileselected:function(awesomeUploader, file){
					/*
						file will at minimum be:
						file = {
							name: fileName
							,method: "swfupload" //(can be "swfupload", "standard", "dnd"
							,id: 1 // a unique identifier to abort or remove an individual file, incrementing int
							,status: "queued" // file status. will always be queued at this point
							// if swfupload or dnd or standard upload on a modern browser (supports the FILE API) is used, size property will be set:
							,size: 12345 // file size in bytes
						}
					*/
					
						//Example of cancelling a file to be selection
		
						if( file.name == 'image.jpg' ){	
							Ext.Msg.alert('Error','You cannot upload a file named "image.jpg"');
							return false;
						}
						//201405190301
						//Code Which is useful to check the file extension , if the file extension is not in the given
						//List then it will fire an error.
						//201405200301
						// We are allowing for a video file mp4 and for a caption file .srt extansion files
						//
						//201406060543
						//We are using this validation for images not for the TraingFiles(workingfiles) 
						if( this.initialConfig.panel == "images" ){
							
							var exp = /^.*.(png|jpg|jpeg|gif|tif|tiff|bmp)$/i;  
							this.isFileValide = ( exp.test(file.name) ) ? true :false ; 
							
						}else if( this.initialConfig.panel == "captionfiles"  ){
							//if caption tab then we are allowing for the srt files
							this.isFileValide = ( /^.*.(srt)$/i.test(file.name) ) ? true :false ; 
							
						}else if( this.initialConfig.panel == "movies" ){
							//The videos files upload file format should be _[VIDEORATE]kbps.mp4 
							var fileFormat = file.name.split(/[_]+/).pop().split('.')[0];
							this.isFileValide = ( /^.*.(mp4)$/i.test(file.name) && 
									( fileFormat.match(/\d+/)+''+fileFormat.slice(fileFormat.length-4,fileFormat.length) == fileFormat ) && 
									((fileFormat.slice(fileFormat.length-4,fileFormat.length)).toLowerCase() == 'kbps')) ? true :false ; 
						}
						
						if( this.isFileValide ){
							
							this.awesomeUploaderGrid.store.loadData({
								id:file.id
								,name:file.name
								,size:file.size
								,status:'Pending'
									,progress:0
							}, true);
							
						}else {
							
							if( this.initialConfig.panel == "movies" || this.initialConfig.panel == "captionfiles" ){
							
								this.awesomeUploader.invalideUploadFiles.push(file.name); //201406240450
								
							}else if( this.initialConfig.panel == "images" ){
								/*#29024  201407190430
								 * Here for questions images tab allowing only images format files only.
								 */
								Ext.MessageBox.show({
									title:'Alert!',
									msg: 'Only image files with extensions png, jpg, jpeg, gif, tif, tiff, bmp can be added for a question.<br> Please check the files and upload them again.',
									buttons: Ext.Msg.OK,
									modal:true,
									icon: Ext.MessageBox.ERROR,
									scope : this
								});
								
							}else{
								
								Ext.MessageBox.show({
									title:'Alert!',
									msg: 'Uploading file format is incourrect :'+file.name,
									buttons: Ext.Msg.OK,
									modal:true,
									icon: Ext.MessageBox.ERROR,
									scope : this
								});
							}
							return false;
						}
					}
					//201406240450
					,fileselectioncomplete :function( uploader ){
						var invalideFiles = uploader.invalideUploadFiles;
						if( invalideFiles.length > 0  ){
							var files  = invalideFiles.toString();
							if( this.initialConfig.panel == "movies" ){
								
								Ext.MessageBox.show({
									title:'Alert!',
									msg: ' The following video file names, '+files+' are not in valid format. The file names must end with _[VIDEORATE]kbps',
									buttons: Ext.Msg.OK,
									modal:true,
									icon: Ext.MessageBox.ERROR,
									scope : this,
									fn:function( btn ){
										if( btn = 'ok'){
											uploader.invalideUploadFiles = [];
										}
									}
								},this);
								
							}else if( this.initialConfig.panel == "captionfiles" ){
								
								Ext.MessageBox.show({
									title:'Alert!',
									msg: 'Uploading file format is incorrect :'+files,
									buttons: Ext.Msg.OK,
									modal:true,
									icon: Ext.MessageBox.ERROR,
									scope : this,
									fn:function( btn ){
										if( btn = 'ok'){
											uploader.invalideUploadFiles = [];
										}
									}
								},this);
							}else if( this.initialConfig.panel == "images" ){
								Ext.MessageBox.show({
									title:'Alert!',
									msg: 'Only image files with extensions png, jpg, jpeg, gif, tif, tiff, bmp can be added for a question.<br> Please check the files and upload them again.',
									buttons: Ext.Msg.OK,
									modal:true,
									icon: Ext.MessageBox.ERROR,
									scope : this,
									fn:function( btn ){
										if( btn = 'ok'){
											uploader.invalideUploadFiles = [];
										}
									}
								},this);
							}
						}
					}
					,fileselectionerror : function( uploader, fileInfo, message ){
						
						this.awesomeUploader.invalideUploadFiles.push(fileInfo.name);
					}
					,uploadstart:function(awesomeUploader, file){
					
						this.updateFileUploadRecord(file.id, 'status', 'Sending');
					}
					,uploadprogress:function(awesomeUploader, fileId, bytesComplete, bytesTotal){
					
						this.updateFileUploadRecord(fileId, 'progress', Math.round((bytesComplete / bytesTotal)*100) );
					}
					,uploadcomplete:function(awesomeUploader, file, serverData, resultObject){
						//Ext.Msg.alert('Data returned from server'+ serverData);
						
						try{
							var result = Ext.util.JSON.decode(serverData);//throws a SyntaxError.
						}catch(e){
							resultObject.error = 'Invalid JSON data returned';
							//Invalid json data. Return false here and "uploaderror" event will be called for this file. Show error message there.
							return false;
						}
						resultObject = result;
						
						if(result.success){
							this.updateFileUploadRecord(file.id, 'progress', 100 );
							this.updateFileUploadRecord(file.id, 'status', 'Uploaded' );
						}else{
							return false;
						}
						
					}
					,uploadaborted:function(awesomeUploader, file ){
						this.updateFileUploadRecord(file.id, 'status', 'Aborted' );
					}
					,uploadremoved:function(awesomeUploader, file ){
						
						this.awesomeUploaderGrid.store.remove(this.awesomeUploaderGrid.store.getById(file.id) );
					}
					,uploaderror:function(awesomeUploader, file, serverData, resultObject){
						
						resultObject = resultObject || {};
						var error = 'Error! ';
						if(resultObject.error){
							error += resultObject.error;
						}
						this.updateFileUploadRecord(file.id, 'progress', 0 );
						this.updateFileUploadRecord(file.id, 'status', 'Error' );
						
					}
				}
			},{
				xtype:'grid'
				,ref:'awesomeUploaderGrid'
				,width:'100%'
//				,height:290
				,enableHdMenu:false
				,viewConfig:{
					forceFit :true
				}
				,store:new Ext.data.JsonStore({
					fields: ['id','name','size','status','progress']
	    			,idProperty: 'id'
				})
				,columns:[
					{header:'File Name',dataIndex:'name', width:200}
					,{header:'Size',dataIndex:'size', width:60, renderer:Ext.util.Format.fileSize}
					,{header:'&nbsp;',dataIndex:'status', width:30, renderer:this.statusIconRenderer}
					,{header:'Status',dataIndex:'status', width:60}
					,{header:'Progress',dataIndex:'progress', width:150,renderer:this.progressBarColumnRenderer}
					,{
					    xtype:'actioncolumn', 
					    width:50,
					    align: 'left',
					    renderer : this.deleteActionColumn,
					    scope:this,
					    listeners:{
							click: function( column, The, rowIndex, e ){
						
									me = this.scope;
									var rec = me.awesomeUploaderGrid.getStore().getAt(rowIndex);
									if( rec.get('status') != "Sending"  ){
										
										me.awesomeUploader.removeUpload(rec.data.id);
									}
									if( rec.get('status') == "Uploaded" ){
										
										var options = {
													url		: me.initialConfig.path
													,method	: 'post'
													,scope	: me
													,params	: Ext.applyIf({
															cmd		: "delete"
															,dir	: me.initialConfig.dir
															,file	: "root/"+rec.get('name')
															,panel	: me.initialConfig.panel
															,from 	: 'awesomeuploader'
													})
										};
										Ext.Ajax.request(options);
										
									}
						    	}
					    }
					}]
		}],
		/**
		 *Code Which is useful for the creaton of the tool bar for the newly added Help Description panel
		 *201405190301
		 */
		this.uploadHelp = {
		    	 xtype:'toolbar',
		    	 layout:'fit',
		    	 flex:1,
		    	 items:[{ 
		    		xtype:'panel',
		    	 	title:'File Upload Help',
			    	collapsed :true,
			    	autoScroll :true,
			    	html : this.initialConfig.helpDescription,
			    	tools:[{
			    	    id:'toggle',
			    	    handler: function(event, toolEl, panel){
			    		
				    		var uploadWinTbar = panel.ownerCt.ownerCt.ownerCt;
				    		var mainWin = panel.ownerCt.ownerCt;
				    		panel.toggleCollapse( true );
			    			if ( panel.collapsed ){
			    				mainWin.setHeight(mainWin.getHeight()+100);
			    			}else{
			    				mainWin.setHeight(mainWin.getHeight()-100);
			    			}
			    			uploadWinTbar.setHeight(uploadWinTbar.getHeight());
			    	    }
			    	}]
		    	 }]	
		};

		/**
		 *  If the showHelpDescription is true and helpPosition is top only we are adding the Description panel in tbar, other wise not.
         * 201405190301
		 */
		if( (this.initialConfig.showHelpDescription) && (this.initialConfig.helpPosition == 'top') ) {
			this.tbar = new Ext.Toolbar({
				 scope:this,
				 layout: {
				 	align:'stretch',
			        type: 'vbox'
			     },
			     items:[this.uploadHelp],
			     listeners : {
			    	 beforerender:function( tbar ){
			    		tbar.setHeight(35);
						tbar.ownerCt.awesomeUploaderGrid.setHeight(270);
			     	}
			     }
			});
		}
		
		 /**
		  *
		  * Here we are taking the Vbox layout in the two items are there 
		  * 1. save and cancel button.
		  * 2. Help Panel.
		  * 201405190301
		  */
		 this.fbar =new Ext.Toolbar({
			 scope:this,
			 layout: {
			 	align:'stretch',
		        type: 'vbox'
		     },
		     listeners : {
		    	 beforerender:function( tbar ){
			    	 //Here code written for set the tbar height based on Help Description panel existence 
			    	 var uploaderPopup = tbar.scope;
			    	 if( uploaderPopup.showHelpDescription && uploaderPopup.helpPosition == 'bottom'){
			    		 
			    		 tbar.setHeight(60);
			    		 uploaderPopup.awesomeUploaderGrid.setHeight(270);
			    	 }else{
			    		 
			    		 tbar.setHeight(30);
			    		 uploaderPopup.awesomeUploaderGrid.setHeight(300);
			    	 }
		    	 }
		     },
		     items:[{
		    	 xtype:'container',
		    	 layout:'toolbar',
		    	 items:[{ 
					 xtype:'button',
					 text:'Save',
					 width:80,
					 scope:this,
					 id:'traininguploadsavebtn',
					 handler: function(){
						 
						 	var uploader, store, index, errorFiles=0, data, pendingRecord ;
						 	uploader  = this.awesomeUploader;
						 	store = this.awesomeUploaderGrid.getStore();
						 	data = store.data.items ; 
						 	var index = store.findBy( function( record, id ){
								
								return record.get('status') != "Uploaded" ;
						    },this );
						 	pendingRecord = store.findBy( function( record, id ){
								
						 		// 201311261200
								return ( record.get('status') == "Sending" || record.get('status') == "Pending");
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
									scope : this,
									fn:function(){
										
										this.ownerCt.close();
									}
								});
								
							}else if( pendingRecord != -1 ){
								
								Ext.MessageBox.show({
									title:'Alert!',
									msg: 'Upload is in progress, please try once all the files are loaded!',
									buttons: Ext.Msg.OK,
									modal:true,
									scope : this,
									icon: Ext.MessageBox.ERROR
									
								});
							}else{
								
								this.close();
								this.fileTreePanel.reload();
								
							}
					 }
		  	},{
		    		 xtype:'button',
					 text:'Cancel',
					 scope:this,
					 width:80,
					 handler: function( btn ){
				
		    				var fileNames = [], uploader, gridStore, data, i, errorFiles=0 ;
		    				uploader  = this.awesomeUploader;
		    				gridStore = this.awesomeUploaderGrid.getStore();
		    				data = gridStore.data.items;
		    				
		    				for( i= 0 ; i< data.length ; i++ )  {
								
								if( data[i].get('status') == "Error" )
									errorFiles++
							}
		    				
		    				if( data.length != 0 && errorFiles != data.length ){
		    					Ext.MessageBox.confirm('Confirm', 'All the Uploaded Files Will be Lost.', function(btn){
		    						
		    						if(btn == 'yes'){
		    							
		    							for(var i = 0 ; i< data.length ; i++)  {
		    								if( data[i].get('status') == "Uploaded" || data[i].get('status')== "Sending")
		    									fileNames.push( data[i].get('name') );
		    							}
		    						
		    							var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
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
		    									,success: function(response, opts) {
		    										
		    										myMask.hide();
		    										this.getEl().unmask();
		    										this.close();
		    									}
											   ,failure: function(response, opts) {
												   	console.log('server-side failure with status code ' + response.status);
											   }
		    							};
		    							Ext.Ajax.request(options);
		    							myMask.show();
		    							this.getEl().mask();
		    							
		    						}
		    					},this);
		    					
		    				}else{
		    					this.close();
		    				}	
				 	}
		  		}]
		     },( (this.initialConfig.showHelpDescription) && (this.initialConfig.helpPosition == 'bottom') ) ? this.uploadHelp : ''
			]	
		 });

	AwesomeUploaderPopup.superclass.initComponent.apply(this, arguments);
}
});
Ext.reg('awesomeuploaderpopup', AwesomeUploaderPopup);
