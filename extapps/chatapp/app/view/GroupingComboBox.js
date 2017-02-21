Ext.define('CHAT.view.GroupingComboBox', {
	extend: 'Ext.form.field.ComboBox',
    requires: ['CHAT.view.GroupingList'],
    alias: ['widget.groupingcombobox', 'widget.groupingcombo'],
    
    initComponent: function() {
    	var me = this;
    	if (!me.displayTpl) {
    		var display = [],
    			tpl = '<tpl for=".">{0}</tpl>';
    		if (Ext.isArray(me.groupField)) {
    			for (var i = 0; i < me.groupField.length; i++) {
	        		display.push('{[values["' + me.groupField[i] + '"]]}');
	        	}
    		}
    		else {
    			display.push('{[values["' + me.groupField + '"]]}');
    		}
    		display.push('{[values["' + me.displayField + '"]]}');
    		me.displayTpl = Ext.String.format(tpl, display.join(this.displaySeparator || ' '));
    	}
    	me.callParent();
    },
    
    createPicker: function() {
        var me = this,
            picker,
            menuCls = Ext.baseCSSPrefix + 'menu',
            opts = Ext.apply({
                selModel: {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                },
                floating: true,
                hidden: true,
                ownerCt: me.ownerCt,
                cls: me.el.up('.' + menuCls) ? menuCls : '',
                store: me.store,
                groupField: me.groupField,
                displayField: me.displayField,
                focusOnToFront: false,
                pageSize: me.pageSize
            }, me.listConfig, me.defaultListConfig);
		
       	//picker = me.picker = Ext.create('Ext.view.BoundList', opts);
 		picker = me.picker = Ext.create('CHAT.view.GroupingList', opts);

        me.mon(picker, {
            itemclick: me.onItemClick,
            refresh: me.onListRefresh,
            scope: me
        });

        me.mon(picker.getSelectionModel(), 'selectionchange', me.onListSelectionChange, me);

        return picker;
    }
});