<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr">

<com:FCachedHead   Title="<%$ siteTitle %>">


        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta content="IE=EmulateIE7" http-equiv="X-UA-Compatible"/>


<script type="text/javascript" src="resources/highslide/highslide-full.packed.js"></script>
<com:TClientScript>

hs.graphicsDir = 'resources/highslide/graphics/';
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

</com:TClientScript>

<link rel="stylesheet" href="resources/highslide/highslide.css" type="text/css"/>

</com:FCachedHead>


<body id="top">
<com:TForm>
 
<div id="layout_wrapper_outer">
<div id="layout_wrapper">

	<div id="layout_top">
		
		<div id="site_title">
			<com:FContentReader ContainerUid="this:dashboard-heading|DASHBOARD/heading" />
		</div>

	</div>

	<div id="layout_body_outer">
	<div id="layout_body">

		<div id="navigation">

			<div id="nav1">

                    <com:FContainerListMenu id="topMenuContainer1"
                                            EnableJS="false"
                                            RootId="HORIZONTAL MENU"
                                            GenerateItemClass=false
                                            GenerateAll="false"
                                            MaxLevel="1"
                                            ActiveCssClass="current_page_item"
                                            cssClass="nav1"
                                            >				<ul>
					<li class="current_page_item"><a href="index.html">Home</a></li>
					<li><a href="blog_post.html">Blog Post</a></li>
					<li><a href="style_demo.html">Style Demo</a></li>
					<li><a href="archives.html">Archives</a></li>
					<li><a href="empty_page.html">Empty Page</a></li>
				</ul>
                        </com:FContainerListMenu>
				<div class="clearer">&nbsp;</div>

			</div>

			<div id="nav2">
<!---
                    <com:FContainerListMenu id="topMenuContainer2"
                                            EnableJS="false"
                                            RootId="this:"
                                            GenerateItemClass=false
                                            GenerateAll="false"
                                            MaxLevel="1"
                                            ActiveCssClass="current_page_item"
                                            cssClass="nav1">
				<ul>
					<li class="current_page_item"><a href="#">First subpage</a></li>
					<li><a href="#">Second subpage</a></li>
					<li><a href="#">Third subpage</a></li>
					<li><a href="#">And so on..</a></li>
				</ul>
                            </com:FContainerListMenu> --->
				<div class="clearer">&nbsp;</div>

			</div>

		</div>

		<div id="main">

			<div class="left" id="content_outer">
				<div id="content">
<com:TContentPlaceHolder ID="main" >
					<div class="post">

						<div class="post_title"><h2><a href="#">Template Information</a></h2></div>
						<div class="post_date">Posted on Apr 1st at 15:57 by <a href="#">Viktor Persson</a></div>
						
						<div class="post_body">
						
							<p>This is a free website template by <a href="http://arcsin.se/">Arcsin</a>, built using tableless XHTML and CSS.</p>
							
							<p>This template is distributed under a <a href="http://templates.arcsin.se/license/">Creative Commons Attribution 2.5 License</a>, which allows you to use and modify it for any purpose (personal and commercial), under the condition that you keep the provided credit links in the footer.</p>

							<p>The latest template version and CMS conversions for platforms such as WordPress and Blogger can be found at the official <a href="http://templates.arcsin.se/cerulean-elegance-website-template/">Cerulean Elegance website template</a> page.</p>

							<p>For more templates, questions and comments please visit <a href="http://templates.arcsin.se/">Arcsin Web Templates</a>.</p>

							<p>Have fun!</p>

						</div>
						
						<div class="post_meta">
							<a href="#">5 comments</a> | Tagged: <a href="#">Sapien</a>, <a href="#">Sollicitudin</a>, <a href="#">Ligula</a>
						</div>

					</div>

					<div class="post">

						<div class="post_title"><h2><a href="#">Porttitor posuere</a></h2></div>
						<div class="post_date">Posted on Dec 11th at 16:12 by <a href="#">Aliquet Quis</a></div>
						
						<div class="post_body">
						
							<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc sagittis. Proin ac felis. Consectetuer adipiscing elit. Pellentesque enim dui, rhoncus ut, pharetra</p>
							
							<ul>
								<li>List item 1</li>
								<li>List item 2</li>				
								<li>List item 3</li>
							</ul>	
							
							<p>Luctus vitae, dolor. Nunc mauris eros, vehicula id, fermentum non, semper ac, nisl. Cras sed purus non justo lobortis rhoncus. Morbi consectetuer augue.</p>

							<p>Donec ligula lorem, varius eget, semper eget, aliquet quis, lectus. Vestibulum ipsum nunc, aliquet quis, blandit ac, varius a, est. Praesent dictum. Sed feugiat magna sed lorem. Nulla tempus sodales ipsum. In vitae purus eget quam.</p>

							<blockquote><p>Luctus vitae, dolor. Nunc mauris eros, vehicula id, fermentum non, semper ac, nisl. Cras sed purus non justo lobortis rhoncus. Morbi consectetuer augue</p></blockquote>

							<p>Luctus vitae, dolor. Nunc mauris eros, vehicula id, fermentum non, semper ac, nisl. Cras sed purus non justo lobortis rhoncus. Morbi consectetuer augue.</p>


						</div>
						
						<div class="post_meta">
							<a href="#">11 comments</a> | Tagged: <a href="#">Purus</a>, <a href="#">Semper</a>, <a href="#">Vestibulum</a>
						</div>

					</div>	
