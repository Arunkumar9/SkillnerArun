Ext.namespace('Ext.ux');

Ext.ux.AutoGridPanel = Ext.extend(Ext.grid.GridPanel, {
    
    initComponent : function(){

        if(this.columns && (this.columns instanceof Array)){
            this.colModel = new Ext.grid.ColumnModel(this.columns);
            delete this.columns;
        }
        
        // Create a empty colModel if none given
        if(!this.colModel) {
            this.colModel = new Ext.grid.ColumnModel([]);
        }
        
        Ext.ux.AutoGridPanel.superclass.initComponent.call(this);
        
        // register to the store's metachange event
        if(this.store){
            Fresh.console.log("register meta");
            this.store.on("metachange", this.onMetaChange, this);
        }
        
        // Store the column model to the server on change
        if(this.autoSave) {
            this.colModel.on("widthchange", this.saveColumModel, this);
            this.colModel.on("hiddenchange", this.saveColumModel, this);
            this.colModel.on("columnmoved", this.saveColumModel, this);
            this.colModel.on("columnlockchange", this.saveColumModel, this);            
        }
    },    

    onMetaChange : function(store, meta) {
        Fresh.console.log("onMetaChange", meta.fields);
        
        // loop for every field, only add fields with a header property (modified copy from ColumnModel constructor)
        var c;
        var config = [];
        var lookup = {};
        for(var i = 0, len = meta.fields.length; i < len; i++)
        {
            c = meta.fields[i];
            if(c.header !== undefined){                
                if(typeof c.dataIndex == "undefined"){
                    c.dataIndex = c.name;
                }
                if(typeof c.renderer == "string"){
                    c.renderer = Ext.util.Format[c.renderer];
                }
                if(typeof c.id == "undefined"){
                    c.id = 'c' + i;
                }
                if(c.editor && c.editor.isFormField){
                    c.editor = new Ext.grid.GridEditor(c.editor);
                }
                c.sortable = true;               
                delete c.name;
                
                config[config.length] = c;
                lookup[c.id] = c;                
            }
        }
        
        // Store new configuration
        this.colModel.config = config;  
        this.colModel.lookup = lookup;  
        
        // Re-render grid
        if(this.rendered){
            this.view.refresh(true);
        }
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
    
});