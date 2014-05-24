'use strict';

angular.module('tempApp')
  .controller('MainCtrl', ['$scope', '$http', '$indexedDB', '$location', function ($scope, $http, $indexedDB, $location) {
    var stories = $indexedDB.objectStore('stories');
    var next;

    var dateStored = localStorage.getItem('lastPolled');
    var lastPolled = dateStored ? new Date(dateStored) : new Date(0);

    // if(lastPolled && new Date() - lastPolled < 120000) {
    //   stories.getAll().then(function(articles) {
    //     $scope.stories = articles;
    //   });
    // } else {
    //   stories.clear();
      $http.get("http://astuart.co:8000").success(function(data) {
        lastPolled = new Date();

        localStorage.setItem('lastPolled', lastPolled.toString());

        $scope.stories = data.articles;
        next = data.next;
        return stories.upsert(data.articles);
      });
    // }

    $scope.lengthOptions = [10, 20, 30, 40, 50];

    $scope.numStories = 20;

    $scope.c = {page: 0};

    $scope.showFilter = true;

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

    $scope.page = function(num) {
      var newPage = $scope.c.page + num;

      var tooFar = newPage * $scope.numStories >= $scope.stories.length + $scope.numStories;

      if(newPage >= 0 && !tooFar) {
        $scope.c.page = newPage;
      }

      if((newPage + 1) * $scope.numStories >= $scope.stories.length) {
        $http.get("http://astuart.co:8000/next/" + next).success(function(data) {
          $scope.stories = data.articles;
          next = data.next;

          stories.upsert(data.articles);

          while (next[0] === '/') {
            next = next.substring(1);
          }
        });
      }
    };
  }]);
