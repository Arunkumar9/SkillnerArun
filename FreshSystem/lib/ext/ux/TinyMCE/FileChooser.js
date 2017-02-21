var FileChooser = function(config) {
	// Setup a variable for the current directory
	this.current_directory;
	
	/* ---- Begin side_navbar tree --- */
	/* ---- Begin side_navbar tree --- */
	this.tree = new Ext.ux.FileTreePanel({
		region: 'west',
                id: 'filechooser-west-panel',
		width: 150,
		minSize: 150,
		maxSize: 250,
		animate: true,
                url: 'index.php?json=fileProvider',
		enableDD: true,
                autoScroll: true,
		containerScroll: true,
		rootVisible:true,
                enableOpen:false,
                maxFileSize:2524288,
                rootText: __('images'),

                layout: 'fit',
                baseParams: {panel: 'images', onlyDir: 1},
		listeners: {
			
			'click': function(node, e) {
                                  current_directory = node.attributes.uid;
                                  Fresh.console.log(node);
                                  ds = Ext.StoreMgr.lookup('filemanager-store');
                                  ds.load({
                                    params: {
                                      filter: this.getPath(node),
                                      context: 'filechooser-west-panel',
                                      meta: true
                                      }
                                  });
			}
		}
	});
	
	// Add a tree sorter in folder mode
	//new Ext.tree.TreeSorter(this.tree, {folderSort: true});
	/* ---- End side_navbar tree --- */

	/* ---- Begin dataview --- 
	this.ds = new Fresh.data.ViewProvider({
                id: 'filechooser-store'
                ,baseParams: {view: 'filemanager-view',meta: true }
                ,remoteSort: false
                ,autoLoad: true
            });
	*/
        this.ds = Ext.StoreMgr.lookup('filemanager-store');
	/* ---- Begin grid --- */
	this.grid = new Ext.ux.AutoGridPanel({
		region: 'center',
                id: 'filechooser-grid',
		border: false,
                loadMask: true,
                stripeRows: true,
		viewConfig: {
                    emptyText: 'This folder contains no files.',
		    forceFit: true
                    }
		,
		store: this.ds,
                noStorePreload: false,
                sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
		listeners: {
			scope: this,
			'rowdblclick': this.doCallback
		},
                tbar: new Ext.Toolbar({}) ,
                plugins: [
                    new Ext.ux.grid.Search({
                             iconCls:'icon-viewmag'
                             ,minChars:2
                             ,width: 200
                             ,position: 'top'
                             ,showSelectAll: false
                             ,mode: 'local'
                             ,align: 'right'
                             ,checkIndexes: ['name']
                             //,toolbarContainer: 'FileChooser'
                             ,autoFocus:false
                             })
                ]
	});
	/* ---- End grid --- */
	
	/* ---- Begin window --- */
	this.popup = new Ext.Window({
		id: 'FileChooser',
		title: 'Choose A File',
		width: config.width,
		height: config.height,
		minWidth: config.width,
		minHeight: config.height,
                tbar: new Ext.Toolbar({}) ,
		layout: 'border',
		items: [
			this.tree,
			this.grid
		],
		buttons: [{
			text: 'Ok',
			scope: this,
			handler: this.doCallback
		},{
			text: 'Cancel',
			scope: this,
			handler: function() {
				this.popup.hide();
			}
		}]
	});
	/* ---- End window --- */
};

FileChooser.prototype = {
	show : function(el, callback) {
		if (Ext.type(el) == 'object') {
			this.showEl = el.getEl();
		} else {
			this.showEl = el;
		}
		
		this.el = el;
		this.popup.show(this.showEl);
		this.callback = callback;
	},
	
	doCallback : function() {
		var row = this.grid.getSelectionModel().getSelected();
		var callback = this.callback;
		var el = this.el;
		this.popup.close();
		//this.popup.hide(this.showEl, function() {
			if (row && callback) {
				var data = row.data.web_path;
				callback(el, data);
			}
		//});
	}
};