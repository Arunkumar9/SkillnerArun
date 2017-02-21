/**
 * 
 */
Ext.define('CHAT.store.Reference', {
		extend : 'Ext.data.Store',
		storeId : 'reference',
		model : 'CHAT.model.Reference',
		autoLoad : false,
		
		constructor: function(config) {
			
	        var me = this;

	        Ext.apply(me, config);
	        
			me.proxy = {
				type : 'direct',
				directFn : CollaborationToolMgr.getTaskReference
			}
			me.callParent(arguments);
		}
	});
