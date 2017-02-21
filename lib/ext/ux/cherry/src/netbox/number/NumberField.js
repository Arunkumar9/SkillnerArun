// $Id: NumberField.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.number');

/** It instantiates a new NumberField
  * @class This is the class that implements the field to use if the data to filter is a number.
  * It contains as default the following operation:
  * <ul>
  *   <li> NUMBER_EQUAL </li>
  *   <li> NUMBER_NOT_EQUAL </li>
  *   <li> NUMBER_GREATER </li>
  *   <li> NUMBER_GREATER_OR_EQUAL </li>
  *   <li> NUMBER_LESS </li>
  *   <li> NUMBER_LESS_OR_EQUAL </li>
  *   <li> NUMBER_RANGE </li>
  * </ul>
  * The default operation is NUMBER_EQUAL
  * @param {String} id The Field id.
  * @param {String} label Optional. The label of the filter. If not supplied the id is used.
  * @constructor
  * @extends Ext.ux.netbox.core.Field
  */
Ext.ux.netbox.number.NumberField = function(id,label) {
  Ext.ux.netbox.number.NumberField.superclass.constructor.call(this,id,label);
  var equalOperator = new Ext.ux.netbox.core.Operator("NUMBER_EQUAL","=");
  this.addOperator(equalOperator);
  this.setDefaultOperator(equalOperator);
  this.addOperator(new Ext.ux.netbox.core.Operator("NUMBER_NOT_EQUAL","!="));
  noEmptyAllowed=this.emptyNotAllowedFn.createDelegate(this);
  var op=new Ext.ux.netbox.core.Operator("NUMBER_GREATER",">");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.core.Operator("NUMBER_GREATER_OR_EQUAL",">=");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.core.Operator("NUMBER_LESS","<");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.core.Operator("NUMBER_LESS_OR_EQUAL","<=");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  this.addOperator(new Ext.ux.netbox.number.NumberRangeOperator());
}

Ext.extend(Ext.ux.netbox.number.NumberField,Ext.ux.netbox.core.Field,/** @scope Ext.ux.netbox.number.NumberField.prototype */{
 
  
  /** This method creates an Ext.ux.netbox.core.TextValuesEditor  with a Ext.form.NumberField as field.
    * @param {String} operatorId The operatorId actually used in the filter
    * @return {Ext.Editor} The field used to edit the values of this filter
    */
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.TextValuesEditor(new Ext.form.NumberField({decimalPrecision: 10}));
    return editor;
  }
});