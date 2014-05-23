'use strict';

angular.module('tempApp')
  .directive('paginator', function () {
    return {
      templateUrl: '/views/partials/paginator.html',
      restrict: 'E',
      replace: true
    };
  });
