/**
 * 
 */
Ext.define('SWP.store.VideoCaptionSettings', {
	extend : 'Ext.data.Store',
	storeId : 'userSettings',

	requires : [ 'Ext.data.reader.Json' ],

	model : 'SWP.model.VideoCaptionSetting',
	groupField: 'group',
	  constructor: function(config) {
			
	        var me = this;

	        Ext.apply(me, config);
	        
			me.proxy = {

					type : 'direct',
					dircetFn : VideoRecordMgr.getVideoCaptionSettings,
					api : {
						read 	: VideoRecordMgr.getVideoCaptionSettings,
						update	: VideoRecordMgr.saveVideoCaptionSettings,
						save 	: VideoRecordMgr.saveVideoCaptionSettings
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