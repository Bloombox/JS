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

goog.require('bloombox.rpc.ScopedOptions');

goog.provide('bloombox.telemetry.TelemetryConfig');
goog.provide('bloombox.telemetry.TelemetryOptions');


// -- Definitions/ Structures -- //
/**
 * Specifies a simple record type, which is inflatable into a full settings
 * object which specifies options for sending events.
 *
 * @public
 * @typedef {{scope: ?string}}
 */
bloombox.telemetry.TelemetryConfig;


/**
 * Defines the interface for a basic event callback, which is dispatched once a
 * given event is transmitted successfully to the server. The callback consists
 * of two items: a boolean flag indicating whether the event was submitted
 * without error (`true` if no error was encountered), and the error, if
 * applicable.
 *
 * The callback will only ever get one of the two parameters defined. If the RPC
 * transaction completes at all without error, `true` or `false` is passed as
 * the first parameter. If not, the error that occurred is passed as the second.
 *
 * @typedef {function(boolean, *)}
 */
bloombox.telemetry.EventCallback;


/**
 * Options object, which describes configuration values to override or set for a
 * given Telemetry API operation. The override-able config values are described
 * as individual properties.
 *
 * @export
 * @extends {bloombox.rpc.ScopedOptions}
 */
bloombox.telemetry.TelemetryOptions = (
  class TelemetryOptions extends bloombox.rpc.ScopedOptions {
    /**
     * Build a telemetry options object from scratch, with the ability to
     * specify the full set of configuration parameters/options.
     *
     * @param {?string=} scope Partnership scope override for this RPC.
     */
    constructor(scope) {
      super(scope || null);
    }

    /**
     * Generate a set of default options for a given Telemetry RPC operation.
     * The items set in the default config and their values should both be
     * sensible for the majority case of method calls.
     *
     * @export
     * @returns {bloombox.telemetry.TelemetryOptions} Default options.
     */
    static defaults() {
      return new bloombox.telemetry.TelemetryOptions(
        null  /* do not override scope by default */);
    }

    /**
     * Inflate a Telemetry RPC options object from a raw object, which may
     * specify one or more settings that correspond to keys in the the flat
     * configuration object type definition for the Telemetry API.
     *
     * @export
     * @param {bloombox.telemetry.TelemetryConfig} record Configuration object
     *        to read from.
     * @returns {bloombox.telemetry.TelemetryOptions} Inflated configuration
     *          options to apply to a given RPC.
     */
    static fromObject(record) {
      return new bloombox.telemetry.TelemetryOptions(
        record['scope'] || null);
    }

    /**
     * Serialize these Telemetry RPC options into a flat object, complying with
     * the keys specified in the flat object type definition for configuration
     * values for the Telemetry API.
     *
     * @returns {{scope: ?string}}
     */
    toObject() {
      return {
        'scope': this.scope};
    }
  });
