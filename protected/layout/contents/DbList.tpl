<div class="<%= $this->cssClass %>">
<com:TRepeater ID="Repeater">
    <prop:ItemTemplate>

        <a href="#" >
        <%# $this->Data->name %>
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
    RecordClass: Record class
</com:FWidgetControl>
