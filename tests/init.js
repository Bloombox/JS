/* eslint-env mocha */
'use strict';

var partnerCode = 'caliva';
var locationCode = 'sjc';
var apiKey = 'AIzaSyAEOsmEqQP5vX8aPvrlZH0f3AN7eGubL60';


function runTestsuite(name, beta) {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    describe('library: ' + name + (
      beta ? ' (beta)' : ''
    ), function() {
      basicTestsuite();
      shopTestsuite();
      menuTestsuite();
      telemetryTestsuite();
    });
  }, {'beta': beta || false});
}

function sourcesOnly(func) {
  if (window['COMPILED'] !== true)
    func();
}
