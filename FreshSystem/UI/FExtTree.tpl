<com:TPanel ID="Container" >
</com:TPanel>

<com:TClientScript>
Ext.onReady(function() { Fresh.FExtTree('<%= $this->Container->ClientID %>','<%= $this->rootName %>','<%= $this->DataScript %>',<%= $this->BaseParams %>,'<%= $this->StoreParams %>') } );
</com:TClientScript>
