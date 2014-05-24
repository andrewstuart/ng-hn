'use strict';

angular.module('tempApp')
  .controller('MainCtrl', ['$scope', '$http', '$indexedDB', '$sce', '$rootScope', '$location', function ($scope, $http, $indexedDB, $sce, $rootScope, $location) {
    var stories = $indexedDB.objectStore('stories');
    var next;

    $scope.setStory = function(story) {
      $rootScope.currentUrl = $sce.trustAsResourceUrl(story.url);
      $rootScope.currentTitle = story.title;
    };

    $http.get("http://astuart.co:8000").success(function(data) {
      $scope.stories = data.articles;
      next = data.next;
      return stories.upsert(data.articles);
    }).error(function(reason) {
      console.warn(reason);
      stories.getAll().then(function(articles) {
        $scope.stories = articles;
      });
    });

    $scope.lengthOptions = [10, 20, 30, 40, 50];

    $scope.startFrom = 0;
    $scope.numStories = 20;

    $scope.showFilter = true;

    $scope.page = function(num) {
      var end = $scope.stories.length;
      var newStart = $scope.startFrom + num;
    };

    $scope.sortables = [{
      field: 'position',
      name: 'Original'
    },{
      field: 'points',
      name: 'Score'
    },{
      field: 'numComments',
      name: 'Comments'
    },{
      field: 'id',
      name: 'ID'
    },{
      field: 'title',
      name: 'Title'
    },{
      field: 'user',
      name: 'User'
    }];

    $scope.$on('$routeUpdate', function() {
      $scope.numStories = $location.search().limitTo || 20;
    });

    $scope.$watch('numStories', function(num) {
      if(num !== 20) {
        $location.search('limitTo', num);
      } else {
        $location.search('limitTo', null);
      }
    });

    $scope.sortField = 'position';

  }]);
