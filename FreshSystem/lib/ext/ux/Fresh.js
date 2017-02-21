/**
 * @fileOverview    Various helper functions
 * @author Jan Rosa
 */
 
/*
 *                 listeners:
                    beforeaction: >
                                  @function(bf,action) {
                                    if (action.type == 'submit') {
                                        var passwd = Ext.getCmp('user-form-password-field');
                                        var passwdChk = Ext.getCmp('user-form-password-check-field');
                                        passwd.origVal = passwd.getValue();
                                        passwdChk.origVal = passwd.origVal;
                                        var sha = Ext.ux.Crypto.SHA1.hash(passwd.origVal);
                                        passwd.setRawValue(sha);
                                        passwdChk.setRawValue(sha);
                                    }
                                  }
                    actioncomplete: >
                                  @function(bf,action) {
                                    if (action.type == 'submit') {
                                        var passwd = Ext.getCmp('user-form-password-field');
                                        var passwdChk = Ext.getCmp('user-form-password-check-field');
                                        passwd.setRawValue('');
                                        passwdChk.setRawValue('');
                                    }
                                  }
                    actionfailed: >
                                  @function(bf,action) {
                                    if (action.type == 'submit') {
                                        var passwd = Ext.getCmp('user-form-password-field');
                                        var passwdChk = Ext.getCmp('user-form-password-check-field');
                                        passwd.setRawValue('');
                                        passwdChk.setRawValue('');
                                    }
                                  }

 */
Ext.namespace('Fresh','Fresh.data','Fresh.Msg','Fresh.form','Fresh.plugin','Fresh.util','Fresh.localize');


Fresh.setUser = function(o)
{
    Fresh.User = Ext.applyIf(o || {},{"Name":"Guest","Uid":"","Level":"0","Username":"","Roles":[],"IsGuest":true});
}

Fresh.form.PasswordUpdate = Ext.extend(Ext.form.TextField,{
   initComponent: function() {
        this.inputType = 'password';
   },
   validateValue: function(value) {
        if (this.ownerCt && this.ownerCt.formBaseParams && this.ownerCt.formBaseParams.id == 'new') {
            this.allowBlank = false;
        }
        else {
            this.allowBlank = true;
            this.clearInvalid();
        }
        return Fresh.form.PasswordUpdate.superclass.validateValue.call(this,value);
   }
});
Ext.reg('passwordupdate',Fresh.form.PasswordUpdate);

Fresh.plugin.fieldUpdate = function(config) {
    Ext.applyIf(this,config);
}
Fresh.plugin.fieldUpdate.prototype = {

    init: function(field) {
    
        this.field = field;
        if (!this.store)
            return;
        
        this.field.on('render',this.later,this,{single: true});        
    },

    later: function(){
        if (this.panel = this.field.findParentByType('panel')) {
            this.panel.on('afterlayout',this.onActivate,this);
        }
        if (this.form = this.field.findParentByType('form')) {
            this.form.getForm().on('beforeaction',this.onBeforeSubmit,this);
        }
    },
    onBeforeSubmit: function(form,action) {
      if (action.type == 'submit') {
        this.onActivate(form);
      }
      return true;
    },
    onActivate: function(panel) {
           var oldVal;
           this.newVal = 0;
           oldVal = this.field.getValue();
           if (this.store.getCount()>0) {
	           this.store.each(this.fn,this);
	           if (String(oldVal)!=String(this.newVal)) {
	                this.field.setValue(this.newVal);
	                this.field.fireEvent('change',this.field,this.newVal,oldVal);
	           }
           }
    }
    
}
Fresh.plugin.PasswordEncode = function() {}
Fresh.plugin.PasswordEncode.prototype = {
    init: function(form) {

        this.passwFields = form.findBy(function(f,c){
            var name = f.initialConfig.name || f.initialConfig.hiddenName;
            var re = /Password/i;
            var res = re.test(name);
            return res;
        });
      
        if (typeof Ext.ux.Crypto.SHA1.hash == 'function' && this.passwFields.length>0) {
            form.on('beforeaction',this.onBeforeAction,this);
            form.on('actioncomplete',this.onAfterAction,this);
            form.on('actionfailed',this.onAfterAction,this);
        }
        
    },
    
    onBeforeAction: function(bf,action) {
        var val;
        if (action.type == 'submit') {
	        for(var i=0; i<this.passwFields.length;i++) {
	            if (val = this.passwFields[i].getValue()) {
	                this.passwFields[i].setRawValue(Ext.ux.Crypto.SHA1.hash(val));
	                this.passwFields[i].origNoSha = val;
	            }
	        }
        }
        return true;
    },
    
    onAfterAction: function(bf,action) {
        var value;
        if (action.type == 'submit') {
	        for(var i=0; i<this.passwFields.length;i++) {
	              this.passwFields[i].setRawValue('');
	              this.passwFields[i].origNoSha = '';
                  
	        }
            bf.setValues(bf.getValues());
        }
        return true;
    }
}
/**
 * Helper class for GroupingStore
 * @class
 */
