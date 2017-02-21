/**
 * @author rosa
 */

Ext.namespace('Fresh');


Fresh.FExtInfoPanel = {
	
	
	init: function(cfg) {
		
		
		//alert('accordion ID '+cfg.containerID);
		var config = {
			initialHeight: 300
			, iconPath: 'FreshSystem/images/icons/fam/'
			, icon: 'page_white_stack.png'
			, animate: true
		}
		Ext.apply(config,cfg);
		
		var panel = Ext.get(config.panelID);
	// {{{
	// add InfoPanel
	if (config.containerID) {
		var acc = Ext.ComponentMgr.get(config.containerID);
		var ipTree = acc.add(new Ext.ux.InfoPanel(config.panelID, {
			autoScroll: true
			, collapsed: true
			, collapsible: true
			, showPin: false
			, icon: config.iconPath + config.icon
			, animate: config.animate
//			, easingCollapse: 'backIn'
//			, fixedHeight: 300
		}));
	} 
	else {
		var ipTree = new Ext.ux.InfoPanel(config.panelID, {
			autoScroll: true
			, collapsed: true
			, collapsible: true
			, showPin: false
			, icon: config.iconPath + config.icon
			, animate: config.animate
//			, easingCollapse: 'backIn'
//			, fixedHeight: 300
		});
	}
		
	// }}}
	
	Ext.ComponentMgr.register(ipTree);

		
		
		
	}
	
}