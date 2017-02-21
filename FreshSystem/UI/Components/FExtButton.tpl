<com:TButton ButtonType="Button" ID="Button" OnClick="Page.Logout" />
<com:TPanel ID="ExtButton" cssClass="<%= $this->CssClass %>">
<com:TClientScript>
 Ext.onReady(function() {
	 var btnID = "<%= $this->Button->ClientID %>";
	 var extbtnID = "<%= $this->ExtButton->ClientID %>";
	 var btnText = "<%= $this->Text %>";
	 var btnIconCls = "<%= $this->IconCls %>";
	 Ext.get(btnID).remove();
	 btn = new Ext.Button(extbtnID,{ text: btnText, iconCls: btnIconCls });
	 btn.getEl().child('BUTTON').dom.id = btnID;
  });
</com:TClientScript>
</com:TPanel>