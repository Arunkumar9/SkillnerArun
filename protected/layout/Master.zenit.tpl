<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<com:Application.common.FEmailObfuscator />
     <com:FCachedHead   Title="<%$ siteTitle %>">


        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta content="IE=EmulateIE7" http-equiv="X-UA-Compatible"/>


<script type="text/javascript" src="/resources/highslide/highslide-full.packed.js"></script>


<script type="text/javascript"> 

hs.graphicsDir = '/resources/highslide/graphics/';
hs.align = 'center';
hs.transitions = ['expand', 'crossfade'];
hs.outlineType = 'rounded-white';
hs.fadeInOut = true;
hs.dimmingOpacity = 0.6;
hs.captionEval = 'this.thumb.alt';
if (hs.addSlideshow) hs.addSlideshow({interval: 5000,repeat: false,
									 useControls: true,
									 fixedControls: true,
									 overlayOptions:{opacity: 1,position: 'bottom center',hideOnMouseOut: true}});


</script>





<link rel="stylesheet" href="/resources/highslide/highslide.css" type="text/css"/>









       


    </com:FCachedHead>

    <body>
 <com:TForm>
        <div id="bodyContainer">

            <div id="contentContainer">

                <com:TContentPlaceHolder ID="main" >
                    <h1>Všeobecné informace o produktech</h1>

                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus interdum laoreet. Mauris a nisl quis ligula ultricies porta. Fusce accumsan laoreet dolor, a ultricies tortor ullamcorper et. <strong>Nullam faucibus</strong>, erat ac aliquet molestie, enim est vestibulum dui, a faucibus nunc lorem eu tortor. Nulla facilisi. <a href="">Nullam id nulla nunc</a>, a consectetur nibh. Aliquam <strong>vestibulum molestie viverra</strong>. Fusce elementum diam sit amet erat tincidunt at egestas tortor ullamcorper. Phasellus a leo ligula.</p>


                    <div class="gadgetsContainer">
                        <a href="#" class="gadget g0001"><span>Popisny text</span></a>
                        <a href="#" class="gadget g0002"><span>Popisny text</span></a>
                        <a href="#" class="gadget g0003"><span>Popisny text</span></a>
                        <a href="#" class="gadget g0004"><span>Popisny text</span></a>

                        <a href="#" class="gadget g0005"><span>Popisny text</span></a>
                        <a href="#" class="gadget g0006"><span>Popisny text</span></a>
                        <a href="#" class="gadget g0007"><span>Popisny text</span></a>
                        <a href="#" class="gadget g0008"><span>Popisny text</span></a>

                    </div>

                </com:TContentPlaceHolder >

                &nbsp;

            </div>


            <div id="rainbowLinksContainer">
                <com:FOutputCacheLang CachingPostBack="true"   Duration="3600" >
                    <com:FContainerListMenu id="rightMenuContainer" MaxLevel="1"
                                            JustLinks="true"
                                            EnableJS="false"
                                            CssClass="rightMenu"
                                            RootId="DIVIZE MENU"
                                            GenerateAll="true"
                                            GenerateItemClass="rl"
                                            ActiveCssClass="rainbowColorLink"
                                            InActiveCssClass="rainbowColorLink"
                                            >

                        <a href="#" class="rainbowColorLink01">Průmyslové podlahy</a>
                        <a href="#" class="rainbowColorLink02">Hydroizolace</a>
                        <a href="#" class="rainbowColorLink03">Vojenská a letecká technika</a>
                        <a href="#" class="rainbowColorLink04">Plexisklo</a>
                        <a href="#" class="rainbowColorLink05">CNC obráběcí stroje</a>
                        <a href="#" class="rainbowColorLink06">Střešní světlíky</a>
                        <a href="#" class="rainbowColorLink07">Bezpečné ulice</a>
                        <a href="#" class="rainbowColorLink08">Polykarbonát </a>
                    </com:FContainerListMenu>
                </com:FOutputCacheLang>

            </div>


            <div id="themeImageContainer">

				
				
                
					<table class="searchTable">
					    <tr>
							<td><com:TTextBox ID="SearchText" cssclass="searchField" /></td>
    	                	<td><com:TButton cssclass="searchButton"  OnClick="TemplateControl.SearchButtonClicked" /></td>
						</tr>
               		</table>
		
				


            </div>






            <div id="leftContainer">
                <div id="menuContainer">
                    <div class="productMenuHead"><com:FCmsLiteral CmsLink="local:@code=sortiment" /></div>

                    <com:FContainerListMenu id="leftMenuContainer"
                                            EnableJS="false"
                                            RootId="local:@code=sortiment"
                                            GenerateItemClassInLi="it"
                                            GenerateAll="false"
                                            ActiveCssClass="current"
                                            MaxLevel="10"
                                            cssClass="topMenu"
                                            MaxDistance="2"
                                            >
                        <ul class="topMenu1">

                        <li class="it1 it1-1"><a href="#">Komůrkové desky polykarbonátové</a>

                            <li class="it1 it1-2"><a href="#">Trapézové a vlnité desky</a>
                                <ul class="topMenu2">
                                    <li class="it2 it2-1"><a href="#">podpoložka text střední #21</a>
                                        <ul class="sideMenu3">
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>

                                        </ul>

                                    </li>

                                    <li class="it2 it2-2"><a href="#">podpoložka text střední #22</a>
                                        <ul class="sideMenu3">
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                            <li class=""><a href="#">podpoložka text střední </a></li>
                                        </ul>
                                    </li>


                                    <li class="it2 it2-3"><a href="#">podpoložka text střední #23</a>
                                        <ul class="topMenu3">
                                            <li class="it3 it3-1"><a href="#">podpoložka text střední #31</a></li>
                                            <li class="it3 it3-2"><a href="#">podpoložka text střední #32</a></li>
                                            <li class="it3 it3-3 it3-last"><a href="#">podpoložka text střední #33</a></li>
                                        </ul>
                                    </li>


                                    <li class="it2 it2-4"><a href="#">podpoložka text střední #24</a></li>
                                    <li class="it2 it2-5 it2-last"><a href="#">podpoložka text střední #25</a></li>
                                </ul>
                            </li>

                            <li class="it1 it1-1"><a href="#">Komůrkové desky polykarbon</a></li>       
                            <li class="it1 it1-1"><a href="#">Komůrkové átové</a></li>       


                            <li class="it1 it1-1"><a href="#">Komů lykarbonátovéssss</a>

                                <ul class="sideMenu2">
                                    <li class=""><a href="#">podpoložka text střední </a></li>
                                    <li class=""><a href="#">podpoložka text střední </a></li>
                                    <li class=""><a href="#">podpoložka text střední </a></li>
                                </ul>


                            </li>





                            <li class="it1 it1-1"><a href="#">Komůrkové</a></li>       																												



                    </ul>

                    </com:FContainerListMenu>
               
                </div>







                <div class="stdMenuContainer">
                    <div class="stdMenuHead"><com:FCmsLiteral CmsLink="local:@code=informace" /></div>
                    <com:FContainerListMenu id="stdMenuContainer"
                                            EnableJS="false"
                                            RootId="local:@code=informace"
                                            GenerateAll="true"
                                            MaxLevel="1"
                                            cssClass="simpleMenu"
                                            >
                    <ul class="simpleMenu">
                        <li><a href="#">CENÍKY</a></li> 
                        <li><a href="#">Prospekty ke stažení</a></li>
                        <li><a href="#">Certifikáty polykarbonát</a></li>
                        <li><a href="#">Montážní postup</a></li>
                        <li><a href="#">Záruka</a></li>
                        <li><a href="#">Kontakty</a></li>
                        <li><a href="#">Otevírací doba</a></li>
                        <li><a href="#">Rozvoz</a></li>
                    </ul>

                    </com:FContainerListMenu>

                </div>

                <div class="extraLeftContent"><com:TContentPlaceHolder ID="left" /></div> 


            </div>













            <div class="breadCrumbContainer">
                <div>Nacházíte se v sekci</div>
                <com:FSitemapPath Separator=" | " />
                <!--- <a href="#">POLYKARBONÁT</a> | <a href="#">KOMŮRKOVÉ DESKY POLYKARBONÁTOVÉ</a> | <span>POLOŽKA # 45 STŘEDNĚ DLOUHÁ</span> --->
            </div>
 

            <div id="topContainer">
                <a href="http://www.zenit.cz" class="homeLink"><span>Zenit, spol. s r.o.</span></a>


                <com:FCmsLink CmsLink="local:@code=sitemap" cssClass="sitemapLink" Text="mapa webu | sitemap" />


                <div class="langContainer">
