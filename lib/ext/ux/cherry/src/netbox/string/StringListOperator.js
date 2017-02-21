// $Id: StringListOperator.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.string');

/** It instantiates a new StringListOperator
  * @class This is the class that implements an operator that allows the choice of more than one value (from a list)
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @param {String} id The id of the operator.
  * @param {String} label The label of the operator.
  */
Ext.ux.netbox.string.StringListOperator = function(id,label) {
  Ext.ux.netbox.string.StringListOperator.superclass.constructor.call(this,id,label);
  /** With this operator I want always a combo with multiple choice. The editor that implements the behaviour is Ext.ux.netbox.core.AvailableValuesEditor
    * If available values are not available (isAvailableValuesAvailable  returns false) an exception is thrown
    * @property {Ext.Editor} editor
    */
  this.editor=null;
  valFn=function(values){
    return(this.getField().emptyNotAllowedFn(values));
  }
  this.addValidateFn(valFn);
}

Ext.extend(Ext.ux.netbox.string.StringListOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.string.StringListOperator.prototype */{
  /** This method creates an Ext.ux.netbox.core.AvailableValuesEditor as editor.
    * @param {String} operatorId The operatorId actually used in the filter
    * @return {Ext.Editor} The field used to edit the values of this filter
    */
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.getField().getAvailableValues(),this.isStoreRemote(),this.isForceReload(),{multiSelect: true});
    return editor;
  },
  /** This method convert an old value of an elementary filter to a new value, suitable for this operator.
    * <B>NB:</B> if you want to return an empty operator return [].
    * In this default implementation, if it's an array, it returns all the element of the array in the format {value:...,label:...} 
    * an array with only the first element is returned. Otherwise it returns an empty array.
    * @param {Array of Object} values
    */
  convertValue: function(values){
    var toReturn=[];
    if(values !==null && values !== undefined && Ext.type(values)=="array"){
      for(var i=0;i<values.length;i++){
        if(values[i].value!== undefined && values[i].label!== undefined){
          toReturn.push(values[i]);
        }
      }
    }
    return(toReturn);
  }
});