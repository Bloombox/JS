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
 * Bloombox: Menu API
 *
 * @fileoverview Provides interface definitions for the Menu API.
 */

/*global goog */

goog.require('bloombox.base.ServiceInterface');
goog.require('bloombox.menu.ObservableMenu');
goog.require('bloombox.rpc.ScopedOptions');
goog.require('proto.opencannabis.products.menu.section.Section');

goog.provide('bloombox.menu.MenuAPI');

goog.provide('bloombox.menu.RetrieveCallback');
goog.provide('bloombox.menu.RetrieveConfig');
goog.provide('bloombox.menu.RetrieveException');
goog.provide('bloombox.menu.RetrieveOptions');
goog.provide('bloombox.menu.Section');


// -- Definitions / Structures -- //
/**
 * Menu sections.
 *
 * @typedef {proto.opencannabis.products.menu.section.Section}
 */
bloombox.menu.Section;


/**
 * Callback function type declaration for menu data retrieval. Once a full menu
 * has been retrieved by the underlying implementation, a callback can be
 * dispatched with this signature, which provides the resulting catalog to
 * invoking code asynchronously.
 *
 * The callback involves two parameters: the resulting menu, if applicable, and
 * the error code, if applicable. Only one value is provided (so, if a menu is
 * provided, there will be no error, and vice-versa).
 *
 * @public
 * @typedef {function(
 *    ?proto.bloombox.services.menu.v1beta1.GetMenu.Response,
 *    *)}
 */
bloombox.menu.RetrieveCallback;


/**
 * Callback function type declaration for individual product data retrieval.
 * Once data or a terminal error state is made available by the underlying RPC
 * implementation, a callback of this signature can be dispatched with one of
 * either the result value (in this case, product data), or the error value.
 *
 * The callback's parameters are either-or in this sense: if a result is passed,
 * the error is passed as `null`, and vice-versa.
 *
 * @public
 * @typedef {function(
 *    ?proto.bloombox.services.menu.v1beta1.GetProduct.Response,
 *    *)}
 */
bloombox.menu.ProductCallback;


/**
 * Callback function type declaration for operations that produce lists of
 * products marked as featured-for-promotion. This flag indicates the item is
 * eligible to be elevated to more prominent displays, which on the web might be
 * featured product areas in the section master UI.
 *
 * The callback's parameters are either-or in this sense: if a result is passed,
 * the error is passed as `null`, and vice-versa.
 *
 * @public
 * @typedef {function(
 *    ?proto.bloombox.services.menu.v1beta1.GetFeatured.Response,
 *    *)}
 */
bloombox.menu.FeaturedCallback;


/**
 * Specifies a simple record type, which is inflatable into a full settings
 * object which specifies options for retrieving menus.
 *
 * @public
 * @typedef {{
 *    full: boolean,
 *    keysOnly: boolean,
 *    fresh: boolean,
 *    snapshot: ?string,
 *    fingerprint: ?string,
 *    scope: ?string,
 *    section: ?proto.opencannabis.products.menu.section.Section}}
 */
bloombox.menu.RetrieveConfig;


/**
 * Represents an exception that occurred while retrieving menu data for a given
 * partner/location pair.
 *
 * @param {string} message Exception error message.
 * @param {number=} err Error code or status code.
 * @constructor
 * @export
 */
bloombox.menu.RetrieveException = function RetrieveException(message, err) {
  /**
   * Exception message.
   *
   * @public
   * @type {string}
   */
  this['message'] = message;

  /**
   * Exception or status code.
   *
   * @public
   * @type {number}
   */
  this['err'] = err || -1;
};


/**
 * Options object, which specifies various parameters or settings when fetching
 * a full catalog from the Menu API. Each parameter is documented herein. A
 * simple object can be specified with the options herein, with defaults
 * applying where properties are unspecified (defaults are merged in, without
 * overwriting, before options are used).
 *
 * @export
 * @extends {bloombox.rpc.ScopedOptions}
 */
