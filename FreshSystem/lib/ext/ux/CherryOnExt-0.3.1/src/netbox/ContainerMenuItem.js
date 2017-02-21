// $Id: ContainerMenuItem.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox');

/** Creates a new ContainerMenuItem. 
  * @class It extends the base functionality of Ext.menu.Item
  * with the possibility of dynamically adding (or removing) a submenu to an item.
  * @constructor
  * @param {Object} config Configuration options. They are exactly the same config option of Ext.menu.Item
  * @extends Ext.menu.Item
  */
Ext.ux.netbox.ContainerMenuItem=function(config){
  Ext.ux.netbox.ContainerMenuItem.superclass.constructor.call(this,config);
};

Ext.extend(Ext.ux.netbox.ContainerMenuItem, Ext.menu.Item,/** @scope Ext.ux.netbox.ContainerMenuItem.prototype */
{

  /** This method returns the submenu of this item.
    * @return {Ext.menu.Menu} menu The submenu setted for this item
    */
  getSubMenu : function(){
    return this.menu;
  },

  /** This method sets the submenu for this item.
    * @param {Ext.menu.Menu} menu The submenu setted for this item
    */
  setSubMenu : function(menu){
    this.menu = Ext.menu.MenuMgr.get(menu);
    if(this.getEl()){
      this.getEl().addClass('x-menu-item-arrow');
    }
  },

  /** This method removes the submenu for this item.
    * @return void
    */
  removeSubMenu : function(){
    this.menu=undefined;
    if(this.getEl()){
      this.getEl().removeClass('x-menu-item-arrow');
    }
  }

});