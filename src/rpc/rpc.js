/*
 * Copyright 2019, Momentum Ideas, Co.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox JS: RPC Internals
 *
 * @fileoverview Provides low-level tools for RPCs.
 */

/*global goog */

goog.require('bloombox.DEBUG');
goog.require('bloombox.DEBUG_PROPERTY');
goog.require('bloombox.VERSION');
goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('goog.events');
goog.require('goog.net.XhrIo');

goog.require('stackdriver.reportError');

goog.provide('bloombox.rpc.ACCEPT_HEADER_VALUE');
goog.provide('bloombox.rpc.API_KEY_HEADER');
goog.provide('bloombox.rpc.DEBUG_HEADER');

goog.provide('bloombox.rpc.RPCException');

goog.provide('bloombox.rpc.ScopedOptions');
goog.provide('bloombox.rpc.TRACE_HEADER');

goog.provide('bloombox.rpc.context');
goog.provide('bloombox.rpc.metadata');


/**
 * Exception object for the construction phase of an RPC. Usually thrown when
 * no API key is present, or `setup` is not called before RPC methods.
 *
 * @param {string} message Message for the error.
 * @constructor
 * @export
 */
bloombox.rpc.RPCException = function RPCException(message) {
  /**
   * Exception message.
   *
   * @type {string}
   */
  this.message = message;
};


/**
 * Accepted content type for response payloads.
 *
 * @type {string}
 * @const
 * @public
 */
bloombox.rpc.ACCEPT_HEADER_VALUE = 'application/json,*/*';


/**
 * API key header.
 *
 * @type {string}
 * @const
 * @public
 */
bloombox.rpc.API_KEY_HEADER = 'X-API-Key';


/**
 * Debug header.
 *
 * @type {string}
 * @const
 * @public
 */
bloombox.rpc.DEBUG_HEADER = 'X-Bloom-Debug';


/**
 * Trace header.
 *
 * @type {string}
 * @const
 * @public
 */
bloombox.rpc.TRACE_HEADER = 'X-Bloom-Trace';


/**
 * Generate metadata for a v2 RPC request, via gRPC. This includes any debug or
 * tracing information, and the API key active in the current scope.
 *
 * @param {bloombox.config.JSConfig} activeConfig Active SDK configuration.
 * @param {?Object=} additional Extra configuration to merge in.
 * @return {Object} Metadata object to use for the RPC request.
 */
bloombox.rpc.metadata = function(activeConfig, additional) {
  // attach base agent header
  let base = {
    'x-api-agent': 'Bloombox RPC Client v2 (JS SDK)'
  };

  // attach API key header
  if (activeConfig && activeConfig.key)
    base[bloombox.rpc.API_KEY_HEADER] = activeConfig.key;
  return Object.assign({}, base, additional);
};


/**
 * Defines an interface that provides options, including a scope value, that may
 * override the global scope value installed in library config.
 */
bloombox.rpc.ScopedOptions = (class ScopedOptions {
  /**
   * Describes properties attached to a scoped options object.
   *
   * @param {?string} scope Partnership scope to override this RPC with, if
   *        applicable. If left unset, defaults to `null`.
   */
  constructor(scope) {
    /**
     * Partnership scope to use as an override for this RPC, if applicable.
     * Defaults to null if left unset.
     *
     * @protected
     * @type {?string}
     */
    this.scope = scope || null;
  }

  /**
   * Return the set scope override, if any.
   *
   * @public
   * @returns {?string}
   */
  getScope() {
    return this.scope;
  }
});


/**
 * Resolve partnership context for a given RPC call. This involves merging
 * whatever configuration might exist globally in the library with override
 * values specified, if applicable.
 *
 * @param {?bloombox.rpc.ScopedOptions=} config Configuration options supporting
 *        a scope override.
 * @return {{partner: string, location: string}} Resolved partner and location.
 * @throws {bloombox.rpc.RPCException} If the values cannot be resolved.
 */
bloombox.rpc.context = function(config) {
  // apply resolved scope
  let partnerCode;
  let locationCode;
  if (config && config.getScope()) {
    const scopePieces = config.getScope().split('/');
    if (scopePieces.length !== 4)
      throw new bloombox.rpc.RPCException('Invalid scope override.');
    partnerCode = scopePieces[1];
    locationCode = scopePieces[3];
  } else {
    const activeConfig = bloombox.config.active();
    partnerCode = activeConfig.partner;
    locationCode = activeConfig.location;
  }
  if (!partnerCode || !locationCode)
    throw new bloombox.rpc.RPCException(
      'Failed to resolve scope. ' +
      'Please run bloombox.setup before calling methods.');
  return {
    partner: partnerCode,
    location: locationCode
  };
};


// noinspection JSUnusedGlobalSymbols
/**
 * Show this exception's message.
 *
 * @return {string} Message for this exception.
 */
bloombox.rpc.RPCException.prototype.toString = function() {
  return 'RPCException: ' + this.message;
};
