/**
 *  Task/Issue      Author         UniqueID        Comment
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23707          Dinesh GK       201312121230    Code modifiction is done for the "Status text 5" tooltip,
 *  													If the status is 5 and login user is student then we changed the tooltip.
 */
Ext.define('SWP.view.DataGrid', {
	extend : 'Ext.grid.Panel',
	requires:['SWP.store.DataGrid','Ext.grid.View'],
	alias: 'widget.datagrid',
	hideHeaders : true,
	cls:'data-grid-cls',
	rowLines :false,
	initComponent: function() {
		var me=this;
		this.store = Ext.create('SWP.store.DataGrid',{autoLoad : false});
		Ext.apply(me,{
			viewConfig:{
				  flexCroll:false
				}
		});
		
		// In Extjs 4.2.1 showing the load masking while the store load is the default feature
//		this.store.on('beforeload',function( store){
//			this.setLoading(true);
//			
//		},this);
//		
//		this.store.on('load',function(store){
//			this.setLoading(false);
//			
//		},this);
		
		 this.taskActionStore = Ext.data.StoreManager.lookup('SWPCommon.store.TaskActions');
		
		
		this.columns = [
		             {
		            	  width:50,
		            	  height : 35,
		            	  
		            	  renderer:function( value, metaData, record ) {
		                		
		            	 var returnVal ='';
                		 var taskActionStore = Ext.data.StoreManager.lookup('SWPCommon.store.TaskStatuss');
            			 var cssRecord = taskActionStore.findRecord('ID',record.get('status'));
                			    if( cssRecord ){
                			    	
                			    	if (record.get('read') > 0)
                    			    	returnVal = returnVal+'<div class="task-status-column"><span class = "course-task-badge" title= "'+cssRecord.get('StatusText')+'">1</span>';
	                			    	//201312121230
                			    		if( cssRecord.get('ID') == "5" && !SWP.instructLogin){
	                		    			cssRecord.data.StatusText= TASKSTATUS.OPEN_UPDATED_BY_YOU;
	                		    		}
                			    	returnVal = returnVal+'<img src="'+Ext.BLANK_IMAGE_URL+'" class='+cssRecord.get('Cls')+'-'+cssRecord.get('ID')+'-summary  data-qclass="seek-qtip" title= "'+cssRecord.get('StatusText')+
                			    	'" style ="padding-top :19px !important; position : absolute !important; left : 2px !important;"/></div>';
                			    }
	                	return returnVal;
	                	
		                	}
		              },
		              {
		            	  flex:1,
		            	  renderer:function (value,meta,record){
		            		  var cssRecord = this.taskActionStore.findRecord('ID',record.get('taskAction'));
		            		  return '<div class = "course-template"><a class = "coursetitle" href = "#">'+record.get('name') +" : "+cssRecord.get('ActionText') +'</a></div>';
		            	  }
		              }];
		this.callParent(arguments);
		
	},
	listeners : {
		
		itemclick: function( pnl,record,item,index,event,eopts ) {
		if( event.target.className =='coursetitle' ) {
			this.fireEvent( 'courseTaskSummary',pnl,record,item,index,event,eopts );
		}
	}
	},
	afterRender:function(){
	this.callParent();
	this.store.load();
	}
});