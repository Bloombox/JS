
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
 * Bloombox: Shop API
 *
 * @fileoverview Provides interface definitions for the Shop API.
 */

/*global goog */

goog.require('bloombox.base.ServiceInterface');
goog.require('bloombox.rpc.ScopedOptions');

goog.provide('bloombox.shop.InfoCallback');
goog.provide('bloombox.shop.ShopAPI');
goog.provide('bloombox.shop.ShopConfig');
goog.provide('bloombox.shop.ShopOptions');
goog.provide('bloombox.shop.ZipcheckCallback');


// -- Definitions/ Structures -- //

/**
 * Specifies a simple record type, which is inflatable into a full settings
 * object which specifies options for handling shop operations.
 *
 * @public
 * @typedef {{scope: ?string}}
 */
bloombox.shop.ShopConfig;


/**
 * Callback function type declaration for shop info retrieval.
 *
 * The callback involves two parameters: the resulting shop info, if applicable,
 * and the error code, if applicable. Only one value is provided (so, if info is
 * provided, there will be no error, and vice-versa).
 *
 * @public
 * @typedef {function(
 *    ?proto.bloombox.services.shop.v1.ShopInfo.Response,
 *    *)}
 */
bloombox.shop.InfoCallback;


/**
 * Callback function type declaration for shop zipcode check responses.
 *
 * The callback involves two parameters: the resulting zipcheck response, if
 * applicable, and the error code, if applicable. Only one value is provided
 * (so, if info is provided, there will be no error, and vice-versa).
 *
 * @public
 * @typedef {function(
 *    ?proto.bloombox.services.shop.v1.CheckZipcode.Response,
 *    *)}
 */
bloombox.shop.ZipcheckCallback;


/**
 * Callback function type declaration for shop member verification responses.
 *
 * The callback involves two parameters: the resulting verify response, if
 * applicable, and the error code, if applicable. Only one value is provided
 * (so, if info is provided, there will be no error, and vice-versa).
 *
 * @public
 * @typedef {function(
 *    ?proto.bloombox.services.shop.v1.VerifyMember.Response,
 *    *)}
 */
bloombox.shop.VerifyCallback;


/**
 * Options object, which describes configuration values to override or set for a
 * given Shop API RPC. Each parameter specifiable here is documented inline as a
 * configuration property.
 *
 * @export
 * @extends {bloombox.rpc.ScopedOptions}
 */
bloombox.shop.ShopOptions = (
  class ShopOptions extends bloombox.rpc.ScopedOptions {
  /**
   * Build a shop options object from scratch, with the ability to specify the
   * full set of configuration parameters/options.
   *
   * @param {?string=} scope Partnership scope override for this RPC.
   */
  constructor(scope) {
    super(scope || null);
  }

  /**
   * Generate a set of default options for a given Shop RPC operation. The items
   * set in the default config and their values should both be sensible for the
   * majority case of method calls.
   *
   * @export
   * @returns {bloombox.shop.ShopOptions} Default options.
   */
  static defaults() {
    return new bloombox.shop.ShopOptions(
      null  /* do not override scope by default */);
  }

  /**
   * Inflate a Shop RPC options object from a raw object, which may specify one
   * or more settings that correspond to keys in the the flat configuration
   * object type definition for the Shop API.
   *
   * @export
   * @param {bloombox.shop.ShopConfig} record Configuration object to read from.
   * @returns {bloombox.shop.ShopOptions} Inflated configuration options.
   */
  static fromObject(record) {
    return new bloombox.shop.ShopOptions(
      record['scope'] || null);
  }

  /**
   * Serialize these Shop RPC options into a flat object, complying with the
   * keys specified in the flat object type definition for configuration values
   * for the Shop API.
   *
   * @returns {{scope: ?string}}
   */
  toObject() {
    return {
      'scope': this.scope};
  }
});
goog.inherits(bloombox.shop.ShopOptions, bloombox.rpc.ScopedOptions);


// -- API Surface -- //
/**
 * Defines the surface of the Shop API, which is provided by the Bloombox Cloud
 * to facilitate querying data about a given partnership scope's physical and
 * digital retail presence. Basic configuration and state, like the status of
 * the store (open or closed, for pickup or delivery), or store contact info or
 * domains, are accessible through this interface.
 *
 * The Shop API additionally defines tools for managing users and orders from an
 * e-commerce context. Users can enroll, they can be verified, and can then
 * submit and check status of online pickup or delivery orders.
 *
 * To facilitate delivery interfaces, minimum order amounts and zone eligibility
 * can be enforced by U.S. zipcode. These settings are set and maintained in the
 * Bloombox Dashboard (in the retail section) and enforced with the 'zipcheck'
 * method, which is called in the check-out flow.
 *
 * @interface
 * @extends bloombox.base.ServiceInterface
 */
bloombox.shop.ShopAPI = (class ShopAPI {
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
   * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
   *         the underlying RPC, or during transmission.
   */
  info(callback, config) {}

  // -- API: Zip Check -- //
  /**
   * Validate a zipcode for delivery ordering eligibility, potentially including
   * adherence to any set order minimum, either globally or for the zipcode in
   * question specifically.
   *
   * @param {string} zipcode U.S. zipcode to check with the server.
   * @param {?bloombox.shop.ZipcheckCallback=} callback Callback to dispatch
   *        once a response, or terminal error, are available.
   * @param {?bloombox.shop.ShopOptions=} config Configuration options to apply
   *        in the scope of this single RPC operation.
   * @return {Promise<proto.bloombox.services.shop.v1.CheckZipcode.Response>}
   *         Promise attached to the underlying RPC call.
   * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
   *         the underlying RPC, or during transmission.
   */
  zipcheck(zipcode, callback, config) {}

  // -- API: User Verification -- //
  /**
   * Verify a user's eligibility to order cannabis via the web shop, using their
   * email address to find their account. This method guarantees that the user
   * is registered, has a valid and un-expired government ID listed (according
   * to the partner and location settings), and is in good standing with the
   * retail partner.
   *
   * @param {string} email Email address to use to locate the user.
   * @param {?bloombox.shop.VerifyCallback=} callback Function to dispatch once
   *        a response or terminal error state is reached.
   * @param {?bloombox.shop.ShopOptions=} config Configuration options to apply
   *        in the scope of this single RPC operation.
   * @return {Promise<proto.bloombox.services.shop.v1.VerifyMember.Response>}
   *         Promise attached to the underlying RPC call.
   * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
   *         the underlying RPC, or during transmission.
   */
  verify(email, callback, config) {}
});
