/* eslint-env mocha */
'use strict';

var partnerCode = 'caliva';
var locationCode = 'sjc';
var apiKey = 'AIzaSyAEOsmEqQP5vX8aPvrlZH0f3AN7eGubL60';


bloombox.setup(partnerCode, locationCode, apiKey, function() {
  describe('sanity tests', function() {
    it('should pass a sensible math test', function() {
      if (1 + 1 !== 2)
        throw new Error('math doesn\'t seem to add up');
    });

    it('should be able to access the window', function() {
      if (!window)
        throw new Error('no window variable');
    });
  });

  describe('compiled library: debug build', function() {
      basicTestsuite();
      //shopTestsuite();
    });
});
