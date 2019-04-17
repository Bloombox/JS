
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
 * Bloombox: Menu RPC Client, v1beta0
 *
 * @fileoverview Provides an implementation of the Bloombox Menu RPC client,
 *               using deprecated JSON/REST.
 */

/*global goog */

goog.require('bloombox.menu.MenuAPI');
goog.require('bloombox.menu.RetrieveCallback');
goog.require('bloombox.menu.RetrieveOptions');

goog.provide('bloombox.menu.v1beta0.Service');


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
    /**
     * Active JS SDK configuration.
     *
     * @private
     * @type {bloombox.config.JSConfig}
     */
    this.sdkConfig = sdkConfig;
  }

  // -- Service Info -- //
  /**
   * Return the name of this service, which is always `menu`. The name of the
   * service allows invoking code to distinguish one service from another.
   *
   * @returns {string} Name of this service. Equal to "menu".
   */
  name() {
    return 'menu';
  }

  /**
   * Return the version of this service, which, for this implementation, is
   * always equal to `v1beta0`.
   *
   * @returns {string} Version of this service. Equal to "menu".
   */
  version() {
    return 'v1beta0';
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
   * @export
   * @param {bloombox.menu.RetrieveCallback} callback Function to dispatch once
   *        data is available for the underlying menu catalog.
   * @param {?bloombox.menu.RetrieveOptions} config Configuration options for
   *        this menu retrieval operation. See type docs for more info.
   * @return {Promise} Promise attached to the underlying RPC call.
   */
  retrieve(callback, config) {
    // v0 interface doesn't support config
    bloombox.menu.retrieveLegacy((catalog, err) => {
      if (err) {
        callback(null, err);
      } else if (!catalog) {
        callback(null, -1);
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
