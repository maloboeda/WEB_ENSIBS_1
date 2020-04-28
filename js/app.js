var app = angular.module("rennesData", ['ngRoute']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider
    .when('/', {
      controller :'controler'
    })
    .otherwise({
        redirectTo: '/'
    });
  }

]);
