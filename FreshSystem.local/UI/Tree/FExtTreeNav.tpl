<div ID="<%= $this->ClientID %>" >
</div>
<com:FClientEndScript >
    
    Ext.namespace('Foto','Fresh');
    Ext.QuickTips.init();
	// Apply a set of config properties to the singleton
    Ext.apply(Ext.QuickTips.getQuickTip(), {
        maxWidth: 200,
        minWidth: 60,
        showDelay: 50,
        trackMouse: true
    });
    Foto.treeCallback = function(n,e) {
        	var request = <%= $this->Page->{$this->ClickHandler}->ActiveControl->Javascript %>;
            request.setCallbackParameter(n.id);
            request.dispatch();           
    }       

    var tree = new Ext.tree.TreePanel({
        renderTo: '<%= $this->ClientID %>',
        useArrows:true,
        autoScroll:true,
        animate:true,
        enableDD:true,
        height: 500,
        rootVisible: false,
        containerScroll: true, 
        listeners: {
            'click': Foto.treeCallback
        },
        loader: new Ext.tree.TreeLoader({
            dataUrl:'<%= $this->DataUrl %>'
        }),
        root: new Ext.tree.AsyncTreeNode({
            text: '<%= $this->RootName %>',
            draggable: false,
            id:'<%= $this->RootId %>'
        })
    });

    if ('<%= $this->OpenAtPath %>') {
        tree.selectPath('<%= $this->OpenAtPath %>','id',function(s,n){if (s) n.expand() });
    }
    else
        tree.root.expand();
</com:FClientEndScript>

