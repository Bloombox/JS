
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
 * Bloombox: Shop RPC Client, v1beta0
 *
 * @fileoverview Provides an implementation of the Bloombox Shop RPC client,
 *               using deprecated JSON/REST.
 */

/*global goog */

goog.require('bloombox.config.active');
goog.require('bloombox.rpc.RPCException');
goog.require('bloombox.logging.error');
goog.require('bloombox.logging.info');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.shop.InfoCallback');
goog.require('bloombox.shop.Routine');
goog.require('bloombox.shop.ShopAPI');
goog.require('bloombox.shop.ShopOptions');
goog.require('bloombox.shop.ZipcheckCallback');
goog.require('bloombox.shop.rpc.ShopRPC');

goog.require('proto.bloombox.partner.settings.ShopStatus');
goog.require('proto.bloombox.services.shop.v1.CheckZipcode.Response');
goog.require('proto.bloombox.services.shop.v1.ShopInfo.Response');

goog.require('stackdriver.protect');

goog.provide('bloombox.shop.v1beta0.Service');


/**
 * Specifies shop statuses.
 *
 * @enum {string}
 */
bloombox.shop.ShopStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  PICKUP_ONLY: 'PICKUP_ONLY',
  DELIVERY_ONLY: 'DELIVERY_ONLY'
};


/**
 * Retrieve info for the current shop.
 *
 * @param {bloombox.shop.InfoCallback} callback Callback to dispatch.
 * @param {?bloombox.shop.ShopOptions=} opts Options for the call.
 * @throws {bloombox.rpc.RPCException} If partner/location isn't set.
 */
bloombox.shop.infoLegacy = function(callback, opts) {
  // load partner and location codes
  let config = bloombox.config.active();
  let partnerCode = config.partner;
  let locationCode = config.location;

  if (opts && opts.scope) {
    const pieces = opts.scope.split('/');
    if (pieces.length !== 4)
      throw new bloombox.rpc.RPCException('Invalid scope override value.');
    partnerCode = pieces[1];
    locationCode = pieces[3];
  }

  bloombox.logging.info('Retrieving shop info for \'' +
    partnerCode + ':' + locationCode + '\'...');

  // stand up an RPC object
  const rpc = new bloombox.shop.rpc.ShopRPC(
    /** @type {bloombox.shop.Routine} */ (bloombox.shop.Routine.SHOP_INFO),
    'GET', [
      'partners', partnerCode,
      'locations', locationCode,
      'shop', 'info'].join('/'));

  let done = false;
  rpc.send(function(response) {
    if (done) return;
    if (response !== null) {
      done = true;

      bloombox.logging.log('Received response for shop info RPC.', response);
      if (typeof response === 'object') {
        let status;

        switch ((/** @type {bloombox.shop.ShopStatus} */ (
          response['shopStatus'])) || bloombox.shop.ShopStatus.OPEN) {
          case bloombox.shop.ShopStatus.CLOSED:
            // entirely closed
            status = proto.bloombox.partner.settings.ShopStatus.CLOSED;
            break;

          case bloombox.shop.ShopStatus.DELIVERY_ONLY:
            // delivery only
            status = proto.bloombox.partner.settings.ShopStatus.DELIVERY_ONLY;
            break;

          case bloombox.shop.ShopStatus.PICKUP_ONLY:
            // pickup only
            status = proto.bloombox.partner.settings.ShopStatus.PICKUP_ONLY;
            break;

          default:
            // the shop is entirely open
            status = proto.bloombox.partner.settings.ShopStatus.OPEN;
        }

        if (callback) {
          const response = (
            new proto.bloombox.services.shop.v1.ShopInfo.Response());
          response.setShopStatus(status);

          // dispatch the callback
          callback(response, null);
        }
      } else {
        bloombox.logging.error(
          'Received unrecognized response payload for shop info.', response);
        if (callback) {
          callback(null, null);
        }
      }
    }
  }, function(status) {
    bloombox.logging.error(
      'An error occurred while querying shop info. Status code: \'' +
      status + '\'.');

    // pass null to indicate an error
    callback(null, status);
  });
};


