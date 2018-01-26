
/*
 * Copyright 2018, Bloombox, LLC. All rights reserved.
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
 * Bloombox Telemetry Services: Ping
 *
 * @fileoverview Provides tools for interacting with the Telemetry ping methods.
 */

/*global goog */

goog.require('bloombox.logging.warn');

goog.require('bloombox.telemetry.Routine');

goog.require('bloombox.telemetry.enqueue');

goog.require('bloombox.telemetry.internals.statistics');
goog.require('bloombox.telemetry.internals.stats.recordPong');

goog.require('bloombox.telemetry.rpc.TelemetryRPC');

goog.require('bloombox.util.generateUUID');

goog.provide('bloombox.telemetry.ping');

/**
 * Send a `PING` message to the telemetry service to check connectivity and warm
 * the connection.
 *
 * @param {function(number)} callback Callback to dispatch once we receive the
 *        corresponding PONG.
 * @export
 */
bloombox.telemetry.ping = function(callback) {
  // make an RPC so we can send it via the pool
  let rpc = new bloombox.telemetry.rpc.TelemetryRPC(
    bloombox.util.generateUUID(),
    bloombox.telemetry.Routine.PING,
    bloombox.telemetry.onPingSuccess_(callback),
    bloombox.telemetry.onPingError_);
  bloombox.telemetry.enqueue(rpc);
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
 * @param {function(number)} callback Callback to dispatch with the latency
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
    callback(latency);
  }

  return respond;
};
