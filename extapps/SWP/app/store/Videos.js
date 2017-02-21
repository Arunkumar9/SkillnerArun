Ext.define('SWP.store.Videos', {
	extend : 'Ext.data.Store',
	storeId : 'videos',

	requires : [ 'Ext.data.reader.Json' ],

	model : 'SWP.model.Video',
	sorters : [ {
		property : 'ordering',
		direction : 'ASC'
	} ],
	autoLoad : true,
	root : {
		expanded : true
	},
//	proxy : {
//		type : 'direct',
//		directFn : VideoRecordMgr.getRecordChapters,
//		paramOrder : [ 'course_id' ]
//	},
	constructor: function(config) {
		
        var me = this;

        Ext.apply(me, config);
        
		me.proxy = {

				type : 'direct',
				directFn : VideoRecordMgr.getRecordChapters,
				paramOrder : [ 'course_id' ],
				api : {
					read : VideoRecordMgr.getRecord,
					create : VideoRecordMgr.newRecord,
					update : VideoRecordMgr.saveRecord,
					save : VideoRecordMgr.saveRecord,
					destroy : VideoRecordMgr.destroyRecord
				},
				reader : {
					type : 'json'
				},
				writer : {
					type : 'json'
				}
		};
		me.callParent(arguments);
	},
		
	findPlaying : function(d, t) {
		var ts = t || SWP.flowplayer.getTime();
		var i = this.findBy(function(rec, id) {
			return (ts >= rec.get('start') && ts < rec.get('stop'));
		}, this);
		if (d)
			i = i + d;
		if (i < 0)
			i = 0;
		return SWP.video.chapters().getAt(i);
	}
});
