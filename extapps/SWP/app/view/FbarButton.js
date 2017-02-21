/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23707		Tapaswini Sabat			201311301937	Changed the tooltip in the application
 **/

Ext.define('SWP.view.FbarButton',{
	extend:'Ext.button.Button',
	alias:'widget.fbarbutton',
	initComponent : function(){
		if(this.tooltip.substr(0,10) == 'TASKSTATUS'){
			//201311301937
			if( this.statusId  == '5' && !SWP.instructLogin ){
				
				this.tooltip =  TASKSTATUS.OPEN_UPDATED_BY_YOU;
			}else{
				
				this.tooltip = eval( this.tooltip);
			}
			
		}
		Ext.apply(this,{
			style:'float:right !important;'
		});
		this.callParent( arguments );
	}

});