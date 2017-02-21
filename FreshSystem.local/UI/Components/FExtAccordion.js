/**
 * @author rosa
 */

Ext.namespace('Fresh');


Fresh.FExtAccordion = {
	
	
	init: function(cfg) {
		
		
		config = {
			wrapEl: cfg.panelID+'Ct'
			,initialHeight: 300
			
		}
		Ext.apply(config,cfg);
		
		
		var panel = Ext.get(config.panelID);
		
		//var wrapCt = panel.wrap({tag: 'div', id: config.wrapEl});
		
		// {{{
		// create accordion
		var acc = new Ext.ux.Accordion(config.panelID, {
			fitContainer: true
			, fitToFrame: true
			, boxWrap: true
			//, wrapEl: config.wrapEl
			, fitHeight: true
			, initialHeight: 300
			, forceOrder: false
			, keepState: true
			, draggable: true
		});
		// }}}
		// {{{
		// resizing of fitHeight accordion
		var accCt = Ext.get(config.containerID);
/*
		var resizer = new Ext.Resizable(accCt, {
			handles:'s e se'
			, transparent: true
			, minHeight: 180 //244
			, minWidth: 150 // 224
			, pinned: true
		});
		resizer.on({
			beforeresize: {
				scope:acc
				, fn: function(r, e) {
	
					// save old sizes
					r.oldSize = accCt.getSize();
					r.oldAccSize = this.body.getSize();
			}}
			, resize: {
				scope:acc
				, fn: function(r, w, h, e) {
	
					// calculate deltas
					var dw, dh;
					dw = w - r.oldSize.width;
					dh = h - r.oldSize.height;
	
					// resize Accordion 
					this.setSize(r.oldAccSize.width + dw, r.oldAccSize.height + dh);
					var dockWidth = this.body.getWidth(true);
					if(Ext.isIE) {
						this.items.each(function(panel) {
							panel.body.setWidth(dockWidth);
						})
					}
	
			}}
		});

*/		// }}}
		
		Fresh.Layout.add('east',acc);
		//acc.id = config.panelID;
		Ext.ComponentMgr.register(acc);
		
	}
	
}