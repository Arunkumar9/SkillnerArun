<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class KNTresult extends KNTBasicAnalysis {

    public static $colors = array('ff3344', '11ff11', '394C77', '00CCFF', 'FFAE00'); //,'4433aa');

    public function onPreRender($param) {
        parent::onPreRender($param);

        $this->SpalovaniCukru->chartFactory()->addDataSet($this->Client->SpalovaniCukru);
        $this->SpalovaniTuku->chartFactory()->addDataSet($this->Client->SpalovaniTuku);
        $this->Ajurveda->chartFactory()->addDataSet($this->Client->AjurvedaValues);
        $this->Abravanel->chartFactory()->addDataSet($this->Client->AbravanelValues);
        $this->ANS->chartFactory()->addDataSet($this->Client->ANSValues);
        $this->Dummelstein->chartFactory()->addDataSet($this->Client->DummelsteinValues);
    }

    public function onLoad($param) {

        parent::onLoad($param);
        $this->MetabolickyTyp->Chart->DataSet = $this->Client->MetabolickyTypValues;
        $c = self::$colors;
        $live = $this->getMetabolickyTypColor();
        $c[0] = $c[0] . ',' . $live;
        $this->MetabolickyTyp->Chart->Colors = implode("\n", $c);
    }

    public function getMetabolickyTypColor($mt=null) {


        $colors = self::$colors; //array('ff3344','11ff11','394C77','00CCFF','FFAE00');
        $values = $this->Client->MetabolickyTypValues;
        $mt = ($mt === null) ? $this->getClient()->getMetabolickyTypCiselne() : $mt;
        $sum = 0;
        foreach ($values as $i => $v) {

            $sum += $v[0][0];
            if ($mt < $sum)
                return $colors[$i];
        }

        return $colors[4];
    }


    public function colorize($vaha) {

        if (!is_numeric($vaha))
            $vaha = $this->getClient()->$vaha;

        return  'coloredCell'.round($vaha / 20);
    }

}
