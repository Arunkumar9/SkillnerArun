
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


<h2>Vstupní hodnoty</h2>
<div class="tableForm coloredForm noTableHeadWidth">
		<table border="0" >

		  <tr>
			<th>Výška [cm]:</th><td><%= $this->Client->KNTSession_Vyska %></td>
	
			<th>Věk:</th> <td><%= $this->Client->Vek %></td>

			<th>Pohlaví:</th> <td><%= $this->Client->Pohlavi %></td>

			<th>Životní styl:</th> <td><%= $this->Client->KNTSession_ZivotniStylAsDefName %></td>

		  </tr>



		</table>

	</div>






<h2>Měření</h2>
<div class="tableForm noTableHeadWidth">
		<table border="0" width="100%">

		  
		<tr>
			<th>Hmotnost [kg]:</th><td><%= $this->Client->KNTSession_Hmotnost %></td>
			<th>Tělesná voda [%]:</th><td><%= $this->Client->KNTSession_ProcentoVody %></td>
			
		</tr>
		<tr>
			<th>Tuk [%]:</th> <td><%= $this->Client->KNTSession_ProcentoTuku %></td>
			<th>Stav kostry:</th> <td><%= ($this->Client->KostiOK) ? 'v pořádku' : 'zvýšené riziko osteoporózy' %></td>
			
		</tr>
		<tr>
			<th>Tuk [kg]:</th> <td><%= $this->Client->TukFFMZaokrouhleno %></td>
			<th>Minimální váha [kg]:</th> <td><%= $this->Client->MinimalniZdravaVaha %></td>
		</tr>
		<tr>
			<th>Beztuková hmota (LBM) [kg]:</th> <td><%= $this->Client->LBMZaokrouhleno %></td>
			<th>BMI:</th> <td><%= $this->Client->BMIZaokrouhleno %></td>			
		</tr>
		<tr>			
			<th>Minerály v kostech: [kg]:</th> <td><%= $this->Client->KostiZaokrouhleno %></td>			
			<th>Ideální BMI:</th> <td><%= $this->Client->IdealniBMIZaokrouhleno %></td>						
		</tr>
		<tr>
			<th>BMR (bazální metabolismus) [kcal]:</th> <td><%= $this->Client->BMR %></td>						
			<th>Fyzická kondice:</th> <td><%= $this->Client->KNTSession_FyzickaKondiceAsDefName %></td>									
		</tr>
		<tr>
			<th>Denní kalorická spotřeba [kcal]:</th> <td><%= $this->Client->KalorickaSpotrebaZaokrouhleno %></td>						
			<th>Skutečný metabolický věk:</th> <td><%= $this->Client->MetabolickyVekZaokrouhleno %></td>									
		</tr>
		<tr>
			<th>Viscerální tuk:</th> <td><%= $this->Client->KNTSession_VisceralniTuk %></td>						
		</tr>

		</table>

	</div>













