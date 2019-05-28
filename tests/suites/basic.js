/* eslint-env mocha */
'use strict';


function basicTestsuite() {
  describe('basics', function() {
    describe('config', function() {
      it('should be able to find the Bloombox SDK for JavaScript', function() {
        expect(bloombox).not.toBeNull();
      });

      it('should be able to find the SDK setup function', function() {
        expect(bloombox.setup).not.toBeNull();
      });

      it('should export the top-level VERSION property', function() {
        expect(bloombox.VERSION).not.toBeNull();
      });

      it('should export the top-level API_ENDPOINT property', function() {
        expect(bloombox.API_ENDPOINT).not.toBeNull();
      });

      it('should support retrieving active library config', function() {
        expect(bloombox.config.active()).not.toBeNull();
      });
    });

    describe('logging', function() {
      it('should support info() logging', function() {
        bloombox.logging.info('Hello Info Test');
        expect(bloombox.logging.info).not.toBeNull();
      });

      it('should support warn() logging', function() {
        bloombox.logging.warn('this is a sample warning');
        expect(bloombox.logging.warn).not.toBeNull();
      });

      it('should support error() logging', function() {
        bloombox.logging.error('this is a sample error log');
        expect(bloombox.logging.error).not.toBeNull();
      });
    });
  });
}
