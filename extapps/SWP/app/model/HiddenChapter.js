Ext.define('SWP.model.HiddenChapter', {
	extend : 'Ext.data.Model',

	fields : [
	          	'chapterId',
	          	{
					name : 'start',
					type : 'float'
				}, {
					name : 'stop',
					type : 'float'
				}
	          ]


});