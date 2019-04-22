
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

// Module: Menu
goog.require('bloombox.menu.api');

// Module: Shop
goog.require('bloombox.shop.api');

// Module: Telemetry
goog.require('bloombox.telemetry.events');
goog.require('bloombox.telemetry.optout');

// Util: Error Reporting
goog.require('stackdriver.ErrorReporter');
goog.require('stackdriver.StackdriverConfig');
goog.require('stackdriver.reportError');
goog.require('stackdriver.setup');



/**
 * Global library variant.
 *
 * @define {string} VARIANT Global variant string.
 * @export
 */
bloombox.VARIANT = 'full';


/**
 * API key used to report errors in the library.
 *
 * @define {string} INTERNAL_API_KEY Internal API key.
 * @export
 */
bloombox.INTERNAL_API_KEY = 'AIzaSyAEOsmEqQP5vX8aPvrlZH0f3AN7eGubL60';


/**
 * Project to report errors to.
 *
 * @define {string} JS_PROJECT_ID Project ID.
 * @export
 */
bloombox.JS_PROJECT_ID = 'bloom-js';


/**
 * Whether to enable error reporting.
 *
 * @define {boolean} ERROR_REPORTING Error reporting.
 * @export
 */
bloombox.ERROR_REPORTING = true;


/**
 * Error reporting engine.
 *
 * @type {?stackdriver.ErrorReporter}
 * @export
 */
bloombox.ERROR_REPORTER = null;


/**
 * Setup Bloombox JS. Provide your API key and partner/location.
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback to be dispatched when
 *        the JS API is ready.
 * @param {?Object} extraConfig Extra configuration to apply.
 * @export
 */
bloombox.setup = function(partner, location, apikey, callback, extraConfig) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config, extraConfig || {}, {
      key: apikey,
      partner: partner,
      location: location
    }));

  bloombox.config.configure(merged);

  // prepare error reporting config and start it up
  let errorReporting = /** @type {stackdriver.StackdriverConfig} */ ({
    key: bloombox.INTERNAL_API_KEY,
    projectId: bloombox.JS_PROJECT_ID,
    service: 'js-sdk:' + bloombox.VARIANT,
    version: bloombox.VERSION,
    reportUncaughtExceptions: true,
    disabled: false
  });

  if (bloombox.ERROR_REPORTING) {
    try {
      // noinspection JSUnresolvedVariable
      if ((!errorReporting.key && !errorReporting.targetUrl) ||
          (!errorReporting.projectId && !errorReporting.targetUrl))
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Cannot initialize: Missing required configuration.');

      if (typeof window['StackTrace'] === 'undefined')
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('Unable to load Stackdriver.');
      bloombox.ERROR_REPORTER = new stackdriver.ErrorReporter(errorReporting);
      stackdriver.setup(bloombox.ERROR_REPORTER);
    } catch (e) {
      // skip error reporting if it cannot be setup
      if (bloombox.DEBUG)
        bloombox.logging.warn('Unable to initialize error reporting.',
          e);
    }
  }

  bloombox.logging.log('BBJS is initializing.',
    {'version': bloombox.VERSION,
     'debug': bloombox.DEBUG,
     'config': merged,
     'variant': bloombox.VARIANT});

  // setup telemetry first
  bloombox.telemetry.setup(function() {
    // setup the menu
    callback();
  });
};
