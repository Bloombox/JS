
/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox Telemetry Services: Events
 *
 * @fileoverview Provides tools for interacting with the Telemetry Events
 * API service.
 */

/*global goog */

goog.require('bloombox.DEBUG');
goog.require('bloombox.DEBUG_PROPERTY');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.rpc.API_KEY_HEADER');
goog.require('bloombox.rpc.DEBUG_HEADER');
goog.require('bloombox.rpc.FALLBACK');
goog.require('bloombox.rpc.TRACE_HEADER');

goog.require('bloombox.telemetry.Collection');
goog.require('bloombox.telemetry.Context');
goog.require('bloombox.telemetry.ContextException');
goog.require('bloombox.telemetry.EventTelemetryAPI');
goog.require('bloombox.telemetry.OperationStatus');
goog.require('bloombox.telemetry.Routine');

goog.require('bloombox.telemetry.abort');
goog.require('bloombox.telemetry.enqueue');
goog.require('bloombox.telemetry.globalContext');

goog.require('bloombox.telemetry.internals.statistics');
goog.require('bloombox.telemetry.internals.stats.recordPong');

goog.require('bloombox.telemetry.rpc.CONTEXT_HEADER');
goog.require('bloombox.telemetry.rpc.ENABLE_CONTEXT_HEADER');

goog.require('bloombox.telemetry.rpc.TelemetryRPC');

goog.require('bloombox.util.Exportable');
goog.require('bloombox.util.generateUUID');
goog.require('bloombox.util.proto.merge');

goog.require('proto.bloombox.analytics.Context');
goog.require('proto.bloombox.analytics.generic.Event');
goog.require('proto.google.protobuf.Empty');
goog.require('proto.google.protobuf.Struct');
goog.require('proto.opencannabis.temporal.Instant');

goog.provide('bloombox.telemetry.BaseEvent');
goog.provide('bloombox.telemetry.Event');
goog.provide('bloombox.telemetry.FailureCallback');
goog.provide('bloombox.telemetry.InternalCollection');
goog.provide('bloombox.telemetry.SuccessCallback');
goog.provide('bloombox.telemetry.TelemetryEvent');
goog.provide('bloombox.telemetry.event');
goog.provide('bloombox.telemetry.v1beta0.EventService');


// - Types & Structures - //
/**
 * Success callback, specifying one parameter: the result of the operation we
 * are calling back from.
 *
 * @typedef {function(bloombox.telemetry.OperationStatus, ?string=)}
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
 *   ?number,
 *   ?string=)}
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
 * @interface
 * @package
 */
bloombox.telemetry.TelemetryEvent = function() {};


// noinspection JSUnusedGlobalSymbols
/**
 * Generate an RPC transaction corresponding to this event, that reports its
 * encapsulated information to the telemetry service.
 *
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 * @return {bloombox.telemetry.rpc.TelemetryRPC}
 */
bloombox.telemetry.TelemetryEvent.prototype.generateRPC = function() {};


// noinspection JSUnusedGlobalSymbols
/**
 * Every event is associated with an RPC method that is used to transmit it.
 * This method resolves the associated method for a given event.
 *
 * @return {bloombox.telemetry.Routine} RPC routine for this event.
 */
bloombox.telemetry.TelemetryEvent.prototype.rpcMethod = function() {};


// noinspection JSUnusedGlobalSymbols
/**
 * Every event is assigned a unique ID by the frontend, and later again by the
 * backend. This is mostly to keep track of individual events since objects are
 * frequently reused in the underlying runtime.
 *
 * @return {string} Final UUID to use for this event.
 */
bloombox.telemetry.TelemetryEvent.prototype.renderUUID = function() {};


// noinspection JSUnusedGlobalSymbols
/**
 * Every event carries context, which specifies common properties, like the
 * partner context or user state under which the event was recorded.
 *
 * Before the event is sent, `renderContext` is called to merge global context
 * with any event-specific context. The resulting object is used as the final
 * context when the event is sent shortly thereafter.
 *
 * @param {proto.bloombox.analytics.Context} global Global context to
 *        merge onto.
 * @return {proto.bloombox.analytics.Context} Combined/rendered
 *         event context.
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 */
bloombox.telemetry.TelemetryEvent.prototype.renderContext = function(global) {};


