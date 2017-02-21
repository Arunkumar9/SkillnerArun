Ext.define('SWPCommon.view.FlexCrollTablePanel',{
	override:'Ext.panel.Table',
	
	syncHorizontalScroll: function(left, setBody) {
		this.callParent( arguments );
		fleXenv.updateScrollBars();
	}
});
