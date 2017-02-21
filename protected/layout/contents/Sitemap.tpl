<div class="sitemap <%= $this->cssClass %>" >
<h2>Sortiment</h2>
<com:FContainerListMenu id="sortiment" MaxLevel="3"
							  MaxItems="0"
							  cssClass="sitemap"
							  JustLinks="false"
							  EnableJS="false"
							  GenerateAll="true"
							  RootId="Sortiment" />

<h2>Hlavní nabídka</h2>
<com:FContainerListMenu id="menu" MaxLevel="3"
							  MaxItems="0"
							  cssClass="sitemap"
							  JustLinks="false"
							  EnableJS="false"
							  GenerateAll="true"
							  RootId="HORNI MENU" />

<h2>Ostatní obsah webu</h2>
<com:FContainerListMenu id="help" MaxLevel="3"
							  MaxItems="0"
							  cssClass="sitemap"
							  JustLinks="false"
							  EnableJS="false"
							  GenerateAll="true"
							  RootId="HELP" />
<com:FContainerListMenu id="aktuality" MaxLevel="3"
							  MaxItems="0"
							  cssClass="sitemap"
							  JustLinks="false"
							  EnableJS="false"
							  GenerateAll="true"
							  RootId="AKTUALITY" />
<com:FContainerListMenu id="informace" MaxLevel="3"
							  MaxItems="0"
							  cssClass="sitemap"
							  JustLinks="false"
							  EnableJS="false"
							  GenerateAll="true"
							  RootId="INFORMACE" />
</div>
<com:FWidgetControl ID="MetaData">
properties:
	-	maxlevel
	-	rootid
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[RootId]%>
		name: <%= $this->MetaData->getFieldName('rootid') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[MaxLevel]%>
		name: <%= $this->MetaData->getFieldName('maxlevel') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
</com:FWidgetControl>	
