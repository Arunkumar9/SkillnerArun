/**
 * 
 */
Ext.define('SWP.store.DataGrid', {
	 extend: 'Ext.data.Store',
	 requires : [ 'SWP.model.DataGrid' ],
	 model:'SWP.model.DataGrid',
	 storeId:'datagrid',
	 autoLoad : false,
	 constructor: function(config) {
			
	        var me = this;

	        Ext.apply(me, config);
	        
			me.proxy = {
				type : 'direct',
				directFn : CollaborationToolMgr.createTaskSummary
			}
			me.callParent(arguments);
	}
});