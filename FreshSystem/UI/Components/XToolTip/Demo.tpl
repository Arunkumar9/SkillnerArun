<%@ MasterClass="" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<com:THead>
<meta http-equiv="Expires" content="Fri, Jan 01 1900 00:00:00 GMT"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>UACAMAN</title>
</com:THead>
<body>
<com:TForm id="frmMain">
<com:XToolTip Target="<%= $this->oiMundo1->ClientID %>" Orientation="bottom.right"> 
	<prop:Text>Tool Tip Example number 1</prop:Text>
</com:XToolTip>
<com:XToolTip Target="<%= $this->oiMundo2->ClientID %>" Orientation="bottom.right"> 
	<prop:Text>Tool Tip Example number 2</prop:Text>
</com:XToolTip>
<com:XToolTip Target="<%= $this->oiMundo3->ClientID %>" Orientation="bottom.right"> 
	<prop:Text>Tool Tip Example number 2</prop:Text>
</com:XToolTip>
<table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td height="25" align="left"><span class="titulo">XToolTip</span></td>
  </tr>
  <tr>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="left">
      Build upon the XMessage, this Widget automates the taks of creating Tool Tips to any element in one web page.
    </td>
  </tr>
  <tr>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td height="25" align="left"><span class="titulo">
      Demo
    </span></td>
  </tr>
  <tr>
    <td align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="left">
      <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td colspan="2" align="left">
			  <com:THyperLink id="oiMundo1" NavigateUrl="#" Text="Link to nowhere" /> -&gt; Top center.<br />
			  <com:THyperLink id="oiMundo2" NavigateUrl="#" Text="Link to nowhere" /> -&gt; Top center.<br />
			  <%[Campo de texto]%>:<com:TTextBox id="oiMundo3"/>-&gt; Bottom Right<br />
          </td>
          </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td height="25" align="left">&nbsp;</td>
  </tr>
  <tr>
    <td align="left">&nbsp;</td>
  </tr>
</table></com:TForm>
</body>
</html>
