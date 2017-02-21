
<h3>1. Položky v nákupním košíku</h3>				
				<com:CartSummary ID="CartSummary" cssClass="basketSummaryTableReview" />




				
				<h3>2. Způsob platby a dobravy zboží </h3>
				<div class="infoBox">                				
                <%= $this->Cart->Payment %><br />
                </div>
				
				<h3>3. Dodací adresa</h3>
				<div class="infoBox">
				<com:PersonalDataSummary ID="PersonalDataSummary" cssClass="basketTableSummary"/>
				</div>

				<h3>4. Fakturační adresa (je-li jiná než dodací)</h3>
				<div class="infoBox">
				<com:PersonalDataBillingSummary ID="PersonalDataBillingSummary" cssClass="basketTableSummary"/>
				</div>
				
				<h3>5. Celková cena</h3>
				<div class="infoBox">
				Celková cena zboží včetně dopravy činí <span class="finalPrice"><%= $this->Cart->sumWithAddOn() %></span> s DPH.
				</div>

<br />

			<div class="buttonsTable">
				<com:TActiveButton cssClass="buttonBack" Text="<%[ Zpět na dodací údaje ]%>" OnClick="backClicked" OnCallback="backClicked" CausesValidation="false" />
				&nbsp;&nbsp;
				<com:TActiveButton cssClass="buttonNextStep" Text="<%[ Potvrdit a odeslat objednávku ]%>" OnClick="finalizeOrderClicked" OnCallback="finalizeOrderClicked" />
</div>
