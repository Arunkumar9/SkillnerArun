MyDesktop.LayoutWindow = Ext.extend(Ext.app.remoteModule,{
        	id : 'customer-win'
    });
/*
MyDesktop.LayoutWindow = Ext.extend(Ext.app.Module, {
	id : 'customer-win',
	
	init : function(){
		this.launcher = {
			text: 'CRM Customers',
			iconCls:'icon-crm-customer',
			handler : this.createWindow,
			scope: this
		}
	},


	createWindow : function(){
		var locals = {};
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('customer-win');
		 // create the Data Store
		var store2 = new Ext.data.GroupingStore({
	            url: '../../index.php?json=view',
		        root : 'rows',
                baseParams: { view: 'grid-list-of-prefs' },
		        reader: new Ext.data.JsonReader(),
		        remoteSort: true
		    });

		var store = new Ext.data.GroupingStore({
	            url: '../../index.php?json=view',
		        root : 'rows',
                baseParams: { view: 'grid-list-of-customers' },
		        // create reader that reads the Topic records
		        reader: new Ext.data.JsonReader(),
		
		        // turn on remote sorting
		        remoteSort: true
		    });
//		    mystore.setDefaultSort('name', 'asc');			

		var createWindowCallback = function(res) {
				var JSON = Ext.decode.call(locals,res.responseText);
                if (JSON.success) {
                    win = desktop.createWindow(JSON);
                    store.load({
                        params: {
                            meta: true,
                            start: 0,
                            limit: 20
                        }
                    });

					store2.load({
						params: {
							meta: true,
							filter: 0,
							context: 'customer-grid'
						}
					});
				
                    Ext.MessageBox.hide();
    				win.show();
                }
                else {
                    Ext.MessageBox.hide();
                    Ext.MessageBox.alert('Error', JSON.message);                
                }
		}
        
        locals.actions = MyDesktop.actions;
        locals.remoteComponent = function(cfg) {
            config = { };//loadOn: 'show' 
            config.scope = locals || this;
            config.url = '../../index.php?json=cmp';
//            config.method = 'GET';
            config.params = {
                id: cfg.id
            };
            return new Ext.ux.Plugin.RemoteComponent(config);
        }
        

		if(!win){
            Ext.MessageBox.show({
                       msg: 'Launching application ' + this.launcher.text + '...',
                       progressText: 'Please wait ...',
                       width:300,
                       wait:true,
                       waitConfig: {interval:200},
                       icon:'mb-loading-icon'
//                       ,animEl: 'mb7'
                   });	
       		locals.winWidth = desktop.getWinWidth() / 1.1;
			locals.winHeight = desktop.getWinHeight() / 1.1;
			locals.desktop = desktop;
			locals.store = store;
			locals.store2 = store2;
			//locals.triCheckColumn = new Ext.grid.TriCheckColumn({ header: "Want?", dataIndex: 'Want',width: 30  });
            locals.maxWidth = function(w,f) {
                return parseFloat(this.winWidth*f) < w+1 ? parseFloat(this.winWidth*f) : w
            };
            locals.testAction = new Ext.Action({
                text: 'Test',
                handler: function(b) { Fresh.console.log(arguments); Fresh.console.log(b.getXType()); },
                minWidth: 75
            });
			Ext.Ajax.request({
	                url: '../../index.php', 
					params: {json: 'cmp', id: this.id}, 
					success: createWindowCallback.createDelegate(this) , 
					scope: this
			});				
		} 
		else {
			win.show();
		}

	}
	
});

*/