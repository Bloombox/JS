/* eslint-env mocha */
'use strict';

function genTelemetryTestsuite(version) {
  const apiOpts = version === 'v0' ? {} : {'beta': true};

  describe('service: telemetry (' + version + ')', function() {
    describe('method: `ping`', function() {
      it('should be able to complete a ping', function() {
        return new Promise((resolve, reject) => {
          return bloombox.telemetry.events(apiOpts).ping((latency) => {
              if (latency > -1) {
                resolve(latency);
              } else {
                reject(latency);
              }
            });
        });
      });
    });

    describe('method: `event`', function() {
      it('should be able to send a basic test event', function() {
        const collection = bloombox.telemetry.Collection
          .named('testsuite');

        return bloombox.telemetry.events(apiOpts)
          .event(collection, {'test': 'data', 'goes': 'here'});
      });
    });
  });
}

function telemetryTestsuite() {
  genTelemetryTestsuite('v0');
  genTelemetryTestsuite('v1beta4');
}
