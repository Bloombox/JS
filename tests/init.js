/* eslint-env mocha */
'use strict';

goog.require('bloombox.setup');

var partnerCode = 'caliva';
var locationCode = 'sjc';
var apiKey = 'AIzaSyAEOsmEqQP5vX8aPvrlZH0f3AN7eGubL60';


function runTestsuite(name) {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    describe('library: ' + name, function() {
      basicTestsuite();
      shopTestsuite();
    });
  });
}
