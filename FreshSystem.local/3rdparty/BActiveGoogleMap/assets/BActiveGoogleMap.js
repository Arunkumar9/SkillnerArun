var B = B || {};

google.load("maps", "2.x");

B.Marker = Class.create();
B.Marker.prototype={
	initialize:function(options){
		this.id = options['ID'];
		this.clientId = options['ClientID'];
		this.siteName = options['Name'];
		this.latitude = options['Point'][0];
		this.longitude = options['Point'][1];
		this.title = options['Title'];
		this.dragging = options['Draggable'];
		
		this.options = options;
		
		this.eventDragging = null;
	},
	
	getGLatLng:function(){
		if (!this.point){
			this.point = new GLatLng(this.latitude, this.longitude);
		}
		return this.point;
	},

	getGMarker:function(){
		if (!this.marker){
			this.marker = new GMarker(this.getGLatLng(), {
				icon:this.getIcon(),
				title:this.title,
				draggable:this.dragging});
			GEvent.bind(this.marker, 'click', this, this.openInfoWindow.bind(this, 'Loading...'));
		}
		return this.marker;
	},
	
	getIcon:function(){
		if (!this.icon){
			this.icon = new GIcon(G_DEFAULT_ICON);
			options = this.options;
			if (options.ImageUrl){
				this.icon.image = options.ImageUrl;
			}
			if (options.ImageSize){
				this.icon.iconSize = new 
					GSize(options.ImageSize[0],options.ImageSize[1]);
			}
			if (options.ShadowUrl){
				this.icon.shadow = options.ShadowUrl;
			}
			if (options.ShadowSize){
				this.icon.shadowSize = new
					GSize(options.ShadowSize[0],options.ShadowSize[1]);
			}
			if (options.ImageAnchor){
				this.icon.iconAnchor = new
					GPoint(options.ImageAnchor[0],options.ImageAnchor[1]);
			}
			if (options.InfoWindowAnchor){
				this.icon.infoWindowAnchor = new
					GPoint(options.InfoWindowAnchor[0],options.InfoWindowAnchor[1]);
			}
		}
		return this.icon;
	},
	
	openInfoWindow:function(content){
		this.marker.openInfoWindowHtml(content);
	},
	
	distanceFrom:function( marker ){
		distance = 0;
		if (marker){
			// get distance in meters
			distance = this.getGLatLng().distanceFrom(marker.getGLatLng());
			// convert to miles
			distance = distance / 1609.344;
		}
		return distance;
		}
};


B.ActiveGoogleMaps={
	register:function(key, value){
		this._maps = this._maps || new Array;
		this._maps[key] = value;
	},
	
	unregister:function(key){
		this._maps[key] = null;
	},
	
	get:function(key){
		return this._maps[key];
	},
	
	setMarkerVisible:function(id,marker,value){
		B.ActiveGoogleMaps.get(id).setMarkerVisible(marker,value);
	},
	
	setCenter:function(id, value){
		B.ActiveGoogleMaps.get(id).setCenter(value);
	},
	
	setScrollWheelZoom:function(id, value){
		B.ActiveGoogleMaps.get(id).setScrollWheelZoom(value);
	},
	
	setBounds:function(id, value){
		B.ActiveGoogleMaps.get(id).setBounds(value);
	},
	
	setZoom:function(id, value){
		B.ActiveGoogleMaps.get(id).setZoom(value);
	},
	
	setControls:function(id, value){
		B.ActiveGoogleMaps.get(id).setControls(value);
	},
	
	setMapTypes:function(id, value){
		B.ActiveGoogleMaps.get(id).setMapTypes(value);
	},
	
	setMapType:function(id, value){
		B.ActiveGoogleMaps.get(id).setMapType(value);
	},
	
	openInfoWindow:function(id, value){
		B.ActiveGoogleMaps.get(id).openInfoWindow(value);
	},
	
	closeInfoWindow:function(id){
		B.ActiveGoogleMaps.get(id).closeInfoWindow();
	},
	
	setMarkerID:function(id, value){
		B.ActiveGoogleMaps.get(id).setMarkerID(value);
	},
	
	addMarker:function(id, options){
		B.ActiveGoogleMaps.get(id).addMarker(options);
	},
	
	setMarkerDragging:function(id,markerID,value){
		B.ActiveGoogleMaps.get(id).setMarkerDragging(markerID,value);
	}
}

