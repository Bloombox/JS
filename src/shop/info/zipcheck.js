
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
 * Bloombox: Zipcode Check
 *
 * @fileoverview Provides the ability to verify zipcodes for delivery
 * eligibility.
 */

/*global goog */

goog.provide('bloombox.shop.ZipcheckException');
goog.provide('bloombox.shop.zipcheck');

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.info');
goog.require('bloombox.logging.log');

goog.require('bloombox.shop.Routine');
goog.require('bloombox.shop.rpc.ShopRPC');

goog.require('stackdriver.protect');


// -- Structures -- //

/**
 * Callback function type declaration for zipcode checking.
 *
 * @typedef {function(?boolean, ?number)}
 */
bloombox.shop.ZipCheckCallback;


/**
 * Represents an exception that occurred while validating a zipcode for delivery
 * eligibility.
 *
 * @param {string} message Exception error message.
 * @constructor
 * @export
 */
bloombox.shop.ZipcheckException = function ZipcheckException(message) {
  /**
   * Exception message.
   *
   * @type {string}
   */
  this.message = message;
};


/**
 * Public accessor method to retrieve this exception's error message.
 *
 * @return {string}
 * @export
 */
bloombox.shop.ZipcheckException.prototype.getMessage = function() {
  return this.message;
};


/**
 * Verify a zipcode for delivery eligibility.
 *
 * @param {string} zipcode Zipcode to verify. Do not include anything more than
 *        the first 5 digits.
 * @param {bloombox.shop.ZipCheckCallback} callback Callback to indicate
 *        zip eligibility.
 * @throws {bloombox.shop.ZipcheckException} If the provided zipcode is invalid.
 * @export
 */
bloombox.shop.zipcheck = function(zipcode, callback) {
  // basic type checking
  if (!zipcode || !(typeof zipcode === 'string') ||
      !(zipcode.length === 5) || isNaN(parseInt(zipcode, 10)))
    // invalid zipcode
    throw new bloombox.shop.ZipcheckException(
      'Zipcode was found to be invalid: ' + zipcode);

  bloombox.logging.info('Verifying zipcode \'' + zipcode +
      '\' for delivery eligibility...');

  // load partner and location codes
  let config = bloombox.config.active();
  let partnerCode = config.partner;
  let locationCode = config.location;

  if (!partnerCode ||
      !(typeof partnerCode === 'string' && partnerCode.length > 1) ||
      !(typeof locationCode === 'string' && locationCode.length > 1))
    throw new bloombox.shop.ZipcheckException(
      'Partner and location must be set via `bloombox.shop.setup` before' +
      ' conducting a zipcode eligibility check.');

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
        // interrogate response for zipcode support status
        let supported = response['supported'] === true;
        let deliveryMinimum = /** @type {?number} */ (null);
        if ('deliveryMinimum' in response) {
          if (typeof response['deliveryMinimum'] === 'number') {
            deliveryMinimum = /** @type {number} */ (
              response['deliveryMinimum']);

            bloombox.logging.log('Resolved delivery minimum: $' +
                                 deliveryMinimum + '.');
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
        callback(supported, deliveryMinimum);
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
