/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * var myfield = {
		xtype: 'multiselectgrid',
		fieldLabel: 'field Label',
		unselectRowText: 'Unselect All',
		unselectRowTooltip: 'Unselect the all item',
		selectRowText: 'Select All',
		selectRowTooltip: 'Select the all item',
		reloadText: 'Reload',
		reloadTooltip: 'Reload the all item',
		minMultiSelectGridectionsText: 'Minimum {0} item(s) required',
		maxMultiSelectGridectionsText: 'Maximum {0} item(s) allowed',
		labelStyle: 'font-weight:bold',
		name: 'list_ids',
		width: 592,
		height: 200,
		bodyStyle: 'background-color:#ffffff;',
		allowBlank: false,
		enableJson: true,
		store: new Ext.data.JsonStore({
			proxy: new Ext.data.HttpProxy({
				url: 'list.php',
				method: 'post'
			}),
			fields: [{
				name: 'list_id'
			}, {
				name: 'list_name'
			}],
			root: 'rows'
		}),
		valueField: 'list_name',
		valueId: 'list_id',
		labelField: 'Label'
};

 */


Ext.ns('Ext.ux.form');
Ext.ux.form.MultiSelectGrid = Ext.extend(Ext.form.Field, {
	delimiter: ',',
	anchor: 0,
	minMultiSelectGridections: 0,
	valueField: 1,
	unselectRowText: this.unselectRowText || 'Unselect All',
	unselectRowTooltip: this.unselectTooltip || 'Unselect the all item',
	unselectRowIconCls: this.unselectIconCls || 'unselectOption',

	selectRowText: this.selectRowText || 'Select All',
	selectRowTooltip: this.selectTooltip || 'Select the all item',
	selectRowIconCls: this.selectIconCls || 'selectOption',

	reloadText: this.reloadText || 'Reload',
	reloadTooltip: this.reloadTooltip || 'Reload the all item',
	reloadIconCls: this.reloadIconCls || 'reloadOption',

	blankText: Ext.form.TextField.prototype.blankText,
	maxMultiSelectGridections: Number.MAX_VALUE,
	minMultiSelectGridectionsText: this.minMultiSelectGridectionsText || 'Minimum {0} item(s) required',
	maxMultiSelectGridectionsText: this.maxMultiSelectGridectionsText || 'Maximum {0} item(s) allowed',
	defaultAutoCreate: {
		tag: "div"
	}, autoScroll: false,
	scroll: false,
	initComponent: function (config) {
		var css = '.ux-scroll-xy {overflow-y: hidden; overflow-x: hidden;}';
		Ext.util.CSS.createStyleSheet(css);
		this.addClass('ux-scroll-xy');
		Ext.apply(this, config);
		Ext.apply(this.initialConfig, config);


		Ext.ux.form.MultiSelectGrid.superclass.initComponent.apply(this, arguments);
		this.addEvents({
			'dblclick': true,
			'click': true,
			'change': true
		});
	}, onRender: function (ct, position) {
		Ext.ux.form.MultiSelectGrid.superclass.onRender.call(this, ct, position);
		var fs = this.fs = new Ext.form.FieldSet({
			title: this.legend,
			renderTo: this.el,
			width: this.width,
			height: this.height,
			style: "padding:0;",
			tbar: this.tbar
		});

		this.csm = new Ext.grid.CheckboxSelectionModel();
		this.gird = new Ext.grid.GridPanel({
			border: false,
			store: this.store,
			stripeRows: true,
			height: this.height,
			layout: 'fit',
			viewConfig: {
				forceFit: true
			}, hideHeaders: true,
			loadMask: true,
			autoExpandColumn: this.valueField,
			cm: new Ext.grid.ColumnModel({
				columns: [this.csm, {
					header: this.valueField,
					id: this.valueField,
					dataIndex: this.valueField,
					width: '100%'
				}]
			}),
			sm: this.csm,
			bbar: [{
				text: this.selectRowText,
				tooltip: this.selectRowTooltip,
				iconCls: this.selectRowIconCls,
				scope: this,
				handler: this.selectGridRecords
			}, '-', {
				text: this.unselectRowText,
				tooltip: this.unselectRowTooltip,
				iconCls: this.unselectRowIconCls,
				scope: this,
				handler: this.unselectGridRecords
			}, '-', {
				text: this.reloadText,
				tooltip: this.reloadTooltip,
				iconCls: this.reloadIconCls,
				scope: this,
				handler: this.reload
			}]
		});
		this.store.load();
		this.store.on('load', function () {
			if (this.value) {
				this.setValue(this.value);
			}

		}, this);

		fs.add(this.gird);
		this.hiddenName = this.name || Ext.id();
		var hiddenTag = {
			tag: "input",
			type: "hidden",
			value: "",
			name: this.hiddenName
		};
		this.gird.on('click', this.onViewClick, this);
		this.hiddenField = this.el.createChild(hiddenTag);
		this.hiddenField.dom.disabled = this.hiddenName != this.name;
		fs.doLayout();
	}, afterRender: function () {
		Ext.ux.form.MultiSelectGrid.superclass.afterRender.call(this);
	}, getValue: function () {
		var ids = new Array();
		if (this.gird.getSelectionModel().getSelected()) {
			Ext.each(this.gird.getSelectionModel().getSelections(), function (item, index) {
				ids[index] = item.data[this.valueId];
			}, this);
			return ids.join(',');
		}
		return ids;
	},

	setValue: function (value) {
		if (value != '' && value != null) {
			var set = value.toString().split(',');
			this.v = set;
			this.gird.getSelectionModel().getSelections();
			Ext.each(this.gird.store.data.items, function (item, index) {
				Ext.each(set, function (item1, index1) {
					if (item.data[this.valueId] == item1) {
						this.gird.getSelectionModel().selectRow(index, true);
					}
				}, this);
			}, this);

		}
		else {
			this.gird.getSelectionModel().clearSelections();
		}
		this.hiddenField.dom.value = this.getValue();
		this.validate();
	}, validateValue: function (value) {
		if (this.getValue() != '') {
			value = this.getValue().toString().split(',');
		}
		else {
			value.length = 0;
		}

		if (value.length < 1) {
			if (this.allowBlank) {
				this.clearInvalid();
				return true;
			}
			else {
				this.markInvalid(this.blankText);
				return false;
			}
		}
		if (value.length < this.minMultiSelectGridections) {
			this.markInvalid(String.format(this.minMultiSelectGridectionsText, this.minMultiSelectGridections));
			return false;
		}
		if (value.length > this.maxMultiSelectGridections) {
			this.markInvalid(String.format(this.maxMultiSelectGridectionsText, this.maxMultiSelectGridections));
			return false;
		}
		return true;
	}, onViewClick: function (vw, index, node, e) {
		this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
		this.hiddenField.dom.value = this.getValue();
		this.fireEvent('click', this, e);
		this.validate();
	}, disable: function () {
		this.disabled = true;
		this.hiddenField.dom.disabled = true;
		this.fs.disable();
	}, enable: function () {
		this.disabled = false;
		this.hiddenField.dom.disabled = false;
		this.fs.enable();
	}, reload: function () {
		this.store.on('load', function () {
			if (this.v) {
				this.setValue(this.v);
			}
		}, this);
		this.store.load();
	}, unselectGridRecords: function () {
		this.gird.getSelectionModel().clearSelections();
		this.hiddenField.dom.value = this.getValue();
		this.validate();
	}, selectGridRecords: function () {
		this.gird.getSelectionModel().selectAll();
		this.hiddenField.dom.value = this.getValue();
		this.validate();
	}
});
Ext.reg('multiselectgrid', Ext.ux.form.MultiSelectGrid);

