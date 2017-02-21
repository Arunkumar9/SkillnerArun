Ext.define('SWP.view.movie.View', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.moviesview',

    requires: ['Ext.toolbar.Toolbar'],

	title: 'Movies',
	collapsible: false,
	collapsed: false,
	closable: true,
	draggable: false,
	modal: true,
	floating: true,
	width: 500,
	height: 400,
	hideMode: 'offsets',
	shadow:  'drop',
	animCollapse:1000,
	margins: '5 5 5 5',
	layout: 'fit',
	
	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'dataview',
				trackOver: true,
				id: 'images-view',
				store: Ext.create('SWP.store.Movies'),
				cls: 'feed-list',
				autoScroll: true,
				emptyText: 'No images available',
				itemSelector: '.thumb-wrap',
				overItemCls: 'thumb-wrap-hover',
				tpl: new Ext.XTemplate( '<tpl for=".">',
											'<div class="thumb-wrap" id="{uid}">',
											'<div class="thumb" style="text-align: center">',
											'<tpl if="extension.match(/png|gif|jpg$/im)" ><img src="{web_path}.120x240" title="{name}" style="width: 128px" /></tpl>',
											'<tpl if="!extension.match(/png|gif|jpg$/im)" ><img src="images/{extension}.png" title="{name}" style="width: 128px" /></tpl>',
											'</div>',
											'<span class="x-editable">{name}</span></div>',
										'</tpl>',
										'<div class="x-clear"></div>'
									   ),
				xlisteners: {
				    selectionchange: this.onSelectionChange,
				    scope: this
				}
				
			}] 
		});

		this.callParent(arguments);
		this.on('beforeclose',function(c) { c.slideOut(); return false;})
	},
	
	slideIn: function(elem) {
		
		this.hide();
		this.getEl().alignTo(elem,'t-t');
		this.getEl().slideIn('t');
		
		
	},
	slideOut: function() {
		
		this.getEl().slideOut('t');
		
		
	}
});
