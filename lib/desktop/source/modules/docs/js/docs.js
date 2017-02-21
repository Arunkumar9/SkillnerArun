MyDesktop.Docs = Ext.extend(Ext.app.Module, {
	
	appType : 'documentation',
	id : 'docs-win',
	
	// Link/Button actions
	actions : null,
	// Content panel
	cPanel : null,
	// Current component loaded into the content panel
	cComp : null,
	
    init : function(){
        this.launcher = {
        	menuText: 'Developer Docs',
            text: 'Developer Docs',
            iconCls: 'bogus',
            handler : this.createWindow,
            scope: this
        }
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('docs-win');
        
        if(!win){
        	var winWidth = desktop.getWinWidth() / 1.1;
			var winHeight = desktop.getWinHeight() / 1.1;
			
			var west = new Ext.Panel({
				border: false,
				collapsible: true,
				collapseMode: 'mini',
				html: '<ul id="pref-nav-panel"> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<a id="viewOverview" href="#">1. Overview</a> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<b>Getting Started</b> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<a id="viewCreateModule" href="#">1. Creating a module</a> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<a id="viewInitModules" href="#">2. Initilizing Modules</a> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<a id="viewDesktopConfig" href="#">3. Desktop Config</a> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<b>Additional Features</b> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<a id="viewMenuModules" href="#">1. Menu Modules</a> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<b>How To\'s</b> \
						</li> \
						<li> \
							<img src="css/images/s.gif" class="icon-blank"/> \
							<a id="viewLinkToModule" href="#">1. Link To Modules</a> \
						</li> \
					</ul>',
				id: 'docs-nav',
				region: 'west',
				split: true,
				width: 180
			});
			
			this.cPanel = new Ext.Panel({
				autoScroll: true,
				border: false,
				html: '<p>A work in progress.  Please browse...</p>',
				id: 'docs-content',
				layout: 'fit',
				region: 'center'
			});
			
            win = desktop.createWindow({
                animCollapse: false,
                constrainHeader: true,
                id: 'docs-win',
                height: winHeight,
                iconCls: 'bogus',
                items: [
                	west,
                	this.cPanel
                ],
                layout: 'border',
                shim: false,
                title: 'Developer Docs',
                width: winWidth
            });
            
            this.initActions();
	        
	        // listeners
	        var w = west.body;
			w.on('mousedown', this.doAction, this, {delegate:'a'});
			w.on('click', Ext.emptyFn, null, {delegate:'a', preventDefault:true});
        }
        
        win.show();
    },
    
    initActions : function(){
		this.actions = {
			'viewOverview' : function(app){
				app.cPanel.load({
	    			url: 'source/modules/docs/html/overview.html'
	    		});
			},
			
	    	'viewCreateModule' : function(app){
	    		app.cPanel.load({
	    			url: 'source/modules/docs/html/create-module.html'
	    		});
	    	},
	    	
	    	'viewInitModules' : function(app){
	    		app.cPanel.load({
	    			url: 'source/modules/docs/html/init-modules.html'
	    		});
	    	},
	    	
	    	'viewDesktopConfig' : function(app){
	    		app.cPanel.load({
	    			url: 'source/modules/docs/html/desktop-config.html'
	    		});
	    	},
	    	
	    	'viewMenuModules' : function(app){
	    		app.cPanel.load({
	    			url: 'source/modules/docs/html/menu-modules.html'
	    		});
	    	},
	    	
	    	'viewLinkToModule' : function(app){
	    		app.cPanel.load({
	    			url: 'source/modules/docs/html/link-to-module.html'
	    		});
	    	}
	    }
	},
	
	doAction : function(e, t){
    	e.stopEvent();
    	this.actions[t.id](this);  // pass this app for scope
    }
});