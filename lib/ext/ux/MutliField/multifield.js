
Ext.onReady(function(){

    Ext.QuickTips.init();

    // turn on validation errors beside the field globally
    Ext.form.Field.prototype.msgTarget = 'side';

    var bd = Ext.getBody();

    /*
     * ================  Simple form  =======================
     */
    bd.createChild({tag: 'h2', html: 'Form 1 - Very Simple'});


    var simple = new Ext.FormPanel({
        labelWidth: 75, // label settings here cascade unless overridden
        url:'save-form.php',
        frame:true,
	method: 'POST',
	id: 'simpleForm1',
        title: 'Simple Form',
        bodyStyle:'padding:5px 5px 0',
        width: 350,
        defaults: {width: 230},
        defaultType: 'textfield',

        items: [{
		    width: 325,
		    xtype: 'multifield',
		    id: 'multiFieldTest1',
		    initialInstances: 1,
		    maxInstances: 0,
		    formID: 'simpleForm1',
		    name: 'multiFieldTest',
		    title: 'User Information',
		    instanceDefs: {
			title: 'User Data',
			autoHeight:true,
			defaultType: 'textfield',
			collapsed: false,
			width: 300,
			labelWidth: 75,
			defaults: {width: 195},
		    },
		    fieldDefs: [{
			    fieldLabel: 'First Name',
			    name: 'first',
			    allowBlank:false,
			    value: 'Default'
			},{
			    fieldLabel: 'Last Name',
			    name: 'last',
			    value: 'Value'
			}      ,{
                fieldLabel: 'Company',
                name: 'company'
            }, {
                fieldLabel: 'Email',
                name: 'email',
                vtype:'email'
            }, {
		    xtype: 'timefield',
                fieldLabel: 'Time',
                name: 'time',
                minValue: '8:00am',
                maxValue: '6:00pm'
            }],
		  initialValues: [{
			first: 'Wormy',
			last: 'McTavish'
			},{
			first: 'John',
			last: 'Doe'
		    }]
		}
		
        ],

        buttons: [{
		    text: 'Save',
		    type: 'submit',
		    handler: function() {
                    Ext.getCmp('simpleForm1').getForm().submit();
		    }
                

        },{
            text: 'Cancel'
        }]
    });

    simple.render(document.body);


});