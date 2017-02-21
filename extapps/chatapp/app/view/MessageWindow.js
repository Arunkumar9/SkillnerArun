/**
 * @author Tapaswini Sabat
 * Here we are creating a container type component which creates one more componet Tabview
 * and is of card layout having two items one is TabView and the otherone is a container.
 * 
 */

Ext.define('CHAT.view.MessageWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.messagewindow',
	requires : ['CHAT.view.TabView' , 'CHAT.store.Posts', 'CHAT.view.MessageDetails'],
	style : {backgroundColor : 'white !important'},
	defaults:{
		height : '500px'
	},
	maximized: true,
//	modal:true,
	constrain: true,
	autoShow : true,
	title : SHOWMESSAGINGWINDOW.TITLE,
	cls:'messagewindow-cls',
//	layout:'fit',
	style:{
		top:100,
		left:450,
		width:'600px'
	},
//	maximizable:true,
//	minimizable : true,
	closable : false,
	autoLoadStores:true,
	adminVersion : false,
	autoLoadStores:true,
	initComponent : function() {
		
		var me = this;
		
		/**
		 * refs #6062
		 */
//		
//		if( me.adminVersion ) {
//			
//			this.adminVersion = me.adminVersion ;
//		}
		
		var tabView = Ext.create('CHAT.view.TabView',{autoScroll:true,
			adminVersion : this.adminVersion,autoLoadStores:me.autoLoadStores
			});
		
		this.layout='card';
		this.items=[ tabView ];
		
		this.callParent(arguments);
		this.relayEvents(tabView,['showmessagethread','openreference','newtopic','showmessagelist','previous','next','refreshposts','link','closemessage','openmessage','downloadtrainingfiles','updatereadpost','reply']);
	},
	/**
	 *This method is used to set the item as active item in the card.
	 **/
	
	setActiveItem:function(item) {
		this.getLayout().setActiveItem(item);
	},
	
	/**
	 * Relaying the events coming from message details window.
	 **/
	
	showMessageDetails : function(messagedetails) {
		this.relayEvents(messagedetails,['showmessagelist','previous','next','refreshposts','link','downloadtrainingfiles','updatereadpost','reply']);
	},
	
	/**
	 * Whenever the user is double clicking on the thread the control is coming to this method 
	 * where it is creating the MessageDetails component and setting the current item as an active item of the card
	 **/
	
	messagedetailsComp : function(record) {
		
			
			var card1 = Ext.create('CHAT.view.MessageDetails',
					{
				store: Ext.create('CHAT.store.Posts',{
					autoLoad:{params:{'thread_id':record.get('uid')}}
				}),
				autoScroll 		: true,
				threadSubject	: record.get('subject'), 
				thread			: record,
				inSamePage		: true,
				adminVersion 	: this.adminVersion,
				instructionstext: '',
				bodyStyle: {
				    background: '#d6d6d6'
				}
					} );
			
			this.showMessageDetails(card1);
			this.setActiveItem( card1);
			
	},
	listeners: {
		
		afterrender: function( ){
			
			
		},
		
		/**
		 * Before closing the window the event will be fired
		 * 
		 */
		
	    beforeclose: function( window ) {
	    	
			 if( this.fireEvent('closewindow',this,window) ) {
				 
				 return true;
				 
			 } else {
				 
				 return false;
			 }
	    },
	    
	    /**
	     * 
		 * before minimising the window the event will be fired
		 *
		 */
	    
	    'minimize': function( window ) {
	    	
	    	this.fireEvent( 'minimisewindow',this,window );
	     },
	     'restore' : function( window ) {
	    	 
	    	 this.fireEvent( 'restorewindow', this, window );
	     },
	     'resize': function( window, width, height, eOpts ){
	    	 
	    	 window.doLayout();
	    	 //this.fireEvent( 'resizewindow', this, window,width, height, eOpts, window );
	     }
	}
});