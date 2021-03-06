<?php
/**
 * Auto generated by prado-cli.php on 2008-10-13 12:51:06.
 */
class FLogRecord extends FLogAR
{

	public static $RELATIONS=array
    (
        'user' => array(self::BELONGS_TO, 'UserRecord', 'be_user_id'),
    );

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}


        static protected  function serializeValues(FBaseActiveRecord $rec){

            $nps = array_diff($rec->getProperties(),$rec->getIgnoreChangeFor());
            foreach ($nps as $prop) {
                $values[$prop] = $rec->$prop;
            }

            return json_encode($values);
        }

        static protected  function compareRecords(FBaseActiveRecord $new, FBaseActiveRecord $old){

            //$ops = $old->getProperties();
            $nps = array_diff($new->getProperties(),$new->getIgnoreChangeFor());
            $diff = array();

            foreach ($nps as $prop) {

                if ($new->$prop !== $old->$prop) {

                    $ov = $old->renderValueFor($prop);
                    $nv = $new->renderValueFor($prop);
                    $diff[] = "$prop: [ {$ov}, {$nv} ]";
                }
            }

            return str_replace('"',"",implode("\n",$diff));
        }

        static public function log(FBaseActiveRecord $record) {


            $rs = self::serializeValues($record);
            $finder = self::finder();
            $rc = get_class($record);
            $key = $record->getUsedKey();
            $cri = new TActiveRecordCriteria('record_id = ? AND domain = ?',array($record->uid,  $rc));
            $cri->OrdersBy['uid'] = 'DESC';
            $cri->Limit = 1;
            $last = $finder->findAll($cri);
            $last = (count($last)>0) ? $last[0] : false;

            $isDiff = true;
            if ($last && $last->value) {
                $old = unserialize($last->value);
                if ($isDiff = (self::serializeValues($old) != $rs))
                   $diff = self::compareRecords($record, $old);
            } else {
                $diff = 'new record';
            }

            if ($isDiff) {
                $log = new FLogRecord;
                $userid = Prado::getApplication()->getUser()->uid;
                $log->be_user_id = ($userid) ? $userid : 1;
                $log->domain = get_class($record);
                $log->record_id = $record->uid;
                $log->value = serialize($record);
                $log->difference = $diff;
                $log->created = date('Y-m-d H:i:s');
                $log->save();
            }

        }

        public function getCreatedByUser()
        {
            if ($user = $this->user)
                    return $user->Name;

            return '';
        }

        public function getRecordToCopy() {
            return '"'.$this->Created."\"\t\"".$this->CreatedByUser."\"\t\"".$this->difference.'"';
        }

}