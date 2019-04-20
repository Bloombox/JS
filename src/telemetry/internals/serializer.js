
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
 * Bloombox Telemetry: Event Serializer
 *
 * @fileoverview Provides routines to serialize and manage event payloads.
 */

/*global goog */

goog.require('bloombox.logging.error');

goog.require('proto.bloombox.analytics.generic.Event');
goog.require('proto.bloombox.analytics.generic.Exception');

goog.require('proto.bloombox.analytics.order.Action');

goog.require('proto.bloombox.analytics.product.Action');
goog.require('proto.bloombox.analytics.product.Impression');
goog.require('proto.bloombox.analytics.product.View');

goog.require('proto.bloombox.analytics.section.Action');
goog.require('proto.bloombox.analytics.section.Impression');
goog.require('proto.bloombox.analytics.section.View');

goog.require('proto.bloombox.services.telemetry.v1beta4.TelemetryEvent');

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
 * @param {proto.bloombox.analytics.Context=} opt_context Analytics
 *        context to apply to the resulting event, if any.
 * @param {boolean=} opt_err Whether to throw an exception if the event cannot
 *        be resolved or otherwise serialized. Defaults to `true`.
 * @throws {bloombox.telemetry.internals.SerializationException} When an error
 *        occurs while serializing the event, if `opt_throw` is truthy.
 * @return {?proto.bloombox.services.telemetry.v1beta4.TelemetryEvent}
 *        The resulting telemetry event, or `null` if a failure occurred, and
 *        `opt_throw` was falsy.
 */
bloombox.telemetry.internals.serializeGeneric = function(type,
                                                         value,
                                                         opt_context,
                                                         opt_err) {
  let doThrow = (opt_err === undefined ? true : opt_err);
  let event = (
    new proto.bloombox.services.telemetry.v1beta4.TelemetryEvent());
  switch (type) {
    case bloombox.telemetry.internals.EventTypeProperty.EVENT:
      event.setGeneric(
        /** @type {!proto.bloombox.analytics.generic.Event} */ (value));
      break;
    case bloombox.telemetry.internals.EventTypeProperty.EXCEPTION:
      event.setError(
        /** @type {!proto.bloombox.analytics.generic.Exception} */ (
          value));
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
