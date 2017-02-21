Ext.namespace('Ext.ux');

Ext.ux.AutoGridCmRegistry = function() {
    var all = new Ext.util.MixedCollection();
    return {
        /**
         * Registers a component.
         * @param {Ext.Component} c The component
         */
        register : function(id,c){
            all.add(id,c);
        },

        /**
         * Unregisters a component.
         * @param {Ext.Component} c The component
         */
        unregister : function(id,c){
            all.remove(id,c);
        },

        /**
         * Returns a component by id
         * @param {String} id The component id
         * @return Ext.Component
         */
        get : function(id){
            return all.get(id);
        }
    }
}();

Ext.ux.AutoGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
    
	// 
    // This position will be used to decide the position where the new 
    // item shall be inserted in the grid.
    // 0 - is used for inserting new record in very beginning
    // END - is used for inserting the record in the end
    // A valid number will be used to insert record at any specific position
    // 
    insertPos : 0, 
    
    initComponent : function(){

        var emptyCm = false;

        this.dateFormat = this.dateFormat || 'Y-m-d';
        
        if (!this.cmId)
            this.cmId = this.getId();
            
        if (!this.store)
            this.store = this.getId().replace(/-grid/,'-store');
        this.forceFit = true;
        this.autoFill = true;
        
        
        Ext.ux.AutoGridPanel.superclass.initComponent.call(this);
        
         // Create a empty colModel if none given
        if(!this.colModel) {
            if (this.store && this.store.meta) {
                this.colModel = this.readColumnModel(this.store, this.store.meta);
            } else
                this.colModel = new Ext.grid.ColumnModel([]);
            
        }

        emptyCm = !(this.colModel.getColumnCount()>0);
        
       // register to the store's metachange event
        if(this.store){
            Fresh.console.log("register meta");
            this.store.on("metachange", this.onMetaChange, this);
            this.store.on("update",this.onUpdate,this);
                this.store.on("load",this.onLoad,this);
            if (!this.noStorePreload ) {
            	
            	// load the store while initializing the component every time with the empty filter
                    this.store.load({
                        params: {
                            meta: true, start: 0,filter:''
                        }
                    });
            }
            
        } else {
            Fresh.console.log('Store in '+this.id+' not defined');
        }

        this.on("validateedit",this.onValidateEdit,this);
        
        
        // Store the column model to the server on change
        if(false && this.autoSave) {
            this.colModel.on("widthchange", this.saveColumModel, this);
            this.colModel.on("hiddenchange", this.saveColumModel, this);
            this.colModel.on("columnmoved", this.saveColumModel, this);
            this.colModel.on("columnlockchange", this.saveColumModel, this);            
        }
        
        this.on('beforedestroy',this.onBeforeDestroy,this);

        if (this.askBeforeChange)
            this.on('show',this.onShowTab,this,{single: true});
		// add events
		this.addEvents(
			/**
			 * @event beforesave
			 * Fires before grid is saved
			 * @param {Ext.ux.AutogridPanel} this
			 */
			 'beforesave'
		);
    },    

    onLoad : function(store,r,opt) {
        var mo = store.getModifiedRecords();
        var i,len,rec,mod = false;
        
        if (len = mo.length) {
            for (i = 0; i < len; i++) {
                rec = store.getById(mo[i].id);
                if (rec) {
//	                rec.beginEdit();
	                rec.data = mo[i].data;
                    rec.modified = mo[i].modified; 
                    rec.dirty = true;
//	                rec.endEdit();
//                    rec = mo[i];
                    mod = true;
                    this.store.fireEvent("update", this.store, rec, Ext.data.Record.EDIT);
                }
            }
        }
        
    },
    
    onShowTab : function(cmp) {
        if (this.ownerCt && this.ownerCt.getXType()=='tabpanel')
            this.ownerCt.on('beforetabchange',this.onBeforeTabChange,this);
    },

    onBeforeTabChange : function(tabPanel,newTab,thisTab) {
     
         if (thisTab.id === this.id && this.store.getModifiedRecords().length > 0) {
             
            Ext.MessageBox.confirm(__('Confirm'), __('You have not saved changes and they will be lost.<br/>Do you want to continue?'), function(btn, text){
                if (btn == 'yes') {
                    this.store.rejectChanges();
                    this.store.reload();
                    this.ownerCt.setActiveTab(newTab);
                }
                else {
                    return false;
                }
            },this);
            return false;
         }
         return true;
        
    },
    
    xxxxhide : function() {
        if (this.store.getModifiedRecords().length > 0) {
        
            Ext.MessageBox.confirm(__('Confirm'),__('You have not saved changes and they will be lost.<br/>Do you want to continue?'), function(btn, text){
                if (btn == 'yes') {
                    this.store.rejectChanges();
                    Ext.ux.AutoGridPanel.superclass.hide.call(this);
                }
                else {
                    
                    return false;
                }
            },this);
        }
        return false;
    },

    onBeforeDestroy : function(cmp) {
        this.store.un("metachange", this.onMetaChange, this);
        this.store.un("update",this.onUpdate,this);
        return true;
    },

    onActivate : function(p) {
        p.store.reload({params: {meta: false}});
    },
     
    onUpdate : function(store,record,op) {
        if (op == Ext.data.Record.COMMIT) {
        
                Fresh.console.log(record);
        
        }
    },
    
    onBeforeComplete : function(editor,val,origVal) {
      
          return editor.field.isValid();
        
    },
    
    onValidateEdit : function(e) {
      
      var editor = e.grid.getColumnModel().getCellEditor(e.column,e.row);
      
      e.cancel  = !editor.field.isValid();
        
    },
    onMetaChange : function(store, meta) {
        var context, gf, cm, i, len;
        Fresh.console.log("onMetaChange", meta.fields);

        var colModel = this.readColumnModel(store, meta);
        
        if (Ext.isObject(this.viewConfig))
            Ext.apply(this.getView(), this.viewConfig);

        store.meta = meta;
        this.reconfigure(store,colModel);
        if (this.stateful && (st = this.getState())) {
            this.applyState(st);
            this.reconfigure(this.getStore(),this.getColumnModel());
        }


        //this.getView().refresh(true);
        
    },

    readColumnModel: function(store,meta) {
        var context, gf, cm, i, len;
//        Fresh.console.log("onMetaChange", meta.fields);

        if (Ext.type(meta.context) == 'object') {
            context = meta.context[this.cmId] || meta.context.base || meta;
        }
        else {
            context = meta;
        }

        if (cm = context.cm) {
	        len = cm.length;
            for (i = 0; i < len; i++) {
	            if (typeof cm[i] == 'object' && typeof cm[i].init == 'function')
	                cm[i].init(this);
	            c = cm[i];
                    if(c.editor && c.editor.isFormField){
                                    c.editor = new Ext.grid.GridEditor(c.editor);
                                }
                   if (cm[i] == 'sm')
	                cm[i] = this.selModel;
	        }
               // if (this.rowActions)
                 //   cm[len] = this.rowActions;
	        //this.getColumnModel().setConfig(cm,false);
                var colModel = new Ext.grid.ColumnModel(cm);
	       // var colModel = this.getColumnModel();
                //colModel.setConfig(cm, false);
//	        for (i = 0; i < len; i++) {
//	            var editor = this.getColumnModel().getCellEditor(i);
//	            if (editor)
//	                editor.on('beforecomplete',this.onBeforeComplete,this);
	//        }
        }
        if (gf = context.groupField)
        {
            store.groupField = gf;
            store.groupBy(gf,true);
        }
        return colModel;
    },

    
    saveColumModel : function() {

        // Get Id, width and hidden propery from every column
        var c, config = this.colModel.config;
        var fields = [];
        for(var i = 0, len = config.length; i < len; i++)
        {
            c = config[i];
            fields[i] = {id: c.id, width: c.width};
            if(c.hidden) {
                fields[i].hidden = true;
            }
        }      
        
        // Send it to server
        Fresh.console.log("save config", fields);         
        Ext.Ajax.request({
            url: this.saveUrl,
            params : {fields: Ext.encode(fields)}
        });
    },

    convertData : function(o) {
		     if('object' !== typeof o) {
		        return o;
		    }
		    var c = 'function' === typeof o.pop ? [] : {};
		    var p, v;
		    for(p in o) {
		        if(o.hasOwnProperty(p)) {
		            v = o[p];
		            if(Ext.isDate(v)) {
		                c[p] = Ext.util.Format.date(v,this.dateFormat);
		            }
		            else {
		                c[p] = v;
		            }
		        }
		    }
		    return c;
    },
    
    isDirty: function() {
      var mr = this.store.getModifiedRecords();
      return (mr>0);
    },
	
    saveData: function(viewContext,always,cb) {
        
			if (!this.fireEvent('beforesave',this,this))
				return;
				
            var that = this;
            viewContext = viewContext || this.id+'-store';
            var recs = this.store.getModifiedRecords();
            var store = this.store;

            var data = {};b=false;
            var idName = this.store.reader.meta.id;
            var fb = null;
            if ((form = this.findParentByType('form')) && (fb = this.store.meta.formBinding) ) {
                if (!form.formBaseParams.id || 'new' == form.formBaseParams.id) {
                    Fresh.console.log('No record to bind this grid '+this.id);
                    return;
                }

            }

            var l = 0;
            for(var i=0;i<recs.length;i++){
                l++;

                if (this.saveFullRecord)
                    data[recs[i].id]=this.convertData(recs[i].data);
                else
                    data[recs[i].id]=this.convertData(recs[i].getChanges());

                if (Ext.isDefined(fb) && fb) {
                    fbval = form.formBaseParams.id;
                    recs[i].set(fb,fbval);
                    data[recs[i].id][fb] = fbval;
                }
                data[recs[i].id][idName] = recs[i].get(idName);
            }
            var params = {};
            for (p in this.store.baseParams) {
                params[p] = this.store.baseParams[p];
            }
            
            if (l > 0 || always) {
                var rowdata = (l>0)?Ext.encode(data):null;
                var options = {
                  url: this.store.url,
                      params: Ext.apply(params,{
                          meta: false,
                          rows: rowdata,
                          context: viewContext
                      }),
                  success: function(response,options){
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            var ts = that.store;
                            ts.suspendEvents();
                            ts.commitChanges();
                            if (result.result) {
                                var root = result.result[ts.reader.meta.root];
                                for(var i=0;i<root.length; ++i)
                                {
                                    if (r = ts.getById(root[i].id)){
                                        ts.remove(r);
                                        delete root[i].id;
                                    }
                                }  
                                ts.loadData(result.result,true);
                            }                           
                            ts.resumeEvents();
                            if( that.id != 'coursecontent-grid'){                            	
                            	that.getView().refresh();
                            }
                            /*
                             * Here we are sorting the grid with field explicitly for the Questions answers grid 
                             * refs #29014
                             */
                            if( that.id == 'quiz-answers-grid' && ts.getSortState() ){
                            	ts.sort(ts.sortInfo.field, ts.sortInfo.direction );
                            }
                            Fresh.Msg.SlideBox('Success!',result.message || '');
                            if ('function' === typeof cb)
                                cb.apply(this,[result,options]);
                        }
                        else {
                     //       if (result.error == Fresh.Error.NotAuthorized)
                    //            Fresh.Relogin.Init(that.saveData.createDelegate(that,[viewContext,always,cb]));
                     //       else
                                Ext.MessageBox.alert('Error',result.message || result);
                        }
                        
                  },
                  failure: function() {
                      Ext.MessageBox.alert(__('Error'),__('Error occured while saving data.'));
                  }
                };
                Ext.Ajax.request(options);
            }
        
        
    }
    
});
Ext.reg('autogrid', Ext.ux.AutoGridPanel);






