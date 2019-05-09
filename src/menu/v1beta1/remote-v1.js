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
 * Bloombox: Menu RPC Client, v1beta1
 *
 * @fileoverview Provides an implementation of the Bloombox Menu RPC client,
 *               using the modern gRPC-based framework.
 */

/*global goog */

goog.require('bloombox.SERVICE_MODE');

goog.require('bloombox.db.MENU_STORE');
goog.require('bloombox.db.acquire');

goog.require('bloombox.menu.MenuAPI');
goog.require('bloombox.menu.ObservableMenu');
goog.require('bloombox.menu.RetrieveCallback');
goog.require('bloombox.menu.RetrieveException');
goog.require('bloombox.menu.RetrieveOptions');
goog.require('bloombox.menu.processMenu');

goog.require('bloombox.rpc.metadata');

goog.require('goog.pubsub.TopicId');
goog.require('goog.pubsub.TypedPubSub');
goog.require('grpc.web.ClientReadableStream');

goog.require('proto.bloombox.services.menu.v1beta1.GetFeatured.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Request');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.Response');
goog.require('proto.bloombox.services.menu.v1beta1.GetMenu.StreamEvent');
goog.require('proto.bloombox.services.menu.v1beta1.GetProduct.Request');
goog.require('proto.bloombox.services.menu.v1beta1.MenuStreamClient');
goog.require('proto.bloombox.services.menu.v1beta1.MenuPromiseClient');

goog.require('proto.opencannabis.products.menu.section.Section');

goog.provide('bloombox.menu.v1beta1.RemoteService');


/**
 * Prepare a menu retrieve request, by taking the rendered/collapsed request
 * configuration and generating a `GetMenu.Request` object.
 *
 * @param {?bloombox.menu.RetrieveOptions=} config Rendered settings for this
 *        request, produced from override and global config.
 * @return {!proto.bloombox.services.menu.v1beta1.GetMenu.Request} Prepared
 *         request object to retrieve or stream a menu.
 */
function prepRetrieveRequest(config) {
  const resolved = config || bloombox.menu.RetrieveOptions.defaults();
  const request = new proto.bloombox.services.menu.v1beta1.GetMenu.Request();

  // copy in options
  if (resolved.full === true) request.setFull(true);
  if (resolved.fresh === true) request.setFresh(true);
  if (resolved.keysOnly === true) request.setKeysOnly(true);
  if (resolved.snapshot) request.setSnapshot(
    /** @type {string} */ (resolved.snapshot));
  if (resolved.fingerprint) request.setFingerprint(
    /** @type {string} */ (resolved.fingerprint));
  if (resolved.section !==
    proto.opencannabis.products.menu.section.Section.UNSPECIFIED)
    request.setSection(resolved.section);

  const scope = bloombox.rpc.context(resolved);
  const partnerCode = scope.partner;
  const locationCode = scope.location;
  const scopePath = `partner/${partnerCode}/location/${locationCode}`;
  request.setScope(scopePath);
  return request;
}


