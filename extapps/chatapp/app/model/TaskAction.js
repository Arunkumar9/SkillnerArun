/**
 * 
 */
Ext.define('CHAT.model.TaskAction', {
	extend : 'Ext.data.Model',
	fields : [ 'ID',
	           {
					name: 'Name',
			        convert: function( value, record ) {
			        	
			            var recordValue  = record.raw.name;
			            return eval( recordValue );
			        }
	           },
	           'StatusCode', 
	           {
	        	   name: 'ActionText',
			        convert: function( value, record ) {
			        	
			            var recordValue  = record.raw.actiontext;
			            return eval( recordValue );
			        }   
	           },
	           'Transitions', 
	           {
	        	   name: 'Body',
			        convert: function( value, record ) {
			        	
			            var recordValue  = record.raw.body;
			            return eval( recordValue );
			        }  
	           },
	           'InitialAction' ]
});
