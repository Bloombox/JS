
/**
 * Bloombox Telemetry: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Telemetry API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.telemetry.DEBUG');
goog.require('bloombox.telemetry.InternalCollection');
goog.require('bloombox.telemetry.TELEMETRY_API_ENDPOINT');
goog.require('bloombox.telemetry.VERSION');

goog.provide('bloombox.telemetry.boot');
goog.require('bloombox.telemetry.didOptOut');
goog.provide('bloombox.telemetry.sendInitialEvents');
goog.provide('bloombox.telemetry.setup');

goog.require('bloombox.telemetry.ping');


/**
 * Setup the Bloombox Telemetry API. Provide your API key and an endpoint if you
 * would like to override the default (most users should not need to).
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback dispatched when the Shop API is ready.
 * @param {string=} endpoint Override for endpoint. Uses default if unspecified.
 * @export
 */
bloombox.telemetry.setup = function(partner,
                                    location,
                                    apikey,
                                    callback,
                                    endpoint) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config, {'endpoints':
      Object.assign({}, config.endpoints || {}, {
        'shop': endpoint || bloombox.telemetry.TELEMETRY_API_ENDPOINT})}));

  bloombox.config.configure(merged);

  bloombox.logging.log('Telemetry is ready for use.',
    {'version': bloombox.telemetry.VERSION,
      'debug': bloombox.telemetry.DEBUG,
      'config': bloombox.config.active()});
  callback();
  bloombox.telemetry.boot();
};


/**
 * Begin handling telemetry data, starting with initial events to be dispatched
 * and an initial server ping.
 *
 * @package
 */
bloombox.telemetry.sendInitialEvents = function() {
  if (bloombox.telemetry.didOptOut()) {
    // user opted out of telemetry
    bloombox.logging.warn(
      'User opted-out of telemetry, skipping initial events.');
  } else {
    // user has not yet opted out
    bloombox.telemetry.event(
      bloombox.telemetry.InternalCollection.LIBRARY,
      {'distribution': 'js-client'}).send();
  }
};


/**
 * Begin handling telemetry data, starting with initial events to be dispatched
 * and an initial server ping.
 *
 * @public
 */
bloombox.telemetry.boot = function() {
  if (bloombox.telemetry.didOptOut()) {
    // user opted out of telemetry
    bloombox.logging.warn(
      'User opted-out of telemetry, skipping initial ping.');
  } else {
    // user has not yet opted out
    bloombox.logging.log('Sending initial telemetry ping...');
    bloombox.telemetry.ping(function(latency) {
      // as soon as the ping comes through, send the initial events
      bloombox.logging.log('Telemetry service is online. Ping latency: ' +
                           '' + latency + 'ms.');
      bloombox.telemetry.sendInitialEvents();
    });
  }
};
