<?php

class imprintRecord extends ImprintAR
{
        private $_imprint;

        public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}


        public function toArray()
        {
            if ($this->_imprint === null)
            {
                $q = unserialize($this->imprint);

                $this->_imprint = ($q) ? $q : array();
            }

            return $this->_imprint;
        }


}