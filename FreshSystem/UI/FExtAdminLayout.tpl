<com:TPanel ID="Container" style="position:absolute; width: 100%; height: 100%" > 

	<div id="north-div" class="x-layout-panel-hd">
		<com:TActivePanel ID="north" >
		<H1 style="float: left;"><%= $this->Page->Title %></H1>
		<H2 style="float: right; width: 200px">Přihlášen: <%= Prado::getApplication()->User->getName() %> / Úroveň: <%= Prado::getApplication()->User->getLevel() %></H2>
		</com:TActivePanel>
	</div>

	<div id="east-div">
		<com:FExtAccordion id="eastAccordion" >
			<prop:JSOptions containerID="east-div" title="Toolbox"/>		

			<com:FExtInfoPanel ID="buttonPanel" inContainer="FExtAccordion" >
				<prop:JsOptions title="Actions" icon="wrench.png" animate="false" />
				<div>Actions</div>

				<com:FExtButton ButtonType="Button" inContainer="FExtInfoPanel" ID="logout" Text="logout" OnClick="Page.Logout" IconCls="exit" />

			</com:FExtInfoPanel>

			<com:TPlaceHolder  Visible="<%= $this->Page->CanAccessTypesPanel %>" >
				<com:FExtInfoPanel ID="filesPanel" inContainer="FExtAccordion" >
					<prop:JsOptions icon="monitor.png" />
						<div>Filemanager</div>
					    <com:FExtFilePanel id="Files" inContainer="FExtInfoPanel"  >
							<prop:JsOptions rootName="Files" hrefPrefix="protected/" dataScript="index.php?json=fileProvider" />
						</com:FExtFilePanel >
				</com:FExtInfoPanel>
			</com:TPlaceHolder>
				<com:FExtInfoPanel ID="helpPanel" inContainer="FExtAccordion" >
					<prop:JsOptions icon="help.png" />
						<div>Help</div>
				</com:FExtInfoPanel>
		</com:FExtAccordion>
	</div>
	
	<com:TPlaceHolder  Visible="true" >
	<div id="images" >
	    <com:FExtFilePanel id="Images" >
			<prop:JsOptions rootName="Resources" dataScript="index.php?panel=Resources&json=fileProvider" />
		</com:FExtFilePanel >
	</div>
	</com:TPlaceHolder>
	
	<com:TPlaceHolder  Visible="<%= $this->Page->CanAccessTypesPanel %>" >
	<div id="types" >
	    <com:FExtTree id="Types" >
			<prop:JsOptions rootName="Types" params="{json:'loadTypes'}" StoreParams="storeContainer"   />
		</com:FExtTree>
	</div>
	</com:TPlaceHolder>
	
	<com:TPlaceHolder Visible="<%= $this->Page->CanAccessUsersPanel %>" > 
	<div id="users" >
	    <com:FExtTree id="Users" >
			<prop:JsOptions rootName="Users" params="{json:'loadUsers'}" StoreParams="storeContainer"  />
		</com:FExtTree>
	</div>
	</com:TPlaceHolder>
	
	<div id="menu" >
		<com:FExtTree id="Navigation" >
			<prop:JsOptions params="{json:'treenodes'}" rootName="Navigation" StoreParams="storeContainer" />
		</com:FExtTree>
	</div>
	
	<div id="center" >
		<iframe id="center-iframe" name="center-iframe" frameborder="0" scrolling="auto" style="border:0px none;"></iframe>
	</div>
	
	<div id="south-div" >
		<com:TActivePanel ID="south" >
			<com:TJavascriptLogger Visible="<%= false && ( (Prado::getApplication()->User->Name == 'JR' || $this->Page->Request->ServerName == 'localhost') ) %>"/>
		</com:TActivePanel>
	</div>

</com:TPanel>
<!---
<com:FClientEndScript>
Ext.onReady(function() { Fresh.AdminLayout('<%= $this->Container->ClientID %>'); });
</com:FClientEndScript>
--->
