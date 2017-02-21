Ext.define('SWP.view.Button',{
	override:'Ext.button.Button',
	
	setTooltip: function(tooltip, initial) {
        var me = this;

        if (me.rendered) {
            if (!initial || !tooltip) {
                me.clearTip();
            }
            if (tooltip) {
            	
                if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
                    Ext.tip.QuickTipManager.register(Ext.apply({
                        target: me.el.id
                    },
                    tooltip));
                    me.tooltip = tooltip;
                } else {
                    me.el.dom.setAttribute(me.getTipAttr(), tooltip);
                     me.el.dom.setAttribute('data-anchor', 'top');
                }
            }
        } else {
            me.tooltip = tooltip;
        }
        return me;
    }
});