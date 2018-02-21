
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
 * Bloombox: Verify
 *
 * @fileoverview Provides a method to verify a potential customer.
 */

/*global goog */

goog.provide('bloombox.shop.order.VerifyException');
goog.provide('bloombox.shop.verify');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.shop.Customer');
goog.require('bloombox.shop.Routine');
goog.require('bloombox.shop.rpc.ShopRPC');

goog.require('bloombox.telemetry.InternalCollection');
goog.require('bloombox.telemetry.event');
goog.require('bloombox.telemetry.notifyUserID');

goog.require('proto.bloombox.schema.services.shop.v1.VerifyError');
goog.require('proto.bloombox.schema.services.shop.v1.VerifyMember');



/**
 * Callback function type definition for verify RPCs.
 *
 * @typedef {function(boolean, ?proto.bloombox.schema.services.shop.v1.VerifyError, ?bloombox.shop.Customer)}
 */
bloombox.shop.VerifyCallback;


/**
 * Represents an exception that occurred while preparing or submitting
 * a verification request.
 *
 * @param {string} message Exception error message.
 * @constructor
 * @export
 */
bloombox.shop.order.VerifyException = function VerifyException(message) {
  this.message = message;
};


/**
 * Verify a user via Bloombox.
 *
 * @param {string} email Email address to verify.
 * @param {bloombox.shop.VerifyCallback} callback Optional endpoint override.
 * @throws {bloombox.shop.order.VerifyException} If email is invalid.
 * @export
 */
bloombox.shop.verify = function(email,
                                callback) {
  if (email === null || email === undefined || !email ||
      email.length < 5 ||
      (typeof email !== 'string'))
    throw new bloombox.shop.order.VerifyException(
      'Email was found to be empty or invalid, cannot verify.');

  let config = bloombox.config.active();
  let partner = config.partner;
  let location = config.location;

  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

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
        new proto.bloombox.schema.services.shop.v1.VerifyMember.Response());
      inflated.setVerified((response['verified'] === true) || false);
      if (response['error']) {
        inflated.setError(response['error']);
      }

      if (inflated) {
        let customer = (response['verified'] === true) ?
          bloombox.shop.Customer.fromResponse(
            /** @type {Object} */ (response)) : null;
        let verified = response['verified'] === true;
        if (verified) {
          bloombox.logging.log('Loaded \'Customer\' record from response.',
            customer);
        } else {
          bloombox.logging.log(
            'Customer could not be verified at email address \'' +
            email + '\'.');
        }
        callback(inflated.getVerified(), null, customer);

        // if we succeeded, get the user's key and set it for analytics
        if (customer.getUserKey() !== null) {
          bloombox.telemetry.notifyUserID(customer.getUserKey());
        } else {
          bloombox.logging.info('Unable to resolve user key from decoded ' +
            'customer.', {'customer': customer});
        }

        // indicate verification status
        let verificationData = {
          'allowed': inflated.getVerified()
        };

        // attach customer to payload if we have one
        if (verified) {
          verificationData['customer'] = customer;
        }

        // verification event
        bloombox.telemetry.event(
          bloombox.telemetry.InternalCollection.VERIFICATION,
          {'action': 'verify',
           'verification': verificationData}).send();
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
