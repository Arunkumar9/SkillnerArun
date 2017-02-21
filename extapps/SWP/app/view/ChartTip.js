Ext.define('SWP.view.ChartTip', {
	override:'Ext.chart.Tip',


 showTip: function(item) {
        var me = this,
            tooltip,
            spriteTip,
            tipConfig,
            trackMouse,
            sprite,
            surface,
            surfaceExt,
            pos,
            x,
            y;
        if (!me.tooltip) {
            return;
        }
        clearTimeout(me.tipTimeout);
        tooltip = me.tooltip;
        spriteTip = me.spriteTip;
        tipConfig = me.tipConfig;
        trackMouse = tooltip.trackMouse;
        if (!trackMouse) {
            tooltip.trackMouse = true;
            sprite = item.sprite;
            surface = sprite.surface;
            surfaceExt = Ext.get(surface.getId());
            if (surfaceExt) {
                pos = surfaceExt.getXY();
                x = pos[0] + (sprite.attr.x || 0) + (sprite.attr.translation && sprite.attr.translation.x || 0);
                y = pos[1] + (sprite.attr.y || 0) + (sprite.attr.translation && sprite.attr.translation.y || 0);
                tooltip.targetXY = [x, y];
            }
        }
        var renderReturn =undefined;
        if (spriteTip) {
            renderReturn = tipConfig.renderer.call(tooltip, item.storeItem, item, spriteTip.surface);
        } else {
            renderReturn = tipConfig.renderer.call(tooltip, item.storeItem, item);
        }
        if( renderReturn == false ){
        	return;
        }
        tooltip.show();
        tooltip.trackMouse = trackMouse;
    }
});