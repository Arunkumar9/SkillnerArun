<com:TPanel ID="Container" >
</com:TPanel>

<com:TClientScript>
Ext.onReady(function() { Fresh.FExtFilePanel('<%= $this->Container->ClientID %>','<%= $this->rootName %>','<%= $this->DataScript %>',{}) } );
</com:TClientScript>
