
/**
 * Bloombox JS: Init
 *
 * @fileoverview Initial boot code for Bloombox JS.
 */

/*global goog */

goog.provide('bloombox.DEBUG');
goog.provide('bloombox.VERSION');

// force-load closure and closure UI libraries
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');


/**
 * Global debug flag.
 *
 * @define {boolean} DEBUG Global switch for logging and other debug
 *         features.
 * @public
 */
bloombox.DEBUG = true;


/**
 * Global library version.
 *
 * @define {string} VERSION Global version string.
 * @export
 */
bloombox.VERSION = 'v1.0.0';
