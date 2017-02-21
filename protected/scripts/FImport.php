<?php
    class FImport 
    {
        
        
        public static function test() {
        	echo 'test'."\n";
        }
		public static function qa()
        {

			$application = Prado::getApplication();
			
			$qa = new QARecord;
            $handle = fopen('resources/qa.txt','r');
			while (($data = fgets($handle)) !== FALSE)
			{
				if (strpos($data,'dotaz')===0)
					$qa->question = trim(substr($data,6));
				elseif (strpos($data,'odpov')===0)
					$qa->answer = trim(substr($data,9));
				else
				{
					$qa->input_date = time();
					$qa->publish_date = time();
					$qa->lang = 'cs';
					$qa->save();
					echo $qa->uid.' ';
					$qa = new QARecord;
				}
			}
            
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
    }
    
?>
