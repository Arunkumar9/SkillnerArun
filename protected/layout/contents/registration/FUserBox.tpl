<com:FActivePanelReceiver ID="UserBoxPanelReceiver" ListenOn="OnLogin,OnLogout" cssClass="<%= $this->CssClass %> guest" TagName="div" >
    <com:TControl ID="UserBoxPanel">
    <table border="0">
        <tr>
            <td>login</td>
            <td><com:TTextBox id="Username" cssClass="textBox boxLogin" Attributes.Size="10" /></td>
        <td>heslo</td>
        <td><com:TTextBox id="Password" TextMode="Password" cssClass="textBox boxLogin" Attributes.Size="10" /></td>
        <td><com:TButton id="LoginSubmit" cssClass="loginSubmit" OnCommand="loginButtonClicked"  /></td>
        </tr>
    </table>

    <com:FCmsLink CmsLink="<%= $this->RegisterPageId %>" ID="RegisterLink" Text="<%[ registrace ]%>"/> | <com:FCmsLink CmsLink="@code=zapomenute-heslo" ID="ForgetPassword" Text="<%[ ztracené heslo ]%>"/>
    </com:TControl>

    <com:TControl ID="UserBoxPanel1">
    <table border="0">
        <tr><td><%[ Přihlášen/a ]%></td>
            <td><%= $this->User->Name %></td></tr>
        <tr><td class="logoutSubmit"><div><com:FCmsLink CmsLink="<%= $this->AccountPageId %>" Text="<%[  Váš účet ]%>"/></div></td>
        <td class=""><div><com:TLinkButton ID="LogoutLink" Text="<%[ Odhlásit ]%>" OnCommand="logoutButtonClicked" /></div></td></tr>
    </table>
    </com:TControl>

</com:FActivePanelReceiver>
<com:FWidgetControl ID="MetaData">
definitions:
    afterlogoutpageid:  Login Page
    loginpageid:        After Logout Page
    registerpageid:     Register Page
    accountpageid:      Account Page
</com:FWidgetControl>	
