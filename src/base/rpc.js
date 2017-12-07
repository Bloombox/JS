
/*
 * Copyright 2017, Bloombox, LLC.
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

goog.provide('bloombox.rpc.RPC');
goog.provide('bloombox.rpc.RPCException');

goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');
goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('goog.events');
goog.require('goog.net.XhrIo');



/**
 * Exception object for the construction phase of an RPC. Usually thrown when
 * no API key is present, or `setup` is not called before RPC methods.
 *
 * @param {string} message Message for the error.
 * @constructor
 * @public
 */
bloombox.rpc.RPCException = function RPCException(message) {
  this.message = message;
};


/**
 * API key header.
 *
 * @type {string}
 * @const
 * @package
 */
bloombox.rpc.ACCEPT_HEADER = 'application/json,*/*';


/**
 * API key header.
 *
 * @type {string}
 * @const
 * @package
 */
bloombox.rpc.API_KEY_HEADER = 'X-Bloombox-API-Key';


/**
 * API client header.
 *
 * @type {string}
 * @const
 * @package
 */
bloombox.rpc.API_CLIENT_HEADER = 'X-Bloombox-API-Client';


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
 * @param {boolean=} opt_keep Whether to keep this RPC around.
 * @constructor
 * @struct
 * @public
 */
bloombox.rpc.RPC = function RPC(httpMethod, endpoint, opt_payload, opt_keep) {
  let config = bloombox.config.active();
  let apiKey = config.key;
  let partner = config.partner;
  let location = config.location;
  if (!apiKey || !(typeof apiKey === 'string'))
    throw new bloombox.rpc.RPCException('API key could not be resolved.' +
        ' Please call `setup` before any RPC methods.');
  if (!partner || !(typeof partner === 'string'))
    throw new bloombox.rpc.RPCException('Partner code could not be resolved.' +
        ' Please call `setup` before any RPC methods.');
  if (!location || !(typeof location === 'string'))
    throw new bloombox.rpc.RPCException('Location code could not be resolved.' +
        ' Please call `setup` before any RPC methods.');
  if ((typeof opt_payload !== 'object') &&
      opt_payload !== null &&
      opt_payload !== undefined)
    throw new bloombox.rpc.RPCException('Invalid payload for RPC: ' +
        opt_payload);

  /**
   * HTTP method for this RPC.
   *
   * @type {string}
   * @package
   */
  this.httpMethod = httpMethod;

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
    'Accept': bloombox.rpc.ACCEPT_HEADER
  };

  bloombox.logging.log('Constructed RPC for endpoint \'' +
      this.endpoint + '\'.', {'rpc': this});
};


/**
 * RPC onload callback.
 *
 * @param {function(?Object)} success Success callback to bind in.
 * @param {function(?number=)} error Error callback to bind in.
 * @return {function(goog.events.Event)} On-load callback function.
 */
bloombox.rpc.RPC.prototype.onload = function(success, error) {
  return onload.bind(this);

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
          // parse response text
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
            error(null);
          }
        }
      } else {
        // some error event i.e. unrecognized status code
        bloombox.logging.error('Failed to resolve RPC: unrecognized status ' +
          status, {'xhr': this.xhr});
        error(status);
      }
      if (!this.keep) this.xhr = null;
    }
  }
};


/**
 * Send a prepared RPC.
 *
 * @param {function(?Object)} callback Callback to dispatch once we're done.
 * @param {function(?number=)} error Error callback.
 * @throws {bloombox.rpc.RPCException} If `send` is called twice and this
 *         XHR has already send and `keep` is falsy.
 */
bloombox.rpc.RPC.prototype.send = function(callback, error) {
  if (this.xhr === null)
    throw new bloombox.rpc.RPCException(
      'Cannot re-send an already-sent RPC without \'keep\' mode active.');

  // check API key
  if (!this.apiKey)
    throw new bloombox.rpc.RPCException(
      'Failed to resolve API key before request.');
  if (!this.partner)
    throw new bloombox.rpc.RPCException(
      'Partner was not set.');
  if (!this.location)
    throw new bloombox.rpc.RPCException(
      'Location was not set.');

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

  // send the underlying XHR
  this.xhr.send(
    targetEndpoint,
    this.httpMethod,
    payloadData,
    this.headers);
};
