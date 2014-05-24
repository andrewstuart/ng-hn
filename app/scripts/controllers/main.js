'use strict';

angular.module('tempApp')
  .controller('MainCtrl', ['$scope', '$http', '$indexedDB', '$sce', '$rootScope', '$location', '$routeParams', function ($scope, $http, $indexedDB, $sce, $rootScope, $location, $routeParams) {
    var stories = $indexedDB.objectStore('stories');

    $scope.lengthOptions = [10, 20, 30, 40, 50];

    $scope.startFrom = +$location.search().startFrom || 0;
    $scope.numStories = +$location.search().limitTo || 20;

    $scope.stories = [];

    $scope.showFilter = true;


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
        var limit = $location.search().limitTo;
        if (limit) {
          $scope.numStories = +limit || 20;
        }

        if($location.search().startFrom) {
          $scope.startFrom = +$location.search().startFrom || 0;
        } else {
          $scope.startFrom = 0;
        }

        if($location.search().id) {
          stories.find($location.search().id).then(function(story) {
            if(story) {
              $rootScope.currentUrl = $sce.trustAsResourceUrl(story.url);
              $rootScope.currentTitle = story.title;
            }
          });
        } else {
          $rootScope.currentUrl = null;
          $rootScope.currentTitle = null;
        }
      });

      $rootScope.$watch('currentUrl', function(url) {
        if(!url) {
          $location.search('id', null);
        }
      });

      $scope.$watch('startFrom', function(num) {
        if(num) {
          $location.search('startFrom', num);
        } else {
          $location.search('startFrom', null);
        }

      });

      $scope.$watch('numStories', function(num) {
        if(num !== 20) {
          $location.search('limitTo', num);
        } else {
          $location.search('limitTo', null);
        }
      });
    });

    $scope.setStory = function(story) {
      $location.search('id', story.id);
    };

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
