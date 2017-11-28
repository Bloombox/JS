
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

goog.require('proto.commerce.Customer');
goog.require('proto.services.shop.v1.VerifyError');
goog.require('proto.services.shop.v1.VerifyMember');



/**
 * Callback function type definition for verify RPCs.
 *
 * @typedef {function(boolean, ?proto.services.shop.v1.VerifyError, ?bloombox.shop.Customer)}
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
    if (response != null) {
      done = true;

      bloombox.logging.log('Response received for verify RPC.', response);

      // decode the response
      let inflated = new proto.services.shop.v1.VerifyMember.Response();
      inflated.setVerified((response['verified'] === true) || false);
      if (response['error']) {
        inflated.setError(response['error']);
      }

      if (inflated) {
        let customer = (response['verified'] === true) ?
          bloombox.shop.Customer.fromResponse(
            /** @type {Object} */ (response)) : null;
        if (response['verified'] === true)
          bloombox.logging.log('Loaded \'Customer\' record from response.',
              customer);
        else
          bloombox.logging.log(
            'Customer could not be verified at email address \'' +
              email + '\'.');
        callback(inflated.getVerified(), null, customer);
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
