<?php

class SessionRecord extends SessionAR
{
        private $_questions;

        public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
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


        public function getQuestions()
        {
            if ($this->_questions === null)
            {
                $q = unserialize($this->questions);

                $this->_questions = ($q) ? $q : new TMap();
            }

            return $this->_questions;
        }

        public function save()
        {
            $this->questions = serialize($this->_questions);
            parent::save();
        }

        /**
	 * Returns a property value or an event handler list by property or event name.
	 * This method overrides the parent implementation by returning
	 * a key value if the key exists in the collection, null otherwise.
	 * @param string the property name or the event name
	 * @return mixed the property value or the event handler list
	 */
	public function __get($name)
	{
		return $this->getQuestions()->contains($name)?$this->getQuestions()->itemAt($name):null;
	}

	/**
	 * Sets value of a property.
	 * This method overrides the parent implementation by adding a new key value
	 * to the collection.
	 * @param string the property name or event name
	 * @param mixed the property value or event handler
	 */
	public function __set($name,$value)
	{
		$this->getQuestions()->add($name,$value);
	}

}