/**
 * 
 * 
 *  * @author rosa
 */
 
 //if (typeof(Fresh)=='undefined')
//	var Fresh = {}

Ext.namespace('Fresh');
//Ext.namespace('Ext.ux.form');


//Fresh.FHtmlEdit = function(params) {
    //Fresh.FHtmlEdit.superclass.constructor.call(this, params);
//}    
Fresh.FTypeStore = function(params){
    Fresh.FTypeStore.superclass.constructor.call(this, {
            baseParams: params,
			proxy: new Ext.data.HttpProxy({url: 'index.php'}),
			reader: new Ext.data.JsonReader({
					totalProperty: 'count',
					root: 'result',
					id: 'uid'
				}, 
				['uid','description'])
    });
};
Ext.extend(Fresh.FTypeStore, Ext.data.Store);

Fresh.FTypeCombo = function(params) {
    Fresh.FTypeCombo.superclass.constructor.call(this, {
    				store: new Fresh.FTypeStore(params.baseParams),
    				editable: false,
    				lazyRender: false,
    				fieldLabel: params.fieldLabel,
		            hiddenName: params.hiddenName,
		            width:175,
    				valueField: 'uid',
    				displayField:'description',
    				typeAhead: true,
    				forceSelection: true,
    				allQuery: params.baseParams.query,
    				mode: 'remote',
    				triggerAction: 'all',
				    emptyText: params.emptyText || 'Zvol typ ...',
    				selectOnFocus:true,
    				listeners: {
						//'blur' : function(c) { c.store.reload(); },
						'render' : function(c) { c.doQuery(c.allQuery, true); }
    					}
				});

};
Ext.extend(Fresh.FTypeCombo, Ext.form.ComboBox,{
	onShow: function(a) { //alert('xxx'); //Ext.form.TriggerField.onShow();
						 this.doQuery(this.allQuery, true); }
});

// This is my sample dialog class

Fresh.FRecordDialog =  function(o) {
		
		this.config = {
			formUrl: 'index.php',
			storeParams: 'json=recordProvider&action=store',
			loadParams: 'json=recordProvider&action=load',
			width: 300,
			height: 200,
			title: "",
			waitMsgLoad: 'Loading',
			waitMsgStore: 'Saving',
			id: 'FRecordDialog',
			recordClass: 'ContentRecord',
			uid: null,
			parent_id: null,
			formFields: null
		}
		jQuery.extend(this.config, o);
		 
		this.doCancel = function() {
			this.dlg.hide();
		}

		this.doOK = function() {
			//if (this.form.isDirty) {
				this.form.submit({url: this.config.formUrl, params: this.config.storeParams+'&uid='+this.config.uid+'&record='+this.config.recordClass+'&parent_id='+this.config.parent_id, waitMsg: this.config.waitMsgStore});
			//} else {
				//this.dlg.hide();
			//}
		}

		this.dlg = new Ext.BasicDialog(this.config.id, {
			autoCreate: true,
			width: this.config.width,
			height: this.config.height,
			modal: true,
			proxyDrag: true,
			shadow: true,
			collapsible: false,
			resizable: false,
			closable: false,
			title: this.config.title
		});
		this.dlg.addKeyListener(27, this.doCancel, this);
		this.dlg.addButton('OK', this.doOK, this);
		this.dlg.addButton('Zrušit', this.doCancel, this);

		//submit.disable();

		this.form = new Ext.form.Form({
			labelAlign: 'right',
	        labelWidth: 75,
        	waitMsgTarget: true //'msgTarget'			
			});

		Ext.each(this.config.formFields,function(item, index, allItems) { if (item != null) { this.form.add(item); } return true; }, this);

		this.dlg.body.setStyle('padding', '8pt');
		this.form.render(this.dlg.body);
		this.form.on('actioncomplete',function(f,a) { if (a.type=='submit') { this.dlg.hide();} }, this);
		
};

Fresh.FRecordDialog.prototype = {
		show : function(el) {
				this.reset();
				this.form.un('hide');
				//this.form.un('actioncomplete');
				this.dlg.show();
				//var sel = this.sampleText.el;
				//setTimeout(function(){sel.focus();}, 0);
				if (this.config.uid != null)
					this.load();
		},
		setTitle : function(s) {
					this.dlg.setTitle(this.config.title + ' ' + s);
		},
		reset : function() {
				this.form.reset();
		},
		load : function() {
				this.form.load({url:this.config.formUrl, params: this.config.loadParams+'&uid='+this.config.uid+'&record='+this.config.recordClass, waitMsg: this.config.waitMsgLoad });
		}
};

