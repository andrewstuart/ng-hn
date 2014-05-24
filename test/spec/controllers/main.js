'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('tempApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });

  ddescribe('page func', function() {
    it('should change the page by passed num', function() {
      var a = scope.startFrom;
      scope.page(20)
      expect(scope.startFrom).toEqual(a + 20);
    });
  });
});
