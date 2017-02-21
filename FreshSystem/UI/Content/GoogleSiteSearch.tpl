<com:TClientScript>

google.load('search', '1',{language: '<%= $this->getApplication()->getGlobalization()->getCulture() %>'});

function OnLoadSearch() {
  // Dynamically load CSS to override defaults
  //var css = document.createElement('link');
  //css.href = '../../css/gsearch_green.css';
  //css.type = 'text/css';
  //css.rel = 'stylesheet';
  //document.getElementsByTagName('head')[0].appendChild(css);


  // site restricted web search with custom label
  // and class suffix
  //var siteSearch = new google.search.WebSearch();
  //siteSearch.setUserDefinedLabel("<%= $this->SearchLabel %>");
  //siteSearch.setUserDefinedClassSuffix("<%= $this->cssClass %>");
  
  //var options = new google.search.SearcherOptions();
  //options.setExpandMode(GSearchControl.EXPAND_MODE_OPEN);
  //searchControl.addSearcher(siteSearch,options);

  // Establish a keep callback
  //searchControl.setOnKeepCallback(null, DummyClipSearchResult);

  // Create a search control
  var searchControl = new google.search.CustomSearchControl("<%= $this->Site %>");
  searchControl.setResultSetSize(google.search.Search.FILTERED_CSE_RESULTSET);
  //searchControl.setQueryAddition('site:www.dratovky-hloubicky.cz')

  if ("<%= $this->SearchLabel %>") {
      searchControl.setSearchStartingCallback(
        this,
        function(control, searcher, query) {
          searcher.setQueryAddition(
            '<%= $this->Restriction %>');
        });
    }

  // tell the searcher to draw itself and tell it where to attach
  var options = new google.search.DrawOptions();
  options.setAutoComplete(true);
  searchControl.draw(document.getElementById("<%= $this->SearchControl->ClientID %>",options));

  // execute an inital search || "<%= $this->InitialSearch %>"
  var isearch = window.location.href.toQueryParams();
  searchControl.execute(isearch.gsearch); //

}

//function DummyClipSearchResult(result) {}

google.setOnLoadCallback(OnLoadSearch, true);

</com:TClientScript>
<com:TPanel ID="SearchControl" CssClass="<%= $this->getCssClass() %>"/>
<com:FWidgetControl ID="MetaData">
properties:
	-	searchlabel
	-	site
	-	cssclass
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[CSE ID]%>
		name: <%= $this->MetaData->getFieldName('site') %>
		editor:
			xtype: textfield
			allowBlank: false
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Site(s)]%>
		name: <%= $this->MetaData->getFieldName('searchlabel') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Css Class]%>
		name: <%= $this->MetaData->getFieldName('cssclass') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
</com:FWidgetControl>