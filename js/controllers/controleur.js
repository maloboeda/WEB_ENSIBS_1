var rennesData = angular.module("rennesData", []);

rennesData.controller("controleur", ['$scope',
    function($scope) {
      $scope.dataPrint = [];

      var requestURL = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=resultats_c11";

      var request = new XMLHttpRequest();

      request.open('GET', requestURL);
      request.send();

      request.onload = function() {
        var data = request.response;
        loadData(JSON.parse(data));

      };

      function loadData(data){
        for (i = 0; i < data.records.length; i++){
          $scope.dataPrint.push(data.records[i].fields);
        }
      }
    }

]);
