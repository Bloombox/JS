/* eslint-env mocha */
'use strict';

goog.require('bloombox.API_ENDPOINT');
goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');
goog.require('bloombox.config.active');
goog.require('bloombox.config.buildDefault');
goog.require('bloombox.setup');

var partnerCode = 'caliva';
var locationCode = 'sjc';
var apiKey = 'AIzaSyAEOsmEqQP5vX8aPvrlZH0f3AN7eGubL60';


function runTestsuite(name) {
  bloombox.setup(partnerCode, locationCode, apiKey, function() {
    describe('library: ' + name, function() {
      basicTestsuite(name !== 'release');
      shopTestsuite();
    });
  });
}

function sourcesOnly(func) {
  if (window['COMPILED'] !== true)
    func();
}
