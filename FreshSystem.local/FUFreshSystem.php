<?php

class FUFreshSystem
{

	const VersionName = 'FreshAdmin: %s ver. 0.7-beta2 (Kaive)';
	
	public static function Culture()
    {
            return Prado::getApplication()->getGlobalization()->getCulture();
    }

	public static function CurrencyName()
    {
            return Prado::getApplication()->getGlobalization()->getCurrency()->currency_local;
    }
	
	public static function Currencyfy($price,$priceWrap=null,$culture=null)
	{
		return Prado::getApplication()->getGlobalization()->getCurrencyFormat($price,$priceWrap,$culture);
	}

	static function getVersionName($name) 
	{
		return sprintf(self::VersionName,$name);
	}
	static function getIniValue($name)
	{
		return self::Ini($name);
	}

	static function Ini($name)
	{
		static $config=null;

		if (strstr($name,'.')) {
			list($cls,$method) = explode('.',$name);
		    $cls = 'FIni'.ucfirst($cls); //str_replace('.','::',$name));
		} else {
			$method = $name;
		    $cls = 'FIni';
			
		}
		$cnst = $cls.'::'.$method;
		
		if (!defined($cnst)) return call_user_func($cnst);
		
          return constant($cnst);
			
/*		
		
		if (defined($cnst.'ByUser') && constant($cnst.'ByUser'))
			return constant($cnst).constant($cnst.'ByUser').Prado::getApplication()->getUser()->username;
		else

		if ($config===null)
			$config = FU::readINIfile(self::INI_CONFIG_STORE);
		
		if (strpos($name,'.')===false)
			return $config['root'][$name];
		else
		{
			list($section,$key) = explode('.',$name);
			return $config[$section][$key];
		}
		*/
	}
        static function safeGlob($dir,$flags) {

            $result = glob($dir,$flags);

            return ($result == false) ? array() : $result;
        }

        static function readValues($val)
	{
		if (!trim($val))
			return array();
		$lines = explode("\n",$val);
		foreach ($lines as $line)
		{
			$line = trim($line);
			$l = explode(':',$line,2);
			$result[$l[0]]=trim(trim($l[1],'"'));
		}
		return (is_array($result)) ? $result : array();
	}
	
	static function writeValues($ary)
	{
		//$ary = (is_string($ary) || !is_array($ary) || !($ary instanceof Traversable)) ? array($ary) : $ary;
			
		
		foreach ($ary as $k => $v)
		{
                    if ($v !== null)
                        $r .= $k . ': ' . $v . "\n";
		}
		return trim($r);
	}
	
	static function ellipsis($s,$l=25)
	{
		if (strlen($s)>$l)
			return substr($s,0,$l).'...';
		else
			return $s;
	}
	
	static function goodName($name,$lower=true,$short=true) {
		$name = ($lower)?strtolower($name):$name;
		if ($short) {
			$name = str_replace(array(',','.',';'),'',$name);
			$name = str_replace(array('    ','   ','  '),'',$name);
		}
		return strtr($name," ,;.ňťúůěščřžýáíé","____ntuuescrzyaie");
		
			
					
	}
	
	// UTF-8 to ASCII for diacritic chars
	static function utf2ascii($s)
	{
	    static $tbl = array("\xc3\xa1"=>"a","\xc3\xa4"=>"a","\xc4\x8d"=>"c","\xc4\x8f"=>"d","\xc3\xa9"=>"e","\xc4\x9b"=>"e","\xc3\xad"=>"i","\xc4\xbe"=>"l","\xc4\xba"=>"l","\xc5\x88"=>"n","\xc3\xb3"=>"o","\xc3\xb6"=>"o","\xc5\x91"=>"o","\xc3\xb4"=>"o","\xc5\x99"=>"r","\xc5\x95"=>"r","\xc5\xa1"=>"s","\xc5\xa5"=>"t","\xc3\xba"=>"u","\xc5\xaf"=>"u","\xc3\xbc"=>"u","\xc5\xb1"=>"u","\xc3\xbd"=>"y","\xc5\xbe"=>"z","\xc3\x81"=>"A","\xc3\x84"=>"A","\xc4\x8c"=>"C","\xc4\x8e"=>"D","\xc3\x89"=>"E","\xc4\x9a"=>"E","\xc3\x8d"=>"I","\xc4\xbd"=>"L","\xc4\xb9"=>"L","\xc5\x87"=>"N","\xc3\x93"=>"O","\xc3\x96"=>"O","\xc5\x90"=>"O","\xc3\x94"=>"O","\xc5\x98"=>"R","\xc5\x94"=>"R","\xc5\xa0"=>"S","\xc5\xa4"=>"T","\xc3\x9a"=>"U","\xc5\xae"=>"U","\xc3\x9c"=>"U","\xc5\xb0"=>"U","\xc3\x9d"=>"Y","\xc5\xbd"=>"Z");
	    return strtr($s, $tbl);
	}
	
	static function urlify($s)
	{
		return preg_replace('/[^0-9a-z]+/is','-',strtolower(self::utf2ascii(trim($s))));//,' _','---');
	}

