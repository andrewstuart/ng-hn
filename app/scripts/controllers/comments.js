'use strict';

angular.module('tempApp')
  .controller('CommentsCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
    $http.get('//localhost:8000/comments/' + $routeParams.commentId).success(function(data) {
      $scope.article = data;
    });
  }]);