bloombox.menu.RetrieveOptions = (
  class RetrieveOptions extends bloombox.rpc.ScopedOptions {
  /**
   * Build a menu retrieval options object from scratch, with the ability to
   * specify the full set of parameters.
   *
   * @param {boolean} full Fetch a 'full' catalog, including out-of-stock items.
   * @param {boolean} keysOnly Fetch keys only, without full product data.
   * @param {?string} snap Snapshot-based filtering, if applicable.
   * @param {?string} fingerprint Bloom filter-based filtering, if applicable.
   * @param {proto.opencannabis.products.menu.section.Section} section Menu
   *        section to retrieve data for. If unset, all sections are fetched.
   * @param {boolean} fresh Request a forced-fresh response, which causes the
   *        server to skip caches when generating a response.
   * @param {?string} scope Value to override partner scope with, if applicable.
   */
  constructor(full, keysOnly, snap, fingerprint, section, fresh, scope) {
    super(scope);

    /**
     * Whether to fetch the 'full' menu catalog, which includes items that are
     * out of stock, or hidden from the menu for other reasons. This property
     * is generally left unset and defaults to `false`.
     *
     * @public
     * @type {boolean}
     **/
    this.full = full;

    /**
     * Specifies whether to fetch product data in addition to product keys. If
     * set to `true`, the RPC layer will operate in "keys-only" mode, returning
     * only the keys of matching objects on read operations. In this mode, the
     * user is responsible for resolving object data via the `products` method.
     *
     * @public
     * @type {boolean}
     */
    this.keysOnly = keysOnly;

    /**
     * Specifies a snapshot of existing menu data, which the server may compare
     * with a given response payload. If the snapshot values match, the response
     * can be omitted with a '304 Not-Modified'-style response. Defaults to an
     * unset value, which skips snapshot-based filtering.
     *
     * @public
     * @type {?string}
     */
    this.snapshot = snap;

    /**
     * Specifies a fingerprint representing an encoded Bloom filter, encoded in
     * Base64. If a given product key matches the Bloom filter, it is withheld
     * by the server to alleviate congestion on the client. Defaults to an unset
     * value, which skips fingerprint-based filtering.
     *
     * @public
     * @type {?string}
     */
    this.fingerprint = fingerprint;

    /**
     * Filters or restricts the response to a given menu section. If specified,
     * the response will only include a stanza for the specified section.
     * Defaults to an unset value, which fetches all menu sections.
     *
     * @public
     * @type {proto.opencannabis.products.menu.section.Section}
     */
    this.section = section;

    /**
     * Request a forced-fresh response from the server, which re-calculates the
     * underlying menu data without speaking to caches. The server is under no
     * obligation to cooperate with this request. Defaults to `false`, allowing
     * intelligent menu caching.
     *
     * @public
     * @type {boolean}
     */
    this.fresh = fresh;
  }

  /**
   * Prepare a `RetrieveOptions` instance with default values for all config
   * options with specified defaults.
   *
   * @export
   * @returns {bloombox.menu.RetrieveOptions} Default set of options.
   */
  static defaults() {
    return new bloombox.menu.RetrieveOptions(
      false,  /* slim menu mode */
      false,  /* full product data */
      null,  /* no default snapshot */
      null,  /* no default fingerprint */
      proto.opencannabis.products.menu.section.Section.UNSPECIFIED,
      false  /* allow caching */,
      null  /* no scope override */);
  }

  /**
   * Generate a `RetrieveOptions` instance from a simple JavaScript record
   * object, which specifies config settings.
   *
   * @export
   * @param {bloombox.menu.RetrieveConfig} record Config settings to inflate
   *        into a full settings object.
   * @returns {bloombox.menu.RetrieveOptions} Full settings object.
   */
  static fromObject(record) {
    return new bloombox.menu.RetrieveOptions(
      record['full'] || false,
      record['keysOnly'] || false,
      record['snapshot'] || null,
      record['fingerprint'] || null,
      record['section'] || (
        proto.opencannabis.products.menu.section.Section.UNSPECIFIED),
      record['fresh'] || false,
      record['scope'] || null);
  }

  /**
   * Returns a serialized object containing the properties specified in this
   * retrieve options payload.
   *
   * @public
   * @returns {bloombox.menu.RetrieveConfig} Object form of this config.
   */
  toObject() {
    return {
      'full': this.full,
      'keysOnly': this.keysOnly,
      'snapshot': this.snapshot,
      'fingerprint': this.fingerprint,
      'section': this.section,
      'fresh': this.fresh,
      'scope': this.scope};
  }
});


// -- API Surface -- //
/**
 * Defines the surface of the Menu API, which provides product/menu catalog data
 * to invoking code, at the level of a full menu, a menu section, or one or more
 * individual product records.
 *
 * @interface
 * @extends bloombox.base.ServiceInterface
 */
bloombox.menu.MenuAPI = (class MenuAPI {
  // -- API: Menu Retrieval -- //
  /**
   * Retrieve a full menu via Bloombox systems, for a given retail location.
   * Before this method is called, the user should setup their partnership
   * information via the `setup` method, including their partner code, location
   * code, and API key.
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
   * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
   *         the underlying RPC, or during transmission.
   */
  retrieve(callback, config) {}

  // -- API: Product Retrieval -- //
  /**
   * Fetch an individual product record, addressed by its unique product key,
   * which is comprised of the product's type, and the product's key ID (which
   * is an opaque string value provisioned when the product is created).
   *
   * Once either product data or a terminal error state are encountered, the
   * given callback, if provided, is dispatched, and the resulting promise is
   * fulfilled. If a result is available, it is passed in as the first parameter
   * of the callback, otherwise, an error is passed in as the second parameter.
   * In no case are two values passed.
   *
   * @param {proto.opencannabis.base.ProductKey} key Product key to fetch.
   * @param {?bloombox.menu.ProductCallback=} callback Callback to dispatch once
   *        either a result or terminal error state are reached. Optional.
   * @param {?bloombox.menu.RetrieveOptions=} config Configuration options to
   *        apply to this request.
   * @return {Promise<proto.bloombox.services.menu.v1beta1.GetProduct.Response>}
   *         Promise attached to the underlying RPC call.
   * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
   *         the underlying RPC, or during transmission.
   */
  product(key, callback, config) {}

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
  featured(section, callback, config) {}

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
  stream(localMenu, config) {}
});
