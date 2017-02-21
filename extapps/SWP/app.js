/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when upgrading.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides
Ext.require([
             
   'Ext.direct.*' , 'Ext.util.Cookies', 'Ext.TaskManager', 'Ext.window.MessageBox'
]);
Ext.Loader.setPath({
    'SWP.Application':'extapps/SWP/app/Application.js'
});

Ext.onReady(function(){
Ext.getBody().addCls(SWPtmp.Rrolename);
	Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);
	  Ext.util.Format.formatTime = function(ts) {
		var hr = Math.floor(ts/3600);
                var min = Math.floor(ts/60)-60*hr;
                var sec = Math.floor(ts)-3600*hr - 60*min;
                return ((hr<10)?'0':'')+hr + ((min<=9)?':0':':') + min + ((sec<=9)?':0':':') + sec ;
	};
});
Ext.application({
    name: 'SWP',

    extend: 'SWP.Application',
    
    autoCreateViewport: true
});
       
function preloader() {
	//201406190726
    if( SWP.mw && !SWP.PlayerFromMsg ){  
            SWP.mw.close();
    }  
}           

 window.onbeforeunload =  function (){ 
	 			//201406190726
                if( SWP.mw && !SWP.mw.closed && !SWP.PlayerFromMsg){   
                     return PARENT_WINDOW_CLOSE_MSG;  
                 }else{
                    return ;
                 }    
 }    
window.onunload = preloader;      