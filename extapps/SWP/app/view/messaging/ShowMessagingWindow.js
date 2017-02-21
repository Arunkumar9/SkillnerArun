/**
 * @author Tapaswini Sabat
 */

Ext.define('SWP.view.messaging.ShowMessagingWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.showmessagingwindow',
	//requires : ['Ext.wtc.ct.view.MessageWindow'],
	style : {backgroundColor : 'white !important'},
	defaults:{
		height : '500px'
	},
	maximized: true,
	modal:true,
	constrain: true,
	title : SHOWMESSAGINGWINDOW.TITLE,
//	layout:'fit',
	style:{
		top:100,
		left:450,
		width:'600px'
	},
	maximizable:true,
	minimizable : true,
	adminVersion : false,
	autoLoadStores:true,
	initComponent : function() {
		
		var me = this;
		/**
		 * refs #6062
		 */
		if( me.adminVersion ) {
			
			this.adminVersion = me.adminVersion ;
		}
		
		var msgview = Ext.create('Ext.wtc.ct.view.MessageWindow',{
			/**
			 * refs 6062
			 */
			adminVersion : this.adminVersion,autoLoadStores:me.autoLoadStores
		});
		this.items = [{
			xtype:'container',
			autoScroll:true,
			items:[msgview]
		}];
		
		this.callParent(arguments);
		
		/**
		 * 
		 * 	Registering relay event for newtopic,openreference which are registered in datalist
		 * 
		 */
		
		this.relayEvents( msgview,['showmessagethread','openreference','newtopic','showmessagelist','previous','next','refreshposts','link','closemessage','openmessage','downloadtrainingfiles', 'updatereadpost'] );
	},
	
	listeners: {
		
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
	     }
	}

});