// noinspection JSUnusedGlobalSymbols
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


// noinspection JSUnusedGlobalSymbols
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
// noinspection GjsLint
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
 * @implements {bloombox.telemetry.Sendable}
 * @implements {bloombox.util.Exportable<T>}
 * @template T
 * @constructor
 * @abstract
 * @public
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
   * @type {number}
   * @protected
   */
  this.occurred = opt_occurred || +(new Date);

  /**
   * Success callback to dispatch, if any.
   *
   * @type {?bloombox.telemetry.SuccessCallback}
   */
  this.successCallback = null;

  /**
   * Failure callback to dispatch, if any.
   *
   * @type {?bloombox.telemetry.FailureCallback}
   */
  this.failureCallback = null;
};


// - Base Event: Abstract Methods - //
// noinspection GjsLint
/**
 * Retrieve this event's corresponding RPC method.
 *
 * @return {bloombox.telemetry.Routine} RPC routine for this ev ent.
 * @public
 * @abstract
 */
bloombox.telemetry.BaseEvent.prototype.rpcMethod = function() {};


// noinspection GjsLint
/**
 * Abstract base method of proto/struct export, which must be defined on every
 * event implementor of `BaseEvent`.
 *
 * @return {T}
 * @public
 * @abstract
 */
bloombox.telemetry.BaseEvent.prototype.export = function() {};


// noinspection GjsLint
/**
 * Abstract base method to provide the attached payload, if any, as the final
 * payload to send for the event.
 *
 * @abstract
 * @return {?Object} Either `null`, indicating no payload should be attached, or
 * the attached payload object, provided at construction time.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.renderPayload = function() {};


// - Base Event: Default Implementations - //
/**
 * Default implementation. Success callback dispatcher.
 *
 * @param {bloombox.telemetry.OperationStatus} status Status of the operation we
 *        are calling back from.
 * @param {?string=} opt_mark Sentinel to check for to prevent recursion.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.onSuccess = function(status, opt_mark) {
  // if there is a success callback attached, call it
  if (this.successCallback && typeof this.successCallback === 'function' &&
    opt_mark !== '_BASE_EVENT_ON_SUCCESS_')
    this.successCallback(status, '_BASE_EVENT_ON_SUCCESS_');
  this.successCallback = null;
};


/**
 * Default implementation. Failure callback dispatcher.
 *
 * @param {bloombox.telemetry.OperationStatus} op Status of the operation we are
 *        calling back from.
 * @param {?bloombox.telemetry.TelemetryError} error Known error, if any.
 * @param {?number} code Status code of the underlying RPC, if any.
 * @param {?string=} opt_mark Sentinel to check for to prevent recursion.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.onFailure = function(op,
                                                            error,
                                                            code,
                                                            opt_mark) {
  // if there is a failure callback attached, call it
  if (this.failureCallback && typeof this.failureCallback === 'function' &&
    opt_mark !== '_BASE_EVENT_ON_FAILURE_')
    this.failureCallback(op, error, code, '_BASE_EVENT_ON_FAILURE_');
  this.failureCallback = null;
};


/**
 * Encode an array of unsigned 8-bit integers (a.k.a. 'bytes'), and return
 * it base64 encoded.
 *
 * @param {Uint8Array} u8a Array of bytes.
 * @return {string} Base64-encoded, UTF-8 encoded bytes.
 * @private
 */
bloombox.telemetry.BaseEvent.prototype.encodeUint8Array_ = function(u8a) {
  let CHUNK_SZ = 0x8000;
  let c = [];
  for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
    c.push(
      String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
  }
  return btoa(c.join(''));
};


