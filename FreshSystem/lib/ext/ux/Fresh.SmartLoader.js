/**
 * based on fgerneth ApplicationLoader
 * @author rosa
 */

Ext.namespace('Fresh');

Fresh.Libraries = new Ext.util.MixedCollection();
Fresh.SmartLoader = function() {
	
    var count = 0;
	var loaded = {};	
	var enableCaching = false;
	
	var parseResult = function(res, options) {
		notifier.onSuccess(options.url);
	    Fresh.Libraries.add(options.url,{id: options.url, loaded: true});
        eval(res.responseText);
		notifier.onStart(options.url);
        checkCount();
	};
	
	var parseError = function(res, options) {
		notifier.onFailure(options.application);
	};
	
	var notifier = {
			onLoad: Ext.emptyFn,
			onSuccess: Ext.emptyFn,
			onFailure: Ext.emptyFn,
			onStart: Ext.emptyFn,
            onComplete: Ext.emptyFn,
			init: Ext.emptyFn
	};
    
    var checkCount = function() {
        count--;
        if (count==0)
            notifier.onComplete()
    }
	
	return {
		start: function(url, not) {
            if (typeof not == 'object')
                notifier = not;
				
			notifier.onLoad(url);
            url = ('array' != Ext.type(url))?[url]:url;
            count = url.length;
            while (url.length > 0) {
                var u = url.shift().trim();
                if (Fresh.Libraries.containsKey(u)) {
                    checkCount();
                }
                else {
                    Ext.Ajax.request({
                        url: u,
                        success: parseResult,
                        failure: parseError,
                        disableCaching: true,
                        scope: this
                    });
                }
            }
		},
		
        
		resetUrl: function(url) {
			Fresh.Libraries.removeKey(url);
		},
		
		getNotifier: function() {
			return notifier;
		},
		
		setNotifier: function(not) {
			notifier = not;
		}
	}
};