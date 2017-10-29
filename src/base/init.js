
/**
 * Bloombox JS
 *
 * @fileoverview Provides initial boot code for Bloombox JS.
 */

/*global goog */

goog.provide('bloombox.DEBUG');
goog.provide('bloombox.VERSION');
goog.provide('bloombox.config');

// force-load closure and closure UI libraries
goog.require('goog.proto');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');


/**
 * Global debug flag.
 *
 * @define {boolean} Global switch for logging and other debug features.
 * @public
 */
bloombox.DEBUG = true;


/**
 * Global library version.
 *
 * @define {string} Global version string.
 * @export
 */
bloombox.VERSION = 'v1.0.0';


/**
 * Holds global configuration for the library.
 *
 * @nocollapse
 * @type {{key: ?string, partner: ?string, location: ?string, channel: ?string, endpoints: {shop: ?string, telemetry: ?string}}}
 */
bloombox.config = {
  key: null,
  partner: null,
  location: null,
  channel: null,
  endpoints: {
    shop: null,
    telemetry: null
  }
};
