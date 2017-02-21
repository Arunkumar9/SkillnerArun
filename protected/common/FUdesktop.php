<?php
    class FUdesktop extends FUFreshSystem
    {
        
        public static function getFN()
        {
            $fn = file_get_contents('fncycle.txt');
            if ($fn == "1" || $fn == "2")
            {
                return (int) $fn;
            }
            else
            {
                file_put_contents('fncycle.txt',1);
                return 1;
            }
        }
        
        public static function wildcard($val)
        {
            return str_replace(array('*','|'),array('%',','),$val);
        }
        
        
        public static function dateNumberExpression($d)
        {
            $d = trim($d);
            if (preg_match('/^([\<\>\=]{0,2}) *([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4})$/',$d,$m))
            {
                $op = ($m[1])?$m[1]:'=';
                $date = strtotime($m[2]);
                if ($date)
                    return $op.' '.$date;
            } 
            elseif (preg_match('/^([\<\>\=]{1,2}) *([\-0-9\.]+)$/',$d,$m))
            {
                return $m[1].' '.$m[2];
            }
            return false;
        }
        
        public static function evalExpression($expr,$context=null)
        {
            if ($expr[0]=='@' || $expr[0]=='^')
            {
                if ($context)
                    $expr = str_ireplace('$this->','$context->',$expr);
                $expr = trim($expr,';');
                eval('$val = '.substr($expr,1).';');
                return $val;
            }
            return $expr;
        }
        
        public static function typeCast($value,$type)
        {
            switch ($type)
            {
                case 'string':    return (string) $value;
                case 'float':     return (float) $value;
                case 'integer':   return (integer) $value;
                case 'boolean':   return (boolean) $value;
                default:          return $value;                            
            }
            return $value;            
        }


        public static function parseExpressionTags($string)
        {
            return preg_replace_callback('/<%.*?%>/msS',array('FUdesktop','evaluateExpressionTags'),$string);
        }
        
        public static function evaluateExpressionTags($matches)
        {
            $value = trim(substr($matches[0],3,-2));
            Prado::trace('Eval expression in component '.$matches[0],'Desktop');
            if (strpos($matches[0],'<%=')===0) {
                
                $value = str_ireplace('$this->','Prado::getApplication()->getService()->',$value);
                eval('$v = '.$value.';');
//echo $v."\n";
                return $v;
                
            } elseif (strpos($matches[0],'<%[')===0) {
                
//                return "'".Prado::localize(trim(substr($matches[0],3,-3)))."'";
                return Prado::localize(trim(substr($matches[0],3,-3)));
                
            } elseif (strpos($matches[0],'<%$')===0) {
                
                return Prado::getApplication()->Parameters[$value];
            } else {
                return $matches[0];
            }
            
        }

      /**
         * Reads hash array from yaml file defined by $key
         * @return Array
         * @param $key String    Key to define component
         * @param $cache Boolean[optional]    Use cache (default=true)
         */
        public static function getYamlData($key,$path,$cache=true)
        {
            $application = Prado::getApplication();
    		if($cache && $application->Cache) {
    		    // retrieves data item from cache
    		    $data=$application->Cache->get($key);
    		}		
    		
    		if (!$data)
    		{
    			Prado::using('Root.lib.spyc.spyc');
    
    			$yaml = @file_get_contents($path.'/'.$key.'.yml');
    //            die($this->Path.'/'.$key.'.yml')
    			if (!$yaml)
                    throw new FJsonException('Component '.$key. ' not exists!');
        
                $yaml = self::parseExpressionTags($yaml);
                die();
    			$data = Spyc::YAMLLoad($yaml);
    			if($cache && $application->Cache) {
    			    // saves data item in cache
    			    $application->Cache->set($key,$data);
    			}		
    			
    		}
            
            return $data;
    
        }
        
        public static function Culture()
        {
            return Prado::getApplication()->getGlobalization()->getCulture();
        }

        public static function LangVariant($field)
        {
            return $field.'Lang'.ucfirst(FU::Culture());
        }        
       
        public static function getContextCriteria($context,$filter)
        {
            $criteria = new TActiveRecordCriteria;
                
            $conditions = array(); $parameters = array();
    		if ($context['filterData'])
    		{
                foreach($filter as $k => $v)
                     if ($v) 
                     {
    				    $w = str_replace('*','%',$v);
                     	$condition[] = "($k like '$w')";
                     }
                
                $op = ($context['filterData']==' OR ')?'OR':' AND ';
                if (count($condition)>0)
                        $conditions[] = '('.implode($op,$condition).')';
    		}
    		
            if ($context['condition'])
            {
                foreach($filter as $f)
                    $conditions[] = '('.str_replace('%filter%',$f,$context['condition']).')';
               
                if (!$filter && !stristr($context['condition'],'%filter%'))         
                   $conditions[] = $context['condition'];
            }
            if ($context['filterRecordClass'] && $filter)
            {
                $ff = call_user_func(array($context['filterRecordClass'], 'finder'))->findAllByPks($filter);
                $i=1;
                $conds = array();
                foreach($ff as $r)
                {
                    list($cond,$params) = $r->getFilterCondition($i);
                    if ($cond)
                    {
                        $conds[] = $cond;
                        $parameters = array_merge($parameters,$params);
                    }
                    $i++;
                }
                $conditions[] = ' ( '.implode(' OR ',$conds).' ) ';
            }
    
            if (count($conditions)>0)
            {
                $conditions = ' ( '.implode(' AND ',$conditions).' ) ';
                $criteria->Condition = $conditions;
            }    
            if (count($parameters)>0)
            {
                $criteria->Parameters = $parameters;
            }
            
            if ($context['sortInfo'] && $context['sortInfo']['field'])
            {
                $criteria->OrdersBy[$context['sortInfo']['field']] = $context['sortInfo']['dir'];
            } 
            elseif (is_array($context['sortInfo'])) {
                foreach($context['sortInfo'] as $field=>$dir) {
                    if ($field && $field != 'substitute')
                        $criteria->OrdersBy[$field]=$dir;
                }
                
            }
         //   die($conditions);
            return $criteria;
        }        
        
         
    }
