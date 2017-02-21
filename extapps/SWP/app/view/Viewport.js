/**
 * Task/Issue      Author         UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23820          kanchan.singh  201310271256    added listeners to get resize event
 */

Ext.define('SWP.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'SWP.view.chapters.List',
        'SWP.view.comments.Grid',
        'SWP.view.comments.CommentsGridToolBar',
        'SWP.view.player.SWPPlayer',
        'Ext.layout.container.Border',
        'SWP.view.statusbar.StatusBar',
        // 'SWPCommon.theme.Light',
        // 'SWPCommon.theme.Dark'
    ],

	layout: 'border',
	id: 'mainViewPort',
    iconCls: 'icon-video',
    listeners: {
		resize: function() {
			var screenCssPixelRatio = (window.outerWidth - 8) / window.innerWidth;
			var chartHeight = 350;
			if(Ext.isIE) {
				screenCssPixelRatio = screen.deviceXDPI / screen.logicalXDPI;
				if(screenCssPixelRatio > 1)
					chartHeight = screenCssPixelRatio*110;
				else 
					chartHeight = 350;
			} else if(Ext.firefoxVersion > 0) {		
				if(screenCssPixelRatio >= 0.994)
					chartHeight = 350;
				else 
					chartHeight = screenCssPixelRatio*155;
			} else {
				if(screenCssPixelRatio > 1)
					chartHeight = screenCssPixelRatio*110;
				else 
					chartHeight = 350;
			}
			
			this.quizScroreHeight = chartHeight;
			if(screenCssPixelRatio)
			
			if(typeof(Ext.getCmp('quizscorereport')) !== 'undefined')
			{
				
//				
//				return ;
//				if(Ext.isIE) {					
//					if(screenCssPixelRatio > 1)
//						Ext.getCmp('quizscorereport').setHeight(430-(chartHeight));
//					else
//						Ext.getCmp('quizscorereport').setHeight(430);
//				}
//				else if(Ext.firefoxVersion > 0) {
//					if(screenCssPixelRatio >= 0.994)						
//						Ext.getCmp('quizscorereport').setHeight(430);
//					else
//						Ext.getCmp('quizscorereport').setHeight(430-(chartHeight));
//				}
//				else {
//					if(screenCssPixelRatio > 1)
//						Ext.getCmp('quizscorereport').setHeight(430-(chartHeight));
//					else
//						Ext.getCmp('quizscorereport').setHeight(400);
//				}
				
			}
		}
    },
	items: [
		{
			region:'center',
			xtype:'container',
			layout:'border',
			items:[
				
				
				{
					region: 'center',
					xtype: 'panel',
					cls:'center-region-cls',
					margin:'0 0 5 0',
					layout: 'card',
					autoScroll: false,
					flexCroll: false,
					items: [{
						id: 'center-splash'
			//			bodyStyle: 'background-image: url(/images/logoSW1.png); background-attachment: initial; background-origin: initial; background-clip: initial; background-color: initial;  background-position: center; background-repeat: no-repeat;'
					}, {
						xtype: 'swpplayer',
						flexCroll: false,
						smilUrl: ''
					}, {
						xtype: 'panel',
						layout: 'fit',
						autoDestroy:false,flexCroll: false,
						id: 'quizImg'
					}]
				}, {
					region: 'west',
					width: '18%',
			//		split:false,
					xtype: 'chapterslist',
					name:'chaptersgrid'
				}, {
					region: 'east',
					width: '32%',
					collapsible:true,
					collapsed:true,
			//		split:false,
					xtype: 'quiz',
					name:'quizpanel'
				},{
				    region: 'south',
					height: 40,
					xtype: 'commentsgridtoolbar'
				 
				}
				
				
				
			]
		},{
			region: 'south',
			height: 170,
			xtype: 'commentsgrid'
		},
		 {
			region: 'south',
			height: 20,
			xtype: 'statusbar',
			id: 'base-statusbar',
			// defaults to use when the status is cleared:
			defaultText: '',
		    
			// values to set initially:
			text: 'Ready',
			iconCls: 'x-status-valid'
		}
	]
});
