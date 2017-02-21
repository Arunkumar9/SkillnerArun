/**
 *  Task/Issue      Author         	UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23369          	Dinesh GK    	2013122610      Modifications : rowEditing plugin beforeedit, edit evnts is changed.
 *  													Now the value of the editor is changed to current selected row only.
 *  23969			Tapaswini Sabat	201312031855	Added the config as required and hide the x axis toolbar
 */
Ext.define('SWP.view.captions.VideoCaptionSettings', {
	extend:'Ext.window.Window',
	alias:'widget.videocaptionsettings',
	
	requires:['Ext.grid.*',
	          'Ext.data.*',
	          'Ext.util.*',
	          'Ext.state.*',
	          'Ext.form.*',
	          'Ext.ux.CheckColumn',
	          'SWP.store.VideoCaptionSettings',
	          'Ext.grid.plugin.RowEditing'
	          ],
	 width: 500,
	 height: 250,
	 minWidth: 350, 
	 minHeight: 200, 
//	 minWidth:
	 constrain: true,	
	 //201312031855
	 autoScroll: true,
	 flexCroll: false,
	 modal: true,
	 maximizable: true,
	 layout : 'fit',
	title: VIDEOCAPTIONSETTINGS.TITLE,
	 
  initComponent: function() {
	  
	  var me = this;
	  me.store = Ext.create('SWP.store.VideoCaptionSettings',{autoLoad: true});
	 /* me.fontStyleStore = Ext.create('Ext.data.Store', {
		    fields: ['Font Family', 'name'],
		    data : [
		        {"Font Family":"Arial", "name":"Arial"},
		        {"Font Family":"CN", "name":"Courier New"},
		        {"Font Family":"Tahoma", "name":"Tahoma"},
		        {"Font Family":"TNR", "name":"Times New Roman"},
		        {"Font Family":"Verdana", "name":"Verdana"}
		    ]
	  });
	  me.alignmentStore = Ext.create('Ext.data.Store', {
		    fields: ['Text Align', 'name'],
		    data : [
		        {"Text Align":"left", "name":"left"},
		        {"Text Align":"right", "name":"right"},
		        {"Text Align":"center", "name":"center"}
		    ]
	  }); */
	  
	  var fontData = [];
	  
	  for (var i=14; i<=28; i++ ){
		  fontData.push({
			  "name" : i
		  });
	  }
	  me.fontSizeStore = Ext.create('Ext.data.Store', {
		    fields: [{name:'name',type:'int'}],
		    data : fontData
	  });
	  me.comboStore = Ext.create('Ext.data.Store', {
		    fields: ['name'],
		    autoLoad:true,
		    proxy : {
				type : 'direct',
				api : {
					read : VideoRecordMgr.getLanguages
				},
				reader : {
					type : 'json'
				},
				writer : {
					type : 'json'
				}
			},
			listeners:{
				load : function( store ) {
				}
			}
		});
	  me.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		  clicksToEdit: 1,
		  clicksToMoveEditor: 1,
		  autoCancel: true
	  });
	  
	  Ext.apply(this, {

		  items:[{
			  xtype: 'gridpanel',
			  store: me.store,
			  flexCroll: false,
			  
			  //autoScroll:true,
			  viewConfig:{
			  
				  forceFit: true,
				  style:{
				  //201312031855
					  overflow: 'auto', overflowX: 'hidden !important'
				  },
				  cls:'captionsettings',
				  flexCroll:false
			  },
			  hideHeaders: true,
			  features: [{
		            id: 'group',
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '{name}',
		            hideGroupedHeader: true
		        }],
			  columns: [{
				  header: VIDEOCAPTIONSETTINGS.KEY,
				  dataIndex: 'key',
				  flex: 1,
				  renderer: function( value ) {
					  
					  return '<b class="firstcolumn">'+value+'</b>';
				  }
			  	},{
				  header: VIDEOCAPTIONSETTINGS.VALUE,
				  dataIndex: 'value',
				  width: 100,
				  autoDestroy:true,
				  editor:{
					  
					  editable : true
				  }
			  },{
				  header: VIDEOCAPTIONSETTINGS.EDIT,
				  dataIndex: 'edit',
				  width: 55,
				  renderer: function( value ) {
					  
					  return '<a href = "#" class="editcolumn">'+VIDEOCAPTIONSETTINGS.EDIT+'</a>';
				  }
			  }],
			  frame: true,
			  plugins: [me.rowEditing]
		  }]
	  });
	  me.callParent(arguments);
	  
	  /**
	   * 
	   * Checking for Clicked Column, And, if that is edit, then only, allowing edit. else, retuening false; 
	   * 
	   */
	  
	  me.rowEditing.on( 'beforeedit',function( editor,e ) {
		  		var editableColumn = me.down('gridpanel').columnManager.getHeaderAtIndex(1);
		  		var selectedRecord = e.record;
		  		editor.getEditor().removeColumnEditor(editableColumn);
		  		if( e.record.get('key') == VIDEOCAPTIONSETTINGS.THEME){
		  			
		  			editableColumn.newEditor =false;
			  		editableColumn.getEditor =function(){
			  			
			  			if( !this.newEditor ){
			  				 this.newEditor = Ext.create('Ext.form.field.ComboBox', {
					  				editable : false,
					  				displayField:'name',
					  				valueField:'name',
					  				 width: 75,
					  				store:Ext.create('Ext.data.Store',{
					  					fields:['name'],
					  					data:[
						  				      {
						  				    	  name:VIDEOCAPTIONSETTINGS.DARK
						  				      },
						  				      {
						  				    	  name:VIDEOCAPTIONSETTINGS.LIGHT
						  				      }
						  				      ]
					  				}),
					  				      value:e.record.get('value'),
					  				column:this,
					  				listeners : {
					  					beforerender : function (view, e, eopts){
						  					
						  					var sel_model = me.down('gridpanel').getSelectionModel();
						  					var record = sel_model.getSelection()[0];
						  					view.setValue(record.get('value'));
					  					},

					  					change : function (view, newValue,oldValue, eopts){
					  						
					  						view.setValue(newValue);
					  						me.changedValue = newValue;
					  						me.changedKey = e.record.get('key');//2013122610
					  					}
					  			}
				  		    });
			  			}
			  			this.field = this.newEditor;
			  			return this.newEditor;
			  			
			  		};
			  		editor.getEditor().insertColumnEditor(editableColumn);
		  		}else if( e.record.get('group') == VIDEOCAPTIONSETTINGS.COURSE_USER_SETTINGS ){

		  			
		  			editableColumn.newEditor =false;
			  		editableColumn.getEditor =function(){
			  			
			  			if( !this.newEditor ){
			  				 this.newEditor = Ext.create('Ext.form.field.ComboBox', {
					  				editable : false,
					  				displayField:'name',
					  				valueField:'name',
					  				 width: 75,
					  				store:Ext.create('Ext.data.Store',{
					  					fields:['name'],
					  					data:[
						  				      {
						  				    	  name:VIDEOCAPTIONSETTINGS.YES
						  				      },
						  				      {
						  				    	  name:VIDEOCAPTIONSETTINGS.NO
						  				      }
						  				      ]
					  				}),
					  				      value:e.record.get('value'),
					  				column:this,
					  				listeners : {
					  					beforerender : function (view, e, eopts){
						  					
						  					var sel_model = me.down('gridpanel').getSelectionModel();
						  					var record = sel_model.getSelection()[0];
						  					view.setValue(record.get('value'));
					  					},

					  					change : function (view, newValue,oldValue, eopts){
					  						
					  						view.setValue(newValue);
					  						me.changedValue = newValue;
					  						me.changedKey = e.record.get('key');//2013122610
					  					}
					  			}
				  		    });
			  			}
			  			this.field = this.newEditor;
			  			return this.newEditor;
			  			
			  		};
			  		editor.getEditor().insertColumnEditor(editableColumn);
		  		
		  		} else if(e.record.get('group') == VIDEOCAPTIONSETTINGS.PLAYER_SETTINGS){

		  			
		  			editableColumn.newEditor =false;
			  		editableColumn.getEditor =function(){
			  			
			  			if( !this.newEditor ){
			  				 this.newEditor = Ext.create('Ext.form.field.ComboBox', {
					  				editable : false,
					  				displayField:'name',
					  				valueField:'name',
					  				 width: 75,
					  				store:Ext.create('Ext.data.Store',{
					  					fields:['name'],
					  					data:[
						  				      {
						  				    	  name:VIDEOCAPTIONSETTINGS.TRUE
						  				      },
						  				      {
						  				    	  name:VIDEOCAPTIONSETTINGS.FALSE
						  				      }
						  				      ]
					  				}),
					  				      value:e.record.get('value'),
					  				column:this,
					  				listeners : {
					  					beforerender : function (view, e, eopts){
						  					
						  					var sel_model = me.down('gridpanel').getSelectionModel();
						  					var record = sel_model.getSelection()[0];
						  					view.setValue(record.get('value'));
					  					},

					  					change : function (view, newValue,oldValue, eopts){
					  						
					  						view.setValue(newValue);
					  						me.changedValue = newValue;
					  						me.changedKey = e.record.get('key');//2013122610
					  					}
					  			}
				  		    });
			  			}
			  			this.field = this.newEditor;
			  			return this.newEditor;
			  			
			  		};
			  		editor.getEditor().insertColumnEditor(editableColumn);
		  		
		  		}
		  		
		  		if( selectedRecord && selectedRecord.get('key') == VIDEOCAPTIONSETTINGS.FONTSIZE ) {
		  			
		  			editableColumn.newEditor =false;
		  			editableColumn.getEditor =function(){
					 
			            if( !this.newEditor ){
			            	this.newEditor = Ext.create('Ext.form.field.ComboBox',{
			            	 	displayField: 'name',
				  				valueField: 'name',
				  				editable : false,
				  				store:  me.fontSizeStore,
				  				column:this,
				  				 width: 75,
				  				listeners : {
				  					beforerender : function (view, e, eopts){
				  						
					  					var sel_model = me.down('gridpanel').getSelectionModel();
					  					var record = sel_model.getSelection()[0];
					  					view.setValue(record.get('value'));
				  					},
				  					change : function (view, newValue,oldValue, eopts){
				  						
				  						me.changedValue = newValue;
				  						me.changedKey = e.record.get('key');//2013122610
				  					}
				  			}
			            });
			            }
			            this.field = this.newEditor;
			            return this.newEditor;
			         }
		  			editor.getEditor().insertColumnEditor(editableColumn);
		  		}
		  		if( selectedRecord && selectedRecord.get('key') == VIDEOCAPTIONSETTINGS.VIDEOCAPTION ) {
		  			editableColumn.newEditor =false;
		  			editableColumn.getEditor =function(){
					 
			            if( !this.newEditor ){
			            	this.newEditor = Ext.create('Ext.form.field.ComboBox',{
			            		queryMode: 'local',
							    displayField: 'name',
							    valueField: 'name',
							    autoSelect:true,
							    forceSelection:true,
							    editable:false,
							    id:'lang-combo',
				  				store:  me.comboStore,
				  				column:this,
				  				 width: 150,
				  				listeners : {
				  					beforerender : function (view, e, eopts){
					  					var sel_model = me.down('gridpanel').getSelectionModel();
					  					var record = sel_model.getSelection()[0];
					  					view.setValue(record.get('value'));
				  					},
				  					change : function (view, newValue,oldValue, eopts){
				  						
				  						me.changedValue = newValue;
				  						me.changedKey = e.record.get('key');//2013122610
				  					}
				  			}
			            });
			            }
			            this.field = this.newEditor;
			            return this.newEditor;
			         }
		  			editor.getEditor().insertColumnEditor(editableColumn);
		  			
		  			
		  		}
		  		// Please don't delete the commented line it may be required later.
		  	/*	if( selectedRecord && selectedRecord.get('key') == VIDEOCAPTIONSETTINGS.FONT_STYLE ) {
		  			
		  			editableColumn.setEditor({
		  				
		  				xtype: 'combobox',
		  				displayField: 'name',
		  				valueField: 'name',
		  				store: me.fontStyleStore
		  			});
		  			
		  		}else if( selectedRecord && selectedRecord.get('key') == VIDEOCAPTIONSETTINGS.ALIGN ) {
		  			
		  			editableColumn.setEditor({
		  					
		  				xtype: 'combobox',
		  				displayField: 'name',
		  				valueField: 'name',
		  				store: me.alignmentStore
		  			});	
		  		}else if( selectedRecord && selectedRecord.get('key') == VIDEOCAPTIONSETTINGS.WIDTH ) {
		  			
		  			editableColumn.setEditor({
		  				
		  				xtype: 'numberfield',
		  				maxValue: 100,
		  				minValue: 0
		  			});
		  			
		  		}else if( selectedRecord && selectedRecord.get('key') == VIDEOCAPTIONSETTINGS.FONTSIZE ) {
		  			
		  			editableColumn.setEditor({
		  				
		  				xtype: 'combobox',
		  				displayField: 'name',
		  				valueField: 'name',
		  				editable : true,
		  				store:  me.fontSizeStore,
		  				defaultValue : 24,
		  				listeners : {
		  				'beforerender' : function (view, e, eopts){
		  					view.setValue(24);
		  			}
		  			}
		  			});
		  			
		  		}else {
		  			
	  				editableColumn.setEditor({
		  				
		  				xtype: 'textfield'
		  			});
		  		}*/
		  	
		  		return true;
//		  		
//		  	}else {
		  		
//		  		return false;
//		  	}
	  });
	  
	  /**
	   *	After editing the field values, saving the modified values 
	   * 
	   */
	  
	  me.rowEditing.on('edit', function(editor, e) {
		  
		  var editableColumn = me.down('gridpanel').columnManager.getHeaderAtIndex(1);
		  if( (me.changedValue) && (me.changedKey == e.record.get('key')) ) { //2013122610
			  
			  var sel_model = me.down('gridpanel').getSelectionModel();
			  var record = sel_model.getSelection()[0];

			  record.set("value",me.changedValue);
		  }
		  me.fireEvent( 'savecaptoinsettings',me);
		  
	  });
  }

});