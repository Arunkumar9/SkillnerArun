// $Id: DateTextEditor.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.date');

/** It instantiates a new DateTextEditor
  * @class This class extends Ext.ux.netbox.FilterEditor to manage dates as value.
  * For a description of the parameters look at the documentation of Ext.Editor.
  * @constructor
  * @extends Ext.ux.netbox.FilterEditor
  */
Ext.ux.netbox.date.DateTextEditor = function(field,config){
  Ext.ux.netbox.date.DateTextEditor.superclass.constructor.call(this,field,config);
  if(config.format==undefined){
    config.format='Y-m-d H:i:s';
  }
  this.format=config.format;
}

Ext.extend(Ext.ux.netbox.date.DateTextEditor,Ext.ux.netbox.FilterEditor,/** @scope Ext.ux.netbox.date.DateTextEditor.prototype */{

  /** This method gets the value. If the value inserted by the user is not a valid date, an empty array is returned.
   */

  getValue: function() {
    var val=Ext.ux.netbox.date.DateTextEditor.superclass.getValue.call(this);
    
    if(val===""){
      return([]);
    }else{
      return [{value: val.format('Y-m-d H:i:s'),label:val.format(this.format)}];
    }
  },

  setValue: function(val){
    var value;
    if(val.length==0){
      value="";
    }else{
      value=Date.parseDate(val[0].value, 'Y-m-d H:i:s');
    }
    Ext.ux.netbox.date.DateTextEditor.superclass.setValue.call(this,value);
  }

});