/**
 * @author PhaniKiran Gutha
 * This is a model class for holding file attachment information.
 *
 */

Ext.define('SWP.model.File', {
	extend : 'Ext.data.Model',
	storeId : 'file',
	fields : [ 'uid',
	           'username', 
			   'user_id',
			   'role_id',
			   'rolename',
			   'filename',
			   'filesize',
			   'uploaddate',
			   'product_id',
			   'lesson_id',
			   'question_id',
			   'filepath'
			 ],
	
	idProperty : 'uid'
	
});