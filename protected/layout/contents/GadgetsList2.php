<?php
  
class GadgetsList2 extends GadgetsList1
{
   
public function generateStyleSheet()
        {

            //$styles = "gadget { background-position: right; }\n gadget:hover { background-position: left; }\n";
            foreach($this->getGadgets() as $g)
            {
                 $styles .= ".g2-{$g->uid} { background-image: url('{$g->SecondImage}') }\n";
            }

            $sheet = new TStyleSheet();
            $sheet->getControls()->add($styles);

            $this->getPage()->getHead()->getControls()->add($sheet);
        }


}
