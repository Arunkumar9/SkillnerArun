Ext.define('CHAT.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires : ['CHAT.view.TabView' ,'CHAT.view.MessageWindow', 'CHAT.store.Posts', 'CHAT.view.MessageDetails'],
    adminVersion : false,
	autoLoadStores:true,
	layout: 'fit',
	initComponent:function(){
	
	var me= this;
	this.items = [{
		xtype : 'messagewindow',
		autoScroll:true,
		adminVersion : SWP.instructLogin,
		autoLoadStores:this.autoLoadStores
	}],
	
	this.callParent(arguments);
	
},
listeners : {
	afterrender:function(){
//	
	Ext.EventManager.onWindowUnload(function(){
		// here inform to the player window abt the destruction of the window
//		var string = '{success:true, receivers : [{"whichmethod":"MesagewindowNotExist","whichinstance":"player"}]}';
//		validations.dataSend(string);
	 },this);
//	
	
	CollaborationToolMgr.getUnReadMessageCount( null,function(r,t) {
		
		if( t.status ) {
			if( r.length > 0 ) {
				
				var badgeTab;
				var badgeTabIndex;
				for( var i=0; i< r.length; i++ ) {
					
					if( r[i].unread_Post_Count > 0 ) {
						this.fireEvent('increasebadgecount', r[i].thread_id, r[i].thread_type_id );
							
//							badgeTab = Ext.ComponentQuery.query(' tabview badgetab ');
//							
//							if( badgeTab.length>0 ){
//								
//								if( r[i].thread_type_id != TABS.THREAD_TYPE_ONE ) {
//									
//									badgeTabIndex = 1;
//									
//								}else {
//									
//									badgeTabIndex = 0;
//								}
//								
//								if( badgeTab[badgeTabIndex].getBadgeText() == ' ' ) {
//									
//									badgeTab[badgeTabIndex].setBadgeText(1);
//									
//								}else {
//									
//									badgeTab[badgeTabIndex].setBadgeText( badgeTab[badgeTabIndex].getBadgeText()+1 );
//								}
//								alert('from viewport '+badgeTab[badgeTabIndex].getBadgeText());
//							}
					}
				}
			}
		}
		
		
	}, this);
	}
}
});
