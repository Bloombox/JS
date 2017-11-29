
/**
 * Bloombox Shop: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Shop API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

// - Base
goog.require('bloombox.shop.DEBUG');
goog.require('bloombox.shop.SHOP_API_ENDPOINT');
goog.require('bloombox.shop.VERSION');

// - Shop Library
goog.require('bloombox.shop.enroll.Enrollment');
goog.require('bloombox.shop.info');
goog.require('bloombox.shop.order.Order');
goog.provide('bloombox.shop.setup');
goog.require('bloombox.shop.verify');
goog.require('bloombox.shop.zipcheck');


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

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config, {'endpoints':
      Object.assign({}, config.endpoints || {}, {
        'shop': endpoint || bloombox.shop.SHOP_API_ENDPOINT})}));

  bloombox.config.configure(merged);

  bloombox.logging.log('Shop is ready for use.',
    {'version': bloombox.shop.VERSION,
      'debug': bloombox.shop.DEBUG,
      'config': bloombox.config.active()});
  callback();
};
