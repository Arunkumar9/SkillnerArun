<com:THead>
	<com:TClientScript  ScriptUrl="http://api.mapy.cz/main?key=<%= $this->ApiKey %>&ver=3&encoding=utf-8"></com:TClientScript>
</com:THead>
<com:TPanel id="seznamMap" cssClass="seznamMap" Attributes.style="width:<%= $this->width %>;height:<%= $this->height %>;<%= $this->cssStyle %>"></com:TPanel>
<com:TClientScript >
  if(SZN.isSupported){
  	 var mapa = new SZN.MapEngine(document.getElementById('<%= $this->seznamMap->ClientID %>'));
 // nastaveni stupne priblizeni
      mapa.zoomSet(<%= $this->Zoom %>);
// nastaveni mysi
	  mapa.mouseSet(<%= $this->Mouse %>);

      /*
        nastaveni stredu mapy na souradnice:
        50°4'17.7"N
        14°24'2.83"E
      */
      // nejdrive prevedem souradnice na interni souradnicovy system
      var pp = mapa.wgsToPP('<%= $this->Lat %>','<%= $this->Lng %>');

      // a nyni nastavime novy stred
      mapa.setCenter(pp.x,pp.y);

      // vytvorime znacku
      var mark = mapa.makeMark('center','<%= $this->MarkerText %>');

      // umistime znacku do mapy na drive vypoctene souradnice
      mapa.addMark(pp.x,pp.y,mark);
	//80a83688a
  }
</com:TClientScript>
<com:FWidgetControl ID="MetaData">
properties:
	-	apikey
	-	markertext
	-	zoom
	-	mouse
	-	lat
	-	lng
	-	width
	-	height
	-	cssstyle
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Api Key]%>
		name: <%= $this->MetaData->getFieldName('apikey') %>
		editor:
			xtype: textfield
			allowBlank: false
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Marker Text]%>
		name: <%= $this->MetaData->getFieldName('markertext') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Width]%>
		name: <%= $this->MetaData->getFieldName('width') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Height]%>
		name: <%= $this->MetaData->getFieldName('height') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Lattitude (50°5m41.86"N)]%>
		name: <%= $this->MetaData->getFieldName('lat') %>
		editor:
			xtype: textfield
			allowBlank: false
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Longitude (14°24m9.03"E)]%>
		name: <%= $this->MetaData->getFieldName('lng') %>
		editor:
			xtype: textfield
			allowBlank: false
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Zoom]%>
		name: <%= $this->MetaData->getFieldName('zoom') %>
		editor:
			xtype: numberfield
			allowBlank: true
			anchor: 90%
</com:FWidgetControl>