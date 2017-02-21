Ext.namespace('Ext.ux');

/**
  * Ext.ux.DataView Extension
  *  * @class Ext.ux.DataView
  * @extends Ext.DataView
  */
  
Ext.ux.DataView = function(config) {
    Ext.ux.DataView.superclass.constructor.call(this, config);
    this.addEvents("refresh");
};

Ext.extend(Ext.ux.DataView, Ext.DataView, {
  refresh : function(){
      Ext.ux.Dataview.superclass.refresh.call(this);
      this.fireEvent("refresh", this);
    }
});

Ext.reg('uxdataview', Ext.ux.DataView);  