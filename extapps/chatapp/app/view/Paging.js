/**
 *     Task/Issue      Author    			UniqueID        Comment   
 *     ---------------------------------------------------------------------------------------------------------------------
 *     23956		  Venkatesh Teja		201311191111    Changed tool tip text for next page.
 *     
 */
Ext.define('CHAT.view.Paging', {
	extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.pagingtoolbar',
    alternateClassName: 'Ext.PagingToolbar',
    requires: ['Ext.toolbar.TextItem', 'Ext.form.field.Number'],
    mixins: {
        bindable: 'Ext.util.Bindable'    
    },
    /**
     * @cfg {Ext.data.Store} store (required)
     * The {@link Ext.data.Store} the paging toolbar should use as its data source.
     */

    /**
     * @cfg {Boolean} displayInfo
     * true to display the displayMsg
     */
    displayInfo: false,

    /**
     * @cfg {Boolean} prependButtons
     * true to insert any configured items _before_ the paging buttons.
     */
    prependButtons: false,

    /**
     * @cfg {String} displayMsg
     * The paging status message to display. Note that this string is
     * formatted using the braced numbers {0}-{2} as tokens that are replaced by the values for start, end and total
     * respectively. These tokens should be preserved when overriding this string if showing those values is desired.
     */
    //<locale>
    displayMsg : 'Displaying {0} - {1} of {2}',
    //</locale>

    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found.
     */
    //<locale>
    emptyMsg : 'Count 0',
    //</locale>

    /**
     * @cfg {String} beforePageText
     * The text displayed before the input item.
     */
    //<locale>
    beforePageText : 'Page',
    //</locale>

    /**
     * @cfg {String} afterPageText
     * Customizable piece of the default paging text. Note that this string is formatted using
     * {0} as a token that is replaced by the number of total pages. This token should be preserved when overriding this
     * string if showing the total page count is desired.
     */
    //<locale>
    afterPageText : 'of {0}',
    //</locale>

    /**
     * @cfg {String} firstText
     * The quicktip text displayed for the first page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    //<locale>
    firstText : 'First Page',
    //</locale>

    /**
     * @cfg {String} prevText
     * The quicktip text displayed for the previous page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    //<locale>
    prevText : 'Previous Page',
    //</locale>

    /**
     * @cfg {String} nextText
     * The quicktip text displayed for the next page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    //<locale>
    nextText : 'Next Page',
    //</locale>

    /**
     * @cfg {String} lastText
     * The quicktip text displayed for the last page button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    //<locale>
    lastText : 'Last Page',
    //</locale>

    /**
     * @cfg {String} refreshText
     * The quicktip text displayed for the Refresh button.
     * **Note**: quick tips must be initialized for the quicktip to show.
     */
    //<locale>
    refreshText : 'Refresh',
    //</locale>

    /**
     * @cfg {Number} inputItemWidth
     * The width in pixels of the input field used to display and change the current page number.
     */
    inputItemWidth : 30,

    /**
     * Gets the standard paging items in the toolbar
     * @private
     */
    getPagingItems: function() {
        var me = this;

        return [{
            itemId: 'first',
//            tooltip: me.firstText,
            tooltip : { 
            	text :  me.firstText,
            	anchor :'bottom'
            },
            overflowText: me.firstText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
            disabled: true,
            handler: me.moveFirst,
            scope: me
        },{
            itemId: 'prev',
//            tooltip: me.prevText,
            tooltip : { 
            	text : me.prevText,
            	anchor :'bottom'
            },
            overflowText: me.prevText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
            disabled: true,
            handler: me.movePrevious,
            scope: me
        },
//        '-',
        me.beforePageText,
        {
            xtype: 'numberfield',
            itemId: 'inputItem',
            name: 'inputItem',
            cls: Ext.baseCSSPrefix + 'tbar-page-number',
            allowDecimals: false,
            minValue: 1,
            hideTrigger: true,
            enableKeyEvents: true,
            keyNavEnabled: false,
            selectOnFocus: true,
            submitValue: false,
            // mark it as not a field so the form will not catch it when getting fields
            isFormField: false,
            width: me.inputItemWidth,
            margins: '-1 2 3 2',
            listeners: {
                scope: me,
                keydown: me.onPagingKeyDown,
                blur: me.onPagingBlur
            }
        },{	
            xtype: 'tbtext',
            itemId: 'afterTextItem',
            text: Ext.String.format(me.afterPageText, 1)
        },
//        '-',
        {
            itemId: 'next',
//            tooltip: me.nextText,   201311191111
            tooltip : { 
            	text : me.nextText,
            	anchor :'bottom'
            },
            overflowText: me.nextText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
            disabled: true,
            handler: me.moveNext,
            scope: me
        },{
            itemId: 'last',
//            tooltip: me.lastText,
            tooltip : { 
            	text :me.lastText,
            	anchor :'bottom'
            },
            overflowText: me.lastText,
            iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
            disabled: true,
            handler: me.moveLast,
            scope: me
        },
        '-',
        {
            itemId: 'refresh',
//            tooltip: me.refreshText,
            tooltip : { 
            	text :me.refreshText,
            	anchor :'left'
            },
            overflowText: me.refreshText,
            iconCls: Ext.baseCSSPrefix + 'tbar-loading',
            handler: me.doRefresh,
            scope: me
        }];
    },

    initComponent : function(){
        var me = this,
            pagingItems = me.getPagingItems(),
            userItems   = me.items || me.buttons || [];

        if (me.prependButtons) {
            me.items = userItems.concat(pagingItems);
        } else {
            me.items = pagingItems.concat(userItems);
        }
        delete me.buttons;

        if (me.displayInfo) {
            me.items.push('->');
            me.items.push({
            	xtype:'container',
            	itemId: 'displayContainer',
            	width:80,
            	height:27,
            	style:'top:0px !important',
            	layout:'hbox',
            	items:[{
		            		xtype:'image',
		            		flex:0.2,
		            		imgCls:'triangular-icon',
		            		itemId: 'icon'
						},{
            				xtype: 'tbtext', 
            				itemId: 'displayItem',
            				flex:0.5,
            				cls:'counttext-cls'
            			}]
            });
        }

        me.callParent();

        me.addEvents(
            /**
             * @event change
             * Fires after the active page has been changed.
             * @param {Ext.toolbar.Paging} this
             * @param {Object} pageData An object that has these properties:
             *
             * - `total` : Number
             *
             *   The total number of records in the dataset as returned by the server
             *
             * - `currentPage` : Number
             *
             *   The current page number
             *
             * - `pageCount` : Number
             *
             *   The total number of pages (calculated from the total number of records in the dataset as returned by the
             *   server and the current {@link Ext.data.Store#pageSize pageSize})
             *
             * - `toRecord` : Number
             *
             *   The starting record index for the current page
             *
             * - `fromRecord` : Number
             *
             *   The ending record index for the current page
             */
            'change',

            /**
             * @event beforechange
             * Fires just before the active page is changed. Return false to prevent the active page from being changed.
             * @param {Ext.toolbar.Paging} this
             * @param {Number} page The page number that will be loaded on change
             */
            'beforechange'
        );
        me.on('beforerender', me.onLoad, me, {single: true});

        me.bindStore(me.store || 'ext-empty-store', true);
    },
    // private
    updateInfo : function(){
        var me = this,
            displayItem = me.child('#displayContainer').child('#displayItem'),
            store = me.store,
            pageData = me.getPageData(),
            count, msg;
   
        if (displayItem) {
        	 count = store.totalCount;
            if (count === 0) {
                msg = me.emptyMsg;
            } else {
                msg = Ext.String.format(
                    me.displayMsg,
                    pageData.fromRecord,
                    pageData.toRecord,
                    pageData.total
                );
            }
            displayItem.setText(msg);
        }
    },

    // private
    onLoad : function(){
        var me = this,
            pageData,
            currPage,
            pageCount,
            afterText,
            count,
            isEmpty;

        count = me.store.totalCount;
        isEmpty = count === 0;
        if (!isEmpty) {
            pageData = me.getPageData();
            currPage = pageData.currentPage;
            pageCount = pageData.pageCount;
            afterText = Ext.String.format(me.afterPageText, isNaN(pageCount) ? 1 : pageCount);
        } else {
            currPage = 0;
            pageCount = 0;
            afterText = Ext.String.format(me.afterPageText, 0);
        }

        Ext.suspendLayouts();
        me.child('#afterTextItem').setText(afterText);
        me.child('#inputItem').setDisabled(isEmpty).setValue(currPage);
        me.child('#first').setDisabled(currPage === 1 || isEmpty);
        me.child('#prev').setDisabled(currPage === 1  || isEmpty);
        me.child('#next').setDisabled(currPage === pageCount  || isEmpty);
        me.child('#last').setDisabled(currPage === pageCount  || isEmpty);
        me.child('#refresh').enable();
        me.updateInfo();
        Ext.resumeLayouts(true);

        if (me.rendered) {
            me.fireEvent('change', me, pageData);
        }
    },

    // private
    getPageData : function(){
        var store = this.store,
            totalCount = store.getTotalCount();

        return {
            total : totalCount,
            currentPage : store.currentPage,
            pageCount: Math.ceil(totalCount / store.pageSize),
            fromRecord: ((store.currentPage - 1) * store.pageSize) + 1,
            toRecord: Math.min(store.currentPage * store.pageSize, totalCount)

        };
    },

    // private
    onLoadError : function(){
        if (!this.rendered) {
            return;
        }
        this.child('#refresh').enable();
    },

    // private
    readPageFromInput : function(pageData){
        var v = this.child('#inputItem').getValue(),
            pageNum = parseInt(v, 10);

        if (!v || isNaN(pageNum)) {
            this.child('#inputItem').setValue(pageData.currentPage);
            return false;
        }
        return pageNum;
    },

    onPagingFocus : function(){
        this.child('#inputItem').select();
    },

    //private
    onPagingBlur : function(e){
        var curPage = this.getPageData().currentPage;
        this.child('#inputItem').setValue(curPage);
    },

    // private
    onPagingKeyDown : function(field, e){
        var me = this,
            k = e.getKey(),
            pageData = me.getPageData(),
            increment = e.shiftKey ? 10 : 1,
            pageNum;

        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum !== false) {
                pageNum = Math.min(Math.max(1, pageNum), pageData.pageCount);
                if(me.fireEvent('beforechange', me, pageNum) !== false){
                    me.store.loadPage(pageNum);
                }
            }
        } else if (k == e.HOME || k == e.END) {
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : pageData.pageCount;
            field.setValue(pageNum);
        } else if (k == e.UP || k == e.PAGE_UP || k == e.DOWN || k == e.PAGE_DOWN) {
            e.stopEvent();
            pageNum = me.readPageFromInput(pageData);
            if (pageNum) {
                if (k == e.DOWN || k == e.PAGE_DOWN) {
                    increment *= -1;
                }
                pageNum += increment;
                if (pageNum >= 1 && pageNum <= pageData.pageCount) {
                    field.setValue(pageNum);
                }
            }
        }
    },

    // private
    beforeLoad : function(){
        if(this.rendered && this.refresh){
            this.refresh.disable();
        }
    },

    /**
     * Move to the first page, has the same effect as clicking the 'first' button.
     */
    moveFirst : function(){
        if (this.fireEvent('beforechange', this, 1) !== false){
         	
        	
        	var searchField = Ext.ComponentQuery.query('datalist searchfield')[0];
        	if(searchField.value){
        		 store = searchField.store,
                 proxy = store.getProxy(),
                 value = searchField.getValue();
                 
                  // Param name is ignored here since we use custom encoding in the proxy.
                 // id is used by the Store to replace any previous filter
             	/**
             	 *  clears all the filters that are applied before
             	 *  paramName -- is the name that we are passing along with the trigger request. If it is not specified then by default it will take it as query.
             	 *  value -- value entered in searchfield
          		 */
            	 searchField.store.clearFilter();
            	 searchField.store.filter({
             		id: searchField.paramName,
             		property: searchField.paramName,
             		value: searchField.value
             		
             	});
            	 searchField.store.loadPage(1);
            	 searchField.store.clearFilter();
            	 searchField.hasSearch = true;
            	 searchField.triggerCell.item(0).setDisplayed(true);
            	 searchField.updateLayout();
        		
        		}
        	else{
        		 this.store.loadPage(1);
        	}
           
        }
    },

    /**
     * Move to the previous page, has the same effect as clicking the 'previous' button.
     */
    movePrevious : function(){
        var me = this,
            prev = me.store.currentPage - 1;

        if (prev > 0) {
            if (me.fireEvent('beforechange', me, prev) !== false) {
            	var searchField = Ext.ComponentQuery.query('datalist searchfield')[0];
            	
            	if(searchField.value){
            		 store = searchField.store,
                     proxy = store.getProxy(),
                     value = searchField.getValue();
                     
                      // Param name is ignored here since we use custom encoding in the proxy.
                     // id is used by the Store to replace any previous filter
                 	/**
                 	 *  clears all the filters that are applied before
                 	 *  paramName -- is the name that we are passing along with the trigger request. If it is not specified then by default it will take it as query.
                 	 *  value -- value entered in searchfield
              		 */
                	 searchField.store.clearFilter();
                	 searchField.store.filter({
                 		id: searchField.paramName,
                 		property: searchField.paramName,
                 		value: searchField.value
                 		
                 	});
                	 searchField.store.loadPage(prev);
                	 searchField.store.clearFilter();
                	 searchField.hasSearch = true;
                	 searchField.triggerCell.item(0).setDisplayed(true);
                	 searchField.updateLayout();
            		
            		}
            	else{
            		me.store.previousPage();
            	}
            	
                
            }
        }
    },

    /**
     * Move to the next page, has the same effect as clicking the 'next' button.
     */
    moveNext : function(){
        var me = this,
            total = me.getPageData().pageCount,
            next = me.store.currentPage + 1;

        if (next <= total) {
            if (me.fireEvent('beforechange', me, next) !== false) {
            	var searchField = Ext.ComponentQuery.query('datalist searchfield')[0];
            	
            	if(searchField.value){
            		 store = searchField.store,
                     proxy = store.getProxy(),
                     value = searchField.getValue();
                     
                      // Param name is ignored here since we use custom encoding in the proxy.
                     // id is used by the Store to replace any previous filter
                 	/**
                 	 *  clears all the filters that are applied before
                 	 *  paramName -- is the name that we are passing along with the trigger request. If it is not specified then by default it will take it as query.
                 	 *  value -- value entered in searchfield
              		 */
                	 searchField.store.clearFilter();
                	 searchField.store.filter({
                 		id: searchField.paramName,
                 		property: searchField.paramName,
                 		value: searchField.value
                 		
                 	});
                	 searchField.store.loadPage(next);
                	 searchField.store.clearFilter();
                	 searchField.hasSearch = true;
                	 searchField.triggerCell.item(0).setDisplayed(true);
                	 searchField.updateLayout();
            		
            		}
            	else{
                me.store.nextPage();
            	}
        }
        }
    },

    /**
     * Move to the last page, has the same effect as clicking the 'last' button.
     */
    moveLast : function(){
        var me = this,
            last = me.getPageData().pageCount;

        if (me.fireEvent('beforechange', me, last) !== false) {
        	var searchField = Ext.ComponentQuery.query('datalist searchfield')[0];
        	
        	if(searchField.value){
        		 store = searchField.store,
                 proxy = store.getProxy(),
                 value = searchField.getValue();
                 
                  // Param name is ignored here since we use custom encoding in the proxy.
                 // id is used by the Store to replace any previous filter
             	/**
             	 *  clears all the filters that are applied before
             	 *  paramName -- is the name that we are passing along with the trigger request. If it is not specified then by default it will take it as query.
             	 *  value -- value entered in searchfield
          		 */
            	 searchField.store.clearFilter();
            	 searchField.store.filter({
             		id: searchField.paramName,
             		property: searchField.paramName,
             		value: searchField.value
             		
             	});
            	 searchField.store.loadPage(last);
            	 searchField.store.clearFilter();
            	 searchField.hasSearch = true;
            	 searchField.triggerCell.item(0).setDisplayed(true);
            	 searchField.updateLayout();
        		
        		}
        	else{
        		me.store.loadPage(last);
        	}
        	
            
        }
    },

    /**
     * Refresh the current page, has the same effect as clicking the 'refresh' button.
     */
    doRefresh : function(){
        var me = this,
            current = me.store.currentPage;
        /**
         * To load Firstpage we need to pass store.loadPage(1);
         */
        if (me.fireEvent('beforechange', me, current) !== false) {
            me.store.loadPage(1);
        }
    },
    
    getStoreListeners: function() {
        return {
            beforeload: this.beforeLoad,
            load: this.onLoad,
            exception: this.onLoadError
        };
    },

    /**
     * Unbinds the paging toolbar from the specified {@link Ext.data.Store} **(deprecated)**
     * @param {Ext.data.Store} store The data store to unbind
     */
    unbind : function(store){
        this.bindStore(null);
    },

    /**
     * Binds the paging toolbar to the specified {@link Ext.data.Store} **(deprecated)**
     * @param {Ext.data.Store} store The data store to bind
     */
    bind : function(store){
        this.bindStore(store);
    },

    // private
    onDestroy : function(){
        this.unbind();
        this.callParent();
    }

});