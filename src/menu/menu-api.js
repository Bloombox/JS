
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
goog.require('bloombox.rpc.ScopedOptions');
goog.require('proto.opencannabis.products.menu.section.Section');

goog.provide('bloombox.menu.MenuAPI');

goog.provide('bloombox.menu.RetrieveCallback');
goog.provide('bloombox.menu.RetrieveConfig');
goog.provide('bloombox.menu.RetrieveException');
goog.provide('bloombox.menu.RetrieveOptions');
goog.provide('bloombox.menu.Section');


// -- Definitions/ Structures -- //
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
   * @export
   * @type {string}
   */
  this.message = message;

  /**
   * Exception or status code.
   *
   * @export
   * @type {number}
   */
  this.err = err || -1;
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
  };

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
 * This interface is implemented by two engines, one which supports JSON/REST
 * (this is considered a legacy adapter), and one which supports gRPC over both
 * binary and text. The implementation to this interface is selected from those
 * options at runtime based on support, or lack thereof, in the browser agent.
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
   */
  retrieve(callback, config) {}
});
