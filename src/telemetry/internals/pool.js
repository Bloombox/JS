
/**
 * Bloombox Telemetry: RPC Pool
 *
 * @fileoverview Provides RPC tools for managing a pool of XHRs.
 */

/*global goog */

goog.require('bloombox.telemetry.MAX_XHRs');
goog.require('bloombox.telemetry.Routine');
goog.require('bloombox.telemetry.XHR_RETRIES');
goog.require('bloombox.telemetry.XHR_TIMEOUT');

goog.require('bloombox.telemetry.internals.EventQueue');
goog.require('bloombox.telemetry.internals.HTTP_HEADERS');

goog.require('goog.net.XhrIoManager');

goog.provide('bloombox.telemetry.internals.rpcpool.MAX_XHRs');
goog.provide('bloombox.telemetry.internals.rpcpool.MIN_XHRs');
goog.provide('bloombox.telemetry.internals.rpcpool.RPC_POOL');
goog.provide('bloombox.telemetry.internals.rpcpool.WITH_CREDENTIALS');
goog.provide('bloombox.telemetry.internals.rpcpool.XHR_RETRIES');
goog.provide('bloombox.telemetry.internals.rpcpool.XHR_TIMEOUT');


/**
 * Minimum number of XHRs to create.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.MIN_XHRs = 1;


/**
 * Maximum number of XHRs to create.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.MAX_XHRs = bloombox.telemetry.MAX_XHRs;


/**
 * Maximum number of retries.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.XHR_RETRIES = (
  bloombox.telemetry.XHR_RETRIES);


/**
 * XHR timeout interval.
 *
 * @const {number}
 */
bloombox.telemetry.internals.rpcpool.XHR_TIMEOUT = (
  bloombox.telemetry.XHR_TIMEOUT);


/**
 * Whether to include credentials in RPC requests.
 *
 * @const {boolean}
 */
bloombox.telemetry.internals.rpcpool.WITH_CREDENTIALS = true;


/**
 * Value for maximum priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.MAX_PRIORITY = 5;


/**
 * Value for elevated priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.ELEVATED_PRIORITY = 50;


/**
 * Value for normal priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.NORMAL_PRIORITY = 100;


/**
 * Value for minimum priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.MIN_PRIORITY = 999;


/**
 * Value for impression data priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.IMPRESSION_PRIORITY = (
  bloombox.telemetry.internals.rpcpool.MIN_PRIORITY);


/**
 * Value for view data priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.VIEW_PRIORITY = (
  bloombox.telemetry.internals.rpcpool.NORMAL_PRIORITY);


/**
 * Value for conversion data priority.
 *
 * @const {number}
 * @package
 */
bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY = (
  bloombox.telemetry.internals.rpcpool.ELEVATED_PRIORITY);


/**
 * Enumerates priority by RPC routine.
 *
 * @enum {number}
 */
bloombox.telemetry.internals.RoutinePriority = {
  'PING': (
    bloombox.telemetry.internals.rpcpool.MAX_PRIORITY),
  'EVENT': (
    bloombox.telemetry.internals.rpcpool.NORMAL_PRIORITY),
  'EXCEPTION': (
    bloombox.telemetry.internals.rpcpool.ELEVATED_PRIORITY),
  'SECTION_IMPRESSION': (
    bloombox.telemetry.internals.rpcpool.IMPRESSION_PRIORITY),
  'SECTION_VIEW': (
    bloombox.telemetry.internals.rpcpool.VIEW_PRIORITY),
  'SECTION_ACTION': (
    bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY),
  'PRODUCT_IMPRESSION': (
    bloombox.telemetry.internals.rpcpool.IMPRESSION_PRIORITY),
  'PRODUCT_VIEW': (
    bloombox.telemetry.internals.rpcpool.VIEW_PRIORITY),
  'PRODUCT_ACTION': (
    bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY),
  'ORDER_ACTION': (
    bloombox.telemetry.internals.rpcpool.CONVERSION_PRIORITY)
};


/**
 * Main RPC pool for sending telemetry RPCs.
 *
 * @type {goog.net.XhrIoPool}
 * @private
 */
bloombox.telemetry.internals.RPC_POOL_ = new goog.net.XhrManager(
  bloombox.telemetry.internals.rpcpool.XHR_RETRIES,
  bloombox.telemetry.internals.HTTP_HEADERS,
  bloombox.telemetry.internals.rpcpool.MIN_XHRs,
  bloombox.telemetry.internals.rpcpool.MAX_XHRs,
  bloombox.telemetry.internals.rpcpool.XHR_TIMEOUT,
  bloombox.telemetry.internals.rpcpool.WITH_CREDENTIALS);


/**
 * Queue for events to be sent, eventually, via the RPC pool.
 *
 * @type {bloombox.telemetry.internals.EventQueue}
 * @package
 */
bloombox.telemetry.internals.EVENT_QUEUE = (
  new bloombox.telemetry.internals.EventQueue());


/**
 * Enqueue an event to eventually be sent.
 *
 * @param {bloombox.telemetry.rpc.TelemetryRPC} rpc Event RPC to enqueue.
 * @public
 */
bloombox.telemetry.enqueue = function(rpc) {
  let ev = bloombox.telemetry.prepareQueuedEvent(rpc);
  let priority = (
    bloombox.telemetry.internals.RoutinePriority[rpc.rpcMethod]);

  bloombox.telemetry.internals.EVENT_QUEUE.enqueue(priority, ev);
};
