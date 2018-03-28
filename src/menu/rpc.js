
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
 * Bloombox Menu: RPC
 *
 * @fileoverview Provides tools for low-level RPCs to the Menu API.
 */

/*global goog */

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

goog.require('bloombox.menu.MENU_API_ENDPOINT');
goog.require('bloombox.menu.MENU_API_VERSION');
goog.require('bloombox.menu.VERSION');

goog.require('bloombox.rpc.RPC');

goog.provide('bloombox.menu.MenuRPCException');
goog.provide('bloombox.menu.Routine');
goog.provide('bloombox.menu.endpoint');
goog.provide('bloombox.menu.rpc.MenuRPC');



/**
 * Enumerates methods in the Menu API.
 *
 * @enum {string}
 */
bloombox.menu.Routine = {
  RETRIEVE: 'RETRIEVE'
};


/**
 * Calculate a menu API endpoint, given an RPC method and the base API endpoint.
 *
 * @param {string} endpoint Method to generate an endpoint for.
 * @return {string} Calculated endpoint URI.
 * @package
 */
bloombox.menu.endpoint = function(endpoint) {
  // force service endpoint in debug mode
  let prefix = bloombox.DEBUG === true ?
    'https://api.sandbox.bloombox.cloud' :
    bloombox.menu.MENU_API_ENDPOINT;

  return [
    prefix,
    'menu',
    bloombox.menu.MENU_API_VERSION,
    endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  ].join('/');
};


/**
 * Exception object for the construction phase of a menu RPC. Usually thrown
 * when no API key is present, or `setup` is not called before RPC methods.
 *
 * @param {string} message Message for the error.
 * @constructor
 */
bloombox.menu.MenuRPCException = function MenuRPCException(message) {
  this.message = message;
};


// noinspection JSUnusedGlobalSymbols
/**
 * Show this exception's message.
 *
 * @return {string} Message for this exception.
 */
bloombox.menu.MenuRPCException.prototype.toString = function() {
  return 'MenuRPCException: ' + this.message;
};


/**
 * Return a `MenuRPC` instance for a generic HTTP RPC call.
 *
 * @param {bloombox.menu.Routine} rpcMethod Method to generate an endpoint for.
 * @param {string} httpMethod HTTP method to use.
 * @param {string} endpoint URL endpoint to send the RPC to.
 * @param {Object=} payload Payload to use if we're POST-ing or PUT-ing.
 * @throws {bloombox.menu.MenuRPCException} If the provided values are invalid
 *         in some way.
 * @constructor
 * @struct
 */
bloombox.menu.rpc.MenuRPC = function MenuRPC(rpcMethod,
                                             httpMethod,
                                             endpoint,
                                             payload) {
  let targetEndpoint = bloombox.menu.endpoint(endpoint);

  if (typeof httpMethod !== 'string')
    throw new bloombox.menu.MenuRPCException(
      'Invalid HTTP method: ' + httpMethod);
  if (typeof endpoint !== 'string')
    throw new bloombox.menu.MenuRPCException(
      'Invalid RPC endpoint: ' + endpoint);
  if (payload !== null && payload !== undefined && (
      typeof payload !== 'object'))
    throw new bloombox.menu.MenuRPCException(
      'Cannot provide non-object type as payload: ' + payload);

  /**
   * Menu RPC routine we're calling.
   *
   * @type {bloombox.menu.Routine}
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
 * @param {function(?number=)} error Error callback.
 */
bloombox.menu.rpc.MenuRPC.prototype.send = function(callback, error) {
  // send underlying RPC w/callback and errors passed through
  this.rpc.send((function(response) {
    bloombox.logging.log(
      'Menu RPC for method \'' + this.rpcMethod + '\' completed.');
    callback(response);
  }).bind(this), /** @type {function(?number=)} */ ((function(error_code) {
    bloombox.logging.error(
      'Failed to resolve Menu API RPC for method \'' +
      this.rpcMethod + '\': status ' + error_code);
    error(error_code);
  }).bind(this)));
};
