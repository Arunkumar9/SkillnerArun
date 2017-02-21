/**
 * 
 * @project Fresh!
 * 
 * @package Fresh.web.clientside.actions

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: actions_1.js 2348 2013-12-20 10:20:54Z arun $
 * 
 */

Ext.namespace('Fresh.global');

MyDesktop.actions = function()  {

        var msgCt;
        var createBox = function(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
        };
        
        
        var msg  = function(title, format, id, type){
            var attach = Ext.get(id) || document;
            var ins = Ext.get(id) || document.body;
            type = type || 'c-c';
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
//            msgCt.alignTo(document, 'br-br',[0,-70]);
            msgCt.alignTo(document, 'tr-tr');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:createBox(title, s)}, true);
            m.slideIn().pause(1).slideOut("t", {remove:true});
        };

        
		/**
		 * Search action private handler
		 * @param {Object} button
		 * @param {Object} e
		 */
        var onSearchButton = function(button, e){
		
			e.preventDefault();
			var form = button.panel || button.form;
			
			if (!form.getForm().isDirty()) 
				return;
			var options = form.formBaseParams ||	{};

            var values = form.getForm().getValues(false);
			
			//if (typeof form.linkedGrid == 'string')
			//	form.linkedGrid = Ext.getCmp(form.linkedGrid);
			
			if (typeof form.linkedGrid == 'object') {
				form.linkedGrid.store.baseParams.filter = Ext.encode(values);
				form.linkedGrid.store.baseParams.context = form.id;
				form.linkedGrid.store.load();
			}
			
		};
        
        var deleteGridRow = function(grid,viewContext) {

            var recs;
            viewContext = viewContext || grid.id+'-delete';
            var sm = grid.getSelectionModel();
            if (typeof sm.getSelections == 'function') {
                recs = sm.getSelections();
            }
            else if (typeof sm.getSelectedCell == 'function') {
                recs = [grid.store.getAt(sm.getSelectedCell()[0])];
            }
            else 
                return;
                
            var data = {};
            var idName = grid.store.meta.id;
            var l = 0;
            for (var i = 0; i < recs.length; i++) {
                if (recs[i].get(idName)) {
                    l++;
                    r = {};
                    r[idName] = recs[i].get(idName);
                    data[recs[i].id] = r;
                }
            }
            var params = {};
            for (p in grid.store.baseParams) {
                params[p] = grid.store.baseParams[p];
            }
                
            if (l > 0) {
                var options = {
                  url: grid.store.url,
                      params: Ext.apply(params,{
                          meta: false,
                          rows: Ext.encode(data),
                          context: viewContext
                      }),
                  success: function(response){
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            grid.store.commitChanges();
                            msg('Success!',result.message,grid.getEl(),'c-c');
//                                form.el.select('.x-panel-btns').insertFirst({
//                                    tag: 'span',
//                                    html: result.message
//                                });
                            for (var i = 0; i < recs.length; i++) {
                                grid.store.remove(recs[i]);
                            }
                        }
                        else {
                            Ext.MessageBox.alert('Error',result.message);
                        }
                        
                  },
                  failure: function() {
                      Ext.MessageBox.alert('Error','Error occured while saving preferences.');
                  }
                };
                Ext.Ajax.request(options);
            }
            
            
        };

        var onDeleteGridTool = function(button, e){

            var grid = button.form;
            var sm = grid.getSelectionModel();
            if (sm && sm.hasSelection()) {
            
                Ext.MessageBox.confirm('Confirm', 'Are you sure you want to remove selected rows?', function(btn, text){
                    if (btn == 'yes') {
                        deleteGridRow(grid);
                    }
                });
            }
        }
        var onSaveGridTool = function(button, e){
            var grid;
            if (grid = button.form)
                grid.saveData();
        }
        
        var onSaveButton = function(button,e) {
        
            if ('undefined' != typeof e)
				e.preventDefault();
            if (!(form = button.form))
				form = button;
			Fresh.console.log(form.data);
			
            var grid = form.linkedGrid;
            
//            var dirty = form.getForm().isDirty() || (grid && );
            var formParams = form.formBaseParams || {};
            formParams.action = 'store';
            
			var options = {
                params: formParams
                  ,waitMsg: 'Saving...'
                  ,clientValidation: true
                  ,waitTitle: __('Saving...')
                  ,success: function(f,action){
                        var result = action.result;
						if ('undefined' == typeof result) 
							result = Ext.decode(f.responseText);
                        result.message = result.message || '';
                        if (result.success) {
                            Fresh.Msg.SlideBox(__('Success!'),result.message);
							if (f.setValues) {
								if (result.CustNo) {
									f.setValues({
										'CustNo': result.CustNo
									});
									form.formBaseParams.id = result.CustNo;
									if (grid) {
										grid.customerChanged = true;
										grid.store.baseParams.filter = result.CustNo;
									}
								}
								if (result.Uid) {
									f.setValues({
										'Uid': result.Uid
									});
									form.formBaseParams.id = result.Uid;
									if (grid) {
										grid.customerChanged = true;
										grid.store.baseParams.filter = result.Uid;
									}
								}
								if (result.uid) {
									f.setValues({
										'uid': result.uid
									});
									form.formBaseParams.id = result.uid;
									if (grid) {
										grid.customerChanged = true;
										grid.store.baseParams.filter = result.uid;
									}
								}
							}                            
                        }
                        else {
/*
                            if (result.error == Fresh.Error.NotAuthorized)
                                Fresh.Relogin.Init(onSaveButton.createDelegate(this,[button,e]));
                            else

*/                                        
							Ext.MessageBox.alert('Error',result.message);
                        }
                        
                        //to reset form to new values;
						if (f.setValues) {
							if (result.result) 
								f.setValues(result.result)
							f.items.each(function(field){
								if (f.trackResetOnLoad) {
									field.originalValue = field.getValue();
								}
							});
							f.reset();
						}
                  }
                  ,failure: function(f,action) {
				      Fresh.console.log(action.result);
                      Ext.MessageBox.alert('Error','Error occured while saving.');
                  }
            };
			
			if ('function' === typeof form.getForm) {
				if (form.getForm().isDirty()) {
				
					if (form.getForm().isValid()) {
						form.getForm().submit(options);
					}
					else {
						Ext.MessageBox.alert(__('Form not valid...'), __('Please check your form! Some of the fields are not valid.'));
		                return;						
					}
				}
			}
			else {
				options.params.data = Ext.encode(form.data);
				options.url = form.url;
				Ext.Ajax.request(options);
			}

            if (grid && 'function' == typeof grid.saveData) {
                grid.saveData(form.id+'-store');                
            }
             
//            if ('function' === typeof form.getForm && !form.getForm().isValid()) {
//                Ext.MessageBox.alert(__('Form not valid...'), __('Please check your form! Some of the fields are not valid.'));
///                return;
 //           }
        };

        var onCancelButton = function(button,e) {
        
            e.preventDefault();
            var form = button.form;
            var grid = form.linkedGrid;
            
            if (form.getForm().isDirty() || (grid && grid.store.getModifiedRecords().length > 0)) {
            
                Ext.MessageBox.confirm(__('Confirm'), __('Are you sure you want to reset form?<br/>Changes will be lost!'), function(btn, text){
                    if (btn == 'yes') {
                        form.getForm().reset();
//                        form.getForm().getEl().dom.reset();
                        if (grid) {
                            cancelGridEdit(grid);
                        }
                    }
                });
            }

        };

        var onNewGridTool = function(button, e){
        }
        var onCancelGridTool = function(button,e) {
        
            e.preventDefault();
            var grid = button.form;
            
            if (grid.store.getModifiedRecords().length > 0) {
            
                Ext.MessageBox.confirm(__('Confirm'), __('Are you sure you want to edits in grid?<br/>Changes will be lost!'), function(btn, text){
                    if (btn == 'yes') {
                            cancelGridEdit(grid);
                    }
                });
            }

        };

        var cancelGridEdit = function(grid) {
             grid.store.rejectChanges();
        };

        var onReloadTreeButton = function(button,e) {
            e.preventDefault();
            var tree = button.form;
            tree.body.mask(__('Loading'), 'x-mask-loading');
            tree.root.reload(function(){ 
                tree.body.unmask();
                tree.root.expand(false, false);
            });
            tree.root.collapse(true, false);
        };

        var onReloadGridButton = function(button,e) {
            e.preventDefault();
            var grid = button.form;
            if (grid && grid.store)
                grid.store.reload();
        }

        var addRecordGrid = function(grid,r) {
            var store = grid.store;
			var df;
            if (store) {
                r = r || {};
                var fields = store.meta.fields;
                var Record = Ext.data.Record.create(fields);
                var rec = new Record(r);
                for (var i=0; i<fields.length; i++) {
					df = (typeof fields[i].defValue === 'function')?fields[i].defValue():fields[i].defValue;
                    rec.set(fields[i].name,df || '');
                }
                Fresh.console.log(rec);
                grid.stopEditing();
                store.insert(0, [rec]);
                grid.startEditing(0, 0);
            }
        }

        var onAddGridTool = function(button,e) {
            var panel = button.form;
            if (panel)
                addRecordGrid(panel);
        }

        var onCollapseTreeButton = function(button,e) {
            e.preventDefault();
            var tree = button.form;
            tree.root.collapse(true, false);
        };

        var onExpandTreeButton = function(button,e) {
            e.preventDefault();
            var tree = button.form;
            tree.root.expand(true, true);
        };
        
        var onRenameNode = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.editor.editByAction = true;
                (function(){tree.editor.triggerEdit(n);}.defer(10));
            }
        }

        var onDeleteNode = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                Ext.MessageBox.confirm(__('Confirm'),'Do you really want to move<br/> <b>'+n.text+'</b> to ' + __('recycle bin') + '?',
                    function(btn,text) { 
                        var r,rb;
                        if (btn=='yes') {
                         	//if ((r = tree.root.lastChild) && r.attributes.menuType == 'recycleBin')
                         	if (r = tree.root.findChild('menuType','recycleBin')) 
                         		rb = r.id || 1;
                         	else
                         		rb = 1;
                        	tree.treeEditor.updateNode(n,{ParentId: rb});
                        }
                    });
            }
        }

        var onTrueDeleteNode = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                Ext.MessageBox.confirm(__('Confirm'),'Do you really want to delete <b>'+n.text+'</b>?<br/><b>THIS CANNOT BE UNDONE!!',
                    function(btn,text) { 
                        if (btn=='yes')
                            tree.treeEditor.onDelete(tree,n);                              
                    });
            }
        }

        var onEmptyRecycleBin = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                Ext.MessageBox.confirm(__('Confirm'),'Do you really want to empty Recycle Bin?<br/><b>THIS CANNOT BE UNDONE!!',
                    function(btn,text) { 
                        if (btn=='yes')
                            var rb = tree.getNodeById('1');
                            if (rb && rb.firstChild) {
                                var ch = rb.childNodes;
                                for (var i = 0;i<ch.length;i++) {
                                   tree.treeEditor.onDelete(tree,ch[i]);         
                                }
                            }
                    });
            }
        }

        var onOpenFilter = function(button,e) {
      //      e.stopEvent();
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.openFilter(n);
            }
        }
        
        var onNewNode = function(button,e) {
            e.stopEvent();
			var tree;
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.createNewNode(n,'leaf');
            }
        }

        var onNewFolderNode = function(button,e) {
            e.stopEvent();
            var tree;
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.createNewNode(n,'folder');
            }
        }

        var onReloadNode = function(button,e) {
            var tree;
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
               // tree.body.mask('Loading', 'x-mask-loading');
                delete n.attributes.children;
				n.reload();/*function(){
                    tree.body.unmask();
                    //n.expand(true, true);
                });
                */
                //n.collapse(true, false);
            }
        };

        var askBeforeClose = function(p,lf) {
            if (!lf)
                return;            
            if ( (lf.getForm().isDirty() || ( lf.linkedGrid && lf.linkedGrid.isDirty() ) )
               ) {
                Ext.MessageBox.confirm(__('Confirm'), __('You have not saved changes and they will be lost.<br/>Do you want to exit?'), function(btn, text){
                    if (btn == 'yes') {
                        lf.getForm().reset();
                        if (lf.linkedGrid)
                            lf.linkedGrid.store.rejectChanges();
                        p.close();
                    }
                    else {
                        return false;
                    }
                },this);
                return false;
                
            }
            return true;
            
        }

        var askOnNewRecordButton = function(button, e){
            var lf;
            if (!(lf = button.form))
                return;

            
            if (lf.askBeforeLoad && 
                (lf.getForm().isDirty() || ( lf.linkedGrid && lf.linkedGrid.isDirty() ) )
               ) {
                Ext.MessageBox.confirm(__('Confirm'), __('You have not saved changes and they will be lost.<br/>Do you want to continue?'), function(btn, text){
                    if (btn == 'yes') {
                        lf.getForm().reset();
                        if (lf.linkedGrid)
                            lf.linkedGrid.store.rejectChanges();
                        onNewRecordButton(button,e);
                    }
                    else {
                        return false;
                    }
                },this);
                return false;
                
            }
            else {
                onNewRecordButton(button,e);
            }
            
        }
        var onNewRecordButton = function(button,e) {
            var fFocus,form;
            if (!(form = button.form))
                return;
            var formParams = form.formBaseParams || {};
            formParams.id = 'new';
            formParams.action = 'load';
            formParams.context = 'new-record';
    
            form.load({
                params: formParams,
                waitMsg: 'Loading new blank record',
                success: function() {form.enable();}
            });
            
            if (grid = form.linkedGrid ) {
                if (typeof grid.store == 'object')
                    grid.store.removeAll();
                //grid.customerChanged = false;
                grid.store.baseParams.filter = '';
                grid.store.baseParams.context = form.id;
            }
        
            if (form.focusOnNew && (fFocus = form.getForm().findField(form.focusOnNew))) {
                fFocus.focus(true,100);
            }
        
            delete formParams.context
        }
        
        var onDeleteRecordButton = function(button,e) {
            var tree,editor,node;
            if (!(tree = button.form))
                return;
            if (editor = tree.treeEditor) {
                node = tree.getOneSelectedNode();
                if (node)
                    Ext.MessageBox.confirm(__('Confirm'),__('Do you really want to remove')+' '+node.text,function(btn){
                        if (btn == 'yes') 
                            editor.onDelete(tree,node);
                        
                    });
            }
        }

        var onFnSwitchButton = function(button,e) {
            Ext.MessageBox.confirm('Confirm','Do you really want switch FN Cycle from '+Fresh.FNCycle+'?',function(btn){
                        if (btn != 'yes') 
                            return;
                            
                        var options = {
                            url: Fresh.Config.Service.Report+'json=switch',
                            success: function(response){
                                var result = Ext.decode(response.responseText);
                                if (result.success) {
                                    Fresh.Msg.SlideBox('Success!', result.message || '');
                                    Fresh.FNCycle = parseInt(result.FN);
                                    Fresh.global.actions.showFNCycle.setText('<b>FNCycle '+Fresh.FNCycle+'</b>');
                                }
                                else {
                                    Ext.MessageBox.alert(__('Error'), result.message || '');
                                }
                                
                            },
                            failure: function(){
                                Ext.MessageBox.alert(__('Error'), __('Error occured while saving data.'));
                            }
                        };
                        Ext.Ajax.request(options);
                    });
            }
        
        
        var onImportButton = function(button, e){
            var impwin;
            var form = button.form;
            var impstore = Ext.StoreMgr.lookup('import-store');
            if (impstore.getModifiedRecords().length > 0) {
                Ext.MessageBox.alert(__('Info'), __('Please save your modifications first.'));
                return;
            }
            
            if (button.id == 'upload-import-button') {
                if (form.getForm().isDirty()) {
                
                    if (form.getForm().isValid()) {
                        var formParams = form.formBaseParams ||
                        {};
                        formParams.action = 'upload';
                        
                        form.getForm().submit({
                            params: formParams,
                            waitMsg: 'Uploading...',
                            clientValidation: true,
                            success: function(f, action){
                                var result = action.result;
                                result.message = result.message || '';
                                if (result.success) {
                                    Fresh.Msg.SlideBox(__('Success!'), result.message);
                                    if (impwin = Ext.getCmp('import-win').getLayout()) {
                                        Ext.StoreMgr.lookup('import-store').reload();
                                        impwin.setActiveItem(1);
                                    }
                                }
                            },
                            failure: function(){
                                Ext.MessageBox.alert(__('Error'), 'Error occured uploading orders.');
                            }
                        });
                    }
                }
                else {
                    if (impwin = Ext.getCmp('import-win').getLayout()) {
                        impwin.setActiveItem(1);
                    }
                }
            }
            else {
                if (button.id == 'finish-import-button') {
                
                    var options = {
                        url: form.url,
                        params: Ext.apply(form.formBaseParams, {
                            action: 'import'
                        }),
                        success: function(response){
                            Ext.MessageBox.hide();
							var result = Ext.decode(response.responseText);
                            if (result.success) {
                                var msg = result.message || '';
                                Fresh.Msg.SlideBox(__('Success!'), msg);
                                impstore.reload({
                                    success: function(){
                                        Ext.MessageBox.alert(__('Info'), msg);
                                    }
                                });
                            }
                            else {
	                            Ext.MessageBox.hide();
                                Ext.MessageBox.alert(__('Error'), result.message || '');
                            }
                        },
                        failure: function(){
                            Ext.MessageBox.alert(__('Error'), __('Error occured while saving data.'));
                        }
                    };
					Ext.MessageBox.wait(__('Importing ...'),__('Please wait'));
                    Ext.Ajax.request(options);
                }
                else {
                    if (button.id == 'clear-import-button') {
                        var options = {
                            url: form.url,
                            params: Ext.apply(form.formBaseParams, {
                                action: 'clear'
                            }),
                            success: function(response){
                                var result = Ext.decode(response.responseText);
                                if (result.success) {
                                    var msg = result.message || '';
                                    impstore.reload();
                                    Fresh.Msg.SlideBox(__('Success!'), msg);
                                    Ext.MessageBox.alert('Info', msg);
                                }
                                else {
                                    Ext.MessageBox.alert(__('Error'), result.message || '');
                                }
                            },
                            failure: function(){
                                Ext.MessageBox.alert(__('Error'), __('Error occured while saving preferences.'));
                            }
                        };
                        Ext.MessageBox.confirm(__('Confirm'), 'Do you really want to clear uploaded records?',function(btn) {
                                    if (btn=='yes')
                                        Ext.Ajax.request(options);
                                });
                    }
                    else {
                        if (button.id == 'close-import-button') {
                            impwin = Ext.getCmp('import-win');
                            impwin.close();
                        }
                    }
                }
            }
        }
        
        var onLinkReportButton = function(button, e){
            var grid, filter, f, service;
            if (!(grid = button.form)) 
                return;
 
            if (grid.store && grid.store.getTotalCount()>Fresh.Config.Reports.MaxTotalCount) {
               Ext.MessageBox.alert('Alert','This filter has to many records to create '+button.getText());
               return;
            }
                
           Ext.MessageBox.wait('Creating report','Info');
            f = grid.store.baseParams.filter;
            service = button.service || 'xls';
            button.url = button.url || (Fresh.Config.Service.Report + service + '=report&report='+button.report);
            if (!Fresh.global.dFrame) {
                Fresh.global.dFrame = new Ext.ux.ManagedIFrame({
                    autoCreate: {
                        id: 'downloadMIF',
                        src: button.url + '&filter=' + f+'&filterName='+encodeURIComponent(Fresh.global.actions.filterNoAction.getText()),
                        style: 'visibility: hidden'
                    },
                    loadMask: false 
                });
            } else {
                Fresh.global.dFrame.setSrc(button.url + '&filter=' + f+'&filterName='+encodeURIComponent(Fresh.global.actions.filterNoAction.getText()));
            }
            (function(){
                Ext.MessageBox.hide();
            }).defer(5000);
        }
        
        return {

            linkReportButtonHandler: function(button,e) {
              onLinkReportButton(button,e);
            },

            deleteRecordHandler: function(button,e,f) {
              button.form  = Ext.getCmp(f);
              onDeleteRecordButton(button,e);
            },

            editRecordHandler: function(button,e,f) {
              button.form  = Ext.getCmp(f);
              onOpenFilter(button,e);
            },


            askBeforeCloseHandler: function(p,fname) {
                if (!(lf = Ext.getCmp(fname)))
                        return true;
              	return askBeforeClose(p,lf);
            },

            closeWindowHandler: function(f) {
              var win;
              if (win  = Ext.getCmp(f))
              	win.close();
            },

            newRecordHandler: function(button,e,f) {
              button.form  = Ext.getCmp(f);
              askOnNewRecordButton(button,e);
            },
            
            fnSwitchFNHandler: function(button,e) {
              onFnSwitchButton(button,e);
            },

            saveFormHandler: function(button,e,f) {
                button.form = Ext.getCmp(f);
                onSaveButton(button,e);
            },

            importHandler: function(button,e,f) {
                if ('string' === typeof f)
                    button.form = Ext.getCmp(f);
                onImportButton(button,e);
            },
            
            showFNCycle: new Ext.Action({
                text: '<b>FNCycle: '+Fresh.FNCycle+'</b>',
                handler: Ext.emptyFn,
                disabled: false
            }),

            newRecord: new Ext.Action({
                text: __('New'),
                minWidth: 75,
                handler: askOnNewRecordButton,
                disabled: false
            }),

            save: new Ext.Action({
                text: __('Save'),
                minWidth: 75,
                handler: onSaveButton,
                disabled: false
            }),

            saveGridTool: new Ext.Action({
                iconCls: 'icon-save',
                text: __('Save'),
                handler: onSaveGridTool,
                disabled: false
            }),

            search: new Ext.Action({
                text: __('Search'),
                minWidth: 75,
                handler: onSearchButton,
                disabled: false
            }),

            cancelGridTool: new Ext.Action({
                iconCls: 'icon-cancel',
                text: __('Cancel'),
                handler: onCancelGridTool,
                disabled: false
            }),

            addGridTool: new Ext.Action({
                iconCls: 'icon-new',
                text: __('Add'),
                handler: onAddGridTool,
                disabled: false
            }),

            deleteGridTool: new Ext.Action({
                iconCls: 'icon-delete',
                text: __('Delete'),
                handler: onDeleteGridTool,
                disabled: false
            }),

            cancel: new Ext.Action({
                text: __('Cancel'),
                minWidth: 75,
                handler: onCancelButton,
                disabled: true
            }),

            expandTree: new Ext.Action({
                text: __('Expand all'),
                iconCls: 'expand',
 //               minWidth: 75,
                handler: onExpandTreeButton
            }),

            collapseTree: new Ext.Action({
                text: __('Collapse all'),
                iconCls: 'collapse',
 //               minWidth: 75,
                handler: onCollapseTreeButton,
                disabled: false
            }),

            reloadTree: new Ext.Action({
                text: __('Reload'),
                iconCls: 'reload',
 //               minWidth: 75,
                handler: onReloadTreeButton,
                disabled: false
            }),

            reloadNode: new Ext.Action({
                text: __('Reload'),
                iconCls: 'reload',
 //               minWidth: 75,
                handler: onReloadNode,
                disabled: false
            }),

            reloadGrid: new Ext.Action({
             //   id: 'refresh',
                text: __('Reload'),
                iconCls: 'reload',
                handler: onReloadGridButton,
                disabled: false
            }),
            
            deleteNode: new Ext.Action({
             //   id: 'refresh',
                text: __('Delete'),
                iconCls: 'icon-delete',
                handler: onDeleteNode,
                disabled: false
            }),

            trueDeleteNode: new Ext.Action({
             //   id: 'refresh',
                text: __('Delete'),
                iconCls: 'icon-delete',
                handler: onTrueDeleteNode,
                disabled: false
            }),

            emptyRecycleBin: new Ext.Action({
             //   id: 'refresh',
                text: __('Empty Recycle Bin'),
                iconCls: 'icon-delete',
                handler: onEmptyRecycleBin,
                disabled: false
            }),

            renameNode: new Ext.Action({
             //   id: 'refresh',
                text: __('Rename'),
                iconCls: 'icon-rename',
                handler: onRenameNode,
                disabled: false
            }),
            
            openFilter: new Ext.Action({
             //   id: 'refresh',
                text: __('Open'),
                iconCls: 'icon-open',
                handler: onOpenFilter,
                disabled: false
            }),
            
            newNode: new Ext.Action({
                text: __('New filter'),
                iconCls: 'icon-new',
                handler: onNewNode,
                disabled: false
            }),
            
            newCategoryNode: new Ext.Action({
                text: __('New category'),
                iconCls: 'icon-folder-new',
                handler: onNewFolderNode,
                disabled: false
            }),

            filterNoAction: new Ext.Action({
                text: __('No filter'),
                iconCls: 'icon-action'
                }),
            filterNoActionOpen: new Ext.Action({
                text: __('No filter'),
                iconCls: 'icon-action'
                }),
            newFolderNode: new Ext.Action({
                text: __('New folder'),
                iconCls: 'icon-folder-new',
                handler: onNewFolderNode,
                disabled: false
            }),
			saveFormData: function(form) { 
				onSaveButton(form); 
			}
        }
}();