/**
 * Default implementation. Generate a `TelemetryRPC` suitable for fulfilling
 * the transmission of this `BaseEvent` to the telemetry service.
 *
 * @return {bloombox.telemetry.rpc.TelemetryRPC}
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 */
bloombox.telemetry.BaseEvent.prototype.generateRPC = function() {
  // fetch global context and render
  let globalContext = bloombox.telemetry.globalContext().export();
  let mergedContext = this.renderContext(globalContext);

  let rpcMethod = this.rpcMethod();
  let rpcPayload = this.renderPayload();
  let uuid = this.renderUUID();

  let renderedContext = (
    bloombox.telemetry.Context.serializeProto(mergedContext));

  let resolvedPayload = rpcPayload === null ? {} : rpcPayload;
  let body = Object.assign({}, resolvedPayload,
    {'context': renderedContext});

  let currentLength = JSON.stringify(body).length;
  let reducedLength = (
    JSON.stringify(Object.assign(
      {}, {'payload': body['payload']})).length);

  // if debug mode is active, append the debug header and the event UUID as the
  // trace header for the request
  let rpcHeaders = {};
  if (bloombox.DEBUG || (window[bloombox.DEBUG_PROPERTY] === true)) {
    rpcHeaders[bloombox.rpc.DEBUG_HEADER] = 'debug';
    rpcHeaders[bloombox.rpc.TRACE_HEADER] = uuid;
  }
  let binaryEncoded = null;
  let b64encoded = '_undefined_';
  if (bloombox.telemetry.rpc.ENABLE_CONTEXT_HEADER) {
    // @TEST: test code for binary encoding
    binaryEncoded = mergedContext.serializeBinary();
    b64encoded = this.encodeUint8Array_(binaryEncoded);

    bloombox.logging.log('EXPERIMENTAL: Attaching context via header.', {
      'encoded': b64encoded});
    rpcHeaders[bloombox.telemetry.rpc.CONTEXT_HEADER] = b64encoded;
  }

  bloombox.logging.log('Preparing RPC.', {
    'payloads': {
      'current': body,
      'context': b64encoded
    },
    'comparison': {
      'current': currentLength,
      'b64encoded': b64encoded.length,
      'reduced': (currentLength > reducedLength) ?
        (currentLength - reducedLength) : (reducedLength - currentLength),
      'next': reducedLength
    }
  });

  return new bloombox.telemetry.rpc.TelemetryRPC(
    uuid,
    rpcMethod,
    this.onSuccess,
    this.onFailure,
    body,
    mergedContext);
};

/**
 * Default implementation. Send this data to the telemetry service, with an
 * attached success and failure callback.
 *
 * @param {?bloombox.telemetry.SuccessCallback} success Callback to dispatch if
 *        the underlying runtime reports success.
 * @param {?bloombox.telemetry.FailureCallback} failure Callback to dispatch if
 *        some error or failure is encountered.
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.dispatch = function(success, failure) {
  this.successCallback = success || null;
  this.failureCallback = failure || null;
  let rpc = this.generateRPC();
  bloombox.telemetry.enqueue(rpc);
};

/**
 * Default implementation. Abort any underlying in-flight request for this
 * event, on a best-effort basis.
 *
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.abort = function() {
  let uuid = this.renderUUID();
  bloombox.telemetry.abort(uuid);
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
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.send = function() {
  this.dispatch(null, null);
};

/**
 * Default implementation. Render event context by returning any attached
 * payload object, or `null`, to indicate there is no payload.
 *
 * @param {proto.bloombox.analytics.Context} global Global context.
 * @return {proto.bloombox.analytics.Context} Combined/rendered event
 *         context.
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 * @public
 */
bloombox.telemetry.BaseEvent.prototype.renderContext = function(global) {
  let local = /** @type {proto.bloombox.analytics.Context} */ (
    this.context.export());
  let merged = bloombox.util.proto.merge(local, global);
  this.validateContext(merged);
  return merged;
};


/**
 * Validate final event context before allowing it to return.
 *
 * @param {proto.bloombox.analytics.Context} context Final context to
 *        validate.
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 * @protected
 */
