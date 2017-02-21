/**
 * 
 */

Ext.define('SWPCommon.view.workfiles.FilesGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.filesgrid',
	requires: ['Ext.toolbar.Toolbar','Ext.selection.CellModel', 'Ext.selection.CheckboxModel'],
	border: false,
	split: true,
	
	initComponent: function() {
		
		var csm = new Ext.selection.CheckboxModel( {
		    listeners:{
		        selectionchange: function(selectionModel, selected, options){
		            // Must refresh the view after every selection
		            // other code for this listener
		        }
		    }
		});
		
		var me = this;
		
		Ext.apply(this, {
			store: Ext.create('SWP.store.Files'),
			selModel:csm,
			viewConfig:	{forcefit:true },
				columns:[
				         
				         {
							 
							text: 'Package Name ',
							dataIndex: 'filename',
							sortable: true,
							flex: 1
						},
						{
							text:' Uploaded By ',
							dataIndex:'username'
						},
						{
							text:' Package Size',
							dataIndex:'filesize'
						},
						{
							text:' Upload Date & Time ' ,
							dataIndex:'uploaddate'
							,flex: 1
						}
				         
				        ],
				dockedItems:[{
					xtype:'toolbar',
					dock:'top',
					items:[{
						text:'Upload',
						iconCls: 'uploadfile-icon',
						handler:function(){
							me.fireEvent('showfilesupload',me);
						}
					},{
						text:'Delete',
						iconCls: 'deleteitems-icon',
						handler:function(){
							var selections = me.getSelectionModel().getSelection();
							var allowdelete = true;
							me.arrayItems = [];
							
							Ext.Array.each(selections, function(value) {


								if( SWP.Rrolename == SWP.instuctName ){

									if( !me.isCreatedByInstructor( value ) && !me.isCreateByStudent( value ) ){
										allowdelete = value;
										return false;
									}

								}else if( SWP.Rrolename != SWP.superRoleName ){
									
									if( !me.isCreatedBySameRole( value ) ){
										
										allowdelete = value;
										return false;
									}
								}




							});
							
							if( allowdelete === true ){
								
								me.getStore().remove( selections );
								me.getStore().sync();
								
							}else{
								
								Ext.Msg.alert(' Error', ' Cannot delete files.  <b>' + allowdelete.get('filename') + "</b> \n " +
										"created by  <b>" + allowdelete.get('rolename'));
							}
							
							//
							// when the packages created by creator were deleted, then disable the download Lesson/Quiz 
							// Workfiles button.
							// And if no file exists in the course that is being played, disabling Download button.
							//
							
							if( me.getStore().count( false ) > 0 ){
								
								me.arrayitems = me.getStore().data.items;
								var downloadbtn = Ext.getCmp('downloadfiles');
								
								downloadbtn.disable( true );

								for( var i=0; i< me.arrayitems.length; i++ ){
									
									if( me.arrayitems[i].data.username == 'Creator' ){
										
										downloadbtn.enable( true );
									}
								}
							}else if( me.getStore().count( false ) == 0 ){
								
								if( ( me.totalTrainingfilesCount - me.uploadedfileNumber) == 0 ){
									
									var downloadAllButton = Ext.getCmp( 'downloadallfiles' );
									downloadAllButton.disable(true);
								}
								
								var downloadbtn = Ext.getCmp('downloadfiles');
								downloadbtn.disable( true );
							}

							
							me.fireEvent('deletefiles',me,selections);
						}
					},
					{
		    			 text : 'Download',
		    			 id : 'downloadallfiles',
		    			 disabled: true,
		    			 iconCls : 'downloadfile-icon',
		    			 handler : function(){
		    				 me.fireEvent('downloadallfiles', me);
		    			 }
		    		 
		    		 }
					,{
		    			 text : 'Download Lesson/Quiz Work Files ',
		    			 id : 'downloadfiles',
		    			 tooltip: 'Download Clean Lesson/Quiz Work Files',
		    			 disabled : true,
		    			 iconCls : 'downloadfile-icon',
		    			 handler : function(){
		    				 me.fireEvent('downloadfiles', me);
		    			 }
		    		 
		    		 
						
					}]
				}]
		});
		this.callParent(arguments);
	},
	isCreateByStudent : function( rec ){
		
		if( rec.get('rolename') == SWP.studentRoleName ){
			return true;
		}else{
			return false;
		}
	},
	isCreatedBySameRole : function( rec ){
		
		if( rec.get('rolename') == SWP.Rrolename ){
			return true;
		}else{
			return false;
		}
		
	},
	isCreatedByInstructor : function( rec ){
		
		if( rec.get('rolename') == SWP.instuctName ){
			return true;
		}else{
			return false;
		}
		
	}
	
});