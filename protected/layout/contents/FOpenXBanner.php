<?php


	class FOpenXBanner extends FStyledTemplateControl {

                private $_RandNum;
                private $_Zone;
                private $_AdServer='openx.freshsystems.cz';


                public function getAdServer() 	{
                    return $this->_AdServer;
                }

                public function setAdServer($value) 	{
                    $this->_AdServer = $value;
                }

                public function getZone() 	{
                    return $this->_Zone;
                }

                public function setZone($value) 	{
                    $this->_Zone = $value;
                }


                public function getRandNum()
                {
                        if ($this->_RandNum === null)
                                 $this->_RandNum = mt_rand(0,99999999999);
                        return $this->_RandNum;
                }
				

	}

?>