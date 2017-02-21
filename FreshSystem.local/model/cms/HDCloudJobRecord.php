<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Prado::using('FreshSystem.model.cms.RemoteRecord');
class HDCloudJobRecord extends HDCloudRecord {

    protected $url='http://hdcloud.com/api/v1/jobs.json';
    protected $params;
    protected $dataPath='job';
    protected $dataPathSet='jobs';

    public static function finder($className=__CLASS__)
    {
		static $instance;

		if (!$instance)
			$instance = new $className;
        return $instance;
    }

}
