/**
 * 
 * var combo_menus = {
	xtype		: "treecombo",
	width		: 150,
	msgTarget	: "under",
	loader: tree_menus,
	onlyLeaf: false,
	fieldLabel	: "Menu",
	labelSeparator	: ":",
	emptyText	: "Informe o menu",
	loadingText	: "Carregando...",
	listWidth	: 250,
	listHeight	: 300,
	triggerAction: "all",
	valueField			: "id",
	displayField		: "text",
	hiddenName			: "mnu_id"
};

 */
Ext.TreeCombo = Ext.extend(Ext.form.ComboBox, {
	onlyLeaf: true,
	
	initList: function() {
		if (!this.list) {
			this.list = new Ext.tree.TreePanel({
				root: new Ext.tree.AsyncTreeNode({
					text				: "Root",
					id					: "root",
					leaf				: false,
					draggable			: false,
					singleClickExpand	: true,
					expanded			: true
				}),
				bodyStyle: "text-align: justify;",
				rootVisible: false,
				loader: this.loader,
				floating: true,
				height: this.listHeight,
				width: this.listWidth,
				containerScrool: true,
				listeners: {
					click: this.onNodeClick,
					scope: this
				},
				alignTo: function(el, pos) {
					this.setPagePosition(this.el.getAlignToXY(el, pos));
				}
			});
		}
	},
	
	expand: function() {
		if (!this.list.rendered) {
			this.list.render(document.body);
			this.innerList = this.list.body;
			this.list.hide();
		}
		this.el.focus();
		Ext.TreeCombo.superclass.expand.apply(this, arguments);
	},

	doQuery: function(q, forceAll) {
		this.expand();
	},

    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.list.el)){
            this.collapse();
        }
    },

	onNodeClick: function(node, e) {
		if (node.leaf || !this.onlyLeaf) this.setValue(node.id);
		else if (!this.isExpanded) node.expand();
		else node.collapse();
	},
	
	/**
     * Returns the raw data value which may or may not be a valid, defined value.  To return a normalized value see {@link #getValue}.
     * @return {Mixed} value The field value
     */
    getRawValue : function(){
    	return this.hiddenField.value;
    },
    
    findNode: function (loader, node, value, retorno) {
		if (this.nodeFound != null && this.nodeFound != undefined) return false;
		var field = this;
    	var value = value;
		if (node == null || node == undefined) node = field.list.getRootNode();
		if (!node.loaded) {
			loader.load(node, function (loader, node) {
				node.loaded = true;
				if (node.childNodes.length > 0) {
					field.nodeFound = node.findChild("id", value);
					if (field.nodeFound == null || field.nodeFound == undefined) {
						for (n = 0; n < node.childNodes.length; n++ ) {
							field.findNode(loader, node.childNodes[n], value, retorno)
							if (field.nodFound != null && field.nodeFound != undefined) break;
						}
					}
				}
				if (typeof(retorno) == "function") retorno(field);
			});
		} else {
			if (node.childNodes.length > 0) {
				field.nodeFound = node.findChild("id", value);
				if (field.nodeFound == null || field.nodeFound == undefined) {
					for (n = 0; n < node.childNodes.length; n++ ) {
						field.findNode(loader, node.childNodes[n], value, retorno)
						if (field.nodFound != null && field.nodeFound != undefined) break;
					}
				}
			}
			if (typeof(retorno) == "function") retorno(field);
		}
	},
    
    setValue : function(value){
    	if (value > 0) {
			if (this.list == undefined) this.initList();
			this.nodeFound = null;
			this.findNode(this.list.getLoader(), this.list.getRootNode(), value, function (field) {
				if (field.nodeFound != null && field.nodeFound != undefined) {
					text = field.nodeFound.attributes[field.displayField];
					if (text.length == 0 && field.valueNotFoundText !== undefined) text = (!empty(field.value) ? field.value : field.valueNotFoundText);
					if (field.hiddenField) field.hiddenField.value = value;
					if (field.isExpanded) field.collapse();
					Ext.form.ComboBox.superclass.setValue.call(field, text);
				}
			});
		}
	}
});
Ext.reg("treecombo", Ext.TreeCombo);