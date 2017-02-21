<?php
class testDecimalStore extends UnitTestCase
{
    function testDecimal()
    {
        
        $c = new ClientRecord;
        $c->KNTSession_Hmotnost = 98.7;

        $hm = $c->KNTSession_Hmotnost;

        $this->assertNotNull($hm, "Hmotnost není nastavena");
        $this->assertEqual($hm, 98.7, "Hmotnost není rovna 98.7 ale ".$hm);
    }

    function testAsDef()
    {

        $c = ClientRecord::finder()->findByPk(5);
        $ch = $c->KNTSession_Chute;

        $d = DefinitionRecord::finder()->findByPk($ch);

        $this->assertNotNull($ch, "Není nastaveno");
        $this->assertEqual($c->KNTSession_ChuteAsDefName, $d->Name, "Wrong AsDefName");
        $this->assertEqual($c->KNTSession_ChuteAsDefValue, $d->Value, "Wrong AsDefValue");
    }

    function testSpalovaniCukru()
    {

        $c = ClientRecord::finder()->findByPk(5);

        $cukry = $c->getSpalovaniCukru();

        $this->dump('Energie '.$c->KNTSession_EnergieMnozstvi);
        $this->dump('ChutJidlo '.$c->KNTSession_ChutJidlo);
        $this->dump('Chute '.$c->KNTSession_ChuteAsDefValue);
        $this->assertNotNull($cukry[1], "Rychle neni nastavena");
        $this->assertNotNull($cukry[0], "Pomale neni nastavena");
        $this->assertEqual($cukry[0], 1.8, "Pomale neni 1.8 ale ".$cukry[0]);
        $this->assertEqual($cukry[1], 1.2, "Rychle neni 1.2 ale ".$cukry[1]);
    }

