

Ext.onReady(function(){

	Ext.QuickTips.init();

	var remoteUrl = 'data/RemoteComponent1.json';
	var tabId = 'tabpanel';
	var tabIndex = 0;
	var liteTab = false;
	var deferedTab = false;
	var mainPanel = false;
	
	var getRemoteComponentPlugin = function(){
		return new Ext.ux.Plugin.RemoteComponent({
			url : remoteUrl
		}); 
	};

	var getLiteRemoteComponentPlugin = function(){
		return new Ext.ux.Plugin.LiteRemoteComponent({
			url : remoteUrl
		}); 
	};

	var getDeferedRemoteComponentPlugin = function(){
		return new Ext.ux.Plugin.RemoteComponent({
			url : remoteUrl,
			loadOn: 'show'
		}); 
	};

	var getStoppedRemoteComponentPlugin = function(){
		return new Ext.ux.Plugin.RemoteComponent({
			url : remoteUrl,
			breakOn: 'show'
		}); 
	};



	var getMainPanel = function(){
		if(!mainPanel){
			mainPanel = new Ext.TabPanel({
			    activeTab: 0,
				resizeTabs:true, // turn on tab resizing
		        minTabWidth: 160,
		        tabWidth:160,
		        enableTabScroll:true,
		        width:'auto',
		        height:250,
				title: 'RemoteComponent-Demo',
				autoShow: true,
		        defaults: {autoScroll:true},
				items: [{
					title:'Instant Tab',
					closable: true,
					plugins: [getRemoteComponentPlugin()]
				}]
			});		
		}		
		return mainPanel;
	};


	var addRemoteTab = function(){
		tabIndex += 1;
		return getMainPanel().add({
	        title: 'RemoteComponent ' + tabIndex,
			id: 'tab' + tabIndex,
			closable: true,
			plugins: new Ext.ux.Plugin.RemoteComponent({
				url : remoteUrl
			}),
			autoShow: true
			}
		).show();
	};

	var addLiteTab = function(){
		if(!liteTab){			
			liteTab =  getMainPanel().add({
		        title: 'LiteRemoteComponent',
				closable: true,
				plugins: [getLiteRemoteComponentPlugin()],
				autoShow: true
				}
			).show();
			liteTab.on('destroy', function(){
				liteTab = false;
			})						
		}		
		return liteTab;
	};

	var addDeferedTab = function(){
		if(!deferedTab){			
			deferedTab =  getMainPanel().add({
		        title: 'defered RemoteComponent',
				closable: true,
				plugins: [getDeferedRemoteComponentPlugin()],
				autoShow: true
				}
			);
			deferedTab.on('destroy', function(){
				deferedTab = false;
			});						
		}		
		return deferedTab;
	};



		
    var p = new Ext.Panel({
        title: 'Ext.ux.Plugin.RemoteComponent Demo',
        collapsible:true,
        renderTo: Ext.get('demo'),
        width:600,
		bbar : [
			new Ext.Toolbar.TextItem('Add Tabs w/ RemoteComponent-Plugins: '),
			{
				text: ' default ',
				handler: addRemoteTab,
				tooltip: 'Add RemoteComponent Tab',
				tooltipType : 'qtip'
			},
			new Ext.Toolbar.Separator(),
			{
				text: ' lite ',
				handler: addLiteTab,
				tooltip: 'Load LiteRemoteComponent',
				tooltipType : 'qtip'
			},
			new Ext.Toolbar.Separator(),
			{
				text: ' defered ',			
				xtype: 'button',
				handler: addDeferedTab,
				tooltip: 'Load defered RemoteComponent / lazy loading',
				tooltipType : 'qtip'
			}	
		],
        items: getMainPanel()
    });



	p.getBottomToolbar().add([
		
	]);

});



