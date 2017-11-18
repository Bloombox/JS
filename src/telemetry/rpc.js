
/**
 * Bloombox Telemetry: RPC
 *
 * @fileoverview Provides tools for low-level RPCs to the Telemetry API.
 */

/*global goog */

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

goog.require('bloombox.rpc.RPC');
goog.require('bloombox.rpc.RPCException');

goog.require('bloombox.telemetry.TELEMETRY_API_ENDPOINT');
goog.require('bloombox.telemetry.TELEMETRY_API_VERSION');
goog.require('bloombox.telemetry.VERSION');

goog.require('proto.services.telemetry.v1beta1.OperationStatus');
goog.require('proto.services.telemetry.v1beta1.TelemetryError');
goog.require('proto.services.telemetry.v1beta1.TelemetryResponse');

goog.provide('bloombox.telemetry.OperationStatus');
goog.provide('bloombox.telemetry.Routine');
goog.provide('bloombox.telemetry.TelemetryError');
goog.provide('bloombox.telemetry.endpoint');
goog.provide('bloombox.telemetry.rpc.TelemetryRPC');



/**
 * Enumerates methods in the Telemetry API.
 *
 * @enum {string}
 */
bloombox.telemetry.Routine = {
  'PING': 'PING',
  'EVENT': 'EVENT',
  'EXCEPTION': 'EXCEPTION',
  'SECTION_IMPRESSION': 'SECTION_IMPRESSION',
  'SECTION_VIEW': 'SECTION_VIEW',
  'SECTION_ACTION': 'SECTION_ACTION',
  'PRODUCT_IMPRESSION': 'PRODUCT_IMPRESSION',
  'PRODUCT_VIEW': 'PRODUCT_VIEW',
  'PRODUCT_ACTION': 'PRODUCT_ACTION',
  'ORDER_ACTION': 'ORDER_ACTION'
};


/**
 * Enumerates operation statuses that result from Telemetry API RPC calls.
 *
 * @enum {proto.services.telemetry.v1beta1.OperationStatus}
 */
bloombox.telemetry.OperationStatus = {
  OK: proto.services.telemetry.v1beta1.OperationStatus.OK,
  ERROR: proto.services.telemetry.v1beta1.OperationStatus.ERROR
};


/**
 * Enumerates errors in the Telemetry API.
 *
 * @enum {proto.services.telemetry.v1beta1.TelemetryError}
 */
bloombox.telemetry.TelemetryError = {
  'UNKNOWN': proto.services.telemetry.v1beta1.TelemetryError.UNKNOWN,
  'INVALID_COLLECTION': (
    proto.services.telemetry.v1beta1.TelemetryError.INVALID_COLLECTION),
  'INVALID_PARTNER': (
    proto.services.telemetry.v1beta1.TelemetryError.INVALID_PARTNER),
  'INVALID_LOCATION': (
    proto.services.telemetry.v1beta1.TelemetryError.INVALID_LOCATION),
  'INVALID_DEVICE': (
    proto.services.telemetry.v1beta1.TelemetryError.INVALID_DEVICE),
  'INVALID_USER': (
    proto.services.telemetry.v1beta1.TelemetryError.INVALID_USER),
  'INVALID_CLIENT': (
    proto.services.telemetry.v1beta1.TelemetryError.INVALID_CLIENT),
  'PARTNER_NOT_FOUND': (
    proto.services.telemetry.v1beta1.TelemetryError.PARTNER_NOT_FOUND),
  'LOCATION_NOT_FOUND': (
    proto.services.telemetry.v1beta1.TelemetryError.LOCATION_NOT_FOUND),
  'INVALID_PAYLOAD': (
    proto.services.telemetry.v1beta1.TelemetryError.INVALID_PAYLOAD)
};


/**
 * Calculate a telemetry API endpoint, given an RPC method and the base API
 * endpoint.
 *
 * @param {string} endpoint Method to generate an endpoint for.
 * @return {string} Calculated endpoint URI.
 * @package
 */
bloombox.telemetry.endpoint = function(endpoint) {
  return [
    bloombox.telemetry.TELEMETRY_API_ENDPOINT,
    'telemetry',
    bloombox.telemetry.TELEMETRY_API_VERSION,
    endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  ].join('/');
};


/**
 * Return a `TelemetryRPC` instance for a generic HTTP RPC call.
 *
 * @param {bloombox.telemetry.Routine} rpcMethod RPC routine.
 * @param {string} httpMethod HTTP method to use.
 * @param {string} endpoint URL endpoint to send the RPC to.
 * @param {function(bloombox.telemetry.OperationStatus)} success Callback to
 *        dispatch once we have a response.
 * @param {function(?bloombox.telemetry.TelemetryError)} failure Callback to
 *        dispatch if an error is encountered.
 * @param {Object=} opt_payload Payload to use if we're POST-ing or PUT-ing.
 * @throws {bloombox.rpc.RPCException} If the provided values are invalid
 *         in some way.
 * @constructor
 * @struct
 */
bloombox.telemetry.rpc.TelemetryRPC = function TelemetryRPC(rpcMethod,
                                                            httpMethod,
                                                            endpoint,
                                                            success,
                                                            failure,
                                                            opt_payload) {
  let targetEndpoint = bloombox.telemetry.endpoint(endpoint);

  if (typeof httpMethod !== 'string')
    throw new bloombox.rpc.RPCException(
      'Invalid HTTP method: ' + httpMethod);
  if (typeof endpoint !== 'string')
    throw new bloombox.rpc.RPCException(
      'Invalid RPC endpoint: ' + endpoint);
  if (opt_payload !== null && opt_payload !== undefined && (
      typeof opt_payload !== 'object'))
    throw new bloombox.rpc.RPCException(
      'Cannot provide non-object type as payload: ' + opt_payload);

  /**
   * RPC routine we're calling.
   *
   * @type {bloombox.telemetry.Routine}
   * @public
   */
  this.rpcMethod = rpcMethod;

  /**
   * HTTP method to dispatch.
   *
   * @type {string}
   */
  this.httpMethod = httpMethod;

  /**
   * Target endpoint to send our RPC to.
   *
   * @type {string}
   */
  this.endpoint = targetEndpoint;

  /**
   * Payload to send with the request, if any.
   *
   * @type {?Object}
   */
  this.payload = opt_payload === undefined ? null : opt_payload;

  /**
   * Callback to dispatch once the operation is complete.
   *
   * @type {function(bloombox.telemetry.OperationStatus)}
   * @public
   */
  this.successCallback = success;

  /**
   * Callback to dispatch if an error is encountered.
   *
   * @type {function(bloombox.telemetry.TelemetryError)}
   * @public
   */
  this.failureCallback = failure;
};
