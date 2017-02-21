/**
 * 
 */
Ext.define('SWP.model.VideoCaptionSetting', {
	extend : 'Ext.data.Model',

	fields : ['name','key','value','group',{
		name: 'uid',
		type: 'int'
	},{
		name : 'user_id',
		type : 'int'
	},{
		name : 'product_id',
		type : 'int'
	},{
		name : 'content_id',
		type : 'int'
	},{
		name : 'enable',
		type : 'boolean'
	}],

	idProperty : 'uid'

});