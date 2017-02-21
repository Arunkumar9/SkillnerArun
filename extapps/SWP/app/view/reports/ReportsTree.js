/**
 *    Task/Issue      Author    			UniqueID        Comment   
 *	 ---------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *	  23518			  Venkatesh Teja		201311191205	Removed custom scroll bar(set to false).
 *
 *
 **/

Ext.define('SWP.view.reports.ReportsTree', {
	extend: 'Ext.tree.TreePanel',
	alias: 'widget.reportstree',
	
	initComponent : function(){
		
		var me = this;
		
		var treeStore = Ext.create('SWP.store.ReportsTree', {});
		
		Ext.apply(me,{
			flexCroll : false,				//201311191205
			title: REPORTS_TREE.TITLE,
			cls : 'reports-tree-cls',
			width: 205,
			store: treeStore,
			rootVisible: false,
			viewConfig:{
			  flexCroll:false
			}

		});
		
		this.callParent( arguments );
	}
});