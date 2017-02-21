// $Id: DynamicFilterModelView.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.core');

/** It instantiates a DynamicFilterModelView
  * @class It implements the view for dynamic filters. Dynamic filters mean that the user is allowed to add, remove filter, seeing only the actual filters.
  * It's possible to define more than one filter for the same field.
  * It can be lazyly instantiated using dynamicFilter as xtype.
  * <h4> Example </h4>
  * The following code will instantiate a window with a DynamicFilterModelView inside using lazy initialization
  * <pre>
  * win=new Ext.Window({
  *   title: 'Filters',
  *   width:600,
  *   height:350,
  *   layout: 'border',
  *   closeAction: 'hide',
  *   items: [{ filterModel: filterModel,
  *     region: "center",
  *     xtype: 'dynamicFilter'
  *   }]
  * });
  * </pre>
  * @constructor
  * @param {Object} config
  * @config {Ext.ux.netbox.core.FilterModel}filterModel the filterModel whose filters must be showed
  */
Ext.ux.netbox.core.DynamicFilterModelView=function(config){

  this.filterModel=config.filterModel;
  config=this.createFilterGridConfig(config);
  Ext.ux.netbox.core.DynamicFilterModelView.superclass.constructor.call(this,config);
  this.on('cellclick', this.removeFilter, this);
  this.on('beforeedit', this.updateOperatorStore, this);
  this.on('afteredit', this.updateFilter, this);

  this.populateFilterStore();

  this.getFilterModel().on('elementaryFilterAdded', this.onFilterAdded, this);
  this.getFilterModel().on('elementaryFilterRemoved', this.onFilterRemoved, this);
  this.getFilterModel().on('filterChanged', this.onFilterChanged, this);
  this.getFilterModel().getFieldManager().on('fieldAdded', this.onFieldAdded, this);
  this.getFilterModel().getFieldManager().on('fieldRemoved', this.onFieldRemoved, this);

  this.createFieldCombo();

  this.getView().getRowClass=function(record, index, rowParams, store){
    var cls = '';
    var aFilter = record.data.filter;
    if(!aFilter.isValid()){
      cls='x-grid3-row-notValid';
    }
    return cls;
  };
}

