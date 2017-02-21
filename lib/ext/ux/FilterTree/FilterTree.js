/**
 * 
 * @project Fresh!
 * 
 * @package Ext.ux

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: FilterTree.js 2348 2013-12-20 10:20:54Z arun $
 * 
 */
Ext.namespace('Ext.ux');
Ext.namespace('Ext.ux.Plugin');
Ext.namespace('Fresh','Fresh.GridRender','Fresh.form','Fresh.global','Fresh.grid');

if (typeof console == 'undefined') {
    console = {};
    Fresh.console.log = function(){}
}

Ext.override(Ext.tree.TreeNodeUI, {
    renderElements: Ext.tree.TreeNodeUI.prototype.renderElements.createSequence(function(n, a, t, b){
        if(a.qtip){
            if(Ext.isObject(a.qtip)){
                Ext.QuickTips.register(Ext.apply({
                      target: Ext.id(this.iconNode)
                }, a.qtip));
            } else {
                this.iconNode.qtip = a.qtip;
            }
        }
    })
});

/**
 * FilterTree class that provides functionality necessary to 
 * apply, edit, rename filters
 * 
 * 
 */
Ext.ux.FilterTree = Ext.extend(Ext.tree.TreePanel,{
    

    initComponent : function() {

        // call superclass initComponent
        Ext.ux.FilterTree.superclass.initComponent.call(this);
        
        Ext.applyIf(this,{
           clickEvent: 'click'
        });
        //define loader if not
        if (typeof this.loader == 'string') {
            this.loader = new Ext.tree.TreeLoader(this.loader);
        }
        else if (typeof this.loader == 'undefined') {
            this.loader = new Ext.tree.TreeLoader();
        }

        if (typeof this.linkedGrid == 'string') {
            Ext.ComponentMgr.onAvailable(this.linkedGrid, function(gr){
                this.linkedGrid = gr;
//                this.on('dblclick', this.onDblClick, this);
            //    this.on('activate',this.onActivate,this);
            }, this)
        }

        if (this.linkedGrid && !this.dblClickOpensForm) {
                if (this.clickEvent == 'selectionchange')
                    this.getSelectionModel().on(this.clickEvent, this.applyFilterToGrid, this);
                else
                    this.on(this.clickEvent, this.applyFilterToGrid, this);
        }
        else 
            if (this.linkedForm && this.dblClickOpensForm) {
                if (this.clickEvent == 'selectionchange')
                    this.getSelectionModel().on(this.clickEvent, this.openFilter, this);
                else
                    this.on(this.clickEvent, this.openFilter, this);
            }

        if (typeof this.linkedFilterEditor == 'string') {
            Ext.ComponentMgr.onAvailable(this.linkedFilterEditor, function(fo){
                this.linkedFilterEditor = fo;
                fo.disable();
            }, this)
        }
        else 
            if (this.linkedFilterEditor) {
                this.linkedFilterEditor.disable();
            }
        
        if (typeof this.linkedForm == 'string') {
            Ext.ComponentMgr.onAvailable(this.linkedForm, function(fo){
                this.linkedForm = fo;
                fo.disable();
                fo.on('actioncomplete',this.onFormActionComplete.createDelegate(this,[fo],true));
            }, this)
        }
        else 
            if (this.linkedForm) {
                this.linkedForm.disable();
                this.linkedForm.on('actioncomplete',this.onFormActionComplete.createDelegate(this,[this.linkedForm],true));
            }

        if (this.contextMenus) {
//            this.contextMenu = new Ext.menu.Menu({
//                    id:'ctxMenu'+this.id,
//                    items: this.contextMenu
//                });
            this.on('contextmenu',this.onContextMenu,this);
        }
        
        this.loadingText = this.loadingText || 'Loading filter ';
    },
    
    onContextMenu: function(node, e){
        var dp,i,ctxMenu, menuType,menuDef,menuId,dynamicType;
        node.select();

        
        if (dp = this.dynamicPathMenu) {
            for(i=0;i<dp.length;i++) {
                if (node.getPath().match(dp[i].regexp)) {
                    if ((dynamicType = dp[i].menu)) break;
                    else return false;
                }
            }
        }
        if (!node.isLeaf()) {
            //Fresh.global.actions.openFilter.disable();
            Fresh.global.actions.reloadNode.enable();
        }
        else {
            //Fresh.global.actions.openFilter.enable();
            Fresh.global.actions.reloadNode.disable();
        }
        menuType = dynamicType || node.attributes.menuType || 'any';
        
        if (menuDef = this.contextMenus[menuType]) {
            menuId = 'ctxMenu-'+menuType+'-'+this.id;
        }
        else {

            if (menuDef = this.contextMenus['any']) {
                menuId = 'ctxMenu-any-'+this.id;
            }
        }
        if (menuId && menuDef) {
	        ctxMenu = Ext.menu.MenuMgr.get(menuId);
            if (!ctxMenu) {
                ctxMenu = new Ext.menu.Menu({id: menuId, floating: true, items: menuDef});
	            if (butts = ctxMenu.items.getRange()) {
	                for (var i = 0; i < butts.length; i++) {
	                    butts[i].form = this;
                            butts[i].hideOnClick = true;
	                }
	            }
            }
	        ctxMenu.showAt(e.getXY());
        }
    },
    
    initFormEvents: function(form,layout) {
        var bf = form.getForm();
        if (bf)
            bf.on('actioncomplete',this.onFormActionComplete.createDelegate(this,[fo],true));
    },
    
    onFormActionComplete: function(bf,action,form) {

        if (action.type == 'submit')  {
            var uid = action.result.Uid || action.result.uid || action.result.CustNo;
            var node = this.getNodeById(uid);
            var parentId = bf.getValues()['ParentId'] || bf.getValues()['parent_id'];
            var parentNode = this.getNodeById(parentId);
            if (node && parentNode) {
               if (parentId != node.parentNode.id) {
                  parentNode.appendChild(node);
               }
               node.setText(bf.getValues()['Name']);
               node.ensureVisible();
            }
            else {
                if (parentNode) {
                    parentNode.appendChild(new Ext.tree.AsyncTreeNode({
                         id: uid,
                         text: bf.getValues()['Name'],
                         leaf: true,
                         iconCls: this.leafIconCls
                    })).ensureVisible();
                }
            }
        }
        else 
            if (action.type == 'load') {
                form.enable();
            }
    },
    
    getSelectedNodesList : function() {
        var sm = this.getSelectionModel();
        if (typeof sm.getSelectedNodes == 'function')
            var nodes = sm.getSelectedNodes();
        else if (typeof sm.getSelectedNode == 'function')
            var nodes = [sm.getSelectedNode()];
        else    
            return;

        ids = [];
        for (i=0;i<nodes.length;i++) {
            ids.push(nodes[i].id);
            Fresh.console.log(nodes[i].id);
        }
        return ids;        
    },
    
    getSelectedNodeContext : function() {
        var sm = this.getSelectionModel();
        if (typeof sm.getSelectedNodes == 'function')
            var nodes = sm.getSelectedNodes();
        else if (typeof sm.getSelectedNode == 'function')
            var nodes = [sm.getSelectedNode()];
        else
            return;
        
        context = (nodes.length>0) ? nodes[0].attributes.context : '';
        context = (context) ? '-'+context : '';
        return this.id + context;
    },


    applyFilterToGrid : function(a, b) {

        if (Ext.isFunction(a.getPath))
            n = a;e = b;

        if (Ext.isArray(b) && b.length > 0 && Ext.isFunction(b[0].getPath))
            n = b[0];e = null;

        if (Ext.isFunction(b.getPath))
            n = b;e = null;

        if (!n) return;

        if (e && typeof e.stopEvent == 'function')
        e.stopEvent();

        var ids = this.getSelectedNodesList();
        if (!ids)
            return;
            
        this.selectedNodes = ids;
        this.linkedGrid.store.baseParams.filter = ids.join(',');
        this.linkedGrid.store.baseParams.context = this.getSelectedNodeContext();
        this.linkedGrid.store.load();
        try {
			this.linkedGrid.ownerCt.activate(this.linkedGrid);
		} catch (e) {}
//        tbtext = this.linkedGrid.getTopToolbar().items.first();
//        if (tbtext)
            //Fresh.console.log(tbtext.getEl());
//           tbtext.getEl().innerHTML = '<span class="icon-action x-btn-text">Filter: '+n.getPath('text').substr(9)+'</span>';
        if (this.descLen)
            Fresh.global.actions.filterNoAction.setText('<b>Filter: '+n.getPath('text').substr(this.descLen)+'</b>');
        else
            Fresh.global.actions.filterNoAction.setText('<b>'+n.getPath('text')+'</b>');
          
    },
    
    openFilter : function (n) {
      
        if (this.linkedForm) {
            var form = this.linkedForm;
           // form.setTitle('Filter: ' + n.text);
            var formParams = form.formBaseParams || {};
            formParams.id = n.id;
            formParams.action = 'load';
            
            //       grid.linkedForm.cascade(grid.linkedForm.doLayout);
            form.load({
                params: formParams,
                waitMsg: this.loadingText + n.text,
                success: function(){
                    form.enable()
                }
            });
        }
        else {
         if (this.linkedFilterEditor) {
            var npath = n.getPath('text').substr(11);
            Ext.MessageBox.wait('Loading filter: '+npath);
            var form = this.linkedFilterEditor;
            //form.setTitle('Filter: ' + n.text);
            var formParams = form.formBaseParams || {};
            var options = {
              url: formParams.url || Fresh.Config.Service.Form,
              params: Ext.apply(formParams,{
                        id: n.id,
                        action: 'load'
                      }),
              success: function(response){
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        //try {
                            form.filterModel.setFilterObj(result.data.FilterObj);
                            form.formBaseParams.id = n.id;
                            //Fresh.Msg.SlideBox('Success!',result.message || '');
                            form.enable();
                            form.ownerCt.activate(form);
                            //form.setTitle('Filter: '+n.getPath('text').substr(11));
                            Fresh.global.actions.filterNoActionOpen.setText('<b>Filter: '+npath+'</b>')
                            Ext.MessageBox.hide();
                            //} catch (e) {
                            //Ext.MessageBox.alert('Error','Bad filter loaded.');
                          //  form.disable();
                        //}
                        //that.store.reload();
                    }
                    else {
                        Ext.MessageBox.alert('Error',result.message);
                    }
                    
              },
              failure: function() {
                  Ext.MessageBox.alert('Error','Error occured while opening filter.');
                  form.disable();
              }
            };
            Ext.Ajax.request(options);
         }
       }
    },

    createNewNode: function(node,type) {

	//	if(false === this.fireEvent('beforenewdir', this, node)) {
		//	return;
		//}
        type = type || 'leaf';
		var editor = this.editor;
		var newNode,baseAttrs,isFolder,p;

		// get node to append new directory to
		var appendNode = node.isLeaf() ? node.parentNode : node;

        baseAttrs = {};
        for( p in this.newNodeDefaults[type]) { 
            baseAttrs[p] = this.newNodeDefaults[type][p];
        }
        //isFolder = (baseAttrs.leaf)? 0 : 1;

        // create new folder after the appendNode is expanded
		appendNode.expand(null, false, function(n) {
            
			// create new node
			var newNode = n.appendChild(new Ext.tree.AsyncTreeNode(baseAttrs));

			// setup one-shot event handler for editing completed
            if (this.editor) {
                this.editor.on({
                    complete: {
                        scope: this.treeEditor,
                        single: true,
                        fn: this.treeEditor.onCreate
//                        fn: this.onNewNode.createDelegate(this, [newNode])
                    }
                });
    			// creating new directory flag
    			this.editor.creatingNewNode = true;
    
    			// start editing after short delay
    			//(function(){editor.triggerEdit(newNode);}.defer(10));
                this.editor.editByAction = true;
                this.editor.triggerEdit.createDelegate(this.editor,[newNode]).defer(10);
                //treeEditor.triggerEdit(newNode);
            }


		// expand callback needs to run in this context
		}.createDelegate(this));

	},
    
    onNewNode : function(node) {
        this.treeEditor.updateNode(node,{ParentId: node.parentNode.id, Name: node.text, IsFolder: 0 },'add');           
    },
    
    getOneSelectedNode : function() {
        var sm = this.getSelectionModel();
        
        if (typeof sm.getSelectedNodes == 'function')
            var nodes = sm.getSelectedNodes();
        else if (typeof sm.getSelectedNode == 'function')
            var nodes = [sm.getSelectedNode()];
        else    
            return null;
        if (nodes.length>0)
            return nodes[0];        
        else    
            return null;
    },
    
    onActivate : function(p) {
        if (this.selectedNodes) {
            this.linkedGrid.store.baseParams.filter = ids.join(',');
            this.linkedGrid.store.baseParams.context = this.id;
            this.linkedGrid.store.load();
        }
    }

});


