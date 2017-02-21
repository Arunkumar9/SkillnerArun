/**
 * 
 */
Ext.define('SWP.model.DataGrid', {
	 extend: 'Ext.data.Model',
     fields: [
              {name: 'name',  type: 'string'},
              {name: 'video_id',  type: 'string'},
              {name: 'content_id',  type: 'string'},
              {name: 'question_id',  type: 'string'},
              {name: 'task_id',  type: 'int'},
              {name: 'status',  type: 'string'},
              {name: 'read',  type: 'string'},
              {name: 'taskAction',  type: 'string'}
             ]
             });