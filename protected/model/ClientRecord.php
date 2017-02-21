<?php

/**
 * 
 * @project Fresh!
 * 
 * @package web.database

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: ClientRecord.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */
 



class ClientRecord extends ClientAR {

    const SIGN_VOID=    '---';
    const SIGN_LEFT=    '×--';
    const SIGN_MIDDLE=  '-×-';
    const SIGN_RIGHT=   '--×';

    static $noSecurity=false;
    private $_knt_session;
    private $_knt_imprint;
    private $_pohlavi;
    private $_hranice_tuk;

    public static function finder($className=__CLASS__) {
        return parent::finder($className);
    }

    protected function getSecurityCriteria() {
        if (self::$noSecurity)
            return FBaseActiveRecord::getSecurityCriteria();

        $user = Prado::getApplication()->getUser();
        $criteria = new TActiveRecordCriteria();
        $criteria->Condition = '( branch_id in(:Branch,0) OR branch_id is NULL OR :UserLevel >= 300 )';
        $criteria->Parameters = array(
            ':UserLevel' => $user->MaxLevel,
            ':Branch' => $user->getUserRecord()->branch_id
        );
        return $criteria;
    }

	public function setFirstnameC($value) {
		$this->Firstname = $value;

		list($s,$f) = explode(' ',$this->Name,2);
		$this->Name = $s.' '.$this->Firstname;
		
	}
	
	public function setSurnameC($value) {
		$this->Surname = $value;

		list($s,$f) = explode(' ',$this->Name,2);
		$this->Name = $this->Surname.' '.$f;
		
	}
	
	
    public function getFirstnameC() {
    	if ($this->Firstname)
    		return $this->Firstname;
    		
    	list($s,$f) = explode(' ',$this->Name,2);
    	return $f;
    }

    public function getSurnameC() {
    	if ($this->Surname)
    		return $this->Surname;
    		
    	list($s,$f) = explode(' ',$this->Name,2);
    	return $s;
    }

    
    public function getSecurityView()
    {
         $user = Prado::getApplication()->getUser();
         if ($user->MaxLevel>=300) return array();

         return parent::getSecurityView();
    }

    public function getKNTSession() {

        if (!$this->_knt_session) {


            $criteria = new TActiveRecordCriteria();
            $criteria->Condition = '( client_id = :uid )';
            $criteria->Parameters = array(
                ':uid' => $this->uid,
            );
            $criteria->OrdersBy['date_created'] = 'DESC';

            $ses = SessionRecord::finder()->find($criteria);

            if (!$ses) {
                $ses = $this->createNewKNTSession();
            }
            $this->_knt_session = $ses;
        }


        return $this->_knt_session;
    }

    public function createNewKNTSession() {

        $ses = new SessionRecord();
        $ses->date_created = time();
        $ses->be_user_id = Prado::getApplication()->getUser()->uid;
        $ses->client_id = $this->Uid;
        //$ses->save();
        $this->_knt_session = $ses;
        return $ses;
    }


    public function getBranch() {
        if ($br = DefinitionRecord::finder()->findByPk($this->branch_id))
                return $br;
        else
                return new DefinitionRecord;
    }

    public function getConsultant() {
        if ($br = UserRecord::finder()->findByPk($this->be_user_id))
                return $br;
        else
                return new UserRecord;
    }

    public function getImprint() {

        if (!$this->_knt_imprint) {


            $criteria = new TActiveRecordCriteria();
            $criteria->Condition = '( client_id = :uid )';
            $criteria->Parameters = array(
                ':uid' => $this->uid,
            );
            $criteria->OrdersBy['date_created'] = 'DESC';

            $ses = ImprintRecord::finder()->find($criteria);

            $this->_knt_imprint = $ses;
        }


        return $this->_knt_imprint;
    }

    public function createNewImprint() {

        $ses = new ImprintRecord();
        $ses->date_created = time();
        $ses->be_user_id = Prado::getApplication()->getUser()->uid;
        $ses->client_id = $this->uid;
        $ses->branch_id = $this->branch_id;
        $ses->name = $this->name;
        $ses->client_date = $this->Created;
        $ses->imprint = serialize($this->toArray());
        $ses->save();
        $this->_knt_imprint = $ses;
        return $ses;
    }

    public function getImprintDiff() {
        return array_diff_assoc($this->toArray(),$this->getImprint()->toArray());
    }

    public function getImprintCount() {
            $criteria = new TActiveRecordCriteria();
            $criteria->Condition = '( client_id = :uid )';
            $criteria->Parameters = array(
                ':uid' => $this->uid,
            );
            return TPropertyValue::ensureInteger(ImprintRecord::finder()->count($criteria));

    }

    public function save() {
        $this->Updated = time();
        parent::save();
        if ($this->_knt_session) {
            $this->_knt_session->client_id = $this->Uid;
            $this->_knt_session->be_user_id = $this->be_user_id;
            $this->_knt_session->save();
        }
    }


    public function __set($name, $value) {
        list($a, $n) = explode('_', $name, 2);
        if (strpos($name, 'KNTSession_') === false)
            parent::__set($name, $value);
        else
            $this->$a->$n = $value;
    }

    public function getProperties() {
        $properties = parent::getProperties();

        $p = $this->getKNTSession()->getQuestions()->getKeys();
        foreach ($p as $v) {

            $properties[] = 'KNTSession_' . $v;
        }

        return $properties;
    }

    public function fromArray($ary, $prop=null) {
        $diffData = array();
        $properties = (is_array($prop)) ? $prop : $this->getProperties();

        foreach ($properties as $kp => $p) {
            if (is_array($p))
                $properties[$k] = $p['name'];
        }

        foreach ($ary as $k => $v) {

            if (in_array($k, $properties) || (strpos($k, 'KNTSession_') !== false)) {
                if (!$this->secureUpdate($k, $v) || $this->$k != $v)
                    $diffData[$k] = $this->$k;
                elseif (strpos($k, 'KNTSession_') !== false && (is_numeric($this->$k)  || preg_match('/[0-9]+,[0-9]+/',$this->$k)))
                    $this->$k = (float) str_replace(',','.',$this->$k);
            }
        }
        return $diffData;
    }

    public function toArray($prop=null) {
        $properties = (is_array($prop)) ? $prop : $this->getProperties();
        foreach ($properties as $p) {
            if (is_array($p))
                $p = $p['name'];

          if (strpos($p, 'KNTSession_') !== false && (is_numeric($this->$p)  || preg_match('/[0-9]+,[0-9]+/',$this->$p)))
                $values[$p] = (float) str_replace(',','.',$this->$p);
          else
                $values[$p] = $this->$p;
        }

        return $values;
    }


    public function getUpdateStamp() {
        return $this->Updated;
    }

    public function setUpdateStamp($value) {
        $this->Updated = time();
    }



    /* KNT LOGIC */

    public function getVyskaM() {
        return $this->KNTSession_Vyska / 100;
    }
 

    public function getPohlavi() {
        if ($this->_pohlavi === null)
                $this->_pohlavi = $this->KNTSession_PohlaviAsDefName;
        return $this->_pohlavi;
    }


    public function setVek($value) { }
    public function getVek() {
        return round(($this->Created - $this->DateOfBirth) / (365*24*60*60), 0);
    }

    public function getBMI() {
        try {
            return $this->KNTSession_Hmotnost / $this->VyskaM / $this->VyskaM;
        } catch (Exception $e) {
            throw new FInvalidFieldValue('invalid_field_value', $e->Message);
        }
    }

    public function getIdealniBMI() {
        if (!$this->PohlaviMuz)
            return 0.4 * $this->BMI + 0.03 * $this->KNTSession_ProcentoTuku + 11;
        else
            return 0.5 * $this->BMI + 11.5;
    }

