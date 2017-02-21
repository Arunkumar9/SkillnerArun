Ext.app.taskCmpModule = Ext.extend(Ext.app.Module, {
    
    iconCls: this.iconCls || 'icon-'+this.id,
	init : function(){
        this.iconCls = this.iconCls || 'icon-'+this.id;
		this.launcher = {
			text: this.text,
			iconCls: this.iconCls,
			handler : this.createWindow,
			scope: this
		}
	},

	createWindow : function(locals){
		locals = locals || {};
        var aResult,aUsing;
        var sObj, oObj;
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow(this.id+'-task-'+locals.task);

		var createWindowCallback = function(res) {
                aResult = res.responseText.split('/* --- */');
                parseAnswer();
        }
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
                                Fresh.global[oObj.name] = Ext.decode.call(locals, oObj.definition);
                        }
                        else {
                            if (oObj.evalTo == 'local' || !oObj.evalTo) 
                                if (oObj.overwrite || !Ext.type(locals[oObj.name])) {
                                    var obj = Ext.decode.call(locals, oObj.definition);
                                    locals[oObj.name] = obj;
                                }
                        }
                    }
                    var JSON = Ext.decode.call(locals, aResult[0]);
                    
                    if (JSON.success) {
                        var extcls = ('function'=== typeof JSON.extcls)?JSON.extcls : Ext.Window;
						JSON.id = this.id+'-task-'+locals.task;
						win = desktop.createWindow(JSON,extcls);
                        Ext.MessageBox.hide();
                        win.show();
                    }
                    else {
                        Ext.MessageBox.hide();
                        Ext.MessageBox.alert(__('Error'), JSON.message);
                    }
                    if ('function' === typeof locals.callback) 
                        locals.callback.call(this, win);
                
		};
        var notifier = {
            onLoad: Ext.emptyFn,
			onSuccess: Ext.emptyFn,
			onFailure: Ext.emptyFn,
			onStart: Ext.emptyFn,
            onComplete: parseAnswer,
			init: Ext.emptyFn
        }
        
        locals.actions = MyDesktop.actions;

		if(!win){
       
     Ext.MessageBox.show({
                       msg: __('Launching') + ' ' + this.launcher.text + '...',
                       progressText: __('Please wait ...'),
                       width:300,
                       wait:true,
                       waitConfig: {interval:200},
                       icon:'mb-loading-icon'
//                       ,animEl: 'mb7'
                   });	

       		locals.winWidth = desktop.getWinWidth() / 1.1;
			locals.winHeight = desktop.getWinHeight() / 1.1;
			locals.desktop = desktop;
            locals.maxWidth = function(w,f) {
                return parseFloat(this.winWidth*f) < w+1 ? parseFloat(this.winWidth*f) : w
            };
            locals.maxHeight = function(w,f) {
                return parseFloat(this.winHeight*f) < w+1 ? parseFloat(this.winHeight*f) : w
            };

			Ext.Ajax.request({
	                url: Fresh.Config.Service.TaskCmp, 
					params: {task: locals.task }, 
					success: createWindowCallback.createDelegate(this) , 
					scope: this
			});				
		} 
		else {
			win.show();
		}

	}
	
});


