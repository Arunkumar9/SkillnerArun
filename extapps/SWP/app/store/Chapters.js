Ext.define('SWP.store.Chapters', {
	extend : 'Ext.data.Store',
	storeId : 'chapters',

	requires : [ 'Ext.data.reader.Json' ],

	model : 'SWP.model.Chapter',
	belongsTo : {
		model : 'SWP.model.Video',
		foreignKey : 'videos_id'
	},

	groupField : 'ordering',

	ssorters : [ {
		property : 'ordering',
		direction : 'ASC'
	}, {
		property : 'start',
		direction : 'ASC'
	} ],
	autoLoad : false,
	root : {
		expanded : true
	},
	constructor: function(config) {

        var me = this;

        Ext.apply(me, config);
        
		me.proxy = {

				type : 'direct',
				directFn : VideoRecordMgr.getRecordChapters,
				api : {
					read : VideoRecordMgr.getRecordChapter,
					create : VideoRecordMgr.newRecordChapter,
					update : VideoRecordMgr.saveRecordChapter,
					save : VideoRecordMgr.saveRecordChapter,
					destroy : VideoRecordMgr.destroyRecordChapter
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
//	proxy : {
//		type : 'direct',
//		directFn : VideoRecordMgr.getRecordChapters
//	},

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
