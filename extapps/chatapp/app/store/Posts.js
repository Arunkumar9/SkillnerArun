
Ext.define('CHAT.store.Posts', {
	extend : 'Ext.data.Store',
	storeId : 'PostId',

	requires : [ 'CHAT.model.Post'],

	model : 'CHAT.model.Post',
	autoLoad : false,
	constructor: function(config) {
		
        var me = this;

        Ext.apply(me, config);
        
		me.proxy = {
	      		type : 'direct',
	      		api : {
	      			read : CollaborationToolMgr.getPosts,
	      			create : CollaborationToolMgr.createNewPost,
	    			update : CollaborationToolMgr.savePost
	              	
	      		}
		}
		
		me.callParent(arguments);
	}

});
 
 