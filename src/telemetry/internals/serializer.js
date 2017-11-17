
/**
 * Bloombox Telemetry: Event Serializer
 *
 * @fileoverview Provides routines to serialize and manage event payloads.
 */

/*global goog */

goog.require('bloombox.logging.error');

goog.require('proto.analytics.Event');
goog.require('proto.analytics.Exception');

goog.require('proto.analytics.order.Action');

goog.require('proto.analytics.pipeline.TelemetryEvent');

goog.require('proto.analytics.product.Action');
goog.require('proto.analytics.product.Impression');
goog.require('proto.analytics.product.View');

goog.require('proto.analytics.section.Action');
goog.require('proto.analytics.section.Impression');
goog.require('proto.analytics.section.View');

goog.provide('bloombox.telemetry.internals.EventTypeProperty');
goog.provide('bloombox.telemetry.internals.SerializationException');


/**
 * Enumerates event property by type.
 *
 * @enum {string}
 * @package
 */
bloombox.telemetry.internals.EventTypeProperty = {
  EVENT: 'genericEvent',
  EXCEPTION: 'genericError',
  SECTION_IMPRESSION: 'sectionImpression',
  SECTION_VIEW: 'sectionView',
  SECTION_ACTION: 'sectionAction',
  PRODUCT_IMPRESSION: 'productImpression',
  PRODUCT_VIEW: 'productView',
  PRODUCT_ACTION: 'productAction',
  ORDER_ACTION: 'orderAction'
};


// noinspection GjsLint
/**
 * Exception that is thrown if an error is encountered during object
 * serialization.
 *
 * @param {string} message Message for the error.
 * @param {bloombox.telemetry.internals.EventTypeProperty} type Type of event
 *        that had trouble serializing.
 * @param {Object} value Event object that had trouble serializing.
 * @constructor
 */
bloombox.telemetry.internals.SerializationException = function SerializationException(message, type, value) {
  /**
   * Message for the exception.
   *
   * @type {string}
   */
  this.message = message;

  /**
   * Type of event that had trouble serializing.
   *
   * @type {bloombox.telemetry.internals.EventTypeProperty}
   */
  this.type = type;

  /**
   * Event object that had trouble serializing.
   *
   * @type {Object}
   */
  this.value = value;
};


/**
 * Serialize an event record into a generic TelemetryEvent.
 *
 * @param {bloombox.telemetry.internals.EventTypeProperty} type
 * @param {Object} value
 * @param {proto.analytics.Context=} opt_context Analytics context to apply to
 *        the resulting event, if any.
 * @param {boolean=} opt_err Whether to throw an exception if the event cannot
 *        be resolved or otherwise serialized. Defaults to `true`.
 * @throws {bloombox.telemetry.internals.SerializationException} When an error
 *        occurs while serializing the event, if `opt_throw` is truthy.
 * @return {?proto.analytics.pipeline.TelemetryEvent} The resulting telemetry
 *        event, or `null` if a failure occurred, and `opt_throw` was falsy.
 */
bloombox.telemetry.internals.serializeGeneric = function(type,
                                                         value,
                                                         opt_context,
                                                         opt_err) {
  let doThrow = (opt_err === undefined ? true : opt_err);
  let event = new proto.analytics.pipeline.TelemetryEvent();
  switch (type) {
    case bloombox.telemetry.internals.EventTypeProperty.EVENT:
      event.setGenericEvent(/** @type {!proto.analytics.Event} */ (value));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.EXCEPTION:
      event.setGenericError(/** @type {!proto.analytics.Exception} */ (value));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.SECTION_IMPRESSION:
      event.setSectionImpression((
        /** @type {!proto.analytics.section.Impression} */ (value)));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.SECTION_VIEW:
      event.setSectionView((
        /** @type {!proto.analytics.section.View} */ (value)));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.SECTION_ACTION:
      event.setSectionAction((
        /** @type {!proto.analytics.section.Action} */ (value)));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.PRODUCT_IMPRESSION:
      event.setProductImpression((
        /** @type {!proto.analytics.product.Impression} */ (value)));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.PRODUCT_VIEW:
      event.setProductView((
        /** @type {!proto.analytics.product.View} */ (value)));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.PRODUCT_ACTION:
      event.setProductAction((
        /** @type {!proto.analytics.product.Action} */ (value)));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.ORDER_ACTION:
      event.setOrderAction((
        /** @type {!proto.analytics.product.Action} */ (value)));
      break;
    default:
      bloombox.logging.error(
        'Unrecognized event type, cannot serialize: ', type);
      if (doThrow) {
        throw new bloombox.telemetry.internals.SerializationException(
          'Unable to serialize generic TelemetryEvent.',
          type,
          value);
      }
      return null;  // if doThrow is false, return null
  }
  if (opt_context !== undefined) {
    // apply the context
    event.setContext(opt_context);
  }
  return event;
};
