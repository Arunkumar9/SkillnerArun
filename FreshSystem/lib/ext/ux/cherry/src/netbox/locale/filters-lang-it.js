// $Id: filters-lang-it.js 2348 2013-12-20 10:20:54Z arun $
/*
 * Italian translation
 */

if(Ext.ux.netbox.ErrorDialog){
   Ext.ux.netbox.ErrorDialog.closeBtn="Chiudi";
   Ext.ux.netbox.ErrorDialog.errorTitle="Errore";
}

if(Ext.ux.netbox.core.DynamicFilterModelView){
   Ext.apply(Ext.ux.netbox.core.DynamicFilterModelView.prototype, {
      deleteText    : 'Elimina',
      filterText    : 'Campo',
      operatorText  : 'Operazione',
      valueText     : 'Valore',
      comboText     : 'Seleziona un campo'
   });
}

if(Ext.ux.netbox.PreferenceManagerView){
   Ext.apply(Ext.ux.netbox.PreferenceManagerView.prototype, {
      addText           : 'Aggiungi preferenza',
      addTooltipText    : 'Salva la attuale configurazione',
      manageText        : 'Gestisci preferenze',
      manageTooltipText : 'Gestisci le configurazioni salvate',
      okText            : 'OK',
      cancelText        : 'Annulla',
      modifyText        : 'Modifica preferenza',
      modifyBtnText     : 'Modifica',
      deleteBtnText     : 'Elimina',
      closeBtnText      : 'Chiudi',
      nameText          : 'Nome',
      descText          : 'Descrizione',
      defaultText       : 'Predefinita',
      loadingText       : 'Caricamento in corso...'
   });
}

if(Ext.ux.netbox.core.QuickFilterModelView){
   Ext.apply(Ext.ux.netbox.core.QuickFilterModelView.prototype, {
      quickFilterText : 'QuickFilter',
      removeText      : 'Rimuovi filtri',
      removeAllText   : 'Rimuovi tutti'
   });
}

if(Ext.ux.netbox.core.RangeItem){
   Ext.apply(Ext.ux.netbox.core.RangeItem.prototype, {
      fromText : 'da',
      toText   : 'a'
   });
}

if(Ext.ux.netbox.core.RangeField){
   Ext.apply(Ext.ux.netbox.core.RangeField.prototype, {
      fromText : 'da',
      toText   : 'a'
   });
}

if(Ext.ux.netbox.date.DateRangeOperator){
   Ext.apply(Ext.ux.netbox.date.DateRangeOperator.prototype, {
      fromText : 'da',
      toText   : 'a',
      includeText : 'compreso',
      bothFromAndToNotEmpty: "Sia 'da' che 'a' devono essere avvalorati",
      fromBiggerThanTo: "'da' è più grande di 'a'",
      fromNotADate: "Da non è una data valida",
      toNotADate: "A non è una data valida",
      toAndFromNotADate: "Sia 'da' che 'a' non sono date valide"
   });
}

if(Ext.ux.netbox.number.NumberRangeOperator){
   Ext.apply(Ext.ux.netbox.number.NumberRangeOperator.prototype, {
      fromText : 'da',
      toText   : 'a',
      includeText : 'compreso',
      bothFromAndToNotEmpty: "Sia 'da' che 'a' devono essere avvalorati",
      fromBiggerThanTo: "'Da' è più grande di 'a'",
      fromNotANumber: "Da non è un numero valido",
      toNotANumber: "A non è un numero valido",
      toAndFromNotANumber: "Sia 'Da' che 'A' non sono numeri validi"
   });
}

if(Ext.ux.netbox.date.DatePeriodOperator){
   Ext.apply(Ext.ux.netbox.date.DatePeriodOperator.prototype, {
      periodText  : "periodo",
      yearText    : "ultimo anno",
      monthText   : "ultimo mese",
      weekText    : "ultima settimana",
      dayText     : "ultimo giorno",
      hourText    : "ultima ora",
      quarterText : "ultimo quarto d'ora",
      valueNotExpected: "valore non previsto"
   });
}

if(Ext.ux.netbox.string.StringField){
   Ext.apply(Ext.ux.netbox.string.StringField.prototype, {
     stringEqualsLabel: "=",
     stringDifferentLabel: "!=",
     containsText: "contiene",
     doesntContainsText: "non contiene",
     startsWithText: "inizia con",
     endsWithText: "finisce con",
     stringListText: "lista",
     stringNotListText: "non in lista"
   });
}

if(Ext.ux.netbox.DefaultPreferenceManagerErrorManager){
  Ext.apply(Ext.ux.netbox.DefaultPreferenceManagerErrorManager.prototype, {
     failedToApplyDefaultPreferenceTitle: "Impossibile applicare la preferenza predefinita",
     failedToApplyPreferenceTitle: "Impossibile applicare la preferenza",
     failedToSavePreferenceTitle: "Impossibile salvare la preferenza",
     failedToDeletePreferenceTitle: "Impossibile eliminare le preferenze selezionate",
     failedToLoadPreferenceTitle: "Impossibile caricare le preferenze"
  });
}

if(Ext.ux.netbox.core.Field){
  Ext.apply(Ext.ux.netbox.core.Field, {
    emptyNotAllowed: "Valore vuoto non consentito"
  });
}
