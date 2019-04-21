
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
 * Bloombox: Shop RPC Client, v1beta0
 *
 * @fileoverview Provides an implementation of the Bloombox Shop RPC client,
 *               using deprecated JSON/REST.
 */

/*global goog */

goog.require('bloombox.rpc.RPCException');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.info');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.rpc.FALLBACK');
goog.require('bloombox.rpc.RPC');

goog.require('bloombox.shop.SHOP_API_ENDPOINT');
goog.require('bloombox.shop.SHOP_API_VERSION');
goog.require('bloombox.shop.VERSION');

goog.require('bloombox.shop.Customer');
goog.require('bloombox.shop.InfoCallback');
goog.require('bloombox.shop.ShopAPI');
goog.require('bloombox.shop.ShopOptions');
goog.require('bloombox.shop.ZipcheckCallback');

goog.require('bloombox.telemetry.InternalCollection');
goog.require('bloombox.telemetry.event');
goog.require('bloombox.telemetry.notifyUserID');

goog.require('proto.bloombox.partner.settings.ShopStatus');
goog.require('proto.bloombox.services.shop.v1.CheckZipcode.Response');
goog.require('proto.bloombox.services.shop.v1.ShopInfo.Response');
goog.require('proto.bloombox.services.shop.v1.VerifyError');
goog.require('proto.bloombox.services.shop.v1.VerifyMember');

goog.require('stackdriver.protect');

goog.provide('bloombox.shop.Routine');
goog.provide('bloombox.shop.info');
goog.provide('bloombox.shop.rpc.ShopRPC');
goog.provide('bloombox.shop.v1beta0.Service');


