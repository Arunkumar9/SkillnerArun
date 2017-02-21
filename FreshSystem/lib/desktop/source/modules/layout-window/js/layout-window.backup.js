MyDesktop.LayoutWindow = Ext.extend(Ext.app.Module, {
	id : 'customer-win',
	
	init : function(){
		this.launcher = {
			text: 'CRM Customers',
			iconCls:'icon-crm-customer',
			handler : this.createWindow,
			scope: this
		}
	},

	createWindow : function(){
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('customer-win');
 // create the Data Store
    var mystore = new Ext.data.Store({
        // load using script tags for cross domain, if the data in on the same domain as
        // this page, an HttpProxy would be better
        proxy: new Ext.data.HttpProxy({
            url: 'source/modules/layout-window/customers-list.php',
			method: 'GET'
        }),

        // create reader that reads the Topic records
        reader: new Ext.data.JsonReader({
            root: 'customers',
            totalProperty: 'totalCount',
            id: 'custno',
            fields: [
	           'custno','name','phone'
            ]
        }),

        // turn on remote sorting
        remoteSort: true
    });
    mystore.setDefaultSort('name', 'asc');			
		if(!win){
			var winWidth = desktop.getWinWidth() / 1.1;
			var winHeight = desktop.getWinHeight() / 1.1;
			win = desktop.createWindow({
				id: 'customer-win',
				title:'CRM Customers',
				width:winWidth,
				height:winHeight,
				x:desktop.getWinX(winWidth),
				y:desktop.getWinY(winHeight),
				iconCls: 'icon-crm-customer',
				shim:true,
				animCollapse:false,
				constrainHeader:true,
				minimizable:true,
    			maximizable:true,

				layout: 'border',
				tbar:[{
					text: 'Exit', iconCls: 'icon-exit'
				},{
					text: 'New preference', iconCls: 'icon-action'
				},{
					text: 'New action', iconCls: 'icon-action'
				},{
					text: 'New fundraiser event', iconCls: 'icon-action'
				},{
					text: 'New complaint', iconCls: 'icon-action'
				}],
				//border: false,
				//defaults: {border: false},
				items:[{
					region:'west',
					autoScroll:true,
					collapsible:true,
					layout: 'fit',
					cmargins:'0 0 0 0',
					margins:'0 0 0 0',
					split:true,
					title:'Filter & Admins',
					width:parseFloat(winWidth*0.3) < 201 ? parseFloat(winWidth*0.3) : 200,
					items:[{
						autoScroll: true,
						elements: 'body',
						id: 'FilterAdmins',
						xtype: 'tabpanel',
						layoutOnTabChange:true,					
						anchor: '100%',
						activeTab: 0,
						items: [ new Ext.tree.TreePanel({
	                        id:'im-tree',
							layout: 'fit',
							title: 'By admin',
	                        loader: new Ext.tree.TreeLoader(),
	                        rootVisible:true,
	                        lines:false,
	                        autoScroll:true,
							autoHeight: false,
	                        root: new Ext.tree.AsyncTreeNode({
	                            text:'All Users',
	                            expanded:true,
	                            children:[{
	                                text:'Admins',
	                                expanded:true,
	                                children:[{
	                                    text:'Bernie Segal',
	                                    iconCls:'user',
	                                    leaf:true
	                                },{
	                                    text:'Brian Adams',
	                                    iconCls:'user',
	                                    leaf:true
	                                },{
	                                    text:'Jon Keneth',
	                                    iconCls:'user',
	                                    leaf:true
	                                },{
	                                    text:'Adam Mesh',
	                                    iconCls:'user',
	                                    leaf:true
	                                },{
	                                    text:'Nigel Gwyn',
	                                    iconCls:'user',
	                                    leaf:true
	                                },{
	                                    text:'Fred Sam',
	                                    iconCls:'user',
	                                    leaf:true
	                                },{
	                                    text:'Bob Mulder',
	                                    iconCls:'user',
	                                    leaf:true
	                                }]
	                            },{
	                                text:'SuperAdmins',
	                                expanded:true,
	                                children:[{
	                                    text:'Mr. Super',
	                                    iconCls:'user',
	                                    leaf:true
	                                },{
	                                    text:'Mrs. Superee',
	                                    iconCls:'user',
	                                    leaf:true
	                                }]
	                            }]
	                        })
	                    }),new Ext.tree.TreePanel({
	                        id:'fi-tree',
							layout: 'fit',
							title: 'By filter',
	                        loader: new Ext.tree.TreeLoader(),
	                        rootVisible:true,
	                        lines:false,
	                        autoScroll:true,
							autoHeight: false,
	                        root: new Ext.tree.AsyncTreeNode({
	                            text:'No filter',
	                            expanded:true,
	                            children:[{
	                                text:'Shared',
	                                expanded:true,
	                                children:[{
	                                    text:'Payment not resolved',
	                                    iconCls:'icon-action',
	                                    leaf:true
	                                },{
	                                    text:'To be called',
	                                    iconCls:'icon-action',
	                                    leaf:true
	                                },{
	                                    text:'Complaints',
	                                    iconCls:'icon-action',
	                                    leaf:true
	                                }]
	                            },{
	                                text:'My filters',
	                                expanded:true,
	                                children:[{
	                                    text:'All from Sydney fundraise',
	                                    iconCls:'icon-action',
	                                    leaf:true
	                                },{
	                                    text:'All from TV fundraise',
	                                    iconCls:'icon-action',
	                                    leaf:true
	                                }]
	                            }]
	                        })
	                    })
						//,{
						//	xtype: "panel",
						//	title: "Filters1"
						//}
						] //end of tabpanel
								}]					

				},{
					region:'center',
					border:false,
					layout:'border',
					margins:'0 0 0 0',
					items:[{
						region:'west',
						elements:'body',
						title:'List of Customers',
						width:parseFloat(winWidth*0.3) < 311 ? parseFloat(winWidth*0.3) : 310,
						split:true,
				        layout:'fit',
						collapsible: true,
						items: new Ext.grid.GridPanel({ 
        					loadMask: true,
							columns: [
					            {header: "CustNo", width: 75, sortable: true, dataIndex: 'custno',align: 'right'},
					            {header: "Name", width: 120, sortable: true, dataIndex: 'name'},
					            {header: "Phone", width: 80, sortable: true, dataIndex: 'phone'}
					        ],
							store: mystore,
					        stripeRows: true,
							viewConfig: {
						        forceFit: true
						    },
							//height: 400
					        anchor:'100% 100%'

							,bbar: new Ext.PagingToolbar({
							            pageSize: 20,
							            store: mystore,
							           displayInfo: true,
							            displayMsg: 'Count: {2}',
							            emptyMsg: "No customers to display"
							        })							


						})						
					},{
					region:'center',
					border:false,
					margins:'0 0 0 0',
					layout: 'fit',
					title: 'Customer',
					border: false,
					items: [{
						xtype: 'form',
						border: false,
					items: [{
						autoScroll: true,
						elements: 'body',
						id: 'Details',
						xtype: 'tabpanel',
						anchor: '100%',
			            defaults:{autoHeight:true,border: false }, 
//						deferredRender:false,
						layoutOnTabChange:true,					
						border: false,
						activeTab: 0,
						items: [{
							labelAlign: 'left',
							title: 'Profile',
							labelWidth: 70,
							bodyStyle: 'padding:5px 5px 0',
							xtype: 'panel',
//							layout: 'anchor',
							frame: true,
							autoWidth: true,
							items: [{
								layout: 'column',
								anchor: '100%',
								items: [{
									columnWidth: 0.5,
									layout: 'form',
									defaultType: 'textfield',
									anchor: '100%',
									items: [{
										fieldLabel: 'CustNo',
										name: 'custno',
										anchor: '95%'
									}, {
										fieldLabel: 'WebCustID',
										name: 'custnoWeb',
										anchor: '95%'
									}, {
										fieldLabel: 'Date of Debt',
										name: 'dateofdebt',
										xtype: 'datefield',
										anchor: '95%'
									}]
								}, {
									columnWidth: 0.5,
									layout: 'form',
									defaultType: 'textfield',
									anchor: '100%',
									items: [{
										fieldLabel: 'First Name',
										name: 'first',
										anchor: '95%'
									}, {
										fieldLabel: 'Last Name',
										name: 'last',
										anchor: '95%'
									}, {
										fieldLabel: 'Street',
										name: 'last',
										anchor: '95%'
									}, {
										fieldLabel: 'Email',
										name: 'email',
										vtype: 'email',
										anchor: '95%'
									}]
								}]
							}]
						}, {
							xtype: "panel",
							title: "Preferences"
						}, {
							xtype: 'panel',
///							layout: 'form',
							title: "Special",
							frame: true,
							items: [{
								labelAlign: 'left',
								layout: 'form',
								autoScroll: true,
								anchor: '100% 100%',
								bodyStyle: 'padding:5px 5px 0',
								labelWidth: 300,
								defaultType: 'textfield',
								items: [{
										fieldLabel: 'How the customer heard about us?',
										xtype: 'combo',
										displayField: 'where',
										store: specialStore,
								        mode: 'local',
								        triggerAction: 'all',
								        emptyText:'Select where ...',
										anchor: '95%'
									}, {
										fieldLabel: 'Fundraising Event',
										xtype: 'combo',
										displayField: 'funraise',
								        mode: 'local',
								        triggerAction: 'all',
								        emptyText:'none',
										store: specialStore,
										anchor: '95%'
									}, {
										fieldLabel: 'Complaints',
										displayField: 'complaint',
										store: specialStore,
								        mode: 'local',
								        triggerAction: 'all',
										xtype: 'multiselect',
										anchor: '95%'
									}, {
										fieldLabel: 'Action',
										displayField: 'action',
										store: specialStore,
								        mode: 'local',
								        triggerAction: 'all',
										xtype: 'multiselect',
										anchor: '95%'
									}]
								}]
								
						}, {
							xtype: "panel",
							title: "Notes",
//							layout: 'fit',
							frame: true,
							items: [{
								labelAlign: 'top',
								layout: 'form',
								autoScroll: true,
								anchor: '100% 100%',
								bodyStyle: 'padding:5px 5px 0',
								items: [{
										fieldLabel: 'Notes that should be remebered',
										name: 'notes',
										xtype: 'htmleditor',
										anchor: '95% b'
									}]
								}]
						}, {
							xtype: "panel",
							title: "Search"
						}] }],
							buttonAlign: 'right',
							buttons: [{
								text: ' << '
							}, {
								text: 'Save'
							}, {
								text: 'Cancel'
							}, {
								text: ' >> '
							}]
					}]
					  }]
				}]
			});
		};
	    mystore.load({params:{start:0, limit:20}});

		win.show();
	}
});

/*
var myData = [
        ['1','Peter Pan','666 777 888'],
        ['2','Peter Pan','666 777 888'],
        ['3','Peter Pan','666 777 888'],
        ['4','Peter Pan','666 777 888'],
        ['5','Peter Pan','666 777 888'],
        ['6','Peter Pan','666 777 888']
		];

// create the data store
    var store = new Ext.data.SimpleStore({
        fields: [
           {name: 'custno'},
           {name: 'name'},
           {name: 'phone'}
        ]
    });		
*/
   
   // trigger the data store load
		
//    store.loadData(myData);
    // simple array store
	var myData = [
	['internet','Sydney','was late','call urgent'],
	['press','Opera','bad selection','sms now'],
	['friend','TV','wrong box','stop delivery']
	];
    var specialStore = new Ext.data.SimpleStore({
        fields: ['where', 'funraise', 'complaint','action'],
        data : myData
    });
	
