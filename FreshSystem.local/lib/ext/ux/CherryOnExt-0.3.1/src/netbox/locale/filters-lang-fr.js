/**
 * CherryOnExt fr locale.
 */
if(Ext.ux.netbox.core.DynamicFilterModelView){
  Ext.apply(Ext.ux.netbox.core.DynamicFilterModelView.prototype, {
     deleteText        : 'Supprimer',
     filterText        : 'Champ',
     operatorText      : 'Opérateur',
     valueText         : 'Valeur',
     comboText         : 'Séléctionner un champ',
     logicOpeAndText   : 'Tout vérifier',
     logicOpeOrText    : 'Vérifier au moins un'
  });
}
if(Ext.ux.netbox.PreferenceManagerView){
  Ext.apply(Ext.ux.netbox.PreferenceManagerView.prototype, {
     addText           : 'Ajouter un préférence',
     addTooltipText    : 'Sauver la configuration courante',
     manageText        : 'Gérer les préférences',
     manageTooltipText : 'Gérer les configurations sauvées',
     okText            : 'OK',
     cancelText        : 'Anuller',
     modifyText        : 'Modifier la préférence',
     modifyBtnText     : 'Modifier',
     deleteBtnText     : 'Supprimer',
     closeBtnText      : 'Fermer',
     nameText          : 'Nom',
     descText          : 'Description',
     defaultText       : 'Par défault',
     loadingText       : 'Chargement en cours...'
  });
}

if(Ext.ux.netbox.core.QuickFilterModelView){
  Ext.apply(Ext.ux.netbox.core.QuickFilterModelView.prototype, {
     quickFilterText : 'Filtre rapide',
     removeText      : 'Supprimer le filtre',
     removeAllText   : 'Supprimer tous les filtres'
  });
}

if(Ext.ux.netbox.core.RangeItem){
  Ext.apply(Ext.ux.netbox.core.RangeItem.prototype, {
     fromText : 'de',
     toText   : 'à'
  });
}

if(Ext.ux.netbox.core.RangeField){
  Ext.apply(Ext.ux.netbox.core.RangeField.prototype, {
     fromText : 'de',
     toText   : 'à'
  });
}

if(Ext.ux.netbox.date.DateRangeOperator){
  Ext.apply(Ext.ux.netbox.date.DateRangeOperator.prototype, {
     fromText : 'du',
     toText   : 'au',
     includeText : 'compris entre',
     bothFromAndToNotEmpty: "Les deux valeurs 'du' et 'au' doivent être renseignées",
     fromBiggerThanTo: "'du' est plus grand que 'au'",
     fromNotADate: "'du' n\'est pas une date valide",
     toNotADate: "'au' n\'est pas une date valide",
     toAndFromNotADate: "'du' et 'au' ne sont pas des dates valides"
  });
}

if(Ext.ux.netbox.number.NumberRangeOperator){
  Ext.apply(Ext.ux.netbox.number.NumberRangeOperator.prototype, {
     fromText : 'de',
     toText   : 'à',
     includeText : 'compris entre',
     bothFromAndToNotEmpty: "Les deux valeurs 'de' et 'à' doivent être renseignées",
     fromBiggerThanTo: "'de' est plus grand que 'au'",
     fromNotANumber: "Da non è un numero valido",
     toNotANumber: "'à' n\'est pas une date valide",
     toAndFromNotANumber: "'de' et 'à' ne sont pas des dates valides"
  });
}

if(Ext.ux.netbox.date.DatePeriodOperator){
  Ext.apply(Ext.ux.netbox.date.DatePeriodOperator.prototype, {
     periodText  : "période",
     yearText    : "l\'année dernière",
     monthText   : "le mois dernier",
     weekText    : "la semainne dernière",
     dayText     : "hier",
     hourText    : "cette dernière heure",
     quarterText : "ce dernier quart-d\'heure",
     valueNotExpected: "Valeur non reconnue"
  });
}

if(Ext.ux.netbox.core.Field){
 Ext.apply(Ext.ux.netbox.core.Field, {
   emptyNotAllowed: "Valeur vide non authorisée"
 });
}

if(Ext.ux.netbox.string.StringField){
  Ext.apply(Ext.ux.netbox.string.StringField.prototype, {
    stringEqualsLabel: "=",
    stringDifferentLabel: "!=",
    containsText: "contient",
    doesntContainsText: "ne contient pas",
    startsWithText: "commence par",
    endsWithText: "fini par",
    stringListText: "dans",
    stringNotListText: "n\'est pas dans",
    emptyNotAllowed: "Valeur vide non authorisée"
  });
}

if(Ext.ux.netbox.DefaultPreferenceManagerErrorManager){

Ext.apply(Ext.ux.netbox.DefaultPreferenceManagerErrorManager.prototype,
{
    failedToApplyDefaultPreferenceTitle: "Erreur : impossible d\'appliquer la préférence par défaut",
    failedToApplyPreferenceTitle: "Erreur : impossible d\'appliquer la préférence",
    failedToSavePreferenceTitle: "Erreur : impossible de sauver la préférence",
    failedToDeletePreferenceTitle: "Erreur : impossible de supprimer la préférence sélectionnée",
    failedToLoadPreferenceTitle: "Erreur : impossibile de charger les préférences"
 });
}
