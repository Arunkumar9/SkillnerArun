#
#     CRM Customers layout definition
#     listeners:
#        beforeclose: 
#            fn: >
#                @function(p) {
#                    Ext.MessageBox.alert('Closing',p.title);
#                    return false;
#                }
description:
    name: customer-win
    authLevels: true
    text: CRM Customer
    iconCls: icon-customer-win
    authLevel: 
        min: 100
        max: 1000
    authRole: Admin
objects:
     -  name: customersStore
        evalTo: global
        definition: >
            new Ext.data.GroupingStore({
                id: 'customers-store',
                url: Fresh.Config.Service.View,
                root : 'rows',
                baseParams: { view: 'grid-list-of-customers' },
                reader: new Ext.data.JsonReader(),
                remoteSort: true,
                autoLoad: false
            })
        
     -  name: customerPreferencesStore
        evalTo: local
        definition: >
            new Ext.data.GroupingStore({
                id: 'customer-preferences-store',
                url: Fresh.Config.Service.View,
                root : 'rows',
                baseParams: { view: 'grid-list-of-prefs' },
                reader: new Ext.data.JsonReader(),
                remoteSort: false,
                autoLoad: false
            })

     -  name: usersStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'users-store'
            })

     -  name: customerStatusStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'customer-status-store'
            })

     -  name: coverageStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'coverage-store'
            })

     -  name: paymentTypeStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'payment-types-store'
            })

     -  name: moneyLoactionStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'money-locations-store'
            })

     -  name: groupsStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'groups-store'
            })

     -  name: boxSizeStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'box-sizes-store'
            })

     -  name: boxTypeStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'box-types-store'
            })

     -  name: customerHeardsStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'customer-heards-store'
            })

     -  name: fundraisersStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'fundraisers-store'
            })

     -  name: actionsStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'actions-store'
            })

     -  name: complaintsStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'complaints-store'
            })
            
     -  name: contactWayStore
        evalTo: global
        definition: >
            new Fresh.data.ViewProvider({
                id: 'contact-way-store'
            })

     -  name: customerRowExpander
        evalTo: global
        definition: >
            new Ext.grid.RowExpander({
                enableCaching: false,
                tpl : new Ext.Template(
                '<p>{OrderNotes}s</p>'
                )
            })
            
     -  name: rowActionPlusC
        evalTo: global
        definition: >
            function(g,r,i) { 
                    var pa = r.get('CreateOrder');
                    var ab = r.get('AccountBalance');
                    r.set('AccountBalance',parseFloat(ab)+parseFloat(pa));
                    r.set('CreateOrder',0);
                    r.set('Unpaid',"1");
            }

     -  name: rowActionMinusC
        evalTo: global
        definition: >
            function(g,r,i) { 
                    var pa = r.get('CreateOrder');
                    var ab = r.get('AccountBalance');
                    ab = parseFloat(ab) - parseFloat(pa);
                    r.set('AccountBalance',ab);
                    r.set('CreateOrder',0);
                    r.set('Unpaid',"0");
            }

