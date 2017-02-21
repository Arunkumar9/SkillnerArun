 Ext.define('SWPCommon.view.Panel',{
	override:'Ext.panel.Panel',
	 afterLayout : function(layout) {
	 	 var me = this;
	 	 this.callParent( arguments );

	 	 if(   me.flexCroll !=false && !me.body.el.child('div.mcontentwrapper') && me.body.el.isScrollable() ){
	 		 if( document.getElementById(me.body.el.id).fleXcroll ){
	 			 
	 			 delete document.getElementById(me.body.el.id).fleXcroll ;
	 		 }
			   fleXenv.fleXcrollMain(me.body.el.dom);
			
        	
        	 }else if( me.body.el.child('div.mcontentwrapper') ){
        	 	//  delete document.getElementById(me.body.el.id).fleXcroll ;
			//fleXenv.fleXcrollMain(me.body.el.dom);
        	 	 document.getElementById(me.body.el.id).fleXcroll.updateScrollBars();	
        	 	me.body.el.setStyle('overflow','hidden');
        	 }
		
        	 
		
		 
    },
    
//    update:function(){
//    	    this.callParent( arguments );
//    	    var me = this;
//    	    if( me.autoScroll && me.body.el.child('div.mcontentwrapper') ){
//        	 	//  delete document.getElementById(me.body.el.id).fleXcroll ;
//			//fleXenv.fleXcrollMain(me.body.el.dom);
//        	 	 document.getElementById(me.body.el.id).fleXcroll.updateScrollBars();	
//        	 	me.body.el.setStyle('overflow','hidden');
//        	 }
//    	   
//    },
//     onResize:function(){
//     	     this.callParent( arguments );
//     	     var me = this;
//     	     if(me.autoScroll && me.body.el.child('div.mcontentwrapper') ){
//        	 	 document.getElementById(me.body.el.id).fleXcroll.updateScrollBars();	
//        	 }
//     },
     
      afterExpand: function(animated) {
        this.callParent( arguments );
       this.hideShowflexCrollbars( true );
    },
    
    /**
     * Invoked after the Panel is Collapsed.
     *
     * @param {Boolean} animated
     *
     * @template
     * @protected
     */
    afterCollapse: function(animated) {
      this.callParent( arguments );
      this.hideShowflexCrollbars( false );
    },
      onHide: function() {
         this.callParent( arguments );
      this.hideShowflexCrollbars( false );
    },

    // @inheritdoc
    onShow: function() {
        this.callParent( arguments );
       this.hideShowflexCrollbars( true );
    },
    placeholderCollapse:function(){
    	        this.callParent( arguments );
       this.hideShowflexCrollbars( false );
    },
    placeholderExpand:function(){
    	        this.callParent( arguments );
       this.hideShowflexCrollbars( true );
    },
    hideShowflexCrollbars:function( show ){
    	   // debugger;
    	   if( Ext.isEmpty(this.el)){
    	   	   return true;
    	   }
    	   var verticalScrollbases = this.el.query('div.vscrollerbase');
    	    Ext.each( verticalScrollbases,function(item,inde){
    	    		    Ext.fly(item).setVisible(show);
    	    },this);
    	    var verticalScrollbars = this.el.query('div.vscrollerbar');
    	    Ext.each( verticalScrollbars,function(item,inde){
    	    		    Ext.fly(item).setVisible(show);
    	    },this);
    	    
    	    var horizontalScrollbases = this.el.query('div.hscrollerbase');
    	    Ext.each( horizontalScrollbases,function(item,inde){
    	    		    Ext.fly(item).setVisible(show);
    	    },this);
    	    
    	    var horizontalScrollbars = this.el.query('div.hscrollerbar');
    	    Ext.each( horizontalScrollbars,function(item,inde){
    	    		    Ext.fly(item).setVisible(show);
    	    },this);
    }
});

  Ext.define('SWPCommon.view.Element',{
  override:'Ext.dom.Element',
    scrollBy: function(deltaX, deltaY, animate) {
    	debugger;
        var me = this,
            dom = me.dom;

        if( document.getElementById(me.dom.id).fleXcroll ){
                document.getElementById(me.dom.id).fleXcroll.setScrollPos(( deltaX < 1 ? ( deltaX * -1 ): deltaX ) ,( deltaY < 1 ? ( deltaY * -1 ) : deltaY ));
                me.el.fireEvent('scroll',scrollX,scrollY);
          }else{

              if (deltaX.length) {
                  animate = deltaY;
                  deltaY = deltaX[1];
                  deltaX = deltaX[0];
              } else if (typeof deltaX != 'number') { 
                  animate = deltaY;
                  deltaY = deltaX.y;
                  deltaX = deltaX.x;
              }

              if (deltaX) {
                  me.scrollTo('left', me.constrainScrollLeft(dom.scrollLeft + deltaX), animate);
              }
              if (deltaY) {
                  me.scrollTo('top', me.constrainScrollTop(dom.scrollTop + deltaY), animate);
              }
      }
        return me;
    },
  scrollTo: function(side, value, animate) {
        //check if we're scrolling top or left
	  debugger;
        var top = /top/i.test(side),
            me = this,
            prop = top ? 'scrollTop' : 'scrollLeft',
            dom = me.dom,
            animCfg;

          var scrollX,scrollY= false
          if( top ){
            scrollY = value;
            // if( scrollY > me.dom.clientHeight ){
            //   scrollY = me.dom.clientHeight;
            // }
          }else{
            scrollX=value;
            // if( scrollY > me.dom.clientWdith ){
            //   scrollY = me.dom.clientWdith;
            // }
          }
          if( document.getElementById(me.dom.id).fleXcroll ){
                document.getElementById(me.dom.id).fleXcroll.setScrollPos(scrollX,scrollY);
               // me.el.fireEvent('scroll',scrollX,scrollY);
                return me;
          }
        if (!animate || !me.anim) {
          // debugger;
          // if( document.getElementById(me.dom.id).fleXcroll ){
          //       document.getElementById(me.dom.id).fleXcroll.setScrollPos(scrollX,scrollY);
          // }else{

            // just setting the value, so grab the direction
            dom[prop] = value;
            // corrects IE, other browsers will ignore
            dom[prop] = value;
          // }
        }
        else {
            animCfg = {
                to: {}
            };
            animCfg.to[prop] = value;
            if (Ext.isObject(animate)) {
                Ext.applyIf(animCfg, animate);
            }
            me.animate(animCfg);
        }
       
       
        return me;
    }
 });

 // Ext.define('SWPCommon.view.Element_Scroll',{
 //  override:'Ext.dom.Element_scroll',
 //  scrollBy: function(deltaX, deltaY, animate) {
 //        var me = this,
 //            dom = me.dom;

 //        if( document.getElementById(me.dom.id).fleXcroll ){
 //                document.getElementById(me.dom.id).fleXcroll.setScrollPos(scrollX,scrollY);
 //          }else{

 //              if (deltaX.length) {
 //                  animate = deltaY;
 //                  deltaY = deltaX[1];
 //                  deltaX = deltaX[0];
 //              } else if (typeof deltaX != 'number') { 
 //                  animate = deltaY;
 //                  deltaY = deltaX.y;
 //                  deltaX = deltaX.x;
 //              }

 //              if (deltaX) {
 //                  me.scrollTo('left', me.constrainScrollLeft(dom.scrollLeft + deltaX), animate);
 //              }
 //              if (deltaY) {
 //                  me.scrollTo('top', me.constrainScrollTop(dom.scrollTop + deltaY), animate);
 //              }
 //      }
 //        return me;
 //    }
 // });

 Ext.define('SWPCommon.grid.RowEditor', {
    override:'Ext.grid.RowEditor',


     afterRender: function() {
        var me = this,
            plugin = me.editingPlugin,
            grid = plugin.grid,
            view = grid.lockable ? grid.normalGrid.view : grid.view,
            field;

        me.callParent(arguments);

        //     me.scrollingView = view;
        // me.scrollingViewEl = view.el.down('div[class=scrollwrapper]');
        // view.mon(me.scrollingViewEl, 'scroll', me.onViewScroll, me);
    }

 });
