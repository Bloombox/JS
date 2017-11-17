
/**
 * Bloombox Telemetry: RPC Pool
 *
 * @fileoverview Provides RPC tools for managing a pool of XHRs.
 */

/*global goog */

goog.require('goog.structs.Map');

goog.provide('bloombox.telemetry.internals.HTTP_HEADERS');


/**
 * HTTP Headers to apply to telemetry RPCs.
 *
 * @type {goog.structs.Map}
 * @package
 */
bloombox.telemetry.internals.HTTP_HEADERS = new goog.structs.Map({
  'Accept': 'application/json;*/*'
});
