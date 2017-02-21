/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23362		   Arunkumar.muddada    201311151025    Modified :	initComponent  by adding the condition for checking is it 
 * 														from comments grid if yes do not load the store automatically
 * 23362           Arunkumar.muddada    201311181028    Modified : initComponent:
 *  														For comments grid modifications we are passing that variable
 * 23362           Arunkumar.muddada    201311181229    Modified : tabchange :  listner
 * 														    When normal functionality of message window open and tab change between task and messages 
 * 															is not loading the store so fix is given 
 * 23362           Arunkumar.muddada    201311180918    Modified : tabchange :  listner
 * 															Tab change listner in order to restrict the loading of the store when it is from a referance
 * 23576		   Dinesh GK			201311191225	Modified : tabchange :  listner
 * 															Prevent the store load for messagedetails ( for Message & Task both tabs )
 * 23362		Tapaswini Sabat 		201311191405    In tabchange event listener instead of doing componentQuery for every time,
 * 23707		Tapaswini Sabat			201311171420		Added Tooltip for the quiz and lock icons.													we can use the newcard parameter which is nothing but the active tab.
 */
Ext.define('CHAT.view.TabView', {
    extend: 'CHAT.view.BadgeTabPanel',
    alias: 'widget.tabview',
    requires: ['CHAT.store.Messages','CHAT.view.BadgeTabPanel','CHAT.view.DataList',],
    tabBar:{defaultType: 'badgetab'},
    layout : 'auto',
    bodyCls: 'tabview-body-cls',
    cls:'tabview-cls',
    adminVersion : false,
    autoLoadStores:true,
    activeTab : 0,
    initComponent: function() {
    
    	var me = this;
    	
		/**
		 * refs #6062
		 */
		me.showTask = false;
		me.fromComment = false;

    	me.isTask = window.location.href.indexOf('showTasks');
    	if( me.isTask > -1 ){
    		this.activeTab = 1;
    		//201311181028
    		me.isTask = true;
    		me.autoLoadStores = false;
    	}
    	
    	me.isFromCommentsGrid = window.location.href.indexOf('isFromCommentsGrid');
    	if(me.isFromCommentsGrid > -1 ){
    		me.autoLoadStores = false;
    		me.isFromCommentsGrid = true;
    	}
    	
    	this.items = [
    	    {
    		xtype: 'datalist',
    		autoScroll : false,
    		store :  Ext.create('CHAT.store.Messages',{autoLoad:( me.autoLoadStores ? {params:{'thread_type_id':TABS.THREAD_TYPE_ONE}} : false )}),
    		title:TABVIEW.MESSAGES_TITLE,
    		badgeText:' ',
    		hidePost:false,
    		threadType: TABS.THREAD_TYPE_ONE,
    		isOpen : true,
    		adminVersion:  this.adminVersion,
    		classname :  ' messgaes-list'
    		
    	},{
    		xtype		: 'datalist',
    		title		:  TABVIEW.TASKS_TITLE,
    		store 		:  Ext.create('CHAT.store.Messages',{autoLoad: me.autoLoadStores }),
    		thisIsTask	:  true,
    		threadType	:  TABS.THREAD_TYPE_THREE,
    		badgeText	:  ' ',
    		adminVersion:  this.adminVersion,
    		classname :  ' tasks-list'
    	}];

    this.callParent(arguments);
    
    this.relayEvents(me.items.items[0],['newtopic','openreference','showmessagethread','closemessage','openmessage','showmessagelist','previous','next','refreshposts','link','downloadtrainingfiles','updatereadpost','reply']);
    this.relayEvents(me.items.items[1],['newtopic','openreference','showmessagethread','showmessagelist','previous','next','refreshposts','link','downloadtrainingfiles','updatereadpost','reply']);
},
listeners : {

	tabchange : function ( tabPanel, newCard, oldCard, eOpts ) {
	//201311171420
	if(tabPanel.activeTab.classname == " tasks-list"){
		var searchButtonID = document.getElementsByClassName("x-form-search-trigger")[1].id;
	}else{
		var searchButtonID = document.getElementsByClassName("x-form-search-trigger")[0].id;
	}

	Ext.create('Ext.tip.ToolTip', {
	    target: searchButtonID,
	    anchor : 'top',
	    html: "Search"
	});
	
	Ext.ComponentQuery.query('messagewindow')[0].doLayout();
	//201311181229
	var isfromComm = window.location.href.indexOf('isFromCommentsGrid');
	var isfromTask = window.location.href.indexOf('showTasks');
	var activeCard = newCard.layout.activeItem; //201311191225

	//201311180918
	//If we are using any references (could be a link or a button except message and task window button)
	if(isfromComm != -1 || isfromTask != -1) {
		if(isfromComm > -1) {
			if((! this.isFromCommentsGrid) || this.isTask == -1) {
				//If any record in the store is selected means we are viewing some message 
				var selectedRecord = newCard.getSelectionModel().getSelection();
				if(Ext.isEmpty( selectedRecord)) {
					if(! this.showTask) {
						newCard.getStore().load();
					}else {
						this.showTask = false;
					}
				}
			} 
		} else if(isfromTask > -1 ){
			if((! this.isTask) || this.isFromCommentsGrid == -1) {
				var selectedRecord = newCard.getSelectionModel().getSelection();
				if(Ext.isEmpty( selectedRecord)) {
					if(!this.fromComment){
						newCard.getStore().load();
					}else {
						this.fromComment = false;
					}
				}
			} 
		}
	}else {		//When we normally access the message & task window with out using any referances.
		// 201311191225
		if( activeCard.getId().indexOf('messagedetails') == -1 ){ 

			newCard.getStore().load();
		}
	}

}
}
});