B.ActiveGoogleMap=Class.extend(Prado.WebUI.CallbackControl,{
	onInit:function(options){
		this.options = options;
		
		B.ActiveGoogleMaps.register(this.options.ID, this);
		
		Event.OnLoad(this.onLoad.bind(this));
		Event.observe(window,"unload",this.onUnload.bind(this));
	},
	
	/**
	 * OnUnLoad event handler.
	 * Initializes member variables, and calls mapInit.
	 */
	onUnload:function(){
		GUnload();
		this.markers = null;
		this.lines = null;
		B.ActiveGoogleMaps.unregister(this.options.ID);
	},
	
	/**
	 * OnLoad event handler.
	 * Initializes member variables, and calls mapInit.
	 */
	onLoad:function(){
		/**
		 * HTMLDivElement element
		 * 
		 * The div tag that the map is displayed in.
		 */
		this.element = $(this.options.ID);
		
		/**
		 * array markers
		 * 
		 * An Array of all the marker data.
		 * Indexed by the database id.
		 */
		this.markers = new Array();
		this._markerID;
		
		/**
		 * array lines
		 * 
		 * An Array of all the lines from the selected marker.
		 * Indexed by the database id of the 
		 */
		this.lines = new Array();
		
		// initialize map
		this.mapInit();
	},
	
	/**
	 * Initializes the google map, setting up the 
	 * GMap object, and adding controls.
	 */
	mapInit:function(){
		this.map = new google.maps.Map2(this.element);
		this.map.setCenter(new GLatLng(this.options.Center[0], this.options.Center[1]), Number(this.options.ZoomLevel));		
		this.setControls(this.options.Controls);
		this.options.MapTypes = this.options.MapTypes || G_DEFAULT_MAP_TYPES;
		this.setMapTypes(this.options.MapTypes);
		this.setMapType(this.options.MapType);
		
		// set other options not available until map is created.
		this.setScrollWheelZoom(this.options.ScrollWheelZoom);
		
		// bind Map Click event
		GEvent.bind(this.map, 'click', this, this.mapClick);
		
		// bind MoveEnd event, and start the initial callback
		GEvent.bind(this.map, 'moveend', this, this.moveEnd);
		this.moveEnd();
	},
	
	/**
	 * @param string html content to display in the info window.
	 */
	openInfoWindow:function(content){
		this.getMarker().openInfoWindow(content, this);
	},
	
	/**
	 * Closes the currently open info window.
	 */
	closeInfoWindow:function(){
		this.map.closeInfoWindow();
	},
	
	/**
	 * @param integer markerID
	 * @return Marker 
	 *		corresponding Marker if id is an integer
	 *		current Marker if id is null.
	 */
	getMarker:function(id){
		id = id || this.getMarkerID()
		return this.markers[id];
	},
	
	/**
	 * @param integer current Marker id.
	 */
	setMarkerID:function(value){
		this._markerID = value;
	},
	
	/**
	 * @return integer current Marker id.
	 */
	getMarkerID:function(){
		return this._markerID;
	},
	
	/**
	 * @param Marker object to center the map on.
	 */
	panToMarker:function(marker){
		this.map.panTo(marker.getGLatLng());
	},
	
	/**
	 * @param array the center coordinates (latitude, longitude).
	 */
	setCenter:function(value){
		this.map.panTo(new GLatLng(value[0], value[1]));
	},
	
	/**
	 * @return array the center coordinates (latitude, longitude).
	 */
	getCenter:function(){
		center = this.map.getCenter();
		return Array(center.lat(), center.lng());
	},
	
	/**
	 * @param boolean whether the map will scroll with the zoom wheel.
	 */
	setScrollWheelZoom:function(value){
		if (value)
			this.map.enableScrollWheelZoom();
		else
			this.map.disableScrollWheelZoom();
	},
	
	/**
	 * @param array the new map bounds.
	 */
	setBounds:function(value){
		sw = new GLatLng(value[0], value[2]);
		ne = new GLatLng(value[1], value[3]);
		bounds = new GLatLngBounds(sw, ne);
		this.map.setCenter(bounds.getCenter(), this.map.getBoundsZoomLevel(bounds));
	},
	
	/**
	 * getBounds():
	 * 
	 * @return array the bounds of the map in the following fashion
	 * (lower latitude, upper latitude, lower longitude, upper longitude).
	 */
	getBounds:function(){
		bounds = this.map.getBounds();
		sw = bounds.getSouthWest();
		ne = bounds.getNorthEast();
		return Array(sw.lat(), ne.lat(), sw.lng(), ne.lng());
	},
	
	/**
	 * @param integer the zoom level of the map.
	 */
	setZoom:function(value){
		this.map.setZoom(value);
	},
	
	/**
	 * @return integer the zoom level of the map.
	 */
	getZoom:function(){
		return this.map.getZoom();
	},
	
	/**
	 * @param array of strings, the control names.
	 */
	setControls:function(value){
		this.controls = this.controls || new Array;
		// remove all controls
		this.controls.each(function(item){
			this.map.removeControl(item);
		}.bind(this));
		this.controls = new Array();
		// add specified controls
		value.each(function(item){
			control = new window[item]();
			this.map.addControl(control);
			this.controls.push(control);
		}.bind(this));
	},
	
	/**
	 * @param array of strings, the map type names.
	 */
	setMapTypes:function(value){
		this.mapTypes = this.mapTypes 
			|| new Array('G_DEFAULT_MAP_TYPES').collect(function(item){
				return window[item];}).flatten();
		// turn all the strings into their 'constant' values. 
		value = value.collect(function(item){
			return window[item];
		}).flatten();
		// add any new map types.
		value.each(function(item){
			if (this.mapTypes.indexOf(item) < 0){
				this.map.addMapType(item);
				this.mapTypes.push(item);
			}
		}.bind(this));
		// remove any old map types.
		temp = this.mapTypes.clone();
		temp.each(function(item){
			if (value.indexOf(item) < 0){
				this.map.removeMapType(item);
				i = this.mapTypes.indexOf(item);
				this.mapTypes.splice(i, 1);
			}
		}.bind(this));
	},
	
	setMapType:function(value){
		this.map.setMapType(window[value]);
	},

	/**
	 * moveEnd():
	 * 
	 * Prado Callback wrapper
	 * Calls Prado.Callback to update the map points
	 */
	moveEnd:function(){
		param = new Object;
		param.eventType = "__BActiveGoogleMap_OnMoveEnd__";
		param.clientSide = this.getClientSide();
		param = Prado.JSON.stringify(param);
		Prado.Callback(this.options.EventTarget, param, null, this.options);
	},
	
	/**
	 * getClientSide():
	 * 
	 * @return an array with clientside state
	 */
	getClientSide:function(){
		ret = new Object();
		ret.bounds = this.getBounds();
		ret.zoomLevel = this.getZoom();
		ret.center = this.getCenter();
		return ret;
	},
	
	/**
	 * Adds a marker to the map.
	 * 
	 * @param array marker data
	 * 	[Marker ID, Name, [Latitude, Longitude], ClientID]
	 * @param GIcon the graphic to display on the map.
	 */
	addMarker:function(markerData){
		id = markerData['ID'];
		if (!this.markers[id]){
			this.markers[id] = new B.Marker(markerData);
			this.map.addOverlay(this.markers[id].getGMarker());
			
			dragging = markerData[5];
			this.setMarkerDragging(id, dragging);
			GEvent.bind(this.markers[id].getGMarker(), 'click', this, this.markerClick.bind(this, this.markers[id]));
		}
	},
	
	/**
	 * markerClick()
	 * 
	 * Prado Callback wrapper
	 * Calls Prado.Callback to update the map pinpoints
	 * @param Marker the marker that was clicked.
	 */
	markerClick:function(marker){
		if (marker = marker || this.getMarker()){
			param = new Object;
			param.eventType = "__BActiveGoogleMap_OnMarkerChanged__";
			param.markerID = marker.id;
			param = Prado.JSON.stringify(param);
			Prado.Callback(this.options.EventTarget, param, null, this.options);
		}
	},

	markerDrag:function(marker){
		if(marker = marker || this.getMarker()){
			param = new Object;
			param.eventType = "__BActiveGoogleMap_OnMarkerDrag__";
			param.markerID = marker.id;
			param.clientSide = this.getClientSide();
			param.lat = marker.getGMarker().getPoint().lat();
			param.lng = marker.getGMarker().getPoint().lng();
			param = Prado.JSON.stringify(param);
			Prado.Callback(this.options.EventTarget, param, null, this.options);
		}
	},

	setMarkerVisible:function(id,value){
		if (this.markers[id]){
			if (value)
		  		this.markers[id].getGMarker().show();
		  	else
		  		this.markers[id].getGMarker().hide();
		}
	},

	setMarkerDragging:function(id,value){
		if (this.markers[id]){
			marker = this.markers[id];
			if (marker.eventDragging)
				GEvent.removeListener(marker.eventDragging);
			if (value){
				marker.getGMarker().enableDragging();
				marker.eventDragging = GEvent.bind(marker.getGMarker(), 'dragend', this, this.markerDrag.bind(this, marker));
			} else {
				marker.getGMarker().disableDragging();
			}
		}
	},

	mapClick:function(overlay, point){
		if (!overlay && point){
			param = new Object;
			param.eventType = "__BActiveGoogleMap_OnClick__";
			param.clientSide = this.getClientSide();
			param.lat = point.lat();
			param.lng = point.lng();
			param = Prado.JSON.stringify(param);
			Prado.Callback(this.options.EventTarget, param, null, this.options);
		}
	}
});
