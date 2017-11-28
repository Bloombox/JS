
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
 *             analytics: bloombox.config.integrations.GoogleAnalyticsConfig},
 *             segment: bloombox.config.integrations.SegmentConfig,
 *             keen: bloombox.config.integrations.KeenIOConfig}}
 */
bloombox.config.JSIntegrationConfig;


/**
 * Reference to the active global configuration.
 *
 * @type {bloombox.config.JSConfig}
 * @private
 */
bloombox.config._ACTIVE_CONFIG_ = bloombox.config.buildDefault();


/**
 * @typedef {bloombox.config.integrations.GoogleAnalyticsConfig}
 * @package
 */
let GoogleAnalyticsConfig;


/**
 * @typedef {bloombox.config.integrations.SegmentConfig}
 * @package
 */
let SegmentConfig;


/**
 * @typedef {bloombox.config.integrations.KeenIOConfig}
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
  if (Object.isFrozen && !Object.isFrozen(config))
    Object.freeze(config);
  bloombox.config._ACTIVE_CONFIG_ = config;
};


/**
 * Resolve the active configuration object.
 *
 * @return {bloombox.config.JSConfig} Active JS config.
 * @public
 */
bloombox.config.active = function() {
  return bloombox.config._ACTIVE_CONFIG_;
};
