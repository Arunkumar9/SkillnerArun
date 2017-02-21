Ext.layout.CarouselLayout = function(config) {
    config = config || {};
//    Non-chunked, then animation makes no sense
    if (!config.chunkedScroll)
        Ext.applyIf(config, {
            scrollIncrement: 10,
            scrollRepeatInterval: 10,
            animScroll: false
        });
        Ext.layout.CarouselLayout.superclass.constructor.call(this, config);
};

Ext.extend(Ext.layout.CarouselLayout, Ext.layout.ContainerLayout, {
    /**
     * @cfg {Number} scrollIncrement The number of pixels to scroll each time a tab scroll button is pressed (defaults
     * to 100, or if {@link #resizeTabs} = true, the calculated tab width).  Only applies when {@link #enableTabScroll} = true.
     */
    scrollIncrement : 0,
    /**
     * @cfg {Number} scrollRepeatInterval Number of milliseconds between each scroll while a tab scroll button is
     * continuously pressed (defaults to 400).
     */
    scrollRepeatInterval : 400,
    /**
     * @cfg {Float} scrollDuration The number of milliseconds that each scroll animation should last (defaults to .35).
     * Only applies when {@link #animScroll} = true.
     */
    scrollDuration : .35,
    /**
     * @cfg {Boolean} animScroll True to animate tab scrolling so that hidden tabs slide smoothly into view (defaults
     * to true).  Only applies when {@link #enableTabScroll} = true.
     */
    animScroll : true,

    chunkedScroll: false,

    // private
    monitorResize:true,

    // private
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i;

        if(!this.scrollWrap){
            this.scrollWrap = target.createChild({
                tag:'div', cls:'x-carouselv-layout',
                cn: [
                {
                    cls: 'x-carouselv-scroller',
                    cn: {
                        cls: 'x-carouselv-body'
                    }
                }, {
                    cls: 'x-carouselv-left-scrollbutton',
                    style: {
                        width: '100%'
                    }
                }, {
                    cls: 'x-carouselv-right-scrollbutton',
                    style: {
                        width: '100%'
                    }
                }]
            });
            this.scrollLeft = this.scrollWrap.child('.x-carouselv-left-scrollbutton');
            this.scroller = this.scrollWrap.child('.x-carouselv-scroller');
            this.strip = this.scroller.child('.x-carouselv-body');
            this.scrollRight = this.scrollWrap.child('.x-carouselv-right-scrollbutton');
            this.leftRepeater = new Ext.util.ClickRepeater(this.scrollLeft, {
                interval : this.scrollRepeatInterval,
                delay: 0,
                handler: this.onScrollLeft,
                scope: this
            });
            this.rightRepeater = new Ext.util.ClickRepeater(this.scrollRight, {
                interval : this.scrollRepeatInterval,
                delay: 0,
                handler: this.onScrollRight,
                scope: this
            });

            this.renderAll(ct, this.strip);
            this.edge = this.strip.createChild({tag:'div', cls:'x-tab-edge'});
        }
        this.scroller.setWidth(this.container.getLayoutTarget().getWidth());
        this.scroller.setHeight(this.container.getLayoutTarget().getHeight() - 32);
        this.updateScrollButtons.defer(10, this);
    },

    // private
    renderItem : function(c, position, target){
        if(c) {
//			Renderable Component
        	if (c.render) {
        		if (!c.rendered){
		            c.render(this.strip);
		        }
//			Ext Element
		    } else if (c instanceof Ext.Element) {
		    	this.strip.dom.appendChild(c.dom);
//			DOM Element
		    } else if (c.nodeType == 1) {
		    	this.strip.dom.appendChild(c);
		    }
        }
        c.el.addClass('x-carouselv-item');
    },

    // private
    onResize : function(c, position, target){
        Ext.layout.CarouselLayout.superclass.onResize.apply(this, arguments);
        if (Ext.isIE) {
            this.scrollLeft.setHeight(this.scroller.getHeight());
            this.scrollRight.setHeight(this.scroller.getHeight());
        }
    },

    // private
    scrollTo : function(pos, animate){
        this.scroller.scrollTo('top', pos, animate ? this.getScrollAnim() : false);
        if(!animate){
            this.updateScrollButtons();
        }
    },

    // private
    updateScrollButtons : function(){
        var pos = this.getScrollPos();
        this.scrollLeft[(pos == 0) ? 'addClass' : 'removeClass']('x-tab-scroller-left-disabled');
        this.scrollRight[(pos >= (this.getScrollWidth()-this.getScrollArea())) ? 'addClass' : 'removeClass']('x-tab-scroller-right-disabled');
    },

    // private
    onScrollRight : function(){
        var sw = this.getScrollWidth()-this.getScrollArea();
        var pos = this.getScrollPos();
        var s = Math.min(sw, pos + this.getScrollIncrement(1));
        if(s != pos){
            this.scrollTo(s, this.animScroll);
        }        
    },

    // private
    onScrollLeft : function(){
        var pos = this.getScrollPos();
        var s = Math.max(0, pos - this.getScrollIncrement(-1));
        if(s != pos){
            this.scrollTo(s, this.animScroll);
        }
    },

    getScrollWidth : function(){
        var t = this.container.items.items;
        if (!t.length) return 0;
        var l = t[t.length - 1].el;
        return Math.abs(this.strip.getOffsetsTo(l)[1]) + l.getHeight();
    },

    // private
    getScrollPos : function(){
        return parseInt(this.scroller.dom.scrollTop, 10) || 0;
    },

    // private
    getScrollArea : function(){
        return parseInt(this.scroller.dom.clientHeight, 10) || 0;
    },

    // private
    getScrollAnim : function(){
        return {duration:this.scrollDuration, callback: this.updateScrollButtons, scope: this};
    },

    // private
    getScrollIncrement : function(dir){
        if (this.chunkedScroll) {
//            -1 for left, 1 for right
            if (dir == -1) {
                return;
            } else {
                return;
            }
        } else {
            return this.scrollIncrement || 100;
        }
    },

    // private
    isValidParent : function(c, target){
        return true;
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['carouselvertical'] = Ext.layout.CarouselLayout;