<!---                  <com:FContentReader ContainerUid="this:lang-menu-local|SHARED/lang menu" /> --->
                   <com:FContentReader ContainerUid="this:lang-menu-local|local:lang-menu-local|SHARED/lang menu" />
				   		   
                </div>

				<div class="horizontalHeading"> </div> 


                <div class="horizontalMenuContainer">
                    <com:FContainerListMenu id="horizontalMenuContainer"
                                            EnableJS="false"
                                            JustLinks="true"
                                            RootId="local:@code=horni-menu"
                                            GenerateAll="true"
                                            MaxLevel="1"
                                            />
                </div>







            </div>

        </div>





        <div id="footerContainer">
            <div id="footerContent">
                <com:FContentReader ContainerUid="local:footer-local|SHARED/footer" />
               



            </div>


        </div>








 </com:TForm>

 <com:TClientScript >
    //make all these image highslided
    if (hs) {
        $$('.fresh-highslide').each(function(e){
           var src = e.readAttribute('src');
           var srchi = src.replace(/\.[0-9]{1,3}x[0-9]{1,3}/,'');
           //if (srchi != src)
               e.wrap('a', { 'href': srchi, 'rel': 'highslide', 'class': 'highslide'});
        });
    }
    </com:TClientScript >
<!---
<com:TClientScript >
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-6210345-3']);
  _gaq.push(['_setDomainName', 'none']);
  _gaq.push(['_setAllowLinker', true]);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

 </com:TClientScript>
--->
    </body>
</html>