Ext.namespace('Ext.ux.grid');
Ext.ux.grid.DemonPageSizer = Ext.extend(Ext.form.ComboBox, {
	limitText: this.limitText || '&nbsp;Limit:&nbsp;',
	pageSizes: this.pageSizes ||  [[5, 5], [10, 10], [25, 25], [50, 50], [100, 100], [200, 200], [500, 500]],
	displayField: 'name',
	valueField: 'value',
	typeAhead: true,
	mode: 'local',
	width: 60,
	forceSelection: true,
	triggerAction: 'all',
	selectOnFocus: true,
	initComponent: function () {

		Ext.apply(this, {
			store: new Ext.data.SimpleStore({
				fields: ['value', 'name'],
				data: this.pageSizes
			})
		});

		this.on({
			scope: this,
			render: {
				fn: this.setDefault
			}
		});

		Ext.ux.grid.DemonPageSizer.superclass.initComponent.apply(this, arguments);
	},

	init: function (pagingToolbar) {
		pagingToolbar.on('render', this.onInitView, this);
	},

	onInitView: function (pagingToolbar) {

		pagingToolbar.insert(12, '-');
		pagingToolbar.insert(12, this);
		pagingToolbar.insert(12, this.limitText);

		this.on('select', this.onPageSizeChanged, pagingToolbar);
	},
	onPageSizeChanged: function (combos) {
		this.pageSize = parseInt(combos.value);
		this.doLoad(0);
	},

	setDefault: function () {
		this.setValue(  ((parseInt(this.initialSize) > 0) ? this.initialSize : 25)  );
	}

});



