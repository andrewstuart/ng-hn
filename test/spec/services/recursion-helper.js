'use strict';

describe('Service: RecursionHelper', function () {

  // load the service's module
  beforeEach(module('tempApp'));

  // instantiate service
  var RecursionHelper;
  beforeEach(inject(function (_RecursionHelper_) {
    RecursionHelper = _RecursionHelper_;
  }));

  it('should do something', function () {
    expect(!!RecursionHelper).toBe(true);
  });

});
