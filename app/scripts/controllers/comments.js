'use strict';

angular.module('tempApp')
  .controller('CommentsCtrl', ['$scope', '$routeParams', '$http', '$indexedDB', function ($scope, $routeParams, $http, $indexedDB) {
    var stories = $indexedDB.objectStore('stories');


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
