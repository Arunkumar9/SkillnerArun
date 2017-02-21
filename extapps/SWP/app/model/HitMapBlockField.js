Ext.define('SWP.model.HitMapBlockField', {
	extend : 'Ext.data.Model',
	fields : ['name'],
	initConfig: function(){
		var me = this;
		
		Ext.apply(this.initialConfig, {
			
		});
		me.callParent(arguments);
	}
});