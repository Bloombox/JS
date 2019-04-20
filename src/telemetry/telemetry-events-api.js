
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
 * Bloombox: Event Telemetry API
 *
 * @fileoverview Provides interface definitions for arbitrary telemetry events,
 *               which can assume any payload desired.
 */

/*global goog */

goog.require('bloombox.base.ServiceInterface');
goog.require('bloombox.rpc.ScopedOptions');
goog.require('bloombox.telemetry.TelemetryConfig');
goog.require('bloombox.telemetry.TelemetryOptions');
goog.provide('bloombox.telemetry.EventTelemetryAPI');


/**
 * Defines a callback interface when performing a "ping" cycle with the Bloombox
 * Cloud. Pings help keep the connection alive, or force it to establish, in
 * circumstances where we will be sending events and want the connection live,
 * but have nothing to send yet.
 *
 * Like most callbacks in this library, two parameters are specified: the time-
 * stamp from the ping response, or an error. Only one of these parameters is
 * passed per invocation.
 *
 * @typedef {function(number, *)}
 */
bloombox.telemetry.PingCallback;


// -- API Surface -- //
/**
 * Defines the Event Telemetry API, which accepts arbitrary event payloads for
 * analytics telemetry placement. Each payload submitted through this interface
 * is expected to have an event "collection," which roughly groups like events
 * across functional or platform boundaries.
 *
 * The Event Telemetry API is used internally by Bloombox, but can also be used
 * by cannabis business operators or business users to record their own events.
 * These events are attributed and placed in the global timeline along with the
 * standard events recorded by Bloombox's software and hardware agents.
 *
 * @interface
 * @extends bloombox.base.ServiceInterface
 */
bloombox.telemetry.EventTelemetryAPI = (class EventTelemetry {
  // -- API: Ping -- //
  /**
   * Send a ping message to the server, hoping to get a unary ping response back
   * which simply acknowledges our original ping message upstream. This is one
   * way of measuring latency between the client and event server, and also
   * generally makes sure the connection is established and hot.
   *
   * @param {?bloombox.telemetry.PingCallback=} callback Callback to dispatch
   *        once a ping response is received, or a terminal error occurs.
   * @param {?bloombox.telemetry.TelemetryOptions=} options Options or settings
   *        to specify for this ping invocation only. Optional. If no options
   *        are specified, sensible defaults are generated and used.
   */
  ping(callback, options) {}

  // -- API: Generic Events -- //
  /**
   * Send an arbitrary event payload, with the given event collection specified.
   * Any arbitrary payload may be provided as long as it is JSON serializable
   * and composed of only native types.
   *
   * The event collection and occurrence timestamp are fully in the invoking
   * code's control. Ingest timestamps and other values are auto-generated upon
   * event transmission, but the content of the event is essentially free-form.
   *
   * @param {string} collection Event collection to append this event to.
   * @param {number=} occurred Occurrence timestamp for this event, in ms.
   * @param {Object=} payload Payload to send with the event.
   * @param {?bloombox.telemetry.TelemetryOptions=} options Config settings and
   *        options for the telemetry API to apply to this individual RPC.
   * @param {?bloombox.telemetry.EventCallback=} callback Function to dispatch
   *        once a result or terminal error state has been reached. Optional.
   * @return {Promise<proto.bloombox.services.shop.v1.ShopInfo.Response>}
   *         Promise attached to the underlying RPC call.
   */
  event(collection, occurred, payload, callback, options) {}
});