</com:TContentPlaceHolder  >
				</div>
			</div>

			<div class="right" id="sidebar_outer">
				<div id="sidebar">
                                        <com:FContentReader ContainerUid="this:side|SHARED/side" />
                                        <!--
                                        <com:TContentPlaceHolder ID="side" />
                                        -->
					<!---
                                        <div class="box">

						<h2>About</h2>

							<p>Aenean sit amet dui at felis lobortis dignissim. Pellentesque risus nibh, feugiat in, convallis id, congue ac, sem. Sed tempor neque in quam.</p>

					</div>

					<div class="box">

						<div class="box_title">Categories</div>

						<div class="box_content">
							<ul>
								<li><a href="http://templates.arcsin.se/category/website-templates/">Website Templates</a></li>
								<li><a href="http://templates.arcsin.se/category/wordpress-themes/">Wordpress Themes</a></li>
								<li><a href="http://templates.arcsin.se/professional-templates/">Professional Templates</a></li>
								<li><a href="http://templates.arcsin.se/category/blogger-templates/">Blogger Templates</a></li>
								<li><a href="http://templates.arcsin.se/category/joomla-templates/">Joomla Templates</a></li>
							</ul>
						</div>

					</div>

					<div class="box">

						<div class="box_title">Resources</div>

						<div class="box_content">
							<ul>
								<li><a href="http://templates.arcsin.se/">Arcsin Web Templates</a></li>
								<li><a href="http://www.google.com/">Google</a> - Web Search</li>
								<li><a href="http://www.w3schools.com/">W3Schools</a> - Online Web Tutorials</li>
								<li><a href="http://www.wordpress.org/">WordPress</a> - Blog Platform</li>
								<li><a href="http://cakephp.org/">CakePHP</a> - PHP Framework</li>
							</ul>
						</div>

					</div>

					<div class="box">

						<div class="box_title">Gallery</div>

						<div class="box_content">

							<div class="thumbnails">
								
								<a href="#" class="thumb"><img src="sample-thumbnail.jpg" width="64" height="64" alt="" /></a>
								<a href="#" class="thumb"><img src="sample-thumbnail.jpg" width="64" height="64" alt="" /></a>
								<a href="#" class="thumb"><img src="sample-thumbnail.jpg" width="64" height="64" alt="" /></a>
								<a href="#" class="thumb"><img src="sample-thumbnail.jpg" width="64" height="64" alt="" /></a>
								<a href="#" class="thumb"><img src="sample-thumbnail.jpg" width="64" height="64" alt="" /></a>
								<a href="#" class="thumb"><img src="sample-thumbnail.jpg" width="64" height="64" alt="" /></a>

								<div class="clearer">&nbsp;</div>

							</div>

						</div>

					</div>
                                        --->
				</div>
			</div>

			<div class="clearer">&nbsp;</div>

		</div>

		<div id="dashboard">
			<div id="dashboard_inner">

				<div class="col3 left">
					<div class="col3_content">
                                                <com:FContentReader ContainerUid="this:dashboard-column1|DASHBOARD/column1" />
					</div>
				</div>

				<div class="col3mid left">
					<div class="col3_content">
                                                <com:FContentReader ContainerUid="this:dashboard-column2|DASHBOARD/column2" />
					</div>
				</div>

				<div class="col3 right">
					<div class="col3_content">
                                                <com:FContentReader ContainerUid="this:dashboard-column3|DASHBOARD/column3" />
					</div>
				</div>

				<div class="clearer">&nbsp;</div>

			</div>
		</div>

	</div>
	</div>

	<div id="footer">

		<div class="left">
			<com:FContentReader ContainerUid="this:dashboard-footer|DASHBOARD/footer" />
		</div>
		<div class="right">
			<a href="http://templates.arcsin.se/">Website template</a> by <a href="http://arcsin.se/">Arcsin</a> <!---,  <a href="http://freshadmin.org/">Content Management System</a> by <a href="http://freshadmin.org/">FreshAdmin</a> --->
		</div>
		
		<div class="clearer">&nbsp;</div>

	</div>

</div>
</div>
</com:TForm>

</body>
</html>