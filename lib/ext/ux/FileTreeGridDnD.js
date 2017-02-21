/**
 * FileTreeGridDnD plugin
 *
 *
 * @author    ...
 * @date      ...
 * @version   $Id: FileTreeGridDnD.js 2348 2013-12-20 10:20:54Z arun $
 */

Ext.namespace('Ext.ux', 'Ext.ux.grid');


Ext.ux.Plugin.DragDropFileTreeGrid = function(config) {
    Ext.apply(this, config);
    Ext.ux.Plugin.DragDropFileTreeGrid.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.Plugin.DragDropFileTreeGrid,Ext.util.Observable,{
    init: function(c) {
        c.onRender = c.onRender.createSequence(this.onRender,c);
    },
    onRender: function(ct,position) {
          var g = this;
            var dropZoneOverrides = {
                ddGroup           : 'captionFileDD',
                onContainerOver : function(ddSrc, evtObj, ddData) {
                	
                    var destGrid  = this.grid;
                    var destStore  = this.grid.getStore();
                    var tgtEl    = evtObj.getTarget();
                    var tgtIndex = destGrid.getView().findRowIndex(tgtEl);
                    var records     = ddSrc.dragData.selections;
                    this.clearDDStyles();
                    var wasDropped = false;
                    
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
                    
                    var srcTreePanel     =  ddSrc.tree ;
                    var srcGridStore = undefined;
                    if( !srcTreePanel ){
                    	srcTreePanel = ddSrc.view.grid;
                    	srcGridStore = srcTreePanel.store;
                    }
                    var destStore   = grid.store;
                    var tgtIndex = this.tgtIndex;
                    var records     = ddSrc.dragData.selections;
                    var i,o=0;
                    var tgRec;
                    this.clearDDStyles();
                    var destRecordClass = new Ext.data.Record.create(destStore.fields);
                    var  destRecords = [];
                 
					var content_id =srcTreePanel.findParentByType('form').getForm().findField('content_id');
					
					if( content_id ){
                    	var content_id = content_id.getValue();
                    }
					
                    if (srcTreePanel.id == grid.id) {
                        Ext.each(records, srcGridStore.remove, srcGridStore);                        
                        if (tgtIndex > destStore.getCount()) {
                            tgtIndex = destStore.getCount();
                        }
                        if (!Ext.isEmpty(records)) {
                            destStore.insert(tgtIndex, records);
                        }
                    } else {
                             var rd = new destRecordClass;   
                             rd.set( 'captions',ddData.node.attributes.record.uid);
                             rd.set( 'name' , ddData.node.attributes.record.text);
                             rd.set('description','');
                             rd.set('language_id','');
                             rd.set('video_id', content_id );
                             destRecords.push(rd);
                        if (tgtIndex > destStore.getCount()) {
                            tgtIndex = destStore.getCount();
                        }
                        if (!Ext.isEmpty(destRecords)) {
                            destStore.insert(tgtIndex, destRecords);
                            grid.getSelectionModel().selectRow( tgtIndex );
                        }
                        try{
                        	
                        	grid.startEditing( tgtIndex, 3 );
                        }catch(e){
                        	
                        	console.log( e.mesasge )
                        }
                    }
                    return true;
                }
            };
            
            var ddcfg = Ext.apply({}, dropZoneOverrides, { grid : g });
            new Ext.dd.DropZone(g.el,ddcfg);
    }
});
Ext.util.CSS.createStyleSheet(
".gridBodyNotifyOver { border-color: #00cc33 !important; } \n" +
".gridRowInsertBottomLine { border-bottom:1px dashed #00cc33; }\n " +
".gridRowInsertTopLine {  border-top:1px dashed #00cc33; }"
    ,'DragDropFileTreeGrid');
Ext.preg('pfiletreegriddragdrop',Ext.ux.Plugin.DragDropFileTreeGrid);

// end of file  