goog.scope(function() {
  /**
   * Defines an implementation of the Bloombox Menu API, which calls into modern
   * RPC dispatch via gRPC.
   *
   * @implements bloombox.menu.MenuAPI
   */
  bloombox.menu.v1beta1.RemoteService = (class MenuV1 {
    /**
     * Construct a new instance of the `v1beta1` Menu API service. The instance is
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
       * @type {proto.bloombox.services.menu.v1beta1.MenuPromiseClient}
       */
      this.client = (
        new proto.bloombox.services.menu.v1beta1.MenuPromiseClient(
          sdkConfig.endpoint,
          null,
          {'format': bloombox.SERVICE_MODE}));

      /**
       * Service client, which is responsible for managing live streaming of menu
       * updates from the server, as underlying menu data changes.
       *
       * @type {proto.bloombox.services.menu.v1beta1.MenuStreamClient}
       */
      this.liveStream = (
        new proto.bloombox.services.menu.v1beta1.MenuStreamClient(
          sdkConfig.endpoint,
          null,
          {'format': 'text'}));  // @TODO binary for streaming
    }

    // -- Menu Retrieve -- //
    /**
     * Retrieve a full menu via Bloombox systems, using the new binary gRPC API
     * interface, for a given retail location. Before this method is called, the
     * user should setup their partnership information via the `setup` method,
     * including their partner code, location code, and API key.
     *
     * Once `setup` calls back, indicating the library is ready for use, a full
     * menu catalog can be fetched via this method, according to the options
     * specified in the `options` parameter.
     *
     * @export
     * @param {?bloombox.menu.RetrieveCallback=} callback Function to dispatch once
     *        data is available for the underlying menu catalog.
     * @param {?bloombox.menu.RetrieveOptions=} options Configuration options for
     *        this menu retrieval operation. See type docs for more info.
     * @return {Promise<proto.bloombox.services.menu.v1beta1.GetMenu.Response>}
     *         Promise attached to the underlying RPC call.
     */
    retrieve(callback, options) {
      const resolved = options || bloombox.menu.RetrieveOptions.defaults();
      const request = prepRetrieveRequest(resolved);

      const operation = (
        this.client.retrieve(request, bloombox.rpc.metadata(this.sdkConfig)));
      operation.catch((err) => {
        if (callback) callback(null, err);
      });

      operation.then((resp) => {
        if (callback) {
          if (resp.hasCatalog()) {
            const deferred = bloombox.menu.processMenu(resp.getCatalog());
            if (deferred) {
              deferred.addCallback(() => {
                callback(resp, null);
              });
              deferred.addErrback((err) => {
                bloombox.logging.error('Error persisting menu locally.',
                  {'err': err});
                callback(resp, null);
              });
            } else {
              callback(resp, null);
            }
          } else {
            callback(null, null);
          }
        }
      });
      return operation;
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
      const resolved = config || bloombox.menu.RetrieveOptions.defaults();
      const request = prepRetrieveRequest(resolved);
      const operation = (
        this.liveStream.live(request, bloombox.rpc.metadata(this.sdkConfig)));

      // setup the observable menu and return
      return new bloombox.menu.ObservableMenu(
        operation, resolved.fingerprint, localMenu);
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
      const resolved = config || bloombox.menu.RetrieveOptions.defaults();
      const request = (
        new proto.bloombox.services.menu.v1beta1.GetProduct.Request());

      // copy in product key
      request.setKey(key);

      // resolve scope
      const scope = bloombox.rpc.context(resolved);
      request.setScope(`partner/${scope.partner}/location/${scope.location}`);

      if (resolved.fresh === true) request.setFresh(true);
      if (resolved.fingerprint) request.setFingerprint(resolved.fingerprint);
      const operation = (
        this.client.products(request, bloombox.rpc.metadata(this.sdkConfig)));

      operation.catch((err) => {
        if (callback) callback(null, err);
      });

      operation.then((response) => {
        if (callback) callback(response, null);
      });
      return operation;
    }

    // -- API: Featured Products -- //
    /**
     * Retrieve featured products for a given menu section. "Featured" products
     * are items with the "FEATURED" flag present in their product flags, as
     * indicated by staff or external systems via the Bloombox Dashboard.
     *
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
      const resolved = config || bloombox.menu.RetrieveOptions.defaults();
      const request = (
        new proto.bloombox.services.menu.v1beta1.GetFeatured.Request());

      // resolve scope
      const scope = bloombox.rpc.context(resolved);
      request.setScope(`partners/${scope.partner}/locations/${scope.location}`);

      // copy in section, if specified
      if (section) request.setSection(section);

      // copy in options, if specified
      if (resolved.keysOnly) request.setKeysOnly(true);

      // fire it off
      const operation = (
        this.client.featured(request, bloombox.rpc.metadata(this.sdkConfig)));

      operation.then((response) => {
        if (callback) callback(response, null);
      });
      operation.catch((err) => {
        if (callback) callback(null, err);
      });
      return operation;
    }
  });
});
