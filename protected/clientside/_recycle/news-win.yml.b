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
#     -  name: Ext.ux.Plugins.DataView.js
#        using: [ lib/ext/ux/Ext.ux.Plugins.DataView.js ]
#
description:
    name: news-win
    text: <%[ News Management ]%>
    iconCls: icon-news-win
    authLevel: 
        min: 100
        max: 1000
    authRole: SuperAdmin
objects:
     -  name: categoriesStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'categories-store'
            })
     -  name: languagesStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'languages-store'
            })
     -  name: newsImagesStore
        evalTo: local
        definition: >
            new Fresh.data.ViewProvider({
                id: 'news-images-store'
            })
     -  name: newsStore
        evalTo: global
        definition: >
            new Ext.data.GroupingStore({
                id: 'news-store',
                url: Fresh.Config.Service.View,
                root : 'rows',
                baseParams: { view: 'news-view' },
                reader: new Ext.data.JsonReader(),
                remoteSort: true,
                autoLoad: false
            })
     -  name: categoriesStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'categories-store'
            })
     -  name: languagesStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'languages-store'
            })
     -  name: newsImagesStore
        evalTo: local
        definition: >
            new Fresh.data.ViewProvider({
                id: 'news-images-store'
            })
component:
    id:              news-win
    title:           <%[ News Management ]%>
    width:           1000
    height:          700
    x:               @this.desktop.getWinX(1000)
    y:               @this.desktop.getWinY(700)
    iconCls:         icon-news-win
    shim:            false
    animCollapse:    false
    constrainHeader: true
    minimizable:     true
    maximizable:     true
    layout: border
    tbar:
          -    text: <%[ New News ]%>
               iconCls: icon-action
               handler: @this.actions.newRecordHandler.createDelegate(this,['news-form'],true)
    items:
        -    title: <%[ News List ]%>
             xtype: autogrid
             region: north
             id:   news-grid
             closable: true
             collapsed: false
             collapsible: false
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
             height: @this.maxHeight(200,0.4)
             linkedForm: news-form
             split: true
             loadFormFromStore: true
             viewConfig:
                forceFit: true
             sm: >
                 @new Ext.grid.RowSelectionModel({singleSelect: true})
             bbar: >
                @new Ext.PagingToolbar({
                      pageSize:      20
                      ,store:         'news-store'
                      ,displayInfo:   true
                      ,displayMsg:    '<%[Count {2}]%>'
                      ,emptyMsg:      '<%[No news to display]%>'
                 })
             plugins:
                -   @new Ext.ux.Plugin.FormLoader()
             listeners:
                afterlayout:
                    fn: >
                        @function(ct,layout) {
                            ct.getView().refresh();
                        }
        -    xtype: filtertree
             title: <%[ Images ]%>
             id: news-objects-tree
             layout: fit
             loader: >
                @new Ext.tree.TreeLoader({ 
                    dataUrl: Fresh.Config.Service.Tree, 
                    baseParams: { view: 'tree-objects-drag' } 
                })
             width: @this.maxWidth(300,0.3)
             rootVisible: false
             region: east
             split: true
             ddGroup: news-images-view
             enableDrag: true
             enableDrop: false
             collapsible: true
             lines: true
             autoScroll: true
             autoHeight: false
             root: >
                @new Ext.tree.AsyncTreeNode({
                    expanded: true,
                    text: '<%[ Root Object ]%>',
                    id: 'root'
                })
             tbar: 
                -    @this.actions.reloadTree
                -    @this.actions.expandTree
                -    @this.actions.collapseTree
             plugins: 
                -    @new Ext.ux.Plugin.TreeSorter()
                -    @new Ext.ux.Plugin.FormToButtons()
        -    title: <%[ Edit News ]%>
             id: news-form
             region: center
             elements:  body
             margins:    0 0 0 0
             xxlayout: fit
             frame: false
             border: false
             xtype: form
             url: @Fresh.Config.Service.Form
             trackResetOnLoad: true
             focusOnNew: name
             loadingMsg: "<%[ Loading news {name} ]%>"
             formBaseParams: 
                 view: news-form-view
             buttonAlign: right
             buttons: 
                -     @this.actions.save
                -     @this.actions.cancel
             plugins:
                -    @new Ext.ux.Plugin.FormToButtons()
             items:
                -    xtype:     panel
                     id: news-form-panel
                     autoWidth: true
                     nnlinkedGrid: news-images-view
                     anchor: 100% 100%
                     layout: border
                     frame: true
                     border: true
                     margins: 0 0 0 0
                     items:
                              -  xtitle: <%[ Data ]%>
                                 autoWidth: false
                                 autoHeight: true
                                 hideMode: offsets
                                 region: center
                                 xcolumnWidth: 0.75
                                 border: false
                                 frame: false
                                 layout: fit
                                 anchor: 100% 100%
                                 xxbodyStyle:
                                 xxxpadding: 5px 5px 5px 5px
                                 items:
                                    -    layout: form
                                         anchor: 100% 100%
                                         defaults:
                                            anchor: 100%
                                            xtype: textfield
                                         items:
                                            -    xtype: hidden
                                                 name: uid
                                            -    fieldLabel: '<%[ News Name ]%>'
                                                 name: name
                                                 allowBlank: false
                                            -    xtype: fieldset
                                                 frame: false
                                                 border: false
                                                 autoHeight: true
                                                 margins: 0 0 0 0
                                                 layout: column
                                                 hideBorders: true
                                                 style:
                                                       padding: 0px
                                                 defaults:
                                                    layout: form
                                                 items:
                                                    -   columnWidth: 0.5
                                                        style:
                                                            padding-right: 5px
                                                        defaults:
                                                            anchor: 100%
                                                            layout: form
                                                        items:                                                 
                                                            -    fieldLabel: <%[ From ]%>
                                                                 name: fromDateAsDate
                                                                 xtype: xdatefield
                                                            -    fieldLabel: <%[ To ]%>
                                                                 name: toDateAsDate
                                                                 xtype: xdatefield
                                                    -   columnWidth: 0.5
                                                        style:
                                                            padding-left: 5px
                                                        defaults:
                                                            anchor: 100%
                                                            layout: form
                                                        items:                                                 
                                                            -    fieldLabel: <%[ Language ]%>
                                                                 valueField: lang
                                                                 displayField: name
                                                                 xtype: ccombo
                                                                 hiddenName: lang
                                                                 store: "@Ext.StoreMgr.lookup('languages-store')"
                                                            -    fieldLabel: <%[ Category ]%>
                                                                 xtype: ccombo
                                                                 displayField: <%= FU::LangVariant('name') %>
                                                                 valueField: uid
                                                                 hiddenName: category
                                                                 store: "@Ext.StoreMgr.lookup('categories-store')"
                                            -    fieldLabel: <%[ News Text ]%>
                                                 name: text
                                                 allowBlank: true
                                                 xtype: htmleditor
                                                 enableFont: false
                                                 hideLabel: true
                                                 autoHeight: false
                                                 autoWidth: false
                                                 anchor: 100% 75%
                              -  title: <%[ News Images ]%>
                                 autoScroll: false
                                 region: east
                                 width: 150
                                 autoHeight: false
                                 split: false
                                 frame: true
                                 layout: carouselvertical
                                 xxxlayout: fit
                                 margins: 0 0 0 5px
                                 bodyStyle:
                                      padding:0 0 0 0
                                 items:
                                      -     xtype: ddautoview
                                            id: news-images-view
                                            name: images
                                            xframe: true
                                            layout: fit
                                            hiddenName: images
                                            dropGroup: news-images-view
                                            dragGroup: news-images-view
                                            deletable: true
                                            itemSelector: div.thumb-wrap
                                            noStorePreload: true
                                            contextMenuItems:
                                                -   id: delete
                                                    iconCls: icon-delete
                                                    text: <%[ Delete image ]%>
                                            plugins:
                                                -   "@new Ext.DataView.LabelEditor({dataIndex: 'text'})"
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
            tbar: 
                -   @this.actions.saveGridTool
                -   @this.actions.cancelGridTool
                -   @this.actions.addGridTool
                -   @this.actions.deleteGridTool
                -   @this.actions.reloadGrid
end:
-   "@new Ext.DataView.DragSelector({dragSafe: true})"

