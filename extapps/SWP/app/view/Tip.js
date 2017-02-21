Ext.define('SWP.view.Tip', {
		override:'Ext.tip.ToolTip',
		flexCroll: false,
		autoScroll: false,
		height: 'auto',

		show: function() {
			        var me = this;
			        // Show this Component first, so that sizing can be calculated
			        // pre-show it off screen so that the el will have dimensions
			        if( me.anchor ){
			            me.origAnchor = me.anchor;
			        }
			        this.callParent();
			        if (this.hidden === false) {
			        	
			            me.setPagePosition(-10000, -10000);
			            if (!me.calledFromShowAt) {
			                me.showAt(me.getTargetXY());
			            }
			
			            if (me.anchor) {
			                me.syncAnchor();
			                me.anchorEl.show();
			            } else {
			                me.anchorEl.hide();
			            }
			        }
			        
		}
});