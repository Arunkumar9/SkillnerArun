/**
 * 
 */
Ext.define('CHAT.store.TaskStatuss', {
	extend : 'Ext.data.Store',
	requires : [ 'CHAT.model.TaskStatus','Ext.data.proxy.Direct'],
	model : 'CHAT.model.TaskStatus',
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
