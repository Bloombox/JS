
/**
 * Bloombox JS: Logging
 *
 * @fileoverview Provides logging tools.
 */

/*global goog */

goog.provide('bloombox.logging.error');
goog.provide('bloombox.logging.info');
goog.provide('bloombox.logging.log');
goog.provide('bloombox.logging.warn');

goog.require('bloombox.DEBUG');


/**
 * Send a log message to the console.
 *
 * @param {...*} var_args Arguments to log.
 */
bloombox.logging.log = function(var_args) {
  if (bloombox.DEBUG)
    console.log.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};


/**
 * Send an INFO-level message to the console.
 *
 * @param {...*} var_args Arguments to log.
 */
bloombox.logging.info = function(var_args) {
  if (bloombox.DEBUG)
    console.info.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};


/**
 * Send a WARN-level message to the console.
 *
 * @param {...*} var_args Arguments to log.
 */
bloombox.logging.warn = function(var_args) {
  console.warn.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};


/**
 * Send an ERROR-level message to the console.
 *
 * @param {...*} var_args Arguments to log.
 */
bloombox.logging.error = function(var_args) {
  console.error.apply(console, ['[Bloombox]'].concat(Array.from(arguments)));
};