    /**
     * Stav podle % tuku [ D50 ] N17
     *
     * @return string  slovní vyjádření, localized
     * @throws FNewInvalidFieldValue pokud není nalezen záznam v tabulce StavVyzivy
     */
    public function getStavPodleProcentaTuku() {


//=KDYŽ(procento_tuku<'Vstupní data'!D131;"podvýživa";KDYŽ(procento_tuku2<'Vstupní data'!E131;"standard";KDYŽ(procento_tuku2<'Vstupní data'!F131;"nadváha";"velká obezita")))

        if ($sr = StavVyzivyRecord::finder()->findByPk($this->Vek)) {
            list($dolniTuk, $horniTuk, $obezniTuk) = $sr->stav($this->Pohlavi);

            $tuk = $this->KNTSession_ProcentoTuku;

            if ($tuk < $dolniTuk)
                return Prado::localize('podvýživa');
            elseif ($tuk < $horniTuk)
                return Prado::localize('normal');
            elseif ($tuk < $obezniTuk)
                return Prado::localize('nadváha');
            else
                return Prado::localize('velká obezita');
        }
        else {
            throw new FNewInvalidFieldValue('invalid_stav_vyzivy_table', $this->Vek);
        }
    }




    /**
     * Stav podle % tuku [ D50 ]
     *
     * @return string  slovní vyjádření, localized - vystup v cislech pro [P17]
     * 
     */
    public function getStavPodleProcentaTukuIndex() {

        if ($sr = StavVyzivyRecord::finder()->findByPk($this->Vek)) {
            list($dolniTuk, $horniTuk, $obezniTuk) = $sr->stav($this->Pohlavi);

            $tuk = $this->KNTSession_ProcentoTuku;

            if ($tuk < $dolniTuk)
                return 1;
            elseif ($tuk < $horniTuk)
                return 2;
            elseif ($tuk < $obezniTuk)
                return 3;
            else
                return 4;
        }
        else {
            throw new FNewInvalidFieldValue('invalid_stav_vyzivy_table', $this->Vek);
        }
    }







    /**
     * Stav podle % tuku [ D50 ]
     *
     * @return string  slovní vyjádření, localized
     * @throws FNewInvalidFieldValue pokud není nalezen záznam v tabulce StavVyzivy
     */
    public function getStupenObezity() {




//=KDYŽ(NEBO(N17="velká obezita";N17="nadváha");CONCATENATE("stupeň obezity: ";ZAOKR.DOLŮ('Vstupní data'!C12/'Vstupní data'!C57*100;1);" %");"")

		if ($this->StavPodleProcentaTukuIndex == '3' || $this->StavPodleProcentaTukuIndex=='4') {
				return Prado::localize('Stupeň obezity: ').floor($this->KNTSession_Hmotnost / $this->IdealniVaha * 100)." %"; 
		}
		
	
	}


    /**
     * 
     * fyz kondice [ B861 ]
     */

    public function getFyzickaKondice() {
        return $this->KNTSession_FyzickaKondiceAsDefName;
    }





    public function getPohlaviMuz() {
        return ($this->Pohlavi == 'muž');
    }

    
    /**
     * Svalovina beztukova hmota [ D52 ]
     * @return float svalovina beztuková hmota
     */
	 
    public function getLBM() {
        $hm = $this->KNTSession_Hmotnost;
        return $hm - $this->TukFFM;
    }


    /**
     * Svalovina beztukova hmota [ D52 ]
     * @return float svalovina beztuková hmota
     */
	 
    public function getLBMZaokrouhleno() {
        return round($this->LBM,1);
    }







    /**
     * Minimání zdrava hmotnost [ D53 ]
     * @return float
     */
    public function getMinimalniZdravaVaha() {

        $koef = ($this->PohlaviMuz) ? 0.97 : 0.88;
        return round($this->LBM / $koef);
    }

    /**
     * BMR [ D54 ]
     * @return float
     */
    public function getBMR() {

        if ($this->PohlaviMuz) {
            $bmr = 66 + (13.7 * $this->KNTSession_Hmotnost) + (5 * $this->KNTSession_Vyska) - (6.8 * $this->Vek);
        } else {
            $bmr = 655 + (9.6 * $this->KNTSession_Hmotnost) + (1.8 * $this->KNTSession_Vyska) - (4.7 * $this->Vek);
        }
        return round($bmr,1);
		
    }

    /**
     * BMR s ohledem na aktivitu -  [ D55 ] - SVYHLEDAT
    */
    public function getKalorickaSpotreba() {
		return round($this->BMR * $this->KNTSession_ZivotniStylAsDefValue,1);
	}



    /**
     * BMR z ideaílní báhy [ D56 ]
     * @return float
     */
    public function getBMRzIdealniZdravaVaha() {

        if ($this->PohlaviMuz) {
            $bmrIzv = 66 + (13.7 * $this->IdealniVaha) + (5 * $this->KNTSession_Vyska) - (6.8 * $this->Vek);
        } else {
            $bmrIzv = 655 + (9.6 * $this->IdealniVaha) + (1.8 * $this->KNTSession_Vyska) - (4.7 * $this->Vek);
        }
        return $bmrIzv;
    }

    /**
     * Idealni váha [ C57 ]
     * @return float
     */
    public function getIdealniVaha() {
        return $this->LBM / (1 - $this->IdealniTuk / 100);
    }

    public function getPrumernaIdealniVaha() {
        list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
        return ( $this->LBM / (1 - $dolniTuk / 100) + $this->LBM / (1 - $horniTuk / 100) )/2;
    }




