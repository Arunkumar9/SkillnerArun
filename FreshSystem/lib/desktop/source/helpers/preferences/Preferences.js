MyDesktop.Preferences = Ext.extend(Ext.app.Module, {
	
	appType : 'preferences',
	id : 'preferences-win',
	
	actions : null,
	cards : [
		'pref-win-card-1', // navigation
		'pref-win-card-2', // quickstart
		'pref-win-card-3', // color and appearance
		'pref-win-card-4', // wallpaper
		'pref-win-card-5', // autorun
	],
	contentPanel : null,
	cardHistory : [
		'pref-win-card-1' // default
	],
	layout: null,
	win : null,
	
    init : function(){
        this.launcher = {
        	menuText: 'Preferences',
            text: 'Preferences',
            iconCls: 'icon-pref',
            handler : this.createWindow,
            scope: this
        }
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        this.win = desktop.getWindow('pref-win');
        
        if(!this.win){
        	var winWidth = 610;
			var winHeight = 440;
			
			var navigation = new Ext.Panel({
				bodyStyle: 'padding:15px',
				border: false,
				html: '<ul id="pref-nav-panel"> \
						<li> \
							<img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-autorun"/> \
							<a id="viewAutoRun" href="#">Auto Run Apps</a><br /> \
							<span>Choose which applications open automatically once logged in.</span> \
						</li> \
						<li> \
							<img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-quickstart"/> \
							<a id="viewQuickstart" href="#">Quick Start Apps</a><br /> \
							<span>Choose which applications appear in your Quick Start panel.</span> \
						</li> \
						<li> \
							<img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-appearance"/> \
							<a id="viewAppearance" href="#">Window Color and Appearance</a><br /> \
							<span>Fine tune window color and style of your windows.</span> \
						</li> \
						<li> \
							<img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-wallpaper"/> \
							<a id="viewWallpapers" href="#">Desktop Background</a><br /> \
							<span>Choose from available wallpapers or colors to decorate you desktop.</span> \
						</li> \
					</ul>',
				id: 'pref-win-card-1'
			});
			
			var autorun = MyDesktop.Preferences.AutoRun.init(this);
			var quickstart = MyDesktop.Preferences.QuickStart.init(this);
			var appearance = MyDesktop.Preferences.Appearance.init(this);
			var wallpaper = MyDesktop.Preferences.Background.init(this);
			
			this.contentPanel = new Ext.Panel({
				activeItem: 0,
                border: false,
				id: 'pref-win-content',
				items: [
                	navigation,
                	autorun,
                	quickstart,
                	appearance,
                	wallpaper
                ],
				layout: 'card',
				tbar: [{
					disabled: true,
                	handler: this.navHandler.createDelegate(this, [-1]),
                	id: 'back',
                	scope: this,
                	text: 'Back'
                },{
                	disabled: true,
                	handler: this.navHandler.createDelegate(this, [1]),
                	id: 'next',
                	scope: this,
                	text: 'Next'
                }]
			});
			
            this.win = desktop.createWindow({
            	animCollapse: false,
                constrainHeader: true,
                id: 'pref-win',
                height: winHeight,
                iconCls: 'icon-pref',
                items: this.contentPanel,
                layout: 'fit',
                shim: false,
                title: 'Preferences',
                width: winWidth
            });
            
			this.layout = this.contentPanel.getLayout();
            this.initActions();
	        
	        // listeners
			navigation.body.on({
				'mousedown': {
					fn: this.doAction,
					scope: this,
					delegate: 'a'
				},
				'click': {
					fn: Ext.emptyFn,
					scope: null,
					delegate: 'a',
					preventDefault: true
				}
			});
        }
        
        this.win.show();
    },
    
    doAction : function(e, t){
    	e.stopEvent();
    	this.actions[t.id](this);  // pass this app for scope
    },
    
    handleButtonState : function(){
    	var cards = this.cardHistory, activeId = this.layout.activeItem.id,
    		items = this.contentPanel.getTopToolbar().items, back = items.get(0), next = items.get(1);
    	
    	for(var i = 0, len = cards.length; i < len; i++){
    		if(cards[i] === activeId){
    			if(i <= 0){
    				back.disable();
    				next.enable();
    			}else if(i >= (len-1)){
    				back.enable();
    				next.disable();
    			}else{
    				back.enable();
    				next.enable();
    			}
    			break;
    		}
    	}
    },
    
    initActions : function(){
		this.actions = {
			'viewAutoRun' : function(app){
				app.viewCard('pref-win-card-5');
			},
			
			'viewQuickstart' : function(app){
	    		app.viewCard('pref-win-card-2');
	    	},
	    	
	    	'viewAppearance' : function(app){
	    		app.viewCard('pref-win-card-3');
	    	},
	    	
	    	'viewWallpapers' : function(app){
	    		app.viewCard('pref-win-card-4');
	    	}
	    }
	},
    
    navHandler : function(index){
    	var cards = this.cardHistory,
    		activeId = this.layout.activeItem.id,
    		nextId;
    	
    	for(var i = 0, len = cards.length; i < len; i++){
    		if(cards[i] === activeId){
    			nextId = cards[i+index];
    			break;
    		}
    	}
    	
    	this.layout.setActiveItem(nextId);
    	this.handleButtonState();
    },
    
    save : function(){
    	Ext.MessageBox.show({msg: 'Saving your data, please wait...', progressText: 'Saving...', width:300, wait:true, waitConfig: {interval:200}, icon:'desktop-download'});
	    	
	    var c = this.app.desktopConfig;

	    Ext.Ajax.request({
			url: 'source/helpers/preferences/Preferences.php',
			params: {
				task: 'save',
				autorun: Ext.encode(c.autorun),
				backgroundcolor: c.styles.backgroundcolor,
				quickstart: Ext.encode(c.quickstart),
				theme: c.styles.theme,
				transparency: c.styles.transparency,
				wallpaper: c.styles.wallpaper,
				wallpaperposition: c.styles.wallpaperposition
			},
			success: function(o){
				if(Ext.decode(o.responseText).success){
					Ext.MessageBox.hide();
				}else{
					Ext.MessageBox.hide();
					Ext.MessageBox.alert('Error', 'Errors encountered on the server.');
				}
			},
			failure: function(){
				Ext.MessageBox.hide();
				Ext.MessageBox.alert('Error', 'Lost connection to server.');	
			},
			scope: this
		});
	},
    
    viewCard : function(card){
		this.layout.setActiveItem(card);
	    if(this.cardHistory.length > 1){
	    	this.cardHistory.pop();
	    }
	    this.cardHistory.push(card);
	    this.handleButtonState();
	}
});



