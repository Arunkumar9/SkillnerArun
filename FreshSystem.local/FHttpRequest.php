<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
class FHttpRequest extends THttpRequest
{
    private $_pathinfo;


    /**
     * @return string part of the request URL after script name and before question mark.
     */
    public function getPathInfo()
    {
            return $this->_pathinfo;
    }

    public function setPathInfo($value)
    {
            $this->_pathinfo = $value;
    }



}

