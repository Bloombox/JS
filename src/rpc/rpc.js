
/*
 * Copyright 2018, Bloombox, LLC.
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

goog.provide('bloombox.rpc.RPC');
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


/**
 * Return an `RPC` instance for a generic HTTP RPC call.
 *
 * @param {string} httpMethod HTTP method to use.
 * @param {string} endpoint URL endpoint to send the RPC to.
 * @param {?Object=} opt_payload Payload to use if we're POST-ing or PUT-ing.
 * @param {string=} opt_trace Trace ID to specify for the RPC.
 * @param {boolean=} opt_keep Whether to keep this RPC around.
 * @constructor
 * @struct
 * @public
 */
bloombox.rpc.RPC = function RPC(httpMethod,
                                endpoint,
                                opt_payload,
                                opt_trace,
                                opt_keep) {
  let config = bloombox.config.active();
  let apiKey = config.key;
  let partner = config.partner;
  let location = config.location;
  if ((typeof opt_payload !== 'object') &&
      opt_payload !== null &&
      opt_payload !== undefined)
    throw new bloombox.rpc.RPCException('Invalid payload for RPC: ' +
        opt_payload);
  if (!apiKey || !partner || !location)
    throw new bloombox.rpc.RPCException(
      'Must call bloombox.setup before sending an RPC.');

  /**
   * HTTP method for this RPC.
   *
   * @type {string}
   * @package
   */
  this.httpMethod = httpMethod;

  /**
   * Trace ID to set on this RPC.
   *
   * @type {?string}
   */
  this.trace = opt_trace || null;

  /**
   * Endpoint URL.
   *
   * @type {string}
   * @package
   */
  this.endpoint = endpoint;

  /**
   * Payload data for this RPC, if any.
   *
   * @type {?Object}
   * @package
   */
  this.payload = opt_payload || null;

  /**
   * RPC completion flag.
   *
   * @type {boolean}
   * @package
   */
  this.done = false;

  /**
   * Underlying XHR object.
   *
   * @type {?goog.net.XhrIo}
   * @package
   */
  this.xhr = new goog.net.XhrIo();

  /**
   * API key to use.
   *
   * @type {string}
   * @package
   */
  this.apiKey = apiKey;

  /**
   * Partner code.
   *
   * @type {string}
   * @package
   */
  this.partner = partner;

  /**
   * Location code.
   *
   * @type {string}
   * @package
   */
  this.location = location;

  /**
   * Flag to keep this RPC around for re-use. Defaults to `false`.
   *
   * @type {boolean}
   * @package
   */
  this.keep = opt_keep || false;

  /**
   * Headers to add.
   *
   * @type {Object}
   * @package
   */
  this.headers = {
    'Accept': bloombox.rpc.ACCEPT_HEADER_VALUE
  };

  // attach debug header, if so-instructed
  if (bloombox.DEBUG || (window[bloombox.DEBUG_PROPERTY] === true))
    this.headers['X-Bloom-Debug'] = 'debug';

  bloombox.logging.log('Constructed RPC for endpoint \'' +
      this.endpoint + '\'.', {'rpc': this});
};


/**
 * RPC onload callback.
 *
 * @param {function(?Object)} success Success callback to bind in.
 * @param {function(?number, ?Object=, ?number=, ?string=)} error Error callback
 *        to dispatch in case a failure is encountered. In the following order,
 *        the parameter is list: HTTP status code, error object raised (if any),
 *        specific failure code (if any), and specific failure message (if any).
 * @return {function(goog.events.Event)} On-load callback function.
 */
