
/**
 * Bloombox Telemetry Services: Events
 *
 * @fileoverview Provides tools for interacting with the Telemetry Events
 * API service.
 */

/*global goog */

goog.require('bloombox.telemetry.BaseEvent');
goog.require('bloombox.telemetry.Collection');
goog.require('bloombox.telemetry.globalContext');

goog.require('bloombox.util.Exportable');

goog.require('proto.analytics.Event');
goog.require('proto.google.protobuf.Struct');
goog.require('proto.services.telemetry.v1beta1.Event.Request');
goog.require('proto.temporal.Instant');

goog.provide('bloombox.telemetry.Event');


// - Generic Events - //
/**
 * Generic telemetry service event record, for basic event-style analytics.
 *
 * @param {bloombox.telemetry.Collection} collection Collection to assign this
 *        event to.
 * @param {Object=} opt_payload Payload to attach to this event, if any.
 * @param {Object=} opt_context Additional context to apply to the default set
 *        that is sent globally.
 * @param {number} opt_occurred Millisecond-resolution timestamp for when this
 *        event occurred. If none is provided, a timestamp is taken upon event
 *        construction.
 * @constructor
 * @extends {bloombox.telemetry.BaseEvent}
 * @implements {bloombox.util.Exportable}
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
};
goog.inherits(bloombox.telemetry.Event, bloombox.telemetry.BaseEvent);


/**
 * Return the corresponding RPC method for a generic event.
 *
 * @return {bloombox.telemetry.Routine} RPC routine for this event.
 */
bloombox.telemetry.Event.prototype.rpcMethod = function() {
  return bloombox.telemetry.Routine['EVENT'];
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
  let payload = this.renderPayload();
  let renderedContext = this.renderContext(globalContextPb);
  let occurred = this.renderOccurrence(+(new Date()));
  occurrence.setTimestamp(occurred);
  let payloadStruct = proto.google.protobuf.Struct.fromJavaScript(payload);

  // setup event parameters
  if (payload !== null) event.setPayload(payloadStruct);
  event.setOccurred(occurrence);
  event.setContext(renderedContext);
  return event;
};


/**
 * Utility function to factory a generic event.
 *
 * @param {bloombox.telemetry.Collection} collection Collection to add this
 *        event to.
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
  let event = new bloombox.telemetry.Event(
    collection, opt_payload, opt_occurred);

  let request = new proto.services.telemetry.v1beta1.Event.Request();
  request.setEvent(event.export());

  return event;
};
