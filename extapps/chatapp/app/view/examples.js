/**
 * It will show the message notification while new thread came to logged-in user.	
 * 
 * 
 */
wtc = function() {
	
  var msgCt;
  this.me = this;
  
    function createBox( t, s,id ) {
    	
       return '<div id = "'+id+'" class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';

    }
    
    return {
    
    	msg : function( title, format, delaytime ) {
    		
            if( !msgCt ) {
            	
                msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.core.DomHelper.append(msgCt, createBox(title, s,++Ext.AbstractComponent.AUTO_ID), true);
            
            m.hide();
            m.slideIn('r').ghost("r", { delay: delaytime, remove: true});
        },

        init : function(){
        	
        }
    };
}();
