/**
 * @author rosa
 */
Ext.namespace('DTV');

DTV.ImportTitlesWindow = Ext.extend(Ext.util.Observable, {

        init: function(f) {

            this.form = Ext.getCmp('video-form');
            this.id = this.form.formBaseParams.id;

            if (!this.id || this.form.disabled) {
                Ext.MessageBox.alert(__('Alert!'), __('video.not.open'));
                return;
            }

            this.makeWindow();

        },

        importTitles: function() {
            this.progressBar();
            var data = Ext.getCmp('upload-field').getValue();

            CuepointRecordMgr.importTitles(this.id,data,function(r,t) {
                 if (t.status) {
                     this.progressBarStop();
                     Ext.StoreMgr.lookup('cuepoints-store').reload();
                     this.win.close();
                 } else {
                     Ext.MessageBox.alert(__('Error!'), __('video.import.error.logged'));
                     Fresh.console.log(r);
                 }
            },this);
        },

        makeWindow: function() {
            if (!this.win) {
             this.win = new Ext.Window({
                layout:     'fit'
                ,modal:  true
                ,id: 'import-titles-win'
                ,buttonAlign: 'right'
                ,width: 600
                ,height: 300
                ,title: __('title.import')
                //,tbar: new Ext.Toolbar(%formToolbarDef%)
                ,buttons: [{
                       text: __('titles.do.upload')
                       ,minWidth: 100
                       ,id: 'upload-import-button'
                       ,handler: this.importTitles.createDelegate(this) }
                       ,{
                       text: __('titles.import.close')
                       ,minWidth: 100
                       ,handler: Fresh.global.actions.closeWindowHandler.createDelegate(this,['import-titles-win']) }]
                ,plugins: [ new Ext.ux.Plugin.FormToButtons() ]
                ,items: [{
                       xtype:     'form'
                       ,border:     false
                       ,id: 'import-form'
                       ,xurl: Fresh.Config.Service.Import
                       ,trackResetOnLoad: true
                       ,autoWidth: true
                       ,frame: false
                       ,xformBaseParams: {
                           view: 'import-form-view' }
                       ,items: [{
                             hideLabel: true
                             ,name: 'text'
                             ,id: 'upload-field'
                             ,xtype: 'textarea'
                             ,margin: '5px 5px 5px 5px'
                             ,anchor: '100% 100%'
                       }]
                   }]
                }); 
            }
            this.win.show();
        },

        progressBar: function() {
            Ext.MessageBox.show({
                    msg: __('Waiting for server') + '...',
                    progressText: __('Please wait ...'),
                    width: 300,
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