MyDesktop.Preferences.AutoRun = function(){
	var tree;
    
	function isChecked(id, ids){
		for(var i = 0, len = ids.length; i < len; i++){
			if(id == ids[i]){
				return true;
			}
		}
	}
			
	function expandNodes(ms, ids){
		var nodes = [];
		
		for(var i = 0, len = ms.length; i < len; i++){
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			if(o.menu){
				/* nodes.push({
					leaf: false,
					text: o.text || o.menuText,
					children: this.expandNodes(o.menu.items, ids)
				}); */
			}else{
				nodes.push({
		           	checked: isChecked(ms[i].id, ids) ? true : false,
		           	iconCls: ms[i].launcher.iconCls,
		           	id: ms[i].id,
		           	leaf: true,
		           	selected: true,
		           	text: o.text || o.menuText
				});
			}
		}
		
		return nodes;
	}

	function onCheckChange(node, checked){
		if(node.leaf && node.id){
    		if(checked){
				this.app.desktopConfig.autorun.push(node.id);
    		}else{
				var ids = this.app.desktopConfig.autorun,
					id = node.id,
					i = 0;
					
				while(i < ids.length){
					if(ids[i] == id){
						ids.splice(i, 1);
					}else{
						i++;
					}
				}
    		}
    	}
    	node.ownerTree.selModel.select(node);
    }
    
    function onClose(){
		this.owner.win.close();
	}
	
    function onSave(){
    	this.owner.save();
    }
	
	return {
		app : null,
		owner : null,
		
		init : function(owner){
			this.owner = owner;
			this.app = owner.app;
			
			var ms = this.app.modules,
				ids = this.app.desktopConfig.autorun,
				nodes = expandNodes(ms, ids);
				
			tree = new Ext.tree.TreePanel({
				autoScroll: true,
				bodyStyle: 'padding:10px',
				border: false,
				buttons: [{
					handler: onSave,
					scope: this,
					text: 'Save'
				},{
					handler: onClose,
					scope: this,
					text: 'Close'
				}],
				cls: 'pref-card pref-check-tree',
				id: 'pref-win-card-5',
				lines: false,
				listeners: {
					'checkchange': {
						fn: onCheckChange,
						scope: this
					}
				},
				loader: new Ext.tree.TreeLoader(),
				rootVisible: false,
				root: new Ext.tree.AsyncTreeNode({
					text: 'Auto Run Apps',
					children: nodes
				}),
				title: 'Auto Run Apps'
			});
			
			return tree;
		}
	};
}();



