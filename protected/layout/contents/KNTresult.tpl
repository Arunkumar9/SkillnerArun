<div class="printButton">
<input type="button" onclick="javascript:window.print()" value="Tisknout výsledky" />
</div>


<div class="tableColumn">

	<div class="tableForm coloredForm noTableHeadWidth">
		<table border="0" >

		  <tr>
			<th>Jméno klienta:</th>
			<td>
<%= $this->Client->Name %>
			</td>

			<th>Datum:</th>
			<td>
<%= $this->Client->CreatedAsDateF %>
			</td>

		  </tr>
	</table>
</div>


<h2>Výsledky celkové analýzy</h2>
<div class="tableForm noTableHeadWidth printNoWrapAfter">
	<table border="0">


		<tr>
			<th>WHR </th><td><%= $this->Client->WHR %> </td>
			<th>Typ postavy </th><td><%= $this->Client->TypPostavy %> </td>
		</tr>


		</table>


		<table border="0" class="allCellsBorder"  width="100%" >


		<tr>
					<th>&nbsp;</th>
			<th>&nbsp;</th>
			<th>Váha</th>
			<th>&nbsp;</th>			
			<th>&nbsp;</th>
			<th>Váha</th>
			</tr>
			
			
			
		<tr>
			<th>Metabolický typ </th>
			<td><%= $this->Client->MetabolickyTyp %></td>
			<td class="<%= $this->colorize('MetabolickyTypVaha') %>"><%= $this->Client->MetabolickyTypVaha %></td>
			
			<th>Krevní skupina </th>
			<td><%= $this->Client->KNTSession_KrevniSkupinaAsDefName %></td> 
			<td class="<%= $this->colorize('KrevniSkupinaVaha') %>"><%= $this->Client->KrevniSkupinaVaha %></td>
	</tr>


		<tr>
			<th>ANS </th>
			<td><%= $this->Client->ANS %></td>
			<td class="<%= $this->colorize('ANSVaha') %>"><%= $this->Client->ANSVaha %></td>
			
			<th>Typ </th>
			<td><%= $this->Client->Dummelstein %></td>
			<td class="<%= $this->colorize('DummelsteinVaha') %>"><%= $this->Client->DummelsteinVaha %></td>
		</tr>

		<tr>
			<th>Spalování cukrů </th>
			<td><%= $this->Client->SpalovaniCukruText %></td>
			<td class="<%= $this->colorize('SpalovaniCukruVaha') %>"><%= $this->Client->SpalovaniCukruVaha %></td>
			<th>Ájurvéda </th>
			<td><%= $this->Client->AjurvedaText %> </td>
			<td class="<%= $this->colorize('AjurvedaVaha') %>"><%= $this->Client->AjurvedaVaha %> </td>
			
		</tr>
		
			
	
		
		<tr>
			<th>Spalování tuků </th>
	
			<td><%= $this->Client->SpalovaniTukuText %></td>
			<td class="<%= $this->colorize('SpalovaniTukuVaha') %>"><%= $this->Client->SpalovaniTukuVaha %></td>
			<th>pH v organismu </th>
			<td><%= $this->Client->PhText %></td>
			<td class="<%= $this->colorize('PhVaha') %>"><%= $this->Client->PhVaha %></td>
		</tr>
		
		<tr>
			
			


		</tr>		
		<tr>
			<th>Převládající typ </th>
			<td><%= $this->Client->PrevladajiciTyp %> </td>
			<td class="<%= $this->colorize('PrevladajiciTypVaha') %>"><%= $this->Client->PrevladajiciTypVaha %>  </td>
<!--			<td><%[ kntRes.PrevladajiciTyp.moznostiVahy ]%></td>
			<td><%[ kntRes.PrevladajiciTyp.vahaDiagnostiky ]%></td>-->

			<th>&nbsp;</th>
			<td>&nbsp;</td>
			<td>&nbsp;</td>

		</tr>
		
		
		
		
		
		





		</table>

</div>




	<div class="graphContainer printNoWrap">

		<div class="graphContent">
			<h3><%[ Metabolický typ ]%></h3>

                <com:FGChart Width="423" Height="278" Type="StackedBar" ID="MetabolickyTyp">
                    
                        <prop:Chart.VisibleAxes>x,y</prop:Chart.VisibleAxes>
						<prop:Chart.AxisRange>1|0|100</prop:Chart.AxisRange>
						<prop:Chart.DataRange>0|100</prop:Chart.DataRange>
                     
                        <prop:Chart.AxisLabel>0|Porovnání,Aktuální</prop:Chart.AxisLabel>

                       
                       
 <prop:Chart.ValueMarkers>N|ffffff,0,1.1,24,,c
