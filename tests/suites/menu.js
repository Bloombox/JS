/* eslint-env mocha */
'use strict';

function menuTestsuite() {
  describe('menu: product catalog data', function() {
    it('should be able to retrieve a full menu', function() {
      bloombox.menu.api().retrieve(function(menu, err) {
        if (err)
          throw new Error('unable to retrieve menu: ' + err.toString());
      }, bloombox.menu.RetrieveOptions.defaults());
    });

    it('should throw exceptions with accessible messages', function() {
      try {
        // noinspection ExceptionCaughtLocallyJS
        throw new bloombox.menu.RetrieveException('woops');
      } catch (e) {
        if (!e.message || e.message !== 'woops')
          throw new Error('no exception message where expected');
      }
    });
  });
}
