Ext.namespace('Ext.ux');

Ext.ux.MultiField = function(config) {
    var defaults = {
	initialInstances: 1,
	maxInstances: 0,
	initialValues: [],
	iconCls: 'x-multifield',
	defaultType: 'textfield',
	autoHeight: true,
	autoScroll: true,
	maxInstancesText: 'You may not add any more instances.',
	buttonText: 'Click to add another instance.'
    };
    Ext.applyIf(config, defaults);
    config.tools = [{
	    id: 'plus',
	    qtip: config.buttonText,
	    handler: this.addInstance,
	    scope: this
	},{
	    id: 'close',
	    qtip: config.maxInstancesText,
	    hidden: true,
	}
	];
    Ext.apply(this, config);
    this.instances = 0;
    Ext.ux.MultiField.superclass.constructor.call(this);

    if (this.ownerCt) {
	this.form = (this.formID)?Ext.getCmp(this.formID):this.ownerCt.getForm();
    } else {
	    this.form = Ext.getCmp(this.formID);
    }
    if (this.form) {
	this.defaultType = this.form.defaultType;
    }
    var i = 0;
    for (i = 0; i < this.initialValues.length; i++) {
	this.addInstance(this.initialValues[i]);
    }
    if (i < this.initialInstances) {
	for (var j = i; j < this.initialInstances; j++) {
	    this.addInstance({});
	}
    }
}

Ext.extend(Ext.ux.MultiField, Ext.form.FieldSet, {
	initComponent: function(config){
	    Ext.ux.MultiField.superclass.initComponent.call(this);
	},
	    removeInstance: function(evt, toolEl, instance) {
	    instance.destroy();
	    if (this.maxInstances > 0) {
	    this.maxInstances++; //Hacky, but I'm too lazy to rename all of the other instances.
	    }
	    if (this.maxInstances > 0 && this.instances <= this.maxInstances && this.addButton) { 
		    this.tools['close'].hide();
		    this.tools['plus'].show();
	    }

	},
	addInstance: function(values, btn, panel) {
	    
	    var defs = this.clone(this.fieldDefs);
	    for (var i = 0; i < defs.length; i++) {
		if (defs[i].name && values[this.fieldDefs[i].name]) {
		    defs[i].name = this.name+'['+this.instances+']['+this.fieldDefs[i].name+']';
		    defs[i].xtype = (this.fieldDefs[i].xtype)?this.fieldDefs[i].xtype:this.defaultType;
		    defs[i].value = values[this.fieldDefs[i].name];
		} else if (defs[i].name) {
		    defs[i].xtype = (this.fieldDefs[i].xtype)?this.fieldDefs[i].xtype:this.defaultType;
		    defs[i].name = this.name+'['+this.instances+']['+this.fieldDefs[i].name+']';
		}
	    }
	    var fsDefs = this.clone(this.instanceDefs);
	    fsDefs.items = defs;
	    fsDefs.tools = [ {
			    id: 'minus',
			    qtip: 'Click to Remove',
			    handler: this.removeInstance,
			    scope: this
		}
			    ];
	    var panel = new Ext.form.FieldSet(fsDefs);
	    panel.on('collapse', this.removeInstance, this);
	    this.add(panel);
	    panel.show();

	      if (this.ownerCt) {
	    this.ownerCt.doLayout();
	    } else {
	    this.doLayout();
	    }
	    this.instances++;
	    if (this.maxInstances > 0 && this.instances >= this.maxInstances) {
		    this.tools['plus'].hide();
		    this.tools['close'].show();
	    }
	},
	    clone: function(o) {
	    if(!o || 'object' !== typeof o) {
		return o;
	    }
	    var c = 'function' === typeof o.pop ? [] : {};
	    var p, v;
	    for(p in o) {
		if(o.hasOwnProperty(p)) {
		    v = o[p];
		    if(v && 'object' === typeof v) {
			c[p] = this.clone(v);
		    }
		    else {
			c[p] = v;
		    }
		}
	    }
	    return c;


	}


});




Ext.reg('multifield', Ext.ux.MultiField);

Ext.form.MultiField = Ext.ux.MultiField;