Ext.reg('filtertree',Ext.ux.FilterTree);

Fresh.form.CommonComboBox = function(config) {
    
    Ext.applyIf(config,{
         displayField: 'Name',
         valueField: 'Uid',
         hiddenName: config.name,
         lazyRender: true,
         mode: 'local',
         forceSelection: true,
         triggerAction:  'all'
    });
    //if ('string' == typeof config.store)
    config.store = Ext.StoreMgr.lookup(config.store);
    
    //Fresh.console.log(this.store);
    Fresh.form.CommonComboBox.superclass.constructor.call(this,config);
}

Ext.extend(Fresh.form.CommonComboBox,Ext.form.ComboBox);
Ext.reg('ccombo',Fresh.form.CommonComboBox);

Fresh.form.CommonLwComboBox = function(config) {

    Ext.applyIf(config,{
         displayField: 'name',
         valueField: 'uid',
         hiddenName: config.name,
         lazyRender: true,
         mode: 'local',
         forceSelection: true,
         triggerAction:  'all'
    });
    config.store = Ext.StoreMgr.lookup(config.store);

    //Fresh.console.log(this.store);
    Fresh.form.CommonLwComboBox.superclass.constructor.call(this,config);
}

Ext.extend(Fresh.form.CommonLwComboBox,Ext.form.ComboBox);
Ext.reg('clowcombo',Fresh.form.CommonLwComboBox);


/**
 * Ext.ux.plugins.IconCombo plugin for Ext.form.Combobox
 *
 * @author  Ing. Jozef Sakalos
 * @date    January 7, 2008
 *
 * @class Ext.ux.plugins.IconCombo
 * @extends Ext.util.Observable
 */
Ext.ns('Ext.ux.plugins');
Ext.ux.plugins.ContentIconCombo = function(config) {
    Ext.apply(this, config);
};

// plugin code
Ext.extend(Ext.ux.plugins.ContentIconCombo, Ext.util.Observable, {
    init:function(combo) {
        Ext.apply(combo, {
            tpl:  '<tpl for=".">'
                + '<div class="x-combo-list-item ux-icon-combo-item '
                + '{[(values.data)?values.data.iconCls:values.t]}">'
                + '{' + combo.displayField + '}'
                + '</div></tpl>',

            onRender: combo.onRender.createSequence(function(ct, position) {
                // adjust styles
                this.wrap.applyStyles({position:'relative'});
                this.el.addClass('ux-icon-combo-input');

                // add div for icon
                this.icon = Ext.DomHelper.append(this.el.up('div.x-form-field-wrap'), {
                    tag: 'div', style:'position:absolute'
                });
            }), // end of function onRender

            setIconCls:function() {
                var rec = this.store.query('uid', this.getValue()).itemAt(0);
                if(rec) {
                    var c = (rec.get('data'))?rec.get('data').iconCls:rec.get('t');
                    this.icon.className = 'ux-icon-combo-icon ' + c;
                }
            }, // end of function setIconCls

            setValue: combo.setValue.createSequence(function(value) {
                this.setIconCls();
            })
        });
    } // end of function init
}); // end of extend

Fresh.form.ContentTypeComboBox = function(config) {
    
    config = config || {};
    Ext.applyIf(config,{
         displayField: 'description',
         valueField: 'uid',
         lazyRender: true,
         mode: 'local',
         forceSelection: true,
         triggerAction:  'all',
         anyMatch: true,
         store: 'content-type-store',
         plugins: [ new Ext.ux.plugins.ContentIconCombo() ]
    });
    if ('string' == typeof config.store)
        config.store = Ext.StoreMgr.lookup(config.store);
    
    //Fresh.console.log(this.store);
    Fresh.form.ContentTypeComboBox.superclass.constructor.call(this,config);
}

