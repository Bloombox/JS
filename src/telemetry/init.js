
/*
 * Copyright 2019, Momentum Ideas, Co. All rights reserved.
 *
 * Source and object computer code contained herein is the private intellectual
 * property of Bloombox, a California Limited Liability Corporation. Use of this
 * code in source form requires permission in writing before use or the
 * assembly, distribution, or publishing of derivative works, for commercial
 * purposes or any other purpose, from a duly authorized officer of Momentum
 * Ideas Co.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bloombox Telemetry: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Telemetry API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');
goog.require('bloombox.logging.warn');

goog.require('bloombox.telemetry.DEBUG');
goog.require('bloombox.telemetry.InternalCollection');
goog.require('bloombox.telemetry.TELEMETRY_API_ENDPOINT');
goog.require('bloombox.telemetry.VERSION');

goog.require('bloombox.telemetry.didOptOut');
goog.require('bloombox.telemetry.v1beta4.EventService');

goog.provide('bloombox.telemetry.boot');
goog.provide('bloombox.telemetry.sendInitialEvents');
goog.provide('bloombox.telemetry.setup');
goog.provide('bloombox.telemetry.setupPageTracking');


/**
 * Setup the Bloombox Telemetry API. Provide your API key and an endpoint if you
 * would like to override the default (most users should not need to).
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback dispatched when the Shop API is ready.
 * @param {string=} endpoint Override for endpoint. Uses default if unspecified.
 * @export
 */
bloombox.telemetry.setup = function(partner,
                                    location,
                                    apikey,
                                    callback,
                                    endpoint) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config, {'endpoints':
      Object.assign({}, config.endpoints || {}, {
        shop: endpoint || bloombox.telemetry.TELEMETRY_API_ENDPOINT})}));

  bloombox.config.configure(merged);

  bloombox.logging.log('Telemetry is ready for use.',
    {'version': bloombox.telemetry.VERSION,
      'debug': bloombox.telemetry.DEBUG,
      'config': bloombox.config.active()});
  callback();
  bloombox.telemetry.boot();
};


/**
 * Begin handling telemetry data, starting with initial events to be dispatched
 * and an initial server ping.
 *
 * @package
 */
bloombox.telemetry.sendInitialEvents = function() {
  if (bloombox.telemetry.didOptOut()) {
    // user opted out of telemetry
    bloombox.logging.warn(
      'User opted-out of telemetry, skipping initial events.');
  } else {
    const collection = bloombox.telemetry.Collection.named(
      bloombox.telemetry.InternalCollection.LIBRARY);
    // user has not yet opted out
    bloombox.telemetry.events().event(collection,
      {'distribution': 'js-client'});
  }
};


/**
 * Last observed window location.
 *
 * @type {string}
 * @private
 */
bloombox.telemetry.lastURL_ = window.location.href;


/**
 * Milliseconds to wait between URL checks.
 *
 * @const {number}
 * @private
 */
bloombox.telemetry.URL_CHECK_TICK_MS_ = 1500;


/**
 * Cached service for telemetry events.
 *
 * @package
 * @type {?bloombox.telemetry.EventTelemetryAPI}
 */
let cachedEventsService = null;


/**
 * Send a telemetry event due to a URL/location change.
 *
 * @private
 */
bloombox.telemetry.urlDidChange_ = function() {
  // one last check...
  if (window.location.href !== bloombox.telemetry.lastURL_) {
    bloombox.telemetry.lastURL_ = window.location.href;
    bloombox.logging.log('URL changed, sending pageview.',
      {'location': bloombox.telemetry.lastURL_});

    const collection = bloombox.telemetry.Collection.named(
      bloombox.telemetry.InternalCollection.PAGEVIEW);
    bloombox.telemetry.events().event(collection);
  }
};


/**
 * Check the current window location against the last observed one.
 *
 * @private
 */
bloombox.telemetry.checkURL_ = function() {
  if (window.location.href !== bloombox.telemetry.lastURL_) {
    // update it
    bloombox.telemetry.urlDidChange_();
  }

  // repeat the check in URL_CHECK_TICK_MS milliseconds
  setTimeout(bloombox.telemetry.checkURL_,
    bloombox.telemetry.URL_CHECK_TICK_MS_);
};


/**
 * Setup a page tracking listener, and also dispatch it once every N seconds to
 * catch URL changes.
 */
bloombox.telemetry.setupPageTracking = function() {
  window.addEventListener('hashchange', bloombox.telemetry.urlDidChange_);
  bloombox.telemetry.checkURL_();  // begin the tick-based checker
};


/**
 * Begin handling telemetry data, starting with initial events to be dispatched
 * and an initial server ping.
 *
 * @public
 */
bloombox.telemetry.boot = function() {
  if (bloombox.telemetry.didOptOut()) {
    // user opted out of telemetry
    bloombox.logging.warn(
      'User opted-out of telemetry, skipping initial ping.');
  } else {
    // user has not yet opted out
    bloombox.logging.log('Sending initial telemetry ping...');
    bloombox.telemetry.events().ping(function(latency) {
      // as soon as the ping comes through, send the initial events
      bloombox.logging.log('Telemetry service is online. Ping latency: ' +
                           '' + latency + 'ms.');
      bloombox.telemetry.sendInitialEvents();
      bloombox.telemetry.setupPageTracking();
    });
  }
};


/**
 * Acquire an instance of the Event Telemetry API, depending on the current
 * browser environment and library configuration settings.
 *
 * @param {?{beta: boolean, cache: boolean}=} apiOptions API configuration
 *        options to specify, which control how the service instance is
 *        instantiated. Pass 'beta' to force use of next-gen transport dispatch
 *        code, and 'cache' to control the service cache.
 * @return {bloombox.telemetry.EventTelemetryAPI} Instance of the Bloombox Event
 *         Telemetry API, which allows recording of arbitrary event data.
 * @export
 */
bloombox.telemetry.events = function(apiOptions) {
  if (!cachedEventsService || (apiOptions && apiOptions['cache'] === false)) {
    const cfg = bloombox.config.active();
    cachedEventsService = new bloombox.telemetry.v1beta4.EventService(cfg);
  }
  return /** @type {bloombox.telemetry.EventTelemetryAPI} */ (
    cachedEventsService);
};
