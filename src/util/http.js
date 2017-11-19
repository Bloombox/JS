
/**
 * Bloombox Utils: HTTP
 *
 * @fileoverview Provides RPC tools for managing a pool of XHRs.
 */

/*global goog */

goog.provide('bloombox.util.HTTPMethod');


/**
 * Enumerates HTTP methods.
 *
 * @enum {string}
 * @public
 */
bloombox.util.HTTPMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD'
};