Ext.extend(Fresh.form.ContentTypeComboBox,Ext.form.ComboBox, {
    doFilter: function(property, value, anyMatch, caseSensitive, exactMatch) {
           var ctype,checkLevel;

           checkLevel = function(r) { return ('undefined' == typeof r.data['data']['minLevel']) ? true : parseInt(Fresh.User.Level) >= r.data['data']['minLevel']; };

          // Fresh.console.log('doFilter: '+this.store.contentType);
           if (this.store.contentType)
                ctype = this.store.data.createValueMatcher(this.store.contentType);

            if (value)
                value = this.store.data.createValueMatcher(value, anyMatch, caseSensitive, exactMatch) ;

            if (!value && ctype)
                return this.store.filterBy(function(r){ return ctype.test(r.data['t']) && checkLevel(r);});

            if (value && !ctype)
                return this.store.filterBy(function(r){ return value.test(r.data[property]) && checkLevel(r);});

            if (value && ctype)
                return this.store.filterBy(function(r){ return ctype.test(r.data['t']) && value.test(r.data[property]) && checkLevel(r);});

    },
    /**
     * Execute a query to filter the dropdown list.  Fires the {@link #beforequery} event prior to performing the
     * query allowing the query action to be canceled if needed.
     * @param {String} query The SQL query to execute
     * @param {Boolean} forceAll true to force the query to execute even if there are currently fewer
     * characters in the field than the minimum specified by the {@link #minChars} config option.  It
     * also clears any filter previously saved in the current store (defaults to false)
     */
    doQuery : function(q, forceAll){
        q = Ext.isEmpty(q) ? '' : q;
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
           // if(this.lastQuery !== q){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                       this.doFilter();

                    }else{
                       this.doFilter(this.displayField, q, this.anyMatch);
                    }
                    this.onLoad();
                }else{
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                        this.doFilter();
                    this.expand();
                }
            //}else{
              //  this.selectedIndex = -1;
                //this.onLoad();
            //}
        }
    }

});
Ext.reg('typecombo',Fresh.form.ContentTypeComboBox);

Fresh.form.CommonMultiselect = function(config) {
    
    Ext.applyIf(config,{
         displayField: 'Name',
         valueField: 'Uid',
         lazyRender: true,
         mode: 'local',
         delimiter: '|',
         width: 150,
	     height: 100,
         forceSelection: true,
         triggerAction:  'all'
    })
    Fresh.form.CommonMultiselect.superclass.constructor.call(this,config);
}

Ext.extend(Fresh.form.CommonMultiselect,Ext.ux.Multiselect);
Ext.reg('cmultiselect',Fresh.form.CommonMultiselect);

Ext.ux.Plugin.ComponentLoader = function() {}
Ext.ux.Plugin.ComponentLoader.prototype = {
    init: function(container){

        if (!container.serviceContainer)
            return;
        var sc = Ext.getCmp(container.serviceContainer);
        this.container = container;

        if (!sc) {
            Ext.ComponentMgr.onAvailable(container.serviceContainer, function(scmp){
                container.serviceContainer = scmp;
                container.on('dblclick', this.onDblClick, this);
            }, this);
        }
        else {
            container.serviceContainer = sc;
            container.on('dblclick', this.onDblClick, this);
        }        
    },
    
    onDblClick: function(n, e){
        if (!n.isLeaf()) 
            return;
        e.stopEvent();
        
        this.container.serviceContainer.loadComponent({
            url: Fresh.Config.Service.Cmp,
            params: { id: n.id },
            scope: this.container.serviceContainer
        });
        
    }
    
}

Ext.ux.Plugin.TreeSorter = function() {}
Ext.ux.Plugin.TreeSorter.prototype = {
    init: function(tree) {
        tree.sortConfig = tree.sortConfig || {};
        new Ext.tree.TreeSorter(tree,tree.sortConfig);
    }
}

Ext.ux.Plugin.TreeEditor = function(config) {
    Ext.applyIf(this,config);
}
Ext.ux.Plugin.TreeEditor.prototype = {
    init: function(tree) {
        tree.editorConfig = tree.editorConfig || {};
        this.tree = tree;
        this.tree.treeEditor = this;
        if (!this.noEdits) {
            if (!this.noInlineEdit) {
                tree.editor = new Ext.tree.TreeEditor(tree, tree.editorConfig);
                tree.editor.on('beforestartedit', this.onBeforeStartEdit, this);
            }
            tree.on('textchange', this.onTextChange, this);
            //tree.on('beforeremove', this.onBeforeRemove, this);
            tree.on('movenode', this.onMove, this);
        }
        //tree.on('remove',this.onRemove,this);
        tree.on('insert',this.onInsert,this);
        tree.on('append',this.onAppend,this);
        tree.on('nodedragover',this.onNodeDragOver,this);
    },
    
    onBeforeRemove : function(tree,node,node1)
    {
        
    },

    onBeforeStartEdit: function (editor,el,val)    
    {
      var a = this.tree.editor.editByAction;
      this.tree.editor.editByAction = false;
      return a;  
    },
    
    onDragOwer : function(o) {

  //      if (o.target)        
    },

    onTextChange : function(node,val,startVal,cb) {

        var o = {};
		if (!this.noInlineEdit && this.tree.editor.creatingNewNode) 
        	return; //(val != startVal) &&

		o.Name = val;        

        if (node.attributes.typeId)
            o.type_id = node.attributes.typeId;
        
        if (node.attributes.templateId)
            o.tid = node.attributes.templateId;

        this.updateNode(node,o,'update',cb);
		
		delete node.attributes.templateId;
    },

    onMove: function( tree, node, oldParent, newParent, index )    {
       var order,inside;
       		inside = Ext.type(newParent.childNodes[index]);
			if (!this.tree.orderable ) {
       			this.updateNode(node,{ParentId: newParent.id, Name: node.text });
			}
			else {
  			   if (0 == index) {
  			   		order = 0;
  			   }
  			   else {
	  			   if (Ext.type(newParent.childNodes[index+1])) {
				   		order = newParent.childNodes[index+1].attributes.ordering - 5;
				   } else {
				   		order = newParent.lastChild.attributes.ordering + 5;
				   }
  			   }
	           this.updateNode(node,{ParentId: newParent.id, Name: node.text, Ordering: order },'update',
	           		function(options,data){
			           var children = newParent.childNodes;
			           var order = 0;
			           for (var i=0; i<children.length; i++) {
			           		order += 10;
			           		children[i].attributes.Ordering = order;
			           }
	           		});
		    }
    },

    onNodeDragOver: function(de) {
        var bin,i;
        for(i=0;i<de.dropNode.length;i++) { 
            if (de.dropNode[i].id == '1') { return false; }
        }
        return (de.dropNode.id !='1');
    },
    onAppend: function( tree, parent, node, index )   {
		   if (this.tree.editor && this.tree.editor.creatingNewNode || !node.attributes.isNew) 
        	     return; //(val != startVal) &&           
		   
		   node.attributes.isNew = false;
		   this.updateNode(node,{ParentId: parent.id, Name: node.text, Ordering: index*100, IsFolder: ((node.isLeaf())?0:1)  },'add',
	           		function(options,data){
			           var children = parent.childNodes;
			           var order = 0;
			           for (var i=0; i<children.length; i++) {
			           		order += 10;
			           		children[i].attributes.Ordering = order;
			           }
	           		});  
    },
    
    onInsert: function( tree, parent, node, refNode )   {
		   var order;
		   if (this.tree.editor && this.tree.editor.creatingNewNode || !node.attributes.isNew) 
        	     return; 
           if (refNode)         
           	  order = refNode.attributes.ordering - 5;
		   else	
		      order = (node.previousSibling) ? node.previousSibling.attributes.ordering + 5 : 0;
		   node.attributes.isNew = false;
		   this.updateNode(node,{ParentId: parent.id, Name: node.text, Ordering: order, IsFolder: ((node.isLeaf())?0:1)  },'add',
	           		function(options,data){
			           var children = parent.childNodes;
			           var order = 0;
			           for (var i=0; i<children.length; i++) {
			           		order += 10;
			           		children[i].attributes.Ordering = order;
			           }
	           		});  
    },

    onDelete: function( tree, node)   {
           this.updateNode(node,{},'remove');  
    },

    onCreate: function(ed, val, startVal) {
        //this.tree.editor.un('complete');
        var node = this.tree.editor.editNode;
        this.updateNode(node,{ParentId: node.parentNode.id, Name: val, IsFolder: ((node.isLeaf())?0:1) },'add');  
    },

    updateNode : function(node,data,cmd,cmdCb) {
        
        if (this.tree.editor)
            this.tree.editor.creatingNewNode = false;
        cmd = cmd || 'update';
        var loader = this.tree.getLoader();        
        
        var params = {};
        for (var p in loader.baseParams) {
            params[p] = loader.baseParams[p];
        }

        if (cmd=='add') {
            params.context = params.view+'-add';
            data.Uid = '';
			data.uid = '';
            this.creatingNewNode = false;
        }
        else {
            params.context = params.view+'-'+cmd;
            data.Uid = node.id;
        }
        data.ParentId = (data.ParentId == 0)? null: data.ParentId
        params.data = Ext.encode(data);
        var options = {
            url: loader.url,
            node: node,
            params: params,
            callback: this.updateCallback.createDelegate(this),
            cmdCallback: cmdCb
        }
        Ext.Ajax.request(options);
    },
    
    updateCallback: function(options,bSuccess,response) {
 		var i, result, node, data, anode, newParent;
		var showMsg = true;
		if (true === bSuccess) {
            result = Ext.decode(response.responseText);
            if (result.success) {
                data = Ext.decode(options.params.data);
                node = options.node;
                if (!data.Uid && !data.uid) {
                    node.id = result.id;
                }
                if (data.ParentId && node.parentNode && data.ParentId != node.parentNode.id && (newParent = this.tree.getNodeById(data.ParentId))) {
                    anode = newParent.appendChild(options.node);
					try {
						if (newParent.attributes.menuType != 'recycleBin')
							anode.ensureVisible();
					} catch (e) {}
                }
                if (options.params.context == options.params.view + '-remove') {
                    if (this.tree.linkedForm && this.tree.linkedForm.formBaseParams.id == node.id)
                        this.tree.linkedForm.disable();
                    node.remove();
                }
                if ('function' === typeof options.cmdCallback)
                	options.cmdCallback.apply(this,[options,data,result]);
                Fresh.Msg.SlideBox(__('Success!'), result.message);
            }
            else {
                if (node && node.parentNode)
                	node.parentNode.reload();
                Ext.MessageBox.alert(__('Error'),result.message);
            }
        }
        else {
            if (node && node.parentNode) 
              	node.parentNode.reload();
            Ext.MessageBox.alert(__('Error'),__('Error occured while updating tree.'));
        }
       
    }
    
    
    
}


