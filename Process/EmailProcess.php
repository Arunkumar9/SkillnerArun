<?php

class EmailProcess extends PradoProcess {

	public function _construct( $id, $script ){

		parent::__construct();
	}

	/**
	 *	Overriding the abstract function. Instantiating CollaborationToolMgr and calling captureEmailRecords function to
	 *	send emails.
	 *
	 * @see PradoProcess::doIt()
	 */

	public function doIt() {

		$coll1 = new CollaborationToolMgr();
		$coll1->captureEmailRecords();
	}

	public function writeLog( $query ) {

		PradoScheduler::pjs_mysql_query($query);
	}


}