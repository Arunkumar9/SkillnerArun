Ext.onReady(function() {
	Ext.ux.TDGi.iconMgr.setIconPath('TDGi.icons');
	new Ext.Button({
		text     : 'Click to see IconBrowser (May be slowe over the inter-tubes)',
		iconCls  : Ext.ux.TDGi.iconMgr.getIcon('application_osx_double'),
		renderTo : Ext.getBody(),
		handler  : function() {
			Ext.ux.TDGi.iconBrowser.setPath('TDGi.icons').show();
		}
	});
	
	new Ext.TabPanel({
		width      : 500,
		height     : 200,
		activeItem : 0,
		renderTo   : Ext.getBody(),
		items      : [
			{
				iconCls : Ext.ux.TDGi.iconMgr.getIcon('cross'),
				title   : 'Ext.ux.TDGi.iconMgr',
				html    : "iconCls : Ext.ux.TDGi.iconMgr.getIcon('cross')"
			},
			{
				iconCls : Ext.ux.TDGi.iconMgr.getIcon('page_white_magnify'),
				title   : 'pwns!',
				html    : "iconCls : Ext.ux.TDGi.iconMgr.getIcon('page_white_magnfy')"
			},
			{
				iconCls : Ext.ux.TDGi.iconMgr.getIcon('application_osx_link'),
				title   : '.. is real easy to use too',
				html    : "iconCls : Ext.ux.TDGi.iconMgr.getIcon('application_osx_link')"
			}				
		]
	
	
	});

});



