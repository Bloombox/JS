
/**
 * Bloombox Telemetry Services: Ping
 *
 * @fileoverview Provides tools for interacting with the Telemetry ping methods.
 */

/*global goog */

goog.require('bloombox.logging.warn');

goog.require('bloombox.telemetry.Routine');

goog.require('bloombox.telemetry.enqueue');

goog.require('bloombox.telemetry.internals.statistics');
goog.require('bloombox.telemetry.internals.stats.recordPong');
goog.require('bloombox.telemetry.internals.stats.recordRPCError');
goog.require('bloombox.telemetry.internals.stats.recordRPCSuccess');

goog.require('bloombox.telemetry.rpc.TelemetryRPC');

goog.require('proto.services.telemetry.v1beta1.Ping.Request');
goog.require('proto.services.telemetry.v1beta1.Ping.Response');

goog.provide('bloombox.telemetry.ping');

/**
 * Send a `PING` message to the telemetry service to check connectivity and warm
 * the connection.
 *
 * @param {function(number)} callback Callback to dispatch once we receive the
 *        corresponding PONG.
 * @export
 */
bloombox.telemetry.ping = function(callback) {
  // make an RPC so we can send it via the pool
  let rpc = new bloombox.telemetry.rpc.TelemetryRPC(
    bloombox.telemetry.Routine.PING,
    'GET',
    'ping',
    bloombox.telemetry.onPingSuccess_(callback),
    bloombox.telemetry.onPingError_);
  bloombox.telemetry.enqueue(rpc);
};


/**
 * Handle a ping failure.
 *
 * @private
 */
bloombox.telemetry.onPingError_ = function() {
  bloombox.logging.warn('Telemetry ping failed.');
  bloombox.telemetry.internals.stats.recordRPCError();
};


/**
 * Handle a ping success.
 *
 * @param {function(number)} callback Callback to dispatch with the latency
 *        between the PING and the PONG.
 * @return {function()} Wrapped callback to dispatch.
 * @private
 */
bloombox.telemetry.onPingSuccess_ = function(callback) {
  bloombox.telemetry.internals.stats.recordRPCError();
  return respond;

  function respond() {
    // record the pong
    bloombox.telemetry.internals.stats.recordPong();
    let stats = bloombox.telemetry.internals.statistics();
    let latency = stats.lastPong - stats.lastPing;
    callback(latency);
  }
};
