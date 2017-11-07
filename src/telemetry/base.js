
/**
 * Bloombox: Telemetry Client
 *
 * @fileoverview Provides the Bloombox Telemetry API JS client.
 */

/*global goog */

goog.provide('bloombox.telemetry.DEBUG');
goog.provide('bloombox.telemetry.TELEMETRY_API_ENDPOINT');
goog.provide('bloombox.telemetry.TELEMETRY_API_VERSION');
goog.provide('bloombox.telemetry.VERSION');

goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');



/**
 * Telemetry client debug flag.
 *
 * @const {boolean} Global switch for logging and other debug features.
 * @public
 */
bloombox.telemetry.DEBUG = bloombox.DEBUG;


/**
 * Telemetry client library version.
 *
 * @const {string} Telemetry client version string.
 * @export
 */
bloombox.telemetry.VERSION = 'v1beta1r1';


/**
 * Telemetry API endpoint prefix.
 *
 * @define {string} Prefix for API interactions.
 * @public
 */
bloombox.telemetry.TELEMETRY_API_ENDPOINT = (
  'https://telemetry.api.bloombox.cloud');


/**
 * Telemetry API version.
 *
 * @define {string} Version of the API to use.
 * @public
 */
bloombox.telemetry.TELEMETRY_API_VERSION = 'v1beta1';