Fresh.data.GroupingViewProvider = function(config) {
   var viewName = config.id.replace(/-store/,'-view');
   Ext.applyIf(config,{
     url: Fresh.Config.Service.View,
     root: 'rows',
     baseParams: {view: viewName},
     remoteSort: false,
     reader: new Ext.data.JsonReader(),
     autoLoad: {params: {meta: true}}
   });

   this.onMetaChange = this.onMetaChange.createSequence(function(m){this.meta = m;}, this);

   Fresh.data.GroupingViewProvider.superclass.constructor.call(this,config);
   
   this.on('loadexception',this.onLoadexception,this);
}

Ext.extend(Fresh.data.GroupingViewProvider,Ext.data.GroupingStore,{

   onLoadexception: function(proxy,options,response,e) {
        var result = Ext.decode(response.responseText);
/*
        if (!result.success && result.error == Fresh.Error.NotAuthorized)
                Fresh.Relogin.Init(this.reload.createDelegate(this));
        else
*/
		Fresh.console.log(response);
		Fresh.console.log(e);
		if (result)
              Ext.MessageBox.alert('Error',result.message || result);
		else
			  Ext.MessageBox.alert('Error',e);
   }
   
});



/**
 * Helper class for JsonStore
 * @class
 */
Fresh.data.ViewProvider = function(config) {
   var viewName = config.id.replace(/-store/,'-view');
   Ext.applyIf(config,{
     url: Fresh.Config.Service.View,
     root: 'rows',
     baseParams: {view: viewName},
     remoteSort: false,
     autoLoad: {params: {meta: true}}
   });
   this.onMetaChange = this.onMetaChange.createSequence(function(m){this.meta = m;}, this);

  Fresh.data.ViewProvider.superclass.constructor.call(this,config);
   this.on('loadexception',this.onLoadexception,this);
}
Ext.extend(Fresh.data.ViewProvider,Ext.data.JsonStore,{

   onLoadexception: function(proxy,options,response,e) {
        var result = Ext.decode(response.responseText);
/*
        if (!result.success && result.error == Fresh.Error.NotAuthorized)
                Fresh.Relogin.Init(this.reload.createDelegate(this));
        else

*/
		Fresh.console.log(options);
                Fresh.console.log(response);
		
		if(result.success && response.statusText == 'OK'){
			
		}			
		else{
			Fresh.console.error('Error exception '+result.message || e.message || '');
			Ext.MessageBox.alert('Error exception ',result.message || e.message || '');
		}
   }


});

/**
 *  Container for custom messages on screen
 *  @class 
 *  @singleton
 */
Fresh.Msg = function(config) {
    
        var msgCt;
        var createBox = function(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
        };
        
        
        var slideMsg  = function(title, format, id, type){
            var attach = Ext.get(id) || document;
            var ins = Ext.get(id) || document.body;
            type = type || 'c-c';
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
//            msgCt.alignTo(document, 'br-br',[0,-70]);
            msgCt.alignTo(document, 'tr-tr');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:createBox(title, s)}, true);
            m.slideIn().pause(1).slideOut("t", {duration: 1,remove:true});
        };

        return {
            SlideBox : slideMsg
        }

}();

Fresh.form.numberSpinner = function(config) {
    config = config || {};
    if (config.strategyConfig && !config.strategy)
        config.strategy = new Ext.ux.form.Spinner.NumberStrategy(config.strategyConfig);
    Fresh.form.numberSpinner.superclass.constructor.call(this,config);
}
Ext.extend(Fresh.form.numberSpinner,Ext.ux.form.Spinner);

Ext.reg('numberspinner',Fresh.form.numberSpinner);


        /**
         * Parse a value into a formatted date using the specified format pattern.
         * @param {Mixed} value The value to format
         * @param {String} format (optional) Any valid date format string (defaults to 'm/d/Y')
         * @return {String} The formatted date string
         */
Fresh.util.convertDate = function(v, rec){
            if(!v || v == '0000-00-00'){
                return null;
            }
            v = new Date(Date.parseDate(v,'Y-m-d'));
            if(!Ext.isDate(v)){
                v = new Date(Date.parseDate(v,'U'));
            }
            return v;
        }
