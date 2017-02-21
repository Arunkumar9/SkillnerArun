#
#     CRM User Management layout definition
#

description:
    name: comments-win
    text: <%[Comments management]%>
    iconCls: icon-comments-win
    authLevel: 
        min: 100
        max: 1000
objects:
     -  name: commentsStore
        evalTo: global
        definition: >
            new Ext.data.GroupingStore({
                id: 'comments-store',
                url: Fresh.Config.Service.View,
                root : 'rows',
                baseParams: { view: 'comments-view' },
                reader: new Ext.data.JsonReader(),
                remoteSort: true,
                autoLoad: false
            })
            
component:
     id:              comments-win
     title:           <%[Comments management]%>
     width:           700
     height:          400
     x:               @this.desktop.getWinX(700)
     y:               @this.desktop.getWinY(500)
     iconCls:         icon-comments-win
     shim:            false
     animCollapse:    false
     constrainHeader:     true
     minimizable:          true
     maximizable:          true
     layout: row-fit
     items:
       -    region: north
            height: 50%
            #height: 200
            #title:  <%[ Comment Detail ]%>
            layout: fit
            id: comments-detail
            frame: true
            html: <%[ Select record in grid to see detail]%>
       #
       #     West panel with filter and search tabs
       #
       -    title: <%[ Comments List ]%>
            region: center
            elements: body
            id: comments-grid
            layout: fit
            xtype:    autogrid 
            loadMask: true
            store:  comments-store
            sm: >
                @new Ext.grid.RowSelectionModel({singleSelect: true})
            stripeRows: true
            view: >
                @new Ext.grid.GroupingView({
                    hideGroupedColumn: true, 
                    forceFit: true,
                    groupTextTpl: '{text} ({[values.rs.length]})' 
                })
            viewConfig: 
                forceFit: true
            linkedForm: comments-detail
            noStorePreload: false
            bbar: >
                @new Ext.PagingToolbar({
                      pageSize:      20
                      ,store:         'comments-store'
                      ,displayInfo:   true
                      ,displayMsg:    '<%[Count {2}]%>'
                      ,emptyMsg:      '<%[No comments to display]%>'
                 })
            plugins: 
                -    @new Ext.ux.Plugin.DetailBinder()
                -    @new Ext.ux.Plugin.FormToButtons()
            buttonAlign: right
            buttons: 
                -     @this.actions.saveGridTool
                -     @this.actions.cancelGridTool
           #
           #     end of west region
           #
       #
       #     Center panel splits to east with grid and center with tabpanel
       #
            