Ext.ux.Plugin.FormLoader = function(config) {
    Ext.apply(this, config,{
        clickEvent: 'click'
    });
}
Ext.ux.Plugin.FormLoader.prototype = {
    init: function(grid) {
        

        this.grid = grid;
        var that = this;
        if (typeof grid.linkedForm == 'string')
        {
            Ext.ComponentMgr.onAvailable(grid.linkedForm,function(fr){
                grid.linkedForm = fr;
				this.initEvents(grid);
            },this)
        }
        else if (grid.linkedForm) {
			this.initEvents(grid);
        }
    },
    
	initEvents: function(grid) {
		if (grid.isXType('grid')){
			grid.getSelectionModel().on('beforerowselect',this.onBeforeRowSelect,this);
	        grid.on('row'+this.clickEvent,this.onRowDblClick,this);
		}
		else
			if (grid.isXType('treepanel'))
		        grid.on(this.clickEvent,this.onRowDblClick,this);
				
        grid.linkedForm.disable();
        this.grid = grid;
		
	},
	/*
	 * before selecting a new row it will store the index of the previouly selected row
	 */
	onBeforeRowSelect : function(g,e){
		this.bef_select = g.getSelections(); //store all the previously selected items in an array
		
		//
		// in case of the quizes grid this variable is used in gridDnD plugin to keep the seleciton
		//
		
		if( this.grid.id == 'quizes-grid'){
			this.grid.bef_select = g.getSelections();
		}
		return true;
	},
	onRowDblClick : function(g,e) {
		//If the user modify something in the chapter and again click on the same chapter
		//no message should display
		if( this.bef_select == undefined ){
			//Code for Handeling the Scenario ; When user clicks on the quiz item and again clicks on the
			//Quiz We are showing quiz related form , but the title is still showing as Evaluation Item
			 if (Ext.isFunction(g.isXType) && g.isXType('grid')) {
				var grid = this.grid;
				if(grid.id == "quizgroups-grid"){
					var record = grid.getSelectionModel().getSelected();
					ct = grid.linkedForm.ownerCt;
					var formInfoField = grid.infoField || 'Name';
					ct.setTitle('Evaluation: '+record.get(formInfoField));
				}
			 }
			return;
		}
		
		//
		// in case of the quizes grid this variable is used in gridDnD plugin to keep the seleciton
		//
		
		if( this.grid.id == 'quizes-grid'){
			this.grid.bef_select = this.grid.getSelectionModel().getSelections();
			if ( this.grid.parentGrid ){
				
				var quizGroup = Ext.getCmp('quizgroups-grid').linkedForm.getForm();
				var quizGroupModified = quizGroup.isDirty();
			}
		}
		var grid = this.grid;
		if (Ext.isFunction(e.stopEvent))
			e.stopEvent();
		var lf = this.grid.linkedForm;
		if (this.noCollapsedOpen && lf.ownerCt.collapsed)
		{
			return;
		}
		//Here for lesson Management System it will check whether the user has made some changes 
		//in Chapters And Script Tag of lesson form

		if( this.grid.linkedForm.autogridId && !this.grid.linkedForm.disabled){
			var lfaugId = this.grid.linkedForm.autogridId;

			var modified = Ext.getCmp( lfaugId ).getStore().getModifiedRecords().length;

		}

		//
		// verify all the autogrid's for the modified records
		//which are under the linked form
		//

		if (gs = this.grid.linkedForm.findByType('autogrid')) {
			for (i=0;i<gs.length;i++) {
				if( gs[i].getStore().getModifiedRecords().length > 0 ){
					modified =  gs[i].getStore().getModifiedRecords().length ;
				}
			}
		}
        var finalized = false;
        if( lf.id !="course-form" ){
            finalized=  parseInt(lf.getForm().getValues(false,true).Finalized);
        }else{
           finalized = Ext.getCmp('course-form-save-button').disabled ;
        }
         
         // Linked form is question form then check quiz finalization
         if( lf.id =='question-form'){
            finalized = parseInt(Ext.getCmp('quiz-form').getForm().getValues(false,true).Finalized);
         }

		if (lf.askBeforeLoad && !finalized && ( quizGroupModified ||( !lf.disabled &&
				( lf.getForm().isDirty() || ( lf.linkedGrid && lf.linkedGrid.store.dirty ) ) || modified > 0
		))) {
			
			var conformMessage = ''; 
			if( quizGroupModified && !lfaugId ){
				
				conformMessage = 'You have unsaved changes. Proceed?'; 
			} else {
				conformMessage = 'You have unsaved changes which will be lost.<br/>Continue?'; 
			}
			
			Ext.MessageBox.confirm(__('Confirm'), __(conformMessage), function(btn, text){
				if (btn == 'yes') {
					if(grid.id == 'videos-grid'){						
						var markerErrorCmp = Ext.getCmp('makererrorcontent');
						if(markerErrorCmp){             			
							markerErrorCmp.setVisible(false);
						}
						var cueErrorCmp = Ext.getCmp('cuepointerrorcontent');
						if(cueErrorCmp){						
							cueErrorCmp.setVisible(false);
						}
					}
					if ( quizGroupModified ){
						quizGroup.reset();
						quizGroupModified = false;
					}
					
					//this.grid.getSelectionModel().selectRow(e ,false, false );
					lf.getForm().reset();
					if ( lf.linkedGrid ){

						lf.linkedGrid.store.rejectChanges();
					}else if( lf.autogridId  ){
						var lfaugId = lf.autogridId;
						Ext.getCmp( lfaugId).store.rejectChanges();
					}

					//
					// reject all the changes of the autogrids under the linked form
					//

					if (gs = this.grid.linkedForm.findByType('autogrid')) {
						for (i=0;i<gs.length;i++) {
							gs[i].getStore().rejectChanges();
						}
					}
                    if( lf.id =='quiz-form'){
                        Ext.getCmp('question-form').getForm().reset();
                        Ext.getCmp(Ext.getCmp('question-form').autogridId).getStore().rejectChanges();
                    }
					this.loadLinkedForm(grid,g);
					this.bef_select = undefined;
				}
				else {
					//If the user clicks on No button then changed the selection to previously selected one
					if(this.bef_select.length > 0 ){

						this.grid.getSelectionModel().selectRecords(this.bef_select ,false );

					} else if( this.grid.id != "quizgroups-grid" ){

						this.grid.getSelectionModel().deselectRow(e ,false);
					}

				}
				this.bef_select = undefined;
			},this);
		}
		else {
            if( lf.id =='quiz-form'){
                        Ext.getCmp('question-form').getForm().reset();
                        Ext.getCmp(Ext.getCmp('question-form').autogridId).getStore().rejectChanges();
            }

			this.loadLinkedForm(grid,g);
			this.bef_select = undefined;
		}

	},
    loadLinkedForm: function(grid,g) {
		var record;
        if (Ext.isFunction(g.isXType) && g.isXType('grid')) {
        var sm = grid.getSelectionModel();
        
		if ('function' == typeof sm.getSelected)
	        record = sm.getSelected();
		else
			record = sm.getSelectedNode();
        } else {
            record = g;
        }
	grid.linkedForm.enable();
        var formParams = grid.linkedForm.formBaseParams || {};
        Fresh.console.log(record);
        formParams.id = record.id;
        formParams.action = 'load';

 //       grid.linkedForm.cascade(grid.linkedForm.doLayout);
        var msgTemplate = grid.linkedForm.loadingMsg || 'Loading customer {Name}';
        msgTemplate = new Ext.Template(msgTemplate).applyTemplate(record.data || record.attributes);
        var formInfoField = grid.infoField || 'Name';
        grid.linkedForm.load({
            params: formParams,
            waitMsg: msgTemplate,
            success: function() { 
                grid.linkedForm.enable();
	            try {
                        grid.linkedForm.getForm().reset();
	                if (ct = grid.linkedForm.ownerCt){
	                	
	                	var ContentTitle = ct.initialConfig.title;
	                	//
	                	// Setting the title for the initial config of quiz-form region, so that 
	                	// replacing Editing with Question, if the xtitle of the linked form is question, and 
	                	// Quiz if the xtitle of linked form is Quiz.
	                	//
	                	if( grid.linkedForm.xtitle ){
	                		
	                		if( grid.linkedForm.xtitle == "Evaluation item" ){
	                			
	                			ContentTitle = grid.linkedForm.xtitle;
	                		}
	                	}
	                	// After loading the duplicated record we are assigning the content id as false to the grid variable.
	                	grid.duplicateContentId = false;
	                	ct.setTitle( ContentTitle+': '+record.get(formInfoField));
	                }
	            } catch (e) {}

            }
        });
        var lg = grid.linkedForm.linkedGrid;
        if (lg) {
            lg.store.baseParams.filter = record.id;
            lg.store.baseParams.context = grid.id;
            
            if (true || lg.isVisible()) {
                //lg.store.load({params: {meta: !lg.store.noMeta}});
                lg.store.load({
                    params: {
                        meta:!lg.isVisible()
                    }
                });
                lg.store.noMeta = true;
            }
            lg.customerChanged = !lg.isVisible();
            //pref.syncSize();
            //lg.doLayout(); 
        }
        
        //
        // In case of videos-grid added new auto grid video_captions
        // which should get loaded accordingly with the form.
        //
        
        if( grid.id == 'videos-grid'){
        	
        	var captionsStore = Ext.StoreMgr.lookup('video-captions-store');
        	captionsStore.baseParams.filter = record.id;
        	captionsStore.baseParams.context = grid.id;
        	captionsStore.load({ params:{ meta:true }});
        }
    },

    onActionComplete : function(bform,action)
    {
        Fresh.console.log('Completed '+action);
        if (action.type == 'load')
        {
            //Ext.getCmp('preference-grid').doLayout();
            if (this.grid.linkedForm.linkedGrid) {
	            this.grid.linkedForm.linkedGrid.doLayout();
	            this.grdi.linkedForm.linkedGrid.syncSize();
            }
            //Ext.getCmp('preference-grid').syncSize();
            //this.saveButton.enable();
        }
    }
    
}

