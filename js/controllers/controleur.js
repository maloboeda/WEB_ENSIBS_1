/** Controleur de notre appli WEB - BOËDA Malo & SOMMER Clément **/

var rennesData = angular.module("rennesData", ["chart.js"]);

/**
* Controleur de notre application web qui contient toutes les fonctions importantes à son fonctionnement
**/
rennesData.controller("controleur", ['$scope',
    function($scope) {
      /** Initialisation des nos principales variables utilisées pour notre application **/
      $scope.dataPrint = [];
      $scope.dataLieu = [];
      $scope.circonscriptions = [];
      $scope.candidats = [];
      $scope.lieux = [];
      $scope.visible1 = true; // Si cette variable est vrai, notre section/div ne sera pas visible
      $scope.visible2 = true; // Si cette variable est vrai, notre section/div ne sera pas visible
      $scope.labels = [];
      $scope.data = [];
      $scope.options = [ '#803690', '#00ADF9'];
      $scope.data;

      /** Chargement et ouverture de l'URL de notre API (élections cantonales de Rennes en 2011) **/
      var requestURL = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=resultats_c11";

      var request = new XMLHttpRequest();

      request.open('GET', requestURL);
      request.send();

      /** On parse notre url au chargement de l'API **/
      request.onload = function() {
        var data = request.response;
        $scope.data = JSON.parse(data);
        loadData();
      }

      /** Fonction qui va charger toutes les données de notre API et mettre à jour les circonscriptions **/
      function loadData(){
        for (i = 0; i < $scope.data.records.length; i++){
          $scope.dataPrint.push($scope.data.records[i].fields);
        }
        loadCirconsciption();
      }

      /** Fonction loadLieu qui chargera toutes les informations du lieu passé en paramètre **/
      $scope.loadLieu = function (lieu){
        for (i = 0; i < $scope.dataPrint.length; i++){
          if($scope.dataPrint[i].nom_lieu == lieu){
            $scope.dataLieu = $scope.dataPrint[i];
          }
        }
        /** On charge ensuite les données des candidats pour chaque lieu ajouté dans dataLieu **/
        loadCandidats();
      };

      /** Fonction loadCirconsciption qui chargera tous les noms des circonscriptions présent dans le JSON de base **/
      function loadCirconsciption(){
        let test = false; //variable pour checker si notre circonscription est déjà chargée
        /** On boucle sur toutes nos données **/
        for (i = 0; i < $scope.dataPrint.length; i++){
          /** Boucle qui regarde si une circonscription a déjà été chargée (test = true si oui) **/
          for(j = 0; j < $scope.circonscriptions.length; j++){
            if($scope.dataPrint[i].nom_circonscription == $scope.circonscriptions[j]){
              test = true;
              break;
            }
          }
          /** On ajoute notre circonscription uniquement si elle n'est pas déjà présente dans le tableau des circonscriptions **/
          if(!test){
            $scope.circonscriptions.push($scope.dataPrint[i].nom_circonscription);
          }
          test = false; // On remet à faux pour le prochain tour de boucle
        }
        $scope.circonscriptions.sort();
      }

      /** Fonction loadVille qui charge tous les lieux d'une circonscription dans le tableau des lieux **/
      $scope.loadVille = function (nom){
        $scope.visible1 = false; // On rend notre section/div visible (car on lui retire la ng-class "ok")
        $scope.visible2 = true; // On rend notre section/div non visible (car on lui remet la ng-class "ok")
        // Remise à 0 de tous les attributs d'un lieu afin de ne pas avoir de doublon
        $scope.lieux = [];
        $scope.candidats = [];
        $scope.labels = [];
        $scope.data = [];
        let test = false; //variable pour checker si notre lieu est déjà chargé
        /** On boucle sur toutes nos données **/
        for (i = 0; i < $scope.dataPrint.length; i++){
          /** Boucle qui regarde si un lieu a déjà été chargé (test = true si oui) **/
          for(j = 0; j < $scope.lieux.length; j++){
            if($scope.dataPrint[i].nom_lieu == $scope.lieux[j]){
              test = true;
              break;
            }
          }
          /** On ajoute notre nom de lieu uniquement si elle n'est pas déjà présente dans le tableau des circonscriptions **/
          if($scope.dataPrint[i].nom_circonscription == nom && !test){
            $scope.lieux.push($scope.dataPrint[i].nom_lieu);
          }
          // On remet à faux pour le prochain tour de boucle
          test = false;
        }
      }

      /** Fonction loadCandidats qui charge tous les informations d'un candidat d'une circonscription dans le tableau des candidats **/
      function loadCandidats(){
        // Remise à 0 de tous les attributs d'un lieu afin de ne pas avoir de doublon
        $scope.candidats = [];
        $scope.labels = [];
        $scope.data = [];
        $scope.visible2 = false; // On rend notre section/div non visible (car on lui remet la ng-class "ok")
        regex1 = /candidat_\d/gm ; // Utilisation d'une REGEX afin de détecter le patern 'candidat_' afin de récupérer tous les candidats d'un lieu
        let cand, nbvoix, pourcentage, indice; // création des variables locales à cette fonction
        /** On boucle dans les tous les lieux de notre circonscription **/
        for(const obj in $scope.dataLieu){
          /** Test pour voir si notre info est bien un candidat **/
          if(obj == obj.match(regex1)){
            cand = obj; // attribution du nom de candidat
            indice = obj[obj.length-1]; // Récupération de l'indice du candidat
            /** On boucle dans les tous les lieux de notre circonscription **/
            for(const obj in $scope.dataLieu){
              /** si notre ligne est le nombre de voix pour notre candidat actuel (valeur de l'indice) **/
              if(obj == 'nb_voix_' + indice){
                nbvoix = obj; // on attribut le nombre de voix du candidat
              }
              /** si notre ligne est le pourcentage pour notre candidat actuel (valeur de l'indice) **/
              if(obj == 'pourcentage_' + indice){
                pourcentage = obj; // on attribut le pourcentage de voix du candidat
              }
            }
            $scope.candidats.push([cand,pourcentage,nbvoix]); // on ajoute à notre tableau un triplet candidat, pourcentage et nbvoix d'un candidat
            $scope.labels.push($scope.dataLieu[cand]); // labels pour notre graphque (nom de candidat)
            $scope.data.push($scope.dataLieu[nbvoix]); // data pour notre graphque (nombre de voix pour le candidat)
          }
        }
        $scope.candidats.sort();
      }
    }
]);
