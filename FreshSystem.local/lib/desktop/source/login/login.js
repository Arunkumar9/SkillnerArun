Ext.SSL_SECURE_URL="lib/desktop/resources/images/default/s.gif"; 
Ext.BLANK_IMAGE_URL="lib/desktop/resources/images/default/s.gif";

Login = function(){
	var dialog,
		form,
		submitUrl = 'index.php?json=login';
	
	return{
		Init:function(){
			Ext.QuickTips.init();
			
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
		            fieldLabel: 'Username',
		            name: 'username',
		            value: ''
		        },{
		            fieldLabel: 'Password',
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
							waitMsg:'Please Wait...',
							reset:true,
							success:Login.Success,
							scope:Login
						});
		        	},
		        	scope: Login,
		            text: 'Login'
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
				title: 'Login',
		        width: 530
		    });
			
			form = formPanel.getForm();
			
		    dialog.show();
		},
		
		Success: function(f,a){
			if(a && a.result){
				dialog.destroy(true);
				
				// get the path
				var path = window.location.pathname,
					path = path.substring(0, path.lastIndexOf('/') + 1);
					
				// set the cookie
				//set_cookie('key', a.result.key, '', path, '', '' );
				//set_cookie('memberName', a.result.name, '', path, '', '' );
				//set_cookie('memberType', a.result.type, '', path, '', '' );
				
				// redirect the window
				//window.location = path;

                Fresh.setUser(a.result.result);
                var body = Ext.get('desktop-body');
                body.load({
                   url: Fresh.Config.Page.Desktop,
                   scripts: false,
                   discardUrl: true,
                   callback: function(){
                         MyDesktop.initApp();
                   }
                });
			}
		}
	};
}();
/*
Ext.BasicForm.prototype.afterAction=function(action, success){
	this.activeAction = null;
	var o = action.options;
	if(o.waitMsg){
		Ext.MessageBox.updateProgress(1);
		Ext.MessageBox.hide();
	}
	if(success){
		if(o.reset){
			this.reset();
		}
		Ext.callback(o.success, o.scope, [this, action]);
		this.fireEvent('actioncomplete', this, action);
	}else{
		Ext.callback(o.failure, o.scope, [this, action]);
		this.fireEvent('actionfailed', this, action);
	}
}
*/
//Ext.onReady(Login.Init, Login, true);