/**
 * 
 * 
 *  * @author rosa
 */
Ext.namespace('Fresh');
Fresh.PANEL_COUNT = 1;
Fresh.FExtTree =  {
	
	init: function(cfg){

	var config = {
		url: 'index.php',
//		params: {json: 'treenodes'}
		storeParams: 'storeContainer',
		rootName: 'root'
	}
	Ext.apply(config,cfg);

	var storeParams = config.storeParams;
	var panel = Ext.get(config.panelID);
	
    // shorthand
    var Tree = Ext.tree;
    var tree = new Tree.TreePanel(panel, {
        animate:true, 
        loader: new Tree.TreeLoader({dataUrl: config.url, baseParams: config.params}),
        enableDD:true,
        containerScroll: true
    });

    // set the root node
    var root = new Tree.AsyncTreeNode({
        text: config.rootName,
        draggable:false,
        allowDrop: true,
        id:'root',
        iconCls: config.iconCls || config.rootName,
        expanded: 'true'
    });
    tree.setRootNode(root);
    tree.render();
    root.expand();
    
    // context menus
    var ctxMenu = new Ext.menu.Menu({
        id:'copyCtx',
        items: [
			// node name we're working with placeholder
			{ id:'nodename', disabled:true, cls:'x-filetree-nodename'},
			{
 		        id:'openInNewPanel',
        		handler: openInNewPanel, 
		        cls:'tab-add',
		        text:'Otevřít v novém panelu'
            },'-',{
                id:'insertAfter',
                handler: insertAfter, //insertNewContent,
                cls:'add',
                text:'Nová strana'
            },{
                id:'insertIn',
                handler: insertIn, //insertNewContent,
                cls:'add',
                text:'Nová strana do'
            },{
                id:'insertContent',
                handler: insertContent, //insertNewContent,
                cls:'add',
                text:'Nový článek'
            },{
                id:'insert',
                handler: insert, //insertNewContent,
                cls:'add',
                text:'Nový'
            },'-',{
                id:'remove',
                handler: remove, //deleteContent,
                cls:'remove',
                text:'Odstranit'
            },{
                id:'modify',
                handler: modify, 
                cls:'modify',
                text:'Upravit'
            },'-',{
        		id:'reload',
		        text:'Obnovit',
        		handler:nodeReload,
		        cls:'reload'
            }        ]
    });
   // panel.on('activate', this.onActivated.createDelegate(this, ['panel-foo'], 0);
    
    //alert();
	// create the primary toolbar
	var tbDiv = Ext.DomHelper.insertBefore(panel,{tag: 'div',id: 'tb'+config.panelid });
    var tb = new Ext.Toolbar(tbDiv); //
    tb.add({
        id:'reload-tb',
        text:'Obnovit',
        handler:nodeReload,
        cls:'x-btn-text-icon reload',
        tooltip:'Obnovit prvek ze serveru'
    },'-',{
        id:'expand',
        handler:expandAll,
        cls:'x-btn-text-icon expand-all',
        text:'Rozbalit vše',
        tooltip:'Rozbalit všechny strany'
    },'-',{
        id:'collapse',
        handler:collapseAll,
        cls:'x-btn-text-icon collapse-all',
        text:'Sbalit vše',
        tooltip:'Sbalit všechny strany'
/*
         id:'modify'
         handler: modify, 
    	 cls:'x-btn-text-icon modify',
         text:'Upravit',
        tooltip:'Upravit zvolený prvek'
	},'-',{
        id:'remove',
        text:'Odstranit',
        disabled:true,
        handler:remove, //removeNode,
        cls:'x-btn-text-icon remove',
        tooltip:'Odstranit zvolený prvek'

*/    });
    // for enabling and disabling
    var btns = tb.items.map;

    tree.on('contextmenu', prepareCtx);    	
	function prepareCtx(node, e){
        node.select();
        rc = node.attributes.recordClass;
        if (!rc)
        	return;
        if (rc == 'ContainerRecord')
        {
        	ctxMenu.items.get('insertAfter').show();
        	ctxMenu.items.get('insertIn').show();
        	ctxMenu.items.get('insertContent').show();
        	ctxMenu.items.get('openInNewPanel').show();
        	ctxMenu.items.get('insert').hide();
        } else {
        	ctxMenu.items.get('insertAfter').hide();
        	ctxMenu.items.get('insertIn').hide();
        	ctxMenu.items.get('insertContent').hide();
        	ctxMenu.items.get('insert').show();
        	ctxMenu.items.get('openInNewPanel').hide();
        }

		// set menu item text to node text
		//var itemNodename = ctxMenu.items.get('nodename');
		ctxMenu.items.get('nodename').setText(Ext.util.Format.ellipsis(node.text, 25)+' ['+node.attributes.uid+']');

        ctxMenu.showAt(e.getXY());
    }
    
//	tree.on('beforemove', function(t,n,oldParent, newParent, index) {
//		Ext.MessageBox.confirm('Potvrďte', 'Přesunout prvek '+n.text+'?', function(btn){ return (btn=='yes'); } );
//    });
    
    tree.on('move',function(t, n, oldParent, newParent, index) {
        var ch = [];
        if (n.previousSibling != null)
        	ps = n.previousSibling.id;
        else
        	ps = null;
        	 
        var cmp = {
                name: n.text,
                parent: oldParent.id,
                newParent: newParent.id,
                previousSibling: ps,
                recordClass: n.attributes.recordClass,
                id: n.id,
                index: index,
                how: 'move'
            };
        ch.push(cmp);
        n.select();
        //Ext.MessageBox.wait('Saving...');
        //mask = Ext.LoadMask('massk',{ msg: 'Saving...', removeMask: false })
		Ext.lib.Ajax.request(
            'POST',
            'index.php',
            { success: function() { nodeReload(); } , failure: function() { Ext.MessageBox.Alert('Chyba při ukládání!'); }},
            'json='+storeParams+'&data='+encodeURIComponent(Ext.encode(ch))
        );    
        
    });

	
    function collapseAll(){
        ctxMenu.hide();
        setTimeout(function(){
            root.eachChild(function(n){
               n.collapse(false, false);
            });
        }, 10);
    }

	function remove(){ 
		n = sm.getSelectedNode();
		if (n.isLeaf() || n.attributes.emptyFolder)
			prompt = Ext.MessageBox.confirm('Potvrďte', 'Odstranit prvek '+n.text+'?', function(btn){ if (btn=='yes') saveResult(btn, '','delete'); } );
		else
			Ext.MessageBox.alert('Chyba!','Nelze odstranit - obsahuje další strany.');
	}

	function insertContent(){ 
		var n = sm.getSelectedNode();
		var ff = 'ContentRecord';
		var fff = Fresh.DialogRepository[ff];
		var p = n.parentNode.attributes.uid; 
		fff.config.uid = null;
		fff.config.parent_id = p;
		fff.setTitle('- nový');
		fff.show('dlg');
		fff.form.on('actioncomplete',function(f,a) { if (a.type=='submit') { nodeReload(); } },this);
	}

	function insertIn(){ 
		var n = sm.getSelectedNode();
		var ff = n.attributes.recordClass;
		var fff = Fresh.DialogRepository[ff];
		var p = n.attributes.uid; 
		fff.config.uid = null;
		fff.config.parent_id = p;
		fff.setTitle('- nová do');
		fff.show('dlg');
		fff.form.on('actioncomplete',function(f,a) { if (a.type=='submit') { nodeReload(); } },this);
	}

	function insert(){ 
		var n = sm.getSelectedNode();
		var ff = n.attributes.recordClass;
		var fff = Fresh.DialogRepository[ff];
		var p = n.parentNode.attributes.uid; 
		fff.config.uid = null;
		fff.config.parent_id = p;
		fff.setTitle('- nový');
		fff.show('dlg');
		fff.form.on('actioncomplete',function(f,a) { if (a.type=='submit') { nodeReload(); } },this);
	}

	function insertAfter(){ 
		var n = sm.getSelectedNode();
		var ff = n.attributes.recordClass;
		var fff = Fresh.DialogRepository[ff];
		var p = n.parentNode.attributes.uid; 
		fff.config.uid = null;
		fff.config.parent_id = p;
		fff.setTitle('- nová');
		fff.show('dlg');
		fff.form.on('actioncomplete',function(f,a) { if (a.type=='submit') { nodeReload(); } },this);
	}

	function modify()
	{
		var n = sm.getSelectedNode();
		var ff = n.attributes.recordClass;
		var p = n.parentNode.attributes.uid;
		var fff = Fresh.DialogRepository[ff]; 
		fff.config.parent_id = p;
		fff.config.uid = n.attributes.uid;
		fff.setTitle('- vlastnosti');
		fff.show('dlg');
		fff.form.on('actioncomplete',function(f,a) { if (a.type=='submit') { nodeReload(); } },this);
	}
	
    function expandAll(){
        ctxMenu.hide();
        setTimeout(function(){
            root.eachChild(function(n){
               n.expand(false, false);
            });
        }, 10);
    }
    
	function openInNewPanel()
	{
		var n = sm.getSelectedNode();
		var cdiv = Ext.DomHelper.append(document.body, {tag: 'div',id:'center'+Fresh.PANEL_COUNT,visibility: 'hidden'});
		var ciframe = Ext.DomHelper.insertFirst(cdiv, {tag: 'iframe', frameBorder: 0, name:'center'+Fresh.PANEL_COUNT+'-iframe', id:'center'+Fresh.PANEL_COUNT+'-iframe'});
		var mainLayout = Fresh.Layout;
		mainLayout.beginUpdate();
		mainLayout.add('center', centerPanel1 = new Ext.ContentPanel('center'+Fresh.PANEL_COUNT, {
         		fitToFrame: true,autoScroll: true, resizeEl: 'center'+Fresh.PANEL_COUNT+'-iframe', 
                 title: n.text,closable: true
            }));
		mainLayout.getRegion('center').showPanel('center'+Fresh.PANEL_COUNT);
    	mainLayout.endUpdate();
		n.attributes.hrefTarget = 'center-iframe'+Fresh.PANEL_COUNT;
       setTimeout(function(){

			Ext.get('center'+Fresh.PANEL_COUNT+'-iframe').dom.src = Ext.util.Format.htmlDecode(n.attributes.href); //.replace('&amp;','&');
			Fresh.PANEL_COUNT = 1 + Fresh.PANEL_COUNT;
        }, 10);
	}
	// for enabling and disabling
//    var btns = ctxMenu.items.map;


    // when the tree selection changes, enable/disable the toolbar buttons
    var sm = tree.getSelectionModel();
	sm.on('selectionchange',function() { n=sm.getSelectedNode(); if (!n) {
										//btns.modify.disable(); //btns.remove.disable();
										} else { 
										//btns.modify.enable(); //btns.remove.enable(); 
										}
								});

	tree.on('beforeclick',function(n,e){
		var ap = Fresh.Layout.getRegion('center').getActivePanel();
		ap.setTitle(n.text);
		n.attributes.hrefTarget = ap.getId()+'-iframe';
		n.ui.getAnchor().target = n.attributes.hrefTarget;
		return true;
	});
    // create the editor for the component tree
//    var ge = new Tree.TreeEditor(tree, {
//        allowBlank:false,
//        blankText:'Nutne vyplnit',
        //selectOnFocus:true
    //});
    
//    ge.on('beforestartedit', function(){
        //if(!ge.editNode.attributes.allowEdit){
        //    return false;
        //}
//    });

   function saveResult(btn, text, how){
        var ch = [];
        var n = sm.getSelectedNode();
        var cmp = {
                name:text,
                parent: n.parentNode.attributes.id,
                recordClass: n.attributes.recordClass,
                id: n.id,
                how: how
            };
        ch.push(cmp);
		Ext.lib.Ajax.request(
            'POST',
            'index.php',
            { success: nodeReload, failure: function() { Ext.MessageBox.Alert('Chyba!'); }},
            'json='+storeParams+'&data='+encodeURIComponent(Ext.encode(ch))
        );    
    };
    
   function saveMove(n,oldParent,newParent,index){
        var ch = [];
        if (n.previousSibling != null)
        	ps = n.previousSibling.id
        else
        	ps = null;
        var cmp = {
                name: n.text,
                parent: oldParent.attributes.uid,
                newparent: newParent.attributes.uid,
                recordClass: n.attributes.recordClass,
                previousSibling: ps,
                id: n.attributes.uid,
                index: index,
                how: 'move'
            };
        ch.push(cmp);
		Ext.lib.Ajax.request(
            'POST',
            'index.php',
            { success: nodeReload, failure: function() { Ext.MessageBox.Alert('Chyba při ukládání!'); }},
            'json='+storeParams+'&data='+encodeURIComponent(Ext.encode(ch))
        );    
        
    };
    
    function nodeReload() {
    	//if (typeof(n)=='undefined' || typeof(n.parentNode)=='undefined')
	    n = sm.getSelectedNode();
	    	
    	if (n == null || n.id == 'root') {
    		root.reload();
    		//alert('root reload');
    		return;
    	}
    	if (typeof(n) != 'undefined' && typeof(n.parentNode) != 'undefined') {
    		//var id = n.id;
    		//var parentNode = n.parentNode;
    		//alert(n.id+' reload');
    		n.parentNode.reload();
    		//alert(parentNode.id);
    		//n = parentNode.findChild('id',id);
    	}
    	
    }

	}
}


