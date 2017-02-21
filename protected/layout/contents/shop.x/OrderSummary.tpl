				<h1>Objednávka zboží</h1>
				
				<h2>Souhrn objednávky</h2>
				
				<h3>1. Položky v nákupním košíku</h3>
				<com:CartSummary ID="CartSummary" cssClass="basketTableSummary" />
				<br/>
				<br/>
				<h3>2. Způsob platby a dobravy zboží </h3>
				<%= $this->Cart->Payment %><br />
				
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
				Celková cena zboží včetně dopravy činí <span class="finalPrice"><%= $this->Cart->sumWithAddOn() %></span> s DPH.
				
				<br />
				
				<div class="horLine"></div>
				
				<br />
				<br />
				<br />

				<com:TActiveButton cssClass="buttZpet" Text="<%[ O krok zpět ]%>" OnClick="backClicked" OnCallback="backClicked" CausesValidation="false" />
				&nbsp;&nbsp;
				<com:TActiveButton cssClass="buttObjednat" Text="<%[ Odeslat objednávku ]%>" OnClick="finalizeOrderClicked" OnCallback="finalizeOrderClicked" />
