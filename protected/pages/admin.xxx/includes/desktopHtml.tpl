<div id="x-desktop">
    	<dl id="x-shortcuts">
            <com:TRepeater ID='Shortcuts' enabled="false">
                <prop:ItemTemplate>
                    <dt id="<%= $this->Data['name'] %>-shortcut">
                        <a href="#"><img src="lib/desktop/resources/images/default/s.gif" />
                        <div><%= $this->Data['text'] %></div></a>
                    </dt>
                </prop:ItemTemplate>
            </com:TRepeater>
        </dl>
    </div>
    <div id="ux-taskbar">
    	<div id="ux-taskbar-start"></div>
    	<div id="ux-taskbar-panel-wrap">
    		<div id="ux-quickstart-panel"></div>
    		<div id="ux-taskbuttons-panel"></div>
    	</div>
    	<div class="x-clear"></div>
    </div>    