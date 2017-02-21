/**
 * @author rosa
 */
Ext.namespace('KNT');

KNT.ExportWindow = Ext.extend(Ext.util.Observable, {

        init: function(app) {

            var that = this;
            var form = new Ext.form.FormPanel({
                labelWidth: 100,
                frame: true,
                border: false,
                monitorValid: true,
                defaultType: 'datefield',
                /*layout: 'tableform',
                layoutConfig: {
                    columns: 2
                },*/
                items: [{
                    fieldLabel: __('stats.export.from'),
                    name: 'fromDate',
                    allowBlank: false,
                    anchor: '100%'
                },{
                    fieldLabel: __('stats.export.to'),
                    name: 'toDate',
                    allowBlank: false,
                    anchor: '100%'
                }]
            });
        
            //if (!this.win)
            var win = new Ext.Window({
                    title: __('stats.export.dialog'),
                    id: 'stats-export-win',
                    width: 300,
                    height:150,
                    minWidth: 300,
                    modal: true,
                    minHeight: 150,
                    layout: 'fit',
                    bodyStyle:'padding:10px;',
                    buttonAlign:'center',
                    items: form,
            
                    buttons: [{
                        text: __('stats.export.do'),
                        formBind: true,
                        handler: this.doReport.createDelegate(this,[form],true)
                    },{
                        text: __('stats.export.cancel'),
                        handler: Fresh.global.actions.closeWindowHandler.createDelegate(this,['stats-export-win'])
                    }]
                });
            win.show();
        },

        doReport: function(b,e,f) {
            Ext.ns('Fresh.Config.Reports');
            Fresh.Config.Reports.MaxTotalCount = 10000;
            b.form = 'stats-pivotgrid';
            var context = Ext.StoreMgr.lookup('stats-store').baseParams.context;
            var toDate = f.getForm().findField('toDate').getValue().add(Date.DAY,1).add(Date.MINUTE,-1).format('U');
            var fromDate = f.getForm().findField('fromDate').getValue().format('U');
            b.url = Fresh.Config.Service.Report + 'xls=report&report=clients&context='+context+'&from=' + fromDate + '&to=' + toDate; 
            Fresh.global.actions.linkReportButtonHandler(b,e);
            Fresh.global.actions.closeWindowHandler(['stats-export-win']);
        },
        
        closeMe: function(b,e) {
            this.destroy();
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


