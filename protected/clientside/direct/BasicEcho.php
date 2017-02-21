<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BasicEcho
 *
 * @author rosa
 */
class BasicEcho extends TComponent {
   
    /**
     * @remotable
     *
     */

    public function EchoBack($text) {
        throw new TException('test except');
        return $text;
    }
}

