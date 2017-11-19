
/**
 * Bloombox Telemetry Services: Events
 *
 * @fileoverview Provides tools for interacting with the Telemetry Events
 * API service.
 */

/*global goog */

goog.require('bloombox.telemetry.BaseEvent');
goog.require('bloombox.telemetry.Collection');
goog.require('bloombox.telemetry.Context');
goog.require('bloombox.telemetry.ContextException');
goog.require('bloombox.telemetry.globalContext');

goog.require('bloombox.util.Exportable');

goog.require('proto.analytics.Context');
goog.require('proto.analytics.Event');
goog.require('proto.google.protobuf.Struct');
goog.require('proto.temporal.Instant');

goog.provide('bloombox.telemetry.Event');
goog.provide('bloombox.telemetry.InternalCollection');


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
 * @extends {bloombox.telemetry.BaseEvent<proto.analytics.Event>}
 * @public
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

  bloombox.telemetry.BaseEvent.apply(
    this,
    [new bloombox.telemetry.Context(),
     bloombox.telemetry.Routine.EVENT,
     opt_payload,
     this.occurred]);
};
goog.inherits(bloombox.telemetry.Event, bloombox.telemetry.BaseEvent);


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


/**
 * Additionally validate that partner and location codes are present for non-
 * internal event collections.
 *
 * @param {proto.analytics.Context} context Final context to validate.
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
    let locationKey = context.getLocation();
    if (!locationKey || !locationKey.getCode()) {
      // we are missing a location key or code
      throw new bloombox.telemetry.ContextException(
        'Must specify a location code before sending analytics events.');
    } else {
      // we have a location key and code
      let partnerKey = locationKey.getPartner();
      if (!partnerKey || !partnerKey.getCode()) {
        // we are missing a partner key or code
        throw new bloombox.telemetry.ContextException(
          'Must specify a partner code before sending analytics events.');
      }
    }
  }
  // if we get here, everything is a-o-k.
};


/**
 * Export this generic event as a `proto.analytics.Event`, suitable for sending
 * to the telemetry service. This includes:
 * - Rendering the context with `renderContext`
 * - Rendering the payload with `renderPayload`
 * - Rendering the occurrence with `renderOccurrence`
 * - Filling out the proto and related sub-protos
 *
 * @return {proto.analytics.Event} Prepared event.
 */
bloombox.telemetry.Event.prototype.export = function() {
  // capture global context
  let globalContext = bloombox.telemetry.globalContext();
  let globalContextPb = /** @type {proto.analytics.Context} */ (
    globalContext.export());

  // create our protos
  let event = new proto.analytics.Event();
  let occurrence = new proto.temporal.Instant();

  // render local values
  let renderedContext = this.renderContext(globalContextPb);
  let payload = this.renderPayload(renderedContext);
  let occurred = this.renderOccurrence(+(new Date()));
  occurrence.setTimestamp(occurred);

  // set payload
  if (payload && typeof payload === 'object') {
    event.setPayload(proto.google.protobuf.Struct.fromJavaScript(payload));
  }

  // setup event parameters
  event.setOccurred(occurrence);
  event.setContext(renderedContext);
  return event;
};


/**
 * Provide the attached payload, if any, as the final payload to send for the
 * event, along with serialized event context.
 *
 * @param {proto.analytics.Context} ctx Merged global and local context.
 * @return {?Object} Either `null`, indicating no payload should be attached, or
 * the attached payload object, provided at construction time.
 * @override
 * @public
 */
bloombox.telemetry.Event.prototype.renderPayload = function(ctx) {
  let occurrence = this.renderOccurrence(+(new Date()));
  let serializedContext = bloombox.telemetry.Context.serializeProto(ctx);

  let basePayload = {
    'context': serializedContext,
    'occurred': occurrence
  };

  if (this.payload)
    basePayload['payload'] = this.payload;
  return basePayload;
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
 * Separator to use for internal collection names.
 *
 * @const {string}
 * @private
 */
bloombox.telemetry.InternalCollectionVersion_ = 'v1beta1';


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
  SERVICE: bloombox.telemetry.internalCollectionName('service')
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
 * @export
 */
bloombox.telemetry.event = function(collection,
                                    opt_payload,
                                    opt_context,
                                    opt_occurred) {
  let resolvedCollection = typeof collection !== 'string' ? collection : (
    bloombox.telemetry.Collection.named(/** @type {string} */ (collection)));
  return new bloombox.telemetry.Event(
    resolvedCollection, opt_payload, null, opt_occurred);
};
