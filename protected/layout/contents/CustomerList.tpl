<div class="contentBoxContentNoBorder <%= $this->cssClass %>">
<com:TRepeater ID="Repeater">
    <prop:ItemTemplate>

        <a href="<%# $this->Data->url %>" class="rightColumnItem" target="_blank" >
            <strong><%# $this->Data->name %></strong> <%# $this->Data->description %>
        </a><br/>

    </prop:ItemTemplate>
</com:TRepeater>

<!-- konec contentBoxContentNoBorder -->
</div>

<com:FWidgetControl ID="MetaData">
editors:
    maxData:
        xtype: numberfield
        name: Max items
    cssClass: Css class
    DataCondition: Condition
    DataParameters: Parameters
    respectDates:
        xtype: xcheckbox
        name: Respect days
</com:FWidgetControl>
