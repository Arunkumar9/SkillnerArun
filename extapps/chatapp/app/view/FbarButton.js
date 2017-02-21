Ext.define('CHAT.view.FbarButton',{
	extend:'Ext.button.Button',
	alias:'widget.fbarbutton',
	initComponent : function(){
		if(this.tooltip.substr(0,10) == 'TASKSTATUS'){
			this.tooltip = eval( this.tooltip);
			
		}
		this.callParent( arguments );
	}

});