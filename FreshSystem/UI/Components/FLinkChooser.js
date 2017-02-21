/*
 * LinkChooser class
 * 
 * Fresh! Project
 * 
 * @copyright Jan Rosa, 2007
 * 
 * 
 * Inspired by Ext JS Library 1.0.1
 * 
 * http://www.extjs.com/license
 */

Ext.namespace('Fresh');

Fresh.LinkChooser = function(config){
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    // create the dialog from scratch
    var dlg = new Ext.LayoutDialog(config.id || Ext.id(), {
		autoCreate : true,
		minWidth:400,
		minHeight:200,
		syncHeightBeforeShow: true,
		shadow:true,
        fixedcenter:true,
        center:{autoScroll:true, titleBar: true,tabPosition: 'top', title: 'File tree', alwaysShowTabs: false},
		west:{split:false,initialSize:250, titleBar: true, title: 'Link properties' }
	});
	dlg.setTitle('Choose a Link');
	dlg.getEl().addClass('ychooser-dlg');
	dlg.addKeyListener(27, dlg.hide, dlg);
    
    // add some buttons
    this.ok = dlg.addButton('OK', this.doCallback, this);
//    this.ok.disable();
    dlg.setDefaultButton(dlg.addButton('Cancel', dlg.hide, dlg));
    dlg.on('show', this.load, this);
	this.dlg = dlg;
	
	// add the panels to the layout
	var layout = dlg.getLayout();
	layout.beginUpdate();
	var ff = layout.add('west', new Ext.ContentPanel(Ext.id(), {
		autoCreate : true,
		fitToFrame:true
	}));
	var fp = layout.add('center', new Ext.ContentPanel(Ext.id(), {
		autoCreate : true,
		title: 'File',
		fitToFrame:true
	}));
    layout.endUpdate();
	
//	fp.getEl().setStyle('padding', '10px');
	ff.getEl().setStyle('padding', '10px');

	//set up file tree
	var FileTree = Ext.ux.FileTreePanel;
    
    this.tree = new FileTree(fp.getEl(), {
        animate:true
		, iconPath: 'FreshSystem/images/icons/fam'
        , dataUrl: config.url
        , enableDD:true
        , containerScroll: true
		, uploadPosition: 'menu'
//		, edit: true
//		, sort: true
		, maxFileSize: 1048575
		, hrefPrefix: '/images/'
    });


	this.form = new Ext.form.Form({
			labelAlign: 'top',
	        labelWidth: 75,
        	waitMsgTarget: true //'msgTarget'			
			});
	this.form.add(
				new Ext.form.TextField({
		            fieldLabel: 'Name',
		            name: 'name',
		            width:220,
		            msgTarget: 'side',
		            allowBlank:true
		        })
				,new Ext.form.TextField({
		            fieldLabel: 'Url',
		            name: 'url',
		            width:220,
		            msgTarget: 'side',
		            allowBlank:false
		        })
				,new Ext.form.TextField({
		            fieldLabel: 'Target',
		            name: 'target',
		            width:220,
		            msgTarget: 'side',
		            allowBlank:true
		        })
	);
/*
	this.tree.loader.on({
			beforeload:{
				scope: this
				, fn: function(loader, node) {
					loader.baseParams.path = node.getPath();
				}
	}});

*/

    // set the root node
    this.root = new Ext.tree.AsyncTreeNode({
        text: 'Resources'
        , draggable:false
        , path:'root'
    });
    this.tree.setRootNode(this.root);

    // render the tree
    this.tree.render();
    this.root.expand();

	
	this.tree.un('dblclick');
	this.tree.on('dblclick',this.doCallback, this);
	this.tree.on('click',this.clk,this);
	this.tree.on('load',this.onTreeLoaded,this);
//	this.form.on('actioncomplete',this.onActionComplete,this);
	this.form.render(ff.getEl());

    Ext.apply(this, config, {
        width: 500, height: 300
    });

	dlg.resizeTo(this.width, this.height);
	dlg.restoreState();
	layout.restoreState();
	this.loaded = false;
};
Fresh.LinkChooser.prototype = {
	show : function(el, callback, d){
	    this.reset();
//		var a = Ext.state.Manager.get('FChooser-album');
//		a = (!a)?'root':a;
//		alert(a);
//		this.params = { album: a };
	    this.dlg.show(el);
		this.d = d;
		this.callback = callback;

//		this.tree.selectPath(a);
		
	},
	
	reset : function(){
//	    this.view.getEl().dom.scrollTop = 0;
//	    this.view.clearFilter();
//		this.txtFilter.dom.value = '';
//		this.view.select(0);
		this.loaded = false;
	},
	
	load : function(){
		if(!this.loaded){
			this.form.load({
				url:'index.php', 
				params: {
            			json: 'recordConvertor'
						,uid: this.d.Uid
						,action: 'load'
						,record: this.d.RecordClass
						,field: this.d.Field
						,type: this.d.Type
					}
				,waitMsg: 'Loading' });
			this.root.reload();
		}
	},
/*
	onActionComplete: function(f,a) {
//s			alert(Ext.encode(a.result.data));
		if (a.type == 'load' && a.result.success) {
	    	var values = a.result.data;
		    if(values instanceof Array){ // array of objects
    	        for(var i = 0, len = values.length; i < len; i++){
	                var v = values[i];
					if (v.id == 'path' && v.value != '') {
					alert(v.value);
						this.tree.selectPath(v.value);
						return;
					}
				}
            }
        } else { // object hash
			var path = a.result.data.path;
			if (path)
				this.tree.selectPath(path);
		}
	},

*/	clk : function(n) {
//			Ext.state.Manager.set('FChooser-album',n.getPath());
			//alert(n.getPath());
			var url = this.tree.getPath(n).replace(/root\//gi,this.tree.hrefPrefix) + this.tree.hrefSuffix;
			this.form.findField('url').setValue(url);
//			this.reset;
//			this.view.load({url: this.url, params: {album: n.getPath()}, callback:this.onLoad.createDelegate(this)});
	},

	onLoadException : function(v,o){
//	    this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>'); 
	},
	
	filter : function(){
		var filter = this.txtFilter.dom.value;
		this.view.filter('name', filter);
		this.view.select(0);
	},
	
	onLoad : function(){
		this.loaded = true;
//		this.view.select(0);
	},
	
	onTreeLoaded : function(){
		var a = Ext.state.Manager.get('FChooser-album');
		this.treeloaded = true;
		this.tree.selectPath(a);
	},

	sortImages : function(){
		var p = this.sortSelect.dom.value;
//    	this.view.sort(p, p != 'name' ? 'desc' : 'asc');
//    	this.view.select(0);
    },
	
	showDetails : function(view, nodes){
	    var selNode = nodes[0];
/*
		if(selNode && this.view.getCount() > 0){
			this.ok.enable();
		    var data = this.lookup[selNode.id];
            this.detailEl.hide();
            this.detailsTemplate.overwrite(this.detailEl, data);
            this.detailEl.slideIn('l', {stopFx:true,duration:.2});
			
		}else{
		    this.ok.disable();
		    this.detailEl.update('');
		}

*/	},
	
	doCallback : function(){
		var data = {
			url: this.form.findField('url').getValue()
			,name: this.form.findField('name').getValue()
			,target: this.form.findField('target').getValue()
		};
		var selNode = this.tree.getSelectionModel().getSelectedNode();
		if (selNode) {
			data.path = selNode.getPath();
		}
		var callback = this.callback;
		this.dlg.hide(function(){
            if(callback){
				callback(data);
			}
		});

	}
};

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};