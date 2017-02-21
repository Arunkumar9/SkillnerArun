/**
 * 
 */

Ext.define('SWPCommon.view.workfiles.WorkFiles', {
	extend: 'Ext.window.Window',
	alias: 'widget.workfiles',
	 requires: ['Ext.form.Panel','SWPCommon.view.workfiles.FilesGrid','SWPCommon.lib.AwesomeUploader'],
	 title: ' Work Files ',
	 id: 'workfiles-title',
	    height: 600,
	    width: 600,
	    modal:true,
	    maximizable:true,
	     layout:'fit',
	     initComponent: function() {
	    	 var me = this;
	    	 var body = Ext.getBody();
	    	 me.form = body.createChild({
		         tag:'form'
		        ,cls:'x-hidden'
		        ,id:'form'
		        ,method:'get'
		        ,action:'download.php'
		        ,target:'iframe'
		        	,cn:[{
						 tag:'input'
						,type:'hidden'
						,name:'pid'
						,value:SWP.PID
					},{
						 tag:'input'
						,type:'hidden'
						,id:'lesson-name'
						,name:'lesson'
						,value:SWP.selected.LESSON
					},
					{
						 tag:'input'
						,type:'hidden'
						,id:'question-name'
						,name:'question'
						,value:SWP.selected.QUESTION
					}]
		    });
	    	 
	    	 
			   var frame = body.createChild({
			         tag:'iframe'
			        ,cls:'x-hidden'
			        ,id:'iframe'
			        ,name:'iframe'
			    });
			    
	    	 Ext.apply(this,{
	    		    layout : 'fit',
	    			items: [
			    	          {
				    		   		xtype:'filesgrid',
				    		   		id: 'w-files-grid',
				    		   		listeners:{
				    		   			'showfilesupload':function(filesgrid){
				    		   				me.fireEvent('showfilesupload',me,filesgrid);
				    		   			},
				    		   			'downloadallfiles' : function(filesgrid) {
				    		   				
				    		   				//
				    		   				// set the vlaue of the lesson to -1 indicating to the download php
				    		   				// that zip all the folders under productid and push to the ui
				    		   				//
				    		   				
				    		   				me.form.dom[1].defaultValue='-1';
				    		   				me.form.dom[2].defaultValue='-1';
				    		   				me.form.dom.submit();
				    		   			},
				    		   			'downloadfiles' : function(filesgrid) {
				    		   				
				    		   				//
				    		   				// set the vlaue of the lesson to current selected lesson name indicating to the download php
				    		   				// that zip all the folders under lesson and push to the ui
				    		   				//
				    		   				
				    		   				me.form.dom[1].defaultValue = SWP.selected.LESSON;
				    		   				me.form.dom[2].defaultValue = SWP.selected.QUESTION;
				    		   				me.form.dom.submit();
				    		   			}
				    		   		}
				    	   		}
				    	   	]
	    	 });
	    	 this.callParent(arguments);
	    	 
	     }
});