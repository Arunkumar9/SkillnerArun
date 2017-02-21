Ext.define('CHAT.view.GroupingList', {
    extend: 'Ext.view.View',
    alias: 'widget.groupinglist',
    requires: ['Ext.layout.component.BoundList', 'Ext.toolbar.Paging'],
	
    pageSize: 0,
	
    autoScroll: true,
    baseCls: Ext.baseCSSPrefix + 'boundlist',
    listItemCls: '',
    shadow: false,
    trackOver: true,
    refreshed: 0,

    ariaRole: 'listbox',

    componentLayout: 'boundlist',

    renderTpl: ['<div class="list-ct"></div>'],

    initComponent: function() {
        var me = this,
            baseCls = me.baseCls,
            itemCls = baseCls + '-item';
        me.itemCls = itemCls;
        me.selectedItemCls = baseCls + '-selected';
        me.overItemCls = baseCls + '-item-over';
        me.itemSelector = "." + itemCls;

        if (me.floating) {
            me.addCls(baseCls + '-floating');
        }
		
        var tpl = [
        	'<ul>',
        		'<tpl for=".">'
        ];
        
        var padding = 1;
        
        if (Ext.isArray(me.groupField)) {        	
        	padding = me.groupField.length;        	
        	for (var i = 0; i < me.groupField.length; i++) {        		
        		tpl.push(
	        		'<tpl if="xindex == 1 || parent[xindex - 2][\'' + me.groupField[i] + '\'] != values[\'' + me.groupField[i] + '\']">',
						'<li class="x-combo-list-group" style="padding-left:' + (i * 16) + 'px;">{[values["' + me.groupField[i] + '"]]}</li>',
					'</tpl>'
	        	);
        	}
        }        
        else {        	
        	tpl.push(
        		'<tpl if="xindex == 1 || parent[xindex - 2][\'' + me.groupField + '\'] != values[\'' + me.groupField + '\']">',
					'<li class="x-combo-list-group">{[values["' + me.groupField + '"]]}</li>',
				'</tpl>'
        	);
        }        
        tpl.push(
        			'<ul role="option" class="' + itemCls + '" style="padding-left:' + (padding * 16) + 'px;">{[values["' + me.displayField + '"]]}</ul>',
            	'</tpl>',
            '</ul>'
       	);
        
        me.tpl = Ext.create('Ext.XTemplate', tpl);

        if (me.pageSize) {
            me.pagingToolbar = me.createPagingToolbar();
        }

        me.callParent();

        Ext.applyIf(me.renderSelectors, {
            listEl: '.list-ct'
        });
    },

    createPagingToolbar: function() {
        return Ext.widget('pagingtoolbar', {
            pageSize: this.pageSize,
            store: this.store,
            border: false
        });
    },

    onRender: function() {
        var me = this,
            toolbar = me.pagingToolbar;
        me.callParent(arguments);
        if (toolbar) {
            toolbar.render(me.el);
        }
    },

    bindStore : function(store, initial) {
        var me = this,
            toolbar = me.pagingToolbar;
        me.callParent(arguments);
        if (toolbar) {
            toolbar.bindStore(store, initial);
        }
    },

    getTargetEl: function() {
        return this.listEl || this.el;
    },

    getInnerTpl: function(displayField) {
        return '{' + displayField + '}';
    },

    refresh: function() {
        var me = this;
        me.callParent();
        if (me.isVisible()) {
            me.refreshed++;
            me.doComponentLayout();
            me.refreshed--;
        }
    },
    
    initAria: function() {
        this.callParent();
        
        var selModel = this.getSelectionModel(),
            mode     = selModel.getSelectionMode(),
            actionEl = this.getActionEl();
        
        if (mode !== 'SINGLE') {
            actionEl.dom.setAttribute('aria-multiselectable', true);
        }
    },

    onDestroy: function() {
        Ext.destroyMembers(this, 'pagingToolbar', 'listEl');
        this.callParent();
    }
});