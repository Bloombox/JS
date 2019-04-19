
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
 * Bloombox JS: Config
 *
 * @fileoverview Provides initial boot code for Bloombox JS.
 */

/*global goog */

goog.provide('bloombox.config.active');
goog.provide('bloombox.config.buildDefault');
goog.provide('bloombox.config.configure');

goog.require('bloombox.DEBUG');
goog.require('bloombox.VERSION');

goog.require('bloombox.config.integration.GoogleAnalyticsConfig');
goog.require('bloombox.config.integration.KeenIOConfig');
goog.require('bloombox.config.integration.SegmentConfig');


/**
 * Specifies the structure of Bloombox JS's global configuration object.
 *
 * @public
 * @nocollapse
 * @typedef {{key: ?string,
 *            partner: ?string,
 *            location: ?string,
 *            channel: ?string,
 *            beta: ?boolean,
 *            integrations: bloombox.config.JSIntegrationConfig,
 *            endpoints: {
 *              shop: ?string,
 *              telemetry: ?string}}}
 */
bloombox.config.JSConfig;


/**
 * Specifies the structure of configuration related to integrations that plug
 * into the JS client. As of this writing, that includes Google Analytics, Keen
 * IO, and Segment.
 *
 * @public
 * @nocollapse
 * @typedef {{google: {
 *             analytics: bloombox.config.integration.GoogleAnalyticsConfig},
 *             segment: bloombox.config.integration.SegmentConfig,
 *             keen: bloombox.config.integration.KeenIOConfig}}
 */
bloombox.config.JSIntegrationConfig;


/**
 * @typedef {bloombox.config.integration.GoogleAnalyticsConfig}
 * @package
 */
let GoogleAnalyticsConfig;


/**
 * @typedef {bloombox.config.integration.SegmentConfig}
 * @package
 */
let SegmentConfig;


/**
 * @typedef {bloombox.config.integration.KeenIOConfig}
 * @package
 */
let KeenIOConfig;


/**
 * Resolve the active configuration object.
 *
 * @return {bloombox.config.JSConfig} Active JS config.
 * @public
 */
bloombox.config.buildDefault = function() {
  return {
    key: null,
    partner: null,
    location: null,
    channel: null,
    beta: false,
    endpoints: {
      shop: null,
      telemetry: null
    },
    integrations: {
      google: {
        analytics: /** @type {GoogleAnalyticsConfig} */ ({
          enabled: false,
          trackingId: null
        })
      },
      segment: /** @type {SegmentConfig} */ ({
        writeKey: null
      }),
      keen: /** @type {KeenIOConfig} */ ({
        projectId: null,
        writeKey: null
      })
    }
  };
};


/**
 * Resolve the active configuration object.
 *
 * @param {bloombox.config.JSConfig} config Replace the active JS config.
 * @public
 */
bloombox.config.configure = function(config) {
  const merged = Object.assign({},
    bloombox.config.buildDefault(), config);
  if (Object.isFrozen) Object.freeze(merged);
  bloombox.config._ACTIVE_CONFIG_ =
    /** @type {bloombox.config.JSConfig} */ (merged);
};


/**
 * Resolve the active configuration object.
 *
 * @return {bloombox.config.JSConfig} Active JS config.
 * @export
 */
bloombox.config.active = function() {
  return bloombox.config._ACTIVE_CONFIG_;
};


/**
 * Reference to the active global configuration.
 *
 * @type {bloombox.config.JSConfig}
 * @private
 */
bloombox.config._ACTIVE_CONFIG_ = bloombox.config.buildDefault();
