/**
* Bug #22765  061020130533 Quiz report on zooming is not clear calculating the new value for the padding top
*/
/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23192          Dinesh GK    		20131114210     Extra commas is removed.
 *
 *  22765		   Venkatesh Teja		201311181150	Removed Zooming component for the Quiz summary report 
 *  23820		   Kanchan Singh		201312041930	Changed extend class panel to container. 
 *
 **/

Ext.define('SWP.view.reports.QuizReportCard',{
	extend:'Ext.container.Container',
	alias:'widget.quizreportcard',
	config:{
		quizScore:undefined
	},
	initComponent:function(){
		var me = this;
		var chartHeight = Ext.getCmp('mainViewPort').quizScroreHeight;
		if(chartHeight!==350)
			chartHeight = 350-chartHeight;
		Ext.apply(me,{
			
				title:QUIZREPORT.REPORTNAME,
				layout:'card',
				flexCroll:false,
				activeItem:0,
				name:'quizreportcards',    				//201311181150
				items:[{
								 	xtype:'container',
								 	cls: (Ext.isIE9 ? 'quiz-card-overlowy' :''),
								 	name: 'quizreportcontainer',
									autoScroll: true,
									flexCroll:false,
									items: [{ 
										 xtype:'quizscorereport',
										 store: me.quizScore,
										 // cls: 'varticalZoomScroll',
										 id: 'quizscorereport',
										 noofQuizes : me.noofQuizes,
										 height: 350,
										 theme : 'Dark'
									 }]
					       },{
								
								xtype:'container',
								html : "<h3>This course does not have any quiz!</h3>"
					}]
				 
			
		});

		me.callParent( arguments );
	}
});