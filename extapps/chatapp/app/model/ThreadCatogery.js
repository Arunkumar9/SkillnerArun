
/**
 * 
 */
Ext.define('CHAT.model.ThreadCatogery', {
	extend : 'Ext.data.Model',
	requries:['Ext.data.proxy.Direct'],
	fields : [
	          'uid',
	          'name',
	          'thread_type_id'],
	 idProperty : 'uid'
});