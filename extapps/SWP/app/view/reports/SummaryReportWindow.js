/**
 *    Task/Issue      Author    			UniqueID        Comment   
 *	 ---------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *	  23518			  Venkatesh Teja		201311191205	Removed custom scroll bar(set to false).
 *	  23714			  Dinesh GK				201311268		SummaryReportWindow width, height is changed to "%" values.
 *	  23820		   	  Kanchan Singh		    201312041930	Changed layour from fit to border.
 *
 **/

Ext.define('SWP.view.reports.SummaryReportWindow', {
	extend: 'Ext.window.Window',
	requires:[
		'SWP.view.reports.HeatMapCard',
		'SWP.view.reports.QuizReportCard'
	],
	alias: 'widget.summaryreportwindow',
	modal:true,
	noofQuizes:0,
	cls : 'reports-window',
	initComponent : function(){
		
		var me = this;
		me.actualWidth = 900;
		me.actualHeight = 400;
		Ext.apply(me,{
			
			layout:'border',
			height:me.actualHeight,
			width:me.actualWidth,
			minHeight:200,
			minWidth:600,
			// maxHeight:400,
			// maxWidth:900,
			constrain:true,
			draggable:true,
			flexCroll : false,							//201311191205
			autoScroll:true,
			title : SWP.Ruser+'('+SWP.Rrolename+')',
			items:[{
//				xtype:'panel',
//				flexCroll : false,	
//				layout:'border',
//				items:[{
						xtype : 'reportstree',
						region : 'west',
						border : true
					},{
						xtype : 'reportspanelcard',
						region : 'center',
						// quizScore : me.quizScore,
						noofQuizes : me.noofQuizes
//						flex:8
//				}]
			}],
			listeners:{
				'resize':function(window,width,height){
					if( !Ext.isEmpty(this.down('quizreportcard'))  ){ //&& Ext.isIE9
						if( height < this.actualHeight ){
							this.down('quizreportcard container').getEl().removeCls('quiz-card-overlowy');	
						}else if( height > this.actualHeight){
							this.down('quizreportcard container').getEl().addCls('quiz-card-overlowy');	
						}
						//add cls to show vertical scrollbar else not intially it will be overflow-x:hidden;
					}
				}
			}
		});
		
		this.callParent( arguments );
	}

});