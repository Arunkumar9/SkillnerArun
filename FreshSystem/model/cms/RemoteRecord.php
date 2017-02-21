<?php
/* 
 * files and directories abstracted in ActiveRecord
 */
Prado::using('FreshSystem.3rdparty.curl');

class RemoteRecord  extends TAttributeCollection {

    //const API='HDCloud';

    private static $_instance;
    private $curl;
    protected $user;
    protected $password;
    protected $url;
    protected $params;
    protected $dataPath;
    protected $dataPathSet;

/*
    public function __construct($data=array())
    {
        $configClass = 'Remote'.$this->getConstant('API');
	$this->url = FU::Ini($configClass.'.url');
        $this->user = FU::Ini($configClass.'.user');
        $this->password = FU::Ini($configClass.'.password');
        $this->params = FU::Ini($configClass.'.params');
        $this->dataPath = FU::Ini($configClass.'.dataPath');
        $this->dataPathSet = $this->dataPath.'s';
    }
*/

    public function findAll($cond='')
    {
        if ($cond instanceof TActiveRecordCriteria) {
            $pattern = preg_replace('|^\( +\(([^)]*)\) +\)$|','\1',trim($cond->getCondition()));
            $page = ($cond->Limit) ? floor($cond->Offset / $cond->Limit)+1 : 1;
        } else {
            $pattern = $cond;
            $page = 1;
        }

        return $this->getRecords($pattern,$page);
    }

    public function deleteByPk($id)
    {
        $url =  $this->url.'/'.$id;
        $res = $this->request($url,array(),'DELETE');
        return (!$res) ? '1' : '0';
    }

    public function deleteAllByPks($ids)
    {
        $e = false;
        foreach ($ids as $id) {
            $res = $this->deleteByPk($id);
            if ($e) { 
                sleep(0.5);
            }
            $e = !$e;
            $i =+ (!$res) ? '1' : '0';
        }
        return $i;
    }

    public function findByPk($id)
    {
        return $this->getRecord($id);
    }

    public function count($cond='')
    {
        $files = $this->findAll($cond);
        return is_array($files) ? count($files) : 0;
    }


    public function request($url,$params=array(),$customreq='GET') {

        $c = new curl($url) ;
        $c->setopt(CURLOPT_FOLLOWLOCATION, true) ;
        if ($customreq == 'POST')
            $c->setopt(CURLOPT_POST, true) ;

        $c->setopt(CURLOPT_CUSTOMREQUEST, $customreq) ;

        $c->setopt(CURLOPT_USERPWD, "{$this->user}:{$this->password}");
        if (count($params))
            $c->setopt(CURLOPT_POSTFIELDS, $params );

        $o = $c->exec();
        $this->curl = $c;

        if ($c->hasError())
            throw new THttpException ($c->m_status['errno'], $c->m_status['error']);
//echo $this->url.' req '.$o;
        return json_decode($o,true);
    }

    public function getRecords($pattern,$page=1)
    {
            
        $url = ($pattern) ? $this->url.'/'.$pattern : $this->url;
        $records = $this->request($url,array('page'=>$page));
        $class = get_class($this);

        $records = ($this->dataPath && isset($records[$this->dataPath])) ? $records[$this->dataPath] : $records;
        foreach ($records as $record) {

            if ($this->dataPath && isset ($record[$this->dataPath]))
                $data[] = new  $class($record[$this->dataPath]);
            else
                $data[] = new  $class($record);

        }
        
        return $data;
    }

    public function getRecord($id)
    {

        $url =  $this->url.'/'.$id;
        $record = $this->request($url);
        $class = get_class($this);

        if ($this->dataPath && isset ($record[$this->dataPath]))
            $data = new  $class($record[$this->dataPath]);
        else
            $data = new  $class($record);

        return $data;
    }

    public static function finder($className=__CLASS__)
    {
		static $instance;

		if (!$instance)
			$instance = new $className;
        return $instance;
    }


    
    
    protected function getConstant($name)
    {
        return constant(get_class($this).'::'.$name);
    }
}

class HDCloudRecord extends RemoteRecord {

    protected $user='FCNEJJESVLMITZQ';
    protected $password='tsixlzzunxxj0mwwyd5gd2wqgkssz99z5jjywph9z';
}