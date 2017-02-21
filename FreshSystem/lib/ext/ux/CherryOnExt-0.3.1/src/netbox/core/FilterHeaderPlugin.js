// $Id: FilterHeaderPlugin.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.core');

/** It creates a new filter header plugin.
  * @class This is a plugin for an Ext.grid.GridPanel useful to highlight the columns of the grid on which there is at least a filter.
  * It assumes that the id of the fields and the dataIndex of the columns are the same.
  * <h4> Example</h4>
  * <pre>
  * grid = new Ext.grid.GridPanel({
  *   store: store,
  *   columns: [
  *     ....
  *   ],
  *   ...
  *   plugins: [new Ext.ux.netbox.core.FilterHeaderPlugin(filterModel)],
  *   ....
  * });
  * </pre>
  * @constructor
  * @param {Ext.ux.netbox.core.FilterModel} filterModel The filterModel that owns the filter
  */
Ext.ux.netbox.core.FilterHeaderPlugin = function(filterModel){
  this.filterModel = filterModel;
};

Ext.ux.netbox.core.FilterHeaderPlugin.prototype = {/** @scope Ext.ux.netbox.core.FilterHeaderPlugin.prototype */

  /** The css class to be applied to column headers that active filters. Defaults to 'ux-filterd-column'
    *
    */
  filterCls: 'ux-filtered-column',

  /** @private
    *
    */
  init : function(grid) {
    this.grid = grid;
    grid.on("render", this.onRender, this);
  },

  /** @private
    *
    */
  onRender: function(){
    this.grid.getView().on("refresh", this.onRefresh, this);
    this.updateColumnHeadings(this.grid.getView());
  },

  /** @private
    *
    */
  onRefresh: function(view){
    this.updateColumnHeadings(view);
  },

  /** @private
    *
    */
  updateColumnHeadings: function(view){
    if(!view || !view.mainHd) return;
    var hds = view.mainHd.select('td').removeClass(this.filterCls);
    for(var i=0, len=view.cm.config.length; i<len; i++){
      var filters = this.filterModel.getElementaryFiltersByFieldId(view.cm.config[i].dataIndex);
      for(var j=0;j<filters.length;j++){
        if(filters[j].isValid()===true){
          hds.item(i).addClass(this.filterCls);
          break;
        }
      }
    }
  }

};