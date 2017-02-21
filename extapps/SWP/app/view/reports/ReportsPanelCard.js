/**
 *    Task/Issue      Author    			UniqueID        Comment   
 *	 ---------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *	  23518			  Venkatesh Teja		201311191205	Removed custom scroll bar(set to false).
 *	  23820		      Kanchan Singh		    201312041930	Changed extend class panel to container.
 *
 *
 **/

Ext.define('SWP.view.reports.ReportsPanelCard', {
	extend: 'Ext.container.Container',
	alias: 'widget.reportspanelcard',
	
	initComponent : function(){
		
		var me = this;
		Ext.apply(me,{
			flexCroll : false, 				//201311191205
			name : 'reportsPanelCard',
			layout :'fit',
			autoDestroy:false,
			items:[{
					
				xtype : 'coursereportform'
			
			}]
		});
		
		this.callParent( arguments );
	}
});