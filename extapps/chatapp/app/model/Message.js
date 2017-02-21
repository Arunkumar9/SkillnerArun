/**
 * 
 */
Ext.define('CHAT.model.Message', {
	extend : 'Ext.data.Model',
	requires : [ 'Ext.data.proxy.Direct'],
	fields : [
	          'authorName',
	          'image',
	          'subject',
	          'last_update_user_id',
	          'lastUpdateUser',
	          {name:'views',type:'int'},
	          'reference_id',
	          'last_update',
	          'link',
	          'chaptername',
	          'posts',
	          {name:'unread_Post_Count',type:'int'},
	          'attachments',
	          {name:'hasattachments',type:'boolean'},
	          'postsbyuser',
	          {name:'hidden',type:'boolean'},
	          'uid',
	          'thread_type_id',
	          'thread_catogery_id',
	          'created_user_id',
	          'class_id',
	          'content_id',
	          'broadcast',
	          'to',
	          'reference',
	          'content',
	          'reply',
	          'quoted_post_id',
	          'record',
	          'hidden_from',
	          'postCount',
	          'creatorPostCount',
	          {name:'status',type:'int'},
	          'commentUid',
	          {name:'taskaction',type:'int'},
	          'trainingfiles',
	          'largeFile',
	          {
	        	  name : 'isFromUpdateReadPost',
	        	  type : 'boolean'
	          },
	          {name : 'old_instructorId'}
	          ],
	initConfig: function(){
		var me = this;
		
		Ext.apply(this.initialConfig, {
			
		});
		me.callParent(arguments);
	}
});
