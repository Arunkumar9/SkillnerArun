/*
 * Ext JS Library 1.0.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */

var ImageChooser = function(config){
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    // create the dialog from scratch
    var dlg = new Ext.LayoutDialog(config.id || Ext.id(), {
		autoCreate : true,
		minWidth:400,
		minHeight:300,
		syncHeightBeforeShow: true,
		shadow:true,
        fixedcenter:true,
        center:{autoScroll:true},
		east:{split:true,initialSize:200,minSize:150,maxSize:250},
		west: {split:true,initialSize:150,minSize:150,maxSize:250,collapsed:false,collapsible: true}
	});
	dlg.setTitle('Choose an Image');
	dlg.getEl().addClass('ychooser-dlg');
	dlg.addKeyListener(27, dlg.hide, dlg);
    
    // add some buttons
    this.ok = dlg.addButton('OK', this.doCallback, this);
    this.ok.disable();
    dlg.setDefaultButton(dlg.addButton('Cancel', dlg.hide, dlg));
    dlg.on('show', this.load, this);
	this.dlg = dlg;
	var layout = dlg.getLayout();
	
	// filter/sorting toolbar
	this.tb = new Ext.Toolbar(this.dlg.body.createChild({tag:'div'}));
	this.sortSelect = Ext.DomHelper.append(this.dlg.body.dom, {
		tag:'select', children: [
			{tag: 'option', value:'name', selected: 'true', html:'Name'},
			{tag: 'option', value:'size', html:'File Size'},
			{tag: 'option', value:'lastmod', html:'Last Modified'}
		]
	}, true);
	this.sortSelect.on('change', this.sortImages, this, true);
	
	this.txtFilter = Ext.DomHelper.append(this.dlg.body.dom, {
		tag:'input', type:'text', size:'12'}, true);
		
	this.txtFilter.on('focus', function(){this.dom.select();});
	this.txtFilter.on('keyup', this.filter, this, {buffer:500});
	
	this.tb.add('Filter:', this.txtFilter.dom, 'separator', 'Sort By:', this.sortSelect.dom);
	
	// add the panels to the layout
	layout.beginUpdate();
	var fp = layout.add('west', new Ext.ContentPanel(Ext.id(), {
		autoCreate : true,
//		toolbar: this.tb,
		fitToFrame:true
	}));
	var vp = layout.add('center', new Ext.ContentPanel(Ext.id(), {
		autoCreate : true,
		toolbar: this.tb,
		fitToFrame:true
	}));
	var dp = layout.add('east', new Ext.ContentPanel(Ext.id(), {
		autoCreate : true,
		fitToFrame:true
	}));
    layout.endUpdate();
	
	//set up album tree
	var Tree = Ext.tree;
    
    this.tree = new Tree.TreePanel(fp.getEl(), {
        animate:true, 
        loader: new Tree.TreeLoader({
            dataUrl: config.url,
			baseParams: { cmd: 'get'  } //json: 'imagesProvider',
        }),
        enableDD:false,
        containerScroll: true
    });
	this.tree.loader.on({
			beforeload:{
				scope: this
				, fn: function(loader, node) {
					loader.baseParams.path = node.getPath();
				}
	}});

    // set the root node
    this.root = new Tree.AsyncTreeNode({
        text: 'Images',
        draggable:false,
        id:'root'
    });
    this.tree.setRootNode(this.root);

    // render the tree
    this.tree.render();
    this.root.expand();

	
	this.tree.on('click',this.clk,this);
	this.tree.on('load',this.onTreeLoaded,this);

	var bodyEl = vp.getEl();
	bodyEl.appendChild(this.tb.getEl());
	var viewBody = bodyEl.createChild({tag:'div', cls:'ychooser-view'});
	vp.resizeEl = viewBody;
	
	this.detailEl = dp.getEl();
	
	// create the required templates
	this.thumbTemplate = new Ext.Template(
		'<div class="thumb-wrap" id="{name}">' +
		'<div class="thumb"><img src="{url}" title="{name}"></div>' +
		'<span>{shortName}</span></div>'
	);
	this.thumbTemplate.compile();	
	
	this.detailsTemplate = new Ext.Template(
		'<div class="details"><img src="{url}"><div class="details-info">' +
		'<b>Image Name:</b>' +
		'<span>{name}</span>' +
		'<b>Size:</b>' +
		'<span>{sizeString}</span>' +
		'<b>Last Modified:</b>' +
		'<span>{dateString}</span></div></div>'
	);
	this.detailsTemplate.compile();	
    
    // initialize the View		
	this.view = new Ext.JsonView(viewBody, this.thumbTemplate, {
		singleSelect: true,
		jsonRoot: 'images',
		emptyText : '<div style="padding:10px;">No images match the specified filter</div>'
	});
    this.view.on('selectionchange', this.showDetails, this, {buffer:100});
    this.view.on('dblclick', this.doCallback, this);
    this.view.on('loadexception', this.onLoadException, this);
    this.view.on('beforeselect', function(view){
        return view.getCount() > 0;
    });

    Ext.apply(this, config, {
        width: 640, height: 400
    });
    
    var formatSize = function(size){
        if(size < 1024) {
            return size + " bytes";
        } else {
            return (Math.round(((size*10) / 1024))/10) + " KB";
        }
    };
    
    // cache data by image name for easy lookup
    var lookup = {};
    // make some values pretty for display
    this.view.prepareData = function(data){
    	data.shortName = data.name.ellipse(15);
    	data.sizeString = formatSize(data.size);
    	data.dateString = new Date(data.lastmod).format("m/d/Y g:i a");
    	lookup[data.name] = data;
    	return data;
    };
    this.lookup = lookup;
    
	dlg.resizeTo(this.width, this.height);
	dlg.restoreState();
	//layout.restoreState();
	this.loaded = false;
};
ImageChooser.prototype = {
	show : function(el, callback){
	    this.reset();
		var a = Ext.state.Manager.get('FChooser-album');
		a = (!a)?'root':a;
//		alert(a);
		this.params = { album: a };
	    this.dlg.show(el);
		this.callback = callback;

		this.tree.selectPath(a);
		
	},
	
	reset : function(){
	    this.view.getEl().dom.scrollTop = 0;
	    this.view.clearFilter();
		this.txtFilter.dom.value = '';
		this.view.select(0);
		this.loaded = false;
	},
	
	load : function(){
		if(!this.loaded){
			this.view.load({url: this.url, params: this.params, callback:this.onLoad.createDelegate(this)});
			this.root.reload();
		}
	},
	
	clk : function(n) {
			Ext.state.Manager.set('FChooser-album',n.getPath());
			//alert(n.getPath());
			this.reset;
			this.view.load({url: this.url, params: {album: n.getPath()}, callback:this.onLoad.createDelegate(this)});
	},

	onLoadException : function(v,o){
	    this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>'); 
	},
	
	filter : function(){
		var filter = this.txtFilter.dom.value;
		this.view.filter('name', filter);
		this.view.select(0);
	},
	
	onLoad : function(){
		this.loaded = true;
		this.view.select(0);
	},
	
	onTreeLoaded : function(){
		var a = Ext.state.Manager.get('FChooser-album');
		this.treeloaded = true;
		this.tree.selectPath(a);
	},

	sortImages : function(){
		var p = this.sortSelect.dom.value;
    	this.view.sort(p, p != 'name' ? 'desc' : 'asc');
    	this.view.select(0);
    },
	
	showDetails : function(view, nodes){
	    var selNode = nodes[0];
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
	},
	
	doCallback : function(){
        var selNode = this.view.getSelectedNodes()[0];
		var callback = this.callback;
		var lookup = this.lookup;
		this.dlg.hide(function(){
            if(selNode && callback){
				var data = lookup[selNode.id];
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