component:
     id:              customer-win
     title:           CRM Customers
     width:           @this.winWidth
     height:          @this.winHeight
     x:               @this.desktop.getWinX(this.winWidth)
     y:               @this.desktop.getWinY(this.winHeight)
     iconCls:         icon-crm-customer
     shim:            false
     animCollapse:    false
     constrainHeader:     true
     minimizable:          true
     maximizable:          true
     layout: border
     tbar:
          -    text: Exit 
               iconCls: icon-exit
          -    text: New Customer
               iconCls: icon-action
               handler: @this.actions.newRecordHandler.createDelegate(this,['customer-form'],true)
          -    text: New preference 
               iconCls: icon-action
               
          -    text: New action 
               iconCls: icon-action
               
          -    text: New fundraiser event 
               iconCls: icon-action
               
          -    text: New complaint 
               iconCls: icon-action
     items:
       #
       #     West panel with filter and search tabs
       #
       -    title: Admins & Filters
            region: west
            elements: body
            id: FilterAdmins
            collapsible: true
            collapsed: true
            cmargins: 0 0 0 0
            margins: 0 0 0 0
            width: @this.maxWidth(300,0.3)
            split: true
            layout: fit
            xtype: panel
            items:
                  - xtype: tabpanel
                    layoutOnTabChange: true
                    defaults:
                        hideMode: offsets
                    deferredRender: false
                    layoutOnTabChange: true
                    activeTab: 0
                    items:
                        #
                        # Treepanel with admins
                        #
                        -    xtype: filtertree
                             title: Admins
                             id: admin-tree
                             layout: fit
                             authLevel:
                                min: 200
                                max: 500
                             linkedGrid: customer-grid
                             loader: >
                                @new Ext.tree.TreeLoader({ 
                                    url: Fresh.Config.Service.Tree, 
                                    baseParams: { view: 'tree-users' } 
                                })
                             rootVisible: true
                             lines: false
                             autoScroll: true
                             autoHeight: false
                             selModel: @new Ext.tree.MultiSelectionModel()
                             root: >
                                @new Ext.tree.AsyncTreeNode({
                                    expanded: true,
                                    text: 'All users',
                                    iconCls: 'user-root'
                                })
                             tbar: 
                                -    @this.actions.reloadTree
                                -    @this.actions.expandTree
                                -    @this.actions.collapseTree
                             plugins: 
                                -    @new Ext.ux.Plugin.TreeSorter()
                                -    @new Ext.ux.Plugin.FormToButtons()
                        #
                        # Treepanel with filters
                        #
                        -    xtype: filtertree
                             title: Filters
                             id: tree-filters-customers
                             linkedGrid: customer-grid
                             layout: fit
                             loader: >
                                @new Ext.tree.TreeLoader({ 
                                    url: Fresh.Config.Service.Tree, 
                                    baseParams: { view: 'tree-filters-customers' } 
                                })
                             rootVisible: true
                             lines: false
                             selModel: @new Ext.tree.MultiSelectionModel()
                             autoScroll: true
                             autoHeight: false
                             root: >
                                @new Ext.tree.AsyncTreeNode({
                                    expanded: true,
                                    text: 'No filters',
                                    id: 'root',
                                    iconCls: 'user-root'
                                })
                             tbar: 
                                -    @this.actions.reloadTree
                                -    @this.actions.expandTree
                                -    @this.actions.collapseTree
                             sortConfig:
                                property: sortText
                                leafAttr: sortLeaf
                             plugins: 
                                -    @new Ext.ux.Plugin.FormToButtons()
                                -    @new Ext.ux.Plugin.TreeSorter()
                        #
                        # Search panel
                        #
                        -    title: Search
                             xtype: form
                             id: search-form
                             autoHeight: false
                             border: false 
                             autoWidth: true 
                             linkedGrid: customer-grid
                             buttonAlign: right
                             buttons:
                                -    @this.actions.search
                             plugins: 
                                -    @new Ext.ux.Plugin.FormToButtons()
                             items: 
                                -    xtype: panel
                                     frame: true
                                     layout: anchor
                                     anchor: "100% 100%"
                                     autoWidth: true
                                     bodyStyle: 
                                         padding: 5px 5px 0
                                     defaults: 
                                          autoHeight: true
                                          border: false 
                                     autoScroll: true
                                     items: 
                                      -    layout: form
                                           defaultType: textfield
                                           anchor: 100%
                                           items: 
                                            -    fieldLabel: CustNo
                                                 xtype: numberfield
                                                 name: CustNo
                                                 anchor: 95%
                                            -    fieldLabel: First Name 
                                                 name: NameFirst
                                                 anchor: 95%
                                            -    fieldLabel: Last Name 
                                                 name: NameLast
                                                 anchor: 95%
                                            -    fieldLabel: PostCode
                                                 name: PostCode
                                                 anchor: 95%
                                            -    fieldLabel: DealerNo
                                                 xtype: numberfield
                                                 name: DealerNo
                                                 anchor: 95%
                                            -    fieldLabel: Phone
                                                 name: Phone
                                                 anchor: 95%
           #
           #     end of west region
           #
      #
      #     Center panel splits to east with grid and center with tabpanel
      #
      #-    region:          center
      #     border:          false
      #     layout:          border
      #     margins:         0 0 0 0
      #     items:
        #
        #     Panel with grid with customers
        #
       -    title:        List of Customers
            region:       center
            elements:     body
            split:        true
            layout:      fit
            stateful: true
            items:
                  - xtype: tabpanel
                    deferredRender: false
                    layoutOnTabChange: true
                    activeTab: 0
                    items:
                        -    title:       Overview
                             xtype:    autogrid 
                             id:    customer-grid
                             loadMask: true
                             store:    customers-store
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
                             anchor:   100% 100%
                             bbar: "@new Ext.PagingToolbar(%gridPagingDef%)"
                             clicksToEdit: 1
                             linkedForm: customer-form
                             noStorePreload: false
                             tbar: 
                                 -    @this.actions.filterNoAction
                                 -    xtype: tbfill
                                 -    xtype: tbtext
                                      text: "<b>Reports:&nbsp;</b>"
                                 -    xtype: tbspacer
                                 -    text: Shopper
                                      iconCls: icon-xls
                                      url: @Fresh.Config.Service.Shopper
                                      handler: @this.actions.linkReportButtonHandler
                                 -    text: Driver Sheet
                                      iconCls: icon-xls
                                      url: @Fresh.Config.Service.DriverSheet
                                      handler: @this.actions.linkReportButtonHandler
                                 -    text: Packing Sheets
                                      iconCls: icon-doc
                                      url: @Fresh.Config.Service.PackingSheets
                                      handler: @this.actions.linkReportButtonHandler
                             listeners:
                                activate: >
                                        @function(c) {
                                             var customer = Ext.getCmp('customer-form-east-region');
                                             customer.expand();
                                        }
                             plugins:
                                 -    @new Ext.ux.Plugin.FormToButtons()
                                 -    @new Ext.ux.Plugin.FormLoader()
                                 -    @Fresh.global.customerRowExpander
                             buttonAlign: right
                             buttons: 
                                 -     @this.actions.saveGridTool
                                 -     @this.actions.cancelGridTool
                        -    title: Create Orders 
                             xtype:    autogrid 
                             id:       customer-create-orders-grid
                             layout: fit
                             loadMask: true
                             hideMode: display
                             border: true
                             autoWidth: true
                             stateful: false
                             autoScroll: true
                             autoHeight: false
                             clicksToEdit: 1
                             noStorePreload: true
                             frame: false
                             store: customers-store
                             stripeRows: true
                             listeners:
                                activate: >
                                        @function(c) {
                                             var customer = Ext.getCmp('customer-form-east-region');
                                             customer.collapse();
                                        }
                             viewConfig: 
                                     startCollapsed: false
                                     forceFit: true
                                     hideGroupedColumn: true
                                     groupTextTpl: "{text} ({[values.rs.length]})"
                                     autoFill: true
                             tbar: 
                                 -    @this.actions.filterNoAction
                                 -    xtype: tbfill
                                 -    xtype: tbtext
                                      text: "<b>Reports:&nbsp;</b>"
                                 -    xtype: tbspacer
                                 -    text: Shopper
                                      iconCls: icon-xls
                                      url: @Fresh.Config.Service.Shopper
                                      handler: @this.actions.linkReportButtonHandler
                                 -    text: Driver Sheet
                                      iconCls: icon-xls
                                      url: @Fresh.Config.Service.DriverSheet
                                      handler: @this.actions.linkReportButtonHandler
                                 -    text: Packing Sheets
                                      iconCls: icon-doc
                                      url: @Fresh.Config.Service.PackingSheets
                                      handler: @this.actions.linkReportButtonHandler
                                 -    xtype: tbspacer
                                 -    xtype: tbseparator
                                 -    xtype: tbtext
                                      text: "<b>Actions:&nbsp;</b>"
                                 -    xtype: tbspacer
                                 -    text: All plus
                                      iconCls: row-plus
                                      disabled: false
                                      handler: >
                                        @function(b,e) {
                                            var s = Ext.StoreMgr.get('customers-store');
                                            s.each(function(r) { Fresh.global.rowActionPlusC(null,r); });
                                            Ext.MessageBox.alert('Info','Orders created on this page.');
                                        }
                                 -    text: All minus
                                      iconCls: row-minus
                                      disabled: true
                                      handler: >
                                        @function(b,e) {
                                            var s = Ext.StoreMgr.get('customers-store');
                                            s.each(function(r) { Fresh.global.rowActionMinusC(null,r); });
                                            Ext.MessageBox.alert('Info','Payments substracted from Account Balance on this page.');
                                        }
                             bbar: >
                                @new Ext.PagingToolbar({
                                      pageSize:      20
                                      ,store:         'customers-store'
                                      ,displayInfo:   true
                                      ,displayMsg:    'Count {2}'
                                      ,emptyMsg:      'No customers to display' 
                                 })
                             plugins:
                                 -    @new Ext.ux.Plugin.FormToButtons()
                             buttonAlign: right
                             buttons: 
                                 -     @this.actions.saveGridTool
                                 -     @this.actions.cancelGridTool
        #
        # Tab panel with forms
        #
       -    title:      Customer
            region:     east
            id:         customer-form-east-region
            elements:     body
            margins:    0 0 0 0
            width:      @this.maxWidth(700,0.5)
            collapsible:  true
            split:      true
            layout:     fit
            items: 
                -  xtype:     form
                   border:     false
                   id: customer-form
                   url: ../../index.php?json=form
                   trackResetOnLoad: true
                   autoWidth: true
                   linkedGrid: preference-grid
                   focusOnNew: NameFirst
                   formBaseParams: 
                       view: customer-form-view
                   plugins:
                       -    @new Ext.ux.Plugin.FormToButtons()
                   items:
                     -   id: Details
                         xtype: tabpanel
                         anchor: 100% 100%
                         layoutOnTabChange: true
                         autoScroll: true
                         fitToFrame: true
                         deferredRender: false
                         autoHeight: false
                         autoWidth: true
                         defaults:
                              autoHeight: true
                              autoScroll: true
                              border: false
                              bodyBorder: false
                              frame: true
                              hideMode: offsets
                         activeTab: 0
                         frame: true
                         anchor: 100% 100%
                         resizeTabs: true
                         items: 
                              -  title: Profile
                                 autoWidth: true
                                 autoHeight: true
                                 hideMode: offsets
                                 border: true
                                 frame: true
                                 bodyStyle:
                                    padding: 5px 5px 5px 5px
                                 items:
                                  -  xtype: fieldset
                                     title: Contact information
                                     layout: column
                                     collapsible: true
                                     autoHeight: true
                                     defaults:
                                           layout: form
                                           border: false
                                           anchor: 100%
                                           defaultType: textfield
                                     items:
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                           items: 
                                                -    fieldLabel: Customer No
                                                     name: CustNo
                                                     readOnly: true
                                                -    fieldLabel: First Name
                                                     name: NameFirst
                                                     allowBlank: false
                                                     tabIndex: 1
                                                -    fieldLabel: Street
                                                     name: Street
                                                     tabIndex: 4
                                                -    fieldLabel: Town
                                                     hiddenName: Town
                                                     displayField: Town
                                                     valueField: Town
                                                     forceSelection: false
                                                     tabIndex: 5
                                                     id: town-field
                                                     xtype: ccombo
                                                     store: "@Ext.StoreMgr.lookup('coverage-store')"
                                                     tpl: >
                                                        <tpl for="."><div class="x-combo-list-item">{Town} / {PostCode}</div></tpl>
                                                     listeners:
                                                        select:
                                                            fn: >
                                                                @function(c,rec,i) {
                                                                    this.suspendEvents();
                                                                    Ext.getCmp('postcode-field').setValue(rec.get('PostCode'));
                                                                    this.resumeEvents();
                                                                }
                                                -    fieldLabel: Email
                                                     name: Email
                                                     vtype: email
                                                     tabIndex: 6
                                                -    fieldLabel: Phone
                                                     name: Phone
                                                     tabIndex: 7
                                                     allowBlank: false
                                                -    fieldLabel:  "- mobile"
                                                     name: PhoneMbl
                                                     tabIndex: 8
                                                -    fieldLabel:  "- work"
                                                     name: PhoneWrk
                                                     tabIndex: 9
                                                -    fieldLabel: Contact
                                                     hiddenName: Contact
                                                     xtype: ccombo
                                                     tabIndex: 10
                                                     value: 0
                                                     store: "@Ext.StoreMgr.lookup('contact-way-store')"
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                           items: 
                                                -    fieldLabel: Web No
                                                     name: CustNoWeb
                                                -    fieldLabel: Last Name
                                                     name: NameLast
                                                     tabIndex: 2
                                                     allowBlank: false
                                                -    fieldLabel: Street number
                                                     name: StreetNumber
                                                     tabIndex: 3
                                                     anchor: 70%
                                                -    fieldLabel: Post code
                                                     name: PostCode
                                                     id: postcode-field
                                                     listeners:
                                                        change:
                                                            fn: >
                                                                @function (c,val,oldVal) {
                                                                    this.suspendEvents();
                                                                    var s = Ext.StoreMgr.lookup('coverage-store');
                                                                    var i = s.find('PostCode',val);
                                                                    if (i>-1)
                                                                        var rec = s.getAt(i);
                                                                    if (rec && rec.get('PostCode') == val)
                                                                        Ext.getCmp('town-field').setValue(rec.get('Town'));
                                                                    this.resumeEvents();
                                                                }
                                                -    fieldLabel: Nearest cross
                                                     name: StreetNearestCross
                                                -    fieldLabel: Ranking
                                                     name: Ranking
                                                     xtype: numberfield
                                                -    fieldLabel: Dealer
                                                     hiddenName: DealerNo
                                                     emptyText: All 
                                                     xtype: ccombo
                                                     displayField: NameUid
                                                     hideTrigger: @(Fresh.User.Level < 200)
                                                     editable: @(Fresh.User.Level < 200)
                                                     store: "@Ext.StoreMgr.lookup('users-store')"
                                                -    fieldLabel: Contact Notes
                                                     name: NotesContact
                                                     tabIndex: 11
                                                     xtype: textarea
                                                     height: 50
                                  -    xtype: fieldset
                                       title: Notes
                                       labelAlign: top
                                       layout: form
                                       collapsible: true
                                       collapsed: true
                                       autoHeight: false
                                       frame: false
                                       height: 170
                                       listeners:
                                            afterlayout: 
                                                fn: >
                                                        @function (fs,ct) {
                                                                fs.expand();
                                                        }
                                                single: true
                                       items:
                                          -    name: OrderNotesDated
                                               hideLabel: true
                                               xtype: htmleditor
                                               height: 100
                                               autoHeight: false
                                               anchor: 100% 95%
                              -  title: "Payment&Delivery"
                                 autoWidth: true
                                 border: true
                                 frame: true
                                 bodyStyle:
                                    padding: 5px 5px 5px 5px
                                 layout: form
                                 items:
                                  -  xtype: fieldset
                                     title: Delivery information
                                     layout: column
                                     collapsible: true
                                     autoHeight: true
                                     defaults:
                                           layout: form
                                           border: false
                                           anchor: 100%
                                           defaultType: textfield
                                     items:
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                           items: 
                                                -    fieldLabel: Next Week Del.
                                                     name: OrderNextWeekDelivery
                                                     xtype: ux-radiogroup
                                                     horizontal: true
                                                     radios:
                                                        - value: 0
                                                          boxLabel: "no"
                                                        - value: 1
                                                          boxLabel: "yes"
                                                -    fieldLabel: Callback Required
                                                     name: CallBackRequired
                                                     xtype: ux-radiogroup
                                                     horizontal: true
                                                     radios:
                                                        - value: 0
                                                          boxLabel: "no"
                                                        - value: 1
                                                          boxLabel: "yes"
                                                -    fieldLabel: Delivery Issues
                                                     name: OrderDeliveryInstructions
                                                     xtype: textarea
                                                     height: 50
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                           items: 
                                                -    fieldLabel: Status
                                                     hiddenName: Status
                                                     xtype: ccombo
                                                     value: 1
                                                     store: "@Ext.StoreMgr.lookup('customer-status-store')"
                                                -    fieldLabel: FNCycle
                                                     name: NDDFNNo
                                                     xtype: ux-radiogroup
                                                     horizontal: true
                                                     radios:
                                                        - value: 1
                                                          boxLabel: "1"
                                                        - value: 2
                                                          boxLabel: "2"
                                                -    fieldLabel: Delivery Day
                                                     hiddenName: OrderDeliveryDay
                                                     xtype: ccombo
                                                     store: @Fresh.global.WeekDayStore
                                                -    fieldLabel: Box Size
                                                     hiddenName: BoxSize
                                                     valueField: Name
                                                     xtype: ccombo
                                                     store: "@Ext.StoreMgr.lookup('box-sizes-store')"
                                  -  xtype: fieldset
                                     title: Payment information
                                     layout: column
                                     collapsible: true
                                     autoHeight: true
                                     defaults:
                                           layout: form
                                           border: false
                                           anchor: 100%
                                           defaultType: textfield
                                     items:
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                                style:
                                                     text-align: right
                                           items: 
                                                -    fieldLabel: Extras
                                                     name: ExtrasCalc
                                                     readOnly: true
                                                     xtype: numberfield
                                                     plugins:
                                                        -   >
                                                            @new Fresh.plugin.fieldUpdate({
                                                                store: Ext.StoreMgr.lookup('customer-preferences-store'),
                                                                fn: function(record){
                                                                        this.newVal += (record.get('Qty'))*(record.get('Price'));
                                                                }
                                                            })
                                                     listeners:
                                                        change:
                                                            fn: >
                                                                @function (c,val,oldVal) {
                                                                    var bt = c.findParentByType('fieldset').find('hiddenName','BoxType');
                                                                    var btVal = bt[0].getValue();
                                                                    var bc = c.findParentByType('fieldset').find('name','BoxCharge');
                                                                    var bcVal = bt[0].getValue();
                                                                    if (btVal=='wholesale') {
                                                                        bc[0].readOnly = false;
                                                                    }
                                                                    else {
                                                                        bc[0].setValue(parseFloat(val)+parseFloat(btVal));
                                                                        bc[0].readOnly = true;
                                                                        bc[0].fireEvent('change',bc[0],bc[0].getValue(),bcVal);
                                                                    }
                                                                }
                                                -    fieldLabel: Box Charge
                                                     name: BoxCharge
                                                     xtype: numberfield
                                                     allowBlank: false 
                                                     listeners:
                                                        change:
                                                            fn: >
                                                                @function (c,val,oldVal) {
                                                                    var di = c.ownerCt.find('name','Discount');
                                                                    var cr = c.ownerCt.find('name','CreditCalc');
                                                                    var it = c.ownerCt.find('name','InvoiceTotalCalc');
                                                                    it[0].setValue(val-di[0].getValue());
                                                                }
                                                -    fieldLabel: Discount
                                                     name: Discount
                                                     xtype: numberfield
                                                     value: 0
                                                     listeners:
                                                        change:
                                                            fn: >
                                                                @function (c,val,oldVal) {
                                                                    var bc = c.ownerCt.find('name','BoxCharge');
                                                                    var cr = c.ownerCt.find('name','CreditCalc');
                                                                    var it = c.ownerCt.find('name','InvoiceTotalCalc');
                                                                    it[0].setValue(bc[0].getValue()-val);
                                                                }
                                                -    fieldLabel: Invoice Total
                                                     name: InvoiceTotalCalc
                                                     xtype: numberfield
                                                     readOnly: true
                                                -    fieldLabel: Account Balance
                                                     name: AccountBalance
                                                     value: 0
                                                     readOnly: true
                                                     xtype: credit
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                           items: 
                                                -    fieldLabel: Box Type
                                                     hiddenName: BoxType
                                                     valueField: Name
                                                     xtype: ccombo
                                                     store: "@Ext.StoreMgr.lookup('box-types-store')"
                                                     listeners:
                                                        select:
                                                            fn: >
                                                                @function (c,r,i) {
                                                                    var val = c.getValue();
                                                                    var ex = c.findParentByType('fieldset').find('name','ExtrasCalc');
                                                                    var bc = c.findParentByType('fieldset').find('name','BoxCharge');
                                                                    var bcVal = bc[0].getValue();
                                                                    if (val=='wholesale') {
                                                                        bc[0].readOnly = false;
                                                                        bc[0].focus(true,100);
                                                                        Fresh.Msg.SlideBox('Alert!','Box Charge must be set manually');
                                                                    }
                                                                    else {
                                                                        bc[0].setValue(ex[0].getValue()+parseFloat(val));
                                                                        bc[0].readOnly = true;
                                                                        bc[0].fireEvent('change',bc[0],bc[0].getValue(),bcVal);
                                                                    }
                                                                }
                                                -    fieldLabel: Payment Type
                                                     hiddenName: PaymentType
                                                     xtype: ccombo
                                                     value: 1
                                                     store: "@Ext.StoreMgr.lookup('payment-types-store')"
                                                -    fieldLabel: Payment Loc.
                                                     hiddenName: PaymentLocation
                                                     xtype: ccombo
                                                     valueField: Name
                                                     forceSelection: false
                                                     store: "@Ext.StoreMgr.lookup('money-locations-store')"
                                                -    fieldLabel: Date of Debt
                                                     name: DateOfDebt
                                                     xtype: xdatefield
                                                     submitFormat: U
                                                -    fieldLabel: Driver Run
                                                     name: DriverRun
                                                     xtype: numberspinner
                                                     strategyConfig: 
                                                        minValue: 1
                                                        maxValue: 9
                              #
                              #     Preferences
                              #
                              -  title: Preferences
                                 hideMode: offsets
                                 id: pref-border-lay
                                 listeners:
                                         activate:
                                            fn: >
                                                @function(pa) {
                                                    var p = Ext.getCmp('preference-grid');
                                                    if (p.customerChanged && p.store.baseParams.filter) {
                                                        p.store.load({params: {meta: true},callback: function(){}});
                                                        p.customerChanged = false;
                                                    }
                                                }
                                 layout: fit
                                 border: false
                                 frame: true
                                 autoHeight: false
                                 items:
                                   -   layout: border
                                       labelAlign: top
                                       tbar: 
                                            - text: Misc Extras
                                              xtype: tbtext
                                       defaults:
                                              layout: fit
                                              border: false
                                              frame: false
                                              hideMode: offsets
                                              autoWidth: false
                                              autoHeight: false
                                              labelAlign: top
                                       items:
                                              -    height: 100
                                                   region: north
                                                   title: Misc Extras
                                                   labelAlign: top
                                                   xtype: textarea
                                                   fieldLabel: Misc Extras
                                                   name: MiscExtras
                                                   anchor: 100% 18%
                                                   frame: true
                                              -    xtype:    autogrid 
                                                   id:       preference-grid
                                                   anchor: 100% 78%
                                                   region: center
                                                   loadMask: true
                                                   stateful: false
                                                   autoScroll: true
                                                   margins: 5 0 0 0
                                                   clicksToEdit:1
                                                   noStorePreload: true
                                                   frame: false
                                                   store: customer-preferences-store
                                                   stripeRows: true
                                                   view:     "@new Ext.grid.GroupingView(%prefGroupingViewDef%)"
                                                   viewConfig: 
                                                         startCollapsed: true
                                                         forceFit: true
                                                         hideGroupedColumn: true
                                                         groupTextTpl: "{text} ({[values.rs.length]})"
                                                         autoFill: true
                              -  title: Special
                                 autoWidth: true
                                 border: true
                                 frame: true
                                 bodyStyle:
                                    padding: 5px 5px 5px 5px
                                 layout: column
                                 defaults:
                                       layout: form
                                       labelAlign: top
                                       border: false
                                       anchor: 100%
                                       defaultType: textfield
                                 items:
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                           items: 
                                                -    fieldLabel: How the customer heard about us?
                                                     hiddenName: HeardOf
                                                     emptyText: None
                                                     valueField: Name
                                                     xtype: ccombo
                                                     store: "@Ext.StoreMgr.lookup('customer-heards-store')"
                                                -    fieldLabel: Actions
                                                     name: Actions
                                                     xtype: cmultiselect
                                                     store: "@Ext.StoreMgr.lookup('actions-store')"
                                                -    fieldLabel: 1st Delivery
                                                     name: DateOfFirstDelivery
                                                     xtype: xdatefield
                                                     readOnly: yes
                                                     submitFormat: U
                                                     hideTrigger: true
                                                -    fieldLabel: 2nd Delivery
                                                     name: DateOfSecondDelivery
                                                     xtype: xdatefield
                                                     readOnly: yes
                                                     submitFormat: U
                                                     hideTrigger: true
                                                -    fieldLabel: 3rd Delivery
                                                     name: DateOfThirdDelivery
                                                     xtype: xdatefield
                                                     readOnly: yes
                                                     submitFormat: U
                                                     hideTrigger: true
                                      -    columnWidth: 0.5
                                           defaults:
                                                anchor: 95%
                                           items: 
                                                -    fieldLabel: Fundraising Event
                                                     hiddenName: Fundraiser
                                                     emptyText: None
                                                     valueField: Name
                                                     xtype: ccombo
                                                     store: "@Ext.StoreMgr.lookup('fundraisers-store')"
                                                -    fieldLabel: Complaints
                                                     name: Complaints
                                                     xtype: cmultiselect
                                                     store: "@Ext.StoreMgr.lookup('complaints-store')"
                   buttonAlign: right
                   buttons: 
                     -     @this.actions.save
                     -     @this.actions.cancel
