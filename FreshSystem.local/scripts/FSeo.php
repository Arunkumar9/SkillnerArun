<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class FSeo
{
    public static function readSeoFeeds($config)
    {
	$file = Prado::getPathOfNamespace($config,'.yml');
	if (!is_file($file))
	    throw new TConfigurationException('nonexistent format file '.$file);
	$list = syck_load_normalized(file_get_contents($file));
	if (!is_array($list))
	    throw new TConfigurationException('wrong format file');

	$params = Prado::getApplication()->getParameters();
	$baseurl = $params['SiteUrl'];

	$feed = new TXmlDocument('1.0', 'utf-8');
	$feed->setTagName('sitemapindex');
	$feed->setAttribute('xmlns','http://www.sitemaps.org/schemas/sitemap/0.9');
        $maps = new TXmlElement('sitemap');

	foreach($list['auto-read-types'] as $type=>$output)
	{
	    echo $type."-------------\n";
	    if ($type == 'sitemap.index')
	    {
		$index = $output;
		continue;
	    }
	    if (is_array($output))
	    {
		$base = $output['siteUrl'];
		$output = $output['file'];
	    }
	    else
	    {
		$base = Prado::getApplication()->Parameters['SiteUrl'];
	    }
	    echo $base."---".$output."----------\n";

	    if (stristr($type,'sitemap'))
	    {
		$loc = new TXmlElement('loc');
		$loc->setValue(self::readFeed($type,$output,$base,true));
		$maps->Elements[] = $loc;
		$loc = new TXmlElement('lastmod');
		$loc->setValue(strftime('%FT%T%z'));
		$maps->Elements[] = $loc;
	    }
	    else
	    {
		self::readFeed($type,$output,$base);
	    }

	}

	$feed->Elements[] = $maps;

	$index = (!$index)?'sitemap.index.xml':$index;
	file_put_contents($index, $feed->saveToString());
    }

    public static function readFeed($type,$file,$base,$gzip=false)
    {
	$url = $base.'/xml/'.$type;
	`wget -O $file $url`;
	if ($gzip)
	{
	    `gzip -f $file`;
	    return $base.$file.'.gz';
	}
	return $base.$file;

    }

}

?>
