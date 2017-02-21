Ext.define('SWP.store.Comments', {
	extend : 'Ext.data.Store',
	storeId : 'comments',

	requires : [ 'Ext.data.reader.Json' ],

	model : 'SWP.model.Comment',
	autoLoad : false,
	constructor: function(config) {
			
	        var me = this;
	
	        Ext.apply(me, config);
	        
			me.proxy = {
					type : 'direct',
					dircetFn : CommentRecordMgr.getAllRecords,
					api : {
						read : CommentRecordMgr.getRecord,
						create : CommentRecordMgr.newRecord,
						update : CommentRecordMgr.saveRecord,
						save : CommentRecordMgr.saveRecord,
						destroy : CommentRecordMgr.destroyRecord
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
