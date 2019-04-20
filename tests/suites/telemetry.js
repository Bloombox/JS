/* eslint-env mocha */
'use strict';

function genTelemetryTestsuite(version) {
  const apiOpts = version === 'v0' ? {} : {'beta': true};

  describe('service: telemetry (' + version + ')', function() {
    describe('telemetry: analytics event ingest', function() {
      it('should be able to send a basic test event', function() {
        const collection = bloombox.telemetry.Collection
          .named('testsuite');

        bloombox.telemetry.events(apiOpts)
          .event(collection, {'test': 'data', 'goes': 'here'});
      });
    });
  });
}

function telemetryTestsuite() {
  genTelemetryTestsuite('v0');
  // genTelemetryTestsuite('v1');
}