tVýrazně sacharidový typ|ffffff,0,-2,14,,c:0:0
tSacharidový typ|000000,1,,14,,c:0:0
tSmíšený typ|ffffff,2,,14,,c:0:0
tProteinový typ|000000,3,,14,,c:0:0
tVýrazně proteinový typ|ffffff,4,,14,,c:0:0
                        </prop:Chart.ValueMarkers>
						<prop:Chart.BackgroundFill>bg|f0f0f0</prop:Chart.BackgroundFill>						
						
                        
                        <prop:Chart.AutoBarWidth >1</prop:Chart.AutoBarWidth>
                </com:FGChart>


		


		</div>
<!---

<div class="metaboGraphLegend">
			<span><div class="metaboGraphLegendItem1"></div>výrazně proteinový</span>
			<span><div class="metaboGraphLegendItem2"></div>proteinový</span>
			<span><div class="metaboGraphLegendItem3"></div>smíšený</span>
			<span><div class="metaboGraphLegendItem4"></div>sacharidový</span>
			<span><div class="metaboGraphLegendItem5"></div>výrazně sacharidový</span>
		</div>
                        <prop:Chart.Legend><%[ kntRes.vyrazneProteinovy.Text ]%>,<%[ kntRes.aktualni.Text ]%>,<%[ kntRes.proteinovy.Text ]%>,<%[ kntRes.smiseny.Text ]%>,<%[ kntRes.sacharidovy.Text ]%>,<%[ kntRes.vyrazneSacharidovy.Text ]%></prop:Chart.Legend>
                        <prop:Chart.LegendPosition>lv|l</prop:Chart.LegendPosition>
<prop:Chart.DataSet>
                        30,48
                        10,0
                        20,0
                        10,0
                        30,0
                    </prop:Chart.DataSet>
 <prop:Chart.ValueMarkers>N|ffffff,0,,14,,c
N|ffffff,-1,,14,,c
N|ffffff,-2,,14,,c
N|ffffff,-3,,14,,c
N|ffffff,4,,14,,c
                        </prop:Chart.ValueMarkers>
--->
	</div>
	<div class="graphContainer">
	
		<div class="graphContent">
			<h3><%[ Typ autonomní nervové soustavy]%></h3>
				  <com:FGChart ID="ANS" Width="423" Height="278" Type="Bar">
						
							<prop:Chart.VisibleAxes>x,y</prop:Chart.VisibleAxes>
							<prop:Chart.AxisLabel>0|Sympaticus,Parasympaticus</prop:Chart.AxisLabel>
							<prop:Chart.Colors>
							ffae00,99de22,de2253,00ccff,e9159c,394c77	
							</prop:Chart.Colors>
							<prop:Chart.AxisRange>1|0|10</prop:Chart.AxisRange>
							<prop:Chart.DataRange>0|10</prop:Chart.DataRange>
							<prop:Chart.AutoBarWidth >1</prop:Chart.AutoBarWidth>
							<prop:Chart.BackgroundFill>bg|f0f0f0</prop:Chart.BackgroundFill>
<prop:Chart.ValueMarkers>N|ffffff,0,,18,,c
N|ffffff,1,,18,,c
</prop:Chart.ValueMarkers>
					</com:FGChart>
		</div>
	</div>



























<div class="graphContainer">




	<div class="graphContent">
		<h3><%[ Spalování cukrů ]%></h3>
			  <com:FGChart ID="SpalovaniCukru" Width="292" Height="250" Type="Bar">
                    
                        <prop:Chart.VisibleAxes>x,y</prop:Chart.VisibleAxes>
                        <prop:Chart.AxisLabel>0|pomalé,rychlé</prop:Chart.AxisLabel>
                        <prop:Chart.Colors>
						ffae00,99de22,de2253,00ccff,e9159c,394c77	
                        </prop:Chart.Colors>
                        <prop:Chart.AxisRange>1|0|3</prop:Chart.AxisRange>
                        <prop:Chart.DataRange>0|3</prop:Chart.DataRange>
                        <prop:Chart.AutoBarWidth >1</prop:Chart.AutoBarWidth>
                        <prop:Chart.BackgroundFill>bg|f0f0f0</prop:Chart.BackgroundFill>
