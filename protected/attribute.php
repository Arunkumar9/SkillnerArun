<?
/**
 * Attribute Reader - A class for reading metadata from PHP classes
 * 
 * Requires the pecl syck package:  http://pecl.php.net/package/syck
 * 
 * Jon Gilkison <jg@massifycorp.com>
 * Copyright (C) 2008 Jon Gilkison and Massify LLC 
 * www.massify.com (http://www.massify.com/)
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 * http://www.gnu.org/copyleft/lesser.html
 * 
 *
 */
class AttributeReader
{
	/**
	 * List of attributes
	 *
	 * @var array
	 */
	public $attributes=null;
	
	/**
	 * Constructor
	 *
	 * @param array $attributes
	 */
	protected function __construct($attributes)
	{
		$this->attributes=$attributes;
		
		if (!$attributes)
			return;
		
		foreach($attributes as $key => $item)
			if (is_array($item))
				$this->attributes[$key]=new AttributeReader($item);
	}
	
	/**
	 * Magic getter so that attributes appear as properties of the reader
	 *
	 * @param string $prop_name Name of the property
	 * @return array The metadata for the given property
	 */
   	public function __get($prop_name)
   	{
       if (isset($this->attributes[$prop_name]))
           return $this->attributes[$prop_name];
   	}

   	/**
   	 * Parses YAML from the doc comments for a class or method, returning the yaml as a string
   	 *
   	 * @param string $doc_comment The doc comment parsed using PHP's reflection
   	 * @return string The parsed out YAML.
   	 */
	private static function ParseDocComments($doc_comment)
	{
		$comments=explode("\n",$doc_comment);
		
		$yaml='';
		$within=false;
		
		foreach($comments as $comment)
		{
			$line=substr(trim($comment),2);
			if (strpos($line,'[[')===0)
				$within=true;
			else if ($within)
			{
				if (strpos($line,']]')===0)
					break;
				else
					$yaml.=$line."\n";
			}
		}
		
		return $yaml;
	}
	
	/**
	 * Fetches the metadata for a method of a class
	 *
	 * @param mixed $class An instance of the class or it's name as a string
	 * @param string $method The name of the method 
	 * @return AttributeReader An attribute reader instance
	 */
	
	public static function MethodAttributes($class,$method)
	{
		$method=new ReflectionMethod($class,$method);
		$yaml=AttributeReader::ParseDocComments($method->getDocComment());
		
		return new AttributeReader(syck_load($yaml));
	}
	
	/**
	 * Fetches the metadata for a class
	 *
	 * @param mixed $class An instance of a class or it's name as a string
	 * @return AttributeReader An attribute reader instance
	 */
	public static function ClassAttributes($class)
	{
		$class=new ReflectionClass($class);
		$yaml=AttributeReader::ParseDocComments($class->getDocComment());
		
		return new AttributeReader(syck_load($yaml));
	}
	
	/**
	 * Fetches the metadata for a property of a class
	 *
	 * @param mixed $class An instance of the class or it's name as a string
	 * @param string $prop The name of the property 
	 * @return AttributeReader An attribute reader instance
	 */
	
	public static function PropertyAttributes($class,$prop)
	{
		$prop=new ReflectionProperty($class,$prop);
		$yaml=AttributeReader::ParseDocComments($prop->getDocComment());
		
		return new AttributeReader(syck_load($yaml));
	}
}