/**
 * Verify a zipcode for delivery eligibility.
 *
 * @param {string} zipcode Zipcode to verify. Do not include anything more than
 *        the first 5 digits.
 * @param {bloombox.shop.ZipcheckCallback} callback Callback to indicate zip
 *        eligibility response information.
 * @param {?bloombox.shop.ShopOptions=} opts Options for the call.
 * @throws {bloombox.rpc.RPCException} If the provided zipcode is invalid.
 */
bloombox.shop.zipcheckLegacy = function(zipcode, callback, opts) {
  // basic type checking
  if (!zipcode || !(typeof zipcode === 'string') ||
    !(zipcode.length === 5) || isNaN(parseInt(zipcode, 10)))
  // invalid zipcode
    throw new bloombox.rpc.RPCException(
      'Zipcode was found to be invalid: ' + zipcode);

  bloombox.logging.info('Verifying zipcode \'' + zipcode +
    '\' for delivery eligibility...');

  // load partner and location codes
  let config = bloombox.config.active();
  let partnerCode = config.partner;
  let locationCode = config.location;

  if (opts && opts.scope) {
    const splitScope = opts.scope.split('/');
    if (splitScope.length !== 4)
      throw new bloombox.rpc.RPCException('Invalid scope override.');
    partnerCode = splitScope[1];
    locationCode = splitScope[3];
  }

  // it's a seemingly-valid zipcode, verify it with the server
  const rpc = new bloombox.shop.rpc.ShopRPC(
    /** @type {bloombox.shop.Routine} */ (bloombox.shop.Routine.CHECK_ZIP),
    'GET', [
      'partners', partnerCode,
      'locations', locationCode,
      'zipcheck', zipcode].join('/'));

  let done = false;
  rpc.send(function(response) {
    if (done) return;

    if (response !== null) {
      done = true;

      bloombox.logging.log('Received response for zipcheck RPC.', response);
      if ((typeof response === 'object')) {
        const payload = (
          new proto.bloombox.services.shop.v1.CheckZipcode.Response());

        // interrogate response for zipcode support status
        let supported = response['supported'] === true;
        payload.setSupported(supported);

        let deliveryMinimum = /** @type {?number} */ (null);
        if ('deliveryMinimum' in response) {
          if (typeof response['deliveryMinimum'] === 'number') {
            deliveryMinimum = /** @type {number} */ (
              response['deliveryMinimum']);

            bloombox.logging.log('Resolved delivery minimum: $' +
              deliveryMinimum + '.');
            payload.setDeliveryMinimum(deliveryMinimum);
          } else if (response['deliveryMinimum'] === undefined ||
            response['deliveryMinimum'] === null ||
            response['deliveryMinimum'] === 0.0 ||
            response['deliveryMinimum'] === 0) {
            // there is no delivery minimum
            deliveryMinimum = null;

            bloombox.logging.log('No delivery minimum specified.');
          } else {
            bloombox.logging.warn('Unrecognized delivery minimum.',
              response['deliveryMinimum']);
          }
        }
        callback(payload, null);
      } else {
        bloombox.logging.error(
          'Received unrecognized response payload for zipcheck.', response);
        callback(null, null);
      }
    }
  }, function(status) {
    bloombox.logging.error(
      'An error occurred while verifying a zipcode. Status code: \'' +
      status + '\'.');

    // pass null to indicate an error
    callback(null, null);
  });
};



/**
 * Defines an implementation of the Bloombox Shop API, which calls into legacy
 * systems via the `v1beta0` adapter.
 *
 * @implements bloombox.shop.ShopAPI
 */
bloombox.shop.v1beta0.Service = (class ShopV0 {
  /**
   * Construct a new instance of the `v1beta0` Shop API service. The instance is
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
    return new Promise((resolve, reject) => {
      bloombox.shop.infoLegacy((response, err) => {
        if (err || !response) {
          if (callback) callback(null, err || response);
          reject(err || response);
        } else {
          if (callback) callback(response, null);
          resolve(response);
        }
      }, config);
    });
  }

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
   */
  zipcheck(zipcode, callback, config) {
    return new Promise((resolve, reject) => {
      bloombox.shop.zipcheckLegacy(zipcode, (response, err) => {
        if (err || !response) {
          if (callback) callback(null, err || response);
          reject(err || response);
        } else {
          if (callback) callback(response, null);
          resolve(response);
        }
      }, config);
    });
  }
});