	/**
	 * outputs all files and directories
	 * recursively starting with the given
	 * $base path. This function is a combination
	 * of some of the other snips on the php.net site.
	 * All are good but lacked one thing or another
	 * that I needed like .htaccess
	 * files get excluded with the one that checks to
	 * see if the first character is a . and omits
	 * that.
	 *
	 * @example rscandir(dirname(__FILE__).'/'));
	 * @param string $base
	 * @param array $omit
	 * @param array $data
	 * @return array
	 */
	public static function rscandir($base='', &$data=array()) {
	 
	  $array = array_diff(scandir($base), array('.', '..')); # remove ' and .. from the array */

	  foreach($array as $value) : /* loop through the array at the level of the supplied $base */
	 
	    if (is_dir($base.$value)) : /* if this is a directory */
	      $data[] = $base.$value.'/'; /* add it to the $data array */
	      $data = self::rscandir($base.$value.'/', $data); /* then make a recursive call with the
	      current $value as the $base supplying the $data array to carry into the recursion */
	     
	    elseif (is_file($base.$value)) : /* else if the current $value is a file */
	      $data[] = $base.$value; /* just add the current $value to the $data array */
	     
	    endif;
	   
	  endforeach;
	 
	  return $data; // return the $data array
	 
	}

        public static function rglob($base='',$pattern='*',$flags=null, &$data=array()) {

	//  $array = ; # remove ' and .. from the array */
	  $array = array_merge(glob($base.'/'.$pattern,$flags),glob($base.'/*',GLOB_ONLYDIR)); # remove ' and .. from the array */
          //$array = array_diff($array, array('.', '..'));
	  foreach($array as $value) : /* loop through the array at the level of the supplied $base */

	    if (is_dir($value)) : /* if this is a directory */
	      $data[] = $value.'/'; /* add it to the $data array */
	      $data = self::rglob($value,$pattern,$flags, $data); /* then make a recursive call with the
	      current $value as the $base supplying the $data array to carry into the recursion */

	    elseif (is_file($value)) : /* else if the current $value is a file */
	      $data[] = $value; /* just add the current $value to the $data array */

	    endif;

	  endforeach;

	  return $data; // return the $data array

	}
        
        public static function dirnames($path,$preg=null,$flags=null)
        {
            $dirs = preg_replace('|.*/([^\/]*)$|','\1',glob($path,GLOB_ONLYDIR));
            if ($preg)
                return array_values(preg_grep($preg, $dirs,$flags));
            else 
                return $dirs;

        }


        public static function filenames($path,$preg=null,$flags=null)
        {
            $dirs = preg_replace('|.*/([^\/]*)(\..*){0,1}$|','\1',glob($path));
            if ($preg)
                return array_values(preg_grep($preg, $dirs,$flags));
            else
                return $dirs;

        }

        public static function generatePassword($length=8, $strength=0) {
	$vowels = 'aeuyio';
	$consonants = 'bdghjmnpqrstvz';
	if ($strength & 1) {
		$consonants .= 'BDGHJLMNPQRSTVWXZ';
	}
	if ($strength & 2) {
		$vowels .= "AEUYIO";
	}
	if ($strength & 4) {
		$consonants .= '23456789';
	}
	if ($strength & 8) {
		$consonants .= '@#$%';
	}

	$password = '';
	$alt = time() % 2;
	for ($i = 0; $i < $length; $i++) {
		if ($alt == 1) {
			$password .= $consonants[(rand() % strlen($consonants))];
			$alt = 0;
		} else {
			$password .= $vowels[(rand() % strlen($vowels))];
			$alt = 1;
		}
	}
	return $password;
}

public static function formatPermissions($perms) {
	if (($perms & 0xC000) == 0xC000) {
		// Socket
		$return = 's';
	} elseif (($perms & 0xA000) == 0xA000) {
		// Symbolic Link
		$return = 'l';
	} elseif (($perms & 0x8000) == 0x8000) {
		// Regular
		$return = '-';
	} elseif (($perms & 0x6000) == 0x6000) {
		// Block special
		$return = 'b';
	} elseif (($perms & 0x4000) == 0x4000) {
		// Directory
		$return = 'd';
	} elseif (($perms & 0x2000) == 0x2000) {
		// Character special
		$return = 'c';
	} elseif (($perms & 0x1000) == 0x1000) {
		// FIFO pipe
		$return = 'p';
	} else {
		// Unknown
		$return = 'u';
	}

	// Owner
	$return .= (($perms & 0x0100) ? 'r' : '-');
	$return .= (($perms & 0x0080) ? 'w' : '-');
	$return .= (($perms & 0x0040) ? (($perms & 0x0800) ? 's' : 'x' ) : (($perms & 0x0800) ? 'S' : '-'));

	// Group
	$return .= (($perms & 0x0020) ? 'r' : '-');
	$return .= (($perms & 0x0010) ? 'w' : '-');
	$return .= (($perms & 0x0008) ? (($perms & 0x0400) ? 's' : 'x' ) : (($perms & 0x0400) ? 'S' : '-'));

	// World
	$return .= (($perms & 0x0004) ? 'r' : '-');
	$return .= (($perms & 0x0002) ? 'w' : '-');
	$return .= (($perms & 0x0001) ? (($perms & 0x0200) ? 't' : 'x' ) : (($perms & 0x0200) ? 'T' : '-'));

	return $return;
}




        public static function NumericVariants($num,$text1,$text2='',$text3='',$format='%s %s')
        {
            $text2 = ($text2) ? $text2 : $text1;
            $text3 = ($text3) ? $text3 : $text1;

            $n = $num;
            while (floor($n)!=$n)
                $n = ($n - floor($n))*10;

            if ($n == 0 || $n>=5) {
                $text = $text3;
            }
            elseif ($n>1 && $n<5) {
                $text = $text2;
            }
            else {
                $text = $text1;
            }

            return sprintf($format,$num,$text);
        }
}




