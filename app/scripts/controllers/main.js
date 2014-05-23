'use strict';

angular.module('tempApp')
  .controller('MainCtrl', ['$scope', '$http', '$indexedDB', function ($scope, $http, $indexedDB) {
    var stories = $indexedDB.objectStore('stories');
    var next;

    $http.get("http://astuart.co:8000").success(function(data) {
      $scope.stories = data.articles;
      next = data.next;
      return stories.upsert(data.articles);
    });

    $scope.lengthOptions = [10, 20, 30, 40, 50];

    $scope.numStories = 20;

    $scope.c = {page: 0}

    $scope.filter = true;

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

          while (next[0] === '/') {
            next = next.substring(1);
          }
        });
      }
    };
  }]);
