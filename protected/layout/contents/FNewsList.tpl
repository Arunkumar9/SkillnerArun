<div class="contentBoxContentNoBorder">

<com:TRepeater ID="Repeater">
    <prop:ItemTemplate>

        <a href="<%# $this->TemplateControl->giveMoreLink($this->Data->NewsId) %>" class="rightColumnItem">
<!--        <img src="images/searchVIdeoTumb.jpg" /> -->
        <strong><%# $this->Data->name %></strong><br />
	 <%# $this->Data->getPerex(false, 20) %>
        </a>

    </prop:ItemTemplate>
</com:TRepeater>

<!-- konec contentBoxContentNoBorder -->
</div>





<com:FWidgetControl ID="MetaData">
editors:
    maxNews:
        xtype: numberfield
        name: Max news
    moreLink: Detail Page
    cssClass: Css class
    category:
        xtype: ccombo
        name: Category name
        store: newscategories-def-store
    respectDates:
        xtype: xcheckbox
        name: Respect days
    respectCulture:
        xtype: xcheckbox
        name: Respect culture
</com:FWidgetControl>
