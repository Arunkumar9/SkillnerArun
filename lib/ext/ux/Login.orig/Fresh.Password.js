/**
 * @author rosa
 */
Ext.ns('Fresh','Fresh.form','Fresh.plugin');
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