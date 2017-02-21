Ext.define('CHAT.store.Messages', {
	extend : 'Ext.data.Store',
	requires : [ 'CHAT.model.Message','Ext.data.proxy.Direct'],
	model : 'CHAT.model.Message',
	storeId : 'Messages',
	/**
	 * @cfg pageSize : Number of records that should display per page 
	 */
	
	config: {
    		
			autoLoad : false,
			pageSize: SIZE.NO_OF_RECORDS
	},
	
	constructor: function(config) {
		
        var me = this;

        Ext.apply(me, config);
        
		me.proxy = {
	    		type : 'direct',
	    		directFn: CollaborationToolMgr.getMessages,
	    		api : {
	    			read   : CollaborationToolMgr.getMessages,
	    			create : CollaborationToolMgr.createMessage,
	    			update : CollaborationToolMgr.saveMessage,
	    			save   : CollaborationToolMgr.saveMessage
	    		},
	    		/**
	    		 * @cfg :totalProperty is used in paging in order to calculate number of pages.
	    		 * @cfg :data 
	    		 */
	    		reader:{
	    			totalProperty:'total',
	    			root:'data'
	    		}
	    	};
		
			me.callParent(arguments);
		}
});
