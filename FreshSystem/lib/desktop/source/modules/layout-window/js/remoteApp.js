Ext.app.remoteModule = Ext.extend(Ext.app.Module, {
    
    iconCls: this.iconCls || 'icon-'+this.id,
    init : function(){
           
        this.iconCls = this.iconCls || 'icon-'+this.id;
        this.launcher = {
            text: this.text,
            slideOnly: this.slideOnly,
            iconCls: this.iconCls,
            handler : this.createWindow,
            scope: this
        }
        this.locals = {};
    },

    createWindow : function(locals){
        this.locals = Ext.apply(this.locals, locals || {});
        var aResult,aUsing;
        var sObj, oObj;
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        var scopedDecode = function(js_source_text){
        	var json = js_beautify(js_source_text, {
        	'indent_size': 1,
        	'indent_char': '\t'
        	});
        	return eval("(" + json + ')//@ sourceURL='+win_id+'.yml');
        	};
        	var win_id = this.id;

        var createWindowCallback = function(res) {
            aResult = res.responseText.split('/* --- */');
            parseAnswer.call(this);
        }
        var scopedDecode = function(js_source_text){
			var json = js_beautify(js_source_text, {
					'indent_size': 1,
					'indent_char': '\t'
				});
			return eval("(" + json + ')//@ sourceURL='+win_id+'.yml');
		};
        var parseAnswer = function() {
            while (aResult.length>1) {
                sObj = aResult.shift();
                oObj = Ext.decode(sObj);
                if (Ext.type(Fresh.SmartLoader) && (aUsing = oObj.using)) {
                    var fl = new Fresh.SmartLoader();
                    fl.start(aUsing,notifier);
                    return;
                }
                if (oObj.evalTo == 'global') {
                    if (oObj.overwrite || !Ext.type(Fresh.global[oObj.name]))
                        Fresh.global[oObj.name] = Ext.decode.call(this.locals, oObj.definition);
                }
                else {
                    if (oObj.evalTo == 'local' || !oObj.evalTo)
                        if (oObj.overwrite || !Ext.type(this.locals[oObj.name])) {
                            var obj = Ext.decode.call(this.locals, oObj.definition);
                            this.locals[oObj.name] = obj;
                        }
                }
            }
            //var JSON = Ext.decode.call(locals, aResult[0]);
            var JSON = scopedDecode.call(this.locals, aResult[0]);
                    
            if (JSON.success) {
                var extcls = ('function'=== typeof JSON.extcls)?JSON.extcls : Ext.Window;
                this.locals.win = desktop.createWindow(JSON,extcls);
                if (!this.locals.win.hideMsgMyself)
                    Ext.MessageBox.hide();
                if (this.launcher.slideOnly)
                    Fresh.Msg.SlideBox(__('Loaded!'), this.launcher.text);
                if (!this.locals.win.neverShow) this.locals.win.show();
            //this.win = win
            }
            else {
                Ext.MessageBox.hide();
                Ext.MessageBox.alert(__('Error'), JSON.message);
            }
            if ('function' === typeof this.locals.callback)
                this.locals.callback.call(this, win);
                
        };
        var notifier = {
            onLoad: Ext.emptyFn,
            onSuccess: Ext.emptyFn,
            onFailure: Ext.emptyFn,
            onStart: Ext.emptyFn,
            onComplete: parseAnswer.createDelegate(this),
            init: Ext.emptyFn
        }
        
        this.locals.actions = MyDesktop.actions;
        this.locals.remoteComponent = function(cfg) {
            config = { };//loadOn: 'show' 
            config.scope = this.locals || this;
            config.url = Fresh.Config.Service.Cmp;
            config.params = {
                id: cfg.id
            };
            return new Ext.ux.Plugin.RemoteComponent(config);
        }
        

        if(!win){
            if (!this.launcher.slideOnly) {
                Ext.MessageBox.show({
                    msg: __('Launching') + ' ' + this.launcher.text + '...',
                    progressText: __('Please wait ...'),
                    width:300,
                    wait:true,
                    waitConfig: {
                        interval:200
                    },
                    icon:'mb-loading-icon'
                //                       ,animEl: 'mb7'
                });
            }
            this.locals.winWidth = desktop.getWinWidth() / 1.1;
            this.locals.winHeight = desktop.getWinHeight() / 1.1;
            this.locals.desktop = desktop;
            this.locals.maxWidth = function(w,f) {
                return parseFloat(this.winWidth*f) < w+1 ? parseFloat(this.winWidth*f) : w
            };
            this.locals.maxHeight = function(w,f) {
                return parseFloat(this.winHeight*f) < w+1 ? parseFloat(this.winHeight*f) : w
            };
            this.locals.testAction = new Ext.Action({
                text: 'Test',
                handler: function(b) {
                    Fresh.console.log(arguments);
                    Fresh.console.log(b.getXType());
                },
                minWidth: 75
            });
            Ext.Ajax.request({
                url: Fresh.Config.Service.Cmp,
                params: {
                    id: this.id
                    },
                success: createWindowCallback, //.createDelegate(this) ,
                scope: this
            });
        }
        else {
            if (!win.neverShow) win.show();
        }

    }
	
});


