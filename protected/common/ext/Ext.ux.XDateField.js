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


// vim: ts=4:sw=4:nu:fdc=2:nospell
/**
 * Ext.ux.form.XCheckbox - checkbox with configurable submit values
 *
 * @author  Ing. Jozef Sakalos
 * @version $Id: Ext.ux.XDateField.js 2348 2013-12-20 10:20:54Z arun $
 * @date    10. February 2008
 *
 *
 * @license Ext.ux.form.XCheckbox is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

/*global Ext */

/**
  * @class Ext.ux.XCheckbox
  * @extends Ext.form.Checkbox
  */
Ext.ns('Ext.ux.form');
Ext.ux.form.XCheckbox = Ext.extend(Ext.form.Checkbox, {
     submitOffValue:'false'
    ,submitOnValue:'true'

    ,onRender:function() {

        this.inputValue = this.submitOnValue;

        // call parent
        Ext.ux.form.XCheckbox.superclass.onRender.apply(this, arguments);

        // create hidden field that is submitted if checkbox is not checked
        this.hiddenField = this.wrap.insertFirst({tag:'input', type:'hidden'});

        // support tooltip
        if(this.tooltip) {
            this.imageEl.set({qtip:this.tooltip});
        }

        // update value of hidden field
        this.updateHidden();

    } // eo function onRender

    /**
     * Calls parent and updates hiddenField
     * @private
     */
    ,setValue:function(v) {
        v = this.convertValue(v);
        this.updateHidden(v);
        Ext.ux.form.XCheckbox.superclass.setValue.apply(this, arguments);
    } // eo function setValue

    /**
     * Updates hiddenField
     * @private
     */
    ,updateHidden:function(v) {
        v = undefined !== v ? v : this.checked;
        v = this.convertValue(v);
        if(this.hiddenField) {
            this.hiddenField.dom.value = v ? this.submitOnValue : this.submitOffValue;
            this.hiddenField.dom.name = v ? '' : this.el.dom.name;
        }
    } // eo function updateHidden

    /**
     * Converts value to boolean
     * @private
     */
    ,convertValue:function(v) {
        return (v === true || v === 'true' || v === this.submitOnValue || String(v).toLowerCase() === 'on');
    } // eo function convertValue

}); // eo extend

// register xtype
Ext.reg('xcheckbox', Ext.ux.form.XCheckbox);

// vim: ts=4:sw=4:nu:fdc=2:nospell
/**
  * Ext.ux.form.XTimeField - Time field that supports submitFormat
  *
  * @author  Ing. Jozef Sakalos
  * @version $Id: Ext.ux.XDateField.js 2348 2013-12-20 10:20:54Z arun $
  *
  * @class Ext.ux.form.XTimeField
  * @extends Ext.form.TimeField
  */
Ext.ns('Ext.ux.form');
Ext.ux.form.XTimeField = Ext.extend(Ext.form.TimeField, {
     submitFormat:'H:i:s'
    ,onRender:function() {

        this.altFormats += '|' + this.submitFormat;

        // call parent
        Ext.ux.form.XTimeField.superclass.onRender.apply(this, arguments);

        this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name:this.name});
        this.hiddenName = this.name; // otherwise field is not found by BasicForm::findField
        this.el.dom.name = null;
        this.el.on({
             keyup:{scope:this, fn:this.updateHidden}
            ,blur:{scope:this, fn:this.updateHidden}
        });

        this.setValue = this.setValue.createSequence(this.updateHidden);

    } // e/o function onRender

    ,updateHidden:function() {
        var value = this.getValue();
        value = Ext.isDate(value) ? value : Date.parseDate(value, this.format);
        this.hiddenField.dom.value = Ext.util.Format.date(value, this.submitFormat);
    } // e/o function updateHidden

}); // end of extend

// register xtype
Ext.reg('xtimefield', Ext.ux.form.XTimeField);

// e/o file 
// eo file 