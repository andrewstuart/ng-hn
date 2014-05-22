'use strict';

angular.module('tempApp')
  .directive('comments', ['RecursionHelper', function (RecursionHelper) {
    return {
      template: '<div class="comment" ng-repeat="comment in src">' +
            '<span class="user">{{comment.user}}</span>: ' +
            '<span class="comment-text">{{comment.text}}</span>' +
            '<comments ng-if="comment.comments.length" src="comment.comments"></comments>' +
          '</div>',
      restrict: 'E',
      scope: {
        src: '='
      },
      compile: function(tEle) {
        return RecursionHelper.compile(tEle);
      }
    };
  }]);
