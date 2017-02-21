/**
 * @author rosa
 */
// vim: ts=4:sw=4:nu:fdc=2:nospell
/**
 * Ext.ux.form.XDateField - Date field that supports submitFormat
 *
 * @author  Ing. Jozef Sakalos
 * @version $Id: Ext.ux.XDateField.js 2348 2013-12-20 10:20:54Z arun $
 *
 * @license Ext.ux.grid.XDateField is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.ns('Ext.ux.form');

/**
  * @class Ext.ux.form.XDateField
  * @extends Ext.form.DateField
  */
Ext.ux.form.XDateField = Ext.extend(Ext.form.DateField, {
     submitFormat:'Y-m-d'
    ,onRender:function() {

        // call parent
        Ext.ux.form.XDateField.superclass.onRender.apply(this, arguments);

        this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name:this.name});
        this.hiddenName = this.name; // otherwise field is not found by BasicForm::findField
        this.el.dom.removeAttribute('name');
        this.el.on({
             keyup:{scope:this, fn:this.updateHidden}
            ,blur:{scope:this, fn:this.updateHidden}
        });

        this.setValue = this.setValue.createSequence(this.updateHidden);

    } // eo function onRender

    ,updateHidden:function() {
        var value = this.getValue();
        if(Ext.isDate(value)) {
            this.hiddenField.dom.value = Ext.util.Format.date(value, this.submitFormat);
        }
        else {
            this.hiddenField.dom.value = value;
        }
    } // eo function updateHidden

}); // end of extend

// register xtype
Ext.reg('xdatefield', Ext.ux.form.XDateField);

// eof  