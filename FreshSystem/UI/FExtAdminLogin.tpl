<div id="login-dlg" style="display: none">
<div class="x-dlg-hd">Laboratorní přístroje: Login</div>
<div id="login-dlg-body" class="x-dlg-bd x-form" style="padding: 8px;">

<div class="x-form-item">
	<com:TLabel SkinID="login" ForControl="Username" Text="Uživatel:"  />
	<div class="x-form-element" style="padding-left: 60px">
		<com:TTextBox SkinID="login" ID="Username"  />
		<com:TRequiredFieldValidator
			ControlToValidate="Username"
			Text="Musíte zadat uživatele."
			Display="Dynamic"/>
	</div>
</div>
<div class="x-form-clear"></div>
<div class="x-form-item" >
	<com:TLabel SkinID="login"  ForControl="Password" Text="Heslo:"  />
	<div class="x-form-element" style="padding-left: 60px">
		<com:TTextBox SkinID="login" ID="Password" TextMode="Password" style.CustomStyle="margin-left: 0px;"/>
		<com:TCustomValidator
			ControlToValidate="Password"
			Text="Login failed."
			Display="Dynamic"
			OnServerValidate="Page.login"
			/>
		<com:TLabel SkinID="login" ID="Error" cssClass="x-form-item" />
	</div>
</div>

</div>
	<com:TButton ButtonType="Button" ID="submitButton" SkinID="login" Text="Login"	 />
</div>
<com:TClientScript >
jQuery(document).ready(function() { 
 var loginForm = new Ext.BasicDialog('login-dlg',{title: 'FreshAdmin Login',
    width:270, height:140, collapsible:false,closable: false,autoScroll: false,
    shadow:true, proxyDrag:false, modal:true, resizable:false, draggable: false });
 var fs = new Ext.form.TextField(
 		  { allowBlank: false, blankText: "Vyplňte"
		  });
var fs1 = new Ext.form.TextField(
 		  { allowBlank: false, blankText: "Vyplňte"
		  });
 fs.applyTo('<%= $this->Username->ClientID %>');
 fs1.applyTo('<%= $this->Password->ClientID %>');

 var btnID = "<%= $this->submitButton->ClientID %>";
 Ext.get(btnID).remove();
 loginForm.btnLogin = loginForm.addButton('Login', false, loginForm);
 loginForm.btnLogin.getEl().child('BUTTON').dom.id = btnID;

 loginForm.btnCancel = loginForm.addButton('Cancel', false, loginForm);
 loginForm.show();


//new Prado.WebUI.TRequiredFieldValidator({'ID':'<%= $this->Username->ClientID %>','FormID':'ctl0_frm','Display':'Dynamic','ControlToValidate':'ctl0_main_Login_Username','ControlType':'TTextBox'});
//new Prado.WebUI.TButton({'ID':btnID,'CausesValidation':true,'EventTarget':'ctl0$main$Login$submitButton','FormID':'ctl0_frm'});

 });

//
 
</com:TClientScript>
