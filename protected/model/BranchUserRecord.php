<?php
/**
 * 
DROP VIEW `freshsystems_knt`.`tree_branch_users`;
CREATE VIEW  `freshsystems_knt`.`tree_branch_users` AS
(
select
`u`.`uid` AS `uid`,
`u`.`name` AS `name`,
concat('user-',`udd`.`uid`,'-',`u`.`uid`) AS `child_id`,
concat('branch-',`udd`.`uid`,'-',`udd`.`definitions_id`) AS `parent_id`,
'user' AS `t`
from
(`be_users` `u` join `definitions_has_definitions` `udd`)
where (`udd`.`definitions_id` = `u`.`branch_id`)
) union (
        select
        `d`.`uid` AS `uid`,
        `d`.`value` AS `name`,
        concat('branch-',`d`.`uid`) AS `child_id`,
        0 AS `parent_id`,
        'branch' AS `t`
        from (`definitions` `d`)
        where (`d`.`class` = 'pobocka')
);
 */
Prado::using('Application.model.BranchUserAR');
class BranchUserRecord extends BranchUserAR
{

        public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}

	public function getIsFolder()
	{
		return ($this->t != 'user');
	}

	public function setIsFolder($value) {}

        public function getSortName()
        {
            if ($this->name == 'Recycle Bin')
                return 'zzzzzzzzzzzzzz';
            else
                return $this->name;
        }

        public function getMenuType()
        {
            if ($this->name == 'Recycle Bin')
                return 'recycleBin';
            elseif ($this->getIsFolder())
                return 'folder';
            else
                return 'any';
        }

        public function getNodeType()
        {
            //return $this->t;
            if ($this->getIsFolder())
                return 'folder';
            else
                return 'leaf';
        }

        public function getSortLeaf()
        {
            return ($this->name == 'Recycle Bin');
        }

	public function setNameLang($value,$culture)
	{
	}

	public function getNameLang($culture)
	{
		$g =  Prado::getApplication()->getGlobalization();
		$oc = $g->getCulture();
		$g->setCulture(strtolower($culture));
		$val =  Prado::localize($this->name);
		$g->setCulture(strtolower($oc));
		return $val;

	}



    protected function getSecurityCriteria()
    {
        $cri = new TActiveRecordCriteria;
        $cri->condition =  "(parent_id = 0 AND uid = :branchid) OR (parent_id = :branchid) OR (:maxlevel >= 300)";
        $cri->Parameters[':branchid'] = Prado::getApplication()->getUser()->getUserRecord()->branch_id;
        $cri->Parameters[':maxlevel'] = Prado::getApplication()->getUser()->MaxLevel;

        return $cri;
    }

}