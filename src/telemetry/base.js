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
 * Bloombox: Telemetry Client
 *
 * @fileoverview Provides the Bloombox Telemetry API JS client.
 */

/*global goog */

goog.provide('bloombox.telemetry.BATCH_SIZE');
goog.provide('bloombox.telemetry.DEBUG');
goog.provide('bloombox.telemetry.InternalCollection');
goog.provide('bloombox.telemetry.MAX_XHRs');
goog.provide('bloombox.telemetry.OperationStatus');
goog.provide('bloombox.telemetry.Routine');
goog.provide('bloombox.telemetry.TELEMETRY_API_ENDPOINT');
goog.provide('bloombox.telemetry.TELEMETRY_API_VERSION');
goog.provide('bloombox.telemetry.VERSION');
goog.provide('bloombox.telemetry.XHR_DEBOUNCE');
goog.provide('bloombox.telemetry.XHR_RETRIES');
goog.provide('bloombox.telemetry.XHR_TIMEOUT');

goog.require('bloombox.API_ENDPOINT');
goog.require('bloombox.DEBUG');

goog.require('proto.bloombox.services.telemetry.v1beta4.OperationStatus');



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
bloombox.telemetry.VERSION = 'v1beta4r2';


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
bloombox.telemetry.TELEMETRY_API_VERSION = 'v1beta4';


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
bloombox.telemetry.InternalCollectionVersion_ = 'v1beta4';


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
  PAGEVIEW: bloombox.telemetry.internalCollectionName('pageview'),
  SERVICE: bloombox.telemetry.internalCollectionName('service'),
  ORDERS: bloombox.telemetry.internalCollectionName('orders'),
  ENROLLMENT: bloombox.telemetry.internalCollectionName('enrollment'),
  VERIFICATION: bloombox.telemetry.internalCollectionName('verification')
};


/**
 * Enumerates operation statuses that result from Telemetry API RPC calls.
 *
 * @enum {proto.bloombox.services.telemetry.v1beta4.OperationStatus}
 */
bloombox.telemetry.OperationStatus = {
  OK: proto.bloombox.services.telemetry.v1beta4.OperationStatus.OK,
  ERROR: proto.bloombox.services.telemetry.v1beta4.OperationStatus.ERROR
};


/**
 * Enumerates methods in the Telemetry API.
 *
 * @enum {string}
 */
bloombox.telemetry.Routine = {
  PING: 'PING',
  EVENT: 'EVENT',
  EXCEPTION: 'EXCEPTION',
  SECTION_IMPRESSION: 'SECTION_IMPRESSION',
  SECTION_VIEW: 'SECTION_VIEW',
  SECTION_ACTION: 'SECTION_ACTION',
  PRODUCT_IMPRESSION: 'PRODUCT_IMPRESSION',
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  PRODUCT_ACTION: 'PRODUCT_ACTION',
  USER_ACTION: 'USER_ACTION',
  ORDER_ACTION: 'ORDER_ACTION'
};
