/* eslint-env mocha */
'use strict';

function genTelemetryTestsuite(version) {
  cachedEventsService = null;
  const apiOpts = {'cache': false};

  describe('service: telemetry (' + version + ')', function() {
    describe('method: `ping`', function() {
      it('should be able to complete a ping', function() {
        return new Promise((resolve, reject) => {
          return bloombox.telemetry.events(apiOpts).ping((latency) => {
            expect(latency).toBeGreaterThan(-1);
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

        const promise = bloombox.telemetry.events(apiOpts)
          .event(collection, {'test': 'data', 'goes': 'here'});
        expect(promise).not.toBeNull();
        return promise;
      });
    });
  });
}

function telemetryTestsuite() {
  genTelemetryTestsuite('v1beta4');
}
