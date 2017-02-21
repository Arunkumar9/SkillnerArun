/**
 * 
 */
Ext.define('SWP.store.Files', {
	extend : 'Ext.data.Store',
	storeId : 'files',

	requires : [ 'Ext.data.reader.Json' ],
	model : 'SWP.model.File',
	autoLoad : false,
	
	constructor: function(config) {
		
        var me = this;

        Ext.apply(me, config);

        me.proxy = {
        		type : 'direct',
        		dircetFn : VideoRecordMgr.getTrainingFiles,
        		api : {
        			read : VideoRecordMgr.getTrainingFilesRecord,
        			create : VideoRecordMgr.newTrainingFilesRecord,
//        			update : VideoRecordMgr.saveTrainingFilesRecord,
//        			save : VideoRecordMgr.saveTrainingFilesRecord,
        			destroy : VideoRecordMgr.destroyTrainingFilesRecord
                	
            	
        		},
        		reader : {
        			type : 'json'
        		},
        		writer : {
        			type : 'json'
        		}
        	};

        me.listeners = {
        		
        	load:function( store,records ){
        		//
        		// Enabling download lesson/quiz work files button if atleast one file exists with the user name creator
        		//
        		for( var i= 0;i< records.length; i++ ){
        			
        			if( records[i].get('username')== "Creator" && store.getTotalCount() > 0  ){
        				
        				downloadbutton = Ext.getCmp('downloadfiles');
        				downloadbutton.enable(true);
        			}
        		}	
        	}
        }
        
        me.callParent(arguments);
    }
	
});