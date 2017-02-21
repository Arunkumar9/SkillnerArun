Ext.define('SWP.model.Comment', {
	extend : 'Ext.data.Model',

	fields : [ 'comment', 'chapter', 'lesson', 'ordering', 'commented_on', 'reference_id', {
		name : 'ts',
		type : 'float'
	}, {
		name : 'videos_id',
		type : 'int'
	}, {
		name : 'uid',
		type : 'int'
	},{
		name : 'role_id',
		type : 'int'
	},{
		name : 'user_id',
		type : 'int'
	},{
		name : 'thread_id',
		type : 'int'
	},{
		name : 'chapter_id',
		type : 'int'
	},{
		name : 'content_id',
		type : 'int'
	},{
		name : 'question_id',
		type : 'int'
	}],

	idProperty : 'uid'

});