Fresh.util.dateU = function(v, format){
            if(!v || v == '0000-00-00'){
                return "";
            }
            if(!Ext.isDate(v)){
                v = new Date(Date.parseDate(v,'U'));
            }
            return v.dateFormat(format || "d.m.Y");
        }

        /**
         * Returns a date rendering function that can be reused to apply a date format multiple times efficiently
         * @param {String} format Any valid date format string
         * @return {Function} The date formatting function
         */
Fresh.util.dateRendererU = function(format){
            return function(v){
                return Fresh.util.dateU(v, format);
            };
        }

Fresh.util.intervalRenderer = function(ts) {
    var hr = Math.floor(ts/3600);
    var min = Math.floor(ts/60)-60*hr;
    var sec = Math.floor(ts)-3600*hr - 60*min;
    return ((hr<10)?'0':'')+hr + ((min<9)?':0':':') + min + ((sec<9)?':0':':') + sec + '  ';
}

Ext.menu.Item.superclass.onRender = function(container, position){
        Ext.menu.BaseItem.superclass.onRender.apply(this, arguments);
        if(this.ownerCt && this.ownerCt instanceof Ext.menu.Menu){
            this.parentMenu = this.ownerCt;
        }else{
            this.container.addClass('x-menu-list-item');
            this.mon(this.el, {
                scope: this,
                click: this.onClick,
                mouseenter: this.activate,
                mouseleave: this.deactivate
            });
        }
    }

Ext.override(Ext.grid.ColumnModel,{
   setHidden : function(colIndex, hidden){
        if (colIndex > -1) {
            var c = this.config[colIndex];
            if(c.hidden !== hidden){
                c.hidden = hidden;
                this.totalWidth = null;
                this.fireEvent("hiddenchange", this, colIndex, hidden);
            }
        }
    }
});

