
/**
 * Bloombox Shop: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Shop API.
 */

/*global goog */

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

goog.require('bloombox.setup');

goog.require('bloombox.shop.DEBUG');
goog.require('bloombox.shop.SHOP_API_ENDPOINT');
goog.require('bloombox.shop.VERSION');

goog.provide('bloombox.shop.setup');


/**
 * Setup the Bloombox Shop API. Provide your API key and an endpoint if you
 * would like to override the default (most users should not need to).
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback dispatched when the Shop API is ready.
 * @param {string=} endpoint Override for endpoint. Uses default if unspecified.
 * @export
 */
bloombox.shop.setup = function(partner, location, apikey, callback, endpoint) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  const resolvedEndpoint = endpoint || bloombox.shop.SHOP_API_ENDPOINT;
  bloombox.setup(partner, location, apikey, function() {
    bloombox.config.endpoints.shop = resolvedEndpoint;
    bloombox.logging.log('Shop is ready for use.',
      {'version': bloombox.shop.VERSION,
       'debug': bloombox.shop.DEBUG,
       'config': bloombox.config});
    callback();
  });
};
