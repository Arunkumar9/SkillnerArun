/**
 * @author rosa
 */


Ext.ux.Plugin.DetailBinder = function() {}
Ext.ux.Plugin.DetailBinder.prototype = {
    init: function(m) {
        var fr;
        this.m = m; var that = this;     
        if (typeof m.linkedForm == 'string')
        {
            if (fr = Ext.getCmp(m.linkedForm)) {
                m.linkedForm = fr;
        		var sm = m.getSelectionModel();
                sm.on('rowselect', this.onRowSelect, this);		    
                
            } else
                Ext.ComponentMgr.onAvailable(m.linkedForm,function(fr){
                    m.linkedForm = fr;
            		var sm = m.getSelectionModel();
                    sm.on('rowselect', that.onRowSelect, that);		    
//                    that.m.on('click', that.onRowSelect, that);		    
                },this);
        }
        else if (m.linkedForm) {
        		var sm = m.getSelectionModel();
                sm.on('rowselect', this.onRowSelect, this);		    
  //              this.m.on('click', this.onRowSelect, this);		    
        }
    },

    onRowSelect: function(sm, rowIdx, r){


/*
        var sm = this.m.getSelectionModel();
        var record = sm.getSelected();
        if (record && this.m.store && this.m.store.meta) {
            var tpl = this.m.store.meta.tplDetail;
            tpl.overwrite(this.m.linkedForm.body, record.data);
            return;
        }

*/

        if (this.m.store && this.m.store.meta) {
            var tpl = new Ext.XTemplate(this.m.store.meta.tplDetail);
            tpl.overwrite(this.m.linkedForm.body, r.data);
        }
    
    }    
}
