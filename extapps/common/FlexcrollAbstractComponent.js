         Ext.define('SWPCommon.FlexcrollAbstractComponent',{
  override:'Ext.AbstractComponent',
   onResize: function(width, height, oldWidth, oldHeight) {
        var me = this;

        // constrain is a config on Floating
        if (me.floating && me.constrain) {
            me.doConstrain();
        }

   if( ( me.flexCroll != false && me.flexCroll != undefined ) && me.el && me.autoScroll ){
          var isScrollable = me.el.isScrollable();
          var elementToApply = me.el;
        if( me.autoScroll && !elementToApply.child('div.mcontentwrapper') && isScrollable ){
           if( document.getElementById(elementToApply.id).fleXcroll )
           delete document.getElementById(elementToApply.id).fleXcroll ;
          fleXenv.fleXcrollMain(elementToApply.dom);
          me.flexCrollAdded =true;
          
        }
       
        if(  elementToApply.isScrollable() || me.flexCrollAdded ){
                    
       if( document.getElementById(elementToApply.id).fleXcroll ){
    	  
         document.getElementById(elementToApply.id).fleXcroll.updateScrollBars();
         fleXenv.updateScrollBars();
       }
       
     //  me.updateLayout();
                    
    }
  }
        if (me.hasListeners.resize) {
            me.fireEvent('resize', me, width, height, oldWidth, oldHeight);
        }
    }
});