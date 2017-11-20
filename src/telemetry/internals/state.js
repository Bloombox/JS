
/**
 * Bloombox Telemetry: State Manager
 *
 * @fileoverview Provides centralized RPC state management.
 */

/*global goog */

goog.provide('bloombox.telemetry.internals.LocalStats');
goog.provide('bloombox.telemetry.internals.activate');
goog.provide('bloombox.telemetry.internals.active');
goog.provide('bloombox.telemetry.internals.deactivate');
goog.provide('bloombox.telemetry.internals.disable');
goog.provide('bloombox.telemetry.internals.enable');
goog.provide('bloombox.telemetry.internals.enabled');

goog.provide('bloombox.telemetry.internals.state.ACTIVE_');
goog.provide('bloombox.telemetry.internals.state.ENABLED_');
goog.provide('bloombox.telemetry.internals.state.EVENT_ERROR_COUNT_');
goog.provide('bloombox.telemetry.internals.state.EVENT_SUCCESS_COUNT_');
goog.provide('bloombox.telemetry.internals.state.LAST_PING_SENT_');
goog.provide('bloombox.telemetry.internals.state.LAST_PONG_RECEIVED_');
goog.provide('bloombox.telemetry.internals.state.QUEUED_EVENT_COUNT_');
goog.provide('bloombox.telemetry.internals.state.SENT_EVENT_COUNT_');

goog.provide('bloombox.telemetry.internals.statistics');

goog.provide('bloombox.telemetry.internals.stats.recordPing');
goog.provide('bloombox.telemetry.internals.stats.recordPong');
goog.provide('bloombox.telemetry.internals.stats.recordRPCError');
goog.provide('bloombox.telemetry.internals.stats.recordRPCSent');
goog.provide('bloombox.telemetry.internals.stats.recordRPCSuccess');
goog.provide('bloombox.telemetry.internals.stats.updateRPCQueued');


/**
 * Type declaration for a record that provides statistics about the local
 * telemetry subsystem.
 *
 * @typedef {{
 *   queued: number,
 *   sent: number,
 *   errors: number,
 *   success: number,
 *   lastPing: number,
 *   lastPong: number
 * }}
 */
bloombox.telemetry.internals.LocalStats;


// - Enabled State - //
/**
 * Query whether the telemetry system is enabled.
 *
 * @return {boolean}
 * @public
 */
bloombox.telemetry.internals.enabled = function() {
  return bloombox.telemetry.internals.state.ENABLED_;
};


/**
 * Disable the telemetry system.
 *
 * @public
 */
bloombox.telemetry.internals.disable = function() {
  bloombox.telemetry.internals.state.ENABLED_ = false;
};


/**
 * Enable the telemetry system.
 *
 * @public
 */
bloombox.telemetry.internals.enable = function() {
  bloombox.telemetry.internals.state.ENABLED_ = true;
};


/**
 * Record that a ping was sent.
 *
 * @public
 */
bloombox.telemetry.internals.stats.recordPing = function() {
  bloombox.telemetry.internals.state.LAST_PING_SENT_ = +(new Date());
};


/**
 * Record that a pong was received.
 *
 * @public
 */
bloombox.telemetry.internals.stats.recordPong = function() {
  bloombox.telemetry.internals.state.LAST_PONG_RECEIVED_ = +(new Date());
};


/**
 * Record that an RPC error happened.
 *
 * @public
 */
bloombox.telemetry.internals.stats.recordRPCError = function() {
  bloombox.telemetry.internals.state.EVENT_ERROR_COUNT_++;
};


/**
 * Record that an RPC success happened.
 *
 * @public
 */
bloombox.telemetry.internals.stats.recordRPCSuccess = function() {
  bloombox.telemetry.internals.state.EVENT_SUCCESS_COUNT_++;
};


/**
 * Record that an RPC was sent.
 *
 * @public
 */
bloombox.telemetry.internals.stats.recordRPCSent = function() {
  bloombox.telemetry.internals.state.SENT_EVENT_COUNT_++;
};


