// vim: ts=4:sw=4:nu:fdc=4:nospell
/*global Ext, console */
/**
 * @class Ext.ux.form.ServerValidator
 * @extends Ext.util.Observable
 *
 * Server-validates field value
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      8. February 2008
 * @version   1.0
 * @revision  $Id: Ext.ux.form.ServerValidator.js 2348 2013-12-20 10:20:54Z arun $
 *
 * @license Ext.ux.form.ServerValidator is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * <p>License details: <a href="http://www.gnu.org/licenses/lgpl.html"
 * target="_blank">http://www.gnu.org/licenses/lgpl.html</a></p>
 *
 * @donate
 * <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
 * <input type="hidden" name="cmd" value="_s-xclick">
 * <input type="hidden" name="hosted_button_id" value="3430419">
 * <input type="image" src="https://www.paypal.com/en_US/i/btn/x-click-butcc-donate.gif"
 * border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">
 * <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
 * </form>
 */

Ext.ns('Ext.ux.form');

/**
 * Creates new ServerValidator
 * @constructor
 * @param {Object} config A config object
 */
Ext.ux.form.ServerValidator = function(config) {
    Ext.apply(this, config, {
         url: Fresh.Config.Service.Form
        ,method:'post'
        ,action:'validateField'
        ,paramNames:{
             valid:'valid'
            ,reason:'reason'
        }
        ,validationDelay:500
        ,validationEvent:'keyup'
        ,logFailure:true
        ,logSuccess:true
    });
    Ext.ux.form.ServerValidator.superclass.constructor.apply(this, arguments);
}; // eo constructor

// extend
Ext.extend(Ext.ux.form.ServerValidator, Ext.util.Observable, {

    // {{{
    init:function(field) {
        this.field = field;
        // save original functions
        var isValid = field.isValid;
        var validate = field.validate;

        Ext.apply(field, {
            // is field validated by server flag
             serverValid: undefined !== this.serverValid ? this.serverValid : true
//             serverValid: true

            ,getForm: function() {
                 return this.findParentByType('form');
            }
             // private
            ,isValid:function(preventMark) {
                if(this.disabled) {
                    return true;
                }
                return isValid.call(this, preventMark) && this.serverValid;
            }

            // private
            ,validate:function() {
                var clientValid = validate.call(this);

                // return false if client validation failed
                if(!this.disabled && !clientValid) {
                    return false;
                }

                // return true if both client valid and server valid
                if(this.disabled || (clientValid && this.serverValid)) {
                    this.clearInvalid();
                    return true;
                }

                // mark invalid and return false if server invalid
                if(!this.serverValid) {
                    this.markInvalid(this.reason);
                    return false;
                }

                return false;
            } // eo function validate

        }); // eo apply

        // install listeners
        this.field.on({
             render:{single:true, scope:this, fn:function() {
                this.serverValidationTask = new Ext.util.DelayedTask(this.serverValidate, this);
                this.field.el.on(this.validationEvent, function(e){
                    this.field.serverValid = false;
                    this.filterServerValidation(e);
                }, this);
//                this.field.el.on({
//                    keyup:{scope:this, fn:function(e) {
//                        this.field.serverValid = false;
//                        this.filterServerValidation(e);
//                    }}
////                    ,blur:{scope:this, fn:function(e) {
////                        this.field.serverValid = false;
////                        this.filterServerValidation(e);
////                    }}
//                });
            }}
        });
    } // eo function init
    // }}}

    ,serverValidate:function() {
        var options = {
             url:this.url
            ,method:this.method
            ,scope:this
            ,success:this.handleSuccess
            ,failure:this.handleFailure
            ,params:this.params || {}
        };
        var form = this.field.getForm();
        Ext.applyIf(options.params, {
             action:this.action
            ,field:this.name || this.field.name
            ,value:this.field.getValue()
            ,view:this.view || form.formBaseParams.view
            ,context: this.context || form.id+'-'+this.field.name
            ,id: form.formBaseParams.id
        });
        Ext.Ajax.request(options);
    } // eo function serverValidate

    // {{{
    ,filterServerValidation:function(e) {
        if(this.field.value === this.field.getValue()) {
            this.serverValidationTask.cancel();
            this.field.serverValid = true;
            return;
        }
        if(!e.isNavKeyPress()) {
            this.serverValidationTask.delay(this.validationDelay);
        }
    } // eo function filterServerValidation
    // }}}
    // {{{
    ,handleSuccess:function(response, options) {
        var o;
        try {o = Ext.decode(response.responseText);}
        catch(e) {
            if(this.logFailure) {
                this.log(response.responseText);
            }
        }
        if(true !== o.success) {
            if(this.logFailure) {
                this.log(response.responseText);
            }
        }
        this.field.serverValid = true === o[this.paramNames.valid];
        this.field.reason = o[this.paramNames.reason];
        this.field.validate();
    } // eo function handleSuccess
    // }}}
    // {{{
    ,handleFailure:function(response, options) {
        if(this.logFailure) {
            this.log(response.responseText);
        }
    } // eo function handleFailure
    // }}}
    // {{{
    ,log:function(msg) {
        if(console && console.log) {
            console.log(msg);
        }
    } // eo function log
    // }}}

});

Ext.preg('pservervalidator',Ext.ux.form.ServerValidator);