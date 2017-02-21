/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.ux.form.GridCombo = Ext.extend(Fresh.form.CommonComboBox, {

    initList: function(){

        this.list = new Ext.ux.CommonAutoGridPanel({
            store: this.store,
            height: 200,
            floating: true,
//            stateful: true,
//            stateId: 'grid',
            selModel: new Ext.grid.RowSelectionModel({singleSelect: true}),
            tbar: [],
            plugins: [],
            alignTo: function(el, pos){
                this.setPagePosition(this.el.getAlignToXY(el, pos));
            },
             bbar: new Ext.PagingToolbar({
                      pageSize:      20
                      ,store:         'users-store'
                      ,displayInfo:   true
                      ,displayMsg:    'Count {2}'
                      ,emptyMsg:      __('No clients to display')
                 })
        });
        this.list.on('rowclick', this.onRowClick, this);
    },
    expand: function(){
        if (!this.list.rendered) {
            this.list.render(document.body);
            this.list.setWidth(this.el.getWidth());
            this.innerList = this.list.body;
            this.list.hide();
        }
        this.el.focus();
        Ext.ux.form.GridCombo.superclass.expand.apply(this, arguments);
    },

    doQuery: function(q, forceAll){
        this.expand();
    },

    collapseIf: function(e){
        if (!e.within(this.wrap) && !e.within(this.list.el)) {
            this.collapse();
        }
    },

    onRowClick: function(g, rowIndex, e){
        this.setValue(g.getSelectionModel().getSelected().get('uid'));
        this.list.hide();
    }
});
Ext.reg('gridcombo', Ext.ux.form.GridCombo);