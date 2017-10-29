
/**
 * Bloombox: Setup
 *
 * @fileoverview Provides logic for setup of Bloombox JS.
 */

/*global goog */

goog.provide('bloombox.setup');

goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

// force-load closure and closure UI libraries
goog.require('goog.proto');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');


/**
 * Setup Bloombox JS. Provide your API key and partner/location.
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback to be dispatched when
 *        the JS API is ready.
 * @export
 */
bloombox.setup = function(partner, location, apikey, callback) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  bloombox.config.key = apikey;
  bloombox.config.partner = partner;
  bloombox.config.location = location;

  bloombox.logging.log('BBJS is ready for use.',
    {'version': bloombox.VERSION,
     'debug': bloombox.DEBUG,
     'config': bloombox.config});
  callback();
};
