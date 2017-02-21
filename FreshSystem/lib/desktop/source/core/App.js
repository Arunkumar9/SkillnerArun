/*
 * Ext JS Library 2.0 Beta 2
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.app.App = function(cfg){
    Ext.apply(this, cfg);
    this.addEvents({
        'ready' : true,
        'beforeunload' : true
    });

  //  Ext.onReady(this.initApp, this);
};

Ext.extend(Ext.app.App, Ext.util.Observable, {
    isReady : false,
    modules : null, // Array of objects.  All initialized desktop modules
    startMenu : null,
	desktopConfig : null,

    initApp : function(){

        Ext.QuickTips.init();
    	// prevent backspace (history -1) shortcut
		var map = new Ext.KeyMap(document, [
		{
			key: Ext.EventObject.BACKSPACE,
			stopEvent: false,
			fn: function(key, e){
				var t = e.target.tagName;
				if(t != "INPUT" && t != "TEXTAREA"){
					e.stopEvent();
				}
			}
		}]);
		
    	this.startConfig = this.startConfig || this.getStartConfig();
        this.desktop = new Ext.Desktop(this);
		if (this.desktop.taskbar)
			this.startMenu = this.desktop.taskbar.startMenu;

		//this.modules = this.getModules();
        if(Fresh.ComponentList){
            this.initShortcuts(Fresh.ComponentList);
            this.initModules(Fresh.ComponentList);
            this.initDesktopConfig();
            this.init();
    
            Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
    		this.fireEvent('ready', this);
            this.isReady = true;
        }
        else {
            Ext.Ajax.request({
               url: Fresh.Config.Service.CmpList,
               waitMsg: 'Setting up applications',
               success: function(o) { 
                   var res = Ext.decode(o.responseText);
                   if (res.success) {
                       Fresh.ComponentList = res.result;
                       this.initShortcuts(Fresh.ComponentList);
                       this.initModules(Fresh.ComponentList);
                       this.initDesktopConfig();
                       this.init();
                       Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
               		   this.fireEvent('ready', this);
                       this.isReady = true;
                   }
               },
               scope: this
            });
        }

    },

	getModules : Ext.emptyFn,
    getStartConfig : Ext.emptyFn,
	getDesktopConfig : Ext.emptyFn,
    init : Ext.emptyFn,

    initShortcuts: function(ms) {
		var sc = Ext.get('x-shortcuts');
        if (sc) {
            var tpl = new Ext.XTemplate(
                    '<tpl for=".">',
					'<tpl if="!hideIcon">',
                    '<dt id="{name}-shortcut">',
                    '<img src="',Ext.BLANK_IMAGE_URL,'" />',
                    '<div>{text}</div>',
                    '</dt>',
					'</tpl>',
                    '</tpl>'
            );
            tpl.overwrite(sc, ms);            
        }
    },
    initModules : function(ms){
        this.modules = [];
		for(var i = 0, len = ms.length; i < len; i++){
            this.modules[i] =  new Ext.app.remoteModule({
                        id: ms[i].name, 
                        text: ms[i].text,
                        slideOnly: ms[i].slideOnly,
                        iconCls: ms[i].iconCls,
                        app: this
                    });        
//            this.modules[i].app = this;
        }
        var pref = new MyDesktop.Preferences();
        pref.app = this;
        this.modules.push(pref);
    },
    
    initDesktopConfig : function(o){
    	if(!o){
			this.getDesktopConfig();
		}else{
			this.desktopConfig = o;
			this.initAutoRun(o.autorun);
			this.initDesktopContextMenu(o.desktopcontextmenu);
			if (this.startMenu) {
				this.initStartMenu(o.startmenu);
				this.initQuickStart(o.quickstart);
			}
	        this.initStyles(o.styles);
		}
    },
    
    initAutoRun : function(mIdss){
        var mIds = Fresh.ComponentList;        
        var m;
        if(mIds){
    		for(var i = 0, len = mIds.length; i < len; i++){
	            if(mIds[i].autoRun && (m = this.getModule(mIds[i].name))){
	            	m.createWindow();
	            }
			}
		}
    },
    
    initDesktopContextMenu : function(mIds){
    	if(mIds){
    		for(var i = 0, len = mIds.length; i < len; i++){
	            var m = this.getModule(mIds[i]);
	            if(m){
		            if(m.appType == 'menu'){ // handle menu modules
		            	var items = m.items;
		            	for(var i = 0, len = items.length; i < len; i++){
		            		m.launcher.menu.items.push(this.getModule(items[i]).launcher);
		            	}
		            }
		            this.desktop.cmenu.add(m.launcher);
				}
	        }
    	}
    },
    
    initStartMenu : function(mIdss){
    	if(Fresh.ComponentList){	        
            var mIds = Fresh.ComponentList;
	        for(var i = 0, iLen = mIds.length; i < iLen; i++){
				var m = this.getModule(mIds[i].name);
	            if(m && !mIds[i].hideInStartMenu){
	            	var app = this;
	            	addItems(this.startMenu, m);
				}
	        }
		}
		
		function addItems(menu, m){ // recursive function, allows sub menus
			if(m.appType == 'menu'){
				var items = m.items;
				for(var j = 0, jLen = items.length; j < jLen; j++){
					var item = app.getModule(items[j]);
					if(item){
						addItems(m.menu, item);
					}
				}
			}
			if(m.launcher){
				menu.add(m.launcher);
			}		
		}
    },

	initQuickStart : function(mIds){
		if(mIds){
			for(var i = 0, len = mIds.length; i < len; i++){
	            var m = this.getModule(mIds[i]);
	            if(m){
	            	m.quickStartButton = this.desktop.taskbar.addQuickStartButton(m.launcher);
				}
	        }
		}
    },
    
    initStyles : function(s){
    	this.desktop.setBackgroundColor(s.backgroundcolor);
    	this.desktop.setTheme(s.theme);
    	this.desktop.setTransparency(s.transparency);
    	this.desktop.setWallpaper(s.wallpaper);
    	this.desktop.setWallpaperPosition(s.wallpaperposition);
    },
    
    getModule : function(name){
    	var ms = this.modules;
    	for(var i = 0, len = ms.length; i < len; i++){
    		if(ms[i].id == name || ms[i].appType == name){
    			return ms[i];
			}
        }
        return '';
    },
    
    addQuickStartButton : function(id){
    	var m = this.getModule(id);
		if(m && !m.quickStartButton){
			m.quickStartButton = this.desktop.taskbar.addQuickStartButton(m.launcher);
			
			// update desktopConfig
			this.desktopConfig.quickstart.push(id);
		}
    },
    
    removeQuickStartButton : function(id){
    	var m = this.getModule(id);
		if(m && m.quickStartButton){
			this.desktop.taskbar.removeQuickStartButton(m.quickStartButton);
			m.quickStartButton = null;
			
			// update desktopConfig
			var qs = this.desktopConfig.quickstart,
				i = 0;
			while(i < qs.length){
				if(qs[i] == id){
					qs.splice(i, 1);
				}else{
					i++;
				}
			}
		}
    },

    onReady : function(fn, scope){
        if(!this.isReady){
            this.on('ready', fn, scope);
        }else{
            fn.call(scope, this);
        }
    },

    getDesktop : function(){
        return this.desktop;
    },

    onUnload : function(e){
        if(this.fireEvent('beforeunload', this) === false){
            e.stopEvent();
        }
    }
});

