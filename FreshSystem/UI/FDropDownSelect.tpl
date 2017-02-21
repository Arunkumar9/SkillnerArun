
    <com:TDropDownList ID="SelectMenu" Attributes.OnChange="selectmenu<%= $this->ClientID %>(this);" />

    <com:TRepeater ID="Repeater" >
        <prop:ItemTemplate>
            <div class="menu<%= $this->TemplateControl->ClientID %>" id="menu<%= $this->TemplateControl->ClientID %>_<%# $this->Data->uid %>" style="display: none">
            <com:FContainerListMenu id="MenuContainer"
                                    MaxLevel="1" cssClass="leftMenuLevel"
                                    MaxItems="0"
                                    GenerateAll="true"
                                    JustLinks="false"
                                    SeoName="category"
                                    CodeName="catid"
                                    EnableJS="false"
                                    RootId="<%# $this->Data->uid %>"
                                    RecordClass="<%# $this->TemplateControl->getRecordClass() %>"
                                    />
            </div>
        </prop:ItemTemplate>
     </com:TRepeater>
<com:TClientScript>
function createCookie(name,value,days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
	//alert(document.cookie);
}

function readCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name)
{
	createCookie(name,"",-1);
}
function selectmenu<%= $this->ClientID %>(select) {
            var opt = select.options[select.selectedIndex];
            $$('.menu<%= $this->ClientID %>').each(function(i){ i.hide()});
            $('menu<%= $this->ClientID %>_'+opt.value).show();
            createCookie('menu<%= $this->ClientID %>',select.selectedIndex);
}
if (v = readCookie('menu<%= $this->ClientID %>')) {
            $('<%= $this->SelectMenu->ClientID %>').selectedIndex = v;
}
selectmenu<%= $this->ClientID %>($('<%= $this->SelectMenu->ClientID %>'));

</com:TClientScript>
