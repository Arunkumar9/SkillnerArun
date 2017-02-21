/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23192          Dinesh GK    		20131114210      Extra commas is removed.
 *
 *	23210		   Venkatesh Teja		201311210845	 Quiz report circle tool tip % symbol is coming to next line, To avoid that added css class.
 **/

//201311210845
var answeredPercentageScore = '';
var quizAttemptedDate = '';
/**
* Bug #22765  061020130533 Quiz report on zooming is not clear
*/




Ext.define('SWP.view.reports.QuizReport', {
	extend: 'Ext.chart.Chart',
	alias: 'widget.quizscorereport',
	requires: ['Ext.chart.axis.Numeric','SWP.view.ChartTip'],
	actualWidth :0,
	noofQuizes:0,
	finalized:false,
	newinsetPadding:0,
	/**
	* Modified the getInsets function to change the padding top value to new value
	* of the slider which will be set to newinsetpadding from quizReportCard
	* 061020130533
	*/
	getInsets: function() {
        var me = this,
            insetPadding = ( me.newinsetPadding >0 ? me.newinsetPadding : me.insetPadding);

        return {
            top: insetPadding,
            right: me.insetPadding,
            bottom: me.insetPadding,
            left: me.insetPadding
        };
    },
	initComponent : function(){
		
		var me = this;
		
		Ext.define('Ext.chart.theme.Dark', {
			extend: 'Ext.chart.theme.Base',
			theme:'Dark',
			config : {
			highlight:{
						colorCode : '#5a5a5a'
					}
				},
	
				constructor: function(config) {
					
					var themeColor = "black";
					var baseColor = labelColor = strokecolor = themeColor;
					// var titleColor='#444444';
				
					this.callParent([Ext.apply({
						axis: {
							fill: '#a7a7a7',
							stroke: '#a7a7a7'
						},
						axisLabelLeft: {
							fill: '#6e6e6e'
						},
						
						axisTitleLeft: {
							fill: '#444444'
						},
						axisTitleBottom: {
							fill: '#444444'
						},
						
						colors:['#808080'] //20131114210
						
						
					}, config)]);
				}
		});
		
		Ext.apply(me,{
			flexCroll:false,
			width:  QUIZREPORT_CONSTANTS.REPORT_DEFAULT_WIDTH + (me.noofQuizes * QUIZREPORT_CONSTANTS.INTERVAL_WIDTH),
			actualWidth : QUIZREPORT_CONSTANTS.REPORT_DEFAULT_WIDTH + (me.noofQuizes * QUIZREPORT_CONSTANTS.INTERVAL_WIDTH),
//			height: 400,
			animate: true,
			// insetPadding:50,
			axes: [{
					type: 'numeric',
					position: 'left',
					fields: ['firstAttemptScore','firstLeastScore','secondLeastScore','thirdLeastScore','fourthLeastScore','fifthLeastScore','fifthScore','fourthScore','thirdScore','secondScore','firstScore','lastAttemptScore'],
					title: QUIZREPORT.COMPLETION,
					grid: true,
					minimum: 0,
					maximum:100,
					majorTickSteps: QUIZREPORT_CONSTANTS.MAJORTICKSTEPS
				}, {
					type: 'score',
					position: 'bottom',
					fields: ['quizzes'],
					title: QUIZREPORT.QUIZZES,
					label: {
						  renderer: function( value, abc, def ) {
							  
							  this.cls = value+' quiz-name';  
//							if( value.length > 20 ){
//		            			value =  value.substring(0,20)+"...";
//		            		}
		            		return value;
						}
//						 rotate: {
//	               			 degrees: 315
//	           		 }
					}
				}
			],
			
			series: [{
				type: 'score',
				axis: 'left',
				highlight: true,
				circleRadius:5,
				//circleId: 'rptQuizCircle',
				initialcircleRadius:true,
				answerField: 'answeredPercentage',
				xField : ['firstAttemptDate','firstLeastDate','secondLeastDate','thirdLeastDate','fourthLeastDate','fifthLeastDate','fifthDate','fourthDate','thirdDate','secondDate','firstDate','lastAttemptDate'],
				yField:  ['firstAttemptScore','firstLeastScore','secondLeastScore','thirdLeastScore','fourthLeastScore','fifthLeastScore','fifthScore','fourthScore','thirdScore','secondScore','firstScore','lastAttemptScore'],
				tips: {
				  trackMouse: true,
				  renderer: function(storeItem, item) {
					  if( 	item.value ){
						  var udpated  = item.value[0];
						  if( udpated ){
							  
							  udpated = udpated.split('-').join('/');
							  var dt = new Date(udpated);
							  var scoreDateFormat = Ext.Date.format(dt, QUIZREPORT.DATE_FORMAT)
							  this.update( QUIZREPORT.SCORE +item.value[1] + '  %'+'<br/>'+QUIZREPORT.DATE +scoreDateFormat );
						  }
					  }
					  
				  }
				},
				highlightCfg: {
					lineWidth: 3,
					stroke: SWP.chartTheme.config.highlight.colorCode,
					opacity: 0.8,
					fill: SWP.chartTheme.config.highlight.colorCode
				},listeners: {
		                'afterrender': function() {
		                	var circleCount = Ext.ComponentQuery.query('quizscorereport')[0].store.data.items.length;
		                	for(var k=0; k<circleCount; k++) {
		                		
		                		var item = Ext.ComponentQuery.query('quizscorereport')[0].store.data.items[k].data;
			                	
	            		    	if(item) {
	            		    		var udpated  = item.lastAttemptDate;
	            		    		 if(udpated) {
	            		    			 udpated = udpated.split('-').join('/');
	       							  	 var dt = new Date(udpated);
	       							  	 var scoreDateFormat = Ext.Date.format(dt, QUIZREPORT.DATE_FORMAT);
	       							  	 //201311210845
	       							  	 answeredPercentageScore = QUIZREPORT.LASTATTEMPT +item.answeredPercentage + '%';
	       							     quizAttemptedDate = QUIZREPORT.DATE +scoreDateFormat;
	            		    			 		                		    	 
	            		    		 }	                		    		
	            		    	}
	            		    	var blueCirc  = 'quizBlueCircle'+k;
			                	var toolTip = Ext.create('Ext.tip.ToolTip', {
		                		    target: blueCirc,
		                		    html: '<span  style = "white-space:nowrap;">'+answeredPercentageScore+'</span><br>'+quizAttemptedDate,          //201311210845
		                		    anchor: 'left',
		                		    trackMouse: true,
		                		    titleAlign: 'right',
		                		    dismissDelay: 0,
		                		    showDelay: 0,
		                		    autoHide: true
		                		});
		                	}
		                }
		        }
			}]
		
		});

		this.callParent( arguments );
	},
	setNoOfQuizes:function( noOfQuizes ){
		this.noofQuizes = noOfQuizes;
		this.actualWidth = QUIZREPORT_CONSTANTS.REPORT_DEFAULT_WIDTH + (this.noofQuizes * QUIZREPORT_CONSTANTS.INTERVAL_WIDTH );
		this.setWidth(QUIZREPORT_CONSTANTS.REPORT_DEFAULT_WIDTH + (this.noofQuizes * QUIZREPORT_CONSTANTS.INTERVAL_WIDTH ));
		if( this.noofQuizes == 0 ){
			this.up('panel[name=quizreportcards]').getLayout().setActiveItem(1);
		}
		this.finalized = true;
	}
});