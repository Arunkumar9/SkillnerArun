/**
 * GridDnD plugin
 *
 *
 * @author    ...
 * @date      ...
 * @version   $Id: GridDnD.js 2348 2013-12-20 10:20:54Z arun $
 */

Ext.namespace('Ext.ux', 'Ext.ux.grid');


Ext.ux.Plugin.DragDropGrid = function(config) {
    Ext.apply(this, config);
    Ext.ux.Plugin.DragDropGrid.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.Plugin.DragDropGrid,Ext.util.Observable,{
    init: function(c) {
        c.onRender = c.onRender.createSequence(this.onRender,c);
    },
    onRender: function(ct,position) {
          var g = this;
            var dropZoneOverrides = {
                ddGroup           : 'depGridDD',
                onContainerOver : function(ddSrc, evtObj, ddData) {
                    var destGrid  = this.grid;
                    var destStore  = this.grid.getStore();
                    var tgtEl    = evtObj.getTarget();
                    var tgtIndex = destGrid.getView().findRowIndex(tgtEl);
                    var records     = ddSrc.dragData.selections;
                    this.clearDDStyles();
                    var wasDropped = false;
                    
                    if (destGrid.id != ddSrc.view.grid.id) {
                        Ext.each(records,function(r,i,rr) {
                            if (destStore.findExact('video_id',r.get('content_id'))>-1) {
                                wasDropped = true; return;
                            }
                        });
                    }
                    //if (wasDropped) return false;
                    
                    // is this a row?
                    if (typeof tgtIndex === 'number') {
                        var tgtRow       = destGrid.getView().getRow(tgtIndex);
                        var tgtRowEl     = Ext.get(tgtRow);
                        var tgtRowHeight = tgtRowEl.getHeight();
                        var tgtRowTop    = tgtRowEl.getY();
                        var tgtRowCtr    = tgtRowTop + Math.floor(tgtRowHeight / 2);
                        var mouseY       = evtObj.getXY()[1];
         
                        // below
                        if (mouseY >= tgtRowCtr) {
                            this.point = 'below';
                            tgtIndex ++;
                            tgtRowEl.addClass('gridRowInsertBottomLine');
                            tgtRowEl.removeClass('gridRowInsertTopLine');
                        }
                        // above
                        else if (mouseY < tgtRowCtr) {
                            this.point = 'above';
                            tgtRowEl.addClass('gridRowInsertTopLine');
                            tgtRowEl.removeClass('gridRowInsertBottomLine')
                        }
                        this.overRow = tgtRowEl;
                    }
                    else {
                        tgtIndex = destGrid.store.getCount();
                    }
                    this.tgtIndex = tgtIndex;
         
                    destGrid.body.addClass('gridBodyNotifyOver');
         
                    return (this.dropAllowed && !wasDropped);
                },
                notifyOut : function() {
                    this.clearDDStyles();
                },
                clearDDStyles : function() {
                    this.grid.body.removeClass('gridBodyNotifyOver');
                    if (this.overRow) {
                        this.overRow.removeClass('gridRowInsertBottomLine');
                        this.overRow.removeClass('gridRowInsertTopLine');
                    }
                },
                onContainerDrop : function(ddSrc, evtObj, ddData){
                    
                        var grid        = this.grid;
                        var records     = ddSrc.dragData.selections;
                        var courseStore = grid.getStore();
                        if( grid.id == 'coursecontent-grid' ) {
                            
                            courseStore.filter([
                                                {
                                                    property     : 'type',
                                                    value        : 1,
                                                    anyMatch     : true, 
                                                    caseSensitive: true  
                                                  },
                                                  {
                                                    fn   : function(record) {
                                                        
                                                      return record.get('SettingsExist') == true && ( record.get('PassingScore')!= 0 || record.get('RandomizeQuestions')!=0 || record.get('RequiredComplete') != "") ;
                                                    },
                                                    scope: this
                                                  }
                                                ]);
                        
                            if( courseStore.data.length > 0  ) {
                                courseStore.clearFilter();
                                Ext.MessageBox.confirm(__('Confirm'), __('Saved quiz settings will be lost.<br/>Continue?'), function(btn, text){
                                
                                     if (btn == 'yes') {
                                     
                                        this.handleContainerDrop( ddSrc, evtObj, ddData );
                                        
                                        
                                     }else {
                                        
                                        return;
                                     }
                                     
                                },this);
                            }else {
                                
                                courseStore.clearFilter();
                                this.handleContainerDrop( ddSrc, evtObj, ddData );
                            }
                            
                        }else {
                            courseStore.clearFilter();
                            this.handleContainerDrop( ddSrc, evtObj, ddData );
                        }
                    },
                    
                    handleContainerDrop : function( ddSrc, evtObj, ddData ){
                        
                        var grid        = this.grid;
                        var srcGrid     = ddSrc.view.grid;
                        var destStore   = grid.store;
                        var tgtIndex = this.tgtIndex;
                        var records     = ddSrc.dragData.selections;
                        var i,o=0;
                        var tgRec;
                        this.clearDDStyles();
                        var destRecordClass = new Ext.data.Record.create(destStore.fields);
                        var srcGridStore = srcGrid.store, destRecords = [];
                        
                        // In case of quiz-answers and quizers grid form or contentid will not be there. to make this plugin generic.
                        // checking for the existance of form and the field content_id in the form
                        //
                        
                        var form = srcGrid.findParentByType('form');
                        var contentField = undefined;
                        
                        if( form ){
                            contentField = srcGrid.findParentByType('form').getForm().findField('content_id');
                        }
                        
                        if( contentField ){
                            var content_id = contentField.getValue();
                        }
                        
                        if (srcGrid.id == grid.id) {
                            Ext.each(records, srcGridStore.remove, srcGridStore);                        
                            if (tgtIndex > destStore.getCount()) {
                                tgtIndex = destStore.getCount();
                            }
                            if (!Ext.isEmpty(records)) {
                                destStore.insert(tgtIndex, records);
                            }
                            var gridForm = grid.findParentByType('form');
                            if( gridForm && gridForm.getForm().findField('ContentChanged') ){
                            	gridForm.getForm().findField('ContentChanged').setValue(1);
                            }
                            
                        } else {
                            Ext.each(records, function(r,i,ar) {
                                 var rd = new destRecordClass;   
                                 rd.set('video_id',r.get('content_id'));
                                 rd.set('product_id',content_id);
                                 rd.set('uid',null);//content_id+'|'+rd.get('video_id'));
                                 rd.set('name',r.get('name'));
                                 rd.set('CreatorName',r.get('CreatorName'));
                                 rd.set('type',r.get('type'));
                                 rd.markDirty();
                                 Fresh.console.log(rd);
                                 if (rd.get('video_id') && rd.get('product_id') && (destStore.findExact('video_id',r.get('content_id'))==-1)) {
                                    destRecords.push(rd);
                                    //If the item is dropped in the grid then only set the value as 1 
                                    var gridForm = grid.findParentByType('form');
                                    if( gridForm && gridForm.getForm().findField('ContentChanged') ){
                                    	gridForm.getForm().findField('ContentChanged').setValue(1);
                                    }
                                 }
                            }, srcGridStore);
                            if (tgtIndex > destStore.getCount()) {
                                tgtIndex = destStore.getCount();
                            }
                            if (!Ext.isEmpty(destRecords)) {
                                destStore.insert(tgtIndex, destRecords);
                            }
                        }
                        
                        if (tgtIndex>0) {
                        //    destStore.getCount();                        
                        }

                        
                        destStore.each(function(rec) {
                            rec.set('ordering',o);
                            o = o + 10;
                        });
                        
                        if( grid.id == 'quizes-grid'){
                            grid.saveData();
                            
                            //
                            //if bef_select length greater than zero then find the record from the store and select the recrod.
                            // if existing selections are not there then do not select any record.
                            //
                            
                            if( grid.bef_select.length > 0  ){

                                grid.getSelectionModel().selectRecords( [grid.getStore().getById(grid.bef_select[0].get('uid'))] );
                            }
                            
                        }
                        //grid.saveData();
                        //grid.getStore().
                       
                        
                        //
                        // Since we have changed the content of this grid, we need to ensure that first 
                        // contents are saved before we can finalize the contents.
                        //
                        
                        //
                        // In case of quiz-question-form their is no finalize button. to make this plugin generic.
                        // checking for the finalize button in the form
                        //
                        var finalizebtn = Ext.getCmp('course-form-finalize-button');
                        if( finalizebtn ){
                            
                            // Ext.getCmp('course-form-finalize-button').setDisabled(true);
                        }
                        
                        return true;
                    }

            };
            
            var ddcfg = Ext.apply({}, dropZoneOverrides, { grid : g });
            new Ext.dd.DropZone(g.el,ddcfg);
          
          //var dtEl = c.getView().scroller.dom;
          //c.el.addClass('x-target-droppable');
          /*c.dtField = new Ext.dd.DropTarget(dtEl, {
                          ddGroup: c.ddGroup || 'GridDD',
                          notifyEnter: function(ddSource, e, data) { c.el.highlight(); },
                          notifyDrop: function(ddSource, e, data) {
                            var records =  ddSource.dragData.selections;
                            Ext.each(records, ddSource.grid.store.remove, ddSource.grid.store);
                            firstGrid.store.add(records);
                            firstGrid.store.sort('name', 'ASC');
                            return true
                          }
                        }); */
    }
});
Ext.util.CSS.createStyleSheet(
".gridBodyNotifyOver { border-color: #00cc33 !important; } \n" +
".gridRowInsertBottomLine { border-bottom:1px dashed #00cc33; }\n " +
".gridRowInsertTopLine {  border-top:1px dashed #00cc33; }"
    ,'DragDropGrid');
Ext.preg('pgriddragdrop',Ext.ux.Plugin.DragDropGrid);

// end of file  


