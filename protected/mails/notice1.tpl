<html>


<!--<style>
	body, table td {font-family: Verdana, Tahoma, Arial; font-size: 8pt}
	table td, table th  {padding-left: 10px; padding-right: 10px}
    h1 {font-family: Verdana, Tahoma, Arial; font-size: 14pt; color: #008000; margin-bottom: 5px }
    h2 {font-family: Verdana, Tahoma, Arial; font-size: 12pt; color: #6AAC28 }
	h3 {font-family: Verdana, Tahoma, Arial; font-size: 10pt; color: #8DCA1E; margin-bottom: 3px }        
    td {font-family: Verdana, Tahoma, Arial; font-size: 10pt}
    th { text-align:  left; }
    
</style>-->

<com:THead >
	<prop:Title>
		Objednávka z www.nolyma.cz č. <%= Prado::getApplication()->Modules['cart']->Cart->OrderNumber %>
	</prop:Title>
	<com:TStyleSheet>
	body, table td {font-family: Verdana, Tahoma, Arial; font-size: 8pt}
	table td, table th  {padding-left: 10px; padding-right: 10px}
    h1 {font-family: Verdana, Tahoma, Arial; font-size: 14pt; color: #008000; margin-bottom: 5px }
    h2 {font-family: Verdana, Tahoma, Arial; font-size: 12pt; color: #6AAC28 }
	h3 {font-family: Verdana, Tahoma, Arial; font-size: 10pt; color: #8DCA1E; margin-bottom: 3px }        
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
					účet č.: <strong>XXXXXXX</strong><br/>
					Variabilní symbol: <strong><%= Prado::getApplication()->Modules['cart']->Cart->OrderNumber %></strong>
					<br />
				</prop:TrueTemplate>
				</com:TConditional>
				<br />
				<div class="horLine"></div>
				<br />
				<br />
				
				<h3>3. Dodací adresa</h3>
				<com:PersonalDataSummary ID="PersonalDataSummary" cssClass=""/>
				<div class="horLine"></div>

				<h3>4. Fakturační adresa (je-li jiná než dodací)</h3>
				<com:PersonalDataBillingSummary ID="PersonalDataBillingSummary" cssClass=""/>
				<div class="horLine"></div>

				<br />
				<br />
				
				
				<h3>5. Celková cena</h3>
				Celková cena zboží včetně dopravy činí <span class="finalPrice"><strong><%= Prado::getApplication()->Modules['cart']->Cart->sumWithAddOn() %></strong></span> s DPH.
				
				<br />
				
				<div class="horLine"></div>
                
                <p><br>
	<br>
	<br>
	<br><br>
	</p>
	<img src="http://sedlarstvi.freshsystems.cz/themes/Base/images/logoMail.jpg">
    <p><strong>Martin LIBICH</strong><br>
       	Rostoklaty 17<br>
       	281 71 Rostoklaty<br>
       	<br>
       	telefon: +420 321 672 701<br>
       	fax: +420 321 672 701<br>
       	<br>
       	IČO: 46372024<br>
       	DIČ: CZ6902280770<br>
       	<br>
       	e-mail: <a href="mailto:info@sedlarstvi-libich.cz">info@sedlarstvi-libich.cz</a><br>
       	<br>
       	<br>
       	<strong>Otevírací doba:</strong><br>
       	Pondělí - Pátek<br>
       	8.00 - 19.00<br>
       	<br>
       	<br>
	</p>
</com:TPanel>
</body>
