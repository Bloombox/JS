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
 * Bloombox: Menu Local Storage Client, v1beta1
 *
 * @fileoverview Provides an implementation of the Bloombox Menu RPC client,
 *               using caching provided by the browser. If items cannot be found
 *               in local storage, the provided remote service is used.
 */

/*global goog */

goog.require('bloombox.db.MENU_STORE');
goog.require('bloombox.menu.MenuAPI');
goog.require('bloombox.util.b64');

goog.require('proto.bloombox.services.menu.v1beta1.GetProduct.Response');

goog.provide('bloombox.menu.v1beta1.LocalService');


goog.scope(function() {
  /**
   * Defines an implementation of the Bloombox Menu API, which calls into local
   * browser storage APIs to satisfy requests using cached/offline-capable data
   * sources. If the requested data is not available, an attempt is made to
   * satisfy the request via the provided remote service adapter.
   *
   * @implements bloombox.menu.MenuAPI
   */
  bloombox.menu.v1beta1.LocalService = (class LocalMenu {
    /**
     * Construct a new instance of the `v1beta1` Menu API service. The instance is
     * a read-through proxy that checks local browser storage for requested menu
     * data. If the underlying data cannot be found or is otherwise unavailable,
     * the provided remote service adapter is used to fetch the data fresh.
     *
     * @param {bloombox.menu.MenuAPI} remoteService Remote service adapter, which
     *        provides fresh menu data from the server.
     */
    constructor(remoteService) {
      /**
       * Remote service, used to fetch menu data if it is not available locally.
       *
       * @type {bloombox.menu.MenuAPI}
       */
      this.remote = remoteService;
    }

    // -- Menu Retrieve -- //
    /**
     * Retrieve a full menu via Bloombox systems, using the new binary gRPC API
     * interface, for a given retail location, checking first with local browser
     * storage for cached data, if any. Before this method is called, the user
     * should setup their partnership information via the `setup` method,
     * including their partner code, location code, and API key.
     *
     * Once `setup` calls back, indicating the library is ready for use, a full
     * menu catalog can be fetched via this method, according to the options
     * specified in the `options` parameter.
     *
     * @export
     * @override
     * @param {?bloombox.menu.RetrieveCallback=} callback Function to dispatch once
     *        data is available for the underlying menu catalog.
     * @param {?bloombox.menu.RetrieveOptions=} options Configuration options for
     *        this menu retrieval operation. See type docs for more info.
     * @return {Promise<proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
     *         Promise attached to the underlying RPC call.
     */
    retrieve(callback, options) {
      // include the current fingerprint to skip responses via 304
      let opts = /** @type {?bloombox.menu.RetrieveConfig} */ (null);
      let config = /** @type {?bloombox.menu.RetrieveOptions} */ (options);
      if (bloombox.menu.lastSeenFingerprint != null) {
        opts = /** @type {bloombox.menu.RetrieveConfig} */ (
          Object.assign({}, (options ? options.toObject() : {}), {
          'fingerprint': bloombox.menu.lastSeenFingerprint
        }));
        config = bloombox.menu.RetrieveOptions.fromObject(opts);
      }
      return this.remote.retrieve(callback, config);
    }

    // -- API: Menu Stream -- //
    /**
     * Establish a stream over which we can receive menu change updates. Initially
     * a full menu payload is sent, to sync the client with the server's state,
     * and subsequently, delta updates are relayed as they occur in underlying
     * menu catalog storage.
     *
     * Depending on the settings passed in `config`, the delta payload will
     * reference a changed/added/deleted product by key, or enclose the full
     * product payload. Each time, an updated menu fingerprint is sent back.
     *
     * @export
     * @override
     * @param {?proto.opencannabis.products.menu.Menu=} localMenu Local-side
     *        menu to compare with the server. Fingerprint config setting is
     *        required if a local menu is provided, for comparison server-side.
     * @param {?bloombox.menu.RetrieveOptions=} config Options, or configuration,
     *        to apply in the scope of just this RPC operation. In some cases, a
     *        given API method may not apply or use all options. If left unset, a
     *        sensible set of default settings is generated and used.
     * @return {bloombox.menu.ObservableMenu} Observable menu object, which wraps
     *        a promise for the initial menu, and provides methods for subscribing
     *        to menu data changes (which are dispatched after being applied to
     *        any active local DB/caching engine).
     */
    stream(localMenu, config) {
      return this.remote.stream(localMenu, config);
    }

    // -- API: Product Retrieval -- //
    /**
     * Fetch an individual product record, addressed by its unique product key,
     * which is comprised of the product's type, and the product's key ID (which
     * is an opaque string value provisioned when the product is created).
     *
     * Once either product data or a terminal error state are encountered, the
     * given callback, if provided, is dispatched, and the resulting promise is
     * fulfilled. If a result is available, it is passed in as the first
     * parameter of the callback, otherwise, an error is passed in as the second
     * parameter. In no case are two values passed.
     *
     * @export
     * @override
     * @param {proto.opencannabis.base.ProductKey} key Product key to fetch.
     * @param {?bloombox.menu.ProductCallback=} callback Callback to dispatch
     *        once either a result or terminal error state are reached.
     * @param {?bloombox.menu.RetrieveOptions=} config Configuration options to
     *        apply to this request.
     * @return {Promise<proto.bloombox.services.menu.v1beta1.GetProduct.Response>}
     *         Promise attached to the underlying RPC call.
     * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
     *         the underlying RPC, or during transmission.
     */
    product(key, callback, config) {
      const that = this;
      return new Promise((resolve, reject) => {
        /**
         * Store a local object, after having fetched it from remote services.
         *
         * @param {!proto.bloombox.services.menu.v1beta1.GetProduct.Response} r
         *        RPC response promise.
         * @private
         */
        function storeLocal_(r) {
          if (callback) callback(r, null);
          resolve(r);
        }

        /**
         * Fetch a product from remote services.
         *
         * @private
         */
        function fetchRemote_() {
          // not found
          that.remote.product(key, function(response, err) {
            if (err) {
              if (callback) callback(null, err);
              reject(err);
            } else {
              storeLocal_(response);
            }
          }, config);
        }

        bloombox.db.acquire((db) => {
          if (!db || config && config.fresh) this.remote.product(key,
            function(response, err) {
              if (err) reject(err);
              else if (response) resolve(response);
            }, config);
          else {
            // DB is available. check that first.
            const txn = db.createTransaction([bloombox.db.MENU_STORE],
              goog.db.Transaction.TransactionMode.READ_ONLY);

            const store = txn.objectStore(bloombox.db.MENU_STORE);
            const keyId = key.getId();
            const keyKind = key.getType();
            const encodedKey = bloombox.util.b64.encode(
              keyKind.toString() + '::' + keyId);

            store.get(encodedKey).then((value) => {
              if (value != null && typeof value === 'object') {
                // @TODO check modified time

                // found some data
                const payload = /** @type {!Uint8Array|undefined} */ (value[
                  bloombox.menu.LocalMenuProperty.PAYLOAD]);
                if (!!payload) {
                  const msg = proto.opencannabis.products.menu.MenuProduct
                    .deserializeBinary(payload);

                  // synthesize a response
                  const response = (
                    new proto.bloombox.services.menu.v1beta1.GetProduct.Response());

                  response.addProduct(msg);
                  response.setCached(true);

                  callback(response, null);
                  resolve(response);
                } else {
                  // no locally-stored product. fetch remote.
                  fetchRemote_();
                }
              } else {
                // not found locally at all. fetch remote.
                fetchRemote_();
              }
            }, (err) => {
              bloombox.logging.warn(
                'Encountered error interfacing ' +
                'with local DB.', {'err': err});
              this.remote.product(key,
                function(response, err) {
                  if (err) reject(err);
                  else if (response) resolve(response);
                }, config);
            });
            return txn.wait();
          }
          return null;
        });
      });
    }

    // -- API: Featured Products -- //
    /**
     * Retrieve featured products for a given menu section. "Featured" products
     * are items with the "FEATURED" flag present in their product flags, as
     * indicated by staff or external systems via the Bloombox Dashboard.
     *
     * @export
     * @override
     * @param {?proto.opencannabis.products.menu.section.Section} section Menu
     *        section to fetch. If left unset, fetches across all sections.
     * @param {?bloombox.menu.FeaturedCallback=} callback Callback to dispatch
     *        once a dataset of products is available, or a terminal error is
     *        reached. Optional.
     * @param {?bloombox.menu.RetrieveOptions=} config Options, or configuration,
     *        to apply in the scope of just this RPC operation. In some cases, a
     *        given API method may not apply or use all options. If left unset, a
     *        sensible set of default settings is generated and used.
     * @return {Promise<proto.bloombox.services.menu.v1beta1.GetFeatured.Response>}
     *         Promise attached to the underlying RPC call.
     * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
     *         the underlying RPC, or during transmission.
     */
    featured(section, callback, config) {
      return this.remote.featured(section, callback, config);
    }
  });
});