Ext.preg('pformloader',Ext.ux.Plugin.FormLoader);

Ext.ux.Plugin.FormLinker = function(config) {
    Ext.apply(this, config,{
        clickEvent: 'click'
    });
}
Ext.ux.Plugin.FormLinker.prototype = {
    init: function(grid) {

        this.grid = grid;

        this.grid.getView().getRowClass = function(record, rowIndex, rp, ds){ // rp = rowParams
                if(record.dirty){
                    return 'x-grid3-row-dirty-color';
                }
            }

        if (typeof grid.linkedForm == 'string')
        {
            Ext.ComponentMgr.onAvailable(grid.linkedForm,function(fr){
                grid.linkedForm = fr;
                grid.on('row'+this.clickEvent,this.onRowClick,this);
                //fr.on('clientvalidation',this.onLinkedFormValid,this);
                fr.disable();
                this.linkedForm = fr;
                fr.parentStore = grid.store;
            },this)
        }
        else if (grid.linkedForm) {
                grid.on('row'+this.clickEvent,this.onRowClick,this);
               // grid.linkedForm.on('clientvalidation',this.onLinkedFormValid,this);
                grid.linkedForm.disable();
                this.linkedForm = grid.linkedForm;
                this.linkedForm.parentStore = grid.store;
                //this.bindFields();
        }
    },

    bindFields : function(form,record){
        var fs = record.fields;
        fs.each(function(f){
            var field = form.getForm().findField(f.name);
            if(field){
                if (field.isXType('htmleditor'))
                    field.on('sync',this.updateRecord,this);
                else
                    field.on('change',this.updateRecord,this);
            }
        }, this);
    },

    onRowClick : function(grid) {

        var sm = grid.getSelectionModel();

        var record = sm.getSelected();
        if (record) {
	        var form = grid.linkedForm;
	        var f = grid.linkedForm.getForm();

	        f.loadRecord(record);

            if (!form.currentRecord)
                this.bindFields(this.linkedForm,record);

            form.currentRecord = record;
	        grid.linkedForm.enable();
        }
    },

    updateRecord : function(field,newVal,oldVal){
        var record;
        if (record = this.linkedForm.currentRecord)
            if (record.get(field.name) != newVal)
                record.set(field.name,newVal);

    },


/*
        record.beginEdit();
        //record.reject();
        var fs = record.fields;
        fs.each(function(f){
            var field = this.findField(f.name);
            if(field && record.get(f.name) != field.getValue() ){
                if (record.modified && record.modified.hasOwnProperty(f.name))
                    delete record.modified[f.name];
                record.set(f.name, field.getValue());
            }
        }, form);
        record.endEdit();
    },

*/

    onLinkedFormValid: function(form,valid) {
//        if (form.currentRecord)

        if (valid && form.currentRecord) {
          //  form.currentRecord.reject(true);
            this.updateRecord(form.getForm(),form.currentRecord);

        }
    }

}

Ext.preg('pformlinker',Ext.ux.Plugin.FormLinker);


