<%@ MasterClass="Application.layout.eshopMaster" %>
<com:TContent ID="main">
<div id="loadingIcon" style="display: none"></div>
<com:FAncestorsHint Name="<%[ Nákupní košík ]%>" ParentId="59" />
<com:FActivePanelReceiver ID="ActiveReceiver" ListenOn="OnCartChanged,OnBack,OnLogin,OnInsertToCart,OnSubmitCart,OnPersonalData,OnFinalizeOrder" >
	<com:TMultiView ID="View" ActiveViewIndex="0" >

			<com:TView ID="CartView"  >
				<h1><%[ Nákupní košík ]%></h1>

				<h2><%[ Položky v košíku ]%></h2>
				<br/>
				<com:ShoppingCart ID="Cart" />
			</com:TView>

			<com:TView ID="PersonalDataView"  >
				<h1><%[ Objednávka zboží ]%></h1>

				<com:PersonalDataForm ID="PersonalData" cssClass="standardForm"/>
			</com:TView>

			<com:TView ID="SummaryView"  >
				<com:OrderSummary ID="OrderSummary" />
	
			</com:TView>

			<com:TView ID="FinalView"  >
				<h1><%[ Objednávka zboží ]%></h1>

				<h2>Vaše objednávka byla úspěšně přijata</h2>
				<strong>Děkujeme za vaši objednávku!</strong><br />
				<br />
				<com:FinalNotice ID="FinalNotice" cssClass="tabSouhrnObjednavky" />
			</com:TView>

	</com:TMultiView>
</com:FActivePanelReceiver >
<!---
<com:TClientScript >
function deleteValidatorManager(formID) {
	if (Prado.Validation.managers[formID])
		delete Prado.Validation.managers[formID];
}
</com:TClientScript>	
--->
<com:XGlobalCallbackOptions>
	<prop:ClientSide.OnLoading>
		$('loadingIcon').show();
	</prop:ClientSide.OnLoading>
	<prop:ClientSide.OnComplete>
		$('loadingIcon').hide();
	</prop:ClientSide.OnComplete>	
</com:XGlobalCallbackOptions>
</com:TContent >