references:
    prefGridStore:
          url: ../../index.php?json=view
          root: rows
          reader: "@new Ext.data.JsonReader()"
          baseParams: 
             view: grid-list-of-prefs
          remoteSort: false
    gridPagingDef:
          pageSize:      20
          store:         customers-store
          displayInfo:   true
          displayMsg:    "Count {2}"
          autoShow:      true
          emptyMsg:      No customers to display
    filterRootDef:
          text:         No filter
          expanded:     true
          children: 
               -   text: Shared
                   expanded: true
                   children: 
                         -  text: Payment not resolveds
                            iconCls: icon-action
                            leaf: true
                         -  text: To be called
                            iconCls: icon-action
                            leaf: true
                         -  text: Complaints
                            iconCls: icon-action
                            leaf: true
               -   text:     My filters
                   expanded:     true
                   children: 
                         -   text: All from Sydney fundraise
                             iconCls: icon-action
                             leaf: true
                         -   text: All from TV fundraise
                             iconCls: icon-action
                             leaf: true
    adminRootDef:
          text: All admins
          expanded: true
          children:
               -   text: Admins
                   expanded: true
                   children: 
                        -   text: Bernie Segal
                            iconCls: user
                            leaf: true
                       -    text: Brian Adams
                            iconCls: user
                            leaf: true
                      -     text: Jon Keneth
                            iconCls: user
                            leaf: true
               -   text: SuperAdmins
                   expanded:  true
                   children: 
                        -   text: Mr. Super
                            iconCls: user
                            leaf: true
                        -   text: Mrs. Superee
                            iconCls: user
                            leaf: true
                            
    prefGroupingViewDef:
         startCollapsed: true
         forceFit: true
         hideGroupedColumn: true
         groupTextTpl: "{text} ({[values.rs.length]})"
         enableNoGroups: true
         autoFill: true

spare: 
    