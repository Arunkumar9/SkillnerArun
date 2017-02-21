Ext.define('SWP.store.QuizScores', {
	extend : 'Ext.data.Store',
	requires:['Ext.data.reader.Array'],
	constructor: function(config) {
		
        var me = this;
        Ext.apply(me, {
		
			fields: [
				{name: 'quizzes', type : 'string'},
				{name: 'firstAttemptScore', type: 'int'},
				{name: 'firstLeastScore', type: 'int'},
				{name: 'secondLeastScore', type: 'int'},
				{name: 'thirdLeastScore', type: 'int'},
				{name: 'fourthLeastScore', type: 'int'},
				{name: 'fifthLeastScore', type: 'int'},
				{name: 'fifthScore', type: 'int'},
				{name: 'fourthScore', type: 'int'},
				{name: 'thirdScore', type: 'int'},
				{name: 'secondScore', type: 'int'},
				{name: 'firstScore', type: 'int'},
				{name: 'lastAttemptScore', type: 'int'},
				{name: 'answeredPercentage'},
				'firstAttemptDate','firstLeastDate','secondLeastDate','thirdLeastDate','fourthLeastDate','fifthLeastDate','fifthDate','fourthDate','thirdDate','secondDate','firstDate','lastAttemptDate',"quizId"	
		 ],
		 proxy:{
			 type:'direct',
			 directFn:ReportMgr.getQuizReport,
			 reader:{
				 type:'array'
			 }
		 }
		 
		});
		me.callParent(arguments);
	}
});
