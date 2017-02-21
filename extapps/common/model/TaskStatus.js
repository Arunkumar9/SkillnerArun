/**
 * 
 */
Ext.define('SWPCommon.model.TaskStatus', {
	extend : 'Ext.data.Model',
	fields : [ 'ID',
	           {
					name: 'StatusText',
			        convert: function( value, record ) {
			        	
			            var recordValue  = record.raw.statustext;
			            return eval( recordValue );
			        }
	           },
	           'InitialStatus', 'Cls',
	           {
	        	    name: 'LessonTooltip',
			        convert: function( value, record ) {
			        	
			            var recordValue  = record.raw.lessontooltip;
			            return eval( recordValue );
			        }
	           },
	           {
	        	    name: 'QuizTooltip',
			        convert: function( value, record ) {
			        	
			            var recordValue  = record.raw.quiztooltip;
			            return eval( recordValue );
			        }
	           },{
	        	    name: 'QuizTabTooltip',
			        convert: function( value, record ) {
			        	
			            var recordValue  = record.raw.quiztabtooltip;
			            return eval( recordValue );
			        }
	           },{
	        	   name:'FinalStatus',
	        	   type:'boolean'
	           }
	         ]
});
