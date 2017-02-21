/**
 * 
 */
 
Ext.ux.Plugin.PropertyEditor = function(config) {
    Ext.applyIf(this,config);
}
Ext.ux.Plugin.PropertyEditor.prototype = {
    init: function(tree) {
        var pgr;
        
        this.tree = tree;
		this.tree.propertyEditor = this;
        this.propertyGrid = this.propertyGrid || this.tree.id+'-property-grid';
        this.tree.propertyEditor = this;
		if (pgr = Ext.getCmp(this.propertyGrid))
			this.propertyGrid = pgr;
			
        if (typeof this.propertyGrid == 'string') {
            Ext.ComponentMgr.onAvailable(this.propertyGrid, function(gr){
                this.propertyGrid = gr;
				this.initEvents();
            }, this)
        } else {
			this.initEvents();
        }
    },


	initEvents: function() {
        this.propertyGrid.on('propertychange', this.onPropertyChange, this);
        this.tree.on('click',this.onNodeClick,this);
		this.tree.createNewNode = this.createNewNode.createDelegate(this);
	},
	
	initActions: function() {
		var a = new Ext.Action({
                text: __('New folder'),
                iconCls: 'icon-folder-new',
                handler: this.onCreateNewFolder,
                disabled: false
            });
	},
	
	createNewNode: function(node,type) {

	//	if(false === this.fireEvent('beforenewdir', this, node)) {
		//	return;
		//}
        type = type || 'leaf';
		Fresh.console.log('propertyEditor createNewNode');
		var newNode,baseAttrs,isFolder,p,appendNode;

		// get node to append new directory to
		if (node.isLeaf()) {
			appendNode = node.parentNode;
			node = node.nextSibling;
		} else {
			if ('leaf'===type) {
				appendNode = node;		
				node = null;
			} else {
				appendNode = node
				node = node.firstChild;
			}
		}
		

        baseAttrs = {};
        for( p in this.tree.newNodeDefaults[type]) { 
            baseAttrs[p] = this.tree.newNodeDefaults[type][p];
        }
        //isFolder = (baseAttrs.leaf)? 0 : 1;

        // create new folder after the appendNode is expanded
		appendNode.expand(null, false, function(n) {
            
			// create new node
			var newNode = n.insertBefore(new Ext.tree.AsyncTreeNode(baseAttrs),node);
			newNode.select();
			newNode.attributes.isNew = true;
			//if (!node)
			this.tree.fireEvent('insert',this.tree,n,newNode,node);
			this.onNodeClick(newNode,false,true);
		// expand callback needs to run in this context
		}.createDelegate(this));

	},
	
    onNodeClick : function(node,e,noRld)
    {
		if (e)
			e.stopEvent();
		if (node.isLeaf() || node.isLoaded() || noRld) {
			var o = this.getNodeRecord(node);
			this.propertyGrid.setSource(o);
			this.propertyGrid.enable();
		}
		else {
			node.reload(this.onNodeClick.createDelegate(this,[node,e]));
		}
//        this.propertyGrid.setTitle(node.text);
    },

    getNodeRecord: function (node)    
    {
		var rec,store;

		this.currentNode = node;

		this.contentStore =  Ext.StoreMgr.lookup('content-type-store');
		this.contentStore.clearFilter();
                this.contentStore.contentType = node.attributes.t;
                //Fresh.console.log(this.contentStore.contentType);
		this.contentStore.filter('t',this.contentStore.contentType);
		
		rec = {
			name: node.text,
			type: node.attributes.typeId
		}
		
		if (!node.isLeaf() && !(node.childNodes && node.childNodes.length > 0))
				rec.template = '';//__('choose template...');

		return rec;
    },
    
    setNodeRecord: function (node,data)    
    {
		var tobj,trec,startVal = node.text,types = Ext.StoreMgr.lookup('content-type-store') || new Ext.data.SimpleStore();
		var iconEl = node.getUI().getIconEl();
		//if (node.parentNode)
		node.beginUpdate();
			this.tree.suspendEvents();
			node.setText(data.name);
			this.tree.resumeEvents();
			node.attributes.typeId = data.type;
			if (data.template && data.template != node.attributes)
				node.attributes.templateId = data.template;
			Ext.fly(iconEl).removeClass(node.attributes.iconCls);
			trec = types.getById(node.attributes.typeId);
			if (trec && ((tobj = trec.get('dataObject')) || (tobj = trec.get('data')))) {
				node.attributes.iconCls = tobj.iconCls || node.attributes.iconCls;
				Ext.fly(iconEl).addClass(node.attributes.iconCls);
			}
			this.tree.fireEvent('textchange',node,node.text,startVal,
					function(options,data,result){
			           if (data.tid)
					   		node.reload();
	           		});
		node.endUpdate();
    },

    onPropertyChange : function(o,id,val,oldVal) {
		Fresh.console.log(o);
		//o.type.replace(/content-|container-/,'');
		this.setNodeRecord(this.currentNode,o);
		//if ('type' == id && 'function' == typeof this.currentNode.reload)
		//	this.currentNode.reload();
		//else
		//	if ('type' == id && this.currentNode.parentNode && 'function' == typeof this.currentNode.parentNode.reload)
		//		this.currentNode.parentNode.reload();
    }
    
}
/*
Ext.override(Ext.grid.PropertyColumnModel,{
    // private
    renderCell : function(val, meta, record, rowIndex, i){
        var rv = val, renderer;
		var p = this.store.getProperty(rowIndex);
        var n = p.data['name'];     	
        if (this.grid.customRenderers && (renderer = this.grid.customRenderers[n]) && 'function' == typeof renderer) {
        	rv = renderer.call(this,val, meta, record, rowIndex, i);
        }else if(Ext.isDate(val)){
            rv = this.renderDate(val);
        }else if(typeof val == 'boolean'){
            rv = this.renderBool(val);
        }
        return Ext.util.Format.htmlEncode(rv);
    }
});


*/

Fresh.data.TreeBasedStore = function(config) {
		var that;
		
		config.reader = new Ext.data.ArrayReader({
				fields: [ {name: 'id', mapping: 'id'}, {name: 'text', mapping: 'text'} ]
				});
		config.proxy = new Ext.data.MemoryProxy();
		Fresh.data.TreeBasedStore.superclass.constructor.call(this,config);
		

		if ('string' === typeof this.tree) {
			if (!(tree = Ext.getCmp(this.tree))) {
				Ext.ComponentMgr.onAvailable(this.tree, function(tree){
					this.tree = tree;
					this.findTNode(); 
				},this);
			}
			else {
				this.tree = tree;
				this.findTNode();
			}
		}  
}
	
Ext.extend(Fresh.data.TreeBasedStore,Ext.data.Store,{	
	findTNode: function(n) {
		var that = this;
		if (!(this.tnode = this.tree.root.findChild('typeId',this.nodeId)) && !this.tnode) {
			this.tree.on('load',this.findTNode,this);	
			this.tnode = this.nodeId;		
		}
		if (this.tnode === n  || (typeof this.tnode == 'object' && !n) || (n && this.tnode === n.parentNode)) {
			if (!this.tnode.isLoaded()) 
				this.tnode.reload();
			this.proxy.data = this.tnode.childNodes;
			this.reload(); 					
		}
	}
});

Ext.onReady(function(){
	Fresh.global.actions.newNode.setText( __('New content'));
});

/* 
 * function(n){
				that.findTNode();
//				if (n == that.tree.root) {
//					that.tnode = that.tree.root.findChild('id', that.nodeId);
//				} 
 */