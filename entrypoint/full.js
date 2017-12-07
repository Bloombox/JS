
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
 * Bloombox: Full Entrypoint
 *
 * @fileoverview Provides unified setup of the entire client lib.
 */

/*global goog */

goog.provide('bloombox.VARIANT');
goog.provide('bloombox.setup');

goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

// Module: Shop
goog.require('bloombox.shop.setup');

// Module: Telemetry
goog.require('bloombox.telemetry.optout');
goog.require('bloombox.telemetry.setup');


/**
 * Global library variant.
 *
 * @define {string} VARIANT Global variant string.
 * @export
 */
bloombox.VARIANT = 'full';


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

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config, {
      key: apikey,
      partner: partner,
      location: location
    }));

  bloombox.config.configure(merged);

  bloombox.logging.log('BBJS is initializing.',
    {'version': bloombox.VERSION,
     'debug': bloombox.DEBUG,
     'config': merged,
     'variant': bloombox.VARIANT});

  // setup telemetry first
  bloombox.telemetry.setup(partner, location, apikey, function() {
    // setup the shop
    bloombox.shop.setup(partner, location, apikey, function() {
      // dispatch user callback
      callback();
    });
  });
};
