/**
 * @author rosa
 * 
 *  Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23839			Dinesh GK			20131130330    Upload Script error alert box title changed as "Invalid script".
 *  28042			Dinesh GK			201407180131    Modified :importTitles 
 *  														import titles functionality is changed.
 *  27654			Dinesh GK			201407200405    Modified :importTitles 
 *  														Showing conformation alert to user if any chapters are exist while importing new chapters.
 *  27673			Dinesh GK			201406210255    Modified :makeWindow 
 *  														Prepared the Import script window for uploading script.
 */
Ext.namespace('DTV');

DTV.ImportTitlesWindow = Ext.extend(Ext.util.Observable, {

        init: function(f) {

            this.form = Ext.getCmp('video-form');
            this.id = this.form.formBaseParams.id;
            
           if( this.id == "new" ){
            		Ext.MessageBox.alert(__('Alert!'), __('Please Save the Lesson'));
            		return;
            }
            
            if (!this.id || this.form.disabled) {
                Ext.MessageBox.alert(__('Alert!'), __('video.not.open'));
                return;
            }
            this.targetbutton = f; //201406210255
            this.makeWindow();

        },
        checkChapterOrScriptExist: function() {
        	
        	var data = Ext.getCmp('upload-field').getValue();
            if (!data) return;
        	var buttonId = this.targetbutton.id,type;
        	if( buttonId == 'lesson-import-chapters-button' ){
        		type = 'chapters';
        		
        	}else{
        		type = 'scripts';
        	}
            CuepointRecordMgr.isOldChaptersExist(this.id,type,function(r,t) {
            	
	            	if( r ){  		//If old chapters exist for selected lesson it will give "r" as true other wise false.  
	            		Ext.Msg.show({
	            			   title:'Confirm',
	            			   msg: 'Existing '+type+' will be overwritten.Continue? ',
	            			   buttons: Ext.Msg.YESNO,
	            			   animEl: 'elId',
	            			   scope : this,
	            			   icon: Ext.MessageBox.QUESTION,
	            			   fn: function( btn ){
	            				   if( btn == 'yes' ){
	            					   buttonId == 'lesson-import-chapters-button' ? this.createImportTitles() : this.importTranscript();
	            				   }else{
	            					   this.win.close();
	            				   }
	            			   }
	        			});
	            	}else{
	            		buttonId == 'lesson-import-chapters-button' ? this.createImportTitles() : this.importTranscript();
	            	}
	            	
            },this);
        },
        
        createImportTitles : function(){
        	
        	var data = Ext.getCmp('upload-field').getValue();
            if (!data) return;
            this.progressBar();
            //201407180131
            data = data.trim();
            var records = data.split(/\n/ig),
            	recordsAry =[],
            	i,j;
            
            for ( i=0 ; i< records.length; i++ ) {
            
            	var record = records[i].split(/\t/ig),
            		dataAry ={};
            	for ( j=0 ; j< record.length; j++ ) {
            	
            		if(j == 0 ){
            			dataAry.description = record[j].trim();
            		}else if(j == 1 ){
            			dataAry.start = record[j].trim();
            		}else if(j == 2 ){
            			dataAry.skippable = record[j].trim();
            		}else{
            			break; 
            		}
            	}
            	recordsAry.push(dataAry);
        	}
          CuepointRecordMgr.importTitles(this.id,recordsAry,function(r,t) {
        	  
	          if (t.status) {
	              this.progressBarStop();
	              Ext.StoreMgr.lookup('cuepoints-store').reload();
	              Ext.getCmp('upload-import-transcript-button').enable();
	              this.win.close();
	          } else {
	         	 this.progressBarStop();
	              Ext.MessageBox.alert(__('Error!'), __('video.import.error.logged'));
	              Fresh.console.log(r);
	          }
	          
          },this);
		          
        },
        importTranscript: function() {
      
            var data = Ext.getCmp('upload-field').getValue();
            if (!data) return;
            this.progressBar();
            var cs = Ext.StoreMgr.lookup('cuepoints-store');
            if (cs.getCount()>0) {
                CuepointRecordMgr.importTranscript(this.id,data,function(r,t) {
                	 if( r.error ){ //20131130330
                         Ext.MessageBox.alert(__('Invalid script'), __(r.error) ); //Modification done to show the alert in adjusted width
                         return ; 
                	 }
                     if (t.status) {
                         this.progressBarStop();
                         cs.reload();
                         this.win.close();
                     } else {
                         Ext.MessageBox.alert(__('Error!'), __('video.import.error.logged'));
                         Fresh.console.log(r);
                     }
                },this);
            } else {
                Ext.MessageBox.alert(__('Error!'), __('video.import.error.nochapters'));
            }
        },

        makeWindow: function() {
        	
            if (!this.win) {
            	//201406210255
	        	var winTitle, winHidden, chapterUploadBtn, scriptBtnDisabled,
	        		importButtonText, cancelButtonText;
	        	if( this.targetbutton.id == 'lesson-import-chapters-button' ){
	        		
	        		winHidden = true;
	        		winTitle = "Import chapters";
	        		chapterUploadBtn = false;
	        		if( !(Ext.StoreMgr.lookup('cuepoints-store').getCount()) ){
	        			scriptBtnDisabled = true;
	        		}else{
	        			scriptBtnDisabled = false;
	        		}
	        		importButtonText = __('transcript.do.upload');
	        		cancelButtonText = __('titles.import.close');
	        		
	        	}else{
	        		winHidden = false;
	        		winTitle = "Import script"  ;
	        		chapterUploadBtn = true;
	        		scriptBtnDisabled = false;
	        		importButtonText = 'Import';
	        		cancelButtonText = 'Cancel';
	        	}
		        this.win = new Ext.Window({
		            layout:     'fit'
		            ,modal:  true
		            ,id: 'import-titles-win'
		            ,buttonAlign: 'right'
		            ,width: 600
		            ,height: 300
		            ,scope : this
		            ,stateful :false
		            ,title: winTitle// __('title.import')
		            ,tbar :new Ext.Toolbar({
		            	 layout:'fit',
		            	 hidden: winHidden,
				    	 items:[{ 
				    		xtype:'panel',
				    	 	title:'Help',
					    	collapsed :true,
					    	autoScroll :true,
					    	html : AWESOME_HELP_DESCRIPTION.IMPORT_SCRIPT,
					    	tools:[{
					    	    id:'toggle',
					    	    handler: function(event, toolEl, panel){
					    		
						    		var winToolbar  = panel.ownerCt;
						    		var mainWin = panel.ownerCt.ownerCt;
					    			if ( panel.collapsed ){
					    				winToolbar.setHeight(150);
					    			}else{
					    				winToolbar.setHeight(33);
					    			}
					    			panel.toggleCollapse( true );
					    	    }
					    	}]
				    	 }]	
		            })
		            ,buttons: [{
		                   text: __('titles.do.upload')
		                   ,minWidth: 100
		                   ,id: 'upload-import-button'
		                   ,hidden : chapterUploadBtn
		                   ,handler: this.checkChapterOrScriptExist.createDelegate(this) }
		                   ,{
		                   text: importButtonText
		                   ,minWidth: 100
		                   ,disabled: scriptBtnDisabled
		                   ,id: 'upload-import-transcript-button'
		                   ,handler: this.checkChapterOrScriptExist.createDelegate(this) }
		                   ,{
		                   text: cancelButtonText
		                   ,minWidth: 100
		                   ,handler: Fresh.global.actions.closeWindowHandler.createDelegate(this,['import-titles-win']) }]
		            ,plugins: [ new Ext.ux.Plugin.FormToButtons() ]
		            ,items: [{
		                   xtype:     'form'
		                   ,border:     false
		                   ,id: 'import-form'
		                   ,xurl: Fresh.Config.Service.Import
		                   ,trackResetOnLoad: true
		                   ,autoWidth: true
		                   ,frame: false
		                   ,xformBaseParams: {
		                       view: 'import-form-view' }
		                   ,items: [{
		                         hideLabel: true
		                         ,name: 'text'
		                         ,id: 'upload-field'
		                         ,xtype: 'textarea'
		                         ,margin: '5px 5px 5px 5px'
		                         ,anchor: '100% 100%'
		                   }]
		               }]
		            }); 
            }
            this.win.show();
        },

        progressBar: function() {
            Ext.MessageBox.show({
                    msg: __('Waiting for server') + '...',
                    progressText: __('Please wait ...'),
                    width: 300,
                    wait:true,
                    waitConfig: {
                        interval:200
                    }
                   //,icon:'mb-loading-icon'
                });
        },
        progressBarStop:function() {
            Ext.MessageBox.hide();
        }
});


