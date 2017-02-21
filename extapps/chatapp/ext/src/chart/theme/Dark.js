Ext.define('Ext.chart.theme.Dark', {
	extend: 'Ext.chart.theme.Base',
	config : {
	highlight:{
				colorCode : '#5a5a5a'
			}

	},
	constructor: function(config) {
		
		var themeColor = "black";
		var baseColor = labelColor = strokecolor = themeColor;
		// var titleColor='#444444';
	
		this.callParent([Ext.apply({
			axis: {
				fill: '#a7a7a7',
				stroke: '#a7a7a7'
			},
			axisLabelLeft: {
				fill: '#6e6e6e'
			},
			
			axisTitleLeft: {
				fill: '#444444'
			},
			axisTitleBottom: {
				fill: '#444444'
			},
			
			colors:['#808080'],
			
			
		}, config)]);
	}
});
