// $Id: FilterEditor.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox');

/** For a description of the parameters look at the documentation of Ext.Editor
  * @class This class extends Editor to allow an object as value (i.e. objects that String() translate into [object Object]. The 2 changes rows 
  * are documented using this comment: <pre>//<-- changed</pre>
  * @constructor
  */
Ext.ux.netbox.FilterEditor = function(field,config){
  Ext.ux.netbox.FilterEditor.superclass.constructor.call(this,field,config);
};

Ext.extend(Ext.ux.netbox.FilterEditor,Ext.grid.GridEditor,/** @scope Ext.ux.netbox.FilterEditor.prototype */
{
  /** This is absolutely equal to the method of GridEditor, but it calls this.setValue and not this.field.setValue
    */
  startEdit : function(el, value){
    if(this.editing){
        this.completeEdit();
    }
    this.boundEl = Ext.get(el);
    var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
    if(!this.rendered){
        this.render(this.parentEl || document.body);
    }
    if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
        return;
    }
    this.startValue = v;
    this.setValue(v);//<-- changed
    if(this.autoSize){
      var sz = this.boundEl.getSize();
      switch(this.autoSize){
        case "width":
        this.setSize(sz.width,  "");
        break;
        case "height":
        this.setSize("",  sz.height);
        break;
        default:
        this.setSize(sz.width,  sz.height);
      }
    }
    this.el.alignTo(this.boundEl, this.alignment);
    this.editing = true;
    this.show();
  },

  /** This is absolutely equal to the method of GridEditor, but it calls Ext.util.JSON.encode and not String to compare the values
    */
  completeEdit : function(remainVisible){
    if(!this.editing){
      return;
    }
    var v = this.getValue();
    if(this.revertInvalid !== false && !this.field.isValid()){
      v = this.startValue;
      this.cancelEdit(true);
    }
    if(Ext.util.JSON.encode(v) === Ext.util.JSON.encode(this.startValue) && this.ignoreNoChange){//<-- changed
      this.editing = false;
      this.hide();
      return;
    }
    if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
      this.editing = false;
      if(this.updateEl && this.boundEl){
        this.boundEl.update(v);
      }
      if(remainVisible !== true){
        this.hide();
      }
      this.fireEvent("complete", this, v, this.startValue);
    }
  }
});