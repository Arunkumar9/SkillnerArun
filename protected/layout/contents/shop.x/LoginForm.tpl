<div class="<%= $this->getCssClass() %>">							
	<table>
		<tr>
			<th>Login</th>
			<td >
				<com:TTextBox Columns="10" ID="Username" />
				<com:TRequiredFieldValidator 
	    					ControlToValidate="Username"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="Zadejte přihlašovací jméno" 
	                        ValidationGroup="loginWidget"
	    					Display="Fixed" />
			</td>
			<th>Heslo</th>
			<td >
				<com:TTextBox TextMode="Password" Columns="10" ID="Password" />
				<com:TRequiredFieldValidator 
	    					ControlToValidate="Password"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="Zadejte přihlašovací heslo" 
	                        ValidationGroup="loginWidget"
	    					Display="Fixed" />
			</td>
			<td><com:TActiveButton cssClass="buttLogin" OnClick="loginClicked" OnCallback="loginClicked" ValidationGroup="loginWidget"/></td>
		</tr>											
		
	</table>
</div>
<!---
<div id="loginContainer">

<form>
				

				
	<table>
	<tr><td><label>Jmeno / Heslo</label></td></tr>
	<tr>
		<td><div class="emailField"><input type="text" name="email" value=""></div></td>
		<td></td>
	</tr>
						
	<tr>
		<td><div class="emailField"><input type="text" name="email" value=""></div></td>
		<td><input type="submit" value="" class="emailButton"></td>
	</tr>

	</table>
	<a href="" target="_blank">Registrace</a>													
</form>
</div>
--->