<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class KNTmeals extends KNTBasicAnalysis {

   

    public function onLoad($param) {
        parent::onLoad($param);
        $this->setupRepeater();
    }


    protected function setupRepeater() {

        $this->Repeater->DataSource = $this->prepareData();
        $this->Repeater->dataBind();

    }

    public function itemDataBound($sender,$param) {

        $item = $param->getItem();

        $def = $item->getData();
        list($nadpis,$fnVaha,$vaha) = $def->ValueAsList;

        $fnText = substr($fnVaha,-4);
        $defTyp = DefinitionRecord::finder()->findByClassAndName($def->Name,$this->Client->$fnText);

        $positive = array(); $negative = array();
        $lines = explode("\n", trim($defTyp->Value));
        foreach ($lines as $line) {
            list($t,$v) = explode("|", trim($line));
            $vh = abs($v)*$vaha*$this->Client->$fnVaha;
            if ($v>0)
                $positive[] = array($t,$vh,  $this->ruleVaha($vh));
            else
                $negative[] = array($t,$vh,  $this->ruleVaha($vh));
        }

        usort($positive, array($this,'cmpV'));
        usort($negative, array($this,'cmpV'));

        $lead = (count($positive)>count($negative)) ? $positive : $negative;

        foreach($lead as $v) {

            $final[] = 1;

        }

    }

    protected function prepareData() {

        $data = DefinitionRecord::finder()->findAllByClass('jidelnicky');

        $final = array();
        foreach ($data as $def )
        {

                list($nadpis,$fnVaha,$vaha,$fnText) = $def->ValueAsList;

                $fnText = ($fnText) ? $fnText : substr($fnVaha,0,-4);
                $tText = $this->Client->$fnText;
                $tVaha = $this->Client->$fnVaha;

               //echo "$nadpis,$def->Name,$tText<br/>";
                list($ord,$name) = $def->NameAsList;
                $defTyp = DefinitionRecord::finder()->findByClassAndName($name,$tText);
                $positive = array(); $negative = array();
                $lines = explode("\n", trim($defTyp->Value));
                foreach ($lines as $line) {
                    list($t,$v) = explode("|", trim($line));
                    $vh = abs($v)*$vaha*$this->Client->$fnVaha;
                    if ($v>0)
                        $positive[] = array($t,$vh,  $this->ruleVaha($vh));
                    else
                        $negative[] = array($t,$vh,  $this->ruleVaha($vh));
                }
                usort($positive, array($this,'cmpV'));
                usort($negative, array($this,'cmpV'));
                
                $lead = (count($positive)>count($negative)) ? $positive : $negative;
                $lead = (count($lead)<2) ? array(1,2) : $lead;

                $i=0;
                //var_dump($positive);
                foreach($lead as $v) {

                    $row = new stdClass();

                    $row->nadpis = '';
                    $row->vahaB = '';
                    $row->colorB = 'coloredCell';

                    if ($i==0) {
                        $row->rowClass = 'firstRow';
                        $row->nadpis = "<strong>$nadpis</strong>";
                        $row->vahaB = $tVaha;
                        $row->colorB =  'coloredCell'.round($tVaha / 20);
                    }
                    elseif ($i==1) {
                        $row->nadpis = $tText;
                    }
                    $row->vahaD = (isset($positive[$i][1]))?$positive[$i][1] : '';
                    $row->vahaE = (isset($positive[$i][2]))?$positive[$i][2] : '';
                    $row->colorE =  'coloredCell'.$row->vahaE;
                    $row->vhodne = (isset($positive[$i][0]))?$positive[$i][0] : '';
                    $row->vahaH = (isset($negative[$i][2]))?$negative[$i][2] : '';
                    $row->colorH =  'coloredCell'.$row->vahaH;
                    $row->nevhodne = (isset($negative[$i][0]))?$negative[$i][0] : '';       

                    $i++;
                    $final[] = clone $row;
                    //var_dump($row);
                }
                
        }
        //die();
        return $final;
    }

    protected function ruleVaha($vh) {

        if ($vh>200)
                return 5;
        elseif($vh>100)
                return 4;
        elseif($vh>80)
                return 3;
        elseif($vh>40)
                return 3;
        elseif($vh>20)
                return 2;
        elseif($vh>0)
                return 1;
        else
                return 0;
    }

    protected function cmpV($a,$b) {

        if ($a[2]==$b[2])
            return 0;

        return ($a[2]>$b[2]) ? -1 : 1;

    }

   
}