if (bloombox.rpc.FALLBACK) {
  // -- Stubs -- //
  /**
   * Stubbed info function.
   *
   * @param {*} cbk Some parameter.
   * @return {null} Because we have to.
   * @export
   */
  bloombox.shop.info = function(cbk) {
    return null;
  };

  // -- Structures -- //

  /**
   * Enumerates methods in the Shop API.
   *
   * @enum {string}
   */
  bloombox.shop.Routine = {
    VERIFY: 'VERIFY',
    SUBMIT_ORDER: 'SUBMIT_ORDER',
    GET_ORDER: 'GET_ORDER',
    ENROLL_USER: 'ENROLL_USER',
    CHECK_ZIP: 'CHECK_ZIP',
    SHOP_INFO: 'SHOP_INFO'
  };


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


// -- Shop: RPC Internals -- //

  /**
   * Calculate a shop API endpoint, given an RPC method and the base API endpoint.
   *
   * @param {string} endpoint Method to generate an endpoint for.
   * @return {string} Calculated endpoint URI.
   * @package
   */
  bloombox.shop.endpoint = function(endpoint) {
    // force service endpoint in debug mode
    let prefix = bloombox.DEBUG === true ?
      'https://rpc.bloombox.cloud' :
      bloombox.shop.SHOP_API_ENDPOINT;

    return [
      prefix,
      'shop',
      bloombox.shop.SHOP_API_VERSION,
      endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    ].join('/');
  };


  /**
   * Return a `ShopRPC` instance for a generic HTTP RPC call.
   *
   * @param {bloombox.shop.Routine} rpcMethod Method to generate an endpoint for.
   * @param {string} httpMethod HTTP method to use.
   * @param {string} endpoint URL endpoint to send the RPC to.
   * @param {Object=} payload Payload to use if we're POST-ing or PUT-ing.
   * @throws {bloombox.rpc.RPCException} If the provided values are invalid in
   *         some way.
   * @constructor
   * @struct
   */
  bloombox.shop.rpc.ShopRPC = function ShopRPC(rpcMethod,
                                               httpMethod,
                                               endpoint,
                                               payload) {
    let targetEndpoint = bloombox.shop.endpoint(endpoint);

    /**
     * Shop RPC routine we're calling.
     *
     * @type {bloombox.shop.Routine}
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
   * @param {function(?number, ?Object=, ?number=, ?string=)} error Error callback
   *        to dispatch if a failure is encountered.
   */
  bloombox.shop.rpc.ShopRPC.prototype.send = function(callback, error) {
    // send underlying RPC w/callback and errors passed through
    this.rpc.send((function(response) {
        bloombox.logging.log(
          'Shop RPC for method \'' + this.rpcMethod + '\' completed.');
        callback(response);
      }).bind(this), /** @type {function(?number, ?Object=, ?number=, ?string=)} */
      (function(status_code, error_obj, error_code, message_or_failure_name) {
        bloombox.logging.error(
          'Failed to resolve Shop API RPC for method \'' +
          this.rpcMethod + '\': status ' + error_code, {
            'status': status_code,
            'error': error_obj,
            'code': error_code,
            'message': message_or_failure_name});
        error(status_code, error_obj, error_code, message_or_failure_name);
      }).bind(this));
  };


  /**
   * Send follow-up telemetry after verifying a user. This includes basic info
   * about the user account, and the circumstances surrounding their verification,
   * and the verification result.
   *
   * @protected
   * @param {bloombox.shop.Customer} customer Customer resolved from the response.
   * @param {proto.bloombox.services.shop.v1.VerifyMember.Response} inflated Proto
   *        response object, inflated from RPC response.
   * @param {boolean} verified Verification status of the user. If this flag is
   *        true, the user is eligible to submit orders.
   */
  function sendVerifyTelemetry(customer, inflated, verified) {
    let userKey = customer.getUserKey();

    // indicate verification status
    let verificationData = {'allowed': inflated.getVerified()};

    // if we succeeded, get the user's key and set it for analytics
    if (verified) {
      if (userKey && typeof userKey === 'string') {
        bloombox.telemetry.notifyUserID(userKey);
      } else {
        bloombox.logging.info('Unable to resolve user key from decoded ' +
          'customer.', {'customer': customer});
      }
      verificationData['customer'] = {
        'foreignId': customer.getForeignId().trim(),
        'userKey': customer.getUserKey()
      };
    }

    const collection = bloombox.telemetry.Collection.named(
      bloombox.telemetry.InternalCollection.VERIFICATION);

    // verification event
    bloombox.telemetry.events().event(
      collection,
      {'action': 'verify',
       'verification': verificationData});
  }


  /**
   * Retrieve info for the current shop.
   *
   * @param {bloombox.shop.InfoCallback} callback Callback to dispatch.
   * @param {?bloombox.shop.ShopOptions=} opts Options for the call.
   * @throws {bloombox.rpc.RPCException} If partner/location isn't set.
   */
  bloombox.shop.infoLegacy = function(callback, opts) {
    // load partner and location codes
    const scope = bloombox.rpc.context(opts);
    const partnerCode = scope.partner;
    const locationCode = scope.location;

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
    const scope = bloombox.rpc.context(opts);
    const partnerCode = scope.partner;
    const locationCode = scope.location;

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
   * Verify a user via Bloombox.
   *
   * @param {string} email Email address to verify.
   * @param {bloombox.shop.VerifyCallback} callback Optional endpoint override.
   * @param {?bloombox.shop.ShopOptions=} opts Configuration options to apply in
   *        the scope of this single RPC operation.
   * @throws {bloombox.rpc.RPCException} If email is invalid.
   */
  bloombox.shop.verifyLegacy = function(email, callback, opts) {
    if (!email || email.length < 5 ||
      (typeof email !== 'string'))
      throw new bloombox.rpc.RPCException(
        'Email was found to be empty or invalid, cannot verify.');

    const scope = bloombox.rpc.context(opts);
    const partner = scope.partner;
    const location = scope.location;

    const encodedEmail = btoa(email);
    const rpc = new bloombox.shop.rpc.ShopRPC(
      /** @type {bloombox.shop.Routine} */ (bloombox.shop.Routine.VERIFY),
      'GET', [
        'partners', partner,
        'locations', location,
        'members', encodedEmail, 'verify'].join('/'));

    bloombox.logging.log('Verifying user...', {'email': email});

    let done = false;

    rpc.send(function(response) {
      if (done) return;
      if (response !== null) {
        done = true;

        bloombox.logging.log('Response received for verify RPC.', response);

        // decode the response
        let inflated = (
          new proto.bloombox.services.shop.v1.VerifyMember.Response());
        inflated.setVerified((response['verified'] === true) || false);
        if (response['error']) {
          inflated.setError(response['error']);
        }

        if (inflated) {
          let customer = /** @type {?bloombox.shop.Customer} */ (
            (response['verified'] === true) ? bloombox.shop.Customer.fromResponse(
              /** @type {Object} */ (response)) : null);
          let verified = response['verified'] === true;
          if (verified) {
            bloombox.logging.log('Loaded \'Customer\' record from response.',
              customer);
          } else {
            bloombox.logging.log(
              'Customer could not be verified at email address \'' +
              email + '\'.');
          }
          callback(inflated, null);
          sendVerifyTelemetry(customer, inflated, verified);
        } else {
          bloombox.logging.warn('Failed to inflate RPC.', response);
        }
      } else {
        bloombox.logging.warn('Failed to inflate RPC.', response);
      }
    }, function(status) {
      // we got an error
      bloombox.logging.error(status ?
        'Verification RPC failed with unexpected status: \'' + status + '\'.' :
        'Verification RPC response failed to be decoded.');
    });
  };


  // -- Shop API: v1beta0 -- //

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
     * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
     *         the underlying RPC, or during transmission.
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
     * @throws {bloombox.rpc.RPCException} If an error occurs preparing to send
     *         the underlying RPC, or during transmission.
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
    verify(email, callback, config) {
      return new Promise((resolve, reject) => {
        bloombox.shop.verifyLegacy(email, (response, err) => {
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
}
