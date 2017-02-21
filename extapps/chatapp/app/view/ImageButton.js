/**
 * 
 */

Ext.define('CHAT.view.ImageButton', {
	extend: 'Ext.container.Container', 
	alias: 'widget.imagebutton',
	
	renderTpl:'<div class="x-wtc-link-btn-div {cls}"><img id:"{id}-imgEl" border="0" data-qtip="{toolTip}" data-anchor="top" data-qclass="seek-qtip" src=\"'+Ext.BLANK_IMAGE_URL+'\" class = "x-wtc-link-btn {iconCls}"/> </div>',
	config: {
		iconCls: '',toolTip:'', handler: Ext.emptyFn}, 
		cls:'',
		childEl:['imgEl'],
	initComponent: function () {
		var me = this; me.callParent(arguments); 
		this.renderData = { iconCls: this.getIconCls(),
				toolTip: this.getToolTip()}; 
		var handler = me.getHandler(); 
	}, 
	afterRender:function(){ 
		var me = this; 
		this.el.addCls('x-wtc-img-btn');
		this.el.on('click', me.getHandler(),me,this);
		this.el.on('mouseover', me.mouseOver,me);
		this.el.on('mouseout', me.mouseOut,me);
	} ,
	mouseOver :function(obj,el){
		this.el.addCls( 'x-wtc-link-btn-over');
	},
	mouseOut :function(obj,el){
		this.el.removeCls('x-wtc-link-btn-over');
	}
});