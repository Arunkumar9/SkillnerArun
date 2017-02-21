// $Id: EnumField.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.string');

/** It creates a new enumerator field
  * @param {String} id The id of the field
  * @param {String} label Optional. The label of the field. If not supplied the id is used.
  * @constructor
  * @extends Ext.ux.netbox.core.Field
  * @class This is the class that implements the field to use if the type is enumerator.
  * It contains as default the following operators:
  * <ul>
  *   <li> STRING_EQUAL </li>
  *   <li> STRING_DIFFERENT </li>
  * </ul>
  * The default operator is STRING_EQUAL.
  * The STRING_LIST and STRING_NOT_LIST operations should be manually added if needed.
  */
Ext.ux.netbox.string.EnumField = function(id,label) {
  Ext.ux.netbox.string.EnumField.superclass.constructor.call(this,id,label);
  var equalOperator = new Ext.ux.netbox.core.Operator("STRING_EQUAL",this.stringEqualsLabel);
  this.addOperator(equalOperator);
  this.setDefaultOperator(equalOperator);
  this.addOperator(new Ext.ux.netbox.core.Operator("STRING_DIFFERENT",this.stringDifferentLabel));
}

Ext.extend(Ext.ux.netbox.string.EnumField,Ext.ux.netbox.core.Field,/** @scope Ext.ux.netbox.string.EnumField.prototype */{

  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",

    /** Label of the STRING_LIST operation
    * @property
    */
  stringListText: "in",
  /** Label of the STRING_NOT_IN_LIST operation
    * @property
    */
  stringNotListText: "not in"

});