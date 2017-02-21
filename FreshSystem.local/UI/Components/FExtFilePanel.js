/**
 * 
 * 
 *  * @author rosa
 */
Ext.namespace('Fresh');
/*
Ext.namespace('Ext.ux');

Ext.ux.FreshFileTreePanel = function(el, config) {
    Ext.ux.FreshFilePanel.superclass.constructor.call(this, el, config)
};	
	
Ext.extend(Ext.ux.FreshFileTreePanel, Ext.ux.FileTreePanel,{
});

*/

Fresh.FExtFilePanel =  {

	init: function(cfg) {
	var panelId = cfg.panelID;
	var rootName = cfg.rootName;
	var url = cfg.dataScript;
	var config = {
		animate: true
		, iconPath: 'FreshSystem/images/icons/fam'
		, dataUrl: url
		, waitMsg : 'Loading'
		, readOnly: false
		, containerScroll: true
		, enableDD: true
		, enableUpload: true
		, enableRename: true
		, enableDelete: true
		, enableNewDir: true
		, openActivePanel: 'Open in active panel'
		, openNewPanel: 'Open in new panel'
		, uploadPosition: 'menu'
//		, edit: true
//		, sort: true
		, maxFileSize: 1048575
		, hrefPrefix: 'images/'
//		, pgCfg: {
//			uploadIdName: 'UPLOAD_IDENTIFIER'
//			, uploadIdValue: 'auto'
//			, progressBar: false
//			, progressTarget: 'qtip'
//			, maxPgErrors: 10
//			, interval: 1000
//			, options: {
//				url: '../uploadform/progress.php'
//				, method: 'post'
//			}
//		}
	};
	
	Ext.apply(config,cfg);
	//alert(config.containerID);
	// tree in the panel
	//if (!Ext.get(panelId))
	//	alert('Bad filepanel ID '+panelId);
	if (config.containerID) {
		var ipTree = Ext.ComponentMgr.get(config.containerID);
		if (!ipTree)
			alert(config.containerID);
		var tree = new Ext.ux.FileTreePanel(ipTree.body,config);
	}
	else {	
		var tree = new Ext.ux.FileTreePanel(panelId,config);
	}
	var root = new Ext.tree.AsyncTreeNode({text:rootName, path:'root', allowDrag:false});
	tree.setRootNode(root);
	tree.render();

	onBeforeContextMenu = function(node) {
		// {{{
		// lazy create upload form
		this.createUploadForm();
		// }}}
		if(!this.contextMenu) {
			this.contextMenu = new Ext.menu.Menu({
				items: [
						// node name we're working with placeholder
					  { id:'nodename', disabled:true, cls:'x-filetree-nodename'}
					, {
						id: 'open'
						, text: this.openText + ' (Enter)'
						, icon: this.openIcon
						, scope: this
						, handler: this.onContextMenuItem
//						, menu: {}
/*
						{
							items: [
							  { id: 'open-self'
								, text: this.openActivePanel
								, icon: this.openSelfIcon
								, scope: this
								, handler: this.onContextMenuItem
							}
							,	{ id: 'open-popup'
								, text: this.openNewPanel
								, icon: this.openPopupIcon
								, scope: this
								, handler: this.onContextMenuItem
								}
							]
						}

*/					}
					, new Ext.menu.Separator({id:'sep-open'})
					, {	id:'reload'
						, text:this.reloadText + ' (Ctrl+E)'
						, icon:this.reloadIcon
						, scope:this
						, handler:this.onContextMenuItem
					}
					, {	id:'expand'
						, text:this.expandText + ' (Ctrl+' + this.rarrowKeyName + ')'
						, icon:this.expandIcon
						, scope:this
						, handler:this.onContextMenuItem
					}
					, {	id:'collapse'
						, text:this.collapseText + ' (Ctrl+' + this.larrowKeyName + ')'
						, icon:this.collapseIcon
						, scope:this
						, handler:this.onContextMenuItem
					}
					, new Ext.menu.Separator({id:'sep-collapse'})
					, {	id:'rename'
						, text:this.renameText + ' (F2)'
						, icon:this.renameIcon
						, scope:this
						, handler:this.onContextMenuItem
					}
					, {	id:'delete'
						, text:this.deleteText + ' (' + this.deleteKeyName + ')'
						, icon:this.deleteIcon
						, scope:this
						, handler:this.onContextMenuItem
					}
//					, new Ext.menu.Separator()
					, { id:'newdir'
						, text:this.newdirText + '... (Ctrl+N)'
						, icon:this.newdirIcon
						, scope:this
						, handler:this.onContextMenuItem
					}
					, new Ext.menu.Separator({id:'sep-upload'})
				]
			});
			switch(this.uploadPosition) {
				case 'menu':
					// add upload form at the end of context menu
					this.contextMenu.addElement(this.uploadForm.container).hideOnClick = false;

					// handle shadow on file add/remove to/from UploadForm
					var showShadow = this.contextMenu.getEl().shadow.show.createDelegate(this.contextMenu.getEl().shadow, [this.contextMenu.getEl()]);
					this.uploadForm.on({
						fileadded:{fn:showShadow}
						, fileremoved:{fn:showShadow}
						, clearqueue:{scope:this, fn:function() {
							this.uploadNode = null;
							showShadow();
						}}
					});
				break;

				case 'floating':
					this.contextMenu.add(new Ext.menu.Item({
						id:'upload'
						, text:this.uploadFileText + ' (Ctrl+U)'
						, icon:this.uploadIcon
						, scope:this
						, handler:this.onContextMenuItem
					}));
				break;
			}
		}
		return true;
	}
	onAfterContextMenu = function(node) {
		//this.contextMenu.items.get('open').menu = null;
	}
	onBeforeOpen = function(t,n,mode) {
		var type = Fresh.LangType(n.attributes.cls);
		//alert(type);
		switch (type) {
			case 'binary':
				BinaryView(tree,n);
				break;
			case 'image':
				ImageView(tree,n);
				break;
			default :
			Fresh.FExtCodePress(tree,n,type);
		}
		if (this.contextMenu)
			this.contextMenu.hide();
		this.fireEvent('open', this, n, mode);
		return false;
	}

	createNewPanel = function(name) {
		
	}
	
	BinaryView = function (tree,n) {
		var url = tree.getPath(n).replace(/root\//gi,tree.hrefPrefix) + tree.hrefSuffix;		
		var panelID = 'center'+Fresh.PANEL_COUNT;
		var iframeID = 'center'+Fresh.PANEL_COUNT+'iframe';
		Fresh.PANEL_COUNT++;
		var cdiv = Ext.DomHelper.append(document.body, {tag: 'div', id: panelID, visibility: 'hidden'});
		var ciframe = Ext.DomHelper.insertFirst(cdiv, {tag: 'iframe', frameBorder: 0, name: iframeID, id: iframeID});
		
		var mainLayout = Fresh.Layout;
		mainLayout.beginUpdate();
			mainLayout.add('center', centerPanel1 = new Ext.ContentPanel(panelID, {
	     		fitToFrame: true, autoScroll: true, title: 'Soubor: '+n.text, closable: true
				, resizeEl: iframeID
//				, adjustments: [20,-25]
	        }));
			mainLayout.getRegion('center').showPanel(panelID);
	
		mainLayout.endUpdate();
		
		Ext.fly(iframeID).dom.src = url;
	}
	
	ImageView =  function(tree,n)	{
	
		var url = tree.getPath(n).replace(/root\//gi,tree.hrefPrefix) + tree.hrefSuffix;
	//alert(url);
		var panelID = 'center'+Fresh.PANEL_COUNT;
		var imageID = 'center'+Fresh.PANEL_COUNT+'image';
		Fresh.PANEL_COUNT++;
	
		var cdiv = Ext.DomHelper.append(document.body, {tag: 'div', id: panelID, visibility: 'hidden'});
		var img = Ext.DomHelper.insertFirst(cdiv, {tag: 'img', id: imageID},true);
	
		var mainLayout = Fresh.Layout;
		mainLayout.beginUpdate();
			mainLayout.add('center', centerPanel1 = new Ext.ContentPanel(panelID, {
	     		fitToFrame: true, autoScroll: true, title: 'Obrázek: '+n.text, closable: true
	//			, resizeEl: textareaID
	//			, adjustments: [20,-25]
	        }));
			img.set({src: url});
			mainLayout.getRegion('center').showPanel(panelID);
	
		mainLayout.endUpdate();
	
	}

	tree.on('beforecontextmenu', onBeforeContextMenu.createDelegate(tree),this);
	tree.on('aftercontextmenu', onAfterContextMenu.createDelegate(tree),this);
	tree.on('beforeopen',onBeforeOpen.createDelegate(tree),this);
	root.expand();

}
}
Fresh.LangType = function(f) {
		switch (f) {
			case 'file-txt':
				return 'text'; 
			case 'file-cs':
				return 'csharp'; 
			case 'file-css':
				return 'css'; 
			case 'file-html':
			case 'file-htm':
			case 'file-xml':
			case 'file-tpl':
			case 'file-page':
			case 'file-xhtml':
				return 'html'; 
			case 'file-java':
				return 'java'; 
			case 'file-js':
				return 'javascript'; 
			case 'file-pl': 
				return 'perl'; 
			case 'file-ruby': 
				return 'ruby'; 
			case 'file-sql':
				return 'sql'; 
			case 'file-vb':
			case 'file-vbs':
				return 'vbscript'; 
			case 'file-php':
				return 'php'; 
			case 'file-jpg':
			case 'file-bmp':
			case 'file-png':
			case 'file-gif':
				return 'image'; 
			case 'file-doc':
			case 'file-xls':
			case 'file-odt':
			case 'file-pdf':
				return 'binary'; 
			default: 
				return 'generic';
		}
}
Fresh.FExtCodePress =  function(tree,n,type) {

	var sendRequest = function(c) {
				Ext.lib.Ajax.request(
            		'POST',
            		config.url,
            	    { success: function(x) { 
            	    		o = Ext.decode(x.responseText); 
							if (o.success)
	            	    		Fresh.statusMsg(o.message);  
							else
								Ext.MessageBox.alert("Chyba při ukládání!",o.message);
            	    		} , 
            	      failure: function() { Ext.Msg.Alert("Chyba při ukládání!"); }
            	     },
            		 Ext.apply(config.saveParams,{ path: tree.getPath(n), content: c })
        		);
	}
	
	var config = {
		url: 'index.php'
	  , waitMsgLoad: 'Loading'
	  , waitMsgTarget: true	
	  , saveParams:  { json: 'fileProvider', cmd: 'fileSave'  }
	  , readParams:  { json: 'fileProvider', cmd: 'fileRead'  }		
	}

	var formID = 'center'+Fresh.PANEL_COUNT+'form';
	var toolbarID = 'center'+Fresh.PANEL_COUNT+'toolbar';
	var panelID = 'center'+Fresh.PANEL_COUNT;
	var textareaID = 'center'+Fresh.PANEL_COUNT+'textarea';
	var textareaName = 'content'+Fresh.PANEL_COUNT;

	var cdiv = Ext.DomHelper.append(document.body, {tag: 'div', id: panelID, visibility: 'hidden'});
	var tbdiv = Ext.DomHelper.insertFirst(cdiv, {tag: 'div', id: toolbarID});
	var fdiv = Ext.DomHelper.append(cdiv, {tag: 'div', id: formID});

    var ta = Ext.DomHelper.insertFirst(fdiv, {tag: 'textarea'
	       						, id: textareaID
								, name: textareaName
								, style: 'width: 100px'});


	// create the primary toolbar
    var tb = new Ext.Toolbar(toolbarID);
    tb.add({
        id: toolbarID+'_savel',
        text:'Uložit',
        handler:function() { sendRequest(eval(textareaID+'.getCode()')); },
        cls:'x-btn-text-icon save',
        tooltip:'Uložit soubor'
    },'-',{
        id: toolbarID+'_reload',
        handler:function() {
		eval(textareaID+'.toggleEditor()');
		simple.load({ url:config.url, params: Ext.apply(config.readParams,{ path: tree.getPath(n), name: textareaName }), waitMsg: config.waitMsgLoad });
			},
        cls:'x-btn-text-icon reload',
        text:'Undo',
        tooltip:'Krok zpět'
    },'-',{
        id: toolbarID+'_toggle',
		text: 'Syntaxe',
		enableToggle: true,
		pressed: true,
        tooltip:'Vyp/Zap Codepress',
        cls:'x-btn-text-icon switch',
        toggleHandler:function() {
			eval(textareaID+'.toggleEditor()');
		}
    });
	
    // for enabling and disabling
    var btns = tb.items.map;
	
	var reload = function() {
		eval(textareaID+'.toggleEditor()');
		Ext.get(textareaID).
		simple.load({ url:config.url, params: Ext.apply(config.readParams,{ path: tree.getPath(n), name: textareaName }), waitMsg: config.waitMsgLoad });
	}	
	//alert('node open '+mode);

	var forms = Ext.query('FORM');
	simple = new Ext.form.BasicForm(forms[0],{
	    labelWidth: 0,
	    url: config.url
		,waitMsgTarget: formID
	});
	
	var tta = new Ext.form.TextArea({
			fieldLabel: '',
	        name: textareaName,
	        id: textareaID,
	        fieldClass: 'codepress x-form-field '+type
	    });
	tta.applyTo(ta);
	simple.add(tta);


	var mainLayout = Fresh.Layout;
	mainLayout.beginUpdate();
		mainLayout.add('center', centerPanel1 = new Ext.ContentPanel(panelID, {
     		fitToFrame: true, autoScroll: true, title: 'Editace: '+n.text, closable: true
			, resizeEl: textareaID
			, adjustments: [20,-25]
        }));
		mainLayout.getRegion('center').showPanel(panelID);

	mainLayout.endUpdate();

	simple.render('center'+Fresh.PANEL_COUNT+'-form');
	if( !Ext.isSafari ) {
		simple.on('actioncomplete',function(f,a) { 
			if (a.type=='load') { 
				CodePress.run();
				Ext.get(Ext.DomQuery.selectNode('#'+formID+' > IFRAME')
					.setStyle({ border: 0 }))
					.setWidth(Ext.DomQuery.selectNode('#'+formID+' > TEXTAREA'));
			}	 
		},this);
	}
	
	simple.load({ url:config.url, params: Ext.apply(config.readParams,{ path: tree.getPath(n), name: textareaName }), waitMsg: config.waitMsgLoad });
    setTimeout(function(){
		Fresh.PANEL_COUNT = 1 + Fresh.PANEL_COUNT;
    }, 10);
	
	centerPanel1.on('resize',function(cp,w,h) {
		var ciframe = Ext.DomQuery.selectNode('#'+formID+' > IFRAME');
		var tarea = Ext.DomQuery.selectNode('#'+formID+' > TEXTAREA');
//		alert(h+' / '+ciframe);
		
		if (ciframe) {
			Ext.get(ciframe).setSize(tarea.getWidth(),tarea.getHeight());
		}
	},this);
			
		
		
		

}

Fresh.statusMsg = function(msg) {
	var south = Fresh.Layout.getRegion('south');
	southPanel.setContent(msg);
	//south.show();
	//south.collapse();
	south.expand();
    setTimeout(function(){
	//	south.hide();
    }, 1000);
	
	
}

Ext.form.Action.SubmitUpload = function(form, options){
    Ext.form.Action.SubmitUpload.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.SubmitUpload, Ext.form.Action.Submit, {
    type : 'SubmitUpload',

    handleResponse : function(response){
        var re = /<pre>|<\/pre>/mgi;
		var text = response.responseText.replace(re,"");
		
		response.responseText = text;
		if(this.form.reader){
            var rs = this.form.reader.read(response);
            var data = rs.records && rs.records[0] ? rs.records[0].data : null;
            return {
                success : rs.success,
                data : data
            };
        }
        return Ext.decode(response.responseText);
//        return response;
    }
	
});
Ext.form.Action.ACTION_TYPES['SubmitUpload'] = Ext.form.Action.SubmitUpload;

Ext.onReady(function(){
	Ext.override(Ext.ux.UploadForm,{
		submit: function(options){
	        this.doAction('SubmitUpload', options);
	        return this;
	    }
	});
});