/*
 *var myfield =  {
			xtype:'optionsgrid',
			fieldLabel: 'Label',
			labelStyle: 'font-weight:bold',
			name: 'field_option',
			height: 200,
			width: 588
	};
 *
 */
Ext.ux.form.OptionsGrid = Ext.extend(Ext.form.Field, {
	removeRowText: this.removeRowText || __('contacts.Remove'),
	clearRowText: this.removeRowText || __('contacts.Clear'),
	addRowText: this.addRowText || __('contacts.Add'),
	addRowTooltip: this.addTooltip || __('Add a new row'),
	addRowIconCls: this.addIconCls || 'icon-new',
	removeRowTooltip: this.removeTooltip || __('Remove the selected item'),
	clearRowTooltip: this.removeTooltip || __('Clear the all item'),
	removeRowIconCls: this.removeIconCls || 'icon-delete',
	clearRowIconCls: this.clearIconCls || 'icon-cancel',
	headerRowName: this.headerRowName || __('Name'),
	headerRowValue: this.headerRowValue || __('Value'),
        gridStore: this.gridStore || 'contacttype-def-store',
	validGrid: true,
	repeatText: this.repeatText || 'Double value in name',
	delimiter: ',',
	anchor: 0,
	minSelections: 0,
	enableJson: true,
	firstSeparator: '|',
	secondSeparator: ',',
	valueField: 1,
	blankText: Ext.form.TextField.prototype.blankText,
	maxSelections: Number.MAX_VALUE,
	minSelectionsText: this.minSelectionsText || 'Minimum {0} item(s) required',
	maxSelectionsText: this.maxSelectionsText || 'Maximum {0} item(s) allowed',
	confirmDelete: this.confirmDelete || 'Are you sure you want to carry out the operation?',
	warningDelete: this.warningDelete || 'at least a selection of information, delete!',
	defaultAutoCreate: {
		tag: "div"
	}, initComponent: function (config) {
		var css = '.ux-scroll-xy {overflow-y: hidden; overflow-x: hidden;}';
		Ext.util.CSS.createStyleSheet(css);
		this.addClass('ux-scroll-xy');
		Ext.apply(this, config);
		Ext.apply(this.initialConfig, config);
                this.layout='fit';
		Ext.ux.form.OptionsGrid.superclass.initComponent.apply(this, arguments);
		this.addEvents({
			'dblclick': true,
			'click': true,
			'change': true
		});
	}, onRender: function (ct, position) {
		Ext.ux.form.OptionsGrid.superclass.onRender.call(this, ct, position);
		this.fs = new Ext.Panel({
			title: this.legend,
			width: this.width,
			height: this.height,
			layout: 'fit',
                        autoScroll: false,
                        forceLayout: true,
                        anchor: '100% 100%',
			renderTo: this.el,
			style: "padding:1px;",
			tbar: this.tbar
		});

		this.csm = new Ext.grid.RowSelectionModel();
		this.grid = new Ext.grid.EditorGridPanel({
			border: false,
			stripeRows: true,
			enableColumnHide: false,
			enableHdMenu: false,
			layout: 'fit',
                        //anchor: '100% 100%',
			viewConfig: {
				forceFit: true
			}, loadMask: true,
			clicksToEdit: 1,
			store: new Ext.data.ArrayStore({
				fields: [this.valueName, this.valueData]
			}),
			cm: new Ext.grid.ColumnModel({
				menuDisabled: true,
				columns: [{
					header: this.headerRowName,
					id: this.valueName,
					name: 'name',
                                        width: 40,
					dataIndex: 'name',
                                        renderer: Fresh.GridRender.giveComboRenderer('contacttype-def-store','nameLangAct','uid'),
					editor: {
                                            xtype: 'ccombo', displayField: 'nameLangAct', valueField: 'uid', store: this.gridStore || 'contacttype-def-store'
                                        }
				},
                                //new Ext.ux.grid.TypedEditorColumn( { header: this.headerRowValue, store: 'attribute-types-store', sortable: true, dataIndex: 'value', typeField: 'name' })
                                {
					header: this.headerRowValue,
					id: this.valueData,
					name: 'value',
					dataIndex: 'value',
					editor: new Ext.form.TextField({
						allowBlank: false
					})
				}
                                ]
			}),
			sm: this.csm,
			tbar: [{
				text: this.addRowText,
				tooltip: this.addRowTooltip,
				iconCls: this.addRowIconCls,
				scope: this,
				handler: this.setRecord
			}, '-', {
				text: this.removeRowText,
				tooltip: this.removeRowTooltip,
				iconCls: this.removeRowIconCls,
				scope: this,
				handler: this.removeRecord
			}, '-', {
				text: this.clearRowText,
				tooltip: this.clearRowTooltip,
				iconCls: this.clearRowIconCls,
				scope: this,
				handler: this.clearRecords
			}]
		});
		this.fs.add(this.grid);
		this.hiddenName = this.name || Ext.id();
		var hiddenTag = {
			tag: "input",
			type: "hidden",
			value: "",
			name: this.hiddenName
		};
		this.grid.on('click', this.onViewClick, this);
		this.hiddenField = this.el.createChild(hiddenTag);
		this.hiddenField.dom.disabled = this.hiddenName != this.name;
		this.fs.doLayout();
	}, afterRender: function () {
		Ext.ux.form.OptionsGrid.superclass.afterRender.call(this);
	}, setRecord: function () {
		var n = this.grid.getStore().getCount();
		var rec = this.grid.getStore().recordType;
		var p = new rec({
			id: n + 1
		});
		this.grid.stopEditing();
		this.grid.store.insert(n, p);
		this.grid.startEditing(n, 0);
	}, removeRecord: function (grid, rowIndex, e) {
		this.grid.stopEditing();
		var selections = this.grid.getSelectionModel();
		var records = selections.getSelections();
		if (typeof(records) == 'undefined' || parseInt(records.length) == 0) {
			Ext.MessageBox.alert('warning', this.warningDelete);
		} else {
			Ext.MessageBox.confirm('prompt box', this.confirmDelete, function (btn) {
				if (btn == 'yes') {
					if (records) {
						Ext.each(records, this.grid.store.remove, this.grid.store);
						this.hiddenField.dom.value = this.getValue();
					}
				}
			}, this);
		}
		this.validate();
	}, getValue: function () {
		var data = new Array();
		this.grid.store.commitChanges();
		if (this.grid.store.getRange().length != 0) {
			Ext.each(this.grid.store.getRange(), function (item, index) {
				data[index] = item.data;
			}, this);
			return Ext.util.JSON.encode(data);
		}
		return null;
	}, gridValid: function () {
		var arr = new Array();
		var values = new Array();
		var valid = true;
		var arr = Ext.util.JSON.decode(this.getValue());
		var a;
                if (!this.allowBlank)
                    Ext.each(arr, function (item, index) {
                            values[index] = item['name'];
                            if (!item['name'] /* || !item['value'] */ ) {
                                    valid = false;
                                    this.markInvalid(this.blankText);
                            }
                    }, this);

		for (i = 0; i < values.length; i++) {
			a = 0;
			for (j = 0; j < values.length; j++) {
				if (values[i] && values[j]) {
					if (values[i] == values[j]) {
						if (a >= 1) {
							valid = false;
							this.markInvalid(this.repeatText);
						}
						a++;
					}
				}
			}
		}

		return valid;
	}, setValue: function (value) {
		if (value == '') return false;
		if (!this.enableJson) {
			var records = new Array();
			var vv = new Array();
			value = value.split(this.firstSeparator);
			Ext.each(value, function (item, index) {
				vv = item.split(this.secondSeparator);
				records[index] = new Array();
				records[index]['name'] = vv[0];
				records[index]['value'] = vv[1];
			}, this);
		}
		else {
			var records = Ext.util.JSON.decode(value);
		}
		var rec = this.grid.getStore().recordType;
                this.grid.store.removeAll();
		Ext.each(records, function (item, index) {
			this.grid.store.insert(index, new rec(item));
		}, this);
		this.validate();
	}, clearRecords: function () {
		this.grid.store.removeAll();
		this.hiddenField.dom.value = this.getValue();
		this.validate();
	}, validateValue: function (value) {
		value = this.grid.store.getRange();
		if (value.length < 1) {
			if (this.allowBlank) {
				this.clearInvalid();
				return true;
			}
			else {
				this.markInvalid(this.blankText);
				return false;
			}
		}
		if (this.validGrid) {
			if (!this.gridValid()) {
				return false;
			}
		}
		if (value.length < this.minSelections) {
			this.markInvalid(String.format(this.minSelectionsText, this.minSelections));
			return false;
		}
		if (value.length > this.maxSelections) {
			this.markInvalid(String.format(this.maxSelectionsText, this.maxSelections));
			return false;
		}
		return true;
	}, onViewClick: function (vw, index, node, e) {
		this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
		this.hiddenField.dom.value = this.getValue();
		this.fireEvent('click', this, e);
		this.validate();
		this.gridValid();
	}, disable: function () {
		this.disabled = true;
		if (this.hiddenField)
			this.hiddenField.dom.disabled = true;
		if (this.grid)
			this.grid.disable();
	}, enable: function () {
		this.disabled = false;
		if (this.hiddenField)
			this.hiddenField.dom.disabled = false;
		if (this.grid)
			this.grid.enable();
	}
});
Ext.reg('optionsgrid', Ext.ux.form.OptionsGrid);