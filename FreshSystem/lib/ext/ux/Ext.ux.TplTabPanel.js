/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.ns('Ext.ux');
Ext.ux.TplTabPanel = Ext.extend(Ext.TabPanel, {
    initComponent: function () {
        //Ext.apply(this,{store:this.store});
        Ext.ux.TplTabPanel.superclass.initComponent.apply(this, arguments);

        if (Ext.isString(this.store))
               this.store = Ext.StoreMgr.lookup(this.store);
        this.store.on('load',this.reloadTabs,this);
    },

    reloadTabs: function(store) {

        this.removeAll();
        var cnt = store.getCount();
        var tb = this;

        Ext.each(this.tabsTpl, function (j) {
            for (var i = 0; i < cnt; i++) {


                var c = j.render ? c = j.cloneConfig() : Ext.ComponentMgr.create(j);


                function myfn() {
                    Ext.apply(this, store.getAt(i).get(this.applyValues));
                }
                c.cascade(myfn);
                Ext.ComponentMgr.register(c);

                tb.add(c);

            }
        });
        this.doLayout();

    }
});
Ext.reg('tabtpl', Ext.ux.TplTabPanel);

Ext.ux.ComponentListView = Ext.extend(Ext.ListView, {
    defaultType: 'textfield',
    initComponent : function(){
        Ext.ux.ComponentListView.superclass.initComponent.call(this);
        this.components = [];
    },
    refresh : function(){
        Ext.destroy(this.components);
        this.components = [];
        Ext.ux.ComponentListView.superclass.refresh.apply(this, arguments);
        this.renderItems(0, this.store.getCount() - 1);
    },
    onUpdate : function(ds, record){
        var index = ds.indexOf(record);
        if(index > -1){
            this.destroyItems(index);
        }
        Ext.ux.ComponentListView.superclass.onUpdate.apply(this, arguments);
        if(index > -1){
            this.renderItems(index, index);
        }
    },
    onAdd : function(ds, records, index){
        var count = this.all.getCount();
        Ext.ux.ComponentListView.superclass.onAdd.apply(this, arguments);
        if(count !== 0){
            this.renderItems(index, index + records.length - 1);
        }
    },
    onRemove : function(ds, record, index){
        this.destroyItems(index);
        Ext.ux.ComponentListView.superclass.onRemove.apply(this, arguments);
    },
/**
 * Workarround, um einen Destroy Fehler zu vermeiden
 * Quelle: http://www.sencha.com/forum/showthread.php?79210-ComponentDataView-Ext-components-inside-a-dataview-or-listview
 */

    onDestroy : function(){
        Ext.ux.ComponentListView.superclass.onDestroy.call(this);
        Ext.destroy(this.components);
        this.components = [];
    },
    renderItems : function(startIndex, endIndex){
        var ns = this.all.elements;
        var args = [startIndex, 0];
        for(var i = startIndex; i <= endIndex; i++){
            var r = args[args.length] = [];
            for(var columns = this.columns, j = 0, len = columns.length, c; j < len; j++){
                var component = columns[j].component;

                //If no component is defined
                if (!component) {
                  continue;
                }

                if (component.length > 1) {
                  var components = component;
                  for (var k = 0; k < components.length; k++) {
                    var component = components[k];

                    c = component.render ?
                        c = component.cloneConfig() :
                        Ext.create(component, this.defaultType);
                    r[j] = c;
                    var node = ns[i].getElementsByTagName('dt')[j].firstChild;
                    if(c.renderTarget){

                        //If no renderTarget was found - prevent errors
                        if (Ext.DomQuery.jsSelect(c.renderTarget, node)) {
                          //c.render(Ext.DomQuery.selectNode(c.renderTarget, node));
                          var elm = Ext.DomQuery.jsSelect(c.renderTarget, node);
                          Ext.each(elm, function(item) {
                              var nextEl = c.cloneConfig();
                              nextEl.render(item);
                          })
                        }

                        /*if (Ext.DomQuery.selectNode(c.renderTarget, node)) {
                          c.render(Ext.DomQuery.selectNode(c.renderTarget, node));
                        }*/

                    }else if(c.applyTarget){
                        c.applyToMarkup(Ext.DomQuery.selectNode(c.applyTarget, node));
                    }else{
                        c.render(node);
                    }
                    if(c.applyValue === true){
                        c.applyValue = columns[j].dataIndex;
                    }
                    if(Ext.isFunction(c.setValue) && c.applyValue){
                        c.setValue(this.store.getAt(i).get(c.applyValue));
                        c.on('blur', function(f){
                            this.store.getAt(this.index).data[this.dataIndex] = f.getValue();
                        }, {store: this.store, index: i, dataIndex: c.applyValue});
                    }

                  }
                } else {

                    c = component.render ?
                        c = component.cloneConfig() :
                        Ext.create(component, this.defaultType);
                    r[j] = c;
                    var node = ns[i].getElementsByTagName('dt')[j].firstChild;
                    if(c.renderTarget){

                        //If no renderTarget was found - prevent errors
                        if (Ext.DomQuery.selectNode(c.renderTarget, node)) {
                          c.render(Ext.DomQuery.selectNode(c.renderTarget, node));
                        }

                    }else if(c.applyTarget){
                        c.applyToMarkup(Ext.DomQuery.selectNode(c.applyTarget, node));
                    }else{
                        c.render(node);
                    }
                    if(c.applyValue === true){
                        c.applyValue = columns[j].dataIndex;
                    }
                    if(Ext.isFunction(c.setValue) && c.applyValue){
                        c.setValue(this.store.getAt(i).get(c.applyValue));
                        c.on('blur', function(f){
                            this.store.getAt(this.index).data[this.dataIndex] = f.getValue();
                        }, {store: this.store, index: i, dataIndex: c.applyValue});
                    }

                }

            }
        }
        this.components.splice.apply(this.components, args);
    },
    destroyItems : function(index){
        Ext.destroy(this.components[index]);
        this.components.splice(index, 1);
    }
});
Ext.reg('complistview', Ext.ux.ComponentListView);

