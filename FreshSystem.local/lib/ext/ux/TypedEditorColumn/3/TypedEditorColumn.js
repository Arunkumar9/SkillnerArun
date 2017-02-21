/**
 * @author rosa
 */
Ext.namespace('Ext.ux','Ext.ux.form');

/* Ext.override(Ext.grid.ColumnModel,{
   getCellEditor : function(colIndex, rowIndex){
        //var editor;
        //editor = this.config[colIndex].getTypedCellEditor;
        if ('function' === typeof this.config[colIndex].getEditorInstance)
            return this.config[colIndex].getCellEditor(colIndex,rowIndex);
        else
            return this.config[colIndex].getCellEditor(rowIndex);
    },
    
     /**
     * Destroys this column model by purging any event listeners, and removing any editors.
     */
    //destroy : function(){
      ///  Ext.destroy(this.config);
        //this.purgeListeners();
    //}
   /**
     * Reconfigures this column model
     * @param {Array} config Array of Column configs
     
    setConfig : function(config, initial){
        if(!initial){ // cleanup
            delete this.totalWidth;
            for(var i = 0, len = this.config.length; i < len; i++){
                var c = this.config[i];
                if(c.editor && 'function' == typeof c.editor.destroy){
                    c.editor.destroy();
                }
            }
        }
        this.config = config;
        this.lookup = {};
        // if no id, create one
        for(var i = 0, len = config.length; i < len; i++){
            var c = config[i];
            if(typeof c.renderer == "string"){
                c.renderer = Ext.util.Format[c.renderer];
            }
            if(typeof c.id == "undefined"){
                c.id = i;
            }
            if(c.editor && c.editor.isFormField){
                c.editor = new Ext.grid.GridEditor(c.editor);
            }
            this.lookup[c.id] = c;
        }
        if(!initial){
            this.fireEvent('configchange', this);
        }
    }
});*/
/*
Ext.ux.grid.TypedEditorColumn = function(config){
    Ext.applyIf(this, config, {
        defaultEditor: { xtype: 'textfield' },
        renderer: Ext.grid.ColumnModel.defaultRenderer,
        typeField: 'type'
    });
    Ext.ux.grid.TypedEditorColumn.superclass.constuctor.call(this,config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
    this.getTypedCellEditor = this.getTypedCellEditor.createDelegate(this);
   // this.editor = this.editor.createDelegate(this);
};
*/
Ext.ux.grid.TypedEditorColumn = Ext.extend(Ext.grid.Column , {
    typeField: 'type',
    editable: true,
   /* constructor: function(config){

        Ext.ux.grid.TypedEditorColumn.superclass.constructor.call(this,config);

        if(!this.id){
            this.id = Ext.id();
        }
    //    this.renderer = this.renderer.createDelegate(this);
       // this.getTypedCellEditor = this.getTypedCellEditor.createDelegate(this);
       // this.editor = this.editor.createDelegate(this);
    },*/

    init : function(grid){
        this.grid = grid;
        this.editorCache = new Ext.util.MixedCollection();
        this.rendererCache = new Ext.util.MixedCollection();
        
        if (!this.store)
            this.editor = Ext.ComponentMgr.create(this.defaultEditor);
            
        if ('string' === typeof this.store)
            this.store = Ext.StoreMgr.lookup(this.store);
        
        grid.on('afteredit',this.onAfterEdit,this);
/*
        if (this.grid.rendered) {
                grid.on('cellmousedown', this.onCellMouseDown, this);
                if (this.relatedDataIndex) 
                    grid.on('afteredit', this.onAfterEdit, this);
        }
        else {
            this.grid.on('render', function(){
                grid.on('cellmousedown', this.onCellMouseDown, this);
                if (this.relatedDataIndex) 
                    grid.on('afteredit', this.onAfterEdit, this);
            }, this);
        }
        Ext.ux.grid.TypedEditorColumn.superclass.constuctor.call(this,config);

*/    },

    onAfterEdit: function(e) {
                Fresh.console.log('afteredit ');
                if (e.field == 'definition_uid' && e.originalValue != e.value) {
                    var astore = Ext.StoreMgr.lookup('attributes-definitions-store');
                    var type = astore.getById(e.value).get(this.typeField);
                    Fresh.console.log('type '+type);
                    e.record.set(this.typeField,type);
                }
            },
    getEditorInstance: function(type) {
        var editor,tr,etype;
        if ( !(editor = this.editorCache.get(type)) ) {
            if (tr = this.store.getById(type)) 
                etype = tr.get('editor');

            etype = (etype) ? Ext.decode(etype) : this.defaultEditor;
            editor = Ext.ComponentMgr.create(etype);
            if(editor && editor.isFormField){
                editor = new Ext.grid.GridEditor(editor);
            } else {
                editor = new Ext.grid.GridEditor(new Ext.form.TextField());
            }
			if ('function' != typeof editor.destroy)
				editor.destroy = Ext.emptyFn;
            this.editorCache.add(type,editor);
        }
        return editor;
    },
    
    renderer: function(v, p, record){
        var rd,rs,tr,etype,type;
        type = record.get(this.typeField);
        if ( !(rd = this.rendererCache.get(type)) ) {
            if (tr = this.store.getById(record.get(this.typeField)))
                rd = tr.get('renderer');

            if ('string' === typeof rd && rd.trim()) {
				Fresh.console.log('eval '+rd.trim());
				eval('rd = ' + rd.trim());
			}
            if ('function' !== typeof rd)
               rd = Ext.grid.ColumnModel.defaultRenderer;

           	this.rendererCache.add(type,rd.createDelegate(this));
        }
        return rd(v, p, record);
    },

    getCellEditor: function(row) {
        var type ;
        if (Ext.type(row)) {
	       // var fieldName = this.grid.getColumnModel().getDataIndex(col); // Get field name
	        var record = this.grid.store.getAt(row);
	         type = record.get(this.typeField) || 1;
        }
        else {
            type = 1;
        }
        return this.getEditorInstance(type);
    }

});    
    
    


