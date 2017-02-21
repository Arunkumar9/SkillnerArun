/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23192          Dinesh GK    		20131114210      Extra commas is removed.
 *
 *  23577 		   Venkatesh Teja	    201311191500	 One Css class added for Zoom component container to remove background color for Zoom icons in the IE.
 *  23873 		   Dinesh GK		    20131130115	 	 Modification done for the heatmap width.
 **/
Ext.define('SWP.view.reports.HeatMapCard',{
			extend:'Ext.panel.Panel',
			alias:'widget.heatmapcard',
			config:{
				title:'Heat Map Report'
			},
			initComponent:function(){

				var me = this;
				
				var scrollStyle = {overflow: 'auto', overflowY: 'hidden' };
				
				me.heatMapslider = Ext.create('Ext.slider.Single', {
		    animate: false,
		    flex:5,
		    value: 0,
		    increment: 10,
		    minValue: 0,
		    maxValue: 100,
//		    style:{
//		    	'margin': '5px 0px'
//		    },
		    listeners: {
		    	beforechange: function(slider, newValue, oldValue, eOpts) {
		    	
					var chartId = me.down('heatmapreport'),dif = 0,scrollX=0,
					 heatMapsReport = me.down('container[name=heatmapcontainer]');
					var heatMapReport = me.down('heatmapreport');
					if( newValue == 0 ){
						
						chartId.setWidth( chartId.actualWidth );
						// chartId.setHeight( chartId.actualHeight );
						// chartId.suspendLayouts();
						// chartId.updateView();
						chartId.refreshView();
						heatMapsReport.getEl().setScrollLeft( 0 );
						// chartId.resumeLayouts();
					}else{
						var newWidth =  ( (chartId.actualWidth * newValue/10)) *2  ;
						var newHeight = ( (chartId.actualHeight *newValue/10) ) * 2;
						chartId.setWidth( newWidth );
						// chartId.setHeight( newHeight);
						chartId.refreshView();
						// chartId.updateView();
						
						heatMapsReport.getEl().setScrollLeft( (heatMapsReport.getEl().dom.scrollWidth-heatMapsReport.getEl().dom.clientWidth)/2);
						

						
						
						
					}
				}
			}
		});

				Ext.apply(me,{
				name:'heatmapsreport',
				flexCroll:false,
//				layout: 'fit',
				dockedItems:[{
								xtype: 'fieldcontainer',
								cls : 'zoomingContainer',
								dock:'top',
								layout: 'hbox',
									items:[{
										xtype:'button',
										cls:'zoomout-btn',
										text:'_',
										width : 27,
								    	height : 25,
										handler: function() {me.heatMapslider.setValue(me.heatMapslider.getValue() - 10);} //20131114210
									},me.heatMapslider,{
										xtype:'button',
										text:'+',
										width : 28,
							    	    height : 26,
							    	    cls:'zoomin-btn',
										handler: function() {me.heatMapslider.setValue(me.heatMapslider.getValue() + 10);} //20131114210
									},{
									   xtype:'button',
							    	   width : 28,
							    	   height : 26,
							    	   iconCls:'reload-item',
							    	   tooltip : MESSAGEDETAILS.REFRESH_TOOLTIP,
							    	   handler:function() {
							    		   me.fireEvent('heatmapsrefresh', me);
							    	   }
									}]
				}],
				items:[{
					xtype:'container',
					name : 'heatmapcontainer',
					autoScroll: true,
					flexCroll:false,
//					style: scrollStyle,
//					layout:'fit',
					items:[{
								xtype:'heatmapreport',
//								autoScroll:false,
								palette:HEAT_MAP_COLOR_PALETTE,
								height:100,
								style:{
									'margin-right':'30px !important',
									'margin-bottom':'30px !important'//20131130115
								},
								store:Ext.create('SWP.store.HitMapBlockField',{autoLoad:false}) //20131114210
								
						  }]
				}]
			
				});

				me.callParent( arguments );

			}
});