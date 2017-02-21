<script language="javascript">
	if (AC_FL_RunContent == 0) {
		alert("This page requires AC_RunActiveContent.js.");
	} else {
		AC_FL_RunContent(
			'codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0',
			'width', '145',
			'height', '250',
			'src', '<%= $this->swfFile %>',
			'quality', 'high',
			'pluginspage', 'http://www.macromedia.com/go/getflashplayer',
			'align', 'middle',
			'play', 'true',
			'loop', 'true',
			'scale', 'showall',
			'wmode', 'transparent',
			'devicefont', 'false',
			'id', 'flashCiperka_01',
			'bgcolor', '#ffffff',
			'name', '<%= $this->swfFile %>',
			'menu', 'true',
			'allowFullScreen', 'false',
			'allowScriptAccess','sameDomain',
			'movie', 'themes/<%= $this->swfFile %>',
			'salign', ''
			); //end AC code
	}
</script>
<noscript>
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="145" height="250" id="flashCiperka_01" align="middle">
	<param name="allowScriptAccess" value="sameDomain" />
	<param name="allowFullScreen" value="false" />
	<param name="movie" value="<%= $this->swfFile %>.swf" /><param name="quality" value="high" /><param name="wmode" value="transparent" /><param name="bgcolor" value="#ffffff" />	<embed src="themes/flashCiperka_01.swf" quality="high" wmode="transparent" bgcolor="#ffffff" width="145" height="250" name="flashCiperka_01" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />
	</object>
</noscript>

