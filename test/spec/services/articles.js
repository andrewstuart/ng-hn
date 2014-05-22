'use strict';

describe('Service: Articles', function () {

  // load the service's module
  beforeEach(module('tempApp'));

  // instantiate service
  var Articles, $httpBackend;
  beforeEach(inject(function ($injector) {

    Articles = $injector.get('Articles')
    $httpBackend = $injector.get('$httpBackend');

  }));

  it('should do something', function () {
    expect(!!Articles).toBe(true);
  });

});
