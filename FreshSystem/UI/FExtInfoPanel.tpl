<?php
/* FExtInfoPanel.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on May 28, 2007
 */
 
 /**
  * Collapsible InfoPanel
  *
  * @class Ext.InfoPanel
  * @extends Ext.ContentPanel
  * @constructor
  * Creates new InfoPanel
  * @param {String/HTMLElement/Element} el The container element for this panel
  * @param {String/Object} config A string to set only the title or a config object
    * @param {String} content (optional) Set the HTML content for this panel
    * @cfg {String} bodyClass css class apply to body (defaults to a reasonable style applied to body)
    * @cfg {Boolean} animate false to switch animation of expand/collapse off (defaults to true)
    * @cfg {Boolean} collapsible false to disable collapsibility (defaults to true)
    * @cfg {Boolean} collapsed false to start with the expanded body (defaults to true)
    * @cfg {String} trigger 'title' or 'button'. Click on what element expands/collapses the panel (defaults to 'title')
  * @cfg {String/HTMLElement/Element} bodyEl This element is removed from DOM and inserted as body of panel.
    * @cfg {String} icon Path for icon to display in title
    * @cfg {String} easingCollapse Easing to use for collapse animation (e.g. 'backIn')
    * @cfg {String} easingExpand Easing to use for expand animation (e.g. 'backOut')
    * @cfg {Float} duration Duration of animation in seconds (defaults to 0.35)
    * @cfg {Boolean} showPin Show the pin button - makes sense only if panel is part of Accordion
    * @cfg {Boolean} pinned true to start in pinned state (ipmlies collapsed:false) (defaults to false)
    * @cfg {Boolean} draggable true to allow panel dragging (defaults to false)
    * @cfg {Boolean} proxyDrag true for proxy dragging (defaults to false)
    * @cfg {Boolean} resizable true to allow use resize width of the panel. Handles are transparent. (defaults to false)
    * @cfg {Integer} minWidth minimal width in pixels of the resizable panel (no default)
    * @cfg {Integer} maxWidth maximal width in pixels of the resizable panel (no default)
  */
Ext.InfoPanel = function(el, config, content) {

    // {{{
    // basic setup
    var oldHtml = content || null;
    if(config && config.content) {
        oldHtml = oldHtml || config.content;
        delete(config.content);
    }

    // call parent constructor
    Ext.InfoPanel.superclass.constructor.call(this, el, config);

    // shortcut of DomHelper
    var dh = Ext.DomHelper;

    this.el.clean();
    // handle autoCreate
    if(this.autoCreate) {
        oldHtml = this.el.dom.innerHTML;
        this.el.update('');
    }
    // handle markup
    else {
        this.el.clean();
        if(this.el.dom.firstChild && !this.bodyEl) {
            this.title = this.title || this.el.dom.firstChild.innerHTML;
            if(this.el.dom.firstChild.nextSibling) {
                this.body = Ext.get(this.el.dom.firstChild.nextSibling);
            }
            var oldTitleEl = this.el.dom.firstChild;
            oldTitleEl = oldTitleEl.parentNode.removeChild(oldTitleEl);
            oldTitleEl = null;
        }
        else if(this.bodyEl) {
            this.body = Ext.fly(this.bodyEl).dom;
    //        this.body = this.body.parentNode.removeChild(this.body);
            this.el.dom.appendChild(this.body);
            this.body = Ext.get(this.body);
        }
    }

    // }}}
    // {{{
    // create title element
    this.titleEl = dh.insertFirst(this.el.dom, {
        tag: "div", unselectable: "on", cls: "x-unselectable x-layout-panel-hd x-layout-title-east"
        , children:[
            {tag: "span", cls: "x-unselectable x-layout-panel-hd-text", unselectable: "on", html: " "},
            {tag: "div", cls: "x-unselectable x-layout-panel-hd-tools", unselectable: "on"}
    ]}, true);
    this.titleEl.enableDisplayMode();
    this.titleEl.applyStyles(this.defaultTitleStyle);
    this.titleTextEl = Ext.get(this.titleEl.dom.firstChild);
    this.tools = Ext.get(this.titleEl.dom.childNodes[1], true);
    // }}}
    // {{{
    // set title
    if(this.title) this.setTitle(this.title);
    // }}}
    // {{{
    // create collapse button
    if(this.showPin) {
        this.stickBtn = this.createTool(this.tools.dom, 'x-layout-stick');
        this.stickBtn.enableDisplayMode();
        this.stickBtn.on('click', function(e, target) {
            e.stopEvent();
            this.pinned = ! this.pinned;
            this.updateCollapseBtn();
            this.fireEvent('pinned', this, this.pinned);
        }, this);
        this.stickBtn.hide();    
    }
    if(this.collapsible) {
        this.collapseBtn = this.createTool(this.tools.dom, (this.collapsed ? 'x-layout-collapse-east' : 'x-layout-collapse-south'));
        this.collapseBtn.enableDisplayMode();
        if('title' == this.trigger) {
            this.titleEl.addClass('x-window-header-text');
            this.titleEl.on("click", this.toggle, this);
        }
        else {
            this.collapseBtn.on("click", this.toggle, this);
        }
    }
    // }}}
    // {{{
    // create body if it doesn't exist yet
    if(!this.body) {
            this.body = dh.append(this.el, {
                tag: 'div'
                , cls: this.bodyClass || null
                , html: oldHtml || ''
                }, true);
    }
    this.body.enableDisplayMode();
    if(this.collapsed && !this.pinned) {
        this.body.hide();
    }
    else if(this.pinned) {
        this.body.show();
        this.collapsed = false;
        this.updateCollapseBtn();
    }
    if(!this.bodyClass) {
        this.body.applyStyles(this.defaultBodyStyle);
    }
    // }}}
        // {{{
    // add events
    this.addEvents({
        /**
            * @event beforecollapse
            * Fires before collapse is taking place. Return false to cancel collapse
            * @param {InfoPanel} this
            */
        beforecollapse: true
        /**
            * @event collapse
            * Fires after collapse
            * @param {InfoPanel} this
            */
        , collapse: true
        /**
            * @event beforecollapse
            * Fires before expand is taking place. Return false to cancel expand
            * @param {InfoPanel} this
            */
        , beforeexpand: true
        /**
            * @event expand
            * Fires after expand
            * @param {InfoPanel} this
            */
        , expand: true
        /**
            * @event pinned
            * Fires when panel is pinned/unpinned
            * @param {InfoPanel} this
            * @param {Boolean} pinned true if the panel is pinned
            */
        , pinned: true
        /**
            * @event animationcompleted
            * @Fires when animation is completed
            * @param {InfoPanel} this
            */
        , animationcompleted: true

    });
    // }}}
    // {{{
    // setup dragging
    if(this.draggable) {
        this.setDraggable(true);
    }
    // }}}
    // {{{
    // setup resizable
    if(this.resizable) {
        this.setResizable(true);
    }
    // }}}

    this.id = this.el.id;

}; // end of constructor

