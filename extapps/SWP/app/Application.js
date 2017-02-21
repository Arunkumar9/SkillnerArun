/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  27666          Arunkumar.muddada	201406210404     Modified : added SWPCommon.view.RadioField on onBeforeLaunch list
 *  23596          Dinesh.GK    		20131120630      Override Tooltip component is added into the common folder, 
 *  23820		   Kanchan Singh		201312041930	 Added reports controller reference. 														Added the tooltip class in appliction onBeforeLaunch event.
 *  
 **/ 
Ext.define('SWP.Application', {
    name: 'SWP',

    extend: 'Ext.app.Application',
autoCreateViewport: true,
        appFolder:'extapps/SWP/app',
        // All the paths for custom classes
        paths: {
//        	'Ext': 'ext4.1/src/',
           'SWPCommon':'extapps/common'
            
        },
   

    controllers: [
       
            'Classroom'
           ,'Reports'
    ],

    
    
        onBeforeLaunch: function() {


		    Ext.require([
		             
		   'SWPCommon.FlexcrollAbstractComponent' , 'SWPCommon.view.TableView','SWPCommon.view.Panel','SWPCommon.view.Tip','SWPCommon.view.RadioField' //20131120630
		]);

            



		    Ext.create('SWP.store.LastRuns',{autoLoad:true});
        	Ext.tip.QuickTipManager.init();
   		 	Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
   			          showDelay: 50     
   			    });
        	Ext.apply( SWP,SWPtmp);
        	
        	Ext.Msg.wait('Please wait ...','Videoplayer is loading data ...');	
        	this.callParent( arguments );
        },
        launch:function(){        	
        	Ext.apply( SWP,SWPtmp);
        }

});
