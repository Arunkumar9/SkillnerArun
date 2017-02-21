/*
 * Ext JS Library 2.0
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */



// Use our blank image
Ext.BLANK_IMAGE_URL = 'lib/desktop/resources/images/default/s.gif';

//if (typeof(console)=='undefined') {
  //    var console = {};
   //  Fresh.console.log = function(){};
//}


Ext.Desktop = function(app){
	
	var desktopEl = Ext.get('x-desktop');
    var taskbarEl = Ext.get('ux-taskbar');
    var shortcuts = Ext.get('x-shortcuts');
	
	if (taskbarEl) {
		this.taskbar = new Ext.ux.TaskBar(app);
		var taskbar = this.taskbar;
                
	}

    var windows = new Ext.WindowGroup();
    windows.zseed = 7000;
    var activeWindow;
		
    function minimizeWin(win){
        win.minimized = true;
        win.hide();
    }

    function markActive(win){
        if(activeWindow && activeWindow != win){
            markInactive(activeWindow);
        }
        if (taskbar)
			taskbar.setActiveButton(win.taskButton);
        activeWindow = win;
        if (win.taskButton)
			Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;
    }

    function markInactive(win){
        if(win == activeWindow && win.taskButton){
            activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    }

    function removeWin(win){
    	if (win.taskButton)
			taskbar.removeTaskButton(win.taskButton);
        layout();
    }

    function layout(){
        if (taskbarEl)
			desktopEl.setHeight(Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight());
		else
			desktopEl.setHeight(Ext.lib.Dom.getViewHeight());
    }
    Ext.EventManager.onWindowResize(layout);

    this.layout = layout;

    this.createWindow = function(config, cls){
    	var win = new (cls||Ext.Window)(
            Ext.applyIf(config||{}, {
                manager: windows,
                minimizable: true,
                maximizable: true
            })
			
        );
        win.render(desktopEl);
        if (!win.noTaskButton && !win.neverShow && taskbarEl) {
            win.taskButton = taskbar.addTaskButton(win); }

        win.cmenu = new Ext.menu.Menu({
            items: [

            ]
        });

    	if (!win.noTools && !win.noTaskButton && !win.neverShow && taskbarEl) {
	        win.animateTarget = win.taskButton.el;
			win.on({
				'activate': {
					fn: markActive
				},
				'beforeshow': {
					fn: markActive
				},
				'deactivate': {
					fn: markInactive
				},
				'minimize': {
					fn: minimizeWin
				},
				'close': {
					fn: removeWin
				}
			});
		}
        try  {
            layout();
        } catch(e) {
            
        }
        return win;
    };

    this.getManager = function(){
        return windows;
    };

    this.getWindow = function(id){
        return windows.get(id);
    }
    
    this.getWinWidth = function(){
		var width = Ext.lib.Dom.getViewWidth();
		return width < 200 ? 200 : width;
	}
		
	this.getWinHeight = function(){
		var height;
		if (taskbarEl)
			height = (Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight());
		else
			height = (Ext.lib.Dom.getViewHeight());
			
		return height < 100 ? 100 : height;
	}
		
	this.getWinX = function(width){
		return (Ext.lib.Dom.getViewWidth() - width) / 2
	}
		
	this.getWinY = function(height){
		if (taskbarEl)
			return (Ext.lib.Dom.getViewHeight()-taskbarEl.getHeight() - height) / 2;
		else 
			return (Ext.lib.Dom.getViewHeight() - height) / 2;
	}
	
	this.setBackgroundColor = function(hex){
		if(hex){
			Ext.get(document.body).setStyle('background-color', '#' + hex);
			app.desktopConfig.styles.backgroundcolor = hex;
		}
	}
	
	this.setTheme = function(o){
		if(o && o.id && o.path){
			Ext.util.CSS.swapStyleSheet('theme', o.path);
			app.desktopConfig.styles.theme = o.id;
		}
	}
	
	this.setTransparency = function(b){
		if(String(b) != ""){
			if (taskbarEl)
				if(b){
					taskbarEl.addClass("transparent");
				}else{
					taskbarEl.removeClass("transparent");
				}
			app.desktopConfig.styles.transparency = b
		}
	}
	
	this.setWallpaper = function(o){
		if(o && o.id && o.path){
			Ext.MessageBox.show({
				msg: 'Loading wallpaper...',
				progressText: 'Loading...',
				width:300,
				wait:true,
				waitConfig: {interval:500}
			});
			
			var wp = new Image();
			wp.src = o.path;
			
			var task = new Ext.util.DelayedTask(verify);
			task.delay(200);
			
			app.desktopConfig.styles.wallpaper = o.id;
		}
		
		function verify(){
			if(wp.complete){
				Ext.MessageBox.hide();
				task.cancel();
				document.body.background = wp.src;
			}else{
				task.delay(200);
			}
		}
	}
	
	this.setWallpaperPosition = function(pos){
		if(pos){
			if(pos === "center"){
				var b = Ext.get(document.body);
				b.removeClass('wallpaper-tile');
				b.addClass('wallpaper-center');
			}else if(pos === "tile"){
				var b = Ext.get(document.body);
				b.removeClass('wallpaper-center');
				b.addClass('wallpaper-tile');
			}			
			app.desktopConfig.styles.wallpaperposition = pos;
		}
	}

    layout();

    if(shortcuts){
/*		var children = shortcuts.dom.childNodes;
		for (i = 0; i < children.length; i++){
			if(children[i].id){
				var shortcut = Ext.get(children[i].id);
				shortcut.initDD('DesktopShortcuts');			
			}		
		}
	*/	
		shortcuts.on('click', function(e, t){
			if(t = e.getTarget('dt', shortcuts)){
				e.stopEvent();
				var module = app.getModule(t.id.replace('-shortcut', ''));
				if(module){
					module.createWindow();
				}
			}
		});
	}
    
    this.cmenu = new Ext.menu.Menu();
    
    desktopEl.on('contextmenu', function(e){
    	if(e.target.id == desktopEl.id){
	    	e.stopEvent();
		/*	if(!this.cmenu.el){
				this.cmenu.render();
			}
			var xy = e.getXY();
			xy[1] -= this.cmenu.el.getHeight();
			this.cmenu.showAt(xy); */
		}
	}, this);
};



Ext.Desktop.Shortcut = function(el){
	this.el = el;
};