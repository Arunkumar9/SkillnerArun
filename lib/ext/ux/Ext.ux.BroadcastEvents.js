Ext.namespace('Ext.ux');

Ext.override(Ext.util.Observable, {
    subscribe: function(eventName, fn, scope, o) {
        Ext.ux.BroadcastEvents.addEvents(eventName);
        Ext.ux.BroadcastEvents.on(eventName, fn, scope, o);
    },
    
    publish : function() {        
        if(Ext.ux.BroadcastEvents.eventsSuspended !== true){
            var ce = Ext.ux.BroadcastEvents.events ? Ext.ux.BroadcastEvents.events[arguments[0].toLowerCase()] : false;
            if(typeof ce == "object"){
                return ce.fire.apply(ce, Array.prototype.slice.call(arguments, 1));
            }
        }
        return true;
    },
    
    removeSubscriptionsFor : function(eventName){        
        for(var evt in Ext.ux.BroadcastEvents.events) {
            if ( (evt == eventName) || (!eventName) ) {            
                if(typeof Ext.ux.BroadcastEvents.events[evt] == "object"){
                    Ext.ux.BroadcastEvents.events[evt].clearListeners();
                }
            }
        }
    }
});

Ext.ux.BroadcastEvents = new Ext.util.Observable;