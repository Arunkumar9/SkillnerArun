MyDesktop.AdminWindow = Ext.extend(Ext.app.remoteModule,{
    	id : 'admin-win'
});	
/*	init : function(){
		this.launcher = {
			text: 'CRM Admin',
			iconCls:'icon-crm-admin',
			handler : this.createWindow,
			scope: this
		}
	},

	createWindow : function(){
		var locals = {};
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('admin-win');
		 // create the Data Store
		var store = new Ext.data.Store({
		        // load using script tags for cross domain, if the data in on the same domain as
		        // this page, an HttpProxy would be better
		        proxy: new Ext.data.HttpProxy({
		            url: '../../index.php?json=view',
	//				method: 'GET'
		        }),
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
				win = desktop.createWindow(JSON);
			    store.load({params: {meta: true, start:0, limit:20}});
				win.show();
		}
        
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
			locals.winWidth = desktop.getWinWidth() / 1.1;
			locals.winHeight = desktop.getWinHeight() / 1.1;
			locals.desktop = desktop;
			locals.store = store;
			Ext.Ajax.request({
	                url: '../../index.php', 
					params: {json: 'cmp', id: 'admin-win'}, 
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
/*
var myData = [
        ['1','Peter Pan','666 777 888'],
        ['2','Peter Pan','666 777 888'],
        ['3','Peter Pan','666 777 888'],
        ['4','Peter Pan','666 777 888'],
        ['5','Peter Pan','666 777 888'],
        ['6','Peter Pan','666 777 888']
		];

// create the data store
    var store = new Ext.data.SimpleStore({
        fields: [
           {name: 'custno'},
           {name: 'name'},
           {name: 'phone'}
        ]
    });		
*/
   
   // trigger the data store load
		
//    store.loadData(myData);
    // simple array store
	
