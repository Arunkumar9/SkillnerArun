Ext.define('SWP.view.reports.CourseReportForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.coursereportform',
	
	initComponent : function(){
		
		var me = this;
		var reportsFormForStudent = false;

		if( SWP.Rrolename == 'student' ) {
			
			reportsFormForStudent = true;
		}
		
		Ext.apply(me,{
			flexCroll:false,
			autoScroll:true,
			padding:'10 10 30 10',
			api:{
				load: ReportMgr.getCourseRelatedInfo
			},
			paramOrder: ['param1'],
			title : COURSE_REPORT.TITLE,
			cls : 'coursesummary-form-cls',
			defaultType: 'displayfield',
			defaults : {
				labelAlign : 'right',
				labelSeparator : ' :',
				labelWidth : 260,
				style : 'font-weight : bold;',
				labelStyle : 'font-weight : bold;',
				width : '100%'
			},
			layout : {
				type : 'vbox',
				align : 'center',
				packed : 'middle'
			},
			items: [{
				fieldLabel: COURSE_REPORT.COURSE_DURATION,
				name: 'courseDuration'
			},{
				fieldLabel : COURSE_REPORT.COURSE_STARTED_DATE,
				name : 'courseActivatedDate'
			},{
				fieldLabel: COURSE_REPORT.COURSE_EXP_DATE,
				name: 'courseExpirationDate'
			},{
				fieldLabel: COURSE_REPORT.COURSE_SIZE,
				name: 'courseSize'
			},{
				fieldLabel: COURSE_REPORT.INSTRUCTOR_AVAIL_DATE,
				name: 'instructorAvailDate'
			},{
				fieldLabel: COURSE_REPORT.LASTACTIVE_DATE,
				name: 'lastActiveDate',
				hidden : reportsFormForStudent
			},{
				fieldLabel: COURSE_REPORT.INSTRUCTOR_REPLIES,
				name: 'commentsRepliedByInstructor',
				hidden : reportsFormForStudent
			},{
				fieldLabel: COURSE_REPORT.POSTS_BY_STUDENT,
				name: 'commentsSubmittedByStudent',
				hidden : reportsFormForStudent
			},{
				fieldLabel: COURSE_REPORT.QUIZES_COUNT,
				name: 'quizesCount'
			}]
		});
		
		this.callParent( arguments );
	}
});