Ext.onReady(function() {
	
Fresh.DialogDefinitions = {
		'ContainerRecord' : {
			title: 'Strana',
			width: 300,
			height: 200
		},
		'ContentRecord' : {
			title: 'Článek',
			width: 300,
			height: 200
		},
		'UserRecord' : {
			title: 'Uživatel',
			width: 300,
			height: 200
		},
		'TypeRecord' : {
			title: 'Typ',
			width: 300,
			height: 300
		}
};

Fresh.formFields = {
	
		'ContainerRecord': [
				new Ext.form.TextField({
		            fieldLabel: 'Name',
		            name: 'name',
		            width:175,
		            msgTarget: 'side',
		            allowBlank:false
		        }),
				new Fresh.FTypeCombo({baseParams: { json: 'readTypes', query: 'ContainerRecord' },
									 fieldLabel: 'Type',
									 allowBlank: false,
		            				 hiddenName: 'type_id'}),
	
				new Fresh.FTypeCombo({baseParams: { json: 'byType', type: 'templates', query: 'templates' },
									 fieldLabel: 'Template',
		            				 hiddenName: 'template',
		            				 emptyText: 'Zvol šablonu ...'}),
				new Ext.form.ComboBox({
    				store: new Ext.data.SimpleStore({
    					fields: ['v', 'v_name'],
    					data : [['1', 'ano'],
        						['0', 'ne'] ]
					}),
    				editable: false,
					allowBlank: true,
    				lazyRender: false,
    				fieldLabel: 'Hidden',
    				hiddenName: 'hidden_parent',
		            width:175,
    				valueField: 'v',
    				displayField:'v_name',
    				forceSelection: true,
    				mode: 'local',
    				triggerAction: 'all',
				    emptyText:'ne',
					valueNotFoundText: 'ne',
    				selectOnFocus:true
				})

			],

		'ContentRecord': [
				new Ext.form.TextField({
		            fieldLabel: 'Name',
		            name: 'name',
		            width:175,
		            allowBlank:false
		        }),
				new Fresh.FTypeCombo({baseParams: { json: 'readTypes', query: 'ContentRecord' },
									 fieldLabel: 'Type',
		            				 hiddenName: 'type_id'})
			],

		'UserRecord': [

				new Ext.form.TextField({
		            fieldLabel: 'Real name',
		            name: 'name',
		            width:175,
		            allowBlank:false
		        }),

				new Ext.form.TextField({
		            fieldLabel: 'Username',
		            name: 'username',
		            width:175,
		            allowBlank:false
		        }),
		
				new Ext.form.TextField({
		            fieldLabel: 'Password',
		            inputType: 'password',
		            name: 'passwd',
		            width:175,
		            allowBlank:false
		        }),

				new Ext.form.NumberField({
		            fieldLabel: 'Level',
		            name: 'level',
		            width:175,
		            allowBlank:false
		        })
			],

		'TypeRecord': [

				new Ext.form.TextField({
		            fieldLabel: 'Name',
		            name: 'name',
		            width:175,
		            allowBlank:false
		        }),

				new Ext.form.TextField({
		            fieldLabel: 'Description',
		            name: 'description',
		            width:175,
		            allowBlank:false
		        }),
		
				new Ext.form.ComboBox({
    				store: new Ext.data.SimpleStore({
    					fields: ['t', 't_name'],
    					data : [['content', 'obsah'],
        						['container', 'strana'] ]
					}),
    				editable: false,
    				lazyRender: false,
    				fieldLabel: 'Type',
    				hiddenName: 't',
		            width:175,
    				valueField: 't',
    				displayField:'t_name',
    				forceSelection: true,
    				mode: 'local',
    				triggerAction: 'all',
				    emptyText:'Zvol typ ...',
    				selectOnFocus:true
				})

				,new Ext.form.TextArea({
		            fieldLabel: 'Data',
		            name: 'data',
		            width:175,
		            height: 100,
		            allowBlank:true
		        })


			]
};

Fresh.DialogRepository = [];
for (var ff in Fresh.formFields) {
					Fresh.DialogRepository[ff] = new Fresh.FRecordDialog({
						recordClass: ff,
						title: Fresh.DialogDefinitions[ff].title,
						width: Fresh.DialogDefinitions[ff].width,
						height: Fresh.DialogDefinitions[ff].height,
						uid: null,
						id: 'modify'+ff,
						formFields: Fresh.formFields[ff]
					});
	//				alert(ff);
//					Fresh.DialogRepository[ff].form.on('actioncomplete',function(f,a) { if (a.type=='submit') { nodeReload(); } },this);
}

});

// Put this somewhere to create and show the dialog
//var dialog = null;
//if(!dialog) {
//dialog = new SampleDialog();
///}
//dialog.show(this);

 