<prop:Chart.ValueMarkers>N|ffffff,0,,18,,c
N|ffffff,1,,18,,c
</prop:Chart.ValueMarkers>
                </com:FGChart>
	</div>



	<div class="graphContent">
		<h3><%[ Spalování tuků ]%></h3>
			  <com:FGChart ID="SpalovaniTuku" Width="293" Height="250" Type="Bar">

                        <prop:Chart.VisibleAxes>x,y</prop:Chart.VisibleAxes>
                        <prop:Chart.AxisLabel>0|pomalé,rychlé</prop:Chart.AxisLabel>
                        <prop:Chart.Colors>
						ffae00,99de22,de2253,00ccff,e9159c,394c77						
                        </prop:Chart.Colors>
                        <prop:Chart.AxisRange>1|0|3</prop:Chart.AxisRange>
                        <prop:Chart.DataRange>0|3</prop:Chart.DataRange>
                        <prop:Chart.AutoBarWidth >1</prop:Chart.AutoBarWidth>
                        <prop:Chart.BackgroundFill>bg|f0f0f0</prop:Chart.BackgroundFill>
<prop:Chart.ValueMarkers>N|ffffff,0,,18,,c
N|ffffff,1,,18,,c
</prop:Chart.ValueMarkers>
                </com:FGChart>
	</div>




	<div class="graphContent">
		<h3><%[ Ajurveda ]%></h3> 
			  <com:FGChart ID="Ajurveda" Width="293" Height="250" Type="Bar">

                        <prop:Chart.VisibleAxes>x,y</prop:Chart.VisibleAxes>
                        <prop:Chart.AxisLabel>0|váta,kapha,pitta</prop:Chart.AxisLabel>
                        <prop:Chart.Colors>
							de2253,394c77,ffae00,e9159c,99de22,00ccff
                        </prop:Chart.Colors>
                        <prop:Chart.AxisRange>1|0|20</prop:Chart.AxisRange>
                        <prop:Chart.DataRange>0|20</prop:Chart.DataRange>
                        <prop:Chart.AutoBarWidth >1</prop:Chart.AutoBarWidth>
                        <prop:Chart.BackgroundFill>bg|f0f0f0</prop:Chart.BackgroundFill>
<prop:Chart.ValueMarkers>N|ffffff,0,,18,,c
N|ffffff,1,,18,,c
N|ffffff,2,,18,,c
</prop:Chart.ValueMarkers>
                </com:FGChart>
	</div>


</div>










<!--<div class="graphContainer printWrap">-->

<div class="graphContainer ">


	<div class="graphContent">
		<h3><%[ Typologie Abravanel ]%></h3>
			  <com:FGChart ID="Abravanel" Width="423" Height="250" Type="Bar">

                        <prop:Chart.VisibleAxes>x,y</prop:Chart.VisibleAxes>
                        <prop:Chart.AxisLabel>0|štítná žláza,nadledvinky,gonády,hypofýza</prop:Chart.AxisLabel>

                        <prop:Chart.Colors>
						ffae00,99de22,de2253,00ccff,e9159c,394c77	
                        </prop:Chart.Colors>

                        <prop:Chart.AxisRange>1|0|2</prop:Chart.AxisRange>
                        <prop:Chart.DataRange>0|2</prop:Chart.DataRange>
                        <prop:Chart.AutoBarWidth >1</prop:Chart.AutoBarWidth>
                        <prop:Chart.BackgroundFill>bg|f0f0f0</prop:Chart.BackgroundFill>
<prop:Chart.ValueMarkers>N|ffffff,0,,18,,c
N|ffffff,1,,18,,c
N|ffffff,2,,18,,c
N|ffffff,3,,18,,c
</prop:Chart.ValueMarkers>
                </com:FGChart>
	</div>
</div>

<div class="graphContainer">
	<div class="graphContent">
		<h3><%[ Typologie Dummelstein ]%></h3>
			  <com:FGChart ID="Dummelstein" Width="423" Height="250" Type="Bar">

                        <prop:Chart.VisibleAxes>x,y</prop:Chart.VisibleAxes>
                        <prop:Chart.AxisLabel>0|Bojovnice,Citlivka,Umělkyně,Venuše</prop:Chart.AxisLabel>

                        <prop:Chart.Colors>
						ffae00,99de22,de2253,00ccff,e9159c,394c77	
                        </prop:Chart.Colors>

                        <prop:Chart.AxisRange>1|0|1.5</prop:Chart.AxisRange>
                        <prop:Chart.DataRange>0|1.5</prop:Chart.DataRange>
                        <prop:Chart.AutoBarWidth >1</prop:Chart.AutoBarWidth>
                        <prop:Chart.BackgroundFill>bg|f0f0f0</prop:Chart.BackgroundFill>
<prop:Chart.ValueMarkers>N|ffffff,0,,18,,c
N|ffffff,1,,18,,c
N|ffffff,2,,18,,c
N|ffffff,3,,18,,c
N|ffffff,4,,18,,c
</prop:Chart.ValueMarkers>
                </com:FGChart>
	</div>


</div>











<com:FWidgetControl ID="MetaData">
editors:
    cssClass: Css class
</com:FWidgetControl>