bloombox.rpc.RPC.prototype.onload = function(success, error) {
  /**
   * @this {bloombox.rpc.RPC}
   * @param {goog.events.Event} event
   */
  function onload(event) {
    // if we're done, begin responding
    if (event && this.done === false) {
      this.done = true;
      let contentType = this.xhr.getResponseHeader('Content-Type');
      let contentLength = this.xhr.getResponseHeader('Content-Length');
      try {
        let response = this.xhr.getResponseJson();

        // parse status
        let status = this.xhr.getStatus();

        if (status === 200 ||
          status === 201 ||
          status === 202 ||
          status === 204) {
          bloombox.logging.log('RPC received successful status ' +
            status, {'xhr': this.xhr});

          if (!response &&
            (!contentLength || parseInt(contentLength, 10) === 0)) {
            // no response body means a successful transaction, technically
            bloombox.logging.warn(
              'Response returned for RPC was empty or invalid.', this);
            success(null);
          } else {
            if (contentType === 'application/json' ||
              contentType.startsWith('application/json')) {
              bloombox.logging.log(
                'Loaded payload for successful RPC transaction.',
                {'rpc': this, 'response': response});
              success(/** @type {Object} */ (response));
            } else {
              bloombox.logging.error(
                'Server indicated unrecognized content type:',
                contentType);
              error(null, response, status, /** @type {?string} */ (
                response ? response['message'] : null));
            }
          }
        } else {
          let response = /** @type {?Object} */ (null);
          try {
            response = this.xhr.getResponseJson();
          } catch (e) {
            // cannot process response JSON
            bloombox.logging.error('Unable to parse error state JSON, with ' +
              ' status ' + status + '. Encountered: ' + e.toString(),
              {'xhr': this.xhr,
               'status': status,
               'response': response,
               'error': e});
            response = null;
          }

          let errorCode = /** @type {?string} */ (null);
          let errorMessage = /** @type {?string} */ (null);
          if (response !== null) {
            errorCode = response['code'];
            errorMessage = response['message'];
            bloombox.logging.error('Failed to resolve RPC: unrecognized ' +
              ' status ' + status,
              {'xhr': this.xhr,
               'status': status,
               'response': response,
               'code': errorCode,
               'message': errorMessage});
          } else {
            bloombox.logging.error('Failed to resolve RPC: unrecognized ' +
              ' status ' + status + '. Additionally, failed to parse ' +
              'response JSON.',
              {'xhr': this.xhr, 'status': status, 'response': response});
          }

          // some error event i.e. unrecognized status code
          let err = new Error(
            'RPC Error: "' + this.httpMethod + ' ' + this.endpoint + '"\n' +
            'Status: ' + status.toString() + '\n' +
            'Error code: ' + errorCode + '\n' +
            'Error reason: ' + errorMessage + '\n' +
            'XHR Failure code: ' + this.xhr.getLastErrorCode() + '\n' +
            'XHR Failure reason: ' + this.xhr.getLastError() + '\n' +
            'Key: ' + this.apiKey);
          err.code = status || this.xhr.getLastErrorCode() || -1;
          stackdriver.reportError(err);
          error(status, err, errorCode, errorMessage);
        }
        if (!this.keep) this.xhr = null;
      } catch (err) {
        // catch invalid JSON
        if (err instanceof Error) {
          if (err.message.toLowerCase().indexOf('invalid json') !== -1) {
            // json parse error
            err.code = this.xhr.getLastErrorCode() || -1;
            err.message = 'RPC failed with error \'' + (err.name || 'UNKNOWN') +
              '\'.\nEndpoint: ' + this.endpoint +
              '\nFailure code: ' + this.xhr.getLastErrorCode() +
              '\nFailure reason: ' + this.xhr.getLastError() +
              '\nResponse: "' + this.xhr.getResponseText() + '".';

            bloombox.logging.error('Failed to resolve RPC.', {
              'xhr': this.xhr,
              'error': err
            });
            stackdriver.reportError(err);
            error(null, err);
          }
        }
      }
    }
  }

  return onload.bind(this);
};


/**
 * Send a prepared RPC.
 *
 * @param {function(?Object)} callback Callback to dispatch once we're done.
 * @param {function(?number, ?Object=, ?number=, ?string=)} error Error callback
 *        to dispatch in case there is a failure.
 * @throws {bloombox.rpc.RPCException} If `send` is called twice and this
 *         XHR has already send and `keep` is falsy.
 */
bloombox.rpc.RPC.prototype.send = function(callback, error) {
  // attach the on-load handler
  goog.events.listen(
    this.xhr,
    goog.net.EventType.COMPLETE,
    this.onload(callback.bind(this), error.bind(this)));

  // open the XHR
  let targetEndpoint = [
    this.endpoint, ['key', this.apiKey].join('=')].join('?');
  bloombox.logging.log('Initializing RPC with HTTP request: \'' +
      this.httpMethod + ' ' + targetEndpoint + '\'');

  // attach headers
  if (bloombox.DEBUG) {
    for (let key in this.headers) {
      if (this.headers.hasOwnProperty(key)) {
        let context = {};
        context[key] = this.headers[key];
        bloombox.logging.log('Setting request header: ', context);
      }
    }
  }

  bloombox.logging.log('Sending RPC...', this);

  // JSON-encode data if we have it to send
  let payloadData = this.payload !== null ? JSON.stringify(this.payload) : null;

  let overrideHeaders = {};

  // set the trace header if so-instructed
  if (this.trace)
    overrideHeaders[bloombox.rpc.TRACE_HEADER] = this.trace;

  // same with the debug headers
  if (bloombox.DEBUG || (window[bloombox.DEBUG_PROPERTY] === true))
    this.headers['X-Bloom-Debug'] = 'debug';

  let finalizedHeaders = Object.assign({}, this.headers, overrideHeaders);

  // send the underlying XHR
  this.xhr.send(
    targetEndpoint,
    this.httpMethod,
    payloadData,
    finalizedHeaders);
};
