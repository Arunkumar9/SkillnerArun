Ext.define('SWP.store.LastRuns', {
	extend : 'Ext.data.Store',
	storeId : 'lastruns',

	requires : [ 'Ext.data.reader.Json' ],

	model : 'SWP.model.LastRun',
	autoLoad : false,
	constructor: function(config) {
		
        var me = this;

        Ext.apply(me, config);
        
		me.proxy = {
				type : 'direct',
				api : {
					read : VideoRecordMgr.getLastRun
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
