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
    'CHAT.Application':'extapps/chatapp/app/Application.js'
});
Ext.onReady(function(){
	Ext.getBody().addCls(SWP.Rrolename);
	  Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);
	  Ext.util.Format.formatTime = function(ts) {
		var hr = Math.floor(ts/3600);
                var min = Math.floor(ts/60)-60*hr;
                var sec = Math.floor(ts)-3600*hr - 60*min;
                return ((hr<10)?'0':'')+hr + ((min<=9)?':0':':') + min + ((sec<=9)?':0':':') + sec ;
	};
});
Ext.application({
    name: 'CHAT',
    extend: 'CHAT.Application'
});
