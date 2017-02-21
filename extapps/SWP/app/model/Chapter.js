/**
 * @author ajit
 */
Ext.define('SWP.model.Chapter', {
	extend : 'Ext.data.Model',
	storeId : 'chapters',

	fields : [ 'lesson', 'uid', 'name', 'description', 'transcript', 'iconCls',
			'url', {
				name : 'start',
				type : 'float'
			}, {
				name : 'stop',
				type : 'float'
			}, 'video_id', 'ordering', {
				name : 'seen',
				type : 'boolean'
			}, {
				name : 'skippable',
				type : 'int'
			},{
				name : 'cuepointnotregistered',
				type : 'boolean'
			},
			'captions', 'instructions', 'trainingfiles', 'taskStatus', 'taskId','lessonCompletedStatus',
			'unreadCount','reference_id','statusCls','statusTooltip','courseStatus','hiddenChapters',
			'lessonToPass','quizRequiredToPass','markUnviewed','quizPassed','quizStatus','otherPartyUpdated',
			{
				name:'chapterplaybackpause',
				type:'boolean'
			},'marker',{
				name:'lastChapter',
				type:'boolean'
			}],

	belongTo : {
		model : 'SWP.model.Video',
		foreignKey : 'videos_id'
	},
	 hasMany: {model: 'SWP.model.HiddenChapter', name: 'hiddenChapters'},

	idProperty : 'uid',

	getChapterName : function() {
		if (this.get('name'))
			return this.get('name') + ' ' + this.get('description');
		else
			return this.get('description');
	}

});