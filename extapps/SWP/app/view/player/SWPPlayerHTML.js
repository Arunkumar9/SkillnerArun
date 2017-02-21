/**
 * Task/Issue      Author    		UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23099          Dinesh.GK   		2013115550      According to the issue, if Player in Buffer mode controller is coming multiple times to onCuepoint event,
 *  												for prevent to show Replay& Play icons in player content,code modifications is done.
 *  23595		   Tapaswini Sabat	201311201614	If the flowplayer is not initialized and user is clicking on Message window then when
 *  												when the flowplayer is intializing we are pausing the video.
 *  23333		   Tapaswini Sabat  201311221251	Now HeatMap logic is changed as per the requirement.
 *  
 *  23333	      Arunkumar.muddada 201311291217    Modified : createFplayer: => on seek event
 *  													If i clicked on the already played chapter it is coming to this seek as well 
 *  													as registerCuePoints of the classroom.js , so count is incrementting two times.
 *  												    so i am restricting that with a variable.
 *  25940		Dinesh GK			201403030720	Browser taking too much memory for run the script which switching between chapters fast without any interval.
 *  26032       Arunkumar.muddada   201403121556    createFplayer : on(seek) event 
 *                                                      added code to unmask the course content panel,play the course
 *  												Registered an event on('beforeseek') there we are pausing the player
 *  											    playChapter: onBegin     added code to unmask the course content panel 		
 *  26032       Dinesh GK   		201404230540    removePlayer : code modification is made for destroy the player object from browser.
 *  27722		Arunkumar.muddada   201405170440    Modified : playChapter: Here we need to call the seek method of the flow player not the SWPplayer
 *  28044       Arunkumar.muddada   201406110909    Modified : playBackHiddenChapter : argument buttonposition is added and a validation that 
													if the button position is center middle then center middle other wise right bottom.
													Modified : hideReplayNextPlayButton : hide the newly added Doc3.
 *
 */


Ext.tip.QuickTipManager.init(true, {showDelay : 2000,style:'white-space:nowrap;'});

