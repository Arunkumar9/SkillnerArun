/**
 * 
 */
Ext.define('SWPCommon.store.TaskActions', {
	extend : 'Ext.data.Store',
	requires : [ 'SWPCommon.model.TaskAction','Ext.data.proxy.Direct'],
	model : 'SWPCommon.model.TaskAction',
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
