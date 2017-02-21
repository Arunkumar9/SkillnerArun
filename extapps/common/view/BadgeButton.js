Ext.define('SWPCommon.view.BadgeButton',{
	extend:'Ext.button.Button',
	alias:'widget.badgebutton',
	
	config:{
		badgeText:null, 
		renderTpl: [
		            '<span id="{id}-btnWrap" class="{baseCls}-wrap',
		                '<tpl if="splitCls"> {splitCls}</tpl>',
		                '{childElCls}" unselectable="on">',
		                '<span id="{id}-btnEl" class="{baseCls}-button">',
		                    '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
		                        '{childElCls}" unselectable="on">',
		                        '{text}',
		                    '</span>',
		                    '<span role="img" id="{id}-btnIconEl" data-qclass="seek-qtip" data-anchor="top" data-qtip= "{tooltip}" class="{baseCls}-icon-el {iconCls}',
		                        '{childElCls} {glyphCls}" unselectable="on" style="',
		                        '<tpl if="iconUrl">background-image:url({iconUrl});</tpl>',
		                        '<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">',
		                        '<tpl if="glyph">&#{glyph};</tpl><tpl if="iconCls || iconUrl">&#160;</tpl>',
		                    '</span>',
		                    //'<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}"<tpl if="iconUrl"> style="background-image:url({iconUrl})"</tpl>></span>',
		                    '<span id="{id}-btnbadge" class="{badgeTextCls} " reference= "badgeElement" style="width=30px;">{badgeText}</span>',
		                '</span>',
		            '</span>',
		            // if "closable" (tab) add a close element icon
		            '<tpl if="closable">',
		                '<span id="{id}-closeEl" class="{baseCls}-close-btn" title="{closeText}" tabIndex="0"></span>',
		            '</tpl>'
		        ]
},
childEls:[
	       'btnbadge','btnInnerEl','btnIconEl'
	       ],
	constructor:function( config ){
		
		var me = this;
		Ext.apply(me.config,config);
		me.callParent( arguments );
	},
	
	
	/**
     * This method returns an object which provides substitution parameters for the {@link #renderTpl XTemplate} used to
     * create this Button's DOM structure.
     *
     * Instances or subclasses which use a different Template to create a different DOM structure may need to provide
     * their own implementation of this method.
     *
     * @return {Object} Substitution data for a Template. The default implementation which provides data for the default
     * {@link #template} returns an Object containing the following properties:
     * @return {String} return.type The `<button>`'s {@link #type}
     * @return {String} return.splitCls A CSS class to determine the presence and position of an arrow icon.
     * (`'x-btn-arrow'` or `'x-btn-arrow-bottom'` or `''`)
     * @return {String} return.cls A CSS class name applied to the Button's main `<tbody>` element which determines the
     * button's scale and icon alignment.
     * @return {String} return.text The {@link #text} to display ion the Button.
     * @return {Number} return.tabIndex The tab index within the input flow.
     */
    getTemplateArgs: function() {
    	
    	var me = this,
        glyph = me.glyph,
        glyphFontFamily = Ext._glyphFontFamily,
        glyphParts;
	     if (typeof glyph === 'string') {
	         glyphParts = glyph.split('@');
	         glyph = glyphParts[0];
	         glyphFontFamily = glyphParts[1];
	     }
	     return {
	         	
				innerCls 		: me.getInnerCls(),
				splitCls 		: me.getSplitCls(),
				iconUrl  		: me.icon,
				iconCls  		: me.iconCls,
				text     		: me.text || '&#160;',
				href     		: me.getHref(),
				hrefTarget		: me.hrefTarget,
				badgeTextCls 	: me.baseCls+'-badgeCls' +'   ' + ( (Ext.isEmpty( me.badgeText ) || me.badgeText ==0 ) ? 'hide-badge' :' '),
				badgeText		: me.badgeText ||  undefined,
				splitCls 		: me.getSplitCls(),
				tabIndex 		: me.tabIndex,
				type     		: me.type,
				hrefTarget		: me.hrefTarget,
				tooltip 		: me.tooltip1
				
	     };
	     
    },

  	
setBadgeText:function(text) {

    var me = this;
    if( me.rendered ){
    if( Ext.isEmpty( text) || text == 0){
    	
    	text  = undefined;
    	me.btnbadge.addCls('hide-badge');
    	if( me.btnbadge.hasCls('two-digit-badge')){
    		
    		me.btnbadge.removeCls('two-digit-badge');
    	}
		if( me.btnInnerEl.id == "comments-grid-messagebtn-btnbadge" || me.btnIconEl.id == "comments-grid-messagebtn-btnIconEl"){

			me.btnInnerEl.removeCls('messagebtn-badge');
			me.btnInnerEl.removeCls('bold-badge');
			me.setWidth(Ext.isIE ? (me.defaultWidth + 2 ): me.defaultWidth);

		}else{
			var tabWidth;
			if( me.el.dom.clientWidth != 0 ){//&& me.el.dom.style.width.split('px')[0] == "" ){
				
				tabWidth = me.el.dom.clientWidth;
			}else if( Ext.getCmp(me.el.id).activeTabWidth ){
				
				tabWidth = Ext.getCmp(me.el.id).activeTabWidth;
			}else {
				tabWidth = parseInt(me.el.dom.style.width.split('px')[0]);
				
			}
	    	if(  me.btnInnerEl.hasCls('bold-badge') && tabWidth  ){
	    			var required_width = tabWidth - (Ext.isIE8 ? 18: 21);
	    			
	            		me.setWidth( required_width );
	            		if( Ext.getCmp(me.el.id).activeTabWidth ){
	        				
	        				Ext.getCmp(me.el.id).activeTabWidth = required_width;
	        			}
            		me.updateLayout();
	    	}
	    		me.btnInnerEl.removeCls('bold-badge');
	    		if( required_width && me.el.down('.x-tab-icon-el').dom.className.search('status') != -1 ){
	    			
	    			required_width = required_width + 7;
	    			me.setWidth( required_width );
	    			
	    		}
	    		if(me.el.dom.className.search('x-tab-default') != -1 &&me.btnIconEl.dom.className.search('status') != -1){
        			
	    			me.setWidth(tabWidth + 20);
	    			if( Ext.isIE8){
	    				me.btnIconEl.dom.setAttribute("style", "position: inherit;float: right;margin-right:-5px;");
	    			}else{
	    				me.btnIconEl.dom.setAttribute("style", "position: inherit;float: right;");
	    			}
        			
        		}

		}

    	
    }else{

		if(  me.btnInnerEl.id == "comments-grid-messagebtn-btnbadge" || me.btnIconEl.id == "comments-grid-messagebtn-btnIconEl"){

			me.btnInnerEl.addCls('bold-badge');
			me.btnbadge.addCls('messagebtn-badge');
			if (text >= 10 ){
	    		
	    		me.btnbadge.addCls('two-digit-badge');
	    		
	    	} else if( me.btnbadge.hasCls('two-digit-badge')) {
	    		
	    		me.btnbadge.removeCls('two-digit-badge');
	    	}

		}else{
			
			me.btnInnerEl.addCls('bold-badge');
			if (text >= 10 ){
	    		
				me.btnbadge.addCls('two-digit-badge');
	    		
	    	} else if( me.btnbadge.hasCls('two-digit-badge')){
	    		
	    		me.btnbadge.removeCls('two-digit-badge');
	    	}
		}
		var tabWidth;
		if( me.el.dom.clientWidth != 0 ){
			
			tabWidth = me.el.dom.clientWidth;
		}else if( Ext.getCmp(me.el.id).activeTabWidth ){
			
			tabWidth = Ext.getCmp(me.el.id).activeTabWidth;
		}else {
			
			tabWidth = parseInt(me.el.dom.style.width.split('px')[0]);
		}
    	if(  text == 1  && tabWidth ){
    		
    		if ( me.el.id.indexOf('badgetab') > -1){
    			
    			var badgeText = Ext.getCmp(me.el.id).badgeText;
    			
    			if ( !badgeText || badgeText < 1 ){
    				
    				var required_width = tabWidth + (Ext.isIE8 ? 18: 21);
    				
    				me.setWidth( required_width);
            		if( Ext.getCmp(me.el.id).activeTabWidth ){
        				
        				Ext.getCmp(me.el.id).activeTabWidth = required_width;
        			}
            		if( me.el.dom.className.search('x-tab-default') != -1 ){
                		
                		if(me.btnIconEl.dom.className.search('status') != -1){
                			
                			me.setWidth(tabWidth+15);
                			if( Ext.isIE8){
                				me.btnIconEl.dom.setAttribute("style", "position: inherit;float: right;margin-right:15px;margin-top:-13px;");
                			}else{
                				me.btnIconEl.dom.setAttribute("style", "position: inherit;float: right;margin-right:17px");
                			}
                			
                		}
                		if(me.btnbadge.dom.className.search('badgeCls') != -1){
                			
                			me.setWidth(tabWidth+35);
                			
                		}
                	}
            		me.updateLayout();
    			}
    	}	
    	else if(me.btnbadge.hasCls('hide-badge')){
    		if (!me.defaultWidth)
    		me.defaultWidth = me.el.dom.clientWidth;
    		me.setWidth(me.defaultWidth + (Ext.isIE8 ? 29: 20));//here setting the badge text width default if the button have badgetext. 
    	}
    	
    }
    	me.btnbadge.removeCls('hide-badge');
    	
    }
    me.badgeText = text;
    if (me.rendered) {
        me.btnbadge.update( text );
    }
    }else{
    	me.badgeText = text;
    	
    }
 
    me.setComponentCls();
//    if (Ext.isStrict && Ext.isIE8) {
//        // weird repaint issue causes it to not resize
//        me.getEl().repaint();
//    }
//    me.updateLayout();
    
    return me;

}
	
});
