/**
 * 
 */
Ext.define('CHAT.store.TaskActions', {
	extend : 'Ext.data.Store',
	requires : [ 'CHAT.model.TaskAction','Ext.data.proxy.Direct'],
	model : 'CHAT.model.TaskAction',
	storeId : 'TaskAction',
	autoLoad:true,
	proxy: {
         type: 'ajax',
         url: 'extapps/chatapp/app/config/TaskAction.json',
         reader: {
             type: 'json'
             
         }
     }
});
