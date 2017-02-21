Ext.define('CHAT.view.QuotedText', {
	extend: 'Ext.panel.Panel',
	border:0,
    alias: 'widget.quotedtext',
    initComponent : function() {
	var me = this;
	var msg = "\"Message\"";
	if ( this.quotetext ){
		msg = " \" "+ this.quotetext +"\"";
	}
	this.items  = [
	    {
	    	xtype : 'button',
			text : QUOTEDTEXT.BUTTON_TEXT,
			cls : 'showtext',
			handler : function(btn){
	    	var tmsg= me.items.items[1];
	    	var text = btn.getText();
	    	if(text == QUOTEDTEXT.BUTTON_TEXT){
    		tmsg.setVisible(true);
	    	btn.setText(QUOTEDTEXT.BUTTON_TEXT_HIDE);
	    }
	    else{
	    		btn.setText(QUOTEDTEXT.BUTTON_TEXT);	
		    	tmsg.setVisible(false);
	    	}
	    }
		},
		{
			xtype : 'container',
			html : msg,
			width:'100%',
			height:100,
			border:1,
			style:{borderStyle: 'solid',borderColor:'saddleBrown'},
			autoScroll:true,
            listeners:{
			render:function(abc, eOpts){
				abc.setVisible(false);
			}}
		}];
	
	this.callParent(arguments);
}



});