bloombox.telemetry.BaseEvent.prototype.validateContext = function(context) {
  // fingerprint and session are always required
  if (!context.getFingerprint())
    throw new bloombox.telemetry.ContextException(
      'Missing device fingerprint ID.');
  if (!context.getGroup())
    throw new bloombox.telemetry.ContextException(
      'Missing device session ID.');
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



// - Generic Events - //
/**
 * Generic telemetry service event record, for basic event-style analytics.
 *
 * @param {bloombox.telemetry.Collection} collection Collection to assign this
 *        event to.
 * @param {Object=} opt_payload Payload to attach to this event, if any.
 * @param {?bloombox.telemetry.Context=} opt_context Additional context to apply
 *        to the default set that is sent globally.
 * @param {number=} opt_occurred Millisecond-resolution timestamp for when this
 *        event occurred. If none is provided, a timestamp is taken upon event
 *        construction.
 * @constructor
 * @extends {bloombox.telemetry.BaseEvent<proto.bloombox.analytics.generic.Event>}
 * @export
 */
bloombox.telemetry.Event = function Event(collection,
                                          opt_payload,
                                          opt_context,
                                          opt_occurred) {
  /**
   * Event collection to specify.
   *
   * @type {bloombox.telemetry.Collection}
   * @public
   */
  this.collection = collection;

  /**
   * Timestamp for when this event occurred. If none is given, a timestamp is
   * generated when the event is constructed.
   *
   * @type {number}
   * @public
   */
  this.occurred = opt_occurred || +(new Date());

  // generate a super context considering the local collection
  let supercontext = new bloombox.telemetry.Context(
    this.collection);

  bloombox.telemetry.BaseEvent.apply(
    this,
    [supercontext,
     bloombox.telemetry.Routine.EVENT,
     opt_payload,
     this.occurred]);
};
goog.inherits(bloombox.telemetry.Event, bloombox.telemetry.BaseEvent);


// noinspection JSUnusedGlobalSymbols
/**
 * Return the corresponding RPC method for a generic event.
 *
 * @return {bloombox.telemetry.Routine} RPC routine for this event.
 */
bloombox.telemetry.Event.prototype.rpcMethod = function() {
  return bloombox.telemetry.Routine.EVENT;
};


/**
 * Indicate whether this event is bound for an internal event collection.
 *
 * @return {boolean} True if this is an internal event.
 * @private
 */
bloombox.telemetry.Event.prototype.isInternalEvent_ = function() {
  return this.collection.name.startsWith((
      bloombox.telemetry.InternalCollectionPrefix));
};


// noinspection JSUnusedGlobalSymbols
/**
 * Additionally validate that partner and location codes are present for non-
 * internal event collections.
 *
 * @param {proto.bloombox.analytics.Context} context Final context to
 *        validate.
 * @throws {bloombox.telemetry.ContextException} If required context is missing
 *         or context values are invalid.
 * @protected
 * @override
 */
bloombox.telemetry.Event.prototype.validateContext = function(context) {
  // validate context w/super method first
  bloombox.telemetry.BaseEvent.prototype
    .validateContext.apply(this, [context]);

  // then validate that we're either pushing an internal event, or we have a
  // valid partner and location code
  if (!this.isInternalEvent_) {
    // get location key
    let contextKey = context.getScope().getPartner();
    if (contextKey.indexOf('partner/') === -1 ||
        contextKey.indexOf('location/') === -1)
      // we are missing a location key or code
      throw new bloombox.telemetry.ContextException(
        'Must specify a location code before sending analytics events.');
  }
  // if we get here, everything is a-o-k.
};


/**
 * Export this generic event as a
 * `proto.bloombox.analytics.generic.Event`, suitable for sending to the
 * telemetry service. This includes:
 * - Rendering the context with `renderContext`
 * - Rendering the payload with `renderPayload`
 * - Rendering the occurrence with `renderOccurrence`
 * - Filling out the proto and related sub-protos
 *
 * @return {proto.bloombox.analytics.generic.Event} Prepared event.
 */
bloombox.telemetry.Event.prototype.export = function() {
  // create our objects
  let event = new proto.bloombox.analytics.generic.Event();
  let occurrence = new proto.opencannabis.temporal.Instant();

  // render local values
  let payload = this.renderPayload();
  let occurred = this.renderOccurrence(+(new Date()));
  occurrence.setTimestamp(occurred);

  // set payload
  if (payload && typeof payload === 'object') {
    event.setPayload(proto.google.protobuf.Struct.fromJavaScript(payload));
  }

  // setup event parameters
  event.setOccurred(occurrence);
  return event;
};


/**
 * Provide the attached payload, if any, as the final payload to send for the
 * event, along with serialized event context.
 *
 * @return {?Object} Either `null`, indicating no payload should be attached, or
 * the attached payload object, provided at construction time.
 * @override
 * @public
 */
bloombox.telemetry.Event.prototype.renderPayload = function() {
  return {'event': {'payload': this.payload}};
};


/**
 * Prefix to use for internal collection names.
 *
 * @const {string}
 * @package
 */
bloombox.telemetry.InternalCollectionPrefix = '_bloom_';


/**
 * Separator to use for internal collection names.
 *
 * @const {string}
 * @private
 */
bloombox.telemetry.InternalCollectionSeparator_ = ':';


/**
 * Version to use for internal collection names.
 *
 * @const {string}
 * @private
 */
bloombox.telemetry.InternalCollectionVersion_ = 'v1beta4';


/**
 * Separator to use for internal collection names.
 *
 * @param {string} name Actual name to give the collection.
 * @return {string} Constructed collection name.
 */
bloombox.telemetry.internalCollectionName = function(name) {
  return [
    bloombox.telemetry.InternalCollectionPrefix,
    bloombox.telemetry.InternalCollectionVersion_,
    name
  ].join(bloombox.telemetry.InternalCollectionSeparator_);
};



/**
 * Internal event collections used for various metrics and counters.
 *
 * @enum {string}
 * @public
 */
bloombox.telemetry.InternalCollection = {
  LIBRARY: bloombox.telemetry.internalCollectionName('library'),
  PAGEVIEW: bloombox.telemetry.internalCollectionName('pageview'),
  SERVICE: bloombox.telemetry.internalCollectionName('service'),
  ORDERS: bloombox.telemetry.internalCollectionName('orders'),
  ENROLLMENT: bloombox.telemetry.internalCollectionName('enrollment'),
  VERIFICATION: bloombox.telemetry.internalCollectionName('verification')
};


if (bloombox.rpc.FALLBACK) {
  /**
   * Send a `PING` message to the telemetry service to check connectivity and
   * warm the connection.
   *
   * @param {function(number, *)} callback Callback to dispatch once we receive
   *        the corresponding PONG.
   * @param {?bloombox.telemetry.TelemetryOptions=} options Options or settings
   *        to specify for this ping invocation only.
   * @return {Promise<?number>} Promise attached to the underlying RPC call.
   */
  bloombox.telemetry.pingLegacy = function(callback, options) {
    // make an RPC so we can send it via the pool
    let rpc = new bloombox.telemetry.rpc.TelemetryRPC(
      bloombox.util.generateUUID(),
      bloombox.telemetry.Routine.PING,
      bloombox.telemetry.onPingSuccess_(callback),
      bloombox.telemetry.onPingError_);
    return bloombox.telemetry.enqueue(rpc, options);
  };


  /**
   * Handle a ping failure.
   *
   * @private
   */
  bloombox.telemetry.onPingError_ = function() {
    bloombox.logging.warn('Telemetry ping failed.');
  };


  /**
   * Handle a ping success.
   *
   * @param {function(number, *)} callback Callback to dispatch with the latency
   *        between the PING and the PONG.
   * @return {function()} Wrapped callback to dispatch.
   * @private
   */
  bloombox.telemetry.onPingSuccess_ = function(callback) {
    /**
     * Responder function.
     */
    function respond() {
      // record the pong
      bloombox.telemetry.internals.stats.recordPong();
      let stats = bloombox.telemetry.internals.statistics();
      let latency = stats.lastPong - stats.lastPing;
      callback(latency, null);
    }
    return respond;
  };


  /**
   * Utility function to factory a generic event.
   *
   * @param {string|bloombox.telemetry.Collection} collection Collection to add
   *        this event to.
   * @param {Object=} opt_payload Payload to attach to this event, if any.
   * @param {bloombox.telemetry.Context=} opt_context Optional context to merge
   *        into global context before sending this event.
   * @param {number=} opt_occurred Occurrence timestamp, if any. If none is
   *        provided, a timestamp is taken when the event is constructed, which
   *        happens in this method.
   * @return {bloombox.telemetry.Event} Resulting event.
   */
  bloombox.telemetry.eventLegacy = function(collection,
                                            opt_payload,
                                            opt_context,
                                            opt_occurred) {
    let resolvedCollection = typeof collection !== 'string' ? collection : (
      bloombox.telemetry.Collection.named(/** @type {string} */ (collection)));
    return new bloombox.telemetry.Event(
      resolvedCollection, opt_payload, null, opt_occurred);
  };

  /**
   * Defines an implementation of the Bloombox Telemetry API, against the v0
   * RESTful API interface which is now deprecated. This class is written as an
   * adapter to the old code from the new style of dispatch in v2 of the JS SDK.
   *
   * Only Event Telemetry is implemented in the v0 adapter. For commercial or
   * other kinds of telemetry, the v1 RPC-based API must be used.
   *
   * @implements bloombox.telemetry.EventTelemetryAPI
   */
  bloombox.telemetry.v1beta0.EventService = (class EventTelemetryV0 {
    /**
     * Construct a new instance of the `v1beta0` Event Telemetry API service. The
     * instance is pre-configured with requisite top-level config and afterwards
     * ready to make calls out to remote services.
     *
     * @param {bloombox.config.JSConfig} sdkConfig JavaScript SDK config.
     */
    constructor(sdkConfig) {
      // noinspection JSUnusedGlobalSymbols
      /**
       * Active JS SDK configuration.
       *
       * @private
       * @type {bloombox.config.JSConfig}
       */
      this.sdkConfig = sdkConfig;
    }

    // -- API: Ping -- //
    /**
     * Send a ping message to the server, hoping to get a unary ping response
     * back which simply acknowledges our original ping message upstream. This
     * is one way of measuring latency between the client and event server, and
     * also generally makes sure the connection is established and hot.
     *
     * The response callback accepts two parameters: the latency of a successful
     * ping cycle, or, alternatively, the error encountered. Only one parameter
     * is passed during a given callback invocation.
     *
     * @param {?bloombox.telemetry.PingCallback=} callback Callback to dispatch
     *        once a ping response is received, or a terminal error occurs.
     * @param {?bloombox.telemetry.TelemetryOptions=} options Options or
     *        settings to specify for this ping invocation only. Optional. If no
     *        options are specified, sensible defaults are generated and used.
     * @return {Promise<?number>} Promise attached to the underlying RPC call.
     * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
     *         the underlying RPC, or during transmission.
     */
    ping(callback, options) {
      return new Promise((resolve, reject) => {
        return bloombox.telemetry.pingLegacy((latency, err) => {
          if (latency > -1) {
            if (callback) callback(latency, null);
            resolve(latency);
          } else {
            if (callback) callback(-1, err);
            reject(err);
          }
        }, options);
      });
    }

    // -- API: Generic Events -- //
    /**
     * Send an arbitrary event payload, with the given event collection
     * specified. Any arbitrary payload may be provided as long as it is JSON
     * serializable and composed of only native types.
     *
     * The event collection and occurrence timestamp are fully in the invoking
     * code's control. Ingest timestamps and other values are auto-generated
     * upon event transmission, but the content of the event is essentially
     * free-form.
     *
     * @param {bloombox.telemetry.Collection} collection Event collection to
     *        append this event to. Users can prepare this object easily.
     * @param {Object=} payload Payload to send with the event.
     * @param {number=} occurred Occurrence timestamp for this event, in ms.
     * @param {?bloombox.telemetry.TelemetryOptions=} options Config settings
     *        and options for the telemetry API to apply to this individual RPC.
     * @param {?bloombox.telemetry.EventCallback=} callback Function to dispatch
     *        once a result or terminal error state has been reached. Optional.
     * @return {Promise<proto.google.protobuf.Empty>} Promise attached to the
     *        underlying RPC call.
     * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
     *         the underlying RPC, or during transmission.
     */
    event(collection, payload, occurred, callback, options) {
      return new Promise((resolve, reject) => {
        const context = bloombox.telemetry.globalContext();
        const ev = bloombox.telemetry.eventLegacy(
          collection,
          payload || null,
          context || null,
          occurred || +(new Date()));

        const eventRpc = ev.generateRPC();
        const promise = bloombox.telemetry.enqueue(eventRpc, options);
        promise.then((done) => {
          resolve(done);
        });
        promise.catch((err) => {
          reject(err);
        });
        return promise;
      });
    }
  });
}