MyDesktop.Preferences.QuickStart = function(){
	var tree;
    
	function isChecked(id, ids){
		for(var i = 0, len = ids.length; i < len; i++){
			if(id == ids[i]){
				return true;
			}
		}
	}
			
	function expandNodes(ms, ids){
		var nodes = [];
		
		for(var i = 0, len = ms.length; i < len; i++){
			var o = ms[i].launcher ? ms[i].launcher : ms[i];
			if(o.menu){
				/* nodes.push({
					leaf: false,
					text: o.text || o.menuText,
					children: this.expandNodes(o.menu.items, ids)
				}); */
			}else{
				nodes.push({
		           	checked: isChecked(ms[i].id, ids) ? true : false,
		           	iconCls: ms[i].launcher.iconCls,
		           	id: ms[i].id,
		           	leaf: true,
		           	selected: true,
		           	text: o.text || o.menuText
				});
			}
		}
		
		return nodes;
	}
	
	function onCheckChange(node, checked){
		if(node.leaf && node.id){
    		if(checked){
				this.app.addQuickStartButton(node.id);
    		}else{
				this.app.removeQuickStartButton(node.id);
    		}
    	}
    	node.ownerTree.selModel.select(node);
    }
    
    function onClose(){
		this.owner.win.close();
	}
	
    function onSave(){
    	this.owner.save();
    }
	
	return {
		app : null,
		owner : null,
		
		init : function(owner){
			this.owner = owner;
			this.app = owner.app;
			
			var ms = this.app.modules,
				ids = this.app.desktopConfig.quickstart,
				nodes = expandNodes(ms, ids);
				
			tree = new Ext.tree.TreePanel({
				autoScroll: true,
				bodyStyle: 'padding:10px',
				border: false,
				buttons: [{
					handler: onSave,
					scope: this,
					text: 'Save'
				},{
					handler: onClose,
					scope: this,
					text: 'Close'
				}],
				cls: 'pref-card pref-check-tree',
				id: 'pref-win-card-2',
				lines: false,
				listeners: {
					'checkchange': {
						fn: onCheckChange,
						scope: this
					}
				},
				loader: new Ext.tree.TreeLoader(),
				rootVisible: false,
				root: new Ext.tree.AsyncTreeNode({
					text: 'Quick Start Apps',
					children: nodes
				}),
				title: 'Quick Start Apps'
			});
			
			return tree;
		}
	};
}();



