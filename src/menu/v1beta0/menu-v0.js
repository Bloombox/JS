
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
 * Bloombox: Menu RPC Client, v1beta0
 *
 * @fileoverview Provides an implementation of the Bloombox Menu RPC client,
 *               using deprecated JSON/REST.
 */

/*global goog */

goog.require('bloombox.rpc.FALLBACK');


if (bloombox.rpc.FALLBACK) {
  goog.require('bloombox.logging.error');
  goog.require('bloombox.logging.info');
  goog.require('bloombox.logging.log');
  goog.require('bloombox.logging.warn');

  goog.require('bloombox.menu.MENU_API_ENDPOINT');
  goog.require('bloombox.menu.MENU_API_VERSION');
  goog.require('bloombox.menu.MenuAPI');
  goog.require('bloombox.menu.RetrieveCallback');
  goog.require('bloombox.menu.RetrieveOptions');
  goog.require('bloombox.menu.VERSION');
  goog.require('bloombox.rpc.RPC');
  goog.require('bloombox.rpc.RPCException');

  goog.provide('bloombox.menu.rpc.MenuRPC');
  goog.provide('bloombox.menu.v1beta0.Service');

  // -- Structures -- //

  /**
   * Callback function type declaration for menu data retrieval.
   *
   * @typedef {function(?Object, ?number)}
   */
  bloombox.menu.MenuRetrieveCallback;


  // -- Menu RPCs -- //

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
      'https://rpc.bloombox.cloud' :
      bloombox.menu.MENU_API_ENDPOINT;

    return [
      prefix,
      'menu',
      bloombox.menu.MENU_API_VERSION,
      endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    ].join('/');
  };


  /**
   * Return a `MenuRPC` instance for a generic HTTP RPC call.
   *
   * @param {bloombox.menu.Routine} rpcMethod Method to generate an endpoint for.
   * @param {string} httpMethod HTTP method to use.
   * @param {string} endpoint URL endpoint to send the RPC to.
   * @param {Object=} payload Payload to use if we're POST-ing or PUT-ing.
   * @throws {bloombox.rpc.RPCException} If the provided values are invalid in
   *         some way.
   * @constructor
   * @struct
   */
  bloombox.menu.rpc.MenuRPC = function MenuRPC(rpcMethod,
                                               httpMethod,
                                               endpoint,
                                               payload) {
    let targetEndpoint = bloombox.menu.endpoint(endpoint);

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


  /**
   * Retrieve menu data for the current partner/location pair.
   *
   * @param {?bloombox.menu.RetrieveOptions=} options Configuration options for
   *        this menu retrieval operation. See type docs for more info.
   * @param {?bloombox.menu.MenuRetrieveCallback=} callback Operation callback.
   * @throws {bloombox.rpc.RPCException} If partner/location isn't set, or some
   *         other client-side error occurs.
   * @return {Promise<proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
   *         Promise attached to the underlying RPC call.
   */
  bloombox.menu.retrieveLegacy = function(options, callback) {
    // load partner and location codes
    const scope = bloombox.rpc.context(options);
    const partnerCode = scope.partner;
    const locationCode = scope.location;

    bloombox.logging.info('Retrieving menu for \'' +
      partnerCode + ':' + locationCode + '\'...');

    return new Promise(function(resolve, reject) {
      // stand up an RPC object
      const rpc = new bloombox.menu.rpc.MenuRPC(
        /** @type {bloombox.menu.Routine} */ (bloombox.menu.Routine.RETRIEVE),
        'GET', [
          'partners', partnerCode,
          'locations', locationCode,
          'global:retrieve'].join('/'));

      let done = false;
      rpc.send(function(response) {
        if (done) return;
        if (response !== null) {
          done = true;

          bloombox.logging.log('Received response for menu data RPC.', response);
          if (typeof response === 'object') {
            // dispatch the callback
            if (callback) callback(response, null);
            resolve(response);
          } else {
            bloombox.logging.error(
              'Received unrecognized response for menu data RPC.', response);
            if (callback) callback(null, null);
            reject(response);
          }
        }
      }, function(status) {
        bloombox.logging.error(
          'An error occurred while querying menu data. Status code: \'' +
          status + '\'.');

        // pass null to indicate an error
        if (callback) callback(null, status || null);
        reject(status);
      });
    });
  };


  // -- Menu API: v1beta0 -- //

  /**
   * Defines an implementation of the Bloombox Menu API, which calls into legacy
   * systems via the `v1beta0` adapter.
   *
   * @implements bloombox.menu.MenuAPI
   */
  bloombox.menu.v1beta0.Service = (class MenuV0 {
    /**
     * Construct a new instance of the `v1beta0` Menu API service. The instance is
     * pre-configured with requisite top-level config and afterwards ready to make
     * calls out to remote services.
     *
     * @param {bloombox.config.JSConfig} sdkConfig JavaScript SDK config.
     */
    constructor(sdkConfig) {
      // noinspection JSUnusedGlobalSymbols
      /**
       * Active JS SDK configuration.
       *
       * @private
       * @type {bloombox.config.JSConfig}
       */
      this.sdkConfig = sdkConfig;
    }

    // -- Menu Retrieve -- //
    /**
     * Retrieve a full menu via Bloombox systems, using the legacy V1 JSON/REST
     * API interface, for a given retail location. Before this method is called,
     * the user should setup their partnership information via the `setup` method,
     * including their partner code, location code, and API key.
     *
     * Once `setup` calls back, indicating the library is ready for use, a full
     * menu catalog can be fetched via this method, according to the options
     * specified in the `options` parameter.
     *
     * @param {?bloombox.menu.RetrieveCallback=} callback Function to dispatch
     *        once data is available for the underlying menu catalog.
     * @param {?bloombox.menu.RetrieveOptions=} config Configuration options for
     *        this menu retrieval operation. See type docs for more info.
     * @return {Promise<proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
     *         Promise attached to the underlying RPC call.
     */
    retrieve(callback, config) {
      // v0 interface doesn't support config
      return bloombox.menu.retrieveLegacy(config, (catalog, err) => {
        if (!catalog) {
          if (callback) callback(null, err || -1);
        } else {
          // we have a catalog: cast it and return
          let casted = (
            /** @type {proto.bloombox.services.menu.v1beta1.GetMenu.Response} */ (
            catalog));
          callback(casted, null);
        }
      });
    }
  });
}
