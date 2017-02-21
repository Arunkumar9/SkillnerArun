// $Id: RangeItem.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.core');

/** Creates a new RangeItem
  * @extends Ext.menu.Adapter
  * @constructor
  * @param {Object} config Configuration options
  * @class This is  private class used by RangeField (it's the contant on the popup)
  * @ignore
  */
Ext.ux.netbox.core.RangeItem = function(config){
  this.editorFrom=config.editorFrom;
  this.editorTo=config.editorTo;
  this.editorFrom.fieldLabel=this.fromText;
  this.editorTo.fieldLabel=this.toText;
  this.panel= new Ext.Panel({
    layout: 'column',
    bodyBorder: false,
    border: false,
    hideBorders: true,
    items: [{layout: "form", labelWidth: 28, labelPad: 2, items: [this.editorFrom],columnWidth:0.5},
      {layout: "form", labelWidth: 28, labelPad: 2, items: [this.editorTo],columnWidth:0.5}
    ]
  });
  Ext.ux.netbox.core.RangeItem.superclass.constructor.apply(this,[this.panel,config]);
}

Ext.extend(Ext.ux.netbox.core.RangeItem,Ext.menu.Adapter,/** @scope Ext.ux.netbox.core.RangeItem.prototype */{
  /** @ignore*/
  fromText : 'from',
  /** @ignore*/
  toText   : 'to',
  /** @ignore*/
  itemCls: "x-menu-item",
  /** @ignore*/
  hideOnClick: false,
  /** initComponent
    * @ignore
    */
  initComponent: function(){
    this.addEvents({keyup:true});
  },
  /** doLayout
    * @ignore
    */
  doLayout: function(width){
    var fieldWidth=(width/2)-32;
    this.editorTo.setWidth(fieldWidth);
    this.editorFrom.setWidth(fieldWidth);//label is wider
    this.panel.setWidth(width);
    this.panel.doLayout();
  },
  /** onRender
    * @ignore
    */
  onRender: function(container){

    if(this.editorFrom.getValue()==""){
      this.editorFrom.setValue("");
    }
    if(this.editorTo.getValue()==""){
      this.editorTo.setValue("");
    }

    Ext.ux.netbox.core.RangeItem.superclass.onRender.apply(this, arguments);
  },
  /** getValueFrom
    * @ignore
    */
  getValueFrom: function(){
    return this.editorFrom.getValue();
  },
  /** getValueTo
    * @ignore
    */
  getValueTo: function(){
    return this.editorTo.getValue();
  },
  /** setValueFrom
    * @ignore
    */
  setValueFrom: function(value){
    if(value===""){
      this.editorFrom.setRawValue(value);
    } else {
      this.editorFrom.setValue(value);
    }
  },
  /** setValueTo
    * @ignore
    */
  setValueTo: function(value){
     if(value===""){
       this.editorTo.setRawValue(value);
    } else {
      this.editorTo.setValue(value);
    }
  },
  /** isValidFrom
    * @ignore
    */
  isValidFrom: function(preventMark){
    return this.editorFrom.isValid(preventMark);
  },
  /** isValidTo
    * @ignore
    */
  isValidTo: function(preventMark){
    return this.editorTo.isValid(preventMark);
  },
  /** It sets as invalid the from and to fields
    * @private
    * @param {String} msg The message to show to the user
    * @ignore
    */
  markInvalid: function(msg){
    this.editorFrom.markInvalid(msg);
    this.editorTo.markInvalid(msg);
  },
  /** It clears the invalid mask from the from and to fields
    * @private
    * @ignore
    */
  clearInvalidFields: function(){
    this.editorFrom.clearInvalid();
    this.editorTo.clearInvalid();
  }
});