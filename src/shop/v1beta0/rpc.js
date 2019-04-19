
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
 * Bloombox Shop: RPC
 *
 * @fileoverview Provides tools for low-level RPCs to the Shop API.
 */

/*global goog */

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

goog.require('bloombox.rpc.RPC');

goog.require('bloombox.shop.SHOP_API_ENDPOINT');
goog.require('bloombox.shop.SHOP_API_VERSION');
goog.require('bloombox.shop.VERSION');

goog.provide('bloombox.shop.Routine');
goog.provide('bloombox.shop.ShopRPCException');
goog.provide('bloombox.shop.endpoint');
goog.provide('bloombox.shop.rpc.ShopRPC');



/**
 * Enumerates methods in the Shop API.
 *
 * @enum {string}
 */
bloombox.shop.Routine = {
  VERIFY: 'VERIFY',
  SUBMIT_ORDER: 'SUBMIT_ORDER',
  GET_ORDER: 'GET_ORDER',
  ENROLL_USER: 'ENROLL_USER',
  CHECK_ZIP: 'CHECK_ZIP',
  SHOP_INFO: 'SHOP_INFO'
};


/**
 * Calculate a shop API endpoint, given an RPC method and the base API endpoint.
 *
 * @param {string} endpoint Method to generate an endpoint for.
 * @return {string} Calculated endpoint URI.
 * @package
 */
bloombox.shop.endpoint = function(endpoint) {
  // force service endpoint in debug mode
  let prefix = bloombox.DEBUG === true ?
    'https://rpc.bloombox.cloud' :
    bloombox.shop.SHOP_API_ENDPOINT;

  return [
    prefix,
    'shop',
    bloombox.shop.SHOP_API_VERSION,
    endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  ].join('/');
};


/**
 * Return a `ShopRPC` instance for a generic HTTP RPC call.
 *
 * @param {bloombox.shop.Routine} rpcMethod Method to generate an endpoint for.
 * @param {string} httpMethod HTTP method to use.
 * @param {string} endpoint URL endpoint to send the RPC to.
 * @param {Object=} payload Payload to use if we're POST-ing or PUT-ing.
 * @throws {bloombox.rpc.RPCException} If the provided values are invalid in
 *         some way.
 * @constructor
 * @struct
 */
bloombox.shop.rpc.ShopRPC = function ShopRPC(rpcMethod,
                                             httpMethod,
                                             endpoint,
                                             payload) {
  let targetEndpoint = bloombox.shop.endpoint(endpoint);

  /**
   * Shop RPC routine we're calling.
   *
   * @type {bloombox.shop.Routine}
   * @public
   */
  this.rpcMethod = rpcMethod;

  /**
   * Wrapped RPC object.
   *
   * @type {bloombox.rpc.RPC}
   * @public
   */
  this.rpc = new bloombox.rpc.RPC(
    httpMethod, targetEndpoint, payload || null);
};


/**
 * Send a prepared RPC.
 *
 * @param {function(?Object)} callback Callback to dispatch once we're done.
 * @param {function(?number, ?Object=, ?number=, ?string=)} error Error callback
 *        to dispatch if a failure is encountered.
 */
bloombox.shop.rpc.ShopRPC.prototype.send = function(callback, error) {
  // send underlying RPC w/callback and errors passed through
  this.rpc.send((function(response) {
    bloombox.logging.log(
      'Shop RPC for method \'' + this.rpcMethod + '\' completed.');
    callback(response);
  }).bind(this), /** @type {function(?number, ?Object=, ?number=, ?string=)} */
    (function(status_code, error_obj, error_code, message_or_failure_name) {
      bloombox.logging.error(
        'Failed to resolve Shop API RPC for method \'' +
          this.rpcMethod + '\': status ' + error_code, {
          'status': status_code,
          'error': error_obj,
          'code': error_code,
          'message': message_or_failure_name});
      error(status_code, error_obj, error_code, message_or_failure_name);
  }).bind(this));
};
