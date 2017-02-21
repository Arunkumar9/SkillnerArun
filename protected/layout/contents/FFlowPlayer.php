<?php
	/**
	Author: Jan Rosa from Iwo Polanski	outlying@gmail.com

	ver 0.0.2

	Licensed under: LGPLv3
	http://www.opensource.org/licenses/lgpl-3.0.html
	**/


        Prado::using('FreshSystem.UI.Content.Media.FFlvVideo');
	class FFlowPlayer extends FFlvVideo {
                private $_video;
                private $_cuepoints;
		
                public function  OnPreRender($param) {
                     $cs = $this->getPage()->getClientScript();
                    if (!$this->getPage()->getIsCallback()) {
                            $cs->registerHeadScriptFile('FFlowPlayer', "http://fast.freshsystems.cz/flowplayer/flowplayer-3.2.6.min.js");
//            $cs->registerStyleSheetFile('flowplayer',  "http://fast.freshsystems.cz/flowplayer/flowplayer-3.2.6.min.js");
                            $cs->registerHeadScriptFile('FFlowPlayer.ipad', "http://fast.freshsystems.cz/flowplayer/flowplayer.ipad-3.2.1.js");
                            $cs->registerHeadScriptFile('FFlowPlayer.playlist', "http://fast.freshsystems.cz/flowplayer/flowplayer.playlist-3.0.8.min.js");
                    }
                    FStyledTemplateControl::OnPreRender($param);

///                    $this->ChapterRepeater->datasource = $this->getChapters();
  //                  $this->ChapterRepeater->databind();

                }


                public function getChapters() {

                    $criteria = new TActiveRecordCriteria('videos_id = ?',$this->getVideo()->uid);
                    $criteria->setOrdersBy('start');

                    return CuepointRecord::finder ()->findAll($criteria);
                }

                /**
		 * Getter for property MediaPlayerUrl
		 * url of flash mediaplayer
		 * @return url
		 */
		public function getMediaPlayerUrl() {
		   // if (!$this->_MediaPlayerUrl)
			//$this->_MediaPlayerUrl = $this->publishAsset('mediaplayer.swf');
		   // return $this->_MediaPlayerUrl;
		}

		/**
		 * Getter for property Colors
		 * comma delimited list of colors used by player
		 * @return string
		 */
		public function setMediaPlayerUrl($value) {
		    //$this->_MediaPlayerUrl = $value;

                }

                public function getConfigJson() {

                    $cfg = array(
                        'log'=>array('level'=>'info','filter'=>'org.flowplayer.captions.*'),
                        'clip'=>$this->getClip(),
                        'playlist'=>$this->getPLaylist(),
                        'plugins'=>$this->getPlugins()
                    );
                    $cfg = json_encode($cfg);
                    return $this->jsonDeQuote($cfg);

                }

                public function getClip() {

                    if ($this->Request['pseudo'])
                        $p = 'pseudo';
                    else
                        $p = 'rtmp';

                        return array(
                            'autoPlay'=> true,
                            'autoBuffering'=>true,
                        'urlResolvers'=>array('smil','bwcheck'),
                        'provider'=>$p,
                        //    'onStart'=>'^toggleLogo(10)',
                            //'captionUrl' => 'http://tvexpo.freshsystems.cz/titles'.$this->getVideo()->uid.'.xml', //
    //                        'onCuepoint'=> $this->getCuepointActions(),console.log("resume"); console.log(clip);
                     //       'onResume'=>'^function(clip) { if (!clip.ovaAd) {  this.getPlugin("captions").loadCaptionsFromFile(clip.index,"http://tvexpo.freshsystems.cz/titles'.$this->getVideo()->uid.'.xml"); this.getPlugin("content").fadeIn(1000); }}',
                       //     'onStart'=>'^function(clip) { if (clip.ovaAd) { this.getPlugin("content").fadeOut(1000); } else {this.getPlugin("captions").loadCaptionsFromFile(clip.index,"http://tvexpo.freshsystems.cz/titles'.$this->getVideo()->uid.'.xml"); this.getPlugin("content").fadeIn(1000); }}', ///.loadCaptions(1,"http://tvexpo.freshsystems.cz/titles'.$this->getVideo()->uid.'.xml");
                            //'onBufferEmpty'=>'^function(clip,ev) { console.log(clip); }',console.log("start"); console.log(clip);
                            //'onNetStreamEvent'=>'^function(clip,ev,info) { console.log(ev); console.log(info); }'
                          );
                }
                public function getPlaylist() {

                    $ios = preg_match('/iPhone|iPad|Android|iPod|Mobile Safari/is',$_SERVER['HTTP_USER_AGENT']);//stripos($_SERVER['HTTP_USER_AGENT'],'Mobile Safari') || stripos($_SERVER['HTTP_USER_AGENT'],'iPhone') || stripos($_SERVER['HTTP_USER_AGENT'],'iPad') || stripos($_SERVER['HTTP_USER_AGENT'],'iPod') || stripos($_SERVER['HTTP_USER_AGENT'],'Android');
                    $iosurl = "http://fss28.streamhoster.com/jnovak/_definst_/smil:{$this->Video->cool_url}.smil.xml/playlist.m3u8";
                    return  array(
                        array(
                       // 'url'=>'mp4:01-1000kbps_40kbps',//$this->getVideo()->getFirstVideo($p),
                        'title'=>$this->Video->name,
                        'url'=>($ios) ? $iosurl: $this->Video->FirstVideo,
//                        'token'=>$this->getApplication()->getModule('streamhoster')->getToken(),
                       // 'bufferLength'=>10,'http://web28.streamhoster.com/jnovak/01-500kbps_32kbps.mp4' 
                                                
                  //      'myCuepoints'=>  $this->getCuepoints(),
  //                      'bitrates'=>$this->getBitrates($p)
                    )
                    );
                }

                public function getBitrates($p) {
                    return array(
                            array(
                                'url'=>'mp4:01-500kbps_32kbps', 'bitrate'=>500, 'width'=>1024
                            ),
                            array(
                                'url'=>'mp4:01-1000kbps_40kbps', 'bitrate'=>1000, 'width'=>1024
                            ),
                            array(
                                'url'=>'mp4:01-1500kbps_48kbps', 'bitrate'=>1500, 'width'=>1024, 'isDefault'=>true
                            ),
                            array(
                                'url'=>'mp4:01-2000kbps_128kbps', 'bitrate'=>2000, 'width'=>1024
                            ),
                        );
                }
                public function getCuepointActions() {

                    /*$cp = $this->getCuepoints();

                    foreach ($cp as $c) {
                        $cps[] = $c->start*1000;
                    }*/

                    return array(
                        $this->getCuepoints(),
//                        "^function (clip, cuepoint) { console.log(cuepoint);jQuery('#cuepointBox').html(clip.myCuepoints.shift().description); }"
                        "^function (clip, cuepoint) { if (!clip.ovaAd) this.getPlugin('content').setHtml('<p>'+cuepoint.description+'</p>'); }"
                    );


                }

                public function getCuepoints() {

                    if ($this->_cuepoints === null) {
                            $this->_cuepoints = array();
                            $cps = CuepointRecord::finder ()->findAll('videos_id = ?',$this->Video->uid); // AND is_enabled
                            foreach ($cps as $c) {
                                $this->_cuepoints[] = array('time'=>$c->start*1000,'description'=>$c->description);
                                $this->_cuepoints[] = array('time'=>$c->stop*1000,'description'=>'');
                                //$c1 = new CuepointRecord;
                                //$c1->start = $c->stop;
                                //$this->_cuepoints[] = $c1;
                            }
                    }
                    return $this->_cuepoints;
                }

                public function getPlugins() { 


                   $plugins = array(
                    'rtmp'=>array(
                                        'url' => 'http://fast.freshsystems.cz/flowplayer/flowplayer.rtmp-3.2.3.swf',
                                        //'netConnectionUrl' => 'rtmp://freshsystemsvod.fms.c.footprint.net/freshsystemsvod'
                                        ///'netConnectionUrl' => 'rtmp://freshsystemsvodfs.fplive.net/freshsystemsvod'
                                        'netConnectionUrl' => 'rtmp://fss28.streamhoster.com/jnovak'
                                    ),
/*                    'rtmpInstream'=>array(
                                        'url' => 'http://fast.freshsystems.cz/flowplayer/flowplayer.rtmp-3.2.3.swf',
                                        'netConnectionUrl' => 'rtmp://freshsystemsvodfs.fplive.net/freshsystemsvod'
                                    ),
                    'pseudo'=>array(
                                        'url' => 'http://fast.freshsystems.cz/flowplayer/flowplayer.pseudostreaming-3.2.5.swf'
                                    ),
 * 
 */
                     'controls'=>array('autoHide'=>false,
                         'url'=>'http://fast.freshsystems.cz/flowplayer/flowplayer.controls-3.2.3.swf'),
                       				'playlist'=> true,
                     'smil'=> array(
                         'url'=>'http://fast.freshsystems.cz/flowplayer/flowplayer.smil-3.2.1.swf'
                              ),
                     'bwcheck'=>array(
                         'url' => 'http://fast.freshsystems.cz/flowplayer/flowplayer.bwcheck-3.2.3.swf',
                         'serverType'=>'wowza',
                         'dynamic'=>true,
                         'netConnectionUrl'=>'rtmp://fss28.streamhoster.com/jnovak',
                        'onStreamSwitchBegin'=> '^function (newItem, currentItem) { if (!console) return; console.log("Will switch to: " + newItem.streamName + " from " + currentItem.streamName);}',
                        'onStreamSwitch'=> '^function (newItem) { if (!console) return; console.log("Switched to: " + newItem.streamName); }'

                     ), 
                    'content'=>$this->getContent(),
                    /* 'captions'=>array(
                          'url'=>'http://fast.freshsystems.cz/flowplayer/flowplayer.captions-3.2.2.swf',
                          'captionTarget'=>'content',
                          
                        ),*/
                   );

                 //  if ($ova = $this->getOVA())
                   //        $plugins ['ova'] = $ova;

                   return $plugins;
                }

                public function getContent() {


                    return array(

                        'url' => "http://fast.freshsystems.cz/flowplayer/flowplayer.content-3.2.0.swf",

                        'bottom'=>30,
                        'right'=>20,
                        'height'=>100,
                        'width'=>200,
                        //'padding'=>5,
                        'opacity'=>1,
                        'backgroundColor'=>'transparent',
                        'verticalAlign'=>'bottom',
                        'html'=> '<img src="/images/logoSW1.png" vspace="10" hspace="10" align="right" />',
                        'backgroundGradient'=> array(0, 0, 0),
                        'border'=>0,
                      //  'onClick'=>'^function() { this.fadeOut(2000);}',
                        //'style'=>array('p'=>array('margin-left'=>'10px', 'color'=>'#ffffff','font-weight'=>'bold','font-size'=>'13px')),
                        //'closeButton'=>true
                        //'html'=>


                    );
                }

                public function getOVA() {
                   
                    $schedule = $this->getSchedule();

                    return (!count($schedule)) ? false : array(

                        'url' => "http://player.longtailvideo.com/flowplayer/ova-trial.swf",
                        'autoPlay' => true,

                        'overlays'=>array(
                            'regions'=> array(
                                array(
                                    'id'=>'my-ad-notice',
                                    'verticalAlign'=>'bottom',
                                    'backgroundColor'=>'transparent',
                                    'width'=>'100pct',
                                    'height'=>50,
                                    'style'=>".smalltext { fon-size: 10; }"
                                )
                            )
                        ),

                        'ads'=>array(
                            "setDurationFromMetaData"=> false,
                            //'clickSign'=>false,
                            'servers'=>array( array(
                                'type'=>'OpenX',
                                'apiAddress'=>"http://openx.freshsystems.cz/www/delivery/fc.php",
                                'target'=>array('video='.$this->getVideo()->cool_url)
                            )),
                            'notice'=> array('textStyle'=> 'smalltext'),
                            'displayCompanions'=> $this->getVideo()->getDisplayCompanions(),
                            'companions'=>array(array(
                                'id'=>$this->getVideo()->getCompanionId(),
                                'width'=>$this->getVideo()->getCompanionWidth(),
                                'height'=>$this->getVideo()->getCompanionHeight(),
                            )),
                            'schedule' => $schedule
                        ),
                        'debug' => $this->getDebug()
                    );

                }


                public function getSchedule() {

                    $ads = $this->getVideo()->getAdZones();
                    $zones = array();

                    $notice = array(
                                        "show"=> true,
                                        "type"=> 'countdown',
                                        "region"=> "my-ad-notice",
                                        "message"=> '<p class="smalltext" align="right">Reklama bude trvat ještě  _countdown_ s</p>'
                                        );

                    foreach($ads as $ad) {
                        if (!$ad->is_enabled)   continue;
                        $z = array(

                            'zone'=>$ad->zone,
                            'position'=>$ad->position,
                            'notice'=>$notice

                        );
                        if ($ad->duration ) $z['duration'] = $ad->duration;
                        if ($ad->start) $z['startTime'] = date ('00:i:s', $ad->start); //floor ($ad->start/3600).

                        $zones[] = $z;
                    }
                    return $zones;

                }



                public function getDebug() {

                    return ($this->getApplication()->getMode() == 'Debug' ) ? array(
                        'levels' =>  "events,notice, warning, fatal, config, cuepoints",
                        'debugger' => 'firebug'
                    ) : 
                    array();
                }


                public function getVideo() {

                    if ($this->_video === null) {

                        $vid = $this->Request['vid'];
                        $vid = ($vid) ? $vid : 1;
                        if (is_numeric($vid))
                            $this->_video = VideoRecord::finder()->findByPk($vid);
                        else
                            $this->_video = VideoRecord::finder()->find('cool_url= ?',$vid);

                        //die($vid);
                    }
                    return $this->_video;
                }


protected function jsonDeQuote($encoded, $keys, $references=null)
    {
        if (is_array($keys))
		{
			foreach ($keys as $key) {
	            $pattern = "/(\"".$key."\"\:)(\".*(?:[^\\\]\"))/U";
	            $encoded = preg_replace_callback(
	                $pattern,
	                array($this, '_stripvalueslashes'),
	                $encoded
	            );

	        }
		}

        $pattern = '/("[\@\^].*(?:[^\\\]"))/U';
        $encoded = preg_replace_callback(
            $pattern,
            array($this, '_stripvalueslashes1'),
            $encoded
        );


        return $encoded;
    }

	protected function jsonDeReference($encoded,$references=array())
	{
		if (is_array($references))
			foreach ($references as $key => $value)
			{
			//echo $key.' '.'<br>';
				$encoded = str_replace("%".$key."%",$value,$encoded);
			}

		return $encoded;
	}

    /**
     *
     * Method for use with preg_replace_callback in the _deQuote() method.
     *
     * Returns \["keymatch":\]\[value\] where value has had its leading and
     * trailing double-quotes removed, and stripslashes() run on the rest of
     * the value.
     *
     * @param array $matches Regexp matches
     *
     * @return string replacement string
     *
     */
    protected function _stripvalueslashes($matches)
    {
        return $matches[1].stripslashes(substr($matches[2], 1, -1));
    }
    protected function _stripvalueslashes1($matches)
    {
        return stripslashes(substr($matches[1], 2, -1));
    }



    public function getThumbs($b=5,$interval=25) {

        $th = $this->getVideo()->getImagesList();
        array_shift($th);

        $out=array(); $i=1;
        foreach($th as $t) {
            $text .= '<img src="'.$t->uid.'" onClick="flowplayer().seek('.(($i-1)*$interval).')" />';

            if ($i % $b == 0) {
                $out[] = $text;
                $text = '';
            }

            $i++;
        }
        if ($text) $out[] = $text;
        return '<div>'.implode('</div><div>',$out).'</div>';

    }



}

