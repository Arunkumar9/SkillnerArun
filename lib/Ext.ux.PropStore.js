/**
 * @author rosa
 */
Ext.ux.PropStore = function(config){

    Ext.ux.PropStore.superclass.constructor.call(this, Ext.apply(config));

        this.on("add", this.uxSetPropSource, this);
        this.on("remove", this.uxSetPropSource, this);
        this.on("datachanged", this.uxSetPropSource, this);   
        this.on("load", this.uxSetPropSource, this);       

        this.uxPropertyGrid.on("render", this.uxPropInit, this);      
    };

Ext.extend(Ext.ux.PropStore, Ext.data.SimpleStore, {

    uxPropertyStrict : true,
    uxPropertyText : 'Select Option',
    uxPropertyIconCls : 'optionIcon',
    uxPropertyGrid : false,
    uxProperties : false,
    uxMenu : false,

    uxPropInit : function() {
        if(this.uxProperties && this.uxPropertyGrid) this.uxAddToolbarButton();
    
        this.uxSetPropSource();    
        this.uxPropertyGrid.on("propertychange", this.uxGetPropSource, this);           
    },
    
    uxSubmitStore : function(form) {
    
        for(var i = 0; i < this.getCount(); i++){
            data = this.getAt(i);
        
            form.add(new Ext.form.Hidden({name: data.get('name'), value: data.get('value')}));                
        }                
    
        form.render();
    },
    
    uxSetPropSource : function() {
    
        var source = {};
        var remove = [];
        
        for(var i = 0; i < this.getCount(); i++){
            data = this.getAt(i);
            
            if(!this.uxPropertyStrict || (this.uxPropertyStrict && this.uxProperties[data.get('name')])) source[data.get('text')] = data.get('value');
            else remove.unshift(i);
            
            if(this.uxProperties) {
                if(this.uxProperties[data.get('name')]) {
                    var id = data.get('name') + 'Option';                
                    Ext.getCmp(id).disable();
                }
            }        
        }
    
        for(var i = 0; i < remove.length; i++) {
            this.remove(this.getAt(remove[i]));
        }
    
        this.uxPropertyGrid.setSource(source);
    
    },
    
    uxGetPropSource : function() {
    
        source = this.uxPropertyGrid.getSource();
        
        var c = 0;
        for(var i in source) {
            data = this.getAt(c);    
            data.set('value', source[i]);
            c++;                
        }        
    
    //throws an error...
    //this.fireEvent("datachanged", this);
    
    },
    
    uxAddToolbarButton : function() {
        var tbar = this.uxPropertyGrid.getTopToolbar();
        
        var itemsArray = [];
        
        for(var i in this.uxProperties) {
        
            var f = this.uxAddRecord.createDelegate(this, [i]);
            var id = i + 'Option';            
            itemsArray.push({id: id, text: this.uxProperties[i], handler: f }); 
        }
        
        this.uxMenu = {text: this.uxPropertyText,
        iconCls: this.uxPropertyIconCls,            
        menu: {items: itemsArray}};
        
        tbar.add(this.uxMenu);        
    },
        
    uxAddRecord : function(type) {
        var id = type + 'Option';
        var record = new Ext.data.Record({text: this.uxProperties[type], value: '', name: type});
        this.add(record);
        Ext.getCmp(id).disable();
    },


});  

/*
Ext.onReady(function(){

//the possible value / text combination for the dropdown
var gridOptions = {name: 'Name', phone: 'Phone', cell: 'Cell'};

//the initial data for the PropertyGrid
var data = [ ["Name","John Doe","name"],  ["Phone","555-1234","phone"],  ["Street","Evergreen Terrace 8045"],  ["Town","Springfield"],  ];

//regular PropertyGrid, no extensions neccessary here, except render a toolbar initially to add the button from the store
var grid = new Ext.grid.PropertyGrid({
    autoHeight: true,
    width: 405, 
    tbar : new Ext.Toolbar(),
});


//the custom PropStore which is a subclass of SimpleStore for my application, because the form gets submitted the regular way, feel free to enhance the store for your AJAX needs
var propStore = new Ext.ux.PropStore({
        //currently these values are fixed. Text is displayed in the grid, value is the value, name is the submitted variable
    fields:["text", "value", "name"], 
        //load the initial data
    data:data,
        //reference the grid
    uxPropertyGrid:grid,
        //reference the possible options that can be chosen from the dropdown. if none are submitted no button is added to the toolbar    
    uxProperties:gridOptions,
        //optional set strict mode to check if the initial data contains only values from the possible options. default: true
        //uxPropertyStrict : false,
    //uxPropertyText : 'Select Option',
    //uxPropertyIconCls : 'optionIcon',
});

//simple form that currently gets submitted via get to the same page to test the values being transmitted.
    var simple = new Ext.FormPanel({   
          id: 'myForm',
      onSubmit: Ext.emptyFn,
        submit: function() {
            propStore.uxSubmitStore(this);
            this.getForm().getEl().dom.submit();
        },            
        url:location.href,
        method: 'get',
        frame:true,
        title: 'Simple Form',
        bodyStyle:'padding:5px',
        width: 420,
        items: [grid],
        buttons: [{
            text: 'Save',
            handler: function() {
              Ext.getCmp('myForm').submit();},
        }],
    });

    simple.render(document.body);

});  
*/