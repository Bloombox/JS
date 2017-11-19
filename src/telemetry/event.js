
/**
 * Bloombox Telemetry: Base Event
 *
 * @fileoverview Provides base logic for all events.
 */

/*global goog */

goog.require('bloombox.telemetry.Context');
goog.require('bloombox.telemetry.OperationStatus');

goog.require('bloombox.telemetry.Routine');

goog.require('bloombox.util.Exportable');
goog.require('bloombox.util.generateUUID');

goog.require('jspb.Message');

goog.require('proto.analytics.Context');

goog.provide('bloombox.telemetry.BaseEvent');
goog.provide('bloombox.telemetry.FailureCallback');
goog.provide('bloombox.telemetry.SuccessCallback');
goog.provide('bloombox.telemetry.TelemetryEvent');


// - Type Definitions - //

/**
 * Success callback, specifying one parameter: the result of the operation we
 * are calling back from.
 *
 * @typedef {function(bloombox.telemetry.OperationStatus)}
 */
bloombox.telemetry.SuccessCallback;

/**
 * Failure callback, specifying three parameters: the result of the operation we
 * are calling back from, any known telemetry error, and the underlying HTTP
 * status code. In some cases, such as a timeout, all parameters may be `null`,
 * except for the first one, which would be provided in every case as either
 * `OK` or `ERROR`, enabling one function to be used as both a `SuccessCallback`
 * and `FailureCallback`.
 *
 * @typedef {function(
 *   bloombox.telemetry.OperationStatus,
 *   ?bloombox.telemetry.TelemetryError,
 *   ?number)}
 */
bloombox.telemetry.FailureCallback;


// - Interface: Sendable - //
/**
 * Specifies an interface for an object that may be sent via the telemetry
 * subsystem. Basically, this enforces the presence of a method, `send`, which
 * can be called with no parameters, to send whatever it is being called on.
 *
 * That entails a lot of hidden machinery - rendering context and payloads,
 * gathering global context, queueing, and so on. Most of that is implementation
 * specific, and this method makes it possible to treat those implementors
 * generically when it comes to sending data.
 *
 * @interface
 * @package
 */
bloombox.telemetry.Sendable = function() {};

/**
 * Send the subject data, with no regard for what happens afterwards. This is a
 * fire-and-forget interface. For callback-based dispatch, see `dispatch`.
 */
bloombox.telemetry.Sendable.prototype.send = function() {};


/**
 * Send the subject data, with callbacks attached for success and error
 * follow-up. For a fire-and-forget interface, see `send`.
 *
 * @param {?bloombox.telemetry.SuccessCallback} success Success callback.
 * @param {?bloombox.telemetry.FailureCallback} failure Failure callback.
 */
bloombox.telemetry.Sendable.prototype.dispatch = function(success, failure) {};


/**
 * Abort whatever in-flight request might be in-flight for this operation. This
 * calls into the underlying runtime with a best-effort guarantee.
 */
bloombox.telemetry.Sendable.prototype.abort = function() {};


// - Interface: Telemetry Event - //
/**
 * Basic interface for a Telemetry event. Every event eventually complies with
 * this interface. Some comply with more.
 *
 * @extends {bloombox.telemetry.Sendable}
 * @implements {bloombox.util.Exportable}
 * @interface
 * @package
 */
bloombox.telemetry.TelemetryEvent = function() {};


/**
 * Generate an RPC transaction corresponding to this event, that reports its
 * encapsulated information to the telemetry service.
 *
 * @return {bloombox.telemetry}
 */
bloombox.telemetry.TelemetryEvent.prototype.generateRPC = function() {};


/**
 * Every event is associated with an RPC method that is used to transmit it.
 * This method resolves the associated method for a given event.
 *
 * @return {bloombox.telemetry.Routine} RPC routine for this event.
 */
bloombox.telemetry.TelemetryEvent.prototype.rpcMethod = function() {};


/**
 * Every event is assigned a unique ID by the frontend, and later again by the
 * backend. This is mostly to keep track of individual events since objects are
 * frequently reused in the underlying runtime.
 *
 * @return {string} Final UUID to use for this event.
 */
bloombox.telemetry.TelemetryEvent.prototype.renderUUID = function() {};


/**
 * Every event carries context, which specifies common properties, like the
 * partner context or user state under which the event was recorded.
 *
 * Before the event is sent, `renderContext` is called to merge global context
 * with any event-specific context. The resulting object is used as the final
 * context when the event is sent shortly thereafter.
 *
 * @param {proto.analytics.Context} global Global context to merge onto.
 * @return {proto.analytics.Context} Combined/rendered event context.
 */
bloombox.telemetry.TelemetryEvent.prototype.renderContext = function(global) {};


/**
 * Most event types support the concept of a `payload`, which is arbitrary
 * object data detailing other information related to the event. The usage and
 * specification for the payload is event specific, so this method resolves that
 * for the generic case of rendering and sending those payloads.
 *
 * @return {?Object} Either `null`, indicating no payload should be attached, or
 * an object that is serializable via JSON.
 */
bloombox.telemetry.TelemetryEvent.prototype.renderPayload = function() {};


