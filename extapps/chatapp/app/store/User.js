/**
 * 
 */
Ext.define('CHAT.store.User', {
	
	extend : 'Ext.data.Store',
	requires : [ 'CHAT.model.User'],
	model : 'CHAT.model.User',
	storeId : 'userstore',
	autoLoad:false,
	constructor: function(config) {
		
        var me = this;

        Ext.apply(me, config);
        
		me.proxy = {
	    		type : 'direct',
	    		//dircetFn : CollaborationToolMgr.getUsers,
	    		api : {
	    			read : CollaborationToolMgr.getUsers
	    		},
	    		reader : {
	    			type : 'json'
	    		},
	    		writer : {
	    			type : 'json'
	    		}
		}
		me.callParent(arguments);
	}
});