<h2>Diagnostika</h2>
	<div class="tableForm diagForm">
		<table border="0" >

		  
		<tr class="noHover">
			<th>&nbsp;</th>
			<th>Stav</th>
			<th>Pod</th>
			<th>Optimální</th>
			<th>Nad</th>
			<th>Extrém</th>												
			<th>Referenční meze</th>															
		</tr>
		
		
		<tr>
			<th>Váha [kg]</th>
			<td><%= $this->Client->KNTSession_Hmotnost %></td>
			<td class="low"><%= $this->Client->getGrafVahaSignPod() %></td>
			<td class="optimal"><%= $this->Client->getGrafVahaSignNormal() %></td>			
			<td class="high"><%= $this->Client->getGrafVahaSignNad() %></td>
			<td class="extreme"><%= $this->Client->getGrafVahaSignExtrem() %></td>			
			<td><%= $this->Client->DolniVahaZaokrouhleno %> … <%= $this->Client->HorniVahaZaokrouhleno %> </td>						
			
		</tr>


		<tr>
			<th>Tělesný tuk [%]:</th>
			<td><%= $this->Client->KNTSession_ProcentoTuku %></td>
			<td class="low"><%= $this->Client->GrafTukSignPod %></td>
			<td class="optimal"><%= $this->Client->GrafTukSignNormal %></td>			
			<td class="high"><%= $this->Client->GrafTukSignNad %></td>			
			<td class="extreme"><%= $this->Client->GrafTukSignExtrem %></td>		
			<td><%= $this->Client->DolniTukZaokrouhleno %> … <%= $this->Client->HorniTukZaokrouhleno %> </td>						
			
		</tr>


		<tr>
			<th>Beztuková hmota [kg]</th>
			<td><%= $this->Client->LBMZaokrouhleno %></td>
			<td class="low"><%= $this->Client->GrafSvalovinaSignPod %></td>
			<td class="optimal"><%= $this->Client->GrafSvalovinaSignNormal %></td>			
			<td class="high"><%= $this->Client->GrafSvalovinaSignNad %></td>			
			<td class="extreme"><%= $this->Client->GrafSvalovinaSignExtrem %></td>		
			<td><%= $this->Client->SvalovinaNadZaokrouhleno %> … <%= $this->Client->SvalovinaExtremZaokrouhleno %></td>						
			
		</tr>


		<tr>
			<th>Tělesná voda [%]</th>
			<td><%= $this->Client->KNTSession_ProcentoVody %></td>
			<td class="low"><%= $this->Client->GrafVodaSignPod %></td>
			<td class="optimal"><%= $this->Client->GrafVodaSignNormal %></td>			
			<td class="high"><%= $this->Client->GrafVodaSignNaD %></td>			
			<td class="extreme"><%= $this->Client->GrafVodaSigneXTREM %></td>		
			<td><%= $this->Client->DolniVoda %> … <%= $this->Client->HorniVoda %></td>							
			
		</tr>


		</table>

		<div class="centeredContainer">
			<span class="resultBig"><%[ Stav: ]%> <%= $this->Client->StavPodleProcentaTuku %> </span><br />
			<span class="resultBig"><%= $this->Client->StupenObezity %></span>			
		</div>

</div>

























<h2>Doporučení</h2>
	<div class="tableForm">
		<table border="0" >

		<tr>
			<th class="resultBig">Vaše optimální váha:</th>
			<td class="resultBig"><%= round($this->Client->IdealniVaha,1) %> kg</td>
			<td></td>						
			
		</tr>


		<tr>
			<th class="resultBig">Úprava tuku:</th>
			<td class="resultBig"><%= $this->Client->UpravaTukuZaokrouhleno  %> kg</td>
			<td class="resultBig"><%= $this->Client->UpravaTukuProcentaZaokrouhleno  %> % z tělesné hmotnosti</td>						
		</tr>
	
 
		<tr>
			<th class="resultBig">Úprava svaloviny:</th>
			<td class="resultBig"><%= $this->Client->UpravaSvalovinyZaokrouhleno  %> kg</td>
			<td><%= $this->Client->UpravaTukuText %></td>						
		</tr>

		<tr> 
			<th class="resultBig">Metabolický věk:</th>
			<td class="resultBig"><%= $this->Client->MetabolickyVekZaokrouhleno %></td>
			<td><%= $this->Client->UpravaTukuTextFixace %></td>						
		</tr>



		</table>

</div>






























