 Ext.define('SWPCommon.view.TableView',{
  override:'Ext.view.Table',
  flexCrollAdded:false,
  refreshSize: function() {
        var me = this,
            grid,
            bodySelector = me.getBodySelector();
        // On every update of the layout system due to data update, capture the view's main element in our private flyweight.
        // IF there *is* a main element. Some TplFactories emit naked rows.
        if (bodySelector) {
            me.body.attach(me.el.query(bodySelector)[0]);
        }
        if( me.flexCroll == false ){

        }else if( !me.el.child('div.mcontentwrapper') && me.el.isScrollable() ){
        	 if( document.getElementById(me.el.id).fleXcroll )
        	 delete document.getElementById(me.el.id).fleXcroll ;
        	fleXenv.fleXcrollMain(me.el.dom);
        	me.flexCrollAdded =true;
             console.log('scroll --> ' , me.el);
        	// Ext.fly(me.el).on('scroll',function(){
         //        console.log('scroll --> ' + this.id);
         //    });
        me.autoScroll=true;
        }
       
        if (!me.hasLoadingHeight) {
            grid = me.up('tablepanel');

            // Suspend layouts in case the superclass requests a layout. We might too, so they
            // must be coalescsed.
            Ext.suspendLayouts();

            me.callSuper(arguments);

            // Since columns and tables are not sized by generated CSS rules any more, EVERY table refresh
            // has to be followed by a layout to ensure correct table and column sizing.
            grid.updateLayout();

            Ext.resumeLayouts(true);
            if(  me.el.isScrollable() ){
            	    
            	   if( document.getElementById(me.el.id).fleXcroll ){
            	   	   document.getElementById(me.el.id).fleXcroll.updateScrollBars();
            	   }
            	    
            }
            
        }
    },
     saveScrollState: function() {
        
    },

    /**
     * Restores the scrollState.
     * Must be used in conjunction with saveScrollState
     * @private
     */
    restoreScrollState: function() {
        
    },
     getRecord: function(node) {
        node = this.getNode(node);

        if (node) {
            var recordIndex = node.getAttribute('data-recordIndex');
            if( !Ext.isEmpty(this.features) && !Ext.isEmpty(this.features[0]) &&
                this.features[0].ftype =='groupingbtn'){
              recordIndex = node.getAttribute('data-recordid');
              recordIndex = this.store.data.indexMap[recordIndex];
            }
            if (recordIndex) {
                recordIndex = parseInt(recordIndex, 10);
                if (recordIndex > -1) {
                    
                    
                    return this.store.data.getAt(recordIndex);
                }
            }
            return this.dataSource.data.get(node.getAttribute('data-recordId'));
        }
    }
});