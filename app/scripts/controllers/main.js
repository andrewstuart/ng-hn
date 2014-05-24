'use strict';

angular.module('tempApp')
  .controller('MainCtrl', ['$scope', '$http', '$indexedDB', '$sce', '$rootScope', '$location', function ($scope, $http, $indexedDB, $sce, $rootScope, $location) {
    var stories = $indexedDB.objectStore('stories');

    $scope.lengthOptions = [10, 20, 30, 40, 50];

    $scope.startFrom = +$location.search().startFrom || 0;
    $scope.numStories = +$location.search().limitTo || 20;

    $scope.stories = [];

    $scope.showFilter = true;


    $scope.setStory = function(story) {
      $rootScope.currentUrl = $sce.trustAsResourceUrl(story.url);
      $rootScope.currentTitle = story.title;
    };

    var next = '/page';

    function getStories() {
      //WHY DOES THIS NOT WORK AS A PLAIN RETURN ANGULAR?!?
      return $http.get("http://astuart.co:8000" + next)
      .then(function success(res) {
        $scope.stories = res.data.articles;
        next = '/next/' + res.data.next;
        return stories.upsert(res.data.articles);
      }, function err(res) {
        console.warn(res.data);
      });
    }

    //Init
    stories.getAll().then(function withDb(articles) {
      $scope.stories = articles || [];
    }).finally(getStories).finally(function(){

      //Finally, start watching for route changes and what not
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
    });

    function getPagesAhead (numPages) {
      numPages = numPages || 1;

      if ($scope.startFrom + (numPages + 1) * $scope.numStories > $scope.stories.length) {
        return getStories().then(function() {
          getPagesAhead();
        });
      }
    }

    $scope.page = function(num) {
      //Cast to number then keep > 0
      num = Number.isNaN(+num) ? 20 : +num;

      //Change the page
      $scope.startFrom += num;
      if($scope.startFrom < 0) {
        $scope.startFrom = 0;
      }

      //Make sure we have enough stories for the next page
      return getPagesAhead();
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

    $scope.sortField = 'position';

  }]);
