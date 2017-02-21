/**
 * @author rosa
 */
Ext.namespace('Fresh');

Fresh.Relogin = function(){
	var win,
		form,
        retry,
        shown,
		submitUrl = 'index.php?json=login';
	
    
	return {
      HandleForbidden: function  ( conn, response, options ) {
        if (response.status == 403) {
           // var o = {};
          //  for (p in options)
           //    o[p] = options[p];
            Fresh.Relogin.Init(Ext.Ajax.request.createDelegate(conn,[options]));
        }
      },
      Init: function(cb) {
         if (shown)
             return;
         
         shown = true;
         form = new Ext.FormPanel({ 
            labelWidth: 80,
            url: submitUrl, 
            frame: true, 
            border: false,
            width: 230, 
            bodyStyle: { padding: '10px' }, 
            defaultType:'textfield',
    	    monitorValid:true,
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
            plugins: [new Fresh.plugin.PasswordEncode()]
        });

        retry = cb || Ext.emptyFn;     
    	// This just creates a window to wrap the login form. 
        win = new Ext.Window({
            layout:'fit',
            width:300,
            height:150,
            title: __('Session expired, please login ...'),
            closable: false,
            resizable: false,
            plain: false,
            closable: false,
            draggable: false,
            modal: true,
            items: [form],
			keys:[{
				 key:[10,13] // enter
				,scope:this
				,stopEvent:true
				,fn: function(){
    		        		form.getForm().submit({
    							waitMsg: __('Please Wait...'),
    							reset: true,
    							success: Fresh.Relogin.Success,
    							scope: Fresh.Relogin
    						});
    		        	}
                                ,scope: Login}],
            buttons:[{ 
    		        	handler: function(){
    		        		form.getForm().submit({
    							waitMsg: __('Please Wait...'),
    							reset: true,
    							success: Fresh.Relogin.Success,
    							scope: Fresh.Relogin
    						});
    		        	},
    		        	scope: Login,
    		            text: 'Login'
                }] 
    	});
    	win.show();

      },
		
    Success: function(f,a){
			if(a && a.result){
				Fresh.setUser(a.result.result);
                                if (MyDesktop.desktop.taskbar)
                                    MyDesktop.desktop.taskbar.trayPanel.update(Fresh.User);
                form.destroy(true);
                win.close();
                retry();
                shown = false;                            
			}
		}
	};
}();

Ext.onReady(function(){
    // Global Ajax events can be handled on every request!
    Ext.Ajax.on('requestexception', Fresh.Relogin.HandleForbidden,Fresh.Relogin);
});