/**
 * @author Vaidas Zilionis
 */
Array.prototype.inArray = function ( obj ) {
    var len = this.length;
    for ( var x = 0 ; x <= len ; x++ ) {
        if ( this[x] == obj ) return true;
    }
    return false;
}

Array.prototype.removeValue = function (val) {
    var len = this.length;
    for ( var x = 0 ; x <= len ; x++ ) {
        if ( this[x] == val ) {
            this.splice(x,1);
            break;
        }
    }
    return false;
}


Ext.namespace('Ext.ux');
Ext.ux.TextBoxList = Ext.extend(Ext.form.ComboBox, {
    /**
     * List of selected Values
     */
    aListValues : []
	,hideTrigger:true
	,triggerAction:'all'
	,typeAhead: true
    ,mode: 'local'
	,dirtyList: false
    //,fieldClass: ''
    /**
     * InitComponent
     */
    ,initComponent:function() {
        Ext.ux.TextBoxList.superclass.initComponent.call(this);
		this.wrapedLiInput = Ext.id();
    }
	,getInitValues: function(aValues, myobj) {
		 var aRez = [];
		 var r;
		 if (null === aValues)
		 	return [];
		 for (i = 0; i < aValues.length; i++) {
		 	if (r = this.findRecord(this.valueField, aValues[i])) {
		 		aRez[aRez.length] = { id: aValues[i], title: r.data[this.displayField] };
		 	}
		 }
	     return aRez;
		 
    }
    ,initValue : function(){
         if (this.value) {
		 	 //alert(this.wrapedLiInput)
             aValuesToAdd = this.getInitValues(this.value, this)
         }

    }
    ,getListValues: function() {
        return this.aListValues;
    }
    ,_removeListValue: function(e,obj) {
        oLi = Ext.get(Ext.get(obj.id).dom.parentNode.id);
        this.aListValues.removeValue(oLi.dom.lastChild.value)
        oLi.remove();
		this.dirtyList = true;
    }
    ,_addInitValues: function(data) {
        for (i=0; i<data.length; i++) {
            if (!this.aListValues.inArray(data[i].id)) {
                this.aListValues[this.aListValues.length] = data[i].id;
                this._addListValueElement(data[i].title, data[i].id)
            }
            
        }
    }
	//,wrapedLiInput : Ext.id()
    ,_addListValueElement: function(title,value) {
        cfg = {'tag': 'li', 'class':'x-form-textbox-ul-li'}
        aId = Ext.id();
        sHtml = '<span>'+ title + '</span><a class="x-form-textbox-ul-li-closebutton" href="#" id="'+aId+'"></a>';
        sHtml += '<input type="hidden" name="'+this.TextBoxListName+'" value="'+value+'">';
        obj = Ext.get(this.wrapedLiInput)
		obj.insertSibling(cfg).insertHtml('afterBegin', sHtml);
		Ext.get(aId).on('click', this._removeListValue, this);
    }

	,_clearListValues: function() {
		var obj,ul,lis;
		obj = Ext.get(this.wrapedLiInput);
		if (obj && (ul = obj.parent('ul').select('li:has(span)')) ) {
			ul.remove();
		}
		this.aListValues = [];
		this.dirtyList = false;
	}
	

	,setValue : function(v){
		this._clearListValues();
        this._addInitValues(this.getInitValues(v));
		Ext.ux.TextBoxList.superclass.setValue.call(this, v);
        this.clearValue();
	}

   /**
     * Returns the raw data value which may or may not be a valid, defined value.  To return a normalized value see {@link #getValue}.
     * @return {Mixed} value The field value
*/     
    ,getRawValue : function(){
        var v = (!this.rendered) ? this.el.getValue() : Ext.value(this.aListValues, '');
        if(v === this.emptyText){
            v = '';
        }
        return v;
    }

    /**
     * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
     * @return {Mixed} value The field value
     */
    ,getValue : function(){
        if(!this.rendered) {
            return this.value;
        }
        
        return this.aListValues;
    }
	
	/*
,validateValue: function(value){
		if (value.length < 1 || value === this.emptyText) { // if it's blank
			if (this.allowBlank) {
				this.clearInvalid();
				return true;
			}
			else {
				this.markInvalid(this.blankText);
				return false;
			}
		}
	}
*/
    ,addListValue:function(record) {
        selectedValue = record.get(this.valueField);
        if (!this.aListValues.inArray(selectedValue)) {
            this.aListValues[this.aListValues.length] = selectedValue;
            this._addListValueElement(record.data[this.displayField], selectedValue);
			this.dirtyList = true;
        }
    }
	,isDirty: function() {
		return this.dirtyList;
	}
    ,onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            //this.setValue(record.data[this.valueField || this.displayField]);
            Ext.ux.TextBoxList.superclass.setValue.call(this,record.data[this.valueField || this.displayField]);
			this.collapse();
            this.fireEvent('select', this, record, index);
            this.addListValue(record)
            this.clearValue();
        }
    }    
    ,onRender : function(ct, position){
        Ext.form.TriggerField.superclass.onRender.call(this, ct, position);
        /**
         * TextBoxList wrap
         */
        this.el.wrap({tag:'ul', 'class':'x-form-textbox-ul'});
        //this.wrapedLiInput = Ext.id();
        this.TextBoxListName = this.name + '[]'
        this.el.wrap({tag:'li', 'class':'x-form-textbox-ul-newitem', 'id':this.wrapedLiInput})
        /**
         * copy trigger+combo onready
         */
        this.wrap = this.el.wrap({cls: "x-form-field-wrap"});
        this.trigger = this.wrap.createChild(this.triggerConfig ||
                {tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.triggerClass});
        if(this.hideTrigger){
            this.trigger.setDisplayed(false);
        }
        this.initTrigger();
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
        /*
        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName, id: (this.hiddenId||this.hiddenName)},
                    'before', true);
            this.hiddenField.value =
                this.hiddenValue !== undefined ? this.hiddenValue :
                this.value !== undefined ? this.value : '';

            // prevent input submission
            this.el.dom.removeAttribute('name');
        }
        */
       this.el.dom.removeAttribute('name');
        if(Ext.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }

        if(!this.lazyInit){
            this.initList();
        }else{
            this.on('focus', this.initList, this, {single: true});
        }

        if(!this.editable){
            this.editable = true;
            this.setEditable(false);
        }
    }
})
Ext.reg('textboxlist', Ext.ux.TextBoxList);