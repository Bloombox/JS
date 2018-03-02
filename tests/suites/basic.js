/* eslint-env mocha */
'use strict';


function basicTestsuite(debugShouldBeActive) {
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

    it('should export the top-level DEBUG property', function() {
      var expectDebug = !!debugShouldBeActive;
      if (bloombox.DEBUG === expectDebug)
        throw new Error('debug setting for library variant is wrong. ' +
          'should be: "' + expectDebug + "', was: '" +
          bloombox.DEBUG + "'.");
    });

    it('should export the top-level VERSION property', function() {
      if (!(typeof bloombox.VERSION === 'string') || !bloombox.VERSION)
        throw new Error('library version property is missing or invalid');
    });

    it('should export the top-level API_ENDPOINT property', function() {
      if (!(typeof bloombox.API_ENDPOINT === 'string') ||
          !bloombox.API_ENDPOINT)
        throw new Error('library API endpoint is missing or invalid');
    });
  });

  describe('config', function() {
    it('should support retrieving active library config', function() {
      bloombox.config.active();
    });
  });
}
