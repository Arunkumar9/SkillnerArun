/**
 * @author PhaniKiran.Gutha
 */

Ext.define('SWPCommon.view.BadgeTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.badgetabpenl',
    requires: [
               'SWPCommon.view.BadgeTab',
               'Ext.layout.container.Card',
               'Ext.tab.Bar'
               ],

    /**
     * @protected
     * Makes sure we have a Tab for each item added to the TabPanel
     */
   initComponent: function() {
       var me = this,
           dockedItems = [].concat(me.dockedItems || []),
           activeTab = me.activeTab || (me.activeTab = 0),
           tabPosition = me.tabPosition;

       // Configure the layout with our deferredRender, and with our activeTeb
       me.layout = new Ext.layout.container.Card(Ext.apply({
           owner: me,
           deferredRender: me.deferredRender,
           itemCls: me.itemCls,
           activeItem: activeTab
       }, me.layout));

       /**
        * @property {Ext.tab.Bar} tabBar Internal reference to the docked TabBar
        */
       me.tabBar = new Ext.tab.Bar(Ext.apply({
           ui: me.ui,
           dock: me.tabPosition,
           orientation: (tabPosition == 'top' || tabPosition == 'bottom') ? 'horizontal' : 'vertical',
           plain: me.plain,
           cardLayout: me.layout,
           tabPanel: me,
           adjustTabPositions : function(){
    	   var items = this.items.items,
           i = items.length,
           tab;
    	   this.callParent(arguments);
    	   while (i--) {
               tab = items[i];
               if (tab.isVisible()) {
            	   if( i==0 ){
            		   leftVal = 2;
            	   }else{
            		   leftVal = 3 ;
            	   }
            	   
                   tab.el.setStyle('left', ( parseInt( tab.el.getStyle('left').split('px')[0]) - ((i+1)*leftVal)) + 'px');
               }
           }
       }
       }, me.tabBar));

       dockedItems.push(me.tabBar);
       me.dockedItems = dockedItems;

       me.addEvents(
           /**
            * @event
            * Fires before a tab change (activated by {@link #setActiveTab}). Return false in any listener to cancel
            * the tabchange
            * @param {Ext.tab.Panel} tabPanel The TabPanel
            * @param {Ext.Component} newCard The card that is about to be activated
            * @param {Ext.Component} oldCard The card that is currently active
            */
           'beforetabchange',

           /**
            * @event
            * Fires when a new tab has been activated (activated by {@link #setActiveTab}).
            * @param {Ext.tab.Panel} tabPanel The TabPanel
            * @param {Ext.Component} newCard The newly activated item
            * @param {Ext.Component} oldCard The previously active item
            */
           'tabchange'
       );

       me.callParent(arguments);

       // We have to convert the numeric index/string ID config into its component reference
       activeTab = me.activeTab = me.getComponent(activeTab);

       // Ensure that the active child's tab is rendered in the active UI state
       if (activeTab) {
       	me.tabBar.setActiveTab(activeTab.tab, true);
       }
   },
   onAdd: function(item, index) {
       var me = this,
           cfg = item.tabConfig || {},
           defaultConfig = {
               xtype: 'badgetab',
               ui: me.tabBar.ui,
               card: item,
               disabled: item.disabled,
               closable: item.closable,
               hidden: item.hidden && !item.hiddenByLayout, // only hide if it wasn't hidden by the layout itself
               tooltip: item.tooltip,
               tabBar: me.tabBar,
               position: me.tabPosition,
               closeText: item.closeText
           };

       cfg = Ext.applyIf(cfg, defaultConfig);

       // Create the correspondiong tab in the tab bar
       item.tab = me.tabBar.insert(index, cfg);

       item.on({
           scope : me,
           enable: me.onItemEnable,
           disable: me.onItemDisable,
           beforeshow: me.onItemBeforeShow,
           iconchange: me.onItemIconChange,
           iconclschange: me.onItemIconClsChange,
           titlechange: me.onItemTitleChange
       });

       if (item.isPanel) {
           if (me.removePanelHeader) {
               if (item.rendered) {
                   if (item.header) {
                       item.header.hide();
                   }
               } else {
                   item.header = false;
               }
           }
           if (item.isPanel && me.border) {
               item.setBorder(false);
           }
       }
   },           
    
               
    /**
     * @public
     * @param tabIndex -- Index of tab who's badgeText to change
     * @param text -- value of text to place in badge
     * @param appendToExisting -- if passed true then text will be appended to the old badgeText ( if badgeText passed as number text value will added to the badgeText Value )
     * @returns false when tab with the tabIndex doesnot exits, returns Ext.wtc.ct.view.BadgeTab component if sucess
     */
    updateBadge:function( tabIndex,text,appendToExisting ){
    	
    	var tabToChange = this.getTabBar().items.items[ tabIndex ];
    	if( !tabToChange ){
    		return false;
    	}else{
    		return tabToChange.updateBadge( text,appendToExisting );
    	}
    	
    }
});