
/*
 * Copyright 2018, Bloombox, LLC. All rights reserved.
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
 * Bloombox Menu: Setup
 *
 * @fileoverview Provides routines called during page setup for use of the
 * Bloombox Menu API.
 */

/*global goog */

goog.require('bloombox.config.active');

goog.require('bloombox.logging.error');
goog.require('bloombox.logging.log');

// - Menu API
goog.provide('bloombox.menu.api');

goog.require('bloombox.menu.DEBUG');
goog.require('bloombox.menu.MENU_API_ENDPOINT');
goog.require('bloombox.menu.MenuAPI');
goog.require('bloombox.menu.VERSION');

goog.provide('bloombox.menu.setup');

goog.require('bloombox.menu.v1beta0.Service');
goog.require('bloombox.menu.v1beta1.Service');


/**
 * Setup the Bloombox Menu API. Provide your API key and an endpoint if you
 * would like to override the default (most users should not need to).
 *
 * @param {string} partner Partner code to use.
 * @param {string} location Location code to use.
 * @param {string} apikey API key to use.
 * @param {function()} callback Callback dispatched when the Menu API is ready.
 * @export
 */
bloombox.menu.setup = function(partner, location, apikey, callback) {
  if (!partner || !location) {
    bloombox.logging.error('Partner or location code is not defined.');
    return;
  }

  let config = bloombox.config.active();
  let merged = /** @type {bloombox.config.JSConfig} */ (
    Object.assign({}, config));

  bloombox.config.configure(merged);

  bloombox.logging.log('Menu is ready for use.',
    {'version': bloombox.menu.VERSION,
      'debug': bloombox.menu.DEBUG,
      'config': bloombox.config.active()});
  callback();
};


/**
 * Return an instance of the Menu API, based on current browser agent support
 * for underlying features. The resulting object, which is an instance complying
 * with the interface `bloombox.menu.MenuAPI`, can be used to fetch catalog data
 * or individual product data from Bloombox.
 *
 * @export
 * @param {{beta: boolean}=} apiConfig API configuration.
 * @return {bloombox.menu.MenuAPI} Menu API service implementation instance.
 */
bloombox.menu.api = function(apiConfig) {
  // for now, create v1beta0 adapter, always
  let config = bloombox.config.active();
  if (config.beta === true || (apiConfig && apiConfig['beta'] === true)) {
    // use the new beta gRPC engine
    return new bloombox.menu.v1beta1.Service(config);
  }
  return new bloombox.menu.v1beta0.Service(config);
};
