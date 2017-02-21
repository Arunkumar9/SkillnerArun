Ext.define('SWP.store.Movies', {
	extend : 'Ext.data.Store',
	storeId : 'movies',

	requires : [ 'Ext.data.reader.Json' ],

	model : 'SWP.model.Movie',
	autoLoad : true,
	constructor: function(config) {
			
	        var me = this;
	
	        Ext.apply(me, config);
	        
			me.proxy = {
	
					type : 'direct',
					api : {
						read : VideoRecordMgr.getMovieRecord
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
