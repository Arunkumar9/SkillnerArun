// vim: ts=4:sw=4:nu:fdc=4:nospell
/**
 * Ext.ux.MetaForm
 *
 * @author    Ing. Jozef Sakalos
 * @copyright (c) 2008, by Ing. Jozef Sakalos
 * @date      6. February 2007
 * @version   $Id: Ext.ux.TabbedMetaForm.js 2348 2013-12-20 10:20:54Z arun $
 *
 * @license Ext.ux.MetaForm is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

/*global Ext */


/**
 *
 * @class Ext.ux.MetaForm
 * @extends Ext.FormPanel
 */
 Ext.override(Ext.ux.MetaForm, {
    // configurables
     autoInit:true
    ,border:false
    ,frame: true
    ,loadingText:'Loading...'
    ,savingText:'Saving...'
    ,buttonMinWidth:90
    ,columnCount:1
    ,autoScroll: false
    ,layout: 'fit'
    ,title: 'Edit'
    /**
     * createButtons {Array} array of buttons to create
     *         valid values are ['meta', 'load', defaults', 'reset', 'save', 'ok', 'cancel']
     */
    /**
     * ignoreFields: {Array} of field names to ignore when received in metaData
     */

    // {{{
    ,initComponent:function() {

        // create one item to avoid error
        Ext.apply(this, {
            items:this.items || {}
        }); // eo apply

        // get buttons if we have button creation routines
        if('function' === typeof this.getButton) {
            this.buttons = this.getButtons();
        }
        this.layout = 'fit';
        // call parent
        Ext.ux.MetaForm.superclass.initComponent.apply(this, arguments);

        this.addEvents('cancel', 'ok');

        // install event handlers on basic form
        this.form.on({
             beforeaction:{scope:this, fn:this.beforeAction}
            ,actioncomplete:{scope:this, fn:function(form, action) {
                // (re) configure the form if we have (new) metaData
                if('load' === action.type && action.result.metaData) {
                    this.onMetaChange(this, action.result.metaData);
                }
                // update bound data on successful submit
                else if('submit' === action.type) {
                    this.updateBoundData();
                }
            }}
        });
        this.form.trackResetOnLoad = true;

    } // eo function initComponent
    // }}}
    // {{{
    /**
     * Override this if you need a custom functionality
     *
     * @param {Ext.FormPanel} this
     * @param {Object} meta Metadata
     * @return void
     */
    ,onMetaChange:function(form, meta) {
        this.removeAll();

        // declare varables
        var columns, colIndex, tabIndex, ignore = {},tabs, targettab;
        this.setTitle(meta.formConfig.title);
        // add column layout
        this.add(new Ext.TabPanel({
             //layout:'column'
             anchor:'95%'
            ,title: meta.formConfig.title
            ,activeTab: 0
            ,minTabWidth: 70
            ,border:false
            ,frame: true
            ,autoScroll: true
            ,deferredRender:false
            ,defaults:(function(){
                this.columnCount = meta.formConfig ? meta.formConfig.columnCount || this.columnCount : this.columnCount;
                return Ext.apply({}, meta.formConfig || {}, {
                     columnWidth:1/this.columnCount
                    ,autoHeight:false
                    ,border:false
                    ,frame: true
                    ,hideLabel:true
                    ,autoScroll: true
                    ,anchor: '100% 100%'
                    ,layout:'form'
                });
            }).createDelegate(this)()
            ,items:(function(){
                var items = [];
                for(var i = 0; i < this.columnCount; i++) {
                    var title = meta.formConfig ? meta.formConfig.titles[i] || i : i;
                    items.push({
                         defaults:this.defaults
                        ,title:  __(title)
                        ,itemId: title
/*                        ,items: [
                            {
                                layout: 'form'
                                ,defaults:this.defaults
                                ,autoScroll: true
                                ,listeners:{
                                    // otherwise basic form findField does not work
                                    add:{scope:this, fn:this.onAdd}
                                }
                            }
                        ]
  */                      ,listeners:{
                            // otherwise basic form findField does not work
                            add:{scope:this, fn:this.onAdd}
                        }
                    });
                }
                return items;
            }).createDelegate(this)()
        }));

        columns = this.items.get(0).items;
        tabs = this.getComponent(0);
        colIndex = 0;
        tabIndex = 1;

        if(Ext.isArray(this.ignoreFields)) {
            Ext.each(this.ignoreFields, function(f) {
                ignore[f] = true;
            });
        }
        // loop through metadata colums or fields
        // format follows grid column model structure meta.columns ||
        Ext.each(meta.fields, function(item) {
            if(true === ignore[item.name]) {
                return;
            }
            var config = Ext.apply({}, item.editor, {
                 name:item.name || item.dataIndex
                ,fieldLabel:item.fieldLabel || item.header
                ,defaultValue:item.defaultValue
                ,xtype:item.editor && item.editor.xtype ? item.editor.xtype : 'textfield'
            });

            // handle regexps
            if(config.editor && config.editor.regex) {
                config.editor.regex = new RegExp(item.editor.regex);
            }

            if (item.editor && item.editor.items) {
                config.items = item.editor.items;
                config.listeners = (function(){
                            // otherwise basic form findField does not work
                            return {add:{scope:this, fn:this.onAdd}};
                        }).createDelegate(this)();
            }

            // to avoid checkbox misalignment
            if('checkbox' === config.xtype) {
                Ext.apply(config, {
                      boxLabel:' '
                     ,checked:item.defaultValue
                });
            }
            if(meta.formConfig.msgTarget) {
                config.msgTarget = meta.formConfig.msgTarget;
            }

            // add to columns on ltr principle
            config.tabIndex = tabIndex++;
            //columns.get(item.).add(config);
            if (targettab = tabs.getComponent(item.forTab || 0))
                targettab.add(config);
            else
                tabs.getComponent(0).add(config);

            colIndex = colIndex === this.columnCount ? 0 : colIndex;

        }, this);
        this.doLayout();
        this.getComponent(0).setActiveTab('Content');
    } // eo function onMetaChange
    // }}}

});

// eof 