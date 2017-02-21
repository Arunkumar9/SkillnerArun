Ext.define('CHAT.model.Post', {
	extend : 'Ext.data.Model',
	fields : [
	          'subject',
	          'content',
	          'authorName',
	          'author_id',
	          'created',
	          'hidden',
	          'quoted_post_id',
	          'uid',
	          'reference_id',
	          'attachments',
	          'attachmentSummary',
	          'thread_id',
	          'parent',
	          'authorimage',
	          'hidden_from',
	          {name : 'threadtypeId',type : 'int'},
	          {name : 'action',type : 'int'},
	          {name : 'link',type : 'String'},
	          {name : 'updated', type : 'String'},
	          'status',
	          'taskaction',
	          'readflag',
	          'loginuserid',
	          'old_instructorId',
	          'threadVideoId',
	          'quizCompleted'
	         ]
	
});