Ext.define('SWP.view.player.SWPPlayer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.swpplayerhtml',
    
    requires: [
               'SWP.view.player.FlowplayerHTML'
           ],
    smilUrl: '',
    store: undefined,
    timeField: 'start',
    blockCountIncreased : 0,
    queryByFn: function() {return true;},
    currentPosition : 0,
    seekPosition : 0,
    selectedPosition:0, //2013115550
    showingReplayNextButtons:false,
    initComponent: function() {
    	var me = this;
    	var fp = this.createFplayer();
    	var config = {
    	layout: 'fit',
    	items:[fp]
    	};

    	Ext.apply(this, Ext.apply(this.initialConfig, config));
    	SWP.view.player.SWPPlayer.superclass.initComponent.call(this, config);

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
    	'failure'
    	);
    	
    	
    },
    createFplayer : function() {
    	var me = this;
    	var fp = Ext.create('SWP.view.player.FlowplayerHTML', {
	    	smilUrl : this.smilUrl,
	    	store : this.store,
	    	autoScroll : true,
	    	queryByFn : this.queryByFn,
	    	timeField : this.timeField
    	});

    	Ext.apply(fp, { fwd10s : 0 }, { justFinished: false } );

    	fp.on('seek', function(fp, clip, time) {
			 console.log( time , 'seek time');
             me.chapterSelected = time;
            
			/**
			 * 201311201614
			 * 	To pause the player on message button click if the player state is buffering.
			 * 	Calling from classroom.js
			 * 	
			 */
			 
     		me.seekedTo = true;
    	

	    		var grid = Ext.ComponentQuery.query('chapterslist')[0];
	  //   		//Calling findPlaying method to get current selected record based on time
	    		var chapterRec = SWP.getApplication().getController('Classroom').findPlaying(null, null, null, true );
	    		
				//201311221251
				// If the player is already playing and we click on a seek icon, then the 
				// Corresponding block value is incrementing by 1.
	    		if( !SWP.editorsLogin && !SWP.instructLogin ){
	    			
	    			if( me.getFlowPlayer().getState() == 3 ){

	    				var playerTime = Math.round(time ) * 1000;
	    				var indexValueFromHeatmap = Ext.Array.indexOf( me.heatmapPoints,playerTime);
	    				if( indexValueFromHeatmap == -1 ){
	    					if( chapterRec ){

	    						var lesson = chapterRec.get('video_id');

	    						var videoId = lesson.substr(1, lesson.length);

	    					}
	    					blockValue = Math.floor(time/10);
	    					//201311291217
	    					VideoRecordMgr.increaseBlockCount( videoId, blockValue+1);
	    					 me.blockCountIncreased = ( time == 0 ) ? (time +1) : time;

	    				}
	    			}

	    		}
 				// Calling the Refresh Icons method.   		
	    		grid.refreshIcons(chapterRec);
                me.fireEvent('loadCaptions',me,fp,chapterRec);
                me.hideReplayNextPlayButton();

                if( me.chapterResumed ){
                    me.chapterResumed = me.chapterSelected;
                }
    	});
        fp.on('resume',function(){
            

            console.log('resumed ');
            me.chapterResumed =  me.getFlowPlayer().getTime();
            me.forwardSeek =0;
            me.hideReplayNextPlayButton();

        
      
        });
        fp.on('pause',function(){
                me.getFlowPlayer().getPlay().show();
        });
    	
		fp.on('playerfullscreen',function(flowplayerhtml, clip){
			
			me.fireEvent('playerfullscreenclicked',flowplayerhtml.fp,true);
			
		});
		
		fp.on('playerfullscreenexit',function(flowplayerhtml){
			
			me.fireEvent('playerfullscreenexit',flowplayerhtml.fp);
			
		});
		
    	fp.on('finish', function(fp, clip, time) {
    		fp.fwd10s = 0;
    		fp.getPlayer().pause();
    		fp.justFinished = true;
    	} );
    	
    	//
    	// Stopping the flow player before finish, and On begin, checking condition weather,
    	// it has stopped or not by using defined variable and if yes, pausing and playing the player
    	// so that player player will start from first chapter.
    	//
    	
    	fp.on('beforefinish', function(fp,clip,time){
    		
    		fp.getPlayer().stop();
    		fp.justFinished = true;
    	});
    	
    	fp.on('begin', function( fp,clip,time ) {
    		
    		if( fp.justFinished == true ){
    			
		    		fp.getPlayer().pause();
		    		fp.getPlayer().play();
    			}
    			fp.justFinished = false;
    			
    	});

    	
    	this.relayEvents(fp, [ 'pause', 'beforebegin', 'begin',
						    	'beforefinish', 'finish', 'beforepause', 'pause',
						    	'beforeresume', 'resume', 'beforeseek', 'seek',
						    	'start', 'beforestop', 'stop', 'update','playerfullscreen','playerfullscreenexit' ]);

    	return fp;
    },
    isChapterBeingPlayed: function(chapterRec) {

    	return false;
    },
    playChapter: function(chapterRec, ts ) {
    	var vch = false;
    	
    	if ( !SWP.video && Ext.isEmpty( chapterRec ) ) {
    		return;
    	}
    	
    	if (!SWP.video || SWP.video != chapterRec.get('video_id') ) {
            SWP.video = chapterRec.get('video_id');
            vch = true;
        }
    	
    
    	var fp = this.down('flowplayerhtml');
    	
    	fp = this.down('flowplayerhtml').getPlayer();
    	var start = chapterRec.get(this.timeField);
		var state = fp.getState();
		
		if ( !Ext.isEmpty( ts ) ) {
			start = ts;
		}
		
		this.resetSkippable(chapterRec);
		try {
			
			if (vch || state < 3 || state >= 4 || !fp.getClip().url) {
				var fbplayer = this;
				if(state == -1){ //this condition is true when the player is first time load / initializing 
					fp.load(function(){
						fbplayer.down('flowplayerhtml').registeredCuepoints = false;
						fbplayer.justplay = true;
						fp.setClip({url:chapterRec.get('url')});
						fbplayer.down('flowplayerhtml').chapterRec = chapterRec;
						fbplayer.down('flowplayerhtml').registeredCuepoints=false;
							fp.play().onBegin(function() {
								SWP.isReplayAndNextStepButtonsVisible = true;
								
								var swpplayerCmp = Ext.ComponentQuery.query('swpplayer')[0];
								var flowplayerCmp = swpplayerCmp.down('flowplayerhtml');
								swpplayerCmp.fireEvent('loadCaptions',swpplayerCmp,fp,flowplayerCmp.chapterRec);
								if( !flowplayerCmp.registeredCuepoints ){
									
									swpplayerCmp.currentPosition = start;
									flowplayerCmp.registeredCuepoints = true;
									swpplayerCmp.fireEvent("registercuepoints",flowplayerCmp.chapterRec );
								}
								if ( start!==null ) {
									//201405170440
									//Here we need to call the seek method of the flow player not the SWPplayer
									 fp.seek(start);
									 //
									 //After seeking to the required starting point make it to null so that 
									//if we are changing from one lesson to another lesson the control will not seek to the previous lesson start value.
									//
									start = null;
								}
							},fbplayer ); 
					})
				}else{
					
				//
				// set justplay vlaue of the swpplayer object to true.
				// so that in the flowplayer seek handler will call load captions to load the srt files.
				//
				this.down('flowplayerhtml').registeredCuepoints = false;
				this.justplay = true;
				fp.setClip({url:chapterRec.get('url')});
				this.down('flowplayerhtml').chapterRec = chapterRec;
                this.down('flowplayerhtml').registeredCuepoints=false;
					fp.play().onBegin(function() {
						SWP.isReplayAndNextStepButtonsVisible = true;
						
						var swpplayerCmp = Ext.ComponentQuery.query('swpplayer')[0];
						var flowplayerCmp = swpplayerCmp.down('flowplayerhtml');
						swpplayerCmp.fireEvent('loadCaptions',swpplayerCmp,fp,flowplayerCmp.chapterRec);
						if( !flowplayerCmp.registeredCuepoints ){
							
							swpplayerCmp.currentPosition = start;
							flowplayerCmp.registeredCuepoints = true;
							swpplayerCmp.fireEvent("registercuepoints",flowplayerCmp.chapterRec );
						}
						if ( start!==null ) {
							this.seek(start);
							 //
							 //After seeking to the required starting point make it to null so that 
							//if we are changing from one lesson to another lesson the control will not seek to the previous lesson start value.
							//
							start = null;
						}
					},this ); 
				}
			} else {
				if ( state > 2 ) {
					if( start!==null ){
					fp.seek(start);
					start = null;
					}
					fp.startBuffering();
				}
			}
			if ( state == 4 ) {
				fp.startBuffering();
			}
			
			fp.resume();
			this.seekedTo = false;
		} catch (e) {}
		
    }, 
    playingVideo : function(){
    	
        var fp = undefined;
        if( this.down('flowplayerhtml'))
        	fp = this.down('flowplayerhtml').getPlayer();
        if( fp )
        return ( fp.getState() === 3 );
        else
        	return false;
    },
    bwcheckPlugin : function(){
        var fp = this.down('flowplayerhtml').getPlayer();
        if ( Ext.isEmpty(fp) ) {
        	return false;
        } else {
        	return fp.getPlugin('bwcheck');
        }
    },
    seekTo : function( ts ) {
    	var fp = this.down('flowplayerhtml').getPlayer();
    	
    	if ( Ext.isEmpty( fp ) ) {
    		return;
    	}
    	
    	if ( fp.fwd10s !== 0 ) {
			ts = ts + (this.items.items[0].fwd10s * 10);
		}
    	
    	//
    	//	If user clicks multiple times on +10s or -10s, where the resulting time greater than or less than 
    	//	the time of original duration of lesson, at that situation, in order to control scrubber position by not moving
    	//	out side the flowplyer content, assigning the time value to 0 if time is less than actual duration and decreasing
    	// 	by 2sec, if time is more than actual duration.
    	//
    	
    	var fullduration = fp.getClip().fullDuration;
    	if ( ts < 0 ) {
    		fp.stop();
			ts = 0;
		}else if( ts > fullduration ){
			
			 ts = fullduration-2;
		}
		this.items.items[0].fwd10s = 0;

    	fp.seek(ts);
    	// this.forwardSeek = ts;
    },
    getTime: function() {
    	var fp = this.down('flowplayerhtml').getPlayer();
    	
    	//
    	// Here it will return the player time based on the Temporary value,
    	// If the value is same as actual time then return actual time otherwise return Temporary player time .
    	//
    	
    	if(SWP.frwrewTempTime == undefined)
    		return fp.getTime();
    	else
    		return SWP.frwrewTempTime;
    },
    getFlowPlayer: function() {
    	var fp = undefined;
    	if( this.down('flowplayerhtml') ){
    		 fp = this.down('flowplayerhtml').getPlayer();
    	}
    	
    	return fp;
    },
    removePlayer : function(){ 
    	var fp =  this.down('flowplayerhtml'), 
    		player = fp.getPlayer(); //201404230540
    	if( fp != undefined ){
    		try{
    			//201404230540
    			player.stop();
    			player.stopBuffering();
    			player.unload();
    			fp.destroy();
    			fp= null;
    		}catch(e){}
    		return true;
    	}else{
    		fp= null;
    		return false;
    	}
    },
    stopPlayer : function(){
    	var fp = this.down('flowplayerhtml').getPlayer();
    	
    	if ( fp !== null && fp !== undefined) {
    		return fp.stop();
    	} 
    },
    pause: function() {
    	var fp = this.down('flowplayerhtml').getPlayer();
    	
    	if ( fp !== null ) {
    		return fp.pause();
    	} else {
    		return fp;
    	}
    },
    resumeVideo : function(){
        var fp = this.down('flowplayerhtml').getPlayer();
        return fp.resume();
    },
    bufferStart : function(){
        var fp = this.down('flowplayerhtml').getPlayer();
        return fp.startBuffering();
    },
    currentClip : function(){
        var fp = this.down('flowplayerhtml').getPlayer();
        return fp.getClip();
    },
    getVideoState : function(){
        var fp = this.down('flowplayerhtml').getPlayer();
        return fp.getState();
    },
    resetSkippable : function(chapterRec){
        if( !this.getFlowPlayer().isLoaded() ){
            return ;
        }
    	if(chapterRec.get('skippable')==1)
    	{
    	
    	this.getFlowPlayer().getPlugin('dock1').show();
    	
    	}
    	else{
    	this.getFlowPlayer().getPlugin('dock1').hide();
    	}
    	
    },
	playBackHiddenChapter : function(chapterRec,cuepoint,buttonposition){
		if( SWPtmp.chapter_play_back == 'True' ){
			
			SWP.isReplayAndNextStepButtonsVisible = false;
			this.clickeventFired = true;
			this.getFlowPlayer().pause();
			var pos = this.getPosition(false);			
			var playerWidth = this.getWidth()/2; 
			//2013115550
			if( this.currentPosition == -1 ){
				this.selectedPosition = 0;
			}
			this.currentPosition = Math.round(this.getFlowPlayer().getTime());
            this.getFlowPlayer().getPlay().hide();
            //201406110909
             if(buttonposition == "Center middle" && buttonposition !=""){
            	 this.getFlowPlayer().getPlugin("dock3").show();
             } else if(buttonposition == "Right bottom"){
            	this.getFlowPlayer().getPlugin("dock2").show();
             } else{
            	this.getFlowPlayer().getPlugin("dock2").show();
             }
             this.showingReplayNextButtons=true;
            // this.getFlowPlayer().getPlugin('controls').setEnabled({all:false}).setEnabled({fullscreen:true});
		}
    	
    },
    hideReplayNextPlayButton:function(){
        if( !this.getFlowPlayer().isLoaded() || !this.showingReplayNextButtons ){
            return ;
        }
        
        var state = this.getVideoState(),
        	flowplayer = this.getFlowPlayer();
        if(  state== 4 ){
            this.getFlowPlayer().getPlay().show();    
        } else if(state == 3){
      
        	var fullDuration = Math.round(flowplayer.getClip().fullDuration),
        		currentTime = flowplayer.getTime();
        	//As at the end of the chapter if the sigle chapter and a marker is in the lesson, marker is not at the 
        	//end chapter so it is not showing replay at the end.because we are hiding the play for each seek.
        	if( fullDuration != fullDuration ){ 
        		this.getFlowPlayer().getPlay().hide();
        	}
        }
        
             this.getFlowPlayer().getPlugin("dock2").hide();
             //201406110909
             this.getFlowPlayer().getPlugin("dock3").hide();
             this.showingReplayNextButtons=true;
            // this.getFlowPlayer().getPlugin('controls').setEnabled({all:true});
    },
      	/**
    	 * this method is used for hide "Skip Chapter" button,if Quiz window is shown.
    	 */
    hideSkipButton : function( hide ) {
        if( !this.getFlowPlayer().isLoaded() ){
            return ;
        }

    	var chapterList = Ext.ComponentQuery.query( 'chapterslist gridpanel' )[0];
		if( (chapterList.getSelectionModel().selected.length) > 0 ){
			
			var selectedRecs  = chapterList.getSelectionModel().getSelection();
    		if( hide ){
    			
    			this.getFlowPlayer().getPlugin("dock1").hide();
    			
    		}else if( selectedRecs[0].get('skippable') == SKIPPABLE.ONE ){
    			
    			this.getFlowPlayer().getPlugin("dock1").show();
    		}
    	}
    },	    	
	onLoad: function( isMessagingWindowClicked ) {
    	
    	if( isMessagingWindowClicked == true ) {
    		
    		return this.getFlowPlayer().stopBuffering();
    		
    	}else {
    		return true;
    	}
    	
    }
});