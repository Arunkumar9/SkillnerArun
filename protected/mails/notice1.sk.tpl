<html>
<com:THead >
	<prop:Title>
		Objednávka z www.goldim.cz č. <%= Prado::getApplication()->Modules['cart']->Cart->OrderNumber %>
	</prop:Title>
	<com:TStyleSheet>
	body, table td {font-family: Verdana, Tahoma, Arial; font-size: 8pt}
	table td, table th  {padding-left: 10px; padding-right: 10px}
    h1 {font-family: Verdana, Tahoma, Arial; font-size: 14pt; color: #006600; margin-bottom: 5px }
    h2 {font-family: Verdana, Tahoma, Arial; font-size: 12pt; color: #009900 }
	h3 {font-family: Verdana, Tahoma, Arial; font-size: 10pt; color: #33CC33; margin-bottom: 3px }        
    td {font-family: Verdana, Tahoma, Arial; font-size: 10pt}
    th { text-align:  left; }
    
    
	</com:TStyleSheet>
</com:THead>
<body>
<com:TPanel>
<prop:Style
	Font.Name="Verdana"
/>
	

				<h1>Objednávka zboží</h1>
				Objednávka č. <strong><%= Prado::getApplication()->Modules['cart']->Cart->OrderNumber %></strong> ze dne <com:TDateFormat Pattern="shortdate shorttime" />
                

				<h2>Souhrn objednávky</h2>
				
				<h3>1. Položky v nákupním košíku</h3>
				<com:CartSummary ID="CartSummary" cssClass="basketTableSummary" />
				<br/>
				<br/>
				<h3>2. Způsob platby a dobravy zboží </h3>
				<%= Prado::getApplication()->Modules['cart']->Cart->Payment %><br />
				<com:TConditional Condition="Prado::getApplication()->Modules['cart']->Cart->IsPaymentAdvance" >
				<prop:TrueTemplate>
					<br /><br />

					V případě platby převodem z účtu zaplaťte na <br>
					účet č.: <strong>2413313354/0200</strong><br/>
					Variabilní symbol: <strong><%= Prado::getApplication()->Modules['cart']->Cart->OrderNumber %></strong>
					<br />
				</prop:TrueTemplate>
				</com:TConditional>
				<br />
				<div class="horLine"></div>
				<br />
				<br />
				
				<h3>3. Fakturační údaje</h3>
				<com:PersonalDataSummary ID="PersonalDataSummary" cssClass=""/>
				<div class="horLine"></div>
				<br />
				<br />
				
				
				<h3>4. Celková cena</h3>
				Celková cena zboží včetně dopravy činí <span class="finalPrice"><strong><%= Prado::getApplication()->Modules['cart']->Cart->sumWithAddOn() %></strong></span> s DPH.
				
				<br />
				
				<div class="horLine"></div>
                
                <br>
<br>
<br>
<br>
<br>
<strong>Goldim s.r.o.</strong><br>
Rašínova 422/II<br>
392 01 Soběslav<br>
<br>
telefon: +420 381 521 281<br>
telefon: +420 381 504 277<br>
fax: +420 381 504 276<br>
<br>
e-mail: <a href="mailto:goldim@goldim.cz">goldim@goldim.cz</a><br>
prodej: <a href="mailto:obchod@goldim.cz">obchod@goldim.cz</a><br>
<br>
Sídlo firmy: V zápolí 1163/32, 141 00 Praha 4<br>
Zapsána v obchodním rejstříku, vedeným Městským soudem v Praze oddíl C, vložka 12537<br>

                
                
				
</com:TPanel>
</body>
