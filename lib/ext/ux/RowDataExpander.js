/**
 * @author rosa
 */
Ext.namespace('Ext.ux.grid');

Ext.ux.grid.RowDataExpander = Ext.extend(Ext.ux.grid.RowExpander, {

     init: function(grid) {

         Ext.ux.grid.RowDataExpander.superclass.init.apply(this,arguments);

         if (Ext.isString(this.grid.linkedForm)){
            Ext.ComponentMgr.onAvailable(grid.linkedForm,function(fr){
                grid.linkedForm = fr;
                grid.linkedForm.on('actioncomplete',this.onFormActionComplete,this);
                grid.linkedForm.on('beforeaction',this.onFormBeforeAction,this);
               // this.refreshExpands();
            },this);
         }

         grid.store.on('load',this.refreshExpands,this,{single: true});

     },
     tpl: new Ext.XTemplate('<tpl for="data"><div class="data-item-wrap {cls}" data="{id}">{date}</div></tpl>'),
     onMouseDown : function(e, t){
        var id,row;
        e.stopEvent();
        if (row = e.getTarget('.x-grid3-row')) {
            var record = this.grid.store.getAt(row.rowIndex);
            var node = e.getTarget('.data-item-wrap');
            if (node){
                id = Ext.fly(node).getAttribute('data');
                this.loadLinkedForm(this.grid,record,id);
            } else {
                if (node = e.getTarget('.x-grid3-row-expander')) {
                        this.suspendEvents(false);
                        this.toggleRow(row);
                        this.resumeEvents();
                }
            }
        }
    },
    refreshExpands: function(st,recs,o) {
       var id;
       this.suspendEvents(false);
       Ext.select('#'+this.grid.id+' .x-grid3-row-expanded').each(function(el,c,idx) {
                var row = el.getAttribute('rowIndex');
                //this.collapseRow(row);

                this.expandRow(row);
       },this);
       this.resumeEvents();
       if (id = this.grid.linkedForm.formBaseParams.id) {
           Ext.select('#'+this.grid.id+' .data-item-wrap[data!='+id+']').removeClass('session-current');
           Ext.select('#'+this.grid.id+' .data-item-wrap[data='+id+']').addClass('session-current');
       }
       this.init(this.grid);
    },

// @private
    onRender: function() {
        var grid = this.grid;
        var mainBody = grid.getView().mainBody;
        mainBody.on('mousedown', this.onMouseDown, this);//, {delegate: '.x-grid3-row-expander'});
        if (this.expandOnEnter) {
            this.keyNav = new Ext.KeyNav(this.grid.getGridEl(), {
                'enter' : this.onEnter,
                scope: this
            });
        }
        if (this.expandOnDblClick) {
            grid.on('rowdblclick', this.onRowDblClick, this);
        }
        this.on('expand',this.onExpandOpen,this);
    },
    onExpandOpen: function(re,record,be,rowIndex) {
            var item = Ext.fly(be).first();

            if (item) {
                this.loadLinkedForm(this.grid, record, item.getAttribute('data'));
            }

    },
    loadLinkedForm: function(grid,record,id) {

	grid.linkedForm.enable();
        var formParams = grid.linkedForm.formBaseParams || {};
        Fresh.console.log(record);
        formParams.id = id;
        formParams.action = 'load';

        var msgTemplate = grid.linkedForm.loadingMsg || 'Loading customer {Name}';
        msgTemplate = new Ext.Template(msgTemplate).applyTemplate(record.data || record.attributes);
        var formInfoField = grid.infoField || 'Name';
        grid.linkedForm.load({
            params: formParams,
            waitMsg: msgTemplate,
            success: function() {
                    var sc;
                    var scv;
                grid.linkedForm.enable();
	            try {
                        grid.linkedForm.getForm().reset();
	                if (ct = grid.linkedForm.ownerCt)
                            ct.setTitle(ct.initialConfig.title+': '+record.get(formInfoField));
                        Ext.select('#'+grid.id+' .data-item-wrap[data!='+id+']').removeClass('session-current');
                        Ext.select('#'+grid.id+' .data-item-wrap[data='+id+']').addClass('session-current');
	            } catch (e) {}
                    if (parseInt(id.split('S')[1])==0) {

                        sc = grid.linkedForm.getForm().findField('SessionCreatedAsDateTime');
                        scv = sc.getValue();
                        sc.setValue(scv.add(Date.SECOND, 5));
                    }
                    grid.linkedForm.allowNameChange = null;
            }
        });

        var chstore = Ext.StoreMgr.lookup('sessions-chart-store');
        chstore.baseParams.id  = id.split('S')[0];
        chstore.reload();

        var lg = grid.linkedForm.linkedGrid;
        if (lg) {
            lg.store.baseParams.filter = id;
            lg.store.baseParams.context = 'data-'+grid.id;

            if (true || lg.isVisible()) {
                //lg.store.load({params: {meta: !lg.store.noMeta}});
                lg.store.load({
                    params: {
                        meta:!lg.isVisible()
                    }
                });
                lg.store.noMeta = true;
            }
            lg.customerChanged = !lg.isVisible();
            //pref.syncSize();
            //lg.doLayout();
        }
    },
    onFormActionComplete : function(bform,action)
    {
        var st,rec,found,id,grid,row;
        Fresh.console.log('Completed '+action.type);

        if (action.type == 'submit')
        {
            st = this.grid.store;
            grid = this.grid;
            id = action.result.CustNo;
            var rec = st.getById(id.split('S')[0]);
            var d = bform.findField('SessionCreatedAsDateTime').getValue();;

            if (!rec) {
                var clientId = id.split('S')[0];
                rec = new st.recordType({},clientId);
                rec.set('Name',bform.findField('FirstnameC').getValue()+' '+bform.findField('SurnameC').getValue());
                rec.set('Phone',bform.findField('Phone').getValue());
                rec.set('Created',bform.findField('SessionCreatedAsDateTime').getValue());
                rec.set('data',[{id: id, date: d.format('d.m.Y H:i'),cls: 'icon-session-open'},
                                {id: clientId+'S0', date: __('new session'), cls: 'icon-session-new'}
                               ]);
                rec.set('ImprintCount',0);
                st.insert(0,rec);
                grid.getView().refresh();
                this.suspendEvents(false);
                this.expandRow(0);
                this.resumeEvents();

            }

            data = rec.get('data');
            for(var i=0;i<data.length;i=i+1) {
                if (data[i].id != id) {
                    if (data[i].cls == 'icon-session-open') data[i].cls = 'icon-session-locked';
                    continue;
                }
                found = true;
                break;
            }
            var f = grid.linkedForm.getForm();
            if (!found) {
                data.unshift({id: id, date: d.format('d.m.Y H:i'),cls: 'icon-session-open'});
            } else {
                data[i].date = d.format('d.m.Y H:i');
            }
            grid.getSelectionModel().selectRecords([rec]);
            row = Ext.select('#'+grid.id+' .x-grid3-row-selected').first().getAttribute('rowIndex');
            if (row>=0) {
                this.collapseRow(row);
                this.suspendEvents(false);
                this.expandRow(row);
                this.resumeEvents();
            } 
               
            
            Ext.select('#'+grid.id+' .data-item-wrap[data!='+id+']').removeClass('session-current');
            Ext.select('#'+grid.id+' .data-item-wrap[data='+id+']').addClass('session-current');
            grid.linkedForm.allowNameChange = null;
            if (Fresh.global.SessionsChartStore)
                Fresh.global.SessionsChartStore.reload();
        }
    },
    onFormBeforeAction:  function(bform,action) {
        var st,rec,form,s,fi,id,panel;
        s = bform.findField('SurnameC');
        fi = bform.findField('FirstnameC');
        form = fi.findParentByType('form');

        if (action.type == 'submit') {

            if (panel = form.ownerCt) {
              id = parseInt(form.formBaseParams.id.split('S')[0]);
              if (!id || form.allowNameChange || (!fi.isDirty() && !s.isDirty())) {
                    return true;
              } else {
                if (fi.isDirty()) fi.markInvalid();
                if (s.isDirty()) s.markInvalid();
                Ext.MessageBox.confirm(__('Confirm'), __('name.change.really'), function(btn, text){
                  if (btn == 'yes') {
                    form.allowNameChange = 1;
                    fi.clearInvalid();
                    s.clearInvalid();
                    bform.doAction(action);
                    st = this.grid.store;
                    rec = st.getById(id);
                    rec.set('Name',s.getValue()+' '+fi.getValue());
                    rec.commit();
                  } else {
                    s.reset();
                    fi.reset();
                    panel.setTitle(form.initialConfig.title+': '+s.getValue()+' '+fi.getValue());
                  }
                },this);
              }
            }
            return false;
        }
        return true;
    }


});
Ext.preg('prowdataexpander',Ext.ux.grid.RowDataExpander);

