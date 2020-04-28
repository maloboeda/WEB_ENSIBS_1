var rennesData = angular.module("rennesData", []);

rennesData.controller("controleur", ['$scope',
    function($scope) {

      var requestURL = "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=resultats_c11";

      var request = new XMLHttpRequest();

      request.open('GET', requestURL);
      request.send();

      request.onload = function() {
        var data = request.response;
        $scope.dataPrint = loadData(JSON.parse(data));

        function loadData(data){
          dataTab = [];
          for (i = 0; i < data.records.length; i++){
            dataTab.push({ nom_circonscription : data.records[i].fields.nom_circonscription });
          }
          console.log(dataTab);
          return dataTab;
        }

        console.log($scope.dataPrint);
      };
      
      console.log($scope.dataPrint);


    }
]);
