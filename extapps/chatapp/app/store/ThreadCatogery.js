/**
 * 
 */
Ext.define('CHAT.store.ThreadCatogery', {
	
	extend : 'Ext.data.Store',
	
	requires : [ 'CHAT.model.ThreadCatogery','Ext.data.proxy.Direct'],
	model : 'CHAT.model.ThreadCatogery',
	storeId : 'ThreadCatogery',
	autoLoad:false,
	constructor: function(config) {
			
	        var me = this;
	
	        Ext.apply(me, config);
	        
			me.proxy = {
		    		type : 'direct',
		    		dircetFn : CollaborationToolMgr.getCatogeries,
		    		api : {
		    			read : CollaborationToolMgr.getCatogeries
		    		},
		    		reader : {
		    			type : 'json'
		    		},
		    		writer : {
		    			type : 'json'
		    		}
		    };
		me.callParent(arguments);
	}
});
