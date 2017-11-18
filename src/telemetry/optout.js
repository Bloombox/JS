
/**
 * Bloombox Telemetry: Opt-Out
 *
 * @fileoverview Provides an API to opt-out of telemetry data transmission.
 */

/*global goog */

goog.require('bloombox.logging.warn');

goog.require('bloombox.telemetry.internals.disable');
goog.require('bloombox.telemetry.internals.enabled');

goog.provide('bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY');
goog.provide('bloombox.telemetry.didOptOut');
goog.provide('bloombox.telemetry.optout');


/**
 * Session-storage key to look for to indicate whether a user has already opted-
 * out of telemetry data transmission.
 *
 * @const {string}
 * @package
 */
bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY = 'bb:1:t:opt_out';


/**
 * Package-exposed function to check the local opt-out state.
 *
 * @package
 * @return {boolean} Opt-out status. True if the user has opted out.
 */
bloombox.telemetry.didOptOut = function() {
  let value = (
    window['sessionStorage']
      .getItem(bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY));
  return value === 'true' && !bloombox.telemetry.internals.enabled();
};


/**
 * Publicly-exposed function to opt-out of telemetry data transmission.
 *
 * @export
 */
bloombox.telemetry.optout = function() {
  bloombox.logging.warn('Opted-out of telemetry transmission.');
  bloombox.telemetry.internals.disable();
  window['sessionStorage']
      .setItem(bloombox.telemetry.SESSION_STORAGE_OPTOUT_KEY, 'false');
};
