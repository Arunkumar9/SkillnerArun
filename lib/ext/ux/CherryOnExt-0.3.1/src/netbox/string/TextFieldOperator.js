// $Id: TextFieldOperator.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.string');

/** Create a new TextFieldOperator
  * @constructor
  * @extends Ext.ux.netbox.core.Operator
  * @class This is the class that implements an operator that wants always a TextField
  * even if availableValues are available.
  */
Ext.ux.netbox.string.TextFieldOperator = function(id,label) {

  Ext.ux.netbox.string.TextFieldOperator.superclass.constructor.call(this,id,label);

  /** With this operator I want always a TextField, even if there are available values
    * This is the variable that contains the editor
    * @property {Ext.Editor} editor
    */
  this.editor=null;
};

Ext.extend(Ext.ux.netbox.string.TextFieldOperator,Ext.ux.netbox.core.Operator,/** @scope Ext.ux.netbox.string.TextFieldOperator.prototype */
{
  /** This method creates an Ext.ux.netbox.core.TextValuesEditor as editor.
    * @param {String} operatorId The operatorId actually used in the filter
    * @return {Ext.Editor} The field used to edit the values of this filter
    */
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.TextValuesEditor();
    return editor;
  }

});