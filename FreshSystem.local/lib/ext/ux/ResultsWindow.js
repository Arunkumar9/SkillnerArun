/**
 * @author rosa
 */
Ext.namespace('KNT');

KNT.ResultsWindow = Ext.extend(Ext.util.Observable, {

        init: function(app) {

            this.form = Ext.getCmp('clients-form');
            this.id = this.form.formBaseParams.id;
            this.app = app;
            if (!this.id || this.form.disabled) {
                Ext.MessageBox.alert(__('Alert!'), __('client.not.open'));
                return;
            }

            this.progressBar();
            this.ts = this.form.getForm().findField('UpdateStamp').getValue();

            ClientRecordMgr.getImprint(this.id,function(r,t) {
                 if (t.status) {
                     this.progressBarStop();
                     this.compareImprint(r);
                 }
            },this);

        },

        compareImprint: function(r) {
            if (r === false) {
                //this.app.clientsStore.reload();
                //Fresh.Msg.SlideBox(__('Attention!'),__('client.new.logged'));
                Ext.MessageBox.confirm(__('Confirm'), __('client.new.really'), function(btn, text){
                    if (btn == 'yes') {
                            this.progressBar();
                            ClientRecordMgr.doImprint(this.id,function(r,t){
                                if (t.status) {
                                    this.app.clientsStore.reload();
                                    this.form.getForm().findField('ServiceToAsDate').setValue(r);
                                    this.progressBarStop();
                                    this.makeWindow();
                                }
                            },this);
                    }
                },this);
            }
            else {
                if (r > 3) {

                    Ext.MessageBox.confirm(__('Confirm'), __('client.changes.really'), function(btn, text){
                        if (btn == 'yes') {
                            this.progressBar();
                            ClientRecordMgr.doImprint(this.id,function(r,t){
                                if (t.status) {
                                    this.app.clientsStore.reload();
                                    this.form.getForm().findField('ServiceToAsDate').setValue(r);
                                    this.progressBarStop();
                                    this.makeWindow();
                                }
                            },this);
                        }
                    },this);

                } else {
                    this.makeWindow();
                }
            }

        },

        makeWindow: function() {

            var win = new Ext.Window({
                maximized: true,
                monitorResize: true,
                id: 'customer-kntresult-win',
                title: __('title.KNTanalysis'),
                iconCls: 'icon-gear',
                layout: 'fit',
                tbar: [{
                       iconCls: 'icon-print32',
                       text: __('result.Print'),
                       scale: 'large',
                       handler: function(b) {b.findParentByType('window').getComponent('tabpanel').getActiveTab().getFrameWindow().print();}
                       },'->',{
                       iconCls: 'icon-exit32',
                       scale: 'large',
                       handler: Fresh.global.actions.closeWindowHandler.createDelegate(this,['customer-kntresult-win'])}
                       ],
                items: [ {
                   xtype: 'tabpanel',
                   activeTab: 0,
                   itemId: 'tabpanel',
                   deferredRender: false,
                   defaults: {
                      xtype: 'iframepanel',
                      layout: 'fit'
                   },
                   items: [ {
                          title: __('title.KNTanalysisTab'),
                          defaultSrc: '/cms/knt-vysledky?lang=cs&client='+this.id+'&ts='+this.ts
                          },{
                          title: __('title.KNTanalysisMeal'),
                          defaultSrc: '/cms/knt-jidelnicek?lang=cs&client='+this.id+'&ts='+this.ts
                          },{
                          title: __('title.analysis'),
                          defaultSrc: '/cms/pokus?lang=cs&client='+this.id+'&ts='+this.ts
                          }
                          ]
                       }]
            });
            win.show();
        },

        progressBar: function() {
            Ext.MessageBox.show({
                    msg: __('Waiting for server') + '...',
                    progressText: __('Please wait ...'),
                    width:200,
                    wait:true,
                    waitConfig: {
                        interval:200
                    }
                   //,icon:'mb-loading-icon'
                });
        },
        progressBarStop:function() {
            Ext.MessageBox.hide();
        }
});


