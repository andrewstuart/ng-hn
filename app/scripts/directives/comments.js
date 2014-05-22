'use strict';

angular.module('tempApp')
  .directive('comments', ['RecursionHelper', function (RecursionHelper) {
    return {
      templateUrl: '/views/partials/comment.html',
      restrict: 'E',
      scope: {
        src: '='
      },
      compile: function(tEle) {
        return RecursionHelper.compile(tEle);
      }
    };
  }]);
