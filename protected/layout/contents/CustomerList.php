<?php

class CustomerList extends DbList {

    protected $_respect_dates = true;

    private $_video;

    public function getData($offset=null, $limit=null) {
        if ($this->_data == null) {
            $criteria = new TActiveRecordCriteria;
            $criteria->setCondition("({$this->getDataCondition()}) AND videos_id = ".$this->getVideo()->uid);
            if ($this->getRespectDates())
                $criteria->Condition .= ' AND start <= UNIX_TIMESTAMP() AND (stop >= UNIX_TIMESTAMP() OR stop=0)';

            $criteria->Parameters = $this->getDataParameters();
            //$criteria->Parameters[] = $this->getVideo()->uid;
            if ($this->getMaxData() > 0)
                $criteria->Limit = $this->getMaxData();
            $this->_data = CustomerRecord::finder()->findAll($criteria);
        }

        return $this->_data;
    }

    public function getVideo() {

        if ($this->_video === null) {

            $vid = $this->Request['vid'];
            $vid = ($vid) ? $vid : 1;
            if (is_numeric($vid))
                $this->_video = VideoRecord::finder()->findByPk($vid);
            else
                $this->_video = VideoRecord::finder()->find('cool_url= ?', $vid);

            //die($vid);
        }
        return $this->_video;
    }

    public function getRespectDates() {
        return $this->_respect_dates;
    }

    public function setRespectDates($value) {
        $this->_respect_dates = TPropertyValue::ensureBoolean($value);
    }

}