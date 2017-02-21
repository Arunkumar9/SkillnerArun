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
      var pp = mapa.wgsToPP('<%= addSlashes($this->Lat) %>','<%= addSlashes($this->Lng) %>');

      // a nyni nastavime novy stred
      mapa.setCenter(pp.x,pp.y);

      // vytvorime znacku
      var mark = mapa.makeMark('center','<%= $this->MarkerText %>');

      // umistime znacku do mapy na drive vypoctene souradnice
      mapa.addMark(pp.x,pp.y,mark);
	//80a83688a
	
	 
	// box pro pridani ovladacich prvku
	var layoutBox = mapa.getDefaultLayoutBox()
	
	// vytvoreni a pridani ovladaciho prvku pro pohyb s mapou
	var moveControl = new SZN.Visual.MoveControl();
	var move = mapa.addControls(moveControl,layoutBox,10,12);
	
	// vytvoreni a pridani ovladaciho prvku pro nastaveni priblizeni
	var zoomControl = new SZN.Visual.ZoomControl('full');
	// vypocteme si vertikalni polohu pro umisteni 
	var pos = mapa.getControlById(move).getSize().height + 17;
	mapa.addControls(zoomControl,layoutBox,25,pos);
	
	// zapnuti ukazatele severu
	mapa.setNorthRuler(1);
	
	// zapnuti ukazatele meritka
	mapa.setScaleRuler(1);	

  }
</com:TClientScript>
<com:FWidgetControl ID="MetaData">
columns: 2
properties:
	-	apikey
	-	markertext
	-	zoom
	-	lat
	-	lng
	-	width
	-	height
	-	mouse
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
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Css Style]%>
		name: <%= $this->MetaData->getFieldName('cssstyle') %>
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
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Mouse]%>
		name: <%= $this->MetaData->getFieldName('mouse') %>
		editor:
			xtype: numberfield
			allowBlank: true
			anchor: 90%
</com:FWidgetControl>