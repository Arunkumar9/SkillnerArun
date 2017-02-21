/**
 * @author rosa
 */
Ext.namespace('DR');
DR.ContactsWindow = function(field){
        var CustNo = Ext.getCmp('customer-form').formBaseParams.id;
        var creditsStore = new Fresh.data.ViewProvider({
                        id: 'credits-store',
                        autoLoad: false,
                        baseParams: { view: 'credits-view', filter: CustNo }
                        });

        
        var saveCredit = function(b,e) {
            var newCredit;
            e.preventDefault();
            var form = b.ownerCt;
            var sourceField = form.getForm().findField('CreditToApply');
            if (form.getForm().isDirty()) {
            
                if (form.getForm().isValid()) {
                    var formParams = form.formBaseParams || {};
                    formParams.action = 'store';
                    
                    form.getForm().submit({
                        params: formParams
                          ,waitMsg: 'Saving...'
                          ,clientValidation: true
                          ,waitTitle: 'Saving...'
                          ,success: function(f,action){
                                var result = action.result;
                                result.message = result.message || '';
                                if (result.success) {
                                    Fresh.Msg.SlideBox('Success!',result.message);
                                    if (sourceField) {
                                        newCredit = parseFloat(field.getValue())-parseFloat(sourceField.getValue());
                                        field.setValue(newCredit);
                                    }
                                    win.close();
                                }
                                else {
                                    Ext.MessageBox.alert('Error',result.message);
                                }
                          }
                          ,failure: function() {
                              Ext.MessageBox.alert('Error','Error occured while saving Customer Profile.');
                          }
                    });
                }
                
            }
            
            if (!form.getForm().isValid()) {
                Ext.MessageBox.alert('Form not valid...', 'Please check your form! Some of the fields are not valid.');
                return;
            }
        };
        
        // tabs for the center
        var tabs = new Ext.TabPanel({
            margins:'3 3 3 0', 
            activeTab: 0,
            defaults:{autoScroll:true},
            items:[{
                title: 'Apply Credit',
                xtype: 'form',
                url: Fresh.Config.Service.Form,
                formBaseParams: {
                    view: 'credit-form-view',
                    context: 'new-record'
                },
                bodyStyle: { padding: '10 10 10 10' },
                frame: true,
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
/*                        fieldLabel: 'Date',
                        xtype: 'datefield',
                        name: 'Date'
                        
                    },{
                        fieldLabel: 'User',
                        value: Fresh.User.Username,
                        readOnly: true,
                        name: 'User'
                    },{ */
                        fieldLabel: 'Credit to apply',
                        xtype: 'numberfield',
                        allowNegative: true,
                        name: 'CreditToApply',
                        allowBlank: false,
                        id: this.id+'-creditToApply'
                    },{
                        fieldLabel: 'Note',
                        xtype: 'textarea',
                        name: 'Note'
                    },{
                        xtype: 'hidden',
                        name: 'CustNo',
                        value: CustNo
                    }
                ],
                buttons: [
                    {
                        text: 'Apply',
                        handler: saveCredit
                    },{
                        text: 'Close',
                        handler: function(){
                            win.close();
                        }
                    }
                    
                ]
            },{
                title: 'Credits log',
                xtype: 'autogrid',
                noStorePreload: true,
                changed: true,
                bbar: new Ext.PagingToolbar({
                      pageSize:      20,
                      store:         creditsStore,
                      displayInfo:   true,
                      displayMsg:    "Count {2}",
                      autoShow:      true,
                      emptyMsg:      'No records to display'
                }),
                loadMask: true,
                viewConfig: { forceFit: true },
                listeners: {
                      'activate': {
                        fn: function(p) {
                                    p.store.load({params: {meta: true, start: 0}});
                            },
                        single: true
                      }
                },
                store: creditsStore
            }]
        });


        var win = new Ext.Window({
            title: 'Credit',
            closable:true,
            width:500,
            height:300,
            //border:false,
            plain:true,
            layout: 'fit',
            modal: true,

            items: [tabs]
        });

        win.show(this);
}
DR.contactTrigger = function(config) {
    Ext.applyIf(config,{
     editable: false,
     triggerClass: 'x-form-search-trigger',
     align: 'right'
   });
   DR.contactTrigger.superclass.constructor.call(this,config);
}
Ext.extend(DR.contactTrigger,Fresh.form.CommonComboBox,{
/*    initComponent: function() {
        this.onTriggerClick = DR.ContactsWindow.createDelegate(DR.ContactsWindow,[this]);
    },
*/
    expand: Ext.emptyFn,
    collapse: Ext.emptyFn,

    onTriggerClick : function(field) {
        var win,list;
//        if (win = MyDesktop.getDesktop().getWindow('contacts-win')) {
          //win.show();
  //        win.close();
    //    }
        //else {
          var module = MyDesktop.getModule('contacts-win');
          if (module)
             module.createWindow({ fieldClient: this });
        //}
    }


});

Ext.reg('contactfield',DR.contactTrigger);

