Ext.define('SWP.store.ReportsTree', {
	extend : 'Ext.data.TreeStore',

	constructor : function(config) {

		var me = this;

		if (SWP.Rrolename == 'instructor') {

			Ext.apply(me, {
				fields : [ 'text', 'leaf', 'action' ],
				root : {
					expanded : true,
					children : [ {
						text : "Summary Reports",
						expanded : true,
						children : [ {
							id : 'summary-report',
							text : "Course Summary Report",
							leaf : true,
							cls : 'reportstreestylecls',
							action : 'generateCourseReport'
						}, {
							text : "Quiz Summary Report",
							leaf : true,
							cls : 'reportstreestylecls',
							action : 'showQuizSummaryReport'
						}, {
							text : "HeatMap Report",
							leaf : true,
							cls : 'reportstreestylecls',
							action : 'showHeatMapReport'
						} ]
					} ]
				}
			});
		} else {
			Ext.apply(me, {
				fields : [ 'text', 'leaf', 'action' ],
				root : {
					expanded : true,
					children : [ {
						text : "Summary Reports",
						expanded : true,
						children : [ {
							id : 'summary-report',
							text : "Course Summary Report",
							leaf : true,
							cls : 'reportstreestylecls',
							action : 'generateCourseReport'
						}, {
							text : "Quiz Summary Report",
							leaf : true,
							cls : 'reportstreestylecls',
							action : 'showQuizSummaryReport'
						} ]
					} ]
				}
			});
		}
		me.callParent(arguments);
	}
});
