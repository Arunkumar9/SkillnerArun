/**
 * Task/Issue      Author    		UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  25940		Dinesh GK			201403030720	Browser taking too much memory for run the script which switching between chapters fast without any interval.
 *  26032       Arunkumar.muddada   201403121556    onError:
 *                                                      added code to mask the course content panel	
 *  26032       Dinesh GK   		201404230540    code modification is done for IE11 browser compatibility issues.
 *  28090       Arunkumar.muddada   201405280522    Modified : Dock2 plugin left and top positions according this modification the player Next & replay button position is fixed to the Right bottom corner of the player.
 *  28044       Arunkumar.muddada   201406110909    Added a new Doc Doc3 												    
 */

Ext.define('SWP.view.player.Flowplayer', {
    extend: 'Ext.flash.Component',
    alias: 'widget.flowplayer',
    
    url: "flowplayer/flowplayer-3.2.16.swf",
    smilUrl: undefined,
    store: undefined,
    queryByFn: Ext.emptyFn,
    timeField: undefined,
    fp: undefined,
    registeredCuepoints : false,
    nextChapterTooltip:SWPPLAYER.NEXT,
    previousChapterTooltip:SWPPLAYER.REPLAY,
    skipChapterTooltip:SWPPLAYER.SKIP,
    tooltipTextColor:'#ff0000',
    tooltipColor:'#ffffff',
    initComponent: function() {
    	var me = this;
    	swfobject = flowplayer;
    	
        if (Ext.isEmpty(flowplayer)) {
            Ext.Error.raise('Flowplayer is required');
        }
        
        if (Ext.isEmpty(this.url)) {
            Ext.Error.raise('The "url" config is required for Ext.flash.Component');
        }
               
        this.callParent(arguments);
        this.addEvents(
            /**
             * @event success
             * Fired when the Flash movie has been successfully embedded
             * @param {Ext.flash.Component} this
             */
            'success',

            /**
             * @event failure
             * Fired when the Flash movie embedding fails
             * @param {Ext.flash.Component} this
             */
            'failure',
            'start'
        );
    },
    afterRender: function() {
    	//This code is copied from the Ext.flash.Component as direct calling of the callParent() does
    	//not give the desired result as it works with the swfObject whereas we are using the Flowplayer swfobject
    	 var me = this,
         params, vars, undef,
         swfId = me.getSwfId();

	     me.renderData.swfId = swfId;
			me.style =  { 'background-color': '#000000' };
			me.backgroundColor = '#000000';
	     Ext.flash.Component.superclass.onRender.apply(me,arguments);
	
	    
	     vars = Ext.apply({
	         allowedDomain: document.location.hostname
	     }, me.flashVars);
	     
	     params = Ext.apply({
	         bgcolor: me.backgroundColor,
	         wmode: me.wmode,
	         src: me.url
	     }, me.flashParams);
	     //copied code - end
	    
	     if(SWPtmp.theme == 'Dark'){
	    	 
	    	 var themeControl = {
	 	         		autoHide:false,
	 	     			url : 'flowplayer/flowplayer.controls-3.2.15.swf',
	 	     			backgroundColor: "transparent",
	 	         		buttonOffColor: 'rgba(130,130,130,1)',
	 	         		progressGradient: 'none',
	 	         		volumeSliderColor: '#3b3b3b',
	 	         		timeSeparator: ' ',
	 	         		timeColor: '#ffffff',
	 	         		timeBorder: '0px solid rgba(0, 0, 0, 0.3)',
	 	         		buttonOverColor: '#9e9e9e',
	 	         		tooltipColor: '#000000',
	 	         		sliderGradient: 'none',
	 	         		volumeColor: '#303030',
	 	         		durationColor: '#bababa',
	 	         		backgroundGradient: 'none',
	 	         		backgroundColor: '#303030',
	 	         		callType: 'default',
	 	         		progressColor: '#303030',
	 	         		bufferColor: '#445566',
	 	         		autoHide: 'never',
	 	         		disabledWidgetColor: '#555555',
	 	         		tooltipTextColor: '#ffffff',
	 	         		buttonColor: '#ebebeb',
	 	         		timeBgColor: '#333333',
	 	         		sliderColor: '#303030',
	 	         		borderRadius: '0',
	 	         		bufferGradient: 'none',
	 	         		sliderBorder: '1px solid rgba(128, 128, 128, 0.7)',
	 	         		volumeBorder: '1px solid rgba(128, 128, 128, 0.7)',
	 	         		volumeSliderGradient: 'none',
	 	         		height: 32,
	 	         		opacity: 1.0
	 	         		}; 
	    	 var themeCanvas = {backgroundColor: "#434343"};
	    	 me.tooltipTextColor ='#646464';
	    	 me.tooltipColor='#C6C6C6';
	    	 me.buttonbackgroundColor= '#cfcfcf';
	    	  me.buttonOverColor='#9e9e9e';
	     } else if (SWPtmp.theme == 'Light'){
	    	 
	    	 var themeControl = {
	    			 autoHide:false,
 	     			 url : 'flowplayer/flowplayer.controls-3.2.15.swf',
 	     			 backgroundColor: "transparent",
	    			 buttonOffColor: 'rgba(130,130,130,1)',
	    			 progressGradient: 'none',
	    			 volumeSliderColor: '#e6e6e6',
	    			 timeSeparator: ' ',
	    			 timeColor: '#383838',
	    			 timeBorder: '0px solid rgba(0, 0, 0, 0.3)',
	    			 buttonOverColor: '#595959',
	    			 tooltipColor: '#000000',
	    			 sliderGradient: 'none',
	    			 volumeColor: '#e8e8e8',
	    			 durationColor: '#999999',
	    			 backgroundGradient: 'none',
	    			 backgroundColor: '#cfcfcf',
	    			 callType: 'default',
	    			 progressColor: '#f2f2f2',
	    			 bufferColor: '#f0f0f0',
	    			 autoHide: 'never',
	    			 disabledWidgetColor: '#555555',
	    			 tooltipTextColor: '#ffffff',
	    			 buttonColor: '#333333',
	    			 timeBgColor: '#e3e3e3',
	    			 sliderColor: '#cccccc',
	    			 borderRadius: '0',
	    			 bufferGradient: 'none',
	    			 sliderBorder: '1px solid rgba(128, 128, 128, 0.7)',
	    			 volumeBorder: '1px solid rgba(128, 128, 128, 0.7)',
	    			 volumeSliderGradient: 'none',
	    			 height: 32,
	    			 opacity: 1.0
	    	 };
	    	 var themeCanvas = {backgroundColor: "#e6e6e6"};
	    	  me.tooltipTextColor ='#e0e0e0';
	    	 me.tooltipColor='#444444';
	    	 me.buttonbackgroundColor= '#cfcfcf';
	    	 me.buttonOverColor='#595959';
	     } else {
	    	 
	    	 var themeControl = {
	    	   			autoHide:false,
	    	   			url : 'flowplayer/flowplayer.controls-3.2.15.swf',
	    	   			backgroundColor: "transparent",
    			        backgroundColor: '#D5E2F1',
    					buttonColor: 'rgba(0, 0, 0, 0.9)',
    					buttonOverColor: '#333',
    					backgroundGradient: 'medium',
    					sliderColor: '#FFFFFF',
    		
    					sliderBorder: '1px solid #808080',
    					volumeSliderColor: '#FFFFFF',
    					volumeBorder: '1px solid #808080',
    		
    					timeColor: '#333',
    					durationColor: '#535353'
	    	   		};
	    	 var themeCanvas = {backgroundColor: "#434343"};
	     }
	     var flowplayerConf = {//201404230540
//	    		 onBeforeUnload : function(clip) {
// 	            	 return true;
// 	             },
 	             onOverlayButtonClick: function(btnName) {
		            var swpplayer = me.up('swpplayer');
		           
		            if( btnName == 'Replay'){
		            	swpplayer.fireEvent('replaybutton', swpplayer.getFlowPlayer().getTime());
		        	}else if(btnName == 'Next') {
		        		swpplayer.fireEvent('playbutton', swpplayer, swpplayer.getFlowPlayer());
		        	}else{
		        			var grid = Ext.ComponentQuery.query('commentsgrid')[0];
	    					grid.fireEvent('nextchapter',grid);
		        	}
		        },
 	            onError : function( errorCode, errorMsg ) {
	            	 console.log(errorMsg + ' , code = ' + errorCode );
	             },
	    		 log : {
	                 level  : 'debug',
	                 filter : 'org.flowplayer.timings.*'
	             },
	             onLoad:function(){
	             	var swpplayer = me.up('swpplayer');
	             	swpplayer.getFlowPlayer().getPlugin('dock3').hide();
		            swpplayer.getFlowPlayer().getPlugin('dock2').hide();
		             swpplayer.getFlowPlayer().getPlugin('dock1').hide();
	             },
	 	         clip:{
	 	            autoPlay:false,
	 	            autoBuffering:true,
	 	 			urlResolvers:["smil","bwcheck"],
	 	 			provider:"rtmp",
	 	 			onBeforeBegin: function(clip) {
	 	 				me.fireEvent('beforebegin', me, clip);
	 	 				return true;
	 	 			},
	 	 			onBegin: function(clip) {
	 	 				me.fireEvent('begin', me, clip);
	 	 			},
	 	 			onResize: function(clip) {
	 	 				me.fireEvent('resize', me, clip);
	 	 			},
	 	 			onBeforeFinish: function(clip) {
	 	 				me.up('swpplayer').fireEvent('onbeforefinishplay', me, clip);
	 	 				me.fireEvent('beforefinish', me, clip);
	 	 				return true;
	 	 			},
	 	 			onFinish: function(clip) {
	 	 				me.fireEvent('finish', me, clip);
	 	 			},
	 	 			onBeforePause: function(clip) {
	 	 				me.fireEvent('beforepause', me, clip);
	 	 				return true;
	 	 			},
	 	 			onPause: function(clip) {
	 	 				me.fireEvent('pause', me, clip);
	 	 			},
	 	 			onBeforeResume: function(clip) {
	 	 				me.fireEvent('beforeresume', me, clip);
	 	 				return true;
	 	 			},
	 	 			onResume: function(clip) {
	 	 				me.fireEvent('resume', me, clip);
	 	 			},
	 	            onBeforeSeek: function(clip,time) {
	 	            	 me.fireEvent('beforeseek', me, clip, time);
	 	                 return true;    
	 	             },
	 	             onSeek: function(clip,time) {
	 	            	 me.fireEvent('seek', me, clip, time);
	 	            	 this.resume();
	 	             }
	 	             , onStart: function(clip) {
	 	            	 me.fireEvent('start', me, clip);
	 	             }
	 	             , onBeforeStop: function(clip) {
	 	            	 me.fireEvent('beforestop', this, clip);
	 	            	 return true;
	 	             },
	 	             onStop: function(clip) {
	 	            	 me.fireEvent('stop', me, clip);
	 	             },
	 	             onLoad: function(clip) {
	 	            	 this.startBuffering();
	 	             },
	 	             onUpdate: function(clip) {
	 	            	 me.fireEvent('update', me, clip);
	 	             },
	 	            cuepointreached: function(clip, time, record) {
	 	            	console.log('---->>> 2nd alert');
	 	            },
	 	             scaling: 'fit'
	 	         },
				onFullscreen : function( clip,time,record ){
					
					me.fireEvent('playerfullscreen', me, clip);
				},
				onFullscreenExit : function(){
					
					me.fireEvent('playerfullscreenexit',me);
				},
	 	        playlist:[],
	 	       canvas: themeCanvas,
	 	         plugins:{
	 	         	rtmp:{
	 	        	 	url : 'flowplayer/flowplayer.rtmp-3.2.12.swf',
	 	         		netConnectionUrl:"rtmp:\/\/fss28.streamhoster.com\/jnovak"
	 	         	},
	 	         	'dock1': {
			            'top': '10%',
			            'left': '95%',
			            'horizontal': true,
			            'autoHide': false,
			            'height':'10%'
			        },
			        'dock2': {
			            'top': '83%', //201405280522
			            'left': '79%', // 201405280522
			            'horizontal': true,
			            'autoHide': false,
			            'height':'20%'
			        },
			        'dock3': {
			            'top': '50%', //201406110909
			            'left': '50%', // 201406110909
			            'horizontal': true,
			            'autoHide': false,
			            'height':'20%'
			        },replaynextbuttons: {
			            'url': 'flowplayer/flowplayer.skillnerbuttons-0.0.4.swf',
			 
			           'buttons': {
			                'overColor': me.buttonOverColor,
			                'color':me.buttonbackgroundColor,
			                tooltipEnabled: true,
			                tooltipTextColor: me.tooltipTextColor,
                			tooltipColor:me.tooltipColor
			            },
			            'next': true,
			            'replay': true,
			            nextTooltipLabel:me.nextChapterTooltip ,
			            replayTooltipLabel: me.previousChapterTooltip,
			            dockTo: "dock2"
			        },replaynextbuttonscenter: {
			            'url': 'flowplayer/flowplayer.skillnerbuttons-0.0.4.swf',
						 
				           'buttons': {
				                'overColor': me.buttonOverColor,
				                'color':me.buttonbackgroundColor,
				                tooltipEnabled: true,
				                tooltipTextColor: me.tooltipTextColor,
	                			tooltipColor:me.tooltipColor
				            },
				            'next': true,
				            'replay': true,
				            nextTooltipLabel:me.nextChapterTooltip ,
				            replayTooltipLabel: me.previousChapterTooltip,
				            dockTo: "dock3"
				    },
			        skipbutton: {
			            'url': 'flowplayer/flowplayer.skillnerbuttons-0.0.4.swf',
			 
			           'buttons': {
			                 'overColor': me.buttonOverColor,
			                'color':me.buttonbackgroundColor,
			                tooltipEnabled: true,
			                tooltipTextColor: me.tooltipTextColor,
                			tooltipColor:me.tooltipColor
			            },
			            'skip': true,
			            skipTooltipLabel: me.skipChapterTooltip,
			            dockTo: "dock1"
			        },
			        
	 	         	
	 	         		controls: themeControl,
	 	     		captions: {
	 	     			url : 'flowplayer/flowplayer.captions-3.2.9.swf'
		 	               // pointer to a content plugin (see below)
		 	              , captionTarget: 'content'
		 	              , button:null
		 	           },
	 	     		smil:{
		 	        	   url : 'flowplayer/flowplayer.smil-3.2.8.swf'
	 	     		},
	 	     		bwcheck:{
	 	     			url : 'flowplayer/flowplayer.bwcheck-3.2.12.swf',
	 	     			serverType:"wowza",
	 	     			dynamic:true,
	 	     			netConnectionUrl:"rtmp:\/\/fss28.streamhoster.com\/jnovak"
	 	     			
	 	     		},
	 	     		content:{
	 	     			url : 'flowplayer/flowplayer.content-3.2.8.swf',
	 	     			bottom: 55,
		 	             height:85,
		 	             backgroundColor: 'transparent',
		 	             backgroundGradient: 'none',
		 	             border: 0,
		 	             textDecoration: 'outline',
		 	             style: {
		 	                 body: {
		 	                     fontSize: 14,
		 	                     fontFamily: 'Arial',
		 	                     textAlign: 'center',
		 	                     color: '#ffffff'
		 	                 }
		 	             }
				}
			}
		};
	    // flowplayer.addPlugin("timings", this.timingPlugin);
	     me.fp = flowplayer(this.getSwfId(),params,flowplayerConf).onLoad(function() { this.stop(); return true; } );
	     me.getEl().down('div').setHeight('100%');
	     me.getEl().down('div').setStyle({overflow : 'hidden'});
    },
    timingPlugin: function() {

    	return this;
    },
    getPlayer: function() {
    	return this.fp;
    }
});