    /**
     *
     * @return array dolni horni a obezni tuk
     */
    public function getHraniceTuk()
    {

        if ($this->_hranice_tuk === null) {
            if ($sr = StavVyzivyRecord::finder()->findByPk($this->Vek)) {
                $this->_hranice_tuk = $sr->stav($this->Pohlavi);
            } else {
                throw new FNewInvalidFieldValue('invalid_stav_vyzivy_table', $this->Vek);
            }

        }
        return $this->_hranice_tuk;
    }

 
    /**
     * Idealni tuk [ C58 ]
     * @return float
     */
    public function getIdealniTuk() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return ($dolniTuk + $horniTuk) / 2;
    }

    /**
     * Ideální svalovina při ideální váze [ C59 ]
     * @return float
     */
    public function getIdealniSvalovinaPriIdealniVaze() {

        return (1 - ($this->KNTSession_ProcentoTuku - $this->IdealniTuk) / 100) * $this->KNTSession_Hmotnost * (1 - $this->IdealniTuk / 100);
    }

    /**
     * Ideální svalovina při stávající váze [ D60 ]
     * @return float
     */
    public function getIdealniSvalovinaPriStavajiciVaze() {

        return $this->KNTSession_Hmotnost - $this->IdealniTuk * $this->KNTSession_Hmotnost / 100;
    }

    /**
     * úprava tuku [ C61 ]
     * @return float
     */
    public function getUpravaTuku() {

        return -($this->KNTSession_Hmotnost*($this->KNTSession_ProcentoTuku - $this->IdealniTuk)/100 + $this->UpravaSvaloviny);
//        return -($this->KNTSession_Hmotnost - $this->OptimalniVaha + $this->UpravaSvaloviny);
    }

    /**
     * úprava svaloviny [ C62 ]
     * @return float
     */
    public function getUpravaSvaloviny() {
        
        $prumVaha = $this->KNTSession_Hmotnost*(1-($this->KNTSession_ProcentoTuku - $this->IdealniTuk)/100);
        return $prumVaha * (1 - $this->IdealniTuk/100) - $this->LBM;
        //return $this->IdealniSvalovinaPriIdealniVaze - $this->LBM;
    }

    /**
     * dolní váha  [ B66 ]
     * @return float
     */
    public function getDolniVaha() {
            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return $this->KNTSession_Hmotnost - $this->KNTSession_Hmotnost*($this->KNTSession_ProcentoTuku - $dolniTuk )/ 100;
    }

    /**
     * horní váha  [ C66 ]
     * @return float
     */
    public function getHorniVaha() {
            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return $this->KNTSession_Hmotnost - $this->KNTSession_Hmotnost*($this->KNTSession_ProcentoTuku - $horniTuk )/ 100;
//            return $this->LBM / (1 - $horniTuk / 100);
    }


























    /**
     * obezni váha [ D66 ]
     * @return float
     */
    public function getObezniVaha() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return $this->LBM / (1 - $obezniTuk / 100);
    }

    /**
     * metabolicky vek [ C68 ]
     * @return float
     */
    public function getMetabolickyVek() {

        /* [ E68 ] */
        if ($this->PohlaviMuz) {
            $metaboVekZaklad = -($this->BMRzIdealniZdravaVaha - 66 - 13.7 * $this->KNTSession_Hmotnost - 5 * $this->KNTSession_Vyska) / 6.8;
        } else {
            $metaboVekZaklad = -($this->BMRzIdealniZdravaVaha - 655 - 9.6 * $this->KNTSession_Hmotnost - 1.8 * $this->KNTSession_Vyska) / 4.7;
        }


        /* [ D68 ] */
        if ($metboVekZaklad > ($this->Vek + 30)) {
            $metaboVek = $metaboVekZaklad + 30;
        } else {
            $metaboVek = $metaboVekZaklad;
        }

        /* [ C68 ] */
        if ($metboVek > 80) {
            return 80;
        } else {
            return $metaboVek;
        }
    }

    /**
     * kosti [ C69 ]
     * @return float
     */
    public function getKosti() {

        if ($this->PohlaviMuz) {
            return $this->LBM * 0.058;
        } else {
            return $this->LBM * 0.053;
        }
    }

    /**
     * kosti [ C69 ] zaokrouhleno
     * @return float
     */
    public function getKostiZaokrouhleno() {
		return floor($this->Kosti * 10)/10;
    }






    /**
     * kosti [ C16 ]
     * @return bool
     * =IF(vaha_kosti*1,05>IF(pohlavi=zena;IF(vaha<50;1,95;IF(vaha<75;2,4;2,95));IF(vaha<75;2,7;IF(vaha<99;3,3;3,7)));1;0)
     */
    public function getKostiOK() {

        $vaha = $this->KNTSession_Hmotnost;
        if ($this->PohlaviMuz) {
                    if ($vaha<75)
                        $koef = 2.7;
                    elseif ($vaha<99)
                        $koef = 3.3;
                    else
                        $koef = 3.7;
        } else {
                    if ($vaha<50)
                        $koef = 1.95;
                    elseif ($vaha<75)
                        $koef = 2.4;
                    else
                        $koef = 2.9;
        }

        return ($this->KNTSession_HmotnostKosti*1.05 > $koef);
    }

    /**
     * svalovina při současné váze - normal [ D73 ]
     * @return float
     */
    public function getSvalovinaPriSoucasneVazeNormal() {
       
            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return (1 - $obezniTuk / 100) * $this->KNTSession_Hmotnost;
    }

    /**
     * svalovina při současné váze - nad [ E73 ]
     * @return float
     */
    public function getSvalovinaPriSoucasneVazeNad() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return (1 - $horniTuk / 100) * $this->KNTSession_Hmotnost;
    }

    /**
     * svalovina při současné váze - extrem [ E73 ]
     * @return float
     */
    public function getSvalovinaPriSoucasneVazeExtrem() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return (1 - $dolniTuk / 100) * $this->KNTSession_Hmotnost;
    }

    /* ---   GRAF radek VAHA ---- */



    /* graf - radek vaha krok normal [ H150 ]
     * @return float
     */

    public function getGrafVahaKrokNormal() {
        return ($this->HorniVaha - $this->DolniVaha) / 3;
    }

    /* graf - radek vaha krok nad[ I150 ]
     * @return float
     */

    public function getGrafVahaKrokNad() {
        return ($this->ObezniVaha - $this->HorniVaha) / 3;

    }

    /* graf - radek vaha sign POD[ L150 ]
     * @return float
     */

    public function getGrafVahaSignPod() {


        if ($this->KNTSession_Hmotnost < $this->DolniVaha) {

            if ($this->KNTSession_Hmotnost < ($this->DolniVaha - 2 * $this->GrafVahaKrokNormal)) {
                $sign = self::SIGN_LEFT;
            } else {
                if ($this->KNTSession_Hmotnost < ($this->DolniVaha - 1 * $this->GrafVahaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_RIGHT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek vaha sign NORMAL [ M150 ]
     * @return float
     */

    public function getGrafVahaSignNormal() {

        if (($this->KNTSession_Hmotnost >= $this->DolniVaha) && ($this->KNTSession_Hmotnost <  $this->HorniVaha)) {


            if ($this->KNTSession_Hmotnost > ($this->DolniVaha + 2 * $this->GrafVahaKrokNormal)) {
                $sign = self::SIGN_RIGHT;
            } else {

                if ($this->KNTSession_Hmotnost > ($this->DolniVaha + 1 * $this->GrafVahaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek vaha sign NAD [ N150 ]
     * @return float
     */

   public function getGrafVahaSignNad() {


		if (($this->KNTSession_Hmotnost >=  $this->HorniVaha) && ($this->KNTSession_Hmotnost <  $this->ObezniVaha)) {

            if ($this->KNTSession_Hmotnost > ($this->HorniVaha + 2 *  $this->GrafVahaKrokNad)) {
                $sign = self::SIGN_RIGHT;
            } else {
                if ($this->KNTSession_Hmotnost > ($this->HorniVaha + 1 *  $this->GrafVahaKrokNad)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }
//			return "polib si";
        return $sign;
		//return self::SIGN_VOID;
    }

    /* graf - radek vaha sign EXTREM [ O150 ]
     * @return float
     */

    public function getGrafVahaSignExtrem() {

        if (($this->KNTSession_Hmotnost >=  $this->ObezniVaha)) {


            if ($this->KNTSession_Hmotnost > ( $this->ObezniVaha + 2 * $this->GrafVahaKrokNormal)) {
                $sign = self::SIGN_RIGHT;
            } else {

                if ($this->KNTSession_Hmotnost > ( $this->ObezniVaha + 1 * $this->GrafVahaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }


        return $sign;
    }

    /* ---  KONEC GRAF radek VAHA ---- */
























    /* ---   GRAF radek TUK % ---- */



    /* graf - radek TUK krok normal [ H151 ]
     * @return float
     */

    public function getGrafTukKrokNormal() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
            return ($horniTuk - $dolniTuk) / 3;
    }

    /* graf - radek TUk krok nad[ I151 ]
     * @return float
     */

    public function getGrafTukKrokNad() {
            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
			return ($obezniTuk - $horniTuk) / 3;
    }

    /* graf - radek TUK sign POD[ L151 ]
     * @return float
     */

    public function getGrafTukSignPod() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;


            if ($this->KNTSession_ProcentoTuku < $dolniTuk) {

                if ($this->KNTSession_ProcentoTuku < ($dolniTuk - 2 * $this->GrafTukKrokNormal)) {
                    $sign = self::SIGN_LEFT;
                } else {
                    if ($this->KNTSession_ProcentoTuku < ($dolniTuk - 1 * $this->GrafTukKrokNormal)) {
                        $sign = self::SIGN_MIDDLE;
                    } else {
                        $sign = self::SIGN_RIGHT;
                    }
                }
            } else {
                $sign = self::SIGN_VOID;
            }

            return $sign;
    }

    /* graf - radek TUK sign NORMAL [ M151 ]
     * @return float
     */

    public function getGrafTukSignNormal() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;


            if (($this->KNTSession_ProcentoTuku >= $dolniTuk) && ($this->KNTSession_ProcentoTuku < $horniTuk)) {


                if ($this->KNTSession_ProcentoTuku > ($dolniTuk + 2 * $this->GrafTukKrokNormal)) {
                    $sign = self::SIGN_RIGHT;
                } else {

                    if ($this->KNTSession_ProcentoTuku > ($dolniTuk + 1 * $this->GrafTukKrokNormal)) {
                        $sign = self::SIGN_MIDDLE;
                    } else {
                        $sign = self::SIGN_LEFT;
                    }
                }
            } else {
                $sign = self::SIGN_VOID;
            }
            return $sign;
    }

    /* graf - radek TUK sign NAD [ N151 ]
     * @return float
     */

    public function getGrafTukSignNad() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;


//=KDYŽ(A(G151>=E151;G151<F151);KDYŽ(G151>(E151+2*I151);"--X";KDYŽ(G151>(E151+1*I151);"-X-";"X--"));"---")

            if (($this->KNTSession_ProcentoTuku >= $horniTuk) && ($this->KNTSession_ProcentoTuku < $obezniTuk)) {


                if ($this->KNTSession_ProcentoTuku > ($horniTuk + 2 * $this->GrafTukKrokNad)) {
                    $sign = self::SIGN_RIGHT;
                } else {
                    if ($this->KNTSession_ProcentoTuku > ($horniTuk + 1 * $this->GrafTukKrokNad)) {
                        $sign = self::SIGN_MIDDLE;
                    } else {
                        $sign = self::SIGN_LEFT;
                    }
                }
            } else {
                $sign = self::SIGN_VOID;
            }
            return $sign;
    }

    /* graf - radek tTUK sign EXTREM [ O151 ]
     * @return float
     */

    public function getGrafTukSignExtrem() {

            list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;


            if (($this->KNTSession_ProcentoTuku >= $obezniTuk)) {


                if ($this->KNTSession_ProcentoTuku > ($obezniTuk + 2 * $this->GrafVahaKrokNormal)) {
                    $sign = self::SIGN_RIGHT;
                } else {

                    if ($this->KNTSession_ProcentoTuku > ($obezniTuk + 1 * $this->GrafVahaKrokNormal)) {
                        $sign = self::SIGN_MIDDLE;
                    } else {
                        $sign = self::SIGN_LEFT;
                    }
                }
            } else {
                $sign = self::SIGN_VOID;
            }
            return $sign;
    }

    /* ---  KONEC GRAF radek TUK ---- */









































    /* ---   GRAF radek svalovina ---- */



    /* graf - radek SVALOVINA krok normal [ H152 ]
     * @return float
     */

    public function getGrafSvalovinaKrokNormal() {
        return ($this->SvalovinaPriSoucasneVazeExtrem - $this->SvalovinaPriSoucasneVazeNad) / 3;
    }

    /* graf - radek SVALOVINA krok nad[ I152 ]
     * @return float
     */

    public function getGrafSvalovinaKrokNad() {

        $extremniSvalovina = $this->SvalovinaPriSoucasneVazeExtrem + 3 * $this->GrafSvalovinaKrokNormal;

        return ($extremniSvalovina - $this->SvalovinaPriSoucasneVazeExtrem) / 3;
    }

    /* graf - radek SVALOVINA sign POD[ L152 ]
     * @return float
     */

    public function getGrafSvalovinaSignPod() {



        if ($this->LBM < $this->SvalovinaPriSoucasneVazeNad) {


            if ($this->LBM < ($this->SvalovinaPriSoucasneVazeNad - 2 * $this->GrafSvalovinaKrokNormal)) {
                $sign = self::SIGN_LEFT;
            } else {
                if ($this->LBM < ($this->SvalovinaPriSoucasneVazeNad - 1 * $this->GrafSvalovinaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_RIGHT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek SVALOVINA sign NORMAL [ M152 ]
     * @return float
     */

    public function getGrafSvalovinaSignNormal() {



        if (($this->LBM >= $this->SvalovinaPriSoucasneVazeNad) && ($this->LBM < $this->SvalovinaPriSoucasneVazeExtrem)) {


            if ($this->LBM > ($this->SvalovinaPriSoucasneVazeNad + 2 * $this->GrafSvalovinaKrokNormal)) {
                $sign = self::SIGN_RIGHT;
            } else {

                if ($this->LBM > ($this->SvalovinaPriSoucasneVazeNad + 1 * $this->GrafSvalovinaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek SVALOVINA sign NAD [ N152 ]
     * @return float
     */

    public function getGrafSvalovinaSignNad() {

        $extremniSvalovina = $this->SvalovinaPriSoucasneVazeExtrem + 3 * $this->GrafSvalovinaKrokNormal; 
		/*[F152]*/

        if (($this->LBM >= $this->SvalovinaPriSoucasneVazeExtrem) && ($this->LBM < $extremniSvalovina)) {


            if ($this->LBM > ($this->SvalovinaPriSoucasneVazeExtrem + 2 * $this->GrafSvalovinaKrokNad)) {
                $sign = self::SIGN_RIGHT;
            } else {
                if ($this->LBM > ($this->SvalovinaPriSoucasneVazeExtrem + 1 * $this->GrafSvalovinaKrokNad)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek SVALOVINA sign EXTREM [ O152 ]
     * @return float
     */

    public function getGrafSvalovinaSignExtrem() {

        $extremniSvalovina = $this->SvalovinaPriSoucasneVazeExtrem + 3 * $this->GrafSvalovinaKrokNormal; 
		/*[F152]*/

        if (($this->LBM >= $extremniSvalovina)) {


            if ($this->LBM > ($extremniSvalovina + 2 * $this->GrafSvalovinaKrokNormal)) {
                $sign = self::SIGN_RIGHT;
            } else {

                if ($this->LBM > ($extremniSvalovina + 1 * $this->GrafSvalovinaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }


        return $sign;
    }

    /* ---  KONEC GRAF radek SVALOVINA ---- */






































    /* ---   GRAF radek VODA ---- */

    /* graf - radek HORNI VODA [ D156 ]
     * @return float
     */

    public function getHorniVoda() {

        if ($this->PohlaviMuz) {
            return 65;
        } else {
            return 55;
        }
    }

    /* graf - radek DOLNI VODA [ C156 ]
     * @return float
     */

    public function getDolniVoda() {
        return $this->HorniVoda - 5;
    }

    /* graf - radek NAD VODA [ E156 ]
     * @return float
     */

    public function getNadVoda() {
        if ($this->PohlaviMuz) {
            return 70;
        } else {
            return 60;
        }
    }

    /* graf - radek EXTREM VODA [ F156 ]
     * @return float
     */

    public function getExtremVoda() {

        return $this->NadVoda + 5;
    }

    /* graf - radek VODA krok normal [ H156 ]
     * @return float
     */

    public function getGrafVodaKrokNormal() {

        return ($this->ExtremVoda - $this->NadVoda) / 3;
    }

    /* graf - radek VODA krok nad[ I156 ]
     * @return float
     */

    public function getGrafVodaKrokNad() {

        return ($this->ExtremVoda - $this->NadVoda) / 3;
    }

    /* graf - radek VODA sign POD[ L156 ]
     * @return string
     */

    public function getGrafVodaSignPod() {



        if ($this->KNTSession_ProcentoVody < $this->DolniVoda) {


            if ($this->KNTSession_ProcentoVody < ($this->DolniVoda - 2 * getGrafVodaKrokNormal)) {
                $sign = self::SIGN_LEFT;
            } else {
                if ($this->KNTSession_ProcentoVody < ($this->DolniVoda - 1 * getGrafVodaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_RIGHT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek VODA sign NORMAL [ M156 ]
     * @return float
     */

    public function getGrafVodaSignNormal() {

        if (($this->KNTSession_ProcentoVody >= $this->DolniVoda) && ($this->KNTSession_ProcentoVody < $this->HorniVoda)) {


            if ($this->KNTSession_ProcentoVody > ($this->DolniVoda + 2 * $this->GrafVodaKrokNormal)) {
                $sign = self::SIGN_RIGHT;
            } else {

                if ($this->KNTSession_ProcentoVody > ($this->DolniVoda + 1 * $this->GrafVodaKrokNormal)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek VODA sign NAD [ N156 ]
     * @return float
     */

    public function getGrafVodaSignNad() {

        if (($this->KNTSession_ProcentoVody >= $this->HorniVoda) && ($this->KNTSession_ProcentoVody < $this->NadVoda)) {


            if ($this->KNTSession_ProcentoVody > ($this->HorniVoda + 2 * $this->GrafVodaKrokNad)) {
                $sign = self::SIGN_RIGHT;
            } else {
                if ($this->KNTSession_ProcentoVody > ($this->HorniVoda + 1 * $this->GrafVodaKrokNad)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }

        return $sign;
    }

    /* graf - radek VODA sign EXTREM [ O156 ]
     * @return float
     */

    public function getGrafVodaSignExtrem() {

        if (($this->KNTSession_ProcentoVody >= $this->NadVoda) && ($this->KNTSession_ProcentoVody < $this->ExtremVoda)) {



            if ($this->KNTSession_ProcentoVody > ($this->NadVoda + 2 * $this->GrafVodaKrokNad)) {
                $sign = self::SIGN_RIGHT;
            } else {

                if ($this->KNTSession_ProcentoVody > ($this->NadVoda + 1 * $this->GrafVodaKrokNad)) {
                    $sign = self::SIGN_MIDDLE;
                } else {
                    $sign = self::SIGN_LEFT;
                }
            }
        } else {
            $sign = self::SIGN_VOID;
        }


        return $sign;
    }

    /* ---  KONEC GRAF radek VODA ---- */




    public function __get($name) {

        if (preg_match('/^(.+)As(Def(.*?))$/',$name,$m))
        {
			$var = $m[1];
            if ($m[2]=='Def'.$m[3]) {

                $class = (!$m[3]) ? 'Name' : $m[3];

                $df = DefinitionRecord::finder()->findByPk($this->$var);

                return ($df) ? $df->$class : $this->$var;

            }

        }

        list($a, $n) = explode('_', $name, 2);
        if (strpos($name, 'KNTSession_') !== false)
            return $this->$a->$n;

        return parent::__get($name);
    }










































    /**
     * dolní váha - zaorouhlena [ B66 ]
     * @return float
     */
    public function getDolniVahaZaokrouhleno() {
            
            return round($this->DolniVaha,1);
    }

    /**
     * horní váha - zaokrouhlena [ C66 ]
     * @return float
     */
    public function getHorniVahaZaokrouhleno() {
           return round($this->HorniVaha,1);
    }







    /**
     * dolni tuk - zaokrouhleny [ D131 ]
     * @return float
     */
    public function getDolniTukZaokrouhleno() {
        list($dolniTuk, $horniTuP22, $obezniTuk) = $this->HraniceTuk;
		return round($dolniTuk,1);
    }


    /**
     * horni tuk - zaokrouhleny [ E131 ]
     * @return float
     */
    public function getHorniTukZaokrouhleno() {
        list($dolniTuk, $horniTuk, $obezniTuk) = $this->HraniceTuk;
		return round($horniTuk,1);
    }
	
	
	
	
	
    /**
     * nad sval - zaokrouhleny [ D152 ]
     * @return float
     */
    public function getSvalovinaNadZaokrouhleno() {
		return round($this->SvalovinaPriSoucasneVazeNad,1);
    }


	
    /**
     * extrem sval - zaokrouhleny [ E152 ]
     * @return float
     */
    public function getSvalovinaExtremZaokrouhleno() {
		return round($this->SvalovinaPriSoucasneVazeExtrem,1);
    }
	
	
	
    /**
     * Idealni váha - zaokrouhleno [ C57 ]
     * @return float
     */
    public function getIdealniVahaZaokrouhleno() {
        return round($this->IdealniVaha, 1);
    }
	
	
	
	
	
	    /**
     * úprava tuku - zaokr [ C61  N22 ]
     * @return float
     */
    public function getUpravaTukuZaokrouhleno() {
	
		return round($this->UpravaTuku, 1);
    }

	    /**
     * úprava tuku - text[ analyza P23]
     * @return float
     */
    public function getUpravaTukuText() {

		if ($this->UpravaTukuZaokrouhleno < 0) {
			return Prado::localize('Předpokládaná doba hubnutí (měsíce): ').ceil(abs($this->UpravaTukuZaokrouhleno/2) );
		} else {
			return Prado::localize('Doporučená doba regenerační kúry: 3 měsíce.');
		}
    }


	    /**
     * úprava tuku - text[ analyza P24]
     * @return float
     */
    public function getUpravaTukuTextFixace() {

		if ($this->UpravaTukuZaokrouhleno < -6) {
			return Prado::localize('Doporučená doba fixace: (měsíce): ').ceil(abs($this->UpravaTukuZaokrouhleno/2) );
		} else {
			return Prado::localize('Doporučenou dobu fixace a regenerační kúry konzultujte se specialistou.');
		}
    }







	
	
	    /**
     * úprava tuku - % [ analyza P22  ]
     * @return float
     */
    public function getUpravaTukuProcentaZaokrouhleno() {
		//=uprava_tuku/vaha2*100
        return round($this->UpravaTuku / $this->KNTSession_Hmotnost * 100, 1);
    }	
	
	
	
    /**
     * úprava svaloviny - zaokrouhleno [ C62 ]
     * @return float
     */
    public function getUpravaSvalovinyZaokrouhleno() {

          return round($this->UpravaSvaloviny, 1);
    }	






    /**
     * bmi ZAOKR
     * @return float
     */
    public function getBMIZaokrouhleno() {
          return round($this->BMI, 1);
    }	


    /**
     * idealni bmi ZAOKR
     * @return float
     */
    public function getIdealniBMIZaokrouhleno() {
          return round($this->IdealniBMI, 1);
    }	



	 /**
     * metabolicky vek [ C68 ]ZAOKR
     * @return float
     */
    public function getMetabolickyVekZaokrouhleno() {
          return round($this->MetabolickyVek, 1);
    }	



    /**
     * BMR s ohledem na aktivitu -  [ D55 ] - ZAOKROUHLENO
    */
    public function getKalorickaSpotrebaZaokrouhleno() {
		return round($this->BMR * $this->KNTSession_ZivotniStylAsDefValue,1);
	}


    /**
     * FFM -  [ D51 ] - 
    */
    public function getTukFFM() { 
		return $this->KNTSession_ProcentoTuku * $this->KNTSession_Hmotnost / 100;
	}


    public function getTukFFMZaokrouhleno() { 
		return round($this->TukFFM,1);
	}

	









































/* KNT RESULT  */



/* ---  GRAFY ---*/

    public function getSpalovaniCukru() {

        $e =  ($this->KNTSession_EnergieMnozstvi / 10) +
              ($this->KNTSession_ChutJidlo / 10);


        return array(
            $e +  $this->KNTSession_ChuteAsDefValue,             // Pomale
            2 - $e + 1 - (float) $this->KNTSession_ChuteAsDefValue  //Rychle
        );
    }


    public function getSpalovaniCukruText() {

        list($pomale,$rychle) = $this->SpalovaniCukru;
        
        if  ($pomale > $rychle) {
			return Prado::localize("pomalé");
		} elseif ($pomale < $rychle) {
			return Prado::localize("rychlé");			
		} else {
			return Prado::localize("vyvážené");			
		}
    }




    public function getSpalovaniCukruVaha() {
//	=(MAX(E275:F275)/(PRŮMĚR(E275:F275))-1)*100
		return round(( max($this->SpalovaniCukru[0], $this->SpalovaniCukru[1]) / (($this->SpalovaniCukru[0] + $this->SpalovaniCukru[1])/2) - 1) * 100,0);			
	
	}











    public function getSpalovaniTuku() {

        $e =  ($this->KNTSession_EnergieMnozstvi / 10) +
              ($this->KNTSession_Zazivani / 10) +
              ($this->KNTSession_TepKlidovy / 10);


        return array(
            3 - $e,             // Pomale
             $e   //Rychle
        );


    }


    public function getSpalovaniTukuText() {
        list($pomale,$rychle) = $this->SpalovaniTuku;
        
        if  ($pomale > $rychle) {
			return Prado::localize("pomalé");
		} elseif ($pomale < $rychle) {
			return Prado::localize("rychlé");			
		} else {
			return Prado::localize("vyvážené");			
		}
    }


    public function getSpalovaniTukuVaha() {
//=KDYŽ(E278>=F278;E277;F277)
		return round(( max($this->SpalovaniTuku[0], $this->SpalovaniTuku[1]) / (($this->SpalovaniTuku[0] + $this->SpalovaniTuku[1])/2) - 1) * 100,0);			
	
	}

























    public function getWHR() { 
		
		return round($this->KNTSession_ObvodPasu / $this->KNTSession_ObvodBoku, 2);
	}

	

    public function getTypPostavy() { 
		
		if ($this->WHR <= 0.7) {
			return Prado::localize('kntRes.TypPostavy.GynodniHruska');
		} else {
			if ($this->WHR < 0.8) {
				return Prado::localize('kntRes.TypPostavy.NevyhranenaPostava');	
			} else {
				return Prado::localize('kntRes.TypPostavy.AndroidniJablko');
			}
				
		}

	}








    public function getMetabolickyTypCiselne() { 
		return 
		$this->KNTSession_SacharidyUspokoji +
		$this->KNTSession_CerveneMaso + 
		$this->KNTSession_JidloMysli +
		$this->KNTSession_VydatnostSnidane +
		$this->KNTSession_VydatnostObeda +
		$this->KNTSession_VydatnostVecere +
		$this->KNTSession_TucneSpani +
		$this->KNTSession_EnergieZelenina +
		$this->KNTSession_CastoJi +
		$this->KNTSession_RadKysele +	
		$this->KNTSession_BarvaKrutihoMasaAsDefValue;
		
	}







    public function getMetabolickyTyp() { 
	
		if ($this->MetabolickyTypCiselne >= 70) {
			return PRADO::localize('kntRes.vyrazneProteinovy.Text'); //výrazně proteinový
		} 
		elseif ($this->MetabolickyTypCiselne >= 60) {
			return PRADO::localize('kntRes.proteinovy.Text');
		}
		elseif ($this->MetabolickyTypCiselne >= 40) {
			return PRADO::localize('kntRes.smiseny.Text');
		}
		elseif ($this->MetabolickyTypCiselne >= 30) {
			return PRADO::localize('kntRes.sacharidovy.Text');
		} else {
			return PRADO::localize('kntRes.vyrazneSacharidovy.Text');
		}

	}



    public function getMetabolickyTypVaha() { 
	
		if ($this->MetabolickyTypCiselne >= 70) {
			return PRADO::localize('kntRes.vyrazneProteinovy.Vaha'); //výrazně proteinový
		} 
		elseif ($this->MetabolickyTypCiselne >= 60) {
			return PRADO::localize('kntRes.proteinovy.Vaha');
		}
		elseif ($this->MetabolickyTypCiselne >= 40) {
			return PRADO::localize('kntRes.smiseny.Vaha');
		}
		elseif ($this->MetabolickyTypCiselne >= 30) {
			return PRADO::localize('kntRes.sacharidovy.Vaha');
		} else {
			return PRADO::localize('kntRes.vyrazneSacharidovy.Vaha');
		}


	}



public function getMetabolickyTypValues() {

        $v = array();

        $v[] = array(array(30,$this->getMetabolickyTypCiselne()));
        $v[] = array(array(10,0));
        $v[] = array(array(20,0));
        $v[] = array(array(10,0));
        $v[] = array(array(30,0));
//$v[] = array(30,10,20,10,30);
//$v[] = array($this->getMetabolickyTypCiselne());
        return $v;

    }






    public function getParasympaticusKrok1() { //B257 

/*		echo "------z-".$this->KNTSession_Traveni."-";
		echo $this->KNTSession_Oblicej."-";
		echo $this->KNTSession_ChutJidlo."-";
		echo $this->KNTSession_Postava."-";
		echo $this->KNTSession_EnergieMnozstvi."-";
		echo $this->KNTSession_Povaha."-";
		echo $this->KNTSession_Podrazdenost."------k--";*/
return round(($this->KNTSession_Traveni +
		$this->KNTSession_Oblicej +
		$this->KNTSession_ChutJidlo +
		$this->KNTSession_Postava +
		$this->KNTSession_EnergieMnozstvi +
		$this->KNTSession_Povaha +
		$this->KNTSession_Podrazdenost)	/ 7, 2);
		
	}



    public function getSympaticusKrok1() { //A257 
		return round(10 - $this->ParasympaticusKrok1,2);
	}



    public function getParasympaticusKrok2() { //B256
		//E19  
		$this->KNTSession_Zazivani >= 5 ? $prujemAnoNe = 1 : $prujemAnoNe = 0; //1-4 NE 5-10 ANO prujem

		$count = $this->KNTSession_Alergie + $this->KNTSession_Unava + $this->KNTSession_Opary + $prujemAnoNe;
		
		return $this->ParasympaticusKrok1 + $count; 
	}


    public function getSympaticusKrok2() { //A256
		//C19  
		$count = $this->KNTSession_Zaha + $this->KNTSession_Nespavost + $this->KNTSession_KrevniTlak + $this->KNTSession_Infekce;

		return $this->SympaticusKrok1 + $count; 
	}



    public function getANS() { //C6
		//=KDYŽ(A256/B256>=1;A255;B255)
		if (($this->SympaticusKrok2 / $this->ParasympaticusKrok1) >= 1) {
			return PRADO::localize('kntRes.ANS.Sympaticus');
		} else {
			return PRADO::localize('kntRes.ANS.Parasympaticus');			
		}
	}




    public function getANSVaha() { 
		
	//echo $this->ParasympaticusKrok1;
	
	
		//=(MAX(A256:B256)/(PRŮMĚR(A256:B256))-1)*100
//		return round(( max(3.71, 8.29) / ((3.71 + 8.29)/2) - 1) * 100,2);
		return 	round(
				(max($this->SympaticusKrok2, $this->ParasympaticusKrok2) / 
				(($this->SympaticusKrok2 + $this->ParasympaticusKrok2) / 2) - 1) * 100, 0);		

	}


    public function getANSValues() { 

		return array($this->SympaticusKrok2, $this->ParasympaticusKrok2);
	}








//C66
    public function getStitnaZlaza() { 

		$stitnaZlaza = $this->KNTSession_Kostra / 10; 
		
		//=KDYŽ(B258<=0,7;1/B258;0)		


		$this->WHR <= 0.7 ? $stitnaZlaza += (1 / $this->WHR) : $stitnaZlaza += 0;

		$stitnaZlaza += $this->KNTSession_Pas / 10; 

		//=(10-C54)/10
		$stitnaZlaza += (10 - $this->KNTSession_Svaly) / 10; 
		
		return round($stitnaZlaza / 4, 3);
		


	}



//C72
    public function getNadledvinky() { 

		//=C54/10*2
		$nadledvinky = $this->KNTSession_Svaly / 10 * 2; 
		
		$nadledvinky += $this->KNTSession_Svaly / 10 * 2; 
		
		$nadledvinky += $this->KNTSession_MasoJi / 10;	

		//=(10-C53)/10
		$nadledvinky += (10 - $this->KNTSession_Pas) / 10; 
	
		return round($nadledvinky / 4, 3);
	
	}





//C77
    public function getGonady() { 

		//	=KDYŽ(J2<=0,7; 1/J2;0)
		$this->WHR <= 0.7 ? $gonady = 1 / $this->WHR : $gonady = 0; 
		
		//=KDYŽ(C74<>0;1;0)	
		$gonady <> 0 ? $gonady += 1 : $gonady += 0; 

		//=KDYŽ(C57="A";1;0)
		$gonady += $this->KNTSession_RuceLytka; 

		
		return round($gonady / 3, 3);
	
	}



//C81
    public function getHypofyza() { 

		//=KDYŽ(C58="A";1;0)
		$hypofyza = $this->KNTSession_HlavaVelikost;
		
		//=KDYŽ(J2>0,7;1;0)
		$this->WHR > 0.7 ? $hypofyza += 1 : $gonady += 0; 

		return round($hypofyza / 2, 3);
	}








    public function getAbravanelValues() { 
		return array($this->StitnaZlaza, 
					 $this->Nadledvinky, 
					 $this->Gonady, 
					 $this->Hypofyza, 					 
					 );
	
	}







//C9
    public function getPrevladajiciTyp() { 

		if ($this->PohlaviMuz) {

			$maximumMuz = max($this->StitnaZlaza, $this->Nadledvinky, $this->Hypofyza);
			
			switch ($maximumMuz) {
				case $this->StitnaZlaza : return PRADO::localize('kntRes.PrevladajiciTyp.StitnaZlaza');	break;
				case $this->Nadledvinky : return PRADO::localize('kntRes.PrevladajiciTyp.Nadledvinky');	break;			
				case $this->Hypofyza : return PRADO::localize('kntRes.PrevladajiciTyp.Hypofyza');	break;						
			
			}
		
		} else {

			$maximumZena = max($this->StitnaZlaza, $this->Nadledvinky, $this->Hypofyza, $this->Gonady);		

/*		echo $this->StitnaZlaza."-";
		echo $this->Nadledvinky."-";
		echo $this->Gonady."-";
		echo $this->Hypofyza."-"."-"."-";;*/

			switch ($maximumZena) {
				case $this->StitnaZlaza : return PRADO::localize('kntRes.PrevladajiciTyp.StitnaZlaza');	break;
				case $this->Nadledvinky : return PRADO::localize('kntRes.PrevladajiciTyp.Nadledvinky');	break;			
				case $this->Hypofyza : return PRADO::localize('kntRes.PrevladajiciTyp.Hypofyza');	break;						
				case $this->Gonady : return PRADO::localize('kntRes.PrevladajiciTyp.Gonady');	break;				
			}		
		
		
		}


	}


    public function getPrevladajiciTypVaha() {
	
		$maximumMuz = max($this->StitnaZlaza, $this->Nadledvinky, $this->Hypofyza);
		$maximumZena = max($this->StitnaZlaza, $this->Nadledvinky, $this->Hypofyza, $this->Gonady);	
		$maximum = max($maximumMuz, $maximumZena);
		
		if (!$this->PohlaviMuz) {
			$prumer = ($this->StitnaZlaza + $this->Nadledvinky + $this->Hypofyza + $this->Gonady) / 4;
		} else {
			$prumer = ($this->StitnaZlaza + $this->Nadledvinky + $this->Hypofyza) / 3;			
		}
		
		return round((($maximum / $prumer) - 1) * 100, 0);
		//=(MAX(B288:B289)/KDYŽ(C59="žena";PRŮMĚR(B283:B286);PRŮMĚR(B283;B284;B286))-1)*100		
		
		
		
	}



        public function getKrevniSkupina() { return $this->KNTSession_KrevniSkupinaAsDefName; }
   public function getKrevniSkupinaVaha() {
//	   =KDYŽ(C10='KNT dotazník'!A243;0;100)

		if ($this->KNTSession_KrevniSkupinaAsDefName == "nevíme") 
		{
			return 0;
		} else {
			return 100;
   		}
   }







   public function getBojovnice() {
		
		$svaly = $this->KNTSession_Svaly / 10;
		
		$povaha = $this->KNTSession_Povaha / 10;
		


		//KDYŽ(NEBO(C84=A225;C84=A224;C84=A226);1;KDYŽ(C84=A228;A228;0))
		if ($this->KNTSession_KrevniSkupinaAsDefName == 'B' || 
			$this->KNTSession_KrevniSkupinaAsDefName == '0 Rh+' || 
			$this->KNTSession_KrevniSkupinaAsDefName == '0 Rh-'){			

			$krev = 1;
		} elseif ($this->KNTSession_KrevniSkupinaAsDefName == 'nevíme') {
			$krev = $this->KNTSession_KrevniSkupinaAsDefName;
		} else {
			$krev = 0;			
		}


		//=KDYŽ(F280>E280;1;0)
		$rychleSpalovani = $this->SpalovaniTuku[1] + $this->SpalovaniCukru[1];
		$pomaleSpalovani = $this->SpalovaniTuku[0] + $this->SpalovaniCukru[0];

		if ($rychleSpalovani > $pomaleSpalovani) {
			$spalovac = 1;	
		} else {
			$spalovac = 0;				
		}




							 
		if ($this->PrevladajiciTyp == PRADO::localize('kntRes.PrevladajiciTyp.Nadledvinky')) {
			$nadledvinky = 1;											  
		} else {
			$nadledvinky = 0;				
		}
		



		if ($this->MetabolickyTyp == PRADO::localize('kntRes.vyrazneProteinovy.Text') || $this->MetabolickyTyp == PRADO::localize('kntRes.proteinovy.Text')) {
			$metaboTyp = 1;		
		} else {
			$metaboTyp = 0;				
		}


	//=KDYŽ(C95=A228;(SUMA(D93:D94)+SUMA(D96:D98)+D93+D97+D98)/8;(SUMA(D93:D98)+D93+D97+D98)/9)
	
		if ($krev == 'nevíme') {
			return round (($svaly + $povaha +  $spalovac + $nadledvinky + $metaboTyp + $svaly + $nadledvinky + $metaboTyp) / 8, 2);
		} else {
			return round (($svaly + $povaha +  $krev + $spalovac + $nadledvinky + $metaboTyp + $svaly + $nadledvinky + $metaboTyp) / 9, 2);
		}

   }








	public function getCitlivka() {
	   
	   $povaha = (10 - $this->KNTSession_Povaha) / 10;


		//=KDYŽ(A257>B257;1;0)	   
	   if ($this->SympaticusKrok1 > $this->ParasympaticusKrok1) {
		   $sympatic = 1;
	   } else {
		   $sympatic = 0;			   
	   }
	   
	   
	   $stihla = $this->KNTSession_VMladiKrehka;
	   
	   //=(10-C104)/10
	   $cvicim = (10 - $this->KNTSession_Cviceni) / 10;
	   
	   
	   $kriticka = ($this->KNTSession_Uzkostnost + $this->KNTSession_Kriticnost) / 2;
	   
	   
	   	if ($rychleSpalovani > $pomaleSpalovani) {
			$spalovac = 1;	
		} else {
			$spalovac = 0;				
		}
	   
	   
	   return round (($povaha + $sympatic + $stihla + $cvicim + $kriticka + $spalovac + $povaha + $sympatic + $cvicim) / 9, 2);
	   
	   
	}








	public function getUmelkyne() {
//		echo $this->KNTSession_TypPostavyTvarAsDefValue;
		if ($this->KNTSession_TypPostavyTvarAsDefValue == 'váleček') {
			$postava = 2;
		} elseif ($this->KNTSession_TypPostavyTvarAsDefValue == Prado::localize('kntRes.TypPostavy.AndroidniJablko')) {
			$postava = 1;
		} else {
			$postava = 0;
		}
	
//	echo $postava;
	
		//=(A331*2+A330+A327)/4
		$nalada = ($this->KNTSession_Kriticnost * 2 + $this->KNTSession_Uzkostnost + $this->KNTSession_Uminenost) / 4;


		//=KDYŽ(B82=A78;1;0)
		if ($this->PrevladajiciTyp == PRADO::localize('kntRes.PrevladajiciTyp.Hypofyza')) {
			$hypofyza = 1;											  
		} else {
			$hypofyza = 0;				
		}
		//=(D111+D112+D113*2)/5
		return round(($postava + $nalada + $hypofyza * 2)/5 ,2);
	
	
	}





	public function getVenuse() {
		
		if ($this->TypPostavy == Prado::localize('kntRes.TypPostavy.GynodniHruska') && $this->KNTSession_TypPostavyTvarAsDefValue == 'přesýpací hodiny' ) {
			$hruska = 2;
		} elseif ($this->TypPostavy == Prado::localize('kntRes.TypPostavy.GynodniHruska')) {
			$hruska = 1;
		} else {
			$hruska = 0;	
		}




		if ($this->KNTSession_KrevniSkupinaAsDefName == 'A Rh+' || $this->KNTSession_KrevniSkupinaAsDefName == 'A Rh-'){			
			$krev = 0;
		} elseif ($this->KNTSession_KrevniSkupinaAsDefName == 'nevíme') {
			$krev = $this->KNTSession_KrevniSkupinaAsDefName;
		} else {
			$krev = 1;			
		}




		//=KDYŽ(C117=A228;D116/2;(D116+D117)/3)
		if ($krev == 'nevíme') {
			return round($hruska / 2, 2);
		} else {
			return round(($hruska + $krev) / 3, 2);
		}


	}





	public function getDummelstein() { 
	
				$maximum = max($this->Bojovnice, $this->Citlivka, $this->Umelkyne, $this->Venuse);
				

			/*	echo "----".$this->Bojovnice."-";
				echo $this->Citlivka."-";
								echo $this->Umelkyne."-";
								echo $this->Venuse."----";

*/
				
				switch ($maximum) {
					case $this->Bojovnice : return PRADO::localize('kntRes.Dummelstein.Bojovnice');	break;
					case $this->Citlivka : return PRADO::localize('kntRes.Dummelstein.Citlivka'); break;					
					case $this->Umelkyne : return PRADO::localize('kntRes.Dummelstein.Umelkyne'); break;	
					case $this->Venuse : return PRADO::localize('kntRes.Dummelstein.Venuse'); break;					
				}
			
	}


	public function getDummelsteinVaha() { 

//	=ZAOKR.DOLŮ((B364-PRŮMĚR(B360:B363))/B364*100;1)

		$maximum = max($this->Bojovnice, $this->Citlivka, $this->Umelkyne, $this->Venuse);
		$prumer = ($this->Bojovnice + $this->Citlivka + $this->Umelkyne + $this->Venuse) / 4;
		
		return floor(($maximum - $prumer) / $maximum * 100);
	
	}



	public function getDummelsteinValues() { 
		return array($this->Bojovnice, $this->Citlivka, $this->Umelkyne, $this->Venuse);
	}




	public function getPh() { return $this->KNTSession_PhCiselneAsDefValueAsList[0]; }
		

            public function getPhText() {
		//$pos = strpos($this->KNTSession_PhCiselneAsDefValue, '|');
		//$delka = (strlen($this->KNTSession_PhCiselneAsDefValue)-(strlen($this->KNTSession_PhCiselneAsDefValue) - $pos))-1;
	
		//return substr($this->KNTSession_PhCiselneAsDefValue, 0, $delka);

                return $this->KNTSession_PhCiselneAsDefValueAsList[0];


	}

	public function getPhVaha() { 
		//$pos = strpos($this->KNTSession_PhCiselneAsDefValue, '|')+1;
		//$delka = (strlen($this->KNTSession_PhCiselneAsDefValue)) ;
	
		//return substr($this->KNTSession_PhCiselneAsDefValue, $pos, $delka);
                return $this->KNTSession_PhCiselneAsDefValueAsList[1];


	}




















 public function getVata() {

        $b = (1 - $this->KNTSession_CinnostiRychlost/10) + 
             (1-$this->KNTSession_ZapominaniAsDefValue) +             //E297 -> A319
             (1 - $this->KNTSession_Nalada/10) +
             (1 - $this->KNTSession_VahuPribiram/10) +
//             (1 - $this->KNTSession_Uceni/10) +                   //E300 -> A318, pozor D144 je slider, ale je porovnáván s A/N
             (0) +                   //E300 -> A318, pozor D144 je slider, ale je porovnáván s A/N
             (1 - $this->KNTSession_Chuze/10) +         
             (1 - $this->KNTSession_Rozhodovani/10)+
             (1 - $this->KNTSession_Zacpa/10) +
             $this->KNTSession_StudeneNohyRuce +
             $this->KNTSession_Uzkostnost +
             $this->KNTSession_StudenePocasi +
             (1 - $this->KNTSession_CinnostiRychlost/10)+
             (1-$this->KNTSession_Povaha/10)+
             (1 - $this->KNTSession_Usinani/10)+
              $this->KNTSession_KuzeSucha +
              $this->KNTSession_Roztekanost +
             (1 - $this->KNTSession_EnergieNavaly/10)+
             $this->KNTSession_Vzrusivost +
             (1 - $this->KNTSession_NepravidelnyRezim/10)+
                     (1-$this->KNTSession_ZapominaniAsDefValue)*0.5;
              //(1 - $this->KNTSession_Uceni/10)*0.5 + $this->KNTSession_ZapominaniAsDefValue*0.5  ;

        return  $b;






    }


    public function getKapha() {


        $b = ($this->KNTSession_CinnostiRychlost/10)+
              ($this->KNTSession_VahuPribiram/10) +
             ($this->KNTSession_Povaha/10)+
             (1 - $this->KNTSession_NepravidelnyRezim/10)+
             $this->KNTSession_Prudusky +
             $this->KNTSession_PotrebaSpanku +
             ($this->KNTSession_Usinani/10)+
             ($this->KNTSession_Povaha/10)+
              //($this->KNTSession_Uceni/10)*0.5 + (1-$this->KNTSession_ZapominaniAsDefValue)*0.5  +
              0.5 + ($this->KNTSession_ZapominaniAsDefValue)*0.5  +
              ($this->KNTSession_VahuPribiram/10) +
              $this->KNTSession_StudenePocasi +
              $this->KNTSession_VlasyHuste +
              $this->KNTSession_KuzeMekka +
              $this->KNTSession_PodsaditostAsDefValue +
              (1 - $this->KNTSession_Laskavost/10)+
              $this->KNTSession_PomaluTravim      +
              ($this->KNTSession_EnergieNavaly/10)+
              ($this->KNTSession_Chuze/10)+
              (1-$this->KNTSession_Zaspavani/10) +
               ($this->KNTSession_CinnostiRychlost/10);

        return  $b;
    }


    public function getPitta() {
$b =    (1-$this->KNTSession_NarocneVykony/10) +
        $this->KNTSession_Perfekcionismus +
        (1-$this->KNTSession_Povaha/10) * 0.5 + ($this->KNTSession_Uminenost) * 0.5 +
        $this->KNTSession_HorkePocasi +
        $this->KNTSession_HorkePocasi +
        ($this->KNTSession_Nalada/10) +
        ($this->KNTSession_NepravidelnyRezim/10)+
        ($this->KNTSession_VlasyPles) +
        $this->KNTSession_HodneJi  +
        $this->KNTSession_Uminenost +
        ($this->KNTSession_Zacpa/10) +
        (1-$this->KNTSession_Povaha/10)+
        $this->KNTSession_Perfekcionismus +
        (1-$this->KNTSession_Povaha/10)+
         $this->KNTSession_StudenaJidla +
        (1-$this->KNTSession_Povaha/10)+
        $this->KNTSession_PalivaJidla+
        $this->KNTSession_Uminenost +
        ($this->KNTSession_NarocneVykony/10) +
        $this->KNTSession_Kriticnost;

     /*   $b = (1-$this->KNTSession_NarocneVykony/10) +
                (1 - $this->KNTSession_Laskavost/10) +
                ($this->KNTSession_Povaha/10) * 0.5 + ($this->KNTSession_Uminenost) * 0.5 +
                $this->KNTSession_HorkePocasi +
                $this->KNTSession_HorkePocasi +
                ($this->KNTSession_Nalada/10) +
                ($this->KNTSession_NepravidelnyRezim/10)+
                ($this->KNTSession_VlasyPles) +
                $this->KNTSession_HodneJi  +
                $this->KNTSession_Uminenost +
                ($this->KNTSession_Zacpa/10) +
                ($this->KNTSession_Povaha/10)+
                $this->KNTSession_Perfekcionismus +
                ($this->KNTSession_Povaha/10)+
                 $this->KNTSession_StudenaJidla +
                ($this->KNTSession_Povaha/10)+
                $this->KNTSession_PalivaJidla+
                $this->KNTSession_Uminenost +
                ($this->KNTSession_NarocneVykony/10) +
                $this->KNTSession_Kriticnost; */
        return $b;
    }










public function getAjurveda() { return $this->getAjurvedaText(); }

	public function getAjurvedaText() {

        $aj =  array( Prado::localize('váta') => $this->getVata(),
                      Prado::localize('kapha') => $this->getKapha(),
                      Prado::localize('pitta') => $this->getPitta()
                      );
        arsort($aj);
        $keys = array_keys($aj);
        return $keys[0];

    }


    public function getAjurvedaVaha() {

        $aj =  $this->getAjurvedaValues();
        $avg = array_sum($aj)/3;
        $overavg = floor(-(1-max($aj)/$avg)*100);

        return $overavg;
    }



    public function getAjurvedaValues() {
        return  array( $this->getVata(),
                      $this->getKapha(),
                      $this->getPitta()
                      );

    }
















    public function getKostiRecomended() {

//=KDYŽ(pohlavi=zena;KDYŽ(vaha<50;1,95;KDYŽ(vaha<75;2,4;2,95));KDYŽ(vaha<75;2,7;KDYŽ(vaha<99;3,3;3,7)))

        if (!$this->PohlaviMuz){
            
			if ($this->KNTSession_Hmotnost < 50) {
				return 1.95;
			} elseif ($this->KNTSession_Hmotnost < 75) {
				return 2.4;
			} else {
				return 2.95;	
			}
			
		} else {
			if ($this->KNTSession_Hmotnost < 75) {
				return 2.7;
			} elseif ($this->KNTSession_Hmotnost < 99) {
				return 3.3;
			} else {
				return 3.7;	
			}			
			
		}
			
    }








    public function getVisceralniTukMax() {
		return floor($this->Vek / 10);
	}


































}



































