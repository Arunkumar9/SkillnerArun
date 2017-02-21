/*
 * Desktop configuration
 */
MyDesktop = new Ext.app.App({
	init :function(){
		Ext.QuickTips.init();
                Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
                if (Ext.app.REMOTING_API) {
                    Ext.Direct.addProvider(Ext.app.REMOTING_API);
                    Ext.Direct.on('exception',function(t) {
                        if (Fresh.Config.ApplicationMode == 'debug' && Fresh.User && Fresh.User.MaxLevel >= 300) {
                            Ext.MessageBox.alert('Alert', '<pre>'+t.message+'<br><br>'+t.where+'</pre>');
                        } else{
                        	var message = t.message;
                        	Ext.MessageBox.alert(__('Alert'), __(message));
                        	//Ext.MessageBox.alert('Alert', '<pre>'+t.message+'<br><br>'+'</pre>');
                        }
                        if(t){                        	
                        	Fresh.console.log('ERROR: '.t.message);
                        }
                    });
                }
	},

	// get modules to initialize (make available to your desktop)
	/*getModules : function(){
		return [
			new MyDesktop.LayoutWindow(),
//			new MyDesktop.Docs(),
			new MyDesktop.AdminWindow(),
//            new MyDesktop.TabWindow(),
//            new MyDesktop.AccordionWindow(),
            new Ext.app.remoteModule({id: 'users-win', text: 'CRM User Management',iconCls: 'icon-setup-win'}),
//            new MyDesktop.subSubMenu(),
//            new MyDesktop.subMenu(),
 //           new MyDesktop.BogusModule(),
            new MyDesktop.Preferences(),
            new Ext.app.remoteModule({id: 'setup-win', text: 'CRM Setup',iconCls: 'icon-setup-win'})
		]
	},*/
	
	// config for the start menu
    getStartConfig : function(){
    	var pref = new MyDesktop.Preferences();
		pref.app = this;
		
        return {
        	iconCls: 'user',
            title: Fresh.User.Name,
            toolItems: [
            	//pref.launcher
                //{text: 'Help',iconCls:'icon-help-win',handler: (Ext.isFunction('Zenbox.show'))?Zenbox.show:Ext.emptyFn}
            {
				text:'Logout',
				iconCls:'logout',
				handler:function(){
				    var ulevel=Fresh.User.MaxLevel;
                        Ext.Ajax.request({
                            url: Fresh.Config.Service.Login,
                            params: {action: 'logout'},
                            success: function() {
						if (ulevel<300) {
							window.close();
						}
						else {
                                 var body = Ext.get('desktop-body');
                                 body.load({
                                       url: Fresh.Config.Page.Login,
                                       scripts: true,
                                       discardUrl: true,
                                       callback: function(){
										var path = window.location.pathname,
										path = path.substring(0, path.lastIndexOf('/') + 1);
									    window.location = path;
//                                             Fresh.setUser();
  //                                           Login.Init();
                                       }
                                 });
						}
                            }
                        })
                        
                        // = "logout.php"; 
                    },
				scope:this
			}],
			toolPanelWidth: 115
        };
    },
    
    // get user preferences, modules to load into Start Menu and Quick Start
    getDesktopConfig : function(){
    	// can call server for saved module id's
		if (false && !Fresh.Config.DesktopConfig) {
			Ext.Ajax.request({
				success: function(o){
					var decoded = Ext.decode(o.responseText);
					
					if (decoded.success) {
						Fresh.Config.DesktopConfig = decoded.config
						this.initDesktopConfig(decoded.config);
					}
					else {
					// error
					}
				},
				failure: function(){
				// error
				},
				scope: this,
				url: 'source/core/DesktopConfig.php'
			});
		}
		else {
			/* can hard code the module id's*/
			this.initDesktopConfig(Fresh.Config.DesktopConfig);
		}
    }
});