<div class="printAdviceContainer printWrap">
<h1><%[ PODROBNÁ DIAGNOSTIKA ]%></h1>

	<table class="printAdviceTable">

		<tr>
			<th colspan="2"><h2><%[ Hmotnost ]%></h2></th>
		</tr>
		
		<tr>
			<th><%[ Optimální váha ]%> | <%= $this->Client->DolniVahaZaokrouhleno %> … <%= $this->Client->HorniVahaZaokrouhleno %> Kg</th>
			<th><span><%[ Vaše hodnota ]%> | <%= $this->Client->KNTSession_Hmotnost %> Kg</span></th>						
		</tr>
		
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceVaha" />
			</td>
		</tr>
	
	</table>





	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Tělesný tuk ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceTukDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Doporučené rozmezí ]%> | <%= $this->Client->DolniTukZaokrouhleno %> … <%= $this->Client->HorniTukZaokrouhleno %> %</th>
			<th><span><%[ Vaše hodnota ]%> | <%= $this->Client->KNTSession_ProcentoTuku %> %</span></th>						
		</tr>
		
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceTuk" />
			</td>
		</tr>
	
	</table>







	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Tělesná voda ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceVodaDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Doporučené rozmezí ]%> | <%= $this->Client->DolniVoda %> … <%= $this->Client->HorniVoda %> %</th>
			<th><span><%[ Vaše hodnota ]%> | <%= $this->Client->KNTSession_ProcentoVody %> %</span></th>						
		</tr>
		
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceVoda" />
			</td>
		</tr>
	
	</table>







	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Množství svalové hmoty ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceSvalyDecription" />
			</td>
		</tr>
		
		<tr>
			<th><!--- <%[ Doporučené rozmezí ]%> | <%= $this->Client->SvalovinaNadZaokrouhleno %> … <%= $this->Client->SvalovinaExtremZaokrouhleno %> Kg ---></th>
			<th><span><%[ Vaše hodnota ]%> | <%= $this->Client->LBMZaokrouhleno %> Kg</span></th>						
		</tr>
		
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceSvaly" />
			</td>
		</tr>
	
	</table>




	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Fyzická kondice ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceKondiceDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Váš současný stupeň ]%> | <%= $this->Client->FyzickaKondice %></th>
		</tr>
		

	
	</table>






	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Bazální metabolická spotřeba - BMR ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceBMRDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Váš současný stupeň ]%> | <%= $this->Client->BMR %> kcal</th>
		</tr>
		

	
	</table>








	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Denní kalorická spotřeba ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceKalSpotrebaDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Váš současný stupeň ]%> | <%= $this->Client->KalorickaSpotreba %> kcal</th>
		</tr>
		

	
	</table>










	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Skutečný metabolický věk ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceMetaboVekDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Doporučeno ]%> | <%= $this->Client->Vek %> a méně</th>
			<th><span><%[ Vaše hodnota ]%> | <%= $this->Client->MetabolickyVekZaokrouhleno %> </span></th>						
		</tr>
		

	
	</table>









	<table class="printAdviceTable printWrap">
		<tr>
			<th colspan="2"><h2><%[ Minerály v kostech ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceKostiDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Doporučené rozmezí ]%> | <%= $this->Client->KostiRecomended %> Kg</th>
			<th><span><%[ Vaše hodnota ]%> | <%= $this->Client->KostiZaokrouhleno %> Kg</span></th>						
		</tr>
		
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceKosti" />
			</td>
		</tr>
	
	</table>














	<table class="printAdviceTable">
		<tr>
			<th colspan="2"><h2><%[ Viscerální tuk ]%></h2></th>
		</tr>

		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceVisceralniDecription" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Maximální hodnota ]%> | max. 13 </th>
			<th><span><%[ Vaše hodnota ]%> | <%= $this->Client->KNTSession_VisceralniTuk %></span></th>						
		</tr>
		
		<tr>
			<th><%[ Doporučená hodnota ]%> | <%= $this->Client->VisceralniTukMax %></th>
			<th>&nbsp;</th>						
		</tr>		
		
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdvicVisceralni" />
			</td>
		</tr>
	
	</table>





















	<table class="printAdviceTableFooter">
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceFooter" />
			</td>
		</tr>
				
		<tr>
			<th><span><%= $this->AdviserInfo->Name %> | <%= $this->AdviserInfo->email %> | <%= $this->AdviserInfo->phone %></span></th>						
		</tr>
		
		<tr>
			<td colspan="2">
				<com:FContentReader ContainerUid="SERVICE/textAdviceFooter2" />
			</td>
		</tr>		
	</table>






</div>



























        
        


         
            
           
      
<com:FWidgetControl ID="MetaData">
editors:
    cssClass: Css class
</com:FWidgetControl>