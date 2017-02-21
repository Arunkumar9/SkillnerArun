Ext.define('SWP.model.LastRun', {
	extend : 'Ext.data.Model',
	storeId : 'latsruns',
	fields : [ 'uid','user_id', 'chapter_id',  'position', 'video_id','question_id','content_id','language', 'subject'],
	
	idProperty : 'uid'
});