Ext.extend(Ext.ux.netbox.core.DynamicFilterModelView,Ext.grid.EditorGridPanel,/** @scope Ext.ux.netbox.core.DynamicFilterModelView.prototype */
{
  deleteText    : 'Delete',
  filterText    : 'Field',
  operatorText  : 'Operator',
  valueText     : 'Value',
  comboText     : 'Select a new field',

  /** getFilterModel
    * @private
    */
  getFilterModel : function(){
    return(this.filterModel);
  },
  /** onFieldAdded
    * @private
    */
  onFieldAdded : function(field){
    this.addFields([field]);
  },
    /** onFieldRemoved
    * @private
    */
  onFieldRemoved : function(field){
    this.removeFields(field);
  },
  /** onFilterAdded
    * @private
    */
  onFilterAdded : function(filterModel, filter){
    var filterRecord=[];
    filterRecord.push(['',
      filter.getField(),
      filter.getOperator().getId(),
      filter.getValues(),
      filter,
      filter.getId()]);
    this.filterStore.loadData(filterRecord, true);
    filter.on('operatorChanged', this.updateFilterOperator, this);
    filter.on('valueChanged',this.updateFilterValues,this);
  },
  /** onFilterRemoved
    * @private
    */
  onFilterRemoved : function(filterModel, filter){
    var recordToRemove=this.filterStore.getById(filter.getId());
    this.filterStore.remove(recordToRemove);
    filter.un('operatorChanged', this.updateFilterOperator, this);
    filter.on('valueChanged',this.updateFilterValues,this);
  },
  /** onFilterChanged
    * @private
    */
  onFilterChanged : function(){
    this.populateFilterStore();
  },
  /** onEditComplete
    * @private
    */
  onEditComplete: function(ed, value, startValue){
    this.editing=false;
    this.activeEditor=null;
    ed.un('specialkey', this.selModel.onEditorKey, this.selModel);
    if(Ext.util.JSON.encode(value) !== Ext.util.JSON.encode(startValue)){
      var r=ed.record;
      //workaround to manage objects in editorGrid
      r.set=function(name, value){
        if(Ext.util.JSON.encode(this.data[name]) == Ext.util.JSON.encode(value)){
          return;
        }
        this.dirty=true;
        if(!this.modified){
          this.modified={};
        }
        if(typeof this.modified[name] == 'undefined'){
          this.modified[name]=this.data[name];
        }
        this.data[name]=value;
        if(!this.editing){
          this.store.afterEdit(this);
        }
      }
      var field=this.colModel.getDataIndex(ed.col);
      var e={
        grid: this,
        record: r,
        field: field,
        originalValue: startValue,
        value: value,
        row: ed.row,
        column: ed.col,
        cancel:false,
        renderTo: this
      };
      if(this.fireEvent('validateedit', e) !== false && !e.cancel){
        r.set(field, e.value);
        delete e.cancel;
        this.fireEvent('afteredit', e);
      }
    }
    this.view.focusCell(ed.row, ed.col);
  },
  onRender: function(container){
     Ext.ux.netbox.core.DynamicFilterModelView.superclass.onRender.call(this,container);
     this.getTopToolbar().addField(this.fieldCombo);
  },
  /** createFilterGridConfig addding the store etc...
    *
    */
  createFilterGridConfig : function(config){

    this.filterStore=new Ext.data.SimpleStore({
      fields : ['image','field','operatorId','value','filter','filterId'],
      data : [],
      id : 5});

    this.operatorStore=new Ext.data.SimpleStore({
      fields : ['operatorId','operatorLabel'],
      data : [] });

    var operatorCombo=new Ext.form.ComboBox({
      store         : this.operatorStore,
      mode          : 'local',
      valueField    : 'operatorId',
      displayField  : 'operatorLabel',
      editable      : false,
      triggerAction : 'all',
      lazyRender    : true,
      listClass     : 'x-combo-list-small'
    });

    var cm=new Ext.grid.ColumnModel([{
        header    : this.deleteText,
        renderer  : this.imageRenderer,
        width     : 50,
        dataIndex : 'image'
      },{
        header    : this.filterText,
        renderer  : this.fieldRenderer,
        width     : 150,
        dataIndex : 'field'
      },{
        header    : this.operatorText,
        renderer  : this.operatorRenderer,
        width     : 150,
        dataIndex : 'operatorId',
        editor    : operatorCombo
      },{
        header    : this.valueText,
        width     : 150,
        renderer  : this.valueRenderer,
        editable  : true,
        dataIndex : 'value'
      }]);
    //hack to stop the editing when the user selects a new item.
    operatorCombo.on('select',this.completeEditLater,this);

    cm.getCellEditorOrig=cm.getCellEditor;
    cm.filterStore=this.filterStore;
    cm.getCellEditor=function(colIndex, rowIndex){
      if(colIndex==3){
        var filter=this.filterStore.getAt(rowIndex).get('filter');
        var operator=filter.getOperator();
        return(operator.getEditor());
      }
      return(this.getCellEditorOrig(colIndex, rowIndex));
    }
    config.store=this.filterStore;
    config.colModel=cm;
    config.cm=cm;
    config.clicksToEdit=1;
    config.autoExpandColumn='3';
    config.enableColumnHide=false;
    config.enableColumnMove=false;
    config.enableColumnResize=false;
    config.elements='body, tbar';
    if(config.tbar==undefined){
      config.tbar=[];
    }
    return(config);
  },
  
  /** This is a hack. If I stop editing on the select event, the gridpanel will scroll to the first row if there is a scrollbar.
    * The reason is that the ComboBox will request the focus after the event, even if it's not visible 
    * (the editor that contains the combo is already hidden)
    * I delay the complete of the editing at the end of the browser event queue (0 milliseconds of delay), to avoid the problem
    * @provate
    * @ignore
    */
  completeEditLater: function(){
    var scope=this.getColumnModel().getCellEditor(2);
    var fn=scope.completeEdit;
    var task=new Ext.util.DelayedTask(fn,scope);
    task.delay(0);
  },
  /** populateFilterStore
    *
    */
  populateFilterStore : function(){
    this.filterStore.removeAll();
    for(var i=0; i<this.getFilterModel().getAllElementaryFilters().length; i++){
      this.onFilterAdded(this.getFilterModel(),this.getFilterModel().getAllElementaryFilters()[i]);
    }
  },
  /** createFieldCombo
    *
    */
  createFieldCombo : function(){
    this.fieldStore=new Ext.data.SimpleStore({fields: ['fieldId', 'label'], data: [], id:0});
    var allFields=this.getFilterModel().getFieldManager().getAllFields();
    this.addFields(allFields);

    this.fieldCombo=new Ext.form.ComboBox({
        emptyText     : this.comboText,
        displayField  : 'label',
        valueField    : 'fieldId',
        store         : this.fieldStore,
        mode          : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        typeAhead     : true,
        editable      : false
        });

    this.fieldCombo.on('select', this.addFilter, this);
  },
  /** addFields
    *
    *
    */
  addFields : function(fieldsToAdd){
    var fields=[];
    for(var i=0; i<fieldsToAdd.length; i++){
      fields.push([fieldsToAdd[i].getId(), fieldsToAdd[i].getLabel()]);
    }
    this.fieldStore.loadData(fields, true);
    this.fieldStore.sort('label','ASC');
  },
  /** removeFields
    *
    *
    */
  removeFields : function(fieldToRemove){
    var fieldId=fieldToRemove.getId();
    var toRemove=this.fieldStore.getById(fieldId);
    this.fieldStore.remove(toRemove);
  },
  /** addFilter
    *
    *
    */
  addFilter : function(combo, record, index){
    var addedId=this.getFilterModel().addElementaryFilterByFieldId(record.id);
    this.fieldCombo.clearValue();
    this.filterStore.indexOfId(addedId);
    this.startEditing(this.filterStore.indexOfId(addedId),3);
  },
  /** removeFilter
    *
    *
    */
  removeFilter : function(grid, rowIndex, columnIndex, event){
    if (columnIndex == 0){
      var recordToRemove=grid.getStore().getAt(rowIndex);
      var filter=recordToRemove.get('filter');
      this.getFilterModel().removeElementaryFilterById(filter.getId());
    }
  },
  /** updateOperatorStore
    *
    */
  updateOperatorStore : function(e){
    if(e.column==2){
      var field=e.record.get('field');
      var operators=[];
      for(var i=0; i<field.getAvailableOperators().length;i++){
        operators.push([field.getAvailableOperators()[i].getId(),
                        field.getAvailableOperators()[i].getLabel()]);
      }
      this.operatorStore.loadData(operators, false);
    }
  },
  /** updateFilter
    *
    */
  updateFilter : function(e){
    if(e.column==2){
      var filter=e.record.get('filter');
      var operatorId=e.record.get('operatorId');
      filter.setOperator(operatorId);
    } else if(e.column==3){
      var filter=e.record.get('filter');
      try{
        filter.setValues(e.record.get('value'));
      } catch(exp){
        var r=this.filterStore.getById(filter.getId());
        r.set('value',filter.getValues());
      }
    }
    this.filterStore.commitChanges();
  },
  /** updateFilterOperator
    *
    */
  updateFilterOperator : function(filter){
    var record=this.filterStore.getById(filter.getId());
    if(record.get('operatorId')!=filter.getOperator().getId()){
      record.set('operatorId',filter.getOperator().getId());
    }
    this.filterStore.commitChanges();
  },
  /** updateFilterValues
    *
    */
  updateFilterValues: function(filter){
    var record=this.filterStore.getById(filter.getId());
    if(Ext.util.JSON.encode(record.get('value'))!=Ext.util.JSON.encode(filter.getValues())){
      record.set('value',filter.getValues());
    }
    this.filterStore.commitChanges();
  },
  /** imageRenderer
    *
    */
  imageRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return('<img class="x-menu-item-icon x-icon-delete" style="cursor: pointer" src="'+Ext.BLANK_IMAGE_URL+'"/>');
  },
  /** fieldRenderer
    *
    */
  fieldRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return(value.getLabel());
  },
  /** operatorRenderer
    *
    */
  operatorRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    var operator=record.get('filter').getField().getAvailableOperatorById(value);
    return(operator.getLabel());
  },
  /** valueRenderer
    *
    */
  valueRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return(record.get('filter').getOperator().render(value));
  }

});
Ext.reg('dynamicFilter',Ext.ux.netbox.core.DynamicFilterModelView);