function array_intersect () {
    // Returns the entries of arr1 that have values which are present in all the other arguments
    //
    // version: 1004.2314
    // discuss at: http://phpjs.org/functions/array_intersect
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: These only output associative arrays (would need to be
    // %        note 1: all numeric and counting from zero to be numeric)
    // *     example 1: $array1 = {'a' : 'green', 0:'red', 1: 'blue'};
    // *     example 1: $array2 = {'b' : 'green', 0:'yellow', 1:'red'};
    // *     example 1: $array3 = ['green', 'red'];
    // *     example 1: $result = array_intersect($array1, $array2, $array3);
    // *     returns 1: {0: 'red', a: 'green'}
    var arr1 = arguments[0], retArr = [];
    var k1 = '', arr = {}, i = 0, k = '';

    arr1keys:
    for (k1 in arr1) {
        arrs:
        for (i=1; i < arguments.length; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    if (i === arguments.length-1) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value, continue the loop until done
                    continue arrs;
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys;
        }
    }

    return retArr;
}

Ext.ns('Fresh.form');

Fresh.form.KNTfield = Ext.extend(Ext.form.CompositeField,{
   
   //fieldWidth: 100,
   //firstWidth: 200,

   initComponent: function () {
        var sn;
       this.fieldConfig = this.fieldConfig || {};

       this.hideLabel = true;
       this.fieldName = this.fieldName || this.fieldConfig.name;
       this.labelPrefix = this.labelPrefix || 'f';
       this.labelMidfix = this.labelMidfix || 'descr';

       sn = this.fieldName.split("_",2).pop();

       this.firstLabel = this.firstLabel || this.labelPrefix+'.'+sn;
       this.secondLabel = this.secondLabel || this.labelPrefix+'.'+this.labelMidfix+'.'+sn;
       
       this.items = [
           {
               xtype: 'displayfield',
               value: __(this.firstLabel),
               hideLabel: true,
               autoHeight: true,
               width: this.firstWidth || 150
                },
           {
               xtype: 'displayfield',
               value: __(this.secondLabel),
               hideLabel: true,
               autoHeight: true,
               flex: 1
           },
           {
               xtype: this.xxtype || 'numberfield',
               hideLabel: true,
               name: this.fieldName

           }

       ];
       
       Ext.applyIf(this.fieldConfig,{
           allowBlank: true,
           width: this.fieldWidth || 100,
           decimalSeparator: ','
       });

       Ext.applyIf(this.items[2], this.fieldConfig || {});

/*               listeners: {
       listeners: {
                render: {
                    fn: function(c) {
               //   if (!c.secondLabel) return;
                  Ext.QuickTips.register({
                    target: c.getEl(),
                    width: 150,
                    dismissDelay: 3000,
                    cls: 'knt-tooltip',
                    text: this.secondLabel
                  });
                },
                scope: this
               }}
        */
       Fresh.form.KNTfield.superclass.initComponent.apply(this);
   }

});

Ext.reg('kntfield',Fresh.form.KNTfield);

Fresh.form.KNTfieldYesNo = Ext.extend(Fresh.form.KNTfield,{
   xxtype: 'ccombo',

   initComponent: function () {
       this.fieldConfig = this.fieldConfig || {};
       this.fieldConfig.store = this.fieldConfig.store || 'yes-no-store';

       Fresh.form.KNTfieldYesNo.superclass.initComponent.apply(this);
   }

});

Ext.reg('kntfieldyesno',Fresh.form.KNTfieldYesNo);

Fresh.form.KNTfieldCombo = Ext.extend(Fresh.form.KNTfield,{
   xxtype: 'ccombo',

   initComponent: function () {
       var sn;
       sn = this.fieldName.split("_",2).pop();

       this.fieldConfig = this.fieldConfig || {};
       
        Ext.applyIf(this.fieldConfig,{
           store: Fresh.global[sn+'DefStore'],
           width: this.fieldWidth || 200
       });

       Fresh.form.KNTfieldCombo.superclass.initComponent.apply(this);
   }

});

Ext.reg('kntfieldcombo',Fresh.form.KNTfieldCombo);

Fresh.form.KNTfieldSlider = Ext.extend(Fresh.form.KNTfield,{
   xxtype: 'sliderfield',
   
   initComponent: function () {
       this.fieldConfig = this.fieldConfig || {};

        Ext.applyIf(this.fieldConfig,{
           minValue: 1,
           maxValue: 10,
           increment: 1,
           width: 200,
           ctCls: 'x-slider-ticks'
       });

       Fresh.form.KNTfieldSlider.superclass.initComponent.apply(this);
   }

});

Fresh.form.KNTfieldDecimalCombo = Ext.extend(Fresh.form.KNTfield,{
   xxtype: 'ccombo',

   initComponent: function () {
       //var sn;
       //sn = this.fieldName.split("_",2).pop();

       this.fieldConfig = this.fieldConfig || {};

        Ext.applyIf(this.fieldConfig,{
           store: Fresh.global['CiselnaStupnice1az10DefStore'],
           valueField: 'Name',
           width: 100
       });

       Fresh.form.KNTfieldDecimalCombo.superclass.initComponent.apply(this);
   }

});

//Ext.reg('kntfieldslider',Fresh.form.KNTfieldDecimalCombo);
Ext.reg('kntfieldslider',Fresh.form.KNTfieldSlider);
/*
Ext.slider.MultiSlider.prototype.normalizeValueOrig = Ext.slider.MultiSlider.prototype.normalizeValue;
Ext.slider.MultiSlider.prototype.normalizeValue = function(v) {
    var vf;

    vf = parseFloat(v);
    vf = (vf == NaN)? 0 : vf;
    this.normalizeValueOrig(vf);
}

Ext.slider.MultiSlider.prototype.doSnapOrig = Ext.slider.MultiSlider.prototype.doSnap;
Ext.slider.MultiSlider.prototype.doSnap = function(v) {
    var vf;

    vf = parseFloat(v);
    vf = (vf == NaN)? 0 : vf;

    this.doSnapOrig(vf);
}
*/


Ext.ux.Plugin.DragDropTextField = function(config) {
    Ext.apply(this, config);
    Ext.ux.Plugin.DragDropTextField.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.Plugin.DragDropTextField,Ext.util.Observable,{
    init: function(c) {
        c.onRender = c.onRender.createSequence(this.onRender,c);
    },
    onRender: function(ct,position) {
          var c = this;
          var dtEl = c.el.dom;
          c.el.addClass('x-target-droppable');
          c.dtField = new Ext.dd.DropTarget(dtEl, {
                          ddGroup: c.ddGroup || 'TreeDD',
                          notifyEnter: function(ddSource, e, data) { c.el.highlight(); },
                          notifyDrop: function(ddSource, e, data) {
                            var node = data.node;
                            var path = data.node.getOwnerTree().getPath(data.node);
                            var rec;
                            if (node && path != 'root') {
                              c.setValue(path.replace('root/',''));
                            }
                            return(true);
                          }
                        });
    }

});


Fresh.form.DropTextField = Ext.extend(Ext.form.TextField,{
    plugins: [ new Ext.ux.Plugin.DragDropTextField() ]
});

Ext.reg('droptextfield',Fresh.form.DropTextField);

Fresh.getQueryVar = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return unescape(pair[1]);
            }
        }
    }