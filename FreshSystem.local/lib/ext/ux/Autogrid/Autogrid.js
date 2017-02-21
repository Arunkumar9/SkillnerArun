Ext.namespace('Ext.ux');

Ext.ux.AutoGrid = function(container, config){
    // cant render withot cm... workaround?
    if(!config.cm) {
        config.cm = new Ext.grid.ColumnModel([{header: ""}]);
    }
    
    Ext.ux.AutoGrid.superclass.constructor.call(this, container, config);
    
    // register the metachange event
    if(this.dataSource){
        this.dataSource.on("metachange", this.onMetaChange, this);
    }
};

Ext.extend(Ext.ux.AutoGrid, Ext.grid.EditorGrid, {   
    cellRenderers : {},
    
    addRenderer : function(name, fn) {
        this.cellRenderers[name] = fn;
    },
    
    onMetaChange : function(store, meta) {
        //Fresh.console.log("onMetaChange", store, meta);
        
        var field;
        var config = [];
        var autoExpand = false;
        for(var i=0; i<meta.fields.length; i++)
        {
            // loop for every dataIndex, only add fields with a header property
            field = meta.fields[i];
            if(field.header !== undefined){
                field.dataIndex = field.name;
                
                // search for cell render functions by [field.renderer] or _[field.name]
                if(this.cellRenderers[field.renderer]) {
                    field.renderer = this.cellRenderers[field.renderer];
                } else if(this.cellRenderers["_"+field.name]) {
                    field.renderer = this.cellRenderers["_"+field.name];
                }
                
                // add editors
                if(field.editor !== undefined){
                    var editor = field.editor;
                    switch (editor.type)
                    { 
                        case 'TextField' :
                            field.editor = new Ext.grid.GridEditor(new Ext.form.TextField(editor.config));
                            break;

                        case 'NumberField' :
                            field.editor = new Ext.grid.GridEditor(new Ext.form.NumberField(editor.config));
                            break;

                        case 'DateField' :
                            field.editor = new Ext.grid.GridEditor(new Ext.form.DateField(editor.config));
                            break;

                        case 'Checkbox' :
                            field.editor = new Ext.grid.GridEditor(new Ext.form.Checkbox(editor.config));
                            break;

                        default :
                            alert('type: unknow');
                    }
                }                

                // Auto assign an id if none given.
                if(!field.id) {
                    field.id = 'c' + i;
                }
                
                // if width is auto, set autoExpand variabel (should only be set after reconfigure for some reason)
                if(field.width == "auto") {
                    autoExpand = field.id;
                    field.width = 100;
                }
                                
                // add to the config (field.name is replaced by dataIndex)
                delete field.name;
                config[config.length] = field;                
            }
        }
        
        // Create the new cm, and update the gridview.
        var cm = new Ext.grid.ColumnModel(config);
        this.reconfigure(this.dataSource, cm);
        
        this.autoExpandColumn = autoExpand;        
    }
});