'use strict';

angular.module('tempApp')
  .controller('CommentsCtrl', ['$scope', '$routeParams', '$http', '$indexedDB', '$sce', '$rootScope', function ($scope, $routeParams, $http, $indexedDB, $sce, $rootScope) {
    var stories = $indexedDB.objectStore('stories');

    $scope.showArticle = function() {
      $rootScope.currentUrl = $sce.trustAsResourceUrl($scope.article.url);
      $rootScope.currentTitle = $scope.article.title;
    };

    stories.find(+$routeParams.commentId).then(function(story) {
      if(story && story.comments) {
        $scope.article = story;
      } else {
        $http.get('//astuart.co:8000/comments/' + $routeParams.commentId).success(function(data) {
          $scope.article = data;
          stories.upsert(data);
        });
      }
    });


  }]);
