#
#     CRM Setup layout definition
# CustomerTown, CustomerPostcode, CoverageArea, Delivery Run, Customer Type, Customer Status, Money Locations, Payment Type, Customer Heard, Fundraiser, Complaints, Actions
#
#                    tools:
#                        -   id: refresh
#                            handler: >
#                                @function(e,t,p) {
#                                    p.store.load({params: {}});
#                                }
#                            qtip: Refresh grid
#
#
description:
    name: market-win
    text: CRM Market Report
    iconCls: icon-market-win
    authLevel: 
        min: 200
        max: 1000
    authRole: SuperAdmin
objects:
     -  name: marketStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'market-reports-store'
            })
component:
    id:              market-win
    title:           CRM Market Report
    width:           800
    height:          600
    x:               @this.desktop.getWinX(800)
    y:               @this.desktop.getWinY(600)
    iconCls:         icon-market-win
    shim:            false
    animCollapse:    false
    constrainHeader: true
    minimizable:     true
    maximizable:     true
    layout: border
    items:
        -   title: Market Reports
            xtype: autogrid
            region: west
            id:   market-reports-grid
            closable: true
            collapsed: false
            collapsible: true
            clicksToEdit: 2
            askBeforeChange: true
            loadMask: true
            border: true
            autoWidth: true
            autoScroll: true
            layout: fit
            frame: false
            stripeRows: true
            stateful: false
            width: 300
            linkedForm: market-reports-form
            loadFormFromStore: true
            viewConfig:
                forceFit: true
            sm: >
                @new Ext.grid.RowSelectionModel({singleSelect: true})
            tbar: 
                -   @this.actions.saveGridTool
                -   @this.actions.cancelGridTool
                -   @this.actions.addGridTool
                -   @this.actions.deleteGridTool
                -   @this.actions.reloadGrid
            plugins:
                -   @new Ext.ux.Plugin.FormToButtons()
                -   @new Ext.ux.Plugin.FormLinker()
        -   title: Edit Market Report
            id: market-reports-form
            xtype: form
            region: center
            layout: form
            frame: false
            bodyStyle: 
                padding: 5px 5px 0
            items: 
                 -    fieldLabel: Text
                      name: Report
                      xtype: htmleditor
                      hideLabel: true
                      autoHeight: false
                      anchor: 100% 100%
references:
    gridPagingDef:
         pageSize:      20
         store:         @this.store
         displayInfo:   true
         displayMsg:    "Count {2}"
         autoShow:      true
         emptyMsg:      No customers to display
    prefGroupingViewDef:
         startCollapsed: true
         forceFit: true
         hideGroupedColumn: true
         groupTextTpl: "{text} ({[values.rs.length]})"
         enableNoGroups: true

