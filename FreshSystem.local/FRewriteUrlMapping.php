<?php
/**
 * FRewriteUrlMapping class file.
 *
 * @author Jan Rosa <jan.rosa[at]freshconcept[dot]cz>
 * @link http://www.freshconcept.cz/
 * @copyright Copyright &copy; 2007 Jan Rosa
 * @license http://www.pradosoft.com/license/
 * @version $Id: FRewriteUrlMapping.php 2348 2013-12-20 10:20:54Z arun $
 * @package FreshSystem
 */

Prado::using('System.Web.TUrlMapping');

/**
	FRewriteUrlMapping Class
	
	file: FRewriteUrlMapping.php

	This class overrides TUrlMapping::constructUrl
	to make SEO friendly urls.

	inspired by: avner,mikl PradoSoft forum 
	
	application.xml
	<module id="request" class="THttpRequest" UrlManager="friendly-url" UrlFormat="Path" />
    <module id="friendly-url" class="Application.common.MyUrlMapping"/>
	
	
	.htaccess
	RewriteEngine On

	# if URL is of a file that really exists, don't rewrite URL
	RewriteCond %{REQUEST_FILENAME} !-f
	
	# /page.path/params-> /index.php/page,page.name/params
	RewriteRule ^(.*){0,1}$ index.php/page,$1 [QSA,L]
*/

class FRewriteUrlMapping extends TUrlMapping
{
	/**
		override url constructor to create custom URLs
		without index.php
		default service is page, therefor it is omitted if this is the serviceID
	 */
	public function constructUrl($serviceID,$serviceParam,$getItems,$encodeAmpersand,$encodeGetItems)
	{
		$url=($serviceID==="page")?($serviceParam):($serviceID.'='.$serviceParam);
		$amp=$encodeAmpersand?'&amp;':'&';
		$request=$this->getRequest();
		if(is_array($getItems) || $getItems instanceof Traversable)
		{
			if($encodeGetItems)
			{
				foreach($getItems as $name=>$value)
				{
					if(is_array($value))
					{
						$name=urlencode($name.'[]');
						foreach($value as $v)
							$url.=$amp.$name.'='.urlencode($v);
					}
					else
						$url.=$amp.urlencode($name).'='.urlencode($value);
				}
			}
			else
			{
				foreach($getItems as $name=>$value)
				{
					if(is_array($value))
					{
						foreach($value as $v)
							$url.=$amp.$name.'[]='.$v;
					}
					else
						$url.=$amp.$name.'='.$value;
				}
			}
		}
		
		$base_url = str_replace('index.php', '', $request->getAbsoluteApplicationUrl());
		if (empty($url)) return $base_url;
		
		if($request->getUrlFormat()===THttpRequestUrlFormat::Path)
			return $base_url.strtr($url,array($amp=>'/','?'=>'/','='=>$request->getUrlParamSeparator()));
		else
			return $base_url.$url;
	}
	
}
?>