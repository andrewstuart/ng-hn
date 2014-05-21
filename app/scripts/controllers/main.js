'use strict';

angular.module('tempApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http.get("http://localhost:8000").success(function(data) {
      $scope.stories = data.articles;
    });
  }]);
