/* eslint-env mocha */
'use strict';

const partnerCode = 'caliva';
const locationCode = 'sjc';
const apiKey = 'AIzaSyAEOsmEqQP5vX8aPvrlZH0f3AN7eGubL60';


function runTestsuite(name) {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    describe('library: ' + name, function() {
      basicTestsuite();
      utilTestsuite();
      rpcTestsuite();
      shopTestsuite();
      menuTestsuite();
      telemetryTestsuite();
    });
  });
}

function sourcesOnly(func) {
  if (window['COMPILED'] !== true)
    func();
}
