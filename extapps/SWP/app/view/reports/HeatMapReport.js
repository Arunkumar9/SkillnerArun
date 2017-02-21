Ext.define('SWP.view.reports.HeatMapReport', {
	extend: 'Ext.container.Container',
	alias: 'widget.heatmapreport',
	config:{
//		store:Ext.create('SWP.store.HitMapBlockField',{autoLoad:false}),
		width: HITMAPS_CONSTANTS.WIDTH,
		actualWidth : HITMAPS_CONSTANTS.WIDTH ,
		height: HITMAPS_CONSTANTS.HEIGHT,
		actualHeight: HITMAPS_CONSTANTS.HEIGHT,
		palette:[]
	},
	firstRefreshDone:false,
	tpl:new Ext.XTemplate('<div style="height:100%; overflow:hidden;"><tpl for="rows">',
        ' <div class="hmr-bar" index="{[xindex]}"; data-qtip="{[this.getQtip(values,parent)]}"; ',
        ' style="width:{parent.barWidth}px; background-color:{[this.getFillColor(values,parent)]}; height:100%; float:left;"> </div>',
         '</tpl></div>',{
         	getQtip:function(values,parent){
         		var value =Math.floor((32)*(values.data.name/parent.totalCount));
         		return values.data.name; //parent.totalCount+'-'+values.data.name+'-'+value+parent.palette[value];//parent.totalCount;//
         	},
         	getFillColor: function(values,parent,out) {
			
		        var idx = 0,val=values.data.name, totalVal=parent.totalCount,maxValue=parent.maxValue,
		        palette=parent.palette;
		      
		        if (val == 0) {
		            return '#ffffff';
		        }else if( val == 1){
		            idx=1;
		        }else if( val ==  maxValue ){
		           idx =palette.length -1;
		        }else{
		             idx = Math.floor((palette.length)*(val/totalVal));
		        }

		       
		        
		        if( idx > (palette.length-1) ){
		        	return palette[palette.length-1];
		        }
		        console.log( values.data.name,idx);
		         return palette[idx];
		        

		    }
		   
         	
         	
         }),
	coloTpl:[
		'background-color:{colorcode}'
	],
	
	//{% parent.view.renderBarQtip(values,out)%} 
	initComponent : function(){
		
		var me = this;
		
		me.store = Ext.data.StoreManager.lookup(me.store || 'ext-empty-store');

        
        if (!me.dataSource) {
            me.dataSource = me.store;
        }
        
        me.bindStore(me.dataSource, true, 'dataSource');


		me.callParent( arguments );	
         
	},
	// beforeRender:function(){
	// 	// this.actualWidth = this.getWidth();
	// },
	bindStore: function(store, initial) {
        var me = this;

        // Bind to store immediately because subsequent processing looks for grid's store property
        me.store = store;

        

        me.mon(store, {
            load: me.onStoreLoad,
            scope: me
        });
       
    },

    unbindStore: function() {
        var me = this,
            store = me.store;

        if (store) {
            me.store = null;
            me.mun(store, {
                load: me.onStoreLoad,
                scope: me
            });
            
        }
    },
    onStoreLoad:function(store,records){
    	this.refreshView();
    },
     getStoreListeners: function() {
        var me = this;
        return {
            idchanged: me.onIdChanged,
            refresh: me.onDataRefresh,
            add: me.onAdd,
            bulkremove: me.onRemove,
            update: me.onUpdate,
            clear: me.refreshView
        };
    },
    onIdChanged: Ext.emptyFn,
     onDataRefresh: function() {
        this.refreshView();
    },
    refreshView: function() {
        var me = this;
        var data = this.collectData( this.store.data);
        me.tpl.overwrite(me.el, me.collectData(this.store.data));
       	me.registerListeners();
       	me.fireEvent('afterrefresh',me);
    },
    registerListeners:function(){
    	var me = this;
    	me.mon(me.el,{
    		scope:me,
    		click:me.handleClick});
    	// var bars =  me.el.select('div.hmr-bar');
    	// me.el.on('mouseover',function(e,t){
    	// 	if(Ext.fly(e.target).hasCls('hmr-bar')){
    	// 		Ext.fly(e.target).addCls('hmr-br-over');
    	// 	}
    	// });

    	// me.el.on('mousemove',function(e,t){
    	// 	if(Ext.fly(e.target).hasCls('hmr-bar')){
    	// 		Ext.fly(e.target).removeCls('hmr-br-over');
    	// 	}
    	// });

    },
    handleClick:function(eventObject,element){
    	var me = this;
    	var el = Ext.fly( element);
    	if( el.hasCls('hmr-bar') ){
    		var recordIndex = (parseInt(el.getAttribute('index')))
    		me.fireEvent('itemclick',eventObject,el,recordIndex,me.store.getAt(recordIndex-1));
    	}
    },
    onAdd:Ext.emptyFn,
    onRemove:Ext.emptyFn,
    onUpdate:Ext.emptyFn,
    collectData:function(records){
    	// records.items.slice(0);
    	var totalRecordCount = 0;
    	// delete records.items[0];
    	var maxValue =0;
    	for( var i=0;i<records.items.length;i++){
    		totalRecordCount = totalRecordCount + parseInt(records.items[i].data.name);
    		if( parseInt(records.items[i].data.name) > maxValue ){
    			maxValue = parseInt(records.items[i].data.name);
    		}
    	}
    	var barWidth = (( this.getWidth()/(records.length-1)) > 1 ? (this.getWidth()/(records.length-1)) :1);
    	if( barWidth == 1 ){
    		this.setWidth( records.length );
    		this.setActualWidth( records.length );
    	}else if(!this.firstRefreshDone){

    		this.setActualWidth( this.getWidth() );
    	}
    	this.firstRefreshDone = true;
    	return {
            view: this,
            rows: records,
            barWidth:barWidth ,
            barHeigh: this.getHeight(),
            totalCount:totalRecordCount,
            maxValue: maxValue,
            palette:this.palette,
            total:records.length
            
        };
    },
    updateView:function(){
    	var me = this;
    	var records = me.store.data;
    	var barWidth = (( this.getWidth()/(records.length-1)) > 1 ? (this.getWidth()/(records.length-1)) :1);
    	me.el.select('div.hmr-bar').setWidth(barWidth);
    },
    getStore :function(){
    	return this.store;
    },
    renderBarQtip:function(record,out){
    	var me = this;
    	return record.get('name');
    }
    
});