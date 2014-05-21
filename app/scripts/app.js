'use strict';

angular
  .module('tempApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).filter('startFrom', function() {
    return function(input, start) {
      input = input || [];
      start = +start; //parse to int
      return input.slice(start);
    };
  });
