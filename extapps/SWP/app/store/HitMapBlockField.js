Ext.define('SWP.store.HitMapBlockField', {
	extend : 'Ext.data.Store',
	storeId : 'hitmapblocks',
	requires: [
        'SWP.model.HitMapBlockField',
        'Ext.data.reader.Array'
    ],
	// requires : ['SWP.model.HitMapBlockField'],
	fields:[{name:'blockvalue'}],
	model : 'SWP.model.HitMapBlockField',
	  constructor: function(config) {
	  var me = this;

      Ext.apply(me, config);
      
		me.proxy = {
			type:'direct',
			directFn:ReportMgr.getCourseBlockValues,
			// type:'ajax',
			// url:'datatenthousand.json',
			reader:'array'
		};
		me.callParent(arguments);
}
	
});
 
 