/**
 * Helper class for AutoGridPanel
 * @class
 
Ext.ux.CommonAutoGridPanel = function(config) {

   Ext.applyIf(config,{
     loadMask: true
     ,width: '100%'
     ,clicksToEdit:1
     ,border: false
     ,frame: false
     ,saveFullRecord: true
     ,stateful: true
     ,anchor: '100% 90%'
     ,stripeRows: true
     ,noStorePreload: false
     ,viewConfig: {
        forceFit: true}
     ,plugins: [
        new Ext.ux.Plugin.FormToButtons(), this.rowActions, this.recordForm ]
,tbar: [
        {
             text:__('Add')
				,tooltip:__('Add')
				,iconCls:'icon-new'
				,listeners:{
					click:{scope:this, buffer:200, fn:function(btn) {
						this.recordForm.show(this.addRecord(), btn.getEl());
					}}
				}
        }
        ,Fresh.global.actions.saveGridTool
        //,Fresh.global.actions.addGridTool
        //,Fresh.global.actions.deleteGridTool
        ,Fresh.global.actions.reloadGrid ]
   });

   Ext.ux.CommonAutoGridPanel.superclass.constructor.call(this,config);
} */

 Ext.ux.CommonAutoGridPanel = Ext.extend(Ext.ux.AutoGridPanel,{
     
 	initComponent:function() {

		this.recordForm = new Ext.ux.grid.RecordForm({
			 title: __('Edit')
			,iconCls:'icon-edit-record'
			,columnCount: this.formColumns || 2
			,ignoreFields:this.formIgnoreFields
			,readonlyFields:this.formReadonlyFields
			,disabledFields:this.formDisabledFields
                        ,focusDefer: 2000
                        ,formCt: this.formCt
                        ,formLayout: this.formLayout || 'column'
			,formConfig: Ext.applyIf(this.formConfig,{
				 labelWidth:80
				,buttonAlign:'right'
				,bodyStyle:'padding-top:10px'
			})
                        
		});
                if (this.formOkSave)
                    this.recordForm.afterUpdateRecord = this.saveData.createDelegate(this,[null,null,null]);
                
                if (this.clickOpensForm) {
                    this.on('rowclick',this.onRowClick,this);
                }
		// create row actions
		/*
                this.rowActions = new Ext.ux.grid.RowActions({
			 actions:[{
				 iconCls:'icon-cross'
				,qtip:__('Delete Record')
			},{
				 iconCls:'icon-edit'
				,qtip:__('Edit Record')
			}]
			,widthIntercept:Ext.isSafari ? 4 : 2
			,id:'actions'
			,getEditor:Ext.emptyFn
		}); */
                 Ext.applyIf(this,{
                     loadMask: true
                     ,width: '100%'
                     ,clicksToEdit:1
                     ,border: false
                     ,frame: false
                     ,saveFullRecord: true
                     ,stateful: false
                     ,anchor: '100% 90%'
                     ,stripeRows: true
                     ,noStorePreload: false
                     ,viewConfig: {
                        forceFit: true}
                     ,plugins: []
                     ,tbar: [
                        {
                             text:__('Add')
                                                ,tooltip:__('Add')
                                                ,iconCls:'icon-new'
                                                ,listeners:{
                                                        click:{scope:this, buffer:200, fn:function(btn) {
                                                                this.recordForm.show(this.addRecord(), btn.getEl());
                                                        }}
                                                }
                        }
                        ,Fresh.global.actions.saveGridTool
                        //,Fresh.global.actions.addGridTool
                        ,Fresh.global.actions.deleteGridTool
                        ,Fresh.global.actions.reloadGrid ]
                   });
                   this.plugins.push(new Ext.ux.Plugin.FormToButtons(), this.recordForm);
                   //this.rowActions.on('action', this.onRowAction, this);
		// call parent
		Ext.ux.CommonAutoGridPanel.superclass.initComponent.apply(this, arguments);
        }
        ,addRecord:function() {
		var store = this.store;
		if(store.recordType) {
			var rec = new store.recordType();
			rec.fields.each(function(f) {
                                if (f.name == store.meta.formBinding) {
                                    form = this.findParentByType('form');
                                    if (form)
                                        rec.data[f.name] = form.formBaseParams.id;
                                    else
                                        rec.data[f.name] = store.baseParams.filter;
                                }
                                else {
                                    df = f.defaultValue || f.defValue || null;
                                    rec.data[f.name] = (typeof df === 'function')?df(rec,store):df;
                                }
			},this);
			rec.commit();
			store.add(rec);
			return rec;
		}
		return false;
	} // eo function addRecord
	// }}}
	// {{{
	,onRowAction:function(grid, record, action, row, col) {
		switch(action) {
			case 'icon-cross':
				this.deleteRecord(record);
			break;

			case 'icon-edit':
				this.recordForm.show(record, grid.getView().getCell(row, col));
			break;
		}
	} // eo onRowAction
	,onRowClick:function(grid, row, e) {
		var record;
                var sm = grid.getSelectionModel();
                if (Ext.isFunction(sm.getSelected))
                    record = sm.getSelected();
                else
                    record = sm.selection.record;
                
                this.recordForm.show(record, grid.getView().getRow(row));
	} // eo onRowAction
	// }}}
	// {{{
	,deleteRecord:function(record,info) {
                info = info || record.get(this.descriptionField);
		Ext.Msg.show({
			 title: __('Delete record?')
			,msg:__('Do you really want to delete')+ ' <b>' + info + '</b><br/>'+__('There is no undo.')
			,icon:Ext.Msg.QUESTION
			,buttons:Ext.Msg.YESNO
			,scope:this
			,fn:function(response) {
				if('yes' !== response) {
					return;
				}
				Fresh.console.info('Deleting record');
                                Fresh.global.actions.deleteGridRowHandler(this,[record]);
			}
		});
	} // eo function deleteRecord
	// }}}

});

Ext.reg('cautogrid', Ext.ux.CommonAutoGridPanel);




