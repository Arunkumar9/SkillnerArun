Login = function(){
	var dialog,
		form,
		submitUrl = 'index.php?json=login';
	
	return{
		Init:function(config){
			Ext.QuickTips.init();
			this.config = config || {};
			
			var logoPanel = new Ext.Panel({
				baseCls: 'x-plain',
				id: 'login-logo',
		        region: 'center'
			});
			
			var formPanel = new Ext.form.FormPanel({
		        baseCls: 'x-plain',
		        baseParams: {
		        	module: 'login'
		        },
		        defaults: {
		        	width: 200
		        },
		        defaultType: 'textfield',
		        frame: false,
		        height: 70,
		        id: 'login-form',
		        items: [{
		            fieldLabel: __('Username'),
		            name: 'username',
		            value: ''
		        },{
		            fieldLabel: __('Password'),
		            xtype: 'passwordupdate',
		            name: 'password',
		            value: ''
		        }],
		        labelWidth:120,
		        region: 'south',
		        url: submitUrl,
                plugins: [new Fresh.plugin.PasswordEncode()]
                    
		    });
		
		   dialog = new Ext.Window({
		        buttons: [{
		        	handler: function(){
		        		form.submit({
							waitMsg: __('Please Wait...'),
							reset: true,
							success: Login.Success,
							scope: Login
						});
		        	},
		        	scope: Login,
		            text: __('Login')
		        }],
		        buttonAlign: 'right',
		        closable: false,
		        draggable: false,
		        height: 250,
		        id: 'login-win',
		        layout: 'border',
		        minHeight: 250,
		        minWidth: 530,
		        plain: false,
		        resizable: true,
		        items: [
		        	logoPanel,
		        	formPanel
		        ],
				title: __('Login'),
		        width: 530
		    });
			
			form = formPanel.getForm();
			
		    dialog.show();
		},
		
		Success: function(f,a){
			if(a && a.result){
				dialog.destroy(true);
				
				// get the path
				this.config.originalHref = window.location.href;
				var path = window.location.pathname,
					path = path.substring(0, path.lastIndexOf('/') + 1);
					
				// set the cookie
				//set_cookie('key', a.result.key, '', path, '', '' );
				//set_cookie('memberName', a.result.name, '', path, '', '' );
				//set_cookie('memberType', a.result.type, '', path, '', '' );
				
				// redirect the window
				//window.location = path;

                Fresh.setUser(a.result.result);
				if ('function' === typeof this.config.fn)
					this.config.fn.call(this);
				else
					if (this.config.redirect)
						window.location = this.config.redirect;
					else
						if (Ext.isIE || this.config.reload)
							window.location.reload();
						else
							this.LoadDesktop();
						
			}
		},
		LoadDesktop: function() {
                var body = Ext.get('desktop-body');
                body.load({
                   url: Fresh.Config.Page.Desktop,
                   scripts: false,
                   discardUrl: true,
                   callback: function(){
                         MyDesktop.initApp();
                   }
                });
		},
		Logout: function() {
                        Ext.Ajax.request({
                            url: Fresh.Config.Service.Login,
                            params: {action: 'logout'},
                            success: function() {
                       			//var path = window.location.pathname,
               					//path = path.substring(0, path.lastIndexOf('/') + 1);
								if (this.config && this.config.originalHref) {
									window.location = this.config.originalHref;
								} else {
									window.location.reload()
								}
                            }
                        })
       }
	};
}();