/**
 * Update queued RPC count.
 *
 * @param {number} queued_count Current count of queued RPCs.
 * @public
 */
bloombox.telemetry.internals.stats.updateRPCQueued = function(queued_count) {
  bloombox.telemetry.internals.state.QUEUED_EVENT_COUNT_ = queued_count;
};


// - Active State - //
/**
 * Query whether the telemetry system is currently active or paused.
 *
 * @return {boolean}
 * @public
 */
bloombox.telemetry.internals.active = function() {
  return (
    bloombox.telemetry.internals.state.ENABLED_ &&
    bloombox.telemetry.internals.state.ACTIVE_);
};

/**
 * Activate the telemetry system.
 *
 * @public
 */
bloombox.telemetry.internals.activate = function() {
  bloombox.telemetry.internals.state.ACTIVE_ = true;

  // perform a tick to re-start the queue
  bloombox.telemetry.internals.tick();
};

/**
 * Deactivate the telemetry system.
 *
 * @public
 */
bloombox.telemetry.internals.deactivate = function() {
  bloombox.telemetry.internals.state.ACTIVE_ = false;
};


// - Statistics - //
/**
 * Return stats about the local telemetry subsystem.
 *
 * @return {bloombox.telemetry.internals.LocalStats}
 * @public
 */
bloombox.telemetry.internals.statistics = function() {
  let stats = (/** @type {bloombox.telemetry.internals.LocalStats} */ ({
    queued: bloombox.telemetry.internals.state.QUEUED_EVENT_COUNT_,
    sent: bloombox.telemetry.internals.state.SENT_EVENT_COUNT_,
    errors: bloombox.telemetry.internals.state.EVENT_ERROR_COUNT_,
    success: bloombox.telemetry.internals.state.EVENT_SUCCESS_COUNT_,
    lastPing: bloombox.telemetry.internals.state.LAST_PING_SENT_,
    lastPong: bloombox.telemetry.internals.state.LAST_PONG_RECEIVED_
  }));

  if (Object.isFrozen && !Object.isFrozen(stats)) {
    Object.freeze(stats);
  }
  return stats;
};


/**
 * Whether telemetry services are enabled at all.
 *
 * @type {boolean}
 * @private
 * @nocollapse
 */
bloombox.telemetry.internals.state.ENABLED_ = true;


/**
 * Whether telemetry services are active - i.e. currently sending events. This
 * requires an active internet connection and the page must be in one of a
 * certain set of visibility states.
 *
 * @type {boolean}
 * @private
 * @nocollapse
 */
bloombox.telemetry.internals.state.ACTIVE_ = true;


/**
 * Last time we sent a `PING` call to the Telemetry service. Null means we have
 * not yet sent one.
 *
 * @type {?number}
 * @private
 */
bloombox.telemetry.internals.state.LAST_PING_SENT_ = null;


/**
 * Last time we received a `PONG` to our `PING`. Null means we have not yet
 * received one.
 *
 * @type {?number}
 * @private
 */
bloombox.telemetry.internals.state.LAST_PONG_RECEIVED_ = null;


/**
 * Global count of queued events.
 *
 * @type {number}
 * @private
 */
bloombox.telemetry.internals.state.QUEUED_EVENT_COUNT_ = 0;


/**
 * Global count of events sent to the Telemetry Service.
 *
 * @type {number}
 * @private
 */
bloombox.telemetry.internals.state.SENT_EVENT_COUNT_ = 0;


/**
 * Global count of errors received back for events sent to the Telemetry
 * Service. Should always be less than or equal to SENT_EVENT_COUNT.
 *
 * @type {number}
 * @private
 */
bloombox.telemetry.internals.state.EVENT_ERROR_COUNT_ = 0;


/**
 * Global count of successful events submitted to the Telemetry Service. Should
 * always be less than or equal to SENT_EVENT_COUNT.
 *
 * @type {number}
 * @private
 */
bloombox.telemetry.internals.state.EVENT_SUCCESS_COUNT_ = 0;