// extend
Ext.extend(Ext.InfoPanel, Ext.ContentPanel, {

    // defaults
    collapsible: true
    , collapsed: true
    , pinned: false
    , trigger: 'title'
    , animate: true
    , duration: 0.35
    , draggable: false
    , proxyDrag: false
    , resizable: false
    , docked: true
    , defaultBodyStyle: {
        'padding':'3px'
        , 'border-left':'1px solid #A9BFD3'
        , 'border-right':'1px solid #A9BFD3'
        , 'border-bottom':'1px solid #A9BFD3'
//        , 'font-size':'8pt'
//        , 'color':'black'
//        , 'background-color':'white'
    }
    , defaultTitleStyle: {
        'padding-left':'3px'
    }

    // {{{
    /**
        * Called internally to create collapse button
        * Calls utility method of Ext.LayoutRegion createTool
        */
    , createTool : function(parentEl, className){
        return Ext.LayoutRegion.prototype.createTool(parentEl, className);
  }
    // }}}
    // {{{
    /**
        * Set title of the InfoPanel
        * @param {String} title Title to set
        */
    , setTitle: function(title) {
        this.title = title;
        this.titleTextEl.update(title);
        if(this.icon) {
            this.titleTextEl.set({
                style: 'background-image:url(' + this.icon + ');background-repeat:no-repeat;background-position:0 50%;padding-left:20px;'
            });
        }
        return this;
    }
    // }}}
    // {{{
    /**
        * Get current title
        * @return {String} Current title
        */
    , getTitle: function() {
        return this.title;
        return this;
    }
    // }}}
    // {{{
    /**
        * Returns body element
        * This overrides the ContentPanel getEl for convenient access to the body element
        */
    , getEl: function() {
        return this.body;
    }
    // }}}
    // {{{
    /**
        * * Update the innerHTML of this element, optionally searching for and processing scripts
    * @param {String} html The new HTML
    * @param {Boolean} loadScripts (optional) true to look for and process scripts
    * @param {Function} callback For async script loading you can be noticed when the update completes
    * @return {Ext.Element} this
        */
    , update: function(html, loadScripts, callback) {
        this.body.update(html, loadScripts, callback);
        return this;
    }
    // }}}
    // {{{
    /**
        * Expands the panel
        * @return {InfoPanel} this
        */
    , expand: function() {
        if(!this.collapsed) {
            return this;
        }
        if(this.dd && this.dd.endingDrag) {
            this.dd.endingDrag = false;
            return this;
        }
        if(false === this.fireEvent('beforeexpand', this)) {
            return this;
        }
        this.collapsed = false;
        if(this.animate) {
                this.body.slideIn('t', {
                    easing: this.easingExpand || null //'backOut'
                    , scope: this
                    , duration: this.duration
                    , callback: this.updateCollapseBtn
                });
        }
        else {
            this.body.show();
            this.updateCollapseBtn();
        }
        this.fireEvent('expand', this);
        return this;
    }
    // }}}
    // {{{
    /**
        * Toggles the expanded/collapsed states
        */
    , toggle: function() {
            if(this.collapsed) {
                this.expand();
            }
            else {
                this.collapse();
            }
    }
    // }}}
    // {{{
    /**
        * Collapses the panel
        * @return {InfoPanel} this
        */
    , collapse: function() {

        if(this.collapsed || this.pinned) {
            return this;
        }

        if(this.dd && this.dd.endingDrag) {
            this.dd.endingDrag = false;
            return this;
        }

        if(false === this.fireEvent('beforecollapse', this)) {
                return this;
        }

        this.collapsed = true;
        if(this.animate) {
                this.body.slideOut('t', {
                    easing: this.easingCollapse || null //'backIn'
                    , scope: this
                    , duration: this.duration
                    , callback: this.updateCollapseBtn
                });
        }
        else {
            this.body.hide();
            this.updateCollapseBtn();
        }
        this.fireEvent('collapse', this);
        return this;
    }
    // }}}
    // {{{
    /**
        * Called internally to update class of the collapse button 
        * as part of expand and collapse methods
        */
    , updateCollapseBtn: function() {
            
            if(this.collapsed) {
                if(this.showPin) {
//                    Ext.fly(this.stickBtn.dom.firstChild).replaceClass('x-layout-stuck', 'x-layout-stick');
                    this.collapseBtn.show();
                    this.stickBtn.hide();
                }
                Ext.fly(this.collapseBtn.dom.firstChild).replaceClass('x-layout-collapse-south', 'x-layout-collapse-east');
            }
            
            // handle expanded state
            else {
                if(this.showPin) {
                    if(this.pinned) {    
                        Ext.fly(this.stickBtn.dom.firstChild).replaceClass('x-layout-stick', 'x-layout-stuck');
                    }
                    else {
                        Ext.fly(this.stickBtn.dom.firstChild).replaceClass('x-layout-stuck', 'x-layout-stick');
                    }
                    this.collapseBtn.hide();
                    this.stickBtn.show();
                }
                else {
                    Ext.fly(this.collapseBtn.dom.firstChild).replaceClass('x-layout-collapse-east', 'x-layout-collapse-south');
                }
            }

            // fire animationcompleted event
            this.fireEvent('animationcompleted', this);
    }
    // }}}
    // {{{
    /**
        * Creates toolbar
        * @param {Array} config Configuration for Ext.Toolbar
        * @param {Boolean} bottom true to create bottom toolbar. (defaults to false = top toolbar)
        * @return {Ext.Toolbar} Ext.Toolbar object
        */
    , createToolbar: function(config, bottom) {
            var create = {tag:'div'};
            config = config || null;
            this.body.applyStyles({padding:'0', border: '0', margin: '0'});
            if(bottom) {
                var tbEl = Ext.DomHelper.append(this.body, create);
            }
            else {
                var tbEl = Ext.DomHelper.insertFirst(this.body, create);
            }
            this.toolbar = new Ext.Toolbar(tbEl, config);
            return this.toolbar;
    }
    // }}}

//    , setContent: function(content) {
//        this.body.update(content);
//    }

    // todo: write disable here
    , setDraggable: function(enable) {
        if(this.proxyDrag) {
            this.proxy = this.el.createProxy('x-dlg-proxy');
            this.proxy.hide();
            this.proxy.setOpacity(.5);
            this.dd = new Ext.dd.DDProxy(this.el.dom, 'WindowDrag', {dragElId: this.proxy.id});
        }
        else {
            this.dd = new Ext.dd.DD(this.el.dom, 'WindowDrag');
            this.dd.endDrag = function(e) {
                this.endingDrag = true;
            };
        }
        this.dd.setHandleElId(this.titleEl.id);
    }

    , setResizable: function(enable) {
        if(!this.resizer) {
            this.resizer = new Ext.Resizable(this.el, {
                handles: 'w e'
                , minWidth: this.minWidth || null
                , maxWidth: this.maxWidth || null
                , transparent: true
            });
            this.resizer.on('resize', function(el, width, height, e) {
                el.el.setStyle('height', null);
            });
        }
        this.resizer.enabled = enable;
    }

});

// end of file  
?>
