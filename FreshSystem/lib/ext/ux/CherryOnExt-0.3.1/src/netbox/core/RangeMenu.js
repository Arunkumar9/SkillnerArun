// $Id: RangeMenu.js 2348 2013-12-20 10:20:54Z arun $

Ext.namespace('Ext.ux.netbox.core');

/** Creates a new RangeMenu, a menu containing 2 input box that represents the range value between 2 values.
  * @class This is a private class used by RangeField (it's the popup)
  * @extends Ext.menu.Menu
  * @constructor
  * @ignore
  */
Ext.ux.netbox.core.RangeMenu = function(textCls,fromCfg,toCfg,fieldValidateFunc){
//pluginCls,pluginClsArgs,validatorFn){
  Ext.ux.netbox.core.RangeMenu.superclass.constructor.apply(this,arguments);
  if(textCls===undefined){
    textCls = Ext.form.TextField;
  }
  var editorFrom=new textCls(fromCfg);
  var editorTo=new textCls(toCfg);
  editorFrom.validate=fieldValidateFunc;
  editorTo.validate=fieldValidateFunc;
  this.fields = new Ext.ux.netbox.core.RangeItem({
    editorFrom: editorFrom,
    editorTo: editorTo
    });

  this.add(this.fields);
  this.fields.on("keyup",this.onKeyUp,this);
  this.addEvents({'update': true});
  this.on('show',this.disableKeyNav,this);
};

Ext.extend(Ext.ux.netbox.core.RangeMenu, Ext.menu.Menu,/** @scope Ext.ux.netbox.core.RangeMenu.prototype */{
  /** @ignore */
  disableKeyNav: function(){
    if(this.keyNav){
      this.keyNav.disable();
    }
    if(Ext.isGecko){
      var div=this.getEl();
      div.setStyle("overflow", "auto");
      var text=div.select(".x-form-text");
      text.each(function(el){
        el.dom.select();
      });
    }
  },
  /** setValue
    * @ignore
    */
  setValue: function(data){
    var from="";
    var to="";
    if(data.length==2){
      from=data[0].label;
      to=data[1].label;
    } else if (data.length==1) {
      from=data[0].label;
    }
    this.fields.setValueTo(to);
    this.fields.setValueFrom(from);

    this.fireEvent("update", this);
  },
  /** onKeyUp
    * @ignore
    */
  onKeyUp: function(event){
    if(event.getKey() == event.ENTER && this.isValid()){
      this.hide(true);
      return;
    }
  },
  /** getValue
    * @ignore
    */
  getValue: function(){
    var result = [{value: this.fields.getValueFrom(),label:this.fields.getValueFrom()} ,
    {value: this.fields.getValueTo(),label:this.fields.getValueTo()} ];
    return result;
  },
  /** isValid
    * @ignore
    */
  isValid: function(){
    return(this.fields.isValidFrom() && this.fields.isValidTo());
  },
  /** doLayout
    * @ignore
    */
  doLayout: function(width){
    var itemEl=this.fields.getEl();
    this.fields.doLayout(width-itemEl.getBorderWidth('lr')-itemEl.getPadding('lr')-itemEl.getMargins('lr'));
  },
  
  /** It sets as invalid the from and to fields
    * @private
    * @param {String} msg The message to show to the user
    * @ignore
    */
  markInvalid: function(msg){
    this.fields.markInvalid(msg);
  },
  /** It clears the invalid mask from the from and to fields
    * @private
    * @ignore
    */
  clearInvalidFields: function(){
    this.fields.clearInvalidFields();
  }
});