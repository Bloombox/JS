/* eslint-env mocha */
'use strict';

function basicTestsuite() {
  describe('basics', function() {
    it('should be able to find the Bloombox SDK for JavaScript', function() {
      if (!bloombox) {
        throw new Error('failed to find the SDK');
      }
    });

    it('should be able to find the SDK setup function', function() {
      if (!bloombox.setup)
        throw new Error('failed to find the SDK setup function');
    });
  });
}
