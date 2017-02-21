<?php

class FConvertorBase
{
	static public function In($text)
	{
		return $text;
	}
	static public function Out($text)
	{
		return $text;
	}

	static public function Load($text)
	{
		return $text;
	}

	static public function factory($parent)
	{
		$control = Prado::createComponent('TLiteral');
		$control->setText($parent->getText());
		return $control;
	}

	static protected function filterTables($xhtml)
	{
		static $allowed = array('colspan'=>'*',
								'rowspan'=>'*',
								);
		static $forced = array('cellspacing'=>0,
								'cellpadding'=>0,
								'border'=>'0'
								);
		$xhtml = preg_replace('/<html[^>]*>/is','<html>',$xhtml);
		if (!stristr($xhtml,'<body'))
			$xhtml = "<head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body>".$xhtml.'</body>';
		if (!stristr($xhtml,'<html'))
			$xhtml = '<html>'.$xhtml.'</html>';
		preg_match('/<html>.*<\/html>/is',$xhtml,$m);
		
		$d = new DOMDocument; //dom_import_simplexml($x);
		$d->loadHTML($m[0]);

//		if (!stristr($xhtml,'<html'))
//			$xhtml = '<html>'.$xhtml.'</html>';
		Prado::Trace('filter '.TVarDumper::dump($xhtml));
		$xml = simplexml_load_string($d->saveXML());	
		$filtered = '';
		$tables = $xml->xpath('//table');
		foreach ($tables as $table)
		{
			self::clearAttributes(&$table,$allowed,$forced);
			$th = $table->xpath('//tr[1]');
			$th[0]['class'] .= ' '.FU::Ini('Style.tableHeading');
			//$th = $table->xpath('/table/tr[1]')
			$filtered .= $table->asXML();
		}
		
		return $filtered;
		
	}
	
	static protected function clearAttributes(&$xml,$allowed=array(),$forced=array())
	{
		Prado::Trace('attr count '.count($xml->attributes()));
		$attr = array();
		foreach ($xml->attributes() as $a => $v)
		{
			//Prado::Trace('attr of '.substr($xml->asXML(),0,20).' '.$a.' = '.$v);
			$a1 = strtolower($a);
			if (!isset($allowed[$a1]))
			{
				$attr[] = $a; //$xml[$a]='';
				//unset($xml[$a]);
			}
		}
		foreach ($attr as $a)
			unset($xml[$a]);
		
		foreach ($forced as $a => $v)
		{
			$xml[strtolower($a)] = $v;
		}
		
		$i = 1;
		foreach ($xml->children() as $child)
		{
			self::clearAttributes(&$child,$allowed);
			if (isset($child['class']))
				$child['class'] .= " ".FU::Ini('Style.nth').$i;
			else
				$child['class'] = FU::Ini('Style.nth').$i;
			$i++;
		}
	} 
	
	static public function stripTags($text,$tags="a|p|font|col")
	{
//		return strip_tags($text,$tags);
//		$text = preg_replace('/(<('.$tags.')([ \/][^>]*>|>)|(<\/('.$tags.')( [^>]*>|>))/is','',$text);

		$text = preg_replace('/<('.$tags.')[^>]*>|<\/('.$tags.')[^>]*>/is','',$text);
		return $text;

	}

}
class FConvertorCatalogPage extends FConvertorBase { }
class FConvertorLevel1 extends FConvertorBase { }
class FConvertorText extends FConvertorBase { }
class FConvertorSourceText extends FConvertorBase { }
class FConvertorCatalogOverview extends FConvertorBase { }
class FConvertorHeading1 extends FConvertorBase { }
class FConvertorHeading2 extends FConvertorBase { }

class FConvertorBoxedText extends FConvertorBase 
{
	static public function factory($parent)
	{
		$control = Prado::createComponent('MBasicBox');
		$control->setText($parent->getText());
		$control->setHeaderText($parent->content->name);
		return $control;
	}
}
class FConvertorProductTable extends FConvertorBase
{
	static public function SelectProductCode($text)
	{
		preg_match_all('/[0-9]{3} [0-9]{3} [0-9]{3} [0-9]{3}/',$text,$m);
		
		foreach ($m[0] as $pid) {
			$url = Prado::getApplication()->getRequest()->constructUrl('page','cart',array('add'=>1,'code'=>str_replace(' ','',$pid)));
			$text = str_replace($pid,'<a href="'.$url.'">'.$pid.'</a>',$text);
		}
		return $text;
	}

	static public function Out($text,$content=null)
	{
		$text = self::SelectProductCode($text);
		return str_replace('<table','<table class="'.FU::Ini('Style.ProductTable').'" ',$text);
	}
	
