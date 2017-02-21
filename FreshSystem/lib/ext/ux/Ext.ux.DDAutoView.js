/**
 * @author rosa
 */

Ext.namespace('Ext.ux');

Ext.ux.DDAutoView = function(config) {
    Ext.ux.DDView.superclass.constructor.call(this, config); 
};

Ext.extend(Ext.ux.DDAutoView, Ext.ux.DDView, { 

    initComponent: function(){
    
        if (!this.store) 
            this.store = this.getId().replace(/-view(.*)$/, '-store');

        if (!this.cxId)
            this.cxId = this.getId();

        Ext.ux.DDAutoView.superclass.initComponent.call(this);
        
        if ('string' === typeof this.store)
            this.store = Ext.StoreMgr.lookup(this.store);
        // Create a empty colModel if none given
        if (!this.tpl) {
            this.tpl = new Ext.XTemplate('<tpl for=".">', '</tpl>');
        }
        
        // register to the store's metachange event
        if (this.store) {
            Fresh.console.log("register meta");
            this.store.on("metachange", this.onMetaChange, this);
            //            this.store.on("update",this.onUpdate,this);
            //            if (!this.store.pruneModifiedRecords)
            //                this.store.on("load",this.onLoad,this);
            if (!this.noStorePreload ) {
                this.store.load({
                    params: {
                        meta: true
                    }
                });
            }
        }
            
		this.addEvents({
			'change' : true
		});		
    }  
    ,afterRender: function() {
        Ext.ux.DDAutoView.superclass.afterRender.apply(this,arguments);
        //this.hiddenName = this.name;
		var hiddenTag={tag: "input", type: "hidden", value: "", name:this.hiddenName};
		if (true || this.isFormField) { 
			this.hiddenField = this.el.insertSibling(hiddenTag);
            Fresh.console.log(this.el);
//			this.hiddenField = Ext.DomHelper.append(this.el,hiddenTag,true);
		} else {
			this.hiddenField = Ext.get(document.body).createChild(hiddenTag);
		}    
		
		/**
		 * Initially loading the lesson quiz management window meta change event is fired for the files-view stores
		 * if we open the window for second time metachange event is not fired. so here if meta is available for the store
		 * copying the context.tpl to the this object which is actually happening in onMetaChange function.
		 * if metachange is called then this vlaues will be overriden by the value given by the onMetaChange anyways
		 */
		if( this.store.meta  ){
			
			var context,meta=this.store.meta;
			  if (Ext.type(meta.context) == 'object') {
		            context = context[this.cxId] || meta.context.base || meta;
		        }
		        else {
		            context = meta;
		        }
		            
		        if (tpl = context.tpl) {
		            this.tpl = new Ext.XTemplate(tpl);
		        }

		        if (isel = context.itemSelector)
		           this.itemSelector = isel;
		}
    }
    ,isValid: function() {
        return true;
    }
    ,onMetaChange : function(store, meta) {
        var context, isel, tpl, i, len;
//        Fresh.console.log("onMetaChange", meta.fields);
        if (Ext.type(meta.context) == 'object') {
            context = meta.context[this.cxId] || meta.context.base || meta;
        }
        else {
            context = meta;
        }
            
        if (tpl = context.tpl) {
            this.tpl = new Ext.XTemplate(tpl);
        }

        if (isel = context.itemSelector)
           this.itemSelector = isel;

        if ('undefined' !== typeof context.multiSelect)
           this.multiSelect = context.multiSelect;

        this.refresh();
         
        this.store.meta = meta;    
    }

    ,remove: function(selectedIndices){
        Ext.ux.DDAutoView.superclass.remove.call(this,selectedIndices);
        this.onChange();
    }
    ,onNodeDrop : function(n, dd, e, data) {
        var res = Ext.ux.DDAutoView.superclass.onNodeDrop.call(this,n, dd, e, data);
        // if onNodeDrop returns true then call onChange. parent onNode will return true when drop is correct. returns false when user drops existing value
        if( res ){
        	
        	this.onChange();
        }
        return res;
    }

    ,onChange: function() {
        this.refresh();
        this.isDirtyFlag = true;
		this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
		this.hiddenField.dom.value = this.getValue();
        //Fresh.console.log(this.hiddenField);
    }
    
    ,convertData : function(o) {
		     if('object' !== typeof o) {
		        return o;
		    }
		    var c = 'function' === typeof o.pop ? [] : {};
		    var p, v;
		    for(p in o) {
		        if(o.hasOwnProperty(p)) {
		            v = o[p];
		            if(Ext.isDate(v)) {
		                c[p] = Ext.util.Format.date(v,'U');
		            }
		            else {
		                c[p] = v;
		            }
		        }
		    }
		    return c;
    }
    
    /**    
     * Loads the View from a JSON string representing the Records to put into the Store. 
     * @param {Object} v
     */
    ,setValue: function(v) { 
        if (!this.store) { 
            throw "DDView.setValue(). DDView must be constructed with a valid Store"; 
        } 
        var data = {}; 
        data[this.store.reader.meta.root] = v ? Ext.decode(v) : []; 
        this.store.proxy = new Ext.data.MemoryProxy(data); 
        this.store.load(); 
        this.hiddenField.dom.value = this.getValue();        
    }
    /**    
     *    @return {Object} data from store  
     */
    ,getValue: function() { 
        var recs = this.store.getRange();
        var data = [];
        for (var i = 0; i < recs.length; i++) {
            data.push(this.convertData(recs[i].data));
        }
        return Ext.encode(data);
    },
 
    destroy : function() {
        this.store.un("metachange", this.onMetaChange, this);
        Ext.ux.DDAutoView.superclass.destroy.call(this);
        this.hiddenField.removeAllListeners(); 
        this.hiddenField.remove(); 
    },
    /**
     * this method will be called from the form when user clicks yes on confirm popup to reset the dirty flag of the view
     */
    reset :function(){
    	this.isDirtyFlag = false;
    	// reload the store so that the new records add will be removed
    	this.store.reload();
    }
/*
     //,saveData: Ext.ux.Autogrid.saveData
    ,isValidDropPoint: function(pt, n, data) { 

        if (this.store.find('uid',data.uid))
            return false;
            
        return Ext.ux.DDAutoView.superclass.isValidDropPoint.call(this,pt, n, data);
           
    }
    ,setDataRecords: function(data) {
//      Dragging from a Tree. Use the Tree's recordFromNode function. 
        if (data.node instanceof Ext.tree.TreeNode && !data.records) { 
            var r = data.node.getOwnerTree().recordFromNode(data.node,this.store); 
            if (r) { 
                data.records = [ r ]; 
            } 
        } 
    }
    ,removeDuplicates: function(data) {
        
    }
    ,onNodeDrop: function(n, dd, e, data){

        if (this.store.find('uid',data.uid))
            return false;
        
        return Ext.ux.DDAutoView.superclass.onNodeDrop.call(this,n, dd, e, data);

    }

*/
});

Ext.reg('ddautoview', Ext.ux.DDAutoView);

Ext.tree.TreePanel.prototype.recordFromNode = function(node,store)
{
        var result =  new store.recordType(node.attributes.record,node.attributes.record.uid);
        result.set('text',node.text);
	return result;
}