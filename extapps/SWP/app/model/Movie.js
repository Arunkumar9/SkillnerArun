Ext.define('SWP.model.Movie', {
	extend : 'Ext.data.Model',
	
	fields : [ 'name', 'type', 'uid', 'qv_uid', 'extension', 'web_path', 'video',
			'url' ],
	
	idProperty : 'uid',
	
	getObjectId : function() {
		return this.get('uid').substring(1);
	}
});