MyDesktop.Preferences.Appearance = function(){
	
	var desktop,
		view;
	
	function onApply(){
		
	}
	
	function onClose(){
		this.owner.win.close();
	}
	
	function onSave(){
		this.owner.save();
	}
	
	function onSelectionChange(view, sel){
		if(sel.length > 0){
			var record = view.getRecord(sel[0]);
			
			if(record && record.id && record.data.path){
				var theme = {
					id: record.id,
					path: record.data.path
				};
			
				if(this.app.desktopConfig.styles.theme != theme.id){
					desktop.setTheme(theme);
				}
			}
		}
	}
	
	function toggleTransparency(field, checked){
		desktop.setTransparency(checked);
	}
	
	return {
		app : null,
		owner : null,
		
		init : function(owner){
			this.owner = owner;
			this.app = owner.app;
			desktop = this.app.getDesktop();
			
			var store = new Ext.data.JsonStore({
				baseParams: {
					task: 'load',
					what: 'themes'
				},
				fields: ['id', 'thumbnail', 'path'],
				id: 'id',
				root: 'images',
				url: 'source/helpers/preferences/Preferences.php'
			});
			
			store.on('load', function(store, records){
				if(records){
					defaults.setTitle('Themes Available (' + records.length + ')');
					
					var t = this.app.desktopConfig.styles.theme;
					if(t){
						view.select(t);
					}
				}				
			}, this);
			
			store.load();

			var tpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="pref-view-thumb-wrap" id="{id}">',
						'<div class="pref-view-thumb"><img src="{thumbnail}" title="{id}" /></div>',
					'<span>{shortName}</span></div>',
				'</tpl>',
				'<div class="x-clear"></div>'
			);
	
			view = new Ext.DataView({
				autoHeight:true,
				emptyText: 'No themes to display',
				itemSelector:'div.pref-view-thumb-wrap',
				loadingText: 'loading...',
				singleSelect: true,
				overClass:'x-view-over',
				prepareData: function(data){
					data.shortName = Ext.util.Format.ellipsis(data.id, 17);
					return data;
				},
				store: store,
				tpl: tpl
			});
			view.on('selectionchange', onSelectionChange, this);
			
			var defaults = new Ext.Panel({
				border: false,
				cls: 'pref-thumbnail-viewer',
				collapsible: true,
				id: 'pref-theme-view',
				items: view,
				title: 'Default Themes',
				titleCollapse: true
			});
			
			var themes = new Ext.Panel({
				autoScroll: true,
				bodyStyle: 'padding:10px',
				border: true,
				cls: 'pref-card-subpanel',
				id: 'themes',
				items: defaults,
				margins: '10 15 0 15',
				region: 'center'
			});
			
			var checkBox = new Ext.form.Checkbox({
				fieldLabel: 'Taskbar Transparency',
				checked: this.app.desktopConfig.styles.transparency ? true : false
			});
			checkBox.on('check', toggleTransparency, this);
			
			var formPanel = new Ext.FormPanel({
				bodyStyle: 'padding:15px',
				border: false,
				height: 70,
				items: checkBox,
				labelWidth: 135,
				split: false,
				region: 'south'
			});
			
			mainPanel = new Ext.Panel({
				border: false,
				buttons: [{
					handler: onSave,
					scope: this,
					text: 'Save'
				},{
					handler: onClose,
					scope: this,
					text: 'Close'
				}],
				cls: 'pref-card',
                id: 'pref-win-card-3',
				items: [
					themes,
					formPanel
				],
				layout: 'border',
				title: 'Window Color And Appearance'
			});
			
			return mainPanel;
		}
	};
}();



