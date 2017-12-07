
/*
 * Copyright 2017, Bloombox, LLC. All rights reserved.
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

goog.require('bloombox.telemetry.BaseEvent');
goog.require('bloombox.telemetry.Collection');
goog.require('bloombox.telemetry.Context');
goog.require('bloombox.telemetry.ContextException');
goog.require('bloombox.telemetry.globalContext');

goog.require('bloombox.util.Exportable');

goog.require('proto.analytics.Context');
goog.require('proto.analytics.generic.Event');
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
 * @extends {bloombox.telemetry.BaseEvent<proto.analytics.generic.Event>}
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
 * Export this generic event as a `proto.analytics.generic.Event`, suitable for
 * sending to the telemetry service. This includes:
 * - Rendering the context with `renderContext`
 * - Rendering the payload with `renderPayload`
 * - Rendering the occurrence with `renderOccurrence`
 * - Filling out the proto and related sub-protos
 *
 * @return {proto.analytics.generic.Event} Prepared event.
 */
bloombox.telemetry.Event.prototype.export = function() {
  // create our protos
  let event = new proto.analytics.generic.Event();
  let occurrence = new proto.temporal.Instant();

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
  return {'payload': this.payload};
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
bloombox.telemetry.InternalCollectionVersion_ = 'v1beta3';


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
