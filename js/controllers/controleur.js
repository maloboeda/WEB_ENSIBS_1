var rennesData = angular.module("rennesData", []);


rennesData.controller("controleur", ['$scope',
    function($scope) {
      $scope.dataPrint = [];
      $scope.dataLieu = [];
      $scope.circonscriptions = [];
      $scope.candidats = [];
      $scope.lieux = [];

      var requestURL = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=resultats_c11";

      var request = new XMLHttpRequest();

      request.open('GET', requestURL);
      request.send();

      request.onload = function() {
        var data = request.response;
        loadData(JSON.parse(data));
      }

      $scope.loadLieu= function (lieu){
        for (i = 0; i < $scope.dataPrint.length; i++){
          if($scope.dataPrint[i].nom_lieu == lieu){
            $scope.dataLieu = $scope.dataPrint[i];
          }
        }
        loadCandidats();
      };

      function loadData(data){
        for (i = 0; i < data.records.length; i++){
          $scope.dataPrint.push(data.records[i].fields);
        }
        loadCirconsciption();
      }

      function loadCirconsciption(){
        let test = false;
        for (i = 0; i < $scope.dataPrint.length; i++){
          for(j = 0; j < $scope.circonscriptions.length; j++){
            if($scope.dataPrint[i].nom_circonscription == $scope.circonscriptions[j]){
              test = true;
              break;
            }
          }
          if(!test){
            $scope.circonscriptions.push($scope.dataPrint[i].nom_circonscription);
          }
          test = false;
        }
      }

      $scope.loadVille = function (nom){
        $scope.lieux = [];
        $scope.candidats = [];
        let test = false;
        for (i = 0; i < $scope.dataPrint.length; i++){
          for(j = 0; j < $scope.lieux.length; j++){
            if($scope.dataPrint[i].nom_lieu == $scope.lieux[j]){
              test = true;
              break;
            }
          }
          if($scope.dataPrint[i].nom_circonscription == nom && !test){
            $scope.lieux.push($scope.dataPrint[i].nom_lieu);
          }
          test = false;
        }
        console.log($scope.lieux);
      }

      function loadCandidats(){
        $scope.candidats = [];
        regex1 = /candidat_\d/gm ;
        let cand, nbvoix, pourcentage,indice;
        for(const obj in $scope.dataLieu){
          if(obj == obj.match(regex1)){
            cand = obj;
            indice = obj[obj.length-1];
            for(const obj in $scope.dataLieu){
              if(obj == 'nb_voix_' + indice){
                nbvoix = obj;
              }
              if(obj == 'pourcentage_' + indice){
                pourcentage = obj;
              }
            }
            $scope.candidats.push([cand,pourcentage,nbvoix]);
          }
        }
        $scope.candidats.sort();
      }
    }
]);
