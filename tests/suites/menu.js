/* eslint-env mocha */
'use strict';

function menuTestsuite() {
  describe('menu API: product catalog data', function() {
    it('should be able to retrieve a full menu', function() {
      bloombox.menu.retrieve(function(menu, err) {
        if (err)
          throw new Error('unable to retrieve menu: ' + err.toString());
      });
    });

    it('should throw exceptions with accessible messages', function() {
      try {
        // noinspection ExceptionCaughtLocallyJS
        throw new bloombox.menu.MenuRetrieveException('woops');
      } catch (e) {
        if (!e.getMessage() || e.getMessage() !== 'woops')
          throw new Error('no exception message where expected');
      }
    });
  });
}