Ext.ux.ComponentDataView = Ext.extend(Ext.DataView, {
    defaultType: 'textfield',
    initComponent : function(){
        Ext.ux.ComponentDataView.superclass.initComponent.call(this);
        this.components = [];
    },
    refresh : function(){
        Ext.destroy(this.components);
        this.components = [];
        Ext.ux.ComponentDataView.superclass.refresh.call(this);
        this.renderItems(0, this.store.getCount() - 1);
    },
    onUpdate : function(ds, record){
        var index = ds.indexOf(record);
        if(index > -1){
            this.destroyItems(index);
        }
        Ext.ux.ComponentDataView.superclass.onUpdate.apply(this, arguments);
        if(index > -1){
            this.renderItems(index, index);
        }
    },
    onAdd : function(ds, records, index){
        var count = this.all.getCount();
        Ext.ux.ComponentDataView.superclass.onAdd.apply(this, arguments);
        if(count !== 0){
            this.renderItems(index, index + records.length - 1);
        }
    },
    onRemove : function(ds, record, index){
        this.destroyItems(index);
        Ext.ux.ComponentDataView.superclass.onRemove.apply(this, arguments);
    },
    onDestroy : function(){
        Ext.ux.ComponentDataView.onDestroy.call(this);
        Ext.destroy(this.components);
        this.components = [];
    },
    renderItems : function(startIndex, endIndex){
        var ns = this.all.elements;
        var args = [startIndex, 0];
        for(var i = startIndex; i <= endIndex; i++){
            var r = args[args.length] = [];
            for(var items = this.items, j = 0, len = items.length, c; j < len; j++){
                c = items[j].render ?
                    c = items[j].cloneConfig() :
                    Ext.create(items[j], this.defaultType);
                r[j] = c;
                if(c.renderTarget){
                    c.render(Ext.DomQuery.selectNode(c.renderTarget, ns[i]));
                }else if(c.applyTarget){
                    c.applyToMarkup(Ext.DomQuery.selectNode(c.applyTarget, ns[i]));
                }else{
                    c.render(ns[i]);
                }
                if(Ext.isFunction(c.setValue) && c.applyValue){
                    c.setValue(this.store.getAt(i).get(c.applyValue));
                    c.on('blur', function(f){
                    	this.store.getAt(this.index).data[this.dataIndex] = f.getValue();
                    }, {store: this.store, index: i, dataIndex: c.applyValue});
                }
            }
        }
        this.components.splice.apply(this.components, args);
    },
    destroyItems : function(index){
        Ext.destroy(this.components[index]);
        this.components.splice(index, 1);
    }
});
Ext.reg('compdataview', Ext.ux.ComponentDataView);
/*
Ext.onReady(function () {
    new Ext.Viewport({
        layout: 'hbox',
        layoutConfig: {
            align: 'stretch'
        },
        defaults: {
            flex: 1
        },
        items: new Ext.ux.TplTabPanel({
            id: 'climate_panel',
            activeTab: 0,
            store: new Ext.data.JsonStore({
                storeId: 'weather',
                data: [{
                    id: 'raw',
                    panel: {
                        title: 'Raw',
                        id: 'rawfield'
                    },
                    fieldset: {
                        title: 'Observed',
                        id: 'observed'
                    },
                    checks: {
                        items: [{
                            boxLabel: 'Precipitation',
                            id: 'chk1'
                        },
                        {
                            boxLabel: 'Temperature',
                            id: 'chk2'
                        }]
                    }
                },
                {
                    id: 'hourly',
                    panel: {
                        title: 'Hourly',
                        id: 'hourfield'
                    },
                    fieldset: {
                        title: 'Observed Hourly',
                        id: 'observed_hourly'
                    },
                    checks: {
                        items: [{
                            boxLabel: 'Altimeter'
                        },
                        {
                            boxLabel: 'Visibility'
                        }]
                    }
                }],
                fields: ['panel', 'title', 'id', 'cn', 'value', 'checks', 'fieldset', 'boxLabel', 'items'],

            }),
            tabsTpl: {
                xtype: 'panel',
                layout: 'form',
                applyValues: 'panel',
                items: {
                    xtype: 'fieldset',


                    applyValues: 'fieldset',
                    items: {
                        xtype: 'checkboxgroup',
                        //items:[],
                        applyValues: 'checks'
                    }
                }
            }
        })


    });
});

*/