    function testSpalovaniTuku()
    {

        $c = ClientRecord::finder()->findByPk(5);

        $cukry = $c->getSpalovaniTuku();

        $this->dump('KNTSession_EnergieMnozstvi '.$c->KNTSession_EnergieMnozstvi);
        $this->dump('KNTSession_Zazivani '.$c->KNTSession_Zazivani);
        $this->dump('KNTSession_TepKlidovy '.$c->KNTSession_TepKlidovy);
        $this->assertNotNull($cukry[1], "Rychle neni nastavena");
        $this->assertNotNull($cukry[0], "Pomale neni nastavena");
        $this->assertEqual($cukry[0], 1.2, "Pomale neni 1.2 ale ".$cukry[0]);
        $this->assertEqual($cukry[1], 1.8, "Rychle neni 1.8 ale ".$cukry[1]);
    }

    
    function testAjurveda()
    {

        $c = ClientRecord::finder()->findByPk(5);

        $pitta = $c->getPitta();
        $vata = $c->getVata();
        $kapha = $c->getKapha();
/*
$this->dump('V '.             (1 - $c->KNTSession_CinnostiRychlost/10) );
$this->dump('V '.                  (1-$c->KNTSession_ZapominaniAsDefValue) );             //E297 -> A319
$this->dump('V '.                  (1 - $c->KNTSession_Nalada/10) );
$this->dump('V '.                  (1 - $c->KNTSession_VahuPribiram/10) );
//$this->dump('V '.                  (1 - $c->KNTSession_Uceni/10) );                   //E300 -> A318, pozor D144 je slider, ale je porovnáván s A/N
$this->dump('V '.                  (0) );                   //E300 -> A318, pozor D144 je slider, ale je porovnáván s A/N
$this->dump('V '.                  (1 - $c->KNTSession_Chuze/10) );
$this->dump('V '.                  (1 - $c->KNTSession_Rozhodovani/10));
$this->dump('V '.                  (1 - $c->KNTSession_Zacpa/10) );
$this->dump('V '.                  $c->KNTSession_StudeneNohyRuce );
$this->dump('V '.                  $c->KNTSession_Uzkostnost );
$this->dump('V '.                  $c->KNTSession_StudenePocasi );
$this->dump('V '.                  (1 - $c->KNTSession_CinnostiRychlost/10));
$this->dump('V '.                  (1-$c->KNTSession_Povaha/10));
$this->dump('V '.                  (1 - $c->KNTSession_Usinani/10));
$this->dump('V '.                   $c->KNTSession_KuzeSucha );
$this->dump('V '.                   $c->KNTSession_Roztekanost );
$this->dump('V '.                  (1 - $c->KNTSession_EnergieNavaly/10));
$this->dump('V '.                  $c->KNTSession_Vzrusivost );
$this->dump('V '.                  (1 - $c->KNTSession_NepravidelnyRezim/10));
$this->dump('V '.                          (1-$c->KNTSession_ZapominaniAsDefValue)*0.5);
*/




/*$this->dump('P '.                (1-$c->KNTSession_NarocneVykony/10) );
$this->dump('P '.                $c->KNTSession_Perfekcionismus );
$this->dump('P '.                ((1-$c->KNTSession_Povaha/10) * 0.5 + ($c->KNTSession_Uminenost) * 0.5) );
$this->dump('P '.                $c->KNTSession_HorkePocasi );
$this->dump('P '.                $c->KNTSession_HorkePocasi );
$this->dump('P '.                ($c->KNTSession_Nalada/10) );
$this->dump('P '.                ($c->KNTSession_NepravidelnyRezim/10));
$this->dump('P '.                ($c->KNTSession_VlasyPles) );
$this->dump('P '.                $c->KNTSession_HodneJi  );
$this->dump('P '.                $c->KNTSession_Uminenost );
$this->dump('P '.                ($c->KNTSession_Zacpa/10) );
$this->dump('P '.                (1-$c->KNTSession_Povaha/10));
$this->dump('P '.                $c->KNTSession_Perfekcionismus );
$this->dump('P '.                (1-$c->KNTSession_Povaha/10));
$this->dump('P '.                 $c->KNTSession_StudenaJidla );
$this->dump('P '.                (1-$c->KNTSession_Povaha/10));
$this->dump('P '.                $c->KNTSession_PalivaJidla);
$this->dump('P '.                $c->KNTSession_Uminenost );
$this->dump('P '.                ($c->KNTSession_NarocneVykony/10) );
$this->dump('P '.                $c->KNTSession_Kriticnost);
*/
/*$this->dump('K '.               ($c->KNTSession_CinnostiRychlost/10));
$this->dump('K '.                ($c->KNTSession_VahuPribiram/10) );
             $this->dump('K '.  ($c->KNTSession_Povaha/10));
$this->dump('K '.               (1 - $c->KNTSession_NepravidelnyRezim/10));
$this->dump('K '.               $c->KNTSession_Prudusky );
$this->dump('K '.               $c->KNTSession_PotrebaSpanku );
$this->dump('K '.               ($c->KNTSession_Usinani/10));
$this->dump('K '.               ($c->KNTSession_Povaha/10));
//$this->dump('K uceni '.         (($c->KNTSession_Uceni/10)*0.5 + ($c->KNTSession_ZapominaniAsDefValue)*0.5)  ); //($c->KNTSession_Uceni/10)*0.5 +
$this->dump('K uceni '.         (0.5 + ($c->KNTSession_ZapominaniAsDefValue)*0.5)  ); //($c->KNTSession_Uceni/10)*0.5 +
$this->dump('K '.                ($c->KNTSession_VahuPribiram/10) );
$this->dump('K '.                $c->KNTSession_StudenePocasi );
$this->dump('K '.                $c->KNTSession_VlasyHuste );
$this->dump('K '.                $c->KNTSession_KuzeMekka );
$this->dump('K '.                ($c->KNTSession_PodsaditostAsDefValue) );
$this->dump('K '.                (1 - $c->KNTSession_Laskavost/10));
$this->dump('K '.                ($c->KNTSession_PomaluTravim )     );
$this->dump('K '.                ($c->KNTSession_EnergieNavaly/10));
$this->dump('K '.                ($c->KNTSession_Chuze/10));
$this->dump('K '.                (1-$c->KNTSession_Zaspavani/10) );
$this->dump('K '.                 ($c->KNTSession_CinnostiRychlost/10));
$this->dump($kapha);
*/

        $this->dump("Kapha: $kapha");
        $this->dump("Vata: $vata");
        $this->dump("Pitta: $pitta");

        $this->assertEqual((string) $kapha, "11.3", "Kapha neni 11.3 ale ".$kapha);
        $this->assertEqual((string) $vata, "12.7", "Vata neni 12.7 ale ".$vata);
        $this->assertEqual($pitta, 10.5, "Pitta neni 10.5 ale ".$pitta);
    }

    public function testMetabolickyTypColor()
    {

        $tpl = new KNTresult;
        
$this->dump($tpl->getMetabolickyTypColor(25));
$this->dump($tpl->getMetabolickyTypColor(35));
        $this->assertEqual($tpl->getMetabolickyTypColor(25), KNTresult::$colors[0], "Neodpovídá barva");
        $this->assertEqual($tpl->getMetabolickyTypColor(35), KNTresult::$colors[1], "Neodpovídá barva");
        $this->assertEqual($tpl->getMetabolickyTypColor(50), KNTresult::$colors[2], "Neodpovídá barva");
        $this->assertEqual($tpl->getMetabolickyTypColor(65), KNTresult::$colors[3], "Neodpovídá barva");
        $this->assertEqual($tpl->getMetabolickyTypColor(85), KNTresult::$colors[4], "Neodpovídá barva");


    }

}
?>
