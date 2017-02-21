
/**
 * 
 * 
 *  * @author rosa
 */

Ext.namespace('Fresh');

//Fresh.Layout = 
//if (!Ext.isIE) {				
Fresh.FExtAdminLayout = {
	
	
	init: function(cfg) {
	
		    Ext.QuickTips.init();
			Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
		
		
		    var mainLayout = new Ext.BorderLayout(cfg.panelID, {
	                north: { 
	                    titlebar: false, initialSize: 50 
	                }, 
	                south: { 
	                    split: true, initialSize: 50, titlebar: true, 
	                    collapsedTitle: 'Status', collapsible: true, closable: true
	                }, 
	                east: { 
	                    split: true, titlebar: true, initialSize: 200, 
	                    autoTabs: false, collapsible: true, title: "Toolbox"
	                },west: {
	                    split: true, initialSize: 250, titlebar: true, collapsible: true
	                },
	                center: {
	                	titlebar: true, toolbar: true,closeOnTab: true, alwaysShowTabs: true
	                }
	            });
			
		            mainLayout.beginUpdate();
		            mainLayout.add('north', northPanel = new Ext.ContentPanel('north-div', { 
		                fitToFrame: true, closable: false 
		            }));
		            mainLayout.add('south', southPanel = new Ext.ContentPanel('south-div', { 
		                fitToFrame: true, closable: false, title: 'Status'
		            }));
//		            mainLayout.add('east', eastPanel = new Ext.ContentPanel('east-div', { 
//		                fitToFrame: true, autoScroll: true, closable: false, title: 'Toolbox'
//		            }));
					
					
		            mainLayout.add('west', menuPanel = new Ext.ContentPanel('menu', {
		                fitToFrame: true, autoScroll: true, closable: false, title: 'Navigation'
		            }));
		            
					
				if (Ext.get('users'))
				{
					mainLayout.add('west', usersPanel = new Ext.ContentPanel('users', {
		                fitToFrame: true, autoScroll: true, closable: false, title: 'Users'
		            }));
				}
				if (Ext.get('types'))
				{
		            mainLayout.add('west', typesPanel = new Ext.ContentPanel('types', {
		                fitToFrame: true, autoScroll: true, closable: false, title: 'Types'
		            }));
				}		            
					
				if (Ext.get('images'))
				{
					mainLayout.add('west', imagesPanel = new Ext.ContentPanel('images', {
		                fitToFrame: true, autoScroll: true, closable: false, title: 'Resources'
		            }));
				}

				if (Ext.get('files'))
				{
					mainLayout.add('west', usersPanel = new Ext.ContentPanel('files', {
		                fitToFrame: true, autoScroll: true, closable: false, title: 'Files'
		            }));
				}

				mainLayout.add('center', centerPanel = new Ext.ContentPanel('center', {
		         		fitToFrame: true, autoScroll: true, resizeEl: 'center-iframe', 
		                 title: 'Content'
	            }));
		            
			mainLayout.getRegion('south').hide();
			mainLayout.getRegion('east').collapse();
		    mainLayout.showPanel(menuPanel);
		    mainLayout.endUpdate();
			Fresh.Layout = mainLayout;
			Ext.get('center-iframe').dom.src = 'index.php';      
			mainLayout.restoreState();      
	    
		}
}		