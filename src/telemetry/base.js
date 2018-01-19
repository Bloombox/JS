
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
 * Bloombox: Telemetry Client
 *
 * @fileoverview Provides the Bloombox Telemetry API JS client.
 */

/*global goog */

goog.provide('bloombox.telemetry.BATCH_SIZE');
goog.provide('bloombox.telemetry.DEBUG');
goog.provide('bloombox.telemetry.MAX_XHRs');
goog.provide('bloombox.telemetry.TELEMETRY_API_ENDPOINT');
goog.provide('bloombox.telemetry.TELEMETRY_API_VERSION');
goog.provide('bloombox.telemetry.VERSION');
goog.provide('bloombox.telemetry.XHR_DEBOUNCE');
goog.provide('bloombox.telemetry.XHR_RETRIES');
goog.provide('bloombox.telemetry.XHR_TIMEOUT');

goog.require('bloombox.API_ENDPOINT');
goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');



/**
 * Telemetry client debug flag.
 *
 * @const {boolean} Global switch for logging and other debug features.
 * @public
 */
bloombox.telemetry.DEBUG = bloombox.DEBUG;


/**
 * Telemetry client library version.
 *
 * @const {string} Telemetry client version string.
 * @export
 */
bloombox.telemetry.VERSION = 'v1beta3r1';


/**
 * Batch size for event queue operations.
 *
 * @const {number} Telemetry events to batch (when pulling off the queue).
 * @export
 */
bloombox.telemetry.BATCH_SIZE = 5;


/**
 * Debounce interval for analytics data transmission.
 *
 * @const {number} Debounce delay, in milliseconds.
 * @export
 */
bloombox.telemetry.XHR_DEBOUNCE = 1000 * 2.5  /** 2.5 seconds */;


/**
 * Maximum retry count for RPC methods.
 *
 * @const {number} Retry count maximum.
 * @export
 */
bloombox.telemetry.XHR_RETRIES = 3;


/**
 * Timeout value for Telemetry RPCs.
 *
 * @const {number} Timeout value, in milliseconds.
 * @export
 */
bloombox.telemetry.XHR_TIMEOUT = 1000 * 15  /** 15 seconds */;


/**
 * Maximum number of XHRs to enqueue at once.
 *
 * @type {number}
 */
bloombox.telemetry.MAX_XHRs = bloombox.telemetry.BATCH_SIZE;


/**
 * Telemetry API endpoint prefix.
 *
 * @define {string} Prefix for API interactions.
 * @public
 */
bloombox.telemetry.TELEMETRY_API_ENDPOINT = bloombox.API_ENDPOINT;


/**
 * Telemetry API version.
 *
 * @define {string} Version of the API to use.
 * @public
 */
bloombox.telemetry.TELEMETRY_API_VERSION = 'v1beta3';
