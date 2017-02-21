/**
 * @author rosa
 * 
   // custom column plugin example
    var checkColumn = new Ext.grid.CheckColumn({
       header: "Indoor?",
       dataIndex: 'indoor',
       width: 55
    });
 * 
 * 
 * 
 * 
 */

Ext.grid.TriCheckColumn = function(config){
    Ext.apply(this, config, {
        shownValues: ['no','yes','']
        //relatedDataIndex: 'Qty'
    });
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.TriCheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        if (this.grid.rendered) {
//                var view = this.grid.getView();
                //            view.mainBody.on('celldblclick', this.onCellDblClick, this);
                grid.on('cellmousedown', this.onCellMouseDown, this);
                if (this.relatedDataIndex) 
                    grid.on('afteredit', this.onAfterEdit, this);
        }
        else {
            this.grid.on('render', function(){
//                var view = this.grid.getView();
                //            view.mainBody.on('celldblclick', this.onCellDblClick, this);
                grid.on('cellmousedown', this.onCellMouseDown, this);
                if (this.relatedDataIndex) 
                    grid.on('afteredit', this.onAfterEdit, this);
            }, this);
        }
    },

    onCellMouseDown : function(grid,y,x,e){
        var fieldName = grid.getColumnModel().getDataIndex(x); // Get field name
        if(fieldName == this.dataIndex){
            e.stopEvent();
            //var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(y);
            var v = record.get(this.dataIndex);
            
            if (v === "1" || v === 1) {
                v = null;
               if (this.relatedDataIndex)
                   record.set(this.relatedDataIndex, null);
            }
            else {
                if (v === "0" || v === 0) {
                    v = "1";
                    if (this.relatedDataIndex && record.get(this.relatedDataIndex) == 0)
                        record.set(this.relatedDataIndex, 1);
                }
                else {
                    v = "0";
                    if (this.relatedDataIndex)
                        record.set(this.relatedDataIndex, 0);
                }
            }

            record.set(this.dataIndex, v);
        }
    },

    onAfterEdit : function(e){
        if (this.relatedDataIndex && e.field == this.relatedDataIndex) {
//            var record = this.grid.store.getAt(e.row);
            if (e.value === "0" || e.value === 0) {
                e.record.set(this.dataIndex,'0');
            }
            else {
                if (e.value === "") {
                    e.record.set(this.dataIndex,null);
                    e.value = null;
                }
                else {
                    e.record.set(this.dataIndex,'1');
                }
            }
        
        }
    },
    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        var cls = 'x-grid3-tricheck-col';
        var text = '';
        if (v === "1" || v === 1) {
            cls += '-on';
            text = this.shownValues[1];
        }
        else {
            if (v === "0" || v === 0) {
                cls += '-off';
                text = this.shownValues[0];
            }
            else {
                cls += '-null';
                text = this.shownValues[2];
            }
        }
//        var box = '<span class="'+cls+'">&nbsp;</span>';
        return '<div class="'+cls+' x-grid3-cc">&#160;'+text+'</div>';
    }
};

Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config, {
        shownValues: ['no','yes','']
    });
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        if (this.grid.rendered) {
                grid.on('cellmousedown', this.onCellMouseDown, this);
        }
        else {
            this.grid.on('render', function(){
                grid.on('cellmousedown', this.onCellMouseDown, this);
            }, this);
        }
    },

    onCellMouseDown : function(grid,y,x,e){
        e.stopEvent();
        var fieldName = grid.getColumnModel().getDataIndex(x); // Get field name
        if( fieldName == this.dataIndex ){
            var record = this.grid.store.getAt(y);
            var v = record.get(this.dataIndex);
            
            if (v === "1" || v === true || v === 1) {
               v = "0";
            }
            else {
               v = "1";
            }

            record.set(this.dataIndex, v);
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        var cls = 'x-grid3-check-col';
        var text = '';
        if (v === "1" || v === true || v === 1) {
            cls += '-on';
        }
        else {
            cls += '-null';
        }
        return '<div class="'+cls+' x-grid3-cc"></div>';
    }
};

Ext.ux.grid.CheckColumn = function(config){
    Ext.apply(this, config, {
        shownValues: ['no','yes',''],
        
        //
        // add disabled variable to the config of the checkcolumn 
        // assign the value assigned to disabled proeperty while initialization.
        // if disabled value is not passed while initialization by default it will be false.
        //
        
        disabled:config.disabled
    });
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.ux.grid.CheckColumn = Ext.extend(Ext.grid.Column, {

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent : function(name, e, grid, rowIndex, colIndex){
    	
    	//
    	// get the disabled property of the checkcolumn. if disabled is true then dont change the value.
    	//
    	var disabled = grid.getColumnModel().config[ colIndex ].disabled;
    	
        if ( ( name == 'mousedown' || name == 'click' ) && !disabled ) {
        	
            var record = grid.store.getAt(rowIndex);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            return false; // Cancel row selection.
            
        } else {
            return Ext.grid.ActionColumn.superclass.processEvent.apply(this, arguments);
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return String.format('<div class="x-grid3-check-col{0}">&#160;</div>', v ? '-on' : '');
    },

    // Deprecate use as a plugin. Remove in 4.0
    init: Ext.emptyFn
});

// register ptype. Deprecate. Remove in 4.0
Ext.preg('checkcolumn', Ext.ux.grid.CheckColumn);

// backwards compat. Remove in 4.0
Ext.grid.CheckColumn = Ext.ux.grid.CheckColumn;

// register Column xtype
Ext.grid.Column.types.checkcolumn = Ext.ux.grid.CheckColumn;