MyDesktop.Preferences.Background = function(){

	var colorDialog,
		desktop,
		mainPanel,
		position,
		view;
	
	function createRadio(value, checked){
		if(value){
			return new Ext.form.Radio({
				fieldLabel: '<img class="bg-pos-'+value+'" src="'+Ext.BLANK_IMAGE_URL+'" width="64" height="44" border="0" alt="" />',
				name: 'position',
				inputValue: value,
				listeners: {
					'render': {
						fn: fieldRendered,
						scope: this
					}
				},
				labelSeparator: '',
				checked: checked
			});
		}
	}
	
	// field is rendered, now we can attach listener to its el
	function fieldRendered(field){
		// will fire change immediately, no waiting for blur
		field.el.on("change", fieldChanged,  field);
	}
	
	function fieldChanged(){
		togglePosition(this, true);
	}
	
	function onApply(){
		// selected wallpaper
		if(view.getSelectionCount() > 0){
			var sel = view.getSelectedRecords(),
				imgName = sel[0].data.name;
			
			if(this.app.desktopConfig.styles.wallpaper != imgName){
				desktop.setWallpaper(imgName);
			}
		}
		
		// selected position
		var pos = position.form.getValues().position;
		desktop.setWallpaperPosition(pos);
	}
    
    function onChangeBgColor(){
    	colorDialog.show();
    }
    
	function onClose(){
		this.owner.win.close();
	}
	
	function onPickColor(p, hex){
		desktop.setBackgroundColor(hex);
	}
	
	function onSave(){
		this.owner.save();
	}
	
	function onSelectionChange(view, sel){
		if(sel.length > 0){
			var record = view.getRecord(sel[0]);
			
			if(record && record.id && record.data.path){
				var wallpaper = {
						id: record.id,
						path: record.data.path
					};
				
				if(this.app.desktopConfig.styles.wallpaper != wallpaper.id){
					desktop.setWallpaper(wallpaper);
				}
			}
		}
	}
	
	function togglePosition(field, checked){
		desktop.setWallpaperPosition(field.inputValue);
	}
	
	return {
		app : null,
		owner : null,
		
		init : function(owner){
			this.owner = owner;
			this.app = owner.app;
			desktop = this.app.getDesktop();
			
			colorDialog = new Ext.ux.ColorDialog({
				title: 'Background Color',
				closable: true,
				closeAction: 'hide',
				hsv: {
					h: 120,
					s: 20,
					v: 50
				},
				shadow: true,
				animate: true,
				modal: false,
				x: desktop.getWinX(390),
				y: desktop.getWinY(300)
			});
			colorDialog.on('pickcolor', onPickColor, this);
	
			var store = new Ext.data.JsonStore({
				baseParams: {
					task: 'load',
					what: 'wallpapers'
				},
				fields: ['id', 'thumbnail', 'path'],
				id: 'id',
				root: 'images',
				url: 'source/helpers/preferences/Preferences.php'
			});
			
			store.on('load', function(store, records){
				if(records){
					defaults.setTitle('Default Wallpapers (' + records.length + ')');
					
					var w = this.app.desktopConfig.styles.wallpaper;
					if(w){
						view.select(w);
					}
				}				
			}, this);
			
			store.load();

			var tpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="pref-view-thumb-wrap" id="{id}">',
						'<div class="pref-view-thumb"><img src="{thumbnail}" title="{id}" /></div>',
					'<span>{shortName}</span></div>',
				'</tpl>',
				'<div class="x-clear"></div>'
			);
	
			view = new Ext.DataView({
				autoHeight:true,
				emptyText: 'No wallpapers to display',
				itemSelector:'div.pref-view-thumb-wrap',
				loadingText: 'loading...',
				singleSelect: true,
				overClass:'x-view-over',
				prepareData: function(data){
					data.shortName = Ext.util.Format.ellipsis(data.id, 17);
					return data;
				},
				store: store,
				tpl: tpl
			});
			view.on('selectionchange', onSelectionChange, this);
			
			var defaults = new Ext.Panel({
				border: false,
				cls: 'pref-thumbnail-viewer',
				collapsible: true,
				id: 'pref-wallpaper-view',
				items: view,
				title: 'Default Wallpapers',
				titleCollapse: true
			});
			
			var wallpapers = new Ext.Panel({
				autoScroll: true,
				bodyStyle: 'padding:10px',
				border: true,
				cls: 'pref-card-subpanel',
				id: 'wallpapers',
				items: defaults,
				margins: '10 15 0 15',
				region: 'center'
			});
			
			var wpp = this.app.desktopConfig.styles.wallpaperposition;
			
			position = new Ext.FormPanel({
				autoScroll: true,
				bodyStyle: 'padding:15px;',
				border: false,
				height: 120,
				id: 'position',
				items: [{
						border: false,
						items: {border: false, html:'How should the wallpaper be positioned?'},
						style: 'margin-bottom:10px'
				},{
					border: false,
					layout:'column',
					items:[{
						border: false,
						columnWidth: .3,
						layout: 'form',
						items: createRadio('tile', wpp == 'tile' ? true : false),
						style: 'margin-right:10px'
					},{
						border: false,
						columnWidth: .3,
						layout: 'form',
						items: createRadio('center', wpp == 'center' ? true : false),
						style: 'margin-right:50px'
					},{
						border: false,
						columnWidth: .3,
						items: new Ext.Button({
							handler: onChangeBgColor,
							scope: this,
							text: 'Background color'
						}),
						style: 'margin-right:5px'
					}]
				}],
				labelWidth: 74,
				region: 'south',
				split: false,
				width: 'auto'
			});
			
			mainPanel = new Ext.Panel({
				border: false,
				buttons: [
					{handler: onSave, scope: this, text: 'Save'},
					//{handler: onApply, scope: this, text: 'Apply'},
					{handler: onClose, scope: this, text: 'Close'}
				],
				cls: 'pref-card',
                id: 'pref-win-card-4',
				items: [
					wallpapers,
					position
				],
				layout: 'border',
				title: 'Desktop Background'
			});
			
			return mainPanel;
		}
	};
}();



/* 
 * Will ensure that the checkchange event is fired on 
 * node double click
 */
Ext.override(Ext.tree.TreeNodeUI, {
	toggleCheck : function(value){		
        var cb = this.checkbox;
        if(cb){
            cb.checked = (value === undefined ? !cb.checked : value);
            this.fireEvent('checkchange', this.node, cb.checked);
        }
    }
});