Ext.ux.Plugin.ComponentService = function (config){
	var defaultType = config.xtype || 'panel';
    var defaultScope = config.scope || this;
    var callback = function(res){ 
        var aResult = res.responseText.split('/* --- */');
        
        while (aResult.length>1) {
            sObj = aResult.shift();
            oObj = Ext.decode(sObj);
            if (oObj.evalTo == 'global') {
                if (oObj.overwrite || !Ext.type(Fresh.global[oObj.name])) 
                    Fresh.global[oObj.name] = Ext.decode.call(Fresh.global, oObj.definition);
            }
            else {
                if (oObj.evalTo == 'local' || !oObj.evalTo) 
                    if (oObj.overwrite || !Ext.type(defaultScope[oObj.name])) {
                        var obj = Ext.decode.call(defaultScope, oObj.definition);
                        defaultScope[oObj.name] = obj;
                    }
            }
        }
        var JSON = Ext.decode.call(defaultScope,aResult[0]);
        var cpm = Ext.ComponentMgr.create(JSON, defaultType);
		this.container.add(cpm).show();
		this.container.doLayout() ;
        cpm.store.load({meta: true});
	};
    return{
		init : function (container){
			this.container = container;
            this.container.loadComponent = this.load.createDelegate(this);
    	},
        load: function(cfg) {
            var cfg = cfg || {};
            Ext.Ajax.request(Ext.apply(config, {success: callback, scope: this}, cfg));
        }
	}
};

Fresh.global.actions = MyDesktop.actions;