Ext.ux.Plugin.GridLinker = function(config) {
    Ext.apply(this, config,{
        clickEvent: 'rowclick',
        disableLinkedForm: false,
        activate: true // the activate flag is used to take a decision regarding activation of linked grid.
    });
}
Ext.ux.Plugin.GridLinker.prototype = {
    init: function(grid) {
        var ce = this.clickEvent,linkedGrid;
        this.grid = grid;
        linkedGrid = (this.linkedGrid)?this.linkedGrid:grid.linkedGrid;
        
        if (typeof linkedGrid == 'string')
        {
            Ext.ComponentMgr.onAvailable(linkedGrid,function(fr){
                if (grid.linkedGrid)
                    grid.linkedGrid = fr;
                    
                if (this.clickEvent == 'selectionchange'){
                    grid.getSelectionModel().on(this.clickEvent,this.applyFilterToGrid,this);}
                else{
                	grid.getSelectionModel().on('beforerowselect',this.onBeforeRowSelect,this);
                	grid.getSelectionModel().on('rowdeselect',this.onBeforeRowDSelect,this);
                	grid.on(this.clickEvent,this.applyFilterToGrid,this);
                	grid.on('headerclick',this.handleHeaderClick,this);
                    }
                
                this.linkedGrid = fr;
            },this)
        }
        else if (linkedGrid) {
                grid.on(this.clickEvent,this.applyFilterToGrid,this);
                this.linkedGrid = linkedGrid;
        }
    },
    /*
     * before Selecting a row from the tag it will get what are the rows previously selected
     * */
    onBeforeRowSelect : function(g,e, exist,rec){
    	this.previousSelections = g.getSelections();
    	//when the user clicks with CTRL key then the value of exist is true, oteherwise false
    	if( !exist && this.previousSelections.length >0 ){
    		for( var k =0; k<this.previousSelections.length ; k++ ){

    			if( this.previousSelections[k].id == rec.id ){
    				this.rowsingleselect = undefined;
    				break;
    			}else{
    				this.rowsingleselect = e;
    			}
    		}
    	}else if( !exist ){
    		this.rowsingleselect = e;
    	}else{
    		
    		this.currentSelection = e;
    	}
    },
    handleHeaderClick : function(grid,colIndex,evpts){
    	
    	if( colIndex == 0 && evpts.target.className == 'x-grid3-hd-tag'){
    		this.hd = Ext.fly(evpts.target.parentNode);
            this.isChecked = this.hd.hasClass('x-grid3-hd-checker-on');
            
            this.applyFilterToGrid( grid,undefined,evpts);
    	}
    	
    },
    /*
     * If the user deselect a Tag then it should save the deselected Tag Records.
     * */
    onBeforeRowDSelect: function( selm,ri,rec){
    	this.rowDselect = rec;
    },
    getSelectedRowsList : function() {
        var sm = this.grid.getSelectionModel();
        if (typeof sm.getSelections == 'function')
            var recs = sm.getSelections();
        else
            return;

        ids = [];
        for (i=0;i<recs.length;i++) {
            if (!recs[i].phantom)
                { ids.push(recs[i].id);
                  Fresh.console.log(recs[i].id);
            }
        }
        
        //
        // if all the rows are selected in the grid then show the header checkbox checked.
        //
        
        if( recs.length == this.grid.getStore().getCount() ){
        	 this.grid.getView().innerHd.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.className = 'x-grid3-hd-inner x-grid3-hd-checker x-grid3-hd-checker-on course-tag-all-checked';
        }
        return ids;
    },

    applyFilterToGrid : function(grid,ri,e) {
    	/*
    	 * If the user modified something in the items of one chapter and without saving,if it is switching
    	 *  to another chapter then it will prompt for a confirm message
    	 * */
    	
    	//Here for lesson Management System it will check whether the user has made some changes 
        //in Chapters And Script Tag of lesson form
    	if( this.linkedGrid.linkedForm && this.linkedGrid.linkedForm.autogridId && !this.linkedGrid.linkedForm.disabled){
    		var lfaugId = this.linkedGrid.linkedForm.autogridId;
    		var modified = Ext.getCmp( lfaugId).getStore().getModifiedRecords().length;
    	}
    	
    	//
    	// verify all the autogrid's for the modified records
    	//which are under the linked form
    	//
    	if ( this.linkedGrid.linkedForm  ) {
    		if(  gs = this.linkedGrid.linkedForm.findByType('autogrid') ){
    			for (i=0;i<gs.length;i++) {
    				if( gs[i].getStore().getModifiedRecords().length >0){
    					modified =  gs[i].getStore().getModifiedRecords().length ;
    				}
    			}
    		}
          }
    	if(this.promptbeforeload)
    	{
    		if((this.linkedGrid.linkedForm.getForm().isDirty() && !this.linkedGrid.linkedForm.disabled) || modified > 0)
    			{
    			 Ext.MessageBox.confirm(__('Confirm'), __('You have unsaved changes which will be lost.<br/>Continue?'), function(btn, text){
	                if (btn == 'yes') {
	                		this.grid.getSelectionModel().selectRecords(this.grid.getSelectionModel().getSelections() ,false );
	                		this.rowsingleselect=undefined;
		                	this.rowDselect = undefined;
		                	this.currentSelection = undefined;
		                	
		                	if(this.linkedGrid.linkedForm.autogridId){

		                		Ext.getCmp( this.linkedGrid.linkedForm.autogridId ).getStore().rejectChanges();
		                		
		                	}
		                	
		                	//
		                	//reject changes of all the autogrids under the linked form when
		                	// user want to lose the modifications, then for autogrid call reload
		                	//
		                	
		                	if (gs = this.linkedGrid.linkedForm.findByType('autogrid')) {
		                		for (i=0;i<gs.length;i++) {
		                			gs[i].getStore().rejectChanges();
		                			gs[i].store.reload();
		                		}
		                	}
		                	if( this.grid.id == "quizgroups-grid" ){
		                		  var top = Ext.getCmp('quiz-form-east-region');
                                  top.getLayout().setActiveItem(0);
		                	}
		                	if(this.grid.linkedGrid.id == 'videos-grid'){

		                		this.linkedGrid.linkedForm.getForm().reset();
		                	}else if( this.grid.linkedGrid.id == 'quizgroups-grid' ){
		                			
		                			Ext.getCmp('quizes-grid').store.removeAll();
		                		    this.linkedGrid.linkedGrid.linkedForm.disable(true);
		                		}
		                	
		                	if( this.isChecked && this.hd ){
		                        this.hd.removeClass('x-grid3-hd-checker-on');
		                        this.hd.removeClass('course-tag-all-checked');
		                        grid.getView().innerHd.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.className = 'x-grid3-hd-inner x-grid3-hd-checker';
		                        this.grid.getSelectionModel().clearSelections();
		                    }else if( this.hd ){
		                        grid.getView().innerHd.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.className = 'x-grid3-hd-inner x-grid3-hd-checker x-grid3-hd-checker-on course-tag-all-checked';
		                        this.grid.getSelectionModel().selectAll();
		                    }else{
		                    	grid.getView().innerHd.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.className = 'x-grid3-hd-inner x-grid3-hd-checker';
		                    }
		                	this.isChecked = false;
		                	this.hd = undefined;
		                	this.rowsingleselect=undefined;
		                	this.rowDselect = undefined;
		                	this.currentSelection = undefined;
		                	this.previousSelections=undefined;
		                	this.getDataOfGrid(grid,ri,e);
	                }
	                else {
	                	//If the user clicks on no button then previouly selected rows became selected again
	                	var curr_selection = true;
	                	var deselect_rec = this.rowDselect;
	                	/*
	                	 * If the user selected something Then it will deselect that row and make the flag as False
	                	 * */
	                	if( !deselect_rec && this.currentSelection  != undefined &&  (this.grid.id != "quizgroups-grid")  ){
	                		this.grid.getSelectionModel().deselectRow( this.currentSelection , false );
	                		curr_selection = false;
	                	}
	                	
	                	if( this.previousSelections && (this.grid.id != "quizgroups-grid") )
	                	this.grid.getSelectionModel().selectRecords(this.previousSelections ,curr_selection );
	                	/*
	                	 * If the user deselect some Tag before Then it will select that row 
	                	 * */
	                	if( deselect_rec && (this.grid.id != "quizgroups-grid")  ){
	                		this.grid.getSelectionModel().selectRecords([deselect_rec] , true );
	                	}
	                	if( this.rowsingleselect != undefined && (this.grid.id != "quizgroups-grid") ){
	                		this.grid.getSelectionModel().deselectRow( this.rowsingleselect , false );
	                	}
	                	this.rowsingleselect=undefined;
	                	this.rowDselect = undefined;
	                	this.currentSelection = undefined;
	                	this.isChecked = false;
	                	this.hd = undefined;
	                	return;
	                }
	            },this);
	         }else{ 
	        	    this.rowsingleselect=undefined;
         			this.currentSelection = undefined;
         			if(this.isChecked && this.hd ){
                        this.hd.removeClass('x-grid3-hd-checker-on');
                        this.hd.removeClass('course-tag-all-checked');
                        this.grid.getSelectionModel().clearSelections();
                        this.rowDselect = undefined;
                    }else if( this.hd ){
                        this.hd.addClass('x-grid3-hd-checker-on');
                        this.hd.addClass('course-tag-all-checked');
                        this.grid.getSelectionModel().selectAll();
                    }else{
                    	grid.getView().innerHd.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.className = 'x-grid3-hd-inner x-grid3-hd-checker';
                    }
                	this.isChecked = false;
                	this.hd = undefined;
                	this.rowsingleselect=undefined;
                	this.currentSelection = undefined;
    				this.getDataOfGrid(grid,ri,e);
    				this.rowDselect = undefined;
    			}
    	}
   	 else
   		 {
   		if(this.isChecked && this.hd ){
            this.hd.removeClass('x-grid3-hd-checker-on');
            this.hd.removeClass('course-tag-all-checked');
            this.grid.getSelectionModel().clearSelections();
        }else if( this.hd ){
            this.hd.addClass('x-grid3-hd-checker-on');
            this.hd.addClass('course-tag-all-checked');
            this.grid.getSelectionModel().selectAll();
        }
    	this.isChecked = false;
    	this.hd = undefined;
   		 this.getDataOfGrid(grid,ri,e);
   		 }
   },
   /*
    * It will filter the data based on the selected chapter and populate the corresponding data in the grid
    * 
    */ 
   getDataOfGrid : function(grid,ri,e){
   	if (e && e.stopEvent) e.stopEvent();
       var ids = this.getSelectedRowsList(),
       searchText = '',searchPlugin;
       if (!this.fireNoSelection && (!ids || ids.length == 0)){
           return;
       }
       /*
        * Here code is written for search field text. 
        * if search plugin is exist, then search text become filed value other wise it is empty.
        */
       if( this.linkedGrid.plugins.length > 0 ){
    	   
    	   this.linkedGrid.plugins.forEach(function( plugin,index, items ){
    		   if( plugin.field && plugin.ptype == "pgridsearch" ){
    			   searchText = plugin.field.getValue();
    			   searchPlugin = plugin;
    		   }
    	   },this);
       }
       this.linkedGrid.store.baseParams.searchtext = "%"+searchText+"%";
       this.selectedRows = ids;
       this.linkedGrid.store.baseParams.filter = ids.join(',');
       this.linkedGrid.store.baseParams.context = this.grid.id;
       this.linkedGrid.store.load();
       if (this.linkedGrid.linkedForm)
       {
           this.linkedGrid.linkedForm.formBaseParams.filter = ids.join(',');
           if (this.disableLinkedForm)
               this.linkedGrid.linkedForm.disable();
       }
       
       if ( this.activate == true ) {
       	 try {
                this.linkedGrid.ownerCt.activate(this.linkedGrid);
    		} catch (e) {}
       }
       if( grid.getSelectionModel ){
           var selectedRow = grid.getSelectionModel().getSelections()[0];
           
           if( !selectedRow && !this.rowDselect ){
        	   
        	   grid.getSelectionModel().selectRow(ri);
           }
       }
       this.linkedGrid.getSelectionModel().clearSelections();
   },

    onActivate : function(p) {
        if (this.selectedRows) {
            this.linkedGrid.store.baseParams.filter = this.selectedRows.join(',');
            this.linkedGrid.store.baseParams.context = this.id;
            this.linkedGrid.store.load();
        }
    }
    
}

