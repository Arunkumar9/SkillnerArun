/**
 * 
 */

Ext.define('CHAT.model.User', {
	extend : 'Ext.data.Model',
	requries:['Ext.data.proxy.Direct'],
	fields : [
	          'Uid',
	          'Username',
	          'Email',
	          'Name'],
	      	idProperty : 'Uid'
});
