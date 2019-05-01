
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
 * Bloombox: Event Telemetry RPC Client, v1beta4
 *
 * @fileoverview Provides an implementation of the Bloombox Event Telemetry RPC
 *               client, using modern gRPC-based transport interfaces.
 */

/*global goog */

goog.require('bloombox.API_ENDPOINT');
goog.require('bloombox.SERVICE_MODE');

goog.require('bloombox.rpc.RPCException');
goog.require('bloombox.rpc.context');
goog.require('bloombox.rpc.metadata');

goog.require('bloombox.telemetry.EventTelemetryAPI');
goog.require('bloombox.telemetry.globalContext');

goog.require('bloombox.util.generateUUID');

goog.require('proto.bloombox.analytics.Context');
goog.require('proto.bloombox.analytics.Scope');
goog.require('proto.bloombox.analytics.generic.Event');
goog.require('proto.bloombox.services.telemetry.v1beta4.Event.Request');
goog.require('proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient');
goog.require('proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Request');
goog.require('proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Response');
goog.require('proto.opencannabis.temporal.Instant');

goog.provide('bloombox.telemetry.v1beta4.EventService');


// -- API Surface: Shop v1 -- //
/**
 * Provides an implementation of the Event Telemetry API atop the newer, gRPC-
 * based interfaces that define Bloombox Cloud's edge boundary with the outside
 * world. This service can be used to transmit event-style information to the
 * Cloud in an efficient way, with arbitrary payload data attached.
 *
 * For more information about the capabilities and use cases for this API,
 * examine the interface definition it implements.
 *
 * @implements bloombox.telemetry.EventTelemetryAPI
 */
bloombox.telemetry.v1beta4.EventService = (class EventServiceV1 {
  /**
   * Construct a new instance of the `v1beta4` Event Telemetry API. Make sure
   * the service is pre-configured with any necessary properties to facilitate
   * RPC operations.
   *
   * @param {bloombox.config.JSConfig} sdkConfig JavaScript SDK config.
   */
  constructor(sdkConfig) {
    /**
     * Active JS SDK configuration.
     *
     * @private
     * @type {bloombox.config.JSConfig}
     */
    this.sdkConfig = sdkConfig;

    /**
     * RPC client for event telemetry operations.
     *
     * @type {proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient}
     */
    this.client = (
      new proto.bloombox.services.telemetry.v1beta4.EventTelemetryPromiseClient(
        bloombox.API_ENDPOINT,
        null,
        {'format': bloombox.SERVICE_MODE}));
  }

  // -- API: Ping -- //
  /**
   * Send a ping message to the server, hoping to get a unary ping response back
   * which simply acknowledges our original ping message upstream. This is one
   * way of measuring latency between the client and event server, and also
   * generally makes sure the connection is established and hot.
   *
   * The response callback accepts two parameters: the latency of a successful
   * ping cycle, or, alternatively, the error encountered. Only one parameter is
   * passed during a given callback invocation.
   *
   * @param {?bloombox.telemetry.PingCallback=} callback Callback to dispatch
   *        once a ping response is received, or a terminal error occurs.
   * @param {?bloombox.telemetry.TelemetryOptions=} options Options or settings
   *        to specify for this ping invocation only. Optional. If no options
   *        are specified, sensible defaults are generated and used.
   * @return {Promise<?number>} Promise attached to the underlying RPC call.
   * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
   *         the underlying RPC, or during transmission.
   */
  ping(callback, options) {
    return new Promise((resolve, reject) => {
      // fire off the ping
      const beforeTs = +(new Date());
      const request = (
        new proto.bloombox.services.telemetry.v1beta4.TelemetryPing.Request());
      const promise = this.client.ping(
        request, bloombox.rpc.metadata(this.sdkConfig));

      // handle response
      promise.then(() => {
        const afterTs = +(new Date());
        const deltaTs = afterTs - beforeTs;

        resolve(deltaTs);
        if (callback) callback(deltaTs, null);
      });

      // handle errors
      promise.catch((err) => {
        reject(err);
        if (callback) callback(-1, err);
      });

      return promise;
    });
  }

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
   * @param {bloombox.telemetry.Collection} collection Event collection to
   *        append this event to. Users can prepare this object easily.
   * @param {Object=} payload Payload to send with the event.
   * @param {number=} occurred Occurrence timestamp for this event, in ms.
   * @param {?bloombox.telemetry.TelemetryOptions=} options Config settings and
   *        options for the telemetry API to apply to this individual RPC.
   * @param {?bloombox.telemetry.EventCallback=} callback Function to dispatch
   *        once a result or terminal error state has been reached. Optional.
   * @return {Promise<proto.google.protobuf.Empty>} Promise attached to the
   *         underlying RPC call.
   * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
   *         the underlying RPC, or during transmission.
   */
  event(collection, payload, occurred, callback, options) {
    const request = (
      new proto.bloombox.services.telemetry.v1beta4.Event.Request());
    const ev = new proto.bloombox.analytics.generic.Event();
    const collectionSpec = collection.export();
    const resolved = bloombox.rpc.context(options);

    // setup partnership context
    const scopeInfo = new proto.bloombox.analytics.Scope();
    scopeInfo.setPartner(
      `partner/${resolved.partner}/location/${resolved.location}`);

    // attach payload if specified
    if (payload)
      ev.setPayload(proto.google.protobuf.Struct.fromJavaScript(payload));

    // build context and attach
    const eventContext = bloombox.telemetry.globalContext().export();
    eventContext.setScope(scopeInfo);
    eventContext.setCollection(collectionSpec);
    request.setContext(eventContext);

    // calculate or build occurrence timestamp
    const occurredTs = occurred || +(new Date());
    const position = new proto.opencannabis.temporal.Instant();
    position.setTimestamp(occurredTs);
    ev.setOccurred(position);

    // generate an event UUID
    const uuid = bloombox.util.generateUUID();
    request.setUuid(uuid);
    request.setEvent(ev);

    // fire it off
    const promise = this.client.event(
      request, bloombox.rpc.metadata(this.sdkConfig));

    promise.then(() => {
      if (callback) callback(true, null);
    });
    promise.catch((err) => {
      if (callback) callback(false, err);
    });
    return promise;
  }
});
