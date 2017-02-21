Ext.define('SWP.model.Video', {
	extend : 'Ext.data.Model',

	requires : [ 'SWP.store.Chapters' ],

	fields : [ 'name', 'url', 'uid', 'chapters', 'comments' ],

	idProperty : 'uid'
});