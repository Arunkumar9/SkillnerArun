/**
 * @author rosa
 */

Ext.namespace('Fresh','Fresh.Config','Fresh.console');

Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';


Fresh.Config = {

    /**
     *  Mod aplikace: debug | debugIE | performance
     *  @type	{Enum}
     */
    ApplicationMode: 'debug' //'performance'//'debugIE'  //'performance'// 
     //ApplicationMode : 'performance'//'debugIE'  //'performance'// 
     
    ,Service: {
         Cmp: 'index.php?json=cmp'
        ,View: 'index.php?json=view'
        ,Form: 'index.php?json=form'
        ,Tree: 'index.php?json=tree'
        ,Login: 'index.php?json=login'
        ,CmpList: 'index.php?json=cmplist'
        ,Mail: 'index.php?json=mail'
    }
    ,Page: {
        Login: 'index.php?page=admin.Login'
        ,Desktop: 'index.php?page=admin.Desktop'
    }
}
Fresh.Config.Globalization = {
	Marker: ''
}
Fresh.Config.DesktopConfig = {
			'autorun' : [
//				'docs-win'
			],
			'desktopcontextmenu': [
				'preferences-win'
    		],
    		'quickstart': [
			],
			'startmenu': [
			],
			'styles': {
				'backgroundcolor': 'f9f9f9',
				'theme': {
					'id': 'eShop',
					'path': ''
				},
				'transparency': false,
				'wallpaper1': {
					'id': 'eShop',
					'path': ''
				},
				'wallpaperposition': 'center'
			}
		};

/**
 * Vraci true, pokud je aplikace v modu 'performance'
 * @return {Boolean}
 */
Fresh.isAppPerformance = function() {
	return (Fresh.Config.ApplicationMode == 'performance')
}

/**
 * Vraci true, pokud je aplikace v modu 'debug', loguje se v FireFoxu
 * @return {Boolean}
 */
Fresh.isAppDebug = function() {
	return (Fresh.Config.ApplicationMode == 'debug' || Fresh.Config.ApplicationMode == 'debugIE')
}

/**
 * Vraci true, pokud je aplikace v modu 'debugIE', loguje se i v IE
 * @return {Boolean}
 */
Fresh.isAppDebugIE = function() {
	return (Fresh.Config.ApplicationMode == 'debugIE')
}

/**
 * Definice console pro logovani
 * @function Fresh.console
 */
if (Ext.isIE && !Ext.type(console)) {
         console = {};
	Fresh.console.log = function() {}
}

if (typeof(console)!='undefined' && (Fresh.isAppDebug() && !Ext.isIE || Fresh.isAppDebugIE() ) ) {
	Fresh.console	= console;
} 
else {
	/**
	 * @hidden
	 */
	Fresh.console.log = function() {}
}

Fresh._ = function(val) {
    if (Ext.type(Fresh.localize[val]))
        return Fresh.localize[val];
    else {
     	var marker = Fresh.Config.Globalization.Marker;
    	return marker+val+marker;
    }
}

__ = Fresh._;