Ext.preg('pgridlinker',Ext.ux.Plugin.GridLinker);

Ext.ux.Plugin.MultiGridLinker = function(config) {
    Ext.apply(this, config,{
        clickEvent: 'rowclick',
        disableLinkedForm: false
    });
}
Ext.ux.Plugin.MultiGridLinker.prototype = {
    init: function(grid) {

        this.grid = grid;

        if (typeof this.linkedGrid == 'string')
        {
            Ext.ComponentMgr.onAvailable(this.linkedGrid,function(fr){
                grid.on(this.clickEvent,this.applyFilterToGrid,this);
                this.linkedGrid = fr;
            },this)
        }
        else if (this.linkedGrid) {
                grid.on(this.clickEvent,this.applyFilterToGrid,this);
        }
    },

    getSelectedRowsList : function() {
        var sm = this.grid.getSelectionModel();
        if (typeof sm.getSelections == 'function')
            var recs = sm.getSelections();
        else
            return;

        ids = [];
        for (i=0;i<recs.length;i++) {
            if (!recs[i].phantom)
                { ids.push(recs[i].id);
                  Fresh.console.log(recs[i].id);
                }
        }
        return ids;
    },

    applyFilterToGrid : function(grid,ri,e) {

        e.stopEvent();
        var ids = this.getSelectedRowsList();
        if (!ids || ids.length == 0)
            return;

        this.selectedRows = ids;
        this.linkedGrid.store.baseParams.filter = ids.join(',');
        this.linkedGrid.store.baseParams.context = grid.id;
        this.linkedGrid.store.load();
        if (this.linkedGrid.linkedForm && !this.disableLinkedForm)
        {
            this.linkedGrid.linkedForm.formBaseParams.filter = ids.join(',');
            if (this.disableLinkedForm)
                this.linkedGrid.linkedForm.disable();
        }
        if (this.linkedGrid.ownerCt && Ext.isFunction(this.linkedGrid.ownerCt.activate)) {
            this.linkedGrid.ownerCt.activate(this.linkedGrid);
		}
//        tbtext = this.linkedGrid.getTopToolbar().items.first();
//        if (tbtext)
            //Fresh.console.log(tbtext.getEl());
//           tbtext.getEl().innerHTML = '<span class="icon-action x-btn-text">Filter: '+n.getPath('text').substr(9)+'</span>';
       // Fresh.global.actions.filterNoAction.setText('<b>Filter: '+n.getPath('text').substr(11)+'</b>');

    },

    onActivate : function(p) {
        if (this.selectedRows) {
            this.linkedGrid.store.baseParams.filter = this.selectedRows.join(',');
            this.linkedGrid.store.baseParams.context = this.grid.id;
            this.linkedGrid.store.load();
        }
    }

}

Ext.preg('pmultigridlinker',Ext.ux.Plugin.MultiGridLinker);

Ext.ux.Plugin.FormToButtons = function() {}
Ext.ux.Plugin.FormToButtons.prototype = {
    init: function(form){
        var lf;
        Fresh.console.log('Plugin Ext.ux.Plugin.FormToButtons.init '+form.id);
        this.form = form;
 /*
        var lg = form.linkedGrid;
        if (lg) {
            lg = (Ext.isArray(lg)) ? lg : [lg];
            for (i=0; i<lg.length; i++) {
                if (typeof lg[i] == 'string') {
                    var grid = form.getComponent(lg[i]) ||  Ext.getCmp(lg[i]);
            if (grid) 
                        lg[i] = grid;
            else
                Ext.ComponentMgr.onAvailable(form.linkedGrid, function(lg){
                    form.linkedGrid = lg;
                }, this);
        }
            }
        }
   */
       if (form.formToButtonsConfig && form.formToButtonsConfig.form)
          lf = Ext.getCmp(form.formToButtonsConfig.form);

       lf = lf || form;
       lf.on('render',this.onFormLayout,this);
        
    },
    
    onFormLayout : function(form) {

        var butts = form.buttons;
        Fresh.console.log(butts);
        
        if (form.isXType('form'))
            form.getForm().on('actioncomplete',this.onActionComplete,form);
        
        if (butts) {
            for (var i = 0; i < butts.length; i++) {
                butts[i].form = form;
            }
        }

        if (butts = form.getTopToolbar()) {
//Fresh.console.log('Top Tool buts');
            if (butts = butts.items.getRange()) {
                for (var i = 0; i < butts.length; i++) {
                    butts[i].form = form;
//Fresh.console.log(butts[i]);
                }
            }

        }


        if (butts = form.getBottomToolbar()) {
            if (butts = butts.items.getRange()) {
                for (var i = 0; i < butts.length; i++) {
                    butts[i].form = form;
                }
            }
        }
        if (butts = form.contextMenu) {
            Fresh.console.log(butts);
            if (butts = butts.items) {
                for (var i = 0; i < butts.length; i++) {
                    butts[i].form = form;
                }
            }
        }

        lg = form.linkedGrid;
        lg = (Ext.isString(lg)) ? Ext.getCmp(lg) : lg;

        if (lg && Ext.isObject(lg)) {
            gs = form.findByType('autogrid');
            if (gs)
                lg.store.on('beforeload',this.onLinkedStoreLoad.createDelegate(this,[gs],true),this);
        }

        form.linkedGrid = lg;

    },
    
    onLinkedStoreLoad : function(store,options,gs) {
            for (i=0; i<gs.length; i++) {
                if (gs[i].linkToForm && (ds = gs[i].store)) {
                    ds.baseParams.context = store.baseParams.context;
                    ds.baseParams.filter = store.baseParams.filter;
                    ds.load({params: {meta: options.params.meta}});
                }
            }
    },

    onActionComplete : function(bform,action)
    {
        if (action.type == 'load')
        {
            MyDesktop.actions.save.enable();
            MyDesktop.actions.cancel.enable();
        }
    }

}
Ext.preg('pformtobuttons',Ext.ux.Plugin.FormToButtons);