/**
 * Every event has a timestamp associated with when it occurred. This method
 * requests that value from an event, delegating its timing to code inside the
 * implementation of each event type.
 *
 * @param {number} now Timestamp for when this method is dispatched, in case the
 *        event would like to use that.
 * @return {number} Millisecond-resolution timestamp to use for this event.
 */
bloombox.telemetry.TelemetryEvent.prototype.renderOccurrence = function(now) {};



// - Base Classes: Base Event - //
/**
 * Basic constructor for every kind of event. Context is accepted, along with
 * the option for a payload and an explicit timestamp. If a timestamp for event
 * occurrence is not provided, one is generated.
 *
 * @param {bloombox.telemetry.Context} context Context to apply to this event.
 * @param {bloombox.telemetry.Routine} method RPC method for this event.
 * @param {Object=} opt_payload Optional payload to attach to this event.
 * @param {number=} opt_occurred Optional explicit occurrence timestamp to
 *        specify for this event.
 * @param {string=} opt_uuid Optional explicit UUID for this specific event.
 *        If one is not provided, one will be generated by this method.
 * @implements {bloombox.telemetry.TelemetryEvent}
 * @constructor
 * @abstract
 * @package
 */
bloombox.telemetry.BaseEvent = function(context,
                                        method,
                                        opt_payload,
                                        opt_occurred,
                                        opt_uuid) {
  /**
   * Unique ID for this event.
   *
   * @type {string}
   * @protected
   */
  this.uuid = opt_uuid || bloombox.util.generateUUID();

  /**
   * RPC method to dispatch when transmitting this event.
   *
   * @type {bloombox.telemetry.Routine}
   * @protected
   */
  this.operation = method;

  /**
   * Context to apply for this event.
   *
   * @type {bloombox.telemetry.Context}
   * @protected
   */
  this.context = context;

  // freeze the payload if we are given one
  if (opt_payload && Object.isFrozen && !Object.isFrozen(opt_payload))
    Object.freeze(opt_payload);

  /**
   * Payload to attach to this event, if any.
   *
   * @type {?Object}
   * @protected
   */
  this.payload = opt_payload || null;

  /**
   * Context to apply for this event.
   *
   * @type {bloombox.telemetry.Context}
   * @protected
   */
  this.occurred = opt_occurred || +(new Date);
};


// - Base Event: Abstract Methods - //
/**
 * Retrieve this event's corresponding RPC method.
 *
 * @abstract
 * @return {bloombox.telemetry.Routine} RPC routine for this event.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.rpcMethod = function() {};


/**
 * Abstract base implementation of proto/struct export, which must be defined
 * on every event implementor of `BaseEvent`.
 *
 * @abstract
 * @return {jspb.Message}
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.export = function() {};


// - Base Event: Default Implementations - //
/**
 * Default implementation. Send this data to the telemetry service, with an
 * attached success and failure callback.
 *
 * @param {?bloombox.telemetry.SuccessCallback} success Callback to dispatch if
 *        the underlying runtime reports success.
 * @param {?bloombox.telemetry.FailureCallback} failure Callback to dispatch if
 *        some error or failure is encountered.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.dispatch = function(success, failure) {
  // @todo: IMPLEMENT
};

/**
 * Default implementation. Abort any underlying in-flight request for this
 * event, on a best-effort basis.
 *
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.abort = function() {
  // @todo: IMPLEMENT
};


/**
 * Default implementation. Use this event's pre-generated UUID for its
 * underlying UUID.
 *
 * @return {string} Pre-generated or explicitly provided UUID.
 */
bloombox.telemetry.BaseEvent.prototype.renderUUID = function() {
  return this.uuid;
};


/**
 * Default implementation. Fire-and-forget this data, by sending it to the
 * telemetry service.
 *
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.send = function() {
  this.dispatch(null, null);
};

/**
 * Default implementation. Render event context by returning any attached
 * payload object, or `null`, to indicate there is no payload.
 *
 * @param {proto.analytics.Context} global Global context.
 * @return {proto.analytics.Context} Combined/rendered event context.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.renderContext = function(global) {
  let fresh = new proto.analytics.Context();
  let local = /** @type {proto.analytics.Context} */ (this.context.export());
  jspb.Message.copyInto(global, fresh);
  jspb.Message.copyInto(local, fresh);
  return fresh;
};


/**
 * Default implementation. Provide the attached payload, if any, as the final
 * payload to send for the event.
 *
 * @return {?Object} Either `null`, indicating no payload should be attached, or
 * the attached payload object, provided at construction time.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.renderPayload = function() {
  return this.payload;
};


/**
 * Default implementation. Render the occurrence timestamp for this event,
 * howsoever this event defines that value. By default, the occurrence timestamp
 * provided or generated at event construction time is used. If that is not a
 * valid value, `now` is returned, which is provided by the runtime when this
 * method is dispatched.
 *
 * @param {number} now Millisecond-level timestamp for when this method is
 *        dispatched.
 * @return {number} Timestamp to use for this event's occurrence.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.renderOccurrence = function(now) {
  return this.occurred || now;
};
