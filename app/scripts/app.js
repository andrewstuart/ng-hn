'use strict';

angular
.module('tempApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'xc.indexedDB',
    'ngRoute'
  ])
  .config(['$indexedDBProvider', function($indexedDBProvider) {
    $indexedDBProvider.onTransactionComplete = undefined;
    $indexedDBProvider
      .connection('hackernews')
      .upgradeDatabase(3, function(e, db) {
        var stories = db.createObjectStore('stories', {keyPath: 'id'});
      });
  }])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/comments/:commentId', {
        templateUrl: 'views/comments.html',
        controller: 'CommentsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]).filter('startFrom', function() {
    return function(input, start) {
      input = input || [];
      start = +start; //parse to int
      return input.slice(start);
    };
  });