Ext.ux.Plugin.SecureFormFields = function() {}
Ext.ux.Plugin.SecureFormFields.prototype = {
    init: function(form){

        Fresh.console.log('Plugin Ext.ux.Plugin.SecureFormFields.init '+form.id);
        this.form = form;

        form.on('render',this.onFormLayout,this,{single: true});

    },

    onFormLayout : function(form) {

        Fresh.console.log('Plugin Ext.ux.Plugin.SecureFormFields.onFormLayout '+form.id);
        if (form.isXType('form'))
            form.getForm().on('actioncomplete',this.onActionComplete,form);


    },

    onActionComplete : function(bform,action)
    {
        var tp,field,sec;
        Fresh.console.log('Plugin Ext.ux.Plugin.SecureFormFields.onActionComplete ');
        if (action.type == 'load' && action.result && (sec = action.result.security))
        {
            for (var i = 0; i < sec.length; i++) {
                field = bform.findField(sec[i].id) || this.find('itemId',sec[i].id) ;

                if (Ext.isEmpty(field))
                    field  = Ext.getCmp(sec[i].id);

                if (Ext.isEmpty(field))
                    field  = Ext.get(sec[i].id);
                    
                if (Ext.isEmpty(field))
                    continue;
                
                field = (Ext.isArray(field) && field.length>0) ? field[0] : field;
                if (field)
                {
                    if (sec[i].disable)
                        field.setDisabled(true);
                    else
                        if (field.disabled)
                            field.setDisabled(false);

                    if (field.ownerCt && field.ownerCt.getXType() == 'tabpanel') {
                        if (sec[i].hide)
                            field.ownerCt.hideTabStripItem(field);
                        else
                            field.ownerCt.unhideTabStripItem(field);
                    } else {
                        if (sec[i].hide)
                            field.hide();
                        else
                            if (field.hidden || sec[i].show)
                                field.show();
                    }

                    if (sec[i].activate && field.findParentByType && (tp = field.findParentByType('tabpanel'))) {
                            tp.activate(field);
                    }
                }
            }

        }
    }

}
Ext.preg('psecurefields',Ext.ux.Plugin.SecureFormFields);

Fresh.GridRender.giveEllipsisRenderer = function(n) {
    return function(v, p, record){
        if (v && typeof v.replace === 'function')
            v = v.replace(/\<br[^>]*>/,' ');
        return Ext.util.Format.ellipsis(v,n);
    } 
}
Fresh.GridRender.Ellipsis50Renderer = function(v, p, record){
    return Ext.util.Format.ellipsis(v,25);
}
Fresh.GridRender.StatusRenderer = function(v, p, record){
    if (!v || v=="0")
        return "";
    var store = Ext.StoreMgr.lookup('customer-status-store');
    if (store)
        var rec = store.getById(v);
        if (rec)
            return rec.get('Name');
    return v;
}

Fresh.GridRender.WeekDayRenderer = function(v, p, record){
    var store = Fresh.global.WeekDayStore;
    if (store)
        var rec = store.getById(v);
        if (rec)
            return rec.get('Abbrev');
 
    return v;
}

Fresh.GridRender.GroupComboRenderer = function(v, p, record){
    var store = Ext.StoreMgr.lookup('groups-store');
    if (store)
        var rec = store.getById(v);
        if (rec)
            return rec.get('Name');
 
    return v;
}

Fresh.GridRender.giveComboRenderer = function(storeName,displayField,field) {
    displayField = displayField || 'name';
    return function(v, p, record){
	    var rec,ri;
        var store = Ext.StoreMgr.lookup(storeName);
	    if (store) {
            store.clearFilter(true);
	        if (!field)
                rec = store.getById(v);
            else {
                ri = store.find(field,v);
                rec = (ri>-1)?store.getAt(ri):null;
            }
	        if (rec)
	            return rec.get(displayField) || rec.get('Name');
        }
	return (v=='0')?'':v;
    }
}

Fresh.GridRender.giveSuperComboRenderer = function(storeName,displayField,field) {
    displayField = displayField || 'name';
    return function(v, p, record){
	    var rec,ri;
        if (v===null) return null;
        var store = Ext.StoreMgr.lookup(storeName);
        v = (!Ext.isArray(v)) ? v.split(',') : v;
	if (store) {
            o = [];
            store.clearFilter(true);
            for(i=0;i<v.length;i++) {

                if (!field)
                    rec = store.getById(v[i]);
                else {
                    ri = store.find(field,v[i]);
                    rec = (ri>-1)?store.getAt(ri):null;
                }
                if (rec)
                    o.push(rec.get(displayField) || rec.get('Name'));
                else
                    o.push(v[i])
            }
            return o.join(',');
        }
	return v.join(',');
    }
}

Fresh.GridRender.giveTypeComboRenderer = function(storeName,displayField,field) {
    displayField = displayField || 'name';
    return function(v, meta, record){
	    var rec,ri;
        var store = Ext.StoreMgr.lookup(storeName);
	if (store) {
            store.clearFilter();
	    if (!field)
                rec = store.getById(v);
            else {
                ri = store.find(field,v);
                rec = (ri>-1)?store.getAt(ri):null;
            }
	        if (rec) {
	            var c = (rec.get('data'))?rec.get('data').iconCls:rec.get('t');
                  //  c =  + c;ux-icon-combo-item 
                    return '<div class="x-form-field-wrap"><span class="ux-icon-combo-icon '+c+'">&nbsp;</span>'+rec.get(displayField)+'</div>';// || rec.get('Name'); //'<span class="'+c+'"></span>'+
                }
        }
	    return v;
    }
}

Fresh.GridRender.CheckBoxRenderer = function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        var cls = 'x-grid3-check-col';
        var text = '';
        if (v === "1" || v === true) {
            cls += '-on';
        }
        else {
            cls += '-null';
        }
        return '<div class="'+cls+' x-grid3-cc"></div>';
    }


Fresh.global.UserRolesStore = new Ext.data.SimpleStore({
    id: 1,
    fields: ['Name','Uid'],
    data: [ ['SuperAdmin',1],['Admin',2] ],
    storeId: 'user-roles-store'
});

Fresh.global.CurrentOtherStore = new Ext.data.SimpleStore({
    id: 1,
    fields: ['Name','Uid'],
    data: [ ['CURRENT',1],['Other',0] ],
    storeId: 'fncycle-store'
});

Fresh.global.CurrentOtherNullStore = new Ext.data.SimpleStore({
    id: 1,
    fields: ['Name','Uid'],
    data: [ ['Any',null],['CURRENT',1],['Other',0] ],
    storeId: 'fncycle-store'
});

Fresh.global.YesNoStore = new Ext.data.SimpleStore({
    fields: ['Name','Uid'],
    data: [ [__('Yes'),'1'],[__('No'),'0'] ],
    storeId: 'yes-no-store'
});

Fresh.global.YesNoNullStore = new Ext.data.SimpleStore({
    fields: ['Name','Uid'],
    data: [ ['Any',null],['Yes','1'],['No','0'] ],
    storeId: 'yes-no-null-store'
});

/*
Fresh.global.ContactWayStore = new Ext.data.SimpleStore({
    id: 1,
    fields: [ 'Name','Uid' ],
    data:   [ ['Email',0],['Phone',1],['Text',2],['Other',3] ],
    storeId:     'contact-way-store'
});
*/

Fresh.global.WeekDayStore = new Ext.data.SimpleStore({
    id: 1,
    fields: [ 'Name','Uid','Abbrev'],
    data:   [ ['Sunday',0,'Sun'],['Monday',1,'Mon'],['Tuesday',2,'Tue'],['Wednesday',3,'Wed'],['Thursday',4,'Thu'],['Friday',5,'Fri'],['Saturday',6,'Sat'] ],
    storeId:     'week-day-store'
});
/*
 *
 
    // context menus

    var ctxMenu = new Ext.menu.Menu({
        id:'copyCtx',
        items: [{
                id:'expand',
                handler:expandAll,
                cls:'expand-all',
                text:'Expand All'
            },{
                id:'collapse',
                handler:collapseAll,
                cls:'collapse-all',
                text:'Collapse All'
            },'-',{
                id:'remove',
                handler:removeNode,
                cls:'remove-mi',
                text: 'Remove Item'
        }]
    });

    function prepareCtx(node, e){
        node.select();
        ctxMenu.items.get('remove')[node.attributes.allowDelete ? 'enable' : 'disable']();
        ctxMenu.showAt(e.getXY());
    }


 */

Fresh.grid.filterEditor = function(config) {
    Fresh.grid.filterEditor.superclass.constructor.call(this,config);
}

Ext.extend(Fresh.grid.filterEditor,Ext.ux.netbox.core.DynamicFilterModelView,{
    saveData: function(viewContext) {
        
            var that = this;
            var formParams = this.formBaseParams || {}

            var data = Ext.encode(this.filterModel.getFilterObj());

            if (data) {
                var options = {
                  url: formParams.url || Fresh.Config.Service.Form,
                  params: Ext.apply(formParams,{
                              action: 'store',
                              FilterObj: data
                          }),
                  success: function(response){
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            Fresh.Msg.SlideBox('Success!',result.message);
                        }
                        else {
                            Ext.MessageBox.alert('Error',result.message);
                        }
                        
                  },
                  failure: function() {
                      Ext.MessageBox.alert('Error','Error occured while saving filter.');
                  }
                };
                Ext.Ajax.request(options);
                delete options.params.FilterObj;
            }
        
        
    }
 });
 
 Ext.reg('filtermodeleditor',Fresh.grid.filterEditor);