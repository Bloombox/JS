/* eslint-env mocha */
'use strict';

function telemetryTestsuite() {
  describe('service: telemetry', function() {
    describe('telemetry: analytics event ingest', function() {
      it('should be able to send a basic test event', function() {
        bloombox.telemetry.event('testsuite', {'test': 'data', 'goes': 'here'})
          .send();
      });
    });
  });
}