	static public function In($text,$content=null)
	{
		$text = self::filterTables($text);
		return self::stripTags($text);
		
	}

	static public function Load($text)
	{
		return self::Out($text);
	}

}

class FConvertorProductTableChem extends FConvertorProductTable
{
	static public function Out($text,$content=null)
	{
		$text = self::SelectProductCode($text);
		return str_replace('<table','<table class="'.FU::Ini('Style.ProductTableChem').'" ',$text);
	}
	
	static public function In($text,$content=null)
	{
		$text = self::filterTables($text);
		return self::stripTags($text);
	}

	static public function Load($text)
	{
		return self::Out($text);
	}
	
}

class FConvertorImage extends FConvertorBase
{
	
	static public function Out($text,$content=null)
	{
		if (stristr($text,'<img'))
			return $text;
		else
			return '<img src="'.$text.'"  />'; //class="ProductImage"
	}
	
	static public function In($text,$content=null)
	{
		return $text;
	}	

	static public function Load($text)
	{
		return self::Out($text);
	}
	
}
class FConvertorChemistryIcon extends FConvertorImage {

	static public function Out($text,$content=null)
	{
		$text = htmlspecialchars($text);
		return '<img src="'.$text.'" />';//class="ChemistryIcon" 
	}

}

class FConvertorLinkFile extends FConvertorBase
{
	
/*
	static public function Out($text,$content=null)
	{
		if (!$text) 
			return '';
			
		$xml = simplexml_load_string($text);
		
		$link = $xml->a[0];
		
		if ($a['class']) {
			$a['class'] = (strpos($a['class'],'LinkFile')===false)?'LinkFile':$a['class'].' LinkFile';
		} else {
			$a->addAttribute('class','LinkValue');
		}
		return $xml->asXML();
		
	}

*/	
	static public function factory($parent)
	{
		$control = Prado::createComponent('FDownloadHyperLink');
		$data = json_decode($parent->getText());
		$control->setText($data->name);
		$control->setNavigateUrl($data->url);
		$control->setSecureDownload(FU::Ini('Security.FileDownload'));
//		$control->setTarget($data->target);
		$control->setTarget('_download');
		return $control;
	}

	static public function In($text,$content=null)
	{
		return $text;
	}	

	static public function Load($text)
	{
		return json_decode($text);
	}
	
}

class FConvertorProductText extends FConvertorBase
{
	
	static public function Out($text,$content=null)
	{
		return str_replace('<table','<table class=" '.FU::Ini('Style.InTextTable').'" ',$text);
//		return $text;
	}
	
	static public function In($text,$content=null)
	{
		return self::filterText($text);
	}
	
	static protected function filterText($xhtml)
	{
		static $allowed = array('colspan'=>'*',
								'rowspan'=>'*',
								);
		static $forced = array('cellspacing'=>0,
								'cellpadding'=>0,
								'border'=>'0'
								);
		$xhtml = preg_replace('/<html[^>]*>/is','<html>',$xhtml);
		if (!stristr($xhtml,'<body'))
			$xhtml = "<head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body>".$xhtml.'</body>';
		if (!stristr($xhtml,'<html'))
			$xhtml = '<html>'.$xhtml.'</html>';
		preg_match('/<html>.*<\/html>/is',$xhtml,$m);
		Prado::Trace('text filter finish '.TVarDumper::dump($xhtml));
		$d = new DOMDocument; //dom_import_simplexml($x);
		$d->loadHTML($m[0]);

		$doc = $d->documentElement;
		$xml = simplexml_import_dom($doc);
		$filtered = '';
		$tables = $xml->xpath('//table');
		foreach ($tables as $table)
		{
			self::clearAttributes(&$table,$allowed,$forced); //$t[] = $table;
			//$tableXML = self::stripTags($table->asXML());
			//$table = simplexml_load_string($tableXML);
		}

//		foreach ($t as $v)
//			$v->parentNode->removeChild($v);

		self::clearAttributes(&$xml,$allowed+$forced);
		$body = $xml->xpath('//body');
		$filtered = $body[0]->asXML();
		$text = self::stripTags($filtered,'font');
		Prado::Trace('text filter finish '.TVarDumper::dump($text));
		return $text;
		
	}
	
	static public function Load($text)
	{
		return self::Out($text);
	}
	
	
}


class FConvertorProductPerex extends FConvertorProductText  {

	static public function Out($text,$content=null)
	{
		if ($st = strip_tags($text))
			return substr($st,0,FU::Ini('Content.PerexLength')).'&nbsp;...';
		else	
			return '';
	}
	
}

?>