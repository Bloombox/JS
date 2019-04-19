
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
 * Bloombox: Shop RPC Client, v1beta1
 *
 * @fileoverview Provides an implementation of the Bloombox Shop RPC client,
 *               using gRPC (via binary or text).
 */

/*global goog */

goog.require('bloombox.API_ENDPOINT');
goog.require('bloombox.rpc.metadata');
goog.require('bloombox.shop.InfoCallback');
goog.require('bloombox.shop.ShopAPI');
goog.require('bloombox.shop.ShopOptions');

goog.require('proto.bloombox.services.shop.v1.ShopInfo.Request');
goog.require('proto.bloombox.services.shop.v1.ShopInfo.Response');

goog.require('proto.bloombox.services.shop.v1.ShopPromiseClient');

goog.provide('bloombox.shop.v1.Service');



/**
 * Defines an implementation of the Bloombox Shop API, which uses gRPC to call
 * out to remote services provided by Bloombox Cloud. This adapter is based on
 * gRPC web, and may use text or binary encoding over the wire.
 *
 * @implements bloombox.shop.ShopAPI
 */
bloombox.shop.v1.Service = (class ShopV1 {
  /**
   * Construct a new instance of the `v1beta1` Shop API service. The instance is
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

    /**
     * Service client, which is responsible for mediating calls between the RPC
     * server and the local RPC client.
     *
     * @private
     * @type {proto.bloombox.services.shop.v1.ShopPromiseClient}
     */
    this.client = (
      new proto.bloombox.services.shop.v1.ShopPromiseClient(
        bloombox.API_ENDPOINT,
        null,
        {'format': 'binary'}));
  }

  // -- API: Shop Info -- //
  /**
   * Retrieve basic, top-of-the-fold info about a web shop for a given partner
   * and location scope. Depending on the set hours for the web shop, a status
   * is returned for both `pickup` and `delivery` (both booleans). Examine the
   * callback for more information about the response message.
   *
   * This method is callable without any custom configuration, in which case,
   * the library-global partner and location values will be used. If you wish to
   * override these values, prepare a `ShopOptions` object and pass it in.
   *
   * @param {?bloombox.shop.InfoCallback=} callback Function to dispatch once
   *        either a response or terminal error condition are reached.
   * @param {?bloombox.shop.ShopOptions=} config Configuration options to apply
   *        in the scope of this single RPC operation.
   * @return {Promise<proto.bloombox.services.shop.v1.ShopInfo.Response>}
   *         Promise attached to the underlying RPC call.
   */
  info(callback, config) {

  }
});
