
/**
 * Bloombox Telemetry: RPC Pool
 *
 * @fileoverview Provides RPC tools for managing a pool of XHRs.
 */

/*global goog */

goog.require('bloombox.util.HTTPMethod');

goog.require('goog.structs.Map');

goog.provide('bloombox.telemetry.TelemetryEndpoint');
goog.provide('bloombox.telemetry.TelemetryEndpointRenderer');
goog.provide('bloombox.telemetry.TelemetryHTTPMethod');
goog.provide('bloombox.telemetry.internals.HTTP_HEADERS');


// - Headers - //
/**
 * HTTP Headers to apply to telemetry RPCs.
 *
 * @type {goog.structs.Map}
 * @package
 */
bloombox.telemetry.internals.HTTP_HEADERS = new goog.structs.Map({
  'Accept': 'application/json;*/*'
});


// - Methods - //
/**
 * Map of RPC routines to their corresponding HTTP method.
 *
 * @enum {bloombox.util.HTTPMethod}
 */
bloombox.telemetry.TelemetryHTTPMethod = {
  'PING': bloombox.util.HTTPMethod.GET,
  'EVENT': bloombox.util.HTTPMethod.POST,
  'EXCEPTION': bloombox.util.HTTPMethod.POST,
  'SECTION_IMPRESSION': bloombox.util.HTTPMethod.GET,
  'SECTION_VIEW': bloombox.util.HTTPMethod.GET,
  'SECTION_ACTION': bloombox.util.HTTPMethod.GET,
  'PRODUCT_IMPRESSION': bloombox.util.HTTPMethod.GET,
  'PRODUCT_VIEW': bloombox.util.HTTPMethod.GET,
  'PRODUCT_ACTION': bloombox.util.HTTPMethod.GET,
  'USER_ACTION': bloombox.util.HTTPMethod.GET,
  'ORDER_ACTION': bloombox.util.HTTPMethod.GET
};


// - Endpoints - //
/**
 * Specifies a function that can render an endpoint.
 *
 * @typedef {function(bloombox.telemetry.Context): string}
 */
bloombox.telemetry.TelemetryEndpointRenderer;


/**
 * Map of RPC routines to their respective endpoint renderer functions.
 *
 * @enum {bloombox.telemetry.TelemetryEndpointRenderer}
 */
bloombox.telemetry.TelemetryEndpoint = {
  'PING': () => 'ping',
  'EVENT': (context) => `events/${context.collection.name}`,
  'EXCEPTION': (context) => `exceptions/${context.collection.name}`,
  'SECTION_IMPRESSION': (context) =>
    `${context.partner}/${context.location}/section/${context.section}/impress`,
  'SECTION_VIEW': (context) =>
    `${context.partner}/${context.location}/section/${context.section}/view`,
  'SECTION_ACTION': (context) =>
    `${context.partner}/${context.location}/section/${context.section}/action/${context.action}`,
  'PRODUCT_IMPRESSION': (context) =>
    `${context.partner}/${context.location}/product/${context.kind}/${context.key}/impress`,
  'PRODUCT_VIEW': (context) =>
    `${context.partner}/${context.location}/product/${context.kind}/${context.key}/view`,
  'PRODUCT_ACTION': (context) =>
    `${context.partner}/${context.location}/product/${context.kind}/${context.key}/action/${context.action}`,
  'USER_ACTION': (context) =>
    `${context.partner}/${context.location}/user/${context.key}/action/${context.action}`,
  'ORDER_ACTION': (context) =>
    `${context.partner}/${context.location}/order/${context.key}/action/${context.action}`
};
