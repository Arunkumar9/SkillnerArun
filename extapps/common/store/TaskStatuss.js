/**
 * 
 */
Ext.define('SWPCommon.store.TaskStatuss', {
	extend : 'Ext.data.Store',
	requires : [ 'SWPCommon.model.TaskStatus','Ext.data.proxy.Direct'],
	model : 'SWPCommon.model.TaskStatus',
	storeId : 'TaskStatus',
	autoLoad:true,
	proxy: {
        type: 'ajax',
        url: 'extapps/chatapp/app/config/TaskStatus.json',
        reader